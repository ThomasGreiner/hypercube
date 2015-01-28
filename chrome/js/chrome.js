/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var isDevMode = false;

HTMLElement.prototype.create = function(type) {
  var element = document.createElement(type);
  this.appendChild(element);
  return element;
}

function GET(selector) {
  return document.querySelector(selector);
}

function chrome(module) {
  if (module in chrome.modules) {
    if (typeof chrome.modules[module] == "function") {
      chrome.modules[module] = chrome.modules[module]();
    }
    
    return chrome.modules[module];
  }
  
  return chrome.modules[""];
}
chrome.modules = Object.create(null);
chrome.modules[""] = Object.create(null);

(function() {
  var gui = require("nw.gui");
  
  require("../lib/database").init(gui.App.dataPath);
  
  document.addEventListener("DOMContentLoaded", function() {
    GET("#close").addEventListener("click", function() {
      gui.Window.get().close();
    }, false);
    
    // initialize necessary modules that are not being required by any module
    chrome("addressbar");
    chrome("header");
    chrome("navigation");
    
    // old-style module loading
    Toolbar.init(GET("#toolbar"));
    Tabbar.init(GET("#tabs_list"), GET("#tabs_bg"));
  }, false);
})();

