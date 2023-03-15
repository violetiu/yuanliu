/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

表单元素
***************************************************************************** */
import { ipcRenderer } from "electron";
import { ipcRendererSend } from "../preload";
import { getUUID, ICatalog, IComponent } from "../common/interfaceDefine";
import { renderColorPicker } from "../dialog/picker";
import * as dargData from "./DragData";
import { IMenuItem } from "../common/contextmenu";
export class FormNumber {

    label: string;
    value: string;
    input: HTMLInputElement;
    constructor(name: string) {
        this.label = name;

    }
    onChange: (value: string) => void;
    update(value: string, onChange: (value: string) => void) {
        this.value = value;
        this.input.value = value;
        this.onChange = onChange;
    }
    render(content: HTMLElement) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg";

        content.appendChild(div);

        if (this.label != undefined && this.label != "") {
            var label = document.createElement("div");
            label.innerText = this.label + " :";
            label.style.whiteSpace = "nowrap";
            div.appendChild(label);

        }

        var spider = document.createElement("div");
        spider.className = "number_spider";

        div.appendChild(spider);
        this.input = document.createElement("input");

        this.input.style.backgroundColor = "transparent";
        this.input.value = this.value + "";
        this.input.type = "number";
        // this.input.style.maxWidth = "80px";
        // this.input.style.minWidth = "30px";
        this.input.style.textAlign = "center";

        this.input.style.background = "rgba(175,175,175,0.1)";
        this.input.style.width = "100%";
        this.input.style.flex = "1";
        this.input.onchange = () => {
            this.onChange((this.input.value));
        };
        div.appendChild(this.input);

        var change: boolean = true;
        spider.onmousedown = (ed) => {

            var sx = ed.clientX;
            var sy = ed.clientY;
            var v = 0;
            change = true;
            //  input.style.pointerEvents="none";
            if (this.input.value != undefined && this.input.value.length > 0) {

                v = parseFloat(this.input.value);

            }
            document.onmousemove = (em) => {

                if (change) {
                    var x = em.clientX - sx;
                    var y = em.clientY - sy;
                    var nv = v + x;
                    this.input.value = nv + "";

                    this.onChange((this.input.value));
                }

            }
            document.onmouseup = (eu) => {
                change = false;

                //  input.style.pointerEvents="all";
            }

        }
    }

}


export class FormText {

    label: string;
    value: string;
    input: HTMLInputElement;
    constructor(name: string) {
        this.label = name;

    }
    onChange?: (value: string) => void;
    update(value: string, onChange?: (value: string) => void) {
        this.value = value;
        this.input.value = value;
        this.onChange = onChange;
    }
    render(content: HTMLElement) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.style.width = "100%";
        div.className = "form_bg";

        content.appendChild(div);
        var label = document.createElement("div");
        label.innerText = this.label + " :";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);


        this.input = document.createElement("input");
        this.input.style.backgroundColor = "transparent";
        this.input.value = this.value + "";
        this.input.type = "text";
        this.input.style.width = "100%";
        // if(this.onChange==undefined){
        //     this.input.readOnly = true;
        // }

        this.input.style.flex = "1";
        this.input.onchange = () => {
            if (this.onChange != undefined)
                this.onChange((this.input.value));
        };
        div.appendChild(this.input);
    }

}


export class FormPragraph {

    label: string;
    value: string;
    pragraph: HTMLDivElement;
    constructor(name: string) {
        this.label = name;

    }
    onChange?: (value: string) => void;
    update(value: string, onChange?: (value: string) => void) {
        this.value = value;
        this.pragraph.innerHTML = value;
        this.onChange = onChange;
        if (this.onChange != undefined) {
            this.pragraph.contentEditable = "true";
        } else {
            this.pragraph.contentEditable = "false";
        }
    }
    render(content: HTMLElement) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";

        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";

        div.style.borderRadius = "5px";


        div.className = "form_bg";

        content.appendChild(div);
        var label = document.createElement("div");
        label.innerText = this.label + " :";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);


        this.pragraph = document.createElement("div");

        this.pragraph.style.minHeight = "60px";
        this.pragraph.style.padding = "5px";

        this.pragraph.style.backgroundColor = "transparent";

        this.pragraph.style.flex = "1";
        this.pragraph.onkeyup = () => {
            if (this.onChange != undefined)
                this.onChange((this.pragraph.innerText));
        };
        div.appendChild(this.pragraph);
    }

}

