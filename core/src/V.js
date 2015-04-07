
//DEFINITION
iio.V = function(){ this.V.apply(this, arguments) };

//CONSTRUCTOR
iio.V.prototype.V = function(v,y) {
	this.x = v.x || v[0] || v || 0;
	this.y = v.y || v[1] || y || 0;
}

//STATIC FUNCTIONS
iio.V.add = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] += v2[p];
	return v1
}
iio.V.sub = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] -= v2[p];
	return v1
}
iio.V.mult = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] *= v2[p];
	return v1
}
iio.V.div = function(v1, v2) {
	for (var p in v2)
	  if (v1[p]) v1[p] /= v2[p];
	return v1
}
iio.V.dist = function(v1, v2) {
	return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
}