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
iio.Color.iioBlue = new iio.Color(0,186,255);
iio.Color.transparent = new iio.Color(0,0,0,0);
iio.Color.black = new iio.Color(0,0,0,1);
iio.Color.white = new iio.Color(255,255,255,1);
iio.Color.gray = new iio.Color(128,128,128,1);
iio.Color.red = new iio.Color(255,0,0,1);
iio.Color.green = new iio.Color(0,128,0,1);
iio.Color.blue = new iio.Color(0,0,255,1);
iio.Color.lime = new iio.Color(0,255,0,1);
iio.Color.aqua = new iio.Color(0,255,255,1);
iio.Color.fuchsia = new iio.Color(255,0,255,1);
iio.Color.maroon = new iio.Color(128,0,0,1);
iio.Color.navy = new iio.Color(0,0,128,1);
iio.Color.olive = new iio.Color(128,128,0,1);