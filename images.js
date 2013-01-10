// Hide the existing image
var img = document.getElementById('imgRotator').getElementsByTagName('img')[0];
img.style.visibility = "hidden";

// Get chance of alternate images showing up
chrome.extension.sendRequest({storage: 'chance'}, function(response) {
  var chance = JSON.parse(response.storage);
  var random = Math.floor((Math.random()*100)+1);
  
  if (random <= chance) {
    // Request list of images
    chrome.extension.sendRequest({storage: 'images'}, function(response) {
      var images = JSON.parse(response.storage);
      var imageList = [], imgSrc, imgTag, random;
      
      for(var image in images) {
        imageList.push(image);  
      }
    
      if (imageList.length > 0) {        
        // Get reference to image on page and pick a random number
        imgTag = document.getElementById('imgRotator').getElementsByTagName('img')[0];
        random = Math.floor((Math.random() * imageList.length));
      
        // Use local file or external image
        if (images[imageList[random]][4] == 1) {
          imgSrc = chrome.extension.getURL("images/" + imageList[random]);
        } else {
          imgSrc = imageList[random];
        }
      
        imgTag.removeAttribute("width");
        imgTag.removeAttribute("height");
        imgTag.style.paddingLeft = images[imageList[random]][2] + "px";
        imgTag.style.paddingTop = images[imageList[random]][3] + "px";
      
        imgTag.src = imgSrc;
      
        // Set image visible after loading - prevents original image from
        // displaying before an externally loaded image appears
        imgTag.onload = function() { imgTag.style.visibility = "visible";}
      }
    });
  } else {
    img.style.visibility = "visible";
  }
});