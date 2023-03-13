import { renderPageBody } from "../render/workbench";
import { IComponent, IPage, IProject } from "../common/interfaceDefine";
import * as path from "path";
import * as fs from "fs";
import * as storage from "../server/storage";
import { app } from "electron";
 
export function exportReact(saveFoder:string,project:IProject){

    //react app
    var reactAppPath= creatReactApp(project);

    //component
    var componentPath=path.join(reactAppPath,"src","component")
    exportComponents(componentPath);


    //page
   var routePages= exportPages(reactAppPath,project);

   //route





}

function creatReactApp(project:IProject){
    var reactPath=path.join(app.getPath("home") ,".prototyping","react");
    if(!fs.existsSync(reactPath)){
        fs.mkdirSync(reactPath);
    }
    var appPath=path.join(reactPath,project.name);
    if(!fs.existsSync(appPath)){
        fs.mkdirSync(appPath)
    }else{
        storage.emptyFolder(appPath);
        fs.mkdirSync(appPath)
    }
    var srcPath=path.join(appPath,"src");
    fs.mkdirSync(srcPath);
    var viewsPath=path.join(appPath,"views");
    fs.mkdirSync(viewsPath);
    var componentPath=path.join(srcPath,"component");
    fs.mkdirSync(componentPath);
    var publicPath=path.join(appPath,"public");
    fs.mkdirSync(publicPath);

    //创建


    return appPath;
}

function exportPages(reactAppPath:string,project:IProject):string[]{

    var routePages:string[]=[];

    var folder=path.join(reactAppPath,"src","component");
    var pages= storage.readPageCatalog(project);
    pages.forEach(page=>{
        exportPage(page,folder);
        routePages.push(page.key);
    })
 

    return routePages;
    
    

}

function exportPage(page:IPage,folder:string){
    var componentTypes:string[]=[];
 
    var code="##"+page.name+
    "function "+page.key+"(){\n";
    renderComponents(page.children,code,componentTypes)
    code+="</"+page.key+">";
    var importCode="import React from 'react';\n"+
    "import { Text } from './component/components';\n";
    var componentImport="";
    componentTypes.forEach(cpm=>{
        componentImport+=cpm+",";
    });
    var tsx=importCode+"\n"+code;
    var file=path.join(folder,page.key+".tsx");
    fs.writeFile(file,tsx,()=>{
            console.log("component==>"+file);
    });
    

}
function renderComponents(components:IComponent[],code:string,componentTypes:string[]){
    components.forEach((component,index)=>{
        renderComponent(component,code,componentTypes);
    })

}
function renderComponent(component:IComponent,code:string,componentTypes:string[]){
    if(componentTypes.indexOf(component.type)<0){
        componentTypes.push(component.type);
    }

     code+="<"+component.type+">\n";
    if(component.children!=undefined){
        renderComponents(component.children,code,componentTypes);
    } 
    code+="</"+component.type+">\n";
}

function exportComponents(folder:string){
    var code="";
    
    storage.loadPlugins("component").forEach(item=>{
       // var component: IComponent = require("../plugins/component/"+item).default();
        var component=path.join(storage.getAppFolderPath("src"),"plugins","component",item+".ts");
        exportComponent(component,folder);
       // code+="import { "+component.type+" } from './"+component.type+"';\n"
    });

     var file=path.join(folder,"components.tsx");
    fs.writeFile(file,code,()=>{
            console.log("component==>"+file);
    });
}

function exportComponent(component:string,folder:string){

    // var rs=component.onRender(component,undefined);
    // var code="import React from 'react';\n";
    // code+="export function "+component.type+"(props:any){\n";
    // code+="return <>\n";
    // code+=rs.root.innerHTML;
    // code+=" </>";
    var code="";
    var lines= fs.readFileSync(component).toString().split("\n");
    for(var row in lines){
        var line=lines[row];
        var newLine=line+"";
      //  console.log(line);
        var m=line.match(/document.createElement\("(.*)"\)/);
        if(m!=undefined&&m.length>0){
            newLine=line.replace("document.createElement","React.createElement");
        }
        code+=newLine;
    }

    var out=path.join(folder,path.basename(component));
    fs.writeFile(out,code,()=>{
            console.log("component==>"+out);
    });

}

function createPackage(appPath:string){

}
function createIndex(appPath:string){

}
function createReadMe(appPath:string){

}
function createtTsConfig(appPath:string){

}
function createtGit(appPath:string){

}