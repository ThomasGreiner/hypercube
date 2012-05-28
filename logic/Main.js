/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
var Main = new (function() {
	this.init = function() {
		//initialize DAL components
		Database.init();
		
		//initialize UI components
		Header.init(GET("header_bg"));
		Addressbar.init(GET("nav"));
		Navigation.init(GET("nav"));
		Toolbar.init(GET("toolbar"));
		Tabbar.init(GET("tabs_list"), GET("tabs_bg"));
		//Taskbar.init(GET("tasks"));
		Renderer.init(GET("iframe"));
		Visualizer.init(GET("visualizer"));
		History.init();
		
		Addressbar.input.addEventListener("locationchange", function() {
			Main.setProgress(100);
		}, false);
		
		Addressbar.input.addEventListener("pageloadend", function() {
			Header.draw();
			Tabbar.draw();
			//Taskbar.draw();
			Main.setProgress(0);
		}, false);

		/*
		//failed attempt to get rid of X-FRAME-OPTIONS HTTP header
		chrome.webRequest.onHeadersReceived.addListener(function(details) {
				for(var i=0, len=details.responseHeaders.length; i<len; i++) {
					var header = details.responseHeaders[i];
					if(!header) continue;

					if(header.name.search(/x\-frame\-options/i) > -1) {
						details.responseHeaders.splice(i, 1);
					}
				}
				return {responseHeaders: details.responseHeaders};
			},
			{urls: ["<all_urls>"]},
			["responseHeaders"]
		);
		*/
		
		//Visualizer.show();
	}
	
	this.setProgress = function(val) {
		GET("loadprogress").value = val;
	}
})();