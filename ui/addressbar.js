/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var nav = require("./lib/nav");

var Addressbar = new (function() {
  var _wrapper;
  var _show;
  var _box;
  var _info;
  var _input;
  var _reURL = /^(([^:]+):(\/\/)?)?(([^\.]+\.)*)([^\/\?]+)(\/.*)?$/;
  
  this.__defineGetter__("input", function() {return _input;});
  
  this.init = function(html) {
    _wrapper = html.create("div");
    _wrapper.id = "addressbar";
    _wrapper.classList.add("show");
    
    _show = _wrapper.create("div");
    _show.id = "addressbar-show";
      _box = _show.create("div");
      _box.id = "addressbar-box";
      _box.classList.add("element");
      _box.innerHTML = "<span class='info'>Click here to enter an internet address...</span>";
      _box.addEventListener("click", function() {
        _wrapper.classList.remove("show");
        _input.select();
      }, false);
      /*
      _info = _show.create("div");
      _info.id = "addressbar-info";
      _info.addEventListener("click", function() {
        //...
      }, false);
      */
    
    _input = _wrapper.create("input");
    _input.id = "addressbar-input";
    _input.type = "text";
    _input.classList.add("element");
    //_input.value = "https://www.greinr.com";
    _input.addEventListener("keypress", function(e) {
      switch(e.charCode) {
        //Enter
        case 13:
          nav.navigateTo(_input.value);
          _wrapper.classList.add("show");
          break;
      }
    }, false);
    _input.addEventListener("blur", function() {
      _wrapper.classList.add("show");
      //... revert to previous URL
    }, false);
    nav.on("locationchange", function(url) {
      _input.value = url;
      
      if(!_input.value) {
        //... revert to previous URL
      }
      
      // parse URL
      var urlParts = _input.value.match(_reURL);
      urlParts = {
        protocol: urlParts[2],
        subdomain: urlParts[5] && urlParts[4] && urlParts[4].slice(0, -urlParts[5].length) || undefined,
        domain: urlParts[5] && urlParts[5]+urlParts[6] || urlParts[6],
        querystring: urlParts[7]
      };
      
      // format URL
      var url = "";
      switch (urlParts.protocol) {
        case "hypercube":
        case "about":
          url = getURLFragment("protocol special", "Hypercube")
            + getURLFragment("domain", urlParts.domain);
          break;
        default:
          for (var i in urlParts) {
            if (urlParts[i]) {
              url += getURLFragment(i, urlParts[i]);
            }
          }
      }
      _box.innerHTML = url;
    });
  }
  
  function getURLFragment(type, value) {
    return "<span class='"+type+"'>"+value+"</span>";
  }
})();
