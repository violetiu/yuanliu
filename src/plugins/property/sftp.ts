/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

右侧默认 sftp
***************************************************************************** */

import { ipcRendererSend } from "../../preload";
import { updateComponent } from "../../common/components";
import { IComponent, IPanel } from "../../common/interfaceDefine";
import * as forms from "../../render/forms";
import { ipcRenderer } from "electron";

var host:forms.FormText;
var port:forms.FormNumber;
var userName:forms.FormText;
var password:forms.FormText;
var folder:forms.FormText;
var button:HTMLButtonElement;
var log:HTMLElement;
const  panel:IPanel={
    key:"sftp",name:"发布",hidden:true,sort:1,
    render:(content:HTMLElement)=>{
        
        var   storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = "storePanel";
        content.appendChild(storePanel);
    
        var context=document.createElement("div");
        context.style.padding="0px 10px 0px 10px";
        storePanel.appendChild(context);
    
        host=new forms.FormText("地址");
        host.render(context);

        port=new forms.FormNumber("端口");
        port.render(context);

        folder=new forms.FormText("目录");
        folder.render(context);


        userName=new forms.FormText("用户名");
        userName.render(context);
        password=new forms.FormText("密码");
        password.render(context);
        context.appendChild(document.createElement("br"));

        button=document.createElement("button");
        button.innerText="发布";
        button.setAttribute("hover","true");
        button.style.cssText="user-select: none;display:inline-block;cursor: pointer;font-size:13px;padding: 5px 20px 5px 20px;border: 1px solid var(--theme-color);border-radius: 5px;";
        context.appendChild(button);
        context.appendChild(document.createElement("br"));
        log=document.createElement("div");
        log.style.fontSize="12px";
        log.style.maxHeight="400px";
        log.style.overflow="auto";
        context.appendChild(log);
    
        ipcRenderer.on("_sftp",(eve,arg)=>{
            log.innerHTML+=arg+"<br/>";
        })
        log.ondblclick=()=>{
            log.innerHTML="";
        }


    }, 
    update:(args:any)=>{
     
        var  config={
            host:"www.violetime.com",
            port:"22",
            username:"ubuntu",
            password:"",
            folder:"/home/web/root",
        };
        host.update(config.host,(val)=>{
            config.host=val;
        })
        port.update(config.port,(val)=>{
            config.port=val;
        })
        userName.update(config.username,(val)=>{
            config.username=val;
        })
        folder.update(config.folder,(val)=>{
            config.folder=val;
        })
        password.update(config.password,(val)=>{
            config.password=val;
        })
        button.onclick=()=>{
            log.innerHTML="";
            ipcRendererSend("export", "sftp_"+JSON.stringify(config));

        }
        log.innerHTML="";
        
        


    }

}
export default function load(){
    return panel;
}
