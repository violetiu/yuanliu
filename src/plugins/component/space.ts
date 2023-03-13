import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "space", label: "space", icon: "bi bi-view-list", rotate:true,type: "space", group:"base",
    style: "width:10px;height:10px;",
    onPreview: () => {
        var space = document.createElement("div");



        return space;
    }, onRender: (component, element) => {
        var space: any;
        if (element != undefined)
            space = element;
        else
            space = document.createElement("div");



            return {root:space,content:space};
    }, property: [

    ]
}
export default function load(){
    return component;
}