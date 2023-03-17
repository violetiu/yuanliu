/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.
main
***************************************************************************** */
import { app, BrowserWindow, Menu, screen, shell } from "electron";
import * as path from "path";
import { IProject } from "./common/interfaceDefine";
import { loadCommonIpc } from "./server/commonIpc";
import { loadProjectIpc, pushProjectMap } from "./server/projectIpc";
import * as storage from "./server/storage";
import { touchBarEditor } from "./server/touchBar";
//单一实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit()
}
//监听第二实例
app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
  // Print out data received from the second instance.
  // Someone tried to run a second instance, we should focus our window.
  createWindow();
})
//创建窗口
function createWindow(project?: IProject) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  var config = storage.readConfig();
  var mainWindow: BrowserWindow = new BrowserWindow({
    height: height,
    width: width,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration:true
    },
    titleBarStyle: "hidden",
    darkTheme: config.theme == "dark"
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("will-navigate", (event: Electron.Event, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  if (process.platform === "darwin") {
    touchBarEditor(mainWindow);
  }
  if (project != undefined) {
    pushProjectMap(mainWindow.webContents.getProcessId(), project);
  }
}
app.on("open-file", (event, file) => {

  var work = path.join(app.getPath("home"), ".prototyping", "work");
  if (file.indexOf(work) == 0) {
    var project: IProject = { name: path.basename(file), path: file, theme: "light" };
    //project
    createWindow(project);
  } else {
    //other
    shell.openPath(file);
  }
})
loadCommonIpc();
loadProjectIpc();

const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click() {
      createWindow();
    }
  }
])

app.on("ready", () => {
  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu)
  }
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      // ipcMain.removeAllListeners();
      createWindow();
    }
  });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.