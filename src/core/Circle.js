
//DEFINITION
iio.Circle = function(){ this.Circle.apply(this, arguments) };
iio.inherit(iio.Circle, iio.Drawable);
iio.Circle.prototype._super = iio.Drawable.prototype;

//CONSTRUCTOR
iio.Circle.prototype.Circle = function() {
  this._super.Drawable.call(this,this.merge_props(arguments));
}

//FUNCTIONS
iio.Circle.prototype.convert_props = function(){
  this._super.convert_props.call(this);

  // handle image attachment
  if (this.img){
    if(iio.is.string(this.img)) {
      var src = this.img;
      this.img = new Image();
      this.img.src = src;
      this.img.parent = this;
      var o = this;
      if (!this.radius){
        this.img.onload = function(e) {
          o.radius = o.img.width/2 || 0;
          if(o.app) o.app.draw()
        }
      } else this.img.onload = function(e) {
        if(o.app) o.app.draw()
      }
    } else {
      if (!this.radius) {
        if (o.radius == 0) o.radius = this.img.width/2 || 0;
        if(o.app) o.app.draw()
      }
    }
  } 
}
iio.Circle.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
  if (this.color) ctx.fill();
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
  if (this.img) ctx.drawImage(this.img, -this.radius, -this.radius, this.radius*2, this.radius*2);
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
iio.Circle.prototype.left = function(){ return this.pos.x - this.radius }
iio.Circle.prototype.right = function(){ return this.pos.x + this.radius }
iio.Circle.prototype.top = function(){ return this.pos.y - this.radius }
iio.Circle.prototype.bottom = function(){ return this.pos.y + this.radius }
iio.Circle.prototype._shrink = function(s, r) {
  this.radius *= 1 - s;
  if (this.radius < .02 
    || this.radius < this.shrink.lowerBound 
    || this.radius > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}