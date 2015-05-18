
//DEFINITION
iio.X = function(){ this.X.apply(this, arguments) };
iio.inherit(iio.X, iio.Rectangle);
iio.X.prototype._super = iio.Rectangle.prototype;

//CONSTRUCTOR
iio.X.prototype.X = function() {
  this._super.Rectangle.call(this,this.merge_props(arguments));
}

//FUNCTIONS
iio.X.prototype.draw_shape = function(ctx){
  ctx.translate(-this.width / 2, -this.height / 2);
  /*if (this.bezier) {
    iio.draw.poly(ctx, this.getTrueVertices(), this.bezier);
    this.finish_path_shape(ctx);
  }*/
  iio.draw.line(ctx, 0, 0, this.width, this.height);
  iio.draw.line(ctx, this.width, 0, 0, this.height);
  ctx.restore();
}
iio.X.prototype.prep_ctx_color = iio.Line.prototype.prep_ctx_color;