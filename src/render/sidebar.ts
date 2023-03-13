/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染侧边栏
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IMenuItem } from "../common/contextmenu";
import { getUUID, IExplorer, IExplorerUpdater } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";


export function updateSidebar(updater: IExplorerUpdater) {

    if (explorerList != undefined) {
        explorerList.forEach(ex => {
            ex.update(updater);
        })
    }



}
var explorerList: Array<IExplorer>;
export function renderSidebar(content: HTMLElement) {

    var sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    content.appendChild(sidebar);



    ipcRenderer.send("loadPlugins","explorer");
    ipcRenderer.on("_loadPlugins_explorer", (event, args) => {
        explorerList = [];
        console.log(args);
        args.forEach((item: string) => {
            console.log(item);
            try {
            

                var ex: IExplorer = require("../plugins/explorer/" + item).default;
                if (ex != undefined) {

                    ex.key = getUUID();
                    explorerList.push(ex);



                }

            } catch (error) {
                console.log(error);
            }

        });
        if (explorerList != undefined) {
            explorerList.sort((a, b) => a.sort - b.sort);
            explorerList.forEach((ex, index) => {
                ex.index = index;

                loadExplorerEvent(ex);
                ex.onRender(sidebar);
                if (ex.extend) {
                    ex.setHeight(ex.height);
                }


            })
        }



    })



    // //数据
    // var databaseExplorer = renderExplorer("sidebar_database", sidebar, "数据", true,undefined,onExplorerHide);
    // databaseExplorer.id = "database_explorer";



}

function onExplorerHide(key: string, hide: boolean) {
    if (hide) {
        var index = showExplorers.findIndex(i => i == key);
        if (index >= 0) {
            showExplorers.splice(index, 1);
        }
    } else {
        var index = showExplorers.findIndex(i => i == key);
        if (index >= 0) {


        } else {
            if (showExplorers.length > 1) {
                var del = showExplorers[0];
                toggleExplorer(del, true);
                showExplorers.splice(0, 1);
            }

            showExplorers.push(key);
        }

    }
}
var totalHeight: number = 0;
var explorerMinHeight = 100;
var explorerBarHeight = 25;
/**
 * 加载方法
 * @param explorer 
 */
function loadExplorerEvent(explorer: IExplorer) {

    if (explorer.extend) {
        totalHeight += explorer.height+25;
    } else {
        if (explorer.height == undefined)
            explorer.height = explorerBarHeight;
        totalHeight += explorerBarHeight;
    }

    explorer.onResize = (height) => {
        var sidebarHeight = window.innerHeight - 32 - 22;
        var h = totalHeight + height - explorer.height;
        if (totalHeight + height - explorer.height > sidebarHeight) {
            //寻找压缩的组件
            var adj = height - explorer.height;
            var adjustExplorer: IExplorer;
            for (var i = explorer.index + 1; i < explorerList.length; i++) {
                var ex = explorerList[i];
                if (ex.height > explorerMinHeight + adj) {
                    adjustExplorer = ex;
                    break;
                }
            }
            //压缩
            if (adjustExplorer != undefined) {
                adjustExplorer.height -= adj;
                adjustExplorer.setHeight(adjustExplorer.height);
                explorer.height = height;
                return height;
            }
            return -1;
        } else {
            totalHeight += height - explorer.height;
            explorer.height = height;
            return height;
        }
    }

    explorer.onExtend = (extend, height) => {
        var sidebarHeight = window.innerHeight - 32 - 22;

        if (extend) {
            if (totalHeight + height - explorerBarHeight > sidebarHeight) {
                var h = sidebarHeight - totalHeight;
                totalHeight = sidebarHeight;
                if (h < explorerMinHeight) {//调整其他组件大小，给这个组件留个地方
                    //寻找一个合适的组件，压缩高度
                    var adjustExplorerIndex: number;
                    var adjustExplorerVal: number = explorerList.length;
                    explorerList.forEach((ex, exi) => {
                        if (exi != explorer.index&&ex.extend) {
                            var tmp = Math.abs(explorer.index - exi);
                            if (tmp < adjustExplorerVal && ex.height > explorerMinHeight * 2 - h) {
                                adjustExplorerVal = tmp;
                                adjustExplorerIndex = exi;
                            }
                        }
                    });
                    if (adjustExplorerIndex != undefined) {

                        var adjustExplorer = explorerList[adjustExplorerIndex];
                        adjustExplorer.height = adjustExplorer.height - explorerMinHeight + h;
                        //主动调整高度
                        if (adjustExplorer.setHeight) {
                            adjustExplorer.setHeight(adjustExplorer.height);
                        }
                        explorer.height = explorerMinHeight;
                      
                        return explorerMinHeight;
                    } else {
                        console.log("adjustExplorerIndex is null");
                    }
                    return -1;
                } else {
                    explorer.height = h;
                    return h;
                }
            } else {
                totalHeight += height;
                explorer.height = height;
                return height;
            }
        } else {
            totalHeight -= explorer.height;
            return -1;
        }

    };
}

