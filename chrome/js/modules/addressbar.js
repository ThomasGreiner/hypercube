/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

chrome.modules["addressbar"] = function() {
  var nav = require("../lib/nav");
  
  var reURL = /^(([^:]+):(\/\/)?)?(([^\.]+\.)*)([^\/\?]+)(\/.*)?$/;
  
  function getURLFragment(type, value) {
    return "<span class='" + type + "'>" + value + "</span>";
  }
  
  var wrapper = GET("#addressbar");
  var box = GET("#addressbar-box");
  var input = GET("#addressbar-input");
  
  box.addEventListener("click", function() {
    wrapper.classList.remove("show");
    input.select();
  }, false);
  
  input.addEventListener("keypress", function(e) {
    switch (e.charCode) {
      //Enter
      case 13:
        nav.navigateTo(input.value);
        wrapper.classList.add("show");
        break;
    }
  }, false);
  
  input.addEventListener("blur", function() {
    wrapper.classList.add("show");
    // TODO: revert to previous URL
  }, false);
  
  nav.on("locationchange", function(url) {
    input.value = url;
    
    if (!input.value) {
      // TODO: revert to previous URL
    }
    
    // parse URL
    var urlParts = input.value.match(reURL);
    urlParts = {
      protocol: urlParts[2],
      subdomain: urlParts[5] && urlParts[4] && urlParts[4].slice(0, -urlParts[5].length) || undefined,
      domain: urlParts[5] && urlParts[5] + urlParts[6] || urlParts[6],
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
    box.innerHTML = url;
  });
  
  var module = Object.create(null);
  Object.defineProperty(module, "input", {
    get: function() {
      return input;
    }
  });
  return module;
}
