import { BrowserWindow, Menu, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppAction, AppActionType, updateDownloadState, DownloadState, updateDownloadProgress, settingsLoad, updateDownloadTitle } from './app/actions/app';
import { AppState } from './app/reducers/app';
import { createWriteStream, existsSync, writeFileSync, readFileSync } from 'fs';
const youtubedl = require('youtube-dl');

const userDataPath = app.getPath('userData');
const settingsFile = `${userDataPath}/settings.json`;

console.log(`Loading settings file: ${settingsFile}`);

if (!existsSync(settingsFile)) {
    writeFileSync(settingsFile, '{}');
    console.log(`Creating settings file: ${settingsFile}`);
}

const settings = JSON.parse(readFileSync(settingsFile).toString());

if (process.mas) {
    app.setName('Media Grabber');
}

ipcMain.on('clientReady', (event: any) => {
    event.sender.send('backendAction', settingsLoad(settings));
});

ipcMain.on('clientLog', (event: any, message: string) => {
    console.log(message);
});

ipcMain.on('clientAction', (event: any, args: [AppState, AppAction]) => {
    const state = args[0];
    const action = args[1];
    // tray.setTitle(arg);

    switch (action.type) {
        case AppActionType.Download:
        const url = state.downloads.filter(item => item.id === action.downloadId)[0]!.url;
        event.sender.send('backendAction', updateDownloadState(action.downloadId, DownloadState.InProgress));
        const video = youtubedl(
            url,
            // Optional arguments passed to youtube-dl.
            ['--format=18'],
            // Additional options can be given for calling `child_process.execFile()`.
            { cwd: __dirname });

        let size = 0;
        let fileName: string;
        // Will be called when the download starts.
        video.on('info', function (info: any) {
            console.log(info.fulltitle);
            console.log('Download started');
            console.log('filename: ' + info.filename);
            console.log('size: ' + info.size);
            size = info.size;
            fileName = info.filename;

            event.sender.send('backendAction', updateDownloadTitle(action.downloadId, info.fulltitle));

            video.pipe(createWriteStream(join(state.destination, fileName)));
        });

        let pos = 0;
        video.on('data', function data(chunk: any) {
            pos += chunk.length;
            // `size` should not be 0 here.
            if (size) {
                const percent = (pos / size * 100);
                // process.stdout.cursorTo(0);
                // process.stdout.clearLine(1);
                event.sender.send('backendAction', updateDownloadProgress(action.downloadId, percent));
            }
        });

        video.on('end', function () {
            event.sender.send('backendAction', updateDownloadState(action.downloadId, DownloadState.Complete));
        });
        case AppActionType.SetDestination:
            settings.destination = state.destination;
            writeFileSync(settingsFile, JSON.stringify(settings));
    }
});

const createWindow = () => {
    const template = [
  {
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
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
];
    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);

    const mainWindow = new BrowserWindow({
        width: 400,
        minWidth: 400,
        height: 300,
        title: app.getName()
    });

    const mainUrl = process.env.MAIN_APP_URL || join('file://', __dirname, '/dist/index.html');
    console.log(`Loading: ${mainUrl}`);

    mainWindow.loadURL(mainUrl);
    // mainWindow.webContents.openDevTools();

    app.on('window-all-closed', function () {
        app.quit();
    });
}

app.on('ready', function () {
    createWindow()
});

