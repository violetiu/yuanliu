import { ipcRendererSend } from "../../preload";
import { getUUID, IBlue, IExplorer, IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";
import { createExplorerLayout } from "../../common/explorerTool";
import { getCurPageContent } from "../../render/workbench";
import { IMenuItem } from "../../common/contextmenu";
var body:HTMLElement;
const explorer:IExplorer={
    key:"blueprint",
    extend:false,
    height:300,
    title:"蓝图",
    onRender(content) {
        body=createExplorerLayout(content,this);
        renderBlueExploer(body)
    },
  
    sort:4,
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


function renderBlueExploer(content: HTMLElement) {
    {
        var title = document.createElement("div");
        title.className = "sidebar_title";
        title.innerText = "对象";
        title.draggable = false;
        content.appendChild(title);
        var componentsDiv = document.createElement("div");
        componentsDiv.className = "components";
        componentsDiv.draggable = false;
        content.appendChild(componentsDiv);
        blueObjects.forEach(obj => {

            var icon = document.createElement("i");
            icon.className = obj.icon;

            var label = document.createElement("span");
            label.innerText = obj.name;
            var componentDiv = document.createElement("div");
            componentDiv.className = "component";
            // componentDiv.appendChild(icon);
            // componentDiv.appendChild(label);

            var componentContent = document.createElement("div");
            componentContent.className = "component_content";
            componentDiv.appendChild(componentContent);
            componentContent.appendChild(icon);
            componentContent.appendChild(label);

            componentDiv.draggable = true;
            componentsDiv.appendChild(componentDiv);

            componentDiv.ondragstart = (e: DragEvent) => {

                // dragComponent = component;
                e.dataTransfer.setData("blueObject", JSON.stringify(obj));
                var page = getCurPageContent();
                if (page != undefined) {
                    page.setAttribute("data-drag", "true");
                }

            }
            componentDiv.ondragend = (e: DragEvent) => {
                // dragComponent = undefined;
                var page = getCurPageContent();
                if (page != undefined) {
                    page.removeAttribute("data-drag");
                }
            };


        });
    }
    {
        var title = document.createElement("div");
        title.className = "sidebar_title";
        title.innerText = "函数";
        title.draggable = false;
        content.appendChild(title);
        var componentsDiv = document.createElement("div");
        componentsDiv.className = "components";
        componentsDiv.draggable = false;
        content.appendChild(componentsDiv);
        blueMethods.forEach(method => {

            var icon = document.createElement("i");
            icon.className = method.icon;

            var label = document.createElement("span");
            label.innerText = method.name;
            var componentDiv = document.createElement("div");
            componentDiv.className = "component";
            var componentContent = document.createElement("div");
            componentContent.className = "component_content";
            componentDiv.appendChild(componentContent);
            componentContent.appendChild(icon);
            componentContent.appendChild(label);
            componentDiv.draggable = true;
            componentsDiv.appendChild(componentDiv);

            componentDiv.ondragstart = (e: DragEvent) => {

                // dragComponent = component;
                e.dataTransfer.setData("blueMethod", JSON.stringify(method));
                var page = getCurPageContent();
                if (page != undefined) {
                    page.setAttribute("data-drag", "true");
                }

            }
            componentDiv.ondragend = (e: DragEvent) => {
                // dragComponent = undefined;
                var page = getCurPageContent();
                if (page != undefined) {
                    page.removeAttribute("data-drag");
                }
            };


        });

    }




}

 const blueObjects:IBlue[]=[
    {
        component: "", key: getUUID(), name: "单变量", icon: "bi bi-123", 
        events: [], type: "variable", value: "0",
        properties: [{ label: "输出", name: "result", type: "out" }], methods: []
    }, {
        component: "", key: getUUID(), name: "矩阵变量", icon: "bi bi-grid-3x2-gap", 
        events: [], type: "matrix", value: "[0,1,2]",
        properties: [{ label: "输出", name: "result", type: "out" }], methods: []
    },
    {
        component: "window", key: getUUID(), name: "window", icon: "bi bi-window", 
        events: [], type: "window",
        properties: [{ label: "高度", name: "innerHeight", type: "out" },
        { label: "宽度", name: "innerWidth", type: "out" },
        { label: "scrollTop", name: "scrollTop", type: "out" },
        { label: "scrollLeft", name: "scrollLeft", type: "out" }
        ], methods: []
    },{
        component: "project", key: "blue_project_key", name: "项目", icon: "bi bi-projector",type: "project",
        events: [],
        properties: [{ label: "项目名称", name: "name", type: "out" }], methods: []
    },{
        component: "page", key: "blue_page_key", name: "页面", icon: "bi bi-file-earmark-richtext", type: "page",
        events: [{ label: "加载完成", name: "onload" }],
        properties: [{ label: "页面名称", name: "name", type: "out" },{ label: "页面位置", name: "path", type: "out" },{ label: "页面目录", name: "dir", type: "out" }], methods: []
    },{
        component: "hub", key: "blue_hub_key", name: "数据集", icon: "bi bi-signpost-split", type: "hub",
        events: [],
        properties: [{ label: "输入", name: "in", type: "in" },{ label: "输出", name: "out", type: "out" }], methods: []
    },{
        component: "link", key: "blue_hub_link", name: "外部链接", icon: "bi bi-link", type: "link",
        events: [],
        properties: [], methods: [
            { label: "打开", name: "open" }
        ]
    },{
        component: "upload", key: "blue_hub_link_upload", name: "上传Excel", icon: "bi bi-cloud-upload", type: "upload",
        events: [
            {label:"数据",name:"data"}
        ],
        properties: [], methods: [
            { label: "打开", name: "open" }
        ]
    },{
        component: "download", key: "blue_hub_link_download", name: "下载Excel", icon: "bi bi-cloud-download", type: "download",
        events: [],
        properties: [
            {label:"数据",name:"data"}
        ], methods: [
            { label: "打开", name: "open" }
        ]
    },{
        component: "date", key: "blue_hub_get_date", name: "当前日期", icon: "bi bi-calendar3", type: "date",
        events: [
            {label:"tick",name:"tick"}
        ],
        properties: [
            {label:"年份",name:"yyyy"},
            {label:"年月",name:"yyyymm"},
            {label:"年月日",name:"yyyymmdd"},
            {label:"年月日时",name:"yyyymmddhh"},
        ], methods: [
           
        ]
    },{
        component: "loadding", key: "blue_hub_loadding", name: "正在加载", icon: "bi bi-hurricane", type: "loadding",
        events: [],
        methods: [
            { label: "打开", name: "open" },
            { label: "关闭", name: "close" }
        ]
    }
    ,{
        component: "lines", key: "blue_hub_lines", name: "连线", icon: "bi bi-sign-turn-slight-right", type: "lines",
        events: [
            {label:"连线",name:"onLine"}
        ],
        methods:[]
    }
    
 ]
 function getBlueMethods():IMenuItem[]{
    var items:IMenuItem[]=[];
    blueObjects.forEach(blue=>{
        items.push( {
            id: getUUID(),
            label: blue.name, accelerator: "", onclick: () => {
                // blue.left= getX(e.clientX);blue.top= getY(e.clientY),
                // args.push(blue);
                // updateBlueView();
            }
        });
    });


    return items;


};
function getX(x: number): number {
    return x - 280;
}
function getY(y: number): number {
    return y - document.getElementById("page_view").clientHeight - 152;
}

const blueMethods:IBlue[]=[
    {
        component: "", key: getUUID(), name: "判断", icon: "bi bi-question", 
        events: [ { label: "True", name: "true", type: "out" }, { label: "False", name: "false", type: "out" }], type: "method",
        properties: [{ label: "输入", name: "in1", type: "in" }, { label: "阈值", name: "in2", type: "in" }], methods: []
    },
    {
        component: "", key: getUUID(), name: "加法", icon: "bi bi-plus-lg", 
        events: [], type: "method",
        properties: [{ label: "输入", name: "in", type: "in" }, { label: "输入", name: "threshold", type: "in" },{ label: "输出", name: "result", type: "out" } ], methods: [],
        
    },{
        component: "", key: getUUID(), name: "乘法", icon: "bi bi-x-lg", 
        events: [], type: "method",
        properties: [{ label: "输入", name: "in", type: "in" }, { label: "输入", name: "threshold", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: []
    },{
        component: "", key: getUUID(), name: "拼接字符串", icon: "bi bi-plus-square-dotted",
        events: [], type: "method",
        properties: [{ label: "输入", name: "in", type: "in" }, { label: "输入", name: "threshold", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: [],

    },{
        component: "", key: getUUID(), name: "替换字符串", icon: "bi bi-input-cursor",
        events: [], type: "method",
        properties: [{ label: "输入", name: "in", type: "in" }, { label: "被替换", name: "threshold", type: "in" },{ label: "替换为", name: "threshold1", type: "in" }, { label: "输出", name: "result", type: "out" }], methods: [],

    }

 ]