/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var gui = require("nw.gui");
var database = require("./lib/database");

HTMLElement.prototype.create = function(type) {
  var element = document.createElement(type);
  this.appendChild(element);
  return element;
}

var GET = function(id) {
  return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", function() {
  database.init(gui.App.dataPath);
  GET("close").addEventListener("click", function() {
    gui.Window.get().close();
  }, false);
  Addressbar.init(GET("nav"));
  Navigation.init(GET("nav"));
  Toolbar.init(GET("toolbar"));
  Header.init(GET("header_bg"));
  Tabbar.init(GET("tabs_list"), GET("tabs_bg"));
  //Taskbar.init(GET("tasks"));
  Renderer.init(GET("browser"));
  Visualizer.init(GET("visualizer"));
}, false);
