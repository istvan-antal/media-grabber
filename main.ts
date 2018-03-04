import { BrowserWindow, Menu, app, ipcMain, dialog } from 'electron';
import { join, dirname } from 'path';
import { AppAction, AppActionType, updateDownloadState, DownloadState, updateDownloadProgress, settingsLoad, updateDownloadTitle, DownloadType, setDestination } from './app/actions/app';
import { AppState } from './app/reducers/app';
import { createWriteStream, existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { platform } from 'os';
import { URL } from 'url';
import { execFile } from 'child_process';
const youtubedl = require('youtube-dl');
const arch = (platform() === 'win32') ? 'win64' : 'macos64';

process.env.PATH += `:${__dirname}/bin/${arch}`;

const userDataPath = app.getPath('userData');

if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath);
}

const settingsFile = `${userDataPath}/settings.json`;

console.log(`Loading settings file: ${settingsFile}`);

if (!existsSync(settingsFile)) {
    writeFileSync(settingsFile, '{}');
    console.log(`Creating settings file: ${settingsFile}`);
}

const settings = JSON.parse(readFileSync(settingsFile).toString());

app.setName('Media Grabber');

const createWindow = () => {
    const template = [{
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ],
    }];
    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);

    const mainWindow = new BrowserWindow({
        width: 500,
        minWidth: 500,
        height: 300,
        title: app.getName()
    });

    const mainUrl = process.env.MAIN_APP_URL || join('file://', __dirname, '/dist/index.html');
    console.log(`Loading: ${mainUrl}`);

    ipcMain.on('clientReady', (event: any) => {
        event.sender.send('backendAction', settingsLoad(settings));
    });

    /*
    ipcMain.on('clientLog', (event: any, message: string) => {
        console.log(message);
    });
    */

    const updateProgress = (state: AppState) => {
        const items = state.downloads.filter(item => item.state !== DownloadState.Complete);
        
        if (!items.length) {
            mainWindow.setProgressBar(-1);
            return;
        }

        mainWindow.setProgressBar(
            items.map(item => item.progress).reduce((a, b) => a + b, 0) / (items.length * 100)
        );
    };

    ipcMain.on('clientAction', (event: any, args: [AppState, AppAction]) => {
        const state = args[0];
        const action = args[1];
        // tray.setTitle(arg);
        updateProgress(state);

        switch (action.type) {
            case AppActionType.BrowseForDestination:
                dialog.showOpenDialog(mainWindow, { properties: ['openDirectory', 'createDirectory'] }, paths => {
                    event.sender.send('backendAction', setDestination(paths[0]));
                });
                break;
            case AppActionType.Download:
                const currentDownload = state.downloads.filter(item => item.id === action.downloadId)[0]!;
                const url = new URL(currentDownload.url);
                event.sender.send('backendAction', updateDownloadState(action.downloadId, DownloadState.InProgress));
                updateProgress(state);
                if (currentDownload.type === DownloadType.Music) {
                    if (url)
                    youtubedl.exec(
                        currentDownload.url,
                        // Optional arguments passed to youtube-dl.
                        ['-x', '--add-metadata', '--embed-thumbnail', '--audio-format', 'mp3'],
                        // Additional options can be given for calling `child_process.execFile()`.
                        { cwd: state.destination, env: process.env }, (err: any, output: any) => {
                            console.log(err, output);
                            event.sender.send('backendAction', updateDownloadProgress(action.downloadId, 100));
                            event.sender.send('backendAction', updateDownloadState(action.downloadId, DownloadState.Complete));
                        });
                    return;
                }

                if (['bbc.co.uk', 'www.bbc.co.uk'].indexOf(url.hostname) !== -1) {
                    const proc = execFile('get_iplayer', [currentDownload.url], { cwd: state.destination });
                    proc.on('close', (err) => {
                        console.error(err);
                        event.sender.send('backendAction', updateDownloadProgress(action.downloadId, 100));
                        event.sender.send('backendAction', updateDownloadState(action.downloadId, DownloadState.Complete));
                    });
                    return;
                }

                const media = youtubedl(
                    currentDownload.url,
                    // Optional arguments passed to youtube-dl.
                    [],//['--format=18'],
                    // Additional options can be given for calling `child_process.execFile()`.
                    { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });

                let size = 0;
                let fileName: string;
                // Will be called when the download starts.
                media.on('info', function (info: any) {
                    console.log(info.fulltitle);
                    console.log('Download started');
                    console.log('filename: ' + info.filename);
                    console.log('size: ' + info.size);
                    size = info.size;
                    fileName = info.filename;

                    event.sender.send('backendAction', updateDownloadTitle(action.downloadId, info.fulltitle));

                    media.pipe(createWriteStream(join(state.destination, fileName)));
                });

                let pos = 0;
                media.on('data', function data(chunk: any) {
                    pos += chunk.length;
                    // `size` should not be 0 here.
                    if (size) {
                        const percent = (pos / size * 100);
                        // process.stdout.cursorTo(0);
                        // process.stdout.clearLine(1);
                        event.sender.send('backendAction', updateDownloadProgress(action.downloadId, percent));
                    }
                });

                media.on('end', function () {
                    event.sender.send('backendAction', updateDownloadState(action.downloadId, DownloadState.Complete));
                });
            case AppActionType.SetDestination:
                settings.destination = state.destination;
                writeFileSync(settingsFile, JSON.stringify(settings));
        }
    });

    mainWindow.loadURL(mainUrl);
    // mainWindow.webContents.openDevTools();

    app.on('window-all-closed', function () {
        app.quit();
    });
}

app.on('ready', function () {
    createWindow()
});

