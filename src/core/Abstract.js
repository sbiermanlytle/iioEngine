/* Abstract
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
*/

// DEFINITION
iio.Abstract = function(){ this.Abstract.apply(this, arguments) }

// CONSTRUCTOR
iio.Abstract.prototype.Abstract = function() {
  this.set(arguments[0], true);
}

// FUNCTIONS
//-------------------------------------------------------------------
iio.Abstract.prototype.set = function() {
  for (var p in arguments[0]) this[p] = arguments[0][p];
  if( this.convert_props ) this.convert_props();
}
iio.Abstract.prototype.clone = function() {
	return new this.constructor( this );
}
iio.Abstract.prototype.toString = function() {
	var str = '';
  for (var p in this) {
  	/*if( typeof this[p] === 'function')
  		str += p + ' = function\n ';
  	else str += p + ' = ' + this[p] + '\n';*/
  	if (this[p] instanceof Array)
  		str += p + ' = Array['+this[p].length+']\n'
  	else if( typeof this[p] !== 'function' 
  		&& p != '_super' )
  		str += p + ' = ' + this[p] + '\n';
  }
  return str;
}