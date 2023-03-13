import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "flow_level", label: "level", icon: "bi bi-diagram-3", type: "flow_level",group:"flow",
    styles: {
        root: "padding:5px;margin:5px;border-radius:5px;",
        block: "flex:1;height:50px;width:100px;background:#09f;display:flex;align-items:center;justify-content:center;color:#fff;border-radius:5px;",
        arrow: "font-size:20px;color:#09f;display:flex;align-items:center;justify-content:center;margin:0px 20px 0px 20px;"
    },
    option: "文本\n文本\n文本",
    onPreview: () => {
        var div = document.createElement("div");
        var list = ["文本", "\t文本", "\t文本","\t文本"];
        function count(text:string):number{
            var n=0;
            for(var i=0;i<text.length;i++){
                var c=text.charAt(i);
                if(c=="\t"){
                    n++;
                }
            }
            return n;
        }
        var temp=div;
        var tempC=0;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var c=count(item);
            var block = document.createElement("div");
            block.style.cssText = component.styles.block;
            var label = document.createElement("span");
            label.innerText = item;
            block.appendChild(label);
            if(c==0){
                temp.appendChild(block);
            }else if(c==1){
                //
            }
            //temp=block;
            tempC=c;
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
        function count(text:string):number{
            var n=0;
            for(var i=0;i<text.length;i++){
                var c=text.charAt(i);
                if(c=="\t"){
                    n++;
                }
            }
            return n;
        }
        var temp=div;
        var tempC=0;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var c=count(item);
            var block = document.createElement("div");
            block.style.cssText = component.styles.block;
            var label = document.createElement("span");
            label.innerText = item;
            temp.appendChild(label);
            if(c==0){
                div.appendChild(block);
            }else if(c==1){
                //
            }
            temp=block;
            tempC=c;
        }

        return { root: div, content: div };
    }
}
export default function load() {
    return component;
}