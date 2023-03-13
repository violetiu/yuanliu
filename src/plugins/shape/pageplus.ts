import { IShape } from "../../common/interfaceDefine";

var shape:IShape={
    title:"页plus",
    key:"pageplus",
    onRender(svg, fill, stroke) {
        var w=svg.clientWidth-2;
        var h=svg.clientHeight-2;

        var path=document.createElementNS("http://www.w3.org/2000/svg","path");
        path.style.pointerEvents="visible";
        var r=20;
        if(w<200||h<200){
            r=10;
        }
       
        var points=[[r*1.5+2,2],[w,2],[w,h-r],[w-r*1.5,h],[2,h],[2,r+2]];
        var d="";
        for(var i=0;i<points.length;i++){
            if(i==0){
                d="M"+points[i][0]+" "+points[i][1];
            }else {
                d=d+"L"+points[i][0]+" "+points[i][1];
            }

        }
        d+="z";

        path.setAttribute("d",d);
        path.setAttribute("style","fill:"+fill+";stroke:"+stroke+";stroke-width:0.5px;stroke-linejoin:round;");
     
        svg.appendChild(path);

        var pathLT=document.createElementNS("http://www.w3.org/2000/svg","path");
        pathLT.style.pointerEvents="visible";
        pathLT.setAttribute("d","M"+(w-18)+" 0L"+(w+2)+" 0 "+(w+2)+" 20");
        pathLT.setAttribute("style","fill:none;stroke:"+stroke+";stroke-width:4px;stroke-linejoin:round;");
     
        svg.appendChild(pathLT);

        var pathRB=document.createElementNS("http://www.w3.org/2000/svg","path");
        pathRB.style.pointerEvents="visible";
        pathRB.setAttribute("d","M0 "+(h-18)+"L0 "+(h+2)+" "+20+" "+(h+2));
        pathRB.setAttribute("style","fill:none;stroke:"+stroke+";stroke-width:4px;stroke-linejoin:round;");
     
        svg.appendChild(pathRB);
        
    },
}
export default shape;