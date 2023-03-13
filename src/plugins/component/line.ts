import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "line", label: "line", icon: "bi bi-dash-lg", 
    type: "line"
    ,style: "flex:1;background:transparent;min-height:1px;margin:5px;border-radius:5px;height:1px;background:var(--theme-color);min-height:1px;min-width:100px;",
    onPreview: () => {
        var line = document.createElement("div");
        return line;
    }, onRender: (component:IComponent,element:HTMLElement) => {
        var line:HTMLElement= null;
        if(element!=undefined){
            line=element;
            line.innerHTML="";
        }else
            line = document.createElement("div");

        
    
        return {root:line,content:line};
    }
}
export default function load(){
    return component;
}