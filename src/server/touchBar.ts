/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

mac touchbar
***************************************************************************** */
import { BrowserWindow, TouchBar } from "electron";
import * as path from "path";
const {TouchBarColorPicker, TouchBarButton } = TouchBar
export function touchBarEditor(mainWindow:BrowserWindow){
    const nativeImage = require('electron').nativeImage;
    mainWindow.setTouchBar(new TouchBar({
        items:[
          new TouchBarButton({
            icon:nativeImage.createFromPath( path.join(__dirname, '../../touchbar/savepage.png')),
           
            click: () => {
                mainWindow.webContents.send("touchBar_save");
            }
           }),
           new TouchBarButton({
            icon:nativeImage.createFromPath( path.join(__dirname, '../../touchbar/fresh.png')),
           
            click: () => {
                mainWindow.webContents.send("touchBar_fresh");
            }
           }),
           new TouchBarButton({
            icon:nativeImage.createFromPath( path.join(__dirname, '../../touchbar/build.png')),
           
            click: () => {
                mainWindow.webContents.send("touchBar_build");
            }
           }),
           new TouchBarButton({
            icon:nativeImage.createFromPath( path.join(__dirname, '../../touchbar/preview.png')),
           
            click: () => {
                mainWindow.webContents.send("touchBar_preview");
            }
           }),
           new TouchBarButton({
            icon:nativeImage.createFromPath( path.join(__dirname, '../../touchbar/export.png')),
           
            click: () => {
                mainWindow.webContents.send("touchBar_export");
            }
           }),
        ]
        }))

}
export function touchBarColors(mainWindow:BrowserWindow){
    const nativeImage = require('electron').nativeImage;
    mainWindow.setTouchBar(new TouchBar({
        items:[
         
           new TouchBarColorPicker({
            change(color) {
                mainWindow.webContents.send("touchBar_color",color);
            },
           }),
        ]
        }))

}