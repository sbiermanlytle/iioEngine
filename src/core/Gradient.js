//DEFINITION
iio.Gradient = function(){ this.Gradient.apply(this, arguments) };

//CONSTRUCTOR
iio.Gradient.prototype.Gradient = function() {
	for (var p in arguments[0]) this[p] = arguments[0][p];
  	this.convert_v("start");
  	this.convert_v("end");
  	for(var i=0; i<this.stops.length; i++)
  		if(iio.is.string(this.stops[i][1]))
  			this.stops[i][1] = iio.convert.color(this.stops[i][1]);
}

//FUNCTIONS
iio.Gradient.prototype.canvasGradient = function(ctx){
	var gradient;
	if(this.startRadius)
		gradient = ctx.createRadialGradient(this.start.x,this.start.y,this.startRadius,
											 this.end.x,this.end.y,this.endRadius);
	else gradient = ctx.createLinearGradient(this.start.x,this.start.y,this.end.x,this.end.y);
	for(var i=0; i<this.stops.length; i++)
		gradient.addColorStop(this.stops[i][0],this.stops[i][1].toString());
	return gradient;
}
iio.Gradient.prototype.convert_v = function(p){
  if(this[p] && this[p] instanceof Array)
    this[p] = new iio.V(this[p]);
}

