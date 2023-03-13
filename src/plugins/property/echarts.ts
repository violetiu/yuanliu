/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

右侧默认 echarts工具
***************************************************************************** */

import { updateComponent } from "../../common/components";
import { IComponent, IPanel } from "../../common/interfaceDefine";
import * as forms from "../../render/forms";
var titlePosition:forms.FormIcons;
var titleText:forms.FormText;
var legendPosition:forms.FormIcons;
var gridTop:forms.FormText;
var gridLeft:forms.FormText;
var gridRight:forms.FormText;
var gridBottom:forms.FormText;
const  panel:IPanel={
    key:"echarts",name:"图表",hidden:true,sort:1,
    render:(content:HTMLElement)=>{
        
        var   panel = document.createElement("div");
        panel.className = "echartsPanel";
        panel.id = "echartsPanel";
        content.appendChild(panel);
    
        var context=document.createElement("div");
        context.style.padding="0px 10px 0px 10px";
        panel.appendChild(context);
    
    
        //["选择","钢笔","控制","图片"]
        titlePosition=new forms.FormIcons("标题位置",["bi bi-eye-slash","bi bi-align-top","bi bi-align-bottom"]);
        titlePosition.render(context);

        titleText=new forms.FormText("标题文本");
        titleText.render(context);

        legendPosition=new forms.FormIcons("图例位置",["bi bi-eye-slash","bi bi-align-top","bi bi-align-bottom"]);
        legendPosition.render(context);


        var row1=document.createElement("div");
        context.appendChild(row1);

        var gt=forms.createDivRow(row1,true);
        gridTop=new forms.FormText("上边距");
        gridTop.render(gt);
        var gr=forms.createDivRow(row1);
        gridRight=new forms.FormText("右边距");
        gridRight.render(gr);
        var row2=document.createElement("div");
        context.appendChild(row2);
        var gb=forms.createDivRow(row2,true);
        gridBottom=new forms.FormText("下边距");
        gridBottom.render(gb);
        var gl=forms.createDivRow(row2);
        gridLeft=new forms.FormText("左边距");
        gridLeft.render(gl);




    }, 
    update:(args:any)=>{
        var component:IComponent=args;
        var optionText=component.option;
        //
        var option:any;
        eval(optionText);
        if(option!=undefined){
            var titleShow:boolean=true;
            
            if(option.title!=undefined){
                if(option.title.show!=undefined&&option.title.show==false){
                     titleShow=false;
                }
            }
            var titlePositionIndex=0;
            if(titleShow){
                titlePositionIndex=1;
            }
            titlePosition.update(titlePositionIndex,(index)=>{
                if(index==0){
                    option.title.show=false;
                }else{
                    option.title.show=true;
                }

                update(component,option);
            })

            titleText.update(option.title.text,(val)=>{
                option.title.text=val;
                update(component,option);
            })

            


            var legendShow:boolean=true;
            
            if(option.legend!=undefined){
                if(option.legend.show!=undefined&&option.legend.show==false){
                    legendShow=false;
                }
            }
            var legendPositionIndex=0;
            if(legendShow){
                legendPositionIndex=1;
            }
           legendPosition.update(legendPositionIndex,(index)=>{
                if(index==0){
                    option.legend.show=false;
                }else{
                    option.legend.show=true;
                }

                update(component,option);
            })

            gridTop.update(option.grid.top,(v)=>{
                option.grid.top=v;
                update(component,option);
            })

            gridRight.update(option.grid.right,(v)=>{
                option.grid.top=v;
                update(component,option);
            })

            gridLeft.update(option.grid.left,(v)=>{
                option.grid.top=v;
                update(component,option);
            })

            gridBottom.update(option.grid.bottom,(v)=>{
                option.grid.top=v;
                update(component,option);
            })


            

        }

        

      

    }

}
function update(component:IComponent,option:any){
    component.option="option="+JSON.stringify(option,null,2);
    updateComponent(component); 
}
export default function load(){
    return panel;
}
