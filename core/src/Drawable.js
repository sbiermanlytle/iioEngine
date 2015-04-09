
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
iio.Drawable.prototype.resolve = function(b, c) {
  if (b.length > 1) return b[1](c);
  return true;
}
iio.Drawable.prototype.over_upper_limit = function(bnd, lim, c) {
  if (lim > bnd[0]) return this.resolve(bnd, c);
  return false;
}
iio.Drawable.prototype.below_lower_limit = function(bnd, lim, c) {
  if (lim < bnd[0]) return this.resolve(bnd, c);
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
  if (this.rVel) this.update_rotation();
  if (this.vels) this.update_vels();

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
  }
  if(this.vs){
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
iio.Drawable.prototype.update_rotation = function(){
  this.rotation += this.rVel;
  if(this.rotation > 6283 || this.rotation < -6283) this.rotation = 0;
}
iio.Drawable.prototype.update_acc = function(){
  this.vel.x += this.acc.x;
  this.vel.y += this.acc.y;
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
  if (this.bounds.right && this.over_upper_limit(this.bounds.right, this.pos.x, this)) return true;
  if (this.bounds.left && this.below_lower_limit(this.bounds.left, this.pos.x, this)) return true;
  if (this.bounds.top && this.below_lower_limit(this.bounds.top, this.pos.y, this)) return true;
  if (this.bounds.bottom && this.over_upper_limit(this.bounds.bottom, this.pos.y, this)) return true;
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
  if (this.width < .02) {
    if (r) return r(this);
    else return true;
  }
},
iio.Drawable.prototype._fade = function(s, r) {
  this.alpha *= 1 - s;
  if (this.alpha < .002) {
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
  return ctx;
}
iio.Drawable.prototype.prep_ctx_color = function(ctx){
  //if (o.color.indexOf && o.color.indexOf('gradient') > -1)
    //o.color = o.createGradient(ctx, o.color);
  ctx.fillStyle = this.color.toString();
  return ctx;
}
iio.Drawable.prototype.prep_ctx_outline = function(ctx){
  //if (o.outline.indexOf && o.outline.indexOf('gradient') > -1)
    //o.outline = o.createGradient(ctx, o.outline);
  ctx.strokeStyle = o.outline.toString();
  return ctx;
}
iio.Drawable.prototype.prep_ctx_lineWidth = function(ctx){
  ctx.lineWidth = o.lineWidth || 1;
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
iio.Drawable.prototype.draw_line = function(ctx, x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}