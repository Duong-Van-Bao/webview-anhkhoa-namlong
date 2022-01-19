import "./assets/css/vendor/dropzone.min.css";
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/bootstrap.rtl.only.min.css";
import 'video.js/dist/video-js.css'

import { defaultColor } from "./constants/config";
var color = defaultColor;

if (localStorage.getItem("themeColor")) {
  color = localStorage.getItem("themeColor");
}
let render = () => {
  import("./assets/css/sass/themes/piaf." + color + ".scss").then(() =>
    require("./main")
  );
};

render();
