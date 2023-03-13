/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染主窗口
***************************************************************************** */
import { ipcRenderer } from "electron";
import { getPathKey, renderComponent } from "../common/components";
import { onContextMenu } from "../common/contextmenu";
import { getUUID, ICatalog, IComponent, IPage, IProject } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { renderFloatPanel, updateFloatPanel } from "../render/floatPanel";

import { activePropertyPanel, renderPropertyPanel } from "./propertypanel";
import { renderSidebar, updateSidebar } from "./sidebar";
import { renderStatusBar } from "./statusBar";
import { renderToolbar, updateToolbar } from "./toolbar";
import { findCurPageComponent, getCurPage, getCurPageContent, getLayers, getSelectComponents, loadProjectTitleNav, renderPage, setSelectComponents, updatePageViewScrollH } from "./workbench";
var project: IProject;
export function getProject(): IProject {
    return project;
}
var config: any
export function getConfig() {
    return config;
}
export function setConfig(key: string, value: any) {
    config[key] = value;
}
export function saveConfig() {
    ipcRendererSend("saveConfig", config);
}
/**
 * 监听主窗口
 * @param app 
 */
export function renderWorkSpace(app: HTMLElement) {
    layout(app);
    onContextMenu();
    requestIdleCallback(() => {
        //import * as shorcuts from "./shorcuts";
        const shorcuts = require("./shorcuts");
        shorcuts.init();
        // var page:IPage={key:"projects",name:"Get Started",theme:"light",type:"projects",path:"projects"};
        // renderPage(page);
    });

    ipcRenderer.send("windowsLoaded");
    ipcRenderer.on("_openProjects",()=>{
        var page:IPage={key:"projects",name:"Get Started",type:"projects",path:"projects"};
        renderPage(page);
    })

   // ipcRendererSend("readProject");
    ipcRenderer.on("_readConfig", (event: any, arg: any) => {
        console.log("_readConfig", arg);
        config = arg;
        app.setAttribute("data-platform", process.platform);
        app.className = config.theme;
        app.setAttribute("data-colorfull",arg.colorfull);
        // renderRecent();
       // renderStatusBar();
    
    });
    ipcRenderer.send("readConfig");

    ipcRenderer.on("_readProject", (event, arg) => {
        console.log("_readProject", arg);
        document.title = arg.name + " - " + arg.path;
        project = arg;
      
        //切换主题色
        document.body.style.cssText = "--theme-color:" + getProject().themeColor + ";" + "--light-color:" + getProject().lightColor;
        var page:IPage={key:"pages",name:arg.name,type:"pages",path:"pages"};
        renderPage(page);

        requestIdleCallback(() => {
            loadProjectTitleNav();
            updateToolbar();
            updateSidebar({type:"project",data:project});
            // activePropertyPanel("project");
            updateFloatPanel(undefined);
        });

    })

    ipcRenderer.on("_openPage", (event, arg: IPage) => {
      
        if (arg == undefined) {
            showMessageBox("页面不存在", "info");
        } else {
            console.log("---OpenPage---", Date.now(), arg);
            renderPage(arg);
        }

    })

    ipcRenderer.on("_savePage", (event, arg: IPage) => {
        showMessageBox("页面保存成功", "info");
    })

    //插入图片
    ipcRenderer.on("_insertImage", (event, arg) => {
        console.log("_insertImage", arg);

        if (typeof arg == "string" && arg.startsWith("cover.")) {
            //插入封面
            project.cover = arg;
            var cover: any = document.getElementById("project_cover");
            cover.src = getProject().work + "/images/" + project.cover + "?" + Date.now();
            ipcRendererSend("saveProject", project);

        } else
            if (arg.length > 0 && getCurPage() != undefined) {
                arg.forEach((name: string) => {
                    var component: IComponent = {
                        type: "image",
                        key: getUUID(),
                        icon: "bi bi-card-image",
                        label: "图片",
                        style: "display:inline-block;width:400px;",

                        property: [
                            { label: "src", name: "src", type: 'text', context: name }
                        ],
                        onPreview: () => {
                            return document.createElement("div");
                        }, onRender: (component: IComponent, element: any, content, type) => {
                            var img;
                            if (element != undefined)
                                img = element;
                            else
                                img = document.createElement("img");
                            if (component.property.length > 0) {
                                if (type != "product") {
                                    img.src = getProject().work + "/images/" + component.property[0].context;
                                } else {
                                    img.src = "./images/" + component.property[0].context;
                                }
                            }

                            // pi.className = "bi bi-" + icon;
                            return { root: img, content: img }
                        }
                    };
                    var iPage = true;
                    //  import { renderComponent } from "../common/components";
                    const components = require("../common/components");
                    if (getSelectComponents().length == 1) {
                        var parent = findCurPageComponent(getSelectComponents()[0]);
                        if (parent != undefined && parent.type == "images") {
                            //如果是组件是 图片组 ，则直接插入
                            parent.option += name + "\n";
                            iPage = false;
                            parent.onRender(parent, document.getElementById(parent.key));

                        } else if (parent != undefined && parent.drop == "component") {
                            iPage = false;
                            if (parent.children == undefined) parent.children = [];
                            parent.children.push(component);
                            activePropertyPanel();

                            components.renderComponent(document.getElementById(parent.key), component);

                        }
                    }
                    if (iPage) {
                        getCurPage().children.push(component);
                        activePropertyPanel();

                        components.renderComponent(getCurPageContent(), component);

                    }
                });
            }
    })
}

