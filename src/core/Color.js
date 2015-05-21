/* Color
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
*/

// DEFINITION
iio.Color = function(){ this.Color.apply(this, arguments) };
iio.inherit(iio.Color, iio.Interface);
iio.Color.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Color.prototype.Color = function(r,g,b,a) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.a = a || 1;
	return this;
}

// STATIC FUNCTIONS
//------------------------------------------------------------
iio.Color.random = function(){
	return new iio.Color(iio.randomInt(0,255),iio.randomInt(0,255),iio.randomInt(0,255))
}

// MEMBER FUNCTIONS
//------------------------------------------------------------
iio.Color.prototype.clone = function() {
	return new iio.Color( this.r, this.g, this.b, this.a );
}
iio.Color.prototype.rgbaString = function(){
	return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
}
iio.Color.prototype.invert = function(){
	this.r = 255-this.r;
	this.g = 255-this.g;
	this.b = 255-this.b;
	return this;
}
iio.Color.prototype.randomize = function(alpha){
	this.r = iio.randomInt(0,255);
	this.g = iio.randomInt(0,255);
	this.b = iio.randomInt(0,255);
	if(alpha) this.a = iio.random();
	return this;
}

// COLOR CONSTANTS
//------------------------------------------------------------
iio.Color.constants = [
	{ string: 'transparent', r:0, g:0, b:0, a:0 },
	{ string: 'black', r:0, g:0, b:0, a:1 },
	{ string: 'white', r:255, g:255, b:255, a:1 },
	{ string: 'red', r:255, g:0, b:0, a:1 },
	{ string: 'blue', r:0, g:0, b:255, a:1 },
	{ string: 'green', r:0, g:255, b:0, a:1 },
]
iio.Color.constant = function( color_string ){
    for(var i=0; i<iio.Color.constants.length; i++)
      if( iio.Color.constants[i].string == color_string )
      	 return new iio.Color( 
      	 	iio.Color.constants[i].r, 
      	 	iio.Color.constants[i].g, 
      	 	iio.Color.constants[i].b, 
      	 	iio.Color.constants[i].a 
      	 );
    return false;
}