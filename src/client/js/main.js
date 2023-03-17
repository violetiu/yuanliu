// window.onresize = () => {
//     window.location.reload();
// }
/**
 * [
            dist + '/js/blues.js',
            dist + '/js/pagesData.js',
            dist + '/js/titleData.js',
            dist + '/js/navData.js',
            dist + '/js/projectData.js',
             dist + '/js/component.js', 
             dist + '/js/dataCatalog.js'
            , dist + '/js/map.js',
             dist + '/js/components.js', dist + '/js/database.js'
            ,
        ]
 *  */
import { clearExpands, find_catalog_by_key, loadBlueprint, renderBlueView } from "./blues.js";
import { getComponentTempateByType } from "./component.js";
import nav_data from "./navData.js";
import pages_data from "./pagesData.js";
import project_data from "./projectData.js";
import title_data from "./titleData.js";
import background_data from "./backgrounds.js";
import shapes_data from "./shapes.js";


window.onload = () => {

    // console.log(project_data);
    // console.log("dataCatalog", dataCatalog);
    console.log("############prototyping start############");

    document.getElementById("loadding").remove();
    document.title = project_data.name;
    document.body.style.cssText = "--theme-color:" + project_data.themeColor + ";" + "--light-color:" + project_data.lightColor;
    var hash = document.location.hash;
    var pagType;
    if (hash.indexOf("type=simple") > 0) {

        pagType = "simple";
        title_data.display = false;
        nav_data.display = false;
    } else {
        renderHubIcon();

    }


    if (title_data.display) {
        renderTitle();
    }
    console.log("nav", nav_data);
    if (nav_data.display) {
        renderNav();
    }


    // setInterval(() => {
    //     req();
    // }, 50);

    if (hash.indexOf("?") > 0) {
        hash = hash.split("?")[0];
    }
    console.log("hash", hash);
    if (hash != undefined && hash.length > 0) {

        renderPageByCatalogKey(hash.substring(1));
        return;


    }
    if (project_data.launch != undefined && project_data.launch.length > 0) {
        console.log("launch",project_data.launch);
        var page = pages_data.find(p => p.key == project_data.launch);
        console.log(page.name,page.path);
        renderPage(page, undefined, true);
        return;
    }
    if (project_data.index != undefined && project_data.index.length > 0) {
        console.log("index",project_data.index);
        // var page = pages_data.find(p => p.key == project_data.index);
        // console.log(page.name,page.path);
        // renderPage(page);
        window.location.hash=project_data.index;
        window.location.reload();
       // return;
    }
    for (var key in pages_data) {

        renderPage(pages_data[key]);
        break;
    }

    


}

function req() {

    var xhr = new XMLHttpRequest();
    var data = window.location.href;

    xhr.open('POST', 'http://127.0.0.1:4000', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    xhr.onload = () => {

        if (xhr.response == "0") {
            window.location.reload();
        }
    }




}
var nav_bar;

function renderNav() {
    var app = document.getElementById("navBar");
   
    nav_bar = document.createElement("div");
    nav_bar.className = "nav_bar";
    nav_bar.id = "nav_bar";
  
    document.body.setAttribute("nav-model",nav_data.model);

    if(nav_data.model==undefined||nav_data.model=="0"){
        app.style.height = (window.innerHeight - 44) + "px";
        nav_bar.style.position = "relative";
    }

   
    app.style.background = nav_data.background;
    if(nav_data.background=="transparent"){
        nav_bar.style.color="";
    }else if (isDark(nav_data.background)) {
        nav_bar.style.color = "#fff";
    } else {
        nav_bar.style.color = "#222";
    }


    app.appendChild(nav_bar);
    renderNavTrees(nav_bar, nav_data.items);


    var app_menu = document.getElementById("app_menu");
    app_menu.onclick=()=>{
        if(app.style.display=="none"){
            app.style.display="block";
        }else{
            app.style.display="none";
        }

    }

}

function renderNavTrees(content, nav) {

    content.innerHTML = "";

    nav.forEach(item => {
        renderNavTree(content, item, 1);
    })


}
var lastSelected;

function renderNavTree(content, nav, level) {
    if (nav.children != undefined && nav.children.length > 0) {
        var folder = document.createElement("div");
        folder.className = "nav_folder";
        content.appendChild(folder);

        var folderTitle = document.createElement("div");
        folderTitle.className = "nav_folder_title nav_row";
        folder.appendChild(folderTitle);

        var indent = document.createElement("div");
        indent.className = "indent";
        indent.style.width = level * 12 + "px";
        folderTitle.appendChild(indent);
        indent.style.pointerEvents="none";

        var icon = document.createElement("i");
        icon.className = "bi bi-chevron-right";
        folderTitle.appendChild(icon);
        icon.style.pointerEvents="none";

        var name = document.createElement("div");
        name.className = "name";
        name.innerText = nav.name;
        folderTitle.appendChild(name);
        name.style.pointerEvents="none";

        var folderView = document.createElement("div");
        folderView.className = "nav_folder_view";
        folderView.style.display = "none";
        folder.appendChild(folderView);
      
     
        nav.children.forEach((child) => {
            renderNavTree(folderView, child, level + 1);
        })
        folderTitle.onmousedown = (e) => {
         
            var x = e.offsetX;
            var y = e.offsetY;
            var w = e.target.clientWidth;
            ripple = document.createElement("div");
            ripple.className = "ripple";

            var rw = x;
            if (x < w / 2) {
                rw = w - x;
            }
            ripple.style.height = (rw * 2) + "px";
            ripple.style.width = (rw * 2) + "px";
            ripple.style.left = (x - rw) + "px";
            ripple.style.top = (y - rw) + "px";
            folderTitle.appendChild(ripple);
        }
        folderTitle.onmouseup = (e) => {
            if (ripple != undefined) {
                ripple.remove();
            }
            if (folderView.style.display == "none") {
                folderView.style.display = "block";
                icon.className = "bi bi-chevron-down";
            } else {
                folderView.style.display = "none";
                icon.className = "bi bi-chevron-right";
            }

        }

        window.onmouseup = (e) => {

            if (ripple != undefined) {
                ripple.remove();
            }

           

        }

    } else {
        var page = document.createElement("div");
        page.className = "nav_file nav_row";
        content.appendChild(page);

        var indent = document.createElement("div");
        indent.className = "indent";
        indent.style.width = level * 12 + "px";
        indent.style.pointerEvents="none";
        page.appendChild(indent);

        var icon = document.createElement("i");
        icon.className = nav.icon;
        icon.style.pointerEvents="none";
        page.appendChild(icon);

        var name = document.createElement("div");
        name.className = "name";
        name.innerText = nav.name;
        name.style.pointerEvents="none";
        page.appendChild(name);

     
        page.onmousedown = (e) => {
         
            var x = e.offsetX;
            var y = e.offsetY;
            var w = e.target.clientWidth;
            ripple = document.createElement("div");
            ripple.className = "ripple";

            var rw = x;
            if (x < w / 2) {
                rw = w - x;
            }
            ripple.style.height = (rw * 2) + "px";
            ripple.style.width = (rw * 2) + "px";
            ripple.style.left = (x - rw) + "px";
            ripple.style.top = (y - rw) + "px";
            page.appendChild(ripple);
        }
        page.onmouseup = (e) => {
            if (ripple != undefined) {
                ripple.remove();
            }
            if (lastSelected == undefined || lastSelected != page) {
                if (lastSelected != undefined)
                    lastSelected.setAttribute("selected", "false");
                page.setAttribute("selected", "true");
                lastSelected = page;
                document.title = nav.name;

                var c = find_catalog_by_key(project_data.catalogs, nav.path);
                console.log(c);
                var p = pages_data.find(p => p.path == c.path);


                if (p != undefined) {
                    document.location.hash = p.key;
                    renderPage(p);
                }


            }

        }

        window.onmouseup = (e) => {

            if (ripple != undefined) {
                ripple.remove();
            }

           

        }
    }
}
var title_bar;

function renderTitle() {
    var app = document.getElementById("titleBar");
    app.style.position = "relative";
    title_bar = document.createElement("div");
    title_bar.className = "title_bar";
    title_bar.id = "title_bar";
    app.appendChild(title_bar);
    title_bar.style.background = title_data.background;
    //title_bar.style.boxShadow="0px 2px 10px var(--light-color)";
    if (isDark(title_data.background)) {
        app.style.color = "#fff";
    } else {
        app.style.color = "#222";
    }


    if (title_data.page != undefined)
        renderComponents(title_bar, title_data.page.children);
    // requestIdleCallback(() => {
    if (title_data.page != undefined) {
        loadBlueprint(title_data.page.blues, title_data.page.blueLinks);
    }

    //  });
    // setTimeout(() => {
    //     if (title_data.page != undefined) {
    //         loadBlueprint(title_data.page.blues, title_data.page.blueLinks);
    //     }
    // }, 100);

}
var curpages = [];

export function getCurPage(index) {
    if (index == undefined)
        return curpages[0];
    return curpages[index];
}

export function renderPageByCatalogKey(key, content, pageIndex) {

    var c = find_catalog_by_key(project_data.catalogs, key);
    if (c == undefined) {
        console.log("renderPageByCatalogKey not found " + key)
        console.log(project_data.catalogs);
        return;
    }
    var p = pages_data.find(p => p.path == c.path);
    renderPage(p, content, pageIndex);
}

export function renderPage(pageJson, content, isLaunch, pageIndex) {
    if (pageJson == undefined) {
        console.log("pageJson is undefined")
        return;
    }
    document.title = pageJson.name;
    //清除之前的
    clearExpands();
    var pg = document.getElementById("page_bg");

    //开始新的
    if (project_data.backgroundType == undefined || project_data.backgroundType == 0) {
        pg.style.background = "auto";
        pg.getContext("2d").clearRect(0, 0, pg.clientWidth, pg.clientHeight);
    } else if (project_data.backgroundType == 1) {
        pg.style.background = project_data.backgroundColor;
        pg.getContext("2d").clearRect(0, 0, pg.clientWidth, pg.clientHeight);




    } else if (project_data.backgroundType == 2) {
        pg.style.background = project_data.backgroundColor;
        pg.getContext("2d").clearRect(0, 0, pg.clientWidth, pg.clientHeight);
    } else if (project_data.backgroundType == 3) {
        //图像
        var bd = background_data.find(b => b.key == project_data.backgroundColor);
        console.log("background_data");
        console.log(background_data, project_data.backgroundColor);
        console.log(bd);
        if (bd != undefined)
            bd.onRender(pg, project_data.themeColor);
    }



    curpages = [];
    curpages.push(pageJson);

    if (isLaunch != undefined && isLaunch) {
        if (title_bar != undefined)
            title_bar.style.display = "none";
        if (nav_bar != undefined)
            nav_bar.style.display = "none";
    } else {
        if (title_bar != undefined)
            title_bar.style.display = "block";
        if (nav_bar != undefined)
            nav_bar.style.display = "block";

    }

    // //nav title
    // if (isDark(title_data.background) && getCurPage().theme == "light") {
    //     if (title_bar != undefined)
    //         title_bar.style.color = "#fff";
    // } else if (!isDark(title_data.background) && getCurPage().theme == "dark") {
    //     if (title_bar != undefined)
    //         title_bar.style.color = "#000";
    // }
    // if (isDark(nav_data.background) && getCurPage().theme == "light") {
    //     if (nav_bar != undefined)
    //         nav_bar.style.color = "#fff";
    // } else if (!isDark(nav_data.background) && getCurPage().theme == "dark") {
    //     if (nav_bar != undefined)
    //         nav_bar.style.color = "#000";
    // }



    var app = document.getElementById("pageView");
    if (content != undefined) {
        app = content;
    } else {
        if (title_data.display) {
            app.style.height = (window.innerHeight - 44) + "px";
        } else {
            app.style.height = (window.innerHeight) + "px";
        }

    }
    app.innerHTML = "";

    app.style.overflow = "auto";
    var page = document.createElement("div");
    page.className = "page";

    app.appendChild(page);


    var theme = "light";
    if (project_data.theme)
        theme = project_data.theme;

    document.getElementById("app").className = theme;
    renderComponents(page, pageJson.children);

    setTimeout(() => {
        if (pageJson.guides != undefined && pageJson.guides.length > 0)
            renderGuide(pageJson.guides);
        loadBlueprint(pageJson.blues, pageJson.blueLinks);

    }, 100);

}

var guidesIndex = 0;

function renderGuide(guides) {

    var guideDiv = document.getElementById("guideDiv");
    if (guideDiv == undefined) {
        var app = document.getElementById("app");

        var guideDiv = document.createElement("div");
        guideDiv.className = "guideDiv";
        guideDiv.id = "guideDiv";

        app.appendChild(guideDiv);
        guideDiv.onclick = (e) => {
            guidesIndex++;
            if (guidesIndex >= guides.length) {
                guidesIndex = 0;
                guideDiv.remove();
            } else {
                renderGuide(guides);
            }
        }
    }
    guideDiv.innerHTML = "";
    if (guidesIndex < guides.length) {
        var g = guides[guidesIndex];


        var guideText = document.createElement("div");
        guideText.className = "guideText";
        guideText.id = "guideText";
        guideText.innerText = (guidesIndex + 1) + "/" + guides.length + "\r\n" + g.context + "";

        guideText.onclick = (e) => {
            e.stopPropagation();
        }

        var target = document.getElementById(g.component);
        if (target != undefined) {
            target.scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {

                var t = target.getBoundingClientRect().top + 20; // getDivClientTop(target) + 20;
                var l = target.getBoundingClientRect().left + 20;
                if (t > window.innerHeight - 100) {
                    guideText.style.bottom = (window.innerHeight - t) + "px";
                } else {
                    guideText.style.top = t + "px";
                }
                if (l > window.innerWidth - 100) {
                    guideText.style.right = (window.innerWidth - t) + "px";
                } else {
                    guideText.style.left = l + "px";

                }
                guideDiv.appendChild(guideText);
            }, 500);
        }
    }
}

