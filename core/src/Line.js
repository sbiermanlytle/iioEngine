
//DEFINITION
iio.Line = function(){ this.Line.apply(this, arguments) };
iio.inherit(iio.Line, iio.Drawable);
iio.Line.prototype._super = iio.Drawable.prototype;

//CONSTRUCTOR
iio.Line.prototype.Line = function() {
  this._super.Drawable.call(this,arguments[0]);
  //this.center.x = (this.pos.x + this.endPos.x) / 2;
  //this.center.y = (this.pos.y + this.endPos.y) / 2;
  //this.width = iio.v.dist(this.pos, this.endPos);
  //this.height = o.lineWidth;
}

iio.Line.prototype.update_props = function(v) {
  this.endPos.x += v.x;
  this.endPos.y += v.y;
  this.center.x += v.x;
  this.center.y += v.y;
}
iio.Line.prototype.contains = function(v, y) {
  if (typeof(y) != 'undefined') v = {
    x: v,
    y: y
  }
  if (iio.is.between(v.x, this.pos.x, this.endPos.x) && iio.is.between(v.y, this.pos.y, this.endPos.y)) {
    var a = (this.endPos.y - this.pos.y) / (this.endPos.x - this.pos.x);
    if (!isFinite(a)) return true;
    var y = a * (this.endPos.x - this.pos.x) + this.pos.y;
    if (y == v.y) return true;
  }
  return false;
}

//FUNCTIONS
iio.Line.prototype.draw_shape = function(ctx) {
  /*if (this.color.indexOf && this.color.indexOf('gradient') > -1)
    this.color = this.createGradient(ctx, this.color);*/
  ctx.strokeStyle = this.color.toString();
  ctx.lineWidth = this.lineWidth || 1;
  if (this.origin)
    ctx.translate(-this.origin.x, -this.origin.y);
  else ctx.translate(-this.pos.x, -this.pos.y);
  ctx.beginPath();
  ctx.moveTo(this.pos.x, this.pos.y);
  if (this.bezier)
    ctx.bezierCurveTo(this.bezier[0], this.bezier[1], this.bezier[2], this.bezier[3], this.endPos.x, this.endPos.y);
  else ctx.lineTo(this.endPos.x, this.endPos.y);
  ctx.stroke();
}