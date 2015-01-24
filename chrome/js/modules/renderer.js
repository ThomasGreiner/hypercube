/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

chrome.modules["renderer"] = function() {
  var nav = require("../lib/nav");
  
  var dominantColor = null;
  var dominantColorBrightness = null;
  var reInternalURL = /^(hypercube|about):(\/\/)?(start)$/;
  
  function calculateBrightness(color) {
    return Math.sqrt(0.241 * Math.pow(color[0], 2)
      + 0.691 * Math.pow(color[1], 2)
      + 0.068 * Math.pow(color[2], 2));
  }
  
  GET("#browser").addEventListener("load", function() {
    nav.emit("pageloadend");
  }, false);
  
  nav.on("locationchange", function(url) {
    nav.emit("pageloadstart");
    
    if (reInternalURL.test(url)) {
      url = url.replace(reInternalURL, "$3.htm");
    } else if(url.indexOf("://") == -1) {
      url = "http://" + url;
    }
    GET("#browser").src = url;
    
    dominantColor = null;
    dominantColorBrightness = null;
  }, false);
  
  var module = Object.create(null);
  Object.defineProperties(module, {
    dominantColor: {
      get: function() {
        return dominantColor || [255, 255, 255, 1];
      },
      set: function(value) {
        dominantColor = value;
      }
    },
    dominantColorBrightness: {
      get: function() {
        return dominantColorBrightness || calculateBrightness(module.dominantColor);
      }
    }
  });
  return module;
}
