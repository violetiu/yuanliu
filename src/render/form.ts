/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

界面 表单 元素
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IMenuItem } from "../common/contextmenu";
import { ipcRendererSend } from "../preload";
import { renderColorPicker } from "../dialog/picker";

export function renderTextField(context: HTMLElement, label: string, text: string, onChange: (text: string) => void) {

   var row = renderTr(context);

   row.className = "textField";

   var col = renderTD(row);

   var col1 = renderTD(row);



   var labelText = document.createElement("td");
   labelText.className = "label";
   labelText.innerText = label + " : ";

   col.appendChild(labelText);

   var textInput = document.createElement("input");
   textInput.type = "text";
   textInput.value = text;
   textInput.onchange = () => {
      onChange(textInput.value);
   }
   col1.appendChild(textInput);

}

export function createDivFile(content: HTMLElement, name: string, value: any, onChange: (value: any) => void) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.height = "20px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";
   div.className = "form_bg";



   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var input = document.createElement("input");
   input.type = "text";
   input.readOnly = true;
   input.style.backgroundColor = "transparent";
   input.placeholder = "双击选择目录";
   input.value = value;
   input.style.flex = "1";
   input.onchange = () => {
      onChange(input.value);
   };
   input.ondblclick = () => {

      ipcRenderer.send("openFolder_hub");



   }
   div.appendChild(input);
   return input;
}


function renderTr(context: HTMLElement): HTMLElement {
   var tr = document.createElement("tr");

   context.appendChild(tr);
   return tr;



}
function renderTD(context: HTMLElement): HTMLElement {
   var td = document.createElement("td");

   context.appendChild(td);
   return td;



}

export function renderCheckField(context: HTMLElement, label: string, checked: boolean, onChange: (checked: boolean) => void) {

   var row = renderTr(context);
   var col = renderTD(row);


   var textInput = document.createElement("input");
   textInput.type = "checkbox";
   textInput.checked = checked;
   textInput.onchange = () => {
      onChange(textInput.checked);
   }
   col.appendChild(textInput);


   var labelText = document.createElement("span");
   labelText.className = "label";
   labelText.innerText = label;

   col.appendChild(labelText);



}
export function createDivRow(content: HTMLElement, space?: boolean): HTMLElement {
   content.style.display = "flex";
   var child = document.createElement("div");
   content.appendChild(child);
   child.style.flex = "1";

   if (space) {
      var s = document.createElement("div");
      s.style.width = "5px";
      content.appendChild(s);

   }

   return child;
}

export function createDivPassword(content: HTMLElement, name: string, value: any, onChange?: (value: any) => void, tap?: { icon: string, onclick: () => void }): HTMLInputElement {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.height = "20px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";
   div.className = "form_bg";




   content.appendChild(div);
   var label = document.createElement("div");
   label.innerHTML = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var input = document.createElement("input");
   input.type = "password";
   input.style.backgroundColor = "transparent";
   if (value != undefined)
      input.value = value;
   input.style.flex = "1";
   if (onChange == undefined) {
      input.readOnly = true;
   }
   input.onchange = () => {
      if (onChange)
         onChange(input.value);
   };
   div.appendChild(input);

   if (tap != undefined) {

      var iconDiv = document.createElement("div");
      // iconDiv.style.width = fontSize * 3 + "px";
      iconDiv.style.display = "flex";
      iconDiv.style.alignItems = "center";

      iconDiv.style.justifyContent = "center";
      div.appendChild(iconDiv);
      var icon = document.createElement("i");
      // icon.style.fontSize = fontSize + "px";
      icon.className = tap.icon;
      iconDiv.appendChild(icon);
      if (tap.onclick) {
         iconDiv.onclick = tap.onclick;
         iconDiv.className = "tool_tap";
      }

   }
   return input;
}

