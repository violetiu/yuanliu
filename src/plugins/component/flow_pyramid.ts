import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "flow_pyramid", label: "pyramid", icon: "bi bi-filter", type: "flow_pyramid",group:"flow",
    styles: {
        root: "display:flex;align-items:center;justify-content:center;padding:5px;margin:5px;border-radius:5px;",
        block: "flex:1;height:50px;width:100px;background:#09f;display:flex;align-items:center;justify-content:center;color:#fff;border-radius:5px;",
        arrow: "font-size:20px;color:#09f;display:flex;align-items:center;justify-content:center;margin:0px 20px 0px 20px;"
    },
    option: "文本\n文本\n文本",
    onPreview: () => {
        var div = document.createElement("div");
        var list = ["文本", "文本", "文本"];
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var block = document.createElement("div");

            block.style.cssText = component.styles.block;
            div.appendChild(block);
            var label = document.createElement("span");
            label.innerText = item;
            block.appendChild(label);

            if (i < list.length - 1) {
                var arrow = document.createElement("i");

                arrow.style.cssText = component.styles.arrow;

                div.appendChild(arrow);

                var icon = document.createElement("i");
                icon.className = "bi bi-forward";
                arrow.appendChild(icon);

            }
        }



        return div;
    }, onRender: (component, element, content, type) => {
        var div: HTMLElement;
        if (element != undefined)
            div = element;
        else
            div = document.createElement("div");
        div.innerHTML = "";
        var list = component.option.split("\n");
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var block = document.createElement("div");

            block.style.cssText = component.styles.block;
            div.appendChild(block);
            var label = document.createElement("span");
            label.innerText = item;
            block.appendChild(label);

            if (i < list.length - 1) {
                var arrow = document.createElement("i");

                arrow.style.cssText = component.styles.arrow;

                div.appendChild(arrow);

                var icon = document.createElement("i");
                icon.className = "bi bi-forward";
                arrow.appendChild(icon);

            }
        }


        return { root: div, content: div };
    }
}
export default function load() {
    return component;
}