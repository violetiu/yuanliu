/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染工具栏
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IComponent, IPage } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { getTitleBar } from "./pageTitle";
import { clearDelete, getCurPage, reRenderPage } from "./workbench";
import { getProject, showMessageBox } from "./workspace";

import { renderExport } from "../dialog/export";
import { showStatusLoadding } from "./statusBar";
export function updateTitlebar() {


    document.getElementById("app_title").innerText = getProject().name + " - " + getProject().path;
}

export function renderTitlebar(content: HTMLElement) {

    if (process.platform != "darwin") {
        renderWin32TitleBar(() => {
            ipcRendererSend("min");
        }, () => {
            ipcRendererSend("max");
        }, () => {
            ipcRendererSend("close");
        });

    } else {
        //touchbar
        ipcRenderer.on("touchBar_save", (event: any, arg: any) => {

            saveSimplePage(getCurPage(true));
        });
        ipcRenderer.on("touchBar_fresh", (event: any, arg: any) => {

            reRenderPage();
        });
        ipcRenderer.on("touchBar_build", (event: any, arg: any) => {
            showStatusLoadding("save page");
            ipcRendererSend("build", getProject().name);
        });
        ipcRenderer.on("touchBar_preview", (event: any, arg: any) => {
            ipcRendererSend("startPreview", "");

        });
        ipcRenderer.on("touchBar_export", (event: any, arg: any) => {

            renderExport();
        });
    }

    content.style.display="flex";

    var titleBar = document.createElement("div");
    titleBar.className = "titleBar";
    content.appendChild(titleBar);




    // var logoIcon = document.createElement("i");
    // logoIcon.className = "bi bi-palette2";
    // logoIcon.style.fontSize = "13px";
    // logoIcon.style.padding = "0px 5px 0px 5px";
    // titleBar.appendChild(logoIcon);


    // toolBar.appendChild(toolsBar);




    var menuBar = document.createElement("div");
    menuBar.className = "menuBar";
    titleBar.appendChild(menuBar);
    //    renderMenuBar(menuBar, menulist);

    var app_title = document.createElement("div");
    app_title.id = "app_title";
    app_title.className = "app_title";
    app_title.style.userSelect = "none";
    //
    content.appendChild(app_title);


    //

    var toolBar=document.createElement("div");
    toolBar.style.paddingRight="5px";
    content.appendChild(toolBar);
    renderTaps(toolBar, tools);

    if (process.platform == "darwin") {
        titleBar.style.paddingLeft = "80px";
    }else{
        toolBar.style.paddingRight = "100px";
    }


    ipcRenderer.on("_saveAs", (e, arg) => {

        showMessageBox("保存成功", "info");

    });
    ipcRenderer.on("_save", (e, arg) => {

        showMessageBox("保存成功", "info");

    });
    ipcRenderer.on("_push", (e, arg) => {

        showMessageBox(arg, "info");

    });
    ipcRenderer.on("_pull", (e, arg) => {

        showMessageBox(arg, "info");

    });
    ipcRenderer.on("_build", (e, arg) => {

        if (arg)
            showMessageBox("构建成功", "info");
        else
            showMessageBox("构建失败", "info");

    });
}
const noSaveAttrs: Array<string> = ["drop", "group", "edge", "isRoot", "level", "isDir", "isOpen"];
export const styleTransform: Array<Array<string>> = [
    ["flex", "f"],
    ["background", "b"],
    ["border-radius", "br"],
    ["padding", "d"],
    ["height", "h"],
    ["width", "w"],
    ["margin", "m"],
    ["shadow", "s"],
    ["border", "r"],
    ["text-align", "ta"],
    ["color", "c"],
    ["position", "p"],
    ["font-weight", "fw"],
    ["white-space", "ws"],
    ["font-size", "fs"],
    ["display", "di"],
    ["cursor", "cu"]
];
export function saveSimplePage(page: IPage) {

    console.log("SavePage")
    console.log("page.type is " + page.type);
    //判断是否是title
    if (page.type == "title") {
        if (page.children != undefined) {
            clearDelete(page.children);
            page.change = false;
        }
        getTitleBar().page = page;
        console.log(getTitleBar());
        //标题
        ipcRendererSend("saveTitle", JSON.stringify(getTitleBar()));
    } else {
        //普通页面
        if (page.children != undefined) {
            clearDelete(page.children);
            page.change = false;
            var tab = document.getElementById("page_tab_" + page.key);
            if (tab != undefined) {
                tab.setAttribute("changed", "false");
            }
            ipcRendererSend("savePage", {
                page: JSON.stringify(page, (key, value) => {
                    if (key == "style" || key == "styles") {

                        var old = value;
                        if (old != undefined && old.length > 0) {
                            styleTransform.forEach(trans => {
                                var rg = RegExp(trans[0] + ":", "g");
                                old = old.replace(rg, "[" + trans[1] + "]")
                            })
                        }
                        return old;
                    } else
                        if (noSaveAttrs.indexOf(key) < 0) {
                            return value;
                        }

                }), path: page.path
            });

            //页面截图 保存
            const domToImage = require("dom-to-image");
            var dom = document.getElementById("page_view_" + page.key);
            var target: any = dom.getElementsByClassName("page_parent_content").item(0);

            requestIdleCallback(() => {

                domToImage.toJpeg(target, { quality: 0.002 })
                    .then((jpeg: any) => {

                        ipcRendererSend("savePageJpeg", { key: page.key, data: jpeg });

                    })
            });




        }
    }
}
function savePage() {

    // if (getTitleBar() != undefined)
    //     ipcRendererSend("saveTitle", JSON.stringify(getTitleBar()));
    // if (getNavBar() != undefined)
    //     ipcRendererSend("saveNav", JSON.stringify(getNavBar()));

    // if(getProject().path.startsWith("http")||getProject().path.startsWith("ssh")){
    //     showMessageBox("保存成功", "info");
    // }else{
    //     setTimeout(() => {

    //        ipcRendererSend("save");

    // }, 500);
    // }
    // work至文件中 如果是git项目不需要
    // console.log("save");

}



