import { updateComponent } from "../../common/components";
import { IBlueProperty, IComponent } from "../../common/interfaceDefine";

const component: IComponent = {
    isTemplate: true, key: "layers", label: "layers", icon: "bi bi-layers", type: "layers", group: "container",
    drop: "component",
    style: "flex:1;background-color:transparent;min-height:50px;margin:5px;padding:5px;;border-radius:5px;",
    onPreview: () => {
        var gird = document.createElement("div");
        return gird;
    }, onRender: (comment, element, content, type) => {
        console.log("render Layer ");
        var gird;
        if (element != undefined) {
            gird = element;
            gird.innerHTML = "";
        } else {
            gird = document.createElement("div")
           
        }
 
        if (comment.children != undefined && comment.children.length > 0) {
            var edges: {
                icon: string;
                label: string;
                onclick: (component: IComponent, item: any) => void;
            }[] = [{
                icon: "bi bi-view-stacked",
                label: "-2",
                onclick: (cmpt: IComponent, item: any) => {
                    //var index=parseInt(item.label);
                    comment.property.layer.context = item.label;
                }
            }, {
                icon: "bi bi-layers-half",
                label: "-1",
                onclick: (cmpt: IComponent, item: any) => {
                    //var index=parseInt(item.label);
                    comment.property.layer.context = item.label;
                }
            }];
            for (var i = 0; i < comment.children.length; i++) {
                var edge = {
                    icon: "bi bi-pencil-square",
                    label: i + "",
                    onclick: (cmpt: IComponent, item: any) => {
                        //var index=parseInt(item.label);
                        comment.property.layer.context = item.label;
                    }
                };
                edges.push(edge);
            }
            comment.edge = edges;
        }
        return { root: gird, content: gird };
    }, property: {
        layer: { label: "编辑层", type: "number", context: "-2" }
    }, edge: [],
    blue: {
        property: {
            layer: {
                label: "显示层", get: (comp: IComponent, self: IBlueProperty) => {

                    return comp.property.layer;
                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                    comp.property.layer = args;
                    updateComponent(comp);
                }
            }
        },
        properties: (comp: IComponent) => {
            var list: IBlueProperty[] = [];
            for (var i = 0; i < comp.children.length; i++) {
                var cp = comp.children[i];
                var p: IBlueProperty = {
                    key: "p_" + i,
                    label: (i) + "", get: (comp: IComponent, self: IBlueProperty) => {
                        return comp.property.layer.context;
                    }, set: (comp: IComponent, self: IBlueProperty, args: any) => {
                        comp.property.layer.context = self.label;
                        console.log("设置layer层级", self.label);
                        updateComponent(comp);
                    }
                };
                list.push(p);
            }
            return list;
        }

    },
    onChild:(parent,component,index,root,content,)=>{
        var layer = parseInt(parent.property.layer.context);
        if (layer == -2) {
            //平铺
            root.style.position = "relative";
            root.style.top = "0px";
            root.style.right = "0px";
            root.style.left = "0px";
            root.style.bottom="0px";

        } else if (layer == -1) {
            //层级
            if (index == 0) {
                root.style.position = "relative";
                root.style.top = "0px";
                root.style.right = "0px";
                root.style.left = "0px";
                root.style.bottom="0px";
                
            } else {
                root.style.position = "absolute";
                root.style.top = "5px";
                root.style.right = "5px";
                root.style.left = "5px";
                root.style.bottom="5px";
            }

        } else {
            //展示其中的一个
            if (index == layer) {
                //root.style.display="block";
                root.style.position = "relative";
            } else {
                root.style.display = "none";
            }
        }

    }
}
export default function load() {
    return component;
}