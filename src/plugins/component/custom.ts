
import { loadChart } from "../../render/chart";
import { IComponent } from "../../common/interfaceDefine"

 const  component:IComponent={
    isTemplate: true, key: "custom", label: "custom", icon: "bi bi-code", type: "custom",group:"chart",
        option: "var id='xxxxx';\n",
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
                chart.innerHTML="";
            }
            else {
                chart = document.createElement("div");
                if (content != undefined)
                    content.appendChild(chart);
            }
            chart.style.cssText = component.style;
            component.option=component.option.replace("id='xxxxx';","id='"+component.key+"';");
            setTimeout(() => {
                eval(component.option);
            }, 500);
            return { root: chart, content: chart };
        }
}
export default function load(){
    return component;
}