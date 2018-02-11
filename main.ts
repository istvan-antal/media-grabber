import { BrowserWindow, app } from 'electron';
import { join } from 'path';

if (process.mas) {
    app.setName('Media Grabber');
}

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

