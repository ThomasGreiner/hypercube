/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var Renderer = new (function() {
  var _html;
  var _dominantColor = false;
  var _dominantColorBrightness = false;
  var _reInternalURL = /^(hypercube|about):(\/\/)?(.+)$/;
  /**
   * 1 pageloadstart: page starts loading
   * 2 frameloadstart: frame starts loading
   * 3 frameloadend: frame loaded
   * 3a frameloadsuccess: frame successfully loaded
   * 3b frameloadabort: frame loading aborted
   * 4 pageloadend: page loaded
   */
  var _events = {
    pageloadstart: null,
    pageloadend: null,
    frameloadstart: null,
    frameloadend: null,
    frameloadabort: null,
    frameloadsuccess: null
  };
  for (var i in _events) {
    _events[i] = document.createEvent("Event");
    _events[i].initEvent(i);
  }
  
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
    
    /*
    _html.addEventListener("loadstart", function(url, isTopLevel) {
      Addressbar.input.dispatchEvent(_events["frameloadstart"]);
    }, false);
    
    _html.addEventListener("loadcommit", function(url, isTopLevel) {
      Addressbar.input.dispatchEvent(_events["frameloadsuccess"]);
      Addressbar.input.dispatchEvent(_events["frameloadend"]);
    }, false);
    
    _html.addEventListener("loadabort", function(url, isTopLevel, reason) {
      Addressbar.input.dispatchEvent(_events["frameloadabort"]);
      Addressbar.input.dispatchEvent(_events["frameloadend"]);
    }, false);
    
    _html.addEventListener("loadstop", function() {
      Addressbar.input.dispatchEvent(_events["pageloadend"]);
    }, false);
    */
    _html.addEventListener("load", function() {
      Addressbar.input.dispatchEvent(_events["pageloadend"]);
    }, false);
    
    Addressbar.input.addEventListener("locationchange", function() {
      Addressbar.input.dispatchEvent(_events["pageloadstart"]);
      navigateTo(this.value);
    }, false);
  }
  
  function navigateTo(url) {
    if(_reInternalURL.test(url)) {
      // TODO: replace with http://www.greinr.com/apps/hypercube/internals/$3 as soon as it's available
      url = url.replace(_reInternalURL, "http://www.greinr.com/$3");
    } else if(url.indexOf("://") == -1) {
      url = "http://"+url;
    }
    _html.src = url;
    
    _dominantColor = false;
    _dominantColorBrightness = false;
  }
})();
