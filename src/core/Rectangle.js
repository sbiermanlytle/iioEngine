
//DEFINITION
iio.Rectangle = function(){ this.Rectangle.apply(this, arguments) };
iio.inherit(iio.Rectangle, iio.Shape);
iio.Rectangle.prototype._super = iio.Shape.prototype;

//CONSTRUCTOR
iio.Rectangle.prototype.Rectangle = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
  this.height = this.height || this.width;
}

//FUNCTIONS
iio.Rectangle.prototype.contains = function(v, y) {
  if (this.rot) return iio.poly.contains(v, y);
  y = v.y || y;
  v = v.x || v;
  v -= this.pos.x;
  y -= this.pos.y;
  if (v > -this.width / 2 && v < this.width / 2 && y > -this.width / 2 && y < this.width / 2)
    return true;
  return false;
}
iio.Rectangle.prototype.real_vertices = function() {
  this.vs = [{
    x: this.left,
    y: this.top
  }, {
    x: this.right,
    y: this.top
  }, {
    x: this.right,
    y: this.bottom
  }, {
    x: this.left,
    y: this.bottom
  }];
  return this.vs.map(function(_v) {
    var v = iio.point.rotate(_v.x - this.pos.x, _v.y - this.pos.y, this.rot);
    v.x += this.pos.x;
    v.y += this.pos.y;
    return v;
  }, this);
}
iio.Rectangle.prototype.size = function(){ return this.width }
iio.Rectangle.prototype.setSize = function(w,h){ this.width = w; this.height = h; }
iio.Rectangle.prototype.left = function(){ return this.pos.x - this.width/2 }
iio.Rectangle.prototype.right = function(){ return this.pos.x + this.width/2 }
iio.Rectangle.prototype.top = function(){ return this.pos.y - this.height/2 }
iio.Rectangle.prototype.bottom = function(){ return this.pos.y + this.height/2 }
iio.Rectangle.prototype.draw_rounded = function(ctx){
  ctx.beginPath();
  ctx.moveTo(this.round[0], 0);
  ctx.lineTo(this.width - this.round[1], 0);
  ctx.quadraticCurveTo(this.width, 0, this.width, this.round[1]);
  ctx.lineTo(this.width, this.height - this.round[2]);
  ctx.quadraticCurveTo(this.width, this.height, this.width - this.round[2], this.height);
  ctx.lineTo(this.round[3], this.height);
  ctx.quadraticCurveTo(0, this.height, 0, this.height - this.round[3]);
  ctx.lineTo(0, this.round[0]);
  ctx.quadraticCurveTo(0, 0, this.round[0], 0);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.clip();
}
iio.Rectangle.prototype.draw_shape = function(ctx){
  ctx.translate(-this.width / 2, -this.height / 2);
  if (this.bezier) {
    iio.draw.poly(ctx, this.getTrueVertices(), this.bezier);
    this.finish_path_shape(ctx);
  }
  // } else if (this.type==iio.X) {
  //   iio.draw.prep_x(ctx, this);
  //   iio.draw.line(ctx, 0, 0, this.width, this.width);
  //   iio.draw.line(ctx, this.width, 0, 0, this.width);
  //   ctx.restore();
  // } 
  else if(this.round)
    this.draw_rounded(ctx);
  else{
    if (this.color) ctx.fillRect(0, 0, this.width, this.height)
    if (this.img) ctx.drawImage(this.img, 0, 0, this.width, this.height);
    if (this.anims) ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
      this.anims[this.animKey].frames[this.animFrame].x,
      this.anims[this.animKey].frames[this.animFrame].y,
      this.anims[this.animKey].frames[this.animFrame].w,
      this.anims[this.animKey].frames[this.animFrame].h,
      0, 0, this.width, this.height);
    if (this.outline) ctx.strokeRect(0, 0, this.width, this.height);
  }
}