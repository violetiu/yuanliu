/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

蓝图
***************************************************************************** */
import { getDataBase } from "../plugins/explorer/data";
import { initComponent, onSelectComponent } from "../common/components";
import { getContextMenuArg, IMenuItem, openContextMenu } from "../common/contextmenu";
import { getUUID, IBlue, IBlueEvent, IBlueLink, IBlueMethod, IBluePoint, IBlueProperty, IComponent } from "../common/interfaceDefine";
import * as dargData from "./DragData";
import * as paints from "./paints";
import { findCurPageComponent, getCurPage } from "./workbench";
import { line } from "d3";
/**
 * 更新蓝图界面
 */
export function updateBlueView() {
    var blueContext = document.getElementById("blueContext");
    blueContext.innerHTML = "";
    if (getCurPage() == undefined || getCurPage().blues == undefined || getCurPage().blues.length < 1) {

        // getCurPage().blues = [blueProject, bluePage];
    } else {
        console.log(getCurPage().blueLinks);
        getCurPage().blueLinks.forEach(link => {


            renderBlueLink(blueContext, link);

        });
        getCurPage().blues.forEach(b => {
            if (b.type == "component") {
                var comp = findCurPageComponent(b.component);
                if (comp != undefined && (comp.isRemoved == undefined || comp.isRemoved == false)) {
                    b.name = comp.label;
                } else {
                    b.name = "已删除组件";
                    b.type = "disabled";
                }
            }

            renderBlue(blueContext, b);
        })
    }


}
/**
 * 更新蓝图链接
 */
function updateBlueLinks() {
    var blueContext = document.getElementById("blueContext");
    var svgs = blueContext.getElementsByTagName("svg");
    if (svgs != undefined && svgs.length > 0) {

        for (var i = 0; i < svgs.length; i++) {
            svgs[i].remove();
        }
    }

    getCurPage().blueLinks.forEach(link => {
        renderBlueLink(blueContext, link);
    });
}
/**
 * 渲染蓝图界面
 * @param content 
 */
