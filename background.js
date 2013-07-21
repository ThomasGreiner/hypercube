chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("main.htm", {
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
