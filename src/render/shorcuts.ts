/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

注册快捷键
***************************************************************************** */
import { clipboard } from "electron";
import { IComponent } from "../common/interfaceDefine";
import { redo, undo } from "./history";
import { copyComponents } from "./pageTitle";
import { saveSimplePage} from "./toolbar";
import { clipboardPaste, findCurPageComponent, getCurPage, getCurPageContent, getCurPageKey, getSelectComponents, reRenderPage, setCurPage } from "./workbench";
export function getKeyCode():string{
    return keyCode;
}
var keyCode:string;
export function init() {


    //监听 键盘
 
    window.onmousemove = function (e) {

        mouseX = e.clientX;
        mouseY = e.clientY;
        
    }
    window.document.onkeydown = (e: KeyboardEvent) => {
        keyCode=e.key;
        if(e.shiftKey){
            shiftKey=true;
        }

        if ((e.metaKey || e.ctrlKey) && e.key == "s") {
      
            saveSimplePage(getCurPage());
          
        }
        else if ((e.metaKey || e.ctrlKey) && e.key == "c" && getCurPage() != undefined) {
            var _selectComponents: IComponent[] = [];
            getSelectComponents().forEach((path: string) => {
                var cmpt = findCurPageComponent(path);
                if (cmpt != undefined) {

                    _selectComponents.push(cmpt);
                }
            });
       //     var __selectComponents_ = copyComponents(_selectComponents, true);
            clipboard.writeText("[selectComponents]" + JSON.stringify(_selectComponents));
        } else if ((e.metaKey || e.ctrlKey) && e.key == "v" && getCurPage() != undefined) {
            var ls = getSelectComponents();
         
            if (ls.length == 0) {
         
                clipboardPaste(getCurPageContent());
            } else {
                var cmp = findCurPageComponent(ls[0]);
                if(cmp!=undefined){
                    var root=document.getElementById(cmp.key);
                    var body:HTMLElement;
                    for(var i=0;i<root.childElementCount;i++){
                        var child:any=root.children.item(i);
                        if(child.className=="component_body"){
                            body=child;
                            break;
                        }
                    }
              
                    if(body!=undefined){
                      
                        clipboardPaste(body, cmp);
                    }else{
                        clipboardPaste(root, cmp);
                    }
                }
                   
            }

        } else if ((e.metaKey || e.ctrlKey) && e.key == "z" && getCurPage() != undefined) {
            //撤消
            var unPage:any=undo(getCurPageKey());
            if(unPage!=undefined){
                console.log(unPage.children);
                setCurPage(unPage);
                reRenderPage();

            }
        }else if ((e.metaKey || e.ctrlKey)&&e.shiftKey && e.key == "z" && getCurPage() != undefined) {
            //重做
            var unPage:any=redo(getCurPageKey());
            if(unPage!=undefined){
                setCurPage(unPage);
                reRenderPage();

            }
        }   

    }    
    window.document.onkeyup = (e: KeyboardEvent) => {
        keyCode = "";
        if(e.shiftKey){
            shiftKey=false;
        }};

}
var mouseX: number = 0;
var mouseY: number = 0;
export function getMousePosition(): { x: number, y: number } {
    return { x: mouseX, y: mouseY };
}
var shiftKey=false;
export function getShiftKeyDown():boolean {
    return false;
}
export function setShiftKeyDown(bool:boolean) {
    return shiftKey=bool;
}
