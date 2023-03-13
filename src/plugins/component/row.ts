import { IComponent } from "../../common/interfaceDefine"

const   component:IComponent={
    isTemplate: true, key: "row", label: "row", icon: "bi bi-layout-three-columns", type: "row",group:"layout",
    drop:"component",
    style: "display:flex;background:transparent;min-height:34px;padding:5px;border-radius:5px;align-items: center;",
    onPreview: () => {
        var row = document.createElement("div");
        return row; 
    }, onRender: (component, element) => {
        var row:HTMLElement=null;
        if(element!=undefined){
            row=element;
            row.innerHTML="";
        }else
            row = document.createElement("div");


        return {root:row,content:row};
    },
}
export default function load(){
    return component;
}