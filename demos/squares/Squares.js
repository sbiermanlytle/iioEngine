/* Squares
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Squares = function( app, settings ){

	// set the background color to black
	app.set({ color:'black' })

	// define the total number of squares
	var num = 120;

	// define a max speed
	var speed = 0.2;

	// if settings are passed and preview is active
	if( settings && settings.preview )
		// limit the total number of squares
		num = 40;

	// add new squares to the app
	for(var i=0; i<num; i++)
		app.add( new iio.Rectangle({
			// set random position within app view
			pos: [ 
				iio.random(0,app.width),
				iio.random(0,app.height)
			],
			// set random width relative to num
			width: iio.random(num-20,num+20),
			// set color to white
			color: 'white',
			// set random velocity
			vel: [
				iio.random(-speed,speed),
				iio.random(-speed,speed)
			],
			// set random transparency
			alpha: iio.random(.3,.6),
			// define fade animation with speed and callback
			fade: {
				speed: iio.random(.0001,.0006),
				callback: function(o){
					// make the square fully opaque
					o.alpha = 1;
				}
			},
			// define a function to be run on each update
			onUpdate: function(){
				// add a random value to the velocity
				this.vel.x += iio.random(-.01,.01);
				this.vel.y += iio.random(-.01,.01);
			}
		// include true to prevent automatic drawing after add()
		}), true);

	// define a function to be run when the app is resized
	this.resize = function(){

		// set bounds on each object, relative to the new size
		// use callbacks to make squares bounce off app boundaries
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds = {
				bottom: {
					bound: app.height, 
					callback: function(o){ 
						// reverse y velocity 
						o.vel.y = -speed 
					}
				},
				top: {
					bound: 0, 
					callback: function(o){ 
						// reverse y velocity 
						o.vel.y = speed 
					}
				},
				left: {
					bound: 0, 
					callback: function(o){ 
						// reverse x velocity 
						o.vel.x = speed 
					}
				},
				right: {
					bound: app.width, 
					callback: function(o){ 
						// reverse x velocity 
						o.vel.x = -speed
					}
				}
			}
	}; 

	// set the initial bounds
	this.resize();
}