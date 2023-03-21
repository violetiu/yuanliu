/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

接口定义
***************************************************************************** */

import { IMenuItem } from "./contextmenu";

/**
 * 项目
 */
export interface IProject {
    name: string;
    path: string;
    catalogs?: ICatalog[];
    work?: string;
    type?: "local" | "git",
    username?: string;
    password?: string;
    createDate?: string;
    updateDate?: string;
    author?: string;
    version?: string;
    description?: string;
    cover?: string;
    launch?:string;
    themeColor?:string;
    lightColor?:string;
    recent?:string[];
    index?:string;
    datadesigner?:IDataDesigner;
    backgroundType?:number;
    backgroundColor?: string;
    theme: "light" | "dark";

}
/**
 * 数据库设计
 */
export interface IDataDesigner{

    groups:IDataDesignerGroup[];

}
export interface IDataDesignerGroup{
    key:string;
    label:string;
    tables:IDataDesignerTable[];

}
export interface IDataDesignerTable{
    key:string;
    label:string;
    comment?:string;
    columns:IDataDesignerColumn[];

}
export interface IDataDesignerColumn{
    key:string;
    
    label:string;
    comment?:string;
    type?:"number"|"string";
    length?:number;
}
/**
 * 组件
 */
export interface IComponent {
    key: string;
    label: string;
     /**
     *  层级
     */
    level?:number;
     /**
     * 是否 有子组件
     */
    isDir?:boolean;
    /**
     * 是否为根组件
     */
    isRoot?:boolean;
    isOpen?:boolean;
    /**
     * 是否隐藏
     */
    hidden?: boolean;
    toogle?: (element: HTMLElement, hidden: boolean) => void;
    /**
     * 组件icon
     */
    icon: string;
    /**
     * 组件icon 是否旋转90
     */
    rotate?: boolean;
    /**
     * 组件类型
     */
    type?: string;
    /**
     * 组件选项内容，图表、选项卡组件等有
     */
    option?: string;
    /**
     * 组件排序号
     */
    sort?: number;
    /**
     * 可接受拖拽的组件类型
     */
    drop?: "component" | "catalog";
    /**
     * 拖拽后调用
     */
    onDrop?: (component: IComponent, data: any) => void;
    /**
     * 子组件
     */
    children?: Array<IComponent>;
    /**
     * 组件样式定义
     */
    style?: string;
    styles?: any;
    /**
     * 是否是flex布局
     */
    flex?: boolean;
    /**
     * 组件路径
     */
    path?: string;
    /**
     * 是否为组件模板
     */
    isTemplate?: boolean;
    /**
     * 组件背景类型 0：无，1：纯色，2：渐变，3：图片
     */
    background?: number;
    /**
     *组件布局 是否是fxied
     */
    isFixed?: boolean;
    /**
     * 
     * 渲染子组件是回调
     * 
     * @param parent 
     * @param child 
     * @param index 
     * @param root 
     * @param body 
     */
    onChild?(parent:IComponent,child:IComponent,index:number,root:HTMLElement,body:HTMLElement):void;
    /**
     * 
     * 渲染组件
     * 
     * @param component 
     * @param element 
     * @param content 
     * @param type 
     */
    onRender?(component: IComponent, element: HTMLElement, content?: HTMLElement, type?: "design" | "product",themeColor?:string): { root: HTMLElement, content: HTMLElement };
    /**
     * 
     * 渲染组件预览效果
     * 
     * @param component 
     */
    onPreview?(component?: IComponent): HTMLElement;
    /**
     * 形状
     * @param component 
     */
    shape?:string;
    /**
     * 是否已被删除
     */
    isRemoved?: boolean;
    /**
     * 组件分组
     */
    group?: "base" | "layout" | "chart" | "container"|"flow";
    /**{
     * 
     * name:IComponentProperty
     * 
     * }
     * 
     *export interface IComponentProperty {
        type: "text" | "select" | "number" | "bool" | "doc",
        label: string,
        context?: string
    }
    * 
    * */
    property?: any;
    /**
     * 组件项目模板，模板组件的key，每次渲染时子组件样式被赋值。
     */
    master?: string;
    /**
     * 组件蓝图
     */
    blue?: {
        /**{
       * 
       * name:IBlueEvent
       * 
       * }
       * 
       *export interface IBlueEvent {
            label: string;
            on?:(args:any)=>void
        }
       * 
       * */
        event?: any;
        /**{
       * 
       * name:IBlueMethod
       * 
       * }
       * 
       *export interface IBlueEvent{
        label:string;
        on:(comp:IComponent,action:(args:any)=>void)=>void;
        }
       * 
       * */
        method?: any;
        /**{
         * 
         * name:IBlueProperty
         * 
         * }
         * 
         * export interface IBlueProperty{
            label:string;
            get:(comp:IComponent)=>any;
            set:(comp:IComponent,args:any)=>any;
        }
         * 
         * */
        property?: any;
        properties?:(comp:IComponent)=>IBlueProperty[];
        
    },
    /**
     * 组件悬停时 展示的按钮组
     */
    edge?: { icon: string, label: string, onclick: (component: IComponent, item: any) => void }[];
   /**
    * 组件选中时，右侧需要展示的面板key
    */
    panel?:string;
    /**
     * 是否展示在扩展栏中
     */
    isExpand?:boolean;
}
export interface IBackground{
    title:string,
    key:string,
    onRender:(canvas:HTMLCanvasElement,color:string)=>void;
}
export interface IShape{
    title:string,
    key:string,
    onRender:(svg:SVGElement,fill:string,stroke:string)=>void;
}
export interface IBlueEvent {
    label: string;
    on?:(args:any)=>void
}
export interface IBlueMethod {
    label: string;
    fun: (comp: IComponent, args?: any) => void;
}
export interface IBlueProperty {
    label: string;
    key?:string;
    get: (comp: IComponent,self:IBlueProperty) => any;
    set: (comp: IComponent,self:IBlueProperty, args: any) => any;
}
/**
 * 项目属性
 */
