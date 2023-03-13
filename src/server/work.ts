/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

操作工作目录 
***************************************************************************** */
import { pie } from "d3";
import { app, screen } from "electron";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getUUID, IDatabase, IPage, IProject, ITitle } from "../common/interfaceDefine";
import * as storage from "./storage";
const admZip = require("adm-zip");
/**
 * 另存为
 * @param folder 
 * @param wProject 
 */
export function saveAs(folder: string, wProject: any) {

    var project = storage.readProject(wProject);

    var zipPath = path.join(folder, project.name + ".rpj");
    var work = path.join(app.getPath("home"), ".prototyping", "work");
    var zip = new admZip();

    // fs.readdirSync(work).forEach(function (file) {
    //     var path=work+"/"+file;
    //     if(fs.statSync(path).isDirectory()){
    //         zip.addLocalFolder(path);
    //     }else{
    //         zip.addLocalFile(path);
    //     }


    // });

    console.log(zipPath)
    zip.addLocalFolder(work);
    // zip.writeZipPromise(zipPath);
    zip.writeZip(zipPath);

}
var workPath: any;
/**
 * 初始化项目工作目录
 * @param project 
 */
export function initWork(project: IProject) {

    var projectFile = project.path;
    var pPath = storage.getProjectFolderPath(project);
    if (!fs.existsSync(projectFile)) {
        if(fs.existsSync(pPath)){
            return;
        }
        console.log("initWork null");
        //新建
        workPath = path.join(app.getPath("home"), ".prototyping", "work");
        if (!fs.existsSync(workPath)) {
            fs.mkdirSync(workPath);
        }
        workPath = path.join(app.getPath("home"), ".prototyping", "work", project.name);
        if (!fs.existsSync(workPath)) {
            fs.mkdirSync(workPath);
        }


        //project
        var projectPath = path.join(workPath, "project.json");
        var projectJson: IProject = {
            name: project.name,
            path: project.path,
            type: project.type,
            version: project.version,
            createDate: getNowDateTime(),
            updateDate: getNowDateTime(),
            author: os.userInfo().username,
            description: "这个是一个新建的项目",
            cover: "cover.png",
            catalogs: [
                { key: "index", name: "index", dir: "/", path: "/index.json", sort: 0 }
            ],
            launch: "",
            index:"",
            theme:storage.readConfig().theme,
            themeColor: "#0078d4",
            lightColor:"rgba(0,120,212,0.4)"
        };
        fs.writeFileSync(projectPath, JSON.stringify(projectJson));
        //cover
        var imagesPath = path.join(workPath, "images");
        if (!fs.existsSync(imagesPath)) {
            fs.mkdirSync(imagesPath);
        }
        fs.copyFileSync(path.join(storage.getAppFolderPath(), "logo.png"), path.join(imagesPath, "cover.png"));
        //database

        //nav
        var dataPath = path.join(workPath, "database.json");
        var dataJson: IDatabase = {
            key: getUUID(),
            name: project.name,
            tables: []
        };
        fs.writeFileSync(dataPath, JSON.stringify(dataJson));

        //nav
        var navPath = path.join(workPath, "nav.json");
        var navJson = {
            display: true,
            background: "rgba(175,175,175,0.3)",
            items: [{ name: "index", path: "index", icon: "bi bi-house", key: "index" }]
        };
        fs.writeFileSync(navPath, JSON.stringify(navJson));
        //title
        var titlePath = path.join(workPath, "title.json");
        var titleJson: ITitle = {
            display: true,
            background: "rgba(175,175,175,0.3)",

        };
        fs.writeFileSync(titlePath, JSON.stringify(titleJson));

        //page
        var pagesPath = path.join(workPath, "pages");
        if (!fs.existsSync(pagesPath)) {
            fs.mkdirSync(pagesPath);
        }
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        var pagePath = path.join(pagesPath, "index.json");
        var pageJson: IPage = {
            type: "page",
            key: "index",
            width: width,
            height: height,
        
            children: [],
            modified: getNowDateTime(),
            name: "index",
            path: "/index.json",
            canvases: [], dialogs: [], info: "", blueLinks: [], blues: [], guides: []

        };
        fs.writeFileSync(pagePath, JSON.stringify(pageJson));

    } else {
        console.log("initWork exits");
        //如果已存在工作空间，对比 最新的时间
        if (fs.existsSync(pPath)) {
            var pj = path.join(pPath, "project.json");
            if (fs.existsSync(pj)) {
                fs.stat(projectFile, (erro, stats) => {
                    fs.stat(pj, (erro1, stats1) => {
                        if (stats.mtime < stats1.mtime) {
                            console.log("not lastest version");
                            return;
                        } else {
                            //打开
                            // var zip = new admZip(projectFile);
                            // zip.extractAllTo(path.join(app.getPath("home"), ".prototyping", "work"), true);
                        }
                    })
                })

            } else {
                //打开
                // var zip = new admZip(projectFile);
                // zip.extractAllTo(path.join(app.getPath("home"), ".prototyping", "work"), true);
            }

        } else {
            //打开
            // var zip = new admZip(projectFile);
            // zip.extractAllTo(path.join(app.getPath("home"), ".prototyping", "work"), true);
        }

    }
}
export function getNowDateTime(): string {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var now = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return now;

}
export function getDateTime(date: Date): string {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var now = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return now;

}