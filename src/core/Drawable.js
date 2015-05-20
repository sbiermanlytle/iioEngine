
//DEFINITION
iio.Drawable = function(){ this.Drawable.apply(this, arguments) }
iio.inherit(iio.Drawable, iio.Obj);
iio.Drawable.prototype._super = iio.Obj.prototype;

//CONSTRUCTOR
iio.Drawable.prototype.Drawable = function() {
  this._super.Obj.call(this,arguments[0]);
  //if(!this.pos) this.pos = {x:0, y:0}
}

//BOUNDS FUNCTIONS
iio.Drawable.prototype.left = function(){ if(this.pos) return this.pos.x; else return 0 }
iio.Drawable.prototype.right = function(){ if(this.pos) return this.pos.x; else return 0 }
iio.Drawable.prototype.top = function(){ if(this.pos) return this.pos.y; else return 0 }
iio.Drawable.prototype.bottom = function(){ if(this.pos) return this.pos.y; else return 0 }
iio.Drawable.prototype.resolve = function(b, c) {
  if (b.callback) return b.callback(c);
  return true;
}
iio.Drawable.prototype.over_upper_limit = function(bnd, val, c) {
  if (iio.is.number(bnd) && val > bnd || typeof bnd.bound != 'undefined' && val > bnd.bound ) 
    return this.resolve(bnd, c);
  return false;
}
iio.Drawable.prototype.below_lower_limit = function(bnd, val, c) {
  if (iio.is.number(bnd) && val < bnd || typeof bnd.bound != 'undefined' && val < bnd.bound ) 
    return this.resolve(bnd, c);
  return false;
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
  if (this.rAcc) this.rVel += this.rAcc;
  if (this.rVel) this.update_rotation();
  if (this.accs) this.update_accs();
  if (this.vels) this.update_vels();
  if (this.bezierAccs) this.update_bezier_accs();
  if (this.bezierVels) this.update_bezier_vels();

  if (this.onUpdate) this.onUpdate();

  if (this.objs && this.objs.length > 0)
      this.objs.forEach(function(obj) {
        if (obj.update && obj.update()) this.rmv(obj);
      }, this);
}
iio.Drawable.prototype.update_vel = function(){
  if(this.pos){
    if (this.vel.x) this.pos.x += this.vel.x;
    if (this.vel.y) this.pos.y += this.vel.y;
  } else if(this.vs) {
    for(var i=0; i<this.vs.length; i++){
      if (this.vel.x) this.vs[i].x += this.vel.x;
      if (this.vel.y) this.vs[i].y += this.vel.y;
    }
  }
}
iio.Drawable.prototype.update_vels = function(){
  if(this.vs){
    for(var i=0; i<this.vels.length; i++){
      if (this.vels[i].x) this.vs[i].x += this.vels[i].x;
      if (this.vels[i].y) this.vs[i].y += this.vels[i].y;
    }
  }
}
iio.Drawable.prototype.update_bezier_vels = function(){
  if(this.bezier){
    for(var i=0; i<this.bezierVels.length; i++){
      if (this.bezierVels[i].x) this.bezier[i].x += this.bezierVels[i].x;
      if (this.bezierVels[i].y) this.bezier[i].y += this.bezierVels[i].y;
    }
  }
}
iio.Drawable.prototype.update_bezier_accs = function(){
  if(this.bezierVels){
    for(var i=0; i<this.bezierAccs.length; i++){
      if (this.bezierAccs[i].x) this.bezierVels[i].x += this.bezierAccs[i].x;
      if (this.bezierAccs[i].y) this.bezierVels[i].y += this.bezierAccs[i].y;
    }
  }
}
iio.Drawable.prototype.update_rotation = function(){
  this.rotation += this.rVel;
  if(this.rotation > 6283 || this.rotation < -6283) this.rotation = 0;
}
iio.Drawable.prototype.update_acc = function(){
  this.vel.x += this.acc.x;
  this.vel.y += this.acc.y;
}
iio.Drawable.prototype.update_accs = function(){
  if(this.vels){
    for(var i=0; i<this.accs.length; i++){
      if (this.accs[i].x) this.vels[i].x += this.accs[i].x;
      if (this.accs[i].y) this.vels[i].y += this.accs[i].y;
    }
  }
}
iio.Drawable.prototype.update_shrink = function(){
  if (this.shrink.speed)
    return this._shrink(this.shrink.speed, this.shrink.callback);
  else return this._shrink(this.shrink);
}
iio.Drawable.prototype.update_fade = function(){
  if (this.fade.speed)
    return this._fade(this.fade.speed, this.fade.callback);
  else return this._fade(this.fade);
}
iio.Drawable.prototype.past_bounds = function(){
  if (this.bounds.right && this.over_upper_limit(this.bounds.right, this.right(), this)) return true;
  if (this.bounds.left && this.below_lower_limit(this.bounds.left, this.left(), this)) return true;
  if (this.bounds.top && this.below_lower_limit(this.bounds.top, this.top(), this)) return true;
  if (this.bounds.bottom && this.over_upper_limit(this.bounds.bottom, this.bottom(), this)) return true;
  if (this.bounds.rightRotation && this.over_upper_limit(this.bounds.rightRotation, this.rotation, this)) return true;
  if (this.bounds.leftRotation && this.below_lower_limit(this.bounds.leftRotation, this.rotation, this)) return true;
  return false;
}
iio.Drawable.prototype.update_properties_deprecated = function(){
  if (o.simple) {
    if (!(o.bbx instanceof Array)) {
      o.bbx = [o.bbx, o.bbx];
    } else if (typeof(o.bbx[1] == 'undefined'))
      o.bbx[1] = o.bbx[0];
  }
  if (o.anims) {
    o.animKey = 0;
    o.animFrame = 0;
    if (!o.width) o.width = o.anims[o.animKey].frames[o.animFrame].w;
    if (!o.height) o.height = o.anims[o.animKey].frames[o.animFrame].h;
  }
  if (o.bezier)
    o.bezier.forEach(function(b, i) {
      if (b === 'n') o.bezier[i] = undefined;
    });
  if (o.img && iio.is.string(o.img)) {
    nd = false;
    var src = o.img;
    o.img = new Image();
    o.img.src = src;
    o.img.parent = o;
    if ((typeof o.width == 'undefined' && typeof o.radius == 'undefined') || o.radius == 0)
      o.img.onload = function(e) {
        if (o.radius == 0) o.radius = o.width / 2;
        else {
          o.width = o.width || 0;
          o.height = o.height || 0;
        }
        if (nd);
        else o.app.draw();
      }
  } else if (o.img) {
    if ((typeof o.width == 'undefined' && typeof o.radius == 'undefined') || o.radius == 0) {
      if (o.radius == 0) o.radius = o.img.width / 2;
      else {
        o.width = o.img.width || 0;
        o.height = o.img.height || 0;
      }
      if (nd);
      else o.app.draw();
    }
  }
}

