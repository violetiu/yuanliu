import { IComponent, IPage } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { getCurPage } from "./workbench";
/**
 * 更新工具栏
 * @param page 
 */
export function updateToolbar(page:IPage) {


}
/**
 * 渲染工具栏
 * @param content 
 */
export function renderToolbar(content: HTMLElement) {

    renderTaps(content,tools);

}
const tools = [
  
    {
        taps: [{
            key: "tool_insertfile", label: "插入文件", icon: "bi bi-file-earmark-plus", onTaped: (component: IComponent) => {
                ipcRendererSend("insertImage");
            }

        },
        {
            key: "tool_line", label: "链接", icon: "bi bi-bezier2", onTaped: (component: IComponent) => {

                var page = getCurPage();
                
                if (page&&(page.design == undefined || page.design == "default")) {
                    page.design="line"
                } else {
                    page.design="default"
                }


            }, renderIcon: () => {
                var page = getCurPage();
                if(page){
                    if (page.design == undefined || page.design == "default") {
                        return "bi bi-bezier2";
                    } else {
                        return "bi bi-vector-pen";
                    }
                }else{
                    return "bi bi-exclamation";
                }
               
            }
        }
        ]
    }

    
]

function renderTaps(content: HTMLElement, tools: Array<any>) {
    content.innerHTML = "";
    content.style.display = "flex";
    content.style.alignItems = "center";
    // content.style.paddingTop = "5px";
    tools.forEach(group => {
        var groupDiv = document.createElement("div");

        if (group.type == "flex") {
            groupDiv.style.flex = "1";
        } else
            if (group.type == "sperator") {
                groupDiv.style.borderLeft = "1px solid";
                groupDiv.style.height = "10px";
                groupDiv.style.opacity = "0.3";

            } else {
                groupDiv.className = "tool_group";

                group.taps.forEach((tap: any) => {

                    var tapDiv = document.createElement("div");
                    tapDiv.id = tap.key;
                    tapDiv.className = "tool_tap";
                    tapDiv.title = tap.label;
                    tapDiv.onclick = () => {
                        tap.onTaped();

                        if (tap.renderIcon != undefined) {
                            tapIcon.className = tap.renderIcon();
                        }
                    };
                    groupDiv.appendChild(tapDiv);
                    var tapIcon = document.createElement("i");
                    tapIcon.style.fontSize = "12px";
                    tapIcon.className = tap.icon;
                    tapDiv.appendChild(tapIcon);

                    if (tap.renderIcon != undefined) {
                        tapIcon.className = tap.renderIcon();
                    }


                });
            }
        content.appendChild(groupDiv);


    });



}