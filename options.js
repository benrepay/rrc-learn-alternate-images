var MAX_WIDTH = 300;
var MAX_HEIGHT = 520;


$(document).ready(function() {
  restoreOptions();
  
  $("#add_button").click(function() {
    addClicked();
  });
  
  $("#chance").change(function() {
    $("#chance_label").val($(this).val() + "%");
  });
  
  $("#save_chance").click(function() {
    localStorage["chance"] = $("#chance").val();
        
    $(this).find(".saved").fadeIn(400).fadeOut(800);
  });
});


// Load all of the current options onto the page
function restoreOptions() {
  var images = JSON.parse(localStorage["images"]);
  var chance = localStorage["chance"];
  
  $("#chance").val(chance);
  $("#chance_label").val(chance + "%");
  
  for (var image in images) {
    $('#images').append(generateImage(image));
  }  
}


// Returns a jQuery object to append to the DOM
//  imageName:  image name / localStorage key
function generateImage(imageName) {
  var $mainDiv, img, xRange, yRange;

  // Get the currently saved x + y offsets of the image,
  // and calculate the max x + y offsets for the range input
  var imageData = JSON.parse(localStorage["images"])[imageName];
  var xMax = MAX_WIDTH - imageData[0];
  var yMax = MAX_HEIGHT - imageData[1];
  var xCurrent = imageData[2];
  var yCurrent = imageData[3];
  
  // Clone model and get references to items
  $mainDiv = $("#model > .image").clone();
  xRange = $mainDiv.find("input")[0]; 
  yRange = $mainDiv.find("input")[1]; 
  img    = $mainDiv.find("img")[0]; 
  
  // Set image source to local or external URL
  if (imageData[4] == 0) { $(img).attr("src", imageName); }
  else { $(img).attr("src", chrome.extension.getURL("images/" + imageName)); }

  // Modify attributes and styles  
  $(img).css("padding-left", xCurrent + "px");
  $(img).css("padding-top",  yCurrent + "px");
  xRange.setAttribute("value", xCurrent); 
  yRange.setAttribute("value", yCurrent);  
  xRange.max = xMax; 
  yRange.max = yMax; 

  if (imageData[0] >= MAX_WIDTH)  { $(xRange).attr("disabled",""); }
  if (imageData[1] >= MAX_HEIGHT) { $(yRange).attr("disabled",""); }
  
  // Handle control events
  $($mainDiv.find(".save")).click(function() { saveClicked(imageName, $mainDiv); });
  $($mainDiv.find(".remove")).click(function() { removeClicked(imageName, $mainDiv); });
  $(xRange).change(function(e) { rangeChanged(e, "x", img); });
  $(yRange).change(function(e) { rangeChanged(e, "y", img); });

  return $mainDiv;
}


// Saves the image offsets to localStorage
function saveClicked(imageName, $mainDiv) {
  var images = JSON.parse(localStorage['images']);
  
  images[imageName][2] = $mainDiv.find(".x input").val();
  images[imageName][3] = $mainDiv.find(".y input").val();
  
  localStorage['images'] = JSON.stringify(images);
  
  $mainDiv.find(".saved").fadeIn(400).fadeOut(800);
}


// Removes the image from localStorage and screen
function removeClicked(imageName, $mainDiv) {
  $($mainDiv).fadeOut();
 
  var images = JSON.parse(localStorage["images"]);
  delete images[imageName];
  localStorage["images"] = JSON.stringify(images);
}


// Change the thumbnail padding
function rangeChanged(e, pos, img) {
  if (pos == "x") { $(img).css("padding-left", e.target.value + "px"); }
  else {            $(img).css("padding-top", e.target.value + "px");  }
}


// Add an image to localStorage and display on the screen, or display errors
function addClicked() {
  var url = document.getElementById("url").value;
  var img = new Image();

  // Loads properly - is an image
  img.onload = function() {
    var images = JSON.parse(localStorage["images"]);

    // New image, else give error
    if (typeof(images[this.src]) == "undefined") {
      images[this.src] = [this.width, this.height, 0, 0, 0];
      
      localStorage["images"] = JSON.stringify(images);

      $('#images').append(generateImage(this.src).hide().fadeIn());
      $("#add_button .saved").fadeIn(400).fadeOut(800);
      $("#url").val("");
    } else {
      $("#add_button .error span").text("Image already added.");
      $("#add_button .error").fadeIn(600).fadeOut(1000);
    }
  }
  
  // Error on load - not image, or some other problem
  img.onerror = function(){
    $("#add_button .error span").text("Not a valid image URL.");
    $("#add_button .error").fadeIn(600).fadeOut(1000);
  }
  
  img.src = url;
}