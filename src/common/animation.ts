/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染动画
***************************************************************************** */
export function animation_width(id:string,ele:HTMLElement,width:number){
    var rule="@keyframes width_"+id+"{"
    +"0%{width:0px;}"
    +"100%{width:"+width+"px;}"
    +"}";
    document.styleSheets.item(0).insertRule(rule);
    ele.style.animation="width_"+id+" 1s";
}