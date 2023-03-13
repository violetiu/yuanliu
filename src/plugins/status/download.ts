import { ipcRendererSend } from "../../preload";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const download:IStatusBarActivity={
    title:"更新",
    position:"left",
    sort:7,
    onRender(acticity, config?, project?) {
       
     
        if(project!=undefined&& project.type=="git"){
            var i=document.createElement("i");
            i.className="bi bi-cloud-download";
            acticity.appendChild(i);
        }else{
            acticity.remove();
        }
 

    },
    onClick(acticity, config?, project?, page?, componentSelects?) {
        ipcRendererSend("pull");
    }
}
export default download;