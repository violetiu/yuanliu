/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部栏 渲染
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IComponent, IPanel } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { loadChart } from "./chart";
import { pushHistory } from "./history";
import { findCurPageComponent, getCurPage, updatePageViewScrollH, updatePageViewScrollV } from "./workbench";
export function updateFloatPanel(comment?: IComponent) {
    if (comment == undefined) {
        switchFloatTab("导航");
    } else if (comment.option != undefined) {
        switchFloatTab("选项");
    }
}
export function renderFloatPanel(content: HTMLElement) {

    var floatPanel = document.createElement("div");
    floatPanel.className = "floatPanel";
    content.appendChild(floatPanel);




    renderSilderBar(floatPanel);

    ipcRenderer.send("loadPlugins","panel");
    ipcRenderer.on("_loadPlugins_panel", (event, arg) => {
        //    console.log("_loadPluginsPanel",arg);
        var plugins: IPanel[] = [];
        arg.forEach((item: string) => {
            var panel: IPanel = require("../plugins/panel/"+item).default();
            plugins.push(panel);
        });
        plugins.sort((a, b) => a.sort - b.sort);
        console.log("loadPluginsPanel", plugins);
        renderTabsBar(floatPanel, plugins);
    });
}

function renderSilderBar(content: HTMLElement) {

    var silderBar = document.createElement("div");
    silderBar.className = "silderBar";
    content.appendChild(silderBar);

    var silderBarBlock = document.createElement("div");
    silderBarBlock.className = "silderBarBlock";
    silderBar.appendChild(silderBarBlock);

    silderBarBlock.onmousedown = (ed: MouseEvent) => {
        var floatPanel = document.getElementById("floatPanel");
        var floatPanelHeight=floatPanel.clientHeight;
        var startY = ed.clientY;
        var move: boolean = true;
        document.onmousemove = (em: MouseEvent) => {
            if (move) {
                var y = -em.clientY+startY;
                var height = floatPanelHeight + y;
                silderBar.style.bottom = (height ) + "px";
                floatPanel.style.height = height + "px";
            }
        }
        document.onmouseup = () => {
            move = false;
            updatePageViewScrollH();
            updatePageViewScrollV();
        }

    };


}

var selectedTab = "导航";

function renderMapView(content: HTMLElement) {


}
var tabs: IPanel[] = [];
var panelContext: any;
function renderTabsBar(content: HTMLElement, plugins: IPanel[]) {
    tabs = plugins;
    console.log("renderTabsBar", plugins);
    panelContext = content;
    var tabsBar = document.createElement("div");
    tabsBar.className = "tabsBar";
    tabsBar.id = "tabsBar";
    content.appendChild(tabsBar);

    var tabsBody = document.createElement("div");
    tabsBody.id = "tabsBody";
    tabsBody.className = "tabsBody";
    content.appendChild(tabsBody);

    plugins.forEach((panel: IPanel) => {
        //  console.log(panel.name);
        var tabName = panel.name;
        var tabDiv = document.createElement("div");
        tabDiv.className = "tab";
        if (selectedTab == tabName) {
            tabDiv.setAttribute("selected", "true");
        }
        tabDiv.innerText = tabName;
        tabsBar.appendChild(tabDiv);
        tabDiv.onclick = (e: MouseEvent) => {
            switchFloatTab(tabName);
        };

        var view = document.createElement("div");
        view.className = "tabView";
        tabsBody.appendChild(view);
        if (selectedTab == tabName) {
            view.setAttribute("selected", "true");
        }

        if (panel.render != undefined) {
            
            requestIdleCallback(()=>{
                panel.render(view);
            });

        }

    })


    // tabs.forEach(tab => {
    //     var tabName = tab.name;
    //     var tabDiv = document.createElement("div");
    //     tabDiv.className = "tab";
    //     if (selectedTab == tabName) {
    //         tabDiv.setAttribute("selected", "true");
    //     }
    //     tabDiv.innerText = tabName;
    //     tabsBar.appendChild(tabDiv);
    //     tabDiv.onclick = (e: MouseEvent) => {
    //         switchFloatTab(tabName);
    //     };

    //     var view = document.createElement("div");
    //     view.className = "tabView";
    //     tabsBody.appendChild(view);
    //     if (selectedTab == tabName) {
    //         view.setAttribute("selected", "true");
    //     }

    //     if (tab.onRender != undefined) {
    //         tab.onRender(view);
    //     }



    // })


}
export function switchFloatTab(name: string) {

    var index = tabs.findIndex(t => t.name == selectedTab);
    document.getElementById("tabsBody").children.item(index).setAttribute("selected", "false");
    document.getElementById("tabsBar").children.item(index).setAttribute("selected", "false");

    index = tabs.findIndex(t => t.name == name);
    document.getElementById("tabsBody").children.item(index).setAttribute("selected", "true");
    document.getElementById("tabsBar").children.item(index).setAttribute("selected", "true");

    selectedTab = name;
    var tab = tabs.find(t => t.name == selectedTab);
    if (tab != undefined) {
        try {
            tab.update();
        } catch (error) {
            console.log(error);
        }
    }

    //blue
 

    // panelContext.innerHTML = "";
    // renderTabsBar(panelContext);

}



export function calData() {




}
export function updateComponentsStyle(components: Array<IComponent>) {
    components.forEach(component => {
        var componentDiv = document.getElementById(component.key);
        if (componentDiv != undefined || componentDiv != null) {

            if (component.styles != undefined) {

                for (var name in component.styles) {
                    if (name == "root") {
                        if (component.master != undefined && component.master.length > 0) {
                            var master = findCurPageComponent(component.master);
                            if (master != undefined) {
                                componentDiv.style.cssText = master.styles[name];
                                componentDiv.style.cssText += component.styles["root"];
                                break;
                            }
                        }
                        
                        componentDiv.style.cssText = component.styles["root"];
                     
                        continue;
                    }

                    var list = componentDiv.querySelectorAll("[data-styles=" + name + "]");

                    for (var i = 0; i < list.length; i++) {
                        var ele: any = list[i];
                        ele.style.cssText = component.styles[name];
                    }
                }

            } else if (component.style != undefined) {
                componentDiv.style.cssText = "";
                if (component.master != undefined && component.master.length > 0) {
                    var master = findCurPageComponent(component.master);
                    if (master != undefined) {
                        componentDiv.style.cssText = master.style;

                    }
                }

                componentDiv.style.cssText += component.style;
            }

            if (component.group == "chart") {
                try {
                    if (component.option != undefined)
                        loadChart(componentDiv, component, component.type == "chart_map");
                } catch (error) {

                }

            }


        }

    })
    setTimeout(() => {
        pushHistory(getCurPage());

    }, 100);
}