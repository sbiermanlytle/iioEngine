
//DEFINITION
iio.Polygon = function(){ this.Polygon.apply(this, arguments) };
iio.inherit(iio.Polygon, iio.Shape);
iio.Polygon.prototype._super = iio.Shape.prototype;

//CONSTRUCTOR
iio.Polygon.prototype.Polygon = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
}

//POSITION FUNCTIONS
iio.Polygon.prototype.width = function(){ 
  return this.right() - this.left() 
}
iio.Polygon.prototype.height = function(){ 
  return this.bottom() - this.top() 
}
iio.Polygon.prototype.left = function(){ 
  return iio.specVec( this.globalVs(),
    function(v1,v2){
      if(v1.x>v2.x)
        return true;
      return false
    }).x 
}
iio.Polygon.prototype.right = function(){ 
  return iio.specVec( this.globalVs(),
    function(v1,v2){
      if(v1.x<v2.x)
        return true;
      return false
    }).x 
}
iio.Polygon.prototype.top = function(){ 
  return iio.specVec( this.globalVs(),
    function(v1,v2){
      if(v1.y>v2.y)
        return true;
      return false}).y
}
iio.Polygon.prototype.bottom = function(){ 
  return iio.specVec( this.globalVs(),
    function(v1,v2){
      if(v1.y<v2.y)
        return true;
      return false}).y
}
iio.Polygon.prototype.globalVs = function() {
  var vs = [];
  for(var i=0;i<this.vs.length;i++){
    var v = this.vs[i].clone();
    this.localizeRotation(v);
    if(this.pos){
      v.x += this.pos.x;
      v.y += this.pos.y;
    }
    vs[i]=v;
  }
  return vs;
}
iio.Polygon.prototype.contains = function(v, y) {
  v = this.localize(v,y);
  var i = j = c = 0;
  var vs = this.vs;
  for (i = 0, j = this.vs.length - 1; i < this.vs.length; j = i++) {
    if (((this.vs[i].y > v.y) != (this.vs[j].y > v.y)) &&
      (v.x < (this.vs[j].x - this.vs[i].x) * (v.y - this.vs[i].y) / (this.vs[j].y - this.vs[i].y) + this.vs[i].x))
      c = !c;
  }
  return c;
}

//FUNCTIONS
iio.Polygon.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.vs[0].x, this.vs[0].y);
  if (this.bezier) {
    var _i = 0;
    for (var i = 1; i < this.vs.length; i++)
      ctx.this.bezierCurveTo(this.bezier[_i++] || this.vs[i - 1].x, 
        this.bezier[_i++] || this.vs[i - 1].y, 
        this.bezier[_i++] || this.vs[i].x, 
        this.bezier[_i++] || this.vs[i].y,
         this.vs[i].x, this.vs[i].y);
    if (!this.open) {
      i--;
      ctx.this.bezierCurveTo(this.bezier[_i++] || this.vs[i].x,
       this.bezier[_i++] || this.vs[i].y,
       this.bezier[_i++] || 0,
       this.bezier[_i++] || 0,
       0, 0);
    }
  } else for(var i=1; i<this.vs.length; i++)
    ctx.lineTo(this.vs[i].x, this.vs[i].y);
  if (typeof(this.open) == 'undefined' || !this.open)
    ctx.closePath();
  this.finish_path_shape(ctx);
}