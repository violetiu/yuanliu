
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "chart_line", label: "line", icon: "bi bi-graph-up", 
    type: "chart_line",group:"chart", panel:"echarts",
        option: "option =" + JSON.stringify(
            {
                animation:true,
                backgroundColor:"transparent",
                title: {
                    text: "折线图",
                    left: "center"
                },   
                tooltip:{},   
                grid: {
                    left: '0px',
                    top: "10px",
                    right: '0px',
                    bottom: '30px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月']
                },
                legend: {
                    top: "bottom"
                },
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: "数据项",
                        data: [150, 230, 224],
                        type: 'line'
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
            icon.className = "bi bi-graph-up";
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