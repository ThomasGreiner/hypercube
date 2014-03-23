/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var navigator = require("./lib/navigator");

var History = new (function() {
  var _arr = [];
  
  this.__defineGetter__("length", function() {return _arr.length;});
  
  this.init = function() {
    navigator.on("locationchange", function(url) {
      _arr.push(url);
      navigator.emit("historychange");
    });
    _arr.push("hypercube://start");
  }

  this.back = function() {
    if(_arr.length == 1) return;

    _arr.pop();
    navigator.navigateTo(_arr.pop());
  }
})();