export class FormButtons{


    buttons: IMenuItem[];
    ele: HTMLDivElement;
    constructor( buttons: IMenuItem[]) {
        this.buttons = buttons;
    }
    render(content: HTMLElement) {

        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg"
        div.style.display="flex";

        var start=document.createElement("div");
        start.style.flex="1";
        div.appendChild(start);


        if (this.buttons != undefined && this.buttons.length > 0) {
            this.buttons.forEach(btn=>{
                var tapDiv = document.createElement("div");
                tapDiv.style.flex="1";
                tapDiv.style.display="flex";
                tapDiv.style.alignItems="center";
                tapDiv.style.fontSize="12px";
                tapDiv.style.marginTop="5px";
                tapDiv.style.color="var(--theme-color)";
              
                var tapIcon = document.createElement("i");
                tapIcon.className = btn.icon + "";
                tapDiv.appendChild(tapIcon);
                tapIcon.style.paddingRight="5px";
            
                var text=document.createElement("div");
                text.innerText=btn.label;
                text.className="link";
                tapDiv.appendChild(text);
                content.appendChild(tapDiv);
                text.onclick=()=>{
                  btn.onclick();
                }

                div.appendChild(tapDiv);
                var end=document.createElement("div");
                end.style.flex="1";
                div.appendChild(end);

            })
    
          
        }


        content.appendChild(div);
      

    }
}

export class FormIcons {

