import { reRenderPage } from "../../render/workbench";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const store:IStatusBarActivity={
    title:"隐藏内容可见",
    position:"right",
    sort:0,
    onRender(acticity, config?, project?) {
       
        var i=document.createElement("i");
    
        acticity.appendChild(i);

        if (config == undefined) {
            i.className= "bi bi-eye";
        }else
        if (config.eye == undefined) {
            config.eye = false;

        }


        if (config!=undefined&& config.eye) {
            i.className= "bi bi-eye-slash";
        } else {
            i.className= "bi bi-eye";
        }
    },
    onClick(acticity, config?, project?, page?, componentSelects?) {
        acticity.innerHTML="";
        var i=document.createElement("i");
    
        acticity.appendChild(i);
        if (config == undefined) {
            i.className= "bi bi-eye";
        }else
        if (config.eye == undefined) {
            config.eye = false;

        }
        config.eye = !config.eye;
        if (config!=undefined&&config.eye) {
            i.className= "bi bi-eye-slash";
        } else {
            i.className= "bi bi-eye";
        }
        reRenderPage();

       
    }
}
export default store;