/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
//TEST
var elements = {
	"a": {
		type:	"extension",
		data: {
			image:	"DEMO/favicon.ico"
		}
	},
	"b": {
		type:	"extension",
		data: {
			image:	"DEMO/favicon_options.ico"
		}
	},
	"c": {
		type:	"extension",
		data: {
			image:	"DEMO/favicon_stored.ico"
		}
	}
}

var Toolbar = new (function() {
	this.init = function(html) {
		for(var i in elements) {
			var btn = new ToolbarButton(html, elements[i].type, elements[i].data);
			//...
		}
	}
})();