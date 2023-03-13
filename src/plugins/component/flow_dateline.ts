import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "flow_dateline", label: "dateLine", icon: "bi bi-calendar2-range", type: "flow_dateline", group: "flow",
    styles: {
        root: "display:flex;align-items:center;justify-content:center;padding:5px;margin:5px;border-radius:0px;border-top:1px solid var(--theme-color);",
        block: "white-space:nowrap;font-size:10px;flex:1;display:flex;align-items:center;border-left:1px solid var(--theme-color);",
   
    },
    option: "文本\n文本\n文本",
    onPreview: () => {
        var div = document.createElement("div");
      


        return div;
    }, onRender: (component, element, content, type) => {
        var div: HTMLElement;
        if (element != undefined)
            div = element;
        else
            div = document.createElement("div");
        div.innerHTML = "";
        var count = 10;
        var now=new Date().getTime();
        
     
        for (var i = 0; i < count; i++) {
            var dt=now+i*1000*60*60;
            var d=new Date(dt);
            
            var block = document.createElement("div");

            block.style.cssText = component.styles.block;
            div.appendChild(block);
            var label = document.createElement("span");
            label.style.paddingLeft="5px";
            label.innerText = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours();
            block.appendChild(label);

           
        }


        return { root: div, content: div };
    }
}
export default function load() {
    return component;
}