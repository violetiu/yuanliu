import { ipcRenderer } from "electron";
import { IPage } from "../../common/interfaceDefine";
import { closePage, renderPage } from "../../render/workbench";
import { openContextMenu, openContextMenuHub } from "../../common/contextmenu";
import { IMenuItem } from "../../common/contextmenu";
import { getViewPosition } from "../../render/workspace";
import { activePropertyPanel } from "../../render/propertypanel";

export function renderProjectsPage(content: HTMLElement) {



  var viewPosition = getViewPosition();

  var page = document.createElement("div");
  page.style.position = "fixed";
  page.style.top = viewPosition.top + "px";
  page.style.right = viewPosition.right + "px";
  page.style.bottom = viewPosition.bottom + "px";
  page.style.left = viewPosition.left + "px";
  page.style.display = "flex";
  page.style.userSelect = "none";

  page.style.justifyContent = "center";
  content.appendChild(page);
  page.ondragover = (e) => {
    e.preventDefault();
  }
  page.ondrop = (e) => {
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (files.length > 0) {
      var file = files[0];
      var page: IPage = { key: file.path, name: file.name,  type: "editor", path: file.path };
      renderPage(page);

    }

  }


  var view = document.createElement("div");
  view.style.width = "90%";
  view.style.marginTop = "50px";
  page.appendChild(view);

  var title = document.createElement("div");
  title.innerText = "yuanliu";
  title.style.fontSize = "32px";
  title.style.lineHeight = "2";
  title.style.fontWeight = "600";
  title.style.opacity = "0.8";

  view.appendChild(title);

  var discribute = document.createElement("div");
  discribute.innerText = "Make the design closer to the product";
  discribute.style.fontSize = "14px";
  discribute.style.lineHeight = "2";
  discribute.style.opacity = "0.8";
  discribute.style.paddingBottom = "10px";
  view.appendChild(discribute);

  var main = document.createElement("div");
  main.style.display = "flex";
  // main.style.alignItems="center";
  main.style.justifyContent = "center";
  view.appendChild(main);

  var left = document.createElement("div");
  left.style.flex = "1";

  main.appendChild(left);

  var center = document.createElement("div");
  center.style.width = "100px";
  main.appendChild(center);


  var title0 = document.createElement("div");
  title0.style.paddingTop = "10px";
  title0.style.fontSize = "14px";
  title0.style.opacity = "0.8";
  title0.style.lineHeight = "2";
  title0.innerText = "Start";
  left.appendChild(title0);

  var startDiv = document.createElement("div");
  startDiv.style.paddingBottom = "10px";
  startDiv.style.paddingLeft = "10px";
  left.appendChild(startDiv);

  var taps: IMenuItem[] = [
    {
      label: "New Project ...",
      icon: "bi bi-folder-plus",
      onclick: () => {
        activePropertyPanel("newpro");
      }
    },
    {
      label: "Open ...",
      icon: "bi bi-folder2-open",
      onclick: () => {
        ipcRenderer.send("openPeojectBackpage");
      }
    },
    {
      label: "Clone Git ...",
      icon: "bi bi-git",
      onclick: () => {
        activePropertyPanel("gitpro");
      }
    },
    {
      label: "Setting ...",
      icon: "bi bi-gear-fill",
      onclick: () => {
        activePropertyPanel("config");
      }
    }
  ];
  taps.forEach(tap => {
    renderTap(startDiv, tap.label, tap.icon, tap.onclick);
  })

  var title1 = document.createElement("div");
  title1.style.paddingTop = "10px";
  title1.style.fontSize = "14px";
  title1.style.lineHeight = "2";
  title1.innerText = "Recent";
  title1.style.opacity = "0.8";
  left.appendChild(title1);

  projectsDiv = document.createElement("div");
  projectsDiv.style.paddingLeft = "15px";
  projectsDiv.style.minHeight = "200px";
  left.appendChild(projectsDiv);

  var right = document.createElement("div");
  right.style.flex = "1";
  main.appendChild(right);

  var title3 = document.createElement("div");
  title3.style.paddingTop = "10px";
  title3.style.fontSize = "14px";
  title3.style.opacity = "0.8";
  title3.style.lineHeight = "2";
  title3.innerText = "Tips";
  right.appendChild(title3);
  var tipsDiv = document.createElement("div");
  right.appendChild(tipsDiv);

  var tips: IMenuItem[] = [
    {
      label: "新版本更新内容",
      icon: "bi bi-balloon",
      onclick: () => {
        var page: IPage = { key: "markdown", name: "markdown",  type: "markdown", path: 'https://www.violetime.com/README.md' };
        renderPage(page);
      }
    },
    {
      label: "蓝图使用技巧 ...",
      icon: "bi bi-intersect",
      onclick: () => {
        ipcRenderer.send("webTap", "https://github.com/violetiu/yuanliu");
      }
    },
    {
      label: "组件介绍 ...",
      icon: "bi bi-columns-gap",
      onclick: () => {
        ipcRenderer.send("webTap", "https://github.com/violetiu/yuanliu");
      }
    },
    {
      label: "参与 ...",
      icon: "bi bi-github",
      onclick: () => {
        ipcRenderer.send("webTap", "https://github.com/violetiu/yuanliu");
      }
    }
  ];
  tips.forEach(tip => {
    renderTip(tipsDiv, tip.label, tip.icon, tip.onclick);
  })



  ipcRenderer.send("readProjects");
  ipcRenderer.on("_readProjects", (event, data) => {
    projects = data;
    data.forEach((project: any) => {
      renderProject(project, projectsDiv)
    })


  });


}


