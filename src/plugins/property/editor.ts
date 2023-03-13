/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

右侧默认 编辑文本
***************************************************************************** */

import { IComponent, IPanel } from "../../common/interfaceDefine";
import { FormColor, FormComponent, FormIcon, FormIcons, FormNumber, FormNumbers, FormSelect, FormSolider, FormText } from "../../render/forms";
import * as form from "../../render/form";
import * as forms from "../../render/forms";
import { updateComponent } from "../../common/components";
import { getComponentStyle } from "../../render/propertypanel";
var formInfo:HTMLDivElement;

var formFontSize: FormNumber;
var formFontLineHeight: FormNumber;
var formFontAlign: FormIcons;
var formFontBolder: FormIcon;
var formFontLine: FormIcon;
var formFontItalic: FormIcon;

var formColor: FormColor;
var formTextShadow: FormNumbers;
var formTextShadowColor: FormColor;
const panel: IPanel = {
    key: "editor", name: "编辑文本", hidden: true, sort: 1,
    render: (content: HTMLElement) => {

        var panel = document.createElement("div");
        panel.className = "editorPanel";
        panel.id = "editorPanel";
        content.appendChild(panel);

        var body = document.createElement("div");
        body.style.padding = "0px 10px 0px 10px";
        panel.appendChild(body);

        formInfo=document.createElement("div");
        formInfo.style.padding="10px";
        body.appendChild(formInfo);

 

        var row1 = document.createElement("div");
        body.appendChild(row1);

        //加粗
        var boldDiv = form.createDivRow(row1);
        formFontBolder = new FormIcon("", "bi bi-type-bold");
        formFontBolder.render(boldDiv);
        //斜体
        var italicDiv = form.createDivRow(row1);
        formFontItalic = new FormIcon("", "bi bi-type-italic");
        formFontItalic.render(italicDiv);
        //下划线
        var underlineDiv = form.createDivRow(row1);
        formFontLine = new FormIcon("", "bi bi-type-underline");
        formFontLine.render(underlineDiv);

        //对齐
        var alignDiv = form.createDivRow(row1);
        alignDiv.style.flex = "4";
        formFontAlign = new FormIcons("", ["bi bi-text-left", "bi bi-text-center", "bi bi-text-right"]);
        formFontAlign.render(alignDiv);

        //
        var row = document.createElement("div");
        body.appendChild(row);
        var widthDiv = form.createDivRow(row, true);

        formFontSize = new FormNumber("大小");
        formFontSize.render(widthDiv);

        var heightDiv = form.createDivRow(row, false);
        formFontLineHeight = new FormNumber("行高");
        formFontLineHeight.render(heightDiv);

        //color
        formColor = new FormColor("颜色");
        formColor.render(body);

      
        //shadow
        var row3 = document.createElement("div");
        body.appendChild(row3);
        var x = form.createDivRow(row3);
        formTextShadow = new FormNumbers("阴影", 3);
        formTextShadow.render(x);
        var c = form.createDivRow(row3);
        formTextShadowColor = new FormColor("");
        formTextShadowColor.render(c);




    },
    update: (args: any) => {
        var component: IComponent = args;
        var selectText= window.getSelection().toString();
        if(selectText.length==0){
            return;
        }
        console.log(window.getSelection());
        formInfo.innerHTML="";

        formInfo.innerHTML+=selectText+"<br/>";

      
        var input:any=document.getElementById(component.key).getElementsByClassName("editor").item(0);
        
       // var context=input.innerText;


        // var select=window.getSelection();
        // var anchorNode=select.anchorNode;
        // var anchorOffset=select.anchorOffset;
        // console.log(anchorOffset);
        // var focusOffset=select.focusOffset;
        

        
        var textStyle="";


        formFontSize.update(getComponentStyle(component, "font-size", "px"), (value) => {
            textStyle=setComponentStyle(textStyle, "font-size", value + "px");
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });
        formColor.update("", (value) => {
            textStyle=setComponentStyle(textStyle, "color", value);
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });

        var align = 0; var alignText = getComponentStyle(component, "line-height", "");
        if (alignText == "left") {
            align = 0;
        } else if (alignText == "center") {
            align = 1;
        } else if (alignText == "right") {
            align = 2;
        }
        formFontAlign.update(align, (value) => {
            textStyle=setComponentStyle(textStyle, "text-align", ["left", "center", "right"][value]);
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });

        formFontBolder.update(getComponentStyle(component, "font-weight") == "bolder", (value) => {

            textStyle=setComponentStyle(textStyle,  "font-weight", value ? "bolder" : "normal");
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });
        formFontItalic.update(getComponentStyle(component, "font-style") == "italic", (value) => {

            textStyle=setComponentStyle(textStyle,"font-style", value ? "italic" : "normal");
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });
        formFontLine.update(getComponentStyle(component, "text-decoration") == "underline", (value) => {

            textStyle=setComponentStyle(textStyle,  "text-decoration", value ? "underline" : "none");
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });
            //text-shadow
    var textshadow = [0, 0, 0];
    var textshadowColor = "rgba(0,0,0,0.5)";
    var textshadowStyle = getComponentStyle(component, "text-shadow");
    if (textshadowStyle != undefined && textshadowStyle.length > 0 && textshadowStyle != "none") {
        var list = textshadowStyle.split("px ");
        textshadow[0] = parseInt(list[0]);
        textshadow[1] = parseInt(list[1]);
        textshadow[2] = parseInt(list[2]);
        textshadowColor = list[3];
    }
        formTextShadow.update(textshadow, (value) => {
            textshadow = value;
           
            textStyle=setComponentStyle(textStyle,   "text-shadow", textshadow[0] + "px " + textshadow[1] + "px " + textshadow[2] + "px " + textshadowColor);
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });
        formTextShadowColor.update(textshadowColor, (value) => {
            textshadowColor = value;

            textStyle=setComponentStyle(textStyle,   "text-shadow", textshadow[0] + "px " + textshadow[1] + "px " + textshadow[2] + "px " + textshadowColor);
            component.property.text.context=  component.property.text.context.replace(selectText,"<font style='"+textStyle+"'>"+selectText+"</font>") ;
            input.innerHTML=  component.property.text.context;
            updateComponent(component);
        });
    }

}

export default function load() {
    return panel;
}

function setComponentStyle(textStyle: string, property: string, value: string) {

    var style = textStyle+"";
    if (style != undefined) {
        style =" "+style.replace(/;/g, "; ");
        var rep = RegExp("[^-]" + property + ":[^;]+;");
        style = style.replace(rep, "")
        ///(;|^)background:[^;]+;/g
        if (!style.trim().endsWith(";")) {
            style += ";";
        }
        style += property + ":" + value + ";";
        return style.replace(/; /g, ";");
    } 

}
