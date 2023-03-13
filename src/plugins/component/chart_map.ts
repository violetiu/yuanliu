
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "chart_map", label: "map", icon: "bi bi-geo",
     type: "chart_map",group:"chart",panel:"echarts",
        option: "option =" + JSON.stringify(
            {
                title: {
                    text: '地图名称',
                    left:"center"
           
                             },
                             backgroundColor: "transparent",
                  tooltip: {
                    trigger: 'item',
           
                  },
                 
                  visualMap: {
                      // min: 800,
                      // max: 50000,
                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                      color: ['lightskyblue', 'yellow', 'orangered']
                    }
                  },
                  series: [
                    {
                      name: '人口',
                      type: 'map',
                      map: 'china.json',
                      label: {
                        show: true
                      },
                      data: [
               
                      ],
                      
                    }
                  ]
            }, null, 2
        ) + ";",
        style: "height:400px;width:500px;",
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
          if (element != undefined) chart = element; else {
              chart = document.createElement("div");
              if (content != undefined)
                  content.appendChild(chart);
          }
          chart.style.cssText = component.style;
          loadChart(chart, component,true);
            return { root: chart, content: chart };
        }
      }
export default function load(){
    return component;
}