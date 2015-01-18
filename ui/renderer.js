/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var nav = require("./lib/nav");

var Renderer = new (function() {
  var _html;
  var _dominantColor = false;
  var _dominantColorBrightness = false;
  var _reInternalURL = /^(hypercube|about):(\/\/)?(start)$/;
  
  this.__defineGetter__("dominantColor", function() {
    return (_dominantColor) ? _dominantColor : [255, 255, 255, 1];
  });
  this.__defineSetter__("dominantColor", function(value) {
    _dominantColor = value;
  });
  
  this.__defineGetter__("dominantColorBrightness", function() {
    if(_dominantColorBrightness) {
      return _dominantColorBrightness;
    }
    
    //calculate brightness
    var color = this.dominantColor;
    _dominantColorBrightness = Math.sqrt(0.241*Math.pow(color[0],2) + 0.691*Math.pow(color[1],2) + 0.068*Math.pow(color[2],2));
    
    return _dominantColorBrightness;
  });
  
  this.init = function(html) {
    _html = html;
    
    _html.addEventListener("load", function() {
      nav.emit("pageloadend");
    }, false);
    
    nav.on("locationchange", function(url) {
      nav.emit("pageloadstart");
      navigateTo(url);
    }, false);
  }
  
  function navigateTo(url) {
    if(_reInternalURL.test(url)) {
      url = url.replace(_reInternalURL, "internal/$3.htm");
    } else if(url.indexOf("://") == -1) {
      url = "http://"+url;
    }
    _html.src = url;
    
    _dominantColor = false;
    _dominantColorBrightness = false;
  }
})();
