
import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "toggle", label: "toggle", icon: "bi bi-toggle-on", type: "toggle",
    style: "user-select: none;display: inline-block; cursor:pointer;font-size:20px;padding: 5px 10px 5px 10px;border-radius: 5px;",

    onDrop(component, data) {
        if (data != undefined) {
            if (data.type == "icon") {
                component.property.icon.context = data.icon;
                component.onRender(component, document.getElementById(component.key));
            }
        }
        console.log(data);
    },
    onPreview: () => {
        var check = document.createElement("div");

        check.innerHTML = "<i class='bi bi-toggle-on' />"
        return check;
    }, onRender: (component, element, content, type) => {
        var check: HTMLElement;
        if (element != undefined) {
            check = element;
            check.innerHTML = "";
        }
        else
            check = document.createElement("div");

        if (component.property.checked.context == "true") {
            check.innerHTML = "<i class='bi bi-toggle-on' />";
        } else {
            check.innerHTML = "<i class='bi bi-toggle-off' />";
        }

        check.onclick = (e: any) => {
          
            if (component.property.checked.context == "true") {
                component.property.checked.context = "false";
                if (component.blue.event.change.on!= undefined)
                    component.blue.event.change.on(false);
                check.innerHTML = "<i class='bi bi-toggle-off' />";
            } else {
                component.property.checked.context = "true";
                check.innerHTML = "<i class='bi bi-toggle-on' />";
                if (component.blue.event.change.on!= undefined)
                    component.blue.event.change.on(true);
            }
        }

        return { root: check, content: check };
    }, property: {
        checked: {
            label: "是否选中", type: "bool", context: "false"
        },
    },
    blue: {
        event: {
            change: {
                label: "选中变化"
            }
        },
        property: {
            checked: {
                label: "是否选中", get: (comp: IComponent, self: IBlueProperty) => {
                    return comp.property.checked;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    comp.property.checked = args;
                }
            }
        }
    }
}
export default function load() {
    return component;
}