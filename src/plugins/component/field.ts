import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "field", label: "field", icon: "bi bi-input-cursor", type: "field",

    styles: {
        root: "display:flex;align-items:center;",
        label: "white-space: nowrap;cursor: pointer;max-width:200px;font-size:13px;padding: 5px 0px 5px 10px;border-radius:5px;",
        text: "cursor: pointer;font-size:13px;padding: 5px 10px 5px 5px;border-radius:5px;border:0px solid #999;"
    },
    onPreview: () => {
        var div = document.createElement("div");
        div.style.cssText = component.styles.root;
        var label = document.createElement("div");
        label.style.cssText = component.styles.label;
        label.innerText = component.property.label.context;
        div.appendChild(label);
        var button = document.createElement("input");
        button.style.cssText == component.styles.text;
        button.value = " ";
        div.appendChild(button);
        return div;
    }, onRender: (component, element) => {
        var div: any;
        if (element != undefined)
            div = element;
        else
            div = document.createElement("div");
        div.innerHTML = "";
        if (component.styles != undefined)//兼容旧版本
            div.style.cssText = component.styles.root;
        var label = document.createElement("div");
        label.ondblclick = () => {
            var input = document.createElement("input");
            input.type = "text";
            input.value = component.property.label.context;
            input.onkeydown = (ky) => {
                ky.stopPropagation();
            }
            label.innerHTML = "";
            label.appendChild(input);
            input.onchange = () => {
                component.property.label.context = input.value;
            }
            input.focus();
            input.onclick = (oc) => {
                oc.stopPropagation();
            }
            input.ondblclick = (oc) => {
                oc.stopPropagation();
            }
            input.onblur = () => {
                input.remove();
                label.innerText = component.property.label.context + " ： ";
            }

        }
        //xin
        label.innerText = component.property.label.context + " ： ";
        if (component.styles != undefined)//兼容旧版本
            label.style.cssText = component.styles.label;
        div.appendChild(label);
        var text = document.createElement("input");
        text.type = "text";
        text.value = component.property.value.context;
        if (component.styles != undefined)//兼容旧版本
            text.style.cssText = component.styles.text;
        text.onchange = () => {
            component.property.value.context = text.value;
            if (component.blue.event.change.on != undefined) {
                component.blue.event.change.on(text.value);
            }
        }
        div.appendChild(text);
        return { root: div, content: div };
    }, property: {
        label: {
            label: "标签", type: "text", context: "标签"
        },
        value: {
            label: "值", type: "text", context: ""
        }
    }, blue: {
        event: {
            change: { label: "改变" }
        },
        property: {
            value: {
                label: "值", get: (comp: IComponent, self: IBlueProperty) => {
                    var div = document.getElementById(comp.key);
                    var input = div.getElementsByTagName("input")[0];
                    return input.value;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    var div = document.getElementById(comp.key);
                    var input = div.getElementsByTagName("input")[0];
                    input.value = args;
                }
            }
        }

    }
}
export default function load() {
    return component;
}