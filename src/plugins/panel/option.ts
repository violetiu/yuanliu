/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  选项标签
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IComponent, IPanel } from "../../common/interfaceDefine";
import { ipcRendererSend } from "../../preload";
import * as form from "../../render/form";
import { pushHistory } from "../../render/history";
import { findCurPageComponent, getCurPage, getSelectComponents } from "../../render/workbench";
import { showMessageBox } from "../../render/workspace";

import { Editor } from "../../editor/editor";
import { getEchartSuggestions } from "../../echarts/echartsSuggestion";
const panel: IPanel = {
    key: "option", name: "选项", hidden: true, sort: 2,
    render: (content: HTMLElement) => {
        var flex = document.createElement("div");
        content.appendChild(flex);
        flex.style.display = "flex";
        flex.style.height = "100%";
        renderChartOption(flex);
        renderChartData(flex);
    },
    update: () => {

        var sl = getSelectComponents();
        console.log("SL", sl);
        if (sl != undefined && sl.length == 1) {

            var cmpt = findCurPageComponent(sl[0]);


            loadComponentsCode(cmpt);
        }



    }

}
export default function load() {
    return panel;
}

var dataCatalog: any;
export function getDataCatalog() {
    return dataCatalog;
}
function renderChartData(content: HTMLElement) {
    var chartData = document.createElement("div");
    chartData.className = "chartData";
    chartData.style.flex = "1";
    chartData.style.paddingLeft = "10px";
    chartData.style.paddingRight = "10px";
    //   codeEdior.contentEditable = "true";
    content.appendChild(chartData);
    //DATA
    var dataType = "";

    var max = 100;
    var min = 0;
    var arrayType = "n";
    var outType = "list";
    var float = 2;

    var row0 = document.createElement("div");
    chartData.appendChild(row0);
    var dataTypeDiv = form.createDivRow(row0);
    var dataCatalogSelect = form.createDivSelect(dataTypeDiv, "数据类别", "", [], (value) => {
        dataType = value;
    }, [{
        id: "self",
        label: "自定义", icon: "bi bi-pencil-square", onclick: () => {
            ipcRendererSend("editDataCatolog");

        }
    }, { id: "ref", label: "刷新", icon: "bi bi-arrow-clockwise", onclick: () => { ipcRendererSend("readDataCatolog"); } }]);

    ipcRendererSend("readDataCatolog");

    ipcRenderer.on("_readDataCatolog", (event, data) => {
        dataCatalogSelect.innerHTML = "";
        dataCatalog = data;

        for (var key in data) {
            if (dataType == "") dataType = key;
            var op = document.createElement("option");
            op.value = key;
            op.text = key;
            dataCatalogSelect.appendChild(op);
        }


    });

    var row = document.createElement("div");
    chartData.appendChild(row);




    var minDiv = form.createDivRow(row, true);
    form.createDivNumber(minDiv, "最小值", "1", (value) => {
        try {
            min = parseFloat(value);
        } catch (e) {
            showMessageBox("必须是数字", "error");
        }
    });
    var maxDiv = form.createDivRow(row, true);
    form.createDivNumber(maxDiv, "最大值", "100", (value) => {
        try {
            max = parseFloat(value);
        } catch (e) {
            showMessageBox("必须是数字", "error");
        }

    });
    var typeDiv = form.createDivRow(row);
    form.createDivSelect(typeDiv, "数组类型", "n", [{ text: "正常", value: "n" }, { text: "累加", value: "p" }, { text: "类减", value: "s" }], (value) => {
        arrayType = value;
    });

    var row1 = document.createElement("div");
    chartData.appendChild(row1);
    var outTypeDiv = form.createDivRow(row1, true);
    form.createDivSelect(outTypeDiv, "输出类型", "1", [{ text: "数组", value: "list" }, { text: "对象数组", value: "objlist" }], (value) => {
        outType = value;
    });
    var floatDiv = form.createDivRow(row1);
    form.createDivNumber(floatDiv, "输出精度", "2", (value) => {
        try {
            float = parseInt(value);
        } catch (e) {
            showMessageBox("必须是数字", "error");
        }
    });

    //add 
    form.createDivIcon(chartData, "bi bi-calculator", 13, () => {
        if (dataCatalog != undefined && dataType.length > 0 && arrayType.length > 0 && outType.length > 0) {
            var output: string = "cal_catolog('" + dataType + "')\n";

            var data = dataCatalog[dataType];
            if (Object.prototype.toString.call(data) === '[object Object]') {
                var xlist = data.x;
                var ylist = [];
                var ySum = 0;
                for (var i = 0; i < data.y.length; i++) {
                    ySum += data.y[i];
                }
                for (var i = 0; i < data.y.length; i++) {
                    var v = min + (max - min) * data.y[i] / ySum;
                    v = parseFloat(v.toFixed(float));
                    ylist.push(v);
                }
                output += JSON.stringify(xlist) + "\n";
                output += "cal_data('" + dataType + "','" + arrayType + "','" + outType + "'" + ",'" + min + "','" + max + "','" + float + "')\n";
                output += JSON.stringify(ylist) + "\n";


            } else if (Object.prototype.toString.call(data) === '[object Array]') {
                var xlist = data;
                var ylist = [];
                var slist = [];
                var sum = 0;
                var blist = [];
                var sub;
                for (var i = 0; i < xlist.length; i++) {
                    var v = Math.random() * (max - min) + min;
                    v = parseFloat(v.toFixed(float));
                    sum += v;
                    if (sub == undefined) {
                        sub = v;
                    } else {
                        sub -= v;
                    }
                    ylist.push(v);
                    slist.push(sum);
                    blist.push(sub);
                }

                if (outType == "list") {
                    output += JSON.stringify(xlist) + "\n";
                    output += "cal_data('" + dataType + "','" + arrayType + "','" + outType + "'" + ",'" + min + "','" + max + "','" + float + "')\n";
                    if (arrayType == "n") {
                        output += JSON.stringify(ylist) + "\n";
                    } else if (arrayType == "p") {
                        output += JSON.stringify(slist) + "\n";
                    } else if (arrayType == "s") {
                        output += JSON.stringify(blist) + "\n";
                    }
                } else if (outType == "objlist") {
                    output += "cal_data('" + dataType + "','" + arrayType + "','" + outType + "'" + ",'" + min + "','" + max + "','" + float + "')\n";
                    var list = [];
                    for (var i = 0; i < xlist.length; i++) {
                        var text = xlist[i];
                        var value = 0;
                        if (arrayType == "n") {
                            value = ylist[i];
                        } else if (arrayType == "p") {
                            value = slist[i];
                        } else if (arrayType == "s") {
                            value = blist[i];
                        }
                        list.push({ name: text, value: value });
                    }
                    output += JSON.stringify(list) + "\n";

                }

            }






            result.value = output;



        } else {
            result.value = "错误";
            showMessageBox("请选择", "error");
        }

    });

    var result = document.createElement("textarea");
    result.style.minHeight = "40px";
    result.style.width = "90%";
    result.style.fontSize = "10px";
    chartData.appendChild(result);

}
function renderChartOption(content: HTMLElement) {
    var codeEdior = document.createElement("div");
    codeEdior.className = "optionEdior";
    codeEdior.style.flex="1";
    codeEdior.style.height = "inherit";
    codeEdior.id = "optionEdior";
    //   codeEdior.contentEditable = "true";
    content.appendChild(codeEdior);
    //console.log(ace);

    editor = new Editor(codeEdior, (lines) => {
        //
        var component = editorComponent;
        component.option = lines;
        try {
            var ele = document.getElementById(component.key);
            component.onRender(component, ele);
            pushHistory(getCurPage());
        } catch (error) {
            console.log(error);
        }
    });



    editor.highLights = [{
        match: /([A-z]+) ?=/,
        color: "#09f"
    }, {
        match: /"([^"]+)":/,
        color: "var(--theme-color)"
    }, {
        match: /([A-z]+):/,
        color: "var(--theme-color)"
    }, {
        match: /"([^"]+)"/,
        color: "#a31515"
    }, {
        match: /'([^']+)'/,
        color: "#a31515"
    }, {
        match: /(\d+)/,
        color: "#098658"
    }, ];




}




var editor: any;
var editorComponent: any;
function loadComponentsCode(component: IComponent) {
    if (component != undefined && component.option != undefined) {
        editorComponent = component;
        if (component.group == "chart") {
            editor.suggestions = getEchartSuggestions();
        } else {
            editor.suggestions = [];
        }
        editor.setValue(component.option);
        editor.resize();
    } else {

    }



}