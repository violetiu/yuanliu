import { updateFloatPanel } from "../render/floatPanel";
import { pushHistory } from "../render/history";
import { getSelectComponents } from "../render/workbench";
import { getCurPage } from "../render/workbench";
import { activePropertyPanel } from "../render/propertypanel";
import { updateStatus } from "../render/statusBar";
import { IComponent } from "./interfaceDefine";
import { updateSidebar } from "../render/sidebar";

export function onAddComponents(components: IComponent[],handle?:"outline"|"page") {

    setTimeout(() => {
        //右侧面板
        activePropertyPanel(components[0]);
        //导航栏
        updateSidebar({ type: "add", data: components[0] });
        //底部面板
        updateFloatPanel(components[0]);

    }, 0);
    requestIdleCallback(() => {
        //状态栏
        updateStatus(getCurPage(), components[0], getSelectComponents());

        //历史
        pushHistory(getCurPage());
    });
}

export function onMoveComponent(component: IComponent,handle?:"outline"|"page") {

    setTimeout(() => {
        //导航栏
        updateSidebar({ type: "move", data: component });
    }, 0);
    requestIdleCallback(() => {

        //历史
        pushHistory(getCurPage());
    });
}

export function onDelComponents(components: IComponent[],handle?:"outline"|"page") {

    setTimeout(() => {
        //右侧面板
        activePropertyPanel("page");
        //导航栏
        updateSidebar({ type: "del", data: components[0] });
        //底部面板
        updateFloatPanel();

    }, 0);
    requestIdleCallback(() => {
        //状态栏
        updateStatus(getCurPage(), undefined, undefined);
        //历史
        pushHistory(getCurPage());
    });
}

export function onSelectComponents(components: IComponent[],handle?:"outline"|"page") {


    setTimeout(() => {

        //右侧面板
        activePropertyPanel(components[0]);
        //导航栏
        if(handle!="outline")
            updateSidebar({ type: "select", data: components[0] });
        //底部面板
        updateFloatPanel(components[0]);
    }, 0);
    requestIdleCallback(() => {
        //状态栏
        updateStatus(getCurPage(), components[0], getSelectComponents());

    });

}