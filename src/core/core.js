iio = {};
iio.apps = [];
iio.scripts = iio.scripts || {};

//INITIALIZATION
iio.start = function(app, id, d) {
  
  var c = iio.canvas.prep(id, d);

  //initialize application with settings
  if (app instanceof Array)
    return new iio.App(c, app[0], app[1]);

  //run iio file
  /*else if (iio.is.string(app) && app.substring(app.length - 4) == '.iio')
    return iio.read(app, iio.start);*/

  //initialize application without settings
  return new iio.App(c, app);

  /*preppedApp = function() {
    var c = iio.canvas.prep(id, d);

    //initialize application with settings
    if (app instanceof Array)
      return new iio.App(c, app[0], app[1]);

    //initialize application without settings
    return new iio.App(c, app);
  }

  var event;
  if (app instanceof Array)
    app = app[0];
  if (typeof(app) === "string")
    event = "iioscript:" + app;

  if (window.addEventListener) {
    event = event || 'DOMContentLoaded';
    window.addEventListener(event, preppedApp, false);
  } else {
    event = event || 'onload';
    window.attachEvent(event, preppedApp);
  }*/
}
iio.stop = function( app ){
  if(!app)
    for(var i=0; i<iio.apps.length; i++)
      iio.cancelLoops(iio.apps[i]);
}

iio.script = function() {
  if (typeof CoffeeScript == 'undefined') return;
  var scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
  var iioScripts = scripts.filter(function(s) {
    return s.type === 'text/iioscript';
  });
  iioScripts.forEach(function(script) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", script.src, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status == 0)){
        var appName = script.src.split("/").pop().replace(/\.[^/.]+$/, "");
        iio.scripts[appName] = eval("(function() {\nreturn function(app, settings) {\n" + 
									   CoffeeScript.compile(xhr.responseText, {bare: true}) + 
									   "}\n})()");
        window.dispatchEvent(new Event("iioscript:" + appName));
      }
    }
    xhr.send(null);
  });
}

// Listen for window load, both in decent browsers and in IE
if (window.addEventListener)
  window.addEventListener('DOMContentLoaded', iio.script, false);
else
  window.attachEvent('onload', iio.script);

//JS ADDITIONS
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
  return this;
}
if (Function.prototype.name === undefined){
  // Add a custom property to all function values
  // that actually invokes a method to get the value
  Object.defineProperty(Function.prototype,'name',{
    get:function(){
      return /function ([^(]*)/.exec( this+"" )[1];
    }
  });
}

//UTIL FUNCTIONS
function emptyFn() {};
iio.inherit = function(child, parent) {
  var tmp = child;
  emptyFn.prototype = parent.prototype;
  child.prototype = new emptyFn();
  child.prototype.constructor = tmp;
}
iio.merge = function(o1,o2){
  for(var p in o2)
    o1[p] = o2[p];
  return o1;
}
iio.merge_args = function(o1){
  if(o1){
    var o2 = {};
    for(var i=0; i<o1.length; i++)
      o2 = iio.merge(o2,o1[i]);
    return o2;
  }
  return o1;
}
iio.addEvent = function(obj, evt, fn, capt) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, capt);
    return true;
  } else if (obj.attachEvent) {
    obj.attachEvent('on' + evt, fn);
    return true;
  } else return false;
}
iio.set = function(os, p) {
  os.forEach(function(o) {
    o.set(p);
  });
}
iio.random = function(min, max) {
  min = min || 0;
  max = (max === 0 || typeof(max) != 'undefined') ? max : 1;
  return Math.random() * (max - min) + min;
}
iio.randomInt = function(min, max) {
  return Math.floor(iio.random(min, max));
}
iio.centroid = function(vs){
  var cX,cY;
  for (var i=0;i<vs.length;i++){
     cX+=vs[i].x;
     cY+=vs[i].y;
  } return new iio.Vector(cX/vs.length,cY/vs.length);
}
iio.specVec = function(vs,comparator){
  var v = vs[0];
  for (var i=0;i<vs.length;i++)
     if (comparator(v,vs[i]))
        v=vs[i];
  return v;
}

//IO
iio.load = function(src, onload) {
  var img = new Image();
  img.src = src;
  img.onload = onload;
  return img;
}

iio.read = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status == 0))
      return callback(xhr.responseText);
  }
  xhr.send(null);
}

