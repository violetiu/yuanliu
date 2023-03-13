import { ipcRendererSend } from "../../preload";
import { IDatabase, IExplorer, IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";
import { createExplorerLayout } from "../../common/explorerTool";
import { getCurPageContent } from "../../render/workbench";
import { ipcRenderer } from "electron";
var body:HTMLElement;
const explorer:IExplorer={
    key:"data",
    extend:false,
    title:"数据",
    height:200,
    onRender(content) {
         body=createExplorerLayout(content,this);
         renderDatabaseExplorer(body);
    },
    sort:5,
    onResize(height) {
        return -1;
    },
   
    onExtend(extend) {
        return -1;
    },
    update(updater) {
        
    },
    setHeight(height) {
        body.style.height=height+"px";
    },
}
export default explorer;




export function getDataBase(): IDatabase {
    return database;
}
var database: IDatabase;
 function renderDatabaseExplorer(database_explorer:HTMLElement) {
    ipcRenderer.on("_readDatabase", (event, arg) => {
        console.log("_readDatabase", arg);
        database = arg;
        database_explorer.innerHTML = "";

        for (var key in arg.tables) {
            var table = arg.tables[key];

            var item = document.createElement("div");
            item.style.paddingLeft = "5px";
            item.style.cursor = "pointer";
            item.draggable = true;
            item.innerHTML = table.name;
            item.style.minHeight = "24px";
            item.className = "explorer_file explorer_row";
            item.style.textIndent = "20px";
            database_explorer.appendChild(item);
            item.ondragstart = (e: DragEvent) => {

                // dragComponent = component;
                e.dataTransfer.setData("blueDatabase", JSON.stringify(table));
                var page = getCurPageContent();
                if (page != undefined) {
                    page.setAttribute("data-drag", "true");
                }

            }
            item.ondragend = (e: DragEvent) => {
                // dragComponent = undefined;
                var page = getCurPageContent();
                if (page != undefined) {
                    page.removeAttribute("data-drag");
                }
            };

        }
    });
   // ipcRendererSend("readDatabase");

}


