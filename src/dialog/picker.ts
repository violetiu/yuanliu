/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

选择 颜色等
***************************************************************************** */
import { ipcRenderer } from "electron";
import { getProject } from "../render/workspace";
import { ipcRendererSend } from "../preload";

function toString(selectColor: { r: number, g: number, b: number, a: number }) {
    return "rgba(" + selectColor.r + "," + selectColor.g + "," + selectColor.b + "," + selectColor.a + ")";
}
var recentColors:string[]=["#09f","#9f0","#f09","#f90","#90f","#0f9","#99f","#f99"];
var selectColor = { r: 255, g: 255, b: 255, a: 1 };
export function renderColorPicker(ele: HTMLElement, color: string, onPicker: (color: string) => void) {

    console.log("renderColorPicker",color);
    isCapture=false;
    var pickerTop= getDivClientTop(ele) + 20;
    var pickerLeft =ele.getBoundingClientRect().left - 200;
    var baseColor = { r: 255, g: 0, b: 0 };

    if(pickerTop>window.innerHeight-400){
        pickerTop=window.innerHeight-400;
    }

    var pickerFocus = document.createElement("div");
    pickerFocus.className = "picker_focus";
    document.getElementById("app").appendChild(pickerFocus);
    pickerFocus.onmousedown = () => {
        pickerFocus.remove();
        pushRecent(toString(selectColor));
        onPicker(toString(selectColor));
    }
    var picker = document.createElement("div");
    pickerFocus.appendChild(picker);
    picker.onmousedown = (e) => {
        e.stopPropagation();
    }
    //
    picker.className = "picker";
    picker.style.overflow="hidden";
    picker.id = "picker";
    picker.style.top = pickerTop + "px";
    picker.style.left = pickerLeft + "px";

    var title = document.createElement("div");
    title.id = "picker_title";
    title.className = "picker_title";

    title.style.background=color;
    picker.appendChild(title);

    // var titleIcon = document.createElement("i");
    // titleIcon.className = "bi bi-palette";
    // titleIcon.style.padding = "0px 10px";
    // title.appendChild(titleIcon);

    var titleText = document.createElement("div");
    titleText.innerHTML = color;
    titleText.id = "picker_title_text";
    titleText.style.color = "white";
    titleText.style.overflow="hidden";
    titleText.style.whiteSpace="nowrap";
    titleText.style.textIndent="2em";
    titleText.style.flex = "1";

    title.appendChild(titleText);

    var themeIcon = document.createElement("i");
    themeIcon.className = "bi bi-palette";
    themeIcon.style.padding = "0px 10px";
    themeIcon.style.cursor="pointer";
    themeIcon.title="主题色";
    title.appendChild(themeIcon);
    themeIcon.onclick = () => {
        pickerFocus.remove();
        onPicker("var(--theme-color)");

    }


    var meterIcon = document.createElement("i");
    meterIcon.className = "bi bi-eyedropper";
    meterIcon.style.padding = "0px 10px";
    meterIcon.style.cursor="pointer";
    meterIcon.title="拾取颜色";
    title.appendChild(meterIcon);
    meterIcon.onclick = () => {
        capture();
    }

    var nullIcon = document.createElement("i");
    nullIcon.className = "bi bi-eraser";
    nullIcon.style.padding = "0px 10px";
    nullIcon.style.cursor="pointer";
    nullIcon.title="清空颜色";
    title.appendChild(nullIcon);
    nullIcon.onclick = () => {
        pickerFocus.remove();
        onPicker("auto");
    }





    var picker_content = document.createElement("div");
    picker_content.className = "picker_content";
    picker_content.id = "picker_content";
    picker.appendChild(picker_content);
    var plateWidth = 260;
    var plateHeight = 160;
    var plate = document.createElement("div");
    plate.className = "picker_plate";
    picker_content.appendChild(plate);

    var platebg = document.createElement("div");
    platebg.className = "picker_bg";
    plate.appendChild(platebg);


    var plateover = document.createElement("div");
    plateover.className = "picker_over";
    plate.appendChild(plateover);

    var plateover1 = document.createElement("div");
    plateover1.className = "picker_over1";
    plate.appendChild(plateover1);

    var plateSelctor = document.createElement("div");
    plateSelctor.className = "picker_plate_selector";
    plate.appendChild(plateSelctor);
    var plateSelctorChange = false;
    plateSelctor.onmousedown = (ed) => {

        var sx = ed.clientX;
        var sy = ed.clientY;
        var sl = plateSelctor.offsetLeft;
        var st = plateSelctor.offsetTop;
        var v = 0;
        console.log(sl, st);
        plateSelctorChange = true;

        document.onmousemove = (em) => {

            if (plateSelctorChange) {
                var x = em.clientX - sx;
                var y = em.clientY - sy;
                var l = sl + x;
                var t = st + y;
                if (l < 0) l = 0;
                if (t < 0) t = 0;
                if (l > plateWidth - 10)
                    l = plateWidth - 10;
                if (t > plateHeight - 10)
                    t = plateHeight - 10;
                plateSelctor.style.left = l + "px";
                plateSelctor.style.top = t + "px";
                var color = getColor(l, t, plateWidth - 10, plateHeight - 10, baseColor);
                selectColor.r = color.rgb.r;
                selectColor.g = color.rgb.g;
                selectColor.b = color.rgb.b;
                titleText.innerHTML = toString(selectColor);
                title.style.background = toString(selectColor);
                if (color.hsv.v > 0.5) {
                    title.style.color = "#000";
                } else {
                    title.style.color = "#fff";
                }
            }
        }
        document.onmouseup = (eu) => {
            plateSelctorChange = false;
            //  input.style.pointerEvents="all";
        }
    }

    plateover1.onclick = (e) => {
        var l = e.clientX - pickerLeft-18;
        var t= e.clientY - pickerTop-42;
        plateSelctor.style.left = l + "px";
        plateSelctor.style.top = t + "px";
        var color = getColor(l, t, plateWidth - 10, plateHeight - 10, baseColor);
        selectColor.r = color.rgb.r;
        selectColor.g = color.rgb.g;
        selectColor.b = color.rgb.b;
        titleText.innerHTML = toString(selectColor);
        title.style.background = toString(selectColor);
        if (color.hsv.v > 0.5) {
            title.style.color = "#000";
        } else {
            title.style.color = "#fff";
        }

    }
   
    var base = document.createElement("div");
    base.className = "picker_base";
    picker_content.appendChild(base);

    var baseSelctor = document.createElement("div");
    baseSelctor.className = "picker_base_selector";
    base.appendChild(baseSelctor);
    var baseSelctorChange = false;
    baseSelctor.onmousedown = (ed) => {

        var sx = ed.clientX;

        var sl = baseSelctor.offsetLeft;

        var v = 0;

        baseSelctorChange = true;

        document.onmousemove = (em) => {

            if (baseSelctorChange) {
                var x = em.clientX - sx;

                var l = sl + x;

                if (l < 0) l = 0;

                if (l > plateWidth - 10)
                    l = plateWidth - 10;
                baseSelctor.style.left = l + "px";
                var color = getBaseColor(l, plateWidth - 10);
                platebg.style.background = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                baseColor.b = color.b;
                baseColor.r = color.r;
                baseColor.g = color.g;
                selectColor.r = color.r;
                selectColor.g = color.g;
                selectColor.b = color.b;
                titleText.innerHTML = toString(selectColor);
                title.style.background = toString(selectColor);
            }

        }
        document.onmouseup = (eu) => {
            baseSelctorChange = false;

            //  input.style.pointerEvents="all";
        }

    }

    base.onclick = (e) => {
      
        var l = e.clientX - pickerLeft-base.offsetLeft-5;

   

        if (l < 0) l = 0;

        if (l > plateWidth - 10)
            l = plateWidth - 10;
        baseSelctor.style.left = l + "px";
        var color = getBaseColor(l, plateWidth - 10);
        platebg.style.background = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        baseColor.b = color.b;
        baseColor.r = color.r;
        baseColor.g = color.g;
        selectColor.r = color.r;
        selectColor.g = color.g;
        selectColor.b = color.b;
        titleText.innerHTML = toString(selectColor);
        title.style.background = toString(selectColor);
    }


    var light = document.createElement("div");
    light.className = "picker_light";
    picker_content.appendChild(light);

    var lightSelctor = document.createElement("div");
    lightSelctor.className = "picker_base_selector";
    lightSelctor.style.left = "250px";
    light.appendChild(lightSelctor);
    var lightSelctorChange = false;
    lightSelctor.onmousedown = (ed) => {

        var sx = ed.clientX;

        var sl = lightSelctor.offsetLeft;

        var v = 0;

        lightSelctorChange = true;

        document.onmousemove = (em) => {

            if (lightSelctorChange) {
                var x = em.clientX - sx;

                var l = sl + x;

                if (l < 0) l = 0;

                if (l > plateWidth - 10)
                    l = plateWidth - 10;
                lightSelctor.style.left = l + "px";
                var a = getLightColor(l, plateWidth - 10);
                selectColor.a = a/100;
                titleText.innerHTML = toString(selectColor);
                title.style.background = toString(selectColor);

            }

        }
        document.onmouseup = (eu) => {
            lightSelctorChange = false;

            //  input.style.pointerEvents="all";
        }

    }
    light.onclick = (e) => {
      
        var l = e.clientX - pickerLeft-light.offsetLeft-5;

   

        if (l < 0) l = 0;

        if (l > plateWidth - 10)
            l = plateWidth - 10;
        lightSelctor.style.left = l + "px";
        var a = getLightColor(l, plateWidth - 10);
        selectColor.a = a/100;
        titleText.innerHTML = toString(selectColor);
        title.style.background = toString(selectColor);
    }


    var recent=document.createElement("div");
    recent.className="picker_recent";
    picker_content.appendChild(recent);

 
    renderRecent();
    function renderRecent(){
        recent.innerHTML="";
        for(var i=0;i<recentColors.length;i++){
            var color=recentColors[i];
            var div=document.createElement("div");
            div.className="picker_recent_color";
            div.style.background=color;
            recent.appendChild(div);
            div.onclick=(e:any)=>{
                pickerFocus.remove();
                onPicker(e.target.style.background);
            }
        }

    }

}
var isCapture=false;
function capture(){
    ipcRenderer.removeAllListeners("_desktopCapturer");
    ipcRendererSend("desktopCapturer");
    isCapture=true;
    ipcRenderer.on('_desktopCapturer', async (event, sourceId) => {
        try {
            var md:any= navigator.mediaDevices;
          const stream = await md.getUserMedia({
            audio: false,
            video:{
                mandatory:{
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                }
            }
          })
         // handleStream(stream)
         var picker_content=document.getElementById("picker_content");
         if(picker_content!=undefined){
            var canvas=document.createElement("canvas");
            canvas.style.display="none";
            canvas.width=stream.getVideoTracks()[0].getSettings().width;
            canvas.height=stream.getVideoTracks()[0].getSettings().height;
            picker_content.appendChild(canvas);

            var video:any=document.createElement("video");
            video.width=stream.getVideoTracks()[0].getSettings().width;
            video.height=stream.getVideoTracks()[0].getSettings().height;
            video.srcObject=stream;
            video.onloadedmetadata=()=>{
                video.play();
            }
            video.ontimeupdate=()=>{
                if(video.currentTime>0){
                    var ctx=canvas.getContext("2d");
                    ctx.drawImage(video,0,0);
                    var data=canvas.toDataURL("image/png");
                    video.srcObject.getTracks()[0].stop();
                    video.srcObject=null;
                    video.remove(); 
                    stream.getTracks()[0].stop();
                    //鼠标移动的位置
                
                    window.onmousemove=(e)=>{
                        if(isCapture){
                         
                            var x=e.screenX;
                            var y=e.screenY;
                            var pd=ctx.getImageData(x,y,1,1).data;
                            var r=pd[0];
                            var g=pd[1];
                            var b=pd[2];
                            var rgb="rgb("+r+","+g+","+b+")";
                            var title= document.getElementById("picker_title");
                            if(title!=undefined){
                                title.style.background=rgb;
                            }
                            var text=document.getElementById("picker_title_text");
                            if(text!=undefined){
                                text.innerHTML=rgb;

                            }
                         
          
                            selectColor.r=r;
                            selectColor.g=g;
                            selectColor.b=b;
                            selectColor.a=1;   
                        }
                    }
                }
            }
          
         }
          
      //      stream.stop();

        } catch (e) {
         // handleError(e)
         console.log(e)
        }
      })
}

