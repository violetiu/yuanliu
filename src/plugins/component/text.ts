import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "text", label: "text", icon: "bi bi-input-cursor-text", type: "text",
    style: "cursor: pointer;font-size:13px;padding: 5px 10px 5px 10px; border:0px solid #999;background:rgba(0,0,0,0.2);border-radius:5px;",
    onPreview: () => {
        var button = document.createElement("input");
        button.type = "text";
        button.value = "ABC";
        return button;
    }, onRender: (component, element) => {
        var button: any;
        if (element != undefined)
           {
            button = element;
            button.innerHTML="";
           }
        else
            button = document.createElement("div");
    
        var input:any=document.createElement("input");
        button.appendChild(input);
        input.type = "text";
        input.style.background="transparent";
        input.style.width="inherit";
        //xin
        input.value = component.property.text.context;
        input.onChange = () => {
            component.property.text.context = input.value;
        }
        return { root: button, content: button };
    }, property: {
        text: {
            label: "文本", type: "text", context: "文本"
        }
    }, blue: {
        event: {
            change: {
                label: "改变"
            }
        },
        property: {
            value: {
                label: "值", get: (comp: IComponent, self: IBlueProperty) => {
                    var ip: any = document.getElementById(comp.key);
                    return ip.value;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    var ip: any = document.getElementById(comp.key);
                    ip.value = args;
                }
            }
        }
    }
}
export default function load() {
    return component;
}