//LOOPING
iio.loop = function(fps, caller, fn) {

  // LOOP USING setTimeout
  if (iio.is.number(fps) || typeof window.requestAnimationFrame == 'undefined' || !fps.af) {
    if (typeof(fps.af) != 'undefined' && typeof(fps.fps) == 'undefined') {
      fn = caller;
      caller = fps;
      fps = 60
    } else if (!iio.is.number(fps)) {
      caller = fps;
      fps = fps.fps;
    }

    function loop() {
      var n = new Date().getTime();
      if (typeof caller.last == 'undefined') var first = true;
      var correctedFPS = Math.floor(Math.max(0, 1000 / fps - (n - (caller.last || fps))));
      caller.last = n + correctedFPS;
      var nufps;
      if (typeof first == 'undefined') {
        if (typeof caller.fn == 'undefined')
          nufps = caller.o._update(caller.o, correctedFPS);
        else if (iio.is.fn(caller.fn))
          nufps = caller.fn(caller.o, caller, correctedFPS);
        else nufps = caller.fn._update(caller, correctedFPS);
        caller.o.app.draw();
      }
      if (typeof nufps == 'undefined')
        caller.id = window.setTimeout(loop, correctedFPS);
      else {
        fps = nufps;
        caller.id = window.setTimeout(loop, 1000 / nufps);
      }
      //if(fn)fn(caller,correctedFPS/(1000/fps));
    };
    caller.id = window.setTimeout(loop, 1000 / fps);
    return caller.id;
  } 

  // LOOP USING requestAnimationFrame
  else {
    fn = caller;
    caller = fps;

    function animloop() {
      if (typeof caller.fn == 'undefined') caller.o.draw();
      else if (iio.is.fn(caller.fn)) caller.fn(caller.o);
      else {
        caller.fn._update();
        caller.fn.draw();
      }
      caller.o.app.draw();
      caller.id = window.requestAnimationFrame(animloop);
    }
    caller.id = window.requestAnimationFrame(animloop);
    return caller.id;
  }
}
iio.cancelLoop = function(l) {
  window.clearTimeout(l);
  window.cancelAnimationFrame(l);
}
iio.cancelLoops = function(o, c) {
  if( o.loops ) o.loops.forEach(function(loop) {
    iio.cancelLoop(loop.id);
  });
  if ( o.mainLoop ) 
    iio.cancelLoop(o.mainLoop.id);
  if ( typeof c == 'undefined' && o.objs )
    o.objs.forEach(function(obj) {
      iio.cancelLoops(obj);
    });
}

//INPUT LISTENERS
iio.resize = function() {
  iio.apps.forEach(function(app) {
    if (app.canvas.fullscreen) {
      if (window.jQuery) {
        app.canvas.width = $(window).width();
        app.canvas.height = $(window).height();
      } else {
        app.canvas.width = window.innerWidth;
        app.canvas.height = window.innerHeight;
      }
    }
    app.width = app.canvas.width;
    app.height = app.canvas.height;
    app.center.x = app.canvas.width / 2;
    app.center.y = app.canvas.height / 2;
    if (app.script && app.script.resize) app.script.resize();
    app.draw();
  });
}
iio.prep_input = function() {
  window.onresize = iio.resize;
  iio.addEvent(window, 'keydown', function(e) {
    var k = iio.key.string(e);
    iio.apps.forEach(function(app) {
      if (app.script && app.script.keyDown)
        app.script.keyDown(e, k);
    });
  });
  iio.addEvent(window, 'keyup', function(e) {
    var k = iio.key.string(e);
    iio.apps.forEach(function(app) {
      if (app.script&& app.script.keyUp)
        app.script.keyUp(e, k);
    });
  });
  iio.addEvent(window, 'scroll', function(event) {
    iio.apps.forEach(function(app) {
      var p = app.canvas.getBoundingClientRect();
      app.pos = {
        x: p.left,
        y: p.top
      };
    });
  });
}
iio.prep_input();

//DEPRECATED
iio.createGradient = function(ctx, g) {
  var gradient;
  var p = g.split(':');
  var ps = p[1].split(',');
  if (ps.length == 4)
    gradient = ctx.createLinearGradient(ps[0], ps[1], ps[2], ps[3]);
  else gradient = ctx.createRadialGradient(ps[0], ps[1], ps[2], ps[3], ps[4], ps[5]);
  var c;
  p.forEach(function(_p) {
    c = _p.indexOf(',');
    var a = parseFloat(_p.substring(0, c));
    var b = _p.substring(c + 1);
    gradient.addColorStop(a, b);
  });
  return gradient;
}

