/* Rectangle
------------------
*/

// DEFINITION
iio.Rectangle = function(){ this.Rectangle.apply(this, arguments) };
iio.inherit(iio.Rectangle, iio.Polygon);
iio.Rectangle.prototype._super = iio.Polygon.prototype;

// CONSTRUCTOR
iio.Rectangle.prototype.Rectangle = function() {
  this._super.Polygon.call(this,iio.merge_args(arguments));
  this.height = this.height || this.width;
  this.vs = [
    new iio.Vector(-this.width/2,-this.height/2),
    new iio.Vector(this.width/2,-this.height/2),
    new iio.Vector(this.width/2,this.height/2),
    new iio.Vector(-this.width/2,this.height/2),
  ];
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Rectangle.prototype.size = function(){ return this.width }
iio.Rectangle.prototype.setSize = function(w,h){
  this.width = w;
  this.height = h||w;
}
iio.Rectangle.prototype.contains = function(v, y) {
  v = this.localize(v,y);
  if (v.x > -this.width/2 
   && v.x <  this.width/2
   && v.y > -this.height/2 
   && v.y <  this.height/2)
    return true;
  return false;
}
iio.Rectangle.prototype.draw_shape = function(ctx){
  if (this.imageRounding)
    ctx.translate(Math.floor(-this.width/2), Math.floor(-this.height/2));
  else ctx.translate(-this.width/2,-this.height/2);
  /*if (this.bezier) {
    iio.draw.poly(ctx, this.trueVs(), this.bezier);
    this.finish_path_shape(ctx);
  }*/
  if(this.round)
    this.draw_rounded(ctx);
  else{
    if (this.color) ctx.fillRect(0, 0, this.width, this.height);
    if (this.img) ctx.drawImage(this.img, 0, 0, this.width, this.height);
    if (this.anims)
      ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
        this.anims[this.animKey].frames[this.animFrame].x,
        this.anims[this.animKey].frames[this.animFrame].y,
        this.anims[this.animKey].frames[this.animFrame].w,
        this.anims[this.animKey].frames[this.animFrame].h,
        0, 0, this.width, this.height);
    if (this.outline) ctx.strokeRect(0, 0, this.width, this.height);
  }
}

// RECTANGLE FUNCTIONS
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
