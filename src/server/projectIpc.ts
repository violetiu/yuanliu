/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

ipc主窗口 与 子窗口通讯
***************************************************************************** */
import { app, dialog, ipcMain, IpcMainEvent, Notification, shell } from "electron";

import { building, exportHtml, exportReact, exportSql, exportVue, publicProject } from "../build/build";
import { getUUID, ICatalog, IProject } from "../common/interfaceDefine";
import { GitTools } from "../hub/gitTool";
import { getBrowserWindow, sendData } from "./commonIpc";
import * as storage from "./storage";

import { getNowDateTime, saveAs } from "./work";

var projectMap=new Map<string,IProject>();

export function pushProjectMap(key:number,project:IProject){
    projectMap.set(key+"",project);
}
export function getProjectByEvent(event:IpcMainEvent):IProject{
   return projectMap.get(event.processId+"");
}

export function loadProjectIpc() {


   
    ipcMain.on("saveProject", (event: any, arg: IProject) => {
         storage.saveProject(arg);
         sendData(event, "_saveProject", arg);
    })
    

    ipcMain.on("readTitleNav", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        var titleJson = storage.readTitleBar(project);
        var navJson = storage.readNav(project);
        if (navJson.items == undefined) {
            navJson.items = [];
        }

         sendData(event, "_readTitleNav", {
            title: titleJson, nav: navJson
        });
    });


    ipcMain.on("saveTitle", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        storage.saveTitleBar(arg, project);
         sendData(event, "_saveTitle", null);
        // dialog.showMessageBox(bw, { message: "保存成功" });
    });



    ipcMain.on("saveNav", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        storage.saveNavBar(arg, project);
        // dialog.showMessageBox(bw, { message: "保存成功" });
         sendData(event, "_saveNav", null);
    });

    ipcMain.on("newFile", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        storage.newFile(arg, project);
         sendData(event, "_newFile", null);
    });

    ipcMain.on("deletePage", (event: any, arg: ICatalog) => {
        console.log("deletePage_", arg);
        var logo = app.getAppPath().substring(0, app.getAppPath().length - 4) + "logo.png";

        dialog.showMessageBox(getBrowserWindow(event), {
            message: "确定删除吗？", buttons: [
                "确定", "取消"
            ], icon: logo
        }).then((res: any) => {

            if (res.response == 0) {
                var project=getProjectByEvent(event);
                storage.deletePage(arg, project);
                 sendData(event, "_deletePage", arg);
            }

        });
    });
    ipcMain.on("deleteFile", (event: any, arg: any) => {
        var logo = app.getAppPath().substring(0, app.getAppPath().length - 4) + "logo.png";

        dialog.showMessageBox(getBrowserWindow(event), {
            message: "确定删除吗？", buttons: [
                "确定", "取消"
            ], icon: logo
        }).then((res: any) => {

            if (res.response == 0) {
                var project=getProjectByEvent(event);
                storage.deleteFile(arg, project);
                 sendData(event, "_deleteFile", null);
            }

        });

    });

    ipcMain.on("copyFile", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        storage.copyFile(arg, project);
         sendData(event, "_copyFile", null);
    });

    ipcMain.on("renameFile", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        storage.renameFile(arg, project);

         sendData(event, "_renameFile", arg);
    });
    ipcMain.on("openPage", (event: any, arg: ICatalog) => {
        var project=getProjectByEvent(event);

        var page = storage.openPage(arg, project);

        if (page == undefined) {

            storage.newFile(arg, project);
            page = storage.openPage(arg, project);
        }

         sendData(event, "_openPage", page);
    });
    ipcMain.on("savePage", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        storage.savePage(arg.page, arg.path, project);
        var notification = new Notification({ title: "保存成功" });
        notification.show();
         sendData(event, "_savePage", null);
    });


    ipcMain.on("build", (event: any, arg: any) => {
        var rs = building({ name: arg }, (log: any) => {

             sendData(event, "_terminal", log);

        });
        updatePreviews.set(arg, "");


    });
    ipcMain.on("readPageCatalog", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        //文件中的目录
        var catalogs = storage.readPageCatalog(project);
        //配置中的目录



         sendData(event, "_readPageCatalog", catalogs);
    });
    ipcMain.on("export", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);

        if (arg.startsWith("sftp_")) {
            publicProject(project, arg.substring(5), bw);
            var notification = new Notification({ title: "导出成功" });
            notification.show();
             sendData(event, "_export", null);
        } else {
            var list = dialog.showOpenDialogSync(bw, { properties: ['openDirectory'] });
            if (list != undefined && list.length > 0) {
                if (arg == "html") {
                    exportHtml(list[0], project);
                } else if (arg == "vue") {
                    exportVue(list[0], project);
                } else if (arg == "react") {
                    exportReact(list[0], project);
                } else if (arg == "sql") {
                    exportSql(list[0], project);
                }

            }
            var notification = new Notification({ title: "导出成功" });
            notification.show();
             sendData(event, "_export", null);
        }


    });

    ipcMain.on("saveAs", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);

        var list = dialog.showOpenDialogSync(bw, { properties: ['openDirectory'] });
        if (list != undefined && list.length > 0)
            saveAs(list[0], project);
         sendData(event, "_saveAs", null);
    });

    ipcMain.on("save", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
       
        var path: string = storage.readProject(project).path;
        var l = path.substring(0, path.lastIndexOf("/"));
         sendData(event, "_save", null);

        saveAs(l, project);
        if (preview) {
            var rs = building(project, (log) => {
                 sendData(event, "_terminal", log);
            });
            updatePreviews.set(project.name, "");
             sendData(event, "_build", rs);
        }
    });
    ipcMain.on("readDataCatolog", (event: any, arg: any) => {
        var rs = storage.readDataCatolog();
         sendData(event, "_readDataCatolog", rs);
    });
    ipcMain.on("editDataCatolog", (event: any, arg: any) => {
        storage.editDataCatolog();

    });

    ipcMain.on("readDatabase", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
      
        var rs = storage.readDatabase(project);
         sendData(event, "_readDatabase", rs);
    });
    ipcMain.on("saveDatabase", (event: any, arg: any) => {
        var project=getProjectByEvent(event);


        storage.saveDatabase(arg, project);

    });


  
    ipcMain.on("isSave", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);

        dialog.showMessageBox(bw, { message: arg.message, buttons: ["取消", "保存", "不保存"] }).then((value) => {
             sendData(event, "_isSave", { page: arg.page, response: value.response });
        })

    });

    ipcMain.on("insertModel", (event: any, pageKey: any) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);

        if (pageKey != undefined && pageKey.length>0) {
            var list = dialog.showOpenDialogSync(bw, { properties: ['openFile'], filters: [{ name: "*", extensions: ["gltf"] }] });//filters: [{ name: "*", extensions: ["prototyping"] }] }
            var result: string[] = [];
            if (list != undefined && list.length > 0) {
                // list.forEach(element => {
                   
                // });
                var element=list[0];
                var path = storage.saveModel(element, project, pageKey);
                result.push(path)
            }
            sendData(event, "_insertModel", result);
        }


    });

    ipcMain.on("insertImage", (event: any, pageKey: any) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);

        if (pageKey == undefined || pageKey.length == 0) {
            console.log("pageKey is null");
            var list = dialog.showOpenDialogSync(bw, { properties: ['openFile'], filters: [{ name: "*", extensions: ["png", "jpg", "jpeg", "icon", "bmp"] }] });//filters: [{ name: "*", extensions: ["prototyping"] }] }

            if (list != undefined && list.length > 0) {
                var path = storage.saveImage(list[0], project, undefined);
                 sendData(event, "_insertImage", path);
            }

            return;
        } else {
            var list = dialog.showOpenDialogSync(bw, { properties: ['openFile'], filters: [{ name: "*", extensions: ["png", "jpg", "jpeg", "icon", "bmp"] }] });//filters: [{ name: "*", extensions: ["prototyping"] }] }
            var result: string[] = [];
            if (list != undefined && list.length > 0) {
                list.forEach(element => {
                    var path = storage.saveImage(element, project, pageKey);
                    result.push(path)
                });
            }
             sendData(event, "_insertImage", result);
        }


    });
    ipcMain.on("pull", (event: any, arg: IProject) => {
        var project=getProjectByEvent(event);
    
        var local = storage.getProjectFolderPath(project);
        var git = new GitTools(local);
        git.pull((code, msg) => {
             sendData(event, "_pull", msg);

        });

    });
    ipcMain.on("push", (event: any, arg: IProject) => {
        var project=getProjectByEvent(event);


        var local = storage.getProjectFolderPath(project);
        var git = new GitTools(local);
        git.add((code, msg) => {
            if (code == 0) {
                git.commit(getNowDateTime(), (codec, msgc) => {
                    if (codec == 0) {
                        git.push((codep, msgp) => {
                            if (codep == 0) {
                                 sendData(event, "_push", "提交成功");
                            } else {
                                 sendData(event, "_push", msg);
                            }
                        });
                    } else {
                         sendData(event, "_push", msgc);
                    }
                });
            } else {
                 sendData(event, "_push", msg);
            }
        });

    });



 
    ipcMain.on("readProjectRecentPage", (event, arg) => {
        var project=getProjectByEvent(event);
        var recent = storage.readProjectRecentPage(project);
         sendData(event, "_readProjectRecentPage", recent);

    });
 


    ipcMain.on("savePageJpeg", (event, arg) => {
        var project=getProjectByEvent(event);
        storage.savePageJpeg(arg.key, arg.data, project);

    });
    ipcMain.on("downloadPageJpeg", (event, arg) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);
        var list = dialog.showOpenDialogSync(bw, { properties: ['openDirectory'] });
        if(list!=undefined&&list.length>0){
            storage.downloadPageJpeg(arg.key, arg.data, project,list[0]);
        }
      

    });
    ipcMain.on("importDataExcel", (event, arg) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);
        var list = dialog.showOpenDialogSync(bw, { properties: ['openFile'], filters: [{ name: "*", extensions: ["xls", "xlsx"] }] });//filters: [{ name: "*", extensions: ["prototyping"] }] }
        if (list != undefined && list.length > 0) {
            var file = list[0];
            var database = storage.readDatabase(project);
            const xlsx = require("node-xlsx");
            var workBook = xlsx.parse(file);
            if (workBook != undefined) {

                workBook.forEach((sheet: any) => {
                    if (sheet.data.length > 1) {
                        var st: any = {
                            key: getUUID(),
                            name: sheet.name,
                            columns: [],
                            data: sheet.data
                        }
                        database.tables.push(st);
                    }
                })
                storage.saveDatabase(database, project);
                 sendData(event, "_readDatabase", database);
            }
        }
    });
    ipcMain.on("startPreview", (event: any, arg: any) => {
        var project=getProjectByEvent(event);
        var bw=getBrowserWindow(event);
        startPreview(project);
    });

}

var updatePreviews = new Map();

var preview = false;
var previewPort = 4000;
export function startPreview(project: any, port?: number) {


    if (port == undefined)
        port = previewPort;
    var path = app.getPath("home") + "/.prototyping/build/" + project.name + "/index.html";
    if (process.platform == "win32") {
        path = "file:///" + path;
    } else {
        path = "file://" + path;
    }

    console.log(path);
    shell.openExternal(path);//"http://127.0.0.1:" + port


    // if (preview) {
    //     return;
    // }

    // http.createServer((req, res) => {
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    //     res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //     var url = req.url;
    //     if (updatePreviews.has(project.name)) {
    //         res.write("0");
    //         updatePreviews.delete(project.name);
    //     }

    //     res.end();
    // }).listen(port).on("error", (err: any) => {
    //     console.log(err);
    //     startPreview(port + 1);
    // }).on("listening", () => {
    //     preview = true;
    //     previewPort = port;
    //     //  shell.openExternal("http://127.0.0.1:" + port);
    // });



}