export function renderBlueView(content: HTMLElement) {
    var view = document.createElement("div");
    view.style.width = "100%";
    view.style.height = "100%";
    view.id = "blueView";
    view.className = "blueView";
    // view.style.display="flex";
    content.appendChild(view);

    var blueContext = document.createElement("div");
    blueContext.className = "blueContext";
    blueContext.id = "blueContext";
    blueContext.tabIndex = 100;
    blueContext.style.width = (content.clientWidth - 80) + "px";
    blueContext.style.height = (content.clientHeight - 80) + "px";
    view.appendChild(blueContext);
    var mouseX = 0;
    var mouseY = 0;
    blueContext.onmousedown = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    //双击 增加 标题
    blueContext.ondblclick = (e) => {
        var title: IBlue = {
            component: "", key: getUUID(), name: "双击添加标题", icon: "", left: e.offsetX, top: e.offsetY,
            events: [], type: "title", value: "0",
            properties: [], methods: []
        };
        getCurPage().blues.push(title);
        updateBlueView();
    }

    //icon contxtmenu
    var viewContentMenu: IMenuItem[] = [
        {
            id:"update",
            label:"刷新",
            onclick:()=>{
                updateBlueView();
            }
        },
        {
            type: "separator"
        },
        {
            id: "sim",
            label: "单变量", onclick: () => {
                var b: IBlue = {
                    component: "", key: getUUID(), name: "单变量", icon: "bi bi-star", left: 10, top: 10,
                    events: [], type: "variable", value: "0",
                    properties: [{ label: "输出", name: "result", type: "out" }], methods: []
                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        }, {
            id: "ax",
            label: "矩阵变量", onclick: () => {
                var b: IBlue = {
                    component: "", key: getUUID(), name: "矩阵变量", icon: "bi bi-star", left: 10, top: 10,
                    events: [], type: "matrix", value: "[0,1,2]",
                    properties: [{ label: "输出", name: "result", type: "out" }], methods: []
                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        }, {
            type: "separator"
        },
        {
            id: "if",
            label: "判断", onclick: () => {
                var b: IBlue = {
                    component: "", key: getUUID(), name: "判断", icon: "bi bi-question", left: 10, top: 10,
                    events: [], type: "method",
                    properties: [{ label: "输入", name: "in1", type: "in" }, { label: "阈值", name: "in2", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: []
                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        },
        {
            id: "cat",
            label: "拼接字符串", onclick: () => {

                var b: IBlue = {
                    component: "", key: getUUID(), name: "拼接字符串", icon: "bi bi-lg", left: 10, top: 10,
                    events: [], type: "method",
                    properties: [{ label: "输入", name: "in", type: "in" }, { label: "输入", name: "threshold", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: [],

                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        },
        {
            id: "plu",
            label: "加法", onclick: () => {

                var b: IBlue = {
                    component: "", key: getUUID(), name: "加法", icon: "bi bi-lg", left: 10, top: 10,
                    events: [], type: "method",
                    properties: [{ label: "输入", name: "in", type: "in" }, { label: "输入", name: "threshold", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: [],

                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        },
        {
            id: "mul",
            label: "乘法", onclick: () => {

                var b: IBlue = {
                    component: "", key: getUUID(), name: "乘法", icon: "bi bi-x", left: 10, top: 10,
                    events: [], type: "method",
                    properties: [{ label: "输入", name: "in", type: "in" }, { label: "输入", name: "threshold", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: []
                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        }, {
            type: "separator"
        }, {
            id: "wind",
            label: "窗口", onclick: () => {
                var b: IBlue = {
                    component: "window", key: getUUID(), name: "window", icon: "bi bi-window", left: 10, top: 10,
                    events: [], type: "window",
                    properties: [{ label: "高度", name: "innerHeight", type: "out" },
                    { label: "宽度", name: "innerWidth", type: "out" },
                    { label: "scrollTop", name: "scrollTop", type: "out" },
                    { label: "scrollLeft", name: "scrollLeft", type: "out" }
                    ], methods: []
                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        }, {
            id: "pro",
            label: "项目", onclick: () => {
                // var b: IBlue = {
                //     component: "project", key: "blue_project_key", name: "项目", icon: "bi bi-star", top: 10, left: 10, type: "project",
                //     events: [],
                //     properties: [{ label: "项目名称", name: "name", type: "out" }], methods: []
                // };
                // args.push(b);
                // updateBlueView();
            }
        }, {
            id: "page",
            label: "页面", onclick: () => {
                var b: IBlue = {
                    component: "page", key: "blue_page_key", name: "页面", icon: "bi bi-stars", top: 100, left: 10, type: "page",
                    events: [{ label: "加载完成", name: "onload" }],
                    properties: [{ label: "页面名称", name: "name", type: "out" }], methods: []
                };
                getCurPage().blues.push(b);
                updateBlueView();
            }
        }
    ];

    blueContext.oncontextmenu = (e) => {
        openContextMenu(viewContentMenu);
        // showContextMenu(viewContentMenu, e.clientX, e.clientY, getCurPage().blues, undefined, "增加函数和对象"); 
        e.stopPropagation();
    };


    blueContext.onkeydown = (e: KeyboardEvent) => {

        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key == "i") {
                openContextMenu(viewContentMenu);
                // showContextMenu(viewContentMenu, getMousePosition().x, getMousePosition().y, getCurPage().blues, undefined, "增加函数和对象");

            } else if (e.key == "f") {
              //  openContextMenu(getBlueMethods());
                //  showContextMenu(getBlueMethods(), getMousePosition().x, getMousePosition().y, getCurPage().blues, undefined, "增加函数");



            }
            e.stopPropagation();
        }

    }

    var previewComponent: HTMLElement;
    blueContext.ondragover = (e: DragEvent) => {

        if (previewComponent != undefined) {

            previewComponent.style.left = e.offsetX + "px";
            previewComponent.style.top = e.offsetY + "px";
        }

        if (getCurPage() != undefined && dargData.getData("componentTemplate") == undefined) {
            e.preventDefault();
        }


    }
    blueContext.ondragenter = (e: any) => {

        var cmt = dargData.getData("component");

        if (cmt != undefined) {
            if (e.target.className == "blueContext" && previewComponent == undefined) {
                var blue: IBlue = { type: "component", component: "", key: getUUID(), name: cmt.name, icon: "bi bi-back", top: e.offsetY, left: e.offsetX }
                previewComponent = renderBluePreview(blueContext, blue);

            }
        }



    }
    blueContext.ondragleave = (e: DragEvent) => {

        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
    }
    blueContext.ondragend = (e: DragEvent) => {
        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
    }
    blueContext.ondrop = (e: DragEvent) => {
        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }

        var cmt = dargData.getData("component");

        if (cmt != undefined) {

            // console.log("cmt", cmt);
            if (cmt.isTemplate) {
                return;
            }
            var component = initComponent(cmt);
            // console.log("blueContext", component);
            var fi = getCurPage().blues.findIndex(b => b.component == component.path);
            if (fi >= 0) {
                return;
            }

            var top = e.offsetY;
            var left = e.offsetX;
            var blue = initBlueComponent(component, top, left);
            getCurPage().blues.push(blue);

            renderBlue(blueContext, blue);
            dargData.clear();
        }

        var catalog = dargData.getData("catalog");//e.dataTransfer.getData("catalog");
        if (catalog != undefined) {

            var fi = getCurPage().blues.findIndex(b => b.component == catalog.key);
            if (fi >= 0) {
                return;
            }
            var top = e.offsetY;
            var left = e.offsetX;
            var methods: IBluePoint[] = [
                { label: "打开", name: "open" }
            ];
            var properties: IBluePoint[] = [
                { label: "页面", name: "key", type: "out" }
            ];
            var events: IBluePoint[] = [];

            var blue: IBlue = {
                type: "catalog", left: left, top: top, component: catalog.key, key: getUUID(), name: catalog.name, icon: "bi bi-file-earmark-richtext",
                events: events, properties: properties, methods: methods
            };
            getCurPage().blues.push(blue);

            renderBlue(blueContext, blue);

        }
        var blueObjJson = e.dataTransfer.getData("blueObject");
        if (blueObjJson != undefined && blueObjJson.length > 0) {
            var blueObj: IBlue = JSON.parse(blueObjJson);
            //  console.log("blueObj", blueObj);
            // var fi = getCurPage().blues.findIndex(b => b.name == blueObj.name);
            // if (fi >= 0) {
            //     return;
            // }

            var top = e.offsetY;
            var left = e.offsetX;

            //console.log(top, left);

            var methods: IBluePoint[] = [
                { label: "打开", name: "open" }
            ];
            var properties: IBluePoint[] = [];
            var events: IBluePoint[] = [];

            var blue: IBlue = blueObj;
            blue.key = getUUID();
            blue.left = left;
            blue.top = top;
            getCurPage().blues.push(blue);

            renderBlue(blueContext, blue);

        }
        var blueMethodJson = e.dataTransfer.getData("blueMethod");
        if (blueMethodJson != undefined && blueMethodJson.length > 0) {
            var blueMethod: IBlue = JSON.parse(blueMethodJson);
            // console.log("blueMethod", blueMethod);

            var top = e.offsetY;
            var left = e.offsetX;
            var methods: IBluePoint[] = [
                { label: "打开", name: "open" }
            ];
            var properties: IBluePoint[] = [];
            var events: IBluePoint[] = [];

            var blue: IBlue = blueMethod;
            blue.left = left;
            blue.top = top;
            getCurPage().blues.push(blue);

            renderBlue(blueContext, blue);

        }
        var blueTableJson = e.dataTransfer.getData("blueDatabase");
        if (blueTableJson != undefined && blueTableJson.length > 0) {
            var blueTable: IBlue = JSON.parse(blueTableJson);
            //  console.log("blueTable", blueTable);

            var top = e.offsetY;
            var left = e.offsetX;
            var methods: IBluePoint[] = [
                { label: "保存", name: "save" },
                { label: "查询", name: "query" },
                { label: "删除", name: "delete" }
            ];
            var properties: IBluePoint[] = [];
            var events: IBluePoint[] = [
                { label: "结果", name: "result" }
            ];

            var blue: IBlue = { type: "database", left: left, top: top, component: blueTable.key, key: getUUID(), name: blueTable.name, icon: "bi bi-table", events: events, properties: properties, methods: methods };

            getCurPage().blues.push(blue);
            renderBlue(blueContext, blue);

        }
    }





}

function initBlueComponent(component: IComponent, top: number, left: number): IBlue {

    var methods: IBluePoint[] = [
        { label: "显示或隐藏", name: "toggle" }
    ];
    var properties: IBluePoint[] = [];
    var events: IBluePoint[] = [];


    if (component.blue != undefined) {
        if (component.blue.event != undefined) {
            for (var key in component.blue.event) {
                var e: IBlueEvent = component.blue.event[key];
                events.push({ label: e.label, name: key });
            }

        }
        if (component.blue.method != undefined) {
            for (var key in component.blue.method) {
                var m: IBlueMethod = component.blue.method[key];
                methods.push({ label: m.label, name: key });
            }

        }
        if (component.blue.property != undefined) {
            for (var key in component.blue.property) {
                var p: IBlueProperty = component.blue.property[key];
                properties.push({ label: p.label, name: key });
            }


        }
        if (component.blue.properties != undefined) {

            var list = component.blue.properties(component);
            list.forEach(item => {
                var p: IBlueProperty = item;
                properties.push({ label: p.label, name: item.key });
            })

        }
    }

    var blue: IBlue = { type: "component", left: left, top: top, component: component.path, key: getUUID(), name: component.label, icon: component.icon, events: events, properties: properties, methods: methods };
    return blue;
}

function renderBlue(conotent: HTMLElement, blue: IBlue, element?: HTMLElement): HTMLElement {

    // console.log("renderBlue",blue.name);
    var div: HTMLElement = document.createElement("div");
    if (element != undefined) {
        div = element;
    }
    div.className = "blue";
    div.setAttribute("data-type", blue.type);
    div.id = blue.key;
    div.tabIndex = 300;
    if (conotent != undefined)
        conotent.appendChild(div);
    div.style.top = blue.top + "px";
    div.style.left = blue.left + "px";
    div.style.zIndex = "10";

    if (conotent != undefined) {
        if (conotent.clientHeight < blue.top) conotent.style.height = (blue.top + 200) + "px";
        if (conotent.clientWidth < blue.left) conotent.style.width = (blue.left + 200) + "px";

    }


    var titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.className = "blueTitleBar";
    div.appendChild(titleBar);

    if (blue.type == "title") {
        titleBar.style.paddingLeft = "10px";
        titleBar.style.paddingRight = "10px";

    }

    var titleIcon = document.createElement("i");
    titleIcon.style.pointerEvents = "none";
    titleIcon.className = blue.icon;
    if (blue.type != "title")
        titleBar.appendChild(titleIcon);

    var titleName = document.createElement("div");
    titleName.style.pointerEvents = "none";
    titleName.innerText = blue.name;
    titleBar.appendChild(titleName);

    var body = document.createElement("div");
    body.className = "blueBody";
    div.appendChild(body);

    var bodyLeft = document.createElement("div");
    bodyLeft.className = "blueBodyLeft";
    body.appendChild(bodyLeft);
    var bodyRight = document.createElement("div");
    bodyRight.className = "blueBodyRight";
    body.appendChild(bodyRight);

    blue.methods.forEach(method => {
        var row = document.createElement("div");
        row.className = "blueRow";

        var icon = document.createElement("i");
        icon.className = "bi bi-record-circle";
        row.appendChild(icon);
        icon.setAttribute("data-blue", "")
        icon.style.color = "#f09";
        var label = document.createElement("div");
        label.innerText = method.label;
        label.style.flex = "1";
        row.appendChild(label);

        bodyLeft.appendChild(row);


        //link
        onIconLink(icon, blue, method.name, "method");


    })

    if (blue.events != undefined)
        blue.events.forEach(event => {
            var row = document.createElement("div");
            row.className = "blueRow";

            var label = document.createElement("div");
            label.style.flex = "1";
            label.style.textAlign = "right";
            label.innerText = event.label;
            row.appendChild(label);

            var icon = document.createElement("i");
            icon.className = "bi bi-record-circle";
            row.appendChild(icon);
            icon.style.color = "#f90";
            icon.setAttribute("data-blue", "")
            bodyRight.appendChild(row);

            //link
            onIconLink(icon, blue, event.name, "event");



        })

    if (blue.properties != undefined)
        blue.properties.forEach(prop => {
            if (prop.type == undefined) {
                renderProperty(bodyLeft, "left", prop, blue);
                renderProperty(bodyRight, "right", prop, blue);
            } else if (prop.type == "out") {
                renderProperty(bodyRight, "right", prop, blue);
            } else if (prop.type == "in") {
                renderProperty(bodyLeft, "left", prop, blue);
            }

        })

    //click
    div.onclick = (e: MouseEvent) => {

        if (blue.type == "component")
            onSelectComponent(blue.component);
    }
    //双击编辑名字
    titleBar.ondblclick = (e) => {
        e.stopPropagation();
        var input = document.createElement("input");
        input.type = "text";
        input.value = blue.name;
        input.onkeydown = (ky) => {
            ky.stopPropagation();
        }
        titleName.innerHTML = "";
        titleName.appendChild(input);
        input.onchange = () => {
            blue.name = input.value;
        }
        input.focus();
        input.onclick = (oc) => {
            oc.stopPropagation();
        }
        input.ondblclick = (oc) => {
            oc.stopPropagation();
        }
        input.onblur = () => {
            input.remove();
            titleName.innerHTML = blue.name;
        }

    }
    //move
    titleBar.onmousedown = (ed: any) => {

        if (ed.button != 0) {
            return;
        }

        var blueDiv = ed.path[1];
        var startY = ed.clientY;
        var startX = ed.clientX;
        var blueTop = parseFloat(blueDiv.style.top.replace("px", ""));
        var blueLeft = parseFloat(blueDiv.style.left.replace("px", ""));

        var move: boolean = true;
        //link

        getCurPage().blueLinks.forEach(link => {
            link.tempPosition = { x0: link.position.x0 + 0, y0: link.position.y0 + 0, x1: link.position.x1 + 0, y1: link.position.y1 + 0 };
        });

        document.onmousemove = (em: MouseEvent) => {
            if (move) {
                var top = blueTop + em.clientY - startY;
                var left = blueLeft + em.clientX - startX;
                if (top < 10) {
                    top = 0;
                }
                if (left < 10) {
                    left = 0;
                }
                if (conotent != undefined) {
                    if (top > conotent.clientHeight - 50) {
                        conotent.style.height = (top + 100) + "px";
                    }
                    if (left > conotent.clientWidth - 100) {
                        conotent.style.width = (left + 200) + "px";
                    }
                }

                blueDiv.style.top = top + "px";
                blueDiv.style.left = left + "px";
                blue.left = left;
                blue.top = top;

                //updateBlueLinks
                var links = getCurPage().blueLinks.filter(l => l.to.blue == blue.key);
                if (links != undefined) {
                    links.forEach(link => {
                        link.position.x1 = link.tempPosition.x1 + left - blueLeft;
                        link.position.y1 = link.tempPosition.y1 + top - blueTop;
                    })

                }
                links = getCurPage().blueLinks.filter(l => l.from.blue == blue.key);
                if (links != undefined) {
                    links.forEach(link => {
                        link.position.x0 = link.tempPosition.x0 + left - blueLeft;
                        link.position.y0 = link.tempPosition.y0 + top - blueTop;
                    });

                }

                updateBlueLinks();
            }


        }
        document.onmouseup = () => {
            move = false;
            // updateBlueLinks();
        }

    };
    //shortcut
    div.onkeydown = (e: KeyboardEvent) => {

        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key == "Backspace") {
                removeBlue(blue.key);
            }


        }
        e.stopPropagation();
    };

    //title contxtmenu
    var titleContentMenu: IMenuItem[] = [
        {
            id: "delete",
            label: "删除", accelerator: "Backspace", onclick: () => {
                removeBlue(getContextMenuArg());
            }
        }
    ];
    titleBar.oncontextmenu = (e: MouseEvent) => {
        openContextMenu(titleContentMenu, blue.key);
        //   showContextMenu(titleContentMenu, e.clientX, e.clientY, blue.key); e.stopPropagation();
    };


    return div;
}
function removeBlue(blueKey: string) {
    var index = getCurPage().blues.findIndex(s => s.key == blueKey);
    getCurPage().blues.splice(index, 1);



    while ((index = getCurPage().blueLinks.findIndex(l => l.from.blue == blueKey)) >= 0) {

        getCurPage().blueLinks.splice(index, 1);
    }

    while ((index = getCurPage().blueLinks.findIndex(l => l.to.blue == blueKey)) >= 0) {
        getCurPage().blueLinks.splice(index, 1);
    }

    var blueDiv = document.getElementById(blueKey);
    blueDiv.remove();
    updateBlueLinks();
}

function renderProperty(body: HTMLElement, align: "left" | "right", prop: IBluePoint, blue: IBlue) {
    var row = document.createElement("div");
    row.className = "blueRow";
    if (prop.hidden) {
        row.style.display = "none";
    }

    var label = document.createElement("div");
    label.style.flex = "1";

    label.innerText = prop.label;


    var icon = document.createElement("i");
    icon.className = "bi bi-record-circle";
    icon.setAttribute("data-blue", "")
    icon.style.color = "#09f";
    if (align == "right") {
        label.style.textAlign = "right";
        if (blue.type == "variable") {
            var input = document.createElement("input");
            input.placeholder = prop.label;
            if (blue.value != undefined)
                input.value = blue.value;
            input.style.width = "60px";
            input.style.fontSize = "12px";
            input.style.flex = "1";
            input.onkeydown = (e: KeyboardEvent) => {
                e.stopPropagation();
            }
            row.appendChild(input);
            input.onchange = (ei) => {
                blue.value = input.value;
            }
        } else if (blue.type == "matrix") {
            var textarea = document.createElement("textarea");
            textarea.placeholder = prop.label;
            if (blue.value != undefined)
                textarea.value = blue.value;
            textarea.style.width = "60px";
            textarea.style.fontSize = "12px";
            textarea.style.flex = "1";
            textarea.onkeydown = (e: KeyboardEvent) => {
                e.stopPropagation();
            }
            row.appendChild(textarea);
            textarea.onchange = (ei) => {
                blue.value = textarea.value;
            }
        } else
            row.appendChild(label);
        row.appendChild(icon);
        body.appendChild(row);
    } else if (align == "left") {
        row.appendChild(icon);
        row.appendChild(label);
        body.appendChild(row);
    }
    //link
    onIconLink(icon, blue, prop.name, "property");

}

function getDivClientTop(div: HTMLElement): number {
    var top = 0;
    while (div.offsetParent) {
        top += div.offsetTop;

        div = div.offsetParent as HTMLElement;
    }
    return top -64;
}
function getDivClientLeft(div: HTMLElement): number {
    var left = 0;
    while (div.offsetParent) {
        left += div.offsetLeft;
     
        div = div.offsetParent as HTMLElement;
    }
    return left -28;
}
function onIconLink(icon: HTMLElement, blue: IBlue, prop: string, type: "method" | "event" | "property", blues: IBlue[] = getCurPage().blues) {
    //icon contxtmenu
    var titleContentMenu: IMenuItem[] = [
        {
            id: "delete",
            label: "删除链接", onclick: () => {
                var args = getContextMenuArg();
                var cBlueKey = args.blue;
                var cProp = args.prop;
                var cType = args.type;
                var index = getCurPage().blueLinks.findIndex(s => s.from.blue == cBlueKey && s.from.name == cProp && s.from.type == cType);
                if (index >= 0)
                    getCurPage().blueLinks.splice(index, 1);
                index = getCurPage().blueLinks.findIndex(s => s.to.blue == cBlueKey && s.to.name == cProp && s.to.type == cType);
                if (index >= 0)
                    getCurPage().blueLinks.splice(index, 1);
                updateBlueLinks();
            }
        }
    ];
    icon.oncontextmenu = (e: MouseEvent) => {
        openContextMenu(titleContentMenu, { blue: blue.key, prop: prop, type: type });
        //  showContextMenu(titleContentMenu, e.clientX, e.clientY, { blue: blue.key, prop: prop, type: type });
        e.stopPropagation();
    }
    //link
    icon.draggable = true;
    icon.ondragstart = (e: any) => {
        console.log( (getDivClientLeft(e.target)),(getDivClientTop(e.target)));

        e.dataTransfer.setData("data-blue", JSON.stringify({ blue: blue, point: prop, type: type, x: (getDivClientLeft(e.target)), y: (getDivClientTop(e.target)) }));

        //  e.dataTransfer.setData("data-blue", JSON.stringify({ blue: blue, point: prop, type: type, x: getX(e), y: getY(e) }));

        document.getElementById("blueContext").className = "blueContext animate";

    }
    icon.ondragend = (e: DragEvent) => {
        //    e.dataTransfer.clearData();
        document.getElementById("blueContext").className = "blueContext";
    }
    icon.ondragover = (e: DragEvent) => {
        e.preventDefault();
    }
    icon.ondrop = (e: any) => {
        var data;
        var cl = e.dataTransfer.getData("data-blue");
        if (cl != undefined)
            data = JSON.parse(cl);


        if (data == undefined) {
            return;
        }

        //排除自己
        if (data.blue.key == blue.key && data.point == prop) {
            e.stopPropagation();
            return;
        }
        //排除 属性不能链接事件
        if (data.type == "property" && type == "event") {
            e.stopPropagation();
            return;
        }
        //排除 属性输出和输出相连
        // if (data.type == "property" && type == "property") {
        //     console.log(data);
        //     e.stopPropagation();
        //     return;
        // }
        var linkColor = "#09f";
        if (type == "property") {
            linkColor = "#09f";
        } else if (type == "event") {
            linkColor = "#f90";
        } else if (type == "method") {
            linkColor = "#f09";
        }
        var tempDataBlue = data.blue;
        var dataBlue = getCurPage().blues.find(s => s.key == tempDataBlue.key);
        var point = data.point;
        var x = data.x;
        var y = data.y;

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.zIndex = "1";
        svg.style.width = document.getElementById("blueContext").clientWidth + "px";
        svg.style.height = document.getElementById("blueContext").clientHeight + "px";
        document.getElementById("blueContext").appendChild(svg);
        svg.style.position = "absolute";
        var curve = paints.bezierCurve("fill:none;stroke:" + linkColor + ";stroke-width:2;", x, y, (getDivClientLeft(e.target)), (getDivClientTop(e.target)));
        svg.appendChild(curve);
     
        //save
        var link: IBlueLink = {
            key: getUUID(),
            color: linkColor,
            from: {
                component: dataBlue.component,
                blue: dataBlue.key,
                name: point,
                type: data.type,

            }, to: {
                component: blue.component,
                blue: blue.key,
                type: type,
                name: prop
            },
            position: {
                x0: x, y0: y, x1: (getDivClientLeft(e.target)), y1: (getDivClientTop(e.target))
            }
        };
        console.log(link);
        getCurPage().blueLinks.push(link);
        e.stopPropagation();
        //如果是数据集，自动生成数据集 子项
        if (dataBlue.type == "hub") {

            if (blue.type == "database") {
                dataBlue.properties = [dataBlue.properties[0], dataBlue.properties[1]]
                //按照数据库表，扩展数据集
                var table = getDataBase().tables.find(t => t.key == blue.component);
                if (table != undefined) {
                    var head = table.data[0];
                    for (var i = 0; i < head.length; i++) {
                        var th = head[i];
                        dataBlue.properties.push({ label: th, name: th, type: "out", hidden: true });
                        dataBlue.properties.push({ label: th, name: th, type: "in" });
                    }
                }

                //重新渲染 数据集 蓝图 组件
                var blueDiv = document.getElementById(dataBlue.key);
                blueDiv.innerHTML = "";
                renderBlue(undefined, dataBlue, blueDiv);
            }

        } else if (blue.type == "hub") {

            if (dataBlue.type == "database") {
                blue.properties = [blue.properties[0], blue.properties[1]]
                //按照数据库表，扩展数据集

                var table = getDataBase().tables.find(t => t.key == dataBlue.component);
                if (table != undefined) {
                    var head = table.data[0];
                    for (var i = 0; i < head.length; i++) {
                        var th = head[i];
                        blue.properties.push({ label: th, name: th, type: "out" });
                        blue.properties.push({ label: th, name: th, type: "in", hidden: true });
                    }
                }

                //重新渲染 数据集 蓝图 组件
                var blueDiv = document.getElementById(blue.key);
                blueDiv.innerHTML = "";
                renderBlue(undefined, blue, blueDiv);
            }

        }

    }
}
function getX(x: number): number {
    return x - 280;
}
function getY(y: number): number {
    //  console.log(y);
    return y - document.getElementById("workbench").clientHeight - 32 - 40 - 30 - 7;
}

function renderBluePreview(conotent: HTMLElement, blue: IBlue): HTMLElement {

    var div = document.createElement("div");
    div.className = "blue";
    div.id = blue.key;
    div.setAttribute("data-type", blue.type);
    div.style.pointerEvents = "none";
    conotent.appendChild(div);
    div.style.top = blue.top + "px";
    div.style.left = blue.left + "px";

    var titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.className = "blueTitleBar";
    div.appendChild(titleBar);

    var titleIcon = document.createElement("i");
    titleIcon.style.pointerEvents = "none";
    titleIcon.className = blue.icon;
    titleBar.appendChild(titleIcon);

    var titleName = document.createElement("div");
    titleName.style.pointerEvents = "none";
    titleName.innerText = blue.name;
    titleBar.appendChild(titleName);

    var body = document.createElement("div");
    body.className = "blueBody";
    div.appendChild(body);
    return div;
}
function renderBlueLink(conotent: HTMLElement, blueLink: IBlueLink) {

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.zIndex = "1";
    svg.style.width = (max(blueLink.position.x1, blueLink.position.x0) + 2) + "px";
    svg.style.height = (max(blueLink.position.y1, blueLink.position.y0) + 2) + "px";
    document.getElementById("blueContext").appendChild(svg);
    svg.style.position = "absolute";
    var color = "#09f";
    if (blueLink.color != undefined) {
        color = blueLink.color;
    }
    var curve = paints.bezierCurve("fill:none;stroke:" + color + ";stroke-width:2;", blueLink.position.x0, blueLink.position.y0, blueLink.position.x1, blueLink.position.y1);
    svg.appendChild(curve);
    conotent.appendChild(svg);
}
function max(v0: number, v1: number): number {
    return v0 > v1 ? v0 : v1;
}