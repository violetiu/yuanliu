/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

导出选择
***************************************************************************** */

import { activePropertyPanel } from "../render/propertypanel";
import { ipcRendererSend } from "../preload";

export function renderExport() {

    var rd = renderDialog();
    var dialog=rd.content;
    dialog.style.display = "flex";
    dialog.style.alignItems = "center";
    dialog.style.justifyContent = "center";

    [
        {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">  <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>',
            label: "Rpj", onclick: () => {
                ipcRendererSend("saveAs");
            }
        },
        {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#09f" class="bi bi-filetype-html" viewBox="0 0 16 16">    <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662H6.515Zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999h.706Zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z"/>  </svg>',
            label: "Html", onclick: () => {
                ipcRendererSend("export", "html");
            }
        }, {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 261.76 226.69"><path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41b883"/><path d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495e"/></svg>            ',
            label: "Vue", onclick: () => {
                ipcRendererSend("export", "vue");
            }
        }, {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348">  <title>React Logo</title>  <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>  <g stroke="#61dafb" stroke-width="1" fill="none">    <ellipse rx="11" ry="4.2"/>    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>  </g></svg>',
            label: "React", onclick: () => {
                ipcRendererSend("export", "react");
            }
        },
        {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#f90" class="bi bi-globe" viewBox="0 0 16 16">  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/></svg>',
            label: "Sftp", onclick: () => {
                activePropertyPanel("sftp");
            }
        }, {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#90f" class="bi bi-server" viewBox="0 0 16 16">  <path d="M1.333 2.667C1.333 1.194 4.318 0 8 0s6.667 1.194 6.667 2.667V4c0 1.473-2.985 2.667-6.667 2.667S1.333 5.473 1.333 4V2.667z"/>  <path d="M1.333 6.334v3C1.333 10.805 4.318 12 8 12s6.667-1.194 6.667-2.667V6.334a6.51 6.51 0 0 1-1.458.79C11.81 7.684 9.967 8 8 8c-1.966 0-3.809-.317-5.208-.876a6.508 6.508 0 0 1-1.458-.79z"/>  <path d="M14.667 11.668a6.51 6.51 0 0 1-1.458.789c-1.4.56-3.242.876-5.21.876-1.966 0-3.809-.316-5.208-.876a6.51 6.51 0 0 1-1.458-.79v1.666C1.333 14.806 4.318 16 8 16s6.667-1.194 6.667-2.667v-1.665z"/></svg>',
               label: "SQL", onclick: () => {
                ipcRendererSend("export", "sql");
            }
        }


    ].forEach((item, index) => {
        renderTap(rd.root,dialog, item.svg, item.label, item.onclick);
    })







}

function renderTap(dialog:HTMLElement,content: HTMLElement, svg: string, label: string, onclick: () => void) {
    var tap = document.createElement("div");
    tap.className = "dialog_tap";
    tap.style.display = "flex";
    tap.style.justifyContent = "center";
    tap.style.alignItems = "center";
    tap.style.cursor = "pointer";
    tap.style.position = "relative";

    tap.style.transition = "background-color 0.2s,opacity 0.2s";
    content.appendChild(tap);


    tap.innerHTML = svg;

    var text = document.createElement("div");
    text.innerText = label;
    text.style.fontSize = "12px";
    text.style.color = "#999";
    text.style.position = "absolute";
    text.style.bottom = "5px";
    tap.appendChild(text);


    tap.onclick = () => {
        onclick();
        dialog.remove();
       
    }




}

export function renderDialog():{root:HTMLElement,content:HTMLElement}{

    var app = document.getElementById("app");
    var dialog = document.createElement("div");
    dialog.className = "dialog";
    dialog.style.display = "flex";
    dialog.style.position = "fixed";
    dialog.style.top = "0px";
    dialog.style.left = "0px";
    dialog.style.right = "0px";
    dialog.style.bottom = "0px";
    dialog.style.zIndex = "9999";
    dialog.style.justifyContent = "center";
    dialog.style.alignItems = "center";
    app.appendChild(dialog);
    var content = document.createElement("div");
    content.className = "dialog_content";
    dialog.appendChild(content);
    content.onclick = (e) => {
        e.stopPropagation();
    }

    dialog.onclick = (e) => {
        e.stopPropagation();
        dialog.remove();
    }


    return {root:dialog,content:content};

}