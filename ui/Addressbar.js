/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
/*
Events
  Addressbar.input:
  - locationchange
  - pageloadstart (not yet implemented)
  - pageonloadfired (not yet implemented)
  - pageloadend (not yet implemented)
*/
var Addressbar = new (function() {
  var _wrapper;
  var _show;
  var _box;
  var _info;
  var _input;
  
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
      _box.innerHTML = "<span>Click here to enter an internet address...</span>";
      _box.addEventListener("click", function() {
        _wrapper.classList.remove("show");
        _input.select();
      }, false);
      /*
      _info = _show.create("div");
      _info.id = "info";
      _info.addEventListener("click", function() {
        //...
      }, false);
      */
    
    _input = _wrapper.create("input");
    _input.id = "addressbar-input";
    _input.type = "text";
    _input.classList.add("element");
    //_input.value = "http://www.greinr.com";
    _input.addEventListener("keypress", function(e) {
      switch(e.charCode) {
        //Enter
        case 13:
          Navigator.navigateTo(_input.value);
          _wrapper.classList.add("show");
          break;
      }
    }, false);
    _input.addEventListener("blur", function() {
      _wrapper.classList.add("show");
      //... revert to previous URL
    }, false);
    _input.addEventListener("locationchange", function() {
      if(!this.value) {
        //... revert to previous URL
      }
      
      _box.innerHTML = this.value.replace(/^((.+?):\/\/)?((.+?)\.)?(([a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+)?)(\/.*)?$/, "<span>$3</span>$5");
    });
  }
})();
