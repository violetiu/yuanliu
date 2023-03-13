import { openExpand } from "../../render/workspace";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const extend:IStatusBarActivity={
    title:"扩展",
    position:"right",
    sort:0,
    onRender(acticity, config?, project?) {
    


    },
    onUpdate(acticity, config?, project?, page?, component?, selects?, msg?) {
        if(page!=undefined){
         
            acticity.innerHTML="";
            var i=document.createElement("i");
            i.className="bi bi-layout-sidebar-reverse";
            acticity.appendChild(i);
        }
    },
    onClick(acticity, config?, project?, page?, componentSelects?) {

        var expand = document.getElementById("project_expand");
        if(expand.style.display == "block"){
            expand.style.display = "none";
        }else{
            openExpand();
        }
      
      
    }
}
export default extend;