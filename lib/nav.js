/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var EventEmitter = require("events").EventEmitter;

/**
 * 1 pageloadstart: page starts loading
 * 2 frameloadstart: frame starts loading
 * 3 frameloadend: frame loaded
 * 3a frameloadsuccess: frame successfully loaded
 * 3b frameloadabort: frame loading aborted
 * 4 pageloadend: page loaded
 */
var emitter = new EventEmitter();
module.exports = {
  __proto__: emitter,
  
  navigateTo: function(url) {
    emitter.emit("locationchange", url);
  }
};
