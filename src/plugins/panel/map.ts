/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  地图标签
***************************************************************************** */
import { ipcRenderer } from "electron";
import { ipcRendererSend } from "../../preload";
import { IPanel } from "../../common/interfaceDefine";
import * as form from "../../render/form";
const  panel:IPanel={
    key:"map",name:"地图",hidden:true,sort:5,
    render:(content:HTMLElement)=>{
        var view = document.createElement("div");
        view.id="mapPanel";
        view.style.width = "100%";
        view.style.height = "100%";
        content.appendChild(view);

        var row=form.createDivRow(view);

        var catalogDiv=document.createElement("div");
        catalogDiv.id="catalogDiv";
        catalogDiv.style.width="300px";
        row.appendChild(catalogDiv);   
        
        var context=document.createElement("div");
        context.style.flex="1";
        row.appendChild(context);   
      
        
        ipcRenderer.on("_loadMapCatalog",(event,arg)=>{
            console.log("_loadMapCatalog",arg);
            var catalogDiv=document.getElementById("catalogDiv");
            catalogDiv.innerHTML="";
            var catalog=arg;
            for(var key in catalog){
                var item=document.createElement("div");
                item.style.paddingLeft="5px";
                item.style.cursor="pointer";
             
                item.innerHTML=catalog[key];
                item.className="explorer_file explorer_row";
                item.onclick=()=>{
                    //ipcRendererSend("loadMap",key);
                }
                catalogDiv.appendChild(item);
            }

        });
        ipcRendererSend("loadMapCatalog");



    }, 
    update:()=>{


    }

}
export default function load(){
    return panel;
}

