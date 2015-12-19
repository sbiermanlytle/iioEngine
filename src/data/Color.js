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
// iio colors
iio.Color.transparent = function(){ return new iio.Color(0,0,0,0) }
iio.Color.iioblue = function(){ return new iio.Color(0,186,255) }
// CSS standard colors
iio.Color.aliceblue = function(){ return new iio.Color(240,248,255) }
iio.Color.antiquewhite = function(){ return new iio.Color(250,235,215) }
iio.Color.aqua = function(){ return new iio.Color(0,255,255) }
iio.Color.aquamarine = function(){ return new iio.Color(127,255,212) }
iio.Color.azure = function(){ return new iio.Color(240,255,255) }
iio.Color.beige = function(){ return new iio.Color(245,245,220) }
iio.Color.bisque = function(){ return new iio.Color(255,228,196) }
iio.Color.black = function(){ return new iio.Color(0,0,0) }
iio.Color.blanchedalmond = function(){ return new iio.Color(255,235,205) }
iio.Color.blue = function(){ return new iio.Color(0,0,255) }
iio.Color.blueviolet = function(){ return new iio.Color(138,43,226) }
iio.Color.brown = function(){ return new iio.Color(165,42,42) }
iio.Color.burlywood = function(){ return new iio.Color(222,184,135) }
iio.Color.cadetblue = function(){ return new iio.Color(95,158,160) }
iio.Color.chartreuse = function(){ return new iio.Color(127,255,0) }
iio.Color.chocolate = function(){ return new iio.Color(210,105,30) }
iio.Color.coral = function(){ return new iio.Color(255,127,80) }
iio.Color.cornflowerblue = function(){ return new iio.Color(100,149,237) }
iio.Color.cornsilk = function(){ return new iio.Color(255,248,220) }
iio.Color.crimson = function(){ return new iio.Color(220,20,60) }
iio.Color.cyan = function(){ return new iio.Color(0,255,255) }
iio.Color.darkblue = function(){ return new iio.Color(0,0,139) }
iio.Color.darkcyan = function(){ return new iio.Color(0,139,139) }
iio.Color.darkgoldenrod = function(){ return new iio.Color(184,134,11) }
iio.Color.darkgray = function(){ return new iio.Color(169,169,169) }
iio.Color.darkgreen = function(){ return new iio.Color(0,100,0) }
iio.Color.darkgrey = function(){ return new iio.Color(169,169,169) }
iio.Color.darkkhaki = function(){ return new iio.Color(189,183,107) }
iio.Color.darkmagenta = function(){ return new iio.Color(139,0,139) }
iio.Color.darkolivegreen = function(){ return new iio.Color(85,107,47) }
iio.Color.darkorange = function(){ return new iio.Color(255,140,0) }
iio.Color.darkorchid = function(){ return new iio.Color(153,50,204) }
iio.Color.darkred = function(){ return new iio.Color(139,0,0) }
iio.Color.darksalmon = function(){ return new iio.Color(233,150,122) }
iio.Color.darkseagreen = function(){ return new iio.Color(143,188,143) }
iio.Color.darkslateblue = function(){ return new iio.Color(72,61,139) }
iio.Color.darkslategray = function(){ return new iio.Color(47,79,79) }
iio.Color.darkslategrey = function(){ return new iio.Color(47,79,79) }
iio.Color.darkturquoise = function(){ return new iio.Color(0,206,209) }
iio.Color.darkviolet = function(){ return new iio.Color(148,0,211) }
iio.Color.deeppink = function(){ return new iio.Color(255,20,147) }
iio.Color.deepskyblue = function(){ return new iio.Color(0,191,255) }
iio.Color.dimgray = function(){ return new iio.Color(105,105,105) }
iio.Color.dimgrey = function(){ return new iio.Color(105,105,105) }
iio.Color.dodgerblue = function(){ return new iio.Color(30,144,255) }
iio.Color.firebrick = function(){ return new iio.Color(178,34,34) }
iio.Color.floralwhite = function(){ return new iio.Color(255,250,240) }
iio.Color.forestgreen = function(){ return new iio.Color(34,139,34) }
iio.Color.fuchsia = function(){ return new iio.Color(255,0,255) }
iio.Color.gainsboro = function(){ return new iio.Color(220,220,220) }
iio.Color.ghostwhite = function(){ return new iio.Color(248,248,255) }
iio.Color.gold = function(){ return new iio.Color(255,215,0) }
iio.Color.goldenrod = function(){ return new iio.Color(218,165,32) }
iio.Color.gray = function(){ return new iio.Color(128,128,128) }
iio.Color.green = function(){ return new iio.Color(0,128,0) }
iio.Color.greenyellow = function(){ return new iio.Color(173,255,47) }
iio.Color.grey = function(){ return new iio.Color(128,128,128) }
iio.Color.honeydew = function(){ return new iio.Color(240,255,240) }
iio.Color.hotpink = function(){ return new iio.Color(255,105,180) }
iio.Color.indianred = function(){ return new iio.Color(205,92,92) }
iio.Color.indigo = function(){ return new iio.Color(75,0,130) }
iio.Color.ivory = function(){ return new iio.Color(255,255,240) }
iio.Color.khaki = function(){ return new iio.Color(240,230,140) }
iio.Color.lavender = function(){ return new iio.Color(230,230,250) }
iio.Color.lavenderblush = function(){ return new iio.Color(255,240,245) }
iio.Color.lawngreen = function(){ return new iio.Color(124,252,0) }
iio.Color.lemonchiffon = function(){ return new iio.Color(255,250,205) }
iio.Color.lightblue = function(){ return new iio.Color(173,216,230) }
iio.Color.lightcoral = function(){ return new iio.Color(240,128,128) }
iio.Color.lightcyan = function(){ return new iio.Color(224,255,255) }
iio.Color.lightgoldenrodyellow = function(){ return new iio.Color(250,250,210) }
iio.Color.lightgray = function(){ return new iio.Color(211,211,211) }
iio.Color.lightgreen = function(){ return new iio.Color(144,238,144) }
iio.Color.lightgrey = function(){ return new iio.Color(211,211,211) }
iio.Color.lightpink = function(){ return new iio.Color(255,182,193) }
iio.Color.lightsalmon = function(){ return new iio.Color(255,160,122) }
iio.Color.lightseagreen = function(){ return new iio.Color(32,178,170) }
iio.Color.lightskyblue = function(){ return new iio.Color(135,206,250) }
iio.Color.lightslategray = function(){ return new iio.Color(119,136,153) }
iio.Color.lightslategrey = function(){ return new iio.Color(119,136,153) }
iio.Color.lightsteelblue = function(){ return new iio.Color(176,196,222) }
iio.Color.lightyellow = function(){ return new iio.Color(255,255,224) }
iio.Color.lime = function(){ return new iio.Color(0,255,0) }
iio.Color.limegreen = function(){ return new iio.Color(50,205,50) }
iio.Color.linen = function(){ return new iio.Color(250,240,230) }
iio.Color.magenta = function(){ return new iio.Color(255,0,255) }
iio.Color.maroon = function(){ return new iio.Color(128,0,0) }
iio.Color.mediumaquamarine = function(){ return new iio.Color(102,205,170) }
iio.Color.mediumblue = function(){ return new iio.Color(0,0,205) }
iio.Color.mediumorchid = function(){ return new iio.Color(186,85,211) }
iio.Color.mediumpurple = function(){ return new iio.Color(147,112,219) }
iio.Color.mediumseagreen = function(){ return new iio.Color(60,179,113) }
iio.Color.mediumslateblue = function(){ return new iio.Color(123,104,238) }
iio.Color.mediumspringgreen = function(){ return new iio.Color(0,250,154) }
iio.Color.mediumturquoise = function(){ return new iio.Color(72,209,204) }
iio.Color.mediumvioletred = function(){ return new iio.Color(199,21,133) }
iio.Color.midnightblue = function(){ return new iio.Color(25,25,112) }
iio.Color.mintcream = function(){ return new iio.Color(245,255,250) }
iio.Color.mistyrose = function(){ return new iio.Color(255,228,225) }
iio.Color.moccasin = function(){ return new iio.Color(255,228,181) }
iio.Color.navajowhite = function(){ return new iio.Color(255,222,173) }
iio.Color.navy = function(){ return new iio.Color(0,0,128) }
iio.Color.oldlace = function(){ return new iio.Color(253,245,230) }
iio.Color.olive = function(){ return new iio.Color(128,128,0) }
iio.Color.olivedrab = function(){ return new iio.Color(107,142,35) }
iio.Color.orange = function(){ return new iio.Color(255,165,0) }
iio.Color.orangered = function(){ return new iio.Color(255,69,0) }
iio.Color.orchid = function(){ return new iio.Color(218,112,214) }
iio.Color.palegoldenrod = function(){ return new iio.Color(238,232,170) }
iio.Color.palegreen = function(){ return new iio.Color(152,251,152) }
iio.Color.paleturquoise = function(){ return new iio.Color(175,238,238) }
iio.Color.palevioletred = function(){ return new iio.Color(219,112,147) }
iio.Color.papayawhip = function(){ return new iio.Color(255,239,213) }
iio.Color.peachpuff = function(){ return new iio.Color(255,218,185) }
iio.Color.peru = function(){ return new iio.Color(205,133,63) }
iio.Color.pink = function(){ return new iio.Color(255,192,203) }
iio.Color.plum = function(){ return new iio.Color(221,160,221) }
iio.Color.powderblue = function(){ return new iio.Color(176,224,230) }
iio.Color.purple = function(){ return new iio.Color(128,0,128) }
iio.Color.rebeccapurple = function(){ return new iio.Color(102,51,153) }
iio.Color.red = function(){ return new iio.Color(255,0,0) }
iio.Color.rosybrown = function(){ return new iio.Color(188,143,143) }
iio.Color.royalblue = function(){ return new iio.Color(65,105,225) }
iio.Color.saddlebrown = function(){ return new iio.Color(139,69,19) }
iio.Color.salmon = function(){ return new iio.Color(250,128,114) }
iio.Color.sandybrown = function(){ return new iio.Color(244,164,96) }
iio.Color.seagreen = function(){ return new iio.Color(46,139,87) }
iio.Color.seashell = function(){ return new iio.Color(255,245,238) }
iio.Color.sienna = function(){ return new iio.Color(160,82,45) }
iio.Color.silver = function(){ return new iio.Color(192,192,192) }
iio.Color.skyblue = function(){ return new iio.Color(135,206,235) }
iio.Color.slateblue = function(){ return new iio.Color(106,90,205) }
iio.Color.slategray = function(){ return new iio.Color(112,128,144) }
iio.Color.slategrey = function(){ return new iio.Color(112,128,144) }
iio.Color.snow = function(){ return new iio.Color(255,250,250) }
iio.Color.springgreen = function(){ return new iio.Color(0,255,127) }
iio.Color.steelblue = function(){ return new iio.Color(70,130,180) }
iio.Color.tan = function(){ return new iio.Color(210,180,140) }
iio.Color.teal = function(){ return new iio.Color(0,128,128) }
iio.Color.thistle = function(){ return new iio.Color(216,191,216) }
iio.Color.tomato = function(){ return new iio.Color(255,99,71) }
iio.Color.turquoise = function(){ return new iio.Color(64,224,208) }
iio.Color.violet = function(){ return new iio.Color(238,130,238) }
iio.Color.wheat = function(){ return new iio.Color(245,222,179) }
iio.Color.white = function(){ return new iio.Color(255,255,255) }
iio.Color.whitesmoke = function(){ return new iio.Color(245,245,245) }
iio.Color.yellow = function(){ return new iio.Color(255,255,0) }
iio.Color.yellowgreen = function(){ return new iio.Color(154,205,50) }

