/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

文本编辑器
***************************************************************************** */

export interface ISelection {
    anchorNode?: HTMLDivElement;
    anchorRow?: number;
    anchorText?: string;
    focusNode?: HTMLDivElement;
    anchorOffset?: number;
    anchorOffsetX?: number;
    focusOffset?: number; focusOffsetX?: number;
    focusText?: string;
    focusRow?: number;
    text?: string;
    type?: "Range" | "Caret" | "All";
}
export interface ISuggestion {
    type: "method" | "object" | "attribute"
    label?: string;
    text?: string;
}
export interface IHightLight {
    match: RegExp;
    color: string;
}
export class Editor {
    editor: HTMLElement;
    width: number;
    height: number;
    lineHeight: number = 20;
    fontSize: number = 12;
    measure: CanvasRenderingContext2D;
    content: HTMLElement;
    lineCount: number = 0;
    lineIndex: number = 0;
    fontFamily: string = 'Menlo, Monaco, "Courier New", monospace';
    onSelected?: (selection: ISelection) => void;
    numBarWidth = 48;
    constructor(content: HTMLElement, onChange: (lines: string) => void, onSelected?: (selection: ISelection) => void, w?: number, h?: number) {

        this.editor = document.createElement("div");
        this.editor.className = "editor form_bg";
        content.appendChild(this.editor);
        this.onSelected = onSelected;
        this.content = content;
        if (h != undefined) {
            this.height = h;
        } else {
            this.height = content.clientHeight;
        }
        if (w != undefined) {
            this.width = w;
        } else {
            this.width = content.clientWidth;
        }
        this.onChange = onChange;
        this.layout();
        window.onmouseup=()=>{
            this.selecting=false;
        }
    }
    navBar: HTMLElement;
    view: HTMLElement;
    textarea: HTMLTextAreaElement;
    composition: boolean = undefined;
    selectLine: HTMLDivElement;
    selectLineIndex: number = 0;
    selectIndex: number = 0;
    onChange: (lines: string) => void;
    isChanging: any;
    vscroll_thumb: HTMLElement;
    hscroll_thumb: HTMLElement;
    selectionSvg: SVGElement;
    selectionPath: SVGPathElement;
    suggestion: HTMLDivElement;
    change() {
        if (this.onChange != undefined) {
            var lines = "";
            for (var i = 0; i < this.lines.length; i++) {
                var line = this.lines[i].value;
                lines += line + "\n";
            }
            if (this.isChanging != undefined) {
                clearTimeout(this.isChanging);
            }
            this.isChanging = setTimeout(() => {
                this.onChange(lines);
            }, 2000);
        }
    }
    resize() {
        if (this.content.clientHeight > 0) {
            this.width = this.content.clientWidth;
            this.height = this.content.clientHeight;
        }
        this.editor.style.height = this.height + "px";
        this.lineCount = Math.floor(this.height / this.lineHeight);
        this.selectionSvg.style.height = this.view.clientHeight + "px";
        this.selectionSvg.style.width = this.view.clientWidth + "px";
    }
    layout() {
        var clipboard = navigator.clipboard;
        this.editor.style.overflow = "hidden";
        this.editor.style.height = this.height + "px";
        this.editor.style.borderRadius = "5px";
        var context = document.createElement("div");
        context.style.position = "relative";
        context.style.overflow = "hidden";
        context.style.height = "inherit";
        this.editor.appendChild(context);
        this.navBar = document.createElement("div");
        this.navBar.style.width = this.numBarWidth + "px";
        // this.navBar.style.background = "rgba(227,227,227)";
        this.navBar.style.position = "relative";
        this.navBar.style.zIndex = "100";
        // this.navBar.className="surface";
        this.navBar.style.userSelect = "none";
        this.navBar.style.height = "100%";
       // this.navBar.style.cssText += "backdrop-filter:blur(10px);";
        context.appendChild(this.navBar);
        this.view = document.createElement("div");
        this.view.style.left = this.numBarWidth + "px";
        this.view.style.width = "100%";
        this.view.className = "editor-view";
        context.appendChild(this.view);
        this.onLineMouse();
        var vScroll = document.createElement("div");
        vScroll.className = "editor_scrollV";
        vScroll.style.userSelect = "none";
        this.vscroll_thumb = document.createElement("div");
        this.vscroll_thumb.className = "editor_scrollV_thumb";
        vScroll.appendChild(this.vscroll_thumb);
        context.appendChild(vScroll);
        var hScroll = document.createElement("div");
        hScroll.className = "editor_scrollH";
        hScroll.style.left = this.numBarWidth + "px";
        hScroll.style.userSelect = "none";
        this.hscroll_thumb = document.createElement("div");
        this.hscroll_thumb.className = "editor_scrollH_thumb";
        this.hscroll_thumb.style.left = "0px";
        hScroll.appendChild(this.hscroll_thumb);
        context.appendChild(hScroll);
        this.textarea = document.createElement("textarea");
        this.textarea.style.height = (this.lineHeight - 2) + "px";
        this.textarea.style.lineHeight = (this.lineHeight - 2) + "px";
        this.textarea.className = "view-textarea";
        this.textarea.style.fontSize = "12px";
        this.textarea.wrap = "off";
        this.textarea.autocapitalize = "off";
        this.textarea.autocomplete = "off";
        this.textarea.spellcheck = false;
        this.textarea.style.fontFamily = this.fontFamily;

        this.textarea.style.fontFamily = this.fontFamily;
        this.view.tabIndex = 100;


        this.measure = document.createElement("canvas").getContext("2d");
        this.measure.font = this.fontSize + "px " + this.fontFamily;

        this.selectionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.selectionSvg.style.opacity = "0.2";
        this.selectionSvg.style.pointerEvents = "none";
        this.selectionPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.selectionPath.setAttribute("style", "fill:var(--theme-color);");
        this.selectionSvg.appendChild(this.selectionPath);

        this.suggestion = document.createElement("div");
        this.suggestion.style.position = "absolute";
        this.suggestion.className = "suggestion";

        this.suggestion.style.border = "1px solid var(--theme-color)";
        this.suggestion.style.zIndex = "200";
        this.suggestion.style.minWidth = "200px";
        // this.suggestion.style.minHeight = "80px";
        this.suggestion.style.maxHeight = "200px";
        this.suggestion.style.overflow = "auto";
        this.suggestion.style.display = "none";
        this.suggestion.style.borderRadius = "5px";
        this.suggestion.onwheel = (e) => {
            e.stopPropagation();

        }

        this.lineTemplate = this.createLineTemplate();

        this.lineCount = Math.floor(this.height / this.lineHeight);
        this.editor.onwheel = (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.deltaY != -0 && e.deltaY != 0) {
                //V
                if (this.lines.length <= 0)
                    return;
                this.lineIndex += Math.round(e.deltaY / 10);
                if (this.lineIndex + this.lineCount > this.lines.length) {
                    this.lineIndex = Math.round(this.lines.length - this.lineCount);
                }
                if (this.lineIndex < 0) {
                    this.lineIndex = 0;
                }
                this.render();
            }
            if (e.deltaX != -0 && e.deltaX != 0) {

                //h
                var left = parseFloat(this.view.style.left.replace("px", ""));
                var l = left - e.deltaX / 10;
                if (l > this.numBarWidth) {
                    l = this.numBarWidth;
                } else if (l < -(this.view.clientWidth - this.width + 20)) {
                    l = -(this.view.clientWidth - this.width + 20);
                }

                var sroll_h_rate = (l - this.numBarWidth) / (this.view.clientWidth - this.width + 20);
                this.hscroll_thumb.style.left = -(this.view.clientWidth - this.hscroll_thumb.clientWidth) / 4 * sroll_h_rate + "px";
                this.view.style.left = l + "px";
            }

        }


