
import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "grid", label: "grid", icon: "bi bi-grid",
    type: "grid", group: "layout", drop: "component"
    , style: "flex:1;background:transparent;min-height:34px;margin:5px;padding:5px;border-radius:5px;min-width:40px;",
    onPreview: () => {
        var gird = document.createElement("div");
        return gird;
    }, onRender: (component: IComponent, element: HTMLElement, content?, type?) => {
        var gird: HTMLElement = null;
        if (element != undefined) {
            gird = element;
            gird.innerHTML = "";
        } else
            gird = document.createElement("div");
        var gridBg = document.createElement("div");
        gridBg.className = "component_bg";

        gridBg.style.zIndex = "0";
        var gridContent = document.createElement("div");
        gridContent.className = "component_body";
        gird.appendChild(gridBg);
        gird.appendChild(gridContent);
        if (type == "product") {

            gridContent.style.height = "100%";
        }

        if (component.property != undefined && component.property.isHost != undefined && component.property.isHost.context == "true") {

            if (type == "product") {
                gird.setAttribute("active", "true");

                gird.onmouseover = () => {
                    gird.style.backgroundColor = "rgba(175,175,175,0.2)";
                    gird.style.cursor = "pointer";

                };
                gird.onmouseleave = () => {
                    if (component.shape != undefined) {
                        gird.style.backgroundColor = "";
                    } else {
                        gird.style.cssText = component.style;
                    }
                }
                if (component.blue.event.click.on != undefined) {
                    gird.onclick = () => {
                        if (component.blue.event.click.on != undefined) {
                            component.blue.event.click.on();
                        }
                    }
                }
            }
            //     gird.setAttribute("data-hot",component.property.isHost.context);

        }

        return { root: gird, content: gridContent };
    },
    property: {
        isHost: { label: "热区", type: "bool", context: "false", },

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