import { ipcRendererSend } from "../../preload";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const blue:IStatusBarActivity={
    title:"蓝图",
    position:"left",
    sort:5,
    onRender(acticity, config?, project?) {
    
    },
    onUpdate(acticity, config?, project?, page?, component?, selects?) {
        acticity.innerHTML="";
        if(page!=undefined&&page.blues!=undefined&&page.blues.length>0){
            var i=document.createElement("i");
            i.className="bi bi-signpost-split";
            acticity.appendChild(i);
            i.style.paddingRight="4px";
            acticity.innerHTML+=""+page.blues.length;
        }   
    },
}
export default blue;