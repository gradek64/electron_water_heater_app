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
