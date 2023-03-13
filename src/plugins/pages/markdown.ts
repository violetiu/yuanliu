import { getViewPosition } from "../../render/workspace";
import * as Markdown from "markdown-it";
export function renderMarkDownPage(content: HTMLElement,url:string) {


    var viewPosition = getViewPosition();

    var page = document.createElement("div");
    page.style.position = "fixed";
    page.style.top = viewPosition.top + "px";
    page.style.right = viewPosition.right + "px";
    page.style.bottom = viewPosition.bottom + "px";
    page.style.left = viewPosition.left + "px";
    page.style.padding="20px";
    page.style.overflow="auto";
    content.appendChild(page);

    var view=document.createElement("div");
    view.style.maxWidth="800px";
    view.style.margin="0 auto";
    view.className="surface";
    view.style.padding="50px";
    view.style.borderRadius="5px";
    view.style.boxShadow="0px 0px 10px rgba(0,0,0,0.2)";
    page.appendChild(view);



    
    var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
    httpRequest.open('GET', url, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.send();//第三步：发送请求  将请求参数写在URL中
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var text = httpRequest.responseText;//获取到json字符串，还需解析
               var mk=new Markdown();
              var html=  mk.render(text);
              view.innerHTML=html;
        }else{
            view.innerHTML="404";
        }
    };










}