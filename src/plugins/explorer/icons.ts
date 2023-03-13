import { clipboard } from "electron";
import { createExplorerLayout } from "../../common/explorerTool";
import { icons } from "../../common/icons";
import { getUUID, IComponent, IExplorer } from "../../common/interfaceDefine";
import * as dargData from "../../render/DragData";
import { findCurPageComponent, getSelectComponents } from "../../render/workbench";
var body:HTMLElement;
const explorer:IExplorer={
    key:"icons",
    extend:false,
    title:"图标",
    height:400,
    onRender(content) {
        body= createExplorerLayout(content,this);
        renderIcons(body,"");

    },
    sort:3,
    onResize(height) {
        return -1;
    },
    onSearch(filter) {
        rowStart=0;
        if(filter.length==0){
            iconList=icons;
        }else{
            iconList=icons.filter(i=>i.indexOf(filter)>0);
        }
    
        renderIconsView(treeView);
    },
    onExtend(extend) {
        return -1;
    },
    update(updater) {
        
    },
    setHeight(height) {
        body.style.height = height + "px";
        viewHeight=height;
        updateLayout();
        renderIconsView(treeView);
    },
}
export default explorer;

var tree:HTMLElement;
var rowHeight = 28;
var viewHeight = 400;
var rowStart = 0;
var rowCount = 0;
var iconList:Array<string>=[];
var scroll_thumb:HTMLElement;
var treeView:HTMLElement;
function updateLayout(){
    tree.style.height = viewHeight + "px";
    treeView.style.height = tree.style.height;
    rowCount = Math.floor(viewHeight / rowHeight)+1;

}
export function renderIcons(context: HTMLElement,filter: string) {
    context.innerHTML="";
    tree = document.createElement("div");
    tree.className = "explorer_tree";
    tree.style.height = 400 + "px";
    context.appendChild(tree);

    treeView = document.createElement("div");
    treeView.className = "explorer_tree_view";
    treeView.id="explorer_icon_view";
    treeView.style.height = tree.style.height;
    var treeScroll = document.createElement("div");
    treeScroll.className = "explorer_tree_scroll";

    scroll_thumb=document.createElement("div");
    scroll_thumb.className="explorer_tree_scroll_thumb";


    treeScroll.appendChild(scroll_thumb);


    tree.appendChild(treeView);
    tree.appendChild(treeScroll);
    //

    rowCount = viewHeight / rowHeight;

    if(filter.length==0){
        iconList=icons;
    }else{
        iconList=icons.filter(i=>i.indexOf(filter)>0);
    }

    renderIconsView(treeView);

    tree.onwheel = (e) => {
        e.stopPropagation();
        e.preventDefault();
        rowStart += Math.round(e.deltaY / 10);
        if (rowStart + rowCount > iconList.length/l) {
            rowStart = Math.round(iconList.length/l - rowCount);
        }
        if (rowStart < 0) {
            rowStart = 0;
        }
     
        renderIconsView(treeView);
    
    }

}
var l=6;
function renderIconsView(treeView: HTMLElement) {

    var scroll_val=rowCount/(iconList.length/l);
    if(scroll_val>0.99){
        scroll_thumb.style.height="0px";
      
    }else{
        scroll_thumb.style.height=rowCount/(iconList.length/l)*viewHeight+"px";
        scroll_thumb.style.top=rowStart/iconList.length*l*viewHeight+"px";
    }
   
    var adds: Array<any> = [];
    var exits: Array<string> = [];
    treeView.style.top = (-rowStart * rowHeight) + "px";
    for (var i = rowStart; i < rowCount + rowStart && i < iconList.length/l; i++) {//
        var index=i*l;
        var row = document.getElementById("icons_" + i);
        if (row != undefined) {
            exits.push(row.id);
            row.style.top = (i) * rowHeight + "px";
        } else {
            var item:any={
                index: i,
                icons:[]
            };
            for(var k=0;k<l;k++){
                item.icons.push(iconList[index+k]);
            }
            adds.push(item);
        }
    }
    //删除多余的

    var wi = 0;
    while (wi < treeView.childElementCount) {
        var line = treeView.children.item(wi);
        if (exits.indexOf(line.id) < 0) {
            line.remove();
        } else {
            wi++;
        }
    }
    //增加新的
    adds.forEach((value, key) => {
    
        var index = value.index;
        var _icons = value.icons;
        renderIconsRow(treeView, _icons, index);
    });
    
    
 


}
function renderIconsRow(content: HTMLElement, _icons: string[], index: number) {

    var row=document.createElement("div");
    row.className="sidebat_icon_row";
    row.id="icons_" + index;
    row.style.position="absolute";
    row.style.height=rowHeight+"px";
   
    row.style.top=(index*rowHeight)+"px";
    content.appendChild(row);
    row.style.display="flex";
    var space = document.createElement("div");
    space.style.width = "10px";
    row.appendChild(space);
    _icons.forEach(icon=>{
   

        var iconDiv = document.createElement("div");
        iconDiv.setAttribute("icon", "bi bi-" + icon);
        iconDiv.className = "sidebar_icon";

        var iconIcon = document.createElement("i");

        iconIcon.className = "bi bi-" + icon;
        iconIcon.title = icon;
        iconDiv.appendChild(iconIcon);

        row.appendChild(iconDiv);

        iconDiv.draggable = true;
        iconDiv.ondragstart = (e: any) => {
            var icon_e = e.target.getAttribute("icon").substring(6);
            var component: IComponent = {
                type: "icon",
                isTemplate: true,
                key: getUUID(),
                icon: icon_e,
                label: icon_e,
                style: "display:inline-block;",

                onPreview: () => {
                    var pi = document.createElement("i");
                    pi.className ="bi bi-"+icon_e;
                    return pi;
                }, onRender: (component, element) => {
                    var pi;
                    if (element != undefined)
                        pi = element;
                    else
                        pi = document.createElement("div");
                    //    if (component.blue != undefined && component.blue.event != undefined && component.blue.event.click != undefined)
                    pi.setAttribute("icon_hover", "true");
                    pi.innerHTML = "<i class='bi bi-" + icon_e + "'></i>"
                    pi.onclick = () => {
                        if (component.blue.event.click.on != undefined) {
                            component.blue.event.click.on();
                        }

                    }
                    // pi.className = "bi bi-" + icon;
                    return { root: pi, content: pi }
                },
                blue: {
                    event: {
                        click: {
                            label: "单击"
                        }
                    }
                }
            };
            dargData.setData("componentTemplate", component);


        };
        iconDiv.ondblclick = (e: any) => {
            // console.log(e.target.className,icon);
            clipboard.writeText(e.target.className);

        };
        iconDiv.onclick = (e: any) => {
            var sl = getSelectComponents();
            console.log(sl);
            if (sl.length == 1) {
                var sc = findCurPageComponent(sl[0]);

                if (sc != undefined && sc.type == "icon") {
                    var icon_e = e.target.className;
                    if (icon_e != undefined && icon_e.length > 0) {

                        sc.icon = icon_e.substring(6);

                        document.getElementById(sc.key).innerHTML = "<i class='" + icon_e + "'></i>";
                    }

                }
            }
        }



    })
    var space1 = document.createElement("div");
    space1.style.width = "10px";
    row.appendChild(space1);




}