import { getCurPage, renderPage, renderPageByCatalogKey, updateBlueView, renderComponents, renderComponent } from "./main.js";
import { findCurPageComponent, updateComponent } from "./component.js";
import project_data from "./projectData.js";
import pages_data from "./pagesData.js";
import database from "./database.js";
// import * as xl from './xlsx.mjs';
/**
 * 加载 蓝图
 * @param {*} blues 
 * @param {*} links 
 */
export function loadBlueprint(blues, links) {
    console.log("loadBlueprint");
    links.forEach(link => {
        try {
            console.log("########loadLink#######");
            console.log(link);
            var from = link.from;
            console.log("from", from);
            if (from.type == "event") {
                var fromBlue = blues.find(b => b.key == from.blue);
              
                // console.log(getCurPage().children);
                if(fromBlue==undefined){
                    console.log("fromBlue", fromBlue,blues,from.blue);
                }else
                if (fromBlue.type == "page") {
                    blue_page(link, from, fromBlue, blues, links);
                } else if (fromBlue.type == "project") {

                } else if (fromBlue.type == "window") {

                } else if (fromBlue.type == "lines") {

                } else {
                    blue_component(link, from, fromBlue, blues, links);
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
    renderLines(links, blues);
}

function renderLines(links, blues) {
    console.log("renderLines");
    var pageView = document.getElementById("pageView");
    var page = pageView.children.item(0);
    if (page == undefined) {
        console.log("page is undefined")
        return;
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.style.height = page.clientHeight + "px";
    svg.style.width = page.clientWidth + "px";
    svg.style.zIndex = "-1";
    page.appendChild(svg);

    blues.forEach(blue => {
        if (blue.type == "lines") {
            //计算一个连线
            var points = [];
            var lineLinks = links.filter(l => l.from.blue == blue.key);
            console.log("lineLinks", lineLinks);
            lineLinks.forEach(lineLink => {
                var blue = blues.find(b => b.key == lineLink.to.blue)
                if (blue != undefined) {
                    var compt = findCurPageComponent(blue.component);
                    if (compt != undefined) {
                        var comptDiv = document.getElementById(compt.key);

                        var point = [comptDiv.getBoundingClientRect().left, comptDiv.getBoundingClientRect().top, comptDiv.clientWidth, comptDiv.clientHeight];
                        points.push(point);
                    }
                }
            });

            //排序
            points.sort((a, b) => a[1] - b[1]);
            console.log(points);
            //开始绘制
            for (var i = 0; i < points.length - 1; i++) {
                var start = points[i];
                var end = points[i + 1];
                var startX = start[0] + start[2] / 2;
                var startY = start[1] + start[3] + 10;

                var endX = end[0] + end[2] / 2;
                var endY = end[1] - 10;
                var rate = 0.2;

                var pointAX = startX;
                var pointAY = (endY - startY) * (1 - rate);
                var pointBX = endX;
                var pointBY = (endY - startY) * (1 - rate);

                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");


                var d = "M" + startX + " " + startY + "L" + pointAX + " " + pointAY + " " + pointBX + " " + pointBY + " " + endX + " " + endY;

                var stroke = "var(--theme-color)";
                path.setAttribute("d", d);
                path.setAttribute("style", "fill:none;stroke:" + stroke + ";stroke-width:1px;stroke-linejoin:round;");

                svg.appendChild(path);


            }
            //绘制端点
            {
                var start = points[0];
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                var startX = start[0] + start[2] / 2;
                var startY = start[1] + start[3] + 10;

                var stroke = "var(--theme-color)";
                circle.setAttribute("cx", startX);
                circle.setAttribute("cy", startY);
                circle.setAttribute("r", 5);
                circle.setAttribute("style", "fill:" + stroke + ";stroke:" + stroke + ";stroke-width:1px;");

                svg.appendChild(circle);
            } {
                var end = points[points.length - 1];
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                var endX = end[0] + end[2] / 2;
                var endY = end[1] - 10;
                var stroke = "var(--theme-color)";
                circle.setAttribute("cx", endX);
                circle.setAttribute("cy", endY);
                circle.setAttribute("r", 5);
                circle.setAttribute("style", "fill:" + stroke + ";stroke:" + stroke + ";stroke-width:1px;");

                svg.appendChild(circle);
            }

        }

    });







}

function blue_page(link, from, fromBlue, blues, links) {
    console.log("blue_page");
    if (from.name == "onload") {

        //   requestIdleCallback(() => {
        var action = createAction(link, blues, links);
        action();
        //   });

        // setTimeout(() => {

        //     var action = createAction(link, blues, links);
        //     action();
        // }, 500);
    }
}
var expands = [];
export function clearExpands() {

    expands.forEach(key => {
        var ele = document.getElementById(key);
        if (ele != undefined) {
            ele.remove();
        }
    })

}
//注册事件
function createAction(link, blues, links) {
    var action = (args) => {
        console.log("action", args);
        var to = link.to;
        console.log("to", to);
        console.log("link", link);
        var toBlue = blues.find(b => b.key == to.blue);
        console.log("toBlue", toBlue);
        if (to.type == "property") {
            //组件 属性
            if (toBlue.type == "component") {
                var toComponent = findCurPageComponent(toBlue.component);
                var toComponentProperty = toComponent.blue.property[to.name];
                if (args != undefined) {
                    toComponentProperty.set(toComponent, toComponentProperty, args);
                } else {
                    //计算属性值
                    cal_property(link, to, toBlue, blues, links);
                    console.log(blues);
                    // toComponentProperty.set(toComponent, args);
                }
            }
        } else if (to.type == "method") {
            //组件 方法
            if (toBlue.type == "component") {
                if (to.name == "toggle") {
                    var toComponent = findCurPageComponent(toBlue.component);

                    //如果是扩展组件
                    if (toComponent.isExpand) {
                        if (toComponent.hidden == undefined) {
                            toComponent.hidden = true;
                        }
                        toComponent.hidden = !toComponent.hidden;
                        try {
                            //   console.log("删除扩展组件", toComponent.type);
                            if (toComponent.type == "dialog") {
                                document.getElementById("dialog" + toComponent.key).remove();
                            } else {
                                document.getElementById(toComponent.key).remove();
                            }

                        } catch (ex) {

                        }
                        console.log(toComponent.hidden);
                        if (!toComponent.hidden) {

                            renderComponent(document.getElementById("app"), toComponent);
                            if (expands.findIndex(p => p == toComponent.key) < 0) {
                                expands.push(toComponent.key);
                            }
                            // toComponent.hidden = true;
                            var paths = hasComponentPathEach(toComponent);
                            console.log("paths",paths);
                            setTimeout(() => {
                                //更新 隐藏部分的blue
                                getCurPage().blueLinks.forEach(hiddenLink => {
                                    var hideFrom = hiddenLink.from;

                                    if (hideFrom.type == "event") {
                                        var hideFromBlue = getCurPage().blues.find(b => b.key == hideFrom.blue);

                                        if (paths.indexOf(hideFromBlue.component) >= 0) {


                                            // console.log(getCurPage().children);
                                            if (hideFromBlue.type == "page") {

                                            } else if (hideFromBlue.type == "project") {

                                            } else if (hideFromBlue.type == "window") {

                                            } else {
                                                blue_component(hiddenLink, hideFrom, hideFromBlue, getCurPage().blues, getCurPage().blueLinks);
                                            }

                                        }


                                    }

                                })

                                // loadBlueprint(getCurPage().blues, getCurPage().blueLinks);

                            }, 100);
                        }


                    } else {
                        if (toComponent.hidden == undefined) {
                            toComponent.hidden = false;

                        }
                        toComponent.hidden = !toComponent.hidden;
                        console.log(toComponent.hidden);
                        var toComponentDiv = document.getElementById(toComponent.key);
                        toComponentDiv.className = "";
                        toComponentDiv.innerHTML = "";
                        toComponentDiv.style.display="block";
                        console.log(toComponent,toComponentDiv);
                        renderComponent(undefined, toComponent, undefined, 0, toComponentDiv);
                        if (!toComponent.hidden) {

                            var paths = hasComponentPathEach(toComponent);
                            console.log("path2",paths);
                            //
                            setTimeout(() => {
                                //更新 隐藏部分的blue
                                getCurPage().blueLinks.forEach(hiddenLink => {
                                    var hideFrom = hiddenLink.from;

                                    if (hideFrom.type == "event") {
                                        var hideFromBlue = getCurPage().blues.find(b => b.key == hideFrom.blue);
                                        console.log(hideFromBlue.component);
                                        if (paths.indexOf(hideFromBlue.component) >= 0) {


                                            // console.log(getCurPage().children);
                                            if (hideFromBlue.type == "page") {

                                            } else if (hideFromBlue.type == "project") {

                                            } else if (hideFromBlue.type == "window") {

                                            } else {
                                                blue_component(hiddenLink, hideFrom, hideFromBlue, getCurPage().blues, getCurPage().blueLinks);
                                            }

                                        }


                                    }

                                })

                                // loadBlueprint(getCurPage().blues, getCurPage().blueLinks);

                            }, 100);
                        } else {
                            toComponentDiv.style.display = "none";
                        }


                    }




                    // if (toComponentDiv.style.display == undefined || toComponentDiv.style.display == "none") {
                    //     if (toComponent.type == "row" || toComponent.type == "dialog") {
                    //         toComponentDiv.style.display = "flex";
                    //     } else {
                    //         toComponentDiv.style.display = "block";

                    //         toComponent.onRender(toComponent, toComponentDiv);

                    //     }
                    // } else {
                    //     toComponentDiv.style.display = "none";
                    // }
                }
            } else if (toBlue.type == "catalog") {
                //页面导航
                console.log("navigate", toBlue.component);
                var c = find_catalog_by_key(project_data.catalogs, toBlue.component);
                console.log(c);
                var p = pages_data.find(p => p.path == c.path);
                console.log(p);
                document.title = p.name;
                window.location.hash = p.key;
                renderPageByCatalogKey(c.key);
                updateBlueView();

            } else if (toBlue.type == "database") {
                console.log("database", toBlue.component, to);
                var result;
                if (to.name == "save") {
                    //获取需要保存的数据，获取上个节点，如果是数据集，则执行
                    database_save(toBlue, links, blues);
                    var table = database.tables.find(p => p.key == toBlue.component);
                    result = table.data;
                } else if (to.name == "query") {
                    var table = database.tables.find(p => p.key == toBlue.component);
                    result = table.data;
                } else if (to.name == "delete") {}
                database_result(result, toBlue, links, blues);
            } else if (toBlue.type == "link") {
                //链接
                console.log("link", toBlue);
                var toLink = links.find(l => l.to.blue == toBlue.key && l.key != link.key);
                if (toLink != undefined) {
                    var urlBlue = blues.find(b => b.key == toLink.from.blue);
                    var url = urlBlue.value;
                    window.location.href = url;
                }
            } else if (toBlue.type == "upload") {
                //链接
                console.log("upload", toBlue);
                openFileDialog((data) => {
                    console.log(data);


                });

            } else if (toBlue.type == "download") {
                //链接

                dowloadExcel();
            } else if (toBlue.type == "loadding") {
                //显示加载动画
                showLoadding();
            }
        }
    };
    return action;
}

function dowloadExcel() {
    var blob = new Blob([], { type: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(blob, "data.xlsx");
}

function openFileDialog(open) {
    var input = document.createElement("input");
    input.style.display = "none";
    document.body.appendChild(input);
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.click();
    input.onchange = () => {
        if (input.files != undefined && input.files.length > 0) {
            var file = input.files[0];
            file.arrayBuffer().then((buffer) => {
                var workbook = XLSX.read(buffer, { type: "buffer" });
                console.log(workbook.Sheets);
                var sheetData;
                for (var key in workbook.Sheets) {
                    sheetData = workbook.Sheets[key];
                    break;
                }
                var sheetArray = [];
                for (var key in sheetData) {

                    var item = sheetData[key];
                    if (key == "!ref") {

                        var col = item.split(":")[1].match(/[A-Z]+/)[0];
                        var colNum = 0;
                        for (var c = 0; c < col.length; c++) {
                            var ch = col.codePointAt(c);

                            colNum += c * 26 + (ch - 'A'.charCodeAt(0));
                        }
                        var row = item.split(":")[1].match(/[0-9]+/)[0];

                        for (var i = 0; i <= parseInt(row) - 1; i++) {
                            var tmp = [];
                            for (var j = 0; j <= col; j++) {
                                tmp.push(null);
                            }
                            sheetArray.push(tmp);
                        }
                    } else if (!key.startsWith("!")) {
                        var keyVal = key != null ? key.toString() : "";
                        var match = keyVal.match(/[A-Z]+/);
                        var col = match != null ? match[0] : "";
                        var colNum = 0;
                        for (var c = 0; c < col.length; c++) {
                            var ch = col.codePointAt(c);
                            colNum += c * 26 + (ch - 'A'.charCodeAt(0));
                        }
                        var match1 = keyVal.match(/[0-9]+/);
                        var row = match1 != null ? match1[0] : "0";

                        sheetArray[parseInt(row) - 1][colNum] = item.v;


                    }
                }

                if (sheetArray != undefined) {
                    open(sheetArray);
                }

            });




        }



    }

}

function database_save(dbblue, links, blues) {
    console.log("database_save");
    var sublinks = links.filter(l => l.to.blue == dbblue.key && l.to.name == "save");
    console.log("sublinks", sublinks);
    sublinks.forEach(link => {
        var from = link.from;
        console.log("from", from);
        var fromBlue = blues.find(b => b.key == from.blue);
        //     console.log("fromBlue", fromBlue);
        if (fromBlue.type == "hub") {
            console.log("hub", fromBlue);
            database_hub(fromBlue, blues, links);
            database_save_hub(fromBlue, dbblue, links, blues);
        }
    });
}

function database_save_hub(hub, dbblue, links, blues) {
    var table = database.tables.find(p => p.key == dbblue.component);
    console.log("table", table);
    var heads = table.data[0];
    console.log("heads", heads);
    var row = [];
    for (var i = 0; i < heads.length; i++) {
        var head = heads[i];
        var out = hub.properties.find(p => p.name == head && p.type == "out");
        if (out != undefined) {
            row.push(out.value);
        } else {
            row.push(undefined);
        }
        console.log("out", head, out.value);
    }
    console.log("row", row);
    table.data.push(row);
}

function database_hub(hubBlue, blues, links) {
    //计算数据集的输入
    hubBlue.properties.forEach(p => {
        if (p.name != "in" && p.name != "out" && p.type == "in") {
            var sublinks = links.filter(l => l.to.blue == hubBlue.key && l.to.name == p.name);
            sublinks.forEach(link => {
                cal_property(link, link.to, hubBlue, blues, links);
            });
        }
    });
    //输入 和输出同步
    hubBlue.properties.forEach(p => {
        if (p.name != "in" && p.name != "out" && p.type == "in") {
            var out = hubBlue.properties.find(p => p.name == p.name && p.type == "out");
            out.value = p.value;
        }
    });
}
/**
 * 执行 数据库操作 返回数据
 * @param {*} result 
 * @param {*} toDbBlue 
 */
function database_result(result, toB, links, blues) {
    console.log("database_result", result);
    var subLinks = links.filter(l => l.from.blue == toB.key && l.from.name == "result");
    console.log("subLinks", subLinks);
    subLinks.forEach(link => {
        var to = link.to;
        console.log("to", to);
        var toBlue = blues.find(b => b.key == to.blue);
        if (toBlue.type == "hub") {
            var hubData = {};
            for (var i = 0; i < result[0].length; i++) {
                hubData[result[0][i]] = [];
                for (var j = 1; j < result.length; j++) {
                    hubData[result[0][i]].push(result[j][i]);
                }
            }
            console.log(hubData);
            //寻找 数据集 的输出
            // toBlue.properties.forEach(p => {})
            var hubOutLinks = links.filter(l => l.from.blue == toBlue.key);
            console.log("hubOutLinks", hubOutLinks);
            var outComponents = [];
            hubOutLinks.forEach(outLink => {
                //将数据集输出到表格或图形
                var outBlue = blues.find(b => b.key == outLink.to.blue);
                console.log("outBlue", outBlue, outLink);
                if (outBlue.type == "table") {

                } else if (outBlue.type == "component") {
                    var outComponent = findCurPageComponent(outBlue.component);
                    if (outComponents.findIndex(c => c.key == outComponent.key) < 0)
                        outComponents.push(outComponent);
                    console.log("outComponent", outComponent);
                    console.log("setdata", hubData[outLink.from.name], outLink.name, hubData);
                    var outPro = outComponent.blue.property[outLink.to.name];
                    console.log("outPro", outPro);
                    outPro.set(outComponent, outPro, hubData[outLink.from.name]);
                }
            });
            outComponents.forEach(outComponent => {
                outComponent.onRender(outComponent, document.getElementById(outComponent.key), undefined);
            })
        } else if (toBlue.type == "component") {
            if (to.type == "property") {
                //组件 属性
                if (toBlue.type == "component") {
                    var toComponent = findCurPageComponent(toBlue.component);
                    var toComponentProperty = toComponent.blue.property[to.name];
                    console.log(result);
                    toComponentProperty.set(toComponent, toComponentProperty, result);
                }
            }
        }
    });
}

function blue_component(link, from, fromBlue, blues, links) {
    console.log("from.name", from.name);
    var fromComponent = findCurPageComponent(fromBlue.component);
    console.log("fromComponent", fromComponent);
    if (fromComponent != undefined) {
        var fromComponentEvents = fromComponent.blue.event;
        console.log("fromComponentEvents", fromComponentEvents);
        var fromEvent = fromComponentEvents[from.name];
        console.log("fromEvent", fromEvent);
        //注册事件
        var action = createAction(link, blues, links);
        fromEvent.on = action;
    }
}

function cal_property(link, to, toBlue, blues, links) {
    //查询是否存在其他链接
    var subLinks = links.filter(l => l.to.blue == toBlue.key && l.to.name == to.name);
    console.log("-----cal_property-----", subLinks);
    if (subLinks == undefined || subLinks.length == 0) {
        return;
    }
    //构建 链接 队列
    var linkQueue = [];
    console.log("------构建连接队列-----");
    link_Queue(link, blues, links, linkQueue);
    console.log("------开始计算队列 size-----", linkQueue.length);
    if (linkQueue.length == 0) {
        //如果没有发现，则尝试计算本身
        linkQueue.push(link);
    }
    //计算 链接 树
    link_Queue_cal(linkQueue, blues)
    console.log("cal_property");
}

function link_Queue(link, blues, links, linkQueue) {
    console.log("-->", link);
    var subLinks = links.filter(l => l.to.blue == link.to.blue && l.to.name == link.to.name);
    if (subLinks == undefined || subLinks.length == 0) {
        console.log(">return");
        return;
    }
    subLinks.forEach(subLink => {

        if (subLink.key != link.key && subLink.from.type != "event") {
            linkQueue.push(subLink);
            var fromBlue = blues.find(b => b.key == subLink.from.blue);
            console.log("push", fromBlue.name);
            if (fromBlue.type == "method") {
                //如果是方法,查找方法的输入
                var ins = fromBlue.properties.filter(p => p.type == "in");
                //console.log("ins", ins);
                var inslinks = [];
                ins.forEach(it => {
                    var tmp = links.filter(l => l.to.blue == fromBlue.key && l.to.name == it.name);
                    tmp.forEach(t => {
                        console.log("push", t.from.name);
                        inslinks.push(t);
                    });
                });
                console.log("inslinks", inslinks);
                inslinks.forEach(inslink => {
                    linkQueue.push(inslink);
                    link_Queue(inslink, blues, links, linkQueue);
                });
            } else {
                link_Queue(subLink, blues, links, linkQueue);
            }
        }
    });
}

function link_Queue_cal(linkQueue, blues) {
    for (var i = linkQueue.length - 1; i >= 0; i--) {
        var subLink = linkQueue[i];
        console.log(i, "########计算链接######", subLink);
        //依次计算因子
        //from
        var from = subLink.from;
        var fromBlue = blues.find(b => b.key == from.blue);
        var value;


        //to
        var to = subLink.to;
        var toBlue = blues.find(b => b.key == to.blue);


        console.log(fromBlue.name, "-->", toBlue.name);

        console.log("fromBlue", fromBlue);
        console.log("toBlue", toBlue);
        if (fromBlue.type == "component") {
            //组件
            var fromComponent = findCurPageComponent(fromBlue.component);
            console.log("fromComponent", fromComponent);
            var fromComponentProperty = fromComponent.blue.property;
            if (fromComponentProperty != undefined) {
                console.log("fromComponentProperty", fromComponentProperty);
                var fromProperty = fromComponentProperty[from.name];
                value = fromProperty.get(fromComponent, fromProperty);
            } else if (fromComponent.blue.properties != undefined) {
                var fromComponentPropertys = fromComponent.blue.properties(fromComponent);
                if (fromComponentPropertys != undefined) {
                    var fromComponentProperty1 = fromComponentPropertys.find(p => p.key == from.name);
                    if (fromComponentProperty1 != undefined) {
                        value = fromComponentProperty1.get(fromComponent, fromComponentProperty1);
                    }
                }
            }
        } else if (fromBlue.type == "method") {
            //方法
            value = cal_method(fromBlue);
        } else if (fromBlue.type == "variable") {
            //变量
            console.log("变量", fromBlue);
            value = fromBlue.value;
        } else if (fromBlue.type == "matrix") {
            //矩阵变量
            console.log("矩阵变量", fromBlue);
            value = eval(fromBlue.value);
        } else if (fromBlue.type == "page") {
            var page = getCurPage();
            if (from.name == "dir") {
                console.log("page", fromBlue, from.name);
                value = page["path"].replace(".json", "");
            } else {
                console.log("page", fromBlue, from.name);
                value = page[from.name];
            }

        } else if (fromBlue.type == "catalog") {
            //目录
            console.log("目录", fromBlue);
            value = fromBlue.component;
        } else if (fromBlue.type == "project") {
            console.log("project", fromBlue, from.name);
            value = project_data[from.name];

        } else if (fromBlue.type == "window") {
            console.log("window", fromBlue, from.name);
            value = eval("window." + from.name);
        } else if (fromBlue.type == "date") {
            console.log("date", fromBlue, from.name);
            var today = new Date();
            switch (from.name) {
                case "yyyy":
                    value = today.getFullYear();
                    break;
                case "yyyymm":
                    value = today.getFullYear() + "-" + (today.getMonth() + 1);
                    break;
                case "yyyymmdd":
                    value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDay();
                    break;
                case "yyyymmddhh":
                    value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDay() + " " + today.getHours();
                    break;

            }

        }
        console.log("获取值", fromBlue.name, value);


        if (toBlue.type == "component") {
            //组件
            var toComponent = findCurPageComponent(toBlue.component);
            console.log("toComponent", toComponent);
            console.log(" to.name", to.name);
            console.log("toBlue.properties", toBlue.properties);
            var toComponentProperty = toComponent.blue.property[to.name];
            console.log("toComponentProperty", toComponentProperty);
            if (toComponentProperty != undefined) {
                toComponentProperty.set(toComponent, toComponentProperty, value);
                console.log("设置组件属性", toBlue.name, value);
            } else if (toComponent.blue.properties != undefined) {
                console.log("toComponentProperies");
                var toComponentPropertys = toComponent.blue.properties(toComponent);
                if (toComponentPropertys != undefined) {
                    console.log(toComponentPropertys);
                    var toComponentPropertys1 = toComponentPropertys.find(p => p.key == to.name);
                    console.log(toComponentPropertys1);
                    if (toComponentPropertys1 != undefined) {
                        toComponentPropertys1.set(toComponent, toComponentPropertys1, value);
                    }
                }
            }
        } else if (toBlue.type == "method" || toBlue.type == "hub") {
            //方法
            console.log("方法", to.name);
            var toBlueProperty = getBluePropertyByName(toBlue.properties, to.name);
            console.log(toBlueProperty);
            toBlueProperty.value = value;
        }

        console.log("<", subLink);
    }
}

function getBluePropertyByName(properties, name) {
    return properties.find(p => p.name == name);


}

function cal_method(fromBlue) {
    if (fromBlue.name == "加法") {
        var in1 = parseFloat(fromBlue.properties[0].value);
        var in2 = parseFloat(fromBlue.properties[1].value);
        var result = in1 + in2;
        fromBlue.properties[2].value = result.toString();
        console.log("加法", result);
        return result;
    } else if (fromBlue.name == "乘法") {
        var in1 = parseFloat(fromBlue.properties[0].value);
        var in2 = parseFloat(fromBlue.properties[1].value);
        var result = in1 * in2;
        fromBlue.properties[2].value = result.toString();
        console.log("乘法", result);
        return result;
    } else if (fromBlue.name == "判断") {
        var in1 = parseFloat(fromBlue.properties[0].value);
        var in2 = parseFloat(fromBlue.properties[1].value);
        var result = in1 == in2;
        fromBlue.properties[2].value = result.toString();
        console.log("判断", result);
        return result;
    } else if (fromBlue.name == "拼接字符串") {

        var result = fromBlue.properties[0].value + "" + fromBlue.properties[1].value;
        fromBlue.properties[2].value = result.toString();
        console.log("拼接字符串", result);
        return result;
    } else if (fromBlue.name == "替换字符串") {
        console.log("替换字符串", fromBlue.properties[0].value);
        var result = fromBlue.properties[0].value.replaceAll(fromBlue.properties[1].value, fromBlue.properties[2].value);
        fromBlue.properties[3].value = result.toString();
        console.log("拼接字符串", result);
        return result;
    }
}
/**
 * 在项目目录中。
 * 按照页面key寻找catalog
 * @param {*} catalogs 
 * @param {*} key 
 * @returns 
 */
export function find_catalog_by_key(catalogs, key) {
    for (var i = 0; i < catalogs.length; i++) {
        var catalog = catalogs[i];
        if (catalog.key == key) {
            return catalog;
        }
        if (catalog.children != undefined && catalog.children.length > 0) {
            var result = find_catalog_by_key(catalog.children, key);
            if (result != undefined) {
                return result;
            }
        }
    }
}
export function renderBlueView(blueContext) {
    console.log("renderBlueView", getCurPage());
    if (getCurPage() == undefined || getCurPage().blues == undefined || getCurPage().blues.length < 1) {
        // getCurPage().blues = [blueProject, bluePage];
    } else {
        getCurPage().blueLinks.forEach(link => {
            renderBlueLink(blueContext, link);
        });
        getCurPage().blues.forEach(b => {
            if (b.type == "component") {
                var comp = findCurPageComponent(b.component);
                if (comp != undefined && (comp.isRemoved == undefined || comp.isRemoved == false)) {
                    b.name = comp.label;
                } else {
                    b.name = "已删除组件";
                    b.type = "disabled";
                }
            }
            renderBlue(blueContext, b);
        })
    }
}

function renderBlue(conotent, blue, element) {
    var div = document.createElement("div");
    if (element != undefined) {
        div = element;
    }
    div.className = "blue";
    div.setAttribute("data-type", blue.type);
    div.id = blue.key;
    div.tabIndex = 300;
    if (conotent != undefined)
        conotent.appendChild(div);
    div.style.top = blue.top + "px";
    div.style.left = blue.left + "px";
    div.style.zIndex = "10";
    if (conotent != undefined) {
        if (conotent.clientHeight < blue.top) conotent.style.height = (blue.top + 200) + "px";
        if (conotent.clientWidth < blue.left) conotent.style.width = (blue.left + 200) + "px";
    }
    var titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.className = "blueTitleBar";
    div.appendChild(titleBar);

    if (blue.type == "title") {
        titleBar.style.paddingLeft = "10px";
        titleBar.style.paddingRight = "10px";

    }

    var titleIcon = document.createElement("i");
    titleIcon.style.pointerEvents = "none";
    titleIcon.className = blue.icon;
    if (blue.type != "title")
        titleBar.appendChild(titleIcon);

    var titleName = document.createElement("div");
    titleName.style.pointerEvents = "none";
    titleName.innerText = blue.name;
    titleBar.appendChild(titleName);

    var body = document.createElement("div");
    body.className = "blueBody";
    div.appendChild(body);
    var bodyLeft = document.createElement("div");
    bodyLeft.className = "blueBodyLeft";
    body.appendChild(bodyLeft);
    var bodyRight = document.createElement("div");
    bodyRight.className = "blueBodyRight";
    body.appendChild(bodyRight);
    blue.methods.forEach(method => {
        var row = document.createElement("div");
        row.className = "blueRow";
        var icon = document.createElement("i");
        icon.className = "bi bi-record-circle";
        row.appendChild(icon);
        icon.setAttribute("data-blue", "")
        icon.style.color = "#f09";
        var label = document.createElement("div");
        label.innerText = method.label;
        label.style.flex = "1";
        row.appendChild(label);
        bodyLeft.appendChild(row);
    })
    if (blue.events != undefined)
        blue.events.forEach(event => {

            var row = document.createElement("div");
            row.className = "blueRow";

            var label = document.createElement("div");
            label.style.flex = "1";
            label.style.textAlign = "right";
            label.innerText = event.label;
            row.appendChild(label);

            var icon = document.createElement("i");
            icon.className = "bi bi-record-circle";
            row.appendChild(icon);
            icon.style.color = "#f90";
            icon.setAttribute("data-blue", "")
            bodyRight.appendChild(row);

        })
    if (blue.properties != undefined)
        blue.properties.forEach(prop => {
            if (prop.type == undefined) {
                renderProperty(bodyLeft, "left", prop, blue);
                renderProperty(bodyRight, "right", prop, blue);
            } else if (prop.type == "out") {
                renderProperty(bodyRight, "right", prop, blue);
            } else if (prop.type == "in") {
                renderProperty(bodyLeft, "left", prop, blue);
            }

        })
    return div;
}

function renderBlueLink(conotent, blueLink) {

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.zIndex = "1";
    svg.style.width = (Math.max(blueLink.position.x1, blueLink.position.x0) + 2) + "px";
    svg.style.height = (Math.max(blueLink.position.y1, blueLink.position.y0) + 2) + "px";
    //  document.getElementById("hub_blue").appendChild(svg);
    svg.style.position = "absolute";
    var color = "#09f";
    if (blueLink.color != undefined) {
        color = blueLink.color;
    }
    var curve = bezierCurve("fill:none;stroke:" + color + ";stroke-width:2;", blueLink.position.x0, blueLink.position.y0, blueLink.position.x1, blueLink.position.y1);
    svg.appendChild(curve);
    conotent.appendChild(svg);
}

function bezierCurve(style, x0, y0, x1, y1) {
    // x0 -= 10;
    // x1 -= 10;
    // y0 -= 10;
    // y1 -= 10;

    var c0x = (x0 + x1) / 2;
    var c0y = y0;
    var c1x = (x0 + x1) / 2;
    var c1y = y1;

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.style.pointerEvents = "visible";
    path.style.cursor = "pointer";
    path.setAttribute("d", "M" + x0 + " " + y0 + " L" + (x0 + 20) + " " + y0 + " C" + c0x + " " + c0y + " " + c1x + " " + c1y + " " + (x1 - 20) + " " + (y1) + " L" + x1 + " " + y1);
    path.setAttribute("style", style);
    return path;
}

function renderProperty(body, align, prop, blue) {
    var row = document.createElement("div");
    row.className = "blueRow";
    if (prop.hidden) {
        row.style.display = "none";
    }

    var label = document.createElement("div");
    label.style.flex = "1";
    label.innerText = prop.label;

    var icon = document.createElement("i");
    icon.className = "bi bi-record-circle";
    icon.setAttribute("data-blue", "")
    icon.style.color = "#09f";
    if (align == "right") {
        label.style.textAlign = "right";
        if (blue.type == "variable") {
            var input = document.createElement("input");
            input.placeholder = prop.label;
            if (blue.value != undefined)
                input.value = blue.value;
            input.style.width = "60px";
            input.style.fontSize = "12px";
            input.style.flex = "1";
            row.appendChild(input);

        } else if (blue.type == "matrix") {
            var textarea = document.createElement("textarea");
            textarea.placeholder = prop.label;
            if (blue.value != undefined)
                textarea.value = blue.value;
            textarea.style.width = "60px";
            textarea.style.fontSize = "12px";
            textarea.style.flex = "1";
            row.appendChild(textarea);
        } else
            row.appendChild(label);
        row.appendChild(icon);
        body.appendChild(row);
    } else if (align == "left") {
        row.appendChild(icon);
        row.appendChild(label);
        body.appendChild(row);
    }
}

function showLoadding() {
    var loadding = document.createElement("div");
    loadding.id = "loadding";
    loadding.style.position = "fixed";
    loadding.style.top = "0";
    loadding.style.bottom = "0";
    loadding.style.left = "0";
    loadding.style.right = "0";
    loadding.style.display = "flex";
    loadding.style.alignItems = "center";
    loadding.style.justifyContent = "center";
    loadding.style.background = "rgba(0,0,0,0.5)";
    document.body.appendChild(loadding);


    var cure = document.createElement("div");
    cure.className = "loadding";
    cure.style.height = "100px";
    cure.style.width = "100px";
    loadding.appendChild(cure);
    cure.style.display = "flex";
    cure.style.alignItems = "center";
    cure.style.justifyContent = "center";

    var i = document.createElement("i");
    i.className = "bi bi-droplet ";
    i.style.color = "#fff";
    i.style.fontSize = "40px";
    cure.appendChild(i);

    setTimeout(() => { hideLoadding(); }, 2000);
}

function hideLoadding() {
    var loadding = document.getElementById("loadding");
    if (loadding != undefined) {
        loadding.remove();
    }


}



function hasComponentPathEach(comonent) {
    var paths = comonent.path;
    if (comonent.children != undefined && comonent.children.length > 0) {
        comonent.children.forEach(child => {
            paths += hasComponentPathEach(child);
        })
    }
    return paths;
}