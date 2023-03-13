import { IBlueProperty, IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "calendar", label: "calendar", icon: "bi bi-calendar2-week", type: "calendar", 
    style: "line-height:2;font-size:14px;padding: 5px 10px 5px 10px;border:0;white-space: nowrap;border-radius:5px;",
    onPreview: () => {
        var calendar: HTMLElement;
        calendar = document.createElement("div");
        //head
        var headRow=document.createElement("div");
        headRow.style.display="flex";
        calendar.appendChild(headRow);
        ["一","二","三","四","五","六","日"].forEach(item=>{
            var day=document.createElement("div");
           
            day.style.borderBottom="0.5px solid rgba(157,157,157,0.5)";
         
            day.style.flex="1";
            day.style.textAlign="center";
            day.innerText=item;
            headRow.appendChild(day);
        });
        var d=new Date();
        var today=new Date();
        var start:any=new Date(d.setDate(d.getDate()-17));
        var row=undefined;
        for(var i=0;i<42;i++){
            if(i%7==0){
                row= document.createElement("div");
                row.style.display="flex";
                calendar.appendChild(row);
            }
            var day=document.createElement("div");
            day.style.flex="1";
            var color="rgba(157,157,157,0.5)";
            var w="0.5";
            if(i==17 ){
                w="1";
                color="var(--theme-color)";
                day.style.borderLeft=w+"px solid "+color;
                day.style.borderTop=w+"px solid  "+color;
            }
            if(i%7==0){
                day.style.borderLeft=w+"px solid "+color;
            }
            if(start.getMonth()!=today.getMonth()){
                day.style.opacity="0.5";
            }


            day.style.borderBottom=w+"px solid "+color;
            day.style.borderRight=w+"px solid  "+color;
            day.style.textAlign="center";
            day.style.cursor="pointer";
            day.setAttribute("hover","true");
            day.title=start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate();
            day.innerText=start.getDate()+"";
            day.style.position="relative";
            row.appendChild(day);

       

            start=start.setDate(start.getDate()+1);
            start=new Date(start);

            var mark=document.createElement("div");
            day.appendChild(mark);
            mark.style.position="absolute";
            mark.style.top="5px";
            mark.style.right="5px";
            mark.style.height="10px";
            mark.style.width="10px";
            mark.style.borderRadius="10px";
            mark.style.opacity="0.6";
            mark.style.background="var(--light-color)";


        }
        





        return calendar;
    }, onRender: (component, element,content,type) => {
        var calendar: HTMLElement;
        if (element != undefined)
            {
                calendar = element;
                calendar.innerHTML="";
            }
        else
            calendar = document.createElement("div");

        //head
        var headRow=document.createElement("div");
        headRow.style.display="flex";
        calendar.appendChild(headRow);
        ["一","二","三","四","五","六","日"].forEach(item=>{
            var day=document.createElement("div");
           
            day.style.borderBottom="0.5px solid rgba(157,157,157,0.5)";
         
            day.style.flex="1";
            day.style.textAlign="center";
            day.innerText=item;
            headRow.appendChild(day);
        });
        var d=new Date();
        var today=new Date();
        var start:any=new Date(d.setDate(d.getDate()-17));
        var row=undefined;
        for(var i=0;i<42;i++){
            if(i%7==0){
                row= document.createElement("div");
                row.style.display="flex";
                calendar.appendChild(row);
            }
            var day=document.createElement("div");
            day.style.flex="1";
            var color="rgba(157,157,157,0.5)";
            var w="0.5";
            if(i==17 ){
                w="1";
                color="var(--theme-color)";
                day.style.borderLeft=w+"px solid "+color;
                day.style.borderTop=w+"px solid  "+color;
            }
            if(i%7==0){
                day.style.borderLeft=w+"px solid "+color;
            }
            if(start.getMonth()!=today.getMonth()){
                day.style.opacity="0.5";
            }


            day.style.borderBottom=w+"px solid "+color;
            day.style.borderRight=w+"px solid  "+color;
            day.style.textAlign="center";
            day.style.cursor="pointer";
            day.setAttribute("hover","true");
            day.title=start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate();
            day.innerText=start.getDate()+"";
            day.style.position="relative";
            row.appendChild(day);

            day.onclick=(e:any)=>{
            
                if(component.blue.event.change.on!=undefined){
                    component.blue.event.change.on(e.target.title);
                }
                component.blue.property.date=e.target.title;
            }

            start=start.setDate(start.getDate()+1);
            start=new Date(start);

            var mark=document.createElement("div");
            day.appendChild(mark);
            mark.style.position="absolute";
            mark.style.top="5px";
            mark.style.right="5px";
            mark.style.height="10px";
            mark.style.width="10px";
            mark.style.borderRadius="10px";
            mark.style.opacity="0.6";
            mark.style.background="var(--light-color)";


        }
        





   
        return { root: calendar, content: calendar };
    }, property: {date:{
        label: "日期", type: "text", context: "2022-01-01"
    }}, blue: {
        event:{
            change:{
                label:"改变"
            }
        },

        property: {
            value:{
                label: "值", get: (comp: IComponent, self:IBlueProperty) => {
                 
                    return comp.property.date;
                }, set: (comp: IComponent, self:IBlueProperty, args:any) => {
                    comp.property.date=args;
                }
            }


        }
    }
}
export default function load() {
    return component;
}