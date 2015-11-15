/* Shape
------------------
*/

// DEFINITION
iio.Shape = function(){ this.Shape.apply(this, arguments) }
iio.inherit(iio.Shape, iio.Drawable);
iio.Shape.prototype._super = iio.Drawable.prototype;

// CONSTRUCTOR
iio.Shape.prototype.Shape = function() {
  iio.Shape.prototype._super.Drawable.call(this,arguments[0]);
}

// OVERRIDE FUNCTIONS
iio.Shape.prototype.convert_props = function(){
  iio.Shape.prototype._super.convert_props.call(this, iio.merge_args(arguments));

  // convert string colors to iio.Color
  iio.convert.property.color(this,"outline");
  iio.convert.property.color(this,"shadow");

  // convert values to arrays
  if(this.dash && !(this.dash instanceof Array))
    this.dash = [this.dash];

  // arrays to iio.Vector
  iio.convert.property.vector(this,"pos");
  iio.convert.property.vector(this,"origin");
  iio.convert.property.vector(this,"vel");
  iio.convert.property.vector(this,"acc");
  iio.convert.property.vector(this,"shadowOffset");
  iio.convert.property.vector(this,"res");
  iio.convert.property.vectors(this,"vs");
  iio.convert.property.vectors(this,"vels");
  iio.convert.property.vectors(this,"accs");
  iio.convert.property.vectors(this,"bezier");
  iio.convert.property.vectors(this,"bezierVels");
  iio.convert.property.vectors(this,"bezierAccs");

  // set required properties
  if(typeof this.fade !== 'undefined' && typeof this.alpha === 'undefined')
    this.alpha = 1;
  if(typeof this.rAcc !== 'undefined' && !this.rVel) 
    this.rVel = 0;
  if(typeof this.rVel !== 'undefined' && !this.rotation) 
    this.rotation = 0;
  if(this.accs && !this.vels){
    this.vels = [];
    for(var i=0; i<this.accs.length; i++)
      this.vels.push(new iio.Vector);
  }
  if(this.bezierAccs && !this.bezierVels){
    this.bezierVels = [];
    for(var i=0; i<this.bezierAccs.length; i++)
      this.bezierVels.push(new iio.Vector);
  }
  if(this.bezierVels && !this.bezier){
    this.bezier = [];
    for(var i=0; i<this.bezierVels.length; i++)
      this.bezier.push(new iio.Vector);
  }

  // handle image attachment
  if (this.img){
    if(iio.is.string(this.img)) {
      var src = this.img;
      this.img = new Image();
      this.img.src = src;
      this.img.parent = this;
      var o = this;
      if (!this.size()){
        this.img.onload = function(e) {
          o.setSize(o.img.width || 0, o.img.height || 0);
          if(o.app) o.app.draw()
        }
      } else this.img.onload = function(e) {
        if(o.app) o.app.draw()
      }
    } else {
      if (!this.size()) {
        this.setSize(this.img.width || 0, this.img.height || 0);
        if(this.app) this.app.draw()
      }
    }
  }

  // handle anim attachment
  if(this.anims){
    this.animFrame = this.animFrame || 0;
  }
}

// BOUNDS FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.left = function(){
  if (this.pos) return this.pos.x; 
  else return 0
}
iio.Shape.prototype.right = function(){
  if (this.pos) return this.pos.x;
  else return 0
}
iio.Shape.prototype.top = function(){
  if (this.pos) return this.pos.y;
  else return 0
}
iio.Shape.prototype.bottom = function(){
  if (this.pos) return this.pos.y;
  else return 0
}
iio.Shape.prototype.resolve = function(b, c) {
  if (b.callback) return b.callback(c);
  return true;
}
iio.Shape.prototype.over_upper_limit = function(bnd, val, c) {
  if ( iio.is.number(bnd) && val > bnd 
   || typeof bnd.bound !== 'undefined' && val > bnd.bound ) 
    return this.resolve(bnd, c);
  return false;
}
iio.Shape.prototype.below_lower_limit = function(bnd, val, c) {
  if ( iio.is.number(bnd) && val < bnd
   || typeof bnd.bound !== 'undefined' && val < bnd.bound ) 
    return this.resolve(bnd, c);
  return false;
}

