import { IBackground } from "../../common/interfaceDefine";

var background:IBackground={
    title:"线条",
    key:"lines",
    onRender(canvas,color) {
        var h = canvas.clientHeight;
        var w = canvas.clientWidth;
        canvas.height=h;
        canvas.width=w;
        var cls = canvas.getContext("2d");
        cls.clearRect(0,0,w,h);
        cls.lineWidth=0.5;
        cls.beginPath();
        cls.moveTo(w/2, h/2);
        var x=w/2;
        var y=h/2;
        for (var i = 0; i < 200; i++) {
             x = x+Math.round((0.5-Math.random()) * 200);
             y =y+ Math.round((0.5-Math.random()) * 200);

             if(x>w){
                x=x-300;
             }
             if(x<0){
                x=x+300
             }
             if(y>h){
                y=y-300;
             }
             if(y<0){
                y=y+300
             }
       
            cls.lineTo(x ,y);
           
        
        }
        cls.closePath();
        cls.strokeStyle =color;
        cls.stroke();
   
    },
}
export default background;