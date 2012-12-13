var files = ["alf.png", "turret.png", "rubber_duck.png", "creeper.png", 
						 "astronaut.png", "troll.png", "grumpy_cat.png", "boxing_corgi.gif"];
var image = document.getElementById('imgRotator').getElementsByTagName('img')[0];
var random_number = Math.floor((Math.random() * files.length));

image.src = chrome.extension.getURL("images/" + files[random_number]);