/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

ipc主窗口 与 子窗口通讯
***************************************************************************** */
import { app, BrowserWindow, desktopCapturer, dialog, ipcMain, IpcMainEvent, Menu, MenuItemConstructorOptions, Notification, shell } from "electron";
import * as fs from "fs";
import * as path from "path";
import { IProject } from "../common/interfaceDefine";
import { GitTools } from "../hub/gitTool";
import { getDateTime, initWork } from "../server/work";
import { getProjectByEvent, pushProjectMap } from "./projectIpc";
import * as storage from "./storage";
export function getBrowserWindow(event: IpcMainEvent): BrowserWindow {

    var bw =BrowserWindow.getAllWindows().find(w => w.webContents.getProcessId() == event.processId);
    return bw;
}
export function sendData(event: IpcMainEvent, channel: string, ...args: any[]) {
    var bw = getBrowserWindow(event);
    if (bw != undefined) {
        bw.webContents.send(channel, ...args);
    }
}

export function loadCommonIpc() {

    ipcMain.on("windowsLoaded", (event: IpcMainEvent, project: IProject) => {
       var project= getProjectByEvent(event);
       if(project!=undefined){
        var projectDaTa = storage.readProject(project);
        sendData(event, "_readProject", projectDaTa);
       }else{
        sendData(event, "_openProjects");
       }

    });
    ipcMain.on("readProject", (event: IpcMainEvent, project: IProject) => {
        var projectDaTa = storage.readProject(project);
        pushProjectMap(event.processId,project);
        sendData(event, "_readProject", projectDaTa);
    });
    ipcMain.on("readConfig", (event: IpcMainEvent, arg: any) => {
        var config = storage.readConfig();
        sendData(event, "_readConfig", config);
    })
    ipcMain.on("saveConfig", (event: IpcMainEvent, arg: any) => {
         storage.saveConfig(arg);
        
    })
    ipcMain.on("loadPlugins", (event: any, arg: any) => {
        var result = storage.loadPlugins(arg);
        sendData(event, "_loadPlugins_" + arg, result);

    });
    ipcMain.on("readExtensions", (event: IpcMainEvent, arg: any) => {
        var config = storage.readExtensions();
        sendData(event, "_readExtensions", config);
    })
    ipcMain.on("saveExtensions", (event: IpcMainEvent, arg: any) => {
         storage.saveExtensions(arg);
        
    })

    ipcMain.on("readProjects", (event: any, arg: any) => {
        var projects = storage.readProjects();
        app.clearRecentDocuments();
        projects.forEach((project:IProject) => {
            app.addRecentDocument(storage.getProjectFolderPath(project));
        });
        sendData(event, "_readProjects", projects);
    })
    ipcMain.on("saveProjects", (event: any, arg: any) => {
        storage.saveProjects(arg);

        sendData(event, "_saveProjects", arg);
    })
    ipcMain.on("newProject", (event: any, arg: any) => {
        var projects = storage.readProjects();
        projects.push(arg);
        storage.saveProjects(projects);
       // sendData(event, "_readProjects", projects);
        initWork(arg);
        var notification = new Notification({ title: "新建成功" });
        notification.show();
        var projectDaTa = storage.readProject(arg);
        pushProjectMap(event.processId,arg);
        sendData(event, "_readProject", projectDaTa);
    })
    ipcMain.on("openFolder", (event: any, arg: any) => {

        var list = dialog.showOpenDialogSync(getBrowserWindow(event), { properties: ['openDirectory'] });
        sendData(event, "_openFolder", list);
    })

    ipcMain.on("openPeojectBackpage", (event: any, arg: any) => {

        var list = dialog.showOpenDialogSync(getBrowserWindow(event), { properties: ['openFile'], filters: [{ name: "*", extensions: ["rpj"] }] });
        console.log(list);
        if (list != undefined && list.length > 0) {

            var time = fs.statSync(list[0]).mtime;

            var projects = storage.readProjects();
            var newProject: any = {};
            newProject.name = path.basename(list[0], ".rpj");
            newProject.path = list[0];
            newProject.modified = getDateTime(time);
            newProject.version = require("../../package.json").version;
            projects.push(newProject);
            storage.saveProjects(projects);
            sendData(event, "_readProjects", projects);

        } else {
            sendData(event, "_openPeojectBackpage", undefined);
        }



    })
    ipcMain.on("openPath", (event: any, arg: any) => {

        shell.openPath(path.dirname(arg));

    })
    ipcMain.on("loadHtml", (event: any, arg: any) => {
        var html = storage.loadHtml(arg);
        sendData(event, "_loadHtml", html);

    })
    ipcMain.on("webTap", (event: any, arg: any) => {

        shell.openExternal(arg);

    })

    ipcMain.on("cloneProject", (event: any, arg: any) => {

        var path = arg.path;
        var username = arg.username;
        var password = arg.password;
        //http://taoyongwen@101.43.130.123:18082/r/demo.git
        if (path.indexOf("@") > -1) {
            path = path.substring(0, path.indexOf("://") + 3) + username + ":" + password + path.substring(path.indexOf("@"));
        } else {
            path = path.replace("://", "://" + username + ":" + password + "@");
        }
        console.log(path);
        var local = storage.getProjectFolderPath(arg);
        var git = new GitTools(local);
        git.clone(path, (code: number, msg?: string) => {

            sendData(event, "_cloneProject", { code: code, msg: msg });

        });



    })
    ipcMain.on("min", (event: any, arg: any) => {
        var bw = getBrowserWindow(event);
        bw.minimize();
    });
    ipcMain.on("max", (event: any, arg: any) => {
        var bw = getBrowserWindow(event);
        if (!bw.isMaximized()) bw.maximize(); else bw.unmaximize();
    });
    ipcMain.on("close", (event: any, arg: any) => {
        app.exit();
    });

    ipcMain.on("show-context-menu", (event, menuItems: Array<MenuItemConstructorOptions>) => {

        //contextmenu

        menuItems.forEach(item => {


            item.click = () => { 
               
                event.sender.send('context-menu-command', item.id) };

        });

        const contextmenu: any = Menu.buildFromTemplate(menuItems)
        contextmenu.popup(BrowserWindow.fromWebContents(event.sender))

    })
    ipcMain.on("loadMapCatalog", (event: any, arg: any) => {

        var result = storage.loadMapCatalog();
         sendData(event, "_loadMapCatalog", result);

    });
    ipcMain.on("loadMap", (event: any, arg: any) => {
        try {
            var result = storage.loadMap(arg);
             sendData(event, "_loadMap", result);
        } catch (error) {
            console.log(error);
        }

    });
    ipcMain.on("desktopCapturer", (event: any, arg: any) => {

        desktopCapturer.getSources({ types: ['screen'] }).then(async (sources: Electron.DesktopCapturerSource[]) => {
             sendData(event, '_desktopCapturer', sources[0].id)

        });

    });
    ipcMain.on("show-notification", (event, arg) => {

        var notification = new Notification({ title: arg });
        notification.show();


    });
    ipcMain.on("readFile", (event, filePath) => {

        var text= storage.readFile(filePath);

        sendData(event,"_readFile_"+filePath,text);

    });

}