document.addEventListener("DOMContentLoaded", function() {
  var images = location.search.substr(1).split("&");
  images.forEach(function(image) {
    var img = document.createElement("img");
    img.src = image;
    document.body.appendChild(img);
  });
}, false);
