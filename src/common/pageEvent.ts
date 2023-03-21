import { updateBlueView } from "../render/blueprint";
import { pushHistory } from "../render/history";
import { activePropertyPanel } from "../render/propertypanel";
import { updateSidebar } from "../render/sidebar";
import { updateStatus } from "../render/statusBar";
import { updateToolbar } from "../render/toolbar";
import { IPage } from "./interfaceDefine";

export function onOpenPage(page: IPage) {


    requestIdleCallback(() => {
        //右侧面板
        if (page.type == "projects") {
            activePropertyPanel("config");
        } else if (page.type == "pages") {
            activePropertyPanel("project");
        } else if (page.type == "title") {
            activePropertyPanel("project");
        } else {
            activePropertyPanel("page");
        }


        //工具栏
        updateToolbar(page);
        //状态栏
        updateStatus(page, undefined, undefined);
        updateSidebar({ type: "page", data: page });
    });
    setTimeout(() => {
        //TODO  load
        //   renderPageViewF();
        //  switchFloatTab("页面");
        if (page.type == "pages") {
            updateBlueView();//蓝图
            pushHistory(page);
        }

        //历史记录

    }, 1000);


}

export function onSwitchPage(page: IPage) {
    requestIdleCallback(() => {
        if (page.type == "projects") {
            activePropertyPanel("config");
        } else if (page.type == "pages") {
            activePropertyPanel("project");
        } else if (page.type == "title") {
            activePropertyPanel("project");
        } else {
            //右侧面板
            activePropertyPanel("page");
        }
        //工具栏
        updateToolbar(page);
        //导航
        updateSidebar({ type: "page", data: page });
        //状态栏
        updateStatus(page, undefined, undefined);

    });
    //更新右侧、底部面板
    setTimeout(() => {
        if (page.type == "pages") {
            updateBlueView();//蓝图
        }


    }, 1000);

}

