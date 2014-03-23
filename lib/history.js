/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var navigator = require("./navigator");

var history = ["hypercube://start"];

module.exports = {
  get length() {
    return history.length;
  },
  
  back: function() {
    if (history.length == 1)
      return;

    history.pop();
    navigator.navigateTo(history.pop());
  }
};

navigator.on("locationchange", function(url) {
  history.push(url);
  navigator.emit("historychange");
});
