/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

右侧默认 属性
***************************************************************************** */
import { IMenuItem, openContextMenu } from "../../common/contextmenu";
import { ICatalog, IComponent, IComponentProperty, IPanel } from "../../common/interfaceDefine";
import { updateComponentsStyle } from "../../render/floatPanel";

import { ipcRenderer } from "electron";
import { deleteComponent, onSelectComponent, renderComponentShape, updateComponent } from "../../common/components";
import { set16ToRgb } from "../../dialog/picker";
import { ipcRendererSend } from "../../preload";
import * as form from "../../render/form";
import * as forms from "../../render/forms";
import { FormColor, FormComponent, FormIcon, FormIcons, FormNumber, FormNumbers, FormSelect, FormSolider, FormText } from "../../render/forms";
import { pushHistory } from "../../render/history";
import { cal_gradient, getComponentStyle, setComponentStyle } from "../../render/propertypanel";
import { renderExplorer, toggleExplorer } from "../../render/sidebar";
import { getCurPage, getCurPageKey, getLayers } from "../../render/workbench";

import { Editor } from "../../editor/editor";
var lastComponentKey: string;
const panel: IPanel = {
    key: "property", name: "属性", hidden: true, sort: 0,
    render: (content: HTMLElement) => {
        renderPropertypanel(content);
    },
    update: (args: any) => {
        //console.log("update property");
        if (args != undefined) {
            var component: IComponent = args;
            if (lastComponentKey == undefined || component.key != lastComponentKey) {
                console.log("property:", component.key);
                loadComponentsProperty(component);
                lastComponentKey = component.key;
            }

        } else {

            clearComponentsProperty();
        }



    }

}
export default function load() {
    return panel;
}



function renderPropertypanel(content: HTMLElement) {

    //console.log("renderPropertypanel");

    var propertyPanel = document.createElement("div");
    propertyPanel.className = "propertyPanel";
    propertyPanel.id = "propertyPanel";
    content.appendChild(propertyPanel);

    base = renderExplorer("property_base", propertyPanel, "基础", true, undefined, onExplorerHide);
    renderBaseProperty(base);
    layout = renderExplorer("property_layout", propertyPanel, "布局", true, undefined, onExplorerHide);
    renderLayoutProperty(layout);

    theme = renderExplorer("property_theme", propertyPanel, "填充", false, undefined, onExplorerHide);
    renderThemeProperty(theme);


    font = renderExplorer("property_font", propertyPanel, "字体&段落", true, undefined, onExplorerHide);
    renderFontProperty(font);

    style = renderExplorer("property_style", propertyPanel, "样式", true, undefined, onExplorerHide);
    renderComponentStyle(style);

    var shortcuts = renderExplorer("property_panel", propertyPanel, "快捷键", true, undefined, onExplorerHide);
    renderShortcutsProperty(shortcuts);

    layout.style.display = "none";
    theme.style.display = "none";
    style.style.display = "none";
    font.style.display = "none";
    base.style.display = "none";

}
function onExplorerHide(key: string, hide: boolean) {
    if (hide) {
        var index = showExplorers.findIndex(i => i == key);
        if (index >= 0) {
            showExplorers.splice(index, 1);
        }
    } else {
        var index = showExplorers.findIndex(i => i == key);
        if (index >= 0) {

        } else {
            if (showExplorers.length > 1) {
                var del = showExplorers[0];
                toggleExplorer(del, true);
                showExplorers.splice(0, 1);
            }

            showExplorers.push(key);

        }

    }
}
var showExplorers: Array<string> = ["property_theme"];
var layers: HTMLElement;
var layout: HTMLElement;
var theme: HTMLElement;
var base: HTMLElement;
var style: HTMLElement;
var font: HTMLElement;



export function clearComponentsProperty() {

    layout.style.display = "none";
    theme.style.display = "none";
    style.style.display = "none";
    font.style.display = "none";
    base.style.display = "none";

}