    label: string;
    value: number;
    icons: string[];
    ele: HTMLDivElement;
    constructor(name: string, icons: string[]) {
        this.label = name;

        this.icons = icons;
    }
    onChange: (index: number) => void;
    update(value: number, onChange: (index: number) => void) {
        this.value = value;
        this.onChange = onChange;
        var icons = this.ele.getElementsByTagName("i");
        for (var i = 0; i < icons.length; i++) {
            var icon = icons[i];
            if (i == value) {
                icon.style.color = "var(--theme-color)";
            } else {
                icon.style.color = "inherit";
            }

        }
    }
    render(content: HTMLElement) {
        this.ele = document.createElement("div");
        var div = this.ele;
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg";

        if (this.label != undefined && this.label.length > 0) {

            var label = document.createElement("div");
            label.innerText = this.label + "  : ";
            label.style.whiteSpace = "nowrap";
            div.appendChild(label);
        }

        content.appendChild(div);
        for (var i = 0; i < this.icons.length; i++) {
            var iconDiv = document.createElement("div");
            iconDiv.style.flex = "1";
            iconDiv.style.textAlign = "center";
            div.appendChild(iconDiv);
            var icon = document.createElement("i");
            icon.className = this.icons[i];
            icon.style.padding = "5px";

            icon.setAttribute("data-index", i + "");
            icon.style.borderRadius = "5px";
            icon.style.cursor = "pointer";

            iconDiv.appendChild(icon);

            icon.onclick = (e: any) => {
                e.stopPropagation();
                var i = parseInt(e.target.getAttribute("data-index"));
            console.log(this.onChange);
                this.onChange(i);
                for (var j = 0; j < this.icons.length; j++) {
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

}

export class FormIcon {

    label: string;
    value: boolean;
    icon: string;
    ele: HTMLElement;
    constructor(name: string, icon: string) {
        this.label = name;

        this.icon = icon;
    }
    onChange: (index: boolean) => void;
    update(value: boolean, onChange: (index: boolean) => void) {
        this.value = value;
        this.onChange = onChange;
        var icons = this.ele.getElementsByTagName("i");

        if (value) {
            this.ele.style.color = "var(--theme-color)";
        } else {
            this.ele.style.color = "inherit";
        }


    }
    render(content: HTMLElement) {

        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg"

        if (this.label != undefined && this.label.length > 0) {
            var label = document.createElement("div");
            label.innerText = this.label + "  : ";
            label.style.whiteSpace = "nowrap";
            div.appendChild(label);
        }


        content.appendChild(div);
        var iconDiv = document.createElement("div");
        iconDiv.style.flex = "1";
        iconDiv.style.textAlign = "center";
        div.appendChild(iconDiv);
        var icon = document.createElement("i");
        icon.className = this.icon;
        icon.style.padding = "5px";

        icon.style.borderRadius = "5px";
        icon.style.cursor = "pointer";
        iconDiv.appendChild(icon);
        this.ele = icon;
        icon.onclick = (e: any) => {
            e.stopPropagation();
            if (this.value == undefined || this.value == null) {
                this.value = true;
            } else {
                this.value = !this.value;
            }
            if (this.onChange)
                this.onChange(this.value);
            if (this.value) {
                this.ele.style.color = "var(--theme-color)";
            }
            else {
                this.ele.style.color = "inherit";
            }



        }

    }

}

export class FormNumbers {

    label: string;
    values: number[];
    length: number;
    inputs: HTMLInputElement[];
    constructor(name: string, length: number) {
        this.label = name;
        this.length = length;
        this.inputs = [];


    }
    onChange: (values: number[]) => void;
    update(values: number[], onChange: (values: number[]) => void) {
        this.values = values;
        this.onChange = onChange;
        for (var i = 0; i < this.inputs.length; i++) {
            var input = this.inputs[i];
            input.value = values[i] + "";

        }
    }
    render(content: HTMLElement) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg"
        content.appendChild(div);
        var label = document.createElement("div");
        label.innerText = this.label + " : ";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);

        var spider = document.createElement("div");
        spider.className = "number_spider";

        div.appendChild(spider);

        for (var i = 0; i < this.length; i++) {
            var input = document.createElement("input");

            input.style.backgroundColor = "transparent";

            input.type = "number";

            input.style.maxWidth = "80px";
            input.style.minWidth = "30px";
            input.style.marginRight = "5px";
            input.style.textAlign = "center";
            input.style.width = "100%";
            input.style.background = "rgba(175,175,175,0.1)";
            input.style.flex = "1";
            input.setAttribute("data-index", i + "");
            input.onchange = (ei: any) => {
                var index = parseInt(ei.target.getAttribute("data-index"));
                this.values[index] = parseFloat(ei.target.value);
                this.onChange(this.values);
            };
            div.appendChild(input);
            this.inputs.push(input);
        }
    }

}


export class FormColor {

    label: string;
    value: string;
    element: HTMLInputElement;
    iconDiv: HTMLElement;
    constructor(name: string) {
        this.label = name;

    }
    onChange: (value: string) => void;
    update(value: string, onChange: (value: string) => void) {

        this.value = value;
        this.element.value = value;
        if (value == null || value == undefined || value == "" || value == "transparent") {
            this.iconDiv.style.backgroundColor = "#999";
        }
        else
            this.iconDiv.style.backgroundColor = value;
        this.onChange = onChange;
    }
    render(content: HTMLElement) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg"
        content.appendChild(div);

        if (this.label != undefined && this.label.length > 0) {
            var label = document.createElement("div");
            label.innerText = this.label + " : ";
            label.style.whiteSpace = "nowrap";
            div.appendChild(label);
        }

        var input = document.createElement("input");
        this.element = input;
        input.type = "text";
        input.style.backgroundColor = "transparent";

        input.style.width = "100%";
        input.style.flex = "1";

        input.onchange = () => {
            if (this.onChange)
                this.onChange(input.value);
        };
        div.appendChild(input);

        input.onfocus = () => {
            ipcRendererSend("touchbar_colors", "");
            ipcRenderer.removeAllListeners("touchBar_color");
            ipcRenderer.on("touchBar_color", (event, color) => {
                input.value = color;
                if (this.onChange)
                    this.onChange(color);
            });
        }
        input.onblur = () => {
            ipcRendererSend("touchbar_default", "");
        }

        var iconDiv = document.createElement("div");
        this.iconDiv = iconDiv;
        iconDiv.style.background = "#999";
        div.appendChild(iconDiv);
        iconDiv.style.height = "15px";
        iconDiv.style.width = "15px";
        iconDiv.style.borderRadius = "5px";
        iconDiv.style.marginLeft = "5px";
        iconDiv.style.cursor = "pointer";
        iconDiv.onclick = (e) => {
            e.stopPropagation();
            renderColorPicker(div, this.value, (color) => {
                input.value = color;
                this.value=color;
                iconDiv.style.background = color;
                if (this.onChange)
                    this.onChange(color);
            });
        }
    }

}

export class FormSolider {

    label: string;
    value: number;
    point: HTMLElement;
    max: number; min: number;
    bg: HTMLElement;
    unit?: string;

