/* 
 * Copyright 2012 Thomas Greiner
 * thomas@greinr.com
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("/main.htm", {
    id: "main",
    type: "shell",
    frame: "none",
    left: 100,
    top: 75,
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 500,
    singleton: true
  }, function(winBeforeOnLoad) {
    //...
  });
});
