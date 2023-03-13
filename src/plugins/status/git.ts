import { ipcRendererSend } from "../../preload";
import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const push:IStatusBarActivity={
    title:"Git",
    position:"left",
    sort:5,
    onRender(acticity, config?, project?) {
       
  

        if(project!=undefined&& project.type=="git"){
            var i=document.createElement("i");
            i.className="bi bi-git";
            acticity.appendChild(i);
        }else{
            acticity.remove();
        }

      

    }
}
export default push;