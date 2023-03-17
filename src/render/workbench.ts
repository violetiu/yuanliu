

/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染工作区
***************************************************************************** */
import { clipboard, ipcRenderer } from "electron";
import { regeditTheme } from "../echarts/theme";

import { onAddComponents } from "../common/componentEvent";
import { copyComponent, deleteComponent, getComponentsTemplate, getComponentTempateByType, initComponent, renderComponent, renderComponentPreview, renderComponents, renderRootComponents, renderStorePreview } from "../common/components";
import { IMenuItem, openContextMenu } from "../common/contextmenu";
import { getUUID, IBackground, ICatalog, IComponent, IPage, ITitle } from "../common/interfaceDefine";
import { onOpenPage, onSwitchPage } from "../common/pageEvent";
import { isDark } from "../dialog/picker";
import { renderPagesPage } from "../plugins/pages/pages";
import { renderProjectsPage } from "../plugins/pages/projects";
import { ipcRendererSend } from "../preload";
import { getMousePosition } from "../render/shorcuts";
import * as dargData from "./DragData";
import { INavItem, renderNavTrees } from "./pageNav";
import { renderTitleBar } from "./pageTitle";
import { activePropertyPanel, setComponentStyle } from "./propertypanel";
import { saveSimplePage } from "./toolbar";
import { getConfig, getProject, getViewPosition, openExpand, renderExpand } from "./workspace";
import { renderMarkDownPage } from "../plugins/pages/markdown";
import { renderEditorPage } from "../plugins/pages/editor";
import { renderDataDesignerPage } from "../plugins/pages/datadesigner";

export function openPage(catalog: ICatalog) {

    var page = pages.find(p => p.path == catalog.path);
    if (page != undefined) {
        renderPage(page);
    } else {
        ipcRendererSend("openPage", catalog);
    }
}


/**
 * 获取当前页面展示上下文div
 * @returns 
 */
export function getCurPageContent(): HTMLElement {
    var content = document.getElementById("page_content_" + getCurPage().key);
    return content;
}
export function getCurViewContent(): HTMLElement {
    var content = document.getElementById("page_view_" + getCurPage().key);
    return content;
}
var dragTimerCount: number = 0;
var dragTimer: any;
export function getDragTimer() {
    return dragTimerCount;
}
export function startDargTimer() {
    clearDargTimer();
    dragTimer = setInterval(() => {
        dragTimerCount++;
    }, 100);

}
export function clearDargTimer() {
    dragTimerCount = 0;
    if (dragTimer != undefined) {
        clearInterval(dragTimer);
    }

}

/**
 * 获取当前页面组件
 * @returns 
 */
export function getPageLayers() {
    return getCurPage().children;

}
/**
 * 删除组件
 * @param comments 
 */
export function clearDelete(comments: IComponent[]) {
    var i = 0;
    while (i < comments.length) {
        if (comments[i].isRemoved) {
            console.log("delete", i);
            comments.splice(i, 1);
        } else {

            if (comments[i].children != undefined) {
                clearDelete(comments[i].children);
            } i++;
        }
    }
}
/**
 * 寻找当前页面的组件 按照 组件的path
 * @param path 
 * @returns 
 */
export function findCurPageComponent(path: string): IComponent {
    try {
        var page = getCurPage();
        if (page == undefined || page.children == undefined || page.children.length == 0)
            return undefined;
        var keys = path.split("/");
        if (keys.length == 1) {
            return page.children.find(c => c.key == keys[0]);
        }
        var parent: any = page;
        keys.forEach(key => {
            parent = parent.children.find((c: IComponent) => c.key == key);
        })
        return parent;
    } catch (e) {
        return undefined;
    };

}
export function getCurPageKey() {
    return selectPageKey;
}
/**
 * 获取当前页面
 * @returns 
 */
export function getCurPage(iSort?: boolean) {

    var page = pages.find(p => p.key == selectPageKey);
    if (page != undefined) {
        if (page != undefined && page.blues == undefined) {
            page.blues = [];
        }
        if (page != undefined && page.blueLinks == undefined) {
            page.blueLinks = [];
        }
        if (page != undefined && page.children != undefined) {
            //sort
            if (iSort)
                component_sort(page.children);
        }
        return page;
    }
    return undefined;
}
export function setCurPage(page: any) {

    var old = pages.findIndex(p => p.key == page.key)
    pages.splice(old, 1, page);

}
/**
 * 组件排序
 * @param comments 
 * @param parent 
 * @returns 
 */
export function component_sort(comments: IComponent[], parent?: IComponent) {
    for (var s = 0; s < comments.length; s++) {
        if (comments[s] == undefined) {
            return;
        }
        //初始化路径
        if (parent == undefined) {
            comments[s].path = comments[s].key;

        } else {
            comments[s].path = parent.path + "/" + comments[s].key;
        }
        comments[s].sort = s;
        if (comments[s].children != undefined) {
            component_sort(comments[s].children, comments[s]);
        }
    }

}
//项目标题栏
var projectTitleJson: any;
//项目导航栏
var projectNavJson: any;
export function getProjectTitleJson(): ITitle {
    return projectTitleJson;
}
export function getProjectNavJson() {
    return projectNavJson;
}
export function setProjectNavJson(json: any) {
    return projectNavJson = json;
}
export function setProjectTitleJson(json: any) {
    return projectTitleJson = json;
}
/**
 * 加载标题栏
 */
export function loadProjectTitleNav() {
    ipcRenderer.removeListener("_readTitleNav", () => { });
    ipcRendererSend("readTitleNav");
    ipcRenderer.on("_readTitleNav", (event: any, arg: any) => {
        console.log(arg);
        projectNavJson = arg.nav;
        projectTitleJson = arg.title;


    })
}
/**
 * 刷新页面
 */
