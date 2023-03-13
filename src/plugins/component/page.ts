
import { IComponent } from "../../common/interfaceDefine"

const component: IComponent = {
    isTemplate: true, key: "page", label: "page", icon: "bi bi-laptop",
    type: "page", group: "layout", drop: "component",
    style: "background:transparent;height:600px;margin:0px;padding:5px;border-radius:0px;",
    onPreview: () => {
        var page = document.createElement("div");
        return page;
    }, onRender: (component: IComponent, element: HTMLElement, content?, type?) => {
        var page: HTMLElement = null;
        if (element != undefined) {
            page = element;
            page.innerHTML = "";
        } else
            page = document.createElement("div");
        var pageBg = document.createElement("div");
        pageBg.className = "component_bg";
        pageBg.style.position = "absolute";

        var pageContent = document.createElement("div");
        pageContent.style.position="relative";
        pageContent.style.display="flex";
        pageContent.style.alignItems="center"
        pageContent.style.justifyContent="center";
        pageContent.style.height="inherit";//height: inherit;
        pageContent.style.width="inherit";
        pageContent.className = "component_body";

        page.appendChild(pageBg);
        page.appendChild(pageContent);


        if (type == "product") {
           
            component.style=  component.style.replace(/height:\d+px;/,"height:"+window.innerHeight+"px;");
            var downTap=document.createElement("div");
            downTap.style.position="absolute";
            downTap.style.bottom="10px";
            downTap.style.padding="5px";
            downTap.style.cursor="pointer";
            downTap.style.left="50%";
           downTap.style.animation="pageDownTap 5s";
            downTap.style.animationIterationCount="infinite";
            downTap.style.textAlign="center";
            downTap.style.zIndex="100";
            page.appendChild(downTap);


            var downI=document.createElement("i");
            downI.className="bi bi-caret-down";
            downTap.appendChild(downI);

            

            downTap.onclick=()=>{
                var next=page.nextElementSibling;
              
                if(next!=undefined){
                    next.scrollIntoView({
                        behavior:"smooth"
                    });
                }else{
                    document.getElementById("pageView").scrollTo({top:0,behavior:"smooth"});
                //    document.body.scrollTo({top:0,behavior:"smooth"})
                }

               

               // document.body.scrollTop=window.innerHeight;

            }


        }


        return { root: page, content: pageContent };
    },
    property: {


    },
    blue: {

    }
}
export default function load() {
    return component;
}