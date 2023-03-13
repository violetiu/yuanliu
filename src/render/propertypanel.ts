/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染右侧栏
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IComponent, IPanel } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { updateComponentsStyle } from "./floatPanel";

/**
 * 切换右侧
 */
var lastPanelKey = "";
export function activePropertyPanel(args?: any) {
 
    if (args != undefined) {
        if( typeof args === "string" ){  
            showPropertyTab([args]); 
            switchPropertyPanel(args);
          

        }else if(typeof args === "object"){
            if(args.panel!=undefined&&args.panel.length>0){
                showPropertyTab([args.panel,"property"],args); 
                switchPropertyPanel(args.panel);
              
            }else{
                showPropertyTab(["property"],args); 
                switchPropertyPanel("property");
          
            }
        }
       
    }else{
        showPropertyTab(["page"]); 
        switchPropertyPanel("page");
        
    }
};
export function activePropertyPanels(panels?: string[],args?:any) {
 
    showPropertyTab(panels,args); 
    switchPropertyPanel(panels[0]);
};
function showPropertyTab(panels: string[],args?:any) {
    panelTabsMap.forEach((ele, key) => {

        if(panels.indexOf(key)>=0){
            ele.style.display = "inline-block";
            try {
                panelsMap.get(key).update(args);
            } catch (error) {
                //console.log(error);
            }
        }else{
            ele.style.display = "none";
        }

    });


}

function switchPropertyPanel(panel: string) {
    panelELesMap.forEach((ele, key) => {
        if (key == panel) {
            ele.style.display = "block";
            panelTabsMap.get(key).setAttribute("selected", "true");
        
        } else {
            ele.style.display = "none";
            panelTabsMap.get(key).setAttribute("selected", "false");
        }
    })
    lastPanelKey = panel;
};


export function renderPropertyPanel(content: HTMLElement) {

    var propertyPanel = document.createElement("div");
    propertyPanel.className = "propertyPanel";
    propertyPanel.id = "propertyPanel";
    content.appendChild(propertyPanel);



    var tabsBar = document.createElement("div");
    tabsBar.className = "tabsBar";
    propertyPanel.appendChild(tabsBar);

    var tabsBody = document.createElement("div");
    tabsBody.className = "tabsBody";
    propertyPanel.appendChild(tabsBody);


    ipcRenderer.send("loadPlugins","property");
    ipcRenderer.on("_loadPlugins_property", (event, arg) => {
        var plugins: IPanel[] = [];
        arg.forEach((item: string) => {
            var panel: IPanel = require("../plugins/property/"+item).default();
            plugins.push(panel);
        });
        plugins.sort((a, b) => a.sort - b.sort);
        //console.log("loadPluginsProperty", plugins);
        renderPanels(tabsBar, tabsBody, plugins);
    });

}
function renderPanels(tabsBar: HTMLElement, tabsBody: HTMLElement, plugins: IPanel[]) {
    // tabsBar.innerHTML="";
    // tabsBody.innerHTML="";
    plugins.forEach((plugin: IPanel, index: number) => {
        renderPanel(tabsBar, tabsBody, plugin);
    });

}
var panelELesMap = new Map<string, HTMLElement>();
var panelTabsMap = new Map<string, HTMLElement>();
var panelsMap = new Map<string, IPanel>();

