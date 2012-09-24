//	Chris Metcalfe
//	9/23/2012
//
//	Barnsley Fern Fractal

function colorPixel(pixelArray, x, y, r, g, b, a){
	index = (x + y * pixelArray.width) * 4;	
	pixelArray.data[index + 0] = r;
	pixelArray.data[index + 1] = g;
	pixelArray.data[index + 2] = b;
	pixelArray.data[index + 3] = a;
}

$(document).ready(function() {

var points = 500000;

function sizeCanvas(){
	var canvas = document.getElementById("myCanvas");
	canvas.height = window.innerHeight - 8;
	canvas.width = window.innerWidth - 16;
}

sizeCanvas();

function setArray(){
	var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

	valuesArray = new Array();

	// Set a starting point and generate a random number between 0 and 100
	var last_x = 0;
	var last_y = 0;
	var x = 0;
	var y = 0;

	for(var i = 0; i < points; i++){
		r = Math.random() * 100;
  	if (r <= 1){
  		x = 0;  
  		y = 0.16 * last_y;
  	}
  	else if (r <= 8) {
  		x = 0.2 * last_x - 0.26 * last_y;
			y = 0.23 * last_x + 0.22 * last_y + 1.6
  	}
  	else if (r <= 15) {
  		x = -0.15 * last_x + 0.28 * last_y;
			y = 0.26 * last_x + 0.24 * last_y + 0.44
  	}
  	else {
  		x = 0.85 * last_x + 0.04 * last_y;
  		y = -0.04 * last_x + 0.85 * last_y + 1.6;
  	}

		// X and Y values transposed to turn the fern sideways.
		// This fits widescreen monitors more easily.
		valuesArray[i * 2] = x;
		valuesArray[i * 2 + 1] = y;
		
		last_x = x;
		last_y = y;
	}

	return valuesArray;
}

var valuesArray = setArray();

function draw(scale, translatePos){
	var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");


	// Create an array representing the pixels on the canvas.
	// To access a pixel: [(x + y * canvas width) * 4]
	// + 0 = r color value
	// + 1 = g color value
	// + 2 = b color value
	// + 3 = alpha value (opacity)
	pixelArray = context.createImageData(canvas.width, canvas.height);

	// Set a starting point and generate a random number between 0 and 100
	var last_x = 0;
	var last_y = 0;
	var x = 0;
	var y = 0;

	for(var i = 0; i < points; i++){
		x = valuesArray[i*2];
		y = valuesArray[i*2 + 1];
		var real_x = Math.floor(x * 100 * scale) + translatePos.x;
		var real_y  = Math.floor(y * 100 * scale) + translatePos.y;
		
		// Only draw a pixel if we can actually see it on the screen
		if(real_x > 0 && real_y > 0 && real_x < canvas.width && real_y < canvas.height){
				colorPixel(pixelArray, real_x, real_y, 0, 128, 0, 255);
		}
	}

	context.putImageData(pixelArray, 0, 0);
} //end draw()

var canvas = document.getElementById("myCanvas");

var translatePos = {
	x: 400,
	y: -900
};

var scale = 3;
var scaleMultiplier = 0.8;
var startDragOffset = {};
var mouseDown = false;

// add button event listeners
document.getElementById("plus").addEventListener("click", function(){
		scale /= scaleMultiplier;
		translatePos.x = Math.floor(translatePos.x * scaleMultiplier);
		translatePos.y = Math.floor(translatePos.y * scaleMultiplier);
		draw(scale, translatePos);
}, false);

document.getElementById("minus").addEventListener("click", function(){
		scale *= scaleMultiplier;
		translatePos.x = Math.floor(translatePos.x / scaleMultiplier);
		translatePos.y = Math.floor(translatePos.y / scaleMultiplier);

		draw(scale, translatePos);
}, false);

// add event listeners to handle screen drag
canvas.addEventListener("mousedown", function(evt){
		mouseDown = true;
		startDragOffset.x = evt.clientX - translatePos.x;
		startDragOffset.y = evt.clientY - translatePos.y;
});

canvas.addEventListener("mouseup", function(evt){
		mouseDown = false;
});

canvas.addEventListener("mouseover", function(evt){
		mouseDown = false;
});

canvas.addEventListener("mouseout", function(evt){
		mouseDown = false;
});

canvas.addEventListener("mousemove", function(evt){
		if (mouseDown) {
				translatePos.x = evt.clientX - startDragOffset.x;
				translatePos.y = evt.clientY - startDragOffset.y;
				draw(scale, translatePos);
		}
});

draw(scale, translatePos);
});
