/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染组件
***************************************************************************** */
import { clipboard } from "electron";
import { styleTransform } from "../render/toolbar";

import { ipcRendererSend } from "../preload";
import * as dargData from "../render/DragData";
import { copyComponents } from "../render/pageTitle";
import { getComponentStyle, setComponentStyle } from "../render/propertypanel";
import { getMousePosition } from "../render/shorcuts";
import { clearDargTimer, clipboardPaste, findCurPageComponent, getCurPage, getCurPageContent, getDragTimer, getPagePostion, getRootComponentHeight, getSelectComponents, hideComponentsOutLine, setSelectComponents, shortcutInsertComponent, showComponentsOutLine, startDargTimer } from "../render/workbench";
import { getConfig, getProject, getViewPosition } from "../render/workspace";
import { onAddComponents, onDelComponents, onMoveComponent, onSelectComponents } from "./componentEvent";
import { IMenuItem, openContextMenu, showComponentContextMenu } from "./contextmenu";
import { getUUID, IComponent, IComponentProperty, IExtension, IShape } from "./interfaceDefine";
export function getComponentTempateByType(type: string): IComponent {
    if (componentsTemplate == undefined || componentsTemplate.length == 0) {
        console.log("componentsTemplate is undefined");
        return undefined;
    }

    var component: IComponent = componentsTemplate.find((item: IComponent) => item.type === type);
    return component;
}


var componentsTemplate: Array<IComponent> = [];
export function getComponentsTemplate() {
    return componentsTemplate;
}

export function setComponentsTemplate(components: Array<IComponent>) {
    componentsTemplate = components;
}

export function setHover(ele: HTMLElement, style: string, hoverString: string) {
    ele.onmouseover = (e: any) => {
        e.target.style.cssText = style + hoverString;
    }
    ele.onmouseleave = (e: any) => {
        e.target.style.cssText = style;
    }

}
export function renderStorePreview(content: HTMLElement, extension: IExtension, dropIndex?: number): HTMLElement {

    var preview = document.createElement("div");
    preview.className = "component_canvas";
    preview.style.margin = "0";
    preview.style.padding = "0px";
    preview.style.pointerEvents = "none";
    // preview.style.height = "120px";
    // preview.style.width = "200px";
    preview.style.borderRadius = "0px";
    preview.style.pointerEvents = "none";
    var i = document.createElement("img");
    i.src = extension.cover;
    // i.style.minWidth = "200px";
    // i.style.maxHeight = "100px";
    i.style.pointerEvents = "none";
    preview.appendChild(i);
    if (dropIndex != undefined && dropIndex >= 0) {
        content.children.item(dropIndex).insertAdjacentElement("beforebegin", preview);
    } else {
        content.appendChild(preview);
    }

    return preview;


}
/**
 * 渲染组件 预览
 * @param content 
 * @param component 
 * @param dropIndex 
 * @returns 
 */
export function renderComponentPreview(content: HTMLElement, component: IComponent, dropIndex?: number): HTMLElement {
    if (component == undefined)
        return undefined;
    // component.key = uuid();
    // var componentDiv = document.createElement("div");
    // componentDiv.className = "component_canvas";
    // componentDiv.setAttribute("type", component.type);
    // componentDiv.id = component.key;
    // content.appendChild(componentDiv);



    if (component.onPreview != undefined) {
        if (getCurPage().style != undefined && getCurPage().style.length > 0) {
            //设置 样式
            var styles = getCurPage().styles[component.type];
            console.log(styles);
            if (styles != undefined) {
                component.styles = styles;
                component.style = undefined;
            }

        }

        var preview = component.onPreview(component);
        preview.className += " component_canvas";
        preview.id = component.key;
        if (preview.style != undefined && preview.style.cssText.length <= 0) {
            if (component.styles != undefined && component.styles["root"] != undefined) {
                preview.style.cssText = component.styles["root"];
            } else if (component.style != undefined) {
                preview.style.cssText = component.style;
            }

        }

        preview.style.pointerEvents = "none";

        if (component.isExpand) {
            //   getCurPageContent().appendChild(preview);
            // openExpand();

        } else {
            if (dropIndex != undefined && dropIndex >= 0) {
                content.children.item(dropIndex).insertAdjacentElement("beforebegin", preview);
            } else {
                content.appendChild(preview);
            }
        }



        return preview;
    }

    return null;

}
/**
 * 初始化组件
 * @param componentT 
 * @param clone 
 * @returns 
 */
