import componentsTemplate from "./components.js";
import { getCurPage, renderComponent, renderPageByCatalogKey } from "./main.js";
import dataCatalog from "./dataCatalog.js";
import title_data from "./titleData.js";
import map_data from "./map.js";
export function getComponentTempateByType(type) {

    for (var i = 0; i < componentsTemplate.length; i++) {
        var component = componentsTemplate[i];
        if (component.type == type) {
            return component;
        }
    }
    return undefined;
}

/**
 * 更新组件
 * @param component 
 */
export function updateComponent(component) {

    var componentDiv = document.getElementById(component.key);
    if (componentDiv != undefined) {
        renderComponent(undefined, component, undefined, undefined, undefined, componentDiv);
    }

}
export function findCurPageComponent(path) {

    var rs;
    var page = getCurPage();
    if (page == undefined || page.children == undefined || page.children.length == 0)
        rs = undefined;
    else {
        var keys = path.split("/");
        if (keys.length == 1) {
            rs = page.children.find(c => c.key == keys[0]);

        } else {

            var parent = page;
            keys.forEach(key => {
                if (parent != undefined) {

                    parent = parent.children.find((c) => c.key == key);

                }
            })
            rs = parent;
        }
    }
    if (rs != undefined)
        return rs


    return findCurTitleComponent(path);
}


function findCurTitleComponent(path) {
    console.log("findCurTitleComponent", title_data);
    if (title_data == undefined || title_data.page == undefined || title_data.page.children == undefined) {
        return undefined;
    }

    var keys = path.split("/");
    if (keys.length == 1) {
        return title_data.page.children.find(c => c.key == keys[0]);
    }
    var parent = title_data.page;
    if (parent == undefined) {
        return undefined;
    }
    keys.forEach(key => {
        if (parent != undefined)
            parent = parent.children.find((c) => c.key == key);
    })
    return parent;
}


function findComponent(list, key) {
    var obj = list.find(c => c.key == key);
    if (obj == undefined) {
        for (var i = 0; i < list.length; i++) {
            var c = list[i];
            if (c.children != undefined && c.children.length > 0) {
                var rs = findComponent(c.children, key);
                if (rs != undefined) return rs;
            }
        }

    } else {
        return obj;
    }
    return undefined;
}

export function cal_catolog(catolog) {

    var item = dataCatalog[catolog];
    if (Object.prototype.toString.call(item) === '[object Object]') {

        return item.x;
    } else if (Object.prototype.toString.call(item) === '[object Array]') {

        return item;
    }

}
//cal_data('月份','n','list'','0','100','2')
export function cal_data(dataType, arrayType, outType, mins, maxs, floats) {

    var min = parseFloat(mins);
    var max = parseFloat(maxs);
    var float = parseInt(floats);
    if (dataCatalog != undefined && dataType.length > 0 && arrayType.length > 0 && outType.length > 0) {

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

export function loadChart(chart, component, isMap) {
    // console.log("loadChart---", component.key, isMap);
    setTimeout(() => {
        try {


            var theme = document.getElementById("app").className;


            //            console.log("renderChart ", theme);
            var data = [];
            if (isMap) {
                //geo
                var map = "";
                if (eval(component.option).geo != undefined) {

                    map = eval(component.option).geo.map;


                } else {
                    map = eval(component.option).series[0].map;

                }
                var mapName = map.replace(".json", "");

                echarts.registerMap(map, map_data[mapName]);
                //获取地图数据

                map_data[mapName].features.forEach((fea) => {
                    var name = fea.properties.name;
                    var value = Math.round(Math.random() * 100);
                    data.push({
                        name: name,
                        value: value
                    });
                });

            }

            chart.innerHTML = "";
            var myChart = echarts.init(chart, theme, { renderer: "svg" });
            var option;
            if (component.option != undefined) {
                // console.log(component.option);
                eval(component.option);
                if (data.length > 0 && option.series != undefined && option.series[0] != undefined && option.series[0].data.length == 0) {
                    option.series[0].data = data;
                }
                if (option.tooltip == undefined)
                    option.tooltip = { trigger: "axis" };
                // console.log(option);
                myChart.setOption(option);
                myChart.resize();
            }

        } catch (error) {
            console.error(error);
        }
    }, 100);
}