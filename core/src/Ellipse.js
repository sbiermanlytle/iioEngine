
//DEFINITION
iio.Circle = function(){ this.Circle.apply(this, arguments) };
iio.inherit(iio.Circle, iio.Drawable);
iio.Circle.prototype._super = iio.Drawable.prototype;

//CONSTRUCTOR
iio.Circle.prototype.Circle = function() {
  this._super.Drawable.call(this,arguments[0]);
}

//FUNCTIONS
iio.Circle.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
  if (this.color) ctx.fill();
  if (this.img) ctx.drawImage(this.img, -this.radius, -this.radius, this.radius, this.radius);
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
  ctx.restore();
}
iio.Circle.prototype.contains = function(v, y) {
  if (typeof(y) != 'undefined') v = {
    x: v,
    y: y
  }
  if (this.radius == this.radius && iio.v.dist(v, this.pos) < this.radius)
    return true;
  else {
    if (this.rot) {
      v.x -= this.pos.x;
      v.y -= this.pos.y;
      v = iio.rotatePoint(v.x, v.y, -this.rot);
      v.x += this.pos.x;
      v.y += this.pos.y;
    }
    if (Math.pow(v.x - this.pos.x, 2) / Math.pow(this.radius, 2) + Math.pow(v.y - this.pos.y, 2) / Math.pow(this.radius, 2) <= 1)
      return true;
  }
  return false;
}
iio.Circle.prototype.left = function(){ return pos.x - this.radius }
iio.Circle.prototype.right = function(){ return pos.x + this.radius }
iio.Circle.prototype.top = function(){ return pos.y - this.radius }
iio.Circle.prototype.bottom = function(){ return pos.y + this.radius }
iio.Circle.prototype.draw_shape = function(ctx){
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
  if (this.radius != this.radius) ctx.closePath();
  this.finish_path_shape(ctx);
}