export function getViewPosition():{
    top:number,right:number,bottom:number,left:number
}{
    var rs={
        top:32+32,
        left:240,
        right:document.getElementById("edgePanel").clientWidth,
        bottom:document.getElementById("floatPanel").clientHeight+22
    }
    return rs;
}
function layout(app: HTMLElement) {

    var edgePanelWidth=300;
    //标题工具栏
    var toolBarHeight: number = 32;//60;
    var toolBar = document.createElement("div");
    toolBar.id = "toolBar";
    toolBar.style.height = toolBarHeight + "px";
    toolBar.style.position = "fixed";
    toolBar.style.width = "100%";
    toolBar.style.overflow = "hidden";
    toolBar.style.zIndex="100";
    toolBar.className="surface";
    app.appendChild(toolBar);
 
    toolBar.ondragover=(e)=>{
        e.preventDefault();     
    }
    toolBar.ondrop=(e)=>{
        e.preventDefault();
        var files=e.dataTransfer.files;
        if(files.length>0){
            var file=files[0];
            var page:IPage={key:file.path,name:file.name,type:"editor",path:file.path};
            renderPage(page);

        }
    
    }

    //状态栏
    var statusBarHeight = 22;
    var statusBar = document.createElement("div");
    statusBar.className = "statusBar";
    statusBar.id = "statusBar";
    statusBar.style.zIndex="100";
    app.appendChild(statusBar);


    //侧边栏
    var sideBarWidth=240;
    var sideBar = document.createElement("div");
    sideBar.style.top = toolBarHeight + "px";
    sideBar.style.position = "fixed";
    sideBar.style.width = sideBarWidth+"px";
    sideBar.style.bottom = statusBarHeight + "px";
    sideBar.style.overflow = "hidden";
    sideBar.style.zIndex="100";
    sideBar.className="surface";
    app.appendChild(sideBar);




    var floatPanelHeight = 210;
    //工作台
    var workbench = document.createElement("div");
    workbench.id = "workbench";
    workbench.style.position = "absolute";
    workbench.style.inset="0";
    workbench.style.zIndex="0";
    app.appendChild(workbench);


    var tabsHeight = 32;

    var row = document.createElement("div");
    row.id = "workbench_row";
    row.style.display = "flex";
    row.style.height = tabsHeight + "px";
    row.style.position = "fixed";
    row.style.top = toolBarHeight+"px";
    row.style.left = sideBarWidth + "px";
    row.style.right =  edgePanelWidth+ "px";
    row.style.overflow = "hidden";
    row.style.zIndex="99999";
    row.className="surface";

    app.appendChild(row);
    //多标签页面
    var tabs = document.createElement("div");
    tabs.className = "workbench_tabs";
    tabs.id = "workbench_tabs";
    tabs.style.display = "flex";
    tabs.style.userSelect = "none";
    tabs.style.height = tabsHeight + "px";
    tabs.style.flex = "1";
    row.appendChild(tabs);

    tabs.ondblclick = () => {
      
    }

    //工具栏
    var tools = document.createElement("div");
    tools.id = "workbench_tools";
    tools.style.display = "flex";
    tools.style.height = tabsHeight + "px";
    row.appendChild(tools);
    //多标签页面
    var pages = document.createElement("div");
    pages.className = "workbench_pages";
    pages.id = "workbench_pages";
    pages.style.position = "fixed";
    pages.style.inset = "0px";
  
    workbench.appendChild(pages);

    //
    onSelect(pages);

    //最近使用页面
    // var recent = document.createElement("div");
    // recent.className = "project_recent";
    // recent.id = "project_recent";
    // recent.style.top = toolBarHeight + "px";
    // recent.style.position = "fixed";
    // recent.style.right = edgePanelWidth+"px";
    // recent.style.left = sideBarWidth+"px";
    // recent.style.bottom = statusBarHeight + "px";
    // app.appendChild(recent);

    //扩展页面
    var expand = document.createElement("div");
    expand.className = "project_expand";
    expand.id = "project_expand";

    expand.style.top = toolBarHeight + "px";
    expand.style.position = "fixed";
    expand.style.right = edgePanelWidth+"px";
    expand.style.bottom = statusBarHeight + "px";
    app.appendChild(expand);

    var expandContent = document.createElement("div");
    expandContent.className = "expandContent";
    expandContent.id = "expandContent";
    expandContent.style.position = "absolute";
    expand.appendChild(expandContent);

    var expandCatalog = document.createElement("div");
    expandCatalog.className = "expandCatalog";
    expandCatalog.id = "expandCatalog";
    expandCatalog.style.position = "absolute";
    expand.appendChild(expandCatalog);



    // expand.ondblclick=()=>{
    //     expand.style.display="none";
    // }
    expand.oncontextmenu = () => {
        expand.style.display = "none";
    }
    // //工作区 左侧 阴影线
    // var leftShadow = document.createElement("div");
    // leftShadow.id = "left_shadow";
    // leftShadow.style.position = "fixed";
    // leftShadow.style.left = "-10px";
    // leftShadow.style.top = "32px";
    // leftShadow.style.bottom = "0px";
    // leftShadow.style.width = "10px";

    // app.appendChild(leftShadow);

  
    //底部栏
    var floatPanel = document.createElement("div");
    floatPanel.id = "floatPanel";
    floatPanel.style.position="fixed";
    floatPanel.style.right = edgePanelWidth+"px";
    floatPanel.style.left =  sideBarWidth+"px";
    floatPanel.style.bottom = statusBarHeight+"px";
    floatPanel.style.height = floatPanelHeight + "px";
    floatPanel.style.zIndex="100";
    floatPanel.className="surface";
    app.appendChild(floatPanel);
   


    //右侧栏
 
    var edgePanel = document.createElement("div");
    edgePanel.id = "edgePanel";
    edgePanel.style.position="fixed";
    edgePanel.style.right = "0px";
    edgePanel.style.top =  toolBarHeight+"px";
    edgePanel.style.bottom = statusBarHeight+"px";
    edgePanel.style.overflow="hidden";
    edgePanel.style.width = edgePanelWidth+"px";
    edgePanel.style.zIndex="100";
    edgePanel.className="surface";
    app.appendChild(edgePanel);

    renderToolbar(toolBar);
    renderSidebar(sideBar);
    renderFloatPanel(floatPanel);
    renderPropertyPanel(edgePanel);
    renderStatusBar();

    requestIdleCallback(() => {
       // loadProjectTitleNav();
        renderRightSilderBar(app, 64,edgePanel.clientWidth,floatPanelHeight+statusBarHeight);
    });
}

