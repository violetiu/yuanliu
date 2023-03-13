import { IStatusBarActivity } from "../../common/interfaceDefine";

const version:IStatusBarActivity={
    title:"版本",
    position:"right",
    sort:0,
    onRender(acticity, config?, project?) {
        acticity.innerHTML= require("../../../package.json").version;
        acticity.style.marginRight="0px";
        acticity.style.paddingRight="15px";
        acticity.style.background="blueviolet";
        
    }
}
export default version;