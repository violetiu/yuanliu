import { setHover } from "../../common/components";
import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "tab", label: "tab", icon: "bi bi-segmented-nav", type: "tab", group: "container",

    styles: {
        root: "margin:5px;width:max-content;height:26px; display:flex;cursor: pointer;font-size:13px; background:rgba(0,0,0,0.2);border-radius:5px;text-align:center;overflow:hidden;",
        tap: "white-space: nowrap;flex:1;height:26px;line-height:26px;font-size:12px;padding-left:10px;padding-right:10px;border-radius: 5px;",
        tapHover: "background:#09f;color:#fff;",
    },
    option: JSON.stringify([
        "选项1", "选项2",
    ], null, 2),
    onPreview: (component) => {
        var taps = document.createElement("div");

        ["选项1", "选项2"].forEach((n) => {
            var tap = document.createElement("div");

            tap.innerText = n;
            tap.style.cssText = component.styles.tap;

            taps.appendChild(tap);


        });
        return taps;
    }, onRender: (component, element,content,type) => {
        var taps: any;
        if (element != undefined)
            taps = element;
        else
            taps = document.createElement("div");
        taps.innerHTML = "";

      
        var ops = eval(component.option);
        for (var i = 0; i < ops.length; i++) {
            var op = ops[i];
            var tap = document.createElement("div");
            tap.innerText = op;
            tap.className = "hover";
            tap.setAttribute("data-styles", "tap")
            tap.setAttribute("data-index", i + "");
            tap.style.cssText = component.styles.tap;
            if (i + "" == component.property.selected.context) {
                tap.className = "selected";
            }
            //setHover(tap, component.styles.tap, component.styles.tapHover);
            taps.appendChild(tap);
            if(type=="product")
            tap.onclick = (eve: any) => {
                taps.children.item(component.property.selected.context).className = "hover";
                eve.target.className = "selected";
                var index= eve.target.getAttribute("data-index");
                component.property.selected.context = index;
                if(component.blue.event.selected.on!=undefined){
                    component.blue.event.selected.on(index);
                }
            }
        }
        return { root: taps, content: taps };
    }, property: {
        selected: {
            label: "默认选择", type: "number", context: "0"
        }
    }, blue: {
        event: {
            selected: {
                label: "选择"
            }
        },
        property: {
            list:{
                label: "选项",type:"in", get: (comp: IComponent, self:IBlueProperty) => {
                    var ip: any = document.getElementById(comp.key);
                    return ip.value;
                }, set: (comp: IComponent, self:IBlueProperty, args:any) => {
                    comp.option = JSON.stringify(args, null, 2);
                    comp.onRender(comp, document.getElementById(comp.key));
                    
                }  
            },
            selected: {
                label: "选择", get: (comp: IComponent, self: IBlueProperty) => {
                    return comp.property.selected.context;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    comp.property.selected.context = args;
                }
            }
        }
    }
}
export default function load() {
    return component;
}