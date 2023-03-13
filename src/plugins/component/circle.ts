import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "circle", label: "circle", icon: "bi bi-circle", type: "circle",group:"base",background:1,
    style: "display:flex;align-items: center;justify-content: center;overflow: hidden;border-radius: 1000px;background:rgba(0,175,255,0.3);height:100px;width:100px;margin:5px;padding:5px;",
    onPreview: () => {
        var gird = document.createElement("div");
        return gird;
    }, onRender: () => {
        var gird = document.createElement("div");
        return {root:gird,content:gird};
    },
}
export default function load(){
    return component;
}