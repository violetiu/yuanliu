
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "chart_scatter", label: "scatter", icon: "bi bi-bandaid",
     type: "chart_scatter",group:"chart", panel:"echarts",
    option: "option =" + JSON.stringify(
        {
            animation:true,
            backgroundColor:"transparent",
            title: {
                text: '散点图',

                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {

                top: 'bottom'
            },      
            grid: {
                left: '0px',
                top: "10px",
                right: '0px',
                bottom: '30px',
                containLabel: true
            },
            xAxis: {},
            yAxis: {},
            series: [
                {
                    // symbolSize: 20,
                    data: [
                        [10.0, 8.04],
                        [8.07, 6.95],
                        [13.0, 7.58],
                  
                    ],
                    type: 'scatter'
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
    }
}
export default function load(){
    return component;
}