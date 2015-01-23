HTMLElement.prototype.create = function(type) {
  var element = document.createElement(type);
  this.appendChild(element);
  return element;
}

function GET(selector) {
  return document.querySelector(selector);
}

function chrome(module) {
  if (module in chrome.modules) {
    if (typeof chrome.modules[module] == "function") {
      chrome.modules[module] = chrome.modules[module]();
    }
    
    return chrome.modules[module];
  }
  
  return chrome.modules[""];
}
chrome.modules = Object.create(null);
chrome.modules[""] = Object.create(null);

document.addEventListener("DOMContentLoaded", function() {
  chrome("addressbar");
}, false);
