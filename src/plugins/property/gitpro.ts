/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

app设置
***************************************************************************** */
import { IPanel } from "../../common/interfaceDefine";
import * as forms from "../../render/forms";
import { getConfig, saveConfig } from "../../render/workspace";
var formTheme: forms.FormIcons;
const panel: IPanel = {
  key: "gitpro", name: "克隆项目", hidden: true, sort: 0,
  render: (content: HTMLElement) => {

    var setting = document.createElement("div");
    setting.style.position="relative";
    setting.style.flex = "1";
    setting.style.marginLeft = "10px";
    setting.style.marginRight = "10px";
    setting.style.display = "block";
    content.appendChild(setting);
    var row = document.createElement("div");
    setting.appendChild(row);

    formTheme = new forms.FormIcons("主题", ["bi bi-brightness-high-fill", "bi bi-moon-stars-fill"]);
    formTheme.render(setting);


  },
  update: () => {

  
    formTheme.update(getConfig().theme == "light" ? 0 : 1, (value) => {
      var val: "light" | "dark" = "light";
      if (value == 0) {
        val = "light";
      } else {
        val = "dark";
      }
      document.getElementById("app").className=val;
      getConfig().theme=val;
      saveConfig();

    });

  }

}
export default function load() {
  return panel;
}

