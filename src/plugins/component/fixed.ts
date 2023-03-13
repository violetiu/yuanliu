import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "fixed", label: "fixed", icon: "bi bi-layout-wtf", 
    type: "fixed",group:"layout",drop:"component"
    ,style: "position:relative;flex:1;background:transparent;min-height:40px;margin:5px;padding:5px;border-radius:5px;",
    onPreview: () => {
        var gird = document.createElement("div");
        return gird;
    }, onRender: () => {
        var gird = document.createElement("div");
        return {root:gird,content:gird};
    },
    onChild:(parent,component,index,root,content,)=>{
       root.style.position="absolute";
      
    }
}
export default function load(){
    return component;
}