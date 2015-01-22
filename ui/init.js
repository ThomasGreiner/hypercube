/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var gui = require("nw.gui");
var database = require("./lib/database");

document.addEventListener("DOMContentLoaded", function() {
  database.init(gui.App.dataPath);
  GET("#close").addEventListener("click", function() {
    gui.Window.get().close();
  }, false);
  Navigation.init(GET("#nav"));
  Toolbar.init(GET("#toolbar"));
  Header.init(GET("#header_bg"));
  Tabbar.init(GET("#tabs_list"), GET("#tabs_bg"));
  Visualizer.init(GET("#visualizer"));
}, false);
