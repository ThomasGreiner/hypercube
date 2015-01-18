/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var gui = require("nw.gui");
var nav = require("./lib/nav");

var Header = new (function() {
  this.init = function(html) {
    new BackgroundCreator(html, 0, 46, 46, true, true);
    
    var win = gui.Window.get();
    win.on("maximize", setMaximized.bind(null, true));
    win.on("unmaximize", setMaximized.bind(null, false));
    win.on("enter-fullscreen", setMaximized.bind(null, true));
    win.on("leave-fullscreen", setMaximized.bind(null, false));
    
    initProgressbar();
  }
  
  function initProgressbar() {
    var done = 0;
    var todo = 0;
    var html = GET("#loadprogress");
    
    nav.on("pageloadstart", function() {
      done = 0;
      todo = 0;
      html.value = 0;
    });
    
    nav.on("pageloadend", function() {
      html.value = 0;
    });
  }
  
  function setMaximized(maximized) {
    document.documentElement.classList.toggle("maximized", maximized);
  }
})();
