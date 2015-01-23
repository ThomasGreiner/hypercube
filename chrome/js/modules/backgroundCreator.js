/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

chrome.modules["backgroundCreator"] = function() {
  var gui = require("nw.gui");
  var nav = require("../lib/nav");
  
  // size of UI elements to determine content area
  var BORDER = 3;
  var BOXSHADOW = 1;
  var HEADER = 46;
  var TABBAR = 26;
  
  function comparePixels(px1, i1, px2, i2) {
    return (
      px1[i1] == px2[i2]
      && px1[i1+1] == px2[i2+1]
      && px1[i1+2] == px2[i2+2]
      && px1[i1+3] == px2[i2+3]
    );
  }
  
  function draw() {
    var win = gui.Window.get();
    win.capturePage(onCapture.bind(this), {
      datatype: "datauri",
      format: "png"
    });
  }
  
  function onCapture(dataUrl) {
    this._canvas.ctx.clearRect(0, 0, this._image.width, this._image.height);
    
    var image = new Image();
    image.src = dataUrl;
    image.addEventListener("load", onImageLoad.bind(this, image), false);
  }
  
  function onImageLoad(img) {
    var canvas = this._canvas;
    var image = this._image;
    var border = this._border;
    
    image.width = img.width;
    image.height = img.height;
    
    // rotate image -> normalize
    var x = 0;
    var y = 0;
    switch (this._rotation){
      case 90:
        image.width = img.height;
        image.height = img.width;
        y = -img.height;
        break;
    }
    var width = image.width - border.left - border.right;
    
    var cVis = document.createElement("canvas");
    cVis.width = width;
    cVis.height = this._outputHeight;
    var ctxVis = cVis.getContext("2d");
    
    var cNorm = document.createElement("canvas");
    cNorm.width = width;
    cNorm.height = this._cutHeight;
    var ctxNorm = cNorm.getContext("2d");
    ctxNorm.rotate(this._rotation * Math.PI / 180);
    if (this._rotation % 180) {
      ctxNorm.drawImage(img, x - border.top, y + border.left);
    } else {
      ctxNorm.drawImage(img, x - border.left, y - border.top, image.width, image.height - border.top);
    }
    
    var iData = ctxNorm.getImageData(0, 0, width, this._cutHeight);
    var data = iData.data;
    var visualize = null;
    if (this._visualization == "areas") {
      visualize = visualizeAreas;
    } else if (this._visualization == "mirror") {
      visualize = visualizeMirror;
    }
    if (visualize) {
      visualize.bind(this)(data, width, ctxVis);
    }
    
    //rotate image -> denormalize
    x = 0;
    y = 0;
    switch (360 - this._rotation){
      case 90:
        y = -cVis.height;
        break;
      case 180:
        x = -cVis.width;
        y = -cVis.height;
        break;
      case 270:
        x = -cVis.width;
        break;
    }
    canvas.element.width = (this._rotation % 180) ? this._outputHeight : width;
    canvas.element.height = (this._rotation % 180) ? width : this._outputHeight;
    canvas.ctx.rotate((360 - this._rotation) * Math.PI / 180);
    canvas.ctx.drawImage(cVis, x, y);
  }
  
  function visualizeMirror(data, width, outCtx) {
    outCtx.fillStyle = "white";
    outCtx.fillRect(0, 0, width, this._outputHeight);
    var outData = outCtx.getImageData(0, 0, width, this._outputHeight);
    var oData = outData.data;
    
    for (var i = 0; i < data.length; i += 4) {
      var line = this._cutHeight - ((i / (width * 4)) >>> 0) - 1;
      var ii = (i % (width * 4)) + (width * 4 * line);
      
      oData[ii] = data[i];
      oData[ii + 1] = data[i + 1];
      oData[ii + 2] = data[i + 2];
    }
    outCtx.putImageData(outData, 0, 0);
    
    if (this._hasGradient) {
      var gradient = outCtx.createLinearGradient(width / 2, 0, width / 2, this._outputHeight);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      outCtx.fillStyle = gradient;
      outCtx.fillRect(0, 0, width, this._outputHeight);
    }
  }
  
  function visualizeAreas(data, width, outCtx) {
    var pixelComparisonDistance = (this._useDominantColor) ? 9 : 49;
    
    //determine areas
    var current = [data[0], data[1], data[2], data[3]];
    var areas = [0];
    var colors = (this._useDominantColor) ? [] : [current];
    var colorIndex = {};
    var dominantColors = {};
    for (var i = 0; i < width * 4; i += 4) {
      var isPixelEqual = true;
      for(var j = 1; j < pixelComparisonDistance; j++) {
        isPixelEqual = isPixelEqual && comparePixels(data, i, data, i + width * 4 * j)
      }
      if (isPixelEqual) {
        if (!comparePixels(data, i, current, 0)) {
          //end of area
          current = [data[i], data[i + 1], data[i + 2], data[i + 3]];
          areas.push(i / 4);
          
          //determine dominant color of previous area
          var max = 0;
          var c;
          for (var j in colorIndex) {
            if (colorIndex[j] > max) {
              c = j.split();
              max = colorIndex[j];
            }
          }
          dominantColors[c] = max;
          colorIndex = {};
          colors.push((this._useDominantColor) ? c : current);
        }
      }
      
      for (var j = 0; j < 5; j++) {
        var c = [
          data[i + width * 4 * j],
          data[i + 1 + width * 4 * j],
          data[i + 2 + width * 4 * j],
          data[i + 3 + width * 4 * j]
        ];
        if (!colorIndex[c.join()]) {
          colorIndex[c.join()] = 1;
        } else {
          colorIndex[c.join()]++;
        }
      }
    }
    areas.push(width);
    
    //determine dominant color of last area
    var max = 0;
    var c;
    for (var j in colorIndex) {
      if (colorIndex[j] > max) {
        c = j.split();
        max = colorIndex[j];
      }
    }
    dominantColors[c] = max;
    colorIndex = {};
    colors.push((this._useDominantColor) ? c : current);
    
    if (this._definesDominantColor) {
      //determine dominant color of website
      var max = 0;
      var c;
      for (var i in dominantColors) {
        if (dominantColors[i] > max) {
          c = i.split(",");
          max = dominantColors[i];
        }
      }
      //convert strings to numbers
      c[0] = c[0] >> 0;
      c[1] = c[1] >> 0;
      c[2] = c[2] >> 0;
      c[3] = 1;
      chrome("renderer").dominantColor = c;
      Navigation.draw(); // TODO: should be called by event listener
    }
    
    //fill areas
    for (var i = 0; i < areas.length - 1; i++) {
      outCtx.fillStyle = "rgba(" + colors.shift() + ")";
      outCtx.fillRect(areas[i], 0, areas[i + 1] - areas[i], this._outputHeight);
    }
    
    //create gradients between areas
    /*
    1) determine area colors
    2) 10% of left area is gradient with color of right area
    3) 10% of right area is gradient with color of left area
    */
    //...
    
    if (this._hasGradient) {
      var gradient = outCtx.createLinearGradient(width / 2, 0, width / 2, this._outputHeight);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      outCtx.fillStyle = gradient;
      outCtx.fillRect(0, 0, width, this._outputHeight);
    }
  }
  
  function Creator(canvas, rotation, cutHeight, outputHeight, hasGradient, definesDominantColor) {
    var border = {
      bottom: BORDER,
      left: BORDER + TABBAR + BOXSHADOW,
      right: BORDER,
      top: BORDER + HEADER + BOXSHADOW
    };
    switch (rotation) {
      case 90:
        var borderRight = border.right;
        border.right = border.top;
        border.top = border.left;
        border.left = border.bottom;
        border.bottom = borderRight;
        break;
    }
    
    this._border = border;
    this._canvas = {
      ctx: canvas.getContext("2d"),
      element: canvas
    };
    this._image = {
      width: 0,
      height: 0
    };
    this._cutHeight = cutHeight;
    this._definesDominantColor = definesDominantColor;
    this._hasGradient = hasGradient;
    this._outputHeight = outputHeight;
    this._rotation = rotation;
    
    nav.on("pageloadend", draw.bind(this));
  }
  Creator.prototype = {
    _border: null,
    _canvas: null,
    _image: null,
    
    _cutHeight: 0,
    _definesDominantColor: false,
    _hasGradient: false,
    _outputHeight: 0,
    _rotation: 0,
    _useDominantColor: true,
    _visualization: "areas", // "areas" or "mirror"
  };
  
  return {
    create: function(canvas, rotation, cutHeight, outputHeight, hasGradient, definesDominantColor) {
      return new Creator(canvas, rotation, cutHeight, outputHeight, hasGradient, definesDominantColor);
    }
  };
}
