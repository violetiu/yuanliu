import { getUUID, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "flow_mind", label: "mind", icon: "bi bi-share", type: "flow_mind", group: "flow",
    styles: {
        root: "padding:5px;margin:5px;border-radius:5px;",
        block: "cursor:pointer;margin:5px;background:var(--theme-color);display:flex;align-items:center;justify-content:center;color:#fff;border-radius:5px;font-size:13px;padding:5px 10px 5px 10px;",
        arrow: "font-size:20px;color:var(--theme-color);display:flex;align-items:center;justify-content:center;margin:0px 20px 0px 20px;"
    },
    option: "开始\n    节点1\n    节点2\n        节点2.1",
    onPreview: () => {
        var div = document.createElement("div");
        div.innerHTML = "Mind";
        return div;
    }, onRender: (component, element, content, type) => {
        var div: HTMLElement;
        if (element != undefined)
            div = element;
        else
            div = document.createElement("div");
        div.innerHTML = "";
        var context = document.createElement("div");
        context.style.display = "flex";
        context.style.alignItems = "center";
        div.appendChild(context);
        var showIds =new Map();
        var parentMap = new Map();
        component.option.split("\n").forEach(item => {
            //计算tab数量

            var count = (item.split(" ").length - 1) / 4;
            if (count < 1) {
                count = 0;
            }
            console.log("count", count);
            var parent = parentMap.get(count);

            if (parent == undefined) {
                parent = document.createElement("div");
                context.appendChild(parent);
                parentMap.set(count, parent);
            }



            var block = document.createElement("div");
            block.id = getUUID();
            block.style.cssText = component.styles['block'];
            //寻找父级，上一级的最后一项
            if (count > 0) {
                var lastParent: HTMLDivElement = parentMap.get(count - 1);
                var lastBlock = lastParent.children.item(lastParent.children.length - 1);
                var lastId = lastBlock.id;
                block.className = lastId;
            } else {
                block.className = ""
            }

            if (count > 1) {
                block.style.display = "none";
            }
            block.innerText = item;
            block.setAttribute("data-count",count+"");
            parent.appendChild(block);
    
            block.onclick = (e) => {
                var b: any = e.target;
                var c=b.getAttribute("data-count");
                if (showIds.get(c) != undefined) {
                    var children = document.getElementsByClassName(showIds.get(c));
               
                    for (var i = 0; i < children.length; i++) {
                        var child: any = children.item(i);
                        child.style.display = "none";
                    }

                }
                {
                    var children = document.getElementsByClassName(b.id);
                    showIds.set(c, b.id);
                    for (var i = 0; i < children.length; i++) {
                        var child: any = children.item(i);
                        child.style.display = "flex";
                    }

                }



            }













            // var content=document.createElement("div");
            // content.style.paddingLeft=count*14+"px";



            //row


        })



        return { root: div, content: div };
    }
}
export default function load() {
    return component;
}