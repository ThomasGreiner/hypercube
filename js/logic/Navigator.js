/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
var Navigator = new (function() {
  var _event = document.createEvent("Event");
  _event.initEvent("locationchange");
  
  this.navigateTo = function(url) {
    Addressbar.input.value = url;
    
    Addressbar.input.dispatchEvent(_event);
          /*
          browser: navigate to new URL
          Addressbar: change values where needed
          loadingbar: update loadingbar
          ? Navigation: update Back-Button? (to loading animation?)
          header: apply new colors
          */
  }
})();
