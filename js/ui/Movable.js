/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

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
    Database.moveNode(_html.id, _html.offsetLeft, _html.offsetTop);
  }, false);
});
