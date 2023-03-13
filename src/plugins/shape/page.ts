import { IShape } from "../../common/interfaceDefine";

var shape:IShape={
    title:"页",
    key:"page",
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

        
    },
}
export default shape;