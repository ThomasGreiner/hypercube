/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

chrome.modules["visualizer"] = function() {
  var database = require("../lib/database");
  
  function show() {
    element.classList.remove("hidden");
    renderConnections();
  }
  
  function hide() {
    element.classList.add("hidden");
  }
  
  function addNode(node) {
    if (node.parent === element)
      return;
    
    node.parent = element;
    nodeList.push(node);
    
    determineConnections(node);
    
    var coords = node.getCoords();
    database.insertNode(null, node, {
      x: coords[0],
      y: coords[1]
    });
  }
  
  function determineConnections() {
    if (nodeList.length < 2)
      return;

    renderConnections();

    //create one random connection (algorithm needed)
    var r1 = nodeList.length - 1;
    var r2 = null;
    while (true) {
      r2 = Math.random() * nodeList.length >> 0;
      if (r2 != r1)
        break;
    }
    if (!connectionList)
      connectionList = {};
    connectionList[r1 + "-" + r2] = [r1, r2];

    renderConnections();
  }
  
  function renderNodes(nodes) {
    nodeList = [];
    for (var i in nodes) {
      if (nodes[i].url) {
        //render node
        var node = new Node(
          nodes[i].id,
          nodes[i].name,
          nodes[i].url
        );
        node.render(element, "small", "center", true, nodes[i].posX, nodes[i].posY);
        nodeList.push(node);
      } else {
        //render cluster
        var cluster = new Cluster(
          nodes[i].id,
          nodes[i].name
        );
        cluster.render(element);
        nodeList.push(cluster);
      }
    }
    renderConnections();
  }
  
  function renderConnections() {
    if (nodeList.length < 2)
      return;
    
    var canvas = GET("#visualizer_bg");
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    var ctx = canvas.getContext("2d");
    
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    if (!connectionList) {
      //render random connections (algorithm needed)
      connectionList = {};
      for (var i = 0; i < nodeList.length - 1; i++) {
        var r1 = Math.random() * nodeList.length >> 0;
        var r2 = null;
        while (true) {
          r2 = Math.random() * nodeList.length >> 0;
          if (r2 != r1)
            break;
        }
        connectionList[r1 + "-" + r2] = [r1, r2];
      }
    }
    
    for (var i in connectionList) {
      var n1 = nodeList[connectionList[i][0]].getCoords();
      var n2 = nodeList[connectionList[i][1]].getCoords();
      ctx.beginPath();
      
      ctx.moveTo(n1[0], n1[1]);
      ctx.lineTo(n2[0], n2[1]);
      
      ctx.stroke();
      ctx.closePath();
    }
  }
  
  var nodeList = [];
  var connectionList = null;
  var element = GET("#visualizer");
  var hideBtn = GET("#hide_visualizer");
  hideBtn.addEventListener("click", hide, true);
  database.getNodes(null, renderNodes);
  window.addEventListener("resize", renderConnections, false);
  
  return {
    addNode: addNode,
    renderConnections: renderConnections,
    show: show
  };
}
