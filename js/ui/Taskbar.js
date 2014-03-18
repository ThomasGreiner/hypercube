/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

//TEST
var tasks = {
  "a": 1,
  "b": 2,
  "c": 3
}

var Taskbar = new (function() {
  this.init = function(html) {
    for(var i in tasks) {
      var node = new Node(html, "small", "right");
      //...
    }
  }
})();
