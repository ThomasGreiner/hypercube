/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
var Main = new (function() {
  this.init = function() {
    //initialize DAL components
    //Database.init();
    
    //initialize UI components
    GET("close").addEventListener("click", function() {
      window.close();
    }, false);
    Addressbar.init(GET("nav"));
    Navigation.init(GET("nav"));
    Toolbar.init(GET("toolbar"));
    Header.init(GET("header_bg"));
    Tabbar.init(GET("tabs_list"), GET("tabs_bg"));
    //Taskbar.init(GET("tasks"));
    Renderer.init(GET("browser"));
    //Visualizer.init(GET("visualizer"));
    History.init();
    
    // TODO: add Navigator.navigateTo("hypercube://start"); as soon as it's availabel
    
    //Visualizer.show();
  }
})();
document.addEventListener("DOMContentLoaded", Main.init, false);
