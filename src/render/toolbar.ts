import { IComponent, IPage } from "../common/interfaceDefine";
import { ipcRendererSend } from "../preload";
import { saveSimplePage } from "./titleBar";
import { getCurPage, reRenderPage } from "./workbench";
var taps:Array<any>=[];
/**
 * 更新工具栏
 * @param page 
 */
export function updateToolbar(page:IPage) {

    // switch(page.type){
    //     case "datadesigner":;break;
    //     case "editor":;break;
    //     case "markdown":;break;
    //     case "page":;break;
    //     case "pages":;break;
    //     case "projects":;break;
    //     case "title":;break;
    // }
    taps.forEach((t:any)=>{
        var tap=t.tap;
        if (tap.renderIcon != undefined) {
            var ri= tap.renderIcon();
            if(ri==undefined||ri==""){
                t.ele.style.display="none";
            }
            else{
                t.ele.style.display="block";
                t.ele.children[0].className =ri;
            }
         
        }
    })
   
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
            key: "tool_fresh", label: "刷新", icon: "bi bi-arrow-clockwise", onTaped: (component: IComponent) => {
                reRenderPage();
            }
        },
        {
            key: "tool_save", label: "保存页面", icon: "bi bi-file-post", onTaped: (component: IComponent) => {
                saveSimplePage(getCurPage(true));
            }
        }
        ]
    },
    { type: "sperator" },
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
                if(page&&page.type=="page"){
                    if (page.design == undefined || page.design == "default") {
                        return "bi bi-bezier2";
                    } else {
                        return "bi bi-vector-pen";
                    }
                }else{
                    return "";//bi bi-exclamation
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
                    taps.push({
                        tap:tap,
                        ele:tapDiv
                    })
                });
            }
        content.appendChild(groupDiv);
    });
}