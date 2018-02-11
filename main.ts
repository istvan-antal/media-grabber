import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppAction, AppActionType, updateDownloadState, DownloadState, updateDownloadProgress } from './app/actions/app';
import { AppState } from './app/reducers/app';
import { createWriteStream } from 'fs';
const youtubedl = require('youtube-dl');

if (process.mas) {
    app.setName('Media Grabber');
}

ipcMain.on('clientAction', (event: any, args: [AppState, AppAction]) => {
    const state = args[0];
    const action = args[1];
    // tray.setTitle(arg);

    switch (action.type) {
        case AppActionType.Download:
        console.log(state);
        const currentDownload = state.downloads[state.downloads.length - 1];
        event.sender.send('backendAction', updateDownloadState(currentDownload.id, DownloadState.InProgress));
        const video = youtubedl(
            currentDownload.url,
            // Optional arguments passed to youtube-dl.
            ['--format=18'],
            // Additional options can be given for calling `child_process.execFile()`.
            { cwd: __dirname });

        let size = 0;
        let fileName: string;
        // Will be called when the download starts.
        video.on('info', function (info: any) {
            console.log('Download started');
            console.log('filename: ' + info.filename);
            console.log('size: ' + info.size);
            size = info.size;
            fileName = info.filename;

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
                event.sender.send('backendAction', updateDownloadProgress(currentDownload.id, percent));
            }
        });

        video.on('end', function () {
            event.sender.send('backendAction', updateDownloadState(currentDownload.id, DownloadState.Complete));
        });
    }
});

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 400,
        minWidth: 400,
        height: 300,
        title: app.getName()
    });

    // mainWindow.loadURL(join('file://', __dirname, '/app/index.html'));
    mainWindow.loadURL(join('http://localhost:9000/'));

    app.on('window-all-closed', function () {
        app.quit();
    });
}

app.on('ready', function () {
    createWindow()
})

