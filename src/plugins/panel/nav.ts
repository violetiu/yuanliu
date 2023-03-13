/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  导航标签
***************************************************************************** */
import { getNavBar, renderNavTrees } from "../../render/pageNav";
import { setNavItems, getProjectTitleJson, getProjectNavJson, getCurPageContent, getCurViewContent, getCurPage } from "../../render/workbench";
import { getNavItems } from "../../render/workbench";
import { IPanel } from "../../common/interfaceDefine";
import * as form from "../../render/form";
import * as forms from "../../render/forms";
import { ipcRendererSend } from "../../preload";
import { getTitleBar } from "../../render/pageTitle";
import { Editor } from "../../editor/editor";
import { isDark } from "../../dialog/picker";
var editor: any;
const panel: IPanel = {
    key: "nav", name: "导航", hidden: true, sort: 0,
    render: (content: HTMLElement) => {
        var row = document.createElement("div");
        row.style.display = "flex";
        row.style.height = "100%";
        content.appendChild(row);


        var nav = document.createElement("div");
        nav.id = "navEditor";
        nav.style.height = "100%";
        nav.style.flex = "1";
        nav.style.minHeight = "100px";
        row.appendChild(nav);
        //

        var panel = document.createElement("div");
        panel.id = 'navPanel';
        panel.style.flex = "1";
        row.appendChild(panel);



        editor = new Editor(nav, (lines) => {
            var pageC = getCurViewContent();
            var bars = pageC.getElementsByClassName("nav_bar");
            // console.log(bars);
            var nav_bar: any = bars[0];
            if (nav_bar != undefined) {
                try {
                    var navJson = eval(lines);//JSON.parse(code);
                    setNavItems(navJson);
                    renderNavTrees(nav_bar, navJson);
                    ipcRendererSend("saveNav", JSON.stringify(getNavBar()));
                } catch (ec) {
                    console.log(ec);
                }
            }


        });
        editor.highLights = [{
            match: /([A-z]+) ?=/,
            color: "#09f"
        }, {
            match: /"([^"]+)":/,
            color: "var(--theme-color)"
        }, {
            match: /([A-z]+):/,
            color: "var(--theme-color)"
        }, {
            match: /"([^"]+)"/,
            color: "#a31515"
        }, {
            match: /'([^']+)'/,
            color: "#a31515"
        }, {
            match: /(\d+)/,
            color: "#098658"
        },];
        editor.suggestions = [{
            type: "attribute",
            label: "name",
            text: "name"
        }, {
            type: "attribute",
            label: "path",
            text: "path"
        }, {
            type: "attribute",
            label: "icon",
            text: "icon"
        }, {
            type: "attribute",
            label: "isExtend",
            text: "isExtend:false"
        }, {
            type: "attribute",
            label: "children",
            text: "children:[]"
        }]


    },
    update: () => {
        var nav = getNavItems();
        // console.log(JSON.stringify(nav, null, 4));
        editor.setValue(JSON.stringify(nav, null, 4));
        editor.resize();


        var navPanel = document.getElementById("navPanel");
        navPanel.innerHTML = "";

        if (navPanel == undefined || navPanel == null) return;
        navPanel.style.padding = "0px 20px 0px 20px";

        var row = document.createElement("div");
        row.style.display = "flex";
        navPanel.appendChild(row);

        var title = document.createElement("div");
        title.style.flex = "1";
        row.appendChild(title);

        var space = document.createElement("div");
        space.style.minWidth = "20px";
        row.appendChild(space);

        var navdiv = document.createElement("div");
        navdiv.style.flex = "1";
        row.appendChild(navdiv);

        var titleJson = getProjectTitleJson();
        var navJson = getProjectNavJson();
        console.log(titleJson);

        if (titleJson == undefined || navJson == undefined) {
            console.log("titleJson==undefined||navJson==undefined");
            return;
        }

        form.createDivCheck(title, "显示标题栏", titleJson.display, (value) => {

            titleJson.display = value;
            var titles = getCurViewContent().getElementsByClassName("title_bar");
            if (titles.length > 0) {
                var titlebar: any = titles[0];
                if (value) {
                    titlebar.style.display = "block";
                } else {
                    titlebar.style.display = "none";
                }
            }
            ipcRendererSend("saveTitle", JSON.stringify(getTitleBar()));



        });

        var titlebg = new forms.FormColor("标题背景色");
        titlebg.render(title);
        titlebg.update(titleJson.background, (color) => {
            var titles = getCurViewContent().getElementsByClassName("title_bar");
            if (titles.length > 0) {
                var titlebar: any = titles[0];
                titlebar.style.backgroundColor = color;
            }
            titleJson.background = color;
            ipcRendererSend("saveTitle", JSON.stringify(getTitleBar()));

        });
        // form.createDivInput(title, "标题背景色", titleJson.background, (color) => {
        //     var title = document.getElementById("title_bar");
        //     title.style.backgroundColor = color;
        //     titleJson.background = color;
        // });

        form.createDivCheck(navdiv, "显示导航", navJson.display, (value) => {
            navJson.display = value;
            var navbars = getCurViewContent().getElementsByClassName("nav_bar");
            if (navbars.length > 0) {
                var navbar: any = navbars[0];
                if (value) {
                    navbar.style.display = "block";
                } else {
                    navbar.style.display = "none";
                }
            }

            ipcRendererSend("saveNav", JSON.stringify(getNavBar()));

        });



        // form.createDivInput(navdiv, "导航背景色", navJson.background, (color) => {
        //     var title = document.getElementById("nav_bar");
        //     title.style.backgroundColor = color;
        //     navJson.background = color;
        // });

        var navbg = new forms.FormColor("导航背景色");
        navbg.render(navdiv);
        navbg.update(navJson.background, (color) => {
            var navbars = getCurViewContent().getElementsByClassName("nav_bar");
            if (navbars.length > 0) {
                var navbar: any = navbars[0];
                navbar.style.backgroundColor = color;
                if (isDark(color)) {
                    navbar.style.color = "#fff";
                } else if (!isDark(color)) {
                    navbar.style.color = "#000";
                }
            }
            navJson.background = color;
            ipcRendererSend("saveNav", JSON.stringify(getNavBar()));

        });

        //
        var navModel = new forms.FormIcons("导航模式", ["bi bi-layout-sidebar", "bi bi-layout-sidebar-inset"]);
        navModel.render(navdiv);
        if (navJson.model == undefined)
            navJson.model = 0;
        navModel.update(navJson.model, (model) => {
            var navbars = getCurViewContent().getElementsByClassName("nav_bar");
            if (navbars.length > 0) {
                var navbar: any = navbars[0];
                navbar.setAttribute("model", model);
            }
            navJson.model = model;
            ipcRendererSend("saveNav", JSON.stringify(getNavBar()));
        })
    }

}
export default function load() {
    return panel;
}

