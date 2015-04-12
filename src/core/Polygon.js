
//DEFINITION
iio.Polygon = function(){ this.Polygon.apply(this, arguments) };
iio.inherit(iio.Polygon, iio.Drawable);
iio.Polygon.prototype._super = iio.Drawable.prototype;

//CONSTRUCTOR
iio.Polygon.prototype.Polygon = function() {
  this._super.Drawable.call(this,arguments[0]);
}

//FUNCTIONS
iio.Polygon.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  if (this.bezier) {
    var _i = 0;
    for (var i = 1; i < this.vs.length; i++)
      ctx.this.bezierCurveTo((this.bezier[_i++] || this.vs[i - 1].x - this.vs[0].x), (this.bezier[_i++] || this.vs[i - 1].y - this.vs[0].y), (this.bezier[_i++] || this.vs[i].x - this.vs[0].x), (this.bezier[_i++] || this.vs[i].y - this.vs[0].y), this.vs[i].x - this.vs[0].x, this.vs[i].y - this.vs[0].y);
    if (typeof(this.open) == 'undefined' || !this.open) {
      i--;
      ctx.this.bezierCurveTo((this.bezier[_i++] || this.vs[i].x - this.vs[0].x), (this.bezier[_i++] || this.vs[i].y - this.vs[0].y), (this.bezier[_i++] || 0), (this.bezier[_i++] || 0), 0, 0);
    }
  } else for(var i=1; i<this.vs.length; i++)
    ctx.lineTo(this.vs[i].x - this.vs[0].x, this.vs[i].y - this.vs[0].y);
  if (typeof(this.open) == 'undefined' || !this.open)
    ctx.closePath();
  this.finish_path_shape(ctx);
}
iio.Polygon.prototype.contains = function(v, y) {
  y = (v.y || y);
  v = (v.x || v);
  var i = j = c = 0;
  var vs = this.vs;
  if (this.rot) vs = this.getTrueVertices();
  for (i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    if (((vs[i].y > y) != (vs[j].y > y)) &&
      (v < (vs[j].x - vs[i].x) * (y - vs[i].y) / (vs[j].y - vs[i].y) + vs[i].x))
      c = !c;
  }
  return c;
}
iio.Polygon.prototype.getTrueVertices = function() {
  return this.vs.map(function(_v) {
    var v = iio.point.rotate(_v.x - this.pos.x, _v.y - this.pos.y, this.rot);
    v.x += this.pos.x;
    v.y += this.pos.y;
    return v;
  }, this);
}