    constructor(name: string, max: number, min: number, unit?: string) {
        this.label = name;
        this.max = max;
        this.min = min;
        this.unit = unit;

    }
    onChange: (value: number) => void;
    update(value: number, onChange: (value: number) => void) {
        this.value = value;
        this.point.innerText = value + '';
        if (this.unit != undefined) {
            this.point.innerText += this.unit;
        }
        this.onChange = onChange;
        requestIdleCallback(()=>{
            this.point.style.left = (value - this.min) / (this.max - this.min) * this.bg.clientWidth + "px";
        });
    }
    render(content: HTMLElement) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg"
        content.appendChild(div);
        var label = document.createElement("div");
        label.innerText = this.label + "  : ";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);

        var solider = document.createElement("div");
        solider.style.flex = "1";
        solider.style.position = "relative";
        solider.style.padding = "5px";
        solider.style.userSelect = "none";
        div.appendChild(solider);

        var bg = document.createElement("div");
        bg.style.width = "100%";
        bg.style.height = "4px";
        bg.className = "background";
        bg.style.borderRadius = "5px";
        var point = document.createElement("div");

        point.style.position = "absolute";

        point.className = "drag";
        point.style.height = "10px";
        point.style.width = "10px";
        point.style.cursor = "ew-resize";
        point.style.top = "2px";
        point.style.fontSize = "8px";
        point.style.lineHeight = "30px";
        point.style.borderRadius = "10px";


        // point.style.background="inherit";
        solider.appendChild(bg);
        solider.appendChild(point);
        this.bg = bg;
        point.style.left = "0px";
        this.point = point;

        point.onmousedown = (ed: MouseEvent) => {
            var left = parseFloat(point.style.left.replace("px", ""));
            var startX = ed.clientX;
            var move: boolean = true;
            var val = this.value;
            ed.stopPropagation();
            document.onmousemove = (em: MouseEvent) => {
                if (move) {
                    var x = em.clientX - startX;
                    var l = left + x;
                    if (l < 0)
                        l = 0;
                    if (l > bg.clientWidth)
                        l = bg.clientWidth;
                    point.style.left = (l) + "px";

                    val = Math.round((l / bg.clientWidth) * (this.max - this.min) + this.min);
                    point.innerText = val + '';
                    if (this.unit != undefined) {
                        point.innerText += this.unit;
                    }
                    this.onChange(val);
                }
            }
            document.onmouseup = () => {
                move = false;
            }
        };

    }

}


export class FormSelect {

    label: string;
    value: string;
    options: { label: string, value: string }[];
    ele: HTMLSelectElement;
    constructor(name: string, options: { label: string, value: string }[]) {
        this.label = name;
        this.options = options;
    }
    onChange: (value: string) => void;
    update(value: string, onChange: (value: string) => void) {
        this.value = value;
        this.onChange = onChange;
        var options = this.ele.getElementsByTagName("option");
        for (var i = 0; i < options.length; i++) {
            options[i].selected = options[i].value == value;

        }
    }
    render(content: HTMLElement) {

        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg"


        var label = document.createElement("div");
        label.innerText = this.label + "  : ";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);

        content.appendChild(div);

        var select = document.createElement("select");
        select.style.flex = "1";
        div.appendChild(select);
        this.ele = select;
        select.onchange = (ed: Event) => {
            this.onChange(select.value);
        };

        for (var i = 0; i < this.options.length; i++) {
            var option = document.createElement("option");
            option.value = this.options[i].value;
            option.innerText = this.options[i].label;
            select.appendChild(option);

        }

    }

}



export class FormComponent {

    label: string;
    value: string;
    input: HTMLElement;
    iconClick: () => void;
    constructor(name: string) {
        this.label = name;
    }
    onChange: (cmpt: IComponent) => boolean;
    update(value: string, onChange: (cmpt: IComponent) => boolean, iconClick?: () => void) {
        if (value == undefined) {
            value = "";
        }
        this.value = value;
        this.input.innerText = value;
        this.onChange = onChange;
        if (iconClick != undefined)
            this.iconClick = iconClick;
    }
    render(content: HTMLElement, icon?: string) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg";

