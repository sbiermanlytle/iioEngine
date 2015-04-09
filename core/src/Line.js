
//DEFINITION
iio.Line = function(){ this.Line.apply(this, arguments) };
iio.inherit(iio.Line, iio.Drawable);
iio.Line.prototype._super = iio.Drawable.prototype;

//CONSTRUCTOR
iio.Line.prototype.Line = function() {
  var props = {};
  for(var i=0; i<arguments.length; i++)
    props = iio.merge(props,arguments[i]);
  this._super.Drawable.call(this,props);
  //this.pos = this.pos || this.vs[0];
  //this.center.x = (this.pos.x + this.endPos.x) / 2;
  //this.center.y = (this.pos.y + this.endPos.y) / 2;
  //this.width = iio.v.dist(this.pos, this.endPos);
  //this.height = o.lineWidth;
}


//FUNCTIONS
iio.Line.prototype.update_props = function(v) {

}
iio.Line.prototype.contains = function(v, y) {
  if (typeof(y) != 'undefined') v = {
    x: v,
    y: y
  }
  if (iio.is.between(v.x, this.pos.x, this.vs[1].x) && iio.is.between(v.y, this.vs[0].y, this.vs[1].y)) {
    var a = (this.vs[1].y - this.vs[0].y) / (this.vs[1].x - this.vs[0].x);
    if (!isFinite(a)) return true;
    var y = a * (this.vs[1].x - this.vs[0].x) + this.vs[0].y;
    if (y == v.y) return true;
  }
  return false;
}
iio.Line.prototype.prep_ctx_color = function(ctx){
  //if (o.color.indexOf && o.color.indexOf('gradient') > -1)
    //o.color = o.createGradient(ctx, o.color);
  ctx.strokeStyle = this.color.toString();
  return ctx;
}

iio.Line.prototype.draw_shape = function(ctx) {
  /*if (this.color.indexOf && this.color.indexOf('gradient') > -1)
    this.color = this.createGradient(ctx, this.color);*/
  ctx.strokeStyle = this.color.toString();
  ctx.lineWidth = this.width || 1;
  ctx.beginPath();
  ctx.moveTo(this.vs[0].x, this.vs[0].y);
  if (this.bezier)
    ctx.bezierCurveTo(this.bezier[0], this.bezier[1], this.bezier[2], this.bezier[3], this.vs[1].x, this.vs[1].y);
  else ctx.lineTo(this.vs[1].x, this.vs[1].y);
  ctx.stroke();
}