        this.textarea.onkeydown = (e) => {

            e.stopPropagation();

            if ((e.metaKey || e.ctrlKey) && e.key == "a") {
                var text = "";
                for (var i = 0; i < this.lines.length; i++) {
                    var lineT = this.lines[i].value;
                    text += lineT + "\n";
                }
                this.selection = {
                    anchorRow: 0,
                    anchorOffset: 0,
                    anchorOffsetX: 0,
                    type: "All",
                    focusRow: this.lines.length - 1,
                    focusOffset: this.lines[this.lines.length - 1].value.length,
                    focusOffsetX: this.measureText(this.lines[this.lines.length - 1].value),
                    text: text
                }
                this.renderSelection();


            } else if (this.selection != undefined && (this.selection.type == "Range" || this.selection.type == "All")) {

                var anchorNode: any = this.selection.anchorNode;
                var anchorRow = this.selection.anchorRow;
                var anchorLine = this.lines[anchorRow];
                var focusNode: any = this.selection.focusNode;
                var focusRow = this.selection.focusRow;
                var focusLine = this.lines[focusRow];
                var anchorOffset = this.selection.anchorOffset;
                var focusOffset = this.selection.focusOffset;
                if (e.key == "Backspace") {
                    if (this.selection.type == "All") {
                        this.lines = [{
                            key: this.getKey(), value: ""
                        }];
                        this.selection = undefined;
                        this.renderSelection();
                        this.render();
                        this.selectIndex = 0;
                        this.switchLine(undefined, 0);
                        this.textareaPosition();
                        this.change();
                    } else
                        if (anchorRow == focusRow) {
                            if (anchorOffset > focusOffset) {
                                var temp = focusOffset + 0;
                                focusOffset = anchorOffset + 0;
                                anchorOffset = temp + 0;
                            }
                            var line = this.lines[this.selectLineIndex];
                            line.value = line.value.substring(0, anchorOffset) + line.value.substring(focusOffset);
                            focusNode.innerHTML = this.toHtml(line.value);

                            this.selectIndex = anchorOffset;
                            this.switchLine(focusNode, focusRow);
                            this.textareaPosition();

                            this.change();
                            requestIdleCallback(() => {
                                this.highLightLine(this.selectLine, this.selectLineIndex);
                            });
                        } else if (anchorRow < focusRow) {

                            anchorLine.value = anchorLine.value.substring(0, anchorOffset) + focusLine.value.substring(focusOffset);
                            anchorNode.innerHTML = this.toHtml(anchorLine.value);
                            for (var i = anchorRow + 1; i <= focusRow; i++) {
                                this.lines.splice(anchorRow + 1, 1);
                            }
                            //删除行
                            var next = anchorNode.nextElementSibling;
                            while (next != undefined) {
                                var nextRow = next.getAttribute("data-row");
                                var _next = next.nextElementSibling;
                                next.remove();
                                if (nextRow == focusRow) {
                                    break;
                                }
                                next = _next;
                            }
                            this.selectIndex = anchorOffset;

                            this.render();
                            this.switchLine(undefined, anchorRow)
                            this.textareaPosition();

                            this.change();
                        } else if (anchorRow > focusRow) {
                            focusLine.value = focusLine.value.substring(0, focusOffset + 1) + anchorLine.value.substring(anchorOffset);
                            focusNode.innerHTML = this.toHtml(focusLine.value);
                            for (var i = focusRow + 1; i <= anchorRow; i++) {
                                this.lines.splice(focusRow + 1, 1);
                            }
                            //删除行
                            var next = focusNode.nextElementSibling;
                            while (next != undefined) {
                                var nextRow = next.getAttribute("data-row");
                                var _next = next.nextElementSibling;
                                next.remove();
                                if (nextRow == anchorRow) {
                                    break;
                                }
                                next = _next;
                            }
                            this.selectIndex = focusOffset + 1;

                            this.render();
                            this.switchLine(undefined, focusRow)
                            this.textareaPosition();


                            this.change();
                        }
                    this.selection = undefined;
                    this.renderSelection();
                } else if ((e.metaKey || e.ctrlKey) && e.key == "c") {


                    // if (anchorRow == focusRow) {
                    //     if (anchorOffset > focusOffset) {
                    //         var temp = focusOffset + 0;
                    //         focusOffset = anchorOffset + 0;
                    //         anchorOffset = temp + 0;
                    //     }
                    //     var line = this.lines[this.selectLineIndex];
                    //     var text = line.value.substring(anchorOffset, focusOffset);


                    //     clipboard.writeText(text);
                    // } else if (anchorRow < focusRow) {
                    //     var text = anchorLine.value.substring(anchorOffset) + "\n";
                    //     for (var i = anchorRow + 1; i <= focusRow; i++) {
                    //         text += this.lines[i].value + "\n";
                    //     }
                    //     text += focusLine.value.substring(0, focusOffset);
                    //     clipboard.writeText(text);


                    // } else if (anchorRow > focusRow) {
                    //     var text = focusLine.value.substring(focusOffset) + "\n";
                    //     for (var i = focusRow + 1; i <= anchorRow; i++) {
                    //         text += this.lines[i].value + "\n";
                    //     }
                    //     text += anchorLine.value.substring(0, anchorOffset);
                    //     clipboard.writeText(text);
                    // }

                    clipboard.writeText(this.selection.text);
                    e.preventDefault();
                } else if (e.ctrlKey || e.metaKey || e.altKey || e.metaKey) {

                }
                else {
                    this.selection = undefined;
                    this.renderSelection();
                }



            } else
                if (e.key == "Enter") {
                    var line = this.lines[this.selectLineIndex];
                    var text = "";
                    if (this.selectIndex < line.value.length) {
                        text = line.value.substring(this.selectIndex);
                        line.value = line.value.substring(0, this.selectIndex);
                        this.selectLine.innerHTML = this.toHtml(line.value);

                    }
                    var ms = line.value.match(/\S/);

                    if (ms != undefined) {
                        for (var i = 0; i < ms.index; i++) {
                            text = " " + text;
                        }
                        this.selectIndex = text.length;
                    } else {
                        this.selectIndex = 0;
                    }

                    this.lines.splice(this.selectLineIndex + 1, 0, {
                        key: this.getKey(), value: text
                    });
                    this.render();
                    this.switchLine(undefined, this.selectLineIndex + 1);
                    this.textareaPosition();
                    this.change();
                } else if (e.key == "Backspace") {
                    if (this.selectIndex == 0) {
                        var line = this.lines[this.selectLineIndex];
                        this.lines.splice(this.selectLineIndex, 1);
                        var old = line.value;
                        var upIndex = this.selectLineIndex - 1;
                        if (upIndex >= 0) {
                            var upLine = this.lines[upIndex];
                            this.selectIndex = upLine.value.length + 0;
                            upLine.value += old;

                            this.selectLineIndex = upIndex;
                            if (this.selectLineIndex < this.lineIndex) {
                                this.render();
                            } else {
                                var upLineDiv: any = this.selectLine.previousElementSibling;
                                this.selectLine.remove();
                                if (upLineDiv != undefined) {
                                    upLineDiv.innerHTML = this.toHtml(upLine.value);
                                    this.switchLine(upLineDiv, upIndex);
                                }
                                this.rows.splice(this.selectLineIndex - this.selectIndex, 1);
                                this.selectLine = upLineDiv;
                                this.textareaPosition();
                                this.render();
                            }
                            this.change();
                        }
                    } else if (this.selectIndex > 0) {
                        this.selectIndex--;
                        var line = this.lines[this.selectLineIndex];
                        var v = line.value.substring(this.selectIndex, this.selectIndex + 1);
                        var a = line.value.substring(0, this.selectIndex);
                        var b = line.value.substring(this.selectIndex + 1);
                        line.value = a + b;
                        this.selectLine.innerHTML = this.toHtml(line.value);
                        this.textareaPosition();
                        this.change();
                    }
                    requestIdleCallback(() => {
                        this.highLightLine(this.selectLine, this.selectLineIndex);
                    });
                } else if (e.key == "ArrowRight") {

                    if (this.selectIndex < this.selectLine.innerText.length) {
                        this.selectIndex++;
                    }
                    this.textareaPosition();
                } else if (e.key == "ArrowLeft") {

                    if (this.selectIndex > 0) {
                        this.selectIndex--;
                    }
                    this.textareaPosition();

                } else if (e.key == "ArrowDown") {
                    if (this.suggestion.childElementCount > 0) {
                        var next: any = this.selectSuggetionItem.nextElementSibling;
                        if (next != undefined) {
                            this.selectSuggetionItem.removeAttribute("data-selected");
                            next.setAttribute("data-selected","true");
                            this.selectSuggetionItem=next;
                        }
                    } else {
                        var next: any = this.selectLine.nextElementSibling;
                        if (next != undefined) {
                            this.switchLine(undefined, this.selectLineIndex + 1);
                            this.textareaPosition();
                        }

                    }

                } else if (e.key == "ArrowUp") {
                    if (this.suggestion.childElementCount > 0) {
                        var up: any = this.selectSuggetionItem.previousElementSibling;
                        if (up != undefined) {
                            this.selectSuggetionItem.removeAttribute("data-selected");
                            up.setAttribute("data-selected","true");
                            this.selectSuggetionItem=up;
                        }
                    } else {
                        var up: any = this.selectLine.previousElementSibling;
                        if (up != undefined) {
                            this.switchLine(undefined, this.selectLineIndex - 1);
                            this.textareaPosition();
                        }
                    }

                } else if (e.key == "Tab") {
                    e.preventDefault();
                    if (this.suggestion.childElementCount > 0) {
                        var text = this.selectSuggetionItem.getAttribute("data-text");
                        this.insertValue(text);
                        this.suggestion.innerHTML = "";
                        this.suggestion.style.display = "none";
                    } else
                        setTimeout(() => {
                            this.insertValue("    ");
                        }, 10);

                } else if ((e.metaKey || e.ctrlKey) && e.key == "v") {
                    clipboard.readText().then((text => {
                        if (text.length > 0) {
                            this.insertValue(text);
                        }

                    }))

                    e.preventDefault();

                } else if (e.ctrlKey || e.metaKey || e.altKey || e.metaKey) {


                } else {


                    if (this.composition == undefined) {

                        var text = e.key;
                        this.textarea.value = "";
                        if (text.length == 1)
                            this.insertValue(text);
                        e.preventDefault();

                    }

                }

        };

