import { ipcRendererSend } from "../../preload";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const push:IStatusBarActivity={
    title:"提交",
    position:"left",
    sort:6,
    onRender(acticity, config?, project?) {
        if(project!=undefined&& project.type=="git"){
            var i=document.createElement("i");
            i.className="bi bi-cloud-upload";
            acticity.appendChild(i);
        }else{
            acticity.remove();
        }

    

    },
    onClick(acticity, config?, project?, page?, componentSelects?) {
        ipcRendererSend("push");
    }
}
export default push;