export function loadComponentsProperty(component: IComponent) {


    layout.style.display = "block";
    theme.style.display = "block";
    style.style.display = "block";

    base.style.display = "block";



    if (component.group == "chart" || component.group == "layout") {
        font.style.display = "none";
    } else {
        font.style.display = "block";
    }

    formBaseKey.update(component.key);
    formBaseType.update(component.type);
    formBaseLabel.update(component.label, (value) => {
        component.label = value;

    });
    updateBaseProperty(component);
    formWidth.update(getComponentStyle(component, "width", "px"), (value) => {
        if (value == "") value = "auto";
        if (component.type == "grid") {
            setComponentStyle(component, "flex", "none");

        }


        if (/\d+\.?\d*/.test(value)) {

            setComponentStyle(component, "width", value + "px");
            setComponentStyle(component, "min-width", value + "px");
            pushHistory(getCurPage());
        } else {
            setComponentStyle(component, "width", "auto");
            setComponentStyle(component, "min-width", "auto");
            pushHistory(getCurPage());
        }


    });

    formHeight.update(getComponentStyle(component, "height", "px"), (value) => {
        if (value == "") value = "auto";
        if (/\d+\.?\d*/.test(value)) {
            setComponentStyle(component, "height", value + "px");
            setComponentStyle(component, "min-height", value + "px");
            pushHistory(getCurPage());
        } else {
            setComponentStyle(component, "height", "auto");
            setComponentStyle(component, "min-height", "auto");
            pushHistory(getCurPage());
        }

    });

    var styleDisplay = getComponentStyle(component, "display");
    //console.log("styleDisplay : ",styleDisplay);
    if (styleDisplay == "flex") {
        formFlex.style.display = "block";
        var valign = 0;
        var valignText = getComponentStyle(component, "justify-content", "");
        if (valignText != undefined && valignText.trim() == "start") {
            valign = 0;
        } else if (valignText != undefined && valignText.trim() == "center") {
            valign = 1;
        } else if (valignText != undefined && valignText.trim() == "end") {
            valign = 2;
        }
        formAlignH.update(valign, (index) => {
            setComponentStyle(component, "justify-content", ["start", "center", "end"][index]);
            pushHistory(getCurPage());
        })

        var halign = 0;
        var halignText = getComponentStyle(component, "align-items", "");

        if (halignText != undefined && halignText.trim() == "flex-start") {
            halign = 0;
        } else if (halignText != undefined && halignText.trim() == "center") {
            halign = 1;
        } else if (halignText != undefined && halignText.trim() == "flex-end") {
            halign = 2;
        }


        formAlignV.update(halign, (index) => {
            setComponentStyle(component, "align-items", ["flex-start", "center", "flex-end"][index]);
            pushHistory(getCurPage());
        })

    } else {
        formFlex.style.display = "none";
    }

    //


    var padding: number[] = [0, 0, 0, 0];
    var paddingText = getComponentStyle(component, "padding", "px");
    if (paddingText.length > 0) {
        paddingText = paddingText.trim();
        if (paddingText.indexOf(" ") > 0) {
            var paddingArray = paddingText.split(" ");
            padding[0] = parseInt(paddingArray[0]);
            padding[1] = parseInt(paddingArray[1]);
            padding[2] = parseInt(paddingArray[2]);
            padding[3] = parseInt(paddingArray[3]);
        } else {
            padding = [parseFloat(paddingText), parseFloat(paddingText), parseFloat(paddingText), parseFloat(paddingText)];
        }

    }
    var paddingTop = getComponentStyle(component, "padding-top", "px");

    var paddingLeft = getComponentStyle(component, "padding-left", "px");
    var paddingRight = getComponentStyle(component, "padding-right", "px");
    var paddingBottom = getComponentStyle(component, "padding-bottom", "px");
    if (paddingTop.length > 0) {
        padding[0] = parseInt(paddingTop);
    }
    if (paddingLeft.length > 0) {
        padding[3] = parseInt(paddingLeft);
    }
    if (paddingRight.length > 0) {
        padding[1] = parseInt(paddingRight);
    }
    if (paddingBottom.length > 0) {
        padding[2] = parseInt(paddingBottom);
    }
    formPadding.update(padding, (values) => {
        setComponentStyle(component, "padding-top", values[0] + "px");
        setComponentStyle(component, "padding-right", values[1] + "px");
        setComponentStyle(component, "padding-bottom", values[2] + "px");
        setComponentStyle(component, "padding-left", values[3] + "px");
        pushHistory(getCurPage());
    });
    //
    var margin: number[] = [0, 0, 0, 0];
    var marginText = getComponentStyle(component, "margin", "px");
    if (marginText.length > 0) {
        marginText = marginText.trim();
        if (marginText.indexOf(" ") > 0) {
            var marginArray = marginText.split(" ");
            margin[0] = parseInt(marginArray[0]);
            margin[1] = parseInt(marginArray[1]);
            margin[2] = parseInt(marginArray[2]);
            margin[3] = parseInt(marginArray[3]);
        } else {
            margin = [parseFloat(marginText), parseFloat(marginText), parseFloat(marginText), parseFloat(marginText)];
        }

    }
    var marginTop = getComponentStyle(component, "margin-top", "px");

    var marginLeft = getComponentStyle(component, "margin-left", "px");
    var marginRight = getComponentStyle(component, "margin-right", "px");
    var marginBottom = getComponentStyle(component, "margin-bottom", "px");
    if (marginTop.length > 0) {
        margin[0] = parseInt(marginTop);
    }
    if (marginLeft.length > 0) {
        margin[3] = parseInt(marginLeft);
    }
    if (marginRight.length > 0) {
        margin[1] = parseInt(marginRight);
    }
    if (marginBottom.length > 0) {
        margin[2] = parseInt(marginBottom);
    }
    formMargin.update(margin, (values) => {
        setComponentStyle(component, "margin-top", values[0] + "px");
        setComponentStyle(component, "margin-right", values[1] + "px");
        setComponentStyle(component, "margin-bottom", values[2] + "px");
        setComponentStyle(component, "margin-left", values[3] + "px");
        pushHistory(getCurPage());
    });
    var overview = getComponentStyle(component, "overflow");
    var overviewVal = 0;
    if (overview == undefined) {
        overview = "visible";
    } else {
        overviewVal = ["visible", "auto", "hidden"].findIndex(p => p == overview);
    }

    formOverFlow.update(overviewVal, (index) => {
        setComponentStyle(component, "overflow", ["visible", "auto", "hidden"][index]);
    })
    var tranform = getComponentStyle(component, "transform");

    var rotate = 0;

    if (tranform != undefined && tranform.indexOf("rotate") >= 0) {
        var rotateM = tranform.match(/\-?\d+\.?\d*/);
        if (rotateM != null) {
            rotate = parseFloat(rotateM[0]);
        }

    }
    formRotate.update(rotate, (value) => {
        if (tranform != undefined && tranform.indexOf("rotate") >= 0) {
            var newTranform = tranform.replace(/rotate\(\-?\d+\.?\d*deg\)/, ("rotate(" + value + "deg)"));
            setComponentStyle(component, "transform", newTranform);

        } else {
            setComponentStyle(component, "transform", "rotate(" + value + "deg)");
        }

    })

    var position = 0;
    var postionStyle = getComponentStyle(component, "position");
    if (postionStyle != undefined) {
        try {
            position = ["relative", "absolute"].findIndex((i) => i == postionStyle);
        } catch (error) {

        }
    }


    formPosition.update(position, (value) => {
        setComponentStyle(component, "position", ["relative", "absolute"][value]);



    })


    //position
    var top: number;
    var topStyle = getComponentStyle(component, "top", "px");
    if (topStyle != undefined && topStyle.length > 0) {
        top = parseFloat(topStyle);
    }
    var left: number;
    var leftStyle = getComponentStyle(component, "left", "px");
    if (leftStyle != undefined && leftStyle.length > 0) {
        left = parseFloat(leftStyle);
    }
    var right: number;
    var rightStyle = getComponentStyle(component, "right", "px");
    if (rightStyle != undefined && rightStyle.length > 0) {
        right = parseFloat(rightStyle);
    }
    var bottom: number;
    var bottomStyle = getComponentStyle(component, "bottom", "px");
    if (bottomStyle != undefined && bottomStyle.length > 0) {
        bottom = parseFloat(bottomStyle);
    }
    formInset.update([top, right, bottom, left], (values) => {
        if (values[0] != undefined) {
            setComponentStyle(component, "top", values[0] + "px");
        }
        if (values[1] != undefined) {
            setComponentStyle(component, "right", values[1] + "px");
        }
        if (values[2] != undefined) {
            setComponentStyle(component, "bottom", values[2] + "px");
        }
        if (values[3] != undefined) {
            setComponentStyle(component, "left", values[3] + "px");
        }

    })
    var zIndex = 0;
    var zIndexStr = getComponentStyle(component, "z-index");
    if (zIndexStr != undefined) {
        try {
            zIndex = parseInt(zIndexStr);
        } catch (error) {

        }
    }


    formZIndex.update(zIndex + "", (value) => {
        setComponentStyle(component, "z-index", value);
    })
    var flexNum = 0;
    var flexStyle = getComponentStyle(component, "flex");
    if (flexStyle != undefined && flexStyle.length > 0) {
        flexNum = parseFloat(flexStyle);
    }
    formFlexNum.update(flexNum, (value) => {
        setComponentStyle(component, "flex", value + "");
    })

    //font
    formFontFamily.update(getComponentStyle(component, "font-family", ""), (value) => {
        setComponentStyle(component, "font-family", value);
        pushHistory(getCurPage());
    });
    formFontSize.update(getComponentStyle(component, "font-size", "px"), (value) => {
        setComponentStyle(component, "font-size", value + "px");
        pushHistory(getCurPage());
    });
    formFontLineHeight.update(getComponentStyle(component, "line-height"), (value) => {
        setComponentStyle(component, "line-height", value);
        pushHistory(getCurPage());
    });
    var align = 0; var alignText = getComponentStyle(component, "line-height", "");
    if (alignText == "left") {
        align = 0;
    } else if (alignText == "center") {
        align = 1;
    } else if (alignText == "right") {
        align = 2;
    }
    formFontAlign.update(align, (value) => {
        setComponentStyle(component, "text-align", ["left", "center", "right"][value])
        pushHistory(getCurPage());
    });
    //theme
    if (component.background == undefined) {
        component.background = 0;

    }

    formBackgroundType.update(component.background, (value) => {
        component.background = value;
        if (value == 0) {
            setComponentStyle(component, "background", "transparent");
            pushHistory(getCurPage());
        }
        backgroundTypeSwitch();
    });
    backgroundTypeSwitch();
    function backgroundTypeSwitch() {
        if (component.background == 0) {
            formBackgroundSolidPanel.style.display = "none";
            formBackgroundGradientPanel.style.display = "none";
            formBackgroundImagePanel.style.display = "none";
        } else if (component.background == 1) {
            formBackgroundSolidPanel.style.display = "block";
            formBackgroundGradientPanel.style.display = "none";
            formBackgroundImagePanel.style.display = "none";
            formBackgroundSolidPanelColor.update(getComponentStyle(component, "background"), (value) => {
                setComponentStyle(component, "background", value);
            })
        } else if (component.background == 2) {
            formBackgroundSolidPanel.style.display = "none";
            formBackgroundGradientPanel.style.display = "block";
            formBackgroundImagePanel.style.display = "none";
            var type: number = 0;
            var angle = 0;
            var colors = ["", ""];
            var background = getComponentStyle(component, "background");
            if (background.indexOf("radial-gradient") >= 0) {
                var cs = background.match(/rgb([^)]+)/g);
                if (cs != undefined) {
                    // var rgb=cs[0].substring(4).split(",");
                    colors[0] = cs[0] + ")";
                    colors[1] = cs[1] + ")";

                } else {
                    cs = background.match(/rgba([^)]+)/g);
                    if (cs != undefined) {
                        colors[0] = cs[0] + ")";
                        colors[1] = cs[1] + ")";
                    }
                }
                type = 1;

            } else if (background.indexOf("linear-gradient") >= 0) {
                //console.log(background);
                var as = background.match(/\d+deg/g);
                if (as != undefined) {
                    angle = parseInt(as[0].substring(0, as[0].length - 2));
                }
                //console.log("angle", angle);
                var cs = background.match(/rgb([^)]+)/g);
                if (cs != undefined) {
                    // var rgb=cs[0].substring(4).split(",");
                    colors[0] = cs[0] + ")";
                    colors[1] = cs[1] + ")";

                } else {
                    cs = background.match(/rgba([^)]+)/g);
                    if (cs != undefined) {
                        colors[0] = cs[0] + ")";
                        colors[1] = cs[1] + ")";
                    }
                }
            }
            var position = 50;
            formBackgroundGradientPanelColor1.update(colors[0], (value) => {
                colors[0] = value;
                var bg = cal_gradient(colors, angle, type, position);
                setComponentStyle(component, "background", bg);
                pushHistory(getCurPage());
            });
            formBackgroundGradientPanelColor2.update(colors[1], (value) => {
                colors[1] = value;
                var bg = cal_gradient(colors, angle, type, position);
                setComponentStyle(component, "background", bg);
                pushHistory(getCurPage());
            });

            formBackgroundGradientPanelType.update(type, (value) => {
                type = value;
                var bg = cal_gradient(colors, angle, type, position);
                setComponentStyle(component, "background", bg);
                pushHistory(getCurPage());
            })

            formBackgroundGradientPanelAngle.update(angle, (value) => {
                angle = value;
                var bg = cal_gradient(colors, angle, type, position);
                setComponentStyle(component, "background", bg);
                pushHistory(getCurPage());
            })
            formBackgroundGradientPanelPosition.update(position, (value) => {
                position = value;
                var bg = cal_gradient(colors, angle, type, position);
                setComponentStyle(component, "background", bg);
                pushHistory(getCurPage());
            })


        } else if (component.background == 3) {
            formBackgroundSolidPanel.style.display = "none";
            formBackgroundGradientPanel.style.display = "none";
            formBackgroundImagePanel.style.display = "block";
            var gl1 = "rgba(255, 255, 255, 0.01)";
            var gl2 = "rgba(255, 255, 255, 0.85)";
            var gl3 = "rgba(220, 50, 10, 0.5)";
            var gl4 = "rgba(120, 0, 30, 0.5)";
            var gl5 = "rgba(30, 8, 2, 0.5)";
            var gl6 = "rgba(123, 11, 9, 0.5)";

            var bgStyle = getComponentStyle(component, "background");
            // console.log("bgStyle", bgStyle);
            if (bgStyle != undefined && bgStyle.split("rgba").length == 7) {
                var sp = bgStyle.split("rgba(");
                gl1 = "rgba(" + sp[1].split(")")[0] + ")";
                gl2 = "rgba(" + sp[2].split(")")[0] + ")";
                gl3 = "rgba(" + sp[3].split(")")[0] + ")";
                gl4 = "rgba(" + sp[4].split(")")[0] + ")";
                gl5 = "rgba(" + sp[5].split(")")[0] + ")";
                gl6 = "rgba(" + sp[6].split(")")[0] + ")";
            }

            formBackgroundGLColor1.update(gl1, (color) => {
                gl1 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setComponentStyle(component, "background", gl);

            });

            formBackgroundGLColor2.update(gl2, (color) => {
                gl2 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setComponentStyle(component, "background", gl);

            });

            formBackgroundGLColor3.update(gl3, (color) => {
                gl3 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setComponentStyle(component, "background", gl);

            });

            formBackgroundGLColor4.update(gl4, (color) => {
                gl4 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setComponentStyle(component, "background", gl);

            });
            formBackgroundGLColor5.update(gl5, (color) => {
                gl5 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setComponentStyle(component, "background", gl);

            });

            formBackgroundGLColor6.update(gl6, (color) => {
                gl6 = color;
                var gl = "linear-gradient(" + gl1 + ", " + gl2 + "), radial-gradient(at left top, " + gl3 + ", transparent 50%),  radial-gradient(at right top," + gl4 + ", transparent 50%),   radial-gradient(at right center, " + gl5 + ", transparent 50%),   radial-gradient(at left center," + gl6 + ", transparent 50%)";
                setComponentStyle(component, "background", gl);

            });




        }
    }

    //border
    var border = getStyleBorder(component);
    //position
    formBorderPosition.update(border.position, (value) => {
        border.position = value;
        if (value == 0) {
            setStyleBorder(component, border);
            pushHistory(getCurPage());
        }
        borderSwitch();


    });
    borderSwitch();
    function borderSwitch() {
        if (border.position == 0) {
            formBorderPanel.style.display = "none";
        } else {
            formBorderPanel.style.display = "block";

            formBorderPanelType.update(border.type, (value) => {
                border.type = value;
                setStyleBorder(component, border);
                pushHistory(getCurPage());
            });
            formBorderPanelWidth.update(border.width + "", (value) => {
                border.width = parseFloat(value);
                setStyleBorder(component, border);
                pushHistory(getCurPage());
            });
            formBorderPanelColor.update(border.color, (value) => {
                border.color = value;
                setStyleBorder(component, border);
                pushHistory(getCurPage());
            });
            formBorderPanelRadius.update(border.radius + "", (value) => {
                border.radius = parseFloat(value);
                setStyleBorder(component, border);
                pushHistory(getCurPage());
            });


        }

    }






    formColor.update(getComponentStyle(component, "color"), (color) => {
        setComponentStyle(component, "color", color);
    })


    //style
    formStyleMaster.update(component.master, (cmpt) => {
        if (cmpt == undefined) {
            component.master = undefined;
            updateComponentsStyle([component]);
            pushHistory(getCurPage());
            return;
        }
        if (component.type == cmpt.type && component.key != cmpt.key) {
            component.master = cmpt.path;
            component.style = cmpt.style;
            component.styles = cmpt.styles;
            updateComponentsStyle([component]);
            pushHistory(getCurPage());
            return true;
        } else {
            alert("请选择合适的母版");
            return false;
        }
    });
    renderComponentStyleEditor(component);
    //font ...
    formFontBolder.update(getComponentStyle(component, "font-weight") == "bolder", (value) => {
        setComponentStyle(component, "font-weight", value ? "bolder" : "normal");
        pushHistory(getCurPage());
    });
    formFontItalic.update(getComponentStyle(component, "font-style") == "italic", (value) => {
        setComponentStyle(component, "font-style", value ? "italic" : "normal");
        pushHistory(getCurPage());
    });
    formFontLine.update(getComponentStyle(component, "text-decoration") == "underline", (value) => {
        setComponentStyle(component, "text-decoration", value ? "underline" : "none");
        pushHistory(getCurPage());
    });
    //pra
    formFontIndent.update(getComponentStyle(component, "text-indent", "em") + "", (value) => {
        setComponentStyle(component, "text-indent", value + "em");
        pushHistory(getCurPage());
    })
    var boxshadow = [0, 0, 0];
    var boxshadowColor = "rgba(0,0,0,0.5)";
    //box-shadow
    var boxshadowStyle = getComponentStyle(component, "box-shadow");
    if (boxshadowStyle != undefined && boxshadowStyle.length > 0 && boxshadowStyle != "none") {
        var list = boxshadowStyle.split("px ");
        boxshadow[0] = parseInt(list[0]);
        boxshadow[1] = parseInt(list[1]);
        boxshadow[2] = parseInt(list[2]);
        boxshadowColor = list[3];
    }

    formBoxShadow.update(boxshadow, (value) => {
        //console.log(value);
        boxshadow = value;
        setComponentStyle(component, "box-shadow", boxshadow[0] + "px " + boxshadow[1] + "px " + boxshadow[2] + "px " + boxshadowColor);
        pushHistory(getCurPage());
    });
    formBoxShadowColor.update(boxshadowColor, (value) => {
        boxshadowColor = value;
        setComponentStyle(component, "box-shadow", boxshadow[0] + "px " + boxshadow[1] + "px " + boxshadow[2] + "px " + boxshadowColor);
        pushHistory(getCurPage());
    });
    //text-shadow
    var textshadow = [0, 0, 0];
    var textshadowColor = "rgba(0,0,0,0.5)";
    var textshadowStyle = getComponentStyle(component, "text-shadow");
    if (textshadowStyle != undefined && textshadowStyle.length > 0 && textshadowStyle != "none") {
        var list = textshadowStyle.split("px ");
        textshadow[0] = parseInt(list[0]);
        textshadow[1] = parseInt(list[1]);
        textshadow[2] = parseInt(list[2]);
        textshadowColor = list[3];
    }
    formTextShadow.update(textshadow, (value) => {
        textshadow = value;
        setComponentStyle(component, "text-shadow", textshadow[0] + "px " + textshadow[1] + "px " + textshadow[2] + "px " + textshadowColor);
        pushHistory(getCurPage());
    });
    formTextShadowColor.update(textshadowColor, (value) => {
        textshadowColor = value;
        setComponentStyle(component, "text-shadow", textshadow[0] + "px " + textshadow[1] + "px " + textshadow[2] + "px " + textshadowColor);
        pushHistory(getCurPage());
    });
    var opacity = 0;
    var op = getComponentStyle(component, "opacity");
    if (op != undefined && op.length > 0) {
        try {
            opacity = 100 - parseFloat(op) * 100;
        } catch (error) {

        }
    }


    //opacity
    formOpacity.update(opacity, (value) => {
        var nop = 1 - Math.round(value) / 100;
        setComponentStyle(component, "opacity", nop + "");

    })
    var bdBlur = 0;
    var bd = getComponentStyle(component, "backdrop-filter");
    if (bd != undefined && bd.indexOf("blur") >= 0) {
        bdBlur = parseInt(bd.replace("blur(", "").replace("px)", "").trim());
    }

    //
    formBackdrop.update(bdBlur, (value) => {
        //	backdrop-filter: blur(1px);
        setComponentStyle(component, "backdrop-filter", "blur(" + value + "px)");

    });


    //shape 
    formShape.update(component.shape, (value) => {
        component.shape = value;
        renderComponentShape(component, document.getElementById(component.key));
    })



}

