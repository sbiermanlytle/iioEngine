/* SpriteMap
------------------
*/

// DEFINITION
iio.SpriteMap = function() {this.SpriteMap.apply(this, arguments) }

// CONSTRUCTOR
iio.SpriteMap.prototype.SpriteMap = function(src, onLoad) {
  this.img = new Image();
  this.img.src = src;
  this.img.onload = onLoad;
  return this;
}

// SPRITEMAP FUNCTIONS
iio.SpriteMap.prototype.sprite = function() {
  var args = iio.merge_args(arguments);
  var anim = {};
  anim.name = args.name;
  anim.numFrames = args.numFrames || 1;
  args.origin = iio.convert.vector(args.origin);
  if (!args.frames) {
    anim.frames = [];
    for (var i=0; i<anim.numFrames; i++)
      anim.frames[i] = {
        x: args.origin.x + args.width * i,
        y: args.origin.y,
        w: args.width,
        h: args.height,
      };
  } else anim.frames = args.frames;
  anim.frames.forEach(function(frame) {
    if (!frame.src) frame.src = this.img;
    if (!frame.w) frame.w = args.width;
    if (!frame.h) frame.h = args.height;
  }, this);
  return anim;
}