function renderPanel(tabsBar: HTMLElement, tabsBody: HTMLElement, plugin: IPanel) {

    var tab = document.createElement("div");
    tab.className = "tab";
    tab.innerHTML = plugin.name;
    tab.setAttribute("selected", !plugin.hidden + "");
    tab.style.display = plugin.hidden ? "none" : "inline-block";
    tab.innerHTML = plugin.name;
    tab.onclick = () => {
        switchPropertyPanel(plugin.key);
    }
    tabsBar.appendChild(tab);
    panelTabsMap.set(plugin.key, tab);

    var panel = document.createElement("div");
    panel.className = "panel";
    panel.id = "panel_" + plugin.key;
    panel.style.display = plugin.hidden ? "none" : "block";
    tabsBody.appendChild(panel);
    panelsMap.set(plugin.key, plugin);
    panelELesMap.set(plugin.key, panel);

    // var layoutBar = document.createElement("div");
    // layoutBar.className = "layoutBar";
    // panel.appendChild(layoutBar);
    // var layoutBarText = document.createElement("div");
    // layoutBarText.innerText = plugin.name;
    // layoutBarText.style.flex = "1";
    // layoutBar.appendChild(layoutBarText);
    // var layoutBarIcon = document.createElement("i");
    // layoutBarIcon.className = "bi  bi-x";
    // layoutBar.appendChild(layoutBarIcon);
    // layoutBarIcon.onclick = () => {
    //     if(plugin.hidden){
    //         activePropertyPanel("property");
    //     }
    // }

    var context = document.createElement("div");
    panel.appendChild(context);
    //
    plugin.render(context);


}


export function getComponentStyle(component: IComponent, property: string, replace?: string): string {
    var style = component.style;
    if (style == undefined) {
        style = component.styles["root"];
    }
    if (style != undefined) {
        var rep =  RegExp("[^\-]" + property + ":[^;]+;");
   
        var m = (" "+style).match(rep);
   
        if (m != undefined && m != null && m.length > 0) {
            for (var i = 0; i < m.length; i++) {
                var s =m[i].substring(1);


                if (s.trim().startsWith(property + ":")) {
                    var v = s.split(":")[1];
                    v = v.substring(0, v.length - 1).trim();
         
                    if (property == "width" || property == "height") {
                        if (v == "auto") {
                            if (property == "width") {
                                return document.getElementById(component.key).clientWidth + "";
                            } else if (property == "height") {
                                return document.getElementById(component.key).clientHeight + "";
                            }
                        }
                    }
            
                    if (replace != undefined)
                        return v.replace(replace, "");
                    return v;
                }
            }
        } else {
            if (property == "width") {
                var d=document.getElementById(component.key);
                if(d!=undefined)
                    return d.clientWidth + "";
            } else if (property == "height") {
                var d=document.getElementById(component.key);
                if(d!=undefined){
                    //console.log("cli ",v);
                    return d.clientHeight + "";
                }
                   
            }
        }
    }
    return "";
}
export function setComponentStyle(component: IComponent, property: string, value: string,isUpdate?:boolean) {

    var style = component.style;
    if (style != undefined) {
        style =" "+style.replace(/;/g, "; ");
        var rep = RegExp("[^-]" + property + ":[^;]+;");
        style = style.replace(rep, "")
        ///(;|^)background:[^;]+;/g
        if (!style.trim().endsWith(";")) {
            style += ";";
        }
        style += property + ":" + value + ";";
        component.style = style.replace(/; /g, ";");
        component.style = style.replace(/  /g, "");
    } else {
        style ="  "+component.styles["root"].replace(/;/g, "; ");
        var rep = RegExp("[^-]" + property + ":[^;]+;");
        style = style.replace(rep, "")
        ///(;|^)background:[^;]+;/g
        if (!style.trim().endsWith(";")) {
            style += ";";
        }
        style += property + ":" + value + ";";
        component.styles["root"] = style.replace(/; /g, ";");
        component.styles["root"]= style.replace(/  /g, "");
    }
    if(isUpdate==undefined||isUpdate)
        updateComponentsStyle([component]);
}
export function cal_gradient(colors: string[], angle: number, type: number, position: number): string {
    var s = 50 - position / 2;
    var e = 100 - position / 2;

    if (type == 0) {
        return "linear-gradient(" + angle + "deg, " + colors[0] + " " + s + "%, " + colors[1] + " " + e + "%)";
    } else if (type == 1) {
        return "radial-gradient(circle, " + colors[0] + " " + s + "%, " + colors[1] + " " + e + "%)";
    }
}