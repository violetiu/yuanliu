/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

preload
***************************************************************************** */
// All of the Node.js APIs are available in the preload process.

import { ipcRenderer } from "electron";
import { renderWorkSpace } from "./render/workspace";
//项目窗口ID
var wId = 0;
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {

  var app = document.getElementById("app");
  if (app != undefined) {
    renderWorkSpace(app);
  }
  // ipcRenderer.on("_init", (e, data) => {
  //   wId = data.id;
   
  // })
});
//多项目窗口下，通讯
export function ipcRendererSend(hannel: string, ...args: any[]): void {


    ipcRenderer.send(hannel, ...args);
  

}

export function ipcContextMenu(arg: { type: "tab" | "icon" | "otho" | "component", content: string }): void {
  ipcRenderer.send("show-context-menu_" + wId, arg);

}