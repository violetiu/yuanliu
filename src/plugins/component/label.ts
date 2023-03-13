import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "label", label: "label", icon: "bi bi-type", type: "label", 
    style: "font-size:14px;padding: 5px 10px 5px 10px;border:0;white-space: nowrap;border-radius:5px;",
    onPreview: () => {
        var label = document.createElement("div");
        label.innerText = "标签";
        return label;
    }, onRender: (component, element,content,type) => {
        var label: HTMLElement;
        if (element != undefined)
            label = element;
        else
            label = document.createElement("div");
        label.innerHTML="";
        //兼容已签版本
        if(component.property.text==undefined){
            component.property.text=component.property[0];
        }
        var bg=document.createElement("div");
        bg.className="component_bg";

        label.appendChild(bg);
        var body=document.createElement("div");
        body .className = "component_body";
        label.appendChild(body);


        //新的
        body.innerText = component.property.text.context;
        if(type!="product")
        body.ondblclick = () => {
            var input = document.createElement("input");
            input.type = "text";
            input.value = component.property.text.context;
            input.onkeydown = (ky) => {
                ky.stopPropagation();
            }
            body.innerHTML = "";
            body.appendChild(input);
            input.onchange = () => {
                component.property.text.context = input.value;
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
                body.innerHTML = component.property.text.context;
            }

        }
        return { root: label, content: body };
    }, property: {text:{
        label: "文本", type: "text", context: "标签"
    }}, blue: {

        property: {
            value:{
                label: "值", get: (comp: IComponent, self:IBlueProperty) => {
                    var ip: any = document.getElementById(comp.key);
                    return ip.innerText;
                }, set: (comp: IComponent, self:IBlueProperty, args:any) => {
                    var ip: any = document.getElementById(comp.key);
                    ip.innerText = args;
                }
            }


        }
    }
}
export default function load() {
    return component;
}