function pushRecent(color:string){
    if(recentColors.indexOf(color)>=0){
        return;
    }
    if(recentColors.length>7){
        recentColors.splice(0,1);
    }
    recentColors.push(color);
        
}
function getDivClientTop(div: HTMLElement): number {
    var top = 0;
    while (div.offsetParent) {
        top += div.offsetTop;
        div = div.offsetParent as HTMLElement;
    }
    return top;
}
function getDivClientLeft(div: HTMLElement): number {
    var left = 0;
    while (div.offsetParent) {
        left += div.offsetLeft;
        div = div.offsetParent as HTMLElement;
    }
    return left;
}
function getColor(left: number, top: number, plateWidth: number, plateHeight: number, baseColor: { r: number, g: number, b: number }) {

    var hsv = rgbToHsv(baseColor.r, baseColor.g, baseColor.b);
    var x = left * 1.0 / plateWidth;
    var y = 1 - top * 1.0 / plateHeight;
    hsv.s = x * hsv.s;
    hsv.v = y * hsv.v;



    var rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    return { rgb: rgb, hsv: hsv };


}
function getLightColor(left: number, plateWidth: number): number {
    return Math.round(left / plateWidth * 100);
}
function getBaseColor(left: number, plateWidth: number): { r: number, g: number, b: number } {
    var x = left / plateWidth;
    var s = 1.0 / 6;
    var r = 0;
    var g = 0;
    var b = 0;
    if (x <= s) {
        var v = (x - 0) / s;
        r = 255;
        g = Math.round(v * 255);
        b = 0;
    } else if (x <= s * 2) {
        var v = (x - s) / s;
        r = Math.round((1 - v) * 255);
        g = 255;
        b = 0;


    } else if (x <= s * 3) {
        var v = (x - 2 * s) / s;
        r = 0;
        g = 255;
        b = Math.round(v * 255);
    }
    else if (x <= s * 4) {
        var v = (x - 3 * s) / s;
        r = 0;
        g = Math.round((1 - v) * 255);
        b = 255;
    }
    else if (x <= s * 5) {
        var v = (x - 4 * s) / s;
        r = Math.round(v * 255);
        g = 0;
        b = 255;
    }
    else if (x <= s * 6) {
        var v = (x - 5 * s) / s;
        r = 255;
        g = 0;
        b = Math.round(v * 255);
    }


    return {
        r: r,
        g: g,
        b: b
    }


}