export function reRenderPage() {
    var page = getCurPage();
    var body = document.getElementById("page_content_" + selectPageKey);
    var nav_bar = document.getElementById("nav_bar_" + selectPageKey);

    var width = page.width;
    if (nav_bar != undefined) {
        width = page.width - nav_bar.clientWidth;
    }

    renderPageBody(body, page, width, page.height, undefined);
    //   renderWorkbench(view, projectTitleJson, projectNavJson, page);
    try {
        var title_bar: any = getCurViewContent().getElementsByClassName("title_bar")[0];
        renderTitleBody(title_bar, getProjectTitleJson(), page.height);
    } catch (e) {
        console.log(e);
    }
}

export function closePage(spage: IPage) {

    var index = pages.findIndex(p => p.path == spage.path);
    if (index != -1) {
        pages.splice(index, 1);
    }
    var tab = document.getElementById("page_tab_" + spage.key);
    if (tab != undefined) {
        tab.remove();

    }
    var view = document.getElementById("page_view_" + spage.key);
    if (view != undefined) {
        view.remove();
    }
    if (pages.length > 0 && getProject() != undefined) {
        renderPage(pages[0]);
    }
    if (pages.length == 0 && getProject() != undefined) {

        activePropertyPanel("project");
        var page: IPage = { key: "pages", name: getProject().name, type: "pages", path: "pages" };
        renderPage(page);

    }


}

var pages: IPage[] = [];
var selectPageKey: string;
/**
 * 
 * @param page 渲染页面
 */
export function renderPage(page: IPage) {
    var workbenchtabs = document.getElementById("workbench_tabs");
    var workbenchpages = document.getElementById("workbench_pages");



    if (pages.findIndex(p => p.key == page.key) == -1) {


        if (pages.length >= 8) {
            //删除页面，并保存
            requestIdleCallback(() => {

                var index = 0;
                var rmPage = pages[0];
                if (rmPage.change) {
                    saveSimplePage(rmPage);
                }

                pages.splice(index, 1);
                var tab = document.getElementById("page_tab_" + rmPage.key);
                if (tab != undefined) {
                    tab.remove();

                }
                var view = document.getElementById("page_view_" + rmPage.key);
                if (view != undefined) {
                    view.remove();
                }

            });

        }





        //打开新页面

        pages.push(page);
        page.change = false;
        if (selectPageKey != undefined) {
            var tab = document.getElementById("page_tab_" + selectPageKey);
            if (tab != undefined) {
                tab.setAttribute("selected", "false");

            }
            var view = document.getElementById("page_view_" + selectPageKey);
            if (view != undefined) {
                view.style.display = "none";
            }
        }


        selectPageKey = page.key;
        //添加tab
        var pageTab = document.createElement("div");
        pageTab.style.display = "flex";
        pageTab.id = "page_tab_" + page.key;
        pageTab.className = "page_tab";
        pageTab.style.alignItems = "center";
        pageTab.style.justifyContent = "center";
        pageTab.style.padding = "0px 10px 0px 5px";
        workbenchtabs.style.overflow = "hidden";
        workbenchtabs.appendChild(pageTab);
        //tab icon
        var icon = document.createElement("i");
        icon.className = "bi bi-file-earmark";
        pageTab.appendChild(icon);
        //tab title
        var title = document.createElement("span");
        title.innerHTML = page.name;
        pageTab.onclick = () => {
            renderPage(page);
        }
        title.style.padding = "0px 5px 0px 5px";
        pageTab.appendChild(title);

        var button = document.createElement("div");
        button.style.width = "18px";
        button.style.overflow = "hidden";
        pageTab.appendChild(button);

        var changed = document.createElement("i");
        changed.className = "bi bi-dot";

        button.appendChild(changed);

        //contextmenu
        pageTab.oncontextmenu = (event: any) => {
            var menuList: IMenuItem[] = [
                {
                    label: "关闭", id: "close", accelerator: "Command+w", onclick: () => {
                        closePage(page);
                    }
                },
                {
                    label: "关闭全部", id: "closeall", onclick: () => {
                        //closePage(page);
                    }
                },
                {
                    label: "关闭其他", id: "closeother", onclick: () => {
                        //  closePage(page);
                    }
                }
            ];
            openContextMenu(menuList);
        }


        //tab close
        var close = document.createElement("i");
        close.className = "bi bi-x";
        button.appendChild(close);
        close.onclick = (e) => {
            e.stopPropagation();


            if ((page.type == "page" || page.type == "title") && page.change) {

                ipcRendererSend("isSave", { message: "是否保存 " + page.name, page: page.key });
                ipcRenderer.on("_isSave", (eve, arg) => {
                    var pageKey = arg.page;
                    var response = arg.response;
                    if (response == 0) {

                    } else if (response == 1) {
                        var spage = pages.find(p => p.key == pageKey);
                        saveSimplePage(spage);
                        closePage(spage);
                    } else if (response == 2) {
                        var spage = pages.find(p => p.key == pageKey);
                        spage.change = false;
                        closePage(spage);
                    }

                })

                // saveSimplePage(page);
            } else {
                closePage(page);
            }



        }

        pageTab.setAttribute("selected", "true");

        //添加页面
        var pageView = document.createElement("div");
        pageView.id = "page_view_" + page.key;
        pageView.className="workbench_page";
        pageView.style.position = "absolute";
        pageView.style.top = "0px";
        pageView.style.left = "0px";
        pageView.style.right = "0px";
        pageView.style.bottom = "0px";
        workbenchpages.appendChild(pageView);

        //渲染页面工作区
        if (page.type == "projects") {
            renderProjectsPage(pageView);

        } else if (page.type == "pages") {
            renderPagesPage(pageView);

        } else if (page.type == "markdown") {
            renderMarkDownPage(pageView, page.path);

        } else if (page.type == "editor") {
            renderEditorPage(pageView, page.path);

        }else if (page.type == "datadesigner") {
            //数据库设计
            renderDataDesignerPage(pageView);

        } else {
            page.top = undefined;
            page.left = undefined;
            renderWorkbench(pageView, projectTitleJson, projectNavJson, page);
        }


        //更新右侧、底部面板
        onOpenPage(page);


    } else {
        //切换页面
        if (selectPageKey != undefined) {
            var tab = document.getElementById("page_tab_" + selectPageKey);
            if (tab != undefined) {
                tab.setAttribute("selected", "false");


            }
            var view = document.getElementById("page_view_" + selectPageKey);
            if (view != undefined) {
                view.style.display = "none";
            }
        }

        selectPageKey = page.key;
        if (selectPageKey != undefined) {
            var tab = document.getElementById("page_tab_" + selectPageKey);
            if (tab != undefined) {
                tab.setAttribute("selected", "true");
            }
            var view = document.getElementById("page_view_" + selectPageKey);
            if (view != undefined) {
                view.style.display = "block";
            }
        }
        onSwitchPage(page);

    }
    requestIdleCallback(() => {
        var theme = "default";
        
        if (getConfig().theme!=undefined&&getConfig().theme == "dark") {
            theme = "dark";
        }
        regeditTheme();


    });


}
/**
* 调整界面内容的滚动 条 垂直的
*/
export function updatePageViewScrollV() {
    requestIdleCallback(() => {
        var viewPosition = getViewPosition();

        var workbench_row = document.getElementById("workbench_row");
        workbench_row.style.bottom = viewPosition.bottom + "px";

        var silderBarV = document.getElementById("silderBarV");
        silderBarV.style.bottom = viewPosition.bottom + "px";



        pages.forEach(page => {

            var page_view = document.getElementById("page_view_" + page.key);
            var sroll_v: any = page_view.getElementsByClassName("sroll_v")[0];
            if(sroll_v!=undefined)
            sroll_v.style.bottom = viewPosition.bottom + "px";

            var sroll_h: any = page_view.getElementsByClassName("sroll_h")[0];
            if(sroll_h!=undefined){
                sroll_h.style.bottom = viewPosition.bottom + "px";

                var sroll_v_block: any = sroll_v.children.item(0);
                var sroll_v_block_h = Math.pow(window.innerHeight - viewPosition.top - viewPosition.bottom, 2) / (page.height + 200);
                sroll_v_block.style.height = sroll_v_block_h + "px";
    

            }
     


        });
    });



}

