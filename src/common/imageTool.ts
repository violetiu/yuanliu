/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

图像处理工具
使用 sharp
***************************************************************************** */
import * as path from "path";

import * as sharp from 'sharp';
import { getCurPageKey } from '../render/workbench';
import { getProject } from '../render/workspace';
import { getUUID } from './interfaceDefine';
export  function flatten(url:string,color:string,callback:(url:string)=>void){
    console.log("flatten");

    var img=  sharp(url);
    //获取高度
    img.metadata((err, metadata) => {
        if (err) {}
        var height=metadata.height;
        var width=metadata.width;
        sharp({
            create: {
              width: width,
              height: height,
              channels: 4,
              background: color
            }
          })
          .png()
          .toBuffer().then(function(bg) {
            var ex=path.extname(url);
            var newName=path.join(getCurPageKey(),getUUID()+"."+ex);
            var newUrl=path.join(getProject().work, "images",newName);
            img.composite([{input:bg,blend:"overlay"}])
            .toFile(newUrl,(err,info)=>{
                console.log(err,info);
                callback(newName);
            });
    
          });
    

    });
 
}
/**
 * 着色
 * @param url 
 * @param color 
 * @param callback 
 */
export  function tint(url:string,color:string,callback:(url:string)=>void){
    console.log("tint");
    var ex=path.extname(url);
    var newName=path.join(getCurPageKey(),getUUID()+"."+ex);
    var newUrl=path.join(getProject().work, "images",newName);
     sharp(url)
    .tint(color)
    .toFile(newUrl,(err,info)=>{
        console.log(err,info);
        callback(newName);
    });
}
/**
 * 锐化
 * @param url 
 * @param color 
 * @param callback 
 */
export  function sharpen(url:string,callback:(url:string)=>void){
    console.log("sharpen");
    var newName=getCurPageKey()+"/"+getUUID()+".png";
    var newUrl=getProject().work+ "/images/"+newName;
     sharp(url)
    .sharpen(5)
    .toFile(newUrl,(err,info)=>{
        console.log(err,info);
        callback(newName);
    });
}
/**
 * 模糊
 * @param url 
 * @param color 
 * @param callback 
 */
export  function blur(url:string,callback:(url:string)=>void){
    console.log("blur");
    var ex=path.extname(url);
    var newName=path.join(getCurPageKey(),getUUID()+"."+ex);
    var newUrl=path.join(getProject().work, "images",newName);
     sharp(url)
    .blur(5)
    .toFile(newUrl,(err,info)=>{
        console.log(err,info);
        callback(newName);
    });
}
/**
 * 灰度
 * @param url 
 * @param color 
 * @param callback 
 */
 export  function grayscale(url:string,callback:(url:string)=>void){
    console.log("grayscale");
    var ex=path.extname(url);
    var newName=path.join(getCurPageKey(),getUUID()+"."+ex);
    var newUrl=path.join(getProject().work, "images",newName);
     sharp(url)
    .grayscale()
    .toFile(newUrl,(err,info)=>{
        console.log(err,info);
        callback(newName);
    });
}
/**
 * 旋转
 * @param url 
 * @param color 
 * @param callback 
 */
 export  function rotate(url:string,callback:(url:string)=>void){
    console.log("rotate");
    var ex=path.extname(url);
    var newName=path.join(getCurPageKey(),getUUID()+"."+ex);
    var newUrl=path.join(getProject().work, "images",newName);
     sharp(url)
    .rotate(90)
    .toFile(newUrl,(err,info)=>{
        console.log(err,info);
        callback(newName);
    });
}