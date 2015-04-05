
//DEFINITION
iio.SpriteMap = function() {this.SpriteMap.apply(this, arguments) }

//CONSTRUCTOR
iio.SpriteMap.prototype.SpriteMap = function(src, p) {
  this.img = new Image();
  this.img.src = src;
  this.img.onload = p.onload;
  return this;
}

//FUNCTIONS
iio.SpriteMap.prototype.sprite = function(w, h, a, x, y, n) {
  var s = {};
  if (iio.is.string(w)) {
    s.tag = w;
    w = h;
    h = a;
    a = x;
    x = y;
    y = n;
  }
  if (w instanceof Array) s.frames = w;
  else if (a instanceof Array) s.frames = a;
  else {
    s.frames = [];
    for (var i = 0; i < a; i++)
      s.frames[i] = {
        x: w * i,
        y: y,
        w: w,
        h: h
      };
  }
  s.frames.forEach(function(frame) {
    if (typeof(frame.src) == 'undefined') frame.src = this.img;
    if (typeof(frame.w) == 'undefined') frame.w = w;
    if (typeof(frame.h) == 'undefined') frame.h = h;
  }, this);
  return s;
}