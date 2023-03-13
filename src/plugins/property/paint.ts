/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

右侧默认 绘画工具，canvas组件调用
***************************************************************************** */

import { updateComponent } from "../../common/components";
import { IComponent, IPanel } from "../../common/interfaceDefine";
import * as forms from "../../render/forms";
var formModel:forms.FormIcons;
const  panel:IPanel={
    key:"paint",name:"绘画",hidden:true,sort:1,
    render:(content:HTMLElement)=>{
        
        var   storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = "storePanel";
        content.appendChild(storePanel);
    
        var context=document.createElement("div");
        context.style.padding="0px 10px 0px 10px";
        storePanel.appendChild(context);
    
    
        //["选择","钢笔","控制","图片"]
        formModel=new forms.FormIcons("",["bi bi-cursor","bi bi-vector-pen","bi bi-bezier","bi bi-eraser"]);
        formModel.render(context);


    }, 
    update:(args:any)=>{
        var component:IComponent=args;
        var models=["select","paint","control","none"];
        var model=models.indexOf(component.property.model.context);
        formModel.update(model,(value:number)=>{
            component.property.model.context=models[value];
            updateComponent(component);

        });

        
        


    }

}
export default function load(){
    return panel;
}
