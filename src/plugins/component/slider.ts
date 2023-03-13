import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "slider", label: "slider", icon: "bi bi-sliders", type: "slider", group: "base",

    styles: {
        root: "height:15px;width:200px;position:relative",
        line: "height:5px;position:absolute;width:inherit;top:5px;border-radius:5px;background-color:rgba(0,0,0,0.1)",
        point: "cursor:ew-resize;transition: left 0.5s;position:absolute;height:15px;width:15px;border-radius:20px;left:20px;background-color:var(--theme-color);box-shadow: 1px 1px 2px var(--light-color);"

    },
    onPreview: (component) => {
        var div = document.createElement("div");
        var line = document.createElement("div");
        line.style.cssText = component.styles.line;
        line.setAttribute("data-styles", "line");
        var point = document.createElement("div");
        point.setAttribute("data-styles", "point");
        point.style.cssText = component.styles.point;
        div.appendChild(line);
        div.appendChild(point);
        setTimeout(() => {
            var v = 50;
            var m = 100;
            var n = 0;
            var s = (v - n) / (m - n);
            var l = s * div.clientWidth;
            point.style.left = l + "px";

        }, 10);
        return div;
    }, onRender: (component, element) => {
        var div: any;
        if (element != undefined) div = element;
        else div = document.createElement("div");
        div.innerHTML = "";
        var line = document.createElement("div");
        line.style.cssText = component.styles.line;
        line.setAttribute("data-styles", "line");
        var point = document.createElement("div");
        point.setAttribute("data-styles", "point");
        point.draggable = false;
        point.style.cssText = component.styles.point;
        div.appendChild(line);
        div.appendChild(point);
        setTimeout(() => {
            var v = parseFloat(component.property.default.context);
            var m = parseFloat(component.property.max.context);
            var n = parseFloat(component.property.min.context);
            var s = (v - n) / (m - n);
            var l = s * div.clientWidth;
            point.style.left = l + "px";

        }, 10);
        //move
        point.onmousedown = (ed: any) => {
            var startY = ed.clientY;
            var startX = ed.clientX;
            var startLeft = parseFloat(point.style.left.replace("px", ""));
            var move: boolean = true;
            document.onmousemove = (em: MouseEvent) => {
                if (move) {
                    var left = startLeft + em.clientX - startX;
                    if (left < 0) {
                        left = 0;
                    }
                    if (left > div.clientWidth) {
                        left = div.clientWidth;
                    }
                    point.style.left = left + "px";
                    component.property.default.context = (left / div.clientWidth * (parseFloat(component.property.max.context) - parseFloat(component.property.min.context))).toFixed(0);
                    if (component.blue.event.change.on != undefined) {
                        component.blue.event.change.on(component.property.default.context);
                    }
                }
            }
            document.onmouseup = () => {
                move = false;
            }
            ed.stopPropagation();
        };
        return { root: div, content: div };
    },
    property: {
        min: { label: "最小值", type: "number", context: "0" },
        max: { label: "最大值", type: "number", context: "100" },
        default: { label: "默认值", type: "number", context: "50" },
    }, blue: {
        event: {
            change: {
                label: "改变"
            }
        },
        property: {
            value: {
                label: "值", get: (comp: IComponent, self: IBlueProperty) => {
                    return comp.property.value.context;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    comp.property.value.context = args;
                }
            }
        }
    }
}
export default function load() {
    return component;
}