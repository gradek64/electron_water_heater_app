Instruction

```
npm start

//or

npm run start:DEBUG
```

App uses 'rpio' node library to set rasberry pi GPIO pins

```
npm i rpio -S
```

if any of the library is using different node version
U need to intasll 'electon-rebuild' and run the script
for the conficted library:

```
 npm i electron-rebuild -D

 //and run

 "rebuild": "electron-rebuild -f -w 'libraryName'",

```

Building the final linux AppImage

Electron provides electron-builder package that builds
the format you specify in package.json in a build section
There are some options allowing us to customise the look of
app icon as:
