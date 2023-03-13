import { ipcRendererSend } from "../../preload";
import { getUUID, ICatalog, IExplorer, IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";
import { createExplorerLayout } from "../../common/explorerTool";
import { getProject } from "../../render/workspace";
import { renderDialog } from "../../dialog/export";
import * as dargData from "../../render/DragData";
import { openContextMenu } from "../../common/contextmenu";
import { IMenuItem } from "../../common/contextmenu";
import { getContextMenuArg } from "../../common/contextmenu";
import { getContextMenuElement } from "../../common/contextmenu";
import { getChartCount } from "../../render/sidebar";
import { ipcRenderer } from "electron";
import { openPage } from "../../render/workbench";
var body: HTMLElement;
const explorer: IExplorer = {
    key: "folders",
    extend: true,
    title: "目录",
    height: 260,
    onRender(content) {
        body = createExplorerLayout(content, this);
        renderCatalogs(body);
        //ipc
        ipcRenderer.on("_newFile", (event, arg) => {
            ipcRendererSend("readPageCatalog");
        });
        ipcRenderer.on("_deleteFile", (event, arg) => {
            //
            ipcRendererSend("readPageCatalog");
        });
        ipcRenderer.on("_deletePage", (event, arg: ICatalog) => {
            //
            deletePageByKey(arg.key, getProject().catalogs);
            ipcRendererSend("saveProject", getProject());
            // changeCatalogs(getProject().catalogs);
            // updateCatalogs();

        });
        ipcRenderer.on("_renameFile", (event, arg: { catalog: ICatalog, oldName: string, newName: string }) => {
            //  ipcRendererSend("readPageCatalog");
            // var catalogDiv=document.getElementById(arg.catalog.key);
            var target = findPageByKey(arg.catalog.key, getProject().catalogs);
            console.log("_renameFile", arg.oldName, arg.newName, arg.catalog.key, target);
            console.log(arg.catalog.key, getProject().catalogs);
            if (target != undefined) {
                target.name = arg.newName;
                target.path = target.path.replace(arg.oldName, arg.newName);
            }
            ipcRendererSend("saveProject", getProject());
        });
        ipcRenderer.on("_copyFile", (event, arg) => {
            ipcRendererSend("readPageCatalog");
        });

    },
    sort: 0,
    onResize(height) {
        return 0;
    },
    onSearch(text) {
        if(text==undefined||text.length==0){
            rowStart=0;
            changeCatalogs(getProject().catalogs);
            updateCatalogs();
        }else{
            rowStart=0;
            changeCatalogs(getProject().catalogs.filter(c=>c.name.indexOf(text)>=0));
            updateCatalogs();
        }

    },
    onExtend(extend) {
        return 0;
    },
    update(updater) {
        if(updater.type=="project"){
            changeCatalogs(updater.data.catalogs);
            updateCatalogs();
        }
    },
    setHeight(height) {
        body.style.height = height + "px";
        viewHeight=height;
        updateLayout();
        updateCatalogs();
    },
    taps: [{
        id: "newfile",
        label: "新建文件夹", icon: "bi bi-folder-plus", onclick: () => {
            createFolder("新建文件夹");
        }
    },
    {
        id: "newpage",
        label: "新建页面", icon: "bi bi-file-earmark-plus", onclick: () => {
            createPage("新建页面");
        }
    },
    {
        id: "newpaebytemp",
        label: "按模板新建页面", icon: "bi bi-node-plus", onclick: () => {
            createPageByTemplate();
        }
    }

    ]

}
export default explorer;
var tree:HTMLElement;
var rowHeight = 24;
var viewHeight = 0;
var rowStart = 0;
var rowCount = 0;
var treeView: HTMLElement;
var scroll_thumb:HTMLElement;
function updateLayout(){
    tree.style.height = viewHeight + "px";
    treeView.style.height = tree.style.height;
    rowCount = Math.floor(viewHeight / rowHeight)+1;
}
function renderCatalogs(context: HTMLElement) {

    tree = document.createElement("div");
    tree.className = "explorer_tree";
    tree.style.height = viewHeight + "px";
    context.appendChild(tree);

    treeView = document.createElement("div");
    treeView.className = "explorer_tree_view";
    treeView.id = "explorer_catalog_view";

    treeView.style.height = tree.style.height;
    
    var treeScroll = document.createElement("div");
    treeScroll.className = "explorer_tree_scroll";

    scroll_thumb=document.createElement("div");
    scroll_thumb.className="explorer_tree_scroll_thumb";


    treeScroll.appendChild(scroll_thumb);

    tree.appendChild(treeView);
    tree.appendChild(treeScroll);
    rowCount = viewHeight / rowHeight;

   



    tree.onwheel = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (catalogList.length <= 0)
            return;
        rowStart += Math.round(e.deltaY / 10);
        if (rowStart + rowCount > catalogList.length) {
            rowStart = Math.round(catalogList.length - rowCount);
        }
        if (rowStart < 0) {
            rowStart = 0;
        }

        renderCatalogsView(treeView);

    }

}
function changeCatalogs(catalogs: ICatalog[]) {
    catalogList = [];
    tranformLayers(catalogs, 0);
}
function updateCatalogs() {

   
    renderCatalogsView(treeView);


}
var catalogList: Array<ICatalog> = [];
function tranformLayers(catalogs: ICatalog[], level: number) {
    // console.log("tranformLayers");
    catalogs.forEach((catalog) => {
        tranformLayer(catalog, level);

    })


}
function tranformLayer(catalog: ICatalog, level: number) {
    catalog.level = level;
    catalogList.push(catalog);
    if (catalog.children != undefined)
        catalog.isDir = true; {
        if (catalog.isOpen) {
            level++;

            tranformLayers(catalog.children, level);
        }
    }
}


function renderCatalogsView(treeView: HTMLElement) {
    var scroll_val=rowCount/(catalogList.length);
    if(scroll_val>0.99){
        scroll_thumb.style.height="0px";
      
    }else{
        scroll_thumb.style.height=rowCount/(catalogList.length)*viewHeight+"px";
        scroll_thumb.style.top=rowStart/catalogList.length*viewHeight+"px";
    }
   
    var adds: Array<any> = [];
    var exits: Array<string> = [];
    treeView.style.top = (-rowStart * rowHeight) + "px";
    for (var i = rowStart; i < rowCount + rowStart && i < catalogList.length; i++) {//
        var layer = catalogList[i];
        var row = document.getElementById("catalog_" + layer.key);
        if (row != undefined) {
            exits.push(row.id);
            row.style.top = (i) * rowHeight + "px";
        } else {
            adds.push({
                index: i,
                layer: layer
            });
        }
    }
    //删除多余的

    var wi = 0;
    while (wi < treeView.childElementCount) {
        var line = treeView.children.item(wi);
        if (exits.indexOf(line.id) < 0) {
            line.remove();
        } else {
            wi++;
        }
    }
    //增加新的
    adds.forEach((value, key) => {
        var index = value.index;
        var layer = value.layer;
        renderCatalogsRow(treeView, layer, index);
    });





}

var lastSelected: HTMLElement;
function renderCatalogsRow(content: HTMLElement, catalog: ICatalog, index: number) {

    var level = catalog.level;

    var page = document.createElement("div");
    page.className = "explorer_file explorer_row";
    page.style.top = index * rowHeight + "px";
    page.id = "catalog_" + catalog.key;
    content.appendChild(page);

    page.title = catalog.path;
    var indent = document.createElement("div");
    indent.className = "indent";
    indent.style.width = 10 + level * 12 + "px";
    page.appendChild(indent);
    var icon = document.createElement("i");
    if (catalog.isDir) {

        if (catalog.isOpen) {
            icon.className = "bi bi-chevron-down";
            page.setAttribute("data-extend", "true");

        } else {
            icon.className = "bi bi-chevron-right";
            page.setAttribute("data-extend", "false");
        }
    } else {
        icon.className = "bi bi-file-earmark";
    }
    page.appendChild(icon);


    var name = document.createElement("div");
    name.className = "name";
    // name.innerText = catalog.page.name;
    page.appendChild(name);

    var nameInput = document.createElement("input");
    nameInput.value = catalog.name;
    name.appendChild(nameInput);

    var nameLabel = document.createElement("div");
    nameLabel.innerText = catalog.name;
    name.appendChild(nameLabel);




    var space = document.createElement("div");
    space.style.width = "10px";
    page.appendChild(space);
    page.tabIndex = 1;
    page.onkeydown = (e: KeyboardEvent) => {
        if (e.key == "Enter") {
            page.setAttribute("data-edit", "true");
            nameInput.focus();
        }

    };

    nameInput.onblur = () => {
        if (nameInput.value.length <= 0) return;
        page.setAttribute("data-edit", "false");
        nameLabel.innerText = nameInput.value;
        // catalog.name = nameInput.value;
        // catalog.path.replace(catalog.name, nameInput.value);
        renameFile(catalog, catalog.name, nameInput.value);
    }
    nameInput.onclick = (e: MouseEvent) => { e.stopPropagation() };
    nameInput.onkeydown = (e: KeyboardEvent) => {
        if (e.key == "Enter") {
            if (nameInput.value.length <= 0) return;
            page.setAttribute("data-edit", "false");
            nameLabel.innerText = nameInput.value;
            // catalog.name = nameInput.value;
            //  catalog.path.replace(catalog.name, nameInput.value);
            renameFile(catalog, catalog.name, nameInput.value);
            page.focus();
        }
        e.stopPropagation();

    };

    page.onclick = (e: MouseEvent) => {
        if (lastSelected == undefined || lastSelected != page) {
            if (lastSelected != undefined) lastSelected.setAttribute("selected", "false");
            page.setAttribute("selected", "true");
            lastSelected = page;
        }

        if (catalog.isDir) {


            if (catalog.isOpen) {

                catalog.isOpen = false;

                page.setAttribute("data-extend", "false");
                icon.className = "bi bi-chevron-right";

            } else {


                page.setAttribute("data-extend", "true");
                icon.className = "bi bi-chevron-down";
                catalog.isOpen = true;
            }
            catalogList = [];
            tranformLayers(getProject().catalogs, 0);
            renderCatalogsView(document.getElementById("explorer_catalog_view"));

        } else {

        }

    }
    page.ondblclick = (e: MouseEvent) => {
        //open page
        //   renderPage(catalog.page);
        if (!catalog.isDir) {
            console.log("---Open--", Date.now());
           openPage(catalog);
        }


    }
    page.oncontextmenu = (e: MouseEvent) => {
        if (catalog.isDir) {
            openContextMenu(menuItemsFolder, catalog, page);

        } else {
            openContextMenu(menuItemsPage, catalog, page);
        }
    }
    page.setAttribute("data-index", index + "");
    page.draggable = true;
    //链接到菜单或按钮
    page.ondragstart = (e) => {
        //TODO
        //     e.dataTransfer.setData("catalog", catalog.key);
        dargData.setData("catalog", catalog);
        e.stopPropagation();
    }
    page.ondragover = (e) => {
        e.preventDefault();
        page.setAttribute("data-insert", "true");
        e.stopPropagation();
    }
    page.ondragleave = (e) => {

        page.removeAttribute("data-insert");
        e.stopPropagation();
    }
    //移动位置
    page.ondrop = (e) => {

        page.removeAttribute("data-insert");
        e.stopPropagation();
        var dropParent = getCatalogParent(getProject().catalogs, dargData.getData("catalog").key);
        if (dropParent == undefined) {

            console.log("ondrop parent is undefined");

            var ol = getCatalog(getProject().catalogs, dargData.getData("catalog").key);
            console.log(ol);
            var olds: ICatalog = ol.caltalog;

            var copy: ICatalog = { key: getUUID(), name: olds.name, path: olds.path, dir: olds.dir, children: olds.children };
            var oldIndex = ol.index;

            getProject().catalogs.splice(oldIndex, 1);
            var index = getProject().catalogs.findIndex(c => c.key == catalog.key);
            getProject().catalogs.splice(index + 1, 0, copy);

            // var v = document.getElementById("fileExplorer");
            // v.innerHTML = "";
            // renderCatalog(v, getProject().catalogs, 1);


            changeCatalogs(getProject().catalogs);
            updateCatalogs();

            ipcRendererSend("saveProject", getProject());
        } else {
            console.log("ondrop parent not  undefined");
            var ol = getCatalog(dropParent.children, dargData.getData("catalog").key);
            var olds: ICatalog = ol.caltalog;

            var copy: ICatalog = { key: getUUID(), name: olds.name, path: olds.path, dir: olds.dir, children: olds.children };

            var oldIndex = ol.index;
            dropParent.children.splice(oldIndex, 1);
            var index = dropParent.children.findIndex(c => c.key == catalog.key);
            console.log("old", olds);
            dropParent.children.splice(index + 1, 0, copy);

            // var vs: any = document.getElementById(dropParent.key).getElementsByClassName("explorer_folder_view").item(0);
            // vs.innerHTML = "";
            var level = getChartCount(dropParent.path, "/") + 1;
            console.log("level", level);
            // renderCatalog(vs, dropParent.children, level);

            changeCatalogs(getProject().catalogs);
            updateCatalogs();
            ipcRendererSend("saveProject", getProject());

        }
    }

}




function getCatalog(list: ICatalog[], key: string): { caltalog: ICatalog, index: number } {
    if (list == undefined) {
        return;
    }

    var old = list.find(c => c.key == key);
    if (old != undefined) {
        var index = list.findIndex(c => c.key == key);
        return { caltalog: old, index: index };
    }
    for (var i = 0; i < list.length; i++) {
        var c = getCatalog(list[i].children, key);
        if (c != undefined) {
            return c;
        }
    }
}
function getCatalogParent(list: ICatalog[], key: string): ICatalog {
    if (list == undefined) {

        return;
    }
    var r = list.find(c => c.key == key);
    if (r != undefined) {

        return undefined;
    }
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        var children = c.children;
        if (children != undefined) {
            var old = children.find(c => c.key == key);
            if (old != undefined) {

                return c;
            }
        }
    }
    return undefined;
}
function createFolder(name: string, catalog?: ICatalog) {
    if (catalog == undefined) {

        var page: ICatalog = { name: name, path: "/" + name, dir: "/", sort: 0, children: [], key: getUUID() };
        if (getProject().catalogs == undefined) {
            getProject().catalogs = [];
        }
        getProject().catalogs.push(page);

        // renderFileTree(document.getElementById("fileExplorer"), page, 1);

        changeCatalogs(getProject().catalogs);
        updateCatalogs();

    } else {


    }
    // ipcRendererSend("newFile", {
    //     path: path,
    //     name: name,
    //     isDirectory: true
    // })
}
function renameFile(catalog: ICatalog, oldName: string, newName: string) {
    console.log("renameFile", catalog, oldName, newName);
    ipcRendererSend("renameFile", {
        catalog: catalog,
        oldName: oldName,
        newName: newName
    })

}
/**
 * 
 * @param name 
 * @param catalog 
 */

function createPage(name: string, catalog?: ICatalog, template?: string) {
    if (catalog == undefined) {
        //level =0
        var page: ICatalog = { name: name, path: "/" + name + ".json", dir: "/", sort: 0, key: getUUID(), template: template };
        if (getProject().catalogs == undefined) {
            getProject().catalogs = [];
        }
        getProject().catalogs.push(page);

        changeCatalogs(getProject().catalogs);
        updateCatalogs();

    } else {
        if (catalog.children == undefined) {
            catalog.children = [];
        }
        //children
        var page: ICatalog = { key: getUUID(), name: name, path: catalog.path + "/" + name + ".json", dir: catalog.path, sort: catalog.children.length, template: template };
        // if(catalog.path=="/"){
        //     page.path = "/" + catalog.name;
        // }
        catalog.children.push(page);

        changeCatalogs(getProject().catalogs);
        updateCatalogs();



    }


    // ipcRendererSend("newFile", {
    //     path: path,
    //     name: name,
    //     isDirectory: false
    // })
}
/**
* 按照模板新建
* @param caltalog 
*/
function createPageByTemplate(caltalog?: ICatalog) {

    var rd = renderDialog();
    var dialog = rd.content;
    dialog.style.display = "flex";
    dialog.style.alignItems = "center";
    dialog.style.justifyContent = "center";

    var content = document.createElement("div");
    content.className = "template_content";
    dialog.appendChild(content);

    templatePages.forEach(page => {
        var pageDiv = document.createElement("div");
        pageDiv.className = "template_page background";
        var context = page.onPriview();
        pageDiv.appendChild(context);

        var title = document.createElement("div");
        title.className = "template_title";
        title.innerText = page.label;
        title.style.fontSize = "18px";
        title.style.fontWeight = "bold";
        title.style.lineHeight = "3";
        title.style.opacity = "0.9";
        pageDiv.appendChild(title);

        content.appendChild(pageDiv);

        pageDiv.onclick = () => {

            createPage(page.label, caltalog, page.key);
            rd.root.remove();
        }
    });


}


const templatePages: Array<{
    key: string,
    label: string,
    onPriview: () => HTMLElement,
}> = [
        {
            label: "列表",
            key: "list",
            onPriview: () => {
                var page = document.createElement("div");


                var header = document.createElement("div");
                header.style.height = "20px";


                header.style.opacity = "0.5";
                header.style.display = "flex";
                page.appendChild(header);

                var headerText = document.createElement("div");
                headerText.style.flex = "1";
                headerText.style.backgroundColor = "#f90";
                headerText.style.borderRadius = "5px";
                header.appendChild(headerText);

                var flex = document.createElement("div");
                flex.style.flex = "1";

                header.appendChild(flex);

                var headerTap = document.createElement("div");
                headerTap.style.flex = "1";
                headerTap.style.borderRadius = "5px";
                headerTap.style.backgroundColor = "#9f0";
                header.appendChild(headerTap);


                var table = document.createElement("div");
                table.style.height = "100px";
                table.style.marginTop = "10px";
                table.style.backgroundColor = "#f09";
                table.style.borderRadius = "5px";
                table.style.opacity = "0.5";
                page.appendChild(table);

                var footer = document.createElement("div");
                footer.style.height = "20px";
                footer.style.marginTop = "10px";

                footer.style.display = "flex";
                footer.style.opacity = "0.5";
                page.appendChild(footer);

                var flex1 = document.createElement("div");
                flex1.style.flex = "1";
                footer.appendChild(flex1);

                var footerPages = document.createElement("div");
                footerPages.style.flex = "1";
                footerPages.style.borderRadius = "5px";
                footerPages.style.backgroundColor = "#9f0";
                footer.appendChild(footerPages);






                return page;
            }
        },
        {
            label: "树形",
            key: "tree",
            onPriview: () => {

                var content = document.createElement("div");
                content.style.display = "flex";

                var tree = document.createElement("div");
                tree.style.flex = "1";
                tree.style.backgroundColor = "#f90";
                tree.style.borderRadius = "5px";
                tree.style.marginRight = "10px";
                tree.style.opacity = "0.5";
                content.appendChild(tree);




                var page = document.createElement("div");
                page.style.flex = "3";
                content.appendChild(page);

                var header = document.createElement("div");
                header.style.height = "20px";


                header.style.opacity = "0.5";
                header.style.display = "flex";
                page.appendChild(header);

                var headerText = document.createElement("div");
                headerText.style.flex = "1";
                headerText.style.backgroundColor = "#f90";
                headerText.style.borderRadius = "5px";
                header.appendChild(headerText);

                var flex = document.createElement("div");
                flex.style.flex = "1";

                header.appendChild(flex);

                var headerTap = document.createElement("div");
                headerTap.style.flex = "1";
                headerTap.style.borderRadius = "5px";
                headerTap.style.backgroundColor = "#9f0";
                header.appendChild(headerTap);


                var table = document.createElement("div");
                table.style.height = "100px";
                table.style.marginTop = "10px";
                table.style.backgroundColor = "#f09";
                table.style.borderRadius = "5px";
                table.style.opacity = "0.5";
                page.appendChild(table);

                var footer = document.createElement("div");
                footer.style.height = "20px";
                footer.style.marginTop = "10px";

                footer.style.display = "flex";
                footer.style.opacity = "0.5";
                page.appendChild(footer);

                var flex1 = document.createElement("div");
                flex1.style.flex = "1";
                footer.appendChild(flex1);

                var footerPages = document.createElement("div");
                footerPages.style.flex = "1";
                footerPages.style.borderRadius = "5px";
                footerPages.style.backgroundColor = "#9f0";
                footer.appendChild(footerPages);
                return content;
            }
        },
        {
            label: "Hub",
            key: "hub",
            onPriview: () => {



                var page = document.createElement("div");



                var table = document.createElement("div");
                table.style.height = "100px";

                table.style.backgroundColor = "#f09";
                table.style.borderRadius = "5px";
                table.style.opacity = "0.5";
                page.appendChild(table);



                var header = document.createElement("div");
                header.style.height = "20px";

                header.style.marginTop = "10px";
                header.style.opacity = "0.5";
                header.style.display = "flex";
                page.appendChild(header);

                var headerText = document.createElement("div");
                headerText.style.flex = "1";
                headerText.style.backgroundColor = "#f90";
                headerText.style.borderRadius = "5px";
                header.appendChild(headerText);

                var flex = document.createElement("div");
                flex.style.flex = "1";

                header.appendChild(flex);

                var headerTap = document.createElement("div");
                headerTap.style.flex = "1";
                headerTap.style.borderRadius = "5px";
                headerTap.style.backgroundColor = "#9f0";
                header.appendChild(headerTap);

                var footer = document.createElement("div");
                footer.style.height = "20px";
                footer.style.marginTop = "10px";

                footer.style.display = "flex";
                footer.style.opacity = "0.5";
                page.appendChild(footer);




                var flex1 = document.createElement("div");
                flex1.style.flex = "1";
                footer.appendChild(flex1);



                var footerPages = document.createElement("div");
                footerPages.style.flex = "1";
                footerPages.style.borderRadius = "5px";
                footerPages.style.backgroundColor = "#9f0";
                footer.appendChild(footerPages);
                return page;
            }
        }
    ]


const menuItemsFolder: Array<IMenuItem> = [
    {
        id: "newpage",
        label: "新建页面", icon: "bi bi-file-earmark-plus",
        onclick: () => {


            createPage("新建页面", getContextMenuArg());
        }
    }, {
        id: "newpagebytemp",
        label: "根据模板新建页面", icon: "bi bi-node-plus",
        onclick: () => {


            createPageByTemplate(getContextMenuArg());
        }
    }, {
        id: "newfolder",
        label: "新建文件夹", icon: "bi bi-folder-plus",
        onclick: () => {


            createFolder("新建文件夹", getContextMenuArg());
        }
    }, {
        id: "delete",
        label: "删除", icon: "bi bi-trash", onclick: () => {

            deletePage(getContextMenuArg());
        }
    }, {
        id: "rename",
        label: "重命名", icon: "bi bi-pencil", accelerator: "Enter", onclick: () => {
            var ele = getContextMenuElement();
            ele.setAttribute("data-edit", "true");
            ele.getElementsByTagName("input").item(0).focus();
        }
    }];
const menuItemsPage: Array<IMenuItem> = [{
    id: "delete",
    label: "删除", icon: "bi bi-trash", onclick: () => {

        deletePage(getContextMenuArg());
    }
}, {
    id: "rename",
    label: "重命名", icon: "bi bi-pencil", accelerator: "Enter",
    onclick: () => {
        getContextMenuElement().setAttribute("data-edit", "true");
        getContextMenuElement().getElementsByTagName("input").item(0).focus();
    }
}, {
    id: "copy",
    label: "复制", icon: "bi bi-files", onclick: () => {
        var args = getContextMenuArg();
        copyFile(args.path, args.name, args.name + "_copy");
    }
}];
function deletePage(catalog: ICatalog) {
    ipcRendererSend("deletePage", catalog);

}
function copyFile(path: string, oldName: string, newName: string) {
    ipcRendererSend("copyFile", {
        path: path,
        oldName: oldName,
        newName: newName,
    })

}
function findPageByKey(key: string, catalogs: ICatalog[]): ICatalog {
    console.log("find", key, catalogs);
    var index = catalogs.find(c => c.key == key);
    if (index != undefined) {
        return index;
    } else {
        for (var i = 0; i < catalogs.length; i++) {
            var c = catalogs[i];
            if (c.children != undefined) {
                var rs = findPageByKey(key, c.children);
                if (rs != undefined) {
                    return rs;
                }
            }
        }

    }

}

function deletePageByKey(key: string, catalogs: ICatalog[]) {

    var index = catalogs.findIndex(c => c.key == key);
    if (index >= 0) {
        catalogs.splice(index, 1);
    } else {
        catalogs.forEach(c => {
            if (c.children) {
                deletePageByKey(key, c.children);
            }
        });
    }

}
