import { IBackground } from "../../common/interfaceDefine";

var background:IBackground={
    title:"星星",
    key:"star",
    onRender(canvas,color) {
        var h = canvas.clientHeight;
        var w = canvas.clientWidth;
        canvas.height=h;
        canvas.width=w;
        var cls = canvas.getContext("2d");
        cls.clearRect(0,0,w,h);
        for (var i = 0; i < 200; i++) {
            var x = Math.round(Math.random() * w);
            var y = Math.round(Math.random() * h);
            var r = Math.random() * 0.2;
            cls.beginPath();
            cls.moveTo(x, y);
            cls.lineTo(x + 10 * r, y + 20 * r);
            cls.lineTo(x + 30 * r, y + 30 * r);
            cls.lineTo(x + 10 * r, y + 40 * r);
            cls.lineTo(x + 5 * r, y + 50 * r);
            cls.lineTo(x - 5 * r, y + 40 * r);
            cls.lineTo(x - 30 * r, y + 30 * r);
            cls.lineTo(x - 5 * r, y + 20 * r);
            cls.closePath();
            cls.fillStyle =color;
            cls.fill();
        }

    },
}
export default background;