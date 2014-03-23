/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var database = require("./lib/database");

var Visualizer = new (function() {
  var _html;
  var _nodes = [];
  var _connections;
  
  this.init = function(html) {
    _html = html;

    var hideBtn = GET("#hide_visualizer");
    hideBtn.addEventListener("click", Visualizer.hide, true);
    
    database.getNodes(null, this.renderNodes);

    window.addEventListener("resize", this.renderConnections, false);
  }
  
  this.show = function() {
    _html.classList.remove("hidden");
    this.renderConnections();
  }
  
  this.hide = function() {
    _html.classList.add("hidden");
  }

  this.addNode = function(node) {
    if(node.parent==_html) return;
    node.parent = _html;
    _nodes.push(node);

    determineConnections(node);

    var coords = node.getCoords();
    database.insertNode(null, node, {
      x:  coords[0],
      y:  coords[1]
    });
  }

  this.renderNodes = function(nodes) {
    _nodes = [];
    for(var i in nodes) {
      if(nodes[i].url) {
        //render node
        var node = new Node(
          nodes[i].id,
          nodes[i].name,
          nodes[i].url
        );
        node.render(_html, "small", "center", true, nodes[i].posX, nodes[i].posY);
        _nodes.push(node);
      } else {
        //render cluster
        var cluster = new Cluster(
          nodes[i].id,
          nodes[i].name
        );
        cluster.render(_html /* nodes[i].posX, nodes[i].posY */);
        _nodes.push(cluster);
      }
    }
    Visualizer.renderConnections();
  }

  this.renderConnections = function() {
    if(_nodes.length < 2) return;

    var c = document.getElementById("visualizer_bg");
    c.width = _html.offsetWidth;
    c.height = _html.offsetHeight;
    var ctx = c.getContext("2d");

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    if(!_connections) {
      //render random connections (algorithm needed)
      _connections = {};
      for(var i=0; i<_nodes.length-1; i++) {
        var r1 = Math.random()*_nodes.length>>0;
        var r2;
        do {
          r2 = Math.random()*_nodes.length>>0;
        } while(r2==r1);

        _connections[r1+"-"+r2] = [r1, r2];
      }
    }

    for(var i in _connections) {
      var n1 = _nodes[_connections[i][0]].getCoords();
      var n2 = _nodes[_connections[i][1]].getCoords();
      ctx.beginPath();

      ctx.moveTo(n1[0], n1[1]);
      ctx.lineTo(n2[0], n2[1]);

      ctx.stroke();
      ctx.closePath();
    }
  }

  function determineConnections(node1) {
    if(_nodes.length < 2) return;

    Visualizer.renderConnections();

    //create one random connection (algorithm needed)
    var r1 = _nodes.length-1;
    var r2;
    do {
      r2 = Math.random()*_nodes.length>>0;
    } while(r2==r1);

    if(!_connections) _connections = {};
    _connections[r1+"-"+r2] = [r1, r2];

    Visualizer.renderConnections();
  }
})();
