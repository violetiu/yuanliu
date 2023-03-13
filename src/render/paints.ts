/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

绘制曲线
***************************************************************************** */
export function bezierCurve(style:string,x0:number,y0:number,x1:number,y1:number):SVGPathElement{
    // console.log(x0,y0,x1,y1);
    var c0x=(x0+x1)/2;
    var c0y=y0;
    var c1x=(x0+x1)/2;
    var c1y=y1;

    var path=document.createElementNS("http://www.w3.org/2000/svg","path");
    path.style.pointerEvents="visible";
    path.style.cursor="pointer";
    path.setAttribute("d","M"+x0+" "+y0+" L"+(x0+20)+" "+y0+" C"+c0x+" "+c0y+" "+c1x+" "+c1y+" "+(x1-20)+" "+(y1)+" L"+x1+" "+y1);
    path.setAttribute("style",style);
    return path;
}

export function updateBezierCurve(curve:SVGPathElement, x0:number,y0:number,x1:number,y1:number){
   
    var c0x=(x0+x1)/3;
    var c0y=y0;
    var c1x=(x0+x1)/3;
    var c1y=y1;
    curve.setAttribute("d","M"+x0+" "+y0+" C"+c0x+" "+c0y+" "+c1x+" "+c1y+" "+x1+" "+y1);


}