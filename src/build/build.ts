/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

界面构建工具，打包成可演示的html文件
***************************************************************************** */
import { app, BrowserView, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { sftpUploadDir } from "../common/sftpTool";
import { IProject, ITable } from "../common/interfaceDefine";
import * as storage from "../server/storage";
import { emptyFolder } from "../server/storage";
import * as react from "./react";
import { zhToEn } from "../common/dict";
import { Notification } from "electron/main";



export function packge(dist: string,terminal:(log:any)=>void) {

    var config = {
        entry:path.join(dist ,'js','main.js'),
        output: {
            path:path.join(dist ,'js'),
            filename: 'index.js',
        },
        mode: "production",
    };
    const pack = require("webpack");
    pack(config, (err: any, stats: any) => {
        if (err || stats.hasErrors) {
            console.log("Error", err,);
            if(err!=null){
                terminal("打包失败");
            }
            if (stats != undefined) {
                if(terminal)
              
                terminal(stats.toString());
                console.log(stats.toString());
            }
        } else {
            console.log("Success");
            if(terminal)
                terminal("打包成功");
        }


    });

}
export function exportVue(folder: string, wProject: IProject) {

}
export function exportReact(folder: string, wProject: IProject) {
    react.exportReact(folder, wProject);
}
/**
 * 导出sql
 * @param folder 
 * @param wProject 
 */
export function exportSql(folder: string, wProject: IProject) {


    //database
    var dbPath=path.join(storage.getProjectFolderPath(wProject),"database.json");
    var dbJson=JSON.parse(fs.readFileSync(dbPath).toString());
    //
    var dbName=dbJson.name;
    var rs="create databse `"+dbName+"`;\n";
    dbJson.tables.forEach((table:ITable,index:number)=>{

        var tbName=zhToEn(table.name);
        if(tbName==undefined){
            tbName="Tb_"+index;
        }
        var tbData=table.data;
        var colData=tbData[0];
        var rowData=tbData[1];
        var sql="CREATE TABLE `"+tbName+"` (\n";
        colData.forEach((col:any,index:number)=>{
            var val=rowData[index];
          
            var name=zhToEn(col);
            if(name==undefined){
                name="col_"+index;
            }
            if(/[0-9]+/.test(val)){
                //int
                sql+="`"+name+"` int DEFAULT NULL COMMENT '"+col+"',\n";
            }else if(/[0-9]+\.[0-9]+/.test(val)){
                //double
                sql+="`"+name+"` double DEFAULT NULL COMMENT '"+col+"',\n";
            }else if(/true/.test(val)||/false/.test(val)){
                //boolean
                sql+="`"+name+"` boolean DEFAULT NULL COMMENT '"+col+"',\n";
            }else {
                sql+="`"+name+"` varchar(255) DEFAULT NULL COMMENT '"+col+"',\n";
            }

        })
        sql+=") COMMENT='"+table.name+"';\n";
        rs+=sql;
    })
    fs.writeFileSync(path.join(folder,"database.sql"),rs);
}

/**
 * 导出项目页面
 * @param folder 
 * @param wProject 
 */
export function exportHtml(folder: string, wProject: IProject) {
    const admZip = require("adm-zip");
    var dist = path.join(app.getPath("home"), ".prototyping", "build", wProject.name);

    ["blues.js", "components.js", "database.js", "main.js", "navData.js",
        "projectData.js", "component.js", "dataCatalog.js",
        "map.js", "pagesData.js", "titleData.js"].forEach(js => {
            var file = path.join(dist, "js", js);
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }


        });

    var zip = new admZip();
    zip.addLocalFolder(dist);
    zip.writeZipPromise(path.join(folder, wProject.name + ".zip"));
}