function rgbToHsv(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, v: v };
}
function hsvToRgb(h: number, s: number, v: number) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}


export function isDark(color:string){

    if (color == "var(--theme-color)") {

        color = getProject().themeColor;
    } else if (color == "var(--light-color)") {

        color = getProject().lightColor;
    }
   
    if(color.startsWith("#")){
        var rgb=set16ToRgb(color);
        if(rgb==undefined)
         return false;
        var RgbValue = rgb.replace("rgb(", "").replace(")", "");


        var RgbValueArry = RgbValue.split(",");

        var grayLevel = parseInt(RgbValueArry[0]) * 0.299 + parseInt(RgbValueArry[1]) * 0.587 +parseInt( RgbValueArry[2] )* 0.114;
        if (grayLevel >= 150) { 
            　　    return false;
            } else {
                　return true;
            }

    }else if(color.startsWith("rgb(")){
        var RgbValue = color.replace("rgb(", "").replace(")", "");


        var RgbValueArry = RgbValue.split(",");

        var grayLevel = parseInt(RgbValueArry[0]) * 0.299 +parseInt( RgbValueArry[1]) * 0.587 + parseInt(RgbValueArry[2]) * 0.114;
        if (grayLevel >= 150) { 
            　　    return false;
            } else {
                　return true;
            }
    }else if(color.startsWith("rgba(")){
        var RgbValue = color.replace("rgba(", "").replace(")", "");


        var RgbValueArry= RgbValue.split(",");

        var grayLevel = parseInt(RgbValueArry[0]) * 0.299 + parseInt(RgbValueArry[1]) * 0.587 + parseInt(RgbValueArry[2]) * 0.114;
        if (grayLevel >= 150) { 
            　　    return false;
            } else {
                　return true;
            }
    }
    return false;
    
}
export function set16ToRgb(str:string):string{
    var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    if(!reg.test(str)){return;}
    let newStr = (str.toLowerCase()).replace(/\#/g,'')
    let len = newStr.length;
    if(len == 3){
        let t = ''
        for(var i=0;i<len;i++){
            t += newStr.slice(i,i+1).concat(newStr.slice(i,i+1))
        }
        newStr = t
    }
    let arr = []; //将字符串分隔，两个两个的分隔
    for(var i =0;i<6;i=i+2){
        let s = newStr.slice(i,i+2)
        arr.push(parseInt("0x" + s))
    }
    return 'rgb(' + arr.join(",")  + ')';
}