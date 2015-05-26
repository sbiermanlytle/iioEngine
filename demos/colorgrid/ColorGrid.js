/* ColorGrid
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/
ColorGrid = function( app, settings ){

	// set the background color to black
	app.set({ color:'black' });

	// set default width value
	var w = 20;

	// set width from settings
	if( settings )
		w = settings.w;

	// define a function to be run when the app is resized
	this.resize = function(){

		// clear all objects and loops from app
		app.clear();

		// create a grid of squares
		for( var c=w/2; c<app.width;  c+=w )
		for( var r=w/2; r<app.height; r+=w )
			app.add( new iio.Rectangle({
				// set position relative to row and column
				pos: [c,r],
				// set rectangle width
				width: w,
				// set rectangle color
				color: 'white',
				// define shrink animation with speed and callback
				shrink:{
					// set random shrink rate
					speed: iio.random(.05,.2),
					// when the shape is too small to be visible,
					// reset its properties and randomize the color
					callback: function( rectangle ){
						rectangle.width = w;
						rectangle.height = w;
						rectangle.color = iio.Color.random();
					}
				}
			// include true to prevent automatic drawing after add()
			}), true);
	}

	// initialize the app
	this.resize();
}