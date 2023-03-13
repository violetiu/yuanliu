
import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "button", label: "button", icon: "bi bi-badge-tm", type: "button",
    style: "user-select: none;display: inline-block; overflow:hidden;cursor:pointer;font-size:13px;" +
        "padding: 5px 10px 5px 10px;background:rgba(255,255,255,0.1);border-radius: 5px;box-shadow:0px 0px 4px rgba(0,0,0,0.5);",
    drop: "component",
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
        var button = document.createElement("input");
        button.type = "button";
        button.value = "按钮";
        return button;
    }, onRender: (component, element, content, type) => {
        var button: HTMLElement;

        if (element != undefined) {
            button = element;
            button.innerHTML = "";
        }

        else
            button = document.createElement("div");

        var bg = document.createElement("div");
        bg.className = "component_bg";
        button.appendChild(bg);
        var body = document.createElement("div");
        body.className = "component_body";
        body.style.display = "flex";
        body.style.alignItems = "center";
        button.appendChild(body);

        if (component.property.icon != undefined && component.property.icon.context.length > 1) {
            var icon = document.createElement("i");
            icon.className = "bi bi-" + component.property.icon.context;
            icon.style.paddingRight = "5px";
            body.appendChild(icon);
        }

        var label = document.createElement("div");
        label.style.flex = "1";
        body.appendChild(label);
        //新的
        label.innerText = component.property.text.context;
        if (type == "product") {
            button.setAttribute("hover", "true");
            //  button.setAttribute("active", "true");
        }


        if (type != "product") {
            label.ondblclick = (e) => {

                var input = document.createElement("input");
                input.type = "text";
                input.value = component.property.text.context;
                input.onkeydown = (ky) => {
                    ky.stopPropagation();
                }
                label.innerHTML = "";
                label.appendChild(input);
                input.onchange = () => {
                    component.property.text.context = input.value;
                }
                input.style.minWidth = "60px";
                input.onkeydown = (e) => {
                    e.stopPropagation();
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
                    label.innerHTML = component.property.text.context;
                }

            }
        }
        if (type == "product") {
            var ripple: HTMLElement;
            button.onmousedown = (e: any) => {

                console.log("button onmousedown");
                button.style.overflow = "hidden";
                var x = e.offsetX;
                var y = e.offsetY;
                var w = e.target.clientWidth;
                ripple = document.createElement("div");
                ripple.className = "ripple";

                var rw = x;
                if (x < w / 2) {
                    rw = w - x;
                }
                ripple.style.height = (rw * 2) + "px";
                ripple.style.width = (rw * 2) + "px";
                ripple.style.left = (x - rw) + "px";
                ripple.style.top = (y - rw) + "px";
                button.appendChild(ripple);
            //    button.style.boxShadow = "1px 1px 5px var(--light-color)";
                window.onmouseup = (e: any) => {

                    if (component.blue.event.click.on != undefined) {
                        component.blue.event.click.on();
                    } if (ripple != undefined) {
                        ripple.remove();
                    }
               //     button.style.boxShadow = "";
    
                }
            }
          

            // window.onmouseup = (e: any) => {

            //     if (ripple != undefined) {
            //         ripple.remove();
            //     }



            // }

        }

        return { root: button, content: button };
    }, property: {
        text: {
            label: "文本", type: "text", context: "按钮"
        },
        icon: {
            label: "图标", type: "text", context: ""
        },
    },
    blue: {
        event: {
            click: {
                label: "单击"
            }
        }
    }
}
export default function load() {
    return component;
}