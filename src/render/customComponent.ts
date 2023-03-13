import { ipcRendererSend } from "../preload";
import { getComponentsTemplate } from "../common/components";
import { IComponent } from "../common/interfaceDefine";
import { renderDialog } from "../dialog/export";
import { getConfig, saveConfig } from "./workspace";

export function showCustomComponent(){
    var rd = renderDialog();
    var dialog=rd.content;
   
    dialog.style.maxWidth="800px";
    dialog.className="background";
    dialog.style.padding="20px";
    dialog.style.borderRadius="5px";

    var componentTemplates=getComponentsTemplate();

    var content=document.createElement("div");
    dialog.appendChild(content);

    var base = renderComponentGroup(content, "sidebar_component_base", "基础");
    var layout = renderComponentGroup(content, "sidebar_component_layout", "布局");
    var container = renderComponentGroup(content, "sidebar_component_container", "容器");
    var chart = renderComponentGroup(content, "sidebar_component_chart", "图表");
    var flow = renderComponentGroup(content, "sidebar_component_flow", "流程");

    renderComponents(componentTemplates, base, layout, container, chart,flow);


        //自定义按钮
        var custom =document.createElement("div");
        custom.style.marginTop="20px";
        custom.className="custom_component";
        custom.style.lineHeight="1.5";
        custom.style.textAlign="center";
        custom.innerText="保存";

        dialog.appendChild(custom);

        custom.onclick=()=>{
         
                saveConfig();
                ipcRendererSend("loadPluginsComponent");
                rd.root.remove();
            
        

        }



}

function renderComponentGroup(content: HTMLElement, key: string, label: string) {
    var title = document.createElement("div");
    title.className = "sidebar_title";
    title.innerText = label;
    title.draggable = false;
    content.appendChild(title);
    var componentsDiv = document.createElement("div");
    componentsDiv.style.paddingLeft = "20px";
    componentsDiv.draggable = false;
    content.appendChild(componentsDiv);
    componentsDiv.id = key;
    return componentsDiv;
}

function renderComponents(components: Array<IComponent>, base: HTMLElement, layout: HTMLElement, container: HTMLElement, chart: HTMLElement,flow:HTMLElement) {
    var componentsdisplay=getConfig().componentsEnable;
    components.forEach(component => {

        //只渲染默认组件

           var check=document.createElement("input");
            check.type="checkbox";
            check.setAttribute("data-component",component.key);
            if (componentsdisplay.indexOf(component.type) > -1) {
                check.checked = true;

            }
            check.onchange=(event)=>{
                var ck=event.target as HTMLInputElement;
                var cpt=ck.getAttribute("data-component");
                if(ck.checked){
                    if(componentsdisplay.indexOf(cpt)==-1){
                        componentsdisplay.push(cpt);
                    }
              
                }else{
                    if(componentsdisplay.indexOf(cpt)>=0){
                        componentsdisplay.splice(componentsdisplay.indexOf(cpt),1);
                    }
                  
                }

            }
           
            var icon = document.createElement("i");
            icon.className = component.icon;
            if (component.rotate != undefined) {
                // icon.style.cssText+=component.iconStyle;
                icon.setAttribute("data-rotate", "");
            }
            var label = document.createElement("span");
            label.innerText = component.label;
            label.style.paddingLeft="5px";

            var row=document.createElement("div");
            row.style.display="inline-block";
            row.style.minWidth="120px";
            row.style.paddingRight="20px";
            var componentDiv = document.createElement("div");
            componentDiv.style.display="flex";
            componentDiv.style.height="32px";
            componentDiv.style.alignItems="center";

            componentDiv.appendChild(check);
            componentDiv.appendChild(icon);
            componentDiv.appendChild(label);


            row.appendChild(componentDiv);


            if (component.group == undefined || component.group == "base") {
                base.appendChild(row);
            } else if (component.group == "layout") {
                layout.appendChild(row);
            } else if (component.group == "container") {
                container.appendChild(row);
            } else if (component.group == "chart") {
                chart.appendChild(row);
            }else if (component.group == "flow") {
                flow.appendChild(row);
            }







    })


}
