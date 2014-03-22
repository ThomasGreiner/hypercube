/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var Cluster = (function(id, name) {
  var _id = id;
  var _name = name;
  var _html;

  this.getNodes = function(callback) {
    Database.getNodes(_id, callback);
  }
  
  this.render = function(html) {
    _html = html.create("nobr");
    _html.classList.add("cluster");
    _html.style.backgroundImage = "url(img/logo.svg)";
    
    var name = _html.create("div");
    name.classList.add("cluster-title");
    name.innerText = _name;
    
    this.__proto__.constructor(_html);
  }

  this.toJSON = function() {
    return {
      id:   id,
      name: name
    };
  }
});
Cluster.prototype = new Movable();
