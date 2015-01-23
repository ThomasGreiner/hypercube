HTMLElement.prototype.create = function(type) {
  var element = document.createElement(type);
  this.appendChild(element);
  return element;
}

function GET(selector) {
  return document.querySelector(selector);
}

function ui(module) {
  if (module in ui.modules) {
    if (typeof ui.modules[module] == "function") {
      ui.modules[module] = ui.modules[module]();
    }
    
    return ui.modules[module];
  }
  
  return ui.modules[""];
}
ui.modules = Object.create(null);
ui.modules[""] = Object.create(null);

document.addEventListener("DOMContentLoaded", function() {
  ui("addressbar");
}, false);
