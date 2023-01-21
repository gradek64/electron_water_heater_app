const { app, BrowserWindow } = require("electron");
const { debug } = require("./debug");
const path = require("path");

debug("process.env.DEBUG set =>", process.env.DEBUG, "green");
/* full list of window options on github
https://github.com/electron/electron/blob/main/docs/api/browser-window.md
*/
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 480, //800x480 is resolution of the touch screen
    x: 0,
    y: 0,
    title: "Heater water app",
    fullscreen: process.env.DEBUG ? false : true,
    autoHideMenuBar: true,
    frame: process.env.DEBUG ? true : false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //ren dev tool only in debug mode
  if (process.env.DEBUG === "true") {
    win.webContents.openDevTools();
  }

  win.loadFile("template.html");
}

app.whenReady().then(() => {
  // allow third-party libraries
  app.allowRendererProcessReuse = false;
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
