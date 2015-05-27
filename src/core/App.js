/* App
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
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

  //get DOM offset of canvas
  var offset = view.getBoundingClientRect();

  //set canvas DOM position
  this.pos = new iio.Vector(
    offset.left,
    offset.top
  );

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

// FUNCTIONS
//-------------------------------------------------------------------
iio.App.prototype.update = function(){
  var nuFPS;
  if(this.script.onUpdate) 
    nuFPS = this.script.onUpdate();
  this.draw();
  return nuFPS;
}
iio.App.prototype.stop = function() {
  this.objs.forEach(function(obj) {
    iio.cancelLoops(obj);
  });
  iio.cancelLoops(this);
  if (this.mainLoop) iio.cancelLoop(this.mainLoop.id);
  this.clear();
}
iio.App.prototype.draw = function( noClear ) {

  // clear canvas
  if( !noClear )
    this.ctx.clearRect(0, 0, this.width, this.height);

  // draw background color
  if (this.color) {
    this.ctx.fillStyle = this.color.rgbaString();
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // draw child objects
  if (this.objs.length > 0)
    for(var i=0; i<this.objs.length; i++)
      if (this.objs[i].draw) this.objs[i].draw(this.ctx);
}
iio.App.prototype.convert_event_pos = function(e) {
  return new iio.Vector( 
    e.clientX - this.pos.x, 
    e.clientY - this.pos.y
  )
}
