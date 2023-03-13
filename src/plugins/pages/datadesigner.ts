import { getProject, getViewPosition } from "../../render/workspace";

export function renderDataDesignerPage(content: HTMLElement) {


    var viewPosition = getViewPosition();

    var view = document.createElement("div");
    view.style.position = "fixed";
    view.style.top = viewPosition.top + "px";
    view.style.right = viewPosition.right + "px";
    view.style.bottom = viewPosition.bottom + "px";
    view.style.left = viewPosition.left + "px";
    view.style.overflow="auto";

    content.appendChild(view);


    var page=document.createElement("div");
    page.style.width=1000+"px";
    page.style.height=900+"px";
    view.appendChild(page);


    page.innerHTML="数据库设计";

}