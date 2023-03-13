
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "chart_radar", label: "radar", icon: "bi bi-pentagon",
     type: "chart_radar",group:"chart",panel:"echarts",
        option: "option =" + JSON.stringify(
            {
                animation:true,
                backgroundColor:"transparent",
                title: {
                    text: '蛛网图'
                  },
                  tooltip:{},
                  legend: {
                    data: ['Allocated Budget', 'Actual Spending'],
                    top:"bottom"
                  },      grid: {
                    left: '0px',
                    top: "10px",
                    right: '0px',
                    bottom: '30px',
                    containLabel: true
                },
                  radar: {
                    // shape: 'circle',
                    indicator: [
                      { name: 'Sales', max: 6500 },
                      { name: 'Administration', max: 16000 },
                      { name: 'Information Technology', max: 30000 },
             
                    ]
                  },
                  series: [
                    {
                      name: 'Budget vs spending',
                      type: 'radar',
                      data: [
                        {
                          value: [4200, 3000, 20000],
                          name: 'Allocated Budget'
                        },
                        {
                          value: [5000, 14000, 28000],
                          name: 'Actual Spending'
                        }
                      ]
                    }
                  ]
            }, null, 2
        ) + ";",
        style: "height:200px;width:300px;",
        onPreview: () => {
            var chartDiv = document.createElement("div");
            chartDiv.className = "chartDiv";
            var icon = document.createElement("i");
            icon.style.fontSize = "100px";
            icon.className = "bi bi-pentagon";
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