function setStyleBorder(component: IComponent, border: {
    radius: number,
    width: number,
    type: number,
    bs: boolean[],
    color: string,
    position: number
}) {
    var type = ["solid", "dotted"][border.type];

    var borderStyle = "";
    if (border.position == 0) {
        borderStyle = "\tborder:none;";
    } else if (border.position == 1) {
        borderStyle = "\tborder:" + border.width + "px " + type + " " + border.color + ";";
    } else if (border.position == 2) {
        borderStyle = "\tborder-top:" + border.width + "px " + type + " " + border.color + ";";
    }
    else if (border.position == 3) {
        borderStyle = "\tborder-right:" + border.width + "px " + type + " " + border.color + ";";
    }
    else if (border.position == 4) {
        borderStyle = "\tborder-bottom:" + border.width + "px " + type + " " + border.color + ";";
    }
    else if (border.position == 5) {
        borderStyle = "\tborder-left:" + border.width + "px " + type + " " + border.color + ";";
    }
    if (border.radius > 0) {
        borderStyle += "\tborder-radius:" + border.radius + "px;";
    }
    if (component.style != undefined) {
        var style = component.style;
        style = style.replace(/;/g, "; ");
        style = style.replace(/[^-]border[^:]*:[^;]+;/g, "");
        style = style.replace(/; /g, ";");
        if (!style.trim().endsWith(";")) {
            style += ";";
        }
        if (borderStyle.length > 0)
            component.style = style + borderStyle;

    } else if (component.styles != undefined) {
        var styles = component.styles["root"];
        styles = styles.replace(/;/g, "; ");
        styles = styles.replace(/[^-]border[^:]*:[^;]+;/g, "");
        styles = styles.replace(/; /g, ";");
        if (!styles.trim().endsWith(";")) {
            styles += ";";
        }
        if (borderStyle.length > 0)
            component.styles["root"] = styles + borderStyle;
    }
    updateComponentsStyle([component]);
}
/**
 * 
 * @param style  component.style
 * @returns 
 */
