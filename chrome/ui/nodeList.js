/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

//TEST
var tabs = [
  {
    title: "CNN",
    url: "http://www.cnn.com"
  },
  {
    title: "greinr.com",
    url: "https://www.greinr.com"
  },
  /*
  {
    title: "Mozilla",
    url: "http://www.mozilla.org"
  },
  */
  {
    title: "If This Then That",
    url: "http://ifttt.com"
  },
  {
    title: "Minecraft",
    url: "http://www.minecraft.net"
  },
  {
    title: "Docs",
    url: "http://www.docs.com"
  },
  {
    title: "Fernsehkritik TV",
    url: "http://www.fernsehkritik.tv"
  },
  {
    title: "ATV",
    url: "http://www.atv.at"
  },
  {
    title: "ZDF",
    url: "http://www.zdf.de"
  }
];

var tasks = {
  "a": 1,
  "b": 2,
  "c": 3
};

var extensions = [
  {
    type: "extension",
    image: "img/logo.svg",
    onclick: function()
    {
      Visualizer.show();
    }
  },
  {
    type: "extension",
    image: "img/devtools.png",
    onclick: function()
    {
      require("nw.gui").Window.get().showDevTools();
    }
  }
];

var Tabbar = new (function() {
  var _bg;

  this.init = function(html, bg) {
    for(var i in tabs) {
      var node = new Node(null, tabs[i].title, tabs[i].url);
      node.render(html, "small", "left", false);
      //...
    }
    
    ui("backgroundCreator").create(bg, 90, 22, 22, false, false);
  }
})();

var Taskbar = new (function() {
  this.init = function(html) {
    for(var i in tasks) {
      var node = new Node(html, "small", "right");
      //...
    }
  }
})();

var Toolbar = new (function() {
  this.init = function(html) {
    extensions.forEach(function(extension) {
      new ToolbarButton(html, extension);
    });
  }
})();
