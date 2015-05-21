/* Abstract
------------------
iio.js version 1.4
---------------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2014, Sebastian Bierman-Lytle
All rights reserved.
*/

//DEFINITION
iio.Abstract = function(){ this.Abstract.apply(this, arguments) }

//CONSTRUCTOR
iio.Abstract.prototype.Abstract = function() {
  this.set(arguments[0]);
}

//FUNCTIONS
//-------------------------------------------------------------------
/* set( p0, p1, ... )
assigns the property and value of each given object to this object, 
and converts shorthand declarations into correct property data types
 */
iio.Abstract.prototype.set = function() {
  for (var p in arguments[0]) this[p] = arguments[0][p];
  if( this.convert_props ) this.convert_props();
}

/* clone()
returns a deep copy of this object (a new object with equal properties)
*/
iio.Abstract.prototype.clone = function() {
	return new this.constructor( this );
}

/* toString()
returns a string that lists all properties and values in this object.
*/
iio.Abstract.prototype.toString = function() {
	var str = '';
  for (var p in this) {
  	if( typeof this[p] === 'function')
  		str += p + ' = function\n ';
  	else str += p + ' = ' + this[p] + '\n';
  }
  return str;
}