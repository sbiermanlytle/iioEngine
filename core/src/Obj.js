
//DEFINITION
iio.Obj = function(){ this.Obj.apply(this, arguments) }

//CONSTRUCTOR
iio.Obj.prototype.Obj = function() {
  this.objs = [];
  this.set(arguments[0], true);
}

//FUNCTIONS
iio.Obj.prototype.set = function() {
  for (var p in arguments[0]) this[p] = arguments[0][p];
  this.convert_props();
  if (arguments[arguments.length-1] === true);
  else if(this.app) this.app.draw();
}
iio.Obj.prototype.setAlpha = function(a, noDraw){
  this.alpha = a || 1;
  if (noDraw); else if(this.app) this.app.draw();
}

iio.Obj.prototype.convert_props = function(){
  
  // convert string colors to iio.Color
  if(iio.is.string(this.color)) 
    this.color = iio.convert.color(this.color);
  if(iio.is.string(this.shadow)) 
    this.shadow = iio.convert.color(this.shadow);

  // convert values to arrays
  if(this.dash && !(this.dash instanceof Array))
    this.dash = [this.dash];

  // arrays to iio.V
  this.convert_v("pos");
  this.convert_v("origin");
  this.convert_v("vel");
  this.convert_v("acc");
  this.convert_v("shadowOffset");
  this.convert_vs("vs");
  this.convert_vs("vels");

  //set required properties
  if(this.rVel && !this.rotation) this.rotation = 0;
}
iio.Obj.prototype.convert_v = function(p){
  if(this[p] && this[p] instanceof Array)
    this[p] = new iio.V(this[p]);
}
iio.Obj.prototype.convert_vs = function(vs){
  if(this[vs])
    for(var i=0; i<this[vs].length; i++)
      if(this[vs][i] instanceof Array)
        this[vs][i] = new iio.V(this[vs][i]);
}
iio.Obj.prototype.create = function(){
  var props = {};
  for(var i=0; i<arguments.length; i++){
    if(arguments[i] === null) break;
    if(arguments[i] instanceof iio.V)
      props.pos = arguments[i];
    else if(arguments[i] instanceof iio.Color)
      props.color = arguments[i];
    else if(typeof arguments[i] === 'object')
      props = iio.merge(props,arguments[i]);
    else if(iio.is.number(arguments[i]))
      props.width = arguments[i];
    else if(iio.is.string(arguments[i]))
      props.color = arguments[i];
  }
  if(props.vs){
    if(props.vs.length == 2)
      return this.add(new iio.Line(props));
  } else if(this.radius)
    return this.add(new iio.Ellipse(props));
  else if(this.height)
    return this.add(new iio.Rectangle(props));
  else return this.add(new iio.Square(props));
}
iio.Obj.prototype.add = function() {
  if (arguments[0] instanceof Array)
    for(var i=0; i<arguments[0].length; i++)
      this.add(arguments);
  else {
    arguments[0].parent = this;
    arguments[0].app = this.app;
    //if(!arguments[0].pos)
      //arguments[0].pos = {x:this.app.center.x,y:this.app.center.y};
    if (typeof(arguments[0].z) == 'undefined') arguments[0].z = 0;
    var i = 0;
    while (i < this.objs.length && typeof(this.objs[i].z) != 'undefined' && arguments[0].z >= this.objs[i].z) i++;
    this.objs.insert(i, arguments[0]);
    if ( arguments[0].app && 
        (  arguments[0].vel 
        || arguments[0].vels 
        || arguments[0].rVel 
        || arguments[0].onUpdate 
        || arguments[0].shrink 
        || arguments[0].fade 
        || arguments[0].acc
        ) && (typeof arguments[0].app.looping == 'undefined' || arguments[0].app.looping === false))
      arguments[0].app.loop();
  }
  if (arguments[arguments.length-1] === true);
  else if(this.app) this.app.draw();
  return arguments[0];
}
iio.Obj.prototype.rmv = function(o, nd) {
  callback = function(c, i, arr) {
    if (c == o) {
      arr.splice(i, 1);
      return true;
    } else return false;
  }
  if (typeof o == 'undefined')
    this.objs = [];
  else if (o instanceof Array)
    o.forEach(function(_o) {
      this.rmv(_o);
    }, this);
  else if (iio.is.number(o) && o < this.objs.length)
    this.objs.splice(o, 1);
  else if (this.objs) this.objs.some(callback);
  if (this.collisions) this.collisions.forEach(function(collision, i) {
    if (collision[0] == o || collision[1] == o)
      this.collisions.splice(i, 1);
    else if (collision[0] instanceof Array)
      collision[0].some(callback)
    if (collision[1] instanceof Array)
      collision[1].some(callback)
  })
  if (nd);
  else this.app.draw();
  return o;
}
iio.Obj.prototype.clear = function() {
  this.objs = [];
}
iio.Obj.prototype.loop = function(fps, fn) {
  this.looping = true;
  var loop;
  if (typeof fn == 'undefined') {
    if (typeof fps == 'undefined') {
      if (this.app.mainLoop) iio.cancelLoop(this.app.mainLoop.id);
      loop = this.app.mainLoop = {
        fps: 60,
        fn: this,
        af: this.rqAnimFrame,
        o: this.app
      };
      this.app.fps = 60;
      loop.id = this.app.mainLoop.id = iio.loop(this.app.mainLoop);
    } else {
      if (!iio.is.number(fps)) {
        loop = {
          fps: 60,
          fn: fps,
          af: this.rqAnimFrame
        }
        loop.id = iio.loop(loop, fps);
      } else {
        if (this.app.mainLoop) iio.cancelLoop(this.app.mainLoop.id);
        loop = this.app.mainLoop = {
          fps: fps,
          o: this.app,
          af: false
        }
        this.app.fps = fps;
        loop.id = this.app.mainLoop.id = iio.loop(this.app.mainLoop);
      }
    }
  } else {
    loop = {
      fps: fps,
      fn: fn,
      o: this,
      af: this.rqAnimFrame
    };
    loop.id = iio.loop(fps, loop);
  }
  this.loops.push(loop);
  /*if(typeof o.app.fps=='undefined'||o.app.fps<fps){
     if(o.app.mainLoop) iio.cancelLoop(o.app.mainLoop.id);
     o.app.mainLoop={fps:fps,o:o.app,af:o.app.rqAnimFrame}
     o.app.fps=fps;
     o.app.mainLoop.id=iio.loop(o.app.mainLoop);
  }*/
  return loop.id;
}
iio.Obj.prototype.clear_loops = function() {
  for (var i = 0; i < this.loops.length; i++)
    iio.cancelLoop(this.loops[i]);
}
iio.Obj.prototype.pause = function(c) {
  if (this.paused) {
    this.paused = false;
    this.loops.forEach(function(loop) {
      iio.loop(loop);
    });
    if (this.mainLoop) iio.loop(this.mainLoop);
    if (typeof c == 'undefined')
      this.objs.forEach(function(obj) {
        obj.loops.forEach(function(loop) {
          iio.loop(loop);
        });
      });
  } else {
    iio.cancelLoops(this);
    iio.cancelLoop(this.mainLoop.id);
    this.paused = true;
  }
}