/**
* 调整界面内容的滚动 条 水平的
*/
export function updatePageViewScrollH() {



    requestIdleCallback(() => {

        var viewPosition = getViewPosition();

        var workbench_row = document.getElementById("workbench_row");
        workbench_row.style.right = viewPosition.right + "px";

        var floatPanel = document.getElementById("floatPanel");
        floatPanel.style.right = viewPosition.right + "px";

        pages.forEach(page => {

            var page_view = document.getElementById("page_view_" + page.key);

            var sroll_v: any = page_view.getElementsByClassName("sroll_v")[0];
            if(sroll_v!=undefined)
            sroll_v.style.right = viewPosition.right + "px";

            var sroll_h: any = page_view.getElementsByClassName("sroll_h")[0];
            if(sroll_h!=undefined){
                sroll_h.style.right = viewPosition.right + "px";

                var sroll_h_block_w = Math.pow(window.innerWidth - viewPosition.left - viewPosition.right, 2) / (page.width + 200);
                sroll_h.children.item(0).style.width = sroll_h_block_w + "px";
            }
           

        });
    });


}


export function getLayers(): Array<IComponent> {
    if (getCurPage() == undefined) {
        return undefined;
    }

    return getCurPage().children;
}

export function pushLayer(component: IComponent): void {

    getCurPage().children.push(component);
}
export function getPagePostion(curPage: IPage, viewPosition: any): { left: number, top: number } {

    if (curPage.left == undefined) {
        curPage.left = viewPosition.left + 100;
    }

    if (curPage.top == undefined) {
        curPage.top = viewPosition.top + 100;
    }
    return { left: curPage.left, top: curPage.top };
}
function setPagePostion(curPage: IPage, parent: HTMLDivElement, left: number, top: number) {

    curPage.left = left;

    curPage.top = top;

    parent.style.transform = "translate(" + curPage.left + "px," + curPage.top + "px)";

}
/**
 *  //渲染页面工作区
 * @param content 
 * @param titleJson 
 * @param navJson 
 * @param p 
 */
