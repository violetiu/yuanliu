import { ipcRenderer } from "electron";
import { setComponentsTemplate } from "../../common/components";
import { createExplorerLayout } from "../../common/explorerTool";
import { IComponent, IExplorer } from "../../common/interfaceDefine";
import { ipcRendererSend } from "../../preload";
import { showCustomComponent } from "../../render/customComponent";
import * as dargData from "../../render/DragData";
import { getCurPageContent } from "../../render/workbench";
import { getConfig } from "../../render/workspace";
var body:HTMLElement;
const explorer:IExplorer={
    key:"component",
    extend:false,
    height:400,
    title:"组件",
    onRender(content) {
         body=createExplorerLayout(content,this);
         renderComponentsExplorer(body);
    },
    sort:2,
    onResize(height) {
        return -1;
    },
 
    onExtend(extend) {
        return -1;
    },
    update(updater) {
        
    },
    setHeight(height) {
        body.style.height=height+"px";
    },
}
export default explorer;


function renderComponentsExplorer(content: HTMLElement) {
  
    ipcRenderer.on("_loadPlugins_component", (event, args) => {
        //    console.log("_loadPluginsComponent", args);
        var components: IComponent[] = [];
        args.forEach((item: string) => {
            try {
                // console.log(item);

                var component: IComponent = require("../../plugins/component/" + item).default();
                if (component != undefined)
                    components.push(component);
            } catch (error) {
                console.log(error);
            }
        })
        setComponentsTemplate(components)
        content.innerHTML = "";
        var base = renderComponentGroup(content, "sidebar_component_base", "基础");
        var layout = renderComponentGroup(content, "sidebar_component_layout", "布局");
        var container = renderComponentGroup(content, "sidebar_component_container", "容器");
        var chart = renderComponentGroup(content, "sidebar_component_chart", "图表");
        var flow = renderComponentGroup(content, "sidebar_component_flow", "流程");
        renderComponents(components, base, layout, container, chart, flow);
        //自定义按钮
        var custom = document.createElement("div");
        custom.className = "custom_component";
        custom.style.lineHeight = "1.5";
        custom.style.textAlign = "center";
        custom.style.fontSize = "10px";
        custom.innerText = "更多组件";
        content.appendChild(custom);
        custom.onclick = () => {
            showCustomComponent();
        }
    });
    ipcRenderer.send("loadPlugins","component");
}

function renderComponentGroup(content: HTMLElement, key: string, label: string) {
    var title = document.createElement("div");
    title.className = "sidebar_title";
    title.innerText = label;
    title.draggable = false;
    content.appendChild(title);
    var componentsDiv = document.createElement("div");
    componentsDiv.className = "components";
    componentsDiv.draggable = false;
    content.appendChild(componentsDiv);
    componentsDiv.id = key;
    return componentsDiv;
}


//只渲染默认组件，多余组件不展示再sidebar中

function renderComponents(components: Array<IComponent>, base: HTMLElement, layout: HTMLElement, container: HTMLElement, chart: HTMLElement, flow: HTMLElement) {
    var componentsdisplay = getConfig().componentsEnable;
    components.forEach(component => {

        //只渲染默认组件
        if (componentsdisplay.indexOf(component.type) > -1) {
            var icon = document.createElement("i");
            icon.className = component.icon;
            if (component.rotate != undefined) {
                // icon.style.cssText+=component.iconStyle;
                icon.setAttribute("data-rotate", "");
            }
            var label = document.createElement("span");
            label.innerText = component.label;
            var componentDiv = document.createElement("div");
            componentDiv.className = "component";
            var componentContent = document.createElement("div");
            componentContent.className = "component_content";
            componentDiv.appendChild(componentContent);
            componentContent.appendChild(icon);
            componentContent.appendChild(label);
            componentDiv.draggable = true;
            if (component.group == undefined || component.group == "base") {
                base.appendChild(componentDiv);
            } else if (component.group == "layout") {
                layout.appendChild(componentDiv);
            } else if (component.group == "container") {
                container.appendChild(componentDiv);
            } else if (component.group == "chart") {
                chart.appendChild(componentDiv);
            } else if (component.group == "flow") {
                flow.appendChild(componentDiv);
            }
            componentDiv.ondragstart = (e: DragEvent) => {
                dargData.setData("componentTemplate", component);
                var page = getCurPageContent();
                if (page != undefined) {
                    page.setAttribute("data-drag", "true");
                }

            }
            componentDiv.ondragend = (e: DragEvent) => {

                var page = getCurPageContent();
                if (page != undefined) {
                    page.removeAttribute("data-drag");
                }
            };

        }




    })


}