export function initComponent(componentT: IComponent, clone?: boolean): IComponent {
    if (componentT == undefined) {
        return undefined;
    }

    var component: IComponent;
    if (componentT.isTemplate || clone) {
        var key = getUUID();

        component = {
            key: key,
            icon: componentT.icon,
            label: componentT.label + "_" + commentTypeCountMap(componentT.type),
            option: componentT.option,
            type: componentT.type,
            style: componentT.style,
            drop: componentT.drop,
            background: componentT.background,
            onDrop: componentT.onDrop,
            onPreview: componentT.onPreview,
            onRender: componentT.onRender,
            shape: componentT.shape,
            isFixed: componentT.isFixed,
            property: copyComponentProperty(componentT.property),
            styles: copyStyles(componentT.styles),
            toogle: componentT.toogle,
            hidden: componentT.hidden,
            isExpand: componentT.isExpand,
            blue: copyBlue(componentT.blue),
            sort: 0,
            edge: componentT.edge,
            group: componentT.group,
            panel: componentT.panel,
            onChild: componentT.onChild
        };
    } else {
        component = componentT;

    }
    return component;

}
function copyBlue(blue: any): any {
    if (blue == undefined)
        return undefined;
    var event: any;
    var method: any = blue.method;
    var property: any;
    if (blue.event != undefined) {
        event = {};
        for (var key in blue.event) {
            var eve = blue.event[key];
            var e = { label: eve.label };
            event[key] = e;
        }
    }
    if (blue.property != undefined) {
        property = {};
        for (var key in blue.property) {
            var eve = blue.property[key];
            var el: any = { label: eve.label, get: eve.get, set: eve.set };
            property[key] = el;
        }
    }

    var temp = {
        event: event,
        method: method,
        property: property,
        properties: blue.properties

    };
    return temp;

}
export function copyStyles(styles: any): any {
    if (styles == undefined)
        return undefined;
    var newStyles: any = {};
    for (var key in styles) {
        newStyles[key] = styles[key];
    }
    return newStyles;

}
/**
 * 拷贝组件属性
 * @param property 
 * @returns 
 */
export function copyComponentProperty(property: any): any {
    var result: any = {};
    if (property != undefined) {
        for (var key in property) {
            var p = property[key];
            if (p instanceof Array) {
                result[key] = [];
            } else {
                var item: IComponentProperty = {
                    label: "" + p.label, type: p.type, context: p.context
                }
                result[key] = item;
            }

        }
    }
    return result;
}
/**
 * 更新组件
 * @param component 
 */
export function updateComponent(component: IComponent) {

    var componentDiv = document.getElementById(component.key);
    if (componentDiv != undefined) {
        renderComponent(undefined, component, undefined, undefined, undefined, componentDiv);
    }


}

var _commentTypeCountMap = new Map<string, number>();
function commentTypeCountMap(type: string): number {
    if (!_commentTypeCountMap.has(type)) {
        _commentTypeCountMap.set(type, 1);
        return 1;
    }
    var count = _commentTypeCountMap.get(type);
    _commentTypeCountMap.set(type, count + 1);
    return count + 1;
};
/**
 * 渲染多个组件：渲染根组件
 * 并安装存储时丢失的方法
 * @param content 
 * @param components 
 */
