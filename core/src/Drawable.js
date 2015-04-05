
//DEFINITION
iio.Drawable = function(){ this.Drawable.apply(this, arguments) }
iio.inherit(iio.Drawable, iio.Obj);
iio.Drawable.prototype._super = iio.Obj.prototype;

//CONSTRUCTOR
iio.Drawable.prototype.Drawable = function() {
  this._super.Obj.call(this,arguments[0]);

  this.playAnim = iio.anim.play;
  this._shrink = iio.anim.shrink;
  this._fade = iio.anim.fade;
  this.createGradient = iio.api.createGradient;

  if(!this.pos) this.pos = {x:0, y:0}
}

//UPDATE FUNCTIONS
iio.Drawable.prototype.update = function() {

  // transform and remove Drawableect if necessary
  var remove = false;
  if(this.bounds) remove = this.past_bounds();
  if (this.shrink) remove = this.update_shrink();
  if (this.fade) remove = this.update_fade();
  if (remove) return remove;

  // update position
  if (this.acc) this.update_acc();
  if (this.vel) this.update_vel();

  if (this.objs && this.objs.length > 0)
      this.objs.forEach(function(obj) {
        if (obj.update && obj.update(o, dt)) this.rmv(obj);
      }, this);
}
iio.Drawable.prototype.update_vel = function(){
  if (this.vel.x) this.pos.x += this.vel.x;
  if (this.vel.y) this.pos.y += this.vel.y;
  if (this.vel.r) this.rot += this.vel.r;
}
iio.Drawable.prototype.update_acc = function(){
  this.vel.x += this.acc.x;
  this.vel.y += this.acc.y;
  this.vel.r += this.acc.r;
}
iio.Drawable.prototype.update_shrink = function(){
  if (this.shrink instanceof Array)
    return this._shrink(this.shrink[0], this.shrink[1]);
  else return this._shrink(this.shrink);
}
iio.Drawable.prototype.update_fade = function(){
  if (this.fade instanceof Array)
    return this._fade(this.fade[0], this.fade[1]);
  else return this._fade(this.fade);
}
iio.Drawable.prototype.past_bounds = function(){
  if (this.bounds.right && iio.bounds.over_upper_limit(this.bounds.right, this.pos.x, this)) return true;
  if (this.bounds.left && iio.bounds.below_lower_limit(this.bounds.left, this.pos.x, this)) return true;
  if (this.bounds.top && iio.bounds.below_lower_limit(this.bounds.top, this.pos.y, this)) return true;
  if (this.bounds.bottom && iio.bounds.over_upper_limit(this.bounds.bottom, this.pos.y, this)) return true;
  return false;
}

//DRAW FUNCTIONS
iio.Drawable.prototype.prep_ctx = function(ctx){
  ctx = ctx || this.app.ctx;
  ctx.save();

  //translate & rotate
  if (this.origin) ctx.translate(this.origin.x, this.origin.y);
  else if(this.pos) ctx.translate(this.pos.x, this.pos.y);
  if (this.rot) ctx.rotate(this.rot);
  return ctx;
}
iio.Drawable.prototype.prep_ctx_color = function(ctx){
  //if (o.color.indexOf && o.color.indexOf('gradient') > -1)
    //o.color = o.createGradient(ctx, o.color);
  ctx.fillStyle = this.color;
  return ctx;
}
iio.Drawable.prototype.prep_ctx_outline = function(ctx){
  //if (o.outline.indexOf && o.outline.indexOf('gradient') > -1)
    //o.outline = o.createGradient(ctx, o.outline);
  ctx.strokeStyle = o.outline;
  return ctx;
}
iio.Drawable.prototype.prep_ctx_lineWidth = function(ctx){
  ctx.lineWidth = o.lineWidth || 1;
  return ctx;
}
iio.Drawable.prototype.prep_ctx_shadow = function(ctx){
  var s = this.shadow.split(' ');
  s.forEach(function(_s) {
    if (iio.is.number(_s))
      ctx.shadowBlur = _s;
    else if (_s.indexOf(':') > -1) {
      var _i = _s.indexOf(':');
      ctx.shadowOffsetX = _s.substring(0, _i);
      ctx.shadowOffsetY = _s.substring(_i + 1);
    } else ctx.shadowColor = _s;
  });
  return ctx;
}
iio.Drawable.prototype.prep_ctx_dash = function(ctx){
  if (this.dash.length > 1 && this.dash.length % 2 == 1)
    ctx.lineDashOffset = this.dash[this.dash.length - 1];
  //ctx.setLineDash(this.dash.slice().splice(0,this.dash.length-1));
  ctx.setLineDash(this.dash);
  return ctx;
} 
iio.Drawable.prototype.draw_obj = function(ctx){
  ctx.save();
  ctx.globalAlpha = this.alpha;
  if (this.lineCap) ctx.lineCap = this.lineCap;
  if (this.shadow) ctx = this.prep_ctx_shadow(ctx);
  if (this.dash) ctx = this.prep_ctx_dash(ctx);
  if (this.color) ctx = this.prep_ctx_color(ctx);
  if (this.outline) {
    ctx = this.prep_ctx_outline(ctx);
    ctx = this.prep_ctx_lineWidth(ctx);
  }
  if(this.draw_shape) this.draw_shape(ctx);
  ctx.restore();
}
iio.Drawable.prototype.draw = function(ctx){

  if (this.hidden) return;
  ctx = this.prep_ctx(ctx);
  
  //draw objs in z index order
  if (this.objs&&this.objs.length > 0) {
    var drawnSelf = false;
    this.objs.forEach(function(obj) {
      if (!drawnSelf && obj.z >= this.z) {
        this.draw_obj(ctx);
        drawnSelf = true;
      }
      if (obj.draw) obj.draw(ctx);
    }, this);
    if (!drawnSelf) this.draw_obj(ctx);
  } 
  //draw
  else this.draw_obj(ctx);
  ctx.restore();
}