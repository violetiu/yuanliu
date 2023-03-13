/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

商店 增加素材
***************************************************************************** */

import { IExtension, IPanel } from "../../common/interfaceDefine";

import * as form from "../../render/form";
const panel: IPanel = {
    key: "storeadd", name: "收藏&提交", hidden: true, sort: 2,
    render: (content: HTMLElement) => {

        var storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = "storePanel";
        content.appendChild(storePanel);

        var context = document.createElement("div");
        context.style.padding = "0px 10px 0px 10px";
        storePanel.appendChild(context);
        //search
        form.createDivInput(context, "搜索", "", (value) => {

        });

        //["图标","形状","图标","图片"]
        form.createDivIconSelect(context, "类型", ["bi bi-pie-chart", "bi bi-pentagon", "bi bi-patch-plus", "bi bi-images"], 0, (index) => {

        });

      

    },
    update: () => {

      

    }


}
export default function load() {
    return panel;
}