/**
 * 渲染右侧侧边栏 滚动条
 * @param content 
 * @param h 
 */
function renderRightSilderBar(content: HTMLElement, t: number,r:number,b:number) {

    var silderBar = document.createElement("div");
    silderBar.className = "silderBarV";
    silderBar.id="silderBarV";
    silderBar.style.top=t+"px";
    silderBar.style.right=r+"px";
    silderBar.style.bottom=b+"px";


    content.appendChild(silderBar);
    var silderBarBlock = document.createElement("div");
    silderBarBlock.className = "silderBarBlockV";
    silderBar.appendChild(silderBarBlock);
    silderBarBlock.onmousedown = (ed: MouseEvent) => {
        var edgePanel= document.getElementById("edgePanel");
        var propertyWidth =edgePanel.clientWidth;
        var startX = ed.clientX;
        var move: boolean = true;
        document.onmousemove = (em: MouseEvent) => {
            if (move) {
                var x = em.clientX - startX;
                var width = propertyWidth - x;
                if (width < 20)
                    width = 20;
                //  document.getElementById("workbench").style.width = (width) + "px";
                edgePanel.style.width = (width) + "px";
                silderBar.style.right=width+"px";
            }
        }
        document.onmouseup = () => {
            move = false;
            updatePageViewScrollH();
        }
    };
}