export function renderWorkbench(content: HTMLElement, titleJson: any, navJson: any, p: IPage) {
    var start = Date.now();
    console.log("renderPage");
    var curPage = p;
    content.innerHTML = "";
    var scale = 1;
    if (p.scale != undefined) {
        scale = p.scale;
    }
    var workbench = document.createElement("div");
    workbench.className = "workbench";
    content.appendChild(workbench);
    workbench.onclick = () => {
        activePropertyPanel("page");
    }
    var ruler_show = true;
    var ruler_width = 20;
    var title_display: boolean = titleJson.display;
    var nav_display: boolean = navJson.display;
    var page_view = document.createElement("div");
    page_view.className = "page_view_" + p.key;
    if (ruler_show) {
        page_view.style.top = "0px";
        page_view.style.left = "0px";
    }
    workbench.appendChild(page_view);


    var pageHeight = 800;
    var pageWidth = 1200;
    if (curPage.height != undefined) pageHeight = curPage.height;
    if (curPage.width != undefined) pageWidth = curPage.width;
    //
    var page_parent = document.createElement("div");
    page_parent.id = "page_parent_" + p.key;
    page_parent.className = "page_parent " + getProject().theme;
    page_view.appendChild(page_parent);
    // page_parent.style.transform = "scale(" + scale + ")";


    var viewPosition = getViewPosition();
    var pagePosition = getPagePostion(curPage, viewPosition);
    setPagePostion(curPage, page_parent, pagePosition.left, pagePosition.top);



    var page_parent_content = document.createElement("div");
    page_parent_content.id = "page_parent_content_" + p.key;
    page_parent_content.className = "page_parent_content";
    page_parent.appendChild(page_parent_content);


    var page_bg = document.createElement("canvas");
    page_bg.id = "page_bg_" + p.key;
    page_bg.className = "page_bg";
    page_parent_content.appendChild(page_bg);



    //工作区 缩放
    // page_view.onwheel = function (ew) {
    //     if (getKeyCode() == "Control") {
    //         scale += ew.deltaY / 1000;
    //         scale = Math.round(scale * 100) / 100;
    //         if (scale < 0.1) {
    //             scale = 0.1;

    //         }
    //         if (scale > 1.1) {
    //             scale = 1.1;
    //         }
    //         page_parent.style.transform = "scale(" + scale + ")";
    //         getCurPage().scale = scale;
    //         //右侧面板
    //         activePropertyPanel("page");
    //     }
    // }
    //渲染标题栏
    if (title_display && curPage.type == "page") {
        var title_bar = document.createElement("div");
        title_bar.style.position = "relative";
        page_parent_content.appendChild(title_bar);
        pageHeight = pageHeight - title_bar.clientHeight;
        if(titleJson.background=="transparent"){
            title_bar.style.color="";
        }else
        if (isDark(titleJson.background) && getProject().theme == "light") {
            title_bar.style.color = "#fff";
        } else if (!isDark(titleJson.background) && getProject().theme == "dark") {
            title_bar.style.color = "#000";
        }
        renderTitleBody(title_bar, titleJson, pageHeight);


    }
    //工作区
    var page_content = document.createElement("div");
    page_content.className = "page_content";
    page_parent_content.appendChild(page_content);
    //渲染导航
    if (nav_display && curPage.type == "page") {
        page_content.style.display = "flex";
        var nav_bar = document.createElement("div");
        nav_bar.id = "nav_bar_" + p.key;
        nav_bar.className = "nav_bar";
        nav_bar.setAttribute("model", navJson.model);
        nav_bar.style.position = "relative";
        nav_bar.style.background = navJson.background;
        if(navJson.background=="transparent"){
            nav_bar.style.color="";
        }else
        if (isDark(navJson.background) && getProject().theme == "light") {
            nav_bar.style.color = "#fff";
        } else if (!isDark(navJson.background) && getProject().theme == "dark") {
            nav_bar.style.color = "#000";
        }
        page_content.appendChild(nav_bar);
        pageWidth = pageWidth - nav_bar.clientWidth;
        nav_items = navJson.items;
        renderNavTrees(nav_bar, navJson.items);
    }
    //渲染页面
    var page = document.createElement("div");
    renderPageBody(page, curPage, pageWidth, pageHeight, content);
    page_content.appendChild(page);

    //渲染标尺
    if (ruler_show) {
        var ruler_top = document.createElement("div");
        ruler_top.className = "ruler_top";
        ruler_top.style.height = ruler_width + "px";
        ruler_top.style.top = viewPosition.top + "px";
        ruler_top.style.left = viewPosition.left + "px";
        ruler_top.style.right = viewPosition.right + "px";
        workbench.appendChild(ruler_top);
        var ruler_view = document.createElement("div");
        ruler_view.className = "ruler_view";
        ruler_view.style.left = "100px";
        ruler_top.appendChild(ruler_view);
        for (var r = 0; r <= pageWidth + 200; r += 50) {
            var ruler_px = document.createElement("div");
            ruler_px.className = "ruler_px";
            ruler_px.innerText = r + "";
            ruler_view.appendChild(ruler_px);
        }
        var ruler_left = document.createElement("div");
        ruler_left.className = "ruler_left";
        ruler_left.style.width = ruler_width + "px";

        ruler_left.style.top = (viewPosition.top + ruler_width) + "px";
        ruler_left.style.left = viewPosition.left + "px";
        ruler_left.style.bottom = viewPosition.bottom + "px";

        workbench.appendChild(ruler_left);
        var ruler_view1 = document.createElement("div");
        ruler_view1.className = "ruler_view_left";

        ruler_view1.style.top = (100 - ruler_width) + "px";
        ruler_left.appendChild(ruler_view1);
        for (var r = 0; r <= pageHeight + 100; r += 50) {
            var ruler_px = document.createElement("div");
            ruler_px.className = "ruler_px_left";
            ruler_px.innerText = r + "";
            ruler_view1.appendChild(ruler_px);
        }
    }

    //页面滚动，标尺跟着滚动
    var sroll_h = document.createElement("div");
    sroll_h.className = "sroll_h";
    sroll_h.style.bottom = viewPosition.bottom + "px";
    sroll_h.style.left = viewPosition.left + "px";
    sroll_h.style.right = viewPosition.right + "px";

    workbench.appendChild(sroll_h);
    var sroll_h_block = document.createElement("div");
    sroll_h_block.className = "sroll_h_block";
    sroll_h.appendChild(sroll_h_block);

    var sroll_h_block_w = Math.pow((window.innerWidth - viewPosition.left - viewPosition.right), 2) / (p.width + 200);
    sroll_h_block.style.width = sroll_h_block_w + "px";
    sroll_h_block.style.left = 0 + "px";
    var sroll_h_block_m = false;
    sroll_h_block.onmousedown = (e) => {

        var viewWidth = window.innerWidth - viewPosition.left - viewPosition.right;
        var sroll_h_rate = ((p.width + 200) - viewWidth) / (viewWidth - sroll_h_block.clientWidth);
        var offsetLeft = viewPosition.left + 100;
        var lb = parseFloat(sroll_h_block.style.left.replace("px", ""));
        var eb = e.clientX;
        sroll_h_block_m = true;
        document.onmousemove = (em) => {
            if (sroll_h_block_m) {
                var le = em.clientX - eb + lb;
                if (le <= 0) {
                    le = 0;
                }
                if (le > viewWidth - sroll_h_block.clientWidth) {
                    le = viewWidth - sroll_h_block.clientWidth;
                }
                curPage.left = (offsetLeft - le * sroll_h_rate);

                sroll_h_block.style.left = le + "px";
                if (ruler_view != undefined) {
                    ruler_view.style.left = (100 - le * sroll_h_rate) + "px";
                }
                setPagePostion(curPage, page_parent, curPage.left, curPage.top);

            }
        }
        document.onmouseup = (eu) => {
            sroll_h_block_m = false;


        }





    }


    var sroll_v = document.createElement("div");
    sroll_v.className = "sroll_v";
    sroll_v.style.bottom = viewPosition.bottom + "px";
    sroll_v.style.top = viewPosition.top + "px";
    sroll_v.style.right = viewPosition.right + "px";
    workbench.appendChild(sroll_v);
    var sroll_v_block = document.createElement("div");
    sroll_v_block.className = "sroll_v_block";
    sroll_v.appendChild(sroll_v_block);

    var sroll_v_block_h = Math.pow((window.innerHeight - viewPosition.top - viewPosition.bottom), 2) / (p.height + 200);
    //console.log("sroll_v_block_h",sroll_v_block_h,page_view.clientHeight,content.clientHeight,p.height);
    sroll_v_block.style.height = sroll_v_block_h + "px";
    sroll_v_block.style.top = "0px";

    var sroll_b_block_m = false;
    sroll_v_block.onmousedown = (e) => {
        var viewHeight = window.innerHeight - viewPosition.top - viewPosition.bottom;
        var offsetTop = viewPosition.top + 100;
        var sroll_v_rate = ((p.height + 200) - viewHeight) / (viewHeight - sroll_v_block.clientHeight);
        var tb = parseFloat(sroll_v_block.style.top.replace("px", ""));
        var eb = e.clientY;
        sroll_b_block_m = true;
        document.onmousemove = (em) => {
            if (sroll_b_block_m) {
                var te = em.clientY - eb + tb;
                if (te <= 0) {
                    te = 0;
                }
                if (te > viewHeight - sroll_v_block.clientHeight) {
                    te = viewHeight - sroll_v_block.clientHeight;
                }
                curPage.top = (offsetTop - te * sroll_v_rate);

                sroll_v_block.style.top = te + "px";
                if (ruler_view1 != undefined) {
                    ruler_view1.style.top = ((100 - te * sroll_v_rate) - ruler_width) + "px";
                }

                onScrollReal();

                setPagePostion(curPage, page_parent, curPage.left, curPage.top);
            }
        }
        document.onmouseup = (eu) => {
            sroll_b_block_m = false;


        }





    }
    workbench.onwheel = (e: any) => {
        {

            var offsetLeft = viewPosition.left + 100;

            var sroll_h_block_hh = parseFloat(sroll_h_block.style.width.replace("px", ""));
            var view_w = window.innerWidth - viewPosition.right - viewPosition.left;
            var sroll_h_rate = ((p.width + 200) - view_w) / (view_w - sroll_h_block_hh);

            var lb = parseFloat(sroll_h_block.style.left.replace("px", ""));
            var le = e.deltaX / 5 + lb;

            if (le <= 0) {
                le = 0;
            }

            if (le > view_w - sroll_h_block_hh) {
                le = view_w - sroll_h_block_hh;
            }



            curPage.left = (offsetLeft - le * sroll_h_rate);
            sroll_h_block.style.left = +le + "px";
            sroll_h_block.style.transform
            if (ruler_view != undefined) {
                ruler_view.style.left = (100 - le * sroll_h_rate) + "px";
            }


        }
        {
            var offsetTop = viewPosition.top + 100;
            var sroll_v_block_hh = parseFloat(sroll_v_block.style.height.replace("px", ""));
            var viewHeight = window.innerHeight - viewPosition.top - viewPosition.bottom;

            var sroll_v_rate = ((p.height + 200) - viewHeight) / (viewHeight - sroll_v_block_hh);
            var tb = parseFloat(sroll_v_block.style.top.replace("px", ""));

            var te = e.deltaY / 5 + tb;
            if (te <= 0) {
                te = 0;
            }
            if (te > viewHeight - sroll_v_block_hh) {
                te = viewHeight - sroll_v_block_hh;
            }

            curPage.top = offsetTop - te * sroll_v_rate;


            //  page_parent.style.top = (offsetTop - te * sroll_v_rate) + 'px';
            sroll_v_block.style.top = te + "px";
            if (ruler_view1 != undefined) {
                ruler_view1.style.top = ((100 - te * sroll_v_rate) - ruler_width) + "px";
            }

            onScrollReal();
        }


        setPagePostion(curPage, page_parent, curPage.left, curPage.top);
    }


    console.log("renderPage---", Date.now() - start);
}
function onScrollReal() {

    var viewPosition = getViewPosition();
    setTimeout(() => {
        var page = getCurPage();

        var viewHeigh = window.innerHeight - viewPosition.top - viewPosition.bottom;

        var page_parent = document.getElementById("page_parent_" + page.key);
        for (var index = 0; index < page.children.length; index++) {

            var child = page.children[index];
            var root = document.getElementById(child.key);
            if (root == undefined) {
                continue;
            }
            var body: HTMLElement;
            var data_body = root.getAttribute("data-body");
            if (data_body != undefined && data_body == "true") {
                body = document.getElementById("_" + child.key);
            } else {
                body = root;
            }
            var pagePosition = getPagePostion(page, viewPosition);
            //TODO  给即将不渲染 父级组件 设置高度，以免影响整体布局
            if (root.offsetTop > viewHeigh - pagePosition.top + viewPosition.top + 100) {

                if (body.innerHTML != "") {
                    if (root.style.height.indexOf("%") > 0 || root.style.height.indexOf("px") > 0) {
                    } else {
                        root.style.height = root.clientHeight + "px";
                        root.setAttribute("data-height", "true");

                    }
                    setRootComponentHeight(child.key, root.clientHeight + "px");
                    root.style.background = "";
                    body.innerHTML = "";
                }
            } else if (root.offsetTop + root.clientHeight < -(pagePosition.top + viewPosition.top + 100)) {

                if (body.innerHTML != "") {
                    if (root.style.height.indexOf("%") > 0 || root.style.height.indexOf("px") > 0) {
                    } else {
                        root.style.height = root.clientHeight + "px";
                        root.setAttribute("data-height", "true");

                    }
                    setRootComponentHeight(child.key, root.clientHeight + "px");
                    body.innerHTML = "";
                    root.style.background = "";
                }
            } else {
                if (body.innerHTML.length < 10) {
                    var db = root.getAttribute("data-background");
                    var dh = root.getAttribute("data-height");
                    if (db != undefined) {
                        root.style.background = db;
                    }
                    if (child.children != undefined && child.children.length > 0) {
                        //渲染子组件
                        renderComponents(body, child.children, child);
                    }
                    setTimeout(() => {
                        if (dh != undefined && root.style != undefined) {
                            root.style.height = "";
                        }
                    }, 100);
                }
            }
        }
    }, 0);

}
export function getRootComponentHeight(key: string): string {
    var height = window.sessionStorage.getItem("RootComponentHeight" + key);
    return height;
}
export function setRootComponentHeight(key: string, height: string | number) {
    window.sessionStorage.setItem("RootComponentHeight" + key, height + "");

}
function renderTitleBody(title_bar: HTMLElement, titleJson: any, pageHeight: number) {
    if (title_bar == undefined)
        return;
    title_bar.className = "title_bar";
    title_bar.style.background = titleJson.background;

    renderTitleBar(title_bar, titleJson);

}

