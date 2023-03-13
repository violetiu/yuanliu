/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  终端
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IPanel } from "../../common/interfaceDefine";
var terminal:HTMLElement;
// var textArea:HTMLTextAreaElement;
const  panel:IPanel={
    key:"terminal",name:"终端",hidden:true,sort:6,
    render:(content:HTMLElement)=>{
       
    

        var context=document.createElement("div");
        
        context.style.padding="10px";
        content.appendChild(context)

        terminal=document.createElement("div");
        
        context.appendChild(terminal);
        // textArea=document.createElement("textarea");
        // textArea.style.fontSize="12px";
        // textArea.rows=1;
        // textArea.style.minWidth="300px";
        // context.appendChild(textArea);

        ipcRenderer.on("_terminal",(e,arg)=>{
            var line=document.createElement("div");
            line.style.fontSize="12px";
            line.innerHTML=arg;
            terminal.appendChild(line);
            terminal.scrollTo({top:terminal.scrollTop});
        });
        terminal.ondblclick=()=>{
            terminal.innerHTML="";
        }

        
    },
    update:()=>{


    }

}
export default function load(){
    return panel;
}