function getDivClientTop(div) {
    var top = 0;
    while (div.offsetParent) {
        top += div.offsetTop;

        div = div.offsetParent;
    }
    return top;
}

function getDivClientLeft(div) {
    var left = 0;
    while (div.offsetParent) {
        left += div.offsetLeft;

        div = div.offsetParent;
    }
    return left;
}
/**
 * 
 * @param content 
 * @param components  从文件中获取，缺少方法
 */
export function renderComponents(content, components, parent) {
    content.innerHTML = "";
    //  var newComponents: IComponent[]=[];
    if (components != undefined)
        components.forEach((component, index) => {

            if (component.isRemoved == undefined && !component.isRemoved) {
                if (component.onRender == undefined) {

                    if (component.type == "icon") {
                        var icon_e = component.icon;
                        component.onPreview = () => {
                            return undefined;
                        };
                        component.onRender = (component, element) => {
                            var pi;
                            if (element != undefined)
                                pi = element;
                            else
                                pi = document.createElement("div");
                            // if (component.blue != undefined && component.blue.event != undefined && component.blue.event.click != undefined)
                            pi.setAttribute("icon_hover", "true");
                            pi.innerHTML = "<i class='bi bi-" + icon_e + "'></i>";
                            pi.onclick = () => {
                                    if (component.blue.event.click.on != undefined) {
                                        component.blue.event.click.on();
                                    }

                                }
                                // pi.className = "bi bi-" + icon;
                            return { root: pi, body: pi };
                        };
                    } else if (component.type == "image") {

                        component.onPreview = () => {

                            return document.createElement("div");
                        };
                        component.onRender = (component, element) => {
                            var img;
                            if (element != undefined)
                                img = element;
                            else
                                img = document.createElement("img");
                            if (component.property != undefined && component.property.length > 0)
                                img.src = "images/" + component.property[0].context;
                            // pi.className = "bi bi-" + icon;
                            return { root: img, content: img }
                        };
                    } else {
                        var template = getComponentTempateByType(component.type);
                        if (template != undefined) {
                            component.onPreview = template.onPreview;
                            component.onRender = template.onRender;
                            component.blue = copyBlue(template.blue);
                            //如果是扩展组件，先默认不展示
                            if (component.isExpand) {
                                component.hidden = true;
                            }

                        }
                    }
                }
                //复原被压缩的样式
                if (component.style != undefined && component.style.length > 0) {
                    var old = component.style;
                    styleTransform.forEach(trans => {
                        var rg = RegExp("\\[" + trans[1] + "\\]", "g");
                        old = old.replace(rg, trans[0] + ":")

                    })
                    component.style = old;

                }
                if (component.styles != undefined && component.styles.length > 0) {
                    var olds = component.styles;
                    styleTransform.forEach(trans => {
                        var rg = RegExp("\\[" + trans[1] + "\\]", "g");
                        olds = olds.replace(rg, trans[0] + ":")
                    })
                    component.styles = olds;

                }
                if (component.onRender != undefined && component.onPreview != undefined) {
                    renderComponent(content, component, parent, index);
                }
            }
        })
}
const styleTransform = [
    ["flex", "f"],
    ["background", "b"],
    ["border-radius", "br"],
    ["padding", "d"],
    ["height", "h"],
    ["width", "w"],
    ["margin", "m"],
    ["shadow", "s"],
    ["border", "r"],
    ["text-align", "ta"],
    ["color", "c"],
    ["position", "p"],
    ["font-weight", "fw"],
    ["white-space", "ws"],
    ["font-size", "fs"],
    ["display", "di"],
    ["cursor", "cu"]
];

