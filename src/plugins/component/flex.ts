import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "flex", label: "flex", icon: "bi bi-distribute-horizontal", type: "flex",group:"layout",

    style: "flex:1;height:10px;",

    onPreview: () => {
        var row = document.createElement("div");
        return row;
    }, onRender: () => {
        var row = document.createElement("div");


        return {root:row,content:row};
    },
}
export default function load(){
    return component;
}