export function publicProject( wProject: IProject,arg:string,bw:BrowserWindow) {

    var dist = path.join(app.getPath("home"), ".prototyping", "build", wProject.name);
    ["blues.js", "components.js", "database.js", "main.js", "navData.js",
        "projectData.js", "component.js", "dataCatalog.js",
        "map.js", "pagesData.js", "titleData.js"].forEach(js => {
            var file = path.join(dist, "js", js);
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
        var argJ=JSON.parse(arg);
        var config={
            host:argJ.host,
            port:argJ.port,
            username:argJ.username,
            password:argJ.password,
         
        };
        sftpUploadDir(dist,path.join(argJ.folder,wProject.name),config,(log)=>{

            bw.webContents.send("_sftp", log);
        });
}
/**
 * 构建
 * @param wProject 
 * @returns 
 */
export function building(wProject: any,terminal:(log:any)=>void): boolean {
    try {
        console.log("building", wProject.name);
        terminal("开始构建： "+wProject.name);
        var client = storage.getAppFolderPath("client");
        var dist = path.join(app.getPath("home"), ".prototyping", "build", wProject.name);
        if (fs.existsSync(dist)) {
            emptyFolder(dist);
        }
        fs.mkdirSync(dist);
        terminal("复制客户端文件");
        copyDir(client, dist,terminal);
        //复制modules：echarts,FileSaver,xlsx.mini.min.js
        terminal("复制modules文件");
        copyModules(dist);
        //
        terminal("复制字体文件");
        copyBootstrap(dist);
        //构建js文件
        terminal("创建JS");
        buildData(wProject,terminal);
        buildMaps(wProject);
        //webpack index.js
        terminal("打包项目");
        packge(dist,terminal);
        terminal("构建完成");
        var notification = new Notification({title:"构建完成"});
        notification.show();
        return true;
    } catch (e) {
        console.log(e);
        terminal(e);
    }
    return false;
}
function copyBootstrap(dist:string){
    var css=path.join(dist,"css");
    var font=path.join(css,"fonts");
    var modules= storage.getAppFolderPath("node_modules");
    var icons=path.join(modules,"bootstrap-icons/font/bootstrap-icons.css");
    var font1=path.join(modules,"bootstrap-icons/font/fonts/bootstrap-icons.woff");
    var font2=path.join(modules,"bootstrap-icons/font/fonts/bootstrap-icons.woff2");
   
    fs.copyFileSync(icons,path.join(css,"bootstrap-icons.css"));

    fs.copyFileSync(font1,path.join(font,"bootstrap-icons.woff"));

    fs.copyFileSync(font2,path.join(font,"bootstrap-icons.woff2"));

}
/**
 * 复制modules：echarts,FileSaver,xlsx.mini.min.js
 */
function copyModules(dist:string){

    var js=path.join(dist,"js");

    var modules= storage.getAppFolderPath("node_modules");
    var echarts=path.join(modules,"echarts/dist/echarts.js");
    var fileSaver=path.join(modules,"file-saver/dist/FileSaver.js");
    var xlsx=path.join(modules,"xlsx/dist/xlsx.full.min.js");
    var dom=path.join(modules,"dom-to-image/dist/dom-to-image.min.js");

    fs.copyFileSync(echarts,path.join(js,"echarts.js"));
    fs.copyFileSync(fileSaver,path.join(js,"FileSaver.js"));
    fs.copyFileSync(xlsx,path.join(js,"xlsx.full.min.js"));
    fs.copyFileSync(dom,path.join(js,"dom-to-image.min.js"));


}

/**
 * copy dir
 */
function copyDir(src: string, dest: string,terminal?:(log:any)=>void) {
    var files = [];
    if (fs.existsSync(src)) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        files = fs.readdirSync(src);
        files.forEach(function (file, index) {
            var curPath = path.join(src, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                copyDir(curPath, path.join(dest, file));
            } else { // delete file
                if(terminal!=undefined){
                    terminal("copy "+curPath+" to "+path.join(dest, file))
                }
                fs.copyFileSync(curPath, path.join(dest, file));
            }
        });
    }
}
/**
 * 构建组件过程
 * @param wProject 
 */
function buildComponents(wProject: IProject,terminal?:(log:any)=>void) {
    if(terminal){
        terminal("构建组件");
    }
    var rs = "import { loadChart,cal_catolog,cal_data,updateComponent } from './component.js';"+
    "import { renderPageByCatalogKey } from './main.js';"+
    "export default [";
    storage.loadPlugins("component").forEach(cpt => {

        var cPath = path.join(storage.getAppFolderPath("plugins"), "component", cpt.replace("../plugins/component/", "")+".js");

        var file = fs.readFileSync(cPath).toString();
        //console.log(text);
        if(terminal){
            terminal(cPath);
        }
        var start = file.indexOf("var component = ") + "var component = ".length;
        var end = file.indexOf("function load()") - 2;
        var code = file.substring(start, end);
        code = code.replace(/\(0, chart_1\.loadChart\)/g, "loadChart");
        //    console.log(code);
        code = code.replace(/\(0, components_1\.updateComponent\)/g, "updateComponent");

        code = code.replace(/\(0, interfaceDefine_1\.renderPageByCatalogKey\)/g, "renderPageByCatalogKey");

        if (code.endsWith(";")) {
            code = code.substring(0, code.length - 1);
        }
        rs += code + ",";
    });
    rs += "]";
    fs.writeFileSync(path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "js", "components.js"), rs);
}
/**
 * 构建数据
 * @param wProject 
 */
