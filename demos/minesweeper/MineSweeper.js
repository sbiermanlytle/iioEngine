/* Mine Sweeper
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

MineSweeper = function( app, settings ){

	// Game Properties
	// -------------------------------------------------------

	// initialize settings
	settings = settings || {};

	// initialize game color
	var game_color = settings.color || iio.Color.random();

	// define number of rows/columns
	var res = 15;

	// define number of bombs 
	var num_bombs = 30;

	// if preview is active,
	// limit the number of columns and bombs
	if( settings.preview ) {
		res = 6;
		num_bombs = 7;
	}

	// if preview is not active,
	// set background to the inverse color
	if( !settings.preview )
		app.set({ color: game_color.clone().invert() });


	// Game Functions
	// -------------------------------------------------------

	// create new cell cover
	function cellCover(){
		return new iio.Rectangle({
			width: grid.cells[0][0].height/1.2,
			color: game_color
		});
	}

	// create new cell text
	function cellText( string, color ){
		return new iio.Text({
			font: 'sans-serif',
			// reduce text size if preview is active
			size: ( settings.preview ) ? 12 : 20,
			text: string,
			color: color
		});
	}

	// if a bomb is at the given location
	// increase the number of bombs
	// (used to count bombs around each cell)
	function checkForBomb(c,r){
		if( c >= 0 && c < grid.C 
		 && r >= 0 && r < grid.R 
		 && grid.cells[c][r].BOMB)
			bombs_placed++;
	}

	// if the given coordinates correspond to a cell
	// on the grid that is still covered and has no
	// surrounding bombs, return true
	// otherwise return false
	function checkforZero(c,r){
		if( c >= 0 && c < grid.C && r >= 0 && r < grid.R 
			&& grid.cells[c][r].objs.length > 1 
			&& grid.cells[c][r].objs[0].text == '0' )
			return true;
		return false;
	}

	// if the given coordinates correspond to a cell
	// on the grid that is still covered,
	// remove the cover and suppress the redraw
	function unhide(c,r){
		if( c >= 0 && c < grid.C && r >= 0 && r < grid.R 
			&& grid.cells[c][r].objs.length > 1 )
			grid.cells[c][r].rmv( 1, true );
	}

	// for the cell at the given coordinates,
	// remove its cover and the covers of all neighbors,
	// recursively clear all neighboring 0 cells
	function clearZeros(c,r){

		// remove the cell cover
		grid.cells[c][r].rmv( 1, true );

		// call clearZeros on any neighboring cell
		// with a bomb count of 0
		// remove the cell cover of all neighbors 
		if(checkforZero(c-1,r-1)) clearZeros(c-1,r-1);
		else unhide(c-1,r-1);
		if(checkforZero(c-1,r)) clearZeros(c-1,r);
		else unhide(c-1,r);
		if(checkforZero(c-1,r+1)) clearZeros(c-1,r+1);
		else unhide(c-1,r+1);
		if(checkforZero(c,r-1)) clearZeros(c,r-1);
		else unhide(c,r-1);
		if(checkforZero(c,r+1)) clearZeros(c,r+1);
		else unhide(c,r+1);
		if(checkforZero(c+1,r-1)) clearZeros(c+1,r-1);
		else unhide(c+1,r-1);
		if(checkforZero(c+1,r)) clearZeros(c+1,r);
		else unhide(c+1,r);
		if(checkforZero(c+1,r+1)) clearZeros(c+1,r+1);
		else unhide(c+1,r+1); 
	}

	// create an explosion of square particles
	// originating at the given coordinates
	function explosion( x, y ){
		for(var i=0; i<100; i++)
			app.add( new iio.Rectangle({
				pos: [x,y],
				color: game_color,
				width: 5,
				vel: [
					iio.random(-8,8),
					iio.random(-8,8)
				],
				// set random rotational velocity
				rVel: iio.random(-.01,.01),
				// bound particles so they are
				// removed when they travel off screen
				bounds: {
					top: 0,
					bottom: app.height,
					right: app.width,
					left: 0,
				}
			// pass true to suppress app redraw
			}), true)
	}

	
	// Game Initialization
	// -------------------------------------------------------

	// disable the context menu on right clicks
	app.canvas.oncontextmenu = function(){ return false };

	// create the game grid
	var grid = app.add( new iio.Grid({
		pos: app.center,
		color: game_color,
		// reduce grid line width if preview is active
		lineWidth: ( settings.preview ) ? 1 : 4,
		// make the grid as big as the smaller screen dimension
		width: ( app.height < app.width ) ? app.height : app.width,
		R: res,
		C: res
		// pass true to suppress app redraw
	}), true );

	// place bombs
	var bombs = [];
	var bombs_placed = 0;
	var c,r;
	while( bombs_placed < num_bombs ){

		//get random coordinate
		c = iio.randomInt( 0, grid.C );
		r = iio.randomInt( 0, grid.R );

		//if no bomb is present, place a bomb
		if( !grid.cells[c][r].BOMB ){

			// indicate that a bomb is in the cell
			grid.cells[c][r].BOMB = true;

			// if preview is not active
			// set bomb text "!"
			if( !settings.preview ) 
				grid.cells[c][r].add( 
					cellText( "!", 'red' ), true);

			// add bomb cover
			grid.cells[c][r].add( cellCover(), true);

			bombs_placed++;
		}
	}

	// add numbers and covers to non-bomb cells
	for( c=0; c<grid.C; c++ )
		for( r=0; r<grid.R; r++ )
			if( !grid.cells[c][r].BOMB ){

				// initialize var to count neighboring bombs
				bombs_placed = 0;

				// check neighbors for bombs
				checkForBomb(c-1,r-1);
				checkForBomb(c-1,r);
				checkForBomb(c-1,r+1);
				checkForBomb(c,r-1);
				checkForBomb(c,r+1);
				checkForBomb(c+1,r-1);
				checkForBomb(c+1,r);
				checkForBomb(c+1,r+1);
				
				// add neighboring bomb count text
				grid.cells[c][r].add( 
					cellText( bombs_placed, game_color ), true);

				// add cell cover
				grid.cells[c][r].add( cellCover(), true);
			}

	// redraw
	app.draw();

	// define a function to be called when the grid is clicked
	grid.onClick = function( event, pos, cell){

		// handle right clicks
		if( event.button == 2 ) {

			// prevent the context menu from displaying
			event.preventDefault();

			// mark the cover of the cell
			// if it exists
			if( cell.objs.length > 1 )
				cell.objs[1].set({ color:'red' });
		} 

		// handle left clicks
		else {
			// remove the cell cover
			cell.rmv( 1, true );
			
			// if the cell is touching 0 bombs
			// clear all surrounding 0 cells
			if( cell.objs[0].text == "0" )
				clearZeros( cell.c, cell.r );

			// if the cell has a bomb
			// create an explosion animation
			// originating at the cell position
			else if( cell.BOMB )
				explosion( 
					grid.pos.x + cell.pos.x,
					grid.pos.y + cell.pos.y
				)

			// redraw
			app.draw();
		}
	}

	// if preview is active, click a random
	// cell to simulate gameplay
	if( settings.preview )
		for( c=1; c<grid.C; c++ )
			for( r=1; r<grid.R; r++ )
				if( grid.cells[c][r].objs[0].text == "0" ){
					grid.onClick( {}, {}, grid.cells[c][r] );
					break;
				}
}