export function createDivInput(content: HTMLElement, name: string, value: any, onChange?: (value: any,key?:string) => void, tap?: { icon: string, onclick: () => void },key?:string): HTMLInputElement {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.height = "20px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";



   content.appendChild(div);
   var label = document.createElement("div");
   label.innerHTML = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var input = document.createElement("input");
   input.type = "text";
   input.style.backgroundColor = "transparent";
   if (value != undefined)
      input.value = value;
   input.style.width = "100%";
   input.style.flex = "1";
   input.setAttribute("data-key",key);
   if (onChange == undefined) {
      input.readOnly = true;
   }
   input.onchange = (e) => {
      if (onChange)
         {
            var ele:any=e.target;
            var k=ele.getAttribute("data-key");
            onChange(ele.value,k);
         }
   };
   div.appendChild(input);

   if (tap != undefined) {

      var iconDiv = document.createElement("div");
      // iconDiv.style.width = fontSize * 3 + "px";
      iconDiv.style.display = "flex";
      iconDiv.style.alignItems = "center";

      iconDiv.style.justifyContent = "center";
      div.appendChild(iconDiv);
      var icon = document.createElement("i");
      // icon.style.fontSize = fontSize + "px";
      icon.className = tap.icon;
      iconDiv.appendChild(icon);
      if (tap.onclick) {
         iconDiv.onclick = tap.onclick;
         iconDiv.className = "tool_tap";
      }

   }
   return input;
}


export function createDivColors(content: HTMLElement, name: string, value: any, onChange?: (value: any) => void): HTMLInputElement {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.height = "20px";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";


   content.appendChild(div);
   var label = document.createElement("div");
   label.innerHTML = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var input = document.createElement("input");
   input.type = "text";
   input.style.backgroundColor = "transparent";
   if (value != undefined)
      input.value = value;
   input.style.width = "100%";
   input.style.flex = "1";
   if (onChange == undefined) {
      input.readOnly = true;
   }
   input.onchange = () => {
      if (onChange)
         onChange(input.value);
   };
   div.appendChild(input);

   input.onfocus = () => {
      ipcRendererSend("touchbar_colors", "");
      ipcRenderer.removeAllListeners("touchBar_color");

      ipcRenderer.on("touchBar_color", (event, color) => {
         input.value = color;
         if (onChange)
            onChange(color);
      });

   }
   input.onblur = () => {
      ipcRendererSend("touchbar_default", "");
   }




   var iconDiv = document.createElement("div");
   iconDiv.style.background=value;
   div.appendChild(iconDiv);
   iconDiv.style.height="15px";
   iconDiv.style.width="15px";
   iconDiv.style.borderRadius="5px";
   iconDiv.style.marginLeft="5px";
   iconDiv.style.cursor="pointer";
   iconDiv.onclick = () => {
      renderColorPicker(div, value, (color) => {
         input.value = color;
         iconDiv.style.background = color;
         if (onChange)
            onChange(color);
      });
   };
   if(value==undefined||value==""||value=="transparent"||value=="none"){
      iconDiv.style.background="#999";
   }





   return input;
}

export function createDivText(content: HTMLElement, name: string, value: any, onChange: (value: any) => void, tap?: { icon: string, onclick: () => void }) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.height = "20px";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";



   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var input = document.createElement("textarea");

   input.style.backgroundColor = "transparent";
   input.value = value;
   input.style.flex = "1";
   input.onchange = () => {
      onChange(input.value);
   };
   div.appendChild(input);

   if (tap != undefined) {

      var iconDiv = document.createElement("div");
      // iconDiv.style.width = fontSize * 3 + "px";
      iconDiv.style.display = "flex";
      iconDiv.style.alignItems = "center";

      iconDiv.style.justifyContent = "center";
      div.appendChild(iconDiv);
      var icon = document.createElement("i");
      // icon.style.fontSize = fontSize + "px";
      icon.className = tap.icon;
      iconDiv.appendChild(icon);
      if (tap.onclick) {
         iconDiv.onclick=(e)=>{
            e.stopPropagation();
            tap.onclick();
         };
         iconDiv.className = "tool_tap";
      }

   }
}

export function createDivTip(content: HTMLElement, name: string, value: any) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.height = "20px";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";




   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var input = document.createElement("div");

   input.style.backgroundColor = "transparent";
   input.innerText = value;
   input.style.flex = "1";

   div.appendChild(input);
}