function copyBlue(blue) {
    if (blue == undefined)
        return undefined;
    var event;
    var method = blue.method;
    var property;
    if (blue.event != undefined) {
        event = {};
        for (var key in blue.event) {
            var eve = blue.event[key];
            var e = { label: eve.label };
            event[key] = e;
        }
    }
    if (blue.property != undefined) {
        property = {};
        for (var key in blue.property) {
            var eve = blue.property[key];
            var el = { label: eve.label, get: eve.get, set: eve.set };
            property[key] = el;
        }
    }
    var temp = {
        event: event,
        method: method,
        property: property,
        properties: blue.properties

    };
    return temp;
}

export function renderComponent(content, component, parent, index, self) {

    //如果隐藏，不渲染里面的内容。
    if (component.hidden) {
        var root = document.createElement("div");
        root.id = component.key;
        root.className = "component_canvas";
        if (content != undefined)
            content.appendChild(root);
        return;
    }

    //  console.log("----renderComponent----")
    var root = null;
    if (component.self == undefined) {
        root = document.createElement("div");
        if (content != undefined)
        //处理特殊的对话框
        {
            if (component.type == "dialog") {
                console.log("处理特殊的对话框");
                var dialog = document.createElement("div");
                dialog.id = "dialog" + component.key;
                dialog.style.cssText = "background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;right:0;bottom:0;z-index:200;";
                dialog.appendChild(root);
                dialog.onclick=(e)=>{
                    e.stopPropagation();
                }
                //     root = dialog;
                content.appendChild(dialog);
            } else {
                content.appendChild(root);
            }
        }
    }
    if (self != undefined) {
        root = self;
    }



    var rs = component.onRender(component, root, content, "product", project_data.themeColor);

    var body = rs.content;
    if (root == undefined) {

        return;
    }
    root.id = component.key;
    root.className += "component_canvas";
    root.setAttribute("component_type", component.type);

    root.setAttribute("component_group", component.group);

    if (root.style != undefined && root.style.cssText.length <= 0) {
        if (component.styles != undefined && component.styles["root"] != undefined) {

            root.style.cssText = component.styles["root"];
        } else if (component.style != undefined) {

            root.style.cssText = component.style;
        }
    }
    if (component.hidden) {
        if (component.toogle != undefined) {
            component.toogle(root, true);
        } else {
            root.style.display = "none";
        }
    }

    //控制层级 layer
    if (component.type == "layers") {
        root.style.padding = "0px";
    }
    if (parent != undefined && index != undefined) {
        if (parent.type == "layers") {

            var layer = parseInt(parent.property.layer.context);


            root = document.getElementById(component.key);
            root.style.margin = "0px";
            //层级
            // if (layer == -2) {
            //     //平铺
            //     root.style.position = "relative";
            //     root.style.top = "0px";

            //     root.style.right = "0px";
            //     root.style.left = "0px";
            //     root.style.bottom = "0px";

            // } else 
            if (layer == -1 || layer == -2) {
                //层级
                if (index == 0) {
                    root.style.position = "absolute";
                    root.style.top = "0px";
                    root.style.right = "0px";
                    root.style.left = "0px";
                    root.style.bottom = "0px";

                } else {
                    root.style.position = "absolute";
                    root.style.top = "0px";
                    root.style.right = "0px";
                    root.style.left = "0px";
                    root.style.bottom = "0px";
                }

            } else {
                //展示其中的一个

                if (index === layer) {

                    root.style.display = "block";
                    root.style.position = "relative";
                } else {


                    root.style.display = "none";
                }
            }
        }
    }
    if (component.children != undefined && component.children.length > 0) {


        setTimeout(() => {
            renderComponents(body, component.children, component);
        }, 0);
    }
    //渲染形状背景
    if (component.shape != undefined && component.shape.length > 0) {
        setTimeout(() => {
            renderComponentShape(component, root)
        }, 100);

    }

    return root;
}

