
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "chart_funnel", label: "fun.", icon: "bi bi-caret-up-fill", 
    type: "chart_funnel", group: "chart",panel:"echarts",
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
                  name: 'Funnel',
                  type: 'funnel',
                  left: '10%',
                  top: 60,
                  bottom: 60,
                  width: '80%',
                  min: 0,
                  max: 100,
                  minSize: '0%',
                  maxSize: '100%',
                  sort: 'ascending',
                  gap: 2,
                  label: {
                    show: true,
                    position: 'inside'
                  },
                  labelLine: {
                    length: 10,
                    lineStyle: {
                      width: 1,
                      type: 'solid'
                    }
                  },
                  itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                  },
                  emphasis: {
                    label: {
                      fontSize: 20
                    }
                  },
                  data: [
                    { value: 60, name: 'Visit' },
                    { value: 40, name: 'Inquiry' },
                    { value: 20, name: 'Order' },
                    { value: 80, name: 'Click' },
                    { value: 100, name: 'Show' }
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
export default function load() {
    return component;
}