export function renderPageBackground(curPage: IPage,) {
    var page_bg: any = document.getElementById("page_bg_" + curPage.key);
    var project=getProject();
    if (project.backgroundType == undefined || project.backgroundType == 0) {
        //无
        page_bg.style.background = "none";
        page_bg.getContext("2d").clearRect(0, 0, page_bg.clientWidth, page_bg.clientHeight);
    } else if (project.backgroundType == 1) {
        page_bg.style.background = project.backgroundColor;
        page_bg.getContext("2d").clearRect(0, 0, page_bg.clientWidth, page_bg.clientHeight);
        //纯色
    } else if (project.backgroundType == 2) {
        page_bg.style.background = project.backgroundColor;
        page_bg.getContext("2d").clearRect(0, 0, page_bg.clientWidth, page_bg.clientHeight);
        //渐变
    } else if (project.backgroundType == 3) {
        //内置图片
        try {
            var bg: IBackground = require("../plugins/background/" + project.backgroundColor).default;
            if (bg != undefined) {
                requestIdleCallback(() => {
                    bg.onRender(page_bg, getProject().themeColor);
                })
            }
        } catch (error) {
            console.log(error);
        }
    }



}

var zoomType: "50" | "100" | "150" = "100";
export function renderPageBody(page: HTMLElement, curPage: IPage, pageWidth: number, pageHeight: number, view: HTMLElement) {
    page.innerHTML = "";
    page.className = "page";
    page.id = "page_content_" + curPage.key;
    page.tabIndex = 800;
    page.setAttribute("data-type", curPage.type);
    page.style.width = pageWidth + "px";
    page.style.height = pageHeight + "px";
    console.log("page size:", pageWidth + "x" + pageHeight);
    renderPageBackground(curPage);

    //render
    if (curPage.children != undefined && curPage.children.length > 0) {
        var rs = Date.now();
        renderRootComponents(page, curPage.children);
        console.log("renderComponents---", Date.now() - rs);
    }
    //渲染 右键菜单
    page.oncontextmenu = (e: MouseEvent) => {
        // folderTitle.setAttribute("selected", "true");
        var menuItems: Array<IMenuItem> = [{
            id: "paste",
            label: "粘贴", icon: "bi bi-clipboard", accelerator: "Command+v", onclick: () => {
                clipboardPaste(page);

            }
        }, {
            id: "insert",
            label: "插入组件", icon: "bi bi-layout-wtf", accelerator: "i", onclick: () => {
                setTimeout(() => {
                    shortcutInsertComponent(e.clientX, e.clientY);
                }, 1);
            }
        }, {
            id: "insertImg",
            label: "插入图片", icon: "bi bi-card-image", accelerator: "i", onclick: () => {
                setTimeout(() => {
                    ipcRendererSend("insertImage");
                }, 1);
            }
        }, {
            type: "separator"
        }, {
            id: "zoom50",
            label: "50%",
            type: "radio",
            checked: zoomType == "50",
            onclick: () => {
                zoomType = "50";

                // page_parent.style.transform = "scale(" + scale + ")";
                // page_sacle.innerText = scale + "";
            }

        }, {
            id: "zoom100",
            label: "100%",
            type: "radio",
            checked: zoomType == "100",
            onclick: () => {
                zoomType = "100";
                // page.style.transform="scale(1)";
            }
        }, {
            id: "zoom150",
            label: "150%",
            type: "radio",
            checked: zoomType == "150",
            onclick: () => {
                zoomType = "150";
                // page.style.transform="scale(1.5)";
            }

        }];
        openContextMenu(menuItems);
        e.stopPropagation();
    }
    //设置 快捷键
    page.onkeydown = (e: KeyboardEvent) => {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key == "i") {
                //插入组件
                shortcutInsertComponent(getMousePosition().x, getMousePosition().y);
            }
            else if (e.key == "Backspace") {
                //删除
                selectComponents.forEach((key: string) => {
                    var cmpt = findCurPageComponent(key);
                    deleteComponent(cmpt);
                });
            } else if (e.key == "v") {
                //显示组件 边框
                showComponentsOutLine();
            }
            e.stopPropagation();
        }
    };
    //shortcut
    page.onkeyup = (e: KeyboardEvent) => {

        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key == "v") {
                //隐藏组件 边框
                hideComponentsOutLine();
            }
            e.stopPropagation();
        }
    };
    //页面 接受 组件 拖拽
    var previewComponent: HTMLElement;
    page.ondragover = (e: any) => {
        if (getDragTimer() <= 3) {
            return;
        }
        e.preventDefault();
        var component = dargData.getData("componentTemplate")
        if (e.target.className == "page" && previewComponent == undefined) {
            if (component != undefined)
                previewComponent = renderComponentPreview(page, component)
        }
        var dragStore = dargData.getData("store");
        if (e.target.className == "page" && previewComponent == undefined) {
            if (dragStore != undefined) {
                //拖拽 商店 内容 至 界面
                previewComponent = renderStorePreview(page, dragStore)

            }
        }

        if (getCurPage().mode == "fixed") {
            previewComponent.style.position = "absolute";
            previewComponent.style.left = e.clientX + "px";
            previewComponent.style.top = e.clientY + "px";
        }


    }
    page.ondragenter = (e: any) => {
        startDargTimer();

    }
    page.ondragleave = (e: DragEvent) => {
        // clearDargTimer();
        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
    }
    page.ondragend = (e: DragEvent) => {

        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
    }
    page.ondrop = (e: DragEvent) => {
        clearDargTimer();
        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
        var componentT = dargData.getData("componentTemplate")
        if (componentT != undefined) {
            var component = initComponent(componentT);
            if (curPage.children == undefined) {
                curPage.children = [];
            }
            component.path = component.key;
            component.sort = curPage.children.length;
            curPage.children.push(component);
            //右侧面板
            //  activePropertyPanel();
            //如果是扩展组件
            if (component.isExpand) {
                openExpand();
                renderExpand(component);

            } else {
                var div = renderComponent(page, component).root;

                if (getCurPage().mode == "fixed") {
                    div.style.position = "absolute";
                    div.style.left = e.clientX + "px";
                    div.style.top = e.clientY + "px";
                    setComponentStyle(component, "position", "absolute", false);
                    setComponentStyle(component, "left", div.style.left, false);
                    setComponentStyle(component, "top", div.style.top, false);

                }
            }
            onAddComponents([component]);

        }
        var dragStore = dargData.getData("store");
        if (dragStore != undefined) {
            var component: IComponent = JSON.parse(dragStore.data);
            copyComponent(component);
            if (curPage.children == undefined) {
                curPage.children = [];
            }
            component.path = component.key;
            component.sort = curPage.children.length;
            curPage.children.push(component);
            //右侧面板
            //  activePropertyPanel();
            //如果是扩展组件
            if (component.isExpand) {
                openExpand();
                renderExpand(component);

            } else {
                var div = renderComponent(page, component).root;

                if (getCurPage().mode == "fixed") {
                    div.style.position = "absolute";
                    div.style.left = e.clientX + "px";
                    div.style.top = e.clientY + "px";
                    setComponentStyle(component, "position", "absolute", false);
                    setComponentStyle(component, "left", div.style.left, false);
                    setComponentStyle(component, "top", div.style.top, false);

                }
            }
            onAddComponents([component]);


        }
    }


}
export function getStoreExtension(key: string, callback: (err: any, res: any, body: any) => void) {
    var url = "https://www.violetiem.com/store/get?extesion=" + key;
    const request = require("request");
    request.get(url, callback, { json: true });
}
export function hideComponentsOutLine() {
    var page = getCurPageContent();
    if (page != undefined) {
        page.removeAttribute("data-drag");
    }
}
export function showComponentsOutLine() {
    var page = getCurPageContent();
    if (page != undefined) {
        page.setAttribute("data-drag", "true");
    }

}
var selectComponents: Array<string> = [];
export function getSelectComponents(): Array<string> {
    return selectComponents;
}
export function setSelectComponents(data: Array<string>) {
    selectComponents = data;
}

