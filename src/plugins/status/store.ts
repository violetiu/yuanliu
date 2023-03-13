import { IStatusBarActivity } from "../../common/interfaceDefine";
import { activePropertyPanel } from "../../render/propertypanel";

const store:IStatusBarActivity={
    title:"素材",
    position:"right",
    sort:0,
    onRender(acticity, config?, project?) {
       
        var i=document.createElement("i");
        i.className="bi bi-bag-plus";
        acticity.appendChild(i);

    },
    onClick(acticity, config?, project?, page?, componentSelects?) {
        activePropertyPanel("store");
    }
}
export default store;