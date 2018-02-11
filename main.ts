import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppAction, AppActionType } from './app/actions/app';
import { AppState } from './app/reducers/app';

if (process.mas) {
    app.setName('Media Grabber');
}

ipcMain.on('clientAction', (event: any, args: [AppState, AppAction]) => {
    const state = args[0];
    const action = args[1];
    console.log(action.type);
    // tray.setTitle(arg);
});

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 300,
        minWidth: 300,
        height: 200,
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

