
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
iio.SpriteMap.prototype.sprite = function() {
  var args = iio.merge_args(arguments);
  var anim = {};
  anim.name = args.name;
  args.origin = iio.convert.vector(args.origin);
  if (!args.frames) {
    anim.frames = [];
    for (var i = 0; i < args.numFrames; i++)
      anim.frames[i] = {
        x: args.origin.x + args.width * i,
        y: args.origin.y,
        w: args.width,
        h: args.height,
      };
  } else anim.frames = args.frames;
  anim.frames.forEach(function(frame) {
    if (typeof(frame.src) == 'undefined') frame.src = this.img;
    if (typeof(frame.w) == 'undefined') frame.w = args.width;
    if (typeof(frame.h) == 'undefined') frame.h = args.height;
  }, this);
  return anim;
}