const tools = [
    {
        taps: [{
            key: "tool_fresh", label: "刷新", icon: "bi bi-arrow-clockwise", onTaped: (component: IComponent) => {
                reRenderPage();

            }
        },
        {
            key: "tool_save", label: "保存页面", icon: "bi bi-file-post", onTaped: (component: IComponent) => {
                saveSimplePage(getCurPage(true));
            }
        }

        ]
    },


    { type: "sperator" },
   
    {
        label: "",
        taps: [


            {
                key: "tool_build", label: "编译", icon: "bi bi-hammer", onTaped: (component: IComponent) => {
                    ipcRendererSend("build", getProject().name);
                }
            }, {
                key: "tool_preview", label: "预览", icon: "bi bi-play-circle", onTaped: (component: IComponent) => {
                    ipcRendererSend("startPreview", "");
                }
            }

        ]
    },
    { type: "sperator" },
    {
        label: "",
        taps: [


            {
                key: "tool_export", label: "导出", icon: "bi bi-download", onTaped: (component: IComponent) => {
                    // ipcRendererSend("export", "");
                    renderExport();
                }
            }
        ]
    }
]

function renderTaps(content: HTMLElement, tools: Array<any>) {
    content.innerHTML = "";
    content.style.display = "flex";
    content.style.alignItems = "center";
    // content.style.paddingTop = "5px";
    tools.forEach(group => {
        var groupDiv = document.createElement("div");

        if (group.type == "flex") {
            groupDiv.style.flex = "1";
        } else
            if (group.type == "sperator") {
                groupDiv.style.borderLeft = "1px solid";
                groupDiv.style.height = "10px";
                groupDiv.style.opacity = "0.2";

            } else {
                groupDiv.className = "tool_group";

                group.taps.forEach((tap: any) => {

                    var tapDiv = document.createElement("div");
                    tapDiv.id = tap.key;
                    tapDiv.className = "tool_tap";
                    tapDiv.title = tap.label;
                    tapDiv.onclick = () => {
                        tap.onTaped();

                        if (tap.renderIcon != undefined) {
                            tapIcon.className = tap.renderIcon();
                        }
                    };
                    groupDiv.appendChild(tapDiv);
                    var tapIcon = document.createElement("i");
                    tapIcon.style.fontSize = "12px";
                    tapIcon.className = tap.icon;
                    if(tap.key=="tool_preview")
                    tapIcon.style.color="blueviolet";
                    tapDiv.appendChild(tapIcon);

                    if (tap.renderIcon != undefined) {
                        tapIcon.className = tap.renderIcon();
                    }


                });
            }
        content.appendChild(groupDiv);


    });



}

export function renderWin32TitleBar(min: () => void, max: () => void, close: () => void) {
    var titleBar = document.createElement("div");
    document.getElementById("app").appendChild(titleBar);
    titleBar.style.position = "fixed";
    titleBar.style.top = "0";
    titleBar.style.display = "flex";
    titleBar.style.right = "0";
    titleBar.style.zIndex = "9999";
    var minTap = document.createElement("div");
    minTap.className = "titleBarTap";
    var minTapIcon = document.createElement("i");
    minTapIcon.className = "bi bi-dash-lg";
    minTap.appendChild(minTapIcon);
    minTap.onclick = min;
    var closeTap = document.createElement("div");
    closeTap.className = "titleBarTap";
    var closeTapIcon = document.createElement("i");
    closeTapIcon.className = "bi bi-x-lg";
    closeTap.appendChild(closeTapIcon);
    closeTap.onclick = close;

    var maxTap = document.createElement("div");
    maxTap.className = "titleBarTap";
    var maxTapIcon = document.createElement("i");
    maxTapIcon.className = "bi bi-square";
    maxTap.appendChild(maxTapIcon);
    maxTap.onclick = max;

    titleBar.appendChild(minTap);
    titleBar.appendChild(maxTap);
    titleBar.appendChild(closeTap);





}