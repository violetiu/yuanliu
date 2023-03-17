/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

右侧默认 项目
***************************************************************************** */

import { getProject } from "../../render/workspace";
import { IBackground, ICatalog, IPanel, IProject } from "../../common/interfaceDefine";
import * as form from "../../render/form";
import * as forms from "../../render/forms";
import { ipcRendererSend } from "../../preload";
import { getNowDateTime } from "../../server/work";
import { ipcRenderer } from "electron";
import { cal_gradient, getComponentStyle } from "../../render/propertypanel";
import { getCurViewContent } from "../../render/workbench";
var formName: forms.FormText;
var formPath: forms.FormText;
/**
 *     name: string;
    path: string;
    catalogs?: ICatalog[];
    work?: string;
    type?: "local" | "git",
    username?: string;
    password?: string;
    createDate?: string;
    updateDate?: string;
    author?: string;
    version?: string;
    description?: string;
    cover?: string;
 */
var formAuther: forms.FormText;
var formCreateDate: forms.FormText;
var formUpdateDate: forms.FormText;
var formDescription: forms.FormPragraph;
var formCover: HTMLImageElement;
var formLaunch: forms.FormCatalog;
var formColor: forms.FormColor;
var formIndex: forms.FormCatalog;
var formTheme: forms.FormIcons;
var formBackgroundType: forms.FormIcons;
var formBackgroundSolidPanel: HTMLElement;
var formBackgroundSolidPanelColor: forms.FormColor;
var formBackgroundGradientPanel: HTMLElement;

var formBackgroundGLColor1: forms.FormColor;
var formBackgroundGLColor2: forms.FormColor;
var formBackgroundGLColor3: forms.FormColor;
var formBackgroundGLColor4:forms. FormColor;
var formBackgroundGLColor5:forms. FormColor;
var formBackgroundGLColor6: forms.FormColor;


var formBackgroundImage: forms.FormSelect;
var formBackgroundImageDiv: HTMLElement;

