/*import { create } from './compiler';
const WebpackDevServer = require('webpack-dev-server');

import { join } from 'path';
import { spawn } from 'child_process';
import './install';

process.env.MAIN_APP_URL = 'http://localhost:9001/';

const appProcess = spawn('electron', ['.'], {
    stdio: 'inherit',
});

appProcess.on('close', () => {
    process.exit();
});


const devServer = new WebpackDevServer(create({ hmr: true }), {
    contentBase: join(__dirname, "dist"),
    compress: true,
    hot: true,
    watchContentBase: true,
});
devServer.listen(9001, '0.0.0.0', (_err: any) => {

});*/