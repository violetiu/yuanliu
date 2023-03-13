/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

渲染echarts图表
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IComponent } from "../common/interfaceDefine";
import { getDataCatalog } from "../plugins/panel/option";
import { ipcRendererSend } from "../preload";
import { getCurPage } from "./workbench";
import { getProject } from "./workspace";

export function loadChart(chart: HTMLElement, component: IComponent, isMap?: boolean) {
    // console.log("loadChart---",component.key,isMap);
    
    setTimeout(() => {
        try {

            var theme = "default";
            if (getProject().theme == "dark") {
                theme = "dark";
            }
            //    regeditTheme()
          //  console.log("renderChart ", theme,isMap);
            var echarts = require("echarts");
            if (isMap) {

                //geo
                var map="";
                if(eval(component.option).geo!=undefined){

                    map=eval(component.option).geo.map;
                    console.log(eval(component.option).geo);

                }else{
                    map= eval(component.option).series[0].map;

                }

              
                if (map != undefined) {
                    ipcRendererSend("loadMap", map);
                    ipcRenderer.on("_loadMap", (event, arg) => {
                        console.log("_loadMap", arg);
                        ipcRenderer.removeAllListeners("_loadMap");
                        echarts.registerMap(map, arg);
                        //获取地图数据
                        var data: any = [];
                        arg.features.forEach((fea: any) => {
                            var name = fea.properties.name;
                            var value = Math.round(Math.random() * 100);
                            data.push({
                                name: name, value: value
                            });
                        });

                        //
                        var myChart = echarts.init(chart, theme, { renderer: "svg" });
                        myChart._$eventProcessor=undefined
                        var el:any=chart.children.item(0);
                        el.style.pointerEvents="none";
                        myChart.clear();
                        var option: any;
                        if (component.option != undefined) {
                            eval(component.option);
                            if (option.series!=undefined&& option.series[0]!=undefined&&option.series[0].data.length == 0) {
                                option.series[0].data = data;
                            }
                            myChart.setOption(option);
                            myChart.resize();
                        }
                    });
                }



            } else {
                var myChart = echarts.init(chart, theme, { renderer: "svg" });
                myChart._$eventProcessor=undefined
                var el:any=chart.children.item(0);
                el.style.pointerEvents="none";
               
                myChart.clear();
                var option;
                if (component.option != undefined) {
                    eval(component.option);
                    myChart.setOption(option);
                    myChart.resize();
                }
            }

        } catch (error) {
            console.log(error);
        }
    }, 100);

}
//TODO  chart option  获取 数据

function cal_catolog(catolog: string) {

    var dataCatalog = getDataCatalog();

    var item = dataCatalog[catolog];

    if (Object.prototype.toString.call(item) === '[object Object]') {

        return item.x;
    } else if (Object.prototype.toString.call(item) === '[object Array]') {

        return item;
    }



}
//cal_data('月份','n','list'','0','100','2')
function cal_data(dataType: string, arrayType: string, outType: string, mins: string, maxs: string, floats: string) {

    var min = parseFloat(mins);
    var max = parseFloat(maxs);
    var float = parseInt(floats);

    var dataCatalog = getDataCatalog();
    if (dataCatalog != undefined && dataType.length > 0 && arrayType.length > 0 && outType.length > 0) {

        var data = dataCatalog[dataType];
        if (Object.prototype.toString.call(data) === '[object Object]') {

            var xlist = data.x;
            var ylist = [];
            var ySum = 0;
            for (var i = 0; i < data.y.length; i++) {
                ySum+= data.y[i];
            }
            for (var i = 0; i < data.y.length; i++) {
                var v=min+(max-min)*data.y[i] / ySum;
                v = parseFloat(v.toFixed(float));
                ylist.push(v);
            }
            return ylist;
        } else if (Object.prototype.toString.call(data) === '[object Array]') {

            var xlist = dataCatalog[dataType];
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
                slist.push(parseFloat(sum.toFixed(float)));
                blist.push(parseFloat(sub.toFixed(float)));
            }

            if (outType == "list") {

                if (arrayType == "n") {
                    return ylist;
                } else if (arrayType == "p") {
                    return slist;
                } else if (arrayType == "s") {
                    return blist;
                }
            } else if (outType == "objlist") {

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
                return list;

            }
        }
        return undefined;




    }

}