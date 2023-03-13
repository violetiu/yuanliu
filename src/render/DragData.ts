/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

拖拽数据存贮
***************************************************************************** */
var _type: string;
var _data: any;
export function setData(type: "componentTemplate" | "component"  | "catalog"|"store", data: any) {
    _type = type;
    _data = data;
}
export function getData(type: "componentTemplate" | "component"  | "catalog"|"store"): any {
    if (_type == type) return _data;
    return undefined;
}
export function clear(){
    _type = undefined;
    _data = undefined;
}