/**
 * 渲染 插入组件 的右键菜单
 * @param x 
 * @param y 
 * @param component 
 * @param position 
 * @returns 
 */
export function shortcutInsertComponent(x: number, y: number, component?: IComponent, position?: number) {

    if (component != undefined) {
        if (component.type != "grid" && component.type != "row") {
            if (component.drop != "component") {
                console.log("shortcutInsertComponent<<<<");
                return;
            }
        }
    }
    //
    console.log("shortcutInsertComponent>>>>");
    var showComponents = ["button", "label", "text", "grid", "row", "flex", "space", "dialog", "chart_line", "chart_bar", "chart_pie"];
    var contextMenus: IMenuItem[] = [];

    showComponents.forEach((key: string) => {
        var t = getComponentsTemplate().find(t => t.type == key);
        if (t != undefined) {
            var item: IMenuItem = {
                id: getUUID(),
                label: t.label, icon: t.icon, onclick: () => {
                    var ct = initComponent(t);
                    if (component == undefined) {
                        ct.path = ct.key;
                        getCurPage().children.push(ct);
                        renderComponent(getCurPageContent(), ct);
                    }
                    else {
                        if (component.children == undefined) {
                            component.children = [];
                        }
                        if (position == undefined) {
                            ct.path = component.path + "/" + ct.key;
                            component.children.push(ct);
                            renderComponent(document.getElementById(component.key), ct);
                        } else {
                            console.log(component.path, position);
                            if (component.path.indexOf("/") < 0) {
                                ct.sort = position;
                                ct.path = ct.key;
                                getCurPage().children.splice(position, 0, ct);
                                renderComponent(getCurPageContent(), ct, position);
                            } else {
                                var parent = findCurPageComponent(component.path.substring(0, component.path.lastIndexOf("/")));
                                if (parent != undefined) {
                                    ct.sort = position;
                                    ct.path = parent.path + "/" + ct.key;
                                    parent.children.splice(position, 0, ct);
                                    //TODO  存在问题，需要修改
                                    {
                                        var root = document.getElementById(parent.key);
                                        var body: HTMLElement;
                                        for (var i = 0; i < root.childElementCount; i++) {
                                            var child: any = root.children.item(i);
                                            if (child.className == "component_body") {
                                                body = child;
                                                break;
                                            }
                                        }
                                        if (body != undefined) {
                                            renderComponent(body, ct, position);
                                        } else {
                                            renderComponent(root, ct, position);
                                        }
                                    }

                                }
                            }
                        }

                    }
                    onAddComponents([ct]);

                }
            }
            contextMenus.push(item);
            if (t.key == "dialog" || t.key == "text") {
                contextMenus.push({
                    type: "separator"
                })
            }
        }
    });
    var label = "插入组件";
    if (position != undefined) {
        label = "前/上插入"
    }
    openContextMenu(contextMenus);

}