function renderComponentShape(component, root) {
    console.log("渲染背景", component.shape);
    var bgs = root.getElementsByClassName("component_bg");
    if (bgs == undefined || bgs.length == 0) {
        return;
    }
    console.log("-->");
    var bg = root.getElementsByClassName("component_bg")[0];
    var w = bg.clientWidth;
    var h = bg.clientHeight;

    var bgcolor = "transparent";
    var property = "background";
    var style = component.style;
    var rep = RegExp("[^\-]" + property + ":[^;]+;");

    var m = (" " + style).match(rep);

    if (m != undefined && m != null && m.length > 0) {
        for (var i = 0; i < m.length; i++) {
            var s = m[i].substring(1);
            if (s.trim().startsWith(property + ":")) {
                var v = s.split(":")[1];
                v = v.substring(0, v.length - 1).trim();
                bgcolor = v;
            }
        }
    }
    bg.innerHTML = "";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.zIndex = "1";
    svg.style.width = w + "px";
    svg.style.height = h + "px";
    bg.appendChild(svg);
   
    var shape = shapes_data.find(b => b.key == component.shape);
    if (shape != undefined) {
        root.style.background = "";
        document.getElementById(component.key).removeAttribute("hover");
        shape.onRender(svg, bgcolor, "var(--theme-color)");

    }
}

