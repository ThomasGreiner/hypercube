/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var gui = require("nw.gui");

var extensions = [
  {
    type: "extension",
    image: "res/images/logo.svg",
    onclick: function()
    {
      Visualizer.show();
    }
  },
  {
    type: "extension",
    image: "res/images/devtools.png",
    onclick: function()
    {
      gui.Window.get().showDevTools();
    }
  }
];

var Toolbar = new (function() {
  this.init = function(html) {
    extensions.forEach(function(extension) {
      new ToolbarButton(html, extension);
    });
  }
})();
