import { IMenuItem } from "./contextmenu";
import { IExplorer } from "./interfaceDefine";

export function createExplorerLayout(content: HTMLElement, ex: IExplorer): HTMLElement {

    var explorer = document.createElement("div");
    explorer.className = "explorer";
    explorer.id = ex.key;
    content.appendChild(explorer);

    var title = document.createElement("div");
    title.className = "explorer_title";

    var icon = document.createElement("i");
    icon.className = "explorer_icon bi bi-chevron-right";
    icon.style.marginLeft = "5px";
   
    icon.style.paddingRight="3px";
    title.appendChild(icon);


    var label = document.createElement("div");
    label.innerText = ex.title;
    title.appendChild(label);
    label.style.flex = "1";

    explorer.appendChild(title);
    var view = document.createElement("div");
    view.className = "explorer_view";

    explorer.appendChild(view);

    if (ex.extend) {
        icon.style.transform = "rotate(90deg)";
    } else {
        view.style.display = "none";
        icon.style.transform = "rotate(0deg)";

    }

    label.onclick = (e: MouseEvent) => {
        
        var rs = ex.onExtend(!ex.extend, ex.height);
        if (view.style.display == "none") {
            if (rs > 0) {
                body.style.height = rs + "px";
                view.style.display = "block";
                icon.style.transform = "rotate(90deg)";
                ex.extend = true;
                ex.setHeight(rs);
            }
        } else {
            view.style.display = "none";
            icon.style.transform = "rotate(0deg)";
            ex.extend = false;
        }


    }

    var iconSearchBar = document.createElement("div");
    iconSearchBar.className="form_bg";
    iconSearchBar.style.display="none";
    var searchInput = document.createElement("input");

    searchInput.type = "text";
    iconSearchBar.appendChild(searchInput);

    var searchButton = document.createElement("button");
    searchButton.className = "tool_tap";
    iconSearchBar.appendChild(searchButton);
    searchButton.innerHTML = ("<i class='bi bi-search'></>")
    searchButton.onclick=()=>{
        iconSearchBar.style.display="none";
        tapsDiv.style.display="flex";
        if(ex.onSearch!=undefined){
            ex.onSearch(searchInput.value);
        }
    }
    title.appendChild(iconSearchBar);
    var tapsDiv = document.createElement("div");
    tapsDiv.style.paddingRight = "5px";
    tapsDiv.style.display = "flex";
    title.appendChild(tapsDiv);
    if (ex.onSearch != undefined) {

        renderTap(tapsDiv, "搜索", "bi bi-search", () => {

            iconSearchBar.style.display="flex";
            tapsDiv.style.display="none";

        });
    }


    if (ex.taps != undefined) {
        ex.taps.forEach((tap: IMenuItem) => {

            renderTap(tapsDiv, tap.label, tap.icon, tap.onclick);
        });
    }

    var body = document.createElement("div");
    body.className = "explorer_body";
    if(ex.height!=undefined){
        body.style.height=ex.height+"px";
    }

    var solider = document.createElement("div");
    solider.className = "explorer_solider";

    solider.onmousedown = (ed: MouseEvent) => {

        ed.stopPropagation();
        var startY = ed.clientY;
        var bodyH = body.clientHeight;
        var move: boolean = true;
        document.onmousemove = (em: MouseEvent) => {
            if (move) {
                em.stopPropagation();
                var y = em.clientY - startY;
                var height = bodyH + y;
                var rs = ex.onResize(height);
                if (rs > 0) {
                    body.style.height = rs + "px";
                    ex.setHeight(rs);
                }
            }
        }
        document.onmouseup = () => {
            move = false;

        }

    };


    view.appendChild(body);
    view.appendChild(solider);

    return body;

}
function renderTap(content: HTMLElement, label?: string, icon?: string | Electron.NativeImage, onclick?: () => void) {
    var tapDiv = document.createElement("div");
    tapDiv.className = "tool_tap";
    tapDiv.title = label;
    var tapIcon = document.createElement("i");
    tapIcon.className = icon + "";
    tapDiv.appendChild(tapIcon);
    tapIcon.onclick = onclick;
    content.appendChild(tapDiv);

}
