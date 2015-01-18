/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var svg;
var svgPaths = [
  //background
  /*
  {
    id: "out_background_left",
    start: "m 150,50 0,300 -100,100 0,-300 z",
    end: "m 140,50 0,300 -100,100 0,-300 z"
  },
  {
    id: "out_background_bottom",
    start: "m 50,450 100,-100 300,0 -100,100 z",
    end: "m 50,460 100,-100 300,0 -100,100 z"
  },
  */
  //foreground
  {
    id: "out_foreground_top",
    start: "m 50,150 100,-100 300,0 -100,100 z",
    end: "m 50,140 100,-100 300,0 -100,100 z"
  },
  {
    id: "out_foreground_right",
    start: "m 450,50 0,300 -100,100 0,-300 z",
    end: "m 460,50 0,300 -100,100 0,-300 z"
  },
  //background (inner)
  {
    id: "in_background_left",
    start: "m 155,195 40,-40 0,150 -40,40 z",
    end: "m 145,195 40,-40 0,150 -40,40 z"
  },
  {
    id: "in_background_bottom",
    start: "m 155,345 40,-40 150,0 -40,40 z",
    end: "m 155,355 40,-40 150,0 -40,40 z"
  },
  //foreground (inner)
  {
    id: "in_foreground_top",
    start: "m 155,195 40,-40 150,0 -40,40 z",
    end: "m 155,185 40,-40 150,0 -40,40 z"
  },
  {
    id: "in_foreground_right",
    start: "m 305,195 40,-40 0,150 -40,40 z",
    end: "m 315,195 40,-40 0,150 -40,40 z"
  }
];

var ANIMATION_DURATION = 2000;
function movePath(path) {
  var target = svg.getElementById(path.id);
  path.hasStarted = !path.hasStarted;
  
  if(path.anim) path.anim.endElement();
  if(path.hasStarted) {
    var animationOut = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animationOut.setAttributeNS(null, 'attributeName', 'd');
    animationOut.setAttributeNS(null, "begin", "indefinite");
    animationOut.setAttributeNS(null, "from", path.start);
    animationOut.setAttributeNS(null, 'to', path.end);
    animationOut.setAttributeNS(null, 'dur', ANIMATION_DURATION/1000);
    animationOut.setAttributeNS(null, 'fill', 'freeze');
    target.appendChild(animationOut);
    animationOut.beginElement();
    path.anim = animationOut;
  } else {
    var animationIn = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animationIn.setAttributeNS(null, "attributeName", "d");
    animationIn.setAttributeNS(null, "begin", "indefinite");
    animationIn.setAttributeNS(null, "from", path.end);
    animationIn.setAttributeNS(null, "to", path.start);
    animationIn.setAttributeNS(null, "dur", ANIMATION_DURATION/1000);
    animationIn.setAttributeNS(null, "fill", "freeze");
    target.appendChild(animationIn);
    animationIn.beginElement();
    path.anim = animationIn;
  }
  
  setTimeout(movePath, ANIMATION_DURATION+300, path);
}

var SVG_LOADED = false;
function loadSVG() {
  svg = document.getElementsByTagName("embed")[0].getSVGDocument();
  
  svgPaths.forEach(function(e) {
    svg.getElementById(e.id).addEventListener("mouseover", function() {
      //... do something
    }, false);
    //...
  });
}

function animate() {
  if(!SVG_LOADED) loadSVG();

  svgPaths.forEach(function(e) {
    movePath(e);
  });
}
