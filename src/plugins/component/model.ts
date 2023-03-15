
import { IComponent } from "../../common/interfaceDefine";
// import * as THREE from "three";
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders'; //babylonjs-loaders/OBJ/index

//import { OBJLoader} from "three/examples/js/loaders/OBJLoader.js";
// import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader.js";

import { ipcRendererSend } from "../../preload";
import { getCurPageKey } from "../../render/workbench";
import { getProject } from "../../render/workspace";
const component: IComponent = {
    isTemplate: true, key: "model", label: "model", icon: "bi bi-box", type: "model", group: "base",
    option: "",//model地址
    style: "height:200px;width:400px;cursor: pointer;",
    onPreview: () => {
        var chartDiv = document.createElement("div");
        chartDiv.className = "chartDiv";
        var icon = document.createElement("i");
        icon.style.fontSize = "100px";
        icon.className = "bi bi-box";
        chartDiv.appendChild(icon);
        return chartDiv;
    }, onRender: (component, element, content,type) => {
        var body: any;
        if (element != undefined) {
            body = element;
            body.innerHTML = "";
        }
        else {
            body = document.createElement("div");
            if (content != undefined)
                content.appendChild(body);
        }
        body.style.cssText = component.style;
        var canvas=document.createElement("canvas");
        canvas.style.height=body.style.height;
        canvas.style.width=body.style.width;
        canvas.style.outline="none";
        body.appendChild(canvas);
        if(type!="product"){
            body.ondblclick = () => {
                ipcRendererSend("insertModel",getCurPageKey());
            }
        }
        setTimeout(() => {
            //等组件加载完成后，加载three场景及模型
            console.log(canvas);
            var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

            const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
            camera.attachControl(canvas, true);

            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            scene.render();
            if (component.option != undefined && component.option.length > 0) {
                // var loader = new BABYLON.AssetsManager(scene);

                var url = component.option.trim().replace("\n", "");

                if(!url.startsWith("http")){
                    if(type!=undefined&&type=="product"){
                        url = "./models/"+url;
                    }else{
                        url =getProject().work+ "/models/"+url;
                    }
                    // url= getProject().work + "/models/"+ url;
                }

                var rootpath=url.substring(0,url.lastIndexOf("/")+1);
                var name=url.substring(url.lastIndexOf("/")+1);
        
                var loader = new BABYLON.AssetsManager(scene);
                var bunny = loader.addMeshTask("model", "", rootpath,name);
                bunny.onSuccess = ()=>{
                };
                loader.onFinish = function () {
                    engine.runRenderLoop(function () {
                        scene.render();
                    });
                };
                loader.load();
                // Append glTF model to scene.
                // BABYLON.SceneLoader.Append("/Users/taoyongwen/Downloads/model/", "model.gltf", scene, function (scene) {
                //     // Create a default arc rotate camera and light.
                //     //scene.createDefaultCameraOrLight(true, true, true);
                //     scene.render();
                //     // The default camera looks at the back of the asset.
                //     // Rotate the camera by 180 degrees to the front of the asset.
                //     // scene.activeCamera.alpha += Math.PI;
                // });
                // fetch("https://www.violetime.com/model/model.obj").then((response)=>{
                //     response .text().then((jsonObj=>{
                //         console.log("json",jsonObj);
                //         var objLoader=new  OBJFileLoader({computeNormals:true,importVertexColors:true,invertTextureY:true,invertY:true,materialLoadingFailsSilently:true,
                //             optimizeNormals:true,optimizeWithUV:true,skipMaterials:true,UVScaling:new BABYLON.Vector2(1,1)});
                //         objLoader.loadAsync(scene, jsonObj,"https://www.violetime.com/model/").then((obj:any)=>{

                //             console.log("obj",obj);
                //             scene.addGeometry(obj);

                //         });
                //     }));

                // })


                // BABYLON.SceneLoader.Load("/Users/taoyongwen/Downloads/model/", "model.obj", engine, function (newScene) { // ...
                // });
                // BABYLON.SceneLoader.LoadAssetContainer("/Users/taoyongwen/Downloads/model/", "model.obj", scene, function (container) {
                //     var meshes = container.meshes; 
                //     var materials = container.materials;//...// Adds all elements to the scenecontainer.addAllToScene();
                // });

                // var bunny = loader.addMeshTask("model", "", url, "");
                // const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

                // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
                // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
                // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
                // myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
                // bunny.onSuccess = (bunny_model) => {

                //     console.log("bunny_model",  bunny_model.loadedMeshes);
                //     bunny_model.loadedMeshes[0].material = myMaterial;
                // };

                // loader.onFinish = function () {
                //     engine.runRenderLoop(function () {
                //         scene.render();
                //     });
                // };

                // loader.load();
            }







        }, 200);
        return { root: body, content: body };
    }
}
export default function load() {
    return component;
}