//ANIMATION FUNCTIONS
iio.Drawable.prototype.playAnim = function(fps, t, r, fn, s) {
  if (iio.is.string(t)) {
    var o = this;
    this.anims.some(function(anim, i) {
      if (anim.tag == t) {
        o.animKey = i;
        o.width = anim.frames[o.animFrame].w;
        o.height = anim.frames[o.animFrame].h;
        return true;
      }
      return false;
    });
  } else r = t;
  this.animFrame = s || 0;
  if (typeof(r) != 'undefined') {
    this.repeat = r;
    this.onanimstop = fn;
  }
  var loop;
  if (fps > 0) loop = this.loop(fps, iio.anim.next);
  else if (fps < 0) loop = this.loop(fps * -1, iio.anim.prev);
  else this.app.draw();
  return loop;
}
iio.Drawable.prototype.nextFrame = function(o) {
  o.animFrame++;
  if (o.animFrame >= o.anims[o.animKey].frames.length) {
    o.animFrame = 0;
    if (typeof(o.repeat) != 'undefined') {
      if (o.repeat <= 1) {
        window.cancelAnimationFrame(id);
        window.clearTimeout(id);
        if (o.onanimstop) o.onanimstop(id, o);
        return;
      } else o.repeat--;
    }
  }
}
iio.Drawable.prototype.prevFrame = function(o) {
  o.animFrame--;
  if (o.animFrame < 0)
    o.animFrame = o.anims[o.animKey].frames.length - 1;
  o.app.draw();
}
iio.Drawable.prototype._shrink = function(s, r) {
  this.width *= 1 - s;
  this.height *= 1 - s;
  if (this.width < .02 
    || this.width < this.shrink.lowerBound 
    || this.width > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}
iio.Drawable.prototype._fade = function(s, r) {
  this.alpha *= 1 - s;
  if (this.alpha < s || this.alpha > 1-s
    ||this.alpha > this.fade.upperBound
    ||this.alpha < this.fade.lowerBound) {
    if(this.alpha > 1) this.alpha = 1;
    else if(this.alpha < 0) this.alpha = 0;
    if (r) return r(this);
    else return true;
  }
}


//DRAW FUNCTIONS
iio.Drawable.prototype.orient_ctx = function(ctx){
  ctx = ctx || this.app.ctx;
  ctx.save();

  //translate & rotate
  if (this.pos) ctx.translate(this.pos.x, this.pos.y);
  if(this.rotation){
    if (this.origin) ctx.translate(this.origin.x, this.origin.y);
    ctx.rotate(this.rotation);
    if (this.origin) ctx.translate(-this.origin.x, -this.origin.y);
  }
  if(this.flip){
    if(this.flip.indexOf('x') > -1)
      ctx.scale(-1, 1);
    if(this.flip.indexOf('y') > -1)
      ctx.scale(1, -1);
  }
  return ctx;
}
iio.Drawable.prototype.prep_ctx_color = function(ctx){
  if(this.color instanceof iio.Gradient)
    ctx.fillStyle = this.color.canvasGradient(ctx);
  else ctx.fillStyle = this.color.toString();
  return ctx;
}
iio.Drawable.prototype.prep_ctx_outline = function(ctx){
  if(this.outline instanceof iio.Gradient)
    ctx.strokeStyle = this.outline.canvasGradient(ctx);
  else ctx.strokeStyle = this.outline.toString();
  return ctx;
}
iio.Drawable.prototype.prep_ctx_lineWidth = function(ctx){
  ctx.lineWidth = this.lineWidth || 1;
  return ctx;
}
iio.Drawable.prototype.prep_ctx_shadow = function(ctx){
  ctx.shadowColor = this.shadow.toString();
  if(this.shadowBlur) ctx.shadowBlur = this.shadowBlur;
  if(this.shadowOffset) {
    ctx.shadowOffsetX = this.shadowOffset.x;
    ctx.shadowOffsetY = this.shadowOffset.y;
  } else {
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
  }
  return ctx;
}
iio.Drawable.prototype.prep_ctx_dash = function(ctx){
  if(this.dashOffset) ctx.lineDashOffset = this.dashOffset
  ctx.setLineDash(this.dash);
  return ctx;
}
iio.Drawable.prototype.finish_path_shape = function(ctx){
  if (this.color) ctx.fill();
  if (this.img) ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
} 
iio.Drawable.prototype.draw_obj = function(ctx){
  ctx.save();
  if(this.alpha) ctx.globalAlpha = this.alpha;
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
  ctx = this.orient_ctx(ctx);
  
  //draw objs in z index order
  if (this.objs&&this.objs.length > 0) {
    var drawnSelf = false;
    for(var i=0; i<this.objs.length; i++){
      if (!drawnSelf && this.objs[i].z >= this.z) {
        this.draw_obj(ctx);
        drawnSelf = true;
      } 
      if (this.objs[i].draw) 
        this.objs[i].draw(ctx);
    }
    if (!drawnSelf) this.draw_obj(ctx);
  } 
  //draw
  else this.draw_obj(ctx);
  ctx.restore();
}
iio.Drawable.prototype.draw_line = function(ctx, x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}