import { getUUID, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "canvas", label: "canvas", icon: "bi bi-palette", type: "canvas", group: "base", panel: "paint",
    style: "flex:1;background:transparent;min-height:100px;margin:5px;padding:5px;border-radius:5px;",
    onPreview: () => {
        var canvas = document.createElement("div");
        return canvas;
    }, onRender: (component, element, content, type) => {
        var div: HTMLElement;
        if (element != undefined) {
            div = element; div.innerHTML = "";
        }
        else {
            div = document.createElement("div");
            if (content != undefined)
                content.appendChild(div);
        }


        function getDivClientTop(div: HTMLElement): number {
            var top = 0;
            while (div.offsetParent) {
                top += div.offsetTop;
                if (div.className == "page_view") {
                    top -= div.scrollTop;
                }
                div = div.offsetParent as HTMLElement;
            }

            return top + 30;
        }
        function getDivClientLeft(div: HTMLElement): number {
            var left = 0;
            while (div.offsetParent) {
                left += div.offsetLeft;
                if (div.className == "page_view") {
                    left -= div.scrollLeft;
                }
                div = div.offsetParent as HTMLElement;
            }
            return left;
        }




        var canvas = document.createElement("div");
        canvas.style.width = "100%";
        canvas.draggable = true;
        canvas.style.height="100%";
        canvas.ondragstart = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "none";
            e.stopPropagation();
        }
        div.append(canvas);
        var svg: any = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        //  svg.style.cursor="url('cur/pencil.cur'),auto";
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        canvas.appendChild(svg);

        function renderShape(content:SVGSVGElement,rs: any) {
            if (rs.path == undefined) {
                rs.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                content.appendChild(rs.path);
            }
            if (rs.control == undefined || rs.control.length == 0) {
                //直线
                var path = "";
                rs.data.forEach((d: any, i: number) => {

                    if (i == 0) {
                        path += "M" + d[0] + " " + d[1] + " ";

                    } else {
                        path += "L" + d[0] + " " + d[1] + " ";
                    }
                    if(model=="control"){
               
                        var point=document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        point.setAttribute("cx", d[0]+"px");
                        point.setAttribute("cy", d[1]+"px");
                        point.setAttribute("r", "3px");
                        point.setAttribute("fill", "none");
                        point.setAttribute("stroke", "#000");
                        rs.points.push(point);
                        svg.appendChild(point);
                    }
                })
                rs.path.setAttribute("d", path);
            }
            rs.path.setAttribute("stroke", rs.strokeStyle);
            rs.path.setAttribute("fill", rs.fillStyle);
            rs.path.setAttribute("stroke-width", rs.lineWidth);
           
        }
        var model: "select" | "paint" | "control" | "none" = component.property.model.context;
        var shapes: {
            key: string,
            data: any[],
            points:any[],
            control: any[],
            strokeStyle: string,
            fillStyle: string,
            lineWidth: number,
            path?: SVGPathElement
        }[] = component.property.shapes;
        console.log(shapes);
        for(var i=0;i<shapes.length;i++){
            var sp=shapes[i];
            sp.path=undefined;
            sp.points=[];
            renderShape(svg,sp);
        }
      

        var paint: boolean = false;
        var shape:any;
        
        //paint
        svg.onmousedown = (ed: any) => {
            if (model == "paint") {
                if(shape==undefined){
                    shape={
                        key:getUUID(),
                        data:[],
                        control:[],
                        strokeStyle:"#000",
                        fillStyle:"none",
                        lineWidth:1,
                        points:[]
                    }
                    shapes.push(shape);
                }
                //增加shape
                var l = getDivClientLeft(canvas);
                var t = getDivClientTop(canvas);
                var x = ed.clientX - l;
                var y = ed.clientY - t;
                shape.data.push([x, y]);
                renderShape(svg,shape);
                component.property.shapes=shapes;

                var point=document.createElementNS("http://www.w3.org/2000/svg", "circle");
                point.setAttribute("cx", x+"px");
                point.setAttribute("cy", y+"px");
                point.setAttribute("r", "3px");
                point.setAttribute("fill", "none");
                point.setAttribute("stroke", "#000");
                shape.points.push(point);
                svg.appendChild(point);
            }
          
        };

        return { root: div, content: div };
    }, edge: [
        {
            icon: "bi bi-crop", label: "裁剪", onclick: (cmpt: IComponent, item: any) => {

            }
        }],
    property: {
        model: {
            label: "模式", context: "select"
        },
        shapes:[]
    },
}
export default function load() {
    return component;
}