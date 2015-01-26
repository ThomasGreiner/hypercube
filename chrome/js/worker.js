/* 
 * Copyright 2012-2015 Thomas Greiner <https://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var configs = {};

onmessage = function(ev) {
  var data = ev.data;
  
  switch (data.action) {
    case "register":
      configs[data.id] = data.params;
      break;
    case "transform":
      var config = configs[data.id];
      
      var transform = transformNoop;
      switch (config.type) {
        case "areas":
          transform = transformAreas;
          break;
        case "mirror":
          transform = transformMirror;
          break;
      }
      
      var result = transform(config, data.params);
      postMessage(result);
      break;
  }
}

function comparePixels(px1, i1, px2, i2) {
  return (
    px1[i1] == px2[i2]
    && px1[i1 + 1] == px2[i2 + 1]
    && px1[i1 + 2] == px2[i2 + 2]
    && px1[i1 + 3] == px2[i2 + 3]
  );
}

function transformNoop(data) {
  return {
    data: data
  };
}

function transformMirror(config, params) {
  var cutHeight = config.cutHeight;
  var data = params.data;
  var dataLen = data.length;
  var width = params.width * 4;
  
  var outData = new Uint8ClampedArray(dataLen);
  
  for (var i = 0; i < dataLen; i += 4) {
    var line = cutHeight - ((i / width) >>> 0) - 1;
    var ii = (i % width) + (width * line);
    
    outData[ii] = data[i];
    outData[ii + 1] = data[i + 1];
    outData[ii + 2] = data[i + 2];
    outData[ii + 3] = data[i + 3];
  }
  
  return {
    data: outData
  };
}

function transformAreas(config, params) {
  var data = params.data;
  var definesDominantColor = config.definesDominantColor;
  var useDominantColor = config.useDominantColor;
  var width = params.width;
  var pixelComparisonDistance = (useDominantColor) ? 9 : 49;
  
  //determine areas
  var current = [data[0], data[1], data[2], data[3]];
  var areas = [0];
  var colors = useDominantColor ? [] : [current];
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
        colors.push(useDominantColor ? c : current);
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
  colors.push(useDominantColor ? c : current);
  
  var dominantColor = null;
  if (definesDominantColor) {
    //determine dominant color of website
    var max = 0;
    for (var i in dominantColors) {
      if (dominantColors[i] > max) {
        dominantColor = i.split(",");
        max = dominantColors[i];
      }
    }
    //convert strings to numbers
    dominantColor[0] = dominantColor[0] >> 0;
    dominantColor[1] = dominantColor[1] >> 0;
    dominantColor[2] = dominantColor[2] >> 0;
    dominantColor[3] = 1;
  }
  
  var outData = [];
  for (var i = 0; i < areas.length - 1; i++) {
    outData.push({
      color: colors.shift(),
      width: areas[i + 1] - areas[i],
      x: areas[i]
    });
  }
  
  return {
    data: outData,
    dominantColor: dominantColor
  };
}