function buildData(wProject: any,terminal?:(log:any)=>void) {
    var projectData = "";
    var project = storage.readProject(wProject);
    //project
    projectData += "export default " + JSON.stringify(project) + ";\n";
    var jsPath = path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "js");
    fs.writeFileSync(path.join(jsPath, "projectData.js"), projectData);
    if(terminal){
        terminal("projectData.js");
    }


    //title
    var titleData = "";
    var title = storage.readTitleBar(wProject);
    titleData += "export default " + JSON.stringify(title) + ";\n";
    fs.writeFileSync(path.join(jsPath, "titleData.js"), titleData);
    if(terminal){
        terminal("titleData.js");
    }
    //nav
    var navData = "";
    var nav = storage.readNav(wProject);
    navData += "export default " + JSON.stringify(nav) + ";\n";
    fs.writeFileSync(path.join(jsPath, "navData.js"), navData);
    if(terminal){
        terminal("navData.js");
    }
    var pagesData = "";
    //page
    var catalogs = storage.readPageCatalog(wProject);
    if (catalogs != undefined) {
        //删除打包后非必要数据，较小整体的大小，

        pagesData += "export default " + JSON.stringify(catalogs) + ";\n";
    }
    fs.writeFileSync(path.join(jsPath, "pagesData.js"), pagesData);
    if(terminal){
        terminal("pagesData.js");
    }
    //data catalog
    var catalogText = "export default ";
    var catalogJson = path.join(app.getPath("home"), ".prototyping", "dataCatolog.json");
    catalogText += fs.readFileSync(catalogJson).toString();
    fs.writeFileSync(path.join(jsPath, "dataCatalog.js"), catalogText);
    if(terminal){
        terminal("dataCatalog.js");
    }
    //database
    var databaseText = "export default ";
    var databaseJson = storage.readDatabase(wProject);
    databaseText += JSON.stringify(databaseJson, null, 2);
    fs.writeFileSync(path.join(jsPath, "database.js"), databaseText);
    if(terminal){
        terminal("database.js");
    }
    //components
    buildComponents(wProject,terminal);
    //
    buildPluginsBackground(wProject);
    //
    buildPluginsShape(wProject);

    //css
    var cssPath = path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "css");
    fs.copyFileSync(path.join(storage.getAppFolderPath(), "index.css"), path.join(cssPath, "index.css"));
    fs.copyFileSync(path.join(storage.getAppFolderPath(), "theme.css"), path.join(cssPath, "theme.css"));
    if(terminal){
        terminal("css");
    }
    //image
    var imageFolder = storage.getProjectFolderPath(wProject, "images");
    var imageDist = path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "images");
    copyDir(imageFolder, imageDist);

    //bgimage 内置图片
   // storage.read
 

    if(terminal){
        terminal("image");
    }
    if(terminal){
        terminal("buildData success");
    }
    console.log("buildData success");
}
function buildMaps(wProject:IProject){
    var rs="export default {";
    storage.loadMapCatalog().forEach(item=>{

       var map=  storage.loadMap(item);

       rs+=item.replace(".json","")+":"+JSON.stringify(map)+",";

    })

    rs+="}";

    fs.writeFileSync(path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "js", "map.js"), rs);
}
function buildPluginsBackground(wProject:IProject){
    var rs="export default [";
    storage.loadPlugins("background").forEach(item=>{


        var cPath = path.join(storage.getAppFolderPath("plugins"), "background", item.replace("../plugins/background/", "")+".js");

        var file = fs.readFileSync(cPath).toString();

        var start = file.indexOf("var background = ") + "var background = ".length;
        var end = file.indexOf("exports[\"default\"] = background;") - 2;
        var code = file.substring(start, end);

        rs+=code+",";


    })
    rs+="]";
    fs.writeFileSync(path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "js", "backgrounds.js"), rs);

}
function buildPluginsShape(wProject:IProject){
    var rs="export default [";
    storage.loadPlugins("shape").forEach(item=>{


        var cPath = path.join(storage.getAppFolderPath("plugins"), "shape", item.replace("../plugins/shape/", "")+".js");

        var file = fs.readFileSync(cPath).toString();

        var start = file.indexOf("var shape = ") + "var shape = ".length;
        var end = file.indexOf("exports[\"default\"] = shape;") - 2;
        var code = file.substring(start, end);

        rs+=code+",";


    })
    rs+="]";
    fs.writeFileSync(path.join(app.getPath("home"), ".prototyping", "build", wProject.name, "js", "shapes.js"), rs);

}