function renderHubIcon() {


    var hub_icon = document.createElement("div");
    hub_icon.className = "hub_icon";
    hub_icon.id = "hub_icon";

    var hub_icon_i = document.createElement("i");
    hub_icon_i.className = "bi bi-layers-half";
    hub_icon.appendChild(hub_icon_i);

    document.getElementById("app").appendChild(hub_icon);

    hub_icon.onclick = (e) => {
        var hub = document.createElement("div");
        hub.className = "hub";
        hub.id = "hub";
        document.body.appendChild(hub);
        hub.onclick = (eh) => {
            hub.remove();
            eh.stopPropagation();
        }
        renderHub(hub);
    }
}

function renderHub(content) {

    //catalog
    var catalog = document.createElement("div");
    catalog.className = "hub_catalog";
    catalog.id = "hub_catalog";
    content.appendChild(catalog);
    var catalogTitle = document.createElement("div");
    catalogTitle.className = "hub_title";
    catalogTitle.innerHTML = "目录";
    catalog.appendChild(catalogTitle);
    var catalogContent = document.createElement("div");
    catalog.appendChild(catalogContent);

    renderCatalogTrees(catalogContent, project_data.catalogs);

    var hub_blue = document.createElement("div");
    hub_blue.className = "hub_blue";

    content.appendChild(hub_blue);
    hub_blue.onclick = (e) => { e.stopPropagation() };
    var blueitle = document.createElement("div");
    blueitle.className = "hub_title";
    blueitle.innerHTML = "蓝图";
    hub_blue.appendChild(blueitle);
    var blueContent = document.createElement("div");
    blueContent.id = "hub_blue";
    hub_blue.appendChild(blueContent);

    var setting = document.createElement("div");
    setting.className = "hub_setting";
    setting.id = "hub_setting";
    content.appendChild(setting);
    setting.onclick = (e) => { e.stopPropagation() };

    var settingTitle = document.createElement("div");
    settingTitle.className = "hub_title";
    settingTitle.innerHTML = "项目信息";
    setting.appendChild(settingTitle);
    var settingContent = document.createElement("div");
    setting.appendChild(settingContent);

    updateBlueView();
    renderSetting(settingContent);
}

