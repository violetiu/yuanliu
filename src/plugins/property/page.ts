/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

底部  页面标签
***************************************************************************** */
import { ipcRenderer } from "electron";
import { IBackground, IComponent, IPanel } from "../../common/interfaceDefine";
import { ipcRendererSend } from "../../preload";
import * as form from "../../render/form";
import * as forms from "../../render/forms";
import { pushHistory } from "../../render/history";
import { renderPageLayout } from "../../render/pageLayout";
import { cal_gradient } from "../../render/propertypanel";
import { getCurPage, getCurPageContent, getCurViewContent, getLayers, getProjectTitleJson, renderPageBackground, reRenderPage, updatePageViewScrollH, updatePageViewScrollV } from "../../render/workbench";
import { getProject, openExpand, renderExpand, showMessageBox } from "../../render/workspace";
var image: HTMLImageElement;
var formHeight: forms.FormNumber;
var formWidth: forms.FormNumber;
var formScale: forms.FormSolider;
// var formTheme: forms.FormIcons;
var formStyle: forms.FormSelect;
// var formBackgroundType: forms.FormIcons;
// var formBackgroundSolidPanel: HTMLElement;
// var formBackgroundSolidPanelColor: forms.FormColor;
// var formBackgroundGradientPanel: HTMLElement;
// var formBackgroundGradientPanelColor1: forms.FormColor;
// var formBackgroundGradientPanelColor2: forms.FormColor;
// var formBackgroundGradientPanelType: forms.FormIcons;
// var formBackgroundGradientPanelAngle: forms.FormSolider;
// var formBackgroundGradientPanelPosition: forms.FormSolider;
// var formBackgroundImage: forms.FormSelect;
// var formBackgroundImageDiv: HTMLElement;
var formInfo: forms.FormPragraph;
var component_list: HTMLElement;
var hiddenMap = new Map();
var formMode: forms.FormIcons;
var lastPageKey: string;
const panel: IPanel = {
  key: "page", name: "页面", hidden: true, sort: 0,
  render: (content: HTMLElement) => {



    //image

    var imageDiv = document.createElement("div");
    imageDiv.style.textAlign = "center";
    imageDiv.style.paddingTop = "20px";
    imageDiv.style.paddingBottom = "20px";
    // imageDiv.style.position="relative";
    imageDiv.style.overflow = "hidden";
    content.appendChild(imageDiv);



    image = document.createElement("img");
    image.style.position = "relative";
    image.style.maxWidth = "200px";
    image.style.maxHeight = "200px";
    image.style.borderRadius = "5px";
    // image.style.boxShadow = "0px 0px 10px rgb(157 157 157 / 50%)";
    //image.src=getProject().work+"/images/cover.png";
    imageDiv.appendChild(image);
    image.ondblclick = () => {

      var page = getCurPage();

      //页面截图 保存
      const domToImage = require("dom-to-image");
      var dom = document.getElementById("page_view_" + page.key);
      var target: any = dom.getElementsByClassName("page_parent_content").item(0);

      requestIdleCallback(() => {

        domToImage.toJpeg(target, { quality: 1 })
          .then((jpeg: any) => {

            ipcRendererSend("downloadPageJpeg", { key: page.name, data: jpeg });

          })
      });

    }


    var setting = document.createElement("div");
    setting.style.position = "relative";
    setting.style.flex = "1";
    setting.style.marginLeft = "10px";
    setting.style.marginRight = "10px";
    setting.style.display = "block";
    content.appendChild(setting);

    var pageLayout = document.createElement("div");
    pageLayout.style.margin = "10px";
    pageLayout.style.borderRadius = "5px";
    pageLayout.style.overflow = "hidden";
    pageLayout.style.width = (content.clientWidth - 20) + "px";
    pageLayout.style.minHeight = "200px";
    pageLayout.id = "pageLayout";
    content.appendChild(pageLayout);

    pageLayout.ondblclick = () => {
      requestIdleCallback(() => {
        renderPageLayout();
      });
    }



    var row = document.createElement("div");
    setting.appendChild(row);

    var w = form.createDivRow(row, true);
    formWidth = new forms.FormNumber("宽度");
    formWidth.render(w);

    var h = form.createDivRow(row, true);
    formHeight = new forms.FormNumber("高度");
    formHeight.render(h);


    formScale = new forms.FormSolider("缩放", 110, 10, "%");
    formScale.render(setting);



    // formTheme = new forms.FormIcons("主题", ["bi bi-brightness-high-fill", "bi bi-moon-stars-fill"]);
    // formTheme.render(setting);

    var style = document.createElement("div");
    setting.appendChild(style);

    //
    ipcRendererSend("loadPlugins", "styles");
    ipcRenderer.on("_loadPlugins_styles", (event, args) => {
      console.log("_loadPluginsStyle", args);
      var styles: { label: string, value: any }[] = [

      ];
      args.forEach((item: string) => {
        var val = item.replace(".js", "");
        styles.push({ label: val, value: val });
      });
      formStyle = new forms.FormSelect("扩展样式", styles);
      formStyle.render(style);

    });

    // formBackgroundType = new forms.FormIcons("背景", ["bi bi-slash-circle", "bi bi-palette", "bi bi-circle-half", "bi bi-star"]);
    // formBackgroundType.render(setting);


    // //bg
    // var formBackgroundPanel = document.createElement("div");
    // formBackgroundPanel.style.paddingRight = "5px";
    // setting.appendChild(formBackgroundPanel);
    // //0 no

    // //1 color
    // formBackgroundSolidPanel = document.createElement("div");
    // formBackgroundSolidPanel.style.display = "none";
    // formBackgroundPanel.appendChild(formBackgroundSolidPanel);
    // formBackgroundSolidPanelColor = new forms.FormColor("填充颜色");
    // formBackgroundSolidPanelColor.render(formBackgroundSolidPanel);


    // //2 gradient

    // formBackgroundGradientPanel = document.createElement("div");
    // formBackgroundGradientPanel.style.display = "none";
    // formBackgroundPanel.appendChild(formBackgroundGradientPanel);
    // var row = document.createElement("div");
    // formBackgroundGradientPanel.appendChild(row);
    // var color1 = form.createDivRow(row, true);
    // formBackgroundGradientPanelColor1 = new forms.FormColor("");
    // formBackgroundGradientPanelColor1.render(color1);
    // var color2 = form.createDivRow(row);
    // formBackgroundGradientPanelColor2 = new forms.FormColor("");
    // formBackgroundGradientPanelColor2.render(color2);

    // formBackgroundGradientPanelType = new forms.FormIcons("类型", ["bi bi-dash-lg", "bi bi-circle"]);
    // formBackgroundGradientPanelType.render(formBackgroundGradientPanel);



    // formBackgroundGradientPanelAngle = new forms.FormSolider("角度", 180, -180);
    // formBackgroundGradientPanelAngle.render(formBackgroundGradientPanel);

    // formBackgroundGradientPanelPosition = new forms.FormSolider("位置", 100, 0);
    // formBackgroundGradientPanelPosition.render(formBackgroundGradientPanel);

    // //3 image
    // formBackgroundImageDiv = document.createElement("div");
    // formBackgroundImageDiv.style.display = "none";
    // formBackgroundPanel.appendChild(formBackgroundImageDiv);
    // formBackgroundImageDiv.style.paddingLeft = "5px";


    // ipcRendererSend("loadPlugins","background");

    // ipcRenderer.on("_loadPlugins_background", (event, args) => {
    //   console.log("_loadPluginsBg",args);
    //   var list: any = [];

    //   args.forEach((item: string) => {
    //     try {
    //       // console.log(item);
    //       var bg: IBackground = require("../background/" + item).default;
    //       if (bg != undefined) {
    //         list.push({
    //           label: bg.title, value: bg.key
    //         })

    //       }

    //     } catch (error) {
    //       console.log(error);
    //     }

    //   })
 
    //   formBackgroundImage = new forms.FormSelect("内置背景", list);
    //   formBackgroundImage.render(formBackgroundImageDiv);


    // })
    //mode 
    formMode = new forms.FormIcons("设计模式", ["bi bi-columns-gap", "bi bi-pin-angle"]);
    formMode.render(setting);


    //

    formInfo = new forms.FormPragraph("页面大纲");
    formInfo.render(setting);

    component_list = document.createElement("div");
    component_list.className = "form_bg component_list";
    component_list.style.minHeight = "30px";
    component_list.style.marginTop = "10px";
    component_list.style.borderRadius = "5px";

    setting.appendChild(component_list);

  },
  update: () => {


    if (getCurPage() == undefined) {
      return;
    }
    if (lastPageKey != undefined && getCurPage().key == lastPageKey) {
      return;
    }

    lastPageKey = getCurPage().key;
    console.log("page update:", lastPageKey);
    image.src = getProject().work + "/images/" + getCurPage().key + ".jpeg";
    formHeight.update(getCurPage().height + "", (value) => {
      var h = parseFloat(value);
      getCurPage().height = parseFloat(value);
      if (getProjectTitleJson().display) {
        getCurPageContent().style.height = (h - 40) + "px";

      } else {
        getCurPageContent().style.height = h + "px";
      }
      updatePageViewScrollV();
      pushHistory(getCurPage());
    });
    formWidth.update(getCurPage().width + "", (value) => {
      var h = parseFloat(value);
      getCurPage().width = parseFloat(value);
      if (getProjectTitleJson().display) {
        getCurPageContent().style.width = (h - 160) + "px";

      } else {
        getCurPageContent().style.width = h + "px";
      }
      updatePageViewScrollH();
      pushHistory(getCurPage());
    });
    var scale = 100;
    if (getCurPage().scale != undefined) {
      scale = getCurPage().scale * 100;
      scale = Math.round(scale * 100) / 100;
    }

    formScale.update(scale, (value) => {
      var s = value / 100;
      s = Math.round(s * 100) / 100;

      getCurPage().scale = s;
      var div = document.getElementById("page_parent_" + getCurPage().key);
      if (div != undefined) {
        div.style.transform = "scale(" + s + ")";
      }
    })

    // formTheme.update(getCurPage().theme == "light" ? 0 : 1, (value) => {
    //   var val: "light" | "dark" = "light";
    //   if (value == 0) {
    //     val = "light";
    //   } else {
    //     val = "dark";
    //   }
    //   getCurPage().theme = val;
    //   getCurViewContent().getElementsByClassName("page_parent")[0].className = "page_parent " + val;
    //   pushHistory(getCurPage());
    // });

    formStyle.update(getCurPage().style, (style) => {
      getCurPage().style = style;
      var exStyles = eval("require(style).default()");

      getCurPage().styles = exStyles;
      reRenderPage();
      pushHistory(getCurPage());
    });

    formInfo.update(getCurPage().info, (info) => {
      getCurPage().info = info;

      pushHistory(getCurPage());
    });

    // var bgType = 0;
    // if (getCurPage().backgroundType != undefined) {
    //   bgType = getCurPage().backgroundType;
    // }


    // formBackgroundType.update(bgType, (value) => {
    //   bgType = value;
    //   getCurPage().backgroundType = value;

    //   backgroundTypeSwitch();
    // });
    // backgroundTypeSwitch();
    // function backgroundTypeSwitch() {
    //   //  var gb: any = getCurViewContent().getElementsByClassName("page_parent")[0];
    //   var background = getCurPage().backgroundColor;
    //   if (bgType == 0) {
    //     formBackgroundSolidPanel.style.display = "none";
    //     formBackgroundGradientPanel.style.display = "none";
    //     formBackgroundImageDiv.style.display = "none";
    //     renderPageBackground(getCurPage());

    //   } else if (bgType == 1) {
    //     formBackgroundSolidPanel.style.display = "block";
    //     formBackgroundGradientPanel.style.display = "none";
    //     formBackgroundImageDiv.style.display = "none";

    //     renderPageBackground(getCurPage());
    //     formBackgroundSolidPanelColor.update(background, (value) => {

    //       getCurPage().backgroundColor = value;
    //       renderPageBackground(getCurPage());
    //     })
    //   } else if (bgType == 2) {
    //     formBackgroundSolidPanel.style.display = "none";
    //     formBackgroundGradientPanel.style.display = "block";
    //     formBackgroundImageDiv.style.display = "none";
    //     var type: number = 0;
    //     var angle = 0;
    //     var colors = ["", ""];

    //     if (background.indexOf("radial-gradient") >= 0) {
    //       var cs = background.match(/rgb([^)]+)/g);
    //       if (cs != undefined) {
    //         // var rgb=cs[0].substring(4).split(",");
    //         colors[0] = cs[0] + ")";
    //         colors[1] = cs[1] + ")";

    //       } else {
    //         cs = background.match(/rgba([^)]+)/g);
    //         if (cs != undefined) {
    //           colors[0] = cs[0] + ")";
    //           colors[1] = cs[1] + ")";
    //         }
    //       }
    //       type = 1;

    //     } else if (background.indexOf("linear-gradient") >= 0) {
    //       console.log(background);
    //       var as = background.match(/\d+deg/g);
    //       if (as != undefined) {
    //         angle = parseInt(as[0].substring(0, as[0].length - 2));
    //       }
    //       console.log("angle", angle);
    //       var cs = background.match(/rgb([^)]+)/g);
    //       if (cs != undefined) {
    //         // var rgb=cs[0].substring(4).split(",");
    //         colors[0] = cs[0] + ")";
    //         colors[1] = cs[1] + ")";

    //       } else {
    //         cs = background.match(/rgba([^)]+)/g);
    //         if (cs != undefined) {
    //           colors[0] = cs[0] + ")";
    //           colors[1] = cs[1] + ")";
    //         }
    //       }
    //     }
    //     var position = 50;
    //     formBackgroundGradientPanelColor1.update(colors[0], (value) => {
    //       colors[0] = value;
    //       var bg = cal_gradient(colors, angle, type, position);

    //       getCurPage().backgroundColor = bg;
    //       renderPageBackground(getCurPage());
    //     });
    //     formBackgroundGradientPanelColor2.update(colors[1], (value) => {
    //       colors[1] = value;
    //       var bg = cal_gradient(colors, angle, type, position);

    //       getCurPage().backgroundColor = bg;
    //       renderPageBackground(getCurPage());
    //     });

    //     formBackgroundGradientPanelType.update(type, (value) => {
    //       type = value;
    //       var bg = cal_gradient(colors, angle, type, position);

    //       getCurPage().backgroundColor = bg;
    //       renderPageBackground(getCurPage());
    //     })

    //     formBackgroundGradientPanelAngle.update(angle, (value) => {
    //       angle = value;
    //       var bg = cal_gradient(colors, angle, type, position);

    //       getCurPage().backgroundColor = bg;
    //       renderPageBackground(getCurPage());
    //     })
    //     formBackgroundGradientPanelPosition.update(position, (value) => {
    //       position = value;
    //       var bg = cal_gradient(colors, angle, type, position);

    //       getCurPage().backgroundColor = bg;
    //       renderPageBackground(getCurPage());
    //     })


    //   } else if (bgType == 3) {
    //     //内置背景
    //     formBackgroundSolidPanel.style.display = "none";
    //     formBackgroundGradientPanel.style.display = "none";
    //     formBackgroundImageDiv.style.display = "block";

    //     formBackgroundImage.update(getCurPage().backgroundColor, (value) => {

    //       getCurPage().backgroundColor = value;
    //       renderPageBackground(getCurPage());


    //     })
    //   }
    // }

    //mode

    var mode = 0;
    if (getCurPage().mode != undefined) {
      mode = ["flex", "fixed"].indexOf(getCurPage().mode);
    }
    formMode.update(mode, (val) => {
      console.log(getCurPage().children);
      if (getCurPage().children.length == 0) {
        getCurPage().mode = val == 0 ? "flex" : "fixed";
        reRenderPage();
      } else {
        showMessageBox("不能修改该页面模式，请先删除页面所有组价。", "info");

      }

    })

    //component_list  展示隐藏的组件
    requestIdleCallback(() => {

      var pageLayout = document.getElementById("pageLayout");
      if (pageLayout != undefined) {
        pageLayout.innerHTML = "";
      }
      component_list.innerHTML = "";
      var layers = getLayers();
      if (layers == undefined) return;
      // console.log("layers", layers);
      layers.forEach((layer: IComponent) => {

        renderLayersTree(layer);

      });

      function renderLayersTree(layer: IComponent) {
        if (layer.hidden || layer.isExpand) {
          var component_item = document.createElement("div");
          component_item.style.margin = "10px";
          component_item.style.cursor = "pointer";
          component_item.title = layer.label;
          component_item.style.display = "inline-block";
          var component_item_icon = document.createElement("i");
          component_item_icon.className = layer.icon;
          component_item.appendChild(component_item_icon);
          component_list.appendChild(component_item);
          hiddenMap.set(layer.key, layer.hidden);
          component_item.onclick = () => {

            if (layer.isExpand) {
              // renderExpand(layer);
              openExpand();
              renderExpand(layer);

            } else {
              var hidden = hiddenMap.get(layer.key);
              hidden = !hidden;
              hiddenMap.set(layer.key, hidden);
              if (layer.toogle != undefined) {
                layer.toogle(document.getElementById(layer.key), hidden);
              } else {
                document.getElementById(layer.key).style.display = hidden ? "none" : "block";
              }
              if (!hidden) {
                component_item_icon.style.color = "var(--theme-color)";
              } else {

                component_item_icon.style.color = "";

              }
            }



          }


        } else {
          if (layer.children != undefined && layer.children.length > 0) {
            layer.children.forEach(child => {
              renderLayersTree(child);
            });
          }

        }


      }

    });

  }

}
export default function load() {
  return panel;
}

