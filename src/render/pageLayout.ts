/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.
使用threejs
绘制3d页面布局 
***************************************************************************** */
import * as THREE from "three";
import { getCurPage, getCurPageContent } from "./workbench";
import { getProject } from "./workspace";
const component_colors={
    "row":"#90f",
    "grid":"#f90",
    "flex":"#f09",
    "space":"#0f9",
    "layers":"#ff9",
    "chart":"#f0f",
}
export function renderPageLayout() {
    var page = getCurPageContent();
    var start=Date.now();
    console.log("renderPageLayout");
    var pageLayout = document.getElementById("pageLayout");
    if (page == undefined || pageLayout == undefined) {
        return;
    }
    const width = pageLayout.clientWidth;
    const rate = width / page.clientWidth;
    pageLayout.innerHTML = "";

    pageLayout.style.position = "relative";
    pageLayout.style.height = page.clientHeight * rate + "px";

    const height = page.clientHeight * rate;

    //3d
    const scene = new THREE.Scene();
    if(getProject().theme=="dark"){
        scene.background = new THREE.Color(0x000000);
    }else{
        scene.background = new THREE.Color(0xffffff);
    }
   
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 500;
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    pageLayout.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    var components = page.getElementsByClassName("component_canvas");
    if (components == undefined) return;
    var layers = [];
    var colors:string[] = [];
    for (var i = 0; i < components.length; i++) {
        var component: any = components.item(i);
        if(component.style.display=="none") continue;
        var type=component.getAttribute("component_type");
        var color="#09f";
        for(var key in component_colors){
          
            if(key===type){
                color=eval("component_colors."+key);
                break;
            }
        }
        colors.push(color);
        //left top
        var po = getComponentPosition(component);
        const left = po.left * rate;
        const top = po.top * rate;

        const z = po.level * 10;
        //width height
        const w = Math.round(component.clientWidth * rate);
        const h = Math.round(component.clientHeight * rate);

        layers.push([w, h, Math.round(left - width*0.8), Math.round(height / 2 - top), z])
    }
    var count=0;
    layers.forEach(layer => {
     
        //add
        const geometry = new THREE.BoxGeometry(layer[0], layer[1], 5);
        const material = new THREE.MeshBasicMaterial({
            color: colors[count],
            side: THREE.DoubleSide,
            transparent: true, // 设置为true，opacity才会生效
            opacity: 0.3,
            depthWrite: false, // 不遮挡后面的模型
            // depthWrite: false // 关闭深度测试
        });
      
        const cube = new THREE.Mesh(geometry, material);
     
        cube.position.set(layer[2]+layer[0]/2, layer[3]-layer[1]/2, layer[4]);
        scene.add(cube);

        // const text=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(getTextCanvas("asdas",colors[count]))}));
        // text.position.set(layer[2]+layer[0]/2, layer[3]-layer[1]/2, layer[4]);
        // scene.add(text);
      
        count++
    });

    scene.rotation.x = 0.2;
    scene.rotation.y = 0.6;
    renderer.render(scene, camera);
    pageLayout.onwheel = (e) => {
        camera.position.z=camera.position.z+e.deltaY*0.2;
        renderer.render(scene, camera);
    }
    pageLayout.onmousedown = function (de) {
        var dx = de.clientX;
        var dy = de.clientY;
        var move = true;
        document.onmousemove = (md) => {
            if (move) {
                var y = md.clientX - dx;
                var x = md.clientY - dy;
                scene.rotation.x = x * 0.02;
                scene.rotation.y= y * 0.02;
                renderer.render(scene, camera);
            }

        }
        document.onmouseup = (md) => {
            move = false;
        }

    }
    console.log("renderPageLayout",Date.now()-start);
    // function animate() {
    //     requestAnimationFrame( animate );

    //     // scene.rotation.x += 0.01;
    //     scene.rotation.y += 0.01;

    //     renderer.render( scene, camera );
    // };

    // animate();
}
function getComponentPosition(component: HTMLElement) {
    var div = component;
    var left = 0;
    var top = 0;
    var level = 0;
    while (div.offsetParent) {
        if (div.id == "page") {
            break;
        }
        left += div.offsetLeft;
        top += div.offsetTop;
        div = div.offsetParent as HTMLElement;
        level++;
    }
    return { left: left, top: top, level: level };

}
function getComponentLeft(component: HTMLElement) {
    var div = component;
    var left = 0;
    while (div.offsetParent) {
        if (div.id == "page") {
            break;
        }
        left += div.offsetLeft;
        div = div.offsetParent as HTMLElement;
    }
    return left;

}
function getComponentTop(component: HTMLElement) {
    var div = component;
    var top = 0;
    while (div.offsetParent) {
        if (div.id == "page") {
            break;
        }
        top += div.offsetTop;

        div = div.offsetParent as HTMLElement;
    }
    return top;

}
function getTextCanvas(text:string,color:string){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.font = "20px Arial";
    var metrics = ctx.measureText(text);
    canvas.width = metrics.width;
    canvas.height = 20;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText(text, 0, 20);
    return canvas;
}