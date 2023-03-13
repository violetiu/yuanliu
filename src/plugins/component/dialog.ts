import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "dialog", label: "dialog", icon: "bi bi-front", type: "dialog", drop:"component",group:"container",
        style: "",
        background:1,
        styles:{
            root:" background:rgba(157,157,175,0.5);min-height:400px;min-width:500px;position:relative;border-radius:5px;padding:5px;",
         
        },
        isExpand:true,
        onPreview: (component) => {
       

            var main=document.createElement("div");
            main.style.cssText=component.styles.main;
           
            
        
            return main;
        }, onRender: (component, element,content,type) => {
           

            var dialog: any;
            if (element != undefined)
               {
                dialog = element;
                dialog.innerHTML="";
               }
            else
                dialog = document.createElement("div");
               
            if(type=="product"&&component.property.focus!=undefined){
                if(component.property.focus.context=="true"){
                    dialog.parentElement.onclick=(e:any)=>{
                        e.stopPropagation();
                        dialog.parentElement.remove();
                     
                    }
                    dialog.onclick=(e:any)=>{
                        e.stopPropagation();
                       
                     
                    }
                }
                
            }
      
            var gridBg=document.createElement("div");
            gridBg.className="component_bg";
         
            var gridContent=document.createElement("div");
            gridContent.className = "component_body";
            dialog.appendChild(gridBg);
            dialog.appendChild(gridContent);
            

          
            return {root:dialog,content:gridContent};
        }, property: {
            focus:{ label: "失去焦点-关闭", type: "bool", context: "false", },
        
        }
        ,
        blue:{
          
        }
}
export default function load(){
    return component;
}