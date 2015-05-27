/* Vector
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
*/

//DEFINITION
iio.Vector = function(){ this.Vector.apply(this, arguments) };
iio.inherit(iio.Vector, iio.Interface);
iio.Vector.prototype._super = iio.Interface.prototype;

//CONSTRUCTOR
iio.Vector.prototype.Vector = function(v,y) {
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

//STATIC FUNCTIONS
//------------------------------------------------------------
iio.Vector.add = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] += v2[p];
	return v1
}
iio.Vector.sub = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] -= v2[p];
	return v1
}
iio.Vector.mult = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] *= v2[p];
	return v1
}
iio.Vector.div = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] /= v2[p];
	return v1
}
iio.Vector.dist = function(v1, v2) {
	return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
}

// MEMBER FUNCTIONS
//------------------------------------------------------------
iio.Vector.prototype.clone = function(){
	return new iio.Vector(this.x,this.y)
}
iio.Vector.prototype.sub = function( x, y ){
	y = y || x.y;
	x = x.x || x;
	this.x -= x;
	this.y -= y;
	return this;
}
iio.Vector.prototype.equals = function( x, y ){
	if( x.x ) return this.x === x.x && this.y === x.y;
	else return this.x === x && this.y === y;
}