export function createDivNumbers(content: HTMLElement, name: string, value: any[], onChange: (value: any[]) => void) {

   console.log(value);
   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.height = "20px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";





   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + " : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);

   var spider = document.createElement("div");
   spider.className = "number_spider";

   div.appendChild(spider);

   value.forEach((v, i) => {

      var input = document.createElement("input");

      input.style.backgroundColor = "transparent";
      input.value = v;
      input.type = "number";
      input.style.maxWidth = "80px";
      input.style.flex = "1";
      input.onchange = () => {
         value[i] = parseFloat(input.value);
         onChange(value);
      };
      div.appendChild(input);

   });





}
export function createDivNumber(content: HTMLElement, name: string, value: any, onChange: (value: any) => void) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.height = "20px";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";




   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + " :";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);

   var spider = document.createElement("div");
   spider.className = "number_spider";

   div.appendChild(spider);




   var input = document.createElement("input");

   input.style.backgroundColor = "transparent";
   input.value = value;
   input.type = "number";
   input.style.width = "100%";
   input.style.flex = "1";
   input.onchange = () => {
      onChange(input.value);
   };
   div.appendChild(input);

   var change: boolean = true;
   spider.onmousedown = (ed) => {

      var sx = ed.clientX;
      var sy = ed.clientY;
      var v = 0;
      change = true;
      //  input.style.pointerEvents="none";
      if (input.value != undefined && input.value.length > 0) {

         v = parseFloat(input.value);

      }
      document.onmousemove = (em) => {

         if (change) {
            var x = em.clientX - sx;
            var y = em.clientY - sy;
            var nv = v + x;
            input.value = nv + "";
            onChange(input.value);
         }

      }
      document.onmouseup = (eu) => {
         change = false;

         //  input.style.pointerEvents="all";
      }

   }

}

export function createDivIconTap(content: HTMLElement, icons: string[], values: boolean[], onChange: (value: any) => void) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.height = "20px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";
   div.className = "form_bg";



   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + " ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);




}

export function createDivBool(content: HTMLElement, name: string, values: string, onChange: (value: any,key?:string) => void,key?:string) {

   var div = document.createElement("div");

   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.height = "20px";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";




   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + " : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);

   var iconDiv = document.createElement("div");
   iconDiv.style.height = "30px";
   iconDiv.style.display = "flex";
   iconDiv.style.alignItems = "center";
   var icon = document.createElement("i");
   if (values == "true") {
      icon.className = "bi bi-toggle-on";
   } else {
      icon.className = "bi bi-toggle-off";
   }

   icon.style.fontSize = "24px";
   icon.style.marginLeft = "10px";
   icon.style.marginTop = "2px";
   iconDiv.appendChild(icon);
   icon.setAttribute("data-key",key);
   iconDiv.style.overflow = "hidden";

   div.appendChild(iconDiv);
   icon.onclick = (e) => {
      var i:any=e.target;
      var k=i.getAttribute("data-key");
      if (icon.className == "bi bi-toggle-on") {
         icon.className = "bi bi-toggle-off";
         onChange("false",k);
      } else {
         icon.className = "bi bi-toggle-on";
         onChange("true",k);
      }
   }



}
export function createDivIconSelect(content: HTMLElement, name: string, icons: string[], values: number, onchange: (index: number) => void) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.height = "20px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";

   div.className = "form_bg";

   if(name.length>0){
      var label = document.createElement("div");
      label.innerText = name + "  : ";
      label.style.whiteSpace = "nowrap";
      div.appendChild(label);
   }


   content.appendChild(div);
   for (var i = 0; i < icons.length; i++) {
      var iconDiv = document.createElement("div");
      iconDiv.style.flex = "1";
      iconDiv.style.textAlign = "center";
      div.appendChild(iconDiv);
      var icon = document.createElement("i");
      icon.className = icons[i];
      icon.style.padding = "5px";
      icon.setAttribute("data-index", i + "");
      icon.style.borderRadius = "5px";
      icon.style.cursor = "pointer";
      iconDiv.appendChild(icon);
      if (i != values) {
         icon.style.color = "";
      }else{
         icon.style.color = "var(--theme-color)";
      }
      icon.onclick = (e: any) => {
         var i = parseInt(e.target.getAttribute("data-index"));
         onchange(i);
         for (var j = 0; j < icons.length; j++) {
            var icon = div.getElementsByTagName("i")[j];
            if (j != i) {
               icon.style.color = "";
            } else {
               icon.style.color = "var(--theme-color)";
            }
         }


      }
   }


}

