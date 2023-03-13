/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染页面 标题
***************************************************************************** */
import { getUUID, IComponent, ITitle } from "../common/interfaceDefine";
import { getNowDateTime } from "../server/work";
import * as dargData from "./DragData";
import { getProjectTitleJson,  renderPage } from "./workbench";
import {copyStyles, initComponent, installComponent, renderComponentPreview} from "../common/components"; 
import { activePropertyPanel } from "./propertypanel";
var titleLayers: IComponent[] = [];
export function setTitleLayers(list: IComponent[]) {
    titleLayers = list;
}
export function getTitleBar(): ITitle {

    var tj=getProjectTitleJson();
    if(tj.page!=undefined){
        tj.page.children=copyComponents(tj.page.children);
    }

    // getProjectTitleJson().comment = copyComponents(titleLayers);
    // if (getProjectTitleJson().comment != undefined) {
    //     component_sort(getProjectTitleJson().comment);
    // }


    return getProjectTitleJson();

}
export function copyComponents(list: IComponent[], newKey?: boolean): IComponent[] {
    if (list == undefined || list.length == 0) {
        return undefined;
    }

    var newList: IComponent[] = [];
    for (var i = 0; i < list.length; i++) {
        var componentT = list[i];
        if (componentT.isRemoved) continue;
        var component: IComponent = {

            key: componentT.key,
            icon: componentT.icon,
            label: componentT.label,
            option: componentT.option,
            type: componentT.type,
            style: componentT.style,
            background: componentT.background,
            drop: componentT.drop,
            isFixed: componentT.isFixed,
            onDrop: componentT.onDrop,
            children: copyComponents(componentT.children),
            property: componentT.property,
            styles:copyStyles(componentT.styles),
            blue: componentT.blue,
            group: componentT.group,
           hidden: componentT.hidden,
           rotate: componentT.rotate,
           edge: componentT.edge,
           sort: componentT.sort,
           onChild:componentT.onChild,
           panel: componentT.panel,

        };
        if (newKey) {
            component.key = getUUID();
        }
        newList.push(component);

    }
    return newList;

}
export function regeditPageTitleEvent(title_bar: HTMLElement) {
    var previewComponent: HTMLElement;
    title_bar.ondragover = (e: DragEvent) => {
        e.preventDefault();
    }
    title_bar.ondragenter = (e: any) => {
        var component = dargData.getData("componentTemplate");

        if (e.target.className == "title_bar" && previewComponent == undefined) {
            previewComponent = renderComponentPreview(title_bar, component)

        }


    }
    title_bar.ondragleave = (e: DragEvent) => {

        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
    }
    title_bar.ondragend = (e: DragEvent) => {
        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
    }
    title_bar.ondrop = (e: DragEvent) => {
        if (previewComponent != undefined) {
            previewComponent.remove();
            previewComponent = undefined;
        }
        //  var component = JSON.parse(e.dataTransfer.getData("component"));
        var componentT = dargData.getData("componentTemplate");
        var component = initComponent(componentT);
        titleLayers.push(component);
       // activePropertyPanel();
        renderComponent(title_bar, component);


        console.log(JSON.stringify(titleLayers));
    }

}
export function renderTitleBar(context: HTMLElement, title_data: ITitle) {

    console.log("renderTitleBar",title_data);

    context.ondblclick = () => {
        editorTitleBar(context, title_data);

    }
    if (title_data.page != undefined) {
        renderComponents(context, title_data.page.children, undefined);
    }




}
export function editorTitleBar(context: HTMLElement, title_data: ITitle) {
    if(title_data.page==undefined){
        title_data.page={
            type:"title",
            key: "title",
            width: 1900,
            height: 100 ,
            
            children: [],
            modified: getNowDateTime(),
            name:"title",
            path: "/",
            canvases: [],
            dialogs: [],
            info: "",
            blues: [],
            blueLinks: [],
            guides: []
        };
    }
    title_data.page.type="title";
    renderPage(title_data.page);
}
/**
 * 
 * @param content 
 * @param components  从文件中获取，缺少方法
 */
function renderComponents(content: HTMLElement, components: IComponent[], parent: IComponent) {
    content.innerHTML = "";

    //updateLayersProperty();
    //sort
    // if (parent != undefined && parent.type == "row") {
    //     components.sort((a, b) => (a.sort >= b.sort) ? 1 : -1);
    // } else {
    //     components.sort((a, b) => (a.sort <= b.sort) ? 1 : -1);
    // }

    //  var newComponents: IComponent[]=[];
    if(components!=undefined)
    components.forEach(component => {

        if (component.isRemoved == undefined && !component.isRemoved) {
            if (component.onRender == undefined) {

                installComponent(component);

            }
            if (component.onRender != undefined && component.onPreview != undefined) {
                //   newComponents.push(component);
                renderComponent(content, component);
            }
        }


    })
}

function renderComponent(content: HTMLElement, component: IComponent, dropIndex?: number): HTMLElement {
    var rs = component.onRender(component, undefined, content);
    var root = rs.root;
    var body = rs.content;
    root.tabIndex = 100;
    if (root.className.length > 0) {
        root.className = "component_canvas " + root.className;
    } else {
        root.className = "component_canvas";
    }
    root.setAttribute("component_group", component.group);
    root.setAttribute("component_type", component.type);
    root.id = component.key;

    if (root.style != undefined && root.style.cssText.length <= 0) {
        if (component.styles != undefined && component.styles["root"] != undefined) {
            root.style.cssText = component.styles["root"];
        } else if (component.style != undefined) {
            root.style.cssText = component.style;
        }

    }
    if (component.hidden) {
        if (component.toogle != undefined) {
            component.toogle(root, true);
        } else {
            root.style.display = "none";
        }
    }
    // console.log("renderComponent",component.key,component.type,component.label);
    if (component.type == "dialog") {
        document.getElementById("page_parent").appendChild(root);
    } else {
        if (dropIndex != undefined && dropIndex >= 0) {
            content.children.item(dropIndex).insertAdjacentElement("beforebegin", root);
        } else {
            content.appendChild(root);
        }
    }
    if (component.children != undefined && component.children.length > 0) {
        renderComponents(body, component.children, component);
    }
    return root;
}