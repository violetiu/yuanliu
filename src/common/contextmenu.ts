/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

菜单
***************************************************************************** */

import { ipcRenderer, MenuItemConstructorOptions } from "electron";
import { ipcRendererSend } from "../preload";
import { findCurPageComponent, getSelectComponents } from "../render/workbench";
import { renderComponent } from "./components";
import { IComponent } from "./interfaceDefine";


export interface IComponentContextMenuItem {

    label: string;
    icon?: string,
    shorcut?: string,
    onclick?(component:IComponent,item:IComponentContextMenuItem): void;
    children?: IMenuItem[];

}


export function showComponentContextMenu(menuItems: Array<IComponentContextMenuItem>, x: number, y: number, args?: any, element?: HTMLElement) {

    var contextMenu = document.getElementById("componentContextMenu");

    if (contextMenu != undefined && contextMenu != null) {
        contextMenu.innerHTML = "";
    } else {
        contextMenu = document.createElement("div");
        contextMenu.id = "componentContextMenu";
        contextMenu.className = "componentContextMenu";

        document.onclick = (e: MouseEvent) => {
            contextMenu.remove();
        }

        var app = document.getElementById("app");
        app.appendChild(contextMenu);
    }

  
    var comtextMenuBody = document.createElement("div");
    comtextMenuBody.className = "componentContextMenuBody";
    contextMenu.appendChild(comtextMenuBody);





    if (x > window.innerWidth - 100) {
        contextMenu.style.left = "";
        contextMenu.style.right = (window.innerWidth - x) + "px";
    } else {
        contextMenu.style.left = x + "px";
        contextMenu.style.right = "";
    }
    if (y > window.innerHeight - 100) {
        contextMenu.style.bottom = (window.innerHeight - y) + "px";
        contextMenu.style.top = "";
    } else {
        contextMenu.style.top = y + "px";
        contextMenu.style.bottom = "";
    }
    // console.log("showContextMenu");
    // console.log(contextMenu.style.top);
    // console.log(contextMenu.style.right);

    menuItems.forEach((item: IComponentContextMenuItem) => {

        if (item.icon != undefined) {
    
            var menuItem = document.createElement("div");
            menuItem.className = "componentContextMenuItem";
            menuItem.title = item.label;
            comtextMenuBody.appendChild(menuItem);

            menuItem.onclick = (e: MouseEvent) => {
                e.stopPropagation();
                console.log('click edge',item);
                if (item.onclick != undefined) {
                    var cmpt=findCurPageComponent(getSelectComponents()[0]);
                    console.log('edge -> onclick');
                    item.onclick(cmpt,item);
                    //刷新组件
                   setTimeout(() => {
                    renderComponent(undefined,cmpt,undefined,undefined,undefined,document.getElementById(cmpt.key));
                   }, 10);
                }
              //  contextMenu.remove();

            }
            var icon = document.createElement("i");
            icon.className = item.icon;
            menuItem.appendChild(icon);

          
        }





    })


}
export interface IMenuItem extends MenuItemConstructorOptions{

    onclick?(): void;
}
var _menuItems: Array<IMenuItem> = [];

var _contextMenuArg: any;
var _contextMenuElement: HTMLElement;
export function getContextMenuArg() {
    return _contextMenuArg;
}

export function getContextMenuElement() {
    return _contextMenuElement;
}

export function openContextMenu(menuItems: Array<IMenuItem>,arg?:any,element?:HTMLElement) {

    _contextMenuArg=arg;
    _contextMenuElement=element;
    _menuItems=menuItems;
    var list: Array<MenuItemConstructorOptions> = [];
    menuItems.forEach((item: IMenuItem) => {
      
        list.push({
           
            enabled: item.enabled,
            visible: item.visible,
            checked: item.checked,
            type: item.type,
       
            accelerator: item.accelerator,

            role: item.role,
            id: item.id,
            label: item.label,
      


        });
    });
   
    ipcRenderer.send("show-context-menu", list);



}
export function onContextMenu(){
    ipcRenderer.on("context-menu-command",(event,id)=>{
    
       var item= _menuItems.find(item=>item.id==id);
    
       if(item.onclick!=undefined){
           item.onclick();
       }
    })
}


export function openContextMenuHub(menuItems: Array<IMenuItem>,arg?:any,element?:HTMLElement) {

    _contextMenuArg=arg;
    _contextMenuElement=element;
    _menuItems=menuItems;
    var list: Array<MenuItemConstructorOptions> = [];
    menuItems.forEach((item: IMenuItem) => {
      
        list.push({
           
            enabled: item.enabled,
            visible: item.visible,
            checked: item.checked,
            type: item.type,
       
            accelerator: item.accelerator,

            role: item.role,
            id: item.id,
            label: item.label,
      


        });
    });
   
    ipcRenderer.send("show-context-menu", list);



}
export function onContextMenuHub(){
    ipcRenderer.on("context-menu-command",(event,id)=>{
    
       var item= _menuItems.find(item=>item.id==id);
    
       if(item.onclick!=undefined){
           item.onclick();
       }
    })
}