var showExplorers: Array<string> = ["sidebar_catalog", "sidebar_component"];


/**
 * char count
 */
export function getChartCount(text: string, char: string): number {
    var count = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i] == char) {
            count++;
        }
    }
    return count;
}

export function toggleExplorer(key: string, hide: boolean) {
    var explorer = document.getElementById(key);
    var title = explorer.getElementsByClassName("explorer_title")[0];
    var view: any = explorer.getElementsByClassName("explorer_view")[0];
    var icon = title.getElementsByTagName("i")[0];

    if (hide) {
        view.style.display = "none";
        icon.className = "bi bi-chevron-right";
    } else {

        view.style.display = "block";
        icon.className = "bi bi-chevron-down";
    }
}

export function renderExplorer(key: string, content: HTMLElement, name: string, hide?: boolean, taps?: IMenuItem[], onHide?: (key: string, hide: boolean) => void): HTMLDivElement {
    var explorer = document.createElement("div");
    explorer.className = "explorer";
    explorer.id = key;
    content.appendChild(explorer);

    var title = document.createElement("div");
    title.className = "explorer_title";

    var icon = document.createElement("i");
    icon.className = "explorer_icon bi bi-chevron-right";
    icon.style.marginLeft = "5px";
    icon.style.paddingRight="3px";
    title.appendChild(icon);


    var label = document.createElement("div");
    if (/\[\S+\]/.test(name)) {
        label.id = name.substring(1, name.length - 1);
    } else {
        label.innerText = name;
    }

    title.appendChild(label);
    label.style.flex = "1";

    explorer.appendChild(title);
    var view = document.createElement("div");
    view.className = "explorer_view";

    explorer.appendChild(view);

    if (hide) {
        view.style.display = "none";
        icon.style.transform = "rotate(0deg)";
    } else {
        icon.style.transform = "rotate(90deg)";
    }

    label.onclick = (e: MouseEvent) => {
        if (view.style.display == "none") {
            view.style.display = "block";
            icon.style.transform = "rotate(90deg)";

            if(onHide){
                onHide(key,false);
            }
        } else {
            view.style.display = "none";
            icon.style.transform = "rotate(0deg)";

            if(onHide){
                onHide(key,true);
            }
        }
    }

    if (taps != undefined) {
        var tapsDiv = document.createElement("div");
        tapsDiv.style.paddingRight = "5px";
        tapsDiv.style.display = "flex";
        title.appendChild(tapsDiv);
        taps.forEach((tap: IMenuItem) => {

            //renderTap(tapsDiv, tap.label, tap.icon, tap.onclick);
        });
    }

    var body = document.createElement("div");
    body.className = "explorer_body";

    var solider = document.createElement("div");
    solider.className = "explorer_solider";

    solider.onmousedown = (ed: MouseEvent) => {

        var startY = ed.clientY;
        var bodyH = body.clientHeight;
        var move: boolean = true;
        document.onmousemove = (em: MouseEvent) => {
            if (move) {
                var y = em.clientY - startY;
                var height = bodyH + y;

                body.style.height = height + "px";
            }
        }
        document.onmouseup = () => {
            move = false;

        }

    };


    view.appendChild(body);
    view.appendChild(solider);

    return body;

}
