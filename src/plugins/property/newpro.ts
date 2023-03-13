/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

app设置
***************************************************************************** */
import { activePropertyPanel } from "../../render/propertypanel";
import { IPanel } from "../../common/interfaceDefine";
import * as forms from "../../render/forms";
import { getConfig, saveConfig } from "../../render/workspace";
import { app, ipcRenderer } from "electron";
var formName: forms.FormText;
var formButtons:forms.FormButtons;
var newProject:any={name: "未命名1"};
const panel: IPanel = {
  key: "newpro", name: "新建项目", hidden: true, sort: 0,
  render: (content: HTMLElement) => {

    var setting = document.createElement("div");
    setting.style.position="relative";
    setting.style.flex = "1";
    setting.style.marginLeft = "10px";
    setting.style.marginRight = "10px";
    setting.style.display = "block";
    content.appendChild(setting);
    var row = document.createElement("div");
    setting.appendChild(row);

    formName = new forms.FormText("项目名称");
    formName.render(setting);

    formButtons=new forms.FormButtons([{
        label:"新建",icon:"bi bi-folder-plus",onclick:()=>{
            if (newProject.name != undefined ) {
                newProject.path="";
                newProject.modified = getNowDateTime();
                newProject.version = require("../../../package.json").version;
                newProject.type = "local";
               // projects.push(newProject);
                ipcRenderer.send("newProject", newProject);
             
  
              }
        }
    },
    {
        label:"取消",icon:"bi bi-x-circle",onclick:()=>{
            newProject={name: "未命名1"};
            activePropertyPanel("projects");
        }
    }]);
    formButtons.render(setting);


  },
  update: () => {

  
    formName.update(newProject.name, (value) => {
        newProject.name=value;

    });

  }

}
export default function load() {
  return panel;
}


function getNowDateTime(): string {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var nowDateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return nowDateTime;
  
  }