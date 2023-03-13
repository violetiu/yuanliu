import { getUUID, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "flow_tree", label: "tree", icon: "bi bi-diagram-2", type: "flow_tree", group: "flow",
    styles: {
        root: "padding:5px;margin:5px;border-radius:5px;",
        node: "padding:5px;margin:5px;border-radius:0px;border-bottom:1px solid #999",
        link:"stroke:#999;stroke-width:1px;"

    },
    option: JSON.stringify([
        [
            { key: "1", label: "省间计划", value: 100, info: "aaaaa", link: ["5"], left: 100 },
            { key: "2", label: "省内优发", value: 90, info: "bbbb", link: ["5"], left: 300 },
            { key: "3", label: "优先购电", value: 80, info: "cccc", link: ["6"], left: 500 },
            { key: "4", label: "代理购电", value: 70, info: "ddddd", link: ["6"], left: 600 }
        ],
        [
            { key: "5", label: "发电", value: 190, info: "asda", link: ["7"], left: 200 },
            { key: "6", label: "用电", value: 150, info: "dsfdssd", link: ["7"], left: 400 },

        ],
        [
            { key: "7", label: "年度需购", value: 340, info: "asdada", link: ["8", "9"], left: 100 },
        ],
        [
            { key: "8", label: "年度购电", value: 200, info: "345", link: ["10", "11"], left: 100 },
            { key: "9", label: "月度及其他购电", value: 140, info: "45454", link: [], left: 300 },
        ],
        [
            { key: "10", label: "新能源", value: 120, info: "ddssd", link: [], left: 100 },
            { key: "11", label: "火电", value: 80, info: "34433", link: [], left: 200 },
        ],
    ],undefined,4),
    onPreview: () => {
        var div = document.createElement("div");
        div.innerHTML = "Mind";
        return div;
    }, onRender: (component, element, content, type) => {
        var div: HTMLElement;
        if (element != undefined)
            div = element;
        else
            div = document.createElement("div");
        div.innerHTML = "";
        var context = document.createElement("div");
        context.style.position = "relative";
        context.style.zIndex = "2";
        div.appendChild(context);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.zIndex = "1";
        svg.style.top="0px";
        div.appendChild(svg);
        //定义箭头
        var defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
        svg.appendChild(defs);
        var marker=document.createElementNS("http://www.w3.org/2000/svg","marker");
        marker.id="markerArrow";
        marker.setAttribute("markerWidth","8");
        marker.setAttribute("markerHeight","8");
        marker.setAttribute("refx","4");
        marker.setAttribute("refy","4");
        marker.setAttribute("orient","auto");
        var markerPath=document.createElementNS("http://www.w3.org/2000/svg","path");
        markerPath.setAttribute("d","M2,2 L2,4 L4,3 L2,2");
        markerPath.setAttribute("style","fill: #999;");
        marker.appendChild(markerPath);
        
        defs.appendChild(marker);


        var data: any = JSON.parse(component.option);

        var nodes: any = [];
        data.forEach((layer: any, yi: number) => {
            //绘制层级
            var layerDiv = document.createElement("div");
            layerDiv.style.minHeight = "80px";
            layerDiv.style.position = "relative";
            layerDiv.id="layer_"+yi;
            // layerDiv.style.display="flex";
            // layerDiv.style.alignItems="center";
            context.appendChild(layerDiv);

            layer.forEach((node: any) => {
                //绘制节点
                var nodeDiv = document.createElement("div");
                nodeDiv.id = "node_" + node.key;
                nodeDiv.style.cssText = component.styles["node"];
                nodeDiv.style.display = "flex";
                nodeDiv.style.alignItems = "center";
                nodeDiv.style.position = "absolute";
                node.layer = yi;
                nodes.push(node);

                nodeDiv.style.left = (node.left) + "px";

                layerDiv.appendChild(nodeDiv);
                //绘制标题
                var labelDiv = document.createElement("div");
                labelDiv.innerText = node.label;
                labelDiv.style.fontSize="13px";
                nodeDiv.appendChild(labelDiv);
                //其他信息
                var otherDiv = document.createElement("div");
                nodeDiv.appendChild(otherDiv);
                otherDiv.style.paddingLeft="10px";
                //绘制数值
                var valueDiv = document.createElement("div");
                valueDiv.innerText = node.value;
                valueDiv.style.fontSize="14px";
                otherDiv.appendChild(valueDiv);
                //绘制信息
                var infoDiv = document.createElement("div");
                infoDiv.innerHTML = node.info;
                infoDiv.style.fontSize="12px";
                otherDiv.appendChild(infoDiv);

            


            });


        })

        //绘制连线
        setTimeout(() => {
            //调整svg大小
            svg.style.width=context.clientWidth+"px";
            svg.style.height=context.clientHeight+"px";
            //绘制连线
            nodes.forEach((node:any)=>{
                //检查是否有链接
                if(node.link!=undefined&&node.link.length>0){
                    //确认节点的位置信息
                    var layerTop=document.getElementById("layer_"+node.layer).offsetTop;
                    var height=document.getElementById("node_"+node.key).clientHeight;
           
                    var width=document.getElementById("node_"+node.key).clientWidth;
                    var top=document.getElementById("node_"+node.key).offsetTop;
                    var left=document.getElementById("node_"+node.key).offsetLeft;
                 //   console.log("top",layerTop,top,height,width,left);
                    var centerX=(left+width/2);
                    var centerY=(layerTop+top+height+6);


                    node.link.forEach((link:any)=>{
                        var linkNode=nodes.find((n:any)=>n.key==link);
                        if(linkNode){
                            var layerTopLink=document.getElementById("layer_"+linkNode.layer).offsetTop;
                            var heightLink=document.getElementById("node_"+linkNode.key).clientHeight;
                            var widthLink=document.getElementById("node_"+linkNode.key).clientWidth;
                           
                            var topLink=document.getElementById("node_"+linkNode.key).offsetTop;
                            var leftLink=document.getElementById("node_"+linkNode.key).offsetLeft;
                          //  console.log("topLink",layerTopLink,topLink,heightLink,widthLink,leftLink);
                            var centerXLink=(leftLink+widthLink/2);
                            var centerYLink=(layerTopLink+topLink+5);

                            //绘制路径
                            var d="M"+centerX+" "+centerY+" L"+centerXLink+" "+centerYLink;
                            var path=document.createElementNS("http://www.w3.org/2000/svg","path");
                            path.setAttribute("d",d);
                            path.setAttribute("style",component.styles.link);
                            path.setAttribute("marker-start","url(#markerArrow)");
                            svg.appendChild(path);


                        }

                    });



                }


            });



        }, 100);





        return { root: div, content: div };
    }
}
export default function load() {
    return component;
}