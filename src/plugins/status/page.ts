import { IStatusBarActivity } from "../../common/interfaceDefine";

const pagea:IStatusBarActivity={
    title:"页面基本信息",
    position:"left",
    sort:2,
    onRender(acticity, config?, project?) {
    
    },
    onUpdate(acticity, config?, project?, page?, component?, selects?) {
        acticity.innerHTML="";
        if(page!=undefined&&page.width!=undefined){
            var i=document.createElement("i");
            i.className="bi bi-file-earmark";
            acticity.appendChild(i);
            i.style.paddingRight="4px";
            acticity.innerHTML+=""+page.width+" × "+page.height;
        }   
    },
}
export default pagea;