var projectsDiv: HTMLElement;
function updateProjects(projects: Array<any>) {
  projectsDiv.innerHTML = "";
  projects.forEach(project => {
    renderProject(project, projectsDiv)
  })

}
var projects: Array<any> = []
function renderProject(project: any, body: HTMLElement) {

  var tapDiv = document.createElement("div");

  tapDiv.style.display = "flex";
  tapDiv.style.alignItems = "center";
  tapDiv.style.fontSize = "13px";
  tapDiv.style.marginTop = "5px";


  // var tapIcon = document.createElement("i");
  // tapIcon.className = icon + "";
  // tapDiv.appendChild(tapIcon);
  // tapIcon.onclick = onclick;
  var name = document.createElement("div");
  name.className = "link";
  name.innerText = project.name;
  name.style.marginRight = "20px";
  name.style.color = "var(--theme-color)";
  tapDiv.appendChild(name);

  var text = document.createElement("div");
  text.innerText = project.path;
  text.style.opacity = "0.8";
  tapDiv.appendChild(text);
  body.appendChild(tapDiv);


  var contextMenu: IMenuItem[] = [
    {
      id: "delete",
      label: "删除", icon: "bi bi-trash", onclick: () => {
        console.log("del");
        var index = projects.indexOf(project);
        console.log("index", index);
        if (index >= 0) {
          projects.splice(index, 1);
          ipcRenderer.send("saveProjects", projects);
          updateProjects(projects);
        }
      }

    }, {
      id: "editor",
      label: "编辑", icon: "bi bi-backspace-reverse", accelerator: "dbclick", onclick: () => {
        ipcRenderer.send("openProject_hub", project);
        document.getElementById("open_project_process").style.display = "flex";
        setTimeout(() => {
          document.getElementById("open_project_process").style.display = "none";
        }, 2000);
      }

    }
    // , {
    //   label: "预览", onclick: () => {
    //     ipcRenderer.send("startPreview_hub", project);
    //   }

    // } 
    , {
      id: "opencatalog",
      label: "打开目录", icon: "bi bi-folder2-open", onclick: () => {
        ipcRenderer.send("openPath_hub", project);
      }

    }
  ];
  name.oncontextmenu = () => {
    openContextMenu(contextMenu);
  };
  name.onclick = () => {
    console.log("readProject", project);
    var page: IPage = { key: "projects", name: "Get Started",  type: "projects", path: "projects" };
    closePage(page);
    ipcRenderer.send("readProject", project);
  }


  //   var headModify = document.createElement("div");
  //   headModify.className = "head_modify";
  //   headModify.innerText = project.modified;
  //   projectHead.appendChild(headModify);


  //   var headVersion = document.createElement("div");
  //   headVersion.className = "head_version";
  //   headVersion.innerText = project.version;
  //   projectHead.appendChild(headVersion);

  //   var headMore = document.createElement("div");
  //   headMore.className = "head_more";
  //   projectHead.appendChild(headMore);

  //   var moreTap = document.createElement("div");
  //   moreTap.className = "more_tap";
  //   headMore.appendChild(moreTap);
  //   var moreTapIcon = document.createElement("i");
  //   moreTapIcon.className = "bi bi-three-dots";
  //   moreTap.appendChild(moreTapIcon);

  //   moreTap.onclick = (e) => {

  //     e.stopPropagation();
  //    // openContextMenuHub(contextMenu);
  //   }

}
function renderTap(content: HTMLElement, label?: string, icon?: string | Electron.NativeImage, onclick?: () => void) {
  var tapDiv = document.createElement("div");

  tapDiv.style.display = "flex";
  tapDiv.style.alignItems = "center";
  tapDiv.style.fontSize = "12px";
  tapDiv.style.marginTop = "5px";
  tapDiv.style.color = "var(--theme-color)";
  tapDiv.title = label;

  var tapIcon = document.createElement("i");
  tapIcon.className = icon + "";
  tapDiv.appendChild(tapIcon);
  tapIcon.style.paddingRight = "5px";

  var text = document.createElement("div");
  text.innerText = label;
  text.className = "link";
  tapDiv.appendChild(text);
  content.appendChild(tapDiv);
  text.onclick = () => {
    onclick();
  }




}

function renderTip(content: HTMLElement, label?: string, icon?: string | Electron.NativeImage, onclick?: () => void) {
  var tapDiv = document.createElement("div");

  tapDiv.className = "tips_row";

  tapDiv.title = label;

  var tapIcon = document.createElement("i");
  tapIcon.className = icon + "";
  tapDiv.appendChild(tapIcon);
  tapIcon.style.paddingRight = "10px";

  var text = document.createElement("div");
  text.innerText = label;

  tapDiv.appendChild(text);
  content.appendChild(tapDiv);
  tapDiv.onclick = () => {
    onclick();
  }




}
