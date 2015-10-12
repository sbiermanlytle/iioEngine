
//DEFINITION
iio.Ellipse = function(){ this.Ellipse.apply(this, arguments) };
iio.inherit(iio.Ellipse, iio.Shape);
iio.Ellipse.prototype._super = iio.Shape.prototype;

//CONSTRUCTOR
iio.Ellipse.prototype.Ellipse = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
}

//FUNCTIONS
iio.Ellipse.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  if (this.vRadius !== undefined) {
    if (ctx.ellipse) {
      ctx.ellipse(0,0, this.radius, this.vRadius, 0, 0,2*Math.PI, false)
    } else {
      ctx.save();
      ctx.translate(-this.radius, -this.vRadius);
      ctx.scale(this.radius, this.vRadius);
      ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
      ctx.restore();
    }
  } else {
    ctx.arc(0,0, this.radius, 0,2*Math.PI, false);
  }
  if (this.color) ctx.fill();
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
  if (this.img) ctx.drawImage(this.img, -this.radius, -this.radius, this.radius*2, this.radius*2);
}
iio.Ellipse.prototype.contains = function(v, y) {
  if (typeof(y) !== 'undefined') v = { x:v, y:y }
  if ((!this.vRadius || this.radius === this.vRadius) && iio.Vector.dist(v, this.pos) < this.radius)
    return true;
  v = this.localize(v);
  if (Math.pow(v.x, 2) / Math.pow(this.radius, 2) + Math.pow(v.y, 2) / Math.pow(this.vRadius, 2) <= 1)
    return true;
  return false;
}
iio.Ellipse.prototype.size = function(){ return this.radius }
iio.Ellipse.prototype.setSize = function(s){ this.radius = s/2 }
iio.Ellipse.prototype.left = function(){ return this.pos.x - this.radius }
iio.Ellipse.prototype.right = function(){ return this.pos.x + this.radius }
iio.Ellipse.prototype.top = function(){ return this.pos.y - (this.vRadius || this.radius) }
iio.Ellipse.prototype.bottom = function(){ return this.pos.y + (this.vRadius || this.radius) }
iio.Ellipse.prototype._shrink = function(s, r) {
  this.radius *= 1 - s;
  if (this.vRadius) this.vRadius *= 1 - s;
  if (this.radius < .02 
    || this.radius < this.shrink.lowerBound 
    || this.radius > this.shrink.upperBound) {
    if (r) return r(this);
    return true;
  }
}