function getStyleBorder(component: IComponent): {
    radius: number,
    width: number,
    type: number,
    bs: boolean[],
    color: string,
    position: number
} {
    var style = "";
    if (component.style != undefined) {
        style = component.style;
    } else if (component.styles != undefined) {
        style = component.styles["root"];
    }
    var radius = 0;
    var bs = [false, false, false, false];
    var width = 0;
    var color = "";
    var type = 0;
    var position = 0;
    var m = style.match(/[^-]border[^:]*:[^;]+;/g);
    if (m != undefined && m != null && m.length > 0) {
        //console.log(m);
        for (var i = 0; i < m.length; i++) {
            var s = m[i];
            if (s.indexOf("radius:") >= 0) {
                radius = parseFloat(m[i].split(":")[1].replace("px", ""));
            } else if (s.indexOf("border:") >= 0) {
                bs = [true, true, true, true];
                var mw = s.match(/\d+px/);
                if (mw != undefined && mw.length > 0) {
                    width = parseFloat(mw[0].replace("px", ""));
                }
                if (s.indexOf("solid") >= 0) {
                    type = 0;
                } else {
                    type = 1;
                }
                //console.log(s);
                var mc = s.match(/(rgb[^;]*)|(#[^;]*)/);

                if (mc != undefined && mc.length > 0) {
                    color = mc[0];
                }
                mc = s.match(/#\d+/);
                if (mc != undefined && mc.length > 0) {
                    color = set16ToRgb(mc[0]);
                }
                mc = s.match(/(var\([^\)]+\))/);
                if (mc != undefined && mc.length > 0) {
                    color = mc[0];
                }


            } else if (s.indexOf("border-top:") >= 0) {
                bs[0] = true;
                var mw = s.match(/\d+px/);
                if (mw != undefined && mw.length > 0) {
                    width = parseFloat(mw[0].replace("px", ""));
                }
                if (s.indexOf("solid") >= 0) {
                    type = 0;
                } else {
                    type = 1;
                }
                var mc = s.match(/(rgb[^;]*)|(#[^;]*)/);
                if (mc != undefined && mc.length > 0) {
                    color = mc[0];
                }
            } else if (s.indexOf("border-right:") >= 0) {
                bs[1] = true;
                var mw = s.match(/\d+px/);
                if (mw != undefined && mw.length > 0) {
                    width = parseFloat(mw[0].replace("px", ""));
                }
                if (s.indexOf("solid") >= 0) {
                    type = 0;
                } else {
                    type = 1;
                }
                var mc = s.match(/(rgb[^;]*)|(#[^;]*)/);
                if (mc != undefined && mc.length > 0) {
                    color = mc[0];
                }
            }
            else if (s.indexOf("border-bottom:") >= 0) {
                bs[2] = true;
                var mw = s.match(/\d+px/);
                if (mw != undefined && mw.length > 0) {
                    width = parseFloat(mw[0].replace("px", ""));
                }
                if (s.indexOf("solid") >= 0) {
                    type = 0;
                } else {
                    type = 1;
                }
                var mc = s.match(/(rgb[^;]*)|(#[^;]*)/);
                if (mc != undefined && mc.length > 0) {
                    color = mc[0];
                }
            }
            else if (s.indexOf("border-left:") >= 0) {
                bs[3] = true;
                var mw = s.match(/\d+px/);
                if (mw != undefined && mw.length > 0) {
                    width = parseFloat(mw[0].replace("px", ""));
                }
                if (s.indexOf("solid") >= 0) {
                    type = 0;
                } else {
                    type = 1;
                }
                var mc = s.match(/(rgb[^;]*)|(#[^;]*)/);
                if (mc != undefined && mc.length > 0) {
                    color = mc[0];
                }
            }


        }

    }

    if (!bs[0] && !bs[1] && !bs[2] && !bs[3]) {
        position = 0;
    } else if (bs[0] && bs[1] && bs[2] && bs[3]) {
        position = 1;
    } else if (bs[0] && !bs[1] && !bs[2] && !bs[3]) {
        position = 2;
    }
    else if (!bs[0] && bs[1] && !bs[2] && !bs[3]) {
        position = 3;
    }
    else if (!bs[0] && !bs[1] && bs[2] && !bs[3]) {
        position = 4;
    }
    else if (!bs[0] && !bs[1] && !bs[2] && bs[3]) {
        position = 5;
    }

    return {
        radius: radius,
        width: width,
        type: type,
        bs: bs,
        color: color,
        position: position
    }
}

var formColor: FormColor;
var formBackgroundType: FormIcons;
var formBorderPosition: FormIcons;
var formBackgroundPanel: HTMLElement;
var formBackgroundSolidPanel: HTMLElement;
var formBackgroundGradientPanel: HTMLElement;
var formBackgroundImagePanel: HTMLElement;
var formBackgroundSolidPanelColor: FormColor;

var formBackgroundGradientPanelColor1: FormColor;
var formBackgroundGradientPanelColor2: FormColor;
var formBackgroundGradientPanelType: FormIcons;
var formBackgroundGradientPanelAngle: FormSolider;
var formBackgroundGradientPanelPosition: FormSolider;

var formBackgroundGLColor1: FormColor;
var formBackgroundGLColor2: FormColor;
var formBackgroundGLColor3: FormColor;
var formBackgroundGLColor4: FormColor;
var formBackgroundGLColor5: FormColor;
var formBackgroundGLColor6: FormColor;

var formBorderPanel: HTMLElement;
var formBorderPanelType: FormIcons;
var formBorderPanelWidth: FormNumber;
var formBorderPanelColor: FormColor;
var formBorderPanelRadius: FormNumber;

var formBoxShadow: FormNumbers;
var formBoxShadowColor: FormColor;

var formOpacity: FormSolider;

var formShape: FormSelect;

var formBackdrop: FormSolider;

function renderThemeProperty(context: HTMLElement) {
    var body = document.createElement("div");
    body.style.padding = "0px 10px 10px 10px";
    context.appendChild(body);
    formBackgroundType = new FormIcons("背景", ["bi bi-slash-circle", "bi bi-paint-bucket", "bi bi-circle-half", "bi bi-palette"]);
    formBackgroundType.render(body);
    //bg
    formBackgroundPanel = document.createElement("div");
    formBackgroundPanel.style.paddingLeft = "10px";
    body.appendChild(formBackgroundPanel);
    //0 no

    //1 color
    formBackgroundSolidPanel = document.createElement("div");
    formBackgroundSolidPanel.style.display = "none";
    formBackgroundPanel.appendChild(formBackgroundSolidPanel);
    formBackgroundSolidPanelColor = new FormColor("填充颜色");
    formBackgroundSolidPanelColor.render(formBackgroundSolidPanel);


    //2 gradient

    formBackgroundGradientPanel = document.createElement("div");
    formBackgroundGradientPanel.style.display = "none";
    formBackgroundPanel.appendChild(formBackgroundGradientPanel);
    var row = document.createElement("div");
    formBackgroundGradientPanel.appendChild(row);
    var color1 = form.createDivRow(row, true);
    formBackgroundGradientPanelColor1 = new FormColor("");
    formBackgroundGradientPanelColor1.render(color1);
    var color2 = form.createDivRow(row);
    formBackgroundGradientPanelColor2 = new FormColor("");
    formBackgroundGradientPanelColor2.render(color2);

    formBackgroundGradientPanelType = new FormIcons("类型", ["bi bi-dash-lg", "bi bi-circle"]);
    formBackgroundGradientPanelType.render(formBackgroundGradientPanel);

    formBackgroundGradientPanelAngle = new FormSolider("角度", 180, -180);
    formBackgroundGradientPanelAngle.render(formBackgroundGradientPanel);

    formBackgroundGradientPanelPosition = new FormSolider("位置", 100, 0);
    formBackgroundGradientPanelPosition.render(formBackgroundGradientPanel);

    //3 image
    formBackgroundImagePanel = document.createElement("div");
    formBackgroundImagePanel.style.display = "none";
    formBackgroundPanel.appendChild(formBackgroundImagePanel);


    var formBackgroundGLRow1 = document.createElement("div");
    formBackgroundImagePanel.appendChild(formBackgroundGLRow1);
    var formBackgroundGLColor1Div = forms.createDivRow(formBackgroundGLRow1, true);
    formBackgroundGLColor1 = new FormColor("背景1");
    formBackgroundGLColor1.render(formBackgroundGLColor1Div);
    var formBackgroundGLColor2Div = forms.createDivRow(formBackgroundGLRow1);
    formBackgroundGLColor2 = new FormColor("背景2");
    formBackgroundGLColor2.render(formBackgroundGLColor2Div);

    var formBackgroundGLRow2 = document.createElement("div");
    formBackgroundImagePanel.appendChild(formBackgroundGLRow2);
    var formBackgroundGLColor3Div = forms.createDivRow(formBackgroundGLRow2, true);
    formBackgroundGLColor3 = new FormColor("前景1");
    formBackgroundGLColor3.render(formBackgroundGLColor3Div);
    var formBackgroundGLColor4Div = forms.createDivRow(formBackgroundGLRow2);
    formBackgroundGLColor4 = new FormColor("前景2");
    formBackgroundGLColor4.render(formBackgroundGLColor4Div);


    var formBackgroundGLRow3 = document.createElement("div");
    formBackgroundImagePanel.appendChild(formBackgroundGLRow3);
    var formBackgroundGLColor5Div = forms.createDivRow(formBackgroundGLRow3, true);
    formBackgroundGLColor5 = new FormColor("前景3");
    formBackgroundGLColor5.render(formBackgroundGLColor5Div);
    var formBackgroundGLColor6Div = forms.createDivRow(formBackgroundGLRow3);
    formBackgroundGLColor6 = new FormColor("前景4");
    formBackgroundGLColor6.render(formBackgroundGLColor6Div);


    // //[none,color,gradient,image]
    // if (component.background == undefined) {
    //     component.background = 0;
    // }
    // form.createDivIconSelect(body, "背景", ["bi bi-slash-circle", "bi bi-palette", "bi bi-circle-half", "bi bi-image"], component.background, (index) => {
    //     component.background = index;
    //     renderBackgroundProperty(background, component)
    // })

    // renderBackgroundProperty(background, component)
    formBorderPosition = new FormIcons("边框", ["bi bi-border", "bi bi-border-outer", "bi bi-border-top", "bi bi-border-right", "bi bi-border-bottom", "bi bi-border-left"]);
    formBorderPosition.render(body);
    formBorderPanel = document.createElement("div");
    formBorderPanel.style.paddingLeft = "10px";
    body.appendChild(formBorderPanel);

    //0 no

    // >0 
    var row = document.createElement("div");
    formBorderPanel.appendChild(row);
    var line = form.createDivRow(row, true);
    formBorderPanelType = new FormIcons("线条", ["bi bi-dash", "bi bi-three-dots"]);
    formBorderPanelType.render(line);
    var w = form.createDivRow(row);
    formBorderPanelWidth = new FormNumber("宽度");
    formBorderPanelWidth.render(w);

    var row1 = document.createElement("div");
    formBorderPanel.appendChild(row1);
    var c = form.createDivRow(row1, true);
    formBorderPanelColor = new FormColor("颜色");
    formBorderPanelColor.render(c);
    var r = form.createDivRow(row1);
    formBorderPanelRadius = new FormNumber("圆角");
    formBorderPanelRadius.render(r);

    //box-shadow
    var row2 = document.createElement("div");
    body.appendChild(row2);
    var x = form.createDivRow(row2);
    formBoxShadow = new FormNumbers("阴影", 3);
    formBoxShadow.render(x);
    var c = form.createDivRow(row2);
    formBoxShadowColor = new FormColor("");
    formBoxShadowColor.render(c);


    formOpacity = new FormSolider("透明", 100, 0, "%");
    formOpacity.render(body);

    //
    formBackdrop = new FormSolider("模糊", 20, 0, "px");
    formBackdrop.render(body);


    ipcRendererSend("loadPlugins","shape");
    ipcRenderer.on("_loadPlugins_shape", (event, args) => {
        var ops = [{
            label: "请选择", value: ""
        }];
        args.forEach((item: string) => {
            var val = item.replace(".js", "");
            ops.push({ label: val, value: val });
        });
        formShape = new FormSelect("形状", ops);
        formShape.render(body);


    });










}
var formFontFamily: FormSelect;
var formFontSize: FormNumber;
var formFontLineHeight: FormNumber;
var formFontAlign: FormIcons;
var formFontBolder: FormIcon;
var formFontLine: FormIcon;
var formFontItalic: FormIcon;
var formFontIndent: FormNumber;

var formTextShadow: FormNumbers;
var formTextShadowColor: FormColor;
function renderFontProperty(context: HTMLElement) {
    var body = document.createElement("div");
    body.style.padding = "0px 10px 10px 10px";
    context.appendChild(body);
    const fonts = require("font-list");
    var fontList: any[] = [{ label: "默认", value: "inherit" }];
    fonts.getFonts().then((list: any) => {
        list.forEach((font: any) => {
            if (!font.startsWith("\""))
                fontList.push({ label: font, value: font });

        });
        formFontFamily = new FormSelect("字体", fontList);
        formFontFamily.render(body);
    });



    var row1 = document.createElement("div");
    body.appendChild(row1);

    //加粗
    var boldDiv = form.createDivRow(row1);
    formFontBolder = new FormIcon("", "bi bi-type-bold");
    formFontBolder.render(boldDiv);
    //斜体
    var italicDiv = form.createDivRow(row1);
    formFontItalic = new FormIcon("", "bi bi-type-italic");
    formFontItalic.render(italicDiv);
    //下划线
    var underlineDiv = form.createDivRow(row1);
    formFontLine = new FormIcon("", "bi bi-type-underline");
    formFontLine.render(underlineDiv);

    //对齐
    var alignDiv = form.createDivRow(row1);
    alignDiv.style.flex = "4";
    formFontAlign = new FormIcons("", ["bi bi-text-left", "bi bi-text-center", "bi bi-text-right"]);
    formFontAlign.render(alignDiv);

    //
    var row = document.createElement("div");
    body.appendChild(row);
    var widthDiv = form.createDivRow(row, true);

    formFontSize = new FormNumber("大小");
    formFontSize.render(widthDiv);

    var heightDiv = form.createDivRow(row, false);
    formFontLineHeight = new FormNumber("行高");
    formFontLineHeight.render(heightDiv);

    //color
    formColor = new FormColor("颜色");
    formColor.render(body);

    //formFontIndent
    var row2 = document.createElement("div");
    body.appendChild(row2);
    var indentDiv = form.createDivRow(row2, true);
    formFontIndent = new FormNumber("缩进");
    formFontIndent.render(indentDiv);
    //shadow
    var row3 = document.createElement("div");
    body.appendChild(row3);
    var x = form.createDivRow(row3);
    formTextShadow = new FormNumbers("阴影", 3);
    formTextShadow.render(x);
    var c = form.createDivRow(row3);
    formTextShadowColor = new FormColor("");
    formTextShadowColor.render(c);



}
function renderShortcutsProperty(context: HTMLElement) {
    var body = document.createElement("div");
    body.style.padding = "0px 10px 10px 10px";
    context.appendChild(body);
    form.createDivTip(body, "i", "插入组件/插入蓝图");
    form.createDivTip(body, "u", "前/上方插入组件");
    form.createDivTip(body, "v", "显示组件轮廓");
    form.createDivTip(body, "w", "缩小高度");
    form.createDivTip(body, "s", "增大高度");
    form.createDivTip(body, "a", "缩小高度");
    form.createDivTip(body, "d", "缩小高度");
    form.createDivTip(body, "f", "清空宽度/插入函数");
    form.createDivTip(body, "h", "清空高度");
    form.createDivTip(body, "m", "清除外边距");
    form.createDivTip(body, "p", "清除内边距");
    form.createDivTip(body, "t", "背景透明");
    form.createDivTip(body, "r", "设置背景");
    form.createDivTip(body, "y", "隐藏组件");
    form.createDivTip(body, "l", "增加或删除边框");
    form.createDivTip(body, "b", "加粗");
    form.createDivTip(body, "Backspace", "删除");
    form.createDivTip(body, "Ctl+Z", "撤销");
    form.createDivTip(body, "Shift+Ctl+Z", "重做");
    form.createDivTip(body, "Ctl+C", "复制");
    form.createDivTip(body, "Ctl+V", "粘贴");
    form.createDivTip(body, "Ctl+S", "保存");



}

var formWidth: FormNumber;
var formHeight: FormNumber;
var formAlignH: FormIcons;
var formAlignV: FormIcons;
var formPadding: FormNumbers;
var formMargin: FormNumbers;
var formOverFlow: FormIcons;
var formFlex: HTMLElement;
var formRotate: FormSolider;
var formFlexNum: FormSolider;

var formInset: FormNumbers;
var formPosition: FormIcons;

var formZIndex: FormNumber;

function renderLayoutProperty(context: HTMLElement) {
    var body = document.createElement("div");
    body.style.padding = "0px 10px 10px 10px";
    context.appendChild(body);



    var row = document.createElement("div");
    body.appendChild(row);


    var widthDiv = form.createDivRow(row, true);
    formWidth = new FormNumber("宽度");
    formWidth.render(widthDiv);


    var heightDiv = form.createDivRow(row, true);
    formHeight = new FormNumber("高度");
    formHeight.render(heightDiv);



    formFlex = document.createElement("div");
    body.appendChild(formFlex);
    formAlignH = new FormIcons("水平对齐", ["bi bi-align-start", "bi bi-align-center",
        "bi bi-align-end"]);
    formAlignH.render(formFlex);


    formAlignV = new FormIcons("垂直对齐", ["bi bi-align-top", "bi bi-align-middle",
        "bi bi-align-bottom"]);
    formAlignV.render(formFlex);



    formPadding = new FormNumbers("内边距", 4);
    formPadding.render(body);

    formMargin = new FormNumbers("外边距", 4);
    formMargin.render(body);

    formOverFlow = new FormIcons("组件溢出", ["bi bi-dash-circle", "bi bi-dash-circle-dotted", "bi bi-dash"]);
    formOverFlow.render(body);

    formRotate = new FormSolider("旋转", 180, -180, "˙")
    formRotate.render(body);


    var positionRow = document.createElement("div");
    body.appendChild(positionRow);

    formPosition = new FormIcons("位置", ["bi bi-layout-sidebar-reverse", "bi bi-layout-sidebar-inset-reverse"]);
    formPosition.render(body);


    formInset = new FormNumbers("inset", 4);
    formInset.render(body);


    formZIndex = new FormNumber("深度");
    formZIndex.render(body);

    formFlexNum = new FormSolider("flex", 10, 0);
    formFlexNum.render(body);


    // form.createDivBool(body, "可移动", component.isFixed + "", (value: any) => {
    //     component.isFixed = value == "true";

    // });

}
var formBaseKey: FormText;
var formBaseType: FormText;
var formBaseLabel: FormText;
var formBasePropertyBody: HTMLElement;
function renderBaseProperty(context: HTMLElement) {

    var body = document.createElement("div");
    context.appendChild(body);
    body.style.padding = "0px 10px 10px 10px";
    var row = document.createElement("div");
    body.appendChild(row);
    //key
    var key = form.createDivRow(row, true);
    formBaseKey = new FormText("ID");
    formBaseKey.render(key);

    //type
    var type = form.createDivRow(row);
    formBaseType = new FormText("类型");
    formBaseType.render(type);

    //name

    formBaseLabel = new FormText("名称");
    formBaseLabel.render(body);

    //property
    formBasePropertyBody = document.createElement("div");
    body.appendChild(formBasePropertyBody);

}

function updateBaseProperty(component: IComponent) {
    var body = formBasePropertyBody;
    body.innerHTML = "";
    if (component.property != undefined) {
        for (var key in component.property) {
            var obj = component.property[key];
            if (typeof obj == "object" && obj.type != undefined) {
                var property: IComponentProperty = component.property[key];
                if (property.type == "text") {
                    form.createDivInput(body, property.label, property.context, (text: string, callKey?: string) => {
                        //console.log(callKey);

                        component.property[callKey].context = text;

                        updateComponent(component);

                    }, undefined, key);
                } else if (property.type == "number") {
                    form.createDivNumber(body, property.label, property.context, (text: string) => {
                        property.context = text;
                        updateComponent(component);

                    });
                } else if (property.type == "bool") {
                    form.createDivBool(body, property.label, property.context, (text: string, k: string) => {
                        var p = component.property[k];
                        p.context = text;
                        updateComponent(component);

                    }, key);
                } else if (property.type == "doc") {
                    form.createDivText(body, property.label, property.context, (text: string) => {
                        property.context = text;
                        updateComponent(component);

                    });
                } else if (property.type == "component") {
                    var f = new forms.FormComponent(property.label);
                    f.render(body);
                    f.update(property.context, (cmp: IComponent) => {
                        property.context = cmp.key;
                        updateComponent(component);
                        return true;
                    });

                } else if (property.type == "catalog") {
                    var c = new forms.FormCatalog(property.label);
                    c.render(body);
                    c.update(property.context, (catalog: ICatalog) => {
                        if (catalog.key == "" || catalog.key == getCurPageKey()) {
                            return false;
                        } else {
                            property.context = catalog.key;
                            updateComponent(component);
                            return true;
                        }

                    });

                }
            }

        }
    }

}

function renderLayersProperty(context: HTMLElement) {









}

var lastSelected: HTMLElement;
var treeExtend: Map<string, boolean> = new Map();
function renderLayersTree(content: HTMLElement, component: IComponent, level: number) {

    if (component == undefined || component.isRemoved) {
        return;
    }

    if (component.children != undefined && component.children.length > 0) {
        var folder = document.createElement("div");

        folder.className = "explorer_folder";
        content.appendChild(folder);

        var isExtend = true;
        if (treeExtend.has(component.key)) {
            isExtend = treeExtend.get(component.key);
        }


        var folderTitle = document.createElement("div");
        folderTitle.className = "explorer_folder_title explorer_row";
        folderTitle.id = "layer_" + component.key;
        folderTitle.title = component.path;
        folder.appendChild(folderTitle);



        var indent = document.createElement("div");
        indent.className = "indent";
        indent.style.width = level * 12 + "px";
        folderTitle.appendChild(indent);



        var icon = document.createElement("i");
        if (!isExtend) {
            icon.className = "bi bi-chevron-right";
        } else {
            icon.className = "bi bi-chevron-down";
        }

        folderTitle.appendChild(icon);
        if (component.rotate != undefined) {
            // icon.style.cssText+=component.iconStyle;
            icon.setAttribute("data-rotate", "");
        }
        var name = document.createElement("div");
        name.className = "name";
        name.style.flex = "1";
        name.innerText = component.label;
        folderTitle.appendChild(name);



        var type = document.createElement("div");
        type.innerText = "[" + component.type + "]";
        type.style.paddingRight = "10px";
        type.style.opacity = "0.6";
        folderTitle.appendChild(type);


        var visiable = document.createElement("i");
        visiable.style.cursor = "pointer";
        if (component.hidden) {
            visiable.className = "bi bi-eye-slash";

        } else {
            visiable.className = "bi bi-eye";
        }

        folderTitle.appendChild(visiable);
        visiable.onclick = (e: MouseEvent) => {
            if (component.hidden) {
                visiable.className = "bi bi-eye";
                component.hidden = false;
            } else {
                visiable.className = "bi bi-eye-slash";
                component.hidden = true;
            }

            if (component.toogle != undefined) {
                component.toogle(document.getElementById(component.key), component.hidden);
            } else {
                document.getElementById(component.key).style.display = component.hidden ? "none" : "block";
            }

            e.stopPropagation();
        }



        var folderView = document.createElement("div");
        folderView.className = "explorer_folder_view";
        folder.appendChild(folderView);
        if (!isExtend) {
            folderView.style.display = "none";
        }


        icon.onclick = (e: MouseEvent) => {

            if (folderView.style.display == "none") {
                folderView.style.display = "block";
                icon.className = "bi bi-chevron-down";
                treeExtend.set(component.key, true);
            } else {
                folderView.style.display = "none";
                icon.className = "bi bi-chevron-right";
                treeExtend.set(component.key, false);
            }

        }
        name.onclick = (e: MouseEvent) => {
            if (lastSelected == undefined || lastSelected != folderTitle) {
                if (lastSelected != undefined) lastSelected.setAttribute("selected", "false");
                folderTitle.setAttribute("selected", "true");
                lastSelected = folderTitle;
            }
            clearComponentsProperty();
            //clearComponentsCode();
            loadComponentsProperty(component);
            //loadComponentsCode([component]);

            onSelectComponent(component.panel);
        }



        folderTitle.oncontextmenu = (e: MouseEvent) => {
            // folderTitle.setAttribute("selected", "true");
            var menuItems: Array<IMenuItem> = [{
                id: "new",
                label: "新建",
            }, {
                id: "delete",
                label: "删除", icon: "bi bi-trash", onclick: () => {
                    var del = document.getElementById("layer_" + component.key);
                    console.log("del", del);
                    if (del != undefined) {
                        del.remove();
                    }
                    deleteComponent(component);


                }
            }, {
                id: "rename",
                label: "重命名",
            }, {
                id: "copy",
                label: "复制",
            }];
            openContextMenu(menuItems);
        }

        component.children.forEach((child: IComponent) => {
            renderLayersTree(folderView, child, level + 1);
        })

    } else {
        var page = document.createElement("div");
        page.className = "explorer_file explorer_row";
        page.id = "layer_" + component.key;
        content.appendChild(page);
        page.title = component.path;
        var indent = document.createElement("div");
        indent.className = "indent";
        indent.style.width = level * 12 + "px";
        page.appendChild(indent);

        var icon = document.createElement("i");
        icon.className = component.icon;
        page.appendChild(icon);


        var name = document.createElement("div");
        name.className = "name";
        name.style.flex = "1";
        name.innerText = component.label;
        page.appendChild(name);


        var type = document.createElement("div");
        type.style.paddingRight = "10px";
        type.style.opacity = "0.6";
        type.innerText = "[" + component.type + "]";
        page.appendChild(type);


        var visiable = document.createElement("i");
        visiable.style.cursor = "pointer";
        if (component.hidden) {
            visiable.className = "bi bi-eye-slash";

        } else {
            visiable.className = "bi bi-eye";
        }

        page.appendChild(visiable);
        visiable.onclick = (e: MouseEvent) => {
            if (component.hidden) {
                visiable.className = "bi bi-eye";
                component.hidden = false;
            } else {
                visiable.className = "bi bi-eye-slash";
                component.hidden = true;
            }


            if (component.toogle != undefined) {
                component.toogle(document.getElementById(component.key), component.hidden);
            } else {
                document.getElementById(component.key).style.display = component.hidden ? "none" : "block";
            }


            e.stopPropagation();
        }


        page.onclick = (e: MouseEvent) => {
            if (lastSelected == undefined || lastSelected != page) {
                if (lastSelected != undefined) lastSelected.setAttribute("selected", "false");
                page.setAttribute("selected", "true");
                lastSelected = page;
            }


            clearComponentsProperty();
            //  clearComponentsCode();
            loadComponentsProperty(component);
            //   loadComponentsCode([component]);
            onSelectComponent(component.path);
        }
        page.oncontextmenu = (e: MouseEvent) => {
            // page.setAttribute("selected", "true");
            var menuItems: Array<IMenuItem> = [{
                id: "new",
                label: "新建",
            }, {
                id: "delete",
                label: "删除", icon: "bi bi-trash", onclick: () => {
                    var del = document.getElementById("layer_" + component.key);
                    console.log("del", del);
                    if (del != undefined) {
                        del.remove();
                    }
                    deleteComponent(component);


                }
            }, {
                id: "rename",
                label: "重命名",
            }, {
                id: "copy",
                label: "复制",
            }];
            openContextMenu(menuItems);
        }


    }



}

var formStyleMaster: FormComponent;
function renderComponentStyle(content: HTMLElement) {
    var masterDiv = document.createElement("div");
    masterDiv.style.padding = "0px 10px 0px 10px";
    //master
    formStyleMaster = new FormComponent("模板");
    formStyleMaster.render(masterDiv);

    content.appendChild(masterDiv);
    //editor

    var codeEdior = document.createElement("div");
    codeEdior.style.height = (300 - 50) + "px";
    codeEdior.style.margin = "10px";
    content.appendChild(codeEdior);
    editor = new Editor(codeEdior, (lines) => {
        var component = editorComponent;
        if (component.styles != undefined) {
            lines.match(/[A-z]+{[^{]+}/g).forEach((key) => {
                var cssName = key.match(/[A-z]+/)[0];
                var cssText = key.match(/{([^{]+)/)[0];
                cssText = cssText.substring(cssText.indexOf("{") + 1, cssText.lastIndexOf("}"));
                component.styles[cssName] = cssText;
            });

        } else if (component.style != undefined) {
            component.style = lines.substring(lines.indexOf("{") + 1, lines.lastIndexOf("}"));
        }
        updateComponentsStyle([component]);


    }, undefined, undefined, 250);
    editor.highLights = [{
        match: /"(\S+)"/,
        color: "var(--theme-color)"
    }, {
        match: /([a-z]+-?[a-z]*):/,
        color: "var(--theme-color)"
    }, {
        match: /\.([a-z]+-?[a-z]*) {/,
        color: "var(--theme-color)"
    },
    ];
    editor.suggestions = []

}
var editor: any;
var editorComponent: any;
function renderComponentStyleEditor(component: IComponent) {

    editorComponent = component;
    if (component.styles != undefined) {
        var value = "";
        for (var key in component.styles) {
            var style = component.styles[key].replace(/\t/g, "");
            if (style.indexOf("\n") < 0)
                value += key + "{\n\t" + style.replace(/;/g, ";\n\t") + "\n}\n";
            else
                value += key + "{" + style + "}";
        }
        editor.setValue(value);

    } else if (component.style != undefined && component.style.length > 0)
        if (component.style.indexOf("\n") < 0)
            editor.setValue("root{\n\t" + component.style.replace(/\t/g, "").replace(/;/g, ";\n\t") + "\n}");
        else editor.setValue("root{" + component.style + "}");
    else
        editor.setValue("root{\n \n \n}");

    editor.resize();

}