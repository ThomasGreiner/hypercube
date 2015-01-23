/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

chrome.modules["navigation"] = function() {
  var history = require("../lib/history");
  var nav = require("../lib/nav");
  var renderer = chrome("renderer");
  
  function clear() {
    ctx.clearRect(0, 0, 100, 100);
  }
  
  function drawTriangle(fillStyle) {
    if (!fillStyle) {
      //determine colors
      var rgb1 = defaultColor;
      var color = renderer.dominantColor;
      if (color[0] != 255 && color[1] != 255 && color[2] != 255) {
        rgb1 = color;
      }
      var rgb2 = getNegativeColor(rgb1);
      
      var fillStyle = ctx.createLinearGradient(0, 0, 0, 100);
      fillStyle.addColorStop(0.6, "rgba(" + rgb1.join(",") + ")");
      fillStyle.addColorStop(1, "rgba(" + rgb2.join(",") + ")");
    }
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(100, 100);
    ctx.lineTo(50, 50);
    ctx.fill();
  }
  
  function getNegativeColor(color) {
    var diff = (renderer.dominantColorBrightness < 128) ? -30 : 30;
    return [
      getValidColorCode(color[0] + diff),
      getValidColorCode(color[1] + diff),
      getValidColorCode(color[2] + diff),
      1
    ];
  }
  
  function getValidColorCode(colorCode) {
    if (colorCode < 0) {
      colorCode = 0;
    } else if (colorCode > 255) {
      colorCode = 255;
    }
    return colorCode;
  }
  
  function drawArrow(fillStyle) {
    if (history.length < 2)
      return;

    var color = renderer.dominantColor;
    if (color[0] == 255 && color[1] == 255 && color[2] == 255) {
      fillStyle = fillStyle || "#ffffff";
    }
    ctx.fillStyle = fillStyle || (renderer.dominantColorBrightness < 128) ? "#ffffff" : "#000000";
    ctx.beginPath();
    ctx.moveTo(43, 77);
    //top wing
    ctx.lineTo(53, 77);
    ctx.lineTo(55, 79);
    ctx.lineTo(47, 79);
    //body
    ctx.lineTo(53, 85);
    ctx.lineTo(53, 87);
    ctx.lineTo(51, 87);
    ctx.lineTo(45, 81);
    //bottom wing
    ctx.lineTo(45, 89);
    ctx.lineTo(43, 87);
    ctx.lineTo(43, 77);
    ctx.fill();
  }
  
  function draw() {
    clear();
    drawTriangle();
    drawArrow();
  }
  
  var defaultColor = [0, 0, 50, 1];
  
  var canvas = GET("#navigation");
  canvas.width = 100;
  canvas.height = 100;
  var ctx = canvas.getContext("2d");
  
  drawTriangle();
  drawArrow();

  canvas.addEventListener("click", function(e) {
    history.back();
  }, false);
  
  canvas.addEventListener("mousemove", function(e) {
    clear();
    drawTriangle();
    
    //determine colors
    var rgb1 = [defaultColor[0], defaultColor[1], defaultColor[2], 0.1];
    var color = renderer.dominantColor;
    if (color[0] != 255 && color[1] != 255 && color[2] != 255) {
      rgb1 = [color[0], color[1], color[2], 0.01];
    }
    var rgb2 = getNegativeColor(rgb1);
    
    var gradient = ctx.createRadialGradient(e.offsetX, e.offsetY, 5, e.offsetX, e.offsetY, 50);
    gradient.addColorStop(0, "rgba(" + rgb2.join(",") + ")");
    gradient.addColorStop(0.99, "rgba(" + rgb1.join(",") + ")");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    drawTriangle(gradient);
    
    drawArrow();
  }, false);
  
  canvas.addEventListener("mouseout", function() {
    draw();
  }, false);
  
  nav.on("historychange", function() {
    drawArrow();
  });
  
  return {
    draw: draw
  };
}
