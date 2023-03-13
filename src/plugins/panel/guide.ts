/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  指引标签
***************************************************************************** */
import { getCurPage } from "../../render/workbench";
import { openContextMenu } from "../../common/contextmenu";
import { IMenuItem } from "../../common/contextmenu";
import { getUUID, IComponent, IGuide, IPanel } from "../../common/interfaceDefine";
import * as dargData from "../../render/DragData";
const panel: IPanel = {
  key: "guide", name: "指引", hidden: true,sort:6,
  render: (content: HTMLElement) => {

    var view = document.createElement("div");
    view.id = "guidePanel";
    view.style.width = "100%";
    view.style.height = "100%";

    content.appendChild(view);
  },
  update: () => {
    console.log("guidePanel");
    var guidePanel = document.getElementById("guidePanel");


    guidePanel.innerHTML = "";

    // var page=getCurPage();
    // if(page==undefined)return;
    // var guides=page.guides;
    // if(guides==undefined)return;

    var row = document.createElement("div");
    row.style.display = "flex";
    row.style.height = "100%";
    guidePanel.appendChild(row);

    var list = document.createElement("div");
    list.className = "guide_list";
    list.style.maxWidth = "300px";
    list.style.minHeight = "100px";
    list.style.minWidth = "200px";
    list.style.height = "100%";
    row.appendChild(list);


    var view = document.createElement("div");
    view.className = "guide_view";
    view.style.flex = "1";

    row.appendChild(view);

    var textarea = document.createElement("textarea");
    textarea.id = "guide_textarea";
    view.appendChild(textarea);

    textarea.onchange = function (e) {
      var guide = document.getElementById("guide_textarea").getAttribute("data-guide");
      if (guide != undefined) {
        var page = getCurPage();
        if (page == undefined) return;
        var guides = page.guides;
        if (guides == undefined) return;
        var g = guides.find(g => g.key == guide);
        if (g != undefined) {
          g.context = textarea.value;
        }

      }

    }


    var page = getCurPage();
    if (page != undefined) {
      var guides = page.guides;
      if (guides != undefined) {
        guides.forEach(guide => {
          createGuide(list, guide);


        })

      }

      list.ondragover = (e) => {
        e.preventDefault();
        e.stopPropagation();

      }
      list.ondrop = (e) => {
        var component:IComponent= dargData.getData("component");
        if (component.isTemplate) {
          return;
        }
        if (page.guides != undefined) {
          var fi = getCurPage().guides.findIndex(b => b.component == component.key);
          if (fi >= 0) {
            return;
          }
        }


        var guide: IGuide = {
          key: getUUID(), component: component.key, context: "",
          icon: component.icon, name: component.label
        };

        if (page.guides == undefined) {
          page.guides = [];
        }
        page.guides.push(guide);

        createGuide(list, guide);


      }
      
    }








  
  }

}
export default function load() {
  return panel;
}
var selectKey:string;
var selectDiv:HTMLElement;
const guidePanelContextMenu: IMenuItem[] = [
  {
    id: "delete",
    label: "删除",onclick:()=>{
      var index=getCurPage().guides.findIndex(b=>b.key==selectKey);
      if(index>=0){
        getCurPage().guides.splice(index,1);
        selectDiv.remove();
      }

    }
  }
]

function createGuide(context: HTMLElement, guide: IGuide) {

  var item = document.createElement("div");
  item.className = "explorer_file explorer_row";
  item.style.display = "flex";
  item.style.userSelect = "none";
  item.style.cursor = "pointer";

  context.appendChild(item);

  var icon = document.createElement("i");
  icon.className = guide.icon;
  item.appendChild(icon);

  var name = document.createElement("div");
  name.className = "guide_name";
  name.innerText = guide.name;
  item.appendChild(name);

  item.onclick = function (e) {
    var text: any = document.getElementById("guide_textarea");
    text.removeAttribute("data-guide");
    text.value = guide.context;
    setTimeout(() => {
      text.setAttribute("data-guide", guide.key);
    }, 10);


  }
  item.oncontextmenu = function (e) {
     selectKey=guide.key;
    selectDiv=item;
    openContextMenu(guidePanelContextMenu);
  }

}