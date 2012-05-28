/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
var Header = new (function() {
	var _bg = new BackgroundCreator(0, 46, 46 /*46*/, true, true);

	this.init = function(html) {
		_bg.init(html);
	}
	
	this.draw = _bg.draw;
})();