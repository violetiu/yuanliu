import { getProject } from "../../render/workspace";
import { IComponent } from "../../common/interfaceDefine"
import { ipcRendererSend } from "../../preload";
import { renderColorPicker } from "../../dialog/picker";
import * as imageTool from "../../common/imageTool";
import { getCurPageKey } from "../../render/workbench";
 const  component:IComponent={
    isTemplate: true, key: "images", label: "images", icon: "bi bi-images", 
    type: "images",group:"base"
    ,styles:{
        root:"overflow:hidden;flex:1;background:transparent;height:300px;margin:5px;border-radius:5px;",
        img:"width:100%;position:relative;top:-50%;",
        tap:"height:10px;width:20px;cursor:pointer;background:rgba(255,255,255,0.5);border-radius:10px;margin:5px;",
    },
    onPreview: () => {
        var grid = document.createElement("div");
        return grid;
    }, onRender: (component, element, content,type) => {
        var grid: any;
        if (element != undefined) {
            grid = element;
            grid.innerHTML = "";
        }
        else {
            grid = document.createElement("div");
            if (content != undefined)
                content.appendChild(grid);
        }
        if(type!="product"){
            grid.ondblclick = () => {
                ipcRendererSend("insertImage",getCurPageKey());
            }
        }
    
        var controls = document.createElement("div");
        if(component.option!=undefined&&component.option.length>0){
            var options=component.option.split("\n");
            for(var i=0;i<options.length;i++){
                if(options[i].length==0){
                    continue;
                }
                var img = document.createElement("img");
                if(options[0].startsWith("http")){
                    img.src =options[i];
                }else{
                    if(type!=undefined&&type=="product"){
                        img.src = "./images/"+options[i];
                    }else{
                        img.src =getProject().work+ "/images/"+options[i];
                    }
                 
                }
                if(grid.children.length==0){
                    img.style.display="block";
                 
                }else{
                    img.style.display="none";
                   
                }
                img.style.cssText=component.styles["img"];
                img.style.top=component.property.offsettop.context+"%";

                grid.appendChild(img);
                var tap=document.createElement("div");
                tap.setAttribute("data-index",controls.children.length.toString());
                tap.style.cssText=component.styles["tap"];
                if(grid.children.length==1){
                 
                    tap.style.opacity="1";
                }else{
 
                    tap.style.opacity="0.5";
                }



                controls.appendChild(tap);
                tap.onclick=(e:any)=>{
                    e.stopPropagation();
                    var index=parseInt(e.target.getAttribute("data-index"));
                    for(var j=0;j<controls.children.length;j++){
                        var image=grid.children[j];
                        var t:any=controls.children[j];
                        if(j==index){
                            image.style.display="block";
                            //透明度
                           t.style.opacity="1";
                        }else{
                            image.style.display="none";
                           t.style.opacity="0.5";
                        }
                

                    }

                }
            }
        
            
        }
       
        controls.style.display = "flex";
       
        controls.style.justifyContent = "center";
        controls.style.alignItems = "center";
        controls.style.height = "30px";
        controls.style.background = "rgba(0,0,0,0.1)";
        controls.style.borderRadius = "5px";
        controls.style.position = "absolute";
        controls.style.bottom = "5px";
        controls.style.left = "5px";
        controls.style.right = "5px";
        controls.style.margin = "0px";
        controls.style.padding = "0px";
        controls.style.zIndex = "100";
        controls.style.cssText+="backdrop-filter: blur(5px);";
        grid.appendChild(controls);

        if(controls.children.length<2){
            controls.style.display="none";
        }

        return {root:grid,content:grid};
    },
    property:{
        offsettop:{
            label:"顶部偏移比",type:"number",context:"0"
        }
    },
    option:"",
    edge:[
        {
            icon: "bi bi-crop", label: "裁剪", onclick: (cmpt: IComponent,item:any) => {

            }
        },
        {
            icon: "bi bi-eraser", label: "背景透明", onclick: (cmpt: IComponent,item:any) => {
              console.log("背景透明");
                var cmptDiv=document.getElementById(cmpt.key);
                renderColorPicker(cmptDiv, "#999", (color) => {
                    console.log("背景透明--",color);
                    var src=getProject().work+ "/images/"+cmpt.option.split("\n")[0];
                    imageTool.flatten(src,color,(url)=>{
                        // console.log(data);
                        var img=cmptDiv.getElementsByTagName("img")[0];
                        img.src=getProject().work+ "/images/"+url;
                        cmpt.option= cmpt.option.replace(cmpt.option.split("\n")[0],url);
                    });
                
                });
            }
        },
        
        {
            icon: "bi bi-palette", label: "着色", onclick: (cmpt: IComponent,item:any) => {
              console.log("重设颜色");
                var cmptDiv=document.getElementById(cmpt.key);
                renderColorPicker(cmptDiv, "#999", (color) => {
                    console.log("重设颜色--",color);
                    var src=getProject().work+ "/images/"+cmpt.option.split("\n")[0];
                    imageTool.tint(src,color,(url)=>{
                        // console.log(data);
                        var img=cmptDiv.getElementsByTagName("img")[0];
                        img.src=getProject().work+ "/images/"+url;
                        cmpt.option= cmpt.option.replace(cmpt.option.split("\n")[0],url);
                    });
                
                });
            }
        },{
            icon: "bi bi-mask", label: "灰度", onclick: (cmpt: IComponent,item:any) => {
              console.log("灰度");
              var cmptDiv=document.getElementById(cmpt.key);
              var src=getProject().work+ "/images/"+cmpt.option.split("\n")[0];
              imageTool.grayscale(src,(url)=>{
                  // console.log(data);
                  var img=cmptDiv.getElementsByTagName("img")[0];
                  img.src=getProject().work+ "/images/"+url;
                  cmpt.option=  cmpt.option.replace(cmpt.option.split("\n")[0],url);
              });
            }
        },{
            icon: "bi bi-droplet", label: "模糊", onclick: (cmpt: IComponent,item:any) => {
             
                var cmptDiv=document.getElementById(cmpt.key);
                var src=getProject().work+ "/images/"+cmpt.option.split("\n")[0];
                imageTool.blur(src,(url)=>{
                    // console.log(data);
                    var img=cmptDiv.getElementsByTagName("img")[0];
                    img.src=getProject().work+ "/images/"+url;
                    cmpt.option=  cmpt.option.replace(cmpt.option.split("\n")[0],url);
                });
            }
        },{
            icon: "bi bi-triangle-half", label: "锐化", onclick: (cmpt: IComponent,item:any) => {
             
                var cmptDiv=document.getElementById(cmpt.key);
                var src=getProject().work+ "/images/"+cmpt.option.split("\n")[0];
                imageTool.sharpen(src,(url)=>{
                    // console.log(data);
                    var img=cmptDiv.getElementsByTagName("img")[0];
                    img.src=getProject().work+ "/images/"+url;
                    cmpt.option=   cmpt.option.replace(cmpt.option.split("\n")[0],url);
                });
            }
        },  {
            icon: "bi bi-arrow-counterclockwise", label: "旋转", onclick: (cmpt: IComponent,item:any) => {
                var cmptDiv=document.getElementById(cmpt.key);
                var src=getProject().work+ "/images/"+cmpt.option.split("\n")[0];
                imageTool.rotate(src,(url)=>{
                    // console.log(data);
                    var img=cmptDiv.getElementsByTagName("img")[0];
                    img.src=getProject().work+ "/images/"+url;
                    cmpt.option=   cmpt.option.replace(cmpt.option.split("\n")[0],url);
                });
            }
        }
    ]
}
export default function load(){
    return component;
}