export interface IComponentProperty {
    type: "text" | "select" | "number" | "bool" | "doc"|"component"|"catalog",
    label: string,
    context?: string
}
/**
 * 页面
 */
export interface IPage {
    type: "page" | "title"|"projects"|"pages"|"markdown"|"editor"|"datadesigner";
    key: string;
    name: string,
    path?: string;
    left?:number;
    top?:number;
    width?: number;
    height?: number;
    // backgroundType?:number;
    // backgroundColor?: string;
    // theme: "light" | "dark";
    children?: IComponent[];
    modified?: string;
    dialogs?: IDialog[];
    canvases?: ICanvas[];
    info?: string;
    blues?: IBlue[];
    blueLinks?: IBlueLink[];
    guides?: IGuide[];
    style?: string;
    styles?: any;
    change?:boolean;
    scale?:number;
    mode?:"flex"|"fixed";//流式 固定
    design?:"default"|"line"

}
/**
 * 指引
 */
export interface IGuide {
    key: string;
    component: string;
    name?: string;
    icon?: string;
    context?: string;

}
/**
 * 目录
 */
export interface ICatalog {
    key: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 完整路径
     */
    path?: string;
    /**
     * 所在文件夹路径
     */
    dir?: string;
    children?: ICatalog[];
    // page?:IPage;
    sort?: number;
    template?:string;
    /**
     *  层级
     */
     level?:number;
     /**
     * 是否 有子组件
     */
    isDir?:boolean;

    isOpen?:boolean;
}
/**
 * 对话框
 */
export interface IDialog {
    key: string;
    label: string;
    icon: string;
    style?: string;
    styles?: any;
    isRemoved?: boolean;
    component?: IComponent;
}
/**
 * 画布
 */
