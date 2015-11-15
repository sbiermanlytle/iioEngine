/* App
------------------
*/

// DEFINITION
iio.App =  function() {
  this.App.apply(this, arguments)
}
iio.inherit(iio.App, iio.Drawable);
iio.App.prototype._super = iio.Drawable.prototype;

// CONSTRUCTOR
iio.App.prototype.App = function(view, script, settings) {
  this._super.Drawable.call(this);

  //set app reference for shared functions
  this.app = this;

  //set canvas & context
  this.canvas = view;
  this.ctx = view.getContext('2d');

  //prep canvas
  this.canvas.parent = this;
  iio.canvas.prep_input(this.canvas);

  //get width & height from canvas
  this.width = view.clientWidth || view.width;
  this.height = view.clientHeight || view.height;

  //set center
  this.center = new iio.Vector(
    this.width / 2,
    this.height / 2
  );

  this.update_pos();

  //add app to global app array
  iio.apps.push(this);

  //run js script
  /*if (typeof(app) === "string") {
    app = iio.scripts[app];
  }*/
  //app.call(this, this, s);

  // run script
  this.script = new script(this, settings);
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.App.prototype.update = function(){
  var nuFPS;
  if(this.onUpdate) 
    nuFPS = this.onUpdate(this);
  this.draw();
  return nuFPS;
}
iio.App.prototype.trueVs = function() {
  // set this.vs with correct values
  this.vs = [
    new iio.Vector(-this.width/2, -this.height/2),
    new iio.Vector(this.width/2, -this.height/2),
    new iio.Vector(this.width/2, this.height/2),
    new iio.Vector(-this.width/2, this.height/2),
  ];
  // return clone of this.vs
  var vs = [];
  for(var i=0; i<this.vs.length; i++)
   vs[i] = this.vs[i].clone();
  return vs;
}
iio.App.prototype.draw = function( noClear ) {

  // clear canvas
  if( !this.keepDraws )
    this.ctx.clearRect(0, 0, this.width, this.height);

  // draw background color
  if (this.color) {
    this.ctx.fillStyle = this.color.rgbaString();
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // draw child objects
  if (this.objs.length > 0)
    for(var i=0; i<this.objs.length; i++)
      if (!this.clipObjs
       || (this.objs[i].right() > 0 && this.objs[i].left() < this.width
        && this.objs[i].bottom() > 0 && this.objs[i].top() < this.height))
        if (this.objs[i].draw) this.objs[i].draw(this.ctx);
}

// APP FUNCTIONS
iio.App.prototype.eventVector = function(e) {
  this.update_pos();
  return new iio.Vector( 
    e.clientX - this.pos.x, 
    e.clientY - this.pos.y
  )
}
iio.App.prototype.update_pos = function(){
  var offset = this.canvas.getBoundingClientRect();
  this.pos = new iio.Vector(
    offset.left,
    offset.top
  );
}
iio.App.prototype.stop = function() {
  this.objs.forEach(function(obj) {
    if (obj instanceof iio.Sound)
      obj.stop();
    else iio.cancelLoops(obj);
  });
  iio.cancelLoops(this);
  if (this.mainLoop) iio.cancelLoop(this.mainLoop.id);
  this.clear();
  return this;
}
