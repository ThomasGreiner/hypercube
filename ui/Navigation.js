/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
var Navigation = new (function() {
	var _COLOR = [0, 0, 50, 1];
	var _canvas;
	var _ctx;
	
	this.init = function(html) {
		_canvas = html.create("canvas");
		_canvas.width = 100;
		_canvas.height = 100;
		_ctx = _canvas.getContext("2d");
		
		drawTriangle();
		drawArrow();

		_canvas.addEventListener("click", function(e) {
			History.back();
		}, false);
		
		_canvas.addEventListener("mousemove", function(e) {
			clear();
			
			drawTriangle();
			
			//determine colors
			var rgb1 = [_COLOR[0], _COLOR[1], _COLOR[2], 0.1];
			var color = Renderer.dominantColor;
			if(color[0] != 255 && color[1] != 255 && color[2] != 255) {
				rgb1 = [color[0], color[1], color[2], 0.01];
			}
			var rgb2 = getNegativeColor(rgb1);
			
			var gradient = _ctx.createRadialGradient(e.offsetX, e.offsetY, 5, e.offsetX, e.offsetY, 50);
			gradient.addColorStop(0, "rgba("+rgb2.join(",")+")");
			gradient.addColorStop(0.99, "rgba("+rgb1.join(",")+")");
			gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
			drawTriangle(gradient);
			
			drawArrow();
		}, false);
		
		_canvas.addEventListener("mouseout", function() {
			Navigation.draw();
		}, false);
	}
	
	this.draw = function() {
		clear();
		drawTriangle();
		drawArrow();
	}
	
	function clear() {
		_ctx.clearRect(0, 0, 100, 100);
	}
	
	function drawTriangle(fillStyle) {
		if(!fillStyle) {
			//determine colors
			var rgb1 = _COLOR;
			var color = Renderer.dominantColor;
			if(color[0] != 255 && color[1] != 255 && color[2] != 255) {
				rgb1 = color;
			}
			var rgb2 = getNegativeColor(rgb1);
			
			var fillStyle = _ctx.createLinearGradient(0, 0, 0, 100);
			fillStyle.addColorStop(0.6, "rgba("+rgb1.join(",")+")");
			fillStyle.addColorStop(1, "rgba("+rgb2.join(",")+")");
		}
		_ctx.fillStyle = fillStyle;
		_ctx.beginPath();
		_ctx.moveTo(0, 100);
		_ctx.lineTo(100, 100);
		_ctx.lineTo(50, 50);
		_ctx.fill();
	}
	
	function getNegativeColor(color) {
		var diff = (Renderer.dominantColorBrightness < 128) ? -30 : +30;
		return [
			getValidColorCode(color[0]+diff),
			getValidColorCode(color[1]+diff),
			getValidColorCode(color[2]+diff),
			1
		];
	}
	
	function getValidColorCode(colorCode) {
		if(colorCode < 0) {
			colorCode = 0;
		}
		else if(colorCode > 255) {
			colorCode = 255;
		}
		return colorCode;
	}
	
	function drawArrow(fillStyle) {
		if(History.length < 2) return;

		var color = Renderer.dominantColor;
		if(color[0] == 255 && color[1] == 255 && color[2] == 255) {
			fillStyle = fillStyle || "#ffffff";
		}
		_ctx.fillStyle = fillStyle || (Renderer.dominantColorBrightness < 128) ? "#ffffff" : "#000000";
		_ctx.beginPath();
		_ctx.moveTo(43, 77);
		//top wing
		_ctx.lineTo(53, 77);
		_ctx.lineTo(55, 79);
		_ctx.lineTo(47, 79);
		//body
		_ctx.lineTo(53, 85);
		_ctx.lineTo(53, 87);
		_ctx.lineTo(51, 87);
		_ctx.lineTo(45, 81);
		//bottom wing
		_ctx.lineTo(45, 89);
		_ctx.lineTo(43, 87);
		_ctx.lineTo(43, 77);
		_ctx.fill();
	}
})();