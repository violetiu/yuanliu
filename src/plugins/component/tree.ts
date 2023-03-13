import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "tree", label: "tree", icon: "bi bi-list-nested",
    type: "tree", 
    styles: {
        root: "min-height:100px;font-size:13px;",
        node:"border-radius:5px;"
        },
    option: "根节点",
    onPreview: () => {
        var root = document.createElement("div");
        return root;
    }, onRender: (component, element) => {
        var div: any;
        if (element != undefined) div = element;
        else div = document.createElement("div");
        div.innerHTML = "";

        component.option.split("\n").forEach(item => {
            //计算tab数量
            var count = item.split(" ").length/4;
            var grid = document.createElement("div");
       
            var row = document.createElement("div");
            row.style.cssText=component.styles["node"];
            row.style.display="flex";
            row.style.height="32px";
            row.style.alignItems="center";
            grid.append(row);
            row.style.paddingLeft = count * 20 + "px";
            row.setAttribute("hover", "true");


            var icon = document.createElement("i");
            icon.className = "bi bi-plus";
            icon.style.marginRight = "5px";
            row.append(icon);



            var title = document.createElement("div");
            title.innerText = item;

            row.appendChild(title);

            




            // var content=document.createElement("div");
            // content.style.paddingLeft=count*14+"px";



            //row
            div.appendChild(grid);

        })




        return { root: div, content: div };
    },
}
export default function load() {
    return component;
}