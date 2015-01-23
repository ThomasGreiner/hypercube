/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var database = require("../lib/database");
var nav = require("../lib/nav");

var Movable = (function(html) {
  if(!html) return;
  
  var _click = false;
  var _html = html;
  var _halfWidth;
  var _halfHeight;

  this.getCoords = function() {
    return [
      this.html.offsetLeft+this.html.offsetWidth/2,
      this.html.offsetTop+this.html.offsetHeight/2
    ];
  }

  this.startMove = function(ev) {
    //ignore mouse buttons other than left one
    if(ev && ev.which != 1) return;
    
    _click = true;
    _halfWidth = _html.offsetWidth/2;
    _halfHeight = _html.offsetHeight/2;
  }
  
  _html.addEventListener("mousedown", this.startMove, false);
  
  document.body.addEventListener("mousemove", function(ev) {
    //ignore mouse buttons other than left one
    if(ev.which != 1) return;

    if(_click) {
      _html.style.top = (ev.clientY-11-_halfHeight)+"px";
      _html.style.left = (ev.clientX-11-_halfWidth)+"px";
      Visualizer.renderConnections();
    }
  }, false);
  
  document.body.addEventListener("mouseup", function() {
    _click = false;
    database.moveNode(_html.id || this.id, _html.offsetLeft, _html.offsetTop);
  }, false);
});

var Node = (function(id, name, url) {
  var _id = id;
  var _name = name;
  var _url = url;
  var _html;
  var _size;
  var _align;
  var _isMovable;

  this.__defineGetter__("id", function() {
    return _id;
  });
  this.__defineSetter__("id", function(id) {
    _html.id = id;
    _id = id;
  });

  this.__defineGetter__("html", function() {return _html;});

  this.__defineGetter__("parent", function() {return _html.parentNode;})
  this.__defineSetter__("parent", function(parent) {
    parent.appendChild(_html);
  });

  this.__defineSetter__("align", function(align) {
    _html.classList.remove(_align);
    _html.classList.add(align);
    _align = align;
  });

  this.__defineSetter__("isMovable", function(isMovable) {
    _html.classList.remove(_isMovable);
    _html.classList.add(isMovable);
    _isMovable = isMovable;
    if(isMovable) {
      _html.classList.add("movable");
      this.__proto__.constructor(_html);
    } else {
      _html.classList.remove("movable");
    }
  });

  this.render = function(html, size, align, isMovable, x, y) {
    _size = size;
    _align = align;
    _isMovable = isMovable;

    var click = false;

    _html = html.create("nobr");
    _html.id = _id;
    _html.classList.add("node");
    _html.classList.add(_size);
    _html.classList.add(_align);
    // TODO: find alternative
    //_html.style.backgroundImage = "url(chrome://favicon/"+_url+")";
    if(!_isMovable) {
      _html.addEventListener("mousedown", (function(ev) {
        //ignore mouse buttons other than left one
        if(ev.which != 1) return;
        
        var x = ev.target.x;
        var y = ev.target.y;
        setTimeout((function() {
          if(click) {
            click = false;
            Visualizer.show();
          }
        }).bind(this), 400);
        click = true;
      }).bind(this), false);
      _html.addEventListener("mouseout", (function(ev) {
        if(click) {
          click = false;
          this.align = "center";
          this.isMovable = true;
          this.startMove();
          Visualizer.addNode(this);
          Visualizer.show();
        }
      }).bind(this), false);
      _html.addEventListener("mouseup", function(ev) {
        //ignore mouse buttons other than left one
        if(ev.which != 1) return;
        
        if(click) {
          click = false;
          //short-click
          nav.navigateTo(_url);
        }
      }, false);
    }
    
    var name = _html.create("div");
    name.classList.add("node-title");
    name.innerText = _name;
    if(_isMovable) {
      _html.classList.add("movable");
      _html.style.top = y+"px";
      _html.style.left = x+"px";
      this.__proto__.constructor(_html);
    }

    return _html;
  }

  this.toJSON = function() {
    return {
      id:   id,
      name: name,
      url:  url
    };
  }
});
Node.prototype = new Movable();

var Cluster = (function(id, name) {
  var _id = id;
  var _name = name;
  var _html;

  this.getNodes = function(callback) {
    database.getNodes(_id, callback);
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
