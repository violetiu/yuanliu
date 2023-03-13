import { ipcRenderer } from "electron";
import { getUUID, IComponent, IPage, IStatusBarActivity } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { getCurPage, getSelectComponents } from "./workbench";
import { getConfig, getProject } from "./workspace";

export function showStatusLoadding(msg:any){
    var loadding=acticities.find(a=>a.title=="加载中");
    if(loadding!=undefined){

        loadding.onUpdate(document.getElementById(loadding.key),undefined,undefined,undefined,undefined,undefined,msg);

    }
}
export function hideStatusLoadding(){
    var loadding=acticities.find(a=>a.title=="加载中");
    if(loadding!=undefined){

        loadding.onUpdate(document.getElementById(loadding.key),undefined,undefined,undefined,undefined,undefined,undefined);

    }
}
export function renderStatusBar(){
    var statusBar=document.getElementById("statusBar");
    statusBar.innerHTML="";

    var left=document.createElement("div");
    left.style.display="flex";
    statusBar.appendChild(left);

    var center=document.createElement("div");
    center.style.flex="1";
    statusBar.appendChild(center);

    var right=document.createElement("div");
    right.style.display="flex";

    statusBar.appendChild(right);


  
    ipcRenderer.on("_loadPlugins_status",(event,arg)=>{
        var plugins: IStatusBarActivity[] = [];
        arg.forEach((item: string) => {
            var panel: IStatusBarActivity = require("../plugins/status/"+item).default   ;
            panel.key=getUUID();
            plugins.push(panel);
        });
        plugins.sort((a, b) => a.sort - b.sort);
        acticities=plugins;
        console.log("_loadPluginsStatus", plugins);
        renderActivities(left,right, plugins);


    });
    ipcRenderer.send("loadPlugins",'status');

}
var acticities:IStatusBarActivity[]=[];
/**
 * 
 * 更新状态栏
 * @param page 
 * @param component 
 * @param selects 
 */
export function updateStatus(page:IPage,component:IComponent,selects:string[]){

    acticities.forEach(acticity=>{

        if(acticity.onUpdate!=undefined){
            var root=document.getElementById(acticity.key);
            if(root!=undefined){
                acticity.onUpdate(root,getConfig(),getProject(),page,component,selects);
                if(root.children.length==0){
                    root.style.display="none";
                }else{
                    root.style.display="flex";
                }
              
            }
        
        }
    })
}
function renderActivities(left:HTMLElement,right:HTMLElement,plugins:IStatusBarActivity[]){


    plugins.forEach(plugin=>{

        var root=document.createElement("div");
        root.className="statusBarActivity";
        root.id=plugin.key;
        root.title=plugin.title;
        root.onclick=()=>{
            if(plugin.onClick!=undefined)
             plugin.onClick(root,getConfig(),getProject(),getCurPage(),getSelectComponents());
        }

        if(plugin.position=="left"){
            left.appendChild(root);
        }else{
            right.appendChild(root);
        }
        plugin.onRender(root,getConfig(),getProject());
        if(root.innerHTML.length==0){
            root.style.display="none";
        }else{
            root.style.display="flex";
        }
      




    })


}