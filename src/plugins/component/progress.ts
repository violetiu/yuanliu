import { animation_width } from "../../common/animation";
import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "progress", label: "prog.", icon: "bi bi-align-start", type: "progress", group: "base",

    styles: {
        root: "border-radius: 5px;background: rgba(157, 157, 157, 0.2);height:20px;flex:1;min-width:100px;position:relative;",
        bar:"box-shadow: 2px 1px 1px #999;justify-content: right;display: flex;align-items: center;padding-right: 4px;border-radius:5px;text-align: right;font-size:14px;color:#fff;height:inherit;width:100px;background:linear-gradient(to right,rgba(0,0,0,0),var(--theme-color));"
    },
    onPreview: (comment) => {
        var div = document.createElement("div");
      
        var bar = document.createElement("div");
        bar.style.cssText = comment.styles.bar;
        bar.setAttribute("data-styles", "bar");
       
        div.appendChild(bar);
        setTimeout(() => {
            var v=parseFloat(comment.property.default.context);
            var m=parseFloat(comment.property.max.context);
            var n=parseFloat(comment.property.min.context);
            var s=(v-n)/(m-n);
            var l=s*div.clientWidth;
            bar.style.width =l+ "px";
            
        }, 10);

        return div;
    }, onRender: (comment, element) => {
        var div:any;
        if (element != undefined) div = element; else div = document.createElement("div");
        div.innerHTML="";
        var bar = document.createElement("div");
        bar.style.cssText = comment.styles.bar;
        bar.setAttribute("data-styles", "bar");
        if(comment.property.unit!=undefined){
            bar.innerHTML=comment.property.default.context+comment.property.unit.context+" ";
        }else
       
            bar.innerHTML=comment.property.default.context+" ";
        setTimeout(() => {
            var v=parseFloat(comment.property.default.context);
            var m=parseFloat(comment.property.max.context);
            var n=parseFloat(comment.property.min.context);
            var s=(v-n)/(m-n);
            var l=s*div.clientWidth;

            bar.style.width =l+ "px";

        
            div.appendChild(bar);
         
        }, 500);
        return { root: div, content: div };
    },
    property:{
        min:{label: "最小值", type: "number", context: "0"},
        max:{label: "最大值", type: "number", context: "100"},
        default:{label: "默认值", type: "number", context: "50"},
        unit:{label: "单位", type: "string", context: "%"}
    },blue:{
        event:{change:{label:"改变",on:(comp:IComponent,action:(args:any)=>void)=>{

        }}},
        property:{
            value:{
                label:"值",get:(comp:IComponent, self:IBlueProperty)=>{
              
                    return comp.property.default.context;
                },set:(comp:IComponent, self:IBlueProperty,args:any)=>{
                    comp.property.default.context=args;
                }
            }

        }
    }
}
export default function load() {
    return component;
}