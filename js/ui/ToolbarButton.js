/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var ToolbarButton = (function(html, data) {
  var _div = html.create("div");
  _div.classList.add("element");
  _div.classList.add(data.type);
  
  if ("onclick" in data) {
    _div.addEventListener("click", data.onclick, false);
  }
  
  var _icon = _div.create("img");
  _icon.src = data.image;
  //...
});
