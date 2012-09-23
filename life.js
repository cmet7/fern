      $(document).ready(function() {
				// Get the canvas and 2d context
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

				// Set some defaults
				var running = true;
				var interval = 250;
				var interval_id;
				var initial_fill = 0.25;
				var generationCount = 0;

				// Are we trying to draw on canvas?
				var drawing = false;
				var erasing = false;

				// Set the y-dimension to 40 cells, then use
				// the window width to calculate number of x-cells
				// The goal here is to end up with square cells.
				var cells_y = 80;
				canvas.width = window.innerWidth - 8;
        canvas.height = window.innerHeight - 8;
				var cell_height = parseInt($(canvas).height() / cells_y);
				var cell_width = cell_height;
				var cells_x = parseInt($(canvas).width() / cell_width);

				// Setup 2d array and fill according to the fill
				// we set above.
				boardGrid = fillGrid();

				// Draw the initial grid
				drawGrid(boardGrid.slice());

				// Start the timer to triger the game of life
				interval_id = setInterval(function(){ run() }, interval);

				// Bind the slider
				$("#slider").slider({
					min: 0,
					max: 1450,
					value: 1250,
					change: function(event, ui){
						clearInterval(interval_id);
						interval = 1500 - ui.value;
						if(running){
							interval_id = setInterval(function(){ run() }, interval);
						}
					}
				});

				// Bind the buttons
				$("button").button();
				$("#fillButton").click(function(event){
					generationCount = 0;
					boardGrid = fillGrid();
					drawGrid(boardGrid.slice());
				});
				$("#clearButton").click(function(event){
					boardGrid = emptyGrid();
					generationCount = 0;
					drawGrid(boardGrid.slice());
					clearInterval(interval_id);
					running = false;
					$("#pauseButton").text("Run");
				});
				$("#pauseButton").click(function(event){ 
					if(running){
						clearInterval(interval_id);
						$(this).text("Run");
					}
					else {
						interval_id = setInterval(function(){ run() }, interval);
						$(this).text("Pause");
					}
					running = !running;
				});
				$("#nextButton").click(function(event){ runOnce(); });

				// Make the controls more visible when hovered
				$("#controls").hover(
					// Hover In
					function(event){
						$(this).addClass("hover");
					},
					// Hover Out
					function(event){
						$(this).removeClass("hover");
					}
				);

				// Make the controls draggable
				$("#controls").draggable({ containment: "window" });

				// Bind the click and drag drawing
				$(document).bind("contextmenu", function(e){ return false; });
				$("#canvas").mousedown(function(event){
					if(event.which == 1){drawing = true;}
					else if(event.which == 3){erasing = true;}
				});
				$("#canvas").mouseout(function(event){drawing = false; erasing = false;});
				$("#canvas").mouseup(function(event){drawing = false; erasing = false;});
			  $("#canvas").mousemove(function(e){
					var mouse_x = e.pageX - this.offsetLeft;
					var mouse_y = e.pageY - this.offsetTop;
					var cell_x = parseInt(mouse_x / cell_width);
					var cell_y = parseInt(mouse_y / cell_height);
			    $('#mouse').html(cell_x +', '+ cell_y);
					if(drawing && boardGrid[cell_x][cell_y] == 0){
						boardGrid[cell_x][cell_y] = 1;
						drawCell(cell_x,cell_y,boardGrid[cell_x][cell_y]);
					}
					else if (erasing && boardGrid[cell_x][cell_y] > 0){
						boardGrid[cell_x][cell_y] = 0;
						clearCell(cell_x,cell_y);
					}
			  }); 

			  $("#canvas").bind("click", function(e){
					var mouse_x = e.pageX - this.offsetLeft;
					var mouse_y = e.pageY - this.offsetTop;
					var cell_x = parseInt(mouse_x / cell_width);
					var cell_y = parseInt(mouse_y / cell_height);
					if(boardGrid[cell_x][cell_y] == 0){
						boardGrid[cell_x][cell_y] = 1;
						drawCell(cell_x,cell_y,boardGrid[cell_x][cell_y]);
					}
					else if(boardGrid[cell_x][cell_y] != 0){
						boardGrid[cell_x][cell_y] = 0;
						clearCell(cell_x,cell_y);
					}
			  }); 			

				function run(){
					if(running){
  					boardGrid = nextGeneration(boardGrid.slice());
	  				drawGrid(boardGrid.slice());
					}
				}

				function runOnce(){
					boardGrid = nextGeneration(boardGrid.slice());
  				drawGrid(boardGrid.slice());
				}

				function fillGrid(){
  				var boardGrid = new Array(cells_x);
    			for(var i = 0; i < cells_x; i++){
  					boardGrid[i] = new Array(cells_y);
    				for(var j = 0; j < cells_y; j++){
  						if(Math.random() > (1 - initial_fill)){
  							boardGrid[i][j] = 1;
  						}
  						else {
  							boardGrid[i][j] = 0;
  						}
  					}
  				}
	  			return boardGrid.slice();
				}

				function emptyGrid(){
	 				var boardGrid = new Array(cells_x);
    			for(var i = 0; i < cells_x; i++){
  					boardGrid[i] = new Array(cells_y);
    				for(var j = 0; j < cells_y; j++){
  						boardGrid[i][j] = 0;
  					}
  				}
	  			return boardGrid.slice();				
				}

				// Calculate the next generation and return
				// 2d array.
				function nextGeneration(boardGrid){
				  var newGrid = new Array(cells_x);
    			for(var i = 0; i < cells_x; i++){
  					newGrid[i] = new Array(cells_y);
    				for(var j = 0; j < cells_y; j++){
  						if(stayAlive(i,j, boardGrid)){
								newGrid[i][j] = boardGrid[i][j] + 1;	
							}
							else {
								newGrid[i][j] = 0;
							}
  					}
  				}
					generationCount++;
					$("#generationCount").text(generationCount);
					return newGrid.slice();
				}

				// Check a cell's neighbors to see if it should stay
				// alive. Fewer than two living neighbors and a cell
				// dies from lonliness, more than three and it dies
				// of overcrowding. A dead cell with exactly three
				// neighbors is revived.
				function stayAlive(x, y){
					var neighbors = 0;
					
					if(x > 0 && y > 0 &&boardGrid[x-1][y-1] > 0) {
						neighbors++;
					}
					if(y > 0 &&boardGrid[x][y-1] > 0) {
						neighbors++;
					}
					if(x < cells_x - 1 && y > 0 && boardGrid[x+1][y-1] > 0) {
						neighbors++;
					}
					if(x > 0 && boardGrid[x-1][y] > 0) {
						neighbors++;
					}
					if(x < cells_x - 1 && boardGrid[x+1][y] > 0) {
						neighbors++;
					}
					if(x > 0 && y < cells_y - 1 && boardGrid[x-1][y+1] > 0) {
						neighbors++;
					}
					if(y < cells_y - 1 && boardGrid[x][y+1] > 0) {
						neighbors++;
					}
					if(x < cells_x - 1 && y < cells_y - 1 && boardGrid[x+1][y+1] > 0) {
						neighbors++;
					}
  				if ((boardGrid[x][y] > 0 && (neighbors == 2 || neighbors == 3)) || (boardGrid[x][y] == 0 && neighbors == 3)){
						return true;
					}
					return false;
				}

				// Draw the grid. Fairly self-explanatory.
				function drawGrid(boardGrid){
					$("#generationCount").text(generationCount);
    			for(var i = 0; i < cells_x; i++){
    				for(var j = 0; j < cells_y; j++){
  					  if (boardGrid[i][j] > 0){
								drawCell(i,j,boardGrid[i][j]);
  						}
	  					else if(boardGrid[i][j] == 0){
								clearCell(i,j);
  						}						
    				}
    			}
				}

				// Draw a given cell, also self-explanatory.
				// First generation cells are grey, if they
				// live for a second generation they're blue.
				// Third is green and fourth is red.
				function drawCell(x, y, count) {
					var color;
					if(count == 1){
	 					color = "rgba(128,128,128,1)";
					}
					else if (count == 2){
	 					color = "blue";
					}
					else if (count == 3){
	 					color = "green";
					}
					else {
	 					color = "red";
					}
					context.beginPath();
					context.fillStyle = color;
					context.strokeStyle = color;
					context.lineWidth   = 2;
 					context.strokeRect(x * cell_width + 1, y * cell_height + 1, cell_width - 2, cell_height - 2);
 				  context.fillRect(x * cell_width + 2, y * cell_height + 2 , cell_width - 6, cell_height - 6);
				}

				// Used to clear the canvas when a cell dies
				function clearCell(x, y) {
 					context.clearRect(x * cell_width, y * cell_height, cell_width, cell_height, false);
				}
      });