        content.appendChild(div);
        var label = document.createElement("div");
        label.innerText = this.label + " :";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);

        this.input = document.createElement("div");
        this.input.style.padding = "0px 5px 0px 5px";
        this.input.style.backgroundColor = "transparent";
        this.input.style.height = "24px";
        this.input.style.overflow = "hidden";
        // this.input.style.background="url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dot' viewBox='0 0 16 16'>  <path d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/></svg>\")";

        this.input.style.flex = "1";
        this.input.ondblclick = () => {
            alert("拖拽组件到此处");
            if (this.onChange != undefined) {
                this.onChange(undefined);
                this.value = "";
                this.input.innerHTML = "";
            }

        };

        div.appendChild(this.input);

        this.input.ondragover = (e) => {
            e.preventDefault();
        }
        this.input.ondrop = (e: any) => {
            var cmpt;
            var cmpt = dargData.getData("component");
            if (cmpt != undefined) {

                var rs = this.onChange(cmpt);
                if (rs) {
                    this.input.innerText = cmpt.path;
                    this.value = cmpt.path;
                } else {
                    this.input.innerText = "";
                    this.value = "";
                    alert("拖拽组件到此处");
                }
            } else {
                alert("拖拽组件到此处");
            }
        }

        if (icon != undefined) {
            var tapDiv = document.createElement("div");
            // tapDiv.style.width = "30px";
            // tapDiv.style.height = "30px";
            tapDiv.className = "tool_tap";
            tapDiv.style.display = "flex";
            tapDiv.style.alignItems = "center";
            tapDiv.style.justifyContent = "center";
            //tapDiv.title = tap.label;
            div.appendChild(tapDiv);
            var i = document.createElement("i");
            i.className = icon;
            tapDiv.appendChild(i);
            tapDiv.onclick = (e) => {
                e.stopPropagation();
                this.iconClick();
            };

        }
    }

}


export class FormCatalog {

    label: string;
    value: string;
    input: HTMLElement;
    iconClick: () => void;
    constructor(name: string) {
        this.label = name;
    }
    onChange: (cmpt: ICatalog) => boolean;
    update(value: string, onChange: (cmpt: ICatalog) => boolean, iconClick?: () => void) {
        if (value == undefined) {
            value = "";
        }
        this.value = value;
        this.input.innerText = value;
        this.onChange = onChange;
        if (iconClick != undefined)
            this.iconClick = iconClick;
    }
    render(content: HTMLElement, icon?: string) {
        var div = document.createElement("div");
        div.style.marginTop = "5px";
        div.style.display = "flex";
        div.style.fontSize = "12px";
        div.style.padding = "5px 10px 5px 10px";
        div.style.alignItems = "center";
        div.style.borderRadius = "5px";
        div.style.height = "24px";
        div.className = "form_bg";

        content.appendChild(div);
        var label = document.createElement("div");
        label.innerText = this.label + " :";
        label.style.whiteSpace = "nowrap";
        div.appendChild(label);

        this.input = document.createElement("div");
        this.input.style.padding = "0px 5px 0px 5px";
        this.input.style.backgroundColor = "transparent";
        this.input.style.height = "24px";
        this.input.style.lineHeight = "24px";
        
        this.input.style.overflow = "hidden";
        // this.input.style.background="url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dot' viewBox='0 0 16 16'>  <path d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/></svg>\")";

        this.input.style.flex = "1";
        this.input.ondblclick = () => {
            alert("拖拽页面到此处");
            if (this.onChange != undefined) {
                this.onChange({key:"",name:""});
                this.value = "";
                this.input.innerHTML = "";
            }

        };

        div.appendChild(this.input);

        this.input.ondragover = (e) => {
            e.preventDefault();
        }
        this.input.ondrop = (e: any) => {
            var cmpt;
            var cmpt = dargData.getData("catalog");
            if (cmpt != undefined) {

                var rs = this.onChange(cmpt);
                if (rs) {
                    this.input.innerText = cmpt.key;
                    this.value = cmpt.key;
                } else {
                    this.input.innerText = "";
                    this.value = "";
                    alert("拖拽页面到此处");
                }
            } else {
                alert("拖拽页面到此处");
            }
        }

        if (icon != undefined) {
            var tapDiv = document.createElement("div");
            // tapDiv.style.width = "30px";
            // tapDiv.style.height = "30px";
            tapDiv.className = "tool_tap";
            tapDiv.style.display = "flex";
            tapDiv.style.alignItems = "center";
            tapDiv.style.justifyContent = "center";
            //tapDiv.title = tap.label;
            div.appendChild(tapDiv);
            var i = document.createElement("i");
            i.className = icon;
            tapDiv.appendChild(i);
            tapDiv.onclick = (e) => {
                e.stopPropagation();
                this.iconClick();
            };

        }
    }

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
