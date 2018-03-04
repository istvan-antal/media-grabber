import { copyFileSync, existsSync, mkdirSync, createWriteStream, unlink } from 'fs';
import { get } from 'https';
import { execFileSync } from 'child_process';
import { basename } from 'path';
import { platform } from 'os';

const rimraf = require('rimraf');

const download = (url: string, destination: string) => new Promise((resolve, reject) => {
    const file = createWriteStream(destination);
    get(url, (response) => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            resolve();
        });
    }).on('error', function (err) { // Handle errors
        unlink(destination, () => {
        }); // Delete the file async. (But we don't check the result)
        reject(err);
    });
});

const binaries: {
    [key: string]: string;
} = {
    macos64: 'https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-3.4.1-macos64-static.zip',
    win64: 'https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-3.4.1-win64-static.zip',
};

if (!existsSync('./bin')) {
    mkdirSync('./bin');
}

const arch = (platform() === 'win32') ? 'win64' : 'macos64';

if (!existsSync(`./bin/${arch}`)) {
    mkdirSync(`./bin/${arch}`);
    download(binaries[arch], `./bin/${arch}/ffmpeg.zip`).then(() => {
        execFileSync('unzip', ['ffmpeg.zip'], {
            cwd: `./bin/${arch}`,
            stdio: 'inherit',
        });
        unlink(`./bin/${arch}/ffmpeg.zip`, () => {
        });

        const ext = (arch === 'win64') ? '.exe' : '';
        copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffmpeg${ext}`, `./bin/${arch}/ffmpeg${ext}`);
        // copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffplay${ext}`, `./bin/${arch}/ffplay${ext}`);
        copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffprobe${ext}`, `./bin/${arch}/ffprobe${ext}`);
        rimraf(`./bin/${arch}/${basename(binaries[arch], '.zip')}`, () => {
        });
        // copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffserver${ext}`, `./bin/${arch}/ffserver${ext}`);
    });
    
    (async () => {
        //https://downloads.sourceforge.net/project/atomicparsley/atomicparsley/AtomicParsley%20v0.9.0/AtomicParsley-MacOSX-0.9.0.zip
        await download('https://netix.dl.sourceforge.net/project/atomicparsley/atomicparsley/AtomicParsley%20v0.9.0/AtomicParsley-MacOSX-0.9.0.zip', `./bin/${arch}/AtomicParsley-MacOSX-0.9.0.zip`);
        execFileSync('unzip', ['AtomicParsley-MacOSX-0.9.0.zip'], {
            cwd: `./bin/${arch}`,
            stdio: 'inherit',
        });
        copyFileSync(`./bin/${arch}/AtomicParsley-MacOSX-0.9.0/AtomicParsley`, `./bin/${arch}/AtomicParsley`);
        unlink(`./bin/${arch}/AtomicParsley-MacOSX-0.9.0.zip`, () => {
        });
        rimraf(`./bin/${arch}/AtomicParsley-MacOSX-0.9.0`, () => {
        });
        rimraf(`./bin/${arch}/__MACOSX`, () => {
        });

        //https://github.com/get-iplayer/get_iplayer/archive/v3.12.zip
        await download('https://codeload.github.com/get-iplayer/get_iplayer/zip/v3.12', `./bin/${arch}/get-iplayer.zip`);
        execFileSync('unzip', ['get-iplayer.zip'], {
            cwd: `./bin/${arch}`,
            stdio: 'inherit',
        });
        copyFileSync(`./bin/${arch}/get_iplayer-3.12/get_iplayer`, `./bin/${arch}/get_iplayer`);
        unlink(`./bin/${arch}/get-iplayer.zip`, () => {
        });
        rimraf(`./bin/${arch}/get_iplayer-3.12`, () => {
        });
    })();
}