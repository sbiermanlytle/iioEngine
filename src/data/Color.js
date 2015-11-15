/* Color
------------------
*/

// DEFINITION
iio.Color = function(){ this.Color.apply(this, arguments) };
iio.inherit(iio.Color, iio.Interface);
iio.Color.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Color.prototype.Color = function(r,g,b,a) {
  if (iio.is.string(r) && typeof b === undefined && typeof a === undefined) {
    if (iio.Color[r]) {
      // Input of Constant color: new iio.Color('white')
      var c = new iio.Color[r]();
      this.r = c.r;
      this.g = c.g;
      this.b = c.b;
      this.a = c.a;
    } else {
      // Input of hex color: new iio.Color("#FFF", 0.5)
      var hex = iio.Color.hexToRgb(r);
      a = g;
      r = hex.r;
      g = hex.g;
      b = hex.b;
    }
  } else {
    // Input of RGBA color: new iio.Color(255, 255, 255, 1)
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;
  }
  return this;
}

// STATIC FUNCTIONS
//------------------------------------------------------------
iio.Color.invert = function(c){ return new iio.Color(255-c.r,255-c.g,255-c.b,c.a) }
iio.Color.random = function(){
  return new iio.Color(iio.randomInt(0,255),iio.randomInt(0,255),iio.randomInt(0,255))
}
iio.Color.hexToRgb = function(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
iio.Color.rgbToHex = function(r, g, b) {
  // TODO https://drafts.csswg.org/css-color/#hex-notation CSS4 will support 8 digit hex string (#RRGGBBAA)
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// COLOR FUNCTIONS
//------------------------------------------------------------
iio.Color.prototype.clone = function() {
  return new iio.Color( this.r, this.g, this.b, this.a );
}
iio.Color.prototype.rgbaString = function(){
  return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
}
iio.Color.prototype.hexString = function() {
  return iio.Color.rgbToHex(this.r, this.g, this.b);
}
iio.Color.prototype.invert = function(){
  this.r = 255-this.r;
  this.g = 255-this.g;
  this.b = 255-this.b;
  return this;
}
iio.Color.prototype.randomize = function(alpha){
  this.r = iio.randomInt(0,255);
  this.g = iio.randomInt(0,255);
  this.b = iio.randomInt(0,255);
  if(alpha) this.a = iio.random();
  return this;
}

// COLOR CONSTANTS
//------------------------------------------------------------
// standard colors
iio.Color.transparent = function(){ return new iio.Color(0,0,0,0) }
iio.Color.iioblue = function(){ return new iio.Color(0,186,255) }
iio.Color.black = function(){ return new iio.Color(0,0,0) }
iio.Color.white = function(){ return new iio.Color(255,255,255) }
iio.Color.gray = function(){ return new iio.Color(128,128,128) }
iio.Color.red = function(){ return new iio.Color(255,0,0) }
iio.Color.green = function(){ return new iio.Color(0,128,0) }
iio.Color.blue = function(){ return new iio.Color(0,0,255) }
// CSS colors
iio.Color.aliceblue = function(){ return new iio.Color(240,248,255) }
iio.Color.antiquewhite = function(){ return new iio.Color(250,235,215) }
iio.Color.aqua = function(){ return new iio.Color(0,255,255) }
iio.Color.aquamarine = function(){ return new iio.Color(127,255,212) }
iio.Color.azure = function(){ return new iio.Color(240,255,255) }
iio.Color.beige = function(){ return new iio.Color(245,245,220) }
iio.Color.bisque = function(){ return new iio.Color(255,228,196) }
iio.Color.blanchedalmond = function(){ return new iio.Color(255,235,205) }
iio.Color.blueviolet = function(){ return new iio.Color(138,43,226) }
iio.Color.brown = function(){ return new iio.Color(165,42,42) }
iio.Color.burlywood = function(){ return new iio.Color(222,184,135) }
iio.Color.lime = function(){ return new iio.Color(0,255,0) }
iio.Color.fuchsia = function(){ return new iio.Color(255,0,255) }
iio.Color.maroon = function(){ return new iio.Color(128,0,0) }
iio.Color.navy = function(){ return new iio.Color(0,0,128) }
iio.Color.olive = function(){ return new iio.Color(128,128,0) }