/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
HTMLElement.prototype.create = function(type) {
  var element = document.createElement(type);
  this.appendChild(element);
  return element;
}

var GET = function(id) {return document.getElementById(id);}
