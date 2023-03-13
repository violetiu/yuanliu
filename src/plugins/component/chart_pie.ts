
import { loadChart } from "../../render/chart";
import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "chart_pie", label: "pie", icon: "bi bi-pie-chart", 
    type: "chart_pie", group: "chart", panel:"echarts",
    option: "option =" + JSON.stringify(
        {
            animation: true,
            backgroundColor: "transparent",
            title: {
                text: '饼图',

                left: 'center'
            },
            
            tooltip: {
                trigger: 'item'
            },
            legend: {

                top: 'bottom'
            },
            series: [
                {
                    name: '数据',
                    type: 'pie',
                    roseType: 'area',
                    radius: '50%',
                    data: [
                        { value: 1048, name: '内容1' },
                        { value: 735, name: '内容2' },
                        { value: 580, name: '内容3' },

                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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
        icon.className = "bi bi-pie-chart";
        chartDiv.appendChild(icon);
        return chartDiv;
    }, onRender: (component, element, content) => {

        var chart: any;
        if (element != undefined) {
            chart = element; 
            chart.removeAttribute("_echarts_instance_");
            chart.innerHTML="";
        }
        else {
            chart = document.createElement("div");
            if (content != undefined)
                content.appendChild(chart);
        }
        chart.style.cssText = component.style;
        loadChart(chart, component);
        return { root: chart, content: chart };
    },blue:{
        property:{
            data:{
                label:"二维矩阵数据",get:(comp:IComponent, self:IBlueProperty)=>{
                    var option:any;
                    eval(comp.option);
                    return option.series[0].data;
                },set:(comp:IComponent, self:IBlueProperty,arg:any)=>{
                    var data=[];
                    for(var i=0;i<arg[0].length;i++){
                        data.push( { value: arg[1][i], name: arg[0][i] });
                    }
                    var option:any;
                    eval(comp.option);
                    option.series[0].data = data;
                    comp.option="option ="+JSON.stringify(option,null,2)+";";
                    console.log(comp.option);
                    comp.onRender(comp,document.getElementById(comp.key));
                }
            }

        }
    }
}
export default function load() {
    return component;
}