        this.textarea.onkeyup = (e) => {

            if (this.composition == true) {


                var text = this.textarea.value + "";

                this.insertValue(text, true);
                e.preventDefault();
            }

            if (this.composition == false) {
                var text = this.textarea.value + "";
                //  
                this.textarea.value = "";
                this.insertValue(text, false);
                this.composition = undefined;

            }
            if ((this.composition == undefined || this.composition == false) && e.key != "Tab"&& e.key != "ArrowDown"&& e.key != "ArrowUp") {
                var lineText = this.lines[this.selectLineIndex].value;
                if (lineText.length > 0 && /([A-z]|[0-9]|[\u4e00-\u9fa5])+/.test(lineText[lineText.length - 1])) {


                    var matchs = lineText.substring(0, this.selectIndex).match(/([A-z]|[0-9]|[\u4e00-\u9fa5])+/g);
                    if (matchs != undefined) {

                        var lastWords = matchs[matchs.length - 1].toLowerCase();

                        var sugs = this.suggestions.filter(sug => sug.label.indexOf(lastWords) >= 0);

                        this.suggestion.innerHTML = "";

                        sugs.forEach(sug => {
                            var suggestionItem = document.createElement("div");
                            suggestionItem.style.height = (this.lineHeight - 2) + "px";
                            suggestionItem.style.lineHeight = (this.lineHeight - 2) + "px";
                            suggestionItem.style.fontFamily = this.fontFamily;
                            suggestionItem.style.fontSize = this.fontSize + "px";
                            suggestionItem.style.display = "flex";
                            suggestionItem.style.borderTop = "1px solid transparent";
                            suggestionItem.style.borderBottom = "1px solid transparent";
                            suggestionItem.style.alignItems = "center";
                            suggestionItem.style.cursor = "pointer";
                            suggestionItem.setAttribute("data-text", sug.text.substring(lastWords.length));
                            suggestionItem.style.padding = "0px 5px 0px 5px";
                            suggestionItem.className = "suggestion-item";
                            var sugType = document.createElement("div");
                            sugType.style.height = "14px";
                            sugType.style.width = "18px";
                            // sugType.style.color = "var(--theme-color)";

                            sugType.style.pointerEvents = "none";
                            if (sug.type == "attribute") {
                                sugType.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-braces-asterisk" viewBox="0 0 16 16">  <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6ZM14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6ZM7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5h-1Z"/></svg>';
                            } else if (sug.type == "method") {
                                sugType.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16">  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/></svg>';
                            } else if (sug.type == "object") {
                                sugType.innerHTML = '<svg style="transform:rotate(-90deg)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-diagram-3" viewBox="0 0 16 16">  <path fill-rule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/></svg>';
                            }
                            if (this.suggestion.childElementCount == 0) {
                                suggestionItem.setAttribute("data-selected", "true");
                                this.selectSuggetionItem = suggestionItem;
                            }

                            suggestionItem.appendChild(sugType);
                            var sugLabel = document.createElement("div");
                            sugLabel.style.pointerEvents = "none";
                            sugLabel.innerText = sug.label;
                            suggestionItem.appendChild(sugLabel);

                            var sugText = document.createElement("div");
                            sugText.style.pointerEvents = "none";
                            sugText.className = "suggestion-item-text";
                            sugText.innerText = sug.text;
                            suggestionItem.appendChild(sugText);
                            suggestionItem.onmousedown = (e) => {
                                e.stopPropagation();

                                console.log(suggestionItem);

                                this.insertValue(sug.text.substring(lastWords.length));


                            }
                            suggestionItem.onmouseup = (e) => {
                                e.stopPropagation();
                                this.suggestion.style.display = "none";
                            }

                            this.suggestion.appendChild(suggestionItem);
                        })
                        if (this.suggestion.innerHTML.length > 0) {
                            this.suggestion.style.display = "block";
                            this.suggestion.style.height = (this.suggestion.childElementCount * this.lineHeight ) + "px";
                            this.suggestion.style.top = (parseFloat(this.textarea.style.top.replace("px", "")) + this.lineHeight) + "px";
                            this.suggestion.style.left = this.textarea.style.left;
                            if(this.suggestion.childElementCount >5){
                                this.suggestion.style.overflow="auto";
                            }else{
                                this.suggestion.style.overflow="hidden";
                            }
                        } else {
                            this.suggestion.style.display = "none";
                        }
                    } else {
                        this.suggestion.style.display = "none";
                    }

                }else {
                    this.suggestion.style.display = "none";
                }
            }


        }
        this.textarea.addEventListener("compositionstart", () => {

            this.composition = true;
            //keydown，先触发，检测到连续输入时，删除之前的一个down字符
            this.selectIndex--;
            var line = this.lines[this.selectLineIndex];
            var v = line.value.substring(this.selectIndex, this.selectIndex + 1);
            var a = line.value.substring(0, this.selectIndex);
            var b = line.value.substring(this.selectIndex + 1);
            line.value = a + b;
            this.selectLine.innerHTML = this.toHtml(line.value);
            this.textareaPosition();
        });
        this.textarea.addEventListener("compositionend", () => {

            this.composition = false;
        });

    }
    selectSuggetionItem: HTMLDivElement;
    setSuggestions(suggestions: Array<ISuggestion>) {
        this.suggestions = suggestions;
    }
    suggestions: Array<ISuggestion> = []

    switchLine(newLine?: HTMLDivElement, lineIndex?: number) {
        if (this.selectLine != undefined && newLine != undefined && this.selectLine == newLine) {
            return;
        }
        if (newLine == undefined && lineIndex != undefined) {
            for (var i = 0; i < this.rows.length; i++) {
                var row: any = this.rows[i];
                if (parseInt(row.getAttribute("data-row")) == lineIndex) {
                    newLine = row;
                    break;
                }
            }
        }
        if (this.selectLine != undefined) {
            this.selectLine.removeAttribute("selected");
        }
        if (newLine != undefined) {
            newLine.setAttribute("selected", "true");
            this.selectLine = newLine;
        }

        if (lineIndex != undefined)
            this.selectLineIndex = lineIndex;

    }
    insertValue(text: string, isComposition?: boolean) {

        if (text.indexOf("\n") > 0) {
            var line = this.lines[this.selectLineIndex];
            var a = line.value.substring(0, this.selectIndex);
            var b = line.value.substring(this.selectIndex);
            var values = text.split("\n");
            line.value = a + values[0];
            this.selectLine.innerHTML = this.toHtml(line.value);

            for (var i = 1; i < values.length; i++) {
                var val = values[i];
                if (i == values.length - 1) {
                    val += b;
                }
                this.lines.splice(this.selectLineIndex + i, 0, {
                    key: this.getKey(), value: val
                });
            }
            this.render();
            this.change();

        } else {
            this.insertLineText(text, isComposition);
        }

    }
    compositionStart: number;
    compositionEnd: number;
    compositionLeft: number;
    insertLineText(text: string, isComposition?: boolean) {
        var start = this.selectIndex;
        var end = this.selectIndex;
        if (this.compositionStart != undefined && isComposition != undefined) {
            start = this.compositionStart;
            end = this.compositionEnd;
        }
        var line = this.lines[this.selectLineIndex];
        line.value = line.value.substring(0, start) +
            text + line.value.substring(end);

        this.selectLine.innerHTML = this.toHtml(line.value);
        this.selectIndex = start + text.length;
        if (isComposition) {
            this.compositionStart = start;
            this.compositionEnd = this.selectIndex;
        } else {
            this.compositionStart = undefined;
            this.compositionEnd = undefined;
        }
        this.textareaPosition();
        this.change();
        requestIdleCallback(() => {
            this.highLightLine(this.selectLine, this.selectLineIndex);
        });
    }
    lines: Array<{ key: string, value: string }>;
    keyIndex: number = 0;
    getKey(): string {
        this.keyIndex++;
        return this.keyIndex + "";
    }
    setValue(text: string) {
        this.lines = [];
        // while(this.view.childElementCount>2){
        //     this.view.children.item(2).remove();
        // }
        this.view.innerHTML = "";
        this.view.appendChild(this.textarea);
        this.view.appendChild(this.selectionSvg)
        // this.view.appendChild(this.measure);
        this.view.appendChild(this.suggestion);

        this.rows = [];
        text.split("\n").forEach((line, row) => {
            if (line.indexOf("\t") >= 0) {
                line = line.replace(/\t/g, "    ")
            }
            this.lines.push({
                key: this.getKey(), value: line
            })
        })
        this.lineIndex = 0;
        this.adjustHscroll();
        this.render();
        this.textarea.style.display = "none";
        this.selectionSvg.style.height = this.view.clientHeight + "px";
        this.selectionSvg.style.width = this.view.clientWidth + "px";
    }
    adjustHscroll() {
        if (this.lines != undefined) {
            var maxL = 0;
            var maxText = "";
            this.lines.forEach((line) => {
                if (line.value.length > maxL) {
                    maxL = line.value.length;
                    maxText = line.value;
                }
            });
            var mw = this.measureText(maxText);
            var w = 0;
            if (mw > this.width - 32) {
                this.view.style.width = mw + "px";
                w = mw;

                this.hscroll_thumb.style.width = (this.width - 32) / (w)  + "px";
            } else {
                this.view.style.width = (this.width - 32) + "px";
                w = this.width - 32;
                this.hscroll_thumb.style.width = "0px";
            }
        }
    }

    rows: Array<HTMLElement>;
    render() {
        if (this.lines == undefined) return;
        if (this.rows == undefined) this.rows = [];


        var scroll_val = this.lineCount / (this.lines.length);
        if (scroll_val > 0.99) {
            this.vscroll_thumb.style.height = "0px";

        } else {
            this.vscroll_thumb.style.height = this.lineCount / (this.lines.length) * this.height + "px";
            this.vscroll_thumb.style.top = this.lineIndex / this.lines.length * this.height + "px";
        }


        var adds: Array<any> = [];
        var exits: Array<string> = [];
        this.view.style.top = (-this.lineIndex * this.lineHeight) + "px";
        this.view.style.height = (this.lines.length * this.lineHeight) + "px";
        for (var i = this.lineIndex; i < this.lineCount + this.lineIndex && i < this.lines.length; i++) {//
            var line = this.lines[i];
            var row;
            for (var j = 0; j < this.rows.length; j++) {
                var rowj = this.rows[j];
                if (rowj.getAttribute("key") == line.key) {
                    row = rowj;
                    break;
                }
            }
            if (row != undefined) {
                exits.push(line.key);
                row.style.top = (i) * this.lineHeight + "px";
                row.setAttribute("data-row", i + "");
                row = undefined;
            } else {
                adds.push({
                    index: i,
                    line: line,
                    row: i - this.lineIndex
                });
            }
        }

        //删除多余的

        var wi = 0;
        while (wi < this.rows.length) {
            var ele = this.rows[wi];
            if ((exits.indexOf(ele.getAttribute("key"))) < 0) {
                ele.remove();
                this.rows.splice(wi, 1);
            } else {
                wi++;
            }
        }
        //增加新的
        adds.forEach((value, key) => {
            var index = value.index;
            var line = value.line;
            this.renderLine(line, index, value.row);
        });
        this.updateNav();
        requestIdleCallback(() => {

            adds.forEach((value, key) => {
                var index = value.index;

                this.highLightLine(undefined, index);
            });
            this.renderSelection();

        });


    }
    renderLine(line: { key: string, value: string }, index: number, row: number) {

        var top = index * this.lineHeight;

        var newLine = this.newLine(line.value, index);
        newLine.setAttribute("key", line.key);
        newLine.style.top = top + "px";
        // if (this.selectLine != undefined) {
        //     this.selectLine.insertAdjacentElement("afterend", newLine);
        //     this.rows.splice(this.selectLineIndex,0,newLine);
        // }
        // else {
        var preDiv = this.view.children.item(row + 2);
        preDiv.insertAdjacentElement("afterend", newLine);
        //this.view.appendChild(newLine);
        this.rows.push(newLine);
        // requestIdleCallback(() => {
        //     this.highLightLine(newLine, index);
        // });
        //   }
    }

    adjustTop() {

        var line: any = this.selectLine;
        var top = parseFloat(this.selectLine.style.top.replace("px", ""));
        var row = parseFloat(this.selectLine.getAttribute("data-row"));
        while (line != undefined) {
            row++;
            line.style.top = top + "px";
            line.setAttribute("data-row", row);

            line = line.nextElementSibling;
            top += this.lineHeight;
        }
    }

    measureText(text: string) {

        return this.measure.measureText(text).width;
    }
    updateNav() {

        var length = this.navBar.childElementCount;
        for (var i = length; i < this.lineCount; i++) {
            var line = document.createElement("div");
            // line.style.top = top + "px";
            line.style.height = (this.lineHeight) + "px";
            line.style.lineHeight = (this.lineHeight) + "px";
            line.className = "nav-num";
            line.style.fontFamily = this.fontFamily;
            line.style.fontSize = this.fontSize + "px";
            line.innerText = "";
            this.navBar.appendChild(line);
        }

        for (var i = this.lineIndex; i < this.lineCount + this.lineIndex && i < this.lines.length; i++) {//
            var num: any = this.navBar.children.item(i - this.lineIndex);
            num.innerText = (i + 1) + "";
        }


    }

    textareaPosition() {

        var line = this.lines[this.selectLineIndex];
        if (line == undefined) {

        }
        if (this.selectIndex > line.value.length) {
            this.selectIndex = line.value.length;
        }

        // var left =this.selectIndex*12;

        // this.textarea.style.left = left + "px";
        this.textarea.style.top = (parseFloat(this.selectLine.style.top.replace("px", "")) + 1) + "px";
        this.textarea.style.display = "block";
        var left = this.measureText(line.value.substring(0, this.selectIndex)) - 1.5;
        this.textarea.style.left = left + "px";
        setTimeout(() => {
            this.textarea.focus({
                preventScroll: true
            });
        }, 10);
    }

    addLine(text: string, row: number) {

        var top = row * this.lineHeight;

        var newLine = this.newLine(text, row);
        newLine.style.top = top + "px";
        this.view.appendChild(newLine);
    }
    tansferWord(text: string): string {
        var html = text + "";
        if (html.indexOf("\t") >= 0) {
            html = html.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        }
        if (html.indexOf(" ") >= 0) {
            html = html.replace(/ /g, "&nbsp;");
        }
        return html;
    }

    highLights: Array<IHightLight> = [

    ];

    highLightLine(lineDiv?: HTMLDivElement, lineIndex?: number) {
        if (lineDiv == undefined && lineIndex != undefined) {
            for (var i = 0; i < this.rows.length; i++) {
                var row: any = this.rows[i];
                if (parseInt(row.getAttribute("data-row")) == lineIndex) {
                    lineDiv = row;
                    break;
                }
            }
        }
        var line = this.lines[lineIndex];
        if (line != undefined && lineDiv != undefined) {
            var text = line.value;
            if (text.length == 0 || text.length == 1) {
                //不用高亮
                return;
            }

            var highLightWords: Array<{
                start: number, end: number, length: number, word: string, color: string
            }> = [];
            this.highLights.forEach((hl, hlIndex) => {
                var textIndex = 0;
                var count = 0;
                while (textIndex < text.length - 1 && count < 2) {
                    var subText = text.substring(textIndex);
                    var matchs = subText.match(hl.match);

                    if (matchs != undefined) {

                        var matchText = matchs[1];
                        var start = textIndex + subText.indexOf(matchText);
                        var end = start + matchText.length;
                        var length = matchText.length;
                        var word = matchText;
                        textIndex += subText.indexOf(matchText) + matchText.length;
                        highLightWords.push({
                            start: start, end: end, length: length, word: word, color: hl.color
                        });
                        count = 0;
                    }
                    count++;

                }
            })
            var html = "";
            var textIndex = 0;
            highLightWords = highLightWords.sort((a, b) => a.start - b.start);
            highLightWords.forEach((hl, index) => {
                if (hl.start >= textIndex) {
                    html += this.tansferWord(text.substring(textIndex, hl.start));
                    html += "<span style='pointer-events: none;color:" + hl.color + "'>" + this.tansferWord(hl.word) + "</span>";
                    textIndex = hl.end;
                }
            })
            if (textIndex < text.length) {
                html += this.tansferWord(text.substring(textIndex));
            }
            lineDiv.innerHTML = html;
        }
    }

    toHtml(text: string): string {

        var html = this.tansferWord(text);
        return html;
    }
    lineTemplate: HTMLDivElement;
    createLineTemplate() {
        var line = document.createElement("div");

        line.style.height = (this.lineHeight - 2) + "px";
        line.style.lineHeight = (this.lineHeight - 2) + "px";
        line.className = "view-line";
        line.style.fontSize = this.fontSize + "px";
        line.style.fontFamily = this.fontFamily;
        line.style.fontFeatureSettings = '"liga" 0, "calt" 0';
        line.style.pointerEvents = "none";

        return line;

    }
    newLine(text: string, row?: number) {

        if (row == undefined && this.selectLine != undefined) {
            parseInt(this.selectLine.getAttribute("data-row")) + 1;
        }
        var line: any = this.lineTemplate.cloneNode(true);
        line.setAttribute("data-row", row + "");
        line.innerHTML = this.toHtml(text);


        return line;
    }
    onLineMouse() {
        this.view.ondblclick = (e) => {

            var eRow = Math.floor(e.offsetY / this.lineHeight);
            var line: any = this.view.children.item(eRow - this.lineIndex + 3);
            var eText = this.lines[eRow].value;
            var anchorOffset = this.getOffset(eText, e);

            var count = 0;
            var wI = 0;
            var wT = "";
            var wE = 0;
            while (count < eText.length) {
                var subText = eText.substring(wE);

                var maths = subText.match(/[A-z]+/);
                if (maths == undefined)
                    break;

                var mI = wE + maths.index;
                var mText = maths[0];
                var mE = mI + mText.length;
                wE = mE;
                wI = mI;
                if (anchorOffset >= mI && anchorOffset <= mE) {
                    wT = mText;
                    break;
                }
                count++;
            }

            if (wT.length > 0) {
                this.selection = {
                    anchorNode: line, anchorOffset: wI, type: "Range",
                    anchorRow: eRow, anchorOffsetX: e.offsetX,
                    anchorText: eText, text: wT,
                    focusNode: line, focusOffset: wE, focusRow: eRow, focusText: eText
                }

                this.renderSelection();
                this.selectIndex = wE;
                this.textareaPosition();
            }





        }
        this.view.onmouseup = (e: any) => {

            this.selecting = false;

            var eRow = Math.floor(e.offsetY / this.lineHeight);
            var line: any = this.view.children.item(eRow - this.lineIndex + 3);

            var eText = this.lines[eRow].value;
            if (this.selection.type == "Caret") {

                this.switchLine(line, eRow);
                this.selectIndex = this.getOffset(eText, e);
                this.textareaPosition();



            } else if (this.selection.type == "Range") {
                if (this.selection.anchorRow > this.selection.focusRow) {
                    this.switchLine(this.selection.anchorNode, this.selection.anchorRow);
                    this.selectIndex = this.selection.anchorOffset;
                } else {
                    this.switchLine(line, eRow);
                    this.selectIndex = this.getOffset(eText, e);
                }

                this.textareaPosition();

                if (this.onSelected != undefined) {
                    this.onSelected(this.selection);
                }
            }
        }
        this.view.onmousemove = (e: any) => {
            if (this.selecting && this.selection != undefined) {

                this.textarea.style.display = "none";

                var eRow = Math.floor(e.offsetY / this.lineHeight);
                var line: any = this.view.children.item(eRow - this.lineIndex + 3);

                var eText = this.lines[eRow].value;
                this.selection.type = "Range";
                this.selection.focusNode = line;
                this.selection.focusOffset = this.getOffset(eText, e);
                this.selection.focusRow = eRow;
                this.selection.focusOffsetX = e.offsetX;
                this.selection.focusText = eText;

                this.renderSelection();




            }


        }

        this.view.onmousedown = (e: any) => {
            this.selecting = true;

            this.suggestion.style.display = "none";
            var eRow = Math.floor(e.offsetY / this.lineHeight);
            var line: any = this.view.children.item(eRow - this.lineIndex + 3);


            var eText = this.lines[eRow].value;
            var anchorOffset = this.getOffset(eText, e);

            this.selection = {
                anchorNode: line, anchorOffset: anchorOffset, type: "Caret",
                anchorRow: eRow, anchorOffsetX: e.offsetX,
                anchorText: eText, text: ""
            }
            this.renderSelection();


        }
    }
    renderSelection() {
        if (this.selection == undefined) {
            this.selectionPath.setAttribute("d", "");
        } else
            if (this.selection.type == "Caret") {
                this.selectionPath.setAttribute("d", "");
            } else if (this.selection.type == "Range") {

                var selectedText = "";
                if (this.selection.focusRow == this.selection.anchorRow) {
                    var anchorS = this.measureText(this.selection.anchorText.substring(0, this.selection.anchorOffset));
                    var path = "M" + anchorS + " " + (this.selection.anchorRow * this.lineHeight + this.lineHeight)
                    path += "L" + anchorS + " " + (this.selection.anchorRow * this.lineHeight)
                    var focusS = this.measureText(this.selection.focusText.substring(0, this.selection.focusOffset));
                    path += " L" + focusS + " " + (this.selection.focusRow * this.lineHeight);
                    path += " L" + focusS + " " + (this.selection.focusRow * this.lineHeight + this.lineHeight);
                    path += "z"

                    if (this.selection.anchorOffset > this.selection.focusOffset) {
                        selectedText = this.selection.anchorText.substring(this.selection.focusOffset, this.selection.anchorOffset);
                    } else {
                        selectedText = this.selection.anchorText.substring(this.selection.anchorOffset, this.selection.focusOffset);
                    }
                    this.selectionPath.setAttribute("d", path);

                } else if (this.selection.anchorRow < this.selection.focusRow) {
                    var anchorS = this.measureText(this.selection.anchorText.substring(0, this.selection.anchorOffset));
                    var path = "M" + anchorS + " " + (this.selection.anchorRow * this.lineHeight + this.lineHeight);
                    path += "L" + anchorS + " " + (this.selection.anchorRow * this.lineHeight);
                    var anchorL = this.measureText(this.selection.anchorText);
                    path += "L" + anchorL + " " + (this.selection.anchorRow * this.lineHeight);
                    path += "L" + anchorL + " " + (this.selection.anchorRow * this.lineHeight + this.lineHeight);
                    selectedText += this.selection.anchorText.substring(this.selection.anchorOffset) + "\n";
                    //
                    for (var r = this.selection.anchorRow + 1; r < this.selection.focusRow; r++) {
                        var rLine = this.lines[r];
                        var rL = this.measureText(rLine.value);
                        if (rL < this.fontSize / 2) {
                            rL = this.fontSize / 2;
                        }
                        path += "L" + rL + " " + (r * this.lineHeight);
                        path += "L" + rL + " " + (r * this.lineHeight + this.lineHeight);
                        selectedText += rLine.value + "\n";
                    }
                    //end
                    var focusS = this.measureText(this.selection.focusText.substring(0, this.selection.focusOffset));
                    path += " L" + focusS + " " + (this.selection.focusRow * this.lineHeight);
                    path += " L" + focusS + " " + (this.selection.focusRow * this.lineHeight + this.lineHeight);
                    path += " L" + 0 + " " + (this.selection.focusRow * this.lineHeight + this.lineHeight);
                    path += " L" + 0 + " " + (this.selection.focusRow * this.lineHeight);
                    selectedText += this.selection.focusText.substring(0, this.selection.focusOffset) + "\n";
                    //back
                    for (var r = this.selection.focusRow - 1; r > this.selection.anchorRow; r--) {
                        var rLine = this.lines[r];
                        var rL = this.measureText(rLine.value);
                        path += "L" + 0 + " " + (r * this.lineHeight + this.lineHeight);
                        path += "L" + 0 + " " + (r * this.lineHeight);
                    }
                    path += "z";
                    this.selectionPath.setAttribute("d", path);

                } else if (this.selection.anchorRow > this.selection.focusRow) {
                    var focusS = this.measureText(this.selection.focusText.substring(0, this.selection.focusOffset + 1));

                    var path = "M" + focusS + " " + (this.selection.focusRow * this.lineHeight + this.lineHeight);
                    path += "L" + focusS + " " + (this.selection.focusRow * this.lineHeight);
                    var focusL = this.measureText(this.selection.focusText);
                    path += "L" + focusL + " " + (this.selection.focusRow * this.lineHeight);
                    path += "L" + focusL + " " + (this.selection.focusRow * this.lineHeight + this.lineHeight);

                    selectedText += this.selection.focusText.substring(0, this.selection.focusOffset) + "\n";
                    //
                    for (var r = this.selection.focusRow + 1; r < this.selection.anchorRow; r++) {
                        var rLine = this.lines[r];
                        var rL = this.measureText(rLine.value);
                        if (rL < this.fontSize / 2) {
                            rL = this.fontSize / 2;
                        }
                        path += "L" + rL + " " + (r * this.lineHeight);
                        path += "L" + rL + " " + (r * this.lineHeight + this.lineHeight);
                        selectedText += rLine.value + "\n";
                    }
                    var anchorS = this.measureText(this.selection.anchorText.substring(0, this.selection.anchorOffset));
                    //end
                    path += " L" + anchorS + " " + (this.selection.anchorRow * this.lineHeight);
                    path += " L" + anchorS + " " + (this.selection.anchorRow * this.lineHeight + this.lineHeight);
                    path += " L" + 0 + " " + (this.selection.anchorRow * this.lineHeight + this.lineHeight);
                    path += " L" + 0 + " " + (this.selection.anchorRow * this.lineHeight);

                    selectedText += this.selection.anchorText.substring(this.selection.anchorOffset) + "\n";
                    //back
                    for (var r = this.selection.anchorRow - 1; r > this.selection.focusRow; r--) {
                        var rLine = this.lines[r];
                        var rL = this.measureText(rLine.value);
                        path += "L" + 0 + " " + (r * this.lineHeight + this.lineHeight);
                        path += "L" + 0 + " " + (r * this.lineHeight);
                    }


                    path += "z";
                    this.selectionPath.setAttribute("d", path);

                }

                this.selection.text = selectedText;
            } else if (this.selection.type == "All") {



                var path = "M" + 0 + " " + this.lineIndex * this.lineHeight;

                //
                for (var r = 0; r < this.rows.length; r++) {
                    var i = r + this.lineIndex;
                    var rLine = this.lines[i];
                    var rL = this.measureText(rLine.value);
                    if (rL < this.fontSize / 2) {
                        rL = this.fontSize / 2;
                    }
                    path += "L" + rL + " " + (i * this.lineHeight);
                    path += "L" + rL + " " + (i * this.lineHeight + this.lineHeight);
                    selectedText += rLine.value + "\n";
                }
                path += "L" + 0 + " " + ((this.rows.length - 1 + this.lineIndex) * this.lineHeight + this.lineHeight);
                path += "z";
                this.selectionPath.setAttribute("d", path);

            }

    }
    getOffset(text: string, e: MouseEvent) {
        var offset = 0;
        var tl = this.measureText(text);
        if (e.offsetX > tl) {
            return text.length;
        }
        var temp = e.offsetX / (tl / text.length);
        var start = temp - 2;
        if (start < 0)
            start = 0;
        var end = temp + 2;
        if (end > text.length)
            end = text.length;
        for (var i = start; i < end; i++) {
            var l = this.measureText(text.substring(0, i));
            offset = i;
            if (Math.abs(l - e.offsetX) < tl / text.length - 1) {
                //  offset = i;
                break;
            }
        }
        return Math.round(offset);
    }
    selecting: boolean = false;
    selection: ISelection;

}