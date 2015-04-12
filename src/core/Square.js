
//DEFINITION
iio.Square = function(){ this.Square.apply(this, arguments) };
iio.inherit(iio.Square, iio.Rectangle);
iio.Square.prototype._super = iio.Rectangle.prototype;

//CONSTRUCTOR
iio.Square.prototype.Square = function() {
	this._super.Rectangle.call(this,arguments[0]);
	this.height = this.width;
}
