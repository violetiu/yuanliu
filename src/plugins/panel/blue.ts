/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  蓝图标签
***************************************************************************** */
import { renderBlueView } from "../../render/blueprint";
import { IPanel } from "../../common/interfaceDefine";

const  panel:IPanel={
    key:"blue",name:"蓝图",hidden:true,sort:3,
    render:(content:HTMLElement)=>{
        renderBlueView(content);
    },
    update:()=>{


    }

}
export default function load(){
    return panel;
}

