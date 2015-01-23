/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

chrome.modules["header"] = function() {
  var gui = require("nw.gui");
  var nav = require("../lib/nav");
  
  function setMaximized(maximized) {
    document.documentElement.classList.toggle("maximized", maximized);
  }
  
  chrome("backgroundCreator").create(GET("#header_bg"), 0, 46, 46, true, true);
  
  var win = gui.Window.get();
  win.on("maximize", setMaximized.bind(null, true));
  win.on("unmaximize", setMaximized.bind(null, false));
  win.on("enter-fullscreen", setMaximized.bind(null, true));
  win.on("leave-fullscreen", setMaximized.bind(null, false));
  
  // initialize progress bar
  var done = 0;
  var todo = 0;
  
  nav.on("pageloadstart", function() {
    done = 0;
    todo = 0;
    GET("#loadprogress").value = 0;
  });
  
  nav.on("pageloadend", function() {
    GET("#loadprogress").value = 0;
  });
}