// UPDATE FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.update = function() {

  // transform and remove Shapeect if necessary
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
  if (this.vels && this.vs) this.update_vels();
  if (this.bezierAccs) this.update_bezier_accs();
  if (this.bezierVels) this.update_bezier_vels();

  if (this.onUpdate) this.onUpdate(this);
}
iio.Shape.prototype.update_vel = function(){
  if(this.pos){
    if (this.vel.x) this.pos.x += this.vel.x;
    if (this.vel.y) this.pos.y += this.vel.y;
  } else if(this.vs)
    for(var i=0; i<this.vs.length; i++){
      if (this.vel.x) this.vs[i].x += this.vel.x;
      if (this.vel.y) this.vs[i].y += this.vel.y;
    }
}
iio.Shape.prototype.update_vels = function(){
  for(var i=0; i<this.vels.length; i++){
    if (this.vels[i].x) this.vs[i].x += this.vels[i].x;
    if (this.vels[i].y) this.vs[i].y += this.vels[i].y;
  }
}
iio.Shape.prototype.update_bezier_vels = function(){
  for(var i=0; i<this.bezierVels.length; i++){
    if (this.bezierVels[i].x) this.bezier[i].x += this.bezierVels[i].x;
    if (this.bezierVels[i].y) this.bezier[i].y += this.bezierVels[i].y;
  }
}
iio.Shape.prototype.update_bezier_accs = function(){
  for(var i=0; i<this.bezierAccs.length; i++){
    if (this.bezierAccs[i].x) this.bezierVels[i].x += this.bezierAccs[i].x;
    if (this.bezierAccs[i].y) this.bezierVels[i].y += this.bezierAccs[i].y;
  }
}
iio.Shape.prototype.update_rotation = function(){
  this.rotation += this.rVel;
  if(this.rotation > 6283 || this.rotation < -6283)
    this.rotation = 0;
}
iio.Shape.prototype.update_acc = function(){
  this.vel.x += this.acc.x;
  this.vel.y += this.acc.y;
}
iio.Shape.prototype.update_accs = function(){
  for(var i=0; i<this.accs.length; i++){
    if (this.accs[i].x) this.vels[i].x += this.accs[i].x;
    if (this.accs[i].y) this.vels[i].y += this.accs[i].y;
  }
}
iio.Shape.prototype.update_shrink = function(){
  if (this.shrink.speed)
    return this._shrink(this.shrink.speed, this.shrink.callback);
  else return this._shrink(this.shrink);
}
iio.Shape.prototype.update_fade = function(){
  if (this.fade.speed)
    return this._fade(this.fade.speed, this.fade.callback);
  else return this._fade(this.fade);
}
iio.Shape.prototype.past_bounds = function(){
  if (this.bounds.right
   && this.over_upper_limit(this.bounds.right, this.right(), this))
    return true;
  if (this.bounds.left
   && this.below_lower_limit(this.bounds.left, this.left(), this))
    return true;
  if (this.bounds.top
   && this.below_lower_limit(this.bounds.top, this.top(), this))
    return true;
  if (this.bounds.bottom
   && this.over_upper_limit(this.bounds.bottom, this.bottom(), this))
    return true;
  if (this.bounds.rightRotation
   && this.over_upper_limit(this.bounds.rightRotation, this.rotation, this))
    return true;
  if (this.bounds.leftRotation
   && this.below_lower_limit(this.bounds.leftRotation, this.rotation, this))
    return true;
  return false;
}

