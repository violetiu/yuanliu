import { app, ipcRenderer } from "electron";
import { ipcRendererSend } from "../../preload";
import { getPageByPath, getProject, getViewPosition } from "../../render/workspace";

export function renderPagesPage(content: HTMLElement) {


    var viewPosition = getViewPosition();

    var page = document.createElement("div");
    page.style.position = "fixed";
    page.style.top = viewPosition.top + "px";
    page.style.right = viewPosition.right + "px";
    page.style.bottom = viewPosition.bottom + "px";
    page.style.left = viewPosition.left + "px";
    page.style.display = "flex";
  
    page.style.justifyContent = "center";
    page.style.userSelect = "none";
    content.appendChild(page);

    var view=document.createElement("div");
    view.style.width="90%";
    view.style.marginTop="50px";
    page.appendChild(view);


    var title = document.createElement("div");
    title.innerHTML = "最近使用";
    title.style.lineHeight = "30px";
    title.style.fontSize = "10px";
    title.className = "project_recent_title"
    //  title.style.color="var(--theme-color)";
//    title.style.borderBottom = "1px solid";
    view.appendChild(title);

    var list = document.createElement("div");
    list.style.minWidth = "800px";
    view.appendChild(list);

    ipcRenderer.on("_readProjectRecentPage", (event, recentData) => {

        if (recentData!=undefined&& recentData.length > 0) {
            for (var i = recentData.length - 1; i >= 0; i--) {

                if (recentData.length - i > 9) {
                    continue;
                }
                var pagePath = recentData[i];

                var pg: any = getPageByPath(pagePath, getProject().catalogs);

                if (pg != undefined) {
                    var page = document.createElement("div");
                    page.className = "recent_card";
                    page.id = pg.key;
                    page.setAttribute("data-path", pg.path);
                    page.setAttribute("data-name", pg.name);
                    list.appendChild(page);

                    var imageDiv = document.createElement("div");
                    imageDiv.style.height = "100px";
                    imageDiv.style.width = "200px";
                    page.appendChild(imageDiv);
                    imageDiv.style.backgroundImage = "url(" + getProject().work + "/images/" + pg.key + ".jpeg" + ")";
                    imageDiv.style.backgroundSize = "cover";
                    imageDiv.style.pointerEvents = "none";
                    imageDiv.style.borderRadius = "3px";
                    imageDiv.style.backgroundColor="rgba(157,157,175,0.2)";
                    // imageDiv.style.boxShadow="0px 0px 5px rgba(0,0,0,0.5)";

                    var pageTitle = document.createElement("div");
                    pageTitle.innerHTML = pg.name;
                    pageTitle.style.lineHeight = "30px";
                    pageTitle.style.fontSize = "12px";
                    pageTitle.style.textAlign = "center";
                    pageTitle.style.pointerEvents = "none";
                    page.appendChild(pageTitle);


                    page.onclick = (e: MouseEvent) => {
                        //open page
                        //   renderPage(catalog.page);
                        var cp: any = e.target;

                        ipcRendererSend("openPage", {
                            path: cp.getAttribute("data-path"), name: cp.getAttribute("data-name")
                        });


                    }
                }


            }

        }

    })
    ipcRendererSend("readProjectRecentPage", null);

}