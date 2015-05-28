/* Snow
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Snow = function( app, settings ){

	// set the background color to black
	app.set({ color:'black' });

	// define the total number of circles
	var num = 400;

	// define the average width of the circles
	var size = 40;

	// if settings are passed and preview is active
	if( settings && settings.preview ) {
		// limit the total number of circles
		num = 50;
		// limit the average size
		size = 20;
	}

	// add new circles to the app
	for(var i=0; i<num; i++)
		app.add( new iio.Circle({
			// set random position above app view
			pos:[ 
				iio.random(0, app.width), 
				iio.random(-app.height, 0) 
			],
			// set random radius relative to the average size
			radius: iio.random(size-15, size+15),
			// set color to white
			color: 'white',
			// set random velocity
			vel:[ iio.random(-.1, .1), iio.random(.1, .3) ],
			// define fade animation with speed and callback
			fade:{
				// set rate at which the alpha value decreases
				speed: iio.random(.0001,.001),
				callback: function(o){
					// return false to prevent automatic object removal
					return false;
				}
			},
			// define a function to be run on each update
			onUpdate: function(){
				// add a random value to the velocity
				// (to make the particles sway/meander)
				this.vel.x += iio.random(-.001, .001);
			}
		// include true to prevent automatic drawing after add()
		}), true);

	// define a function to be run when the app is resized
	this.resize = function(){

		// set bounds on each object, relative to the new size
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds = {
				// position the object back at the top
				// whenever it reaches a bottom limit
				bottom:{
					bound: app.height + 140, 
					callback: function(o){
						o.alpha = 1;
						o.pos.x = iio.random(0, app.width);
						o.pos.y = iio.random(-app.height, -100);
					}
				},
				left:{
					bound: 0,
					callback: function(o){ 
						// reverse x velocity 
						o.vel.x *= -1 
					}
				},
				right:{ 
					bound: app.width, 
					callback: function(o){ 
						// reverse x velocity
						o.vel.x *= -1 
					}
				}
			}
	}; 

	// set the initial bounds
	this.resize();
}