#!/bin/bash
sed 's/\.\/app\/index/\.\/main/' ./package.json > ./dist/package.json
cp -r ./node_modules ./dist/
cp -r ./bin ./dist/
electron-packager ./dist MediaGrabber MediaGrabber --platform darwin --out build --arch=x64 --icon=icon.icns --overwrite