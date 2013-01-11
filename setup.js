// Ben Repay
// brepay@gmail.com
// BIT 2012

// Store the names of the initial images and chance in localStorage on install
chrome.runtime.onInstalled.addListener(function() {
  if (! localStorage.images) {
    localStorage.images = JSON.stringify(
      {"gandalf.png":       [191, 396, 0, 0, 1],
       "turret.png":        [133, 233, 0, 120, 1],
       "alf.png":           [151, 260, 0, 115, 1],
       "dont_blink.png":    [180, 420, 0, 20, 1],
       "boxing_corgi.gif":  [151, 200, 0, 145, 1],
       "creeper.png":       [115, 256, 20, 40, 1],
       "rubber_duck.png":   [151, 151, 20, 150, 1],
       "these_ARE_the_droids_you_are_looking_for.png": [240, 382, 0, 20, 1]});
    
    localStorage.chance = 100;
  }
});



// Listener to deliver localStorage data to content script
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.storage) {
    sendResponse({storage: localStorage[request.storage]});
  } else {
    sendResponse({});
  }
});