var nav_items: INavItem[] = [];
export function getNavItems(): Array<INavItem> {
    return nav_items;
}
export function setNavItems(item: Array<INavItem>) {
    return nav_items = item;
}
/**
 * 插入 剪贴板 内容
 * @param body 
 * @param component 
 * @returns 
 */
export function clipboardPaste(body: HTMLElement, component?: IComponent) {
    var text = clipboard.readText();
    //插入 拷贝的组件
    if (text != undefined && text.trim().startsWith("[selectComponents]")) {
        var sr = text.substring("[selectComponents]".length);
        if (sr == "undefined") {
            return;
        }
        if (component != undefined && component.type != "grid" && component.type != "row" && component.drop != "component") {
            alert("不可以放置到这里");
            return;
        }
        console.log("copy selectComponents>>>");
        //copy selects
        var _selectComponents = JSON.parse(sr);
        _selectComponents.forEach((ncmpt: IComponent) => {
            if (component == undefined) {
                var master = ncmpt.path + "";//拷贝后 自动设置为模板
                if (ncmpt.master != undefined && ncmpt.master.length > 0) {
                    master = ncmpt.master;
                }
                copyComponent(ncmpt, undefined);
                getCurPage().children.push(ncmpt);
                var content = getCurPageContent();
                content.innerHTML = "";
                ncmpt.master = master;
                renderRootComponents(content, getCurPage().children);
            } else {
                var master = ncmpt.path + "";//拷贝后 自动设置为模板
                if (ncmpt.master != undefined && ncmpt.master.length > 0) {
                    master = ncmpt.master;
                }
                copyComponent(ncmpt, component.path);
                if (component.children == undefined) {
                    component.children = [ncmpt];
                } else {
                    component.children.push(ncmpt);
                }
                var content = document.getElementById(component.key);
                content.innerHTML = "";
                ncmpt.master = master;
                renderComponents(content, component.children, undefined);
            }
        });
        onAddComponents(_selectComponents);
        return;
    }
    //html
    var html = clipboard.readHTML();
    if (html.length > 20) {
        console.log("readhtml");
        // console.log(html);
        //插入excel
        if (html.indexOf("urn:schemas-microsoft-com:office:excel") > 0) {
            if (component != undefined && component.drop != "component") {
                alert("不可以放置到这里");
                return;
            }
            //粘贴excel
            var fra = html.match("<\!\-\-StartFragment\-\->[^\!]+");
            //console.log("fra",fra);
            if (fra != undefined && fra.length > 0) {
                var fragment = fra[0].substring(0, fra[0].length - 1);
                var tableContext = fragment.substring("<!--StartFragment-->".length, fragment.length - 2)
                var tableTmp = document.createElement("table");
                tableTmp.innerHTML = tableContext;
                var tbody = tableTmp.getElementsByTagName("tbody")[0];
                //     console.log(tbody);
                if (tbody != undefined) {
                    var trs = tbody.getElementsByTagName("tr");
                    var trsLen = trs.length;
                    var data = [];
                    for (var i = 0; i < trsLen; i++) {
                        var tr = trs[i];
                        var tds = tr.getElementsByTagName("td");
                        var tdsLen = tds.length;
                        var row: any[] = [];
                        for (var j = 0; j < tdsLen; j++) {
                            var td = tds[j];
                            if (td.colSpan != undefined || td.rowSpan != undefined) {
                                var obj: any = { v: td.innerText };
                                if (td.colSpan != undefined) {
                                    obj.c = td.colSpan;
                                }
                                if (td.rowSpan != undefined) {
                                    obj.r = td.rowSpan;
                                }
                                if (obj.c == "1" && obj.r == "1") {
                                    row.push(td.innerText);
                                } else {
                                    row.push(obj);
                                }
                            } else {
                                row.push(td.innerText);
                            }
                        }
                        data.push(row);
                        //trsArr.push(tdsArr);
                    }
                    // table
                    var tableCt: IComponent = getComponentTempateByType("table");
                    var tableC = initComponent(tableCt);
                    tableC.property.hasHead.context = "false";
                    tableC.option = JSON.stringify(data, null, 2);
                    //render
                    if (component == undefined) {
                        getCurPage().children.push(tableC);
                    } else {
                        if (component.children == undefined) {
                            component.children = [tableC];
                        } else {
                            component.children.push(tableC);
                        }
                    }
                    onAddComponents([tableC]);
                }
            }
        }
    } else if (clipboard.readImage() != undefined && clipboard.readImage().isEmpty() == false) {
        let dataUrl = clipboard.readImage().toDataURL();
        //插入图片
        var component: IComponent = {
            type: "images",
            key: getUUID(),
            icon: "bi bi-card-image",
            label: "图片",
            style: "display:inline-block;width:400px;",
            onPreview: () => {
                var img = document.createElement("img");
                img.src = dataUrl;
                return img;
            }, onRender: (component: IComponent, element: any) => {
                var img;
                if (element != undefined)
                    img = element;
                else
                    img = document.createElement("img");
                img.src = dataUrl;
                // pi.className = "bi bi-" + icon;
                return { root: img, content: img }
            }
        };
        var iPage = true;
        if (getSelectComponents().length == 1) {
            var parent = findCurPageComponent(getSelectComponents()[0]);
            if (parent != undefined && parent.drop != "component") {
                iPage = false;
                if (parent.children == undefined) parent.children = [];
                parent.children.push(component);
                renderComponent(document.getElementById(parent.key), component);
            }
        }
        if (iPage) {
            getCurPage().children.push(component);
            //右侧面板
            renderComponent(getCurPageContent(), component);
        }
        onAddComponents([component]);
    } else {
        console.log("readText");
        var text = clipboard.readText();
        // console.log(text);
    }
}
