import { copyFileSync, existsSync, mkdirSync, createWriteStream, unlink } from 'fs';
import { get } from 'https';
import { execFileSync } from 'child_process';
import { basename } from 'path';
import { platform } from 'os';

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

        const ext = (arch === 'win64') ? '.exe' : '';
        copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffmpeg${ext}`, `./bin/${arch}/ffmpeg${ext}`);
        copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffplay${ext}`, `./bin/${arch}/ffplay${ext}`);
        copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffprobe${ext}`, `./bin/${arch}/ffprobe${ext}`);
        // copyFileSync(`./bin/${arch}/${basename(binaries[arch], '.zip')}/bin/ffserver${ext}`, `./bin/${arch}/ffserver${ext}`);
    });
}