document.addEventListener("DOMContentLoaded", function() {
  var images = location.search.substr(1).split("&");
  document.getElementById("image-norm").src = images[0];
  document.getElementById("image-vis").src = images[1];
}, false);
