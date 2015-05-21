/* Gradient
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
*/

//DEFINITION
iio.Gradient = function(){ this.Gradient.apply(this, arguments) };
iio.inherit(iio.Gradient, iio.Interface);
iio.Gradient.prototype._super = iio.Interface.prototype;

//CONSTRUCTOR
iio.Gradient.prototype.Gradient = function() {
  this._super.Interface.call(this,iio.merge_args(arguments));
}

// MEMBER FUNCTIONS
//------------------------------------------------------------
iio.Gradient.prototype.convert_props = function(){
	iio.convert.property.vector(this, "start");
  iio.convert.property.vector(this, "end");
  for(var i=0; i<this.stops.length; i++)
  	if(iio.is.string(this.stops[i][1]))
  		this.stops[i][1] = iio.convert.color(this.stops[i][1]);
}
iio.Gradient.prototype.canvasGradient = function(ctx){
	var gradient;
	if(this.startRadius)
		gradient = ctx.createRadialGradient(this.start.x,this.start.y,this.startRadius,
											 this.end.x,this.end.y,this.endRadius);
	else gradient = ctx.createLinearGradient(this.start.x,this.start.y,this.end.x,this.end.y);
	for(var i=0; i<this.stops.length; i++)
		gradient.addColorStop(this.stops[i][0],this.stops[i][1].rgbaString());
	return gradient;
}