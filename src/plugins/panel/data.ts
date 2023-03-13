/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  数据标签
***************************************************************************** */
import { ipcRenderer } from "electron";
import { renderPage } from "../../render/workbench";
import { IMenuItem, openContextMenu } from "../../common/contextmenu";
import { getUUID, IDatabase, IPage, IPanel, ITable } from "../../common/interfaceDefine";
import { ipcRendererSend } from "../../preload";
import * as form from "../../render/form";
const panel: IPanel = {
    key: "data", name: "数据", hidden: true,sort:4,
    render: (content: HTMLElement) => {
        var view = document.createElement("div");

        view.style.width = "100%";
        view.style.height = "100%";
        content.appendChild(view);



        var catalogDiv = form.createDivRow(view);
        catalogDiv.style.maxWidth = "200px";
        //   row.appendChild(catalogDiv);   
        renderCatalog(catalogDiv);




        var tableDiv = form.createDivRow(view);
        
        tableDiv.id = "database_table";
        //  row.appendChild(tableDiv);   

    }, 
    update: () => {


    }

}
export default function load() {
    return panel;
}
var database: IDatabase;
function renderCatalog(content: HTMLElement) {

    var titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.style.alignItems = "center";
    titleBar.style.fontSize = "12px";
    content.appendChild(titleBar);

    var titleIcon = document.createElement("i");
    titleIcon.className = "bi bi-box";
    titleIcon.style.paddingLeft = "5px";
    titleIcon.style.paddingRight = "5px";
    titleBar.appendChild(titleIcon);

    var titleLabel = document.createElement("div");
    titleLabel.innerHTML = "数据目录";
    titleLabel.style.flex = "1";
    titleBar.appendChild(titleLabel);

    var addIcon = document.createElement("i");
    addIcon.className = "bi bi-plus-lg";
    addIcon.style.cursor = "pointer";
    addIcon.style.paddingLeft = "5px";
    addIcon.style.paddingRight = "5px";
    titleBar.appendChild(addIcon);
    addIcon.onclick = () => {
        var table: ITable = {
            columns: [
                
            ], name: "tableName", key: getUUID(), data: [["Key","Value"],["key","value"]]
        };
        addTable(table);
        database.tables.push(table);
        saveDatabase();

    }

    var importIcon=document.createElement("i");
    importIcon.className="bi bi-file-earmark-spreadsheet";
    importIcon.title="导入excel表格";
    importIcon.style.cursor="pointer";
    importIcon.style.paddingLeft="5px";
    importIcon.style.paddingRight="5px";
    titleBar.appendChild(importIcon);
    importIcon.onclick=()=>{
        ipcRendererSend("importDataExcel","");
    };

    var designIcon=document.createElement("i");
    designIcon.className="bi bi-database-gear";
    designIcon.title="数据库设计";
    designIcon.style.cursor="pointer";
    designIcon.style.paddingLeft="5px";
    designIcon.style.paddingRight="5px";
    titleBar.appendChild(designIcon);
    designIcon.onclick=()=>{
        
        var page:IPage={key:"datadesigner",name:"数据库设计",type:"datadesigner",path:"datadesigner"};
        renderPage(page);

    };


    var catalogDiv = document.createElement("div");
    catalogDiv.id = "database_tables";
    content.appendChild(catalogDiv);

    ipcRenderer.on("_readDatabase", (event, arg) => {
        console.log("_readDatabase",arg);
        database = arg;
        catalogDiv.innerHTML = "";

        for (var key in database.tables) {

            addTable(database.tables[key]);
        }

        

    });
    //ipcRendererSend("readDatabase")


}

