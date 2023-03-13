import { getCurPage, reRenderPage } from "../../render/workbench";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const store:IStatusBarActivity={
    title:"清空页面内容",
    position:"right",
    sort:0,
    onRender(acticity, config?, project?) {
       
     

    },
    onUpdate(acticity, config?, project?, page?, component?, selects?, msg?) {
        if(page!=undefined){
            acticity.innerHTML="";
            var i=document.createElement("i");
    
            acticity.appendChild(i);
            i.className= "bi bi-x-circle";
        }
    },
    onClick(acticity, config?, project?, page?, componentSelects?) {
        if(page!=undefined){
            page.children=[];
            page.blues=[];
            page.blueLinks=[];
            reRenderPage();
        }
      
    
    }
}
export default store;