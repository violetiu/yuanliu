import { activePropertyPanel } from "../../render/propertypanel";
import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "paragraph", label: "para.", icon: "bi bi-text-paragraph", type: "paragraph",
    style: "display:inline-block;font-size:14px;padding:10px;border:0;width:300px;text-indent: 2em;background:transparent;border-radius:5px;",
    onPreview: () => {
        var label = document.createElement("div");
        label.innerHTML = "yuanliu-让设计跟接近产品.功能强大、可扩展且功能丰富的,利用预构建的网格系统和组件，并使用强大的JavaScript插件给项目带来生命。";
        return label;
    }, onRender: (component, element, content, type) => {
        var label: HTMLElement;
        if (element != undefined)
            label = element;
        else
            label = document.createElement("div");
       
        label.innerHTML = component.property.text.context;
        if (type != "product")
            label.ondblclick = () => {

                var input = document.createElement("div");
                input.className="editor";
                input.style.width = "100%";
                input.style.height = "max-content";
                input.contentEditable = "true";
                input.style.outline = "none";

                input.innerHTML = component.property.text.context;
                input.onkeydown = (ky) => {
                    ky.stopPropagation();
                }
                label.innerHTML = "";
                label.appendChild(input);
                input.onchange = () => {
                    component.property.text.context = input.innerHTML;
                }
                input.focus();
                input.onmousedown = (oc) => {
                    oc.stopPropagation();
                }
                input.onclick = (oc) => {
                    oc.stopPropagation();
                }
                input.ondblclick = (oc) => {
                    oc.stopPropagation();
                }
                input.onblur = () => {
                    component.property.text.context = input.innerHTML;
                    label.innerHTML = input.innerHTML;
                    input.remove();

                }
                input.onmouseup=()=>{

                    activePropertyPanel(component);

                }

            }
        return { root: label, content: label };
    }, property: {
        text: {
            label: "文本", type: "doc", context: "yuanliu-让设计跟接近产品功能强大、可扩展且功能丰富的,利用预构建的网格系统和组件，并使用强大的JavaScript插件给项目带来生命。"
        }
    }, blue: {

        property: {
            value: {
                label: "值", get: (comp: IComponent, self: IBlueProperty) => {
                    var ip: any = document.getElementById(comp.key);
                    return ip.innerText;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    var ip: any = document.getElementById(comp.key);
                    ip.innerText = args;
                }
            }

        }
    },
    panel:"editor"
}
export default function load() {
    return component;
}