export function renderRootComponents(content: HTMLElement, components: IComponent[]) {
    var page_parent = document.getElementById("page_parent_" + getCurPage().key);
    var viewPosition = getViewPosition();
    var viewHeigh = window.innerHeight - viewPosition.top - viewPosition.bottom;
    components.forEach((component, index) => {

        component.isRoot = true;

        if (component.isRemoved == undefined && !component.isRemoved) {
            if (component.onRender == undefined) {
                try {
                    installComponent(component);
                } catch (error) {
                    console.log(error);
                }
            }
            if (component.onRender != undefined && component.onPreview != undefined) {
                try {

                    //兼容旧的dialog
                    if (component.type == "dialog")
                        component.isExpand = true;

                    if (component.isExpand) {
                        //初始化时，不渲染 扩展内容
                    } else {
                        var cpmt = renderComponent(content, component, undefined, index, undefined, undefined, true);
                        var root = cpmt.root;
                      
                        
                        var body = cpmt.body;
                        requestIdleCallback(() => {
                            var  h=getRootComponentHeight(component.key);
                            if(h!=undefined&&h.length>0){
                                root.style.height=h;
                                root.setAttribute("data-height", "true");
                            }
                       
                            var pagePosition= getPagePostion(getCurPage(),viewPosition);

                            if (root.offsetTop > viewHeigh -pagePosition.top+ viewPosition.top + 100) {
                                //设置上次的高度
                             
                                body.innerHTML = "";
                            } else if (root.offsetTop + root.clientHeight < -(pagePosition.top + viewPosition.top + 100)) {
                                  //设置上次的高度
                                 
                                body.innerHTML = "";
                            } else {
                                var db = root.getAttribute("data-background");
                                if (db != undefined) {
                                    root.style.background = db;
                                }
                                var dh = root.getAttribute("data-height");
                                if (dh != undefined) {
                                    root.style.height = "";
                                }
                                //渲染形状背景
                                if (component.shape != undefined && component.shape.length > 0) {
                                    requestIdleCallback(() => {
                                        setTimeout(() => {
                                            renderComponentShape(component, root)
                                        }, 100);
                                    })
                                }

                                if (component.children != undefined && component.children.length > 0) {
                                    setTimeout(() => {
                                        //渲染子组件
                                        renderComponents(body, component.children, component);
                                    }, 0);
                                }


                            }

                        });

                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    })
}
/**
 * 渲染多个组件
 * 并安装存储时丢失的方法
 * @param content 
 * @param components 
 */
export function renderComponents(content: HTMLElement, components: IComponent[], parent: IComponent) {
    components.forEach((component, index) => {
        component.isRoot = false;
        if (component.isRemoved == undefined && !component.isRemoved) {
            if (component.onRender == undefined) {
                try {
                    installComponent(component,parent.path);
                } catch (error) {
                    console.log(error);
                }
            }
            if (component.onRender != undefined && component.onPreview != undefined) {
                try {
                    if (parent != undefined && parent.type == "row") {
                        component.flex = true;
                    }
                    //兼容旧的dialog
                    if (component.type == "dialog")
                        component.isExpand = true;

                    if (component.isExpand) {
                        //初始化时，不渲染 扩展内容
                    } else
                        renderComponent(content, component, undefined, index, parent);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    })
}
export function copyComponent(cmpt: any, parentPath?: string) {
    installComponent(cmpt);
    cmpt.key = getUUID();
    //设置模板
    cmpt.master = cmpt.path;
    //更新path
    if (parentPath == undefined) {
        cmpt.path = cmpt.key;
    } else {
        cmpt.path = parentPath + "/" + cmpt.key;
    }

    //包括子项
    if (cmpt.children != undefined) {
        cmpt.children.forEach((c: any) => {
            copyComponent(c, cmpt.path);
        })
    }
}
/**
 * 安装组件
 * 以icon,image为主
 * 给组件绑定 
 * @param component 
 */
export function installComponent(component: IComponent,parentPath?:string) {

        if(parentPath!=undefined){
            component.path=parentPath+"/"+component.key;
        }else{
            component.path=component.key;
        }

    if (component.type == "icon") {
        var icon_e = component.icon;
        if(icon_e==undefined){
            icon_e="diamond";
          
        }
     
        component.onPreview=()=>{return undefined};
        component.onRender = (component, element) => {
            var pi: HTMLElement;
            if (element != undefined)
                pi = element;
            else
                pi = document.createElement("div");
            // if (component.blue!=undefined&&component.blue.event!=undefined&& component.blue.event.click != undefined)
            pi.setAttribute("icon_hover", "true");
            if(icon_e.indexOf("bi bi-")<0){
               
                pi.innerHTML = "<i class='bi bi-" + icon_e + "'></i>";
            }else{
                pi.innerHTML = "<i class='" + icon_e + "'></i>";
            }
          
            pi.onclick = () => {
                if (component.blue.event.click.on != undefined) {
                    component.blue.event.click.on();
                }

            }
            return { root: pi, content: pi }

        };
    } else if (component.type == "image") {
        component.onPreview = () => {
            return document.createElement("div");
        };
        component.onRender = (component: IComponent, element: any) => {
            var img;
            if (element != undefined)
                img = element;
            else
                img = document.createElement("img");
            if (component.property.length > 0)
                img.src = getProject().work + "/images/" + component.property[0].context;
            return { root: img, content: img }
        };
    } else {
        var template = getComponentTempateByType(component.type);
        if (template != undefined) {
            //辅助模板属性至组件
            component.onPreview = template.onPreview;
            component.onRender = template.onRender;
            component.onChild = template.onChild;
            component.icon=template.icon;
            component.drop=template.drop;
            component.group=template.group;
            component.edge=template.edge;
            component.blue = copyBlue(template.blue);
            component.edge = template.edge;
            if (template.toogle) {
                component.toogle = template.toogle;
            }
           
       

        } else {
            console.log("没有找到组件类型:" + component.type);
        }
    }
     //复原被压缩的样式
     if(component.style!=undefined&&component.style.length>0){
        var old=component.style;
        styleTransform.forEach(trans=>{
            var rg = RegExp("\\["+trans[1]+"\\]", "g");
            old=old.replace(rg,trans[0]+":")
           
        })
         component.style=old;
        
    }
    if(component.styles!=undefined&&component.styles.length>0){
        var olds=component.styles;
        styleTransform.forEach(trans=>{
            var rg = RegExp("\\["+trans[1]+"\\]", "g");
            olds=olds.replace(rg,trans[0]+":")
        })
        component.styles=olds;
        
    }
}

export function onSelectComponent(componentPath: string) {
    console.log("选择组件:" + componentPath);
    getSelectComponents().forEach(s => {
        var div = document.getElementById(getPathKey(s));
        if (div) div.removeAttribute("selected");
    })
    setSelectComponents([componentPath]);
    var div = document.getElementById(getPathKey(componentPath));
    if (div) div.setAttribute("selected", "true");

}
var previewParent: string;
/**
 * 渲染组件
 * @param content 
 * @param component 
 * @param dropIndex 
 * @returns 
 */
export function renderComponent(content: HTMLElement, component: IComponent, dropIndex?: number, index?: number, parent?: IComponent, self?: HTMLElement, hideReal?: boolean): {
    root: HTMLElement,
    body: HTMLElement
} {


    //如果隐藏，不渲染。
    // if (component.hidden) {
    //     return;
    // }
    //设置母版
    var noMaster = true;
    if (component.master != undefined && component.master.length > 0) {
        var master = findCurPageComponent(component.master);
        if (master != undefined) {
            component.style = master.style;
            component.styles = master.styles;
            noMaster = false;

        }
    }
    if (noMaster && getCurPage().style != undefined && getCurPage().style.length > 0) {
        component.master = undefined;
        //设置 样式
        var styles = getCurPage().styles[component.type];
        console.log(styles);
        if (styles != undefined) {
            component.styles = styles;
            component.style = undefined;
        }

    }


    //渲染组件
    var rs;
    if (self == undefined) {
        rs = component.onRender(component, undefined, content, "design", getProject().themeColor);
    } else {
        rs = component.onRender(component, self, undefined, "design", getProject().themeColor);
    }
    if (component.type == "layers") {
        console.log("------------edge", component.edge);
    }
    var root = rs.root;
    var body = rs.content;
    root.tabIndex = 100;
    if (root.className.length > 0) {
        root.className = "component_canvas " + root.className;
    } else {
        root.className = "component_canvas";
    }
    if (component.flex) {
        root.setAttribute("dataFlex", "true");
    }
    root.setAttribute("component_group", component.group);
    root.setAttribute("component_type", component.type);
    root.id = component.key;
    if (body != root) {
        body.id = "_" + component.key;
        root.setAttribute("data-body", "true");
    }
    //设置组件样式
    if (root.style != undefined && root.style.cssText.length <= 0) {
        if (component.styles != undefined && component.styles["root"] != undefined) {
            root.style.cssText = component.styles["root"];
        } else if (component.style != undefined) {
            root.style.cssText += component.style;
        }
        if (hideReal) {
            root.setAttribute("data-background", root.style.background + "");
            root.style.background = "";
        }

    }
    if (component.hidden) {
        if (component.toogle != undefined) {
            component.toogle(root, true);
        } else {
            //  root.style.display = "none";
            var config = getConfig();
            if (config.eye == undefined || config.eye == false) {
                root.style.display = "none";
            } else {
                root.style.opacity = "0.5";
            }

        }
    }

    //控制层级 layer
    if (parent != undefined && index != undefined) {
        if (parent.onChild != undefined) {
            parent.onChild(parent, component, index, rs.root, rs.content);
        }

    }

    //渲染子组件
    var eventEle = root;
    // if (component.type == "dialog") {
    //     requestIdleCallback(() => {
    //         getCurPageContent().appendChild(root);
    //     })
    //     eventEle = body;
    // } else 
    if (content != undefined) {
        if (dropIndex != undefined && dropIndex >= 0) {
            content.children.item(dropIndex).insertAdjacentElement("beforebegin", root);
        } else {
            content.appendChild(root);
        }
    }
    //渲染形状背景
    if (component.shape != undefined && component.shape.length > 0 && !hideReal) {
        requestIdleCallback(() => {
            setTimeout(() => {
                renderComponentShape(component, root)
            }, 100);
        })
    }


    //渲染看操作按钮,hover时触发。
    // var soliderBottom=document.createElement("div");
    // soliderBottom.className="component_tap solider_bottom";

    // var soliderBottomIcon=document.createElement("i");
    // soliderBottomIcon.className="bi bi-chevron-bar-expand";
    // soliderBottom.appendChild(soliderBottomIcon);

    // root.appendChild(soliderBottom);


    // var soliderRight=document.createElement("div");
    // soliderRight.className="component_tap solider_right";

    // var soliderRightIcon=document.createElement("i");
    // soliderRightIcon.className="bi bi-chevron-bar-expand";
    // soliderRightIcon.style.transform="rotate(90deg)";
    // soliderRight.appendChild(soliderRightIcon);

    // root.appendChild(soliderRight);


    //可移动
    if (component.isFixed) {
        eventEle.style.position = "fixed";
    }

    if (component.children != undefined && component.children.length > 0 && !hideReal) {
        setTimeout(() => {
            //渲染子组件
            renderComponents(body, component.children, component);
        }, 0);
    }
    // root.onmouseover =(e)=>{
    //     var old=getHoverComponentRoot();
    //     if(old!=undefined){
    //         old.removeAttribute("data-hover");
    //     }
    //     root.setAttribute("data-hover", "true");
    //     setHoverComponentRoot(root);
    //     e.stopPropagation();


    // }
    // root.onmouseleave =(e)=>{
    //     root.removeAttribute("data-hover");
    //     e.stopPropagation();
    // }


    //单击选择组件
    eventEle.onclick = (e) => {


        getSelectComponents().forEach(s => {
            var div = document.getElementById(getPathKey(s));
            if (div) div.removeAttribute("selected");
        });
        setSelectComponents([component.path]);
        eventEle.setAttribute("selected", "true");
        e.stopPropagation();
        onSelectComponents([component]);
    }
    ////////////
    //组件拖拽事件
    //页面fixed模式下禁止拖拽事件
    ////////////
    if (getCurPage().mode != "fixed") {
        componentOnDrags(eventEle, component, body);
    } else {
        componentOnMove(eventEle, component, body);
    }

    ////////////
    //组件右键菜单
    //快捷键
    //鼠标事件
    ////////////

    componentOnMenuAndKey(eventEle, component, body);

    componentOnMouse(eventEle, component, body);

    return { root: root, body: body };
}
/**
 * 组件鼠标事件
 * @param eventEle 
 * @param component 
 * @param body 
 */
function componentOnMouse(eventEle: HTMLElement, component: IComponent, body: HTMLElement) {

    eventEle.onmouseenter = (e: MouseEvent) => {
        var selectCover = document.getElementById("selectCover");
        if (selectCover != undefined) {
            console.log("select add ", component.key);
            if (getSelectComponents().indexOf(component.path) < 0) {
                getSelectComponents().push(component.path);
                document.getElementById(getPathKey(component.key)).setAttribute("selected", "true");
            }


        }
    }
    if (component.edge != undefined && component.edge.length > 0) {
        //悬停
        var mouseTime: number = 0;
        var mouseX: number = 0;
        var mouseY: number = 0;
        eventEle.onmousemove = (e: MouseEvent) => {
            if (getSelectComponents().indexOf(component.path) >= 0) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        };
        eventEle.onmouseover = (e: MouseEvent) => {
            mouseTime = Date.now();
            setTimeout(() => {
                if (getSelectComponents().indexOf(component.path) >= 0) {
                    if (Date.now() - mouseTime > 2000) {
                        //悬停
                        console.log("悬停", component.key, component.edge);
                        showComponentContextMenu(component.edge, mouseX, mouseY);
                        //  activePropertyPanel(component);
                    }
                }
            }, 3000);
        };
        eventEle.onmouseout = (e: MouseEvent) => {
            mouseTime = 0;
        }
    }
}
/**
 * 组件的 菜单和快捷键
 * @param eventEle 
 */
function componentOnMenuAndKey(eventEle: HTMLElement, component: IComponent, body: HTMLElement) {
    eventEle.oncontextmenu = (e: MouseEvent) => {
        // folderTitle.setAttribute("selected", "true");
        var menuItems: Array<IMenuItem> = [{
            id: "refresh",
            label: "重绘 " + component.label, icon: "bi bi-arrow-clockwise", accelerator: "", onclick: () => {

                var path = getSelectComponents()[0];
                var cmpt = findCurPageComponent(path);
                renderComponent(undefined, cmpt, undefined, undefined, undefined, document.getElementById(cmpt.key));

            }
        }, {

            type: "separator"
        }, {
            id: "delete",
            label: "删除", icon: "bi bi-trash", accelerator: "Backspace", onclick: () => {
                getSelectComponents().forEach((path: string) => {
                    var cmpt = findCurPageComponent(path);
                    deleteComponent(cmpt);
                });

            }
        }, {
            id: "copy",
            label: "复制", icon: "bi bi-files", accelerator: "Command/control+c", onclick: () => {
                console.log("copy", getSelectComponents());
                var _selectComponents: IComponent[] = [];
                getSelectComponents().forEach((path: string) => {
                    var cmpt = findCurPageComponent(path);
                    if (cmpt != undefined) {
                        _selectComponents.push(cmpt);
                    }
                });
                var __selectComponents_ = copyComponents(_selectComponents, true);
                clipboard.writeText("[selectComponents]" + JSON.stringify(__selectComponents_));
            }
        }, {
            id: "paste",
            label: "粘贴", icon: "bi bi-clipboard", accelerator: "Command/control+v", onclick: () => {
                clipboardPaste(body, component);

            }
        }, {

            type: "separator"
        }, {
            id: "gotop",

            label: "上移一层", icon: "bi bi-layout-wtf", accelerator: "",
            onclick: () => {

            }
        }, {
            id: "bottom",
            label: "下移一层", icon: "bi bi-card-image", accelerator: "", onclick: () => {

            }
        }
            , {
            id: "gotop",

            label: "置于顶层", icon: "bi bi-layout-wtf", accelerator: "",
            onclick: () => {

            }
        }, {
            id: "gobottom",
            label: "置于低层", icon: "bi bi-card-image", accelerator: "", onclick: () => {
                setTimeout(() => {
                    ipcRendererSend("insertImage");
                }, 1);
            }
        }, {

            type: "separator"
        }
            , {
            id: "insert",

            label: "插入组件", icon: "bi bi-layout-wtf", accelerator: "i",
            onclick: () => {
                setTimeout(() => {
                    shortcutInsertComponent(e.clientX, e.clientY, component);
                }, 1);
            }
        }, {
            id: "insertimg",
            label: "插入图片", icon: "bi bi-card-image", accelerator: "i", onclick: () => {
                setTimeout(() => {
                    ipcRendererSend("insertImage");
                }, 1);
            }
        }];
        openContextMenu(menuItems);
        e.stopPropagation();
    }
    ////////////
    //组件快捷键
    ////////////
    eventEle.onkeydown = (e: KeyboardEvent) => {

        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key == "s") {
                var h = getComponentStyle(component, "height", "px");
                var nh = parseFloat(h) + 2;
                setComponentStyle(component, "height", nh + "px");
            } else if (e.key == "w") {
                var h = getComponentStyle(component, "height", "px");
                var nh = parseFloat(h) - 2;
                setComponentStyle(component, "height", nh + "px");
            } else if (e.key == "d") {
                var h = getComponentStyle(component, "width", "px");
                var nh = parseFloat(h) + 2;
                setComponentStyle(component, "width", nh + "px");
            } else if (e.key == "a") {
                var h = getComponentStyle(component, "width", "px");
                var nh = parseFloat(h) - 2;
                setComponentStyle(component, "width", nh + "px");
            } else if (e.key == "t") {

                setComponentStyle(component, "background-color", "transparent");
            } else if (e.key == "r") {
                if (getProject().theme == "dark") {
                    setComponentStyle(component, "background-color", "#242424");
                } else {
                    setComponentStyle(component, "background-color", "#fff");
                }
            } else if (e.key == "m") {
                setComponentStyle(component, "margin", "0");
            } else if (e.key == "p") {

                setComponentStyle(component, "padding", "0");
            } else if (e.key == "f") {
                setComponentStyle(component, "min-width", "");
                setComponentStyle(component, "max-width", "");
                setComponentStyle(component, "width", "auto");
            } else if (e.key == "h") {
                setComponentStyle(component, "min-height", "");
                setComponentStyle(component, "max-height", "");
                setComponentStyle(component, "height", "auto");
            } else if (e.key == "Backspace") {
                deleteComponent(component);
            } else if (e.key == "b") {
                var b = getComponentStyle(component, "font-weight", "");
                if (b == "") {
                    setComponentStyle(component, "font-weight", "bolder");
                } else {
                    setComponentStyle(component, "font-weight", "");
                }
            } else if (e.key == "l") {
                var b = getComponentStyle(component, "border", "");
                if (b == "") {
                    setComponentStyle(component, "border", "1px solid rgba(175,175,175,0.5)");
                } else {
                    setComponentStyle(component, "border", "");
                }
            } else if (e.key == "i") {
                shortcutInsertComponent(getMousePosition().x, getMousePosition().y, component);
            } else if (e.key == "u") {
                shortcutInsertComponent(getMousePosition().x, getMousePosition().y, component, component.sort);
            } else if (e.key == "v") {
                showComponentsOutLine();
            } else if (e.key == "y") {
                //隐藏组件
                component.hidden = true;
                if (component.toogle != undefined) {
                    component.toogle(document.getElementById(component.key), component.hidden);
                } else {
                    document.getElementById(component.key).style.display = "none";
                }


            }
            e.stopPropagation();
        }
    }
    //shortcut
    eventEle.onkeyup = (e: KeyboardEvent) => {

        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key == "v") {
                hideComponentsOutLine();
            }
            e.stopPropagation();
        }

    };
}
/**
 * 移动组件
 * @param eventEle 
 * @param component 
 * @param body 
 */
function componentOnMove(eventEle: HTMLElement, component: IComponent, body: HTMLElement) {

    eventEle.style.position = "absolute";
    //move
    eventEle.onmousedown = (ed) => {

        if (ed.button == 2) {
            return;
        }
        console.log(ed);


        var startY = ed.clientY;
        var startX = ed.clientX;
        var blueTop = 0;
        if (eventEle.style.top != undefined && eventEle.style.top.length > 0) {
            blueTop = parseFloat(eventEle.style.top.replace("px", ""));
        }


        var blueLeft = 0;
        if (eventEle.style.left != undefined && eventEle.style.left.length > 0) {
            blueLeft = parseFloat(eventEle.style.left.replace("px", ""));
        }



        var move: boolean = true;

        document.onmousemove = (em: MouseEvent) => {
            if (move) {
                console.log(blueTop, em.clientY, startY);
                var top = blueTop + em.clientY - startY;
                var left = blueLeft + em.clientX - startX;
                if (top < 10) {
                    top = 0;
                }
                if (left < 10) {
                    left = 0;
                }
                if (left > getCurPage().width) {
                    left = getCurPage().width - 2;
                }
                if (top > getCurPage().height) {
                    top = getCurPage().height - 2;
                }

                eventEle.style.top = top + "px";
                eventEle.style.left = left + "px";
                setComponentStyle(component, "position", "absolute", false);
                setComponentStyle(component, "left", eventEle.style.left, false);
                setComponentStyle(component, "top", eventEle.style.top, false);


            }


        }
        document.onmouseup = () => {
            move = false;
            // updateBlueLinks();
        }

    };

}
/**
 * 组件拖拽事件
 * @param eventEle 
 * @param component 
 */
function componentOnDrags(eventEle: HTMLElement, component: IComponent, body: HTMLElement) {

    var previewComponent: HTMLElement = null;//组件拖拽过程中的预览
    var dropIndex: number = -1;//组件插入时的位置
    var lastDropIndex: number;//组件插入时的位置
    eventEle.draggable = true;
    eventEle.ondragstart = (e: DragEvent) => {
        var img = document.createElement("img");
        img.src = "./drag.png";
        e.dataTransfer.setDragImage(img, -10, -20);
        dargData.setData("component", component);
        e.stopPropagation();
        var page = getCurPageContent();
        if (page != undefined) {
            page.setAttribute("data-drag", "true");
        }
    };
    eventEle.ondragend = (e: DragEvent) => {

        var page = getCurPageContent();
        if (page != undefined) {
            page.removeAttribute("data-drag");
        }

    };
    eventEle.ondragover = (e: any) => {
        // console.log("componentDiv.ondragover ");
        e.stopPropagation();

        if (getDragTimer() <= 3) {
            return;
        }

        var dragComponent = dargData.getData("component");
        if (dragComponent != undefined) {
            if (dragComponent.key == component.key) {
                return;
            }
            e.preventDefault();
            //e.dataTransfer.dropEffect = "none";
            //调整组件位置
            //console.log("调整组件位置", dragComponent);
            eventEle.setAttribute("dataDrag", "true");
            return;
        }

        var dargCatalog = dargData.getData("catalog");
        if (dargCatalog != undefined) {
            if (component.drop == "catalog") {
                e.preventDefault();
                return;
            }
        }

        var dragStore = dargData.getData("store");
        if (dragStore != undefined) {
            //拖拽 商店 内容 至 界面
            if (previewComponent == null) {
                previewComponent = renderStorePreview(body, dragStore, dropIndex)
            }
       
            e.preventDefault();
            return;
        }

        var dragComponentTemplate = dargData.getData("componentTemplate");
        if (dragComponentTemplate != undefined) {
            //新增组件
            //  console.log("新增组件", dragComponentTemplate);
            if (component.drop == "component") {
                e.preventDefault();
            } else {
                e.dataTransfer.dropEffect = "none";
                return;
            }
            if (component.children != null && component.children.length > 0) {
                var lastKey: string;
                var lastIndex: number;
                if (component.children.length > 1)
                    for (var i = 0; i < component.children.length; i++) {
                        var child = component.children[i];
                        if (child.isRemoved == undefined || !child.isRemoved) {
                            var childDiv = document.getElementById(child.key);
                            if (childDiv != undefined) {
                                //水平布局、垂直布局
                                if (component.type == "row") {
                                    var left = childDiv.getBoundingClientRect().left;
                                    // console.log("left", left, e.clientX);
                                    if (e.clientX > left) {
                                        break;
                                    }
                                    lastIndex = i;
                                    lastKey = child.key;
                                } else {
                                    var top = childDiv.getBoundingClientRect().top;
                                    // console.log("top", top, e.clientY);
                                    if (e.clientY > top) {
                                        break;
                                    }
                                    lastIndex = i;
                                    lastKey = child.key;
                                }
                            }
                        }
                    }
                else {
                    var child = component.children[0];
                    var childDiv = document.getElementById(child.key);
                    //水平布局、垂直布局
                    if (component.type == "row") {
                        var left = childDiv.getBoundingClientRect().left;
                        // console.log("left", left, e.clientX);
                        if (e.clientX < left) {
                            dropIndex = 0;
                            //  lastKey = child.key;
                        }
                    } else {
                        var top = childDiv.getBoundingClientRect().top;
                        // console.log("top", top, e.clientY);
                        if (e.clientY < top) {
                            dropIndex = 0;
                            //  lastKey = child.key;
                        }
                    }
                }
                if (lastKey != undefined) {
                    dropIndex = lastIndex;
                }
                if (dropIndex == undefined) {
                    dropIndex = component.children.length;
                }
            }
            if (lastDropIndex != dropIndex) {
                lastDropIndex = dropIndex;
                var componentT = dragComponentTemplate;
                // if (previewComponent != null) {
                //     previewComponent.remove();
                //     previewComponent = null;
                // }
                // e.target.className.indexOf("component_canvas") >= 0 
                if (e.target == eventEle) {
                    if (componentT != undefined) {
                        previewParent = component.key;
                        previewComponent = renderComponentPreview(body, componentT, dropIndex)
                    }

                }
            }
        }
    }

    eventEle.ondragenter = (e: any) => {
        console.log("componentDiv.ondragenter ");
        e.stopPropagation();
        startDargTimer();
        dropIndex = -1;
        lastDropIndex = undefined;
    }

    eventEle.ondragleave = (e: any) => {
        e.stopPropagation();
        //  clearDargTimer();
        if (previewParent != undefined && previewParent == component.key) {

        } else {
            if (previewComponent != null) {
                previewComponent.remove();
                previewComponent = null;
                previewParent = undefined;
            }
        }





    }

    eventEle.ondrop = (e: DragEvent) => {
        clearDargTimer();
        e.stopPropagation();

        //拖拽目录
        var dargCatalog = dargData.getData("catalog");
        if (dargCatalog != undefined) {
            if (component.drop == "catalog") {
                if (component.onDrop != undefined) {

                    component.onDrop(component, dargCatalog);
                    return;
                }
            }
        }
        //拖拽组件
        var dragComponent = dargData.getData("component");
        //  console.log(dragComponent);
        if (dragComponent != undefined) {
            if (dragComponent.key == component.key) {
                return;
            }
            if (component.drop == "component") {
                if (component.onDrop != undefined) {
                    component.onDrop(component, dargCatalog);
                    return;
                }
            }


            //调整组件位置
            //     console.log("调整组件位置", dragComponent);
            eventEle.setAttribute("dataDrag", "false");
            //删除旧的
            var dragComponentDiv = document.getElementById(dragComponent.key);
            if (dragComponentDiv != undefined) {
                dragComponentDiv.remove();
            }
            var oldParent = getComponentParent(dragComponent);
            if (oldParent == undefined) {
                //      console.log("parent is undefined");
                var index = getCurPage().children.findIndex(x => x.key == dragComponent.key);
                if (index >= 0) {
                    getCurPage().children.splice(index, 1);
                }
            } else {
                var index = oldParent.children.findIndex(x => x.key == dragComponent.key);
                if (index >= 0) {
                    oldParent.children.splice(index, 1);
                }
            }
            //添加新的
            //获取当前上级组件
            var parent = getComponentParent(component);
            if (parent == undefined) {
                //      console.log("parent is undefined");
                var index = getCurPage().children.findIndex(x => x.key == component.key);
                if (index >= 0) {
                   
                    getCurPage().children.splice(index, 0, dragComponent);
                    var content = getCurPageContent();
                    content.innerHTML = "";
                    component.path=component.key;
                    renderComponents(content, getCurPage().children, undefined);
                }

            } else {
                var index = parent.children.findIndex(x => x.key == component.key);
                if (index >= 0) {
                    parent.children.splice(index, 0, dragComponent);
                    var content = document.getElementById(parent.key);
                    content.innerHTML = "";
                    component.path= component.path+"/"+component.key;
                    renderComponents(content, parent.children, undefined);
                }
            }
            onMoveComponent(dragComponent);
        }
        var dragComponentTemplate = dargData.getData("componentTemplate");
        if (dragComponentTemplate != undefined) {
            // console.log("新增组件", dragComponentTemplate);
            if (component.drop == "component") {
                if (previewComponent != null) {
                    previewComponent.remove();
                    previewComponent = null;
                    previewParent = undefined;
                }
                //如果 组件 自定义了事件，直接返回
                if (component.onDrop != undefined) {
                    component.onDrop(component, dragComponentTemplate);
                    return;
                }
                var componentT = dargData.getData("componentTemplate")
                if (componentT != undefined) {
                    var subComponent = initComponent(componentT);
                    //    var component = JSON.parse(e.dataTransfer.getData("component"));
                    //  console.log(component);
                    if (component.children == undefined) {
                        component.children = [subComponent];
                    } else {
                        //  console.log("dropIndex", dropIndex);
                        if (dropIndex >= 0) {
                            component.children.splice(dropIndex, 0, subComponent);
                            subComponent.sort = dropIndex;
                        }
                        else {
                            component.children.push(subComponent);
                            subComponent.sort = component.children.length - 1;
                        }

                    }
                    subComponent.path = component.path + "/" + subComponent.key;
                    renderComponent(body, subComponent, dropIndex);
                    onAddComponents([subComponent]);
                }
            }
        }
        var dragStore = dargData.getData("store");
        if (dragStore != undefined) {
            if (previewComponent != null) {
                previewComponent.remove();
                previewComponent = null;
                previewParent = undefined;
            }
            //拖拽 商店 内容 至 界面
            var subComponent:IComponent =JSON.parse(dragStore.data);
            copyComponent (subComponent);
       
            //    var component = JSON.parse(e.dataTransfer.getData("component"));
            //  console.log(component);
            if (component.children == undefined) {
                component.children = [subComponent];
            } else {
                //  console.log("dropIndex", dropIndex);
                if (dropIndex >= 0) {
                    component.children.splice(dropIndex, 0, subComponent);
                    subComponent.sort = dropIndex;
                }
                else {
                    component.children.push(subComponent);
                    subComponent.sort = component.children.length - 1;
                }

            }
            subComponent.path = component.path + "/" + subComponent.key;
            renderComponent(body, subComponent, dropIndex);
            onAddComponents([subComponent]);

        }


    }
}

export function renderComponentShape(component?: IComponent, root?: HTMLElement) {

    var bgs = root.getElementsByClassName("component_bg");
    if (bgs == undefined || bgs.length == 0) {
        return;
    }
    var shape: IShape;
    try {
        shape= require("../plugins/shape/"+component.shape).default;
    } catch (error) {
        console.error(error);
        return;
    }

    root.style.background = "";
    var bg = root.getElementsByClassName("component_bg")[0];
    var w = bg.clientWidth;
    var h = bg.clientHeight;

    var bgcolor = "transparent";
    var property = "background";
    var style = component.style;
    var rep = RegExp("[^\-]" + property + ":[^;]+;");

    var m = (" " + style).match(rep);

    if (m != undefined && m != null && m.length > 0) {
        for (var i = 0; i < m.length; i++) {
            var s = m[i].substring(1);
            if (s.trim().startsWith(property + ":")) {
                var v = s.split(":")[1];
                v = v.substring(0, v.length - 1).trim();
                bgcolor = v;
            }
        }
    }
    bg.innerHTML = "";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.zIndex = "1";
    svg.style.width = w + "px";
    svg.style.height = h + "px";
    bg.appendChild(svg);

 
      
        if (shape != undefined) {
    
            shape.onRender(svg, bgcolor, "var(--theme-color)");
    
        }
  
  
}
/**
 * 删除组件
 * @param component 
 * @returns 
 */
export function deleteComponent(component: IComponent) {
    console.log("deleteComponent", component);
    if (component == undefined) {
        return;
    }
    component.isRemoved = true;
    var componentDiv = document.getElementById(component.key);
    if (componentDiv != undefined) {
        componentDiv.remove();
    }
    onDelComponents([component]);

}
/**
 * 根据组件路径获取组件key
 * @param path 
 * @returns 
 */
export function getPathKey(path: string): string {
    if (path == undefined) {
        return undefined;
    }
    if (path.indexOf("/") < 0)
        return path;
    return path.substring(path.lastIndexOf("/") + 1, path.length);
}
/**
 * 获取组件父级组件
 * @param component 
 * @returns 
 */
export function getComponentParent(component: IComponent): IComponent {
    var path = component.path;
    if (path.indexOf("/") < 0) {
        //page
        return undefined;
    } else {
        var parentPath = path.substring(0, path.lastIndexOf("/"));
        var parent = findCurPageComponent(parentPath);
        return parent;
    }
}