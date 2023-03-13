import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "table", label: "table", icon: "bi bi-table", type: "table",

    styles: {
        root: "position:absolute;width:100%;text-align:center;",
        th: "padding: 5px;border-bottom: 1px solid rgba(175,175,175,0.5);min-width:32px; font-size:14px;",
        td: "padding: 5px;min-width:32px; font-size:13px;",
    },
    option: JSON.stringify([
        ["序号", "名称", "数值"],
        [1],
        [2],
        [3],
    ], null, 2),
    onPreview: () => {
        var table = document.createElement("div");

        var thead = document.createElement("div");
        thead.style.height = '40px';
        thead.style.width = '200px';
        thead.style.backgroundColor = "#07b";

        var tbody = document.createElement("div");
        tbody.style.height = '100px';
        tbody.style.width = '200px';
        tbody.style.backgroundColor = "#09f";
        table.appendChild(thead);
        table.appendChild(tbody);

        table.style.opacity = "0.7";
        return table;
    }, onRender: (component, element,content,type,themeColor) => {
        var body: any;
        if (element != undefined)
            body = element;
        else
            body = document.createElement("div");

        body.innerHTML = "";
        var table=document.createElement("table");
        table.style.width="max-content";
        body.appendChild(table);
        var data = JSON.parse(component.option);
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        // console.log(component.property);
        function get16ToRgb(str:string){
            var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
            if(!reg.test(str)){return;}
            let newStr = (str.toLowerCase()).replace(/\#/g,'')
            let len = newStr.length;
            if(len == 3){
                let t = ''
                for(var i=0;i<len;i++){
                    t += newStr.slice(i,i+1).concat(newStr.slice(i,i+1))
                }
                newStr = t
            }
            let arr = []; //将字符串分隔，两个两个的分隔
            for(var i =0;i<6;i=i+2){
                let s = newStr.slice(i,i+2)
                arr.push(parseInt("0x" + s))
            }
            return arr;
        }
        // if(themeColor!=undefined){
        //     if(themeColor.startsWith("#")){
        //         var cr= get16ToRgb(themeColor);
        //         thead.style.backgroundColor="rgba("+cr[0]+","+cr[1]+","+cr[2]+",0.3)";
        //     }else if(themeColor.startsWith("rgba")){
        //         var sp=themeColor.split(",");
        //         thead.style.backgroundColor=sp[0]+","+sp[1]+","+sp[2]+",0.3)";
        //     }else if(themeColor.startsWith("rgb")){
        //         var sp=themeColor.split(",");
        //         thead.style.backgroundColor=sp[0].replace("rgb","rgba")+","+sp[1]+","+sp[2].replace(")","")+",0.3)";
        //     }
        
        // }
          
        var showHead =false;
        if(component.property.hasHead!=undefined){
            showHead= component.property.hasHead.context == "true";
        } 

        var mul =false;
        if(component.property.hasMul!=undefined){
            mul=component.property.hasMul.context == "true";
        } 
        var colNum = 0;
        if(component.property.full!=undefined&&component.property.full.context=="true"){
            table.style.width="100%";
        }else{
            //兼容旧版
            component.property.full={ label: "铺满", type: "bool", context: "false" };
        }

        for (var i = 0; i < data.length; i++) {
            var row = data[i];

            if (showHead && i == 0) {
                if (mul) {
                    var th = document.createElement("th");
                    th.style.cssText = component.styles.th;
                    th.setAttribute("data-styles", "th")
                    th.style.width = "32px";
                    thead.appendChild(th);
                    var check = document.createElement("input");
                    check.type = "checkbox";
                    check.setAttribute("data-row", i + "");
                    check.onclick = () => {
                        //    var  checks= table.getElementsByTagName("input");
                        //    for(var  c=0;c<checks.length;c++){
                        //         var ch=checks[c];
                        //             ch.checked="true";
                        //    }
                    };
                    th.appendChild(check);
                }
                var rowColNums = 0;
                row.forEach((col: any) => {
                    var th = document.createElement("th");
                    if (typeof (col) == "object") {
                        th.innerHTML = col.v + "";
                        if (col.c != undefined) {
                            th.colSpan = col.c;
                            rowColNums += parseInt(col.c);
                        }
                        if (col.r != undefined) {
                            th.rowSpan = col.r;
                        }
                    } else {
                        rowColNums++;
                        th.innerHTML = col + "";
                    }
                    th.style.cssText = component.styles.th;
                    th.setAttribute("data-styles", "th")
                    thead.appendChild(th);
                });
                if (colNum < rowColNums)
                    colNum = rowColNums;

            } else {

                var tr = document.createElement("tr");
               // tr.setAttribute("hover","true");
                var cr= get16ToRgb(themeColor);
               //
       

                if (mul) {
                    var td = document.createElement("td");
                    td.style.cssText = component.styles.td;
                    td.style.maxWidth = "32px";
                    var check = document.createElement("input");
                    check.type = "checkbox";
                    check.setAttribute("data-row", i + "");
                    check.onclick = () => {

                    };
                    td.appendChild(check);
                    td.setAttribute("data-styles", "td")
                    tr.appendChild(td);
                }
                var rowColNums = 0;
                for(var ri=0;ri<row.length;ri++){

                    var col=row[ri];
                    var td = document.createElement("td");
                    td.style.cssText = component.styles.td;
                    if(i%2==0)
                        td.style.backgroundColor="rgba("+cr[0]+","+cr[1]+","+cr[2]+",0.12)";
                    if(ri==0){
                        td.style.borderTopLeftRadius="5px";
                        td.style.borderBottomLeftRadius="5px";
                    }else   if(ri==row.length-1){
                        td.style.borderTopRightRadius="5px";
                        td.style.borderBottomRightRadius="5px";
                    }
   
                    if (typeof (col) == "object") {
                        td.innerHTML = col.v + "";
                        if (col.c != undefined) {
                            td.colSpan = col.c;
                            rowColNums += parseInt(col.c);
                        }
                        if (col.r != undefined) {
                            td.rowSpan = col.r;
                        }
                    } else {
                        rowColNums++;
                        td.innerHTML = col + "";
                    }
              
                    if (td.innerHTML.startsWith("其中")) {
                        td.style.textAlign = "left";
                    }
                    td.setAttribute("data-styles", "td")
                    tr.appendChild(td);
                }
                // row.forEach((col: any) => {
                   
                // });
                if (colNum < rowColNums)
                    colNum = rowColNums; 
                else {
                    // for(var t=rowColNums;t<colNum;t++){
                    //     var td = document.createElement("td");
                    //     td.style.cssText = component.styles.td;
                    //     td.setAttribute("data-styles", "td")
                    //     tr.appendChild(td);
                    // }


                }
                tbody.appendChild(tr);
            }
        }

        // [" ", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"].forEach(colName => {
        //     var th = document.createElement("th");
        //     th.innerHTML = colName;
        //     thead.appendChild(th);
        // })

        table.appendChild(thead);
        table.appendChild(tbody);
        return { root: body, content: body };
    }, property: {
        hasHead: { label: "表头", type: "bool", context: "true", },
        hasMul: { label: "多选", type: "bool", context: "false" },
        full: { label: "铺满", type: "bool", context: "false" }
    }
    , blue: {
        property: {
            data: {
                label: "数据", name: "data", get: (comp: IComponent, self: IBlueProperty) => {
                    return JSON.parse(comp.option);
                }, set: (comp: IComponent, self: IBlueProperty, arg: any) => {
                    comp.option = JSON.stringify(arg, null, 2);
                    comp.onRender(comp, document.getElementById(comp.key));
                }
            }
        },
        event: {
            select: {
                label: "选择"
            }
        }

    }
}
export default function load() {
    return component;
}