/**
 * 展示提示信息
 * @param message 
 * @param type 
 */
export function showMessageBox(message: string, type: "info" | "error" | "warning" | "question" | "none") {
    ipcRendererSend("show-notification", message);
}

export function getPageByPath(pagePath: string, catalogs: ICatalog[]) {
    for (var index in catalogs) {
        var cl = catalogs[index];

        if (cl.path == pagePath) {
            return cl;

        } else if (cl.children != undefined && cl.children.length > 0) {
            var p: any = getPageByPath(pagePath, cl.children);
            if (p != undefined) {
                return p;
            }
        }
    }

}
/**
 * 渲染扩展组件
 * @param component 
 */
export function renderExpand(component: IComponent) {
    console.log(component);
    var expandContent = document.getElementById("expandContent");
    var project_expand = document.getElementById("project_expand");
    expandContent.innerHTML = "";
    requestIdleCallback(() => {
        var root = renderComponent(expandContent, component).root;
        expandContent.style.width = (root.clientWidth + 20) + "px";
        project_expand.style.width = (root.clientWidth + 20) + "px";
    })
}
/**
 * 渲染扩展组件
 * @param component 
 */
export function openExpand() {
    var layers = getLayers();
    if (layers == undefined || layers.length == 0) return;
    var expand = document.getElementById("project_expand");
    expand.style.display = "block";
    var expandCatalog = document.getElementById("expandCatalog");
    expandCatalog.innerHTML = "";


    // console.log("layers", layers);
    layers.forEach((layer: IComponent) => {
        renderLayersTree(layer, expandCatalog);
    });



}
function renderLayersTree(layer: IComponent, expandCatalog: HTMLElement) {
    if (layer.isExpand) {
        var component_item = document.createElement("div");
        component_item.style.margin = "10px";
        component_item.style.cursor = "pointer";
        component_item.title = layer.label;
        component_item.style.display = "inline-block";
        var component_item_icon = document.createElement("i");
        component_item_icon.className = layer.icon;
        component_item.appendChild(component_item_icon);
        expandCatalog.appendChild(component_item);
        component_item.onclick = () => {
            if (layer.isExpand) {
                renderExpand(layer);
                activePropertyPanel(layer);
            }
        }
    }
}

function onSelect(pages: HTMLElement) {
    //渲染 页面 选择效果
    pages.onmousedown = (e: any) => {
        if (e.button != 0) {
            return;
        }

        if (e.target.className == "workbench"||e.target.className == "page_view" || e.target.className == "component" || e.target.className == "page" || e.target.className == "grid"){
            e.stopPropagation();
            var selectCover = document.createElement("div");
            selectCover.className = "selectCover";
            selectCover.id = "selectCover";
            selectCover.style.pointerEvents = "none";
            getSelectComponents().forEach(s => {
                var div = document.getElementById(getPathKey(s));
                if (div) div.removeAttribute("selected");
            })
            setSelectComponents([]);

            var x = e.clientX;
            var y = e.clientY;
            var h = 0;
            var w = 0;
            var select = true;
            selectCover.style.left = x + "px";
            selectCover.style.top = y + "px";
            pages.onmousemove = (e) => {
                if (!select) return;
                if (!document.getElementById("selectCover")) { document.body.appendChild(selectCover); }
                w = e.clientX - x;
                h = e.clientY - y;
                if (w >= 0) {
                    selectCover.style.width = w + "px";
                } else {
                    selectCover.style.left = e.clientX + "px";
                    selectCover.style.width = (x - e.clientX) + "px";
                }
                if (h >= 0) {
                    selectCover.style.height = h + "px";
                } else {
                    selectCover.style.top = e.clientY + "px";
                    selectCover.style.height = (y - e.clientY) + "px";
                }
            };
            document.onmouseup = () => {
                select = false;
                selectCover.remove();
            }

            //右侧面板
            activePropertyPanel("page");

        }
    }
}