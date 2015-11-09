/* Vector
------------------
*/

// DEFINITION
iio.Vector = function(){ this.Vector.apply(this, arguments) };
iio.inherit(iio.Vector, iio.Interface);
iio.Vector.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Vector.prototype.Vector = function( v,y ) {
  if(v instanceof Array){
    this.x = v[0] || 0;
    this.y = v[1] || 0;
  } else if( v && v.x ) {
    this.x = v.x || 0;
    this.y = v.y || 0;
  } else {
    this.x = v || 0;
    this.y = y || 0;
  }
}

// OVERRIDE FUNCTIONS
iio.Vector.prototype.clone = function(){
  return new iio.Vector(this.x,this.y)
}

// STATIC FUNCTIONS
//------------------------------------------------------------
iio.Vector.vs = function ( points ){
  var vs = [];
  if (!(points instanceof Array)) points = [points];
  for (var i = 0; i < points.length; i++) {
    if (typeof points[i].x !== 'undefined')
      vs.push(points[i]);
    else {
      vs.push({
        x: points[i],
        y: points[i + 1]
      });
      i++;
    }
  }
  return vs;
}
iio.Vector.leftmost = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.x>v2.x }).x
}
iio.Vector.rightmost = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.x<v2.x }).x 
}
iio.Vector.highest = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.y>v2.y }).y
}
iio.Vector.lowest = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.y<v2.y }).y
}
iio.Vector.add = function(){
  var v = new iio.Vector();
  for (var v2 in arguments){
    v.x += v2.x;
    v.y += v2.y;
  }
  return v
}
iio.Vector.sub = function(){
  var v = arguments[0].clone();
  for (var i=1; i<arguments.length; i++){
    v.x -= arguments[i].x;
    v.y -= arguments[i].y;
  }
  return v
}
iio.Vector.mult = function( v1,f ){
  var v = v1.clone();
  for (var p in v1)
    v[p] *= f;
  return v
}
iio.Vector.div = function( v1,v2 ){
  var v = v1.clone();
  for (var p in v2)
    if (v[p]) v[p] /= v2[p];
  return v
}
iio.Vector.length = function( v,y ){
  if (typeof v.x !== 'undefined')
     return Math.sqrt(v.x*v.x+v.y*v.y);
  else return Math.sqrt(v*v+y*y);
}
iio.Vector.normalize = function( v,y ){
  return new iio.Vector(v,y).normalize();
}
iio.Vector.dot = function ( v1,v2,x2,y2 ){
  if (typeof v1.x != 'undefined'){
    if (typeof v2.x != 'undefined')
      return v1.x*v2.x+v1.y*v2.y;
    else return v1.x*v2+v1.y*x2;
  } else {
    if (typeof x2.x != 'undefined')
      return v1*x2.x+v2*x2.y;
    else return v1*x2+v2*y2;
  }
}
iio.Vector.dist = function( v1,v2 ){
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
}
iio.Vector.lerp = function( v1,v2,x2,y2,p ){
  if (typeof v1.x != 'undefined')
    return new iio.Vector(v1).lerp(v2,x2,y2);
  else return new iio.Vector(v1,v2).lerp(x2, y2, p);
}
iio.Vector.rotate = function( x,y,r ){
  if (typeof x.x != 'undefined') {
    r = y;
    y = x.y;
    x = x.x;
  }
  if (typeof r == 'undefined' || r == 0) 
    return new iio.Vector(x,y);
  var newX = x * Math.cos(r) - y * Math.sin(r);
  var newY = y * Math.cos(r) + x * Math.sin(r);
  return new iio.Vector(newX,newY);
}

// VECTOR FUNCTIONS
//------------------------------------------------------------
iio.Vector.prototype.add = function( v,y ){
  if (typeof v.x !== 'undefined'){
    this.x += v.x;
    this.y += v.y;
  } else {
    this.x += v;
    this.y += y;
  }
  return this;
}
iio.Vector.prototype.sub = function( v,y ){
  if (typeof v.x !== 'undefined'){
    this.x -= v.x;
    this.y -= v.y;
  } else {
    this.x -= v;
    this.y -= y;
  }
  return this;
}
iio.Vector.prototype.mult = function( f ){
  this.x *= f;
  this.y *= f;
  return this;
}
iio.Vector.prototype.div = function( f ){
  this.x /= f;
  this.y /= f;
  return this;
}
iio.Vector.prototype.length = function(){
  return Math.sqrt(this.x*this.x+this.y*this.y);
}
iio.Vector.prototype.normalize = function (){
  return this.div(this.length());
}
iio.Vector.prototype.dot = function ( v,y ){
  if (typeof v.x !== 'undefined')
    return this.x*v.x+this.y*v.y;
  return this.x*v+this.y*y;
}
iio.Vector.prototype.equals = function( v,y ){
  if( v.x ) return this.x === v.x && this.y === v.y;
  return this.x === x && this.y === y;
}
iio.Vector.prototype.dist = function( v,y ){
  if (typeof v.x !== 'undefined')
    return Math.sqrt((v.x-this.x)*(v.x-this.x)+(v.y-this.y)*(v.y-this.y));
  return Math.sqrt((x-this.x)*(x-this.x)+(y-this.y)*(y-this.y));
}
iio.Vector.prototype.lerp = function( v,y,p ){
  if (typeof v.x !== 'undefined')
    this.add(iio.Vector.sub(v,this).mult(y));
  else this.add(iio.Vector.sub(v,y,this).mult(p));
  return this;
}
iio.Vector.prototype.rotate = function( r ){
  if (!r) return this;
  var x = this.x;
  var y = this.y;
  this.x = x * Math.cos(r) - y * Math.sin(r);
  this.y = y * Math.cos(r) + x * Math.sin(r);
  return this;
}