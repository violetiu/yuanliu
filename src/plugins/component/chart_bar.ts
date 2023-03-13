
import { loadChart } from "../../render/chart";
import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "chart_bar", label: "bar", icon: "bi bi-bar-chart-line", 
    type: "chart_bar", group: "chart",panel:"echarts",
    option: "option =" + JSON.stringify(
        {
            animation: true,
            backgroundColor: "transparent",
            title: {
                text: "柱状图",
                left: "center"
            },
            tooltip:{},
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月']
            }, grid: {
                left: '0px',
                top: "10px",
                right: '0px',
                bottom: '30px',
                containLabel: true
            },
            legend: {
                top: "bottom"
            },
            yAxis: [{
                type: 'value'
            }],
            series: [
                {
                    name: "数据项",
                    data: [150, 230, 224],
                    type: 'bar'
                }
            ]
        }, null, 2
    ) + ";",
    style: "height:200px;width:400px;",
    onPreview: () => {
        var chartDiv = document.createElement("div");
        chartDiv.className = "chartDiv";
        var icon = document.createElement("i");
        icon.style.fontSize = "100px";
        icon.className = "bi bi-bar-chart-line";
        chartDiv.appendChild(icon);
        return chartDiv;
    }, onRender: (component, element, content) => {
        var chart: any;
        if (element != undefined) {
            chart = element;
            chart.removeAttribute("_echarts_instance_");
            chart.innerHTML = "";
        }
        else {
            chart = document.createElement("div");
            if (content != undefined)
                content.appendChild(chart);
        }
        chart.style.cssText = component.style;
        loadChart(chart, component);
        return { root: chart, content: chart };
    }, blue: {
        property:{

            xAxisData:{
                label: "X轴数据", get: (comp: IComponent, self:IBlueProperty) => {
                    var op = eval(comp.option);
                    return op.xAxis.data;
                }, set: (comp: IComponent, self:IBlueProperty, arg:any) => {
                    console.log(comp.option);
                    var option: any;
                    eval(comp.option);
                    console.log(arg);
                    option.xAxis.data = arg;
                    comp.option = "option=" + JSON.stringify(option);
                    console.log(comp.option);
                }
            },
            yAxisData:{
                label: "Y轴数据", get: (comp: IComponent, self:IBlueProperty) => {
                    var op = eval(comp.option);
                    return op.xAxis.data;
                }, set: (comp: IComponent, self:IBlueProperty, arg:any) => {
                    console.log(comp.option);
                    var option: any;
                    eval(comp.option);
                    option.series[0].data = arg;
                    comp.option = "option=" + JSON.stringify(option);
                }
            }
        }
        
       
    }
}
export default function load() {
    return component;
}