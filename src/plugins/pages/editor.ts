import { app, ipcRenderer } from "electron";
import { Editor } from "../../editor/editor";
import { ipcRendererSend } from "../../preload";
import { getPageByPath, getProject, getViewPosition } from "../../render/workspace";

export function renderEditorPage(content: HTMLElement, path: string) {


    var viewPosition = getViewPosition();

    var page = document.createElement("div");
    page.style.position = "fixed";
    page.style.top = viewPosition.top + "px";
    page.style.right = viewPosition.right + "px";
    page.style.bottom = viewPosition.bottom + "px";
    page.style.left = viewPosition.left + "px";

    content.appendChild(page);

    var edit = new Editor(page, (lines) => {


    });
    var value = "加载错误！";
    ipcRendererSend("readFile", path);
    ipcRenderer.on("_readFile_" + path, (event, data) => {

        if (data != undefined)
            value = data;
        edit.setValue(value);
        edit.resize();
    })



}