import { IStatusBarActivity } from "../../common/interfaceDefine";

const version:IStatusBarActivity={
    title:"组件基本信息",
    position:"right",
    sort:0,
    onRender(acticity, config?, project?) {
    
    },
    onUpdate(acticity, config?, project?, page?, component?, selects?) {
        acticity.innerHTML="";
        if(component!=undefined){
            var i=document.createElement("i");
            i.className=component.icon;
            acticity.appendChild(i);
            i.style.paddingRight="4px";
            if(component.children!=undefined&&component.children.length>0){
                acticity.innerHTML+=""+component.label+" children["+component.children.length+"]";
            }else{
                acticity.innerHTML+=""+component.label;
            }
        
        }   
    },
}
export default version;