const panel: IPanel = {
    key: "project", name: "项目", hidden: true, sort: 0,
    render: (content: HTMLElement) => {
        var panel = document.createElement("div");
        panel.className = "projectPanel";
        panel.id = "projectPanel";
        content.appendChild(panel);
        panel.style.padding = "0px 10px 0px 10px";

        var image = document.createElement("div");
        image.style.minHeight = "100px";
        image.style.marginTop = "10px";
        image.style.borderRadius = "5px";
        image.style.overflow = "hidden";
        panel.appendChild(image);

        formCover = document.createElement("img");
        formCover.style.width = "100%";
        formCover.id = "project_cover";
        image.appendChild(formCover);
        image.ondblclick = () => {
            console.log("insertImage");
            ipcRendererSend("insertImage");

        }

        formName = new forms.FormText("名称");
        formName.render(panel);

        formPath = new forms.FormText("路径");
        formPath.render(panel);

        formAuther = new forms.FormText("作者");
        formAuther.render(panel);

        formCreateDate = new forms.FormText("创建日期");
        formCreateDate.render(panel);

        formUpdateDate = new forms.FormText("更新日期");
        formUpdateDate.render(panel);

        formDescription = new forms.FormPragraph("描述");
        formDescription.render(panel);

        formLaunch = new forms.FormCatalog("启动页");
        formLaunch.render(panel);

        formIndex = new forms.FormCatalog("首页");
        formIndex.render(panel);

        formColor = new forms.FormColor("主题色");
        formColor.render(panel);

        formTheme = new forms.FormIcons("主题", ["bi bi-brightness-high-fill", "bi bi-moon-stars-fill"]);
        formTheme.render(panel);


        formBackgroundType = new forms.FormIcons("背景", ["bi bi-slash-circle", "bi bi-palette", "bi bi-circle-half", "bi bi-star"]);
        formBackgroundType.render(panel);


        //bg
        var formBackgroundPanel = document.createElement("div");
        formBackgroundPanel.style.paddingRight = "5px";
        panel.appendChild(formBackgroundPanel);
        //0 no

        //1 color
        formBackgroundSolidPanel = document.createElement("div");
        formBackgroundSolidPanel.style.display = "none";
        formBackgroundPanel.appendChild(formBackgroundSolidPanel);
        formBackgroundSolidPanelColor = new forms.FormColor("填充颜色");
        formBackgroundSolidPanelColor.render(formBackgroundSolidPanel);


        //2 gradient

        formBackgroundGradientPanel = document.createElement("div");
        formBackgroundGradientPanel.style.display = "none";
        formBackgroundPanel.appendChild(formBackgroundGradientPanel);
    

        var formBackgroundGLRow1 = document.createElement("div");
        formBackgroundGradientPanel.appendChild(formBackgroundGLRow1);
       
        var formBackgroundGLColor1Div = forms.createDivRow(formBackgroundGLRow1, true);
        formBackgroundGLColor1 = new forms.FormColor("背景1");
        formBackgroundGLColor1.render(formBackgroundGLColor1Div);
        var formBackgroundGLColor2Div = forms.createDivRow(formBackgroundGLRow1);
        formBackgroundGLColor2 = new forms.FormColor("背景2");
        formBackgroundGLColor2.render(formBackgroundGLColor2Div);
    
        var formBackgroundGLRow2 = document.createElement("div");
        formBackgroundGradientPanel.appendChild(formBackgroundGLRow2);
        var formBackgroundGLColor3Div = forms.createDivRow(formBackgroundGLRow2, true);
        formBackgroundGLColor3 = new forms.FormColor("前景1");
        formBackgroundGLColor3.render(formBackgroundGLColor3Div);
        var formBackgroundGLColor4Div = forms.createDivRow(formBackgroundGLRow2);
        formBackgroundGLColor4 = new forms.FormColor("前景2");
        formBackgroundGLColor4.render(formBackgroundGLColor4Div);
    
    
        var formBackgroundGLRow3 = document.createElement("div");
        formBackgroundGradientPanel.appendChild(formBackgroundGLRow3);
        var formBackgroundGLColor5Div = forms.createDivRow(formBackgroundGLRow3, true);
        formBackgroundGLColor5 = new forms.FormColor("前景3");
        formBackgroundGLColor5.render(formBackgroundGLColor5Div);
        var formBackgroundGLColor6Div = forms.createDivRow(formBackgroundGLRow3);
        formBackgroundGLColor6 = new forms.FormColor("前景4");
        formBackgroundGLColor6.render(formBackgroundGLColor6Div);
    


        //3 image
        formBackgroundImageDiv = document.createElement("div");
        formBackgroundImageDiv.style.display = "none";
        formBackgroundPanel.appendChild(formBackgroundImageDiv);
        formBackgroundImageDiv.style.paddingLeft = "5px";


        ipcRendererSend("loadPlugins", "background");

        ipcRenderer.on("_loadPlugins_background", (event, args) => {
            console.log("_loadPluginsBg", args);
            var list: any = [];

            args.forEach((item: string) => {
                try {
                    // console.log(item);
                    var bg: IBackground = require("../background/" + item).default;
                    if (bg != undefined) {
                        list.push({
                            label: bg.title, value: bg.key
                        })

                    }

                } catch (error) {
                    console.log(error);
                }

            })

            formBackgroundImage = new forms.FormSelect("内置背景", list);
            formBackgroundImage.render(formBackgroundImageDiv);


        })


    },
    update: () => {
        var project = getProject();
        formName.update(project.name);
        formPath.update(project.path);
        formAuther.update(project.author);
        formCreateDate.update(project.createDate);
        formUpdateDate.update(project.updateDate);
        formDescription.update(project.description, (value) => {
            project.description = value;
            getProject().updateDate = getNowDateTime();
            ipcRendererSend("saveProject", project);
        });
        formCover.src = getProject().work + "/images/" + project.cover;

        formLaunch.update(project.launch, (cl: ICatalog) => {
            project.launch = cl.key;
            getProject().updateDate = getNowDateTime();
            ipcRendererSend("saveProject", project);
            return true;
        });

        formIndex.update(project.index, (cl: ICatalog) => {
            project.index = cl.key;
            getProject().updateDate = getNowDateTime();
            ipcRendererSend("saveProject", project);
            return true;
        });

        formColor.update(project.themeColor, (color) => {
            project.themeColor = color;
            if (color != undefined) {
                var lightColor = "";
                if (color.startsWith("#")) {
                    var cr = get16ToRgb(color);
                    lightColor = "rgba(" + cr[0] + "," + cr[1] + "," + cr[2] + ",0.4)";
                } else if (color.startsWith("rgba")) {
                    var sp = color.split(",");
                    lightColor = sp[0] + "," + sp[1] + "," + sp[2] + ",0.4)";
                } else if (color.startsWith("rgb")) {
                    var sp = color.split(",");
                    lightColor = sp[0].replace("rgb", "rgba") + "," + sp[1] + "," + sp[2].replace(")", "") + ",0.4)";
                }
                project.lightColor = lightColor;
                console.log("lightColor", lightColor);
            }


            document.body.style.cssText = "--theme-color:" + color;
            getProject().updateDate = getNowDateTime();
            ipcRendererSend("saveProject", project);
        })

    formTheme.update(project.theme == "light" ? 0 : 1, (value) => {
      var val: "light" | "dark" = "light";
      if (value == 0) {
        val = "light";
      } else {
        val = "dark";
      }
      project.theme = val;
      ipcRendererSend("saveProject", project);
      try {
        getCurViewContent().getElementsByClassName("page_parent")[0].className = "page_parent " + val;
      } catch (error) {
        console.log(error);
      }
     
    });
        var bgType = 0;
        if (project.backgroundType != undefined) {
          bgType = project.backgroundType;
        }
    
    
        formBackgroundType.update(bgType, (value) => {
          bgType = value;
          project.backgroundType = value;
          ipcRendererSend("saveProject", project);
          backgroundTypeSwitch();
        });
        backgroundTypeSwitch();
        function backgroundTypeSwitch() {
          //  var gb: any = getCurViewContent().getElementsByClassName("page_parent")[0];
          var background = project.backgroundColor;
          if (bgType == 0) {
            formBackgroundSolidPanel.style.display = "none";
            formBackgroundGradientPanel.style.display = "none";
            formBackgroundImageDiv.style.display = "none";
            ipcRendererSend("saveProject", project);
    
          } else if (bgType == 1) {
            formBackgroundSolidPanel.style.display = "block";
            formBackgroundGradientPanel.style.display = "none";
            formBackgroundImageDiv.style.display = "none";
    
            ipcRendererSend("saveProject", project);
            formBackgroundSolidPanelColor.update(background, (value) => {
    
              setProjectBackgroundColor( project,value,formCover);
            })
          } else if (bgType == 2) {
            formBackgroundSolidPanel.style.display = "none";
            formBackgroundGradientPanel.style.display = "block";
            formBackgroundImageDiv.style.display = "none";
            var gl1 = "rgba(255, 255, 255, 0.01)";
            var gl2 = "rgba(255, 255, 255, 0.85)";
            var gl3 = "rgba(220, 50, 10, 0.5)";
            var gl4 = "rgba(120, 0, 30, 0.5)";
            var gl5 = "rgba(30, 8, 2, 0.5)";
            var gl6 = "rgba(123, 11, 9, 0.5)";

            var bgStyle = project.backgroundColor;
            // console.log("bgStyle", bgStyle);
            if (bgStyle != undefined && bgStyle.split("rgba").length == 7) {
                var sp = bgStyle.split("rgba(");
                gl1 = "rgba(" + sp[1].split(")")[0] + ")";
                gl2 = "rgba(" + sp[2].split(")")[0] + ")";
                gl3 = "rgba(" + sp[3].split(")")[0] + ")";
                gl4 = "rgba(" + sp[4].split(")")[0] + ")";
                gl5 = "rgba(" + sp[5].split(")")[0] + ")";
                gl6 = "rgba(" + sp[6].split(")")[0] + ")";
            }

            formBackgroundGLColor1.update(gl1, (color) => {
                gl1 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setProjectBackgroundColor( project,gl,formCover);

            });

            formBackgroundGLColor2.update(gl2, (color) => {
                gl2 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setProjectBackgroundColor( project,gl,formCover);

            });

            formBackgroundGLColor3.update(gl3, (color) => {
                gl3 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setProjectBackgroundColor( project,gl,formCover);

            });

            formBackgroundGLColor4.update(gl4, (color) => {
                gl4 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setProjectBackgroundColor( project,gl,formCover);

            });
            formBackgroundGLColor5.update(gl5, (color) => {
                gl5 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setProjectBackgroundColor( project,gl,formCover);

            });

            formBackgroundGLColor6.update(gl6, (color) => {
                gl6 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setProjectBackgroundColor( project,gl,formCover);

            });

    
    
          } else if (bgType == 3) {
            //内置背景
            formBackgroundSolidPanel.style.display = "none";
            formBackgroundGradientPanel.style.display = "none";
            formBackgroundImageDiv.style.display = "block";
    
            formBackgroundImage.update(project.backgroundColor, (value) => {
    
            
              setProjectBackgroundColor( project,value,formCover);
    
    
            })
          }
         
        }
    }


}

function setProjectBackgroundColor(project:IProject, color:string,formCover:any){
  project.backgroundColor = color;
  ipcRendererSend("saveProject", project);
  formCover.src="";
  formCover.style.minHeight="100px";
  formCover.style.minWidth="200px";
  formCover.style.borderRadius="5px";
  formCover.style.background=color;
}

export default function load() {
    return panel;
}

function get16ToRgb(str: string) {
    var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    if (!reg.test(str)) { return; }
    let newStr = (str.toLowerCase()).replace(/\#/g, '')
    let len = newStr.length;
    if (len == 3) {
        let t = ''
        for (var i = 0; i < len; i++) {
            t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
        }
        newStr = t
    }
    let arr = []; //将字符串分隔，两个两个的分隔
    for (var i = 0; i < 6; i = i + 2) {
        let s = newStr.slice(i, i + 2)
        arr.push(parseInt("0x" + s))
    }
    return arr;
}