function renderSetting(settingContent) {

    //logo
    var logo = document.createElement("div");
    logo.style.height = "100px";
    logo.style.display = "flex";
    logo.style.justifyContent = "center";
    logo.style.alignItems = "center";
    settingContent.appendChild(logo);
    var cover = document.createElement("img");
    cover.src = "images/cover.png";

    cover.style.height = "100%";
    logo.appendChild(cover);
    //author
    var author = document.createElement("div");
    author.innerText = project_data.author;
    author.style.textAlign = "center";
    settingContent.appendChild(author);
    //date
    var date = document.createElement("div");
    date.style.textAlign = "center";
    date.innerText = project_data.updateDate;
    settingContent.appendChild(date);
    //info
    var info = document.createElement("div");
    info.innerText = project_data.description;
    info.style.padding = "10px";
    settingContent.appendChild(info);

    var pageTitle = document.createElement("div");
    pageTitle.innerText = "页面信息";
    pageTitle.style.padding = "10px";
    settingContent.appendChild(pageTitle);

    //info
    var pageinfo = document.createElement("div");
    pageinfo.innerText = getCurPage().info;
    pageinfo.style.padding = "10px";
    pageinfo.style.maxWidth = "400px";
    settingContent.appendChild(pageinfo);
    //tools
    var tools = document.createElement("div");
    tools.style.padding = "10px";
    settingContent.appendChild(tools);

    var toolScreenShotBg = document.createElement("input");
    toolScreenShotBg.type = "text";
    toolScreenShotBg.style.color = "#fff";
    toolScreenShotBg.value = "#fff";
    tools.appendChild(toolScreenShotBg);

    var toolScreenShot = document.createElement("button");
    toolScreenShot.innerHTML = "截图";
    tools.appendChild(toolScreenShot);

    toolScreenShot.onclick = () => {


        domtoimage.toJpeg(document.getElementById('pageView').children.item(0), { quality: 1, bgcolor: toolScreenShotBg.value })
            .then(function(dataUrl) {
                var link = document.createElement('a');
                link.download = document.title + '.jpeg';
                link.href = dataUrl;
                link.click();
            });


    }




}
export function updateBlueView() {
    var conent = document.getElementById("hub_blue");
    if (conent != undefined) {
        conent.innerHTML = "";
        renderBlueView(conent);
    }
}

