/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

/*
BackgroundCreator
- HTMLCanvasElement _canvas
- CanvasRenderingContext2D _ctx
- Number _iWidth
- Number _iHeight
- Number _BORDER_TOP
- Number _borderTop
- Number _BORDER_LEFT
- Number _borderLeft
- Number _BORDER_RIGHT
- Number _borderRight
- Number _BORDER_BOTTOM
- Number _borderBottom
+ BackgroundCreator(Number _ROTATION, Number _CUT_HEIGHT, Number _OUTPUT_HEIGHT, Number _HAS_GRADIENT)
+ void init(HTMLElement html)
+ void draw()
- void visualizeMirror(ImageData data, Number width, CanvasRenderingContext2D outCtx)
- void visualizeAreas(ImageData data, Number width, CanvasRenderingContext2D outCtx)
- void boolean comparePixels(Array<Number> px1, Number i1, Array<Number> px2, Number i2)
*/
var BackgroundCreator = (function(_ROTATION, _CUT_HEIGHT, _OUTPUT_HEIGHT, _HAS_GRADIENT, _DEFINES_DOMINANT_COLOR) {
  var _canvas;
  var _ctx;
  var _iWidth, _iHeight;
  var _BORDER_TOP = _borderTop = 57;
  var _BORDER_LEFT = _borderLeft = 11;
  var _BORDER_RIGHT = _borderRight = 11;
  var _BORDER_BOTTOM = _borderBottom = 11;

  this.init = function(html) {
    _canvas = html;
    _ctx = _canvas.getContext("2d");
  }
  
  this.draw = function() {
    // TODO: find alternative
    return;
    
    chrome.tabs.captureVisibleTab(null, {format:"png"}, function(dataUrl) {
      _ctx.clearRect(0, 0, _iWidth, _iHeight);
      
      //rotate image -> normalize
      var image = new Image();
      image.src = dataUrl;
      image.addEventListener("load", function() {
        var _iWidth = image.width;
        var _iHeight = image.height;
        var x = 0;
        var y = 0;
        switch(_ROTATION){
          case 90:
            _iWidth = image.height;
            _iHeight = image.width;
            y = image.height * (-1);
            _BORDER_LEFT = _borderTop;
            _BORDER_TOP = -_borderRight;
            _BORDER_RIGHT = _borderBottom;
            _BORDER_BOTTOM = _borderLeft;
            break;
          case 180:
            x = image.width * (-1);
            y = image.height * (-1);
            break;
          case 270:
            _iWidth = image.height;
            _iHeight = image.width;
            x = image.width * (-1);
            break;
        }
        var width = _iWidth-_BORDER_LEFT-_BORDER_RIGHT;
        var height = _CUT_HEIGHT;

        var cVis = document.createElement("canvas");
        cVis.width = width;
        cVis.height = _OUTPUT_HEIGHT;
        var ctxVis = cVis.getContext("2d");

        var cNorm = document.createElement("canvas");
        cNorm.width = width;
        cNorm.height = height;
        var ctxNorm = cNorm.getContext("2d");
        ctxNorm.rotate(_ROTATION*Math.PI/180);
        if(_ROTATION%180) ctxNorm.drawImage(image, x-_BORDER_LEFT, y-_BORDER_TOP);
        else ctxNorm.drawImage(image, x-_BORDER_LEFT, y-_BORDER_TOP, _iWidth, _iHeight-_BORDER_TOP);

        var iData = ctxNorm.getImageData(0, 0, width, height);
        var data = iData.data;
        //visualizeMirror(data, width, ctxVis);
        visualizeAreas(data, width, ctxVis);

        /*
        document.body.innerText = "";
        document.body.appendChild(cVis);
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(cNorm);
        document.body.appendChild(document.createElement("br"));
        */

        //rotate image -> denormalize
        x = 0;
        y = 0;
        switch(360-_ROTATION){
          case 90:
            y = cVis.height * (-1);
            break;
          case 180:
            x = cVis.width * (-1);
            y = cVis.height * (-1);
            break;
          case 270:
            x = cVis.width * (-1);
            break;
        }
        _canvas.width = (_ROTATION%180) ? _OUTPUT_HEIGHT : width;
        _canvas.height = (_ROTATION%180) ? width : _OUTPUT_HEIGHT;
        _ctx.rotate((360-_ROTATION)*Math.PI/180);
        _ctx.drawImage(cVis, x, y);

        //document.body.appendChild(_canvas);
      });

      /*
      var image = new Image();
      image.src = dataUrl;
      image.addEventListener("load", function() {
        _iWidth = image.width;
        _iHeight = image.height;
        var width = _iWidth-_BORDER_LEFT-_BORDER_RIGHT;
        var height = _CUT_HEIGHT;
        
        _canvas.width = _iWidth-_BORDER_LEFT-_BORDER_RIGHT;
        _canvas.height = _OUTPUT_HEIGHT;
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, -_BORDER_LEFT, -_BORDER_TOP, _iWidth, _iHeight-_BORDER_TOP);
        
        var iData = ctx.getImageData(0, 0, width, height);
        var data = iData.data;
        //visualizeMirror(data, width);
        visualizeAreas(data, width, _ctx);
        
        //document.body.appendChild(canvas);
      });
      //document.body.appendChild(image);
      */
    });
  }
  
  function visualizeMirror(data, width, outCtx) {
    outCtx.fillStyle = "white";
    outCtx.fillRect(0, 0, width, _OUTPUT_HEIGHT);
    var outData = outCtx.getImageData(0, 0, width, _OUTPUT_HEIGHT);
    var oData = outData.data;
    
    for(var i=0; i<data.length; i+=4) {
      var line = _CUT_HEIGHT-((i/(width*4))>>>0)-1;
      var ii = (i%(width*4))+(width*4*line);
      
      oData[ii] = data[i];
      oData[ii+1] = data[i+1];
      oData[ii+2] = data[i+2];
    }
    outCtx.putImageData(outData, 0, 0);
    
    if(_HAS_GRADIENT) {
      var gradient = outCtx.createLinearGradient(width/2, 0, width/2, _OUTPUT_HEIGHT);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      outCtx.fillStyle = gradient;
      outCtx.fillRect(0, 0, width, _OUTPUT_HEIGHT);
    }
  }
  
  function visualizeAreas(data, width, outCtx) {
    var USE_DOMINANT_COLOR = true;
    var PIXEL_COMPARISON_DISTANCE = (USE_DOMINANT_COLOR) ? 9 : 49;
    
    //determine areas
    var current = [data[0], data[1], data[2], data[3]];
    var areas = [0];
    var colors = (USE_DOMINANT_COLOR) ? [] : [current];
    var colorIndex = {};
    var dominantColors = {};
    for(var i=0; i<width*4; i+=4) {
      var isPixelEqual = true;
      for(var j=1; j<PIXEL_COMPARISON_DISTANCE; j++) {
        isPixelEqual = isPixelEqual && comparePixels(data, i, data, i+width*4*j)
      }
      if(isPixelEqual) { //comparePixels(data, i, data, i+width*4*PIXEL_COMPARISON_DISTANCE)
        if(!comparePixels(data, i, current, 0)) {
          //end of area
          current = [data[i], data[i+1], data[i+2], data[i+3]];
          areas.push(i/4);
          
          //determine dominant color of previous area
          var max = 0;
          var c;
          for(var j in colorIndex) {
            if(colorIndex[j] > max) {
              c = j.split();
              max = colorIndex[j];
            }
          }
          dominantColors[c] = max;
          colorIndex = {};
          colors.push((USE_DOMINANT_COLOR) ? c : current);
        }
      }
      
      for(var j=0; j<5; j++) {
        var c = [data[i+width*4*j], data[i+1+width*4*j], data[i+2+width*4*j], data[i+3+width*4*j]];
        if(!colorIndex[c.join()]) {
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
    for(var j in colorIndex) {
      if(colorIndex[j] > max) {
        c = j.split();
        max = colorIndex[j];
      }
    }
    dominantColors[c] = max;
    colorIndex = {};
    colors.push((USE_DOMINANT_COLOR) ? c : current);
    //colors.push([data[width*4-4], data[width*4-3], data[width*4-2], data[width*4-1]]);
    
    if(_DEFINES_DOMINANT_COLOR) {
      //determine dominant color of website
      var max = 0;
      var c;
      for(var i in dominantColors) {
        if(dominantColors[i] > max) {
          c = i.split(",");
          max = dominantColors[i];//colorIndex[i];
        }
      }
      //convert strings to numbers
      c[0] = c[0]*1;
      c[1] = c[1]*1;
      c[2] = c[2]*1;
      c[3] = 1;
      Renderer.dominantColor = c;
      Navigation.draw(); // TODO: should be called by event listener
    }
    
    //fill areas
    for(var i=0; i<areas.length-1; i++) {
      outCtx.fillStyle = "rgba("+colors.shift()+")";
      outCtx.fillRect(areas[i], 0, areas[i+1]-areas[i], _OUTPUT_HEIGHT);
    }
    
    //create gradients between areas
    /*
    1) determine area colors
    2) 10% of left area is gradient with color of right area
    3) 10% of right area is gradient with color of left area
    */
    //...
    
    if(_HAS_GRADIENT) {
      var gradient = outCtx.createLinearGradient(width/2, 0, width/2, _OUTPUT_HEIGHT);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      outCtx.fillStyle = gradient;
      outCtx.fillRect(0, 0, width, _OUTPUT_HEIGHT);
    }
  }

  function comparePixels(px1, i1, px2, i2) {
    return (
      px1[i1] == px2[i2]
      && px1[i1+1] == px2[i2+1]
      && px1[i1+2] == px2[i2+2]
      && px1[i1+3] == px2[i2+3]
    );
  }
});
