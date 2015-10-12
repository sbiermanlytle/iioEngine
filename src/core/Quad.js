
//DEFINITION
iio.Quad = function(){ this.Quad.apply(this, arguments) };
iio.inherit(iio.Quad, iio.Shape);
iio.Quad.prototype._super = iio.Shape.prototype;

//CONSTRUCTOR
iio.Quad.prototype.Quad = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
  this.height = this.height || this.width;
}

//FUNCTIONS SHARED WITH RECTANGLE
iio.Quad.prototype.draw_shape = iio.Rectangle.prototype.draw_shape;
iio.Quad.prototype.draw_rounded = iio.Rectangle.prototype.draw_rounded;
iio.Quad.prototype.contains = iio.Rectangle.prototype.contains
iio.Quad.prototype.size = iio.Rectangle.prototype.size;
iio.Quad.prototype.setSize = iio.Rectangle.prototype.setSize;
iio.Quad.prototype._trueVs = iio.Polygon.prototype.trueVs;

//FUNCTIONS
iio.Quad.prototype.trueVs = function() {
  this.vs = [
    new iio.Vector(-this.width/2, -this.height/2),
    new iio.Vector(this.width/2, -this.height/2),
    new iio.Vector(this.width/2, this.height/2),
    new iio.Vector(-this.width/2, this.height/2),
  ];
  return this._trueVs()
}
iio.Quad.prototype.left = function(){ return this.pos.x - this.width/2 }
iio.Quad.prototype.right = function(){ return this.pos.x + this.width/2 }
iio.Quad.prototype.top = function(){ return this.pos.y - this.height/2 }
iio.Quad.prototype.bottom = function(){ return this.pos.y + this.height/2 }