var text = 'import { activePropertyPanel } from "../../render/propertypanel";\n' +
    'import { IBlueProperty, IComponent } from "../../common/interfaceDefine"\n' +
    '\n' +
    'const component: IComponent = {\n' +
    '    isTemplate: true, key: "paragraph", label: "para.", icon: "bi bi-text-paragraph", type: "paragraph",\n' +
    '    style: "display:inline-block;font-size:14px;padding:10px;border:0;width:300px;text-indent: 2em;background:transparent;border-radius:5px;",\n' +
    '    onPreview: () => {\n' +
    '        var label = document.createElement("div");\n' +
    '        label.innerHTML = "yuanliu-让设计跟接近产品.功能强大、可扩展且功能丰富的,利用预构建的网格系统和组件，并使用强大的JavaScript插件给项目带来生命。";\n' +
    '        return label;\n' +
    '    }, onRender: (component, element, content, type) => {\n' +
    '        var label: HTMLElement;\n' +
    '        if (element != undefined)\n' +
    '            label = element;\n' +
    '        else\n' +
    '            label = document.createElement("div");\n' +
    '       \n' +
    '        label.innerHTML = component.property.text.context;\n' +
    '        if (type != "product")\n' +
    '            label.ondblclick = () => {\n' +
    '\n' +
    '                var input = document.createElement("div");\n' +
    '                input.className="editor";\n' +
    '                input.style.width = "100%";\n' +
    '                input.style.height = "max-content";\n' +
    '                input.contentEditable = "true";\n' +
    '                input.style.outline = "none";\n' +
    '\n' +
    '                input.innerHTML = component.property.text.context;\n' +
    '                input.onkeydown = (ky) => {\n' +
    '                    ky.stopPropagation();\n' +
    '                }\n' +
    '                label.innerHTML = "";\n' +
    '                label.appendChild(input);\n' +
    '                input.onchange = () => {\n' +
    '                    component.property.text.context = input.innerHTML;\n' +
    '                }\n' +
    '                input.focus();\n' +
    '                input.onmousedown = (oc) => {\n' +
    '                    oc.stopPropagation();\n' +
    '                }\n' +
    '                input.onclick = (oc) => {\n' +
    '                    oc.stopPropagation();\n' +
    '                }\n' +
    '                input.ondblclick = (oc) => {\n' +
    '                    oc.stopPropagation();\n' +
    '                }\n' +
    '                input.onblur = () => {\n' +
    '                    component.property.text.context = input.innerHTML;\n' +
    '                    label.innerHTML = input.innerHTML;\n' +
    '                    input.remove();\n' +
    '\n' +
    '                }\n' +
    '                input.onmouseup=()=>{\n' +
    '\n' +
    '                    activePropertyPanel(component);\n' +
    '\n' +
    '                }\n' +
    '\n' +
    '            }\n' +
    '        return { root: label, content: label };\n' +
    '    }, property: {\n' +
    '        text: {\n' +
    '            label: "文本", type: "doc", context: "yuanliu-让设计跟接近产品功能强大、可扩展且功能丰富的,利用预构建的网格系统和组件，并使用强大的JavaScript插件给项目带来生命。"\n' +
    '        }\n' +
    '    }, blue: {\n' +
    '\n' +
    '        property: {\n' +
    '            value: {\n' +
    '                label: "值", get: (comp: IComponent, self: IBlueProperty) => {\n' +
    '                    var ip: any = document.getElementById(comp.key);\n' +
    '                    return ip.innerText;\n' +
    '                }, set: (comp: IComponent, self: IBlueProperty, args: any) => {\n' +
    '                    var ip: any = document.getElementById(comp.key);\n' +
    '                    ip.innerText = args;\n' +
    '                }\n' +
    '            }\n' +
    '\n' +
    '        }\n' +
    '    },\n' +
    '    panel:"editor"\n' +
    '}\n' +
    'export default function load() {\n' +
    '    return component;\n' +
    '}';
var code = 'import React from "react";\nimport { IBlueProperty, IComponent } from "../../interfaceDefine";\n';
var lines = text.split("\n");
var varMap = new Map();
for (var row in lines) {
    var line = lines[row];
    if (line.indexOf("import ") >= 0) {
        continue;
    }
    var newLine = line + "";
    // console.log(line);
    var m = line.match(/([A-z]+) += +document.createElement\("([a-z]+)"\)/);
    if (m != undefined && m.length > 0) {
        var varname = m[1];
        var tagname = m[2];
        varMap.set(varname, tagname);
        if (line.indexOf("var ") >= 0) {
            newLine = "var " + varname + " :React.ReactElement = React.createElement('" + tagname + "')";
        } else {
            newLine = line.replace(" = document.createElement", " = React.createElement");
        }
        //    console.log("---", m);
    } else {

        varMap.forEach((tagname, varname) => {
            var reg = new RegExp(varname + "\\.", "g");
            newLine = newLine.replace(reg, varname + ".props.");
        })

        var ms = newLine.match(/\(([A-z]+)\)/);
        if (ms != undefined && ms.length > 0) {
            //  console.log("ms------", ms);
            if (ms[1].length < 5) {
                newLine = newLine.replace("(" + ms[1] + ")", "(" + ms[1] + ":any)");
            }

        }
        if (newLine.indexOf("activePropertyPanel") >= 0) {
            newLine = "//" + newLine;
        }
    }
    newLine = newLine.replace(/HTMLElement/, "React.ReactElement")

    code += newLine + "\n";


}
console.log(code);