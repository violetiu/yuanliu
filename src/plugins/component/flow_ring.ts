import { getUUID, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "flow_ring", label: "ring", icon: "bi bi-infinity", type: "flow_ring", group: "flow",
    styles: {
        root: "padding:5px;margin:5px;border-radius:5px;height:300px;position:relative;",
        block: "cursor:pointer;margin:5px;background:var(--theme-color);display:flex;align-items:center;justify-content:center;color:#fff;border-radius:5px;font-size:13px;padding:5px 10px 5px 10px;",
        arrow: "font-size:20px;color:var(--theme-color);display:flex;align-items:center;justify-content:center;margin:0px 20px 0px 20px;"
    },
    option: "开始bi bi-calendar-day\n开始1bi bi-calendar-day\n开始1bi bi-calendar-day\n     节点1\n    节点2\n        节点2.1",
    onPreview: () => {
        var div = document.createElement("div");
        div.innerHTML = "ring";
        return div;
    }, onRender: (component, element, content, type) => {
        var div: HTMLElement;
        if (element != undefined)
            div = element;
        else
            div = document.createElement("div");
        div.innerHTML = "";

        setTimeout(() => {
            
            var width = div.clientWidth;
            var heigh = div.clientHeight;
    
            //画圆
            var ringW = width / 2;
            var ringH = heigh / 2;
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.style.zIndex = "1";
            svg.style.width = ringW + "px";
            svg.style.height = ringH + "px";
            svg.style.filter="blur(8px)";
            div.appendChild(svg);
            svg.style.position = "absolute";
            svg.style.top = heigh / 4 + "px";
            svg.style.left = width / 4 + "px";
         //   svg.style.backgroundColor = "#f1f5f1";
    
            var padding = 20;
            var d = "M" + padding * 5 + " " + padding;
            d += "L" + (ringW - padding * 5) + " " + padding;
            d += "C" + (ringW - padding * 5) + " " + padding + " " + (ringW - padding) + " " + padding + " " + (ringW - padding) + " " + (ringH / 2);
            d += "C" + (ringW - padding) + " " + (ringH / 2) + " " + (ringW - padding) + " " + (ringH - padding) + " " + (ringW - padding * 5) + " " + (ringH - padding);
            d += "L" + (ringW - padding * 5) + " " + (ringH - padding) + "L" + (padding * 5) + " " + (ringH - padding);
            //
            d += "C" + (padding * 5) + " " + (ringH - padding) + " " + (padding) + " " + (ringH - padding) + " " + (padding) + " " + (ringH / 2);
    
            d += "C" + (padding) + " " + (ringH / 2) + " " + (padding) + " " + (padding) + " " + padding * 5 + " " + padding + "z";
    
    
    
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.style.pointerEvents = "visible";
            path.setAttribute("d", d);
            path.setAttribute("style", "fill:none;stroke:var(--light-color);stroke-linejoin:round;stroke-width:18px;");
            svg.appendChild(path);
            //画箭头
            var startArrowDiv=document.createElement("div");
            startArrowDiv.style.height="38px";
            startArrowDiv.style.width="40px";
            startArrowDiv.style.borderRadius="100px";
            //startArrowDiv.style.background = "var(--theme-color)";
            startArrowDiv.style.position="absolute";
            startArrowDiv.style.top=(heigh/4)+"px";
            startArrowDiv.style.left=(width/2)+"px";
            startArrowDiv.style.zIndex="1000";
            startArrowDiv.style.display="flex";
            startArrowDiv.style.justifyContent="center";
            startArrowDiv.style.alignItems="center";
            div.appendChild(startArrowDiv);


            var startArrow=document.createElement("i");
            startArrow.className = "bi bi-arrow-right-circle" ;
            startArrow.style.fontSize="32px";
            startArrow.style.color ="var(--theme-color)";
            startArrowDiv.appendChild(startArrow);
    
            // var backArrow=document.createElement("i");
            // backArrow.className = "bi bi-arrow-return-left" ;
            // backArrow.style.fontSize="32px";
            // backArrow.style.color = "var(--theme-color)";
            // backArrow.style.position="absolute";
            // backArrow.style.top=(heigh*3/4-padding*2)+"px";
            // backArrow.style.left=(width*3/4-padding*5)+"px";
           // div.appendChild(backArrow);
    
            //画树
    
            //统计一级节点的个数
            var topCount = 0;
    
            component.option.split("\n").forEach(item => {
                //计算tab数量
    
                var count = (item.split(" ").length - 1) / 4;
                if (count < 1) {
                    count = 0;
                }
                if (count == 0) {
                    topCount++;
                }
    
    
            });
            var topAngle = Math.PI*2 / topCount;
            var startAngle = Math.PI / 2;
            var topW=width-20;
            var topH=heigh-20;
            var colors=[
                "#2ec7c9",
                "#b6a2de",
                "#5ab1ef",
                "#ffb980",
                "#d87a80",
                "#8d98b3",
                "#e5cf0d",
                "#97b552",
                "#95706d",
                "#dc69aa",
                "#07a2a4",
                "#9a7fd1",
                "#588dd5",
                "#f5994e",
                "#c05050",
                "#59678c",
                "#c9ab00",
                "#7eb00a",
                "#6f5553",
                "#c14089"
            ];
            component.option.split("\n").forEach(item => {
                //计算tab数量
    
                var count = (item.split(" ").length - 1) / 4;
                if (count < 1) {
                    count = 0;
                }
                if (count == 0) {
                    var l = 0;
                    var t = 0;
    
    
                    var a = topW / 2.5; var b = topH / 2.5;
                    var c = topW / 3;
                    console.log(a * Math.cos(startAngle));
                    l = topW / 2 +a * Math.cos(startAngle)+(width-topW)/2;
                     t= topH / 2 - b * Math.sin(startAngle)-20;
                 
    
                    var color=colors[Math.round(Math.random()*colors.length)];
    
                    //绘制一级
                    var topic = document.createElement('div');
                
                    topic.style.position = "absolute";
                    topic.style.left = l + "px";
                    topic.style.top = t + "px";
                    topic.style.display="flex";
                    topic.style.alignItems="start";
                    div.appendChild(topic);
    
                    var i = document.createElement("i");
                    i.className = "bi " + item.split("bi ")[1];
                    i.style.fontSize="38px";
                    i.style.textShadow="1px 1px 5px";
                    i.style.color =color;
                    topic.appendChild(i);
                    var s = document.createElement("div");
                    s.innerText = item.split("bi ")[0];
                    s.style.padding="5px 10px 5px 10px";
                    s.style.borderRadius="5px";
                    s.style.margin="10px";
                    s.style.background = color;
                    s.style.color="#fff";
                    s.style.fontSize="13px";
                    topic.appendChild(s);
    
                    startAngle -= topAngle;
                }
    
    
            });
    

        }, 500);

       


        return { root: div, content: div };
    }
}
export default function load() {
    return component;
}