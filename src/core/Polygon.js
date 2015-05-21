
//DEFINITION
iio.Polygon = function(){ this.Polygon.apply(this, arguments) };
iio.inherit(iio.Polygon, iio.Shape);
iio.Polygon.prototype._super = iio.Shape.prototype;

//CONSTRUCTOR
iio.Polygon.prototype.Polygon = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
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
iio.Polygon.prototype.contains = function(v, y) {
  y = (v.y || y);
  v = (v.x || v);
  var i = j = c = 0;
  var vs = this.vs;
  if (this.rotation) vs = this.globalVs();
  for (i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    if (((vs[i].y > y) != (vs[j].y > y)) &&
      (v < (vs[j].x - vs[i].x) * (y - vs[i].y) / (vs[j].y - vs[i].y) + vs[i].x))
      c = !c;
  }
  return c;
}
iio.Polygon.prototype.globalVs = function() {
  var vList=[]; var x,y;
  for(var i=0;i<this.vs.length;i++){
     x=this.vs[i].x;
     y=this.vs[i].y;
     var v = iio.point.rotate(x,y,this.rotation);
     v.x+=this.pos.x;
     v.y+=this.pos.y;
     vList[i]=v;
  }
  return vList;
}
iio.Polygon.prototype.size = function(){ 
  return this.right() - this.left() 
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