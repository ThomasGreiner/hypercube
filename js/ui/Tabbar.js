/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
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
    url: "http://www.greinr.com"
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

var Tabbar = new (function() {
  var _bg = new BackgroundCreator(90, 22, 22, false, false);

  this.init = function(html, bg) {
    for(var i in tabs) {
      var node = new Node(null, tabs[i].title, tabs[i].url);
      node.render(html, "small", "left", false);
      //...
    }

    _bg.init(bg);
    
    Addressbar.input.addEventListener("pageloadend", _bg.draw, false);
  }
})();