// ANIMATION FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.playAnim = function() {
  var args = iio.merge_args(arguments);
  if (args.name) this.setSprite(args.name);
  this.animFrame = args.startFrame || 0;
  this.animRepeats = args.repeat;
  this.onAnimComplete = args.onAnimComplete;
  var loop;
  if (args.fps > 0) loop = this.loop(args.fps, this.nextFrame);
  else if (args.fps < 0) loop = this.loop(args.fps * -1, this.prevFrame);
  else this.app.draw();
  return this;
}
iio.Shape.prototype.stopAnim = function() {
  iio.cancelLoops(this);
  return this;
}
iio.Shape.prototype.setSprite = function(s, noDraw) {
  iio.cancelLoops(this);
  if (iio.is.string(s)) {
    var o = this;
    this.anims.some(function(anim, i) {
      if (anim.name === s) {
        o.animFrame = 0;
        o.animKey = i;
        o.width = anim.frames[o.animFrame].w;
        o.height = anim.frames[o.animFrame].h;
        return true;
      }
      return false;
    });
  } else {
    this.anims.splice(0,0,s);
    this.animKey = 0;
    this.animFrame = 0;
    this.width = s.frames[0].w;
    this.height = s.frames[0].h;
  }
  if(noDraw);
  else o.app.draw();
  return this;
}
iio.Shape.prototype.nextFrame = function(o) {
  o.animFrame++;
  if (o.animFrame >= o.anims[o.animKey].frames.length) {
    o.animFrame = 0;
    if (typeof o.animRepeats !== 'undefined') {
      if (o.animRepeats <= 1) {
        window.cancelAnimationFrame(id);
        window.clearTimeout(id);
        if (o.onAnimComplete) o.onAnimComplete(o);
        return;
      } else o.animRepeats--;
    }
  }
}
iio.Shape.prototype.prevFrame = function(o) {
  o.animFrame--;
  if (o.animFrame < 0)
    o.animFrame = o.anims[o.animKey].frames.length - 1;
  o.app.draw();
}
iio.Shape.prototype._shrink = function(s, r) {
  this.width *= 1 - s;
  this.height *= 1 - s;
  if (this.width < .02 
    || this.width < this.shrink.lowerBound 
    || this.width > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}
iio.Shape.prototype._fade = function(s, r) {
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

// DRAW FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.orient_ctx = function(ctx){
  ctx = ctx || this.app.ctx;
  ctx.save();

  //translate & rotate
  if (this.pos){
    if (this.imageRounding)
      ctx.translate(Math.floor(this.pos.x), Math.floor(this.pos.y));
    else ctx.translate(this.pos.x, this.pos.y); 
  }
  if(this.rotation){
    if (this.origin){
      if (this.imageRounding)
        ctx.translate(Math.floor(this.origin.x), Math.floor(this.origin.y));
      else ctx.translate(this.origin.x, this.origin.y);
    }
    ctx.rotate(this.rotation);
    if (this.origin){
      if (this.imageRounding)
        ctx.translate(Math.floor(-this.origin.x), Math.floor(-this.origin.y));
      else ctx.translate(-this.origin.x, -this.origin.y);
    }
  }
  if(this.flip){
    if(this.flip.indexOf('x') > -1)
      ctx.scale(-1, 1);
    if(this.flip.indexOf('y') > -1)
      ctx.scale(1, -1);
  }
  return ctx;
}
iio.Shape.prototype.prep_ctx_color = function(ctx){
  if(this.color instanceof iio.Gradient)
    ctx.fillStyle = this.color.canvasGradient(ctx);
  else ctx.fillStyle = this.color.rgbaString();
  return ctx;
}
iio.Shape.prototype.prep_ctx_outline = function(ctx){
  if(this.outline instanceof iio.Gradient)
    ctx.strokeStyle = this.outline.canvasGradient(ctx);
  else ctx.strokeStyle = this.outline.rgbaString();
  return ctx;
}
iio.Shape.prototype.prep_ctx_lineWidth = function(ctx){
  ctx.lineWidth = this.lineWidth || 1;
  return ctx;
}
iio.Shape.prototype.prep_ctx_shadow = function(ctx){
  ctx.shadowColor = this.shadow.rgbaString();
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
iio.Shape.prototype.prep_ctx_dash = function(ctx){
  if(this.dashOffset) ctx.lineDashOffset = this.dashOffset
  ctx.setLineDash(this.dash);
  return ctx;
}
iio.Shape.prototype.finish_path_shape = function(ctx){
  if (this.color) ctx.fill();
  if (this.img) {
    if (this.imageRounding)
      ctx.drawImage(this.img,
        Math.floor(-this.width/2),
        Math.floor(-this.height/2),
        Math.floor(this.width),
        Math.floor(this.height));
    else ctx.drawImage(this.img,
      -this.width/2,
      -this.height/2,
      this.width,
      this.height);
  }
  if (this.anims) {
    if (this.imageRounding)
      ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
        this.anims[this.animKey].frames[this.animFrame].x,
        this.anims[this.animKey].frames[this.animFrame].y,
        this.anims[this.animKey].frames[this.animFrame].w,
        this.anims[this.animKey].frames[this.animFrame].h,
        Math.floor(-this.width/2),
        Math.floor(-this.height/2),
        Math.floor(this.width),
        Math.floor(this.height));
    else ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
        this.anims[this.animKey].frames[this.animFrame].x,
        this.anims[this.animKey].frames[this.animFrame].y,
        this.anims[this.animKey].frames[this.animFrame].w,
        this.anims[this.animKey].frames[this.animFrame].h,
      -this.width/2,
      -this.height/2,
      this.width,
      this.height);
  }
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
} 
iio.Shape.prototype.draw_obj = function(ctx){
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
  if ((this.img || this.anims) && !this.noImageSmoothing) {
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  }
  if(this.draw_shape) this.draw_shape(ctx);
  ctx.restore();
}
iio.Shape.prototype.draw = function(ctx){

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
      if (this.objs[i].draw
       && (!this.clipObjs 
        || (this.objs[i].right() > this.localLeft()
         && this.objs[i].left() < this.localRight()
         && this.objs[i].bottom() > this.localTop()
         && this.objs[i].top() < this.localBottom()))) 
        this.objs[i].draw(ctx);
    }
    if (!drawnSelf) this.draw_obj(ctx);
  } 
  //draw
  else this.draw_obj(ctx);
  ctx.restore();
}