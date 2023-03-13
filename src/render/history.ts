/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

页面操作历史
***************************************************************************** */
/**
 * 回退
 */
import { IPage } from "../common/interfaceDefine";
var historyMap = new Map<string, number>();
export function undo(pageKey: string): IPage {
   
    var history = historyMap.get(pageKey);
    if (history == undefined) {
        return undefined;
    } else {
        history--;
        if(history<0){
            return undefined;
        }
        var text = sessionStorage.getItem(pageKey);
        if (text == undefined) {
            return undefined;
        }
        var list = JSON.parse(text);
        if (list.length < history) {
            return undefined;
        }
        var page = list[history];
        historyMap.set(pageKey, history);
        return page;

    }

}
/**
 * 重做
 * @param pageKey 
 * @returns 
 */
export function redo(pageKey: string): IPage {
  
    var history = historyMap.get(pageKey);
    if (history == undefined) {
        return undefined;
    } else {
        history--;
        var text = sessionStorage.getItem(pageKey);
        if (text == undefined) {
            return undefined;
        }
        var list = JSON.parse(text);
        if (list.length < history) {
            return undefined;
        }
        var page = list[history];
        historyMap.set(pageKey, history);
        return page;

    }
}
/**
 * 操作记录
 * @param page 
 */
export function pushHistory(page: IPage) {
    page.change=true;
    requestIdleCallback(() => {
        var list: IPage[];
        var text = sessionStorage.getItem(page.key);
        if (text == undefined) {
            list = [];
        } else {
            list = JSON.parse(text);
        }
        if (list.length > 5) {
            list.splice(0, 1);
        }
        list.push(page);
        historyMap.set(page.key, list.length-1);
        sessionStorage.setItem(page.key, JSON.stringify(list));
        var tab = document.getElementById("page_tab_" + page.key);
        if (tab != undefined) {
        
            tab.setAttribute("changed",page.change+"");

        }
    });
}