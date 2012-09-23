      $(document).ready(function() {


				// Get the canvas and 2d context
        var canvas = document.getElementById('canvas');
        var c = canvas.getContext('2d');

				// Set the canvas width to match the size of the window
				canvas.width = 10000; //window.innerWidth * .98 ;
				canvas.height = 10000; // window.innerHeight * .98;

				// Create an array representing the pixels on the canvas.
				// To access a pixel: [(x + y * canvas width) * 4]
				// + 0 = r color value
				// + 1 = g color value
				// + 2 = b color value
				// + 3 = alpha value (opacity)
				pixelArray = c.createImageData(canvas.width, canvas.height);


				function colorPixel(pixelArray, x, y, r, g, b, a){
					index = (x + y * pixelArray.width) * 4;	
					pixelArray.data[index + 0] = r;
					pixelArray.data[index + 1] = g;
					pixelArray.data[index + 2] = b;
					pixelArray.data[index + 3] = a;
				}


				// Set a starting point and generate a random number between 0 and 100
				var last_x = 0;
				var last_y = 0;
				var x = 0;
				var y = 0;

				for(var i = 0; i < 10000000; i++){

					r = Math.random() * 100;
  				if (r <= 1){
  					x = 0;  
  					y = 0.16 * last_y;
  				}
  				else if (r <= 7) {
  					x = 0.2 * last_x - 0.26 * last_y;
						y = 0.23 * last_x + 0.22 * last_y + 1.6
  				}
  				else if (r <= 14) {
  					x = -0.15 * last_x + 0.28 * last_y;
						y = 0.26 * last_x + 0.24 * last_y + 0.44
  				}
  				else {
  					x = 0.85 * last_x + 0.04 * last_y;
  					y = -0.04 * last_x + 0.85 * last_y + 1.6;
  				}
					//console.log(x + " " + y);
					colorPixel(pixelArray, Math.floor(x * 1000 + canvas.width / 2), Math.floor(y * 1000), 0, 0, 0, 255);
					last_x = x;
					last_y = y;

				}

				c.putImageData(pixelArray, 0, 0);

      });
