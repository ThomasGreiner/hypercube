/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var Header = new (function() {
  var _win = chrome.app.window.current();
  var _bg = new BackgroundCreator(0, 46, 46 /*46*/, true, true);
  
  this.init = function(html) {
    _bg.init(html);
    
    _win.onMaximized.addListener(checkMaximized);
    _win.onFullscreened.addListener(checkMaximized);
    _win.onRestored.addListener(checkMaximized);
    checkMaximized();
    
    initProgressbar();
    
    Addressbar.input.addEventListener("pageloadend", _bg.draw, false);
  }
  
  function initProgressbar() {
    var done = 0;
    var todo = 0;
    var html = GET("loadprogress");
    Addressbar.input.addEventListener("locationchange", function() {
      //...
    }, false);
    
    Addressbar.input.addEventListener("pageloadstart", function() {
      done = 0;
      todo = 0;
      html.value = 0;
    }, false);
    
    Addressbar.input.addEventListener("frameloadstart", function() {
      todo++;
      html.value = done / todo * 100;
    }, false);
    
    Addressbar.input.addEventListener("frameloadend", function() {
      done++;
      html.value = done / todo * 100;
    }, false);
    
    Addressbar.input.addEventListener("frameloadsuccess", function() {
      //...
    }, false);
    
    Addressbar.input.addEventListener("frameloadabort", function() {
      //...
    }, false);
    
    Addressbar.input.addEventListener("pageloadend", function() {
      html.value = 0;
    }, false);
  }
  
  function checkMaximized() {
    if (_win.isMaximized()) {
      document.documentElement.classList.add("maximized");
    } else {
      document.documentElement.classList.remove("maximized");
    }
  }
})();
