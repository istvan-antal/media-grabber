import { create } from './compiler';
const WebpackDevServer = require('webpack-dev-server');

import { join } from 'path';
import { spawn } from 'child_process';

process.env.MAIN_APP_URL = 'http://localhost:9000/';

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
devServer.listen(9000, '0.0.0.0', (err: any) => {

});