const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
import { resolve, join } from 'path';
import { spawn } from 'child_process';

const appProcess = spawn('electron', ['.'], {
    stdio: 'inherit',
});

appProcess.on('close', () => {
    process.exit();
});

const compiler = webpack({
    entry: [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        './app/index.tsx',
    ],
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.tsx?$/, use: 'ts-loader' }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    externals: [
        (function () {
            var IGNORES = [
                'electron'
            ];
            return function (context: any, request: any, callback: any) {
                if (IGNORES.indexOf(request) >= 0) {
                    return callback(null, "require('" + request + "')");
                }
                return callback();
            };
        })()
    ]
});
const devServer = new WebpackDevServer(compiler, {
    contentBase: join(__dirname, "dist"),
    compress: true,
    hot: true,
    watchContentBase: true,
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