/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

商店
***************************************************************************** */

import { ipcRenderer } from "electron";
import { copyComponents } from "../../render/pageTitle";
import { getContextMenuArg, IMenuItem, openContextMenu } from "../../common/contextmenu";
import { getUUID, IComponent, IExtension, IPanel } from "../../common/interfaceDefine";
import { ipcRendererSend } from "../../preload";
import * as dargData from "../../render/DragData";
import * as form from "../../render/form";
import { getViewPosition } from "../../render/workspace";

var jpegTemp:any;
var extensions:Array<IExtension>;
const panel: IPanel = {
    key: "store", name: "素材", hidden: true, sort: 2,
    render: (content: HTMLElement) => {

        var storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = "storePanel";
        storePanel.style.overflow="auto";
        storePanel.style.height=(window.innerHeight- getViewPosition().top-24)+"px";
        content.appendChild(storePanel);

        var context = document.createElement("div");
        context.style.padding = "0px 10px 20px 10px";
        storePanel.appendChild(context);
        //search
        // form.createDivInput(context, "搜索", "", (value) => {

        // });

        // //["图标","形状","图标","图片"]
        // form.createDivIconSelect(context, "类型", ["bi bi-pie-chart", "bi bi-pentagon", "bi bi-patch-plus", "bi bi-images"], 0, (index) => {

        // });

        var cardsDiv = document.createElement("div");
        cardsDiv.id = "cardsDiv"; 
        cardsDiv.style.minHeight=(window.innerHeight-200)+"px";
        context.appendChild(cardsDiv);
        var previewComponent: HTMLElement;
        cardsDiv.ondragover=(e)=>{
            var cmp=dargData.getData("component");
            if(cmp!=undefined){
                e.preventDefault();
            }else{
                e.dataTransfer.dropEffect="none";
            }
     
        }
        cardsDiv.ondragenter = (e: any) => {
            var cmp:IComponent=dargData.getData("component");
            if(cmp!=undefined){
             previewComponent = renderCardPreview(cardsDiv,cmp,(jpeg)=>{
                jpegTemp=jpeg;
             });
            }
        }
        cardsDiv.ondragleave = (e: DragEvent) => {
            if (previewComponent != undefined) {
                previewComponent.remove();
                previewComponent = undefined;
            }
        }
        cardsDiv.ondragend = (e: DragEvent) => {
            if (previewComponent != undefined) {
                previewComponent.remove();
                previewComponent = undefined;
            }
        }
        cardsDiv.ondrop=(e)=>{
            if (previewComponent != undefined) {
                previewComponent.remove();
                previewComponent = undefined;
            }
            var arg=dargData.getData("component");
            if(arg!=undefined){
               // activePropertyPanels(["storeadd","store"],arg);
               var data=JSON.stringify(arg);
            
               var ex:IExtension={
                key: getUUID(),
                label: arg.label,
                icon: arg.icon,
                count: 0,
                type:"group",
                discription: "",
                version: "1.0.0",
                author: "tt",
                readmeUrl: "",
                cover: jpegTemp,
                data:data
               }
               if(extensions==undefined)extensions=[];
               extensions.push(ex);
               renderCard(cardsDiv,ex);
               ipcRendererSend("saveExtensions",extensions);

            }
        }
        ipcRenderer.on("_readExtensions",(event,data:Array<IExtension>)=>{
            extensions=data;
            renderCards(cardsDiv, data);

        });

    },
    update: () => {

        ipcRendererSend("readExtensions");

    }


}

export default function load() {
    return panel;
}
const menuItems: Array<IMenuItem> = [{
    id: "delete",
    label: "删除", icon: "bi bi-trash", onclick: () => {
        var key= getContextMenuArg();
       
        var index=extensions.findIndex(e=>e.key==key);
        extensions.splice(index,1);
        ipcRendererSend("saveExtensions",extensions);
       var card= document.getElementById(key);
        if(card){
            card.remove();
        }
       
    }
}];
function renderCardPreview(content: HTMLElement,component:IComponent,onLoadImage:(data:any)=>void){

         var row = document.createElement("div");
         
        row.style.margin="10px 0px 10px 0px";
        row.style.padding="10px";
        row.style.pointerEvents="none";
        row.style.height="120px";
        row.className="form_bg";
        row.style.borderRadius="5px";
        content.appendChild(row);
        var icon = document.createElement("div");
        icon.style.display="flex";
        icon.style.alignItems="center";
        icon.style.justifyContent="center";
        row.appendChild(icon);

          //页面截图 保存
          const domToImage = require("dom-to-image");
          var target = document.getElementById(component.key);
        
          requestIdleCallback(() => {
              domToImage.toPng(target, { quality: 0.1})
                  .then((jpeg: any) => {
                    var image=new Image();
                    image.src=jpeg;
                    icon.appendChild(image);
                    if(onLoadImage){
                        onLoadImage(jpeg);
                    }

                  })
          });


        return row
}

function renderCards(content: HTMLElement, cards: IExtension[]) {
    content.innerHTML = "";

    cards.forEach((item) => {
        renderCard(content,item);
       


    });
}

function renderCard(content: HTMLElement, item: IExtension) {
 
        var row = document.createElement("div");
        row.style.margin="10px 0px 10px 0px";
        row.style.padding="10px";
        row.className="form_bg";
        row.id=item.key;
        row.style.borderRadius="5px";
        row.onclick = () => { };
        row.draggable = true;

        row.ondragstart=(e)=>{

            dargData.setData("store",item);

        }

        var icon = document.createElement("div");
        icon.style.display="flex";
        icon.style.alignItems="center";
        icon.style.justifyContent="center";
        row.appendChild(icon);

        var i = document.createElement("img");
        i.src = item.cover;
        i.style.minWidth="200px";
        i.style.maxHeight="100px";
        i.style.pointerEvents="none";
        icon.appendChild(i);

        var context = document.createElement("div");

        row.appendChild(context);

        var label = document.createElement("div");
        label.style.fontSize="13px";
        label.innerText = item.label;
        context.appendChild(label);

        // var discription = document.createElement("div");
        // discription.style.fontSize="12px";
        // discription.innerText = item.discription;
        // discription.style.textIndent="2em";
        // context.appendChild(discription);

        var botttom = document.createElement("div");
        botttom.style.display="flex";
        botttom.style.fontSize="12px";
        context.appendChild(botttom);

        var at = document.createElement("i");
        at.className="bi bi-at";
        botttom.appendChild(at);

        var author = document.createElement("div");
        author.style.flex="1";
        author.innerText = item.author;
        botttom.appendChild(author);

        var space = document.createElement("div");
        space.style.flex="1";
        botttom.appendChild(space);

        var count = document.createElement("div");
        count.style.marginLeft="10px";
        count.innerText = item.count + "";
        botttom.appendChild(count);


        // var button = document.createElement("i");
        // button.style.marginLeft="10px";
        // button.style.cursor="pointer";
        // botttom.appendChild(button);
        // if (item.installed) {
        //     button.className = "bi bi-trash ex_button";
        // } else {
        //     button.className = "bi bi-download ex_button";
        // }

        content.appendChild(row);
        row.oncontextmenu = (e: MouseEvent) => {
            openContextMenu(menuItems, item.key);
        }


}