export interface ICanvas {
    key: string;
    label: string;
    icon: string;
    style?: string;
    styles?: any;
    isRemoved?: boolean;
}
/**
 * 蓝图 点
 */
export interface IBluePoint {
    name: string,
    label: string,
    type?: "out" | "in",
    value?: any;
    hidden?: boolean;
}
/**
 * 蓝图 
 */
export interface IBlue {
    component: string;
    key: string;
    type: "title"|"link" | "hub" | "page" | "project" | "component" | "method" | "variable" | "window" | "disabled" | "catalog" | "matrix" | "database"|"upload"|"download"|"date"|"loadding"|"lines";
    name: string,
    icon?: string;
    events?: IBluePoint[];
    methods?: IBluePoint[];
    properties?: IBluePoint[];
    top?: number;
    left?: number;
    value?: string;

}
/**
 * 蓝图 链接
 */
export interface IBlueLink {
    key: string;
    from: {
        blue: string;
        component: string;
        type: "event" | "method" | "property";
        name: string;
    };
    to: {
        blue: string;
        component: string;
        type: "event" | "method" | "property";
        name: string;
    },
    position: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    },
    tempPosition?: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    },
    color?: string;
}
var count=0;
export function getUUID(): string {
    count++;
    return "u" +Date.now().toString().substring(8)+""+Math.round(Math.random()*100)+count;
}
/**
 * 面板
 */
export interface IPanel {
    key: string;
    name: string;
    render?: (context: HTMLElement) => void;
    update?: (args?:any) => void;
    hidden?: boolean;
    sort: number;
}
/**
 * 标题
 */
export interface ITitle {
    display: boolean,
    background: string,
    page?: IPage;
}
/**
 * 数据
 */
export interface IDatabase {
    name: string;
    key: string;
    tables: ITable[];

}
/**
 * 表格
 */
export interface ITable {
    name: string;
    key: string;
    columns: IColumn[];
    data: any[];
}
/**
 * 表格列
 */
export interface IColumn {
    name: string;
    key: string;
}
/**
 * 扩展
 */
export interface IExtension {
    label: string;
    key: string;
    icon: string,
    installed?: boolean;
    count: number;
    cover:string;
    discription: string;
    version: string;
    author: string;
    readmeUrl: string;
    type:"component"|"image"|"style"|"group",
    data?:any;

}
export interface IStyle {

}
/**
 * 根据目录KEY,渲染页面，此处定义，在client中实现
 * @param a 
 * @param b 
 */
export function renderPageByCatalogKey(a:any,b:any){

}
/**
 * 状态栏组件接口
 */
export interface IStatusBarActivity{
    key?:string;
    title:string;
    sort:number;
    position:"left"|"right";
    onRender:(acticity:HTMLElement,config?:any,project?:IProject)=>void;
    onClick?:(acticity:HTMLElement,config?:any,project?:IProject,page?:IPage,componentSelects?:string[])=>void;
    onUpdate?:(acticity:HTMLElement,config?:any,project?:IProject,page?:IPage,component?:IComponent,selects?:string[],msg?:string)=>void;
}
/**
 * 浏览面板
 */
export interface IExplorer{
    index?:number;
    key:string;
    title:string;
    sort:number;
    extend:boolean;
    height?:number;
    onRender:(content:HTMLElement)=>void;
    onSearch?:(text:string)=>void;
    taps?:Array<IMenuItem>;
    /**
     * <0 继续，>0 高度限制
     */
    onResize:(height:number)=>number;
     /**
     * <0 继续，>0 高度限制
     */
    onExtend:(extend:boolean,height?:number)=>number;
    update:(updater:IExplorerUpdater)=>void;
    setHeight?:(height:number)=>void;


}
export interface IExplorerUpdater{
    type:"project"|"page"|"add"|"del"|"select"|"move";
    data:any;
}