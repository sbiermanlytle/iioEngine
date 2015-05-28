/* ColorLines
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

ColorLines = function( app, settings ){

	// initialize settings
	settings = settings || {};
	var lineWidth = settings.lineWidth || 60;

	// add enough lines to fill the screen
	for( var offset = -app.width-lineWidth; offset < app.width; offset += lineWidth ){
		app.add( new iio.Line({
			color: iio.Color.random(),
			width: lineWidth,
			// set line vertices
			vs:[
				// start coordinates
				[ 0+offset, 0-lineWidth ],
				// end coordinates
				[ app.width+lineWidth, app.height-offset ]
			],
			// animate the color with changing cycles
			cycle: 0,
			onUpdate: function(){
				switch(this.cycle){
					case 1: 
						if(this.color.g>100)
							this.color.g--;
						else if(this.color.r>100)
							this.color.r--;
						else this.cycle = iio.randomInt(1,3);
						break;
					case 2: 
						if(this.color.b<200)
							this.color.b++;
						else if(this.color.r<200)
							this.color.r++;
						else this.cycle = iio.randomInt(1,3);
						break;
					case 3: 
						if(this.color.g>0)
							this.color.g--;
						else if(this.color.r>0)
							this.color.r--;
						else this.cycle = iio.randomInt(1,3);
						break;
					default: 
						if(this.color.r<255)
							this.color.r++;
						else if(this.color.b<255)
							this.color.b++;
						else this.cycle = iio.randomInt(1,3);
				}
			}
		// pass true to suppress app redraw
		}), true);
	}
}
