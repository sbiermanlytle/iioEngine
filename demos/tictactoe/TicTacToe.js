/* Tic Tac Toe
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

TicTacToe = function( app, settings ){

	// set the background color to black
	app.set({ color: 'black' });
				
	// add a 3x3 grid to app center
	var grid = app.add( new iio.Grid({
		pos: app.center,
		// make the grid as big as the smaller screen dimension
		width: ( app.height < app.width ) ? app.height : app.width,
		color:'white',
		lineWidth: 10,
		R:3,
		C:3
	}));

	// define boolean to indicate player turns
	var xTurn = true;

	// define a function to be called when the grid is clicked
	grid.onClick = function( event, pos, cell ){

		// if the clicked cell is empty
		if(!cell.taken){

			// create a new text object
			var play_piece = new iio.Text({
				size: cell.width,
				font: 'sans-serif'
			});

			// depending upon the current turn
			// set the text object string and color
			if(xTurn) {
				play_piece.text = 'X';
				play_piece.color = iio.Color.red;
			} else { 
				play_piece.text = 'O';
				play_piece.color = iio.Color.iioBlue;
			}

			// add the text object to the cell
			cell.add( play_piece );

			// create a new property in cell to
			// indicate that it is not empty
			cell.taken = true;

			// change turns
			xTurn = !xTurn;
		}
	}

	// if settings are passed and preview is active
	if( settings && settings.preview )
		// generate 4 random selections
		for( var i=0; i<4; i++ )
			grid.onClick( null, null, grid.objs[iio.randomInt( 0,8 )] );
}

