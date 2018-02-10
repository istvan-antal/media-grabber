const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
import { resolve, join } from 'path';
import { spawn } from 'child_process';

spawn('electron', ['.'], {
    stdio: 'inherit',
});

const compiler = webpack({
    entry: './app/index.tsx',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            // { test: /\.css$/, use: 'css-loader' },
            { test: /\.tsx?$/, use: 'ts-loader' }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'app/index.html'
    })],
});
const devServer = new WebpackDevServer(compiler, {
    contentBase: join(__dirname, "dist"),
    compress: true,
});
devServer.listen(9000, '0.0.0.0', (err: any) => {

});
//         // Launch WebpackDevServer.
//         
//             if (err) {
//                 return console.log(err);
//             }
//             if (isInteractive) {
//                 clearConsole();
//             }
//             console.log(chalk.cyan('Starting the development server...\n'));
//             openBrowser(urls.localUrlForBrowser);
//         });