export function createDivSolider(content: HTMLElement, name: string, value: number, max: number, min: number, onChange: (value: number) => void) {
   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";
   div.style.height = "20px";
   div.className = "form_bg";

   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);

   var solider = document.createElement("div");
   solider.style.flex = "1";
   solider.style.position = "relative";
   solider.style.padding = "5px";
   div.appendChild(solider);

   var bg = document.createElement("div");
   bg.style.width = "100%";
   bg.style.height = "4px";
   bg.className = "background";
   bg.style.borderRadius = "5px";
   var point = document.createElement("div");

   point.style.position = "absolute";

   point.className = "foreground";
   point.style.height = "10px";
   point.style.width = "10px";
   point.style.cursor = "ew-resize";
   point.style.top = "2px";
   point.style.borderRadius = "10px";
   // point.style.background="#000";
   solider.appendChild(bg);
   solider.appendChild(point);
   console.log(bg.clientWidth,(value-min)/(max-min)*bg.clientWidth);
   point.style.left = (value-min)/(max-min)*bg.clientWidth+"px";

   point.onmousedown = (ed: MouseEvent) => {
      var left = parseFloat(point.style.left.replace("px", ""));
      var startX = ed.clientX;
      var move: boolean = true;
      var val = value;
      document.onmousemove = (em: MouseEvent) => {
         if (move) {
            var x = em.clientX - startX;
            var l = left + x;
            if (l < 0)
               l = 0;
            if (l > bg.clientWidth)
               l = bg.clientWidth;
            //  document.getElementById("workbench").style.width = (width) + "px";
            point.style.left = (l) + "px";
            val = Math.round((l / bg.clientWidth) * (max - min) + min);
            onChange(val);
         }
      }
      document.onmouseup = () => {
         move = false;
      }
   };




   return div;


}

export function createDivSelect(content: HTMLElement, name: string, value: any, options: { text: string, value: string }[], onChange: (value: any) => void, taps?: IMenuItem[]): HTMLSelectElement {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.height = "20px";
   div.style.fontSize = "12px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.alignItems = "center";
   div.style.borderRadius = "5px";
   div.className = "form_bg"



   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + "  : ";
   label.style.whiteSpace = "nowrap";
   div.appendChild(label);
   var select = document.createElement("select");
   select.style.backgroundColor = "transparent";
   //select.value = value;
   select.style.flex = "1";
   select.onchange = () => {
      onChange(select.value);
   };

   options.forEach(option => {
      var op = document.createElement("option");
      op.value = option.value;
      if (option.value == value) {
         op.selected = true;
      }
      op.text = option.text;
      select.appendChild(op);
   })
   div.appendChild(select);

   if (taps != undefined) {
      taps.forEach(tap => {

         var tapDiv = document.createElement("div");
         // tapDiv.style.width = "30px";
         // tapDiv.style.height = "30px";
         tapDiv.className = "tool_tap";
         tapDiv.style.display = "flex";
         tapDiv.style.alignItems = "center";
         tapDiv.style.justifyContent = "center";
         tapDiv.title = tap.label;
         div.appendChild(tapDiv);

         var icon = document.createElement("i");
         icon.className = tap.icon+"";
         tapDiv.appendChild(icon);
         tapDiv.onclick = tap.onclick;
      });




   }
   return select;

}


export function createDivCheck(content: HTMLElement, name: string, value: any, onChange: (value: any) => void) {

   var div = document.createElement("div");
   div.style.marginTop = "5px";
   div.style.display = "flex";
   div.style.fontSize = "12px";
   div.style.height = "20px";
   div.style.padding = "5px 10px 5px 10px";
   div.style.borderRadius = "5px";
   div.style.alignItems = "center";
   div.className = "form_bg";




   content.appendChild(div);
   var label = document.createElement("div");
   label.innerText = name + "  : ";
   div.appendChild(label);
   label.style.whiteSpace = "nowrap";
   var input = document.createElement("input");
   input.type = "checkbox";
   input.style.backgroundColor = "transparent";
   input.checked = value;
   input.style.flex = "1";
   input.onchange = () => {
      onChange(input.checked);
   };
   div.appendChild(input);
}

export function createDivIcon(content: HTMLElement, iconName: string, fontSize: number, onTaped?: () => void) {

   var div = document.createElement("div");
   div.style.width = fontSize * 3 + "px";
   div.style.display = "flex";
   div.style.alignItems = "center";
   div.style.height = "20px";

   div.style.justifyContent = "center";
   content.appendChild(div);
   var icon = document.createElement("i");
   icon.style.fontSize = fontSize + "px";
   icon.className = iconName;
   div.appendChild(icon);
   if (onTaped) {
      div.onclick = onTaped;
      div.className = "tool_tap";
   }
}