function renderCatalogTrees(content, nav) {
    content.innerHTML = "";
    nav.forEach(item => {
        renderCatalogTree(content, item, 1);
    })
}
var ripple;
function renderCatalogTree(content, nav, level) {
    if (nav.children != undefined && nav.children.length > 0) {
        var folder = document.createElement("div");
        folder.className = "nav_folder";
        content.appendChild(folder);

        var folderTitle = document.createElement("div");
        folderTitle.className = "nav_folder_title nav_row";
        folder.appendChild(folderTitle);

        var indent = document.createElement("div");
        indent.className = "indent";
        indent.style.width = level * 12 + "px";
        folderTitle.appendChild(indent);

        var icon = document.createElement("i");
        icon.className = "bi bi-chevron-right";
        folderTitle.appendChild(icon);

        var name = document.createElement("div");
        name.className = "name";
        name.innerText = nav.name;
        folderTitle.appendChild(name);

        var folderView = document.createElement("div");
        folderView.className = "nav_folder_view";
        folderView.style.display = "none";
        folder.appendChild(folderView);

        folderTitle.onclick = (e) => {
            e.stopPropagation();
            // folderTitle.setAttribute("selected", "true");
            if (folderView.style.display == "none") {
                folderView.style.display = "block";
                icon.className = "bi bi-chevron-down";
            } else {
                folderView.style.display = "none";
                icon.className = "bi bi-chevron-right";
            }
        }
        nav.children.forEach((child) => {
            renderCatalogTree(folderView, child, level + 1);
        })

    } else {
        var page = document.createElement("div");
        page.className = "nav_file nav_row";
        content.appendChild(page);

        var indent = document.createElement("div");
        indent.className = "indent";
        indent.style.width = level * 12 + "px";
        page.appendChild(indent);

        var icon = document.createElement("i");
        icon.style.pointerEvents="none";
        icon.className = "bi bi-file-earmark-richtext";
        page.appendChild(icon);

        var name = document.createElement("div");
        name.className = "name";
        name.innerText = nav.name;
        name.style.pointerEvents="none";
        page.appendChild(name);

    
        page.onmousedown = (e) => {
         
            var x = e.offsetX;
            var y = e.offsetY;
            var w = e.target.clientWidth;
            ripple = document.createElement("div");
            ripple.className = "ripple";

            var rw = x;
            if (x < w / 2) {
                rw = w - x;
            }
            ripple.style.height = (rw * 2) + "px";
            ripple.style.width = (rw * 2) + "px";
            ripple.style.left = (x - rw) + "px";
            ripple.style.top = (y - rw) + "px";
            page.appendChild(ripple);
        }
        page.onmouseup = (e) => {

            window.location.hash = nav.key;

            renderPageByCatalogKey(nav.key);
            updateBlueView();

        }

        window.onmouseup = (e) => {

            if (ripple != undefined) {
                ripple.remove();
            }

           

        }

    }
}


function isDark(color) {

    if (color == undefined) {
        console.log("is dark ", color);
        return false;
    }
    if (color == "var(--theme-color)") {

        color = project_data.themeColor;
    } else if (color == "var(--light-color)") {

        color = project_data.lightColor;
    }


    if (color.startsWith("#")) {
        var rgb = set16ToRgb(color);
        if (rgb == undefined) {
            return false;
        }

        var RgbValue = rgb.replace("rgb(", "").replace(")", "");


        var RgbValueArry = RgbValue.split(",");

        var grayLevel = parseInt(RgbValueArry[0]) * 0.299 + parseInt(RgbValueArry[1]) * 0.587 + parseInt(RgbValueArry[2]) * 0.114;
        if (grayLevel >= 150) {　　
            return false;
        } else {　
            return true;
        }

    } else if (color.startsWith("rgb(")) {
        var RgbValue = color.replace("rgb(", "").replace(")", "");


        var RgbValueArry = RgbValue.split(",");

        var grayLevel = parseInt(RgbValueArry[0]) * 0.299 + parseInt(RgbValueArry[1]) * 0.587 + parseInt(RgbValueArry[2]) * 0.114;
        if (grayLevel >= 150) {　　
            return false;
        } else {　
            return true;
        }
    } else if (color.startsWith("rgba(")) {
        var RgbValue = color.replace("rgba(", "").replace(")", "");


        var RgbValueArry = RgbValue.split(",");

        var grayLevel = parseInt(RgbValueArry[0]) * 0.299 + parseInt(RgbValueArry[1]) * 0.587 + parseInt(RgbValueArry[2]) * 0.114;
        if (grayLevel >= 150) {　　
            return false;
        } else {　
            return true;
        }
    }
    return false;

}

function set16ToRgb(str) {
    var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    if (!reg.test(str)) { return; }
    let newStr = (str.toLowerCase()).replace(/\#/g, '')
    let len = newStr.length;
    if (len == 3) {
        let t = ''
        for (var i = 0; i < len; i++) {
            t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
        }
        newStr = t
    }
    let arr = []; //将字符串分隔，两个两个的分隔
    for (var i = 0; i < 6; i = i + 2) {
        let s = newStr.slice(i, i + 2)
        arr.push(parseInt("0x" + s))
    }
    return 'rgb(' + arr.join(",") + ')';
}