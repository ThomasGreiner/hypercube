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
  
  var borderProto = {
    bottom: BORDER,
    left: BORDER + TABBAR + BOXSHADOW,
    right: BORDER,
    top: BORDER + HEADER + BOXSHADOW
  };
  
  function draw() {
    var win = gui.Window.get();
    win.capturePage(onCapture.bind(this), {
      datatype: "datauri",
      format: "png"
    });
  }
  
  function onCapture(dataUrl) {
    if (this._image) {
      this._canvas.ctx.clearRect(0, 0, this._image.width, this._image.height);
    }
    
    var image = new Image();
    image.src = dataUrl;
    image.addEventListener("load", onImageLoad.bind(this, image), false);
  }
  
  function onImageLoad(img) {
    var border = this._border;
    var image = this._image = {
      height: img.height,
      width: img.width
    };
    
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
    
    var dataNorm = ctxNorm.getImageData(0, 0, width, this._cutHeight);
    visualize.bind(this)(dataNorm.data, width, ctxVis, function() {
      if (isDevMode) {
        gui.Window.open("debug.htm?" + cNorm.toDataURL() + "&" + cVis.toDataURL(), {
          width: width + 30,
          height: this._cutHeight * 2 + 30,
          frame: false,
          toolbar: false,
          "always-on-top": true
        });
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
      
      var canvas = this._canvas;
      canvas.element.width = (this._rotation % 180) ? this._outputHeight : width;
      canvas.element.height = (this._rotation % 180) ? width : this._outputHeight;
      canvas.ctx.rotate((360 - this._rotation) * Math.PI / 180);
      canvas.ctx.drawImage(cVis, x, y);
    });
  }
  
  function visualize(data, width, outCtx, callback) {
    outCtx.fillStyle = "white";
    outCtx.fillRect(0, 0, width, this._outputHeight);
    
    this._worker.postMessage({
      action: "transform",
      id: this._id,
      params: {
        data: data,
        width: width
      }
    });
    
    function onVisualize(ev) {
      this._worker.removeEventListener("message", onVisualize, false);
      
      var result = ev.data;
      
      switch (this._type) {
        case "areas":
          var data = result.data;
          for (var i = 0; i < data.length; i++) {
            outCtx.fillStyle = "rgba(" + data[i].color + ")";
            outCtx.fillRect(data[i].x, 0, data[i].width, this._outputHeight);
          }
          break;
        case "mirror":
          var outData = outCtx.getImageData(0, 0, width, this._outputHeight);
          outData.data.set(result.data);
          outCtx.putImageData(outData, 0, 0);
          break;
      }
      
      if (this._hasGradient) {
        var gradient = outCtx.createLinearGradient(width / 2, 0, width / 2, this._outputHeight);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        if (this._type == "mirror") {
          gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
          gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.3)");
        }
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        outCtx.fillStyle = gradient;
        outCtx.fillRect(0, 0, width, this._outputHeight);
      }
      
      if (result.dominantColor) {
        chrome("renderer").dominantColor = result.dominantColor;
        chrome("navigation").draw(); // TODO: should be called by event listener (no need to expose draw() anymore then)
      }
      
      callback.bind(this)();
    }
    this._worker.addEventListener("message", onVisualize.bind(this), false);
  }
  
  function Creator(canvas, rotation, cutHeight, outputHeight, hasGradient, definesDominantColor) {
    var border = this._border = Object.create(borderProto);
    switch (rotation) {
      case 90:
        border.right = border.top;
        border.top = border.left;
        border.left = border.bottom;
        border.bottom = borderProto.right;
        break;
    }
    this._canvas = {
      ctx: canvas.getContext("2d"),
      element: canvas
    };
    
    this._id = ++this._id;
    this._worker = new Worker("js/worker.js");
    this._worker.postMessage({
      action: "register",
      id: this._id,
      params: {
        cutHeight: cutHeight,
        definesDominantColor: definesDominantColor,
        rotation: rotation,
        type: this._type,
        useDominantColor: true
      }
    });
    
    this._cutHeight = cutHeight;
    this._hasGradient = hasGradient;
    this._outputHeight = outputHeight;
    this._rotation = rotation;
    
    nav.on("pageloadend", draw.bind(this));
  }
  Creator.prototype = {
    _border: null,
    _canvas: null,
    _id: 0,
    _image: null,
    _worker: null,
    
    _cutHeight: 0,
    _hasGradient: false,
    _outputHeight: 0,
    _rotation: 0,
    _type: "areas" // "areas" or "mirror"
  };
  
  return {
    create: function(canvas, rotation, cutHeight, outputHeight, hasGradient, definesDominantColor) {
      return new Creator(canvas, rotation, cutHeight, outputHeight, hasGradient, definesDominantColor);
    }
  };
}
