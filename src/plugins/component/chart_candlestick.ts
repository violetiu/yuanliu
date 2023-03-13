
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "chart_candlestick", label: "candle",
     icon: "bi bi-sliders2", rotate:true,type: "chart_candlestick",group:"chart", 
     panel:"echarts",
        option: "option =" + JSON.stringify(
            {
                animation:true,
                backgroundColor:"transparent",
                title: {
                    text: 'candlestick',

                    left: 'center'
                },   
                   grid: {
                    left: '0px',
                    top: "10px",
                    right: '0px',
                    bottom: '30px',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
                  },
                  yAxis: {},
                  series: [
                    {
                      type: 'candlestick',
                      data: [
                        [20, 34, 10, 38],
                        [40, 35, 30, 50],
                        [31, 38, 33, 44],
                        [38, 15, 5, 42]
                      ]
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
            icon.className = "bi bi bi-sliders2";
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