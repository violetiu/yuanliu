import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "callout", label: "callout", icon: "bi bi-chat-square",
    type: "callout", group: "layout", drop: "component",
    isExpand: true,
    styles: {
        "root": "min-height:100px;min-width:200px;padding:10px;border-radius:5px;box-shadow:0px 0px 5px rgba(157,157,157,0.5);position:fixed;z-index:100;",
        "main": "    position: absolute; top: 10px;left: 10px;bottom: 10px; right: 10px;",
        "break": " border-left:20px solid  transparent ;border-right:14px solid  transparent ;border-bottom:15px solid;position: absolute; height: 20px;width: 0px; top: -35px;"
    },
    onPreview: () => {
        var callout = document.createElement("div");
        return callout;
    }, onRender: (component: IComponent, element: HTMLElement, content: HTMLElement, type: "design" | "product") => {
        var callout: HTMLElement = null;
        if (element != undefined) {
            callout = element;
            callout.innerHTML = "";
        } else
            callout = document.createElement("div");

        var breakDiv=document.createElement("div");
        breakDiv.style.cssText=component.styles["break"];
        breakDiv.style.pointerEvents="none";
        callout.appendChild(breakDiv);
        setTimeout(() => {
            breakDiv.style.borderBottomColor=callout.style.backgroundColor;
          
        }, 100);

        var main=document.createElement("div");
        main.style.cssText=component.styles["main"];
        callout.appendChild(main);
        if (type == "product") {
            console.log("render callout",component.property.position.context);
            if (component.property.position.context.length > 0) {
                var target = document.getElementById(component.property.position.context);
                if (target != undefined) {
                    var left = target.getBoundingClientRect().left;
                    var top = target.getBoundingClientRect().top + target.clientHeight + 5;
                    console.log("callout", left, top);
                    setTimeout(() => {
                        callout.style.left = (left-10) + "px";
                        callout.style.top = (top+12) + "px"
                    }, 100);


                }


            }
        }




        return { root: callout, content: main };
    },
    property: {
        position: { label: "位置", type: "component", context: "" },

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