function renderTable(table: ITable) {
    var database_table = document.getElementById("database_table");
    database_table.innerHTML = "";

    var tableDiv = document.createElement("div");
    tableDiv.style.width = "100%";
    tableDiv.style.display="flex";
    tableDiv.style.alignItems="start";
    database_table.appendChild(tableDiv);


    var tb=document.createElement("table");
    tableDiv.appendChild(tb);



    var addCol = document.createElement("i");
    addCol.className="bi bi-plus-lg";
    addCol.style.cursor="pointer";
    addCol.style.padding="5px";

    tableDiv.appendChild(addCol);
    addCol.onclick=()=>{
        for(var key in table.data){
            if(key=="0"){
                table.data[key].push("Col");
            }else{
                table.data[key].push("0");
            }

        }
        renderTable(table);
        saveDatabase();
    }



    var cellContextMenus:IMenuItem[]=[
        {
            id:"deleteCol",
            label:"删除列",
            onclick:()=>{}
        },{
            id:"deleteRow",
            label:"删除行",
            onclick:()=>{}
        }
    ]

    var thead=document.createElement("thead");
    tb.appendChild(thead);
    var tbody=document.createElement("tbody");
    tb.appendChild(tbody);
    for(var key in table.data){
        if(key=="0"){
            for(var key2 in table.data[key]){
                var th=document.createElement("th");
            //    th.innerHTML=table.data[key][key2];
                var input=document.createElement("input");
                input.setAttribute("data-col",key2);
                input.id="input_"+key+"_"+key2;
                input.setAttribute("data-row",key);
                input.value=table.data[key][key2];
                th.appendChild(input);
                thead.appendChild(th);
                input.onchange=(e)=>{
                    var target:any=e.target;
                    
                    var ck:any=target.getAttribute("data-col");
                    var rk:any=target.getAttribute("data-row");
                    table.data[rk][ck]=target.value;
                    saveDatabase();
                }
            }
         
        }else{
            var tr=document.createElement("tr");
            tbody.appendChild(tr);
            for(var key2 in table.data[key]){
                var td=document.createElement("td");
                //td.innerHTML=table.data[key][key2];
                var input=document.createElement("input");
                input.id="input_"+key+"_"+key2;
                input.value=table.data[key][key2];
                input.setAttribute("data-col",key2);
                input.setAttribute("data-row",key);
                td.appendChild(input);
                tr.appendChild(td);
                input.onchange=(e)=>{
                    var target:any=e.target;
                    
                    var ck:any=target.getAttribute("data-col");
                    var rk:any=target.getAttribute("data-row");
                    table.data[rk][ck]=target.value;
                    saveDatabase();
                }
                input.oncontextmenu=(e)=>{
                    openContextMenu(cellContextMenus);
                }
            }
        }

       
    }

    var addRow = document.createElement("i");
    addRow.className="bi bi-plus-lg";
    addRow.style.cursor="pointer";
    addRow.style.padding="5px";
  
    database_table.appendChild(addRow);
    addRow.onclick=()=>{
        var row:any[]=[];
        for(var key in table.data[0]){
            row.push("0");
        
        }
        table.data.push(row);
        renderTable(table);
        saveDatabase();
    }



}
var curTable:ITable;
function addTable(table: ITable) {
    var div = document.getElementById("database_tables");
    var item = document.createElement("div");
    item.style.paddingLeft = "5px";
    item.style.cursor = "pointer";
    item.innerHTML = table.name;
    item.style.minHeight = "24px";
    item.className = "explorer_file explorer_row";
    item.style.textIndent="20px";
    item.onclick = () => {
        curTable=table;
        renderTable(table);
  
    }
    div.appendChild(item);


    var tableContextMenus:IMenuItem[]=[
        {
            id:"deleteTable",
            label:"删除表格",
            onclick:()=>{
                var index=database.tables.indexOf(table);
                database.tables.splice(index,1);
                saveDatabase();
                ipcRendererSend("readDatabase");
            }
        }
    ];
    item.oncontextmenu=(e)=>{
        openContextMenu(tableContextMenus);
    }


    item.ondblclick = () => {
        curTable=table;
        var input = document.createElement("input");
        input.type = "text";
        input.value = table.name;
        input.onkeydown = (ky) => {
            ky.stopPropagation();
        }
        item.innerHTML = "";
        item.appendChild(input);
        input.onchange = () => {
            table.name = input.value;
        }
        input.focus();
        input.onclick = (oc) => {
            oc.stopPropagation();
        }
        input.ondblclick = (oc) => {
            oc.stopPropagation();
        }
        input.onblur = () => {
            input.remove();
            item.innerHTML = table.name;
            saveDatabase();
          
        }

    }



}
function saveDatabase() {
    console.log(database);
    ipcRendererSend("saveDatabase", database);
}