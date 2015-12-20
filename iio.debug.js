/*
iio.js
Version 1.4.0

iio.js is licensed under the BSD 2-clause Open Source license

Copyright (c) 2014, Sebastian Bierman-Lytle
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list 
of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this
list of conditions and the following disclaimer in the documentation and/or other 
materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
*/
iio = {};
iio.apps = [];
//iio.scripts = iio.scripts || {};

// APP CONTROL
//-------------------------------------------------------------------
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
      iio.apps[i].stop();
  else app.stop();
}
iio.script = function() {
  if (typeof CoffeeScript === 'undefined') return;
  var scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
  var iioScripts = scripts.filter(function(s) {
    return s.type === 'text/iioscript';
  });
  iioScripts.forEach(function(script) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", script.src, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)){
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
//if (window.addEventListener)
  //window.addEventListener('DOMContentLoaded', iio.script, false);
//else window.attachEvent('onload', iio.script);

// UTIL FUNCTIONS
//-------------------------------------------------------------------
iio.inherit = function(child, parent) {
  function emptyFn(){};
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
  max = (max === 0 || typeof(max) !== 'undefined') ? max : 1;
  return Math.random() * (max - min) + min;
}
iio.randomInt = function(min, max) {
  return Math.floor(iio.random(min, max));
}
iio.centroid = function(vs){
  var cX,cY;
  for (var i=0; i<vs.length; i++){
     cX+=vs[i].x;
     cY+=vs[i].y;
  } return new iio.Vector(cX/vs.length, cY/vs.length);
}
iio.specVec = function(vs,comparator){
  var v = vs[0];
  for (var i=0; i<vs.length; i++)
     if (comparator(v,vs[i]))
        v = vs[i];
  return v;
}

// IO
//-------------------------------------------------------------------
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

// LOOPING
//-------------------------------------------------------------------
iio.loop = function(fps, caller, fn) {

  // LOOP USING setTimeout
  if (iio.is.number(fps) || typeof window.requestAnimationFrame === 'undefined' || !fps.af) {
    if (typeof(fps.af) != 'undefined' && typeof(fps.fps) == 'undefined') {
      fn = caller;
      caller = fps;
      fps = 60;
    } else if (!iio.is.number(fps)) {
      caller = fps;
      fps = fps.fps;
    }

    function loop() {
      var n = new Date().getTime();
      if (typeof caller.last === 'undefined') var first = true;
      var correctedFPS = Math.floor(Math.max(0, 1000 / fps - (n - (caller.last || fps))));
      caller.last = n + correctedFPS;
      var nufps;
      if (typeof first === 'undefined') {
        if (typeof caller.fn === 'undefined')
          nufps = caller.o._update(caller.o, correctedFPS);
        else if (iio.is.fn(caller.fn))
          nufps = caller.fn(caller.o, caller, correctedFPS);
        else nufps = caller.fn._update(caller, correctedFPS);
        caller.o.app.draw();
      }
      if (typeof nufps === 'undefined')
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
      if (typeof caller.fn === 'undefined') caller.o.draw();
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
  if ( typeof c === 'undefined' && o.objs )
    o.objs.forEach(function(obj) {
      iio.cancelLoops(obj);
    });
}
iio.requestTimeout = function(fps,lastTime,callback,callbackParams){
  //Callback method by Erik Möller, Paul Irish, Tino Zijdel
  //https://gist.github.com/1579671
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, (1000/fps) - (currTime - lastTime));
  callbackParams[0].fsID = setTimeout(function() { callback(currTime + timeToCall, callbackParams); }, 
    timeToCall);
  lastTime = currTime + timeToCall;
}

// INPUT LISTENERS
//-------------------------------------------------------------------
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
    if (app.onResize) app.onResize();
    app.draw();
  });
}
iio.prep_input = function() {
  window.onresize = iio.resize;
  iio.addEvent(window, 'keydown', function(e) {
    var k = iio.key.string(e);
    iio.apps.forEach(function(app) {
      if (app.onKeyDown)
        app.onKeyDown(e, k);
    });
  });
  iio.addEvent(window, 'keyup', function(e) {
    var k = iio.key.string(e);
    iio.apps.forEach(function(app) {
      if (app.onKeyUp)
        app.onKeyUp(e, k);
    });
  });
  iio.addEvent(window, 'scroll', function(event) {
    iio.apps.forEach(function(app) {
      var p = app.canvas.getBoundingClientRect();
      app.pos = {
        x: p.left,
        y: p.top
      };
      if (app.onScroll)
        app.onScroll(e, k);
    });
  });
}
iio.prep_input();

/* JS Extensions
------------------
*/
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
  return this;
}
if (Function.prototype.name === undefined){
  // Add a custom property to all function values
  // that actually invokes a method to get the value
  Object.defineProperty(Function.prototype,'name',{
    get: function(){
      return /function ([^(]*)/.exec( this+"" )[1];
    }
  });
}
/* iio.is
------------------
*/
iio.is = {
  fn: function(fn) {
    return typeof fn === 'function'
  },
  number: function(o) {
    return typeof o === 'number'
  },
  string: function(s) {
    return typeof s === 'string' || s instanceof String
  },
  filetype: function(file, extensions) {
    return extensions.some(function(ext) {
      return (file.indexOf('.' + ext) !== -1)
    });
  },
  image: function(file) {
    return this.filetype(file, ['png', 'jpg', 'gif', 'tiff'])
  },
  sound: function(file) {
    return this.filetype(file, ['wav', 'mp3', 'aac', 'ogg'])
  },
  between: function(val, min, max) {
    if (max < min) {
      var tmp = min;
      min = max;
      max = tmp;
    }
    return (val >= min && val <= max)
  },
  Polygon: function(o){
    if (o instanceof iio.Polygon
     || o instanceof iio.Rectangle
     || o instanceof iio.Text)
      return true;
    return false;
  },
  Circle: function(o){
    if (o instanceof iio.Ellipse && (!o.vRadius || o.radius === o.vRadius))
      return true;
    return false;
  },
  Quad: function(o){
    if (o instanceof iio.Quad
     || o instanceof iio.App
     || o instanceof iio.Grid)
      return true;
    return false;
  }
}

/* iio.convert
------------------
*/
iio.convert = {
  property: {
    color: function(o,c){
      if(o[c] && iio.is.string(o[c])) o[c] = iio.convert.color(o[c]);
    },
    vector: function(o,v){
      if(o[v]) o[v] = iio.convert.vector(o[v]);
    },
    vectors: function(o,v){
      if(o[v]) o[v] = iio.convert.vectors(o[v]);
    }
  },
  color: function(c){
    return iio.Color[c.toLowerCase()]();
  },
  vector: function(v){
    if(v instanceof Array)
      return new iio.Vector(v);
    else if( !(v instanceof iio.Vector) )
      return new iio.Vector(v,v);
    else return v;
  },
  vectors: function(vs){
    for(var i=0; i<vs.length; i++)
      vs[i] = iio.convert.vector( vs[i] );
    return vs;
  }
}

/* iio.key
------------------
*/
iio.key = {
  string: function(e) {
    return iio.keys[e.keyCode];
  },
  code_is: function(keys, event) {
    if (!(keys instanceof Array)) keys = [keys];
    var str = iio.key.string(event);
    return keys.some(function(key) {
      return key === str;
    });
  }
}
iio.keys = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  19: 'pause',
  20: 'caps lock',
  27: 'escape',
  32: 'space',
  33: 'page up',
  34: 'page down',
  35: 'end',
  36: 'home',
  37: 'left arrow',
  38: 'up arrow',
  39: 'right arrow',
  40: 'down arrow',
  45: 'insert',
  46: 'delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'left window',
  92: 'right window',
  93: 'select key',
  96: 'n0',
  97: 'n1',
  98: 'n2',
  99: 'n3',
  100: 'n4',
  101: 'n5',
  102: 'n6',
  103: 'n7',
  104: 'n8',
  105: 'n9',
  106: 'multiply',
  107: 'add',
  109: 'subtract',
  110: 'dec',
  111: 'divide',
  112: 'f1',
  113: 'f2',
  114: 'f3',
  115: 'f4',
  116: 'f5',
  117: 'f6',
  118: 'f7',
  119: 'f8',
  120: 'f9',
  121: 'f10',
  122: 'f11',
  123: 'f12',
  144: 'num lock',
  156: 'scroll lock',
  186: 'semi-colon',
  187: 'equal',
  188: 'comma',
  189: 'dash',
  190: 'period',
  191: 'forward slash',
  192: 'grave accent',
  219: 'open bracket',
  220: 'back slash',
  221: 'close bracket',
  222: 'single quote'
}

/* iio.canvas
------------------
*/
iio.canvas = {
  create: function(w, h) {
    var c = document.createElement('canvas');
    //create with size
    if (w) {
      c.width = w;
      c.height = h;
    }
    //create fullscreen
    else {
      c.margin = 0;
      c.padding = 0;
      c.style.position = 'fixed';
      c.style.left = 0;
      c.style.top = 0;
      c.fullscreen = true;
      if (window.jQuery) {
        c.width = $(document).width();
        c.height = $(document).height();
      } else {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      }
    }
    return c;
  },
  prep: function(id, d) {
    var c;
    //create with element id
    if (id) {
      c = document.getElementById(id);
      if (!c) {
        //create with existing canvas
        if (id.tagName === 'CANVAS') c = id;

        //create in existing element
        else if (iio.is.number(id) || id.x) {
          c = iio.canvas.create(id.x || id, id.y || id);
          if (d) d.appendChild(c);
          else document.body.appendChild(c);
        }
      }
      //create fullscreen
    } else {
      iio.canvas.prep_fullscreen();
      c = iio.canvas.create();
      document.body.appendChild(c);
    }
    return c;
  },
  prep_fullscreen: function() {
    document.body.style.margin = 0;
    document.body.style.padding = 0;
  },
  prep_input: function(o) {
    function route_input(caller, e, handler){
      // orient position to canvas 0,0
      var ep = caller.parent.eventVector(e);

      // App.handler
      if (caller.parent[handler]) 
        caller.parent[handler](caller.parent, e, ep);
      
      // App.objs.handler
      caller.parent.objs.forEach(function(obj, i) {
        if (i !== 0) ep = caller.parent.eventVector(e);
        if (obj.contains && obj.contains(ep))
          if (obj[handler]) {
            if (obj.cellAt) {
              var c = obj.cellAt(ep);
              obj[handler](obj, e, ep, c);
            } else obj[handler](obj, e, ep);
          }
      }, caller)
    }
    function attach_input_hook(callback, router) {
      if(o[callback]) {
        o['_'+callback] = o[callback];
        o[callback] = function(e){ router(e); this['_'+callback](e) }
      } else o[callback] = router;
    }
    attach_input_hook('onclick', function(e){ route_input(o, e, 'onClick') });
    attach_input_hook('onmousedown', function(e){ route_input(o, e, 'onMouseDown') });
    attach_input_hook('onmouseup', function(e){ route_input(o, e, 'onMouseUp') });
  }
}

/* iio.collision
------------------
*/
iio.collision = {
  check: function(o1, o2) {
    if (!o1 || !o2) return false;
    if (iio.is.Quad(o1)){
      if (iio.is.Quad(o2)) return iio.collision.rectXrect(o1,o2);
      else if (iio.is.Polygon(o2)) return iio.collision.polyXpoly(o1,o2);
      else if (o2 instanceof iio.Line) return iio.collision.polyXline(o1,o2);
      else if (iio.is.Circle(o2)) return iio.collision.polyXcircle(o1,o2);
    } else if (iio.is.Polygon(o1)) {
      if (iio.is.Polygon(o2)) return iio.collision.polyXpoly(o1,o2);
      else if (iio.is.Quad(o2)) return iio.collision.polyXpoly(o1,o2);
      else if(o2 instanceof iio.Line) return iio.collision.polyXline(o2,o1);
      else if(iio.is.Circle(o2)) return iio.collision.polyXcircle(o1,o2);
    } else if (iio.is.Circle(o1)) {
      if (iio.is.Circle(o2))  return iio.collision.circleXcircle(o1,o2);
      else if (o2 instanceof iio.Ellipse) return iio.collision.ellipseXellipse(o1,o2);
      else if (iio.is.Polygon(o2)
       || iio.is.Quad(o2)) return iio.collision.polyXcircle(o2,o1);
      else if (o2 instanceof iio.Line) return iio.collision.circleXline(o1,o2);
    } else if (o1 instanceof iio.Ellipse){
      if (o2 instanceof iio.Ellipse 
       || iio.is.Circle(o2)) return iio.collision.ellipseXellipse(o1,o2);
    } else if (o1 instanceof iio.Line) {
      if (o2 instanceof iio.Line) return iio.collision.lineXline(o1,o2);
      else if (o2 instanceof iio.Polygon) return iio.collision.polyXline(o2,o1);
      else if (iio.is.Polygon(o2)) return iio.collision.polyXline(o2,o1);
      else if (iio.is.Circle(o2)) return iio.collision.circleXline(o2,o1);
    }
  },
  lineXline: function(o1,o2){
    var vs1 = o1.trueVs();
    var vs2 = o2.trueVs();
    return iio.collision.lineCline(vs1[0],vs1[1],vs2[0],vs2[1]);
  },
  lineCline: function(v1, v2, v3, v4){
    var a1 = (v2.y - v1.y) / (v2.x - v1.x);
    var a2 = (v4.y - v3.y) / (v4.x - v3.x);
    var a = a1;
    var x1 = v1.x;
    var y1 = v1.y;
    var i1 = !isFinite(a1);
    var i2 = !isFinite(a2);
    var x;
    if(i1 || i2) {
       if(i1 && i2) {
          return v1.x === v3.x &&
                (iio.is.between(v1.y, v3.y, v4.y) || iio.is.between(v2.y, v3.y, v4.y) ||
                 iio.is.between(v3.y, v1.y, v2.y) || iio.is.between(v4.y, v1.y, v2.y));
       }
       if(i1) {
          x = v1.x;
          a = a2;
          x1 = v3.x;
          y1 = v3.y;
       } else {
          x = v3.x;
       }
    } else {
       x = (a1*v1.x - a2*v3.x - v1.y + v3.y) / (a1 - a2);
       if(!isFinite(x)) {
          return (iio.is.between(v1.x, v3.x, v4.x) && iio.is.between(v1.y, v3.y, v4.y) ||
                  iio.is.between(v2.x, v3.x, v4.x) && iio.is.between(v2.y, v3.y, v4.y) ||
                  iio.is.between(v3.x, v1.x, v2.x) && iio.is.between(v3.y, v1.y, v2.y) ||
                  iio.is.between(v4.x, v1.x, v2.x) && iio.is.between(v4.y, v1.y, v2.y));
       }
    }
    var y = a * (x - x1) + y1;
    if(iio.is.between(x, v1.x, v2.x) && iio.is.between(x, v3.x, v4.x) && iio.is.between(y, v1.y, v2.y) && iio.is.between(y, v3.y, v4.y)) {
       return true;
    }
    return false;
  },
  rectXrect: function(o1,o2){
    if (o1.left() < o2.right() && o1.right() > o2.left()
     && o1.top() < o2.bottom() && o1.bottom() > o2.top()) 
      return true;
    return false;
  },
  circleXcircle: function(o1,o2){
    if (o1.pos.dist(o2.pos) < o1.radius+o2.radius)
      return true;
    return false;
  },
  polyXpoly: function(o1,o2){
    var i;
    var v1=o1.trueVs();
    var v2=o2.trueVs();
    for (i=0;i<v1.length;i++)
      if (o2.contains(v1[i]))
        return true;
    for (i=0;i<v2.length;i++)
      if (o1.contains(v2[i]))
        return true;
    var a,b,j;
    for(i = 0; i < v1.length; i++) {
       a = iio.Vector.add(v1[i], o1.pos);
       b = iio.Vector.add(v1[(i + 1) % v1.length], o1.pos);
       for(j = 0; j < v2.length; j++) {
          if(iio.collision.lineCline(a, b,
            iio.Vector.add(v2[j], o2.pos),
            iio.Vector.add(v2[(j + 1) % v2.length], o2.pos))) {
             return true;
          }
       }
    } 
    return false;
  },
  polyXcircle: function(poly,circle){
    var vs = poly.trueVs();
    for (var i=0; i<vs.length; i++)
      if (circle.contains(vs[i]))
        return true;
    for(var j=1,i=0; i<vs.length; i++,j=i+1){
      if(j===vs.length) j=0;
      if(iio.collision.circleCline(circle, vs[i], vs[j]))
        return true;
    }
    return false;
  },
  polyXline: function(poly,line){
    var polyVs = poly.trueVs();
    var lineVs = line.trueVs();
    for ( var i=0,b1,b2,inter; i<polyVs.length; i++ ) {
        b1 = polyVs[i];
        b2 = polyVs[(i+1) % polyVs.length];
        if(iio.collision.lineCline(lineVs[0], lineVs[1], b1, b2))
          return true;
    }
    return false;
  },
  circleXline: function(circle,line){
    var vs = line.trueVs();
    return iio.collision.circleCline(circle, vs[0], vs[1]);
  },
  circleCline: function(circle,v1,v2){
    var a = (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y);
    var b = 2 * ((v2.x - v1.x) * (v1.x - circle.pos.x) + (v2.y - v1.y) * (v1.y - circle.pos.y));
    var cc = circle.pos.x * circle.pos.x + circle.pos.y * circle.pos.y + v1.x * v1.x + v1.y * v1.y
    - 2 * (circle.pos.x * v1.x + circle.pos.y * v1.y) - circle.radius * circle.radius;
    var deter = b * b - 4 * a * cc;
    if(deter > 0) {
      var e = Math.sqrt(deter);
      var u1 = (-b + e) / (2 * a);
      var u2 = (-b - e) / (2 * a);
      if(!((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)))
        return true;
    }
    return false;
  },
  /* Ellipse collision detection
   * based on script by Olli Niemitalo in 2012-08-06.
   * This work is placed in the public domain.
   * http://yehar.com/blog/?p=2926
   */
  ellipse_options: function(o1,o2){
    var maxIterations = o1.maxCollisionIterations || 10;
    if (o2.maxCollisionIterations 
      && o2.maxCollisionIterations > maxIterations)
      maxIterations = o2.maxCollisionIterations;
    var numNodes = o1.numCollisionNodes || 10;
    if (o2.numCollisionNodes 
      && o2.numCollisionNodes > numNodes)
      numNodes = o2.numCollisionNodes;
    var innerPolyCoef = [];
    var outerPolyCoef = [];
    for (var t = 0; t <= maxIterations; t++) {
      innerPolyCoef[t] = 0.5/Math.cos(4*Math.acos(0.0)/numNodes);
      outerPolyCoef[t] = 0.5/(Math.cos(2*Math.acos(0.0)/numNodes)*Math.cos(2*Math.acos(0.0)/numNodes));
    }
    return {
      maxIterations: maxIterations,
      innerPolyCoef: innerPolyCoef,
      outerPolyCoef: outerPolyCoef,
    };
  },
  ellipseXellipse: function(o1,o2){
    var x0 = o1.pos.x;
    var y0 = o1.pos.y;
    var x1 = o2.pos.x;
    var y1 = o2.pos.y;
    var w0 = o1.localizeRotation(new iio.Vector(o1.radius, 0),true);
    var w1 = o2.localizeRotation(new iio.Vector(o2.radius, 0),true);
    var wx0 = w0.x;
    var wy0 = w0.y;
    var wx1 = w1.x;
    var wy1 = w1.y;
    var hw0 = (o1.vRadius || o1.radius) / o1.radius;
    var hw1 = (o2.vRadius || o2.radius) / o2.radius;

    var options = iio.collision.ellipse_options(o1,o2);

    var rr = hw1*hw1*(wx1*wx1 + wy1*wy1)*(wx1*wx1 + wy1*wy1)*(wx1*wx1 + wy1*wy1);
    var x = hw1*wx1*(wy1*(y1 - y0) + wx1*(x1 - x0)) - wy1*(wx1*(y1 - y0) - wy1*(x1 - x0));
    var y = hw1*wy1*(wy1*(y1 - y0) + wx1*(x1 - x0)) + wx1*(wx1*(y1 - y0) - wy1*(x1 - x0));
    var temp = wx0;
    wx0 = hw1*wx1*(wy1*wy0 + wx1*wx0) - wy1*(wx1*wy0 - wy1*wx0);
    var temp2 = wy0;
    wy0 = hw1*wy1*(wy1*wy0 + wx1*temp) + wx1*(wx1*wy0 - wy1*temp);
    var hx0 = hw1*wx1*(wy1*(temp*hw0)-wx1*temp2*hw0)-wy1*(wx1*(temp*hw0)+wy1*temp2*hw0);
    var hy0 = hw1*wy1*(wy1*(temp*hw0)-wx1*temp2*hw0)+wx1*(wx1*(temp*hw0)+wy1*temp2*hw0);

    if (wx0*y - wy0*x < 0) {
      x = -x;
      y = -y;
    }
                
    if ((wx0 - x)*(wx0 - x) + (wy0 - y)*(wy0 - y) <= rr) {
      return true;
    } else if ((wx0 + x)*(wx0 + x) + (wy0 + y)*(wy0 + y) <= rr) {
      return true;
    } else if ((hx0 - x)*(hx0 - x) + (hy0 - y)*(hy0 - y) <= rr) {
      return true;
    } else if ((hx0 + x)*(hx0 + x) + (hy0 + y)*(hy0 + y) <= rr) {
      return true;
    } else if (x*(hy0 - wy0) + y*(wx0 - hx0) <= hy0*wx0 - hx0*wy0 &&
               y*(wx0 + hx0) - x*(wy0 + hy0) <= hy0*wx0 - hx0*wy0) {
      return true;
    } else if (x*(wx0-hx0) - y*(hy0-wy0) > hx0*(wx0-hx0) - hy0*(hy0-wy0)     
               && x*(wx0-hx0) - y*(hy0-wy0) < wx0*(wx0-hx0) - wy0*(hy0-wy0)
               && (x*(hy0-wy0) + y*(wx0-hx0) - hy0*wx0 + hx0*wy0)*(x*(hy0-wy0) + y*(wx0-hx0) - hy0*wx0 + hx0*wy0)
               <= rr*((wx0-hx0)*(wx0-hx0) + (wy0-hy0)*(wy0-hy0))) {
      return true;
    } else if (x*(wx0+hx0) + y*(wy0+hy0) > -wx0*(wx0+hx0) - wy0*(wy0+hy0)
               && x*(wx0+hx0) + y*(wy0+hy0) < hx0*(wx0+hx0) + hy0*(wy0+hy0)
               && (y*(wx0+hx0) - x*(wy0+hy0) - hy0*wx0 + hx0*wy0)*(y*(wx0+hx0) - x*(wy0+hy0) - hy0*wx0 + hx0*wy0)
               <= rr*((wx0+hx0)*(wx0+hx0) + (wy0+hy0)*(wy0+hy0))) {
      return true;
    } else {
      if ((hx0-wx0 - x)*(hx0-wx0 - x) + (hy0-wy0 - y)*(hy0-wy0 - y) <= rr) {
        return iio.collision.iterate(options,x, y, hx0, hy0, -wx0, -wy0, rr);
      } else if ((hx0+wx0 - x)*(hx0+wx0 - x) + (hy0+wy0 - y)*(hy0+wy0 - y) <= rr) {
        return iio.collision.iterate(options,x, y, wx0, wy0, hx0, hy0, rr);
      } else if ((wx0-hx0 - x)*(wx0-hx0 - x) + (wy0-hy0 - y)*(wy0-hy0 - y) <= rr) {
        return iio.collision.iterate(options,x, y, -hx0, -hy0, wx0, wy0, rr);
      } else if ((-wx0-hx0 - x)*(-wx0-hx0 - x) + (-wy0-hy0 - y)*(-wy0-hy0 - y) <= rr) {
        return iio.collision.iterate(options,x, y, -wx0, -wy0, -hx0, -hy0, rr);
      } else if (wx0*y - wy0*x < wx0*hy0 - wy0*hx0 && Math.abs(hx0*y - hy0*x) < hy0*wx0 - hx0*wy0) {
        if (hx0*y - hy0*x > 0) {
          return iio.collision.iterate(options,x, y, hx0, hy0, -wx0, -wy0, rr);
        }
        return iio.collision.iterate(options,x, y, wx0, wy0, hx0, hy0, rr);
      } else if (wx0*x + wy0*y > wx0*(hx0-wx0) + wy0*(hy0-wy0) && wx0*x + wy0*y < wx0*(hx0+wx0) + wy0*(hy0+wy0)
                 && (wx0*y - wy0*x - hy0*wx0 + hx0*wy0)*(wx0*y - wy0*x - hy0*wx0 + hx0*wy0) < rr*(wx0*wx0 + wy0*wy0)) {
        if (wx0*x + wy0*y > wx0*hx0 + wy0*hy0) {
          return iio.collision.iterate(options,x, y, wx0, wy0, hx0, hy0, rr);
        }
        return iio.collision.iterate(options,x, y, hx0, hy0, -wx0, -wy0, rr);
      } else {
        if (hx0*y - hy0*x < 0) {
          x = -x;
          y = -y;
        }  
        if (hx0*x + hy0*y > -hx0*(wx0+hx0) - hy0*(wy0+hy0) && hx0*x + hy0*y < hx0*(hx0-wx0) + hy0*(hy0-wy0)
            && (hx0*y - hy0*x - hy0*wx0 + hx0*wy0)*(hx0*y - hy0*x - hy0*wx0 + hx0*wy0) < rr*(hx0*hx0 + hy0*hy0)) {
          if (hx0*x + hy0*y > -hx0*wx0 - hy0*wy0) {      
            return iio.collision.iterate(options,x, y, hx0, hy0, -wx0, -wy0, rr);
          } 
          return iio.collision.iterate(options,x, y, -wx0, -wy0, -hx0, -hy0, rr);
        }
        return false;
      }
    }
  },
  iterate: function(op,x,y,c0x,c0y,c2x,c2y,rr){
    for (var t=1; t<=op.maxIterations; t++) {
      var c1x = (c0x + c2x)*op.innerPolyCoef[t];
      var c1y = (c0y + c2y)*op.innerPolyCoef[t];
      var tx = x-c1x;
      var ty = y-c1y;
      if (tx*tx + ty*ty <= rr) {
        return true;
      }
      var t2x = c2x-c1x;
      var t2y = c2y-c1y;
      if (tx*t2x + ty*t2y >= 0 && tx*t2x + ty*t2y <= t2x*t2x + t2y*t2y &&
          (ty*t2x - tx*t2y >= 0 || rr*(t2x*t2x + t2y*t2y) >= (ty*t2x - tx*t2y)*(ty*t2x - tx*t2y))) {
        return true;
      }
      var t0x = c0x-c1x;
      var t0y = c0y-c1y;
      if (tx*t0x + ty*t0y >= 0 && tx*t0x + ty*t0y <= t0x*t0x + t0y*t0y &&
          (ty*t0x - tx*t0y <= 0 || rr*(t0x*t0x + t0y*t0y) >= (ty*t0x - tx*t0y)*(ty*t0x - tx*t0y))) {
        return true;
      }    
      var c3x = (c0x+c1x)*op.outerPolyCoef[t];
      var c3y = (c0y+c1y)*op.outerPolyCoef[t];
      if ((c3x-x)*(c3x-x) + (c3y-y)*(c3y-y) < rr) {
        c2x = c1x;
        c2y = c1y;
        continue;
      }
      var c4x = c1x-c3x+c1x;
      var c4y = c1y-c3y+c1y;
      if ((c4x-x)*(c4x-x) + (c4y-y)*(c4y-y) < rr) {
        c0x = c1x;
        c0y = c1y;
        continue;
      }
      var t3x = c3x-c1x;
      var t3y = c3y-c1y;
      if (ty*t3x - tx*t3y <= 0 || rr*(t3x*t3x + t3y*t3y) > (ty*t3x - tx*t3y)*(ty*t3x - tx*t3y)) {
        if (tx*t3x + ty*t3y > 0) {
          if (Math.abs(tx*t3x + ty*t3y) <= t3x*t3x + t3y*t3y || (x-c3x)*(c0x-c3x) + (y-c3y)*(c0y-c3y) >= 0) {
            c2x = c1x;
            c2y = c1y;
            continue;
          }
        } else if (-(tx*t3x + ty*t3y) <= t3x*t3x + t3y*t3y || (x-c4x)*(c2x-c4x) + (y-c4y)*(c2y-c4y) >= 0) {
          c0x = c1x;
          c0y = c1y;
          continue;
        }
      }
      return false;
    }
    // Out of iterations so it is unsure if there was a collision.
    return false;
  }
}

/* Interface
------------------
*/

// DEFINITION
iio.Interface = function(){ this.Interface.apply(this, arguments) }

// CONSTRUCTOR
iio.Interface.prototype.Interface = function() {
  this.set(arguments[0], true);
}

// INTERFACE FUNCTIONS
iio.Interface.prototype.set = function() {
  for (var p in arguments[0]) this[p] = arguments[0][p];
  if( this.convert_props ) this.convert_props();
  return this;
}
iio.Interface.prototype.clone = function() {
  return new this.constructor( this );
}
iio.Interface.prototype.toString = function() {
  var str = '';
  for (var p in this) {
    /*if( typeof this[p] === 'function')
      str += p + ' = function\n ';
    else str += p + ' = ' + this[p] + '\n';*/
    if (this[p] instanceof Array)
      str += p + ' = Array['+this[p].length+']\n'
    else if( typeof this[p] !== 'function' 
      && p != '_super' )
      str += p + ' = ' + this[p] + '\n';
  }
  return str;
}

/* Vector
------------------
*/

// DEFINITION
iio.Vector = function(){ this.Vector.apply(this, arguments) };
iio.inherit(iio.Vector, iio.Interface);
iio.Vector.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Vector.prototype.Vector = function( v,y ) {
  if(v instanceof Array){
    this.x = v[0] || 0;
    this.y = v[1] || 0;
  } else if( v && v.x ) {
    this.x = v.x || 0;
    this.y = v.y || 0;
  } else {
    this.x = v || 0;
    this.y = y || 0;
  }
}

// OVERRIDE FUNCTIONS
iio.Vector.prototype.clone = function(){
  return new iio.Vector(this.x,this.y)
}

// STATIC FUNCTIONS
//------------------------------------------------------------
iio.Vector.vs = function ( points ){
  var vs = [];
  if (!(points instanceof Array)) points = [points];
  for (var i = 0; i < points.length; i++) {
    if (typeof points[i].x !== 'undefined')
      vs.push(points[i]);
    else {
      vs.push({
        x: points[i],
        y: points[i + 1]
      });
      i++;
    }
  }
  return vs;
}
iio.Vector.leftmost = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.x>v2.x }).x
}
iio.Vector.rightmost = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.x<v2.x }).x 
}
iio.Vector.highest = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.y>v2.y }).y
}
iio.Vector.lowest = function( vs ){
  return iio.specVec(vs,function(v1,v2){ return v1.y<v2.y }).y
}
iio.Vector.add = function(){
  var v = new iio.Vector();
  for (var v2 in arguments){
    v.x += v2.x;
    v.y += v2.y;
  }
  return v
}
iio.Vector.sub = function(){
  var v = arguments[0].clone();
  for (var i=1; i<arguments.length; i++){
    v.x -= arguments[i].x;
    v.y -= arguments[i].y;
  }
  return v
}
iio.Vector.mult = function( v1,f ){
  var v = v1.clone();
  for (var p in v1)
    v[p] *= f;
  return v
}
iio.Vector.div = function( v1,v2 ){
  var v = v1.clone();
  for (var p in v2)
    if (v[p]) v[p] /= v2[p];
  return v
}
iio.Vector.length = function( v,y ){
  if (typeof v.x !== 'undefined')
     return Math.sqrt(v.x*v.x+v.y*v.y);
  else return Math.sqrt(v*v+y*y);
}
iio.Vector.normalize = function( v,y ){
  return new iio.Vector(v,y).normalize();
}
iio.Vector.dot = function ( v1,v2,x2,y2 ){
  if (typeof v1.x != 'undefined'){
    if (typeof v2.x != 'undefined')
      return v1.x*v2.x+v1.y*v2.y;
    else return v1.x*v2+v1.y*x2;
  } else {
    if (typeof x2.x != 'undefined')
      return v1*x2.x+v2*x2.y;
    else return v1*x2+v2*y2;
  }
}
iio.Vector.dist = function( v1,v2 ){
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
}
iio.Vector.lerp = function( v1,v2,x2,y2,p ){
  if (typeof v1.x != 'undefined')
    return new iio.Vector(v1).lerp(v2,x2,y2);
  else return new iio.Vector(v1,v2).lerp(x2, y2, p);
}
iio.Vector.rotate = function( x,y,r ){
  if (typeof x.x != 'undefined') {
    r = y;
    y = x.y;
    x = x.x;
  }
  if (typeof r == 'undefined' || r == 0) 
    return new iio.Vector(x,y);
  var newX = x * Math.cos(r) - y * Math.sin(r);
  var newY = y * Math.cos(r) + x * Math.sin(r);
  return new iio.Vector(newX,newY);
}

// VECTOR FUNCTIONS
//------------------------------------------------------------
iio.Vector.prototype.add = function( v,y ){
  if (typeof v.x !== 'undefined'){
    this.x += v.x;
    this.y += v.y;
  } else {
    this.x += v;
    this.y += y;
  }
  return this;
}
iio.Vector.prototype.sub = function( v,y ){
  if (typeof v.x !== 'undefined'){
    this.x -= v.x;
    this.y -= v.y;
  } else {
    this.x -= v;
    this.y -= y;
  }
  return this;
}
iio.Vector.prototype.mult = function( f ){
  this.x *= f;
  this.y *= f;
  return this;
}
iio.Vector.prototype.div = function( f ){
  this.x /= f;
  this.y /= f;
  return this;
}
iio.Vector.prototype.length = function(){
  return Math.sqrt(this.x*this.x+this.y*this.y);
}
iio.Vector.prototype.normalize = function (){
  return this.div(this.length());
}
iio.Vector.prototype.dot = function ( v,y ){
  if (typeof v.x !== 'undefined')
    return this.x*v.x+this.y*v.y;
  return this.x*v+this.y*y;
}
iio.Vector.prototype.equals = function( v,y ){
  if( v.x ) return this.x === v.x && this.y === v.y;
  return this.x === x && this.y === y;
}
iio.Vector.prototype.dist = function( v,y ){
  if (typeof v.x !== 'undefined')
    return Math.sqrt((v.x-this.x)*(v.x-this.x)+(v.y-this.y)*(v.y-this.y));
  return Math.sqrt((x-this.x)*(x-this.x)+(y-this.y)*(y-this.y));
}
iio.Vector.prototype.lerp = function( v,y,p ){
  if (typeof v.x !== 'undefined')
    this.add(iio.Vector.sub(v,this).mult(y));
  else this.add(iio.Vector.sub(v,y,this).mult(p));
  return this;
}
iio.Vector.prototype.rotate = function( r ){
  if (!r) return this;
  var x = this.x;
  var y = this.y;
  this.x = x * Math.cos(r) - y * Math.sin(r);
  this.y = y * Math.cos(r) + x * Math.sin(r);
  return this;
}
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


/* Gradient
------------------
*/

// DEFINITION
iio.Gradient = function(){ this.Gradient.apply(this, arguments) };
iio.inherit(iio.Gradient, iio.Interface);
iio.Gradient.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Gradient.prototype.Gradient = function() {
  this._super.Interface.call(this,iio.merge_args(arguments));
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Gradient.prototype.convert_props = function(){
  iio.convert.property.vector(this, "start");
  iio.convert.property.vector(this, "end");
  for(var i=0; i<this.stops.length; i++)
    if(iio.is.string(this.stops[i][1]))
      this.stops[i][1] = iio.convert.color(this.stops[i][1]);
}

// GRADIENT FUNCTIONS
iio.Gradient.prototype.canvasGradient = function(ctx){
  var gradient;
  if(this.startRadius)
    gradient = ctx.createRadialGradient(
      this.start.x,this.start.y,this.startRadius,
      this.end.x,this.end.y,this.endRadius);
  else gradient = ctx.createLinearGradient(
    this.start.x,this.start.y,this.end.x,this.end.y);
  for(var i=0; i<this.stops.length; i++)
    gradient.addColorStop(
      this.stops[i][0],this.stops[i][1].rgbaString());
  return gradient;
}

/* Drawable
------------------
*/

// DEFINITION
iio.Drawable = function(){ this.Drawable.apply(this, arguments) }
iio.inherit(iio.Drawable, iio.Interface);
iio.Drawable.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Drawable.prototype.Drawable = function() {
  iio.Drawable.prototype._super.Interface.call(this, arguments[0]);
  this.pos = this.pos || new iio.Vector(0,0);
  this.objs = [];
  this.collisions = [];
  this.loops = [];
}

// OVERRIDE FUNCTIONS
//-------------------------------------------------------------------
iio.Drawable.prototype.set = function() {
  iio.Drawable.prototype._super.set.call(this, arguments[0]);
  if (arguments[arguments.length-1] === true);
  else if(this.app) this.app.draw();
  return this;
}
iio.Drawable.prototype.convert_props = function(){
  iio.convert.property.color(this,"color");
  iio.convert.property.color(this,"outline");
}


// DATA MANAGEMENT FUNCTIONS
//-------------------------------------------------------------------
iio.Drawable.prototype.localFrameVector = function(v){
  return new iio.Vector( 
    v.x - this.pos.x, 
    v.y - this.pos.y
  )
}
iio.Drawable.prototype.localizeRotation = function(v,n){
  if (this.rotation) {
    if (this.origin) {
      v.x -= this.origin.x;
      v.y -= this.origin.y;
    }
    v.rotate( n ? this.rotation : -this.rotation );
    if (this.origin){
      v.x += this.origin.x;
      v.y += this.origin.y;
    }
  }
  return v;
}
iio.Drawable.prototype.localize = function(v,y){
  var v = new iio.Vector( v.x || v, v.y || y);
  if (this.pos){
    v.x -= this.pos.x;
    v.y -= this.pos.y;
  }
  return this.localizeRotation(v);
}
iio.Drawable.prototype.localLeft = function(){
  return this.left() - this.pos.x;
}
iio.Drawable.prototype.localRight = function(){
  return this.right() - this.pos.x;
}
iio.Drawable.prototype.localTop = function(){
  return this.top() - this.pos.y;
}
iio.Drawable.prototype.localBottom = function(){
  return this.bottom() - this.pos.y;
}

// OBJECT MANAGMENT FUNCTIONS
//-------------------------------------------------------------------
iio.Drawable.prototype.clear = function( noDraw ) {
  for(var i=0; i<this.objs.length; i++)
    iio.cancelLoops(this.objs[i]);
  this.objs = [];
  if ( noDraw );
  else if(this.app) this.app.draw();
  return this;
}
iio.Drawable.prototype.add = function() {

  // if input is Array
  if (arguments[0] instanceof Array)
    for(var i=0; i<arguments[0].length; i++)
      this.add(arguments[0][i], true);

  // else input is singular object
  else {

    // set hierarchy properties
    arguments[0].parent = this;

    // set app & ctx refs for object
    arguments[0].app = this.app;
    arguments[0].ctx = this.ctx;

    // set app & ctx refs for object children
    if(arguments[0].objs && arguments[0].objs.length>0)
      for(var i=0; i<arguments[0].objs.length; i++){
        arguments[0].objs[i].app = this.app;
        arguments[0].objs[i].ctx = this.ctx; 
      }

    // initialize with context if Text
    if (arguments[0] instanceof iio.Text){
      arguments[0].inferSize();
      if (arguments[0].showCursor)
        arguments[0].init_cursor();
    }

    // set default z index
    if (typeof arguments[0].z === 'undefined') 
      arguments[0].z = 0;

    // insert into objs in order of z index
    var i = 0;
    while ( i < this.objs.length 
      && typeof this.objs[i].z !== 'undefined' 
      && arguments[0].z >= this.objs[i].z) i++;
    this.objs.splice(i, 0, arguments[0]);

    // set loop if neccessary
    if ( arguments[0].app && 
        (  arguments[0].vel 
        || arguments[0].vels 
        || arguments[0].rVel 
        || arguments[0].bezierVels 
        || arguments[0].bezierAccs
        || arguments[0].acc
        || arguments[0].accs 
        || arguments[0].rAcc 
        || arguments[0].onUpdate 
        || arguments[0].shrink 
        || arguments[0].fade 
        ) && !arguments[0].app.looping )
      arguments[0].app.loop();
  }

  // redraw unless suppressed
  if (arguments[arguments.length-1] === true);
  else if(this.app) this.app.draw();

  // return given object
  return arguments[0];
}
iio.Drawable.prototype.rmv = function() {
  if (!this.objs) return false;

  // if input is Array
  if (arguments[0] instanceof Array)
    for(var i=0; i<arguments[0].length; i++)
      this.rmv(arguments[0][i], true);

  // input is a singular object
  else {
    var _argument = arguments[0];
    remove = function(c, i, arr) {
      if (c == _argument) {
        arr.splice(i, 1);
        return true;
      } else return false;
    }

    // remove object at index
    if ( iio.is.number( arguments[0] ) ){
      if( arguments[0] < this.objs.length )
        _argument = this.objs.splice( arguments[0], 1 );
      else return false;

    // remove passed object
    } else if (this.objs) 
      this.objs.some(remove);

    // remove associated collisions
    if (this.collisions) this.collisions.forEach(function(collision, i) {

      // remove collision referring only to removed object
      if ( collision[0] === _argument || collision[1] === _argument )
        this.collisions.splice(i, 1);
      else {
        // remove reference to removed object from collision arrays
        if (collision[0] instanceof Array)
          collision[0].some(remove)
        if (collision[1] instanceof Array)
          collision[1].some(remove)
      }
    })
  }

  // redraw unless suppressed
  if (arguments[arguments.length-1] === true);
  else if(this.app) this.app.draw();

  // return removed object(s)
  return arguments[0];
}
iio.Drawable.prototype.create = function(){
  var props = {};
  for(var i=0; i<arguments.length; i++){
    if(arguments[i] === null) continue;

    // given string
    if( iio.is.string(arguments[i]) ){
      // infer color
      if( iio.Color[ arguments[i] ] )
        props.color = iio.Color[ arguments[i] ]();
      // infer text
      else props.text = arguments[i]
    }

    // given Color
    else if(arguments[i] instanceof iio.Color)
      // infer color
      props.color = arguments[i];

    // given Vector
    else if( arguments[i] instanceof iio.Vector )
      // infer position
      props.pos = arguments[i];

    // given Array
    else if( arguments[i] instanceof Array )
      // infer position
      props.pos = iio.convert.vector(arguments[i]);

    //given Object
    else if(typeof arguments[i] === 'object')
      // merge objects
      props = iio.merge(props,arguments[i]);

    // given number
    else if(iio.is.number(arguments[i]))
      // infer width
      props.width = arguments[i];
  }

  if(props.vs){
    // infer Line
    if(props.vs.length === 2)
      return this.add(new iio.Line(props));
    // infer Polygon
    else return this.add(new iio.Polygon(props));
  } 
  // infer Ellipse
  else if(props.radius)
    return this.add(new iio.Ellipse(props));
  // infer Text
  else if(props.text)
    return this.add(new iio.Text(props));
  // infer Grid
  else if(props.res || props.R || props.C)
    return this.add(new iio.Grid(props));
  // infer Rectangle
  else if(props.width)
    return this.add(new iio.Quad(props));
  // infer Color
  else if(props.color)
    return props.color;
  // infer Vector
  else if(props.pos)
    return props.pos
  return false;
}
iio.Drawable.prototype.collision = function(o1, o2, fn) {
  this.collisions.push( [o1, o2, fn] );
  return this.collisions.length-1;
}
iio.Drawable.prototype.cCollisions = function(o1, o2, fn) {
  if (o1 instanceof Array) {
    if (o2 instanceof Array) {
      if (o2.length == 0) return;
      o1.forEach(function(_o1) {
        o2.forEach(function(_o2) {
          if (iio.collision.check(_o1, _o2))
            fn(_o1, _o2);
        });
      });
    } else {
      o1.forEach(function(_o1) {
        if (iio.collision.check(_o1, o2))
          fn(_o1, o2);
      });
    }
  } else {
    if (o2 instanceof Array) {
      o2.forEach(function(_o2) {
        if (iio.collision.check(o1, _o2))
          fn(o1, _o2);
      });
    } else if (iio.collision.check(o1, o2))
      fn(o1, o2);
  }
}
iio.Drawable.prototype._update = function(o,dt){
  var nuFPS;
  if (this.update)
    nuFPS = this.update(dt);
  if (this.collisions && this.collisions.length > 0) {
    this.collisions.forEach(function(collision) {
      this.cCollisions(collision[0], collision[1], collision[2]);
    }, this);
  }
  if (this.objs && this.objs.length > 0)
    this.objs.forEach(function(obj) {
      if (obj.update && obj.update(o, dt)) this.rmv(obj);
    }, this);
  return nuFPS;
}

// LOOP MANAGMENT FUNCTIONS
//-------------------------------------------------------------------
iio.Drawable.prototype.loop = function(fps, callback) {
  // set looping flag
  this.looping = true;

  // create loop object
  var loop;
  if (typeof callback === 'undefined') {
    // replace mainLoop: 60fps with no callback
    if (typeof fps === 'undefined') {
      // cancel old mainLoop if it exists
      if (this.app.mainLoop)
        iio.cancelLoop(this.app.mainLoop.id);

      // define new mainLoop
      loop = this.app.mainLoop = {
        fps: 60,
        fn: this,
        af: this.rqAnimFrame,
        o: this.app
      }

      // set new mainLoop and app fps
      this.app.fps = loop.fps;
      loop.id = this.app.mainLoop.id = iio.loop(this.app.mainLoop);

    } else {
      // loop given callback at 60fps
      if (!iio.is.number(fps)) {
        loop = {
          fps: 60,
          fn: fps,
          af: this.rqAnimFrame
        }
        loop.id = iio.loop(loop, fps);
      } 
      // replace mainLoop: given fps with callback
      else {
        // cancel old mainLoop if it exists
        if (this.app.mainLoop)
          iio.cancelLoop(this.app.mainLoop.id);
        
        // define new mainLoop
        loop = this.app.mainLoop = {
          fps: fps,
          o: this.app,
          af: false
        }

        // set new mainLoop and app fps
        this.app.fps = fps;
        loop.id = this.app.mainLoop.id = iio.loop(this.app.mainLoop);
      }
    }
  } 
  // loop callback at given framerate
  else {
    loop = {
      fps: fps,
      fn: callback,
      o: this,
      af: this.rqAnimFrame
    }
    loop.id = iio.loop(fps, loop);
  }

  // add new loop to array
  this.loops.push(loop);
  
  // return id of new loop
  return loop.id;
}
iio.Drawable.prototype.togglePause = function(c) {
  if(this.paused) this.unpause(c);
  else this.pause(c);
}
iio.Drawable.prototype.pause = function(c) {
  if (!this.paused) {
    iio.cancelLoops(this);
    iio.cancelLoop(this.mainLoop.id);
    this.paused = true;
  }
  return this;
}
iio.Drawable.prototype.unpause = function(c) {
  if (this.paused) {
    this.paused = false;
    var drawable = this;
    this.loops.forEach(function(loop) {
      if (drawable.mainLoop && loop.id === drawable.mainLoop.id) {
        iio.loop(drawable.mainLoop);
      } else {
        iio.loop(loop);
      }
    });
    if (typeof c === 'undefined')
      this.objs.forEach(function(o) {
        o.loops.forEach(function(loop) {
          iio.loop(loop);
        });
      });
  }
}

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

/* Shape
------------------
*/

// DEFINITION
iio.Shape = function(){ this.Shape.apply(this, arguments) }
iio.inherit(iio.Shape, iio.Drawable);
iio.Shape.prototype._super = iio.Drawable.prototype;

// CONSTRUCTOR
iio.Shape.prototype.Shape = function() {
  iio.Shape.prototype._super.Drawable.call(this,arguments[0]);
}

// OVERRIDE FUNCTIONS
iio.Shape.prototype.convert_props = function(){
  iio.Shape.prototype._super.convert_props.call(this, iio.merge_args(arguments));

  // convert string colors to iio.Color
  iio.convert.property.color(this,"outline");
  iio.convert.property.color(this,"shadow");

  // convert values to arrays
  if(this.dash && !(this.dash instanceof Array))
    this.dash = [this.dash];

  // arrays to iio.Vector
  iio.convert.property.vector(this,"pos");
  iio.convert.property.vector(this,"origin");
  iio.convert.property.vector(this,"vel");
  iio.convert.property.vector(this,"acc");
  iio.convert.property.vector(this,"shadowOffset");
  iio.convert.property.vector(this,"res");
  iio.convert.property.vectors(this,"vs");
  iio.convert.property.vectors(this,"vels");
  iio.convert.property.vectors(this,"accs");
  iio.convert.property.vectors(this,"bezier");
  iio.convert.property.vectors(this,"bezierVels");
  iio.convert.property.vectors(this,"bezierAccs");

  // set required properties
  if(typeof this.fade !== 'undefined' && typeof this.alpha === 'undefined')
    this.alpha = 1;
  if(typeof this.rAcc !== 'undefined' && !this.rVel) 
    this.rVel = 0;
  if(typeof this.rVel !== 'undefined' && !this.rotation) 
    this.rotation = 0;
  if(this.accs && !this.vels){
    this.vels = [];
    for(var i=0; i<this.accs.length; i++)
      this.vels.push(new iio.Vector);
  }
  if(this.bezierAccs && !this.bezierVels){
    this.bezierVels = [];
    for(var i=0; i<this.bezierAccs.length; i++)
      this.bezierVels.push(new iio.Vector);
  }
  if(this.bezierVels && !this.bezier){
    this.bezier = [];
    for(var i=0; i<this.bezierVels.length; i++)
      this.bezier.push(new iio.Vector);
  }

  // handle image attachment
  if (this.img){
    if(iio.is.string(this.img)) {
      var src = this.img;
      this.img = new Image();
      this.img.src = src;
      this.img.parent = this;
      var o = this;
      if (!this.size()){
        this.img.onload = function(e) {
          o.setSize(o.img.width || 0, o.img.height || 0);
          if(o.app) o.app.draw()
        }
      } else this.img.onload = function(e) {
        if(o.app) o.app.draw()
      }
    } else {
      if (!this.size()) {
        this.setSize(this.img.width || 0, this.img.height || 0);
        if(this.app) this.app.draw()
      }
    }
  }

  // handle anim attachment
  if(this.anims){
    this.animFrame = this.animFrame || 0;
  }
}

// BOUNDS FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.left = function(){
  if (this.pos) return this.pos.x; 
  else return 0
}
iio.Shape.prototype.right = function(){
  if (this.pos) return this.pos.x;
  else return 0
}
iio.Shape.prototype.top = function(){
  if (this.pos) return this.pos.y;
  else return 0
}
iio.Shape.prototype.bottom = function(){
  if (this.pos) return this.pos.y;
  else return 0
}
iio.Shape.prototype.resolve = function(b, c) {
  if (b.callback) return b.callback(c);
  return true;
}
iio.Shape.prototype.over_upper_limit = function(bnd, val, c) {
  if ( iio.is.number(bnd) && val > bnd 
   || typeof bnd.bound !== 'undefined' && val > bnd.bound ) 
    return this.resolve(bnd, c);
  return false;
}
iio.Shape.prototype.below_lower_limit = function(bnd, val, c) {
  if ( iio.is.number(bnd) && val < bnd
   || typeof bnd.bound !== 'undefined' && val < bnd.bound ) 
    return this.resolve(bnd, c);
  return false;
}

// UPDATE FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.update = function() {

  // transform and remove Shapeect if necessary
  var remove = false;
  if(this.bounds) remove = this.past_bounds();
  if (this.shrink) remove = this.update_shrink();
  if (this.fade) remove = this.update_fade();
  if (remove) return remove;

  // update position
  if (this.acc) this.update_acc();
  if (this.vel) this.update_vel();
  if (this.rAcc) this.rVel += this.rAcc;
  if (this.rVel) this.update_rotation();
  if (this.accs) this.update_accs();
  if (this.vels && this.vs) this.update_vels();
  if (this.bezierAccs) this.update_bezier_accs();
  if (this.bezierVels) this.update_bezier_vels();

  if (this.onUpdate) this.onUpdate(this);
}
iio.Shape.prototype.update_vel = function(){
  if(this.pos){
    if (this.vel.x) this.pos.x += this.vel.x;
    if (this.vel.y) this.pos.y += this.vel.y;
  } else if(this.vs)
    for(var i=0; i<this.vs.length; i++){
      if (this.vel.x) this.vs[i].x += this.vel.x;
      if (this.vel.y) this.vs[i].y += this.vel.y;
    }
}
iio.Shape.prototype.update_vels = function(){
  for(var i=0; i<this.vels.length; i++){
    if (this.vels[i].x) this.vs[i].x += this.vels[i].x;
    if (this.vels[i].y) this.vs[i].y += this.vels[i].y;
  }
}
iio.Shape.prototype.update_bezier_vels = function(){
  for(var i=0; i<this.bezierVels.length; i++){
    if (this.bezierVels[i].x) this.bezier[i].x += this.bezierVels[i].x;
    if (this.bezierVels[i].y) this.bezier[i].y += this.bezierVels[i].y;
  }
}
iio.Shape.prototype.update_bezier_accs = function(){
  for(var i=0; i<this.bezierAccs.length; i++){
    if (this.bezierAccs[i].x) this.bezierVels[i].x += this.bezierAccs[i].x;
    if (this.bezierAccs[i].y) this.bezierVels[i].y += this.bezierAccs[i].y;
  }
}
iio.Shape.prototype.update_rotation = function(){
  this.rotation += this.rVel;
  if(this.rotation > 6283 || this.rotation < -6283)
    this.rotation = 0;
}
iio.Shape.prototype.update_acc = function(){
  this.vel.x += this.acc.x;
  this.vel.y += this.acc.y;
}
iio.Shape.prototype.update_accs = function(){
  for(var i=0; i<this.accs.length; i++){
    if (this.accs[i].x) this.vels[i].x += this.accs[i].x;
    if (this.accs[i].y) this.vels[i].y += this.accs[i].y;
  }
}
iio.Shape.prototype.update_shrink = function(){
  if (this.shrink.speed)
    return this._shrink(this.shrink.speed, this.shrink.callback);
  else return this._shrink(this.shrink);
}
iio.Shape.prototype.update_fade = function(){
  if (this.fade.speed)
    return this._fade(this.fade.speed, this.fade.callback);
  else return this._fade(this.fade);
}
iio.Shape.prototype.past_bounds = function(){
  if (this.bounds.right
   && this.over_upper_limit(this.bounds.right, this.right(), this))
    return true;
  if (this.bounds.left
   && this.below_lower_limit(this.bounds.left, this.left(), this))
    return true;
  if (this.bounds.top
   && this.below_lower_limit(this.bounds.top, this.top(), this))
    return true;
  if (this.bounds.bottom
   && this.over_upper_limit(this.bounds.bottom, this.bottom(), this))
    return true;
  if (this.bounds.rightRotation
   && this.over_upper_limit(this.bounds.rightRotation, this.rotation, this))
    return true;
  if (this.bounds.leftRotation
   && this.below_lower_limit(this.bounds.leftRotation, this.rotation, this))
    return true;
  return false;
}

// ANIMATION FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.playAnim = function() {
  var args = iio.merge_args(arguments);
  if (args.name) this.setSprite(args.name);
  this.animFrame = args.startFrame || 0;
  this.animRepeats = args.repeat;
  this.onAnimComplete = args.onAnimComplete;
  var loop;
  if (args.fps > 0) loop = this.loop(args.fps, this.nextFrame);
  else if (args.fps < 0) loop = this.loop(args.fps * -1, this.prevFrame);
  else this.app.draw();
  return this;
}
iio.Shape.prototype.stopAnim = function() {
  iio.cancelLoops(this);
  return this;
}
iio.Shape.prototype.setSprite = function(s, noDraw) {
  iio.cancelLoops(this);
  if (iio.is.string(s)) {
    var o = this;
    this.anims.some(function(anim, i) {
      if (anim.name === s) {
        o.animFrame = 0;
        o.animKey = i;
        o.width = anim.frames[o.animFrame].w;
        o.height = anim.frames[o.animFrame].h;
        return true;
      }
      return false;
    });
  } else {
    this.anims.splice(0,0,s);
    this.animKey = 0;
    this.animFrame = 0;
    this.width = s.frames[0].w;
    this.height = s.frames[0].h;
  }
  if(noDraw);
  else o.app.draw();
  return this;
}
iio.Shape.prototype.nextFrame = function(o) {
  o.animFrame++;
  if (o.animFrame >= o.anims[o.animKey].frames.length) {
    o.animFrame = 0;
    if (typeof o.animRepeats !== 'undefined') {
      if (o.animRepeats <= 1) {
        window.cancelAnimationFrame(id);
        window.clearTimeout(id);
        if (o.onAnimComplete) o.onAnimComplete(o);
        return;
      } else o.animRepeats--;
    }
  }
}
iio.Shape.prototype.prevFrame = function(o) {
  o.animFrame--;
  if (o.animFrame < 0)
    o.animFrame = o.anims[o.animKey].frames.length - 1;
  o.app.draw();
}
iio.Shape.prototype._shrink = function(s, r) {
  this.width *= 1 - s;
  this.height *= 1 - s;
  if (this.width < .02 
    || this.width < this.shrink.lowerBound 
    || this.width > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}
iio.Shape.prototype._fade = function(s, r) {
  this.alpha *= 1 - s;
  if (this.alpha < s || this.alpha > 1-s
    ||this.alpha > this.fade.upperBound
    ||this.alpha < this.fade.lowerBound) {
    if(this.alpha > 1) this.alpha = 1;
    else if(this.alpha < 0) this.alpha = 0;
    if (r) return r(this);
    else return true;
  }
}

// DRAW FUNCTIONS
//-------------------------------------------------------------------
iio.Shape.prototype.orient_ctx = function(ctx){
  ctx = ctx || this.app.ctx;
  ctx.save();

  //translate & rotate
  if (this.pos){
    if (this.imageRounding)
      ctx.translate(Math.floor(this.pos.x), Math.floor(this.pos.y));
    else ctx.translate(this.pos.x, this.pos.y); 
  }
  if(this.rotation){
    if (this.origin){
      if (this.imageRounding)
        ctx.translate(Math.floor(this.origin.x), Math.floor(this.origin.y));
      else ctx.translate(this.origin.x, this.origin.y);
    }
    ctx.rotate(this.rotation);
    if (this.origin){
      if (this.imageRounding)
        ctx.translate(Math.floor(-this.origin.x), Math.floor(-this.origin.y));
      else ctx.translate(-this.origin.x, -this.origin.y);
    }
  }
  if(this.flip){
    if(this.flip.indexOf('x') > -1)
      ctx.scale(-1, 1);
    if(this.flip.indexOf('y') > -1)
      ctx.scale(1, -1);
  }
  return ctx;
}
iio.Shape.prototype.prep_ctx_color = function(ctx){
  if(this.color instanceof iio.Gradient)
    ctx.fillStyle = this.color.canvasGradient(ctx);
  else ctx.fillStyle = this.color.rgbaString();
  return ctx;
}
iio.Shape.prototype.prep_ctx_outline = function(ctx){
  if(this.outline instanceof iio.Gradient)
    ctx.strokeStyle = this.outline.canvasGradient(ctx);
  else ctx.strokeStyle = this.outline.rgbaString();
  return ctx;
}
iio.Shape.prototype.prep_ctx_lineWidth = function(ctx){
  ctx.lineWidth = this.lineWidth || 1;
  return ctx;
}
iio.Shape.prototype.prep_ctx_shadow = function(ctx){
  ctx.shadowColor = this.shadow.rgbaString();
  if(this.shadowBlur) ctx.shadowBlur = this.shadowBlur;
  if(this.shadowOffset) {
    ctx.shadowOffsetX = this.shadowOffset.x;
    ctx.shadowOffsetY = this.shadowOffset.y;
  } else {
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
  }
  return ctx;
}
iio.Shape.prototype.prep_ctx_dash = function(ctx){
  if(this.dashOffset) ctx.lineDashOffset = this.dashOffset
  ctx.setLineDash(this.dash);
  return ctx;
}
iio.Shape.prototype.finish_path_shape = function(ctx){
  if (this.color) ctx.fill();
  if (this.img) {
    if (this.imageRounding)
      ctx.drawImage(this.img,
        Math.floor(-this.width/2),
        Math.floor(-this.height/2),
        Math.floor(this.width),
        Math.floor(this.height));
    else ctx.drawImage(this.img,
      -this.width/2,
      -this.height/2,
      this.width,
      this.height);
  }
  if (this.anims) {
    if (this.imageRounding)
      ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
        this.anims[this.animKey].frames[this.animFrame].x,
        this.anims[this.animKey].frames[this.animFrame].y,
        this.anims[this.animKey].frames[this.animFrame].w,
        this.anims[this.animKey].frames[this.animFrame].h,
        Math.floor(-this.width/2),
        Math.floor(-this.height/2),
        Math.floor(this.width),
        Math.floor(this.height));
    else ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
        this.anims[this.animKey].frames[this.animFrame].x,
        this.anims[this.animKey].frames[this.animFrame].y,
        this.anims[this.animKey].frames[this.animFrame].w,
        this.anims[this.animKey].frames[this.animFrame].h,
      -this.width/2,
      -this.height/2,
      this.width,
      this.height);
  }
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
} 
iio.Shape.prototype.draw_obj = function(ctx){
  ctx.save();
  if(this.alpha) ctx.globalAlpha = this.alpha;
  if (this.lineCap) ctx.lineCap = this.lineCap;
  if (this.shadow) ctx = this.prep_ctx_shadow(ctx);
  if (this.dash) ctx = this.prep_ctx_dash(ctx);
  if (this.color) ctx = this.prep_ctx_color(ctx);
  if (this.outline) {
    ctx = this.prep_ctx_outline(ctx);
    ctx = this.prep_ctx_lineWidth(ctx);
  }
  if ((this.img || this.anims) && !this.noImageSmoothing) {
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  }
  if(this.draw_shape) this.draw_shape(ctx);
  ctx.restore();
}
iio.Shape.prototype.draw = function(ctx){

  if (this.hidden) return;
  ctx = this.orient_ctx(ctx);
  
  //draw objs in z index order
  if (this.objs&&this.objs.length > 0) {
    var drawnSelf = false;
    for(var i=0; i<this.objs.length; i++){
      if (!drawnSelf && this.objs[i].z >= this.z) {
        this.draw_obj(ctx);
        drawnSelf = true;
      }
      if (this.objs[i].draw
       && (!this.clipObjs 
        || (this.objs[i].right() > this.localLeft()
         && this.objs[i].left() < this.localRight()
         && this.objs[i].bottom() > this.localTop()
         && this.objs[i].top() < this.localBottom()))) 
        this.objs[i].draw(ctx);
    }
    if (!drawnSelf) this.draw_obj(ctx);
  } 
  //draw
  else this.draw_obj(ctx);
  ctx.restore();
}
/* Ellipse
------------------
*/

// DEFINITION
iio.Ellipse = function(){ this.Ellipse.apply(this, arguments) };
iio.inherit(iio.Ellipse, iio.Shape);
iio.Ellipse.prototype._super = iio.Shape.prototype;

// CONSTRUCTOR
iio.Ellipse.prototype.Ellipse = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
}

// OVERRIDE FUNCTIONS
iio.Ellipse.prototype.left = function(){
  return this.pos.x - this.radius
}
iio.Ellipse.prototype.right = function(){
  return this.pos.x + this.radius
}
iio.Ellipse.prototype.top = function(){
  return this.pos.y - (this.vRadius || this.radius)
}
iio.Ellipse.prototype.bottom = function(){
  return this.pos.y + (this.vRadius || this.radius)
}
iio.Ellipse.prototype._shrink = function(s, r) {
  this.radius *= 1 - s;
  if (this.vRadius) this.vRadius *= 1 - s;
  if (this.radius < .02 
    || this.radius < this.shrink.lowerBound 
    || this.radius > this.shrink.upperBound) {
    if (r) return r(this);
    return true;
  }
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Ellipse.prototype.size = function(){ return this.radius }
iio.Ellipse.prototype.setSize = function(r,r2){ 
  this.radius = r/2;
  this.vRadius = r2 ? r2/2 : undefined;
  return this;
}
iio.Ellipse.prototype.contains = function(v, y) {
  if (typeof(y) !== 'undefined') v = { x:v, y:y }
  if ((!this.vRadius || this.radius === this.vRadius) && iio.Vector.dist(v, this.pos) < this.radius)
    return true;
  v = this.localize(v);
  if (Math.pow(v.x, 2) / Math.pow(this.radius, 2) + Math.pow(v.y, 2) / Math.pow(this.vRadius, 2) <= 1)
    return true;
  return false;
}
iio.Ellipse.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  if (this.vRadius !== undefined) {
    if (ctx.ellipse) {
      ctx.ellipse(0,0, this.radius,this.vRadius, 0, 0,2*Math.PI, false)
    } else {
      ctx.save();
      ctx.translate(-this.radius, -this.vRadius);
      ctx.scale(this.radius, this.vRadius);
      ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
      ctx.restore();
    }
  } else ctx.arc(0,0, this.radius, 0,2*Math.PI, false);
  if (this.color) ctx.fill();
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
  if (this.img) {
    if (this.imageRounding)
      ctx.drawImage(this.img,
        Math.floor(-this.radius),
        Math.floor(-(this.vRadius||this.radius)),
        Math.floor(this.radius*2),
        Math.floor((this.vRadius||this.radius)*2));
    else ctx.drawImage(this.img,
      -this.radius,
      -(this.vRadius||this.radius),
      this.radius*2,
      (this.vRadius||this.radius)*2);
  }
  if(this.refLine){
    ctx.save();
    ctx.lineWidth = this.refLineWidth || this.lineWidth || 1;
    if (this.refLine instanceof iio.Color)
      ctx.strokeStyle = this.refLine.rgbaString();
    else if (this.color)
      ctx.strokeStyle = this.color.rgbaString();
    else ctx.strokeStyle = this.outline.rgbaString();
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,this.radius);
    ctx.stroke();
    ctx.restore();
  }
}

/* Polygon
------------------
*/

// DEFINITION
iio.Polygon = function(){ this.Polygon.apply(this, arguments) };
iio.inherit(iio.Polygon, iio.Shape);
iio.Polygon.prototype._super = iio.Shape.prototype;

// CONSTRUCTOR
iio.Polygon.prototype.Polygon = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
}

// OVERRIDE FUNCTIONS
iio.Polygon.prototype.left = function(){ 
  return iio.Vector.leftmost(this.trueVs())
}
iio.Polygon.prototype.right = function(){ 
  return iio.Vector.rightmost(this.trueVs())
}
iio.Polygon.prototype.top = function(){ 
  return iio.Vector.highest(this.trueVs())
}
iio.Polygon.prototype.bottom = function(){ 
  return iio.Vector.lowest(this.trueVs())
}
iio.Polygon.prototype.finish_path_shape = function(ctx){
  if (this.color) ctx.fill();
  if (this.img) {
    var left = iio.Vector.leftmost(this.vs);
    var top = iio.Vector.highest(this.vs);
    var right = iio.Vector.rightmost(this.vs);
    var bottom = iio.Vector.lowest(this.vs);
    if (this.imageRounding){
      left = Math.floor(left);
      right = Math.floor(right);
      top = Math.floor(top);
      bottom = Math.floor(bottom);
    }
    ctx.drawImage(this.img,left,top,right-left,bottom-top);
  }
  if (this.outline) ctx.stroke();
  if (this.clip) ctx.clip();
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Polygon.prototype.trueVs = function() {
  var vs = [];
  for(var v,i=0; i<this.vs.length; i++){
    v = this.localizeRotation(this.vs[i].clone(),true);
    v.x += this.pos.x;
    v.y += this.pos.y;
    vs[i]=v;
  }
  return vs;
}
iio.Polygon.prototype.contains = function(v, y) {
  v = this.localize(v,y);
  var i=j=c=0;
  for (i=0, j=this.vs.length-1; i<this.vs.length; j=i++) {
    if (((this.vs[i].y > v.y) !== (this.vs[j].y > v.y)) &&
      (v.x < (this.vs[j].x - this.vs[i].x)
        * (v.y - this.vs[i].y) / (this.vs[j].y - this.vs[i].y) 
        + this.vs[i].x))
      c = !c;
  }
  return c;
}
iio.Polygon.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.vs[0].x, this.vs[0].y);
  if (this.bezier) {
    var _i=0;
    for (var i=1; i<this.vs.length; i++)
      ctx.this.bezierCurveTo(this.bezier[_i++] || this.vs[i - 1].x, 
        this.bezier[_i++] || this.vs[i - 1].y, 
        this.bezier[_i++] || this.vs[i].x, 
        this.bezier[_i++] || this.vs[i].y,
         this.vs[i].x, this.vs[i].y);
    if (!this.open) {
      i--;
      ctx.this.bezierCurveTo(this.bezier[_i++] || this.vs[i].x,
       this.bezier[_i++] || this.vs[i].y,
       this.bezier[_i++] || 0,
       this.bezier[_i++] || 0,
       0, 0);
    }
  } else for(var i=1; i<this.vs.length; i++)
    ctx.lineTo(this.vs[i].x, this.vs[i].y);
  if (!this.open)
    ctx.closePath();
  this.finish_path_shape(ctx);
}

/* Line
------------------
*/

// DEFINITION
iio.Line = function(){ this.Line.apply(this, arguments) };
iio.inherit(iio.Line, iio.Shape);
iio.Line.prototype._super = iio.Shape.prototype;

// CONSTRUCTOR
iio.Line.prototype.Line = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
}

// SHARED POLYGON FUNCTIONS
iio.Line.prototype.trueVs = iio.Polygon.prototype.trueVs;
iio.Line.prototype.left = iio.Polygon.prototype.left;
iio.Line.prototype.right = iio.Polygon.prototype.right;
iio.Line.prototype.top = iio.Polygon.prototype.top;
iio.Line.prototype.bottom = iio.Polygon.prototype.bottom;

// OVERRIDE FUNCTIONS
iio.Line.prototype.prep_ctx_color = function(ctx){
  if(this.color instanceof iio.Gradient)
    ctx.strokeStyle = this.color.canvasGradient(ctx);
  else ctx.strokeStyle = this.color.rgbaString();
  ctx = this.prep_ctx_lineWidth(ctx);
  return ctx;
}
iio.Line.prototype.prep_ctx_lineWidth = function(ctx){
  ctx.lineWidth = this.width || 1;
  return ctx;
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Line.prototype.draw_shape = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.vs[0].x, this.vs[0].y);
  if (this.bezier)
    ctx.bezierCurveTo(this.bezier[0].x, this.bezier[0].y, this.bezier[1].x, this.bezier[1].y, this.vs[1].x, this.vs[1].y);
  else ctx.lineTo(this.vs[1].x, this.vs[1].y);
  ctx.stroke();
}
/*iio.Line.prototype.contains = function(v, y) {
  if (typeof(y) != 'undefined') v = {
    x: v,
    y: y
  } 
  if (iio.is.between(v.x, this.pos.x, this.vs[1].x) && iio.is.between(v.y, this.vs[0].y, this.vs[1].y)) {
    var a = (this.vs[1].y - this.vs[0].y) / (this.vs[1].x - this.vs[0].x);
    if (!isFinite(a)) return true;
    var y = a * (this.vs[1].x - this.vs[0].x) + this.vs[0].y;
    if (y == v.y) return true;
  }
  return false;
}*/

/* Rectangle
------------------
*/

// DEFINITION
iio.Rectangle = function(){ this.Rectangle.apply(this, arguments) };
iio.inherit(iio.Rectangle, iio.Polygon);
iio.Rectangle.prototype._super = iio.Polygon.prototype;

// CONSTRUCTOR
iio.Rectangle.prototype.Rectangle = function() {
  this._super.Polygon.call(this,iio.merge_args(arguments));
  this.height = this.height || this.width;
  this.vs = [
    new iio.Vector(-this.width/2,-this.height/2),
    new iio.Vector(this.width/2,-this.height/2),
    new iio.Vector(this.width/2,this.height/2),
    new iio.Vector(-this.width/2,this.height/2),
  ];
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Rectangle.prototype.size = function(){ return this.width }
iio.Rectangle.prototype.setSize = function(w,h){
  this.width = w;
  this.height = h||w;
}
iio.Rectangle.prototype.contains = function(v, y) {
  v = this.localize(v,y);
  if (v.x > -this.width/2 
   && v.x <  this.width/2
   && v.y > -this.height/2 
   && v.y <  this.height/2)
    return true;
  return false;
}
iio.Rectangle.prototype.draw_shape = function(ctx){
  if (this.imageRounding)
    ctx.translate(Math.floor(-this.width/2), Math.floor(-this.height/2));
  else ctx.translate(-this.width/2,-this.height/2);
  /*if (this.bezier) {
    iio.draw.poly(ctx, this.trueVs(), this.bezier);
    this.finish_path_shape(ctx);
  }*/
  if(this.round)
    this.draw_rounded(ctx);
  else{
    if (this.color) ctx.fillRect(0, 0, this.width, this.height);
    if (this.img) ctx.drawImage(this.img, 0, 0, this.width, this.height);
    if (this.anims)
      ctx.drawImage(this.anims[this.animKey].frames[this.animFrame].src,
        this.anims[this.animKey].frames[this.animFrame].x,
        this.anims[this.animKey].frames[this.animFrame].y,
        this.anims[this.animKey].frames[this.animFrame].w,
        this.anims[this.animKey].frames[this.animFrame].h,
        0, 0, this.width, this.height);
    if (this.outline) ctx.strokeRect(0, 0, this.width, this.height);
  }
}

// RECTANGLE FUNCTIONS
iio.Rectangle.prototype.draw_rounded = function(ctx){
  ctx.beginPath();
  ctx.moveTo(this.round[0], 0);
  ctx.lineTo(this.width - this.round[1], 0);
  ctx.quadraticCurveTo(this.width, 0, this.width, this.round[1]);
  ctx.lineTo(this.width, this.height - this.round[2]);
  ctx.quadraticCurveTo(this.width, this.height, this.width - this.round[2], this.height);
  ctx.lineTo(this.round[3], this.height);
  ctx.quadraticCurveTo(0, this.height, 0, this.height - this.round[3]);
  ctx.lineTo(0, this.round[0]);
  ctx.quadraticCurveTo(0, 0, this.round[0], 0);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.clip();
}

/* Quad
------------------
*/

// DEFINITION
iio.Quad = function(){ this.Quad.apply(this, arguments) };
iio.inherit(iio.Quad, iio.Shape);
iio.Quad.prototype._super = iio.Shape.prototype;

// CONSTRUCTOR
iio.Quad.prototype.Quad = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
  this.height = this.height || this.width;
}

// SHARED RECTANGLE FUNCTIONS
iio.Quad.prototype.draw_shape = iio.Rectangle.prototype.draw_shape;
iio.Quad.prototype.draw_rounded = iio.Rectangle.prototype.draw_rounded;
iio.Quad.prototype.contains = iio.Rectangle.prototype.contains
iio.Quad.prototype.size = iio.Rectangle.prototype.size;
iio.Quad.prototype.setSize = iio.Rectangle.prototype.setSize;
iio.Quad.prototype._trueVs = iio.Polygon.prototype.trueVs;

// OVERRIDE FUNCTIONS
iio.Quad.prototype._left = iio.Polygon.prototype.left;
iio.Quad.prototype.left = function(){
  if (this.rotateVs) return this._left();
  return this.pos.x - this.width/2
}
iio.Quad.prototype._right = iio.Polygon.prototype.right;
iio.Quad.prototype.right = function(){
  if (this.rotateVs) return this._right();
  return this.pos.x + this.width/2
}
iio.Quad.prototype._top = iio.Polygon.prototype.top;
iio.Quad.prototype.top = function(){
  if (this.rotateVs) return this._top();
  return this.pos.y - this.height/2
}
iio.Quad.prototype._bottom = iio.Polygon.prototype.bottom;
iio.Quad.prototype.bottom = function(){
  if (this.rotateVs) return this._bottom();
  return this.pos.y + this.height/2
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Quad.prototype.trueVs = function(rotateVs) {
  this.vs = [
    new iio.Vector(-this.width/2, -this.height/2),
    new iio.Vector(this.width/2, -this.height/2),
    new iio.Vector(this.width/2, this.height/2),
    new iio.Vector(-this.width/2, this.height/2),
  ];
  if (!rotateVs && !this.rotateVs) {
    var vs = [];
    for(var v,i=0;i<this.vs.length;i++){
      v = this.vs[i].clone();
      v.x += this.pos.x;
      v.y += this.pos.y;
      vs[i]=v;
    }
    return vs;
  }
  return this._trueVs()
}

/* Text
------------------
*/

// DEFINITION
iio.Text = function(){ this.Text.apply(this, arguments) };
iio.inherit(iio.Text, iio.Polygon);
iio.Text.prototype._super = iio.Polygon.prototype;

// CONSTRUCTOR
iio.Text.prototype.Text = function() {
  this._super.Polygon.call(this,iio.merge_args(arguments));
  this.size = this.size || 40;
  if(!this.outline)
    this.color = this.color || new iio.Color();
  this.font = this.font || 'Arial';
  this.align = this.align || 'center';
}

// OVERRIDE FUNCTIONS
iio.Text.prototype._shrink = function( s,r ) {
  this.size *= 1-s;
  this.inferSize();
  if (this.size < .02 
    || this.size < this.shrink.lowerBound 
    || this.size > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Text.prototype.contains = function( v,y ) {
  v = this.localize(v,y);
  if ( (!this.align || this.align === 'left')
    && v.x>0 && v.x<this.width && v.y<this.height/2 && v.y>-this.height/2)
    return true;
  else if (this.align === 'center'
    && v.x>-this.width/2 && v.x<this.width/2 && v.y<this.height/2 && v.y>-this.height/2)
    return true;
  else if ( (this.align === 'right' || this.align === 'end')
    && v.x>-this.width && v.x<0 && v.y<this.height/2 && v.y>-this.height/2)
    return true;
  return false;
}
iio.Text.prototype.draw_shape = function(ctx) {
  ctx.translate(0, this.height/2); 
  //ctx.strokeStyle = 'red';
  //ctx.strokeRect( -this.width/2, -this.height, this.width, this.height );
  ctx.font = this.size + 'px ' + this.font;
  ctx.textAlign = this.align;
  if (this.color) ctx.fillText(this.text, 0, 0);
  if (this.outline) ctx.strokeText(this.text, 0, 0);
  if (this.showCursor)
    this.cursor.vs[0].x = this.cursor.vs[1].x = this.charX(this.cursor.index);
}

// TEXT FUNCTIONS
iio.Text.prototype.init_cursor = function(){
  var tX = this.charX(this.text.length);
  this.cursor = this.add(new iio.Line({
    vs: [
      [tX, this.size/2],
      [tX, -this.size/2]
    ],
    width:2,
    color: this.color || this.outline,
    index: this.text.length,
    shift: false
  }));
  if (this.showCursor) {
    this.loop(2, function(o) {
      o.cursor.hidden = !o.cursor.hidden;
    })
  } else this.cursor.hidden = true;
}
iio.Text.prototype.inferSize = function(ctx){
  this.ctx = ctx || this.ctx;
  this.app.ctx.font = this.size + 'px ' + this.font;
  this.width = this.app.ctx.measureText(this.text).width;
  this.height = this.app.ctx.measureText("H").width;
  if (!this.align || this.align === 'left'){
    this.vs = [
      new iio.Vector(0,-this.height/2),
      new iio.Vector(this.width,-this.height/2),
      new iio.Vector(this.width,this.height/2),
      new iio.Vector(0,this.height/2),
    ]
  } else if (this.align === 'center') {
    this.vs = [
      new iio.Vector(-this.width/2,-this.height/2),
      new iio.Vector(this.width/2,-this.height/2),
      new iio.Vector(this.width/2,this.height/2),
      new iio.Vector(-this.width/2,this.height/2),
    ];
  } else {
    this.vs = [
      new iio.Vector(-this.width,-this.height/2),
      new iio.Vector(0,-this.height/2),
      new iio.Vector(0,this.height/2),
      new iio.Vector(-this.width,this.height/2),
    ]
  }
  return this;
}
iio.Text.getFontHeight = function(font) {
  var text = $('<span>Hg</span>').css({ fontFamily: font });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
  var div = $('<div></div>');
  div.append(text, block);
  var body = $('body');
  body.append(div);
  try {
    var result = {};
    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;
    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;
    result.descent = result.height - result.ascent;
  } finally {
    div.remove();
  }
  return result;
}
iio.Text.prototype.charWidth = function(i) {
  i = i||0;
  this.app.ctx.font = this.size+'px '+this.font;
  return this.app.ctx.measureText(this.text.charAt(i)).width;
}
iio.Text.prototype.charX = function(i) {
  this.app.ctx.font = this.size+'px '+this.font;
  if (!this.align || this.align === 'left')
    return this.app.ctx.measureText(this.text.substring(0, i)).width;
  if (this.align === 'right' || this.align === 'end')
    return -this.app.ctx.measureText(this.text.substring(0, this.text.length - i)).width;
  if (this.align === 'center') {
    var x = -Math.floor(this.app.ctx.measureText(this.text).width / 2);
    return x + this.app.ctx.measureText(this.text.substring(0, i)).width;
  }
}
iio.Text.prototype.onKeyUp = function(k) {
  if (k === 'shift')
    this.cursor.shift = false;
}
iio.Text.prototype.onKeyDown = function(key, cI, shift, fn) {
  if (!iio.is.number(cI)) {
    fn = cI;
    cI = this.cursor.index;
  }
  var str;
  var pre = this.text.substring(0, cI);
  var suf = this.text.substring(cI);
  if (typeof fn !== 'undefined') {
    str = fn(key, shift, pre, suf);
    if (str !== false) {
      this.text = pre + str + suf;
      this.cursor.index = cI + 1;
      if (this.showCursor) this.cursor.hidden = false;
      this.app.draw();
      return this.cursor.index;
    }
  }
  if (key.length > 1) {
    if (key === 'space') {
      this.text = pre + " " + suf;
      cI++;
    } else if (key === 'backspace' && cI > 0) {
      this.text = pre.substring(0, pre.length - 1) + suf;
      cI--;
    } else if (key === 'delete' && cI < this.text.length)
      this.text = pre + suf.substring(1);
    else if (key === 'left arrow' && cI > 0) cI--;
    else if (key === 'right arrow' && cI < this.text.length) cI++;
    else if (key === 'shift') this.cursor.shift = true;
    else if (key === 'semi-colon') {
      if (shift) this.text = pre + ':' + suf;
      else this.text = pre + ';' + suf;
      cI++;
    } else if (key === 'equal') {
      if (shift) this.text = pre + '+' + suf;
      else this.text = pre + '=' + suf;
      cI++;
    } else if (key === 'comma') {
      if (shift) this.text = pre + '<' + suf;
      else this.text = pre + ',' + suf;
      cI++;
    } else if (key === 'dash') {
      if (shift) this.text = pre + '_' + suf;
      else this.text = pre + '-' + suf;
      cI++;
    } else if (key === 'period') {
      if (shift) this.text = pre + '>' + suf;
      else this.text = pre + '.' + suf;
      cI++;
    } else if (key === 'forward slash') {
      if (shift) this.text = pre + '?' + suf;
      else this.text = pre + '/' + suf;
      cI++;
    } else if (key === 'grave accent') {
      if (shift) this.text = pre + '~' + suf;
      else this.text = pre + '`' + suf;
      cI++;
    } else if (key === 'open bracket') {
      if (shift) this.text = pre + '{' + suf;
      else this.text = pre + '[' + suf;
      cI++;
    } else if (key === 'back slash') {
      if (shift) this.text = pre + '|' + suf;
      else this.text = pre + "/" + suf;
      cI++;
    } else if (key === 'close bracket') {
      if (shift) this.text = pre + '}' + suf;
      else this.text = pre + ']' + suf;
      cI++;
    } else if (key === 'single quote') {
      if (shift) this.text = pre + '"' + suf;
      else this.text = pre + "'" + suf;
      cI++;
    }
  } else {
    if (shift || this.cursor.shift)
      this.text = pre + key.charAt(0).toUpperCase() + suf;
    else this.text = pre + key + suf;
    cI++;
  }
  if (this.showCursor) this.cursor.hidden = false;
  this.cursor.index = cI;
  this.app.draw();
  return cI;
}

/* Grid
------------------
*/

// DEFINITION
iio.Grid = function(){ this.Grid.apply(this, arguments) };
iio.inherit(iio.Grid, iio.Quad);
iio.Grid.prototype._super = iio.Quad.prototype;

// CONSTRUCTOR
iio.Grid.prototype.Grid = function() {
  this._super.Quad.call(this,iio.merge_args(arguments));
  this.init();
}

// SHARED LINE FUNCTIONS
iio.Grid.prototype.prep_ctx_color = iio.Line.prototype.prep_ctx_color;

// OVERRIDE FUNCTIONS
iio.Grid.prototype.clear = function(noDraw){
  this.objs = [];
  this.init_cells();
  if(noDraw);
  else this.app.draw();
}
iio.Grid.prototype._shrink = function( s,r ) {
  this.setSize( 
    this.width * (1-s),
    this.height * (1-s)
  );
  if (this.width < .02 
    || this.width < this.shrink.lowerBound 
    || this.width > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}

// IMPLEMENT ABSTRACT FUNCTIONS
iio.Grid.prototype.setSize = function( w,h ){
  this.width = w;
  this.height = h||w;
  this.infer_res();
}
iio.Grid.prototype.draw_shape = function(ctx) {
  if (this.color) {
    ctx.beginPath();
    for (var c=1; c<this.C; c++){
      ctx.moveTo(-this.width/2 + c*this.res.x, -this.height/2);
      ctx.lineTo(-this.width/2 + c*this.res.x, this.height/2);
    }
    for (var r=1; r<this.R; r++){
      ctx.moveTo(-this.width/2, -this.height/2 + r*this.res.y);
      ctx.lineTo(this.width/2, -this.height/2 + r*this.res.y);
    }
    ctx.stroke();
  }
}

// GRID FUNCTIONS
iio.Grid.prototype.init = function(){
  // set res if undefined
  this.res = this.res || new iio.Vector(
    this.width/this.C,
    this.height/this.R
  );
  // set width/height if undefined
  this.width = this.width || this.C * this.res.x;
  this.height = this.height || this.R * this.res.y;
  // initialize cells
  this.init_cells();
}
iio.Grid.prototype.init_cells = function(){
  this.cells = [];
  var x = -this.res.x * (this.C-1) / 2;
  var y = -this.res.y * (this.R-1) / 2;
  for (var r,c=0; c<this.C; c++) {
    this.cells[c] = [];
    for (r = 0; r<this.R; r++) {
      this.cells[c][r] = this.add(new iio.Quad({
        pos: new iio.Vector( x,y ),
        c: c, r: r,
        width: this.res.x,
        height: this.res.y
      }));
      y += this.res.y;
    }
    y = -this.res.y * (this.R-1) / 2;
    x += this.res.x;
  }
}
iio.Grid.prototype.infer_res = function(){
  this.res.x = this.width/this.C;
  this.res.y = this.height/this.R;
}
iio.Grid.prototype.cellCenter = function( c,r ) {
  return new iio.Vector(
    -this.width/2 + c*this.res.x + this.res.x/2,
    -this.height/2 + r*this.res.y + this.res.y/2
  );
}
iio.Grid.prototype.cellAt = function( x,y ) {
  if (x.x) return this.cells
    [Math.floor((x.x - this.left()) / this.res.x)]
    [Math.floor((x.y - this.top()) / this.res.y)];
  else return this.cells
    [Math.floor((x - this.left()) / this.res.x)]
    [Math.floor((y - this.top()) / this.res.y)];
}
iio.Grid.prototype.foreachCell = function(fn, p) {
  for (var c = 0; c < this.C; c++)
    for (var r = 0; r < this.R; r++)
      if (fn(this.cells[c][r], p) === false)
        return [r,c];
}

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

/* Sound
------------------
*/

// Single AudioContext shared across all iio apps
iio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// DEFINITION
iio.Sound = function(){ this.Sound.apply(this, arguments) };
iio.inherit(iio.Sound, iio.Interface);
iio.Sound.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
iio.Sound.prototype.Sound = function(url, onLoad, onError) {
  var sound = this;
  // Set up a GainNode for volume control
  this.gainNode = iio.audioCtx.createGain();
  this.gainNode.connect(iio.audioCtx.destination);
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    iio.audioCtx.decodeAudioData(xhr.response, function(buffer) {
      sound.buffer = buffer;
      if (onLoad) onLoad(sound, buffer);
    }, onError); 
  };
  xhr.onerror = onError;
  xhr.send();
}

// SOUND FUNCTIONS
iio.Sound.prototype.play = function() {
  this.set(iio.merge_args(arguments), true);
  if (typeof this.buffer === undefined) return;
  this.source = iio.audioCtx.createBufferSource();
  this.source.buffer = this.buffer;
  if (this.loop)
    this.source.loop = true;
  if (this.gain)
    this.gainNode.gain.value = this.gain;
  this.source.connect(this.gainNode);
  this.source.start(this.delay || 0);
  return this;
}
iio.Sound.prototype.stop = function() {
  if (this.source)
    this.source.disconnect();
  return this;
}
/* Loader
------------------
*/

// DEFINITION
iio.Loader = function(basePath) {
  this.basePath = (basePath || '.') + '/';
}

// LOADER FUNCTIONS
iio.loadSound = function(url, onLoad, onError) {
  var sound = new iio.Sound(url, onLoad, onError);
  return sound;
}
iio.loadImage = function(url, onLoad, onError) {
  var img = new Image();
  img.onload = onLoad;
  img.onerror = onError;
  img.src = url;
  return img;
}
/*
 * @params:
 *   assets: Define the assets to load, can be of various formats
 *   String
 *     "sprite.png"
 *     returns: {"sprite1.png": Image}
 *
 *   Array
 *     [
 *       "sprite1.png",
 *       "ping.wav",
 *       "background.jpg"
 *     ]
 *     returns: {
 *       "sprite1.png": Image,
 *       "ping.wav": Sound,
 *       "background.jpg": Image
 *     }
 *
 *     or 
 *
 *     [
 *       {name: "sprite1.png", callback: processImage},
 *       {name: "ping.wav", callback: processSound},
 *       {name: "background.png", callback: processImage}
 *     ]
 *     returns: {
 *       "sprite1.png": processImage(Image),
 *       "ping.wav": processSound(Sound),
 *       "background.jpg": processImage(Image)
 *     }
 *
 *     or 
 *
 *     [
 *       {name: "sprite1.png", callback: processImage},
 *       {name: "ping.wav", callback: processSound},
 *       "background.jpg"
 *     ]
 *     returns: {
 *       "sprite1.png": processImage(Image),
 *       "ping.wav": processSound(Sound),
 *       "background.jpg": Image
 *     }
 *
 *   Object
 *     {name: "sprite1.png", callback: processSprite}
 *     returns: {"sprite1.png": processSprite(Image)}
 *
 *     or 
 *
 *     ## With assetIds ##
 *
 *     {
 *       "mainCharacter": "sprite1.png",
 *       "loadingSound": "ping.wav",
 *       "background": "background.jpg"
 *     }
 *     returns: {
 *       "mainCharacter": Image,
 *       "loadingSound": Sound,
 *       "background": Image
 *     }
 *
 *     or 
 *
 *     {
 *       mainCharacter: {name: "sprite1.png", callback: processSprite},
 *       loadingSound: "ping.wav",
 *       background: "background.jpg"
 *     }
 *     returns: {
 *       mainCharacter: processSprite(Image),
 *       loadingSound: Sound,
 *       background: Image
 *     }
 *
 *   onProcessUpdate: function(percentage, lastLoadedAsset) { ... }
 *
 *   onComplete: function(assets) { ... }
 *
 * @returns:
 *   Depending on the format of the asset parameter, this method returns different objects
 *
 * TODO szheng definitely need to write a test suite for this.
 *               
 */
iio.Loader.prototype.load = function(assets, onComplete) {
  var total = assets.length || Object.keys(assets).length;
  var loaded = 0;
  var _assets = {}
  var postLoad = function() {
    loaded++;
    console.log(loaded);
    if (loaded === total) onComplete(_assets);
  };

  // Helper function to load asset into _assets.
  var load = function(assetName, postLoadProcess, id) {
    var name = id || assetName;
    var url = this.basePath + assetName;

    var loader; // Loader to use
    if (iio.is.image(url)) {
      loader = iio.loadImage;
    } else if (iio.is.sound(url)) {
      loader = iio.loadSound;
    } else {
      return;
    }

    var asset = loader(url, function() {
      if (postLoadProcess) {
        _assets[name] = postloadProcess(asset);
      } else {
        _assets[name] = asset;
      }
      console.log('success');
      postLoad();
    }, postLoad);
  }.bind(this);

  if (iio.is.string(assets)) {
    load(assets);
  } else if (assets instanceof Array) {
    assets.forEach(function(asset) {
      if (iio.is.string(asset)) {
        load(asset);
      } else if (asset.name) {
        load(asset.name, asset.callback, asset.id);
      }
    });
  } else if (assets.name) {
    load(assets.name, assets.callback);
  } else {
    for (var key in assets) {
      if (assets.hasOwnProperty(key)) {
        var asset = assets[key];
        if (iio.is.string(asset)) {
          load(asset, null, key);
        } else if (asset.name) {
          load(asset.name, asset.callback, key);
        } else {
          load(key, asset.callback, asset.id);
        }
      }
    }
  }

  return _assets;
}

/* Attach iio to box2dWeb
-------------------------
*/
if (typeof Box2D !== 'undefined'){
  Box2D.Dynamics.Joints.b2Joint.prototype.set = iio.Drawable.prototype.set;
  Box2D.Dynamics.Joints.b2Joint.prototype.convert_props = iio.Drawable.prototype.convert_props;
  Box2D.Collision.Shapes.b2Shape.prototype.set = iio.Drawable.prototype.set;
  Box2D.Collision.Shapes.b2Shape.prototype.convert_props = iio.Drawable.prototype.convert_props;
  Box2D.Collision.Shapes.b2CircleShape.prototype.set = iio.Drawable.prototype.set;
  Box2D.Collision.Shapes.b2CircleShape.prototype.convert_props = iio.Ellipse.prototype.convert_props;
  Box2D.Collision.Shapes.b2Shape.prototype.playAnim=iio.Shape.prototype.playAnim;
  Box2D.Collision.Shapes.b2Shape.prototype.stopAnim=iio.Shape.prototype.stopAnim;
  Box2D.Collision.Shapes.b2Shape.prototype.setSprite=iio.Shape.prototype.setSprite;
  Box2D.Collision.Shapes.b2Shape.prototype.nextFrame=iio.Shape.prototype.nextFrame;
  Box2D.Collision.Shapes.b2Shape.prototype.prevFrame=iio.Shape.prototype.prevFrame;
  Box2D.Collision.Shapes.b2Shape.prototype.orient_ctx=iio.Shape.prototype.orient_ctx;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_color=iio.Shape.prototype.prep_ctx_color;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_outline=iio.Shape.prototype.prep_ctx_outline;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_lineWidth=iio.Shape.prototype.prep_ctx_lineWidth;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_shadow=iio.Shape.prototype.prep_ctx_shadow;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_dash=iio.Shape.prototype.prep_ctx_dash;
  Box2D.Collision.Shapes.b2Shape.prototype.finish_path_shape=iio.Shape.prototype.finish_path_shape;
  Box2D.Collision.Shapes.b2Shape.prototype.draw_obj=iio.Shape.prototype.draw_obj;
  Box2D.Collision.Shapes.b2Shape.prototype.draw=iio.Shape.prototype.draw;
  Box2D.Collision.Shapes.b2CircleShape.prototype.draw_shape = iio.Ellipse.prototype.draw_shape;
  Box2D.Collision.Shapes.b2PolygonShape.prototype.draw_shape = iio.Polygon.prototype.draw_shape;
  Box2D.Dynamics.Joints.b2Joint.prototype.orient_ctx = iio.Shape.prototype.orient_ctx;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_color = iio.Line.prototype.prep_ctx_color;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_lineWidth=iio.Line.prototype.prep_ctx_lineWidth;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_shadow=iio.Shape.prototype.prep_ctx_shadow;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_dash=iio.Shape.prototype.prep_ctx_dash;
  Box2D.Dynamics.Joints.b2Joint.prototype.draw_obj=iio.Shape.prototype.draw_obj;
  Box2D.Dynamics.Joints.b2Joint.prototype.draw = function(ctx){
    this.draw_obj(ctx);
  }
  Box2D.Dynamics.Joints.b2Joint.prototype.draw_shape = function(ctx){
    var b1 = this.GetBodyA();
    var b2 = this.GetBodyB();
    var xf1 = b1.m_xf;
    var xf2 = b2.m_xf;
    var x1 = xf1.position;
    var x2 = xf2.position;
    var p1 = this.GetAnchorA();
    var p2 = this.GetAnchorB();
    ctx.beginPath();
    switch (this.m_type) {
      case Box2D.Dynamics.Joints.b2Joint.e_distanceJoint:
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
          break;
      case Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint:
        var pulley = ((this instanceof b2PulleyJoint ? this : null));
        var s1 = pulley.GetGroundAnchorA();
        var s2 = pulley.GetGroundAnchorB();
        ctx.moveTo(s1.x*this.app.b2Scale,s1.y*this.app.b2Scale);
        ctx.lineTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.moveTo(s2.x*this.app.b2Scale,s2.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        ctx.moveTo(s1.x*this.app.b2Scale,s1.y*this.app.b2Scale);
        ctx.lineTo(s2.x*this.app.b2Scale,s2.y*this.app.b2Scale);
          break;
      case Box2D.Dynamics.Joints.b2Joint.e_mouseJoint:
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
          break;
      default:
        if (b1 != this.m_groundBody) {
          ctx.moveTo(x1.x*this.app.b2Scale,x1.y*this.app.b2Scale);
          ctx.lineTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        }
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        if (b2 != this.m_groundBody){
          ctx.moveTo(x2.x*this.app.b2Scale,x2.y*this.app.b2Scale);
          ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        }
     }
     ctx.stroke();
  }
  Box2D.Dynamics.b2Body.prototype.draw = function(ctx){
    for (f=this.m_fixtureList;f;f=f.m_next){
      s=f.GetShape(); 
      s.radius=s.m_radius*this.app.b2Scale;
      s.pos=new iio.Vector(
        this.m_xf.position.x*this.app.b2Scale,
        this.m_xf.position.y*this.app.b2Scale);
      s.rotation=this.GetAngle();
      if (s.m_vertices){
        s.vs=[];
        for (var i=0; i<s.m_vertices.length; i++)
          s.vs.push(new iio.Vector(
            s.m_vertices[i].x*this.app.b2Scale,
            s.m_vertices[i].y*this.app.b2Scale));
      }
      if(s.draw) s.draw(ctx);
    }
  }

  // iio.App
  //-------------------------------------------------------------------
  iio.App.prototype.addB2World = function(world,c){
    this.b2World = world;
    this.b2Scale = 30;
    this.b2Cnv = c||0;
    return world;
  }
  iio.App.prototype.b2Loop = function( fps, callback ){
    this.b2lastTime = this.b2lastTime || 0;
    if (this.b2World && !this.b2Pause)
      this.b2World.Step(1/this.fps, 10, 10);
    iio.requestTimeout(fps, this.b2lastTime, function(dt,args){
      args[0].b2lastTime = dt;
      args[0].b2Loop(fps,callback);
      if (args[0].b2World && !args[0].b2Pause)
        args[0].b2World.Step(1/fps, 10, 10);
      callback(dt);
      if (args[0].b2DebugDraw && args[0].b2DebugDraw)
        args[0].b2World.DrawDebugData();
      else args[0].draw(args[0].b2Cnv);
      if (this.b2World)
        args[0].b2World.ClearForces();
    }, [this]);
    return this;
  }
  iio.App.prototype.pauseB2World = function(pause){
    if (typeof pause === 'undefined'){
      if (typeof this.b2Pause === 'undefined')
        this.b2Pause = true;
      else this.b2Pause = !this.b2Pause;
    } else this.b2Pause = pause;
    return this;
  }
  iio.App.prototype.activateB2Debugger = function(turnOn,c){
    turnOn = turnOn||true;
    c = c||0;
    if (turnOn){
      this.b2DebugDraw = new Box2D.Dynamics.b2DebugDraw();
      this.b2DebugDraw.SetSprite(this.ctxs[c]);
      this.b2DebugDraw.SetDrawScale(this.b2Scale);
      this.b2DebugDraw.SetFillAlpha(0.5)
      this.b2DebugDraw.SetLineThickness(1.0)
      this.b2DebugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit)
      this.b2World.SetDebugDraw(this.b2DebugDraw);
      return this.b2DebugDraw;
    }
  }
  iio.App.prototype.b2BodyAt = function(callback,v,y){
    if (typeof v.x === 'undefined')
      v = new Box2D.Common.Math.b2Vec2(v,y);
    var aabb = new Box2D.Collision.b2AABB();
    aabb.lowerBound.Set(v.x - 0.001, v.y - 0.001);
    aabb.upperBound.Set(v.x + 0.001, v.y + 0.001);
    function getBodyCB(fixture){
      if(fixture.GetBody().GetType() !== Box2D.Dynamics.b2Body.b2_staticBody) 
      if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), v)) 
        return fixture.GetBody();
      return false;
    }
    return this.b2World.QueryAABB(getBodyCB, aabb);
  }
}
/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
var Box2D = {};

(function (a2j, undefined) {

   if(!(Object.prototype.defineProperty instanceof Function)
      && Object.prototype.__defineGetter__ instanceof Function
      && Object.prototype.__defineSetter__ instanceof Function)
   {
      Object.defineProperty = function(obj, p, cfg) {
         if(cfg.get instanceof Function)
            obj.__defineGetter__(p, cfg.get);
         if(cfg.set instanceof Function)
            obj.__defineSetter__(p, cfg.set);
      }
   }
   
   function emptyFn() {};
   a2j.inherit = function(cls, base) {
      var tmpCtr = cls;
      emptyFn.prototype = base.prototype;
      cls.prototype = new emptyFn;
      cls.prototype.constructor = tmpCtr;
   };
   
   a2j.generateCallback = function generateCallback(context, cb) {
      return function () {
         cb.apply(context, arguments);
      };
   };
   
   a2j.NVector = function NVector(length) {
      if (length === undefined) length = 0;
      var tmp = new Array(length || 0);
      for (var i = 0; i < length; ++i)
      tmp[i] = 0;
      return tmp;
   };
   
   a2j.is = function is(o1, o2) {
      if (o1 === null) return false;
      if ((o2 instanceof Function) && (o1 instanceof o2)) return true;
      if ((o1.constructor.__implements != undefined) && (o1.constructor.__implements[o2])) return true;
      return false;
   };
   
   a2j.parseUInt = function(v) {
      return Math.abs(parseInt(v));
   }
   
})(Box2D);

//#TODO remove assignments from global namespace
var Vector = Array;
var Vector_a2j_Number = Box2D.NVector;
//package structure
if (typeof(Box2D) === "undefined") Box2D = {};
if (typeof(Box2D.Collision) === "undefined") Box2D.Collision = {};
if (typeof(Box2D.Collision.Shapes) === "undefined") Box2D.Collision.Shapes = {};
if (typeof(Box2D.Common) === "undefined") Box2D.Common = {};
if (typeof(Box2D.Common.Math) === "undefined") Box2D.Common.Math = {};
if (typeof(Box2D.Dynamics) === "undefined") Box2D.Dynamics = {};
if (typeof(Box2D.Dynamics.Contacts) === "undefined") Box2D.Dynamics.Contacts = {};
if (typeof(Box2D.Dynamics.Controllers) === "undefined") Box2D.Dynamics.Controllers = {};
if (typeof(Box2D.Dynamics.Joints) === "undefined") Box2D.Dynamics.Joints = {};
//pre-definitions
(function () {
   Box2D.Collision.IBroadPhase = 'Box2D.Collision.IBroadPhase';

   function b2AABB() {
      b2AABB.b2AABB.apply(this, arguments);
   };
   Box2D.Collision.b2AABB = b2AABB;

   function b2Bound() {
      b2Bound.b2Bound.apply(this, arguments);
   };
   Box2D.Collision.b2Bound = b2Bound;

   function b2BoundValues() {
      b2BoundValues.b2BoundValues.apply(this, arguments);
      if (this.constructor === b2BoundValues) this.b2BoundValues.apply(this, arguments);
   };
   Box2D.Collision.b2BoundValues = b2BoundValues;

   function b2Collision() {
      b2Collision.b2Collision.apply(this, arguments);
   };
   Box2D.Collision.b2Collision = b2Collision;

   function b2ContactID() {
      b2ContactID.b2ContactID.apply(this, arguments);
      if (this.constructor === b2ContactID) this.b2ContactID.apply(this, arguments);
   };
   Box2D.Collision.b2ContactID = b2ContactID;

   function b2ContactPoint() {
      b2ContactPoint.b2ContactPoint.apply(this, arguments);
   };
   Box2D.Collision.b2ContactPoint = b2ContactPoint;

   function b2Distance() {
      b2Distance.b2Distance.apply(this, arguments);
   };
   Box2D.Collision.b2Distance = b2Distance;

   function b2DistanceInput() {
      b2DistanceInput.b2DistanceInput.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceInput = b2DistanceInput;

   function b2DistanceOutput() {
      b2DistanceOutput.b2DistanceOutput.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceOutput = b2DistanceOutput;

   function b2DistanceProxy() {
      b2DistanceProxy.b2DistanceProxy.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceProxy = b2DistanceProxy;

   function b2DynamicTree() {
      b2DynamicTree.b2DynamicTree.apply(this, arguments);
      if (this.constructor === b2DynamicTree) this.b2DynamicTree.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTree = b2DynamicTree;

   function b2DynamicTreeBroadPhase() {
      b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreeBroadPhase = b2DynamicTreeBroadPhase;

   function b2DynamicTreeNode() {
      b2DynamicTreeNode.b2DynamicTreeNode.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreeNode = b2DynamicTreeNode;

   function b2DynamicTreePair() {
      b2DynamicTreePair.b2DynamicTreePair.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreePair = b2DynamicTreePair;

   function b2Manifold() {
      b2Manifold.b2Manifold.apply(this, arguments);
      if (this.constructor === b2Manifold) this.b2Manifold.apply(this, arguments);
   };
   Box2D.Collision.b2Manifold = b2Manifold;

   function b2ManifoldPoint() {
      b2ManifoldPoint.b2ManifoldPoint.apply(this, arguments);
      if (this.constructor === b2ManifoldPoint) this.b2ManifoldPoint.apply(this, arguments);
   };
   Box2D.Collision.b2ManifoldPoint = b2ManifoldPoint;

   function b2Point() {
      b2Point.b2Point.apply(this, arguments);
   };
   Box2D.Collision.b2Point = b2Point;

   function b2RayCastInput() {
      b2RayCastInput.b2RayCastInput.apply(this, arguments);
      if (this.constructor === b2RayCastInput) this.b2RayCastInput.apply(this, arguments);
   };
   Box2D.Collision.b2RayCastInput = b2RayCastInput;

   function b2RayCastOutput() {
      b2RayCastOutput.b2RayCastOutput.apply(this, arguments);
   };
   Box2D.Collision.b2RayCastOutput = b2RayCastOutput;

   function b2Segment() {
      b2Segment.b2Segment.apply(this, arguments);
   };
   Box2D.Collision.b2Segment = b2Segment;

   function b2SeparationFunction() {
      b2SeparationFunction.b2SeparationFunction.apply(this, arguments);
   };
   Box2D.Collision.b2SeparationFunction = b2SeparationFunction;

   function b2Simplex() {
      b2Simplex.b2Simplex.apply(this, arguments);
      if (this.constructor === b2Simplex) this.b2Simplex.apply(this, arguments);
   };
   Box2D.Collision.b2Simplex = b2Simplex;

   function b2SimplexCache() {
      b2SimplexCache.b2SimplexCache.apply(this, arguments);
   };
   Box2D.Collision.b2SimplexCache = b2SimplexCache;

   function b2SimplexVertex() {
      b2SimplexVertex.b2SimplexVertex.apply(this, arguments);
   };
   Box2D.Collision.b2SimplexVertex = b2SimplexVertex;

   function b2TimeOfImpact() {
      b2TimeOfImpact.b2TimeOfImpact.apply(this, arguments);
   };
   Box2D.Collision.b2TimeOfImpact = b2TimeOfImpact;

   function b2TOIInput() {
      b2TOIInput.b2TOIInput.apply(this, arguments);
   };
   Box2D.Collision.b2TOIInput = b2TOIInput;

   function b2WorldManifold() {
      b2WorldManifold.b2WorldManifold.apply(this, arguments);
      if (this.constructor === b2WorldManifold) this.b2WorldManifold.apply(this, arguments);
   };
   Box2D.Collision.b2WorldManifold = b2WorldManifold;

   function ClipVertex() {
      ClipVertex.ClipVertex.apply(this, arguments);
   };
   Box2D.Collision.ClipVertex = ClipVertex;

   function Features() {
      Features.Features.apply(this, arguments);
   };
   Box2D.Collision.Features = Features;

   function b2CircleShape() {
      b2CircleShape.b2CircleShape.apply(this, arguments);
      if (this.constructor === b2CircleShape) this.b2CircleShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2CircleShape = b2CircleShape;

   function b2EdgeChainDef() {
      b2EdgeChainDef.b2EdgeChainDef.apply(this, arguments);
      if (this.constructor === b2EdgeChainDef) this.b2EdgeChainDef.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2EdgeChainDef = b2EdgeChainDef;

   function b2EdgeShape() {
      b2EdgeShape.b2EdgeShape.apply(this, arguments);
      if (this.constructor === b2EdgeShape) this.b2EdgeShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2EdgeShape = b2EdgeShape;

   function b2MassData() {
      b2MassData.b2MassData.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2MassData = b2MassData;

   function b2PolygonShape() {
      b2PolygonShape.b2PolygonShape.apply(this, arguments);
      if (this.constructor === b2PolygonShape) this.b2PolygonShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2PolygonShape = b2PolygonShape;

   function b2Shape() {
      b2Shape.b2Shape.apply(this, arguments);
      if (this.constructor === b2Shape) this.b2Shape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2Shape = b2Shape;
   Box2D.Common.b2internal = 'Box2D.Common.b2internal';

   function b2Color() {
      b2Color.b2Color.apply(this, arguments);
      if (this.constructor === b2Color) this.b2Color.apply(this, arguments);
   };
   Box2D.Common.b2Color = b2Color;

   function b2Settings() {
      b2Settings.b2Settings.apply(this, arguments);
   };
   Box2D.Common.b2Settings = b2Settings;

   function b2Mat22() {
      b2Mat22.b2Mat22.apply(this, arguments);
      if (this.constructor === b2Mat22) this.b2Mat22.apply(this, arguments);
   };
   Box2D.Common.Math.b2Mat22 = b2Mat22;

   function b2Mat33() {
      b2Mat33.b2Mat33.apply(this, arguments);
      if (this.constructor === b2Mat33) this.b2Mat33.apply(this, arguments);
   };
   Box2D.Common.Math.b2Mat33 = b2Mat33;

   function b2Math() {
      b2Math.b2Math.apply(this, arguments);
   };
   Box2D.Common.Math.b2Math = b2Math;

   function b2Sweep() {
      b2Sweep.b2Sweep.apply(this, arguments);
   };
   Box2D.Common.Math.b2Sweep = b2Sweep;

   function b2Transform() {
      b2Transform.b2Transform.apply(this, arguments);
      if (this.constructor === b2Transform) this.b2Transform.apply(this, arguments);
   };
   Box2D.Common.Math.b2Transform = b2Transform;

   function b2Vec2() {
      b2Vec2.b2Vec2.apply(this, arguments);
      if (this.constructor === b2Vec2) this.b2Vec2.apply(this, arguments);
   };
   Box2D.Common.Math.b2Vec2 = b2Vec2;

   function b2Vec3() {
      b2Vec3.b2Vec3.apply(this, arguments);
      if (this.constructor === b2Vec3) this.b2Vec3.apply(this, arguments);
   };
   Box2D.Common.Math.b2Vec3 = b2Vec3;

   function b2Body() {
      b2Body.b2Body.apply(this, arguments);
      if (this.constructor === b2Body) this.b2Body.apply(this, arguments);
   };
   Box2D.Dynamics.b2Body = b2Body;

   function b2BodyDef() {
      b2BodyDef.b2BodyDef.apply(this, arguments);
      if (this.constructor === b2BodyDef) this.b2BodyDef.apply(this, arguments);
   };
   Box2D.Dynamics.b2BodyDef = b2BodyDef;

   function b2ContactFilter() {
      b2ContactFilter.b2ContactFilter.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactFilter = b2ContactFilter;

   function b2ContactImpulse() {
      b2ContactImpulse.b2ContactImpulse.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactImpulse = b2ContactImpulse;

   function b2ContactListener() {
      b2ContactListener.b2ContactListener.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactListener = b2ContactListener;

   function b2ContactManager() {
      b2ContactManager.b2ContactManager.apply(this, arguments);
      if (this.constructor === b2ContactManager) this.b2ContactManager.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactManager = b2ContactManager;

   function b2DebugDraw() {
      b2DebugDraw.b2DebugDraw.apply(this, arguments);
      if (this.constructor === b2DebugDraw) this.b2DebugDraw.apply(this, arguments);
   };
   Box2D.Dynamics.b2DebugDraw = b2DebugDraw;

   function b2DestructionListener() {
      b2DestructionListener.b2DestructionListener.apply(this, arguments);
   };
   Box2D.Dynamics.b2DestructionListener = b2DestructionListener;

   function b2FilterData() {
      b2FilterData.b2FilterData.apply(this, arguments);
   };
   Box2D.Dynamics.b2FilterData = b2FilterData;

   function b2Fixture() {
      b2Fixture.b2Fixture.apply(this, arguments);
      if (this.constructor === b2Fixture) this.b2Fixture.apply(this, arguments);
   };
   Box2D.Dynamics.b2Fixture = b2Fixture;

   function b2FixtureDef() {
      b2FixtureDef.b2FixtureDef.apply(this, arguments);
      if (this.constructor === b2FixtureDef) this.b2FixtureDef.apply(this, arguments);
   };
   Box2D.Dynamics.b2FixtureDef = b2FixtureDef;

   function b2Island() {
      b2Island.b2Island.apply(this, arguments);
      if (this.constructor === b2Island) this.b2Island.apply(this, arguments);
   };
   Box2D.Dynamics.b2Island = b2Island;

   function b2TimeStep() {
      b2TimeStep.b2TimeStep.apply(this, arguments);
   };
   Box2D.Dynamics.b2TimeStep = b2TimeStep;

   function b2World() {
      b2World.b2World.apply(this, arguments);
      if (this.constructor === b2World) this.b2World.apply(this, arguments);
   };
   Box2D.Dynamics.b2World = b2World;

   function b2CircleContact() {
      b2CircleContact.b2CircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2CircleContact = b2CircleContact;

   function b2Contact() {
      b2Contact.b2Contact.apply(this, arguments);
      if (this.constructor === b2Contact) this.b2Contact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2Contact = b2Contact;

   function b2ContactConstraint() {
      b2ContactConstraint.b2ContactConstraint.apply(this, arguments);
      if (this.constructor === b2ContactConstraint) this.b2ContactConstraint.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactConstraint = b2ContactConstraint;

   function b2ContactConstraintPoint() {
      b2ContactConstraintPoint.b2ContactConstraintPoint.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactConstraintPoint = b2ContactConstraintPoint;

   function b2ContactEdge() {
      b2ContactEdge.b2ContactEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactEdge = b2ContactEdge;

   function b2ContactFactory() {
      b2ContactFactory.b2ContactFactory.apply(this, arguments);
      if (this.constructor === b2ContactFactory) this.b2ContactFactory.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactFactory = b2ContactFactory;

   function b2ContactRegister() {
      b2ContactRegister.b2ContactRegister.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactRegister = b2ContactRegister;

   function b2ContactResult() {
      b2ContactResult.b2ContactResult.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactResult = b2ContactResult;

   function b2ContactSolver() {
      b2ContactSolver.b2ContactSolver.apply(this, arguments);
      if (this.constructor === b2ContactSolver) this.b2ContactSolver.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactSolver = b2ContactSolver;

   function b2EdgeAndCircleContact() {
      b2EdgeAndCircleContact.b2EdgeAndCircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = b2EdgeAndCircleContact;

   function b2NullContact() {
      b2NullContact.b2NullContact.apply(this, arguments);
      if (this.constructor === b2NullContact) this.b2NullContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2NullContact = b2NullContact;

   function b2PolyAndCircleContact() {
      b2PolyAndCircleContact.b2PolyAndCircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolyAndCircleContact = b2PolyAndCircleContact;

   function b2PolyAndEdgeContact() {
      b2PolyAndEdgeContact.b2PolyAndEdgeContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = b2PolyAndEdgeContact;

   function b2PolygonContact() {
      b2PolygonContact.b2PolygonContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolygonContact = b2PolygonContact;

   function b2PositionSolverManifold() {
      b2PositionSolverManifold.b2PositionSolverManifold.apply(this, arguments);
      if (this.constructor === b2PositionSolverManifold) this.b2PositionSolverManifold.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PositionSolverManifold = b2PositionSolverManifold;

   function b2BuoyancyController() {
      b2BuoyancyController.b2BuoyancyController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2BuoyancyController = b2BuoyancyController;

   function b2ConstantAccelController() {
      b2ConstantAccelController.b2ConstantAccelController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ConstantAccelController = b2ConstantAccelController;

   function b2ConstantForceController() {
      b2ConstantForceController.b2ConstantForceController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ConstantForceController = b2ConstantForceController;

   function b2Controller() {
      b2Controller.b2Controller.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2Controller = b2Controller;

   function b2ControllerEdge() {
      b2ControllerEdge.b2ControllerEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ControllerEdge = b2ControllerEdge;

   function b2GravityController() {
      b2GravityController.b2GravityController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2GravityController = b2GravityController;

   function b2TensorDampingController() {
      b2TensorDampingController.b2TensorDampingController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2TensorDampingController = b2TensorDampingController;

   function b2DistanceJoint() {
      b2DistanceJoint.b2DistanceJoint.apply(this, arguments);
      if (this.constructor === b2DistanceJoint) this.b2DistanceJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2DistanceJoint = b2DistanceJoint;

   function b2DistanceJointDef() {
      b2DistanceJointDef.b2DistanceJointDef.apply(this, arguments);
      if (this.constructor === b2DistanceJointDef) this.b2DistanceJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2DistanceJointDef = b2DistanceJointDef;

   function b2FrictionJoint() {
      b2FrictionJoint.b2FrictionJoint.apply(this, arguments);
      if (this.constructor === b2FrictionJoint) this.b2FrictionJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2FrictionJoint = b2FrictionJoint;

   function b2FrictionJointDef() {
      b2FrictionJointDef.b2FrictionJointDef.apply(this, arguments);
      if (this.constructor === b2FrictionJointDef) this.b2FrictionJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2FrictionJointDef = b2FrictionJointDef;

   function b2GearJoint() {
      b2GearJoint.b2GearJoint.apply(this, arguments);
      if (this.constructor === b2GearJoint) this.b2GearJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2GearJoint = b2GearJoint;

   function b2GearJointDef() {
      b2GearJointDef.b2GearJointDef.apply(this, arguments);
      if (this.constructor === b2GearJointDef) this.b2GearJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2GearJointDef = b2GearJointDef;

   function b2Jacobian() {
      b2Jacobian.b2Jacobian.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2Jacobian = b2Jacobian;

   function b2Joint() {
      b2Joint.b2Joint.apply(this, arguments);
      if (this.constructor === b2Joint) this.b2Joint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2Joint = b2Joint;

   function b2JointDef() {
      b2JointDef.b2JointDef.apply(this, arguments);
      if (this.constructor === b2JointDef) this.b2JointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2JointDef = b2JointDef;

   function b2JointEdge() {
      b2JointEdge.b2JointEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2JointEdge = b2JointEdge;

   function b2LineJoint() {
      b2LineJoint.b2LineJoint.apply(this, arguments);
      if (this.constructor === b2LineJoint) this.b2LineJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2LineJoint = b2LineJoint;

   function b2LineJointDef() {
      b2LineJointDef.b2LineJointDef.apply(this, arguments);
      if (this.constructor === b2LineJointDef) this.b2LineJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2LineJointDef = b2LineJointDef;

   function b2MouseJoint() {
      b2MouseJoint.b2MouseJoint.apply(this, arguments);
      if (this.constructor === b2MouseJoint) this.b2MouseJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2MouseJoint = b2MouseJoint;

   function b2MouseJointDef() {
      b2MouseJointDef.b2MouseJointDef.apply(this, arguments);
      if (this.constructor === b2MouseJointDef) this.b2MouseJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2MouseJointDef = b2MouseJointDef;

   function b2PrismaticJoint() {
      b2PrismaticJoint.b2PrismaticJoint.apply(this, arguments);
      if (this.constructor === b2PrismaticJoint) this.b2PrismaticJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PrismaticJoint = b2PrismaticJoint;

   function b2PrismaticJointDef() {
      b2PrismaticJointDef.b2PrismaticJointDef.apply(this, arguments);
      if (this.constructor === b2PrismaticJointDef) this.b2PrismaticJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PrismaticJointDef = b2PrismaticJointDef;

   function b2PulleyJoint() {
      b2PulleyJoint.b2PulleyJoint.apply(this, arguments);
      if (this.constructor === b2PulleyJoint) this.b2PulleyJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PulleyJoint = b2PulleyJoint;

   function b2PulleyJointDef() {
      b2PulleyJointDef.b2PulleyJointDef.apply(this, arguments);
      if (this.constructor === b2PulleyJointDef) this.b2PulleyJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PulleyJointDef = b2PulleyJointDef;

   function b2RevoluteJoint() {
      b2RevoluteJoint.b2RevoluteJoint.apply(this, arguments);
      if (this.constructor === b2RevoluteJoint) this.b2RevoluteJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2RevoluteJoint = b2RevoluteJoint;

   function b2RevoluteJointDef() {
      b2RevoluteJointDef.b2RevoluteJointDef.apply(this, arguments);
      if (this.constructor === b2RevoluteJointDef) this.b2RevoluteJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2RevoluteJointDef = b2RevoluteJointDef;

   function b2WeldJoint() {
      b2WeldJoint.b2WeldJoint.apply(this, arguments);
      if (this.constructor === b2WeldJoint) this.b2WeldJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2WeldJoint = b2WeldJoint;

   function b2WeldJointDef() {
      b2WeldJointDef.b2WeldJointDef.apply(this, arguments);
      if (this.constructor === b2WeldJointDef) this.b2WeldJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2WeldJointDef = b2WeldJointDef;
})(); //definitions
Box2D.postDefs = [];
(function () {
   var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   b2AABB.b2AABB = function () {
      this.lowerBound = new b2Vec2();
      this.upperBound = new b2Vec2();
   };
   b2AABB.prototype.IsValid = function () {
      var dX = this.upperBound.x - this.lowerBound.x;
      var dY = this.upperBound.y - this.lowerBound.y;
      var valid = dX >= 0.0 && dY >= 0.0;
      valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
      return valid;
   }
   b2AABB.prototype.GetCenter = function () {
      return new b2Vec2((this.lowerBound.x + this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2);
   }
   b2AABB.prototype.GetExtents = function () {
      return new b2Vec2((this.upperBound.x - this.lowerBound.x) / 2, (this.upperBound.y - this.lowerBound.y) / 2);
   }
   b2AABB.prototype.Contains = function (aabb) {
      var result = true;
      result = result && this.lowerBound.x <= aabb.lowerBound.x;
      result = result && this.lowerBound.y <= aabb.lowerBound.y;
      result = result && aabb.upperBound.x <= this.upperBound.x;
      result = result && aabb.upperBound.y <= this.upperBound.y;
      return result;
   }
   b2AABB.prototype.RayCast = function (output, input) {
      var tmin = (-Number.MAX_VALUE);
      var tmax = Number.MAX_VALUE;
      var pX = input.p1.x;
      var pY = input.p1.y;
      var dX = input.p2.x - input.p1.x;
      var dY = input.p2.y - input.p1.y;
      var absDX = Math.abs(dX);
      var absDY = Math.abs(dY);
      var normal = output.normal;
      var inv_d = 0;
      var t1 = 0;
      var t2 = 0;
      var t3 = 0;
      var s = 0; {
         if (absDX < Number.MIN_VALUE) {
            if (pX < this.lowerBound.x || this.upperBound.x < pX) return false;
         }
         else {
            inv_d = 1.0 / dX;
            t1 = (this.lowerBound.x - pX) * inv_d;
            t2 = (this.upperBound.x - pX) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.x = s;
               normal.y = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      } {
         if (absDY < Number.MIN_VALUE) {
            if (pY < this.lowerBound.y || this.upperBound.y < pY) return false;
         }
         else {
            inv_d = 1.0 / dY;
            t1 = (this.lowerBound.y - pY) * inv_d;
            t2 = (this.upperBound.y - pY) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.y = s;
               normal.x = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      }
      output.fraction = tmin;
      return true;
   }
   b2AABB.prototype.TestOverlap = function (other) {
      var d1X = other.lowerBound.x - this.upperBound.x;
      var d1Y = other.lowerBound.y - this.upperBound.y;
      var d2X = this.lowerBound.x - other.upperBound.x;
      var d2Y = this.lowerBound.y - other.upperBound.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   }
   b2AABB.Combine = function (aabb1, aabb2) {
      var aabb = new b2AABB();
      aabb.Combine(aabb1, aabb2);
      return aabb;
   }
   b2AABB.prototype.Combine = function (aabb1, aabb2) {
      this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
      this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
      this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
      this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
   }
   b2Bound.b2Bound = function () {};
   b2Bound.prototype.IsLower = function () {
      return (this.value & 1) == 0;
   }
   b2Bound.prototype.IsUpper = function () {
      return (this.value & 1) == 1;
   }
   b2Bound.prototype.Swap = function (b) {
      var tempValue = this.value;
      var tempProxy = this.proxy;
      var tempStabbingCount = this.stabbingCount;
      this.value = b.value;
      this.proxy = b.proxy;
      this.stabbingCount = b.stabbingCount;
      b.value = tempValue;
      b.proxy = tempProxy;
      b.stabbingCount = tempStabbingCount;
   }
   b2BoundValues.b2BoundValues = function () {};
   b2BoundValues.prototype.b2BoundValues = function () {
      this.lowerValues = new Vector_a2j_Number();
      this.lowerValues[0] = 0.0;
      this.lowerValues[1] = 0.0;
      this.upperValues = new Vector_a2j_Number();
      this.upperValues[0] = 0.0;
      this.upperValues[1] = 0.0;
   }
   b2Collision.b2Collision = function () {};
   b2Collision.ClipSegmentToLine = function (vOut, vIn, normal, offset) {
      if (offset === undefined) offset = 0;
      var cv;
      var numOut = 0;
      cv = vIn[0];
      var vIn0 = cv.v;
      cv = vIn[1];
      var vIn1 = cv.v;
      var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
      var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
      if (distance0 <= 0.0) vOut[numOut++].Set(vIn[0]);
      if (distance1 <= 0.0) vOut[numOut++].Set(vIn[1]);
      if (distance0 * distance1 < 0.0) {
         var interp = distance0 / (distance0 - distance1);
         cv = vOut[numOut];
         var tVec = cv.v;
         tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
         tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
         cv = vOut[numOut];
         var cv2;
         if (distance0 > 0.0) {
            cv2 = vIn[0];
            cv.id = cv2.id;
         }
         else {
            cv2 = vIn[1];
            cv.id = cv2.id;
         }++numOut;
      }
      return numOut;
   }
   b2Collision.EdgeSeparation = function (poly1, xf1, edge1, poly2, xf2) {
      if (edge1 === undefined) edge1 = 0;
      var count1 = parseInt(poly1.m_vertexCount);
      var vertices1 = poly1.m_vertices;
      var normals1 = poly1.m_normals;
      var count2 = parseInt(poly2.m_vertexCount);
      var vertices2 = poly2.m_vertices;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1WorldX = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var normal1WorldY = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var normal1X = (tMat.col1.x * normal1WorldX + tMat.col1.y * normal1WorldY);
      var normal1Y = (tMat.col2.x * normal1WorldX + tMat.col2.y * normal1WorldY);
      var index = 0;
      var minDot = Number.MAX_VALUE;
      for (var i = 0; i < count2; ++i) {
         tVec = vertices2[i];
         var dot = tVec.x * normal1X + tVec.y * normal1Y;
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      tVec = vertices1[edge1];
      tMat = xf1.R;
      var v1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var v1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = vertices2[index];
      tMat = xf2.R;
      var v2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var v2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      v2X -= v1X;
      v2Y -= v1Y;
      var separation = v2X * normal1WorldX + v2Y * normal1WorldY;
      return separation;
   }
   b2Collision.FindMaxSeparation = function (edgeIndex, poly1, xf1, poly2, xf2) {
      var count1 = parseInt(poly1.m_vertexCount);
      var normals1 = poly1.m_normals;
      var tVec;
      var tMat;
      tMat = xf2.R;
      tVec = poly2.m_centroid;
      var dX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var dY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf1.R;
      tVec = poly1.m_centroid;
      dX -= xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      dY -= xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dLocal1X = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
      var dLocal1Y = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
      var edge = 0;
      var maxDot = (-Number.MAX_VALUE);
      for (var i = 0; i < count1; ++i) {
         tVec = normals1[i];
         var dot = (tVec.x * dLocal1X + tVec.y * dLocal1Y);
         if (dot > maxDot) {
            maxDot = dot;
            edge = i;
         }
      }
      var s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
      var prevEdge = parseInt(edge - 1 >= 0 ? edge - 1 : count1 - 1);
      var sPrev = b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
      var nextEdge = parseInt(edge + 1 < count1 ? edge + 1 : 0);
      var sNext = b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
      var bestEdge = 0;
      var bestSeparation = 0;
      var increment = 0;
      if (sPrev > s && sPrev > sNext) {
         increment = (-1);
         bestEdge = prevEdge;
         bestSeparation = sPrev;
      }
      else if (sNext > s) {
         increment = 1;
         bestEdge = nextEdge;
         bestSeparation = sNext;
      }
      else {
         edgeIndex[0] = edge;
         return s;
      }
      while (true) {
         if (increment == (-1)) edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
         else edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
         if (s > bestSeparation) {
            bestEdge = edge;
            bestSeparation = s;
         }
         else {
            break;
         }
      }
      edgeIndex[0] = bestEdge;
      return bestSeparation;
   }
   b2Collision.FindIncidentEdge = function (c, poly1, xf1, edge1, poly2, xf2) {
      if (edge1 === undefined) edge1 = 0;
      var count1 = parseInt(poly1.m_vertexCount);
      var normals1 = poly1.m_normals;
      var count2 = parseInt(poly2.m_vertexCount);
      var vertices2 = poly2.m_vertices;
      var normals2 = poly2.m_normals;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1X = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var normal1Y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var tX = (tMat.col1.x * normal1X + tMat.col1.y * normal1Y);
      normal1Y = (tMat.col2.x * normal1X + tMat.col2.y * normal1Y);
      normal1X = tX;
      var index = 0;
      var minDot = Number.MAX_VALUE;
      for (var i = 0; i < count2; ++i) {
         tVec = normals2[i];
         var dot = (normal1X * tVec.x + normal1Y * tVec.y);
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      var tClip;
      var i1 = parseInt(index);
      var i2 = parseInt(i1 + 1 < count2 ? i1 + 1 : 0);
      tClip = c[0];
      tVec = vertices2[i1];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i1;
      tClip.id.features.incidentVertex = 0;
      tClip = c[1];
      tVec = vertices2[i2];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i2;
      tClip.id.features.incidentVertex = 1;
   }
   b2Collision.MakeClipPointVector = function () {
      var r = new Vector(2);
      r[0] = new ClipVertex();
      r[1] = new ClipVertex();
      return r;
   }
   b2Collision.CollidePolygons = function (manifold, polyA, xfA, polyB, xfB) {
      var cv;
      manifold.m_pointCount = 0;
      var totalRadius = polyA.m_radius + polyB.m_radius;
      var edgeA = 0;
      b2Collision.s_edgeAO[0] = edgeA;
      var separationA = b2Collision.FindMaxSeparation(b2Collision.s_edgeAO, polyA, xfA, polyB, xfB);
      edgeA = b2Collision.s_edgeAO[0];
      if (separationA > totalRadius) return;
      var edgeB = 0;
      b2Collision.s_edgeBO[0] = edgeB;
      var separationB = b2Collision.FindMaxSeparation(b2Collision.s_edgeBO, polyB, xfB, polyA, xfA);
      edgeB = b2Collision.s_edgeBO[0];
      if (separationB > totalRadius) return;
      var poly1;
      var poly2;
      var xf1;
      var xf2;
      var edge1 = 0;
      var flip = 0;
      var k_relativeTol = 0.98;
      var k_absoluteTol = 0.001;
      var tMat;
      if (separationB > k_relativeTol * separationA + k_absoluteTol) {
         poly1 = polyB;
         poly2 = polyA;
         xf1 = xfB;
         xf2 = xfA;
         edge1 = edgeB;
         manifold.m_type = b2Manifold.e_faceB;
         flip = 1;
      }
      else {
         poly1 = polyA;
         poly2 = polyB;
         xf1 = xfA;
         xf2 = xfB;
         edge1 = edgeA;
         manifold.m_type = b2Manifold.e_faceA;
         flip = 0;
      }
      var incidentEdge = b2Collision.s_incidentEdge;
      b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
      var count1 = parseInt(poly1.m_vertexCount);
      var vertices1 = poly1.m_vertices;
      var local_v11 = vertices1[edge1];
      var local_v12;
      if (edge1 + 1 < count1) {
         local_v12 = vertices1[parseInt(edge1 + 1)];
      }
      else {
         local_v12 = vertices1[0];
      }
      var localTangent = b2Collision.s_localTangent;
      localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
      localTangent.Normalize();
      var localNormal = b2Collision.s_localNormal;
      localNormal.x = localTangent.y;
      localNormal.y = (-localTangent.x);
      var planePoint = b2Collision.s_planePoint;
      planePoint.Set(0.5 * (local_v11.x + local_v12.x), 0.5 * (local_v11.y + local_v12.y));
      var tangent = b2Collision.s_tangent;
      tMat = xf1.R;
      tangent.x = (tMat.col1.x * localTangent.x + tMat.col2.x * localTangent.y);
      tangent.y = (tMat.col1.y * localTangent.x + tMat.col2.y * localTangent.y);
      var tangent2 = b2Collision.s_tangent2;
      tangent2.x = (-tangent.x);
      tangent2.y = (-tangent.y);
      var normal = b2Collision.s_normal;
      normal.x = tangent.y;
      normal.y = (-tangent.x);
      var v11 = b2Collision.s_v11;
      var v12 = b2Collision.s_v12;
      v11.x = xf1.position.x + (tMat.col1.x * local_v11.x + tMat.col2.x * local_v11.y);
      v11.y = xf1.position.y + (tMat.col1.y * local_v11.x + tMat.col2.y * local_v11.y);
      v12.x = xf1.position.x + (tMat.col1.x * local_v12.x + tMat.col2.x * local_v12.y);
      v12.y = xf1.position.y + (tMat.col1.y * local_v12.x + tMat.col2.y * local_v12.y);
      var frontOffset = normal.x * v11.x + normal.y * v11.y;
      var sideOffset1 = (-tangent.x * v11.x) - tangent.y * v11.y + totalRadius;
      var sideOffset2 = tangent.x * v12.x + tangent.y * v12.y + totalRadius;
      var clipPoints1 = b2Collision.s_clipPoints1;
      var clipPoints2 = b2Collision.s_clipPoints2;
      var np = 0;
      np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, tangent2, sideOffset1);
      if (np < 2) return;
      np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2);
      if (np < 2) return;
      manifold.m_localPlaneNormal.SetV(localNormal);
      manifold.m_localPoint.SetV(planePoint);
      var pointCount = 0;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
         cv = clipPoints2[i];
         var separation = normal.x * cv.v.x + normal.y * cv.v.y - frontOffset;
         if (separation <= totalRadius) {
            var cp = manifold.m_points[pointCount];
            tMat = xf2.R;
            var tX = cv.v.x - xf2.position.x;
            var tY = cv.v.y - xf2.position.y;
            cp.m_localPoint.x = (tX * tMat.col1.x + tY * tMat.col1.y);
            cp.m_localPoint.y = (tX * tMat.col2.x + tY * tMat.col2.y);
            cp.m_id.Set(cv.id);
            cp.m_id.features.flip = flip;
            ++pointCount;
         }
      }
      manifold.m_pointCount = pointCount;
   }
   b2Collision.CollideCircles = function (manifold, circle1, xf1, circle2, xf2) {
      manifold.m_pointCount = 0;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = circle1.m_p;
      var p1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var p1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      tVec = circle2.m_p;
      var p2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var p2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var distSqr = dX * dX + dY * dY;
      var radius = circle1.m_radius + circle2.m_radius;
      if (distSqr > radius * radius) {
         return;
      }
      manifold.m_type = b2Manifold.e_circles;
      manifold.m_localPoint.SetV(circle1.m_p);
      manifold.m_localPlaneNormal.SetZero();
      manifold.m_pointCount = 1;
      manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
      manifold.m_points[0].m_id.key = 0;
   }
   b2Collision.CollidePolygonAndCircle = function (manifold, polygon, xf1, circle, xf2) {
      manifold.m_pointCount = 0;
      var tPoint;
      var dX = 0;
      var dY = 0;
      var positionX = 0;
      var positionY = 0;
      var tVec;
      var tMat;
      tMat = xf2.R;
      tVec = circle.m_p;
      var cX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var cY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      dX = cX - xf1.position.x;
      dY = cY - xf1.position.y;
      tMat = xf1.R;
      var cLocalX = (dX * tMat.col1.x + dY * tMat.col1.y);
      var cLocalY = (dX * tMat.col2.x + dY * tMat.col2.y);
      var dist = 0;
      var normalIndex = 0;
      var separation = (-Number.MAX_VALUE);
      var radius = polygon.m_radius + circle.m_radius;
      var vertexCount = parseInt(polygon.m_vertexCount);
      var vertices = polygon.m_vertices;
      var normals = polygon.m_normals;
      for (var i = 0; i < vertexCount; ++i) {
         tVec = vertices[i];
         dX = cLocalX - tVec.x;
         dY = cLocalY - tVec.y;
         tVec = normals[i];
         var s = tVec.x * dX + tVec.y * dY;
         if (s > radius) {
            return;
         }
         if (s > separation) {
            separation = s;
            normalIndex = i;
         }
      }
      var vertIndex1 = parseInt(normalIndex);
      var vertIndex2 = parseInt(vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0);
      var v1 = vertices[vertIndex1];
      var v2 = vertices[vertIndex2];
      if (separation < Number.MIN_VALUE) {
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.SetV(normals[normalIndex]);
         manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
         manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
         return;
      }
      var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
      var u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
      if (u1 <= 0.0) {
         if ((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v1.x;
         manifold.m_localPlaneNormal.y = cLocalY - v1.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v1);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else if (u2 <= 0) {
         if ((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v2.x;
         manifold.m_localPlaneNormal.y = cLocalY - v2.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v2);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else {
         var faceCenterX = 0.5 * (v1.x + v2.x);
         var faceCenterY = 0.5 * (v1.y + v2.y);
         separation = (cLocalX - faceCenterX) * normals[vertIndex1].x + (cLocalY - faceCenterY) * normals[vertIndex1].y;
         if (separation > radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = normals[vertIndex1].x;
         manifold.m_localPlaneNormal.y = normals[vertIndex1].y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.Set(faceCenterX, faceCenterY);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
   }
   b2Collision.TestOverlap = function (a, b) {
      var t1 = b.lowerBound;
      var t2 = a.upperBound;
      var d1X = t1.x - t2.x;
      var d1Y = t1.y - t2.y;
      t1 = a.lowerBound;
      t2 = b.upperBound;
      var d2X = t1.x - t2.x;
      var d2Y = t1.y - t2.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Collision.s_incidentEdge = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_clipPoints1 = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_clipPoints2 = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_edgeAO = new Vector_a2j_Number(1);
      Box2D.Collision.b2Collision.s_edgeBO = new Vector_a2j_Number(1);
      Box2D.Collision.b2Collision.s_localTangent = new b2Vec2();
      Box2D.Collision.b2Collision.s_localNormal = new b2Vec2();
      Box2D.Collision.b2Collision.s_planePoint = new b2Vec2();
      Box2D.Collision.b2Collision.s_normal = new b2Vec2();
      Box2D.Collision.b2Collision.s_tangent = new b2Vec2();
      Box2D.Collision.b2Collision.s_tangent2 = new b2Vec2();
      Box2D.Collision.b2Collision.s_v11 = new b2Vec2();
      Box2D.Collision.b2Collision.s_v12 = new b2Vec2();
      Box2D.Collision.b2Collision.b2CollidePolyTempVec = new b2Vec2();
      Box2D.Collision.b2Collision.b2_nullFeature = 0x000000ff;
   });
   b2ContactID.b2ContactID = function () {
      this.features = new Features();
   };
   b2ContactID.prototype.b2ContactID = function () {
      this.features._m_id = this;
   }
   b2ContactID.prototype.Set = function (id) {
      this.key = id._key;
   }
   b2ContactID.prototype.Copy = function () {
      var id = new b2ContactID();
      id.key = this.key;
      return id;
   }
   Object.defineProperty(b2ContactID.prototype, 'key', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._key;
      }
   });
   Object.defineProperty(b2ContactID.prototype, 'key', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._key = value;
         this.features._referenceEdge = this._key & 0x000000ff;
         this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
         this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
         this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
      }
   });
   b2ContactPoint.b2ContactPoint = function () {
      this.position = new b2Vec2();
      this.velocity = new b2Vec2();
      this.normal = new b2Vec2();
      this.id = new b2ContactID();
   };
   b2Distance.b2Distance = function () {};
   b2Distance.Distance = function (output, cache, input) {
      ++b2Distance.b2_gjkCalls;
      var proxyA = input.proxyA;
      var proxyB = input.proxyB;
      var transformA = input.transformA;
      var transformB = input.transformB;
      var simplex = b2Distance.s_simplex;
      simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
      var vertices = simplex.m_vertices;
      var k_maxIters = 20;
      var saveA = b2Distance.s_saveA;
      var saveB = b2Distance.s_saveB;
      var saveCount = 0;
      var closestPoint = simplex.GetClosestPoint();
      var distanceSqr1 = closestPoint.LengthSquared();
      var distanceSqr2 = distanceSqr1;
      var i = 0;
      var p;
      var iter = 0;
      while (iter < k_maxIters) {
         saveCount = simplex.m_count;
         for (i = 0;
         i < saveCount; i++) {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
         }
         switch (simplex.m_count) {
         case 1:
            break;
         case 2:
            simplex.Solve2();
            break;
         case 3:
            simplex.Solve3();
            break;
         default:
            b2Settings.b2Assert(false);
         }
         if (simplex.m_count == 3) {
            break;
         }
         p = simplex.GetClosestPoint();
         distanceSqr2 = p.LengthSquared();
         if (distanceSqr2 > distanceSqr1) {}
         distanceSqr1 = distanceSqr2;
         var d = simplex.GetSearchDirection();
         if (d.LengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE) {
            break;
         }
         var vertex = vertices[simplex.m_count];
         vertex.indexA = proxyA.GetSupport(b2Math.MulTMV(transformA.R, d.GetNegative()));
         vertex.wA = b2Math.MulX(transformA, proxyA.GetVertex(vertex.indexA));
         vertex.indexB = proxyB.GetSupport(b2Math.MulTMV(transformB.R, d));
         vertex.wB = b2Math.MulX(transformB, proxyB.GetVertex(vertex.indexB));
         vertex.w = b2Math.SubtractVV(vertex.wB, vertex.wA);
         ++iter;
         ++b2Distance.b2_gjkIters;
         var duplicate = false;
         for (i = 0;
         i < saveCount; i++) {
            if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
               duplicate = true;
               break;
            }
         }
         if (duplicate) {
            break;
         }++simplex.m_count;
      }
      b2Distance.b2_gjkMaxIters = b2Math.Max(b2Distance.b2_gjkMaxIters, iter);
      simplex.GetWitnessPoints(output.pointA, output.pointB);
      output.distance = b2Math.SubtractVV(output.pointA, output.pointB).Length();
      output.iterations = iter;
      simplex.WriteCache(cache);
      if (input.useRadii) {
         var rA = proxyA.m_radius;
         var rB = proxyB.m_radius;
         if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
            output.distance -= rA + rB;
            var normal = b2Math.SubtractVV(output.pointB, output.pointA);
            normal.Normalize();
            output.pointA.x += rA * normal.x;
            output.pointA.y += rA * normal.y;
            output.pointB.x -= rB * normal.x;
            output.pointB.y -= rB * normal.y;
         }
         else {
            p = new b2Vec2();
            p.x = .5 * (output.pointA.x + output.pointB.x);
            p.y = .5 * (output.pointA.y + output.pointB.y);
            output.pointA.x = output.pointB.x = p.x;
            output.pointA.y = output.pointB.y = p.y;
            output.distance = 0.0;
         }
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Distance.s_simplex = new b2Simplex();
      Box2D.Collision.b2Distance.s_saveA = new Vector_a2j_Number(3);
      Box2D.Collision.b2Distance.s_saveB = new Vector_a2j_Number(3);
   });
   b2DistanceInput.b2DistanceInput = function () {};
   b2DistanceOutput.b2DistanceOutput = function () {
      this.pointA = new b2Vec2();
      this.pointB = new b2Vec2();
   };
   b2DistanceProxy.b2DistanceProxy = function () {};
   b2DistanceProxy.prototype.Set = function (shape) {
      switch (shape.GetType()) {
      case b2Shape.e_circleShape:
         {
            var circle = (shape instanceof b2CircleShape ? shape : null);
            this.m_vertices = new Vector(1, true);
            this.m_vertices[0] = circle.m_p;
            this.m_count = 1;
            this.m_radius = circle.m_radius;
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var polygon = (shape instanceof b2PolygonShape ? shape : null);
            this.m_vertices = polygon.m_vertices;
            this.m_count = polygon.m_vertexCount;
            this.m_radius = polygon.m_radius;
         }
         break;
      default:
         b2Settings.b2Assert(false);
      }
   }
   b2DistanceProxy.prototype.GetSupport = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   }
   b2DistanceProxy.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   }
   b2DistanceProxy.prototype.GetVertexCount = function () {
      return this.m_count;
   }
   b2DistanceProxy.prototype.GetVertex = function (index) {
      if (index === undefined) index = 0;
      b2Settings.b2Assert(0 <= index && index < this.m_count);
      return this.m_vertices[index];
   }
   b2DynamicTree.b2DynamicTree = function () {};
   b2DynamicTree.prototype.b2DynamicTree = function () {
      this.m_root = null;
      this.m_freeList = null;
      this.m_path = 0;
      this.m_insertionCount = 0;
   }
   b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
      var node = this.AllocateNode();
      var extendX = b2Settings.b2_aabbExtension;
      var extendY = b2Settings.b2_aabbExtension;
      node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      node.aabb.upperBound.x = aabb.upperBound.x + extendX;
      node.aabb.upperBound.y = aabb.upperBound.y + extendY;
      node.userData = userData;
      this.InsertLeaf(node);
      return node;
   }
   b2DynamicTree.prototype.DestroyProxy = function (proxy) {
      this.RemoveLeaf(proxy);
      this.FreeNode(proxy);
   }
   b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
      b2Settings.b2Assert(proxy.IsLeaf());
      if (proxy.aabb.Contains(aabb)) {
         return false;
      }
      this.RemoveLeaf(proxy);
      var extendX = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
      var extendY = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
      proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
      proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
      this.InsertLeaf(proxy);
      return true;
   }
   b2DynamicTree.prototype.Rebalance = function (iterations) {
      if (iterations === undefined) iterations = 0;
      if (this.m_root == null) return;
      for (var i = 0; i < iterations; i++) {
         var node = this.m_root;
         var bit = 0;
         while (node.IsLeaf() == false) {
            node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
            bit = (bit + 1) & 31;
         }++this.m_path;
         this.RemoveLeaf(node);
         this.InsertLeaf(node);
      }
   }
   b2DynamicTree.prototype.GetFatAABB = function (proxy) {
      return proxy.aabb;
   }
   b2DynamicTree.prototype.GetUserData = function (proxy) {
      return proxy.userData;
   }
   b2DynamicTree.prototype.Query = function (callback, aabb) {
      if (this.m_root == null) return;
      var stack = new Vector();
      var count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(aabb)) {
            if (node.IsLeaf()) {
               var proceed = callback(node);
               if (!proceed) return;
            }
            else {
               stack[count++] = node.child1;
               stack[count++] = node.child2;
            }
         }
      }
   }
   b2DynamicTree.prototype.RayCast = function (callback, input) {
      if (this.m_root == null) return;
      var p1 = input.p1;
      var p2 = input.p2;
      var r = b2Math.SubtractVV(p1, p2);
      r.Normalize();
      var v = b2Math.CrossFV(1.0, r);
      var abs_v = b2Math.AbsV(v);
      var maxFraction = input.maxFraction;
      var segmentAABB = new b2AABB();
      var tX = 0;
      var tY = 0; {
         tX = p1.x + maxFraction * (p2.x - p1.x);
         tY = p1.y + maxFraction * (p2.y - p1.y);
         segmentAABB.lowerBound.x = Math.min(p1.x, tX);
         segmentAABB.lowerBound.y = Math.min(p1.y, tY);
         segmentAABB.upperBound.x = Math.max(p1.x, tX);
         segmentAABB.upperBound.y = Math.max(p1.y, tY);
      }
      var stack = new Vector();
      var count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(segmentAABB) == false) {
            continue;
         }
         var c = node.aabb.GetCenter();
         var h = node.aabb.GetExtents();
         var separation = Math.abs(v.x * (p1.x - c.x) + v.y * (p1.y - c.y)) - abs_v.x * h.x - abs_v.y * h.y;
         if (separation > 0.0) continue;
         if (node.IsLeaf()) {
            var subInput = new b2RayCastInput();
            subInput.p1 = input.p1;
            subInput.p2 = input.p2;
            subInput.maxFraction = input.maxFraction;
            maxFraction = callback(subInput, node);
            if (maxFraction == 0.0) return;
            if (maxFraction > 0.0) {
               tX = p1.x + maxFraction * (p2.x - p1.x);
               tY = p1.y + maxFraction * (p2.y - p1.y);
               segmentAABB.lowerBound.x = Math.min(p1.x, tX);
               segmentAABB.lowerBound.y = Math.min(p1.y, tY);
               segmentAABB.upperBound.x = Math.max(p1.x, tX);
               segmentAABB.upperBound.y = Math.max(p1.y, tY);
            }
         }
         else {
            stack[count++] = node.child1;
            stack[count++] = node.child2;
         }
      }
   }
   b2DynamicTree.prototype.AllocateNode = function () {
      if (this.m_freeList) {
         var node = this.m_freeList;
         this.m_freeList = node.parent;
         node.parent = null;
         node.child1 = null;
         node.child2 = null;
         return node;
      }
      return new b2DynamicTreeNode();
   }
   b2DynamicTree.prototype.FreeNode = function (node) {
      node.parent = this.m_freeList;
      this.m_freeList = node;
   }
   b2DynamicTree.prototype.InsertLeaf = function (leaf) {
      ++this.m_insertionCount;
      if (this.m_root == null) {
         this.m_root = leaf;
         this.m_root.parent = null;
         return;
      }
      var center = leaf.aabb.GetCenter();
      var sibling = this.m_root;
      if (sibling.IsLeaf() == false) {
         do {
            var child1 = sibling.child1;
            var child2 = sibling.child2;
            var norm1 = Math.abs((child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y);
            var norm2 = Math.abs((child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y);
            if (norm1 < norm2) {
               sibling = child1;
            }
            else {
               sibling = child2;
            }
         }
         while (sibling.IsLeaf() == false)
      }
      var node1 = sibling.parent;
      var node2 = this.AllocateNode();
      node2.parent = node1;
      node2.userData = null;
      node2.aabb.Combine(leaf.aabb, sibling.aabb);
      if (node1) {
         if (sibling.parent.child1 == sibling) {
            node1.child1 = node2;
         }
         else {
            node1.child2 = node2;
         }
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         do {
            if (node1.aabb.Contains(node2.aabb)) break;
            node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
            node2 = node1;
            node1 = node1.parent;
         }
         while (node1)
      }
      else {
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         this.m_root = node2;
      }
   }
   b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
      if (leaf == this.m_root) {
         this.m_root = null;
         return;
      }
      var node2 = leaf.parent;
      var node1 = node2.parent;
      var sibling;
      if (node2.child1 == leaf) {
         sibling = node2.child2;
      }
      else {
         sibling = node2.child1;
      }
      if (node1) {
         if (node1.child1 == node2) {
            node1.child1 = sibling;
         }
         else {
            node1.child2 = sibling;
         }
         sibling.parent = node1;
         this.FreeNode(node2);
         while (node1) {
            var oldAABB = node1.aabb;
            node1.aabb = b2AABB.Combine(node1.child1.aabb, node1.child2.aabb);
            if (oldAABB.Contains(node1.aabb)) break;
            node1 = node1.parent;
         }
      }
      else {
         this.m_root = sibling;
         sibling.parent = null;
         this.FreeNode(node2);
      }
   }
   b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase = function () {
      this.m_tree = new b2DynamicTree();
      this.m_moveBuffer = new Vector();
      this.m_pairBuffer = new Vector();
      this.m_pairCount = 0;
   };
   b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
      var proxy = this.m_tree.CreateProxy(aabb, userData);
      ++this.m_proxyCount;
      this.BufferMove(proxy);
      return proxy;
   }
   b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
      this.UnBufferMove(proxy);
      --this.m_proxyCount;
      this.m_tree.DestroyProxy(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
      var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
      if (buffer) {
         this.BufferMove(proxy);
      }
   }
   b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
      var aabbA = this.m_tree.GetFatAABB(proxyA);
      var aabbB = this.m_tree.GetFatAABB(proxyB);
      return aabbA.TestOverlap(aabbB);
   }
   b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
      return this.m_tree.GetUserData(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
      return this.m_tree.GetFatAABB(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
      return this.m_proxyCount;
   }
   b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
      var __this = this;
      __this.m_pairCount = 0;
      var i = 0,
         queryProxy;
      for (i = 0;
      i < __this.m_moveBuffer.length; ++i) {
         queryProxy = __this.m_moveBuffer[i];

         function QueryCallback(proxy) {
            if (proxy == queryProxy) return true;
            if (__this.m_pairCount == __this.m_pairBuffer.length) {
               __this.m_pairBuffer[__this.m_pairCount] = new b2DynamicTreePair();
            }
            var pair = __this.m_pairBuffer[__this.m_pairCount];
            pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
            pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;++__this.m_pairCount;
            return true;
         };
         var fatAABB = __this.m_tree.GetFatAABB(queryProxy);
         __this.m_tree.Query(QueryCallback, fatAABB);
      }
      __this.m_moveBuffer.length = 0;
      for (var i = 0; i < __this.m_pairCount;) {
         var primaryPair = __this.m_pairBuffer[i];
         var userDataA = __this.m_tree.GetUserData(primaryPair.proxyA);
         var userDataB = __this.m_tree.GetUserData(primaryPair.proxyB);
         callback(userDataA, userDataB);
         ++i;
         while (i < __this.m_pairCount) {
            var pair = __this.m_pairBuffer[i];
            if (pair.proxyA != primaryPair.proxyA || pair.proxyB != primaryPair.proxyB) {
               break;
            }++i;
         }
      }
   }
   b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
      this.m_tree.Query(callback, aabb);
   }
   b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
      this.m_tree.RayCast(callback, input);
   }
   b2DynamicTreeBroadPhase.prototype.Validate = function () {}
   b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations) {
      if (iterations === undefined) iterations = 0;
      this.m_tree.Rebalance(iterations);
   }
   b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
      this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
   }
   b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
      var i = parseInt(this.m_moveBuffer.indexOf(proxy));
      this.m_moveBuffer.splice(i, 1);
   }
   b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
      return 0;
   }
   b2DynamicTreeBroadPhase.__implements = {};
   b2DynamicTreeBroadPhase.__implements[IBroadPhase] = true;
   b2DynamicTreeNode.b2DynamicTreeNode = function () {
      this.aabb = new b2AABB();
   };
   b2DynamicTreeNode.prototype.IsLeaf = function () {
      return this.child1 == null;
   }
   b2DynamicTreePair.b2DynamicTreePair = function () {};
   b2Manifold.b2Manifold = function () {
      this.m_pointCount = 0;
   };
   b2Manifold.prototype.b2Manifold = function () {
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2ManifoldPoint();
      }
      this.m_localPlaneNormal = new b2Vec2();
      this.m_localPoint = new b2Vec2();
   }
   b2Manifold.prototype.Reset = function () {
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Reset();
      }
      this.m_localPlaneNormal.SetZero();
      this.m_localPoint.SetZero();
      this.m_type = 0;
      this.m_pointCount = 0;
   }
   b2Manifold.prototype.Set = function (m) {
      this.m_pointCount = m.m_pointCount;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Set(m.m_points[i]);
      }
      this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_type = m.m_type;
   }
   b2Manifold.prototype.Copy = function () {
      var copy = new b2Manifold();
      copy.Set(this);
      return copy;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Manifold.e_circles = 0x0001;
      Box2D.Collision.b2Manifold.e_faceA = 0x0002;
      Box2D.Collision.b2Manifold.e_faceB = 0x0004;
   });
   b2ManifoldPoint.b2ManifoldPoint = function () {
      this.m_localPoint = new b2Vec2();
      this.m_id = new b2ContactID();
   };
   b2ManifoldPoint.prototype.b2ManifoldPoint = function () {
      this.Reset();
   }
   b2ManifoldPoint.prototype.Reset = function () {
      this.m_localPoint.SetZero();
      this.m_normalImpulse = 0.0;
      this.m_tangentImpulse = 0.0;
      this.m_id.key = 0;
   }
   b2ManifoldPoint.prototype.Set = function (m) {
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_normalImpulse = m.m_normalImpulse;
      this.m_tangentImpulse = m.m_tangentImpulse;
      this.m_id.Set(m.m_id);
   }
   b2Point.b2Point = function () {
      this.p = new b2Vec2();
   };
   b2Point.prototype.Support = function (xf, vX, vY) {
      if (vX === undefined) vX = 0;
      if (vY === undefined) vY = 0;
      return this.p;
   }
   b2Point.prototype.GetFirstVertex = function (xf) {
      return this.p;
   }
   b2RayCastInput.b2RayCastInput = function () {
      this.p1 = new b2Vec2();
      this.p2 = new b2Vec2();
   };
   b2RayCastInput.prototype.b2RayCastInput = function (p1, p2, maxFraction) {
      if (p1 === undefined) p1 = null;
      if (p2 === undefined) p2 = null;
      if (maxFraction === undefined) maxFraction = 1;
      if (p1) this.p1.SetV(p1);
      if (p2) this.p2.SetV(p2);
      this.maxFraction = maxFraction;
   }
   b2RayCastOutput.b2RayCastOutput = function () {
      this.normal = new b2Vec2();
   };
   b2Segment.b2Segment = function () {
      this.p1 = new b2Vec2();
      this.p2 = new b2Vec2();
   };
   b2Segment.prototype.TestSegment = function (lambda, normal, segment, maxLambda) {
      if (maxLambda === undefined) maxLambda = 0;
      var s = segment.p1;
      var rX = segment.p2.x - s.x;
      var rY = segment.p2.y - s.y;
      var dX = this.p2.x - this.p1.x;
      var dY = this.p2.y - this.p1.y;
      var nX = dY;
      var nY = (-dX);
      var k_slop = 100.0 * Number.MIN_VALUE;
      var denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = s.x - this.p1.x;
         var bY = s.y - this.p1.y;
         var a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= maxLambda * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               nX /= nLen;
               nY /= nLen;
               lambda[0] = a;
               normal.Set(nX, nY);
               return true;
            }
         }
      }
      return false;
   }
   b2Segment.prototype.Extend = function (aabb) {
      this.ExtendForward(aabb);
      this.ExtendBackward(aabb);
   }
   b2Segment.prototype.ExtendForward = function (aabb) {
      var dX = this.p2.x - this.p1.x;
      var dY = this.p2.y - this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p1.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p1.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p1.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p1.y) / dY : Number.POSITIVE_INFINITY);
      this.p2.x = this.p1.x + dX * lambda;
      this.p2.y = this.p1.y + dY * lambda;
   }
   b2Segment.prototype.ExtendBackward = function (aabb) {
      var dX = (-this.p2.x) + this.p1.x;
      var dY = (-this.p2.y) + this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p2.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p2.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p2.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p2.y) / dY : Number.POSITIVE_INFINITY);
      this.p1.x = this.p2.x + dX * lambda;
      this.p1.y = this.p2.y + dY * lambda;
   }
   b2SeparationFunction.b2SeparationFunction = function () {
      this.m_localPoint = new b2Vec2();
      this.m_axis = new b2Vec2();
   };
   b2SeparationFunction.prototype.Initialize = function (cache, proxyA, transformA, proxyB, transformB) {
      this.m_proxyA = proxyA;
      this.m_proxyB = proxyB;
      var count = parseInt(cache.count);
      b2Settings.b2Assert(0 < count && count < 3);
      var localPointA;
      var localPointA1;
      var localPointA2;
      var localPointB;
      var localPointB1;
      var localPointB2;
      var pointAX = 0;
      var pointAY = 0;
      var pointBX = 0;
      var pointBY = 0;
      var normalX = 0;
      var normalY = 0;
      var tMat;
      var tVec;
      var s = 0;
      var sgn = 0;
      if (count == 1) {
         this.m_type = b2SeparationFunction.e_points;
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         this.m_axis.x = pointBX - pointAX;
         this.m_axis.y = pointBY - pointAY;
         this.m_axis.Normalize();
      }
      else if (cache.indexB[0] == cache.indexB[1]) {
         this.m_type = b2SeparationFunction.e_faceA;
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
         this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformA.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else if (cache.indexA[0] == cache.indexA[0]) {
         this.m_type = b2SeparationFunction.e_faceB;
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
         this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformB.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else {
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         var pA = b2Math.MulX(transformA, localPointA);
         var dA = b2Math.MulMV(transformA.R, b2Math.SubtractVV(localPointA2, localPointA1));
         var pB = b2Math.MulX(transformB, localPointB);
         var dB = b2Math.MulMV(transformB.R, b2Math.SubtractVV(localPointB2, localPointB1));
         var a = dA.x * dA.x + dA.y * dA.y;
         var e = dB.x * dB.x + dB.y * dB.y;
         var r = b2Math.SubtractVV(dB, dA);
         var c = dA.x * r.x + dA.y * r.y;
         var f = dB.x * r.x + dB.y * r.y;
         var b = dA.x * dB.x + dA.y * dB.y;
         var denom = a * e - b * b;
         s = 0.0;
         if (denom != 0.0) {
            s = b2Math.Clamp((b * f - c * e) / denom, 0.0, 1.0);
         }
         var t = (b * s + f) / e;
         if (t < 0.0) {
            t = 0.0;
            s = b2Math.Clamp((b - c) / a, 0.0, 1.0);
         }
         localPointA = new b2Vec2();
         localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
         localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
         localPointB = new b2Vec2();
         localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
         localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
         if (s == 0.0 || s == 1.0) {
            this.m_type = b2SeparationFunction.e_faceB;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
            this.m_axis.Normalize();
            this.m_localPoint = localPointB;
            tVec = this.m_axis;
            tMat = transformB.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointA;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
         else {
            this.m_type = b2SeparationFunction.e_faceA;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
            this.m_localPoint = localPointA;
            tVec = this.m_axis;
            tMat = transformA.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointB;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
      }
   }
   b2SeparationFunction.prototype.Evaluate = function (transformA, transformB) {
      var axisA;
      var axisB;
      var localPointA;
      var localPointB;
      var pointA;
      var pointB;
      var seperation = 0;
      var normal;
      switch (this.m_type) {
      case b2SeparationFunction.e_points:
         {
            axisA = b2Math.MulTMV(transformA.R, this.m_axis);
            axisB = b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointA = b2Math.MulX(transformA, localPointA);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceA:
         {
            normal = b2Math.MulMV(transformA.R, this.m_axis);
            pointA = b2Math.MulX(transformA, this.m_localPoint);
            axisB = b2Math.MulTMV(transformB.R, normal.GetNegative());
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceB:
         {
            normal = b2Math.MulMV(transformB.R, this.m_axis);
            pointB = b2Math.MulX(transformB, this.m_localPoint);
            axisA = b2Math.MulTMV(transformA.R, normal.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            pointA = b2Math.MulX(transformA, localPointA);
            seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
            return seperation;
         }
      default:
         b2Settings.b2Assert(false);
         return 0.0;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2SeparationFunction.e_points = 0x01;
      Box2D.Collision.b2SeparationFunction.e_faceA = 0x02;
      Box2D.Collision.b2SeparationFunction.e_faceB = 0x04;
   });
   b2Simplex.b2Simplex = function () {
      this.m_v1 = new b2SimplexVertex();
      this.m_v2 = new b2SimplexVertex();
      this.m_v3 = new b2SimplexVertex();
      this.m_vertices = new Vector(3);
   };
   b2Simplex.prototype.b2Simplex = function () {
      this.m_vertices[0] = this.m_v1;
      this.m_vertices[1] = this.m_v2;
      this.m_vertices[2] = this.m_v3;
   }
   b2Simplex.prototype.ReadCache = function (cache, proxyA, transformA, proxyB, transformB) {
      b2Settings.b2Assert(0 <= cache.count && cache.count <= 3);
      var wALocal;
      var wBLocal;
      this.m_count = cache.count;
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         var v = vertices[i];
         v.indexA = cache.indexA[i];
         v.indexB = cache.indexB[i];
         wALocal = proxyA.GetVertex(v.indexA);
         wBLocal = proxyB.GetVertex(v.indexB);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         v.a = 0;
      }
      if (this.m_count > 1) {
         var metric1 = cache.metric;
         var metric2 = this.GetMetric();
         if (metric2 < .5 * metric1 || 2.0 * metric1 < metric2 || metric2 < Number.MIN_VALUE) {
            this.m_count = 0;
         }
      }
      if (this.m_count == 0) {
         v = vertices[0];
         v.indexA = 0;
         v.indexB = 0;
         wALocal = proxyA.GetVertex(0);
         wBLocal = proxyB.GetVertex(0);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         this.m_count = 1;
      }
   }
   b2Simplex.prototype.WriteCache = function (cache) {
      cache.metric = this.GetMetric();
      cache.count = Box2D.parseUInt(this.m_count);
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         cache.indexA[i] = Box2D.parseUInt(vertices[i].indexA);
         cache.indexB[i] = Box2D.parseUInt(vertices[i].indexB);
      }
   }
   b2Simplex.prototype.GetSearchDirection = function () {
      switch (this.m_count) {
      case 1:
         return this.m_v1.w.GetNegative();
      case 2:
         {
            var e12 = b2Math.SubtractVV(this.m_v2.w, this.m_v1.w);
            var sgn = b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
            if (sgn > 0.0) {
               return b2Math.CrossFV(1.0, e12);
            }
            else {
               return b2Math.CrossVF(e12, 1.0);
            }
         }
      default:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      }
   }
   b2Simplex.prototype.GetClosestPoint = function () {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      case 1:
         return this.m_v1.w;
      case 2:
         return new b2Vec2(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
      default:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      }
   }
   b2Simplex.prototype.GetWitnessPoints = function (pA, pB) {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         break;
      case 1:
         pA.SetV(this.m_v1.wA);
         pB.SetV(this.m_v1.wB);
         break;
      case 2:
         pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
         pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
         pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
         pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
         break;
      case 3:
         pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
         pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
         break;
      default:
         b2Settings.b2Assert(false);
         break;
      }
   }
   b2Simplex.prototype.GetMetric = function () {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         return 0.0;
      case 1:
         return 0.0;
      case 2:
         return b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
      case 3:
         return b2Math.CrossVV(b2Math.SubtractVV(this.m_v2.w, this.m_v1.w), b2Math.SubtractVV(this.m_v3.w, this.m_v1.w));
      default:
         b2Settings.b2Assert(false);
         return 0.0;
      }
   }
   b2Simplex.prototype.Solve2 = function () {
      var w1 = this.m_v1.w;
      var w2 = this.m_v2.w;
      var e12 = b2Math.SubtractVV(w2, w1);
      var d12_2 = (-(w1.x * e12.x + w1.y * e12.y));
      if (d12_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      var d12_1 = (w2.x * e12.x + w2.y * e12.y);
      if (d12_1 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      var inv_d12 = 1.0 / (d12_1 + d12_2);
      this.m_v1.a = d12_1 * inv_d12;
      this.m_v2.a = d12_2 * inv_d12;
      this.m_count = 2;
   }
   b2Simplex.prototype.Solve3 = function () {
      var w1 = this.m_v1.w;
      var w2 = this.m_v2.w;
      var w3 = this.m_v3.w;
      var e12 = b2Math.SubtractVV(w2, w1);
      var w1e12 = b2Math.Dot(w1, e12);
      var w2e12 = b2Math.Dot(w2, e12);
      var d12_1 = w2e12;
      var d12_2 = (-w1e12);
      var e13 = b2Math.SubtractVV(w3, w1);
      var w1e13 = b2Math.Dot(w1, e13);
      var w3e13 = b2Math.Dot(w3, e13);
      var d13_1 = w3e13;
      var d13_2 = (-w1e13);
      var e23 = b2Math.SubtractVV(w3, w2);
      var w2e23 = b2Math.Dot(w2, e23);
      var w3e23 = b2Math.Dot(w3, e23);
      var d23_1 = w3e23;
      var d23_2 = (-w2e23);
      var n123 = b2Math.CrossVV(e12, e13);
      var d123_1 = n123 * b2Math.CrossVV(w2, w3);
      var d123_2 = n123 * b2Math.CrossVV(w3, w1);
      var d123_3 = n123 * b2Math.CrossVV(w1, w2);
      if (d12_2 <= 0.0 && d13_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
         var inv_d12 = 1.0 / (d12_1 + d12_2);
         this.m_v1.a = d12_1 * inv_d12;
         this.m_v2.a = d12_2 * inv_d12;
         this.m_count = 2;
         return;
      }
      if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
         var inv_d13 = 1.0 / (d13_1 + d13_2);
         this.m_v1.a = d13_1 * inv_d13;
         this.m_v3.a = d13_2 * inv_d13;
         this.m_count = 2;
         this.m_v2.Set(this.m_v3);
         return;
      }
      if (d12_1 <= 0.0 && d23_2 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      if (d13_1 <= 0.0 && d23_1 <= 0.0) {
         this.m_v3.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v3);
         return;
      }
      if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
         var inv_d23 = 1.0 / (d23_1 + d23_2);
         this.m_v2.a = d23_1 * inv_d23;
         this.m_v3.a = d23_2 * inv_d23;
         this.m_count = 2;
         this.m_v1.Set(this.m_v3);
         return;
      }
      var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
      this.m_v1.a = d123_1 * inv_d123;
      this.m_v2.a = d123_2 * inv_d123;
      this.m_v3.a = d123_3 * inv_d123;
      this.m_count = 3;
   }
   b2SimplexCache.b2SimplexCache = function () {
      this.indexA = new Vector_a2j_Number(3);
      this.indexB = new Vector_a2j_Number(3);
   };
   b2SimplexVertex.b2SimplexVertex = function () {};
   b2SimplexVertex.prototype.Set = function (other) {
      this.wA.SetV(other.wA);
      this.wB.SetV(other.wB);
      this.w.SetV(other.w);
      this.a = other.a;
      this.indexA = other.indexA;
      this.indexB = other.indexB;
   }
   b2TimeOfImpact.b2TimeOfImpact = function () {};
   b2TimeOfImpact.TimeOfImpact = function (input) {
      ++b2TimeOfImpact.b2_toiCalls;
      var proxyA = input.proxyA;
      var proxyB = input.proxyB;
      var sweepA = input.sweepA;
      var sweepB = input.sweepB;
      b2Settings.b2Assert(sweepA.t0 == sweepB.t0);
      b2Settings.b2Assert(1.0 - sweepA.t0 > Number.MIN_VALUE);
      var radius = proxyA.m_radius + proxyB.m_radius;
      var tolerance = input.tolerance;
      var alpha = 0.0;
      var k_maxIterations = 1000;
      var iter = 0;
      var target = 0.0;
      b2TimeOfImpact.s_cache.count = 0;
      b2TimeOfImpact.s_distanceInput.useRadii = false;
      for (;;) {
         sweepA.GetTransform(b2TimeOfImpact.s_xfA, alpha);
         sweepB.GetTransform(b2TimeOfImpact.s_xfB, alpha);
         b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
         b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
         b2TimeOfImpact.s_distanceInput.transformA = b2TimeOfImpact.s_xfA;
         b2TimeOfImpact.s_distanceInput.transformB = b2TimeOfImpact.s_xfB;
         b2Distance.Distance(b2TimeOfImpact.s_distanceOutput, b2TimeOfImpact.s_cache, b2TimeOfImpact.s_distanceInput);
         if (b2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
            alpha = 1.0;
            break;
         }
         b2TimeOfImpact.s_fcn.Initialize(b2TimeOfImpact.s_cache, proxyA, b2TimeOfImpact.s_xfA, proxyB, b2TimeOfImpact.s_xfB);
         var separation = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
         if (separation <= 0.0) {
            alpha = 1.0;
            break;
         }
         if (iter == 0) {
            if (separation > radius) {
               target = b2Math.Max(radius - tolerance, 0.75 * radius);
            }
            else {
               target = b2Math.Max(separation - tolerance, 0.02 * radius);
            }
         }
         if (separation - target < 0.5 * tolerance) {
            if (iter == 0) {
               alpha = 1.0;
               break;
            }
            break;
         }
         var newAlpha = alpha; {
            var x1 = alpha;
            var x2 = 1.0;
            var f1 = separation;
            sweepA.GetTransform(b2TimeOfImpact.s_xfA, x2);
            sweepB.GetTransform(b2TimeOfImpact.s_xfB, x2);
            var f2 = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
            if (f2 >= target) {
               alpha = 1.0;
               break;
            }
            var rootIterCount = 0;
            for (;;) {
               var x = 0;
               if (rootIterCount & 1) {
                  x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
               }
               else {
                  x = 0.5 * (x1 + x2);
               }
               sweepA.GetTransform(b2TimeOfImpact.s_xfA, x);
               sweepB.GetTransform(b2TimeOfImpact.s_xfB, x);
               var f = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
               if (b2Math.Abs(f - target) < 0.025 * tolerance) {
                  newAlpha = x;
                  break;
               }
               if (f > target) {
                  x1 = x;
                  f1 = f;
               }
               else {
                  x2 = x;
                  f2 = f;
               }++rootIterCount;
               ++b2TimeOfImpact.b2_toiRootIters;
               if (rootIterCount == 50) {
                  break;
               }
            }
            b2TimeOfImpact.b2_toiMaxRootIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
         }
         if (newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha) {
            break;
         }
         alpha = newAlpha;
         iter++;
         ++b2TimeOfImpact.b2_toiIters;
         if (iter == k_maxIterations) {
            break;
         }
      }
      b2TimeOfImpact.b2_toiMaxIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxIters, iter);
      return alpha;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0;
      Box2D.Collision.b2TimeOfImpact.s_cache = new b2SimplexCache();
      Box2D.Collision.b2TimeOfImpact.s_distanceInput = new b2DistanceInput();
      Box2D.Collision.b2TimeOfImpact.s_xfA = new b2Transform();
      Box2D.Collision.b2TimeOfImpact.s_xfB = new b2Transform();
      Box2D.Collision.b2TimeOfImpact.s_fcn = new b2SeparationFunction();
      Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new b2DistanceOutput();
   });
   b2TOIInput.b2TOIInput = function () {
      this.proxyA = new b2DistanceProxy();
      this.proxyB = new b2DistanceProxy();
      this.sweepA = new b2Sweep();
      this.sweepB = new b2Sweep();
   };
   b2WorldManifold.b2WorldManifold = function () {
      this.m_normal = new b2Vec2();
   };
   b2WorldManifold.prototype.b2WorldManifold = function () {
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2Vec2();
      }
   }
   b2WorldManifold.prototype.Initialize = function (manifold, xfA, radiusA, xfB, radiusB) {
      if (radiusA === undefined) radiusA = 0;
      if (radiusB === undefined) radiusB = 0;
      if (manifold.m_pointCount == 0) {
         return;
      }
      var i = 0;
      var tVec;
      var tMat;
      var normalX = 0;
      var normalY = 0;
      var planePointX = 0;
      var planePointY = 0;
      var clipPointX = 0;
      var clipPointY = 0;
      switch (manifold.m_type) {
      case b2Manifold.e_circles:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_points[0].m_localPoint;
            var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            var dX = pointBX - pointAX;
            var dY = pointBY - pointAY;
            var d2 = dX * dX + dY * dY;
            if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1;
               this.m_normal.y = 0;
            }
            var cAX = pointAX + radiusA * this.m_normal.x;
            var cAY = pointAY + radiusA * this.m_normal.y;
            var cBX = pointBX - radiusB * this.m_normal.x;
            var cBY = pointBY - radiusB * this.m_normal.y;
            this.m_points[0].x = 0.5 * (cAX + cBX);
            this.m_points[0].y = 0.5 * (cAY + cBY);
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = normalX;
            this.m_normal.y = normalY;
            for (i = 0;
            i < manifold.m_pointCount; i++) {
               tMat = xfB.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = xfB.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_localPoint;
            planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = (-normalX);
            this.m_normal.y = (-normalY);
            for (i = 0;
            i < manifold.m_pointCount; i++) {
               tMat = xfA.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
            }
         }
         break;
      }
   }
   ClipVertex.ClipVertex = function () {
      this.v = new b2Vec2();
      this.id = new b2ContactID();
   };
   ClipVertex.prototype.Set = function (other) {
      this.v.SetV(other.v);
      this.id.Set(other.id);
   }
   Features.Features = function () {};
   Object.defineProperty(Features.prototype, 'referenceEdge', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._referenceEdge;
      }
   });
   Object.defineProperty(Features.prototype, 'referenceEdge', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._referenceEdge = value;
         this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
      }
   });
   Object.defineProperty(Features.prototype, 'incidentEdge', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._incidentEdge;
      }
   });
   Object.defineProperty(Features.prototype, 'incidentEdge', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._incidentEdge = value;
         this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
      }
   });
   Object.defineProperty(Features.prototype, 'incidentVertex', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._incidentVertex;
      }
   });
   Object.defineProperty(Features.prototype, 'incidentVertex', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._incidentVertex = value;
         this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
      }
   });
   Object.defineProperty(Features.prototype, 'flip', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._flip;
      }
   });
   Object.defineProperty(Features.prototype, 'flip', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._flip = value;
         this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
      }
   });
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   Box2D.inherit(b2CircleShape, Box2D.Collision.Shapes.b2Shape);
   b2CircleShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2CircleShape.b2CircleShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
      this.m_p = new b2Vec2();
   };
   b2CircleShape.prototype.Copy = function () {
      var s = new b2CircleShape();
      s.Set(this);
      return s;
   }
   b2CircleShape.prototype.Set = function (other) {
      this.__super.Set.call(this, other);
      if (Box2D.is(other, b2CircleShape)) {
         var other2 = (other instanceof b2CircleShape ? other : null);
         this.m_p.SetV(other2.m_p);
      }
   }
   b2CircleShape.prototype.TestPoint = function (transform, p) {
      var tMat = transform.R;
      var dX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var dY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      dX = p.x - dX;
      dY = p.y - dY;
      return (dX * dX + dY * dY) <= this.m_radius * this.m_radius;
   }
   b2CircleShape.prototype.RayCast = function (output, input, transform) {
      var tMat = transform.R;
      var positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      var sX = input.p1.x - positionX;
      var sY = input.p1.y - positionY;
      var b = (sX * sX + sY * sY) - this.m_radius * this.m_radius;
      var rX = input.p2.x - input.p1.x;
      var rY = input.p2.y - input.p1.y;
      var c = (sX * rX + sY * rY);
      var rr = (rX * rX + rY * rY);
      var sigma = c * c - rr * b;
      if (sigma < 0.0 || rr < Number.MIN_VALUE) {
         return false;
      }
      var a = (-(c + Math.sqrt(sigma)));
      if (0.0 <= a && a <= input.maxFraction * rr) {
         a /= rr;
         output.fraction = a;
         output.normal.x = sX + a * rX;
         output.normal.y = sY + a * rY;
         output.normal.Normalize();
         return true;
      }
      return false;
   }
   b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R;
      var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
      aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
   }
   b2CircleShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      massData.mass = density * b2Settings.b2_pi * this.m_radius * this.m_radius;
      massData.center.SetV(this.m_p);
      massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
   }
   b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var p = b2Math.MulX(xf, this.m_p);
      var l = (-(b2Math.Dot(normal, p) - offset));
      if (l < (-this.m_radius) + Number.MIN_VALUE) {
         return 0;
      }
      if (l > this.m_radius) {
         c.SetV(p);
         return Math.PI * this.m_radius * this.m_radius;
      }
      var r2 = this.m_radius * this.m_radius;
      var l2 = l * l;
      var area = r2 * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(r2 - l2);
      var com = (-2 / 3 * Math.pow(r2 - l2, 1.5) / area);
      c.x = p.x + normal.x * com;
      c.y = p.y + normal.y * com;
      return area;
   }
   b2CircleShape.prototype.GetLocalPosition = function () {
      return this.m_p;
   }
   b2CircleShape.prototype.SetLocalPosition = function (position) {
      this.m_p.SetV(position);
   }
   b2CircleShape.prototype.GetRadius = function () {
      return this.m_radius;
   }
   b2CircleShape.prototype.SetRadius = function (radius) {
      if (radius === undefined) radius = 0;
      this.m_radius = radius;
   }
   b2CircleShape.prototype.b2CircleShape = function (radius) {
      if (radius === undefined) radius = 0;
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_circleShape;
      this.m_radius = radius;
   }
   b2EdgeChainDef.b2EdgeChainDef = function () {};
   b2EdgeChainDef.prototype.b2EdgeChainDef = function () {
      this.vertexCount = 0;
      this.isALoop = true;
      this.vertices = [];
   }
   Box2D.inherit(b2EdgeShape, Box2D.Collision.Shapes.b2Shape);
   b2EdgeShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2EdgeShape.b2EdgeShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
      this.s_supportVec = new b2Vec2();
      this.m_v1 = new b2Vec2();
      this.m_v2 = new b2Vec2();
      this.m_coreV1 = new b2Vec2();
      this.m_coreV2 = new b2Vec2();
      this.m_normal = new b2Vec2();
      this.m_direction = new b2Vec2();
      this.m_cornerDir1 = new b2Vec2();
      this.m_cornerDir2 = new b2Vec2();
   };
   b2EdgeShape.prototype.TestPoint = function (transform, p) {
      return false;
   }
   b2EdgeShape.prototype.RayCast = function (output, input, transform) {
      var tMat;
      var rX = input.p2.x - input.p1.x;
      var rY = input.p2.y - input.p1.y;
      tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
      var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
      var nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y;
      var nY = (-(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X));
      var k_slop = 100.0 * Number.MIN_VALUE;
      var denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = input.p1.x - v1X;
         var bY = input.p1.y - v1Y;
         var a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= input.maxFraction * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               output.fraction = a;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               output.normal.x = nX / nLen;
               output.normal.y = nY / nLen;
               return true;
            }
         }
      }
      return false;
   }
   b2EdgeShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
      var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
      var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
      var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
      if (v1X < v2X) {
         aabb.lowerBound.x = v1X;
         aabb.upperBound.x = v2X;
      }
      else {
         aabb.lowerBound.x = v2X;
         aabb.upperBound.x = v1X;
      }
      if (v1Y < v2Y) {
         aabb.lowerBound.y = v1Y;
         aabb.upperBound.y = v2Y;
      }
      else {
         aabb.lowerBound.y = v2Y;
         aabb.upperBound.y = v1Y;
      }
   }
   b2EdgeShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      massData.mass = 0;
      massData.center.SetV(this.m_v1);
      massData.I = 0;
   }
   b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var v0 = new b2Vec2(normal.x * offset, normal.y * offset);
      var v1 = b2Math.MulX(xf, this.m_v1);
      var v2 = b2Math.MulX(xf, this.m_v2);
      var d1 = b2Math.Dot(normal, v1) - offset;
      var d2 = b2Math.Dot(normal, v2) - offset;
      if (d1 > 0) {
         if (d2 > 0) {
            return 0;
         }
         else {
            v1.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v1.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
      }
      else {
         if (d2 > 0) {
            v2.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v2.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
         else {}
      }
      c.x = (v0.x + v1.x + v2.x) / 3;
      c.y = (v0.y + v1.y + v2.y) / 3;
      return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
   }
   b2EdgeShape.prototype.GetLength = function () {
      return this.m_length;
   }
   b2EdgeShape.prototype.GetVertex1 = function () {
      return this.m_v1;
   }
   b2EdgeShape.prototype.GetVertex2 = function () {
      return this.m_v2;
   }
   b2EdgeShape.prototype.GetCoreVertex1 = function () {
      return this.m_coreV1;
   }
   b2EdgeShape.prototype.GetCoreVertex2 = function () {
      return this.m_coreV2;
   }
   b2EdgeShape.prototype.GetNormalVector = function () {
      return this.m_normal;
   }
   b2EdgeShape.prototype.GetDirectionVector = function () {
      return this.m_direction;
   }
   b2EdgeShape.prototype.GetCorner1Vector = function () {
      return this.m_cornerDir1;
   }
   b2EdgeShape.prototype.GetCorner2Vector = function () {
      return this.m_cornerDir2;
   }
   b2EdgeShape.prototype.Corner1IsConvex = function () {
      return this.m_cornerConvex1;
   }
   b2EdgeShape.prototype.Corner2IsConvex = function () {
      return this.m_cornerConvex2;
   }
   b2EdgeShape.prototype.GetFirstVertex = function (xf) {
      var tMat = xf.R;
      return new b2Vec2(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
   }
   b2EdgeShape.prototype.GetNextEdge = function () {
      return this.m_nextEdge;
   }
   b2EdgeShape.prototype.GetPrevEdge = function () {
      return this.m_prevEdge;
   }
   b2EdgeShape.prototype.Support = function (xf, dX, dY) {
      if (dX === undefined) dX = 0;
      if (dY === undefined) dY = 0;
      var tMat = xf.R;
      var v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
      var v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
      var v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
      var v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
      if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
         this.s_supportVec.x = v1X;
         this.s_supportVec.y = v1Y;
      }
      else {
         this.s_supportVec.x = v2X;
         this.s_supportVec.y = v2Y;
      }
      return this.s_supportVec;
   }
   b2EdgeShape.prototype.b2EdgeShape = function (v1, v2) {
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_edgeShape;
      this.m_prevEdge = null;
      this.m_nextEdge = null;
      this.m_v1 = v1;
      this.m_v2 = v2;
      this.m_direction.Set(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
      this.m_length = this.m_direction.Normalize();
      this.m_normal.Set(this.m_direction.y, (-this.m_direction.x));
      this.m_coreV1.Set((-b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x)) + this.m_v1.x, (-b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y)) + this.m_v1.y);
      this.m_coreV2.Set((-b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x)) + this.m_v2.x, (-b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y)) + this.m_v2.y);
      this.m_cornerDir1 = this.m_normal;
      this.m_cornerDir2.Set((-this.m_normal.x), (-this.m_normal.y));
   }
   b2EdgeShape.prototype.SetPrevEdge = function (edge, core, cornerDir, convex) {
      this.m_prevEdge = edge;
      this.m_coreV1 = core;
      this.m_cornerDir1 = cornerDir;
      this.m_cornerConvex1 = convex;
   }
   b2EdgeShape.prototype.SetNextEdge = function (edge, core, cornerDir, convex) {
      this.m_nextEdge = edge;
      this.m_coreV2 = core;
      this.m_cornerDir2 = cornerDir;
      this.m_cornerConvex2 = convex;
   }
   b2MassData.b2MassData = function () {
      this.mass = 0.0;
      this.center = new b2Vec2(0, 0);
      this.I = 0.0;
   };
   Box2D.inherit(b2PolygonShape, Box2D.Collision.Shapes.b2Shape);
   b2PolygonShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2PolygonShape.b2PolygonShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
   };
   b2PolygonShape.prototype.Copy = function () {
      var s = new b2PolygonShape();
      s.Set(this);
      return s;
   }
   b2PolygonShape.prototype.Set = function (other) {
      this.__super.Set.call(this, other);
      if (Box2D.is(other, b2PolygonShape)) {
         var other2 = (other instanceof b2PolygonShape ? other : null);
         this.m_centroid.SetV(other2.m_centroid);
         this.m_vertexCount = other2.m_vertexCount;
         this.Reserve(this.m_vertexCount);
         for (var i = 0; i < this.m_vertexCount; i++) {
            this.m_vertices[i].SetV(other2.m_vertices[i]);
            this.m_normals[i].SetV(other2.m_normals[i]);
         }
      }
   }
   b2PolygonShape.prototype.SetAsArray = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var v = new Vector();
      var i = 0,
         tVec;
      for (i = 0;
      i < vertices.length; ++i) {
         tVec = vertices[i];
         v.push(tVec);
      }
      this.SetAsVector(v, vertexCount);
   }
   b2PolygonShape.AsArray = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsArray(vertices, vertexCount);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsVector = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      if (vertexCount == 0) vertexCount = vertices.length;
      b2Settings.b2Assert(2 <= vertexCount);
      this.m_vertexCount = vertexCount;
      this.Reserve(vertexCount);
      var i = 0;
      for (i = 0;
      i < this.m_vertexCount; i++) {
         this.m_vertices[i].SetV(vertices[i]);
      }
      for (i = 0;
      i < this.m_vertexCount; ++i) {
         var i1 = parseInt(i);
         var i2 = parseInt(i + 1 < this.m_vertexCount ? i + 1 : 0);
         var edge = b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
         b2Settings.b2Assert(edge.LengthSquared() > Number.MIN_VALUE);
         this.m_normals[i].SetV(b2Math.CrossVF(edge, 1.0));
         this.m_normals[i].Normalize();
      }
      this.m_centroid = b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
   }
   b2PolygonShape.AsVector = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsVector(vertices, vertexCount);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid.SetZero();
   }
   b2PolygonShape.AsBox = function (hx, hy) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsBox(hx, hy);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      if (center === undefined) center = null;
      if (angle === undefined) angle = 0.0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid = center;
      var xf = new b2Transform();
      xf.position = center;
      xf.R.Set(angle);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         this.m_vertices[i] = b2Math.MulX(xf, this.m_vertices[i]);
         this.m_normals[i] = b2Math.MulMV(xf.R, this.m_normals[i]);
      }
   }
   b2PolygonShape.AsOrientedBox = function (hx, hy, center, angle) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      if (center === undefined) center = null;
      if (angle === undefined) angle = 0.0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsOrientedBox(hx, hy, center, angle);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsEdge = function (v1, v2) {
      this.m_vertexCount = 2;
      this.Reserve(2);
      this.m_vertices[0].SetV(v1);
      this.m_vertices[1].SetV(v2);
      this.m_centroid.x = 0.5 * (v1.x + v2.x);
      this.m_centroid.y = 0.5 * (v1.y + v2.y);
      this.m_normals[0] = b2Math.CrossVF(b2Math.SubtractVV(v2, v1), 1.0);
      this.m_normals[0].Normalize();
      this.m_normals[1].x = (-this.m_normals[0].x);
      this.m_normals[1].y = (-this.m_normals[0].y);
   }
   b2PolygonShape.AsEdge = function (v1, v2) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsEdge(v1, v2);
      return polygonShape;
   }
   b2PolygonShape.prototype.TestPoint = function (xf, p) {
      var tVec;
      var tMat = xf.R;
      var tX = p.x - xf.position.x;
      var tY = p.y - xf.position.y;
      var pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y);
      var pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = pLocalX - tVec.x;
         tY = pLocalY - tVec.y;
         tVec = this.m_normals[i];
         var dot = (tVec.x * tX + tVec.y * tY);
         if (dot > 0.0) {
            return false;
         }
      }
      return true;
   }
   b2PolygonShape.prototype.RayCast = function (output, input, transform) {
      var lower = 0.0;
      var upper = input.maxFraction;
      var tX = 0;
      var tY = 0;
      var tMat;
      var tVec;
      tX = input.p1.x - transform.position.x;
      tY = input.p1.y - transform.position.y;
      tMat = transform.R;
      var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
      var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      tX = input.p2.x - transform.position.x;
      tY = input.p2.y - transform.position.y;
      tMat = transform.R;
      var p2X = (tX * tMat.col1.x + tY * tMat.col1.y);
      var p2Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var index = parseInt((-1));
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = tVec.x - p1X;
         tY = tVec.y - p1Y;
         tVec = this.m_normals[i];
         var numerator = (tVec.x * tX + tVec.y * tY);
         var denominator = (tVec.x * dX + tVec.y * dY);
         if (denominator == 0.0) {
            if (numerator < 0.0) {
               return false;
            }
         }
         else {
            if (denominator < 0.0 && numerator < lower * denominator) {
               lower = numerator / denominator;
               index = i;
            }
            else if (denominator > 0.0 && numerator < upper * denominator) {
               upper = numerator / denominator;
            }
         }
         if (upper < lower - Number.MIN_VALUE) {
            return false;
         }
      }
      if (index >= 0) {
         output.fraction = lower;
         tMat = transform.R;
         tVec = this.m_normals[index];
         output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         return true;
      }
      return false;
   }
   b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
      var tMat = xf.R;
      var tVec = this.m_vertices[0];
      var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var upperX = lowerX;
      var upperY = lowerY;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         lowerX = lowerX < vX ? lowerX : vX;
         lowerY = lowerY < vY ? lowerY : vY;
         upperX = upperX > vX ? upperX : vX;
         upperY = upperY > vY ? upperY : vY;
      }
      aabb.lowerBound.x = lowerX - this.m_radius;
      aabb.lowerBound.y = lowerY - this.m_radius;
      aabb.upperBound.x = upperX + this.m_radius;
      aabb.upperBound.y = upperY + this.m_radius;
   }
   b2PolygonShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      if (this.m_vertexCount == 2) {
         massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
         massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
         massData.mass = 0.0;
         massData.I = 0.0;
         return;
      }
      var centerX = 0.0;
      var centerY = 0.0;
      var area = 0.0;
      var I = 0.0;
      var p1X = 0.0;
      var p1Y = 0.0;
      var k_inv3 = 1.0 / 3.0;
      for (var i = 0; i < this.m_vertexCount; ++i) {
         var p2 = this.m_vertices[i];
         var p3 = i + 1 < this.m_vertexCount ? this.m_vertices[parseInt(i + 1)] : this.m_vertices[0];
         var e1X = p2.x - p1X;
         var e1Y = p2.y - p1Y;
         var e2X = p3.x - p1X;
         var e2Y = p3.y - p1Y;
         var D = e1X * e2Y - e1Y * e2X;
         var triangleArea = 0.5 * D;area += triangleArea;
         centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
         centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
         var px = p1X;
         var py = p1Y;
         var ex1 = e1X;
         var ey1 = e1Y;
         var ex2 = e2X;
         var ey2 = e2Y;
         var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
         var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;I += D * (intx2 + inty2);
      }
      massData.mass = density * area;
      centerX *= 1.0 / area;
      centerY *= 1.0 / area;
      massData.center.Set(centerX, centerY);
      massData.I = density * I;
   }
   b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var normalL = b2Math.MulTMV(xf.R, normal);
      var offsetL = offset - b2Math.Dot(normal, xf.position);
      var depths = new Vector_a2j_Number();
      var diveCount = 0;
      var intoIndex = parseInt((-1));
      var outoIndex = parseInt((-1));
      var lastSubmerged = false;
      var i = 0;
      for (i = 0;
      i < this.m_vertexCount; ++i) {
         depths[i] = b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
         var isSubmerged = depths[i] < (-Number.MIN_VALUE);
         if (i > 0) {
            if (isSubmerged) {
               if (!lastSubmerged) {
                  intoIndex = i - 1;
                  diveCount++;
               }
            }
            else {
               if (lastSubmerged) {
                  outoIndex = i - 1;
                  diveCount++;
               }
            }
         }
         lastSubmerged = isSubmerged;
      }
      switch (diveCount) {
      case 0:
         if (lastSubmerged) {
            var md = new b2MassData();
            this.ComputeMass(md, 1);
            c.SetV(b2Math.MulX(xf, md.center));
            return md.mass;
         }
         else {
            return 0;
         }
         break;
      case 1:
         if (intoIndex == (-1)) {
            intoIndex = this.m_vertexCount - 1;
         }
         else {
            outoIndex = this.m_vertexCount - 1;
         }
         break;
      }
      var intoIndex2 = parseInt((intoIndex + 1) % this.m_vertexCount);
      var outoIndex2 = parseInt((outoIndex + 1) % this.m_vertexCount);
      var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
      var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
      var intoVec = new b2Vec2(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
      var outoVec = new b2Vec2(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
      var area = 0;
      var center = new b2Vec2();
      var p2 = this.m_vertices[intoIndex2];
      var p3;
      i = intoIndex2;
      while (i != outoIndex2) {
         i = (i + 1) % this.m_vertexCount;
         if (i == outoIndex2) p3 = outoVec;
         else p3 = this.m_vertices[i];
         var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
         area += triangleArea;
         center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
         center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
         p2 = p3;
      }
      center.Multiply(1 / area);
      c.SetV(b2Math.MulX(xf, center));
      return area;
   }
   b2PolygonShape.prototype.GetVertexCount = function () {
      return this.m_vertexCount;
   }
   b2PolygonShape.prototype.GetVertices = function () {
      return this.m_vertices;
   }
   b2PolygonShape.prototype.GetNormals = function () {
      return this.m_normals;
   }
   b2PolygonShape.prototype.GetSupport = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   }
   b2PolygonShape.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   }
   b2PolygonShape.prototype.Validate = function () {
      return false;
   }
   b2PolygonShape.prototype.b2PolygonShape = function () {
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_polygonShape;
      this.m_centroid = new b2Vec2();
      this.m_vertices = new Vector();
      this.m_normals = new Vector();
   }
   b2PolygonShape.prototype.Reserve = function (count) {
      if (count === undefined) count = 0;
      for (var i = parseInt(this.m_vertices.length); i < count; i++) {
         this.m_vertices[i] = new b2Vec2();
         this.m_normals[i] = new b2Vec2();
      }
   }
   b2PolygonShape.ComputeCentroid = function (vs, count) {
      if (count === undefined) count = 0;
      var c = new b2Vec2();
      var area = 0.0;
      var p1X = 0.0;
      var p1Y = 0.0;
      var inv3 = 1.0 / 3.0;
      for (var i = 0; i < count; ++i) {
         var p2 = vs[i];
         var p3 = i + 1 < count ? vs[parseInt(i + 1)] : vs[0];
         var e1X = p2.x - p1X;
         var e1Y = p2.y - p1Y;
         var e2X = p3.x - p1X;
         var e2Y = p3.y - p1Y;
         var D = (e1X * e2Y - e1Y * e2X);
         var triangleArea = 0.5 * D;area += triangleArea;
         c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
         c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
      }
      c.x *= 1.0 / area;
      c.y *= 1.0 / area;
      return c;
   }
   b2PolygonShape.ComputeOBB = function (obb, vs, count) {
      if (count === undefined) count = 0;
      var i = 0;
      var p = new Vector(count + 1);
      for (i = 0;
      i < count; ++i) {
         p[i] = vs[i];
      }
      p[count] = p[0];
      var minArea = Number.MAX_VALUE;
      for (i = 1;
      i <= count; ++i) {
         var root = p[parseInt(i - 1)];
         var uxX = p[i].x - root.x;
         var uxY = p[i].y - root.y;
         var length = Math.sqrt(uxX * uxX + uxY * uxY);
         uxX /= length;
         uxY /= length;
         var uyX = (-uxY);
         var uyY = uxX;
         var lowerX = Number.MAX_VALUE;
         var lowerY = Number.MAX_VALUE;
         var upperX = (-Number.MAX_VALUE);
         var upperY = (-Number.MAX_VALUE);
         for (var j = 0; j < count; ++j) {
            var dX = p[j].x - root.x;
            var dY = p[j].y - root.y;
            var rX = (uxX * dX + uxY * dY);
            var rY = (uyX * dX + uyY * dY);
            if (rX < lowerX) lowerX = rX;
            if (rY < lowerY) lowerY = rY;
            if (rX > upperX) upperX = rX;
            if (rY > upperY) upperY = rY;
         }
         var area = (upperX - lowerX) * (upperY - lowerY);
         if (area < 0.95 * minArea) {
            minArea = area;
            obb.R.col1.x = uxX;
            obb.R.col1.y = uxY;
            obb.R.col2.x = uyX;
            obb.R.col2.y = uyY;
            var centerX = 0.5 * (lowerX + upperX);
            var centerY = 0.5 * (lowerY + upperY);
            var tMat = obb.R;
            obb.center.x = root.x + (tMat.col1.x * centerX + tMat.col2.x * centerY);
            obb.center.y = root.y + (tMat.col1.y * centerX + tMat.col2.y * centerY);
            obb.extents.x = 0.5 * (upperX - lowerX);
            obb.extents.y = 0.5 * (upperY - lowerY);
         }
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.Shapes.b2PolygonShape.s_mat = new b2Mat22();
   });
   b2Shape.b2Shape = function () {};
   b2Shape.prototype.Copy = function () {
      return null;
   }
   b2Shape.prototype.Set = function (other) {
      this.m_radius = other.m_radius;
   }
   b2Shape.prototype.GetType = function () {
      return this.m_type;
   }
   b2Shape.prototype.TestPoint = function (xf, p) {
      return false;
   }
   b2Shape.prototype.RayCast = function (output, input, transform) {
      return false;
   }
   b2Shape.prototype.ComputeAABB = function (aabb, xf) {}
   b2Shape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
   }
   b2Shape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      return 0;
   }
   b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
      var input = new b2DistanceInput();
      input.proxyA = new b2DistanceProxy();
      input.proxyA.Set(shape1);
      input.proxyB = new b2DistanceProxy();
      input.proxyB.Set(shape2);
      input.transformA = transform1;
      input.transformB = transform2;
      input.useRadii = true;
      var simplexCache = new b2SimplexCache();
      simplexCache.count = 0;
      var output = new b2DistanceOutput();
      b2Distance.Distance(output, simplexCache, input);
      return output.distance < 10.0 * Number.MIN_VALUE;
   }
   b2Shape.prototype.b2Shape = function () {
      this.m_type = b2Shape.e_unknownShape;
      this.m_radius = b2Settings.b2_linearSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.Shapes.b2Shape.e_unknownShape = parseInt((-1));
      Box2D.Collision.Shapes.b2Shape.e_circleShape = 0;
      Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1;
      Box2D.Collision.Shapes.b2Shape.e_edgeShape = 2;
      Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3;
      Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;
      Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;
      Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = parseInt((-1));
   });
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3;

   b2Color.b2Color = function () {
      this._r = 0;
      this._g = 0;
      this._b = 0;
   };
   b2Color.prototype.b2Color = function (rr, gg, bb) {
      if (rr === undefined) rr = 0;
      if (gg === undefined) gg = 0;
      if (bb === undefined) bb = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
   }
   b2Color.prototype.Set = function (rr, gg, bb) {
      if (rr === undefined) rr = 0;
      if (gg === undefined) gg = 0;
      if (bb === undefined) bb = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
   }
   Object.defineProperty(b2Color.prototype, 'r', {
      enumerable: false,
      configurable: true,
      set: function (rr) {
         if (rr === undefined) rr = 0;
         this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'g', {
      enumerable: false,
      configurable: true,
      set: function (gg) {
         if (gg === undefined) gg = 0;
         this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'b', {
      enumerable: false,
      configurable: true,
      set: function (bb) {
         if (bb === undefined) bb = 0;
         this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'color', {
      enumerable: false,
      configurable: true,
      get: function () {
         return (this._r << 16) | (this._g << 8) | (this._b);
      }
   });
   b2Settings.b2Settings = function () {};
   b2Settings.b2MixFriction = function (friction1, friction2) {
      if (friction1 === undefined) friction1 = 0;
      if (friction2 === undefined) friction2 = 0;
      return Math.sqrt(friction1 * friction2);
   }
   b2Settings.b2MixRestitution = function (restitution1, restitution2) {
      if (restitution1 === undefined) restitution1 = 0;
      if (restitution2 === undefined) restitution2 = 0;
      return restitution1 > restitution2 ? restitution1 : restitution2;
   }
   b2Settings.b2Assert = function (a) {
      if (!a) {
         throw "Assertion Failed";
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Common.b2Settings.VERSION = "2.1alpha";
      Box2D.Common.b2Settings.USHRT_MAX = 0x0000ffff;
      Box2D.Common.b2Settings.b2_pi = Math.PI;
      Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
      Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
      Box2D.Common.b2Settings.b2_aabbMultiplier = 2.0;
      Box2D.Common.b2Settings.b2_polygonRadius = 2.0 * b2Settings.b2_linearSlop;
      Box2D.Common.b2Settings.b2_linearSlop = 0.005;
      Box2D.Common.b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_toiSlop = 8.0 * b2Settings.b2_linearSlop;
      Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32;
      Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32;
      Box2D.Common.b2Settings.b2_velocityThreshold = 1.0;
      Box2D.Common.b2Settings.b2_maxLinearCorrection = 0.2;
      Box2D.Common.b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_maxTranslation = 2.0;
      Box2D.Common.b2Settings.b2_maxTranslationSquared = b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
      Box2D.Common.b2Settings.b2_maxRotation = 0.5 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_maxRotationSquared = b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
      Box2D.Common.b2Settings.b2_contactBaumgarte = 0.2;
      Box2D.Common.b2Settings.b2_timeToSleep = 0.5;
      Box2D.Common.b2Settings.b2_linearSleepTolerance = 0.01;
      Box2D.Common.b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * b2Settings.b2_pi;
   });
})();
(function () {
   var b2AABB = Box2D.Collision.b2AABB,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3;

   b2Mat22.b2Mat22 = function () {
      this.col1 = new b2Vec2();
      this.col2 = new b2Vec2();
   };
   b2Mat22.prototype.b2Mat22 = function () {
      this.SetIdentity();
   }
   b2Mat22.FromAngle = function (angle) {
      if (angle === undefined) angle = 0;
      var mat = new b2Mat22();
      mat.Set(angle);
      return mat;
   }
   b2Mat22.FromVV = function (c1, c2) {
      var mat = new b2Mat22();
      mat.SetVV(c1, c2);
      return mat;
   }
   b2Mat22.prototype.Set = function (angle) {
      if (angle === undefined) angle = 0;
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      this.col1.x = c;
      this.col2.x = (-s);
      this.col1.y = s;
      this.col2.y = c;
   }
   b2Mat22.prototype.SetVV = function (c1, c2) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
   }
   b2Mat22.prototype.Copy = function () {
      var mat = new b2Mat22();
      mat.SetM(this);
      return mat;
   }
   b2Mat22.prototype.SetM = function (m) {
      this.col1.SetV(m.col1);
      this.col2.SetV(m.col2);
   }
   b2Mat22.prototype.AddM = function (m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col2.x += m.col2.x;
      this.col2.y += m.col2.y;
   }
   b2Mat22.prototype.SetIdentity = function () {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 1.0;
   }
   b2Mat22.prototype.SetZero = function () {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 0.0;
   }
   b2Mat22.prototype.GetAngle = function () {
      return Math.atan2(this.col1.y, this.col1.x);
   }
   b2Mat22.prototype.GetInverse = function (out) {
      var a = this.col1.x;
      var b = this.col2.x;
      var c = this.col1.y;
      var d = this.col2.y;
      var det = a * d - b * c;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.col1.x = det * d;
      out.col2.x = (-det * b);
      out.col1.y = (-det * c);
      out.col2.y = det * a;
      return out;
   }
   b2Mat22.prototype.Solve = function (out, bX, bY) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      var a11 = this.col1.x;
      var a12 = this.col2.x;
      var a21 = this.col1.y;
      var a22 = this.col2.y;
      var det = a11 * a22 - a12 * a21;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
   }
   b2Mat22.prototype.Abs = function () {
      this.col1.Abs();
      this.col2.Abs();
   }
   b2Mat33.b2Mat33 = function () {
      this.col1 = new b2Vec3();
      this.col2 = new b2Vec3();
      this.col3 = new b2Vec3();
   };
   b2Mat33.prototype.b2Mat33 = function (c1, c2, c3) {
      if (c1 === undefined) c1 = null;
      if (c2 === undefined) c2 = null;
      if (c3 === undefined) c3 = null;
      if (!c1 && !c2 && !c3) {
         this.col1.SetZero();
         this.col2.SetZero();
         this.col3.SetZero();
      }
      else {
         this.col1.SetV(c1);
         this.col2.SetV(c2);
         this.col3.SetV(c3);
      }
   }
   b2Mat33.prototype.SetVVV = function (c1, c2, c3) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
      this.col3.SetV(c3);
   }
   b2Mat33.prototype.Copy = function () {
      return new b2Mat33(this.col1, this.col2, this.col3);
   }
   b2Mat33.prototype.SetM = function (m) {
      this.col1.SetV(m.col1);
      this.col2.SetV(m.col2);
      this.col3.SetV(m.col3);
   }
   b2Mat33.prototype.AddM = function (m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col1.z += m.col1.z;
      this.col2.x += m.col2.x;
      this.col2.y += m.col2.y;
      this.col2.z += m.col2.z;
      this.col3.x += m.col3.x;
      this.col3.y += m.col3.y;
      this.col3.z += m.col3.z;
   }
   b2Mat33.prototype.SetIdentity = function () {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col3.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 1.0;
      this.col3.y = 0.0;
      this.col1.z = 0.0;
      this.col2.z = 0.0;
      this.col3.z = 1.0;
   }
   b2Mat33.prototype.SetZero = function () {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col3.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 0.0;
      this.col3.y = 0.0;
      this.col1.z = 0.0;
      this.col2.z = 0.0;
      this.col3.z = 0.0;
   }
   b2Mat33.prototype.Solve22 = function (out, bX, bY) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      var a11 = this.col1.x;
      var a12 = this.col2.x;
      var a21 = this.col1.y;
      var a22 = this.col2.y;
      var det = a11 * a22 - a12 * a21;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
   }
   b2Mat33.prototype.Solve33 = function (out, bX, bY, bZ) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      if (bZ === undefined) bZ = 0;
      var a11 = this.col1.x;
      var a21 = this.col1.y;
      var a31 = this.col1.z;
      var a12 = this.col2.x;
      var a22 = this.col2.y;
      var a32 = this.col2.z;
      var a13 = this.col3.x;
      var a23 = this.col3.y;
      var a33 = this.col3.z;
      var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
      out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
      out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
      return out;
   }
   b2Math.b2Math = function () {};
   b2Math.IsValid = function (x) {
      if (x === undefined) x = 0;
      return isFinite(x);
   }
   b2Math.Dot = function (a, b) {
      return a.x * b.x + a.y * b.y;
   }
   b2Math.CrossVV = function (a, b) {
      return a.x * b.y - a.y * b.x;
   }
   b2Math.CrossVF = function (a, s) {
      if (s === undefined) s = 0;
      var v = new b2Vec2(s * a.y, (-s * a.x));
      return v;
   }
   b2Math.CrossFV = function (s, a) {
      if (s === undefined) s = 0;
      var v = new b2Vec2((-s * a.y), s * a.x);
      return v;
   }
   b2Math.MulMV = function (A, v) {
      var u = new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
      return u;
   }
   b2Math.MulTMV = function (A, v) {
      var u = new b2Vec2(b2Math.Dot(v, A.col1), b2Math.Dot(v, A.col2));
      return u;
   }
   b2Math.MulX = function (T, v) {
      var a = b2Math.MulMV(T.R, v);
      a.x += T.position.x;
      a.y += T.position.y;
      return a;
   }
   b2Math.MulXT = function (T, v) {
      var a = b2Math.SubtractVV(v, T.position);
      var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
      a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
      a.x = tX;
      return a;
   }
   b2Math.AddVV = function (a, b) {
      var v = new b2Vec2(a.x + b.x, a.y + b.y);
      return v;
   }
   b2Math.SubtractVV = function (a, b) {
      var v = new b2Vec2(a.x - b.x, a.y - b.y);
      return v;
   }
   b2Math.Distance = function (a, b) {
      var cX = a.x - b.x;
      var cY = a.y - b.y;
      return Math.sqrt(cX * cX + cY * cY);
   }
   b2Math.DistanceSquared = function (a, b) {
      var cX = a.x - b.x;
      var cY = a.y - b.y;
      return (cX * cX + cY * cY);
   }
   b2Math.MulFV = function (s, a) {
      if (s === undefined) s = 0;
      var v = new b2Vec2(s * a.x, s * a.y);
      return v;
   }
   b2Math.AddMM = function (A, B) {
      var C = b2Mat22.FromVV(b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
      return C;
   }
   b2Math.MulMM = function (A, B) {
      var C = b2Mat22.FromVV(b2Math.MulMV(A, B.col1), b2Math.MulMV(A, B.col2));
      return C;
   }
   b2Math.MulTMM = function (A, B) {
      var c1 = new b2Vec2(b2Math.Dot(A.col1, B.col1), b2Math.Dot(A.col2, B.col1));
      var c2 = new b2Vec2(b2Math.Dot(A.col1, B.col2), b2Math.Dot(A.col2, B.col2));
      var C = b2Mat22.FromVV(c1, c2);
      return C;
   }
   b2Math.Abs = function (a) {
      if (a === undefined) a = 0;
      return a > 0.0 ? a : (-a);
   }
   b2Math.AbsV = function (a) {
      var b = new b2Vec2(b2Math.Abs(a.x), b2Math.Abs(a.y));
      return b;
   }
   b2Math.AbsM = function (A) {
      var B = b2Mat22.FromVV(b2Math.AbsV(A.col1), b2Math.AbsV(A.col2));
      return B;
   }
   b2Math.Min = function (a, b) {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      return a < b ? a : b;
   }
   b2Math.MinV = function (a, b) {
      var c = new b2Vec2(b2Math.Min(a.x, b.x), b2Math.Min(a.y, b.y));
      return c;
   }
   b2Math.Max = function (a, b) {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      return a > b ? a : b;
   }
   b2Math.MaxV = function (a, b) {
      var c = new b2Vec2(b2Math.Max(a.x, b.x), b2Math.Max(a.y, b.y));
      return c;
   }
   b2Math.Clamp = function (a, low, high) {
      if (a === undefined) a = 0;
      if (low === undefined) low = 0;
      if (high === undefined) high = 0;
      return a < low ? low : a > high ? high : a;
   }
   b2Math.ClampV = function (a, low, high) {
      return b2Math.MaxV(low, b2Math.MinV(a, high));
   }
   b2Math.Swap = function (a, b) {
      var tmp = a[0];
      a[0] = b[0];
      b[0] = tmp;
   }
   b2Math.Random = function () {
      return Math.random() * 2 - 1;
   }
   b2Math.RandomRange = function (lo, hi) {
      if (lo === undefined) lo = 0;
      if (hi === undefined) hi = 0;
      var r = Math.random();
      r = (hi - lo) * r + lo;
      return r;
   }
   b2Math.NextPowerOfTwo = function (x) {
      if (x === undefined) x = 0;
      x |= (x >> 1) & 0x7FFFFFFF;
      x |= (x >> 2) & 0x3FFFFFFF;
      x |= (x >> 4) & 0x0FFFFFFF;
      x |= (x >> 8) & 0x00FFFFFF;
      x |= (x >> 16) & 0x0000FFFF;
      return x + 1;
   }
   b2Math.IsPowerOfTwo = function (x) {
      if (x === undefined) x = 0;
      var result = x > 0 && (x & (x - 1)) == 0;
      return result;
   }
   Box2D.postDefs.push(function () {
      Box2D.Common.Math.b2Math.b2Vec2_zero = new b2Vec2(0.0, 0.0);
      Box2D.Common.Math.b2Math.b2Mat22_identity = b2Mat22.FromVV(new b2Vec2(1.0, 0.0), new b2Vec2(0.0, 1.0));
      Box2D.Common.Math.b2Math.b2Transform_identity = new b2Transform(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
   });
   b2Sweep.b2Sweep = function () {
      this.localCenter = new b2Vec2();
      this.c0 = new b2Vec2;
      this.c = new b2Vec2();
   };
   b2Sweep.prototype.Set = function (other) {
      this.localCenter.SetV(other.localCenter);
      this.c0.SetV(other.c0);
      this.c.SetV(other.c);
      this.a0 = other.a0;
      this.a = other.a;
      this.t0 = other.t0;
   }
   b2Sweep.prototype.Copy = function () {
      var copy = new b2Sweep();
      copy.localCenter.SetV(this.localCenter);
      copy.c0.SetV(this.c0);
      copy.c.SetV(this.c);
      copy.a0 = this.a0;
      copy.a = this.a;
      copy.t0 = this.t0;
      return copy;
   }
   b2Sweep.prototype.GetTransform = function (xf, alpha) {
      if (alpha === undefined) alpha = 0;
      xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
      xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
      var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
      xf.R.Set(angle);
      var tMat = xf.R;
      xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
      xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
   }
   b2Sweep.prototype.Advance = function (t) {
      if (t === undefined) t = 0;
      if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
         var alpha = (t - this.t0) / (1.0 - this.t0);
         this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
         this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
         this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
         this.t0 = t;
      }
   }
   b2Transform.b2Transform = function () {
      this.position = new b2Vec2;
      this.R = new b2Mat22();
   };
   b2Transform.prototype.b2Transform = function (pos, r) {
      if (pos === undefined) pos = null;
      if (r === undefined) r = null;
      if (pos) {
         this.position.SetV(pos);
         this.R.SetM(r);
      }
   }
   b2Transform.prototype.Initialize = function (pos, r) {
      this.position.SetV(pos);
      this.R.SetM(r);
   }
   b2Transform.prototype.SetIdentity = function () {
      this.position.SetZero();
      this.R.SetIdentity();
   }
   b2Transform.prototype.Set = function (x) {
      this.position.SetV(x.position);
      this.R.SetM(x.R);
   }
   b2Transform.prototype.GetAngle = function () {
      return Math.atan2(this.R.col1.y, this.R.col1.x);
   }
   b2Vec2.b2Vec2 = function () {};
   b2Vec2.prototype.b2Vec2 = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      this.x = x_;
      this.y = y_;
   }
   b2Vec2.prototype.SetZero = function () {
      this.x = 0.0;
      this.y = 0.0;
   }
   b2Vec2.prototype.Set = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      this.x = x_;
      this.y = y_;
   }
   b2Vec2.prototype.SetV = function (v) {
      this.x = v.x;
      this.y = v.y;
   }
   b2Vec2.prototype.GetNegative = function () {
      return new b2Vec2((-this.x), (-this.y));
   }
   b2Vec2.prototype.NegativeSelf = function () {
      this.x = (-this.x);
      this.y = (-this.y);
   }
   b2Vec2.Make = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      return new b2Vec2(x_, y_);
   }
   b2Vec2.prototype.Copy = function () {
      return new b2Vec2(this.x, this.y);
   }
   b2Vec2.prototype.Add = function (v) {
      this.x += v.x;
      this.y += v.y;
   }
   b2Vec2.prototype.Subtract = function (v) {
      this.x -= v.x;
      this.y -= v.y;
   }
   b2Vec2.prototype.Multiply = function (a) {
      if (a === undefined) a = 0;
      this.x *= a;
      this.y *= a;
   }
   b2Vec2.prototype.MulM = function (A) {
      var tX = this.x;
      this.x = A.col1.x * tX + A.col2.x * this.y;
      this.y = A.col1.y * tX + A.col2.y * this.y;
   }
   b2Vec2.prototype.MulTM = function (A) {
      var tX = b2Math.Dot(this, A.col1);
      this.y = b2Math.Dot(this, A.col2);
      this.x = tX;
   }
   b2Vec2.prototype.CrossVF = function (s) {
      if (s === undefined) s = 0;
      var tX = this.x;
      this.x = s * this.y;
      this.y = (-s * tX);
   }
   b2Vec2.prototype.CrossFV = function (s) {
      if (s === undefined) s = 0;
      var tX = this.x;
      this.x = (-s * this.y);
      this.y = s * tX;
   }
   b2Vec2.prototype.MinV = function (b) {
      this.x = this.x < b.x ? this.x : b.x;
      this.y = this.y < b.y ? this.y : b.y;
   }
   b2Vec2.prototype.MaxV = function (b) {
      this.x = this.x > b.x ? this.x : b.x;
      this.y = this.y > b.y ? this.y : b.y;
   }
   b2Vec2.prototype.Abs = function () {
      if (this.x < 0) this.x = (-this.x);
      if (this.y < 0) this.y = (-this.y);
   }
   b2Vec2.prototype.Length = function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
   }
   b2Vec2.prototype.LengthSquared = function () {
      return (this.x * this.x + this.y * this.y);
   }
   b2Vec2.prototype.Normalize = function () {
      var length = Math.sqrt(this.x * this.x + this.y * this.y);
      if (length < Number.MIN_VALUE) {
         return 0.0;
      }
      var invLength = 1.0 / length;
      this.x *= invLength;
      this.y *= invLength;
      return length;
   }
   b2Vec2.prototype.IsValid = function () {
      return b2Math.IsValid(this.x) && b2Math.IsValid(this.y);
   }
   b2Vec3.b2Vec3 = function () {};
   b2Vec3.prototype.b2Vec3 = function (x, y, z) {
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;
      if (z === undefined) z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
   }
   b2Vec3.prototype.SetZero = function () {
      this.x = this.y = this.z = 0.0;
   }
   b2Vec3.prototype.Set = function (x, y, z) {
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;
      if (z === undefined) z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
   }
   b2Vec3.prototype.SetV = function (v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
   }
   b2Vec3.prototype.GetNegative = function () {
      return new b2Vec3((-this.x), (-this.y), (-this.z));
   }
   b2Vec3.prototype.NegativeSelf = function () {
      this.x = (-this.x);
      this.y = (-this.y);
      this.z = (-this.z);
   }
   b2Vec3.prototype.Copy = function () {
      return new b2Vec3(this.x, this.y, this.z);
   }
   b2Vec3.prototype.Add = function (v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
   }
   b2Vec3.prototype.Subtract = function (v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
   }
   b2Vec3.prototype.Multiply = function (a) {
      if (a === undefined) a = 0;
      this.x *= a;
      this.y *= a;
      this.z *= a;
   }
})();
(function () {
   var b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
      b2Contact = Box2D.Dynamics.Contacts.b2Contact,
      b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
      b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
      b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
      b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
      b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
      b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
      b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
      b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
      b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
      b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
      b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
      b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
      b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
      b2Controller = Box2D.Dynamics.Controllers.b2Controller,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
      b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
      b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
      b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
      b2Joint = Box2D.Dynamics.Joints.b2Joint,
      b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
      b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
      b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
      b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
      b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
      b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
      b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
      b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
      b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
      b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
      b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

   b2Body.b2Body = function () {
      this.m_xf = new b2Transform();
      this.m_sweep = new b2Sweep();
      this.m_linearVelocity = new b2Vec2();
      this.m_force = new b2Vec2();
   };
   b2Body.prototype.connectEdges = function (s1, s2, angle1) {
      if (angle1 === undefined) angle1 = 0;
      var angle2 = Math.atan2(s2.GetDirectionVector().y, s2.GetDirectionVector().x);
      var coreOffset = Math.tan((angle2 - angle1) * 0.5);
      var core = b2Math.MulFV(coreOffset, s2.GetDirectionVector());
      core = b2Math.SubtractVV(core, s2.GetNormalVector());
      core = b2Math.MulFV(b2Settings.b2_toiSlop, core);
      core = b2Math.AddVV(core, s2.GetVertex1());
      var cornerDir = b2Math.AddVV(s1.GetDirectionVector(), s2.GetDirectionVector());
      cornerDir.Normalize();
      var convex = b2Math.Dot(s1.GetDirectionVector(), s2.GetNormalVector()) > 0.0;
      s1.SetNextEdge(s2, core, cornerDir, convex);
      s2.SetPrevEdge(s1, core, cornerDir, convex);
      return angle2;
   }
   b2Body.prototype.CreateFixture = function (def) {
      if (this.m_world.IsLocked() == true) {
         return null;
      }
      var fixture = new b2Fixture();
      fixture.Create(this, this.m_xf, def);
      if (this.m_flags & b2Body.e_activeFlag) {
         var broadPhase = this.m_world.m_contactManager.m_broadPhase;
         fixture.CreateProxy(broadPhase, this.m_xf);
      }
      fixture.m_next = this.m_fixtureList;
      this.m_fixtureList = fixture;
      ++this.m_fixtureCount;
      fixture.m_body = this;
      if (fixture.m_density > 0.0) {
         this.ResetMassData();
      }
      this.m_world.m_flags |= b2World.e_newFixture;
      return fixture;
   }
   b2Body.prototype.CreateFixture2 = function (shape, density) {
      if (density === undefined) density = 0.0;
      var def = new b2FixtureDef();
      def.shape = shape;
      def.density = density;
      return this.CreateFixture(def);
   }
   b2Body.prototype.DestroyFixture = function (fixture) {
      if (this.m_world.IsLocked() == true) {
         return;
      }
      var node = this.m_fixtureList;
      var ppF = null;
      var found = false;
      while (node != null) {
         if (node == fixture) {
            if (ppF) ppF.m_next = fixture.m_next;
            else this.m_fixtureList = fixture.m_next;
            found = true;
            break;
         }
         ppF = node;
         node = node.m_next;
      }
      var edge = this.m_contactList;
      while (edge) {
         var c = edge.contact;
         edge = edge.next;
         var fixtureA = c.GetFixtureA();
         var fixtureB = c.GetFixtureB();
         if (fixture == fixtureA || fixture == fixtureB) {
            this.m_world.m_contactManager.Destroy(c);
         }
      }
      if (this.m_flags & b2Body.e_activeFlag) {
         var broadPhase = this.m_world.m_contactManager.m_broadPhase;
         fixture.DestroyProxy(broadPhase);
      }
      else {}
      fixture.Destroy();
      fixture.m_body = null;
      fixture.m_next = null;
      --this.m_fixtureCount;
      this.ResetMassData();
   }
   b2Body.prototype.SetPositionAndAngle = function (position, angle) {
      if (angle === undefined) angle = 0;
      var f;
      if (this.m_world.IsLocked() == true) {
         return;
      }
      this.m_xf.R.Set(angle);
      this.m_xf.position.SetV(position);
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_sweep.c.x += this.m_xf.position.x;
      this.m_sweep.c.y += this.m_xf.position.y;
      this.m_sweep.c0.SetV(this.m_sweep.c);
      this.m_sweep.a0 = this.m_sweep.a = angle;
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList;
      f; f = f.m_next) {
         f.Synchronize(broadPhase, this.m_xf, this.m_xf);
      }
      this.m_world.m_contactManager.FindNewContacts();
   }
   b2Body.prototype.SetTransform = function (xf) {
      this.SetPositionAndAngle(xf.position, xf.GetAngle());
   }
   b2Body.prototype.GetTransform = function () {
      return this.m_xf;
   }
   b2Body.prototype.GetPosition = function () {
      return this.m_xf.position;
   }
   b2Body.prototype.SetPosition = function (position) {
      this.SetPositionAndAngle(position, this.GetAngle());
   }
   b2Body.prototype.GetAngle = function () {
      return this.m_sweep.a;
   }
   b2Body.prototype.SetAngle = function (angle) {
      if (angle === undefined) angle = 0;
      this.SetPositionAndAngle(this.GetPosition(), angle);
   }
   b2Body.prototype.GetWorldCenter = function () {
      return this.m_sweep.c;
   }
   b2Body.prototype.GetLocalCenter = function () {
      return this.m_sweep.localCenter;
   }
   b2Body.prototype.SetLinearVelocity = function (v) {
      if (this.m_type == b2Body.b2_staticBody) {
         return;
      }
      this.m_linearVelocity.SetV(v);
   }
   b2Body.prototype.GetLinearVelocity = function () {
      return this.m_linearVelocity;
   }
   b2Body.prototype.SetAngularVelocity = function (omega) {
      if (omega === undefined) omega = 0;
      if (this.m_type == b2Body.b2_staticBody) {
         return;
      }
      this.m_angularVelocity = omega;
   }
   b2Body.prototype.GetAngularVelocity = function () {
      return this.m_angularVelocity;
   }
   b2Body.prototype.GetDefinition = function () {
      var bd = new b2BodyDef();
      bd.type = this.GetType();
      bd.allowSleep = (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
      bd.angle = this.GetAngle();
      bd.angularDamping = this.m_angularDamping;
      bd.angularVelocity = this.m_angularVelocity;
      bd.fixedRotation = (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
      bd.bullet = (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
      bd.awake = (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
      bd.linearDamping = this.m_linearDamping;
      bd.linearVelocity.SetV(this.GetLinearVelocity());
      bd.position = this.GetPosition();
      bd.userData = this.GetUserData();
      return bd;
   }
   b2Body.prototype.ApplyForce = function (force, point) {
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_force.x += force.x;
      this.m_force.y += force.y;
      this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
   }
   b2Body.prototype.ApplyTorque = function (torque) {
      if (torque === undefined) torque = 0;
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_torque += torque;
   }
   b2Body.prototype.ApplyImpulse = function (impulse, point) {
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_linearVelocity.x += this.m_invMass * impulse.x;
      this.m_linearVelocity.y += this.m_invMass * impulse.y;
      this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
   }
   b2Body.prototype.Split = function (callback) {
      var linearVelocity = this.GetLinearVelocity().Copy();
      var angularVelocity = this.GetAngularVelocity();
      var center = this.GetWorldCenter();
      var body1 = this;
      var body2 = this.m_world.CreateBody(this.GetDefinition());
      var prev;
      for (var f = body1.m_fixtureList; f;) {
         if (callback(f)) {
            var next = f.m_next;
            if (prev) {
               prev.m_next = next;
            }
            else {
               body1.m_fixtureList = next;
            }
            body1.m_fixtureCount--;
            f.m_next = body2.m_fixtureList;
            body2.m_fixtureList = f;
            body2.m_fixtureCount++;
            f.m_body = body2;
            f = next;
         }
         else {
            prev = f;
            f = f.m_next;
         }
      }
      body1.ResetMassData();
      body2.ResetMassData();
      var center1 = body1.GetWorldCenter();
      var center2 = body2.GetWorldCenter();
      var velocity1 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center1, center)));
      var velocity2 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center2, center)));
      body1.SetLinearVelocity(velocity1);
      body2.SetLinearVelocity(velocity2);
      body1.SetAngularVelocity(angularVelocity);
      body2.SetAngularVelocity(angularVelocity);
      body1.SynchronizeFixtures();
      body2.SynchronizeFixtures();
      return body2;
   }
   b2Body.prototype.Merge = function (other) {
      var f;
      for (f = other.m_fixtureList;
      f;) {
         var next = f.m_next;
         other.m_fixtureCount--;
         f.m_next = this.m_fixtureList;
         this.m_fixtureList = f;
         this.m_fixtureCount++;
         f.m_body = body2;
         f = next;
      }
      body1.m_fixtureCount = 0;
      var body1 = this;
      var body2 = other;
      var center1 = body1.GetWorldCenter();
      var center2 = body2.GetWorldCenter();
      var velocity1 = body1.GetLinearVelocity().Copy();
      var velocity2 = body2.GetLinearVelocity().Copy();
      var angular1 = body1.GetAngularVelocity();
      var angular = body2.GetAngularVelocity();
      body1.ResetMassData();
      this.SynchronizeFixtures();
   }
   b2Body.prototype.GetMass = function () {
      return this.m_mass;
   }
   b2Body.prototype.GetInertia = function () {
      return this.m_I;
   }
   b2Body.prototype.GetMassData = function (data) {
      data.mass = this.m_mass;
      data.I = this.m_I;
      data.center.SetV(this.m_sweep.localCenter);
   }
   b2Body.prototype.SetMassData = function (massData) {
      b2Settings.b2Assert(this.m_world.IsLocked() == false);
      if (this.m_world.IsLocked() == true) {
         return;
      }
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      this.m_invMass = 0.0;
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_mass = massData.mass;
      if (this.m_mass <= 0.0) {
         this.m_mass = 1.0;
      }
      this.m_invMass = 1.0 / this.m_mass;
      if (massData.I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
         this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
         this.m_invI = 1.0 / this.m_I;
      }
      var oldCenter = this.m_sweep.c.Copy();
      this.m_sweep.localCenter.SetV(massData.center);
      this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
      this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
   }
   b2Body.prototype.ResetMassData = function () {
      this.m_mass = 0.0;
      this.m_invMass = 0.0;
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_sweep.localCenter.SetZero();
      if (this.m_type == b2Body.b2_staticBody || this.m_type == b2Body.b2_kinematicBody) {
         return;
      }
      var center = b2Vec2.Make(0, 0);
      for (var f = this.m_fixtureList; f; f = f.m_next) {
         if (f.m_density == 0.0) {
            continue;
         }
         var massData = f.GetMassData();
         this.m_mass += massData.mass;
         center.x += massData.center.x * massData.mass;
         center.y += massData.center.y * massData.mass;
         this.m_I += massData.I;
      }
      if (this.m_mass > 0.0) {
         this.m_invMass = 1.0 / this.m_mass;
         center.x *= this.m_invMass;
         center.y *= this.m_invMass;
      }
      else {
         this.m_mass = 1.0;
         this.m_invMass = 1.0;
      }
      if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
         this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
         this.m_I *= this.m_inertiaScale;
         b2Settings.b2Assert(this.m_I > 0);
         this.m_invI = 1.0 / this.m_I;
      }
      else {
         this.m_I = 0.0;
         this.m_invI = 0.0;
      }
      var oldCenter = this.m_sweep.c.Copy();
      this.m_sweep.localCenter.SetV(center);
      this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
      this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
   }
   b2Body.prototype.GetWorldPoint = function (localPoint) {
      var A = this.m_xf.R;
      var u = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
      u.x += this.m_xf.position.x;
      u.y += this.m_xf.position.y;
      return u;
   }
   b2Body.prototype.GetWorldVector = function (localVector) {
      return b2Math.MulMV(this.m_xf.R, localVector);
   }
   b2Body.prototype.GetLocalPoint = function (worldPoint) {
      return b2Math.MulXT(this.m_xf, worldPoint);
   }
   b2Body.prototype.GetLocalVector = function (worldVector) {
      return b2Math.MulTMV(this.m_xf.R, worldVector);
   }
   b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint) {
      return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
   }
   b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint) {
      var A = this.m_xf.R;
      var worldPoint = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
      worldPoint.x += this.m_xf.position.x;
      worldPoint.y += this.m_xf.position.y;
      return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
   }
   b2Body.prototype.GetLinearDamping = function () {
      return this.m_linearDamping;
   }
   b2Body.prototype.SetLinearDamping = function (linearDamping) {
      if (linearDamping === undefined) linearDamping = 0;
      this.m_linearDamping = linearDamping;
   }
   b2Body.prototype.GetAngularDamping = function () {
      return this.m_angularDamping;
   }
   b2Body.prototype.SetAngularDamping = function (angularDamping) {
      if (angularDamping === undefined) angularDamping = 0;
      this.m_angularDamping = angularDamping;
   }
   b2Body.prototype.SetType = function (type) {
      if (type === undefined) type = 0;
      if (this.m_type == type) {
         return;
      }
      this.m_type = type;
      this.ResetMassData();
      if (this.m_type == b2Body.b2_staticBody) {
         this.m_linearVelocity.SetZero();
         this.m_angularVelocity = 0.0;
      }
      this.SetAwake(true);
      this.m_force.SetZero();
      this.m_torque = 0.0;
      for (var ce = this.m_contactList; ce; ce = ce.next) {
         ce.contact.FlagForFiltering();
      }
   }
   b2Body.prototype.GetType = function () {
      return this.m_type;
   }
   b2Body.prototype.SetBullet = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_bulletFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_bulletFlag;
      }
   }
   b2Body.prototype.IsBullet = function () {
      return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
   }
   b2Body.prototype.SetSleepingAllowed = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_allowSleepFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_allowSleepFlag;
         this.SetAwake(true);
      }
   }
   b2Body.prototype.SetAwake = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_awakeFlag;
         this.m_sleepTime = 0.0;
      }
      else {
         this.m_flags &= ~b2Body.e_awakeFlag;
         this.m_sleepTime = 0.0;
         this.m_linearVelocity.SetZero();
         this.m_angularVelocity = 0.0;
         this.m_force.SetZero();
         this.m_torque = 0.0;
      }
   }
   b2Body.prototype.IsAwake = function () {
      return (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
   }
   b2Body.prototype.SetFixedRotation = function (fixed) {
      if (fixed) {
         this.m_flags |= b2Body.e_fixedRotationFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_fixedRotationFlag;
      }
      this.ResetMassData();
   }
   b2Body.prototype.IsFixedRotation = function () {
      return (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
   }
   b2Body.prototype.SetActive = function (flag) {
      if (flag == this.IsActive()) {
         return;
      }
      var broadPhase;
      var f;
      if (flag) {
         this.m_flags |= b2Body.e_activeFlag;
         broadPhase = this.m_world.m_contactManager.m_broadPhase;
         for (f = this.m_fixtureList;
         f; f = f.m_next) {
            f.CreateProxy(broadPhase, this.m_xf);
         }
      }
      else {
         this.m_flags &= ~b2Body.e_activeFlag;
         broadPhase = this.m_world.m_contactManager.m_broadPhase;
         for (f = this.m_fixtureList;
         f; f = f.m_next) {
            f.DestroyProxy(broadPhase);
         }
         var ce = this.m_contactList;
         while (ce) {
            var ce0 = ce;
            ce = ce.next;
            this.m_world.m_contactManager.Destroy(ce0.contact);
         }
         this.m_contactList = null;
      }
   }
   b2Body.prototype.IsActive = function () {
      return (this.m_flags & b2Body.e_activeFlag) == b2Body.e_activeFlag;
   }
   b2Body.prototype.IsSleepingAllowed = function () {
      return (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
   }
   b2Body.prototype.GetFixtureList = function () {
      return this.m_fixtureList;
   }
   b2Body.prototype.GetJointList = function () {
      return this.m_jointList;
   }
   b2Body.prototype.GetControllerList = function () {
      return this.m_controllerList;
   }
   b2Body.prototype.GetContactList = function () {
      return this.m_contactList;
   }
   b2Body.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Body.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Body.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Body.prototype.GetWorld = function () {
      return this.m_world;
   }
   b2Body.prototype.b2Body = function (bd, world) {
      this.m_flags = 0;
      if (bd.bullet) {
         this.m_flags |= b2Body.e_bulletFlag;
      }
      if (bd.fixedRotation) {
         this.m_flags |= b2Body.e_fixedRotationFlag;
      }
      if (bd.allowSleep) {
         this.m_flags |= b2Body.e_allowSleepFlag;
      }
      if (bd.awake) {
         this.m_flags |= b2Body.e_awakeFlag;
      }
      if (bd.active) {
         this.m_flags |= b2Body.e_activeFlag;
      }
      this.m_world = world;
      this.m_xf.position.SetV(bd.position);
      this.m_xf.R.Set(bd.angle);
      this.m_sweep.localCenter.SetZero();
      this.m_sweep.t0 = 1.0;
      this.m_sweep.a0 = this.m_sweep.a = bd.angle;
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_sweep.c.x += this.m_xf.position.x;
      this.m_sweep.c.y += this.m_xf.position.y;
      this.m_sweep.c0.SetV(this.m_sweep.c);
      this.m_jointList = null;
      this.m_controllerList = null;
      this.m_contactList = null;
      this.m_controllerCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_linearVelocity.SetV(bd.linearVelocity);
      this.m_angularVelocity = bd.angularVelocity;
      this.m_linearDamping = bd.linearDamping;
      this.m_angularDamping = bd.angularDamping;
      this.m_force.Set(0.0, 0.0);
      this.m_torque = 0.0;
      this.m_sleepTime = 0.0;
      this.m_type = bd.type;
      if (this.m_type == b2Body.b2_dynamicBody) {
         this.m_mass = 1.0;
         this.m_invMass = 1.0;
      }
      else {
         this.m_mass = 0.0;
         this.m_invMass = 0.0;
      }
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_inertiaScale = bd.inertiaScale;
      this.m_userData = bd.userData;
      this.m_fixtureList = null;
      this.m_fixtureCount = 0;
   }
   b2Body.prototype.SynchronizeFixtures = function () {
      var xf1 = b2Body.s_xf1;
      xf1.R.Set(this.m_sweep.a0);
      var tMat = xf1.R;
      var tVec = this.m_sweep.localCenter;
      xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var f;
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList;
      f; f = f.m_next) {
         f.Synchronize(broadPhase, xf1, this.m_xf);
      }
   }
   b2Body.prototype.SynchronizeTransform = function () {
      this.m_xf.R.Set(this.m_sweep.a);
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
   }
   b2Body.prototype.ShouldCollide = function (other) {
      if (this.m_type != b2Body.b2_dynamicBody && other.m_type != b2Body.b2_dynamicBody) {
         return false;
      }
      for (var jn = this.m_jointList; jn; jn = jn.next) {
         if (jn.other == other) if (jn.joint.m_collideConnected == false) {
            return false;
         }
      }
      return true;
   }
   b2Body.prototype.Advance = function (t) {
      if (t === undefined) t = 0;
      this.m_sweep.Advance(t);
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_sweep.a = this.m_sweep.a0;
      this.SynchronizeTransform();
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2Body.s_xf1 = new b2Transform();
      Box2D.Dynamics.b2Body.e_islandFlag = 0x0001;
      Box2D.Dynamics.b2Body.e_awakeFlag = 0x0002;
      Box2D.Dynamics.b2Body.e_allowSleepFlag = 0x0004;
      Box2D.Dynamics.b2Body.e_bulletFlag = 0x0008;
      Box2D.Dynamics.b2Body.e_fixedRotationFlag = 0x0010;
      Box2D.Dynamics.b2Body.e_activeFlag = 0x0020;
      Box2D.Dynamics.b2Body.b2_staticBody = 0;
      Box2D.Dynamics.b2Body.b2_kinematicBody = 1;
      Box2D.Dynamics.b2Body.b2_dynamicBody = 2;
   });
   b2BodyDef.b2BodyDef = function () {
      this.position = new b2Vec2();
      this.linearVelocity = new b2Vec2();
   };
   b2BodyDef.prototype.b2BodyDef = function () {
      this.userData = null;
      this.position.Set(0.0, 0.0);
      this.angle = 0.0;
      this.linearVelocity.Set(0, 0);
      this.angularVelocity = 0.0;
      this.linearDamping = 0.0;
      this.angularDamping = 0.0;
      this.allowSleep = true;
      this.awake = true;
      this.fixedRotation = false;
      this.bullet = false;
      this.type = b2Body.b2_staticBody;
      this.active = true;
      this.inertiaScale = 1.0;
   }
   b2ContactFilter.b2ContactFilter = function () {};
   b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
      var filter1 = fixtureA.GetFilterData();
      var filter2 = fixtureB.GetFilterData();
      if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
         return filter1.groupIndex > 0;
      }
      var collide = (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
      return collide;
   }
   b2ContactFilter.prototype.RayCollide = function (userData, fixture) {
      if (!userData) return true;
      return this.ShouldCollide((userData instanceof b2Fixture ? userData : null), fixture);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
   });
   b2ContactImpulse.b2ContactImpulse = function () {
      this.normalImpulses = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
      this.tangentImpulses = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
   };
   b2ContactListener.b2ContactListener = function () {};
   b2ContactListener.prototype.BeginContact = function (contact) {}
   b2ContactListener.prototype.EndContact = function (contact) {}
   b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {}
   b2ContactListener.prototype.PostSolve = function (contact, impulse) {}
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactListener.b2_defaultListener = new b2ContactListener();
   });
   b2ContactManager.b2ContactManager = function () {};
   b2ContactManager.prototype.b2ContactManager = function () {
      this.m_world = null;
      this.m_contactCount = 0;
      this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
      this.m_contactListener = b2ContactListener.b2_defaultListener;
      this.m_contactFactory = new b2ContactFactory(this.m_allocator);
      this.m_broadPhase = new b2DynamicTreeBroadPhase();
   }
   b2ContactManager.prototype.AddPair = function (proxyUserDataA, proxyUserDataB) {
      var fixtureA = (proxyUserDataA instanceof b2Fixture ? proxyUserDataA : null);
      var fixtureB = (proxyUserDataB instanceof b2Fixture ? proxyUserDataB : null);
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA == bodyB) return;
      var edge = bodyB.GetContactList();
      while (edge) {
         if (edge.other == bodyA) {
            var fA = edge.contact.GetFixtureA();
            var fB = edge.contact.GetFixtureB();
            if (fA == fixtureA && fB == fixtureB) return;
            if (fA == fixtureB && fB == fixtureA) return;
         }
         edge = edge.next;
      }
      if (bodyB.ShouldCollide(bodyA) == false) {
         return;
      }
      if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
         return;
      }
      var c = this.m_contactFactory.Create(fixtureA, fixtureB);
      fixtureA = c.GetFixtureA();
      fixtureB = c.GetFixtureB();
      bodyA = fixtureA.m_body;
      bodyB = fixtureB.m_body;
      c.m_prev = null;
      c.m_next = this.m_world.m_contactList;
      if (this.m_world.m_contactList != null) {
         this.m_world.m_contactList.m_prev = c;
      }
      this.m_world.m_contactList = c;
      c.m_nodeA.contact = c;
      c.m_nodeA.other = bodyB;
      c.m_nodeA.prev = null;
      c.m_nodeA.next = bodyA.m_contactList;
      if (bodyA.m_contactList != null) {
         bodyA.m_contactList.prev = c.m_nodeA;
      }
      bodyA.m_contactList = c.m_nodeA;
      c.m_nodeB.contact = c;
      c.m_nodeB.other = bodyA;
      c.m_nodeB.prev = null;
      c.m_nodeB.next = bodyB.m_contactList;
      if (bodyB.m_contactList != null) {
         bodyB.m_contactList.prev = c.m_nodeB;
      }
      bodyB.m_contactList = c.m_nodeB;
      ++this.m_world.m_contactCount;
      return;
   }
   b2ContactManager.prototype.FindNewContacts = function () {
      this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair));
   }
   b2ContactManager.prototype.Destroy = function (c) {
      var fixtureA = c.GetFixtureA();
      var fixtureB = c.GetFixtureB();
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (c.IsTouching()) {
         this.m_contactListener.EndContact(c);
      }
      if (c.m_prev) {
         c.m_prev.m_next = c.m_next;
      }
      if (c.m_next) {
         c.m_next.m_prev = c.m_prev;
      }
      if (c == this.m_world.m_contactList) {
         this.m_world.m_contactList = c.m_next;
      }
      if (c.m_nodeA.prev) {
         c.m_nodeA.prev.next = c.m_nodeA.next;
      }
      if (c.m_nodeA.next) {
         c.m_nodeA.next.prev = c.m_nodeA.prev;
      }
      if (c.m_nodeA == bodyA.m_contactList) {
         bodyA.m_contactList = c.m_nodeA.next;
      }
      if (c.m_nodeB.prev) {
         c.m_nodeB.prev.next = c.m_nodeB.next;
      }
      if (c.m_nodeB.next) {
         c.m_nodeB.next.prev = c.m_nodeB.prev;
      }
      if (c.m_nodeB == bodyB.m_contactList) {
         bodyB.m_contactList = c.m_nodeB.next;
      }
      this.m_contactFactory.Destroy(c);
      --this.m_contactCount;
   }
   b2ContactManager.prototype.Collide = function () {
      var c = this.m_world.m_contactList;
      while (c) {
         var fixtureA = c.GetFixtureA();
         var fixtureB = c.GetFixtureB();
         var bodyA = fixtureA.GetBody();
         var bodyB = fixtureB.GetBody();
         if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
            c = c.GetNext();
            continue;
         }
         if (c.m_flags & b2Contact.e_filterFlag) {
            if (bodyB.ShouldCollide(bodyA) == false) {
               var cNuke = c;
               c = cNuke.GetNext();
               this.Destroy(cNuke);
               continue;
            }
            if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
               cNuke = c;
               c = cNuke.GetNext();
               this.Destroy(cNuke);
               continue;
            }
            c.m_flags &= ~b2Contact.e_filterFlag;
         }
         var proxyA = fixtureA.m_proxy;
         var proxyB = fixtureB.m_proxy;
         var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
         if (overlap == false) {
            cNuke = c;
            c = cNuke.GetNext();
            this.Destroy(cNuke);
            continue;
         }
         c.Update(this.m_contactListener);
         c = c.GetNext();
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactManager.s_evalCP = new b2ContactPoint();
   });
   b2DebugDraw.b2DebugDraw = function () {};
   b2DebugDraw.prototype.b2DebugDraw = function () {}
   b2DebugDraw.prototype.SetFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.GetFlags = function () {}
   b2DebugDraw.prototype.AppendFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.ClearFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.SetSprite = function (sprite) {}
   b2DebugDraw.prototype.GetSprite = function () {}
   b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
      if (drawScale === undefined) drawScale = 0;
   }
   b2DebugDraw.prototype.GetDrawScale = function () {}
   b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
      if (lineThickness === undefined) lineThickness = 0;
   }
   b2DebugDraw.prototype.GetLineThickness = function () {}
   b2DebugDraw.prototype.SetAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
   }
   b2DebugDraw.prototype.GetAlpha = function () {}
   b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
   }
   b2DebugDraw.prototype.GetFillAlpha = function () {}
   b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
      if (xformScale === undefined) xformScale = 0;
   }
   b2DebugDraw.prototype.GetXFormScale = function () {}
   b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
      if (vertexCount === undefined) vertexCount = 0;
   }
   b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
      if (vertexCount === undefined) vertexCount = 0;
   }
   b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
      if (radius === undefined) radius = 0;
   }
   b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
      if (radius === undefined) radius = 0;
   }
   b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {}
   b2DebugDraw.prototype.DrawTransform = function (xf) {}
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2DebugDraw.e_shapeBit = 0x0001;
      Box2D.Dynamics.b2DebugDraw.e_jointBit = 0x0002;
      Box2D.Dynamics.b2DebugDraw.e_aabbBit = 0x0004;
      Box2D.Dynamics.b2DebugDraw.e_pairBit = 0x0008;
      Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit = 0x0010;
      Box2D.Dynamics.b2DebugDraw.e_controllerBit = 0x0020;
   });
   b2DestructionListener.b2DestructionListener = function () {};
   b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {}
   b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {}
   b2FilterData.b2FilterData = function () {
      this.categoryBits = 0x0001;
      this.maskBits = 0xFFFF;
      this.groupIndex = 0;
   };
   b2FilterData.prototype.Copy = function () {
      var copy = new b2FilterData();
      copy.categoryBits = this.categoryBits;
      copy.maskBits = this.maskBits;
      copy.groupIndex = this.groupIndex;
      return copy;
   }
   b2Fixture.b2Fixture = function () {
      this.m_filter = new b2FilterData();
   };
   b2Fixture.prototype.GetType = function () {
      return this.m_shape.GetType();
   }
   b2Fixture.prototype.GetShape = function () {
      return this.m_shape;
   }
   b2Fixture.prototype.SetSensor = function (sensor) {
      if (this.m_isSensor == sensor) return;
      this.m_isSensor = sensor;
      if (this.m_body == null) return;
      var edge = this.m_body.GetContactList();
      while (edge) {
         var contact = edge.contact;
         var fixtureA = contact.GetFixtureA();
         var fixtureB = contact.GetFixtureB();
         if (fixtureA == this || fixtureB == this) contact.SetSensor(fixtureA.IsSensor() || fixtureB.IsSensor());
         edge = edge.next;
      }
   }
   b2Fixture.prototype.IsSensor = function () {
      return this.m_isSensor;
   }
   b2Fixture.prototype.SetFilterData = function (filter) {
      this.m_filter = filter.Copy();
      if (this.m_body) return;
      var edge = this.m_body.GetContactList();
      while (edge) {
         var contact = edge.contact;
         var fixtureA = contact.GetFixtureA();
         var fixtureB = contact.GetFixtureB();
         if (fixtureA == this || fixtureB == this) contact.FlagForFiltering();
         edge = edge.next;
      }
   }
   b2Fixture.prototype.GetFilterData = function () {
      return this.m_filter.Copy();
   }
   b2Fixture.prototype.GetBody = function () {
      return this.m_body;
   }
   b2Fixture.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Fixture.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Fixture.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Fixture.prototype.TestPoint = function (p) {
      return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
   }
   b2Fixture.prototype.RayCast = function (output, input) {
      return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
   }
   b2Fixture.prototype.GetMassData = function (massData) {
      if (massData === undefined) massData = null;
      if (massData == null) {
         massData = new b2MassData();
      }
      this.m_shape.ComputeMass(massData, this.m_density);
      return massData;
   }
   b2Fixture.prototype.SetDensity = function (density) {
      if (density === undefined) density = 0;
      this.m_density = density;
   }
   b2Fixture.prototype.GetDensity = function () {
      return this.m_density;
   }
   b2Fixture.prototype.GetFriction = function () {
      return this.m_friction;
   }
   b2Fixture.prototype.SetFriction = function (friction) {
      if (friction === undefined) friction = 0;
      this.m_friction = friction;
   }
   b2Fixture.prototype.GetRestitution = function () {
      return this.m_restitution;
   }
   b2Fixture.prototype.SetRestitution = function (restitution) {
      if (restitution === undefined) restitution = 0;
      this.m_restitution = restitution;
   }
   b2Fixture.prototype.GetAABB = function () {
      return this.m_aabb;
   }
   b2Fixture.prototype.b2Fixture = function () {
      this.m_aabb = new b2AABB();
      this.m_userData = null;
      this.m_body = null;
      this.m_next = null;
      this.m_shape = null;
      this.m_density = 0.0;
      this.m_friction = 0.0;
      this.m_restitution = 0.0;
   }
   b2Fixture.prototype.Create = function (body, xf, def) {
      this.m_userData = def.userData;
      this.m_friction = def.friction;
      this.m_restitution = def.restitution;
      this.m_body = body;
      this.m_next = null;
      this.m_filter = def.filter.Copy();
      this.m_isSensor = def.isSensor;
      this.m_shape = def.shape.Copy();
      this.m_density = def.density;
   }
   b2Fixture.prototype.Destroy = function () {
      this.m_shape = null;
   }
   b2Fixture.prototype.CreateProxy = function (broadPhase, xf) {
      this.m_shape.ComputeAABB(this.m_aabb, xf);
      this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
   }
   b2Fixture.prototype.DestroyProxy = function (broadPhase) {
      if (this.m_proxy == null) {
         return;
      }
      broadPhase.DestroyProxy(this.m_proxy);
      this.m_proxy = null;
   }
   b2Fixture.prototype.Synchronize = function (broadPhase, transform1, transform2) {
      if (!this.m_proxy) return;
      var aabb1 = new b2AABB();
      var aabb2 = new b2AABB();
      this.m_shape.ComputeAABB(aabb1, transform1);
      this.m_shape.ComputeAABB(aabb2, transform2);
      this.m_aabb.Combine(aabb1, aabb2);
      var displacement = b2Math.SubtractVV(transform2.position, transform1.position);
      broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
   }
   b2FixtureDef.b2FixtureDef = function () {
      this.filter = new b2FilterData();
   };
   b2FixtureDef.prototype.b2FixtureDef = function () {
      this.shape = null;
      this.userData = null;
      this.friction = 0.2;
      this.restitution = 0.0;
      this.density = 0.0;
      this.filter.categoryBits = 0x0001;
      this.filter.maskBits = 0xFFFF;
      this.filter.groupIndex = 0;
      this.isSensor = false;
   }
   b2Island.b2Island = function () {};
   b2Island.prototype.b2Island = function () {
      this.m_bodies = new Vector();
      this.m_contacts = new Vector();
      this.m_joints = new Vector();
   }
   b2Island.prototype.Initialize = function (bodyCapacity, contactCapacity, jointCapacity, allocator, listener, contactSolver) {
      if (bodyCapacity === undefined) bodyCapacity = 0;
      if (contactCapacity === undefined) contactCapacity = 0;
      if (jointCapacity === undefined) jointCapacity = 0;
      var i = 0;
      this.m_bodyCapacity = bodyCapacity;
      this.m_contactCapacity = contactCapacity;
      this.m_jointCapacity = jointCapacity;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_allocator = allocator;
      this.m_listener = listener;
      this.m_contactSolver = contactSolver;
      for (i = this.m_bodies.length;
      i < bodyCapacity; i++)
      this.m_bodies[i] = null;
      for (i = this.m_contacts.length;
      i < contactCapacity; i++)
      this.m_contacts[i] = null;
      for (i = this.m_joints.length;
      i < jointCapacity; i++)
      this.m_joints[i] = null;
   }
   b2Island.prototype.Clear = function () {
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
   }
   b2Island.prototype.Solve = function (step, gravity, allowSleep) {
      var i = 0;
      var j = 0;
      var b;
      var joint;
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         b = this.m_bodies[i];
         if (b.GetType() != b2Body.b2_dynamicBody) continue;
         b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
         b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
         b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
         b.m_linearVelocity.Multiply(b2Math.Clamp(1.0 - step.dt * b.m_linearDamping, 0.0, 1.0));
         b.m_angularVelocity *= b2Math.Clamp(1.0 - step.dt * b.m_angularDamping, 0.0, 1.0);
      }
      this.m_contactSolver.Initialize(step, this.m_contacts, this.m_contactCount, this.m_allocator);
      var contactSolver = this.m_contactSolver;
      contactSolver.InitVelocityConstraints(step);
      for (i = 0;
      i < this.m_jointCount; ++i) {
         joint = this.m_joints[i];
         joint.InitVelocityConstraints(step);
      }
      for (i = 0;
      i < step.velocityIterations; ++i) {
         for (j = 0;
         j < this.m_jointCount; ++j) {
            joint = this.m_joints[j];
            joint.SolveVelocityConstraints(step);
         }
         contactSolver.SolveVelocityConstraints();
      }
      for (i = 0;
      i < this.m_jointCount; ++i) {
         joint = this.m_joints[i];
         joint.FinalizeVelocityConstraints();
      }
      contactSolver.FinalizeVelocityConstraints();
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         b = this.m_bodies[i];
         if (b.GetType() == b2Body.b2_staticBody) continue;
         var translationX = step.dt * b.m_linearVelocity.x;
         var translationY = step.dt * b.m_linearVelocity.y;
         if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
            b.m_linearVelocity.Normalize();
            b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * step.inv_dt;
            b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * step.inv_dt;
         }
         var rotation = step.dt * b.m_angularVelocity;
         if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
            if (b.m_angularVelocity < 0.0) {
               b.m_angularVelocity = (-b2Settings.b2_maxRotation * step.inv_dt);
            }
            else {
               b.m_angularVelocity = b2Settings.b2_maxRotation * step.inv_dt;
            }
         }
         b.m_sweep.c0.SetV(b.m_sweep.c);
         b.m_sweep.a0 = b.m_sweep.a;
         b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
         b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
         b.m_sweep.a += step.dt * b.m_angularVelocity;
         b.SynchronizeTransform();
      }
      for (i = 0;
      i < step.positionIterations; ++i) {
         var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
         var jointsOkay = true;
         for (j = 0;
         j < this.m_jointCount; ++j) {
            joint = this.m_joints[j];
            var jointOkay = joint.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
            jointsOkay = jointsOkay && jointOkay;
         }
         if (contactsOkay && jointsOkay) {
            break;
         }
      }
      this.Report(contactSolver.m_constraints);
      if (allowSleep) {
         var minSleepTime = Number.MAX_VALUE;
         var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
         var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
         for (i = 0;
         i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.GetType() == b2Body.b2_staticBody) {
               continue;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0) {
               b.m_sleepTime = 0.0;
               minSleepTime = 0.0;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
               b.m_sleepTime = 0.0;
               minSleepTime = 0.0;
            }
            else {
               b.m_sleepTime += step.dt;
               minSleepTime = b2Math.Min(minSleepTime, b.m_sleepTime);
            }
         }
         if (minSleepTime >= b2Settings.b2_timeToSleep) {
            for (i = 0;
            i < this.m_bodyCount; ++i) {
               b = this.m_bodies[i];
               b.SetAwake(false);
            }
         }
      }
   }
   b2Island.prototype.SolveTOI = function (subStep) {
      var i = 0;
      var j = 0;
      this.m_contactSolver.Initialize(subStep, this.m_contacts, this.m_contactCount, this.m_allocator);
      var contactSolver = this.m_contactSolver;
      for (i = 0;
      i < this.m_jointCount; ++i) {
         this.m_joints[i].InitVelocityConstraints(subStep);
      }
      for (i = 0;
      i < subStep.velocityIterations; ++i) {
         contactSolver.SolveVelocityConstraints();
         for (j = 0;
         j < this.m_jointCount; ++j) {
            this.m_joints[j].SolveVelocityConstraints(subStep);
         }
      }
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         var b = this.m_bodies[i];
         if (b.GetType() == b2Body.b2_staticBody) continue;
         var translationX = subStep.dt * b.m_linearVelocity.x;
         var translationY = subStep.dt * b.m_linearVelocity.y;
         if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
            b.m_linearVelocity.Normalize();
            b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * subStep.inv_dt;
            b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * subStep.inv_dt;
         }
         var rotation = subStep.dt * b.m_angularVelocity;
         if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
            if (b.m_angularVelocity < 0.0) {
               b.m_angularVelocity = (-b2Settings.b2_maxRotation * subStep.inv_dt);
            }
            else {
               b.m_angularVelocity = b2Settings.b2_maxRotation * subStep.inv_dt;
            }
         }
         b.m_sweep.c0.SetV(b.m_sweep.c);
         b.m_sweep.a0 = b.m_sweep.a;
         b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
         b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
         b.m_sweep.a += subStep.dt * b.m_angularVelocity;
         b.SynchronizeTransform();
      }
      var k_toiBaumgarte = 0.75;
      for (i = 0;
      i < subStep.positionIterations; ++i) {
         var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte);
         var jointsOkay = true;
         for (j = 0;
         j < this.m_jointCount; ++j) {
            var jointOkay = this.m_joints[j].SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
            jointsOkay = jointsOkay && jointOkay;
         }
         if (contactsOkay && jointsOkay) {
            break;
         }
      }
      this.Report(contactSolver.m_constraints);
   }
   b2Island.prototype.Report = function (constraints) {
      if (this.m_listener == null) {
         return;
      }
      for (var i = 0; i < this.m_contactCount; ++i) {
         var c = this.m_contacts[i];
         var cc = constraints[i];
         for (var j = 0; j < cc.pointCount; ++j) {
            b2Island.s_impulse.normalImpulses[j] = cc.points[j].normalImpulse;
            b2Island.s_impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
         }
         this.m_listener.PostSolve(c, b2Island.s_impulse);
      }
   }
   b2Island.prototype.AddBody = function (body) {
      body.m_islandIndex = this.m_bodyCount;
      this.m_bodies[this.m_bodyCount++] = body;
   }
   b2Island.prototype.AddContact = function (contact) {
      this.m_contacts[this.m_contactCount++] = contact;
   }
   b2Island.prototype.AddJoint = function (joint) {
      this.m_joints[this.m_jointCount++] = joint;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2Island.s_impulse = new b2ContactImpulse();
   });
   b2TimeStep.b2TimeStep = function () {};
   b2TimeStep.prototype.Set = function (step) {
      this.dt = step.dt;
      this.inv_dt = step.inv_dt;
      this.positionIterations = step.positionIterations;
      this.velocityIterations = step.velocityIterations;
      this.warmStarting = step.warmStarting;
   }
   b2World.b2World = function () {
      this.s_stack = new Vector();
      this.m_contactManager = new b2ContactManager();
      this.m_contactSolver = new b2ContactSolver();
      this.m_island = new b2Island();
   };
   b2World.prototype.b2World = function (gravity, doSleep) {
      this.m_destructionListener = null;
      this.m_debugDraw = null;
      this.m_bodyList = null;
      this.m_contactList = null;
      this.m_jointList = null;
      this.m_controllerList = null;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_controllerCount = 0;
      b2World.m_warmStarting = true;
      b2World.m_continuousPhysics = true;
      this.m_allowSleep = doSleep;
      this.m_gravity = gravity;
      this.m_inv_dt0 = 0.0;
      this.m_contactManager.m_world = this;
      var bd = new b2BodyDef();
      this.m_groundBody = this.CreateBody(bd);
   }
   b2World.prototype.SetDestructionListener = function (listener) {
      this.m_destructionListener = listener;
   }
   b2World.prototype.SetContactFilter = function (filter) {
      this.m_contactManager.m_contactFilter = filter;
   }
   b2World.prototype.SetContactListener = function (listener) {
      this.m_contactManager.m_contactListener = listener;
   }
   b2World.prototype.SetDebugDraw = function (debugDraw) {
      this.m_debugDraw = debugDraw;
   }
   b2World.prototype.SetBroadPhase = function (broadPhase) {
      var oldBroadPhase = this.m_contactManager.m_broadPhase;
      this.m_contactManager.m_broadPhase = broadPhase;
      for (var b = this.m_bodyList; b; b = b.m_next) {
         for (var f = b.m_fixtureList; f; f = f.m_next) {
            f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
         }
      }
   }
   b2World.prototype.Validate = function () {
      this.m_contactManager.m_broadPhase.Validate();
   }
   b2World.prototype.GetProxyCount = function () {
      return this.m_contactManager.m_broadPhase.GetProxyCount();
   }
   b2World.prototype.CreateBody = function (def) {
      if (this.IsLocked() == true) {
         return null;
      }
      var b = new b2Body(def, this);
      b.m_prev = null;
      b.m_next = this.m_bodyList;
      if (this.m_bodyList) {
         this.m_bodyList.m_prev = b;
      }
      this.m_bodyList = b;
      ++this.m_bodyCount;
      return b;
   }
   b2World.prototype.DestroyBody = function (b) {
      if (this.IsLocked() == true) {
         return;
      }
      var jn = b.m_jointList;
      while (jn) {
         var jn0 = jn;
         jn = jn.next;
         if (this.m_destructionListener) {
            this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
         }
         this.DestroyJoint(jn0.joint);
      }
      var coe = b.m_controllerList;
      while (coe) {
         var coe0 = coe;
         coe = coe.nextController;
         coe0.controller.RemoveBody(b);
      }
      var ce = b.m_contactList;
      while (ce) {
         var ce0 = ce;
         ce = ce.next;
         this.m_contactManager.Destroy(ce0.contact);
      }
      b.m_contactList = null;
      var f = b.m_fixtureList;
      while (f) {
         var f0 = f;
         f = f.m_next;
         if (this.m_destructionListener) {
            this.m_destructionListener.SayGoodbyeFixture(f0);
         }
         f0.DestroyProxy(this.m_contactManager.m_broadPhase);
         f0.Destroy();
      }
      b.m_fixtureList = null;
      b.m_fixtureCount = 0;
      if (b.m_prev) {
         b.m_prev.m_next = b.m_next;
      }
      if (b.m_next) {
         b.m_next.m_prev = b.m_prev;
      }
      if (b == this.m_bodyList) {
         this.m_bodyList = b.m_next;
      }--this.m_bodyCount;
   }
   b2World.prototype.CreateJoint = function (def) {
      var j = b2Joint.Create(def, null);
      j.m_prev = null;
      j.m_next = this.m_jointList;
      if (this.m_jointList) {
         this.m_jointList.m_prev = j;
      }
      this.m_jointList = j;
      ++this.m_jointCount;
      j.m_edgeA.joint = j;
      j.m_edgeA.other = j.m_bodyB;
      j.m_edgeA.prev = null;
      j.m_edgeA.next = j.m_bodyA.m_jointList;
      if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
      j.m_bodyA.m_jointList = j.m_edgeA;
      j.m_edgeB.joint = j;
      j.m_edgeB.other = j.m_bodyA;
      j.m_edgeB.prev = null;
      j.m_edgeB.next = j.m_bodyB.m_jointList;
      if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
      j.m_bodyB.m_jointList = j.m_edgeB;
      var bodyA = def.bodyA;
      var bodyB = def.bodyB;
      if (def.collideConnected == false) {
         var edge = bodyB.GetContactList();
         while (edge) {
            if (edge.other == bodyA) {
               edge.contact.FlagForFiltering();
            }
            edge = edge.next;
         }
      }
      return j;
   }
   b2World.prototype.DestroyJoint = function (j) {
      var collideConnected = j.m_collideConnected;
      if (j.m_prev) {
         j.m_prev.m_next = j.m_next;
      }
      if (j.m_next) {
         j.m_next.m_prev = j.m_prev;
      }
      if (j == this.m_jointList) {
         this.m_jointList = j.m_next;
      }
      var bodyA = j.m_bodyA;
      var bodyB = j.m_bodyB;
      bodyA.SetAwake(true);
      bodyB.SetAwake(true);
      if (j.m_edgeA.prev) {
         j.m_edgeA.prev.next = j.m_edgeA.next;
      }
      if (j.m_edgeA.next) {
         j.m_edgeA.next.prev = j.m_edgeA.prev;
      }
      if (j.m_edgeA == bodyA.m_jointList) {
         bodyA.m_jointList = j.m_edgeA.next;
      }
      j.m_edgeA.prev = null;
      j.m_edgeA.next = null;
      if (j.m_edgeB.prev) {
         j.m_edgeB.prev.next = j.m_edgeB.next;
      }
      if (j.m_edgeB.next) {
         j.m_edgeB.next.prev = j.m_edgeB.prev;
      }
      if (j.m_edgeB == bodyB.m_jointList) {
         bodyB.m_jointList = j.m_edgeB.next;
      }
      j.m_edgeB.prev = null;
      j.m_edgeB.next = null;
      b2Joint.Destroy(j, null);
      --this.m_jointCount;
      if (collideConnected == false) {
         var edge = bodyB.GetContactList();
         while (edge) {
            if (edge.other == bodyA) {
               edge.contact.FlagForFiltering();
            }
            edge = edge.next;
         }
      }
   }
   b2World.prototype.AddController = function (c) {
      c.m_next = this.m_controllerList;
      c.m_prev = null;
      this.m_controllerList = c;
      c.m_world = this;
      this.m_controllerCount++;
      return c;
   }
   b2World.prototype.RemoveController = function (c) {
      if (c.m_prev) c.m_prev.m_next = c.m_next;
      if (c.m_next) c.m_next.m_prev = c.m_prev;
      if (this.m_controllerList == c) this.m_controllerList = c.m_next;
      this.m_controllerCount--;
   }
   b2World.prototype.CreateController = function (controller) {
      if (controller.m_world != this) throw new Error("Controller can only be a member of one world");
      controller.m_next = this.m_controllerList;
      controller.m_prev = null;
      if (this.m_controllerList) this.m_controllerList.m_prev = controller;
      this.m_controllerList = controller;
      ++this.m_controllerCount;
      controller.m_world = this;
      return controller;
   }
   b2World.prototype.DestroyController = function (controller) {
      controller.Clear();
      if (controller.m_next) controller.m_next.m_prev = controller.m_prev;
      if (controller.m_prev) controller.m_prev.m_next = controller.m_next;
      if (controller == this.m_controllerList) this.m_controllerList = controller.m_next;
      --this.m_controllerCount;
   }
   b2World.prototype.SetWarmStarting = function (flag) {
      b2World.m_warmStarting = flag;
   }
   b2World.prototype.SetContinuousPhysics = function (flag) {
      b2World.m_continuousPhysics = flag;
   }
   b2World.prototype.GetBodyCount = function () {
      return this.m_bodyCount;
   }
   b2World.prototype.GetJointCount = function () {
      return this.m_jointCount;
   }
   b2World.prototype.GetContactCount = function () {
      return this.m_contactCount;
   }
   b2World.prototype.SetGravity = function (gravity) {
      this.m_gravity = gravity;
   }
   b2World.prototype.GetGravity = function () {
      return this.m_gravity;
   }
   b2World.prototype.GetGroundBody = function () {
      return this.m_groundBody;
   }
   b2World.prototype.Step = function (dt, velocityIterations, positionIterations) {
      if (dt === undefined) dt = 0;
      if (velocityIterations === undefined) velocityIterations = 0;
      if (positionIterations === undefined) positionIterations = 0;
      if (this.m_flags & b2World.e_newFixture) {
         this.m_contactManager.FindNewContacts();
         this.m_flags &= ~b2World.e_newFixture;
      }
      this.m_flags |= b2World.e_locked;
      var step = b2World.s_timestep2;
      step.dt = dt;
      step.velocityIterations = velocityIterations;
      step.positionIterations = positionIterations;
      if (dt > 0.0) {
         step.inv_dt = 1.0 / dt;
      }
      else {
         step.inv_dt = 0.0;
      }
      step.dtRatio = this.m_inv_dt0 * dt;
      step.warmStarting = b2World.m_warmStarting;
      this.m_contactManager.Collide();
      if (step.dt > 0.0) {
         this.Solve(step);
      }
      if (b2World.m_continuousPhysics && step.dt > 0.0) {
         this.SolveTOI(step);
      }
      if (step.dt > 0.0) {
         this.m_inv_dt0 = step.inv_dt;
      }
      this.m_flags &= ~b2World.e_locked;
   }
   b2World.prototype.ClearForces = function () {
      for (var body = this.m_bodyList; body; body = body.m_next) {
         body.m_force.SetZero();
         body.m_torque = 0.0;
      }
   }
   b2World.prototype.DrawDebugData = function () {
      if (this.m_debugDraw == null) {
         return;
      }
      this.m_debugDraw.m_sprite.graphics.clear();
      var flags = this.m_debugDraw.GetFlags();
      var i = 0;
      var b;
      var f;
      var s;
      var j;
      var bp;
      var invQ = new b2Vec2;
      var x1 = new b2Vec2;
      var x2 = new b2Vec2;
      var xf;
      var b1 = new b2AABB();
      var b2 = new b2AABB();
      var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
      var color = new b2Color(0, 0, 0);
      if (flags & b2DebugDraw.e_shapeBit) {
         for (b = this.m_bodyList;
         b; b = b.m_next) {
            xf = b.m_xf;
            for (f = b.GetFixtureList();
            f; f = f.m_next) {
               s = f.GetShape();
               if (b.IsActive() == false) {
                  color.Set(0.5, 0.5, 0.3);
                  this.DrawShape(s, xf, color);
               }
               else if (b.GetType() == b2Body.b2_staticBody) {
                  color.Set(0.5, 0.9, 0.5);
                  this.DrawShape(s, xf, color);
               }
               else if (b.GetType() == b2Body.b2_kinematicBody) {
                  color.Set(0.5, 0.5, 0.9);
                  this.DrawShape(s, xf, color);
               }
               else if (b.IsAwake() == false) {
                  color.Set(0.6, 0.6, 0.6);
                  this.DrawShape(s, xf, color);
               }
               else {
                  color.Set(0.9, 0.7, 0.7);
                  this.DrawShape(s, xf, color);
               }
            }
         }
      }
      if (flags & b2DebugDraw.e_jointBit) {
         for (j = this.m_jointList;
         j; j = j.m_next) {
            this.DrawJoint(j);
         }
      }
      if (flags & b2DebugDraw.e_controllerBit) {
         for (var c = this.m_controllerList; c; c = c.m_next) {
            c.Draw(this.m_debugDraw);
         }
      }
      if (flags & b2DebugDraw.e_pairBit) {
         color.Set(0.3, 0.9, 0.9);
         for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.GetNext()) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var cA = fixtureA.GetAABB().GetCenter();
            var cB = fixtureB.GetAABB().GetCenter();
            this.m_debugDraw.DrawSegment(cA, cB, color);
         }
      }
      if (flags & b2DebugDraw.e_aabbBit) {
         bp = this.m_contactManager.m_broadPhase;
         vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
         for (b = this.m_bodyList;
         b; b = b.GetNext()) {
            if (b.IsActive() == false) {
               continue;
            }
            for (f = b.GetFixtureList();
            f; f = f.GetNext()) {
               var aabb = bp.GetFatAABB(f.m_proxy);
               vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
               vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
               vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
               vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
               this.m_debugDraw.DrawPolygon(vs, 4, color);
            }
         }
      }
      if (flags & b2DebugDraw.e_centerOfMassBit) {
         for (b = this.m_bodyList;
         b; b = b.m_next) {
            xf = b2World.s_xf;
            xf.R = b.m_xf.R;
            xf.position = b.GetWorldCenter();
            this.m_debugDraw.DrawTransform(xf);
         }
      }
   }
   b2World.prototype.QueryAABB = function (callback, aabb) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         return callback(broadPhase.GetUserData(proxy));
      };
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.QueryShape = function (callback, shape, transform) {
      var __this = this;
      if (transform === undefined) transform = null;
      if (transform == null) {
         transform = new b2Transform();
         transform.SetIdentity();
      }
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
         if (b2Shape.TestOverlap(shape, transform, fixture.GetShape(), fixture.GetBody().GetTransform())) return callback(fixture);
         return true;
      };
      var aabb = new b2AABB();
      shape.ComputeAABB(aabb, transform);
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.QueryPoint = function (callback, p) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
         if (fixture.TestPoint(p)) return callback(fixture);
         return true;
      };
      var aabb = new b2AABB();
      aabb.lowerBound.Set(p.x - b2Settings.b2_linearSlop, p.y - b2Settings.b2_linearSlop);
      aabb.upperBound.Set(p.x + b2Settings.b2_linearSlop, p.y + b2Settings.b2_linearSlop);
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.RayCast = function (callback, point1, point2) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;
      var output = new b2RayCastOutput;

      function RayCastWrapper(input, proxy) {
         var userData = broadPhase.GetUserData(proxy);
         var fixture = (userData instanceof b2Fixture ? userData : null);
         var hit = fixture.RayCast(output, input);
         if (hit) {
            var fraction = output.fraction;
            var point = new b2Vec2((1.0 - fraction) * point1.x + fraction * point2.x, (1.0 - fraction) * point1.y + fraction * point2.y);
            return callback(fixture, point, output.normal, fraction);
         }
         return input.maxFraction;
      };
      var input = new b2RayCastInput(point1, point2);
      broadPhase.RayCast(RayCastWrapper, input);
   }
   b2World.prototype.RayCastOne = function (point1, point2) {
      var __this = this;
      var result;

      function RayCastOneWrapper(fixture, point, normal, fraction) {
         if (fraction === undefined) fraction = 0;
         result = fixture;
         return fraction;
      };
      __this.RayCast(RayCastOneWrapper, point1, point2);
      return result;
   }
   b2World.prototype.RayCastAll = function (point1, point2) {
      var __this = this;
      var result = new Vector();

      function RayCastAllWrapper(fixture, point, normal, fraction) {
         if (fraction === undefined) fraction = 0;
         result[result.length] = fixture;
         return 1;
      };
      __this.RayCast(RayCastAllWrapper, point1, point2);
      return result;
   }
   b2World.prototype.GetBodyList = function () {
      return this.m_bodyList;
   }
   b2World.prototype.GetJointList = function () {
      return this.m_jointList;
   }
   b2World.prototype.GetContactList = function () {
      return this.m_contactList;
   }
   b2World.prototype.IsLocked = function () {
      return (this.m_flags & b2World.e_locked) > 0;
   }
   b2World.prototype.Solve = function (step) {
      var b;
      for (var controller = this.m_controllerList; controller; controller = controller.m_next) {
         controller.Step(step);
      }
      var island = this.m_island;
      island.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         b.m_flags &= ~b2Body.e_islandFlag;
      }
      for (var c = this.m_contactList; c; c = c.m_next) {
         c.m_flags &= ~b2Contact.e_islandFlag;
      }
      for (var j = this.m_jointList; j; j = j.m_next) {
         j.m_islandFlag = false;
      }
      var stackSize = parseInt(this.m_bodyCount);
      var stack = this.s_stack;
      for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
         if (seed.m_flags & b2Body.e_islandFlag) {
            continue;
         }
         if (seed.IsAwake() == false || seed.IsActive() == false) {
            continue;
         }
         if (seed.GetType() == b2Body.b2_staticBody) {
            continue;
         }
         island.Clear();
         var stackCount = 0;
         stack[stackCount++] = seed;
         seed.m_flags |= b2Body.e_islandFlag;
         while (stackCount > 0) {
            b = stack[--stackCount];
            island.AddBody(b);
            if (b.IsAwake() == false) {
               b.SetAwake(true);
            }
            if (b.GetType() == b2Body.b2_staticBody) {
               continue;
            }
            var other;
            for (var ce = b.m_contactList; ce; ce = ce.next) {
               if (ce.contact.m_flags & b2Contact.e_islandFlag) {
                  continue;
               }
               if (ce.contact.IsSensor() == true || ce.contact.IsEnabled() == false || ce.contact.IsTouching() == false) {
                  continue;
               }
               island.AddContact(ce.contact);
               ce.contact.m_flags |= b2Contact.e_islandFlag;
               other = ce.other;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               stack[stackCount++] = other;
               other.m_flags |= b2Body.e_islandFlag;
            }
            for (var jn = b.m_jointList; jn; jn = jn.next) {
               if (jn.joint.m_islandFlag == true) {
                  continue;
               }
               other = jn.other;
               if (other.IsActive() == false) {
                  continue;
               }
               island.AddJoint(jn.joint);
               jn.joint.m_islandFlag = true;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               stack[stackCount++] = other;
               other.m_flags |= b2Body.e_islandFlag;
            }
         }
         island.Solve(step, this.m_gravity, this.m_allowSleep);
         for (var i = 0; i < island.m_bodyCount; ++i) {
            b = island.m_bodies[i];
            if (b.GetType() == b2Body.b2_staticBody) {
               b.m_flags &= ~b2Body.e_islandFlag;
            }
         }
      }
      for (i = 0;
      i < stack.length; ++i) {
         if (!stack[i]) break;
         stack[i] = null;
      }
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         if (b.IsAwake() == false || b.IsActive() == false) {
            continue;
         }
         if (b.GetType() == b2Body.b2_staticBody) {
            continue;
         }
         b.SynchronizeFixtures();
      }
      this.m_contactManager.FindNewContacts();
   }
   b2World.prototype.SolveTOI = function (step) {
      var b;
      var fA;
      var fB;
      var bA;
      var bB;
      var cEdge;
      var j;
      var island = this.m_island;
      island.Initialize(this.m_bodyCount, b2Settings.b2_maxTOIContactsPerIsland, b2Settings.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
      var queue = b2World.s_queue;
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         b.m_flags &= ~b2Body.e_islandFlag;
         b.m_sweep.t0 = 0.0;
      }
      var c;
      for (c = this.m_contactList;
      c; c = c.m_next) {
         c.m_flags &= ~ (b2Contact.e_toiFlag | b2Contact.e_islandFlag);
      }
      for (j = this.m_jointList;
      j; j = j.m_next) {
         j.m_islandFlag = false;
      }
      for (;;) {
         var minContact = null;
         var minTOI = 1.0;
         for (c = this.m_contactList;
         c; c = c.m_next) {
            if (c.IsSensor() == true || c.IsEnabled() == false || c.IsContinuous() == false) {
               continue;
            }
            var toi = 1.0;
            if (c.m_flags & b2Contact.e_toiFlag) {
               toi = c.m_toi;
            }
            else {
               fA = c.m_fixtureA;
               fB = c.m_fixtureB;
               bA = fA.m_body;
               bB = fB.m_body;
               if ((bA.GetType() != b2Body.b2_dynamicBody || bA.IsAwake() == false) && (bB.GetType() != b2Body.b2_dynamicBody || bB.IsAwake() == false)) {
                  continue;
               }
               var t0 = bA.m_sweep.t0;
               if (bA.m_sweep.t0 < bB.m_sweep.t0) {
                  t0 = bB.m_sweep.t0;
                  bA.m_sweep.Advance(t0);
               }
               else if (bB.m_sweep.t0 < bA.m_sweep.t0) {
                  t0 = bA.m_sweep.t0;
                  bB.m_sweep.Advance(t0);
               }
               toi = c.ComputeTOI(bA.m_sweep, bB.m_sweep);
               b2Settings.b2Assert(0.0 <= toi && toi <= 1.0);
               if (toi > 0.0 && toi < 1.0) {
                  toi = (1.0 - toi) * t0 + toi;
                  if (toi > 1) toi = 1;
               }
               c.m_toi = toi;
               c.m_flags |= b2Contact.e_toiFlag;
            }
            if (Number.MIN_VALUE < toi && toi < minTOI) {
               minContact = c;
               minTOI = toi;
            }
         }
         if (minContact == null || 1.0 - 100.0 * Number.MIN_VALUE < minTOI) {
            break;
         }
         fA = minContact.m_fixtureA;
         fB = minContact.m_fixtureB;
         bA = fA.m_body;
         bB = fB.m_body;
         b2World.s_backupA.Set(bA.m_sweep);
         b2World.s_backupB.Set(bB.m_sweep);
         bA.Advance(minTOI);
         bB.Advance(minTOI);
         minContact.Update(this.m_contactManager.m_contactListener);
         minContact.m_flags &= ~b2Contact.e_toiFlag;
         if (minContact.IsSensor() == true || minContact.IsEnabled() == false) {
            bA.m_sweep.Set(b2World.s_backupA);
            bB.m_sweep.Set(b2World.s_backupB);
            bA.SynchronizeTransform();
            bB.SynchronizeTransform();
            continue;
         }
         if (minContact.IsTouching() == false) {
            continue;
         }
         var seed = bA;
         if (seed.GetType() != b2Body.b2_dynamicBody) {
            seed = bB;
         }
         island.Clear();
         var queueStart = 0;
         var queueSize = 0;
         queue[queueStart + queueSize++] = seed;
         seed.m_flags |= b2Body.e_islandFlag;
         while (queueSize > 0) {
            b = queue[queueStart++];
            --queueSize;
            island.AddBody(b);
            if (b.IsAwake() == false) {
               b.SetAwake(true);
            }
            if (b.GetType() != b2Body.b2_dynamicBody) {
               continue;
            }
            for (cEdge = b.m_contactList;
            cEdge; cEdge = cEdge.next) {
               if (island.m_contactCount == island.m_contactCapacity) {
                  break;
               }
               if (cEdge.contact.m_flags & b2Contact.e_islandFlag) {
                  continue;
               }
               if (cEdge.contact.IsSensor() == true || cEdge.contact.IsEnabled() == false || cEdge.contact.IsTouching() == false) {
                  continue;
               }
               island.AddContact(cEdge.contact);
               cEdge.contact.m_flags |= b2Contact.e_islandFlag;
               var other = cEdge.other;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               if (other.GetType() != b2Body.b2_staticBody) {
                  other.Advance(minTOI);
                  other.SetAwake(true);
               }
               queue[queueStart + queueSize] = other;
               ++queueSize;
               other.m_flags |= b2Body.e_islandFlag;
            }
            for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
               if (island.m_jointCount == island.m_jointCapacity) continue;
               if (jEdge.joint.m_islandFlag == true) continue;
               other = jEdge.other;
               if (other.IsActive() == false) {
                  continue;
               }
               island.AddJoint(jEdge.joint);
               jEdge.joint.m_islandFlag = true;
               if (other.m_flags & b2Body.e_islandFlag) continue;
               if (other.GetType() != b2Body.b2_staticBody) {
                  other.Advance(minTOI);
                  other.SetAwake(true);
               }
               queue[queueStart + queueSize] = other;
               ++queueSize;
               other.m_flags |= b2Body.e_islandFlag;
            }
         }
         var subStep = b2World.s_timestep;
         subStep.warmStarting = false;
         subStep.dt = (1.0 - minTOI) * step.dt;
         subStep.inv_dt = 1.0 / subStep.dt;
         subStep.dtRatio = 0.0;
         subStep.velocityIterations = step.velocityIterations;
         subStep.positionIterations = step.positionIterations;
         island.SolveTOI(subStep);
         var i = 0;
         for (i = 0;
         i < island.m_bodyCount; ++i) {
            b = island.m_bodies[i];
            b.m_flags &= ~b2Body.e_islandFlag;
            if (b.IsAwake() == false) {
               continue;
            }
            if (b.GetType() != b2Body.b2_dynamicBody) {
               continue;
            }
            b.SynchronizeFixtures();
            for (cEdge = b.m_contactList;
            cEdge; cEdge = cEdge.next) {
               cEdge.contact.m_flags &= ~b2Contact.e_toiFlag;
            }
         }
         for (i = 0;
         i < island.m_contactCount; ++i) {
            c = island.m_contacts[i];
            c.m_flags &= ~ (b2Contact.e_toiFlag | b2Contact.e_islandFlag);
         }
         for (i = 0;
         i < island.m_jointCount; ++i) {
            j = island.m_joints[i];
            j.m_islandFlag = false;
         }
         this.m_contactManager.FindNewContacts();
      }
   }
   b2World.prototype.DrawJoint = function (joint) {
      var b1 = joint.GetBodyA();
      var b2 = joint.GetBodyB();
      var xf1 = b1.m_xf;
      var xf2 = b2.m_xf;
      var x1 = xf1.position;
      var x2 = xf2.position;
      var p1 = joint.GetAnchorA();
      var p2 = joint.GetAnchorB();
      var color = b2World.s_jointColor;
      switch (joint.m_type) {
      case b2Joint.e_distanceJoint:
         this.m_debugDraw.DrawSegment(p1, p2, color);
         break;
      case b2Joint.e_pulleyJoint:
         {
            var pulley = ((joint instanceof b2PulleyJoint ? joint : null));
            var s1 = pulley.GetGroundAnchorA();
            var s2 = pulley.GetGroundAnchorB();
            this.m_debugDraw.DrawSegment(s1, p1, color);
            this.m_debugDraw.DrawSegment(s2, p2, color);
            this.m_debugDraw.DrawSegment(s1, s2, color);
         }
         break;
      case b2Joint.e_mouseJoint:
         this.m_debugDraw.DrawSegment(p1, p2, color);
         break;
      default:
         if (b1 != this.m_groundBody) this.m_debugDraw.DrawSegment(x1, p1, color);
         this.m_debugDraw.DrawSegment(p1, p2, color);
         if (b2 != this.m_groundBody) this.m_debugDraw.DrawSegment(x2, p2, color);
      }
   }
   b2World.prototype.DrawShape = function (shape, xf, color) {
      switch (shape.m_type) {
      case b2Shape.e_circleShape:
         {
            var circle = ((shape instanceof b2CircleShape ? shape : null));
            var center = b2Math.MulX(xf, circle.m_p);
            var radius = circle.m_radius;
            var axis = xf.R.col1;
            this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var i = 0;
            var poly = ((shape instanceof b2PolygonShape ? shape : null));
            var vertexCount = parseInt(poly.GetVertexCount());
            var localVertices = poly.GetVertices();
            var vertices = new Vector(vertexCount);
            for (i = 0;
            i < vertexCount; ++i) {
               vertices[i] = b2Math.MulX(xf, localVertices[i]);
            }
            this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
         }
         break;
      case b2Shape.e_edgeShape:
         {
            var edge = (shape instanceof b2EdgeShape ? shape : null);
            this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
         }
         break;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2World.s_timestep2 = new b2TimeStep();
      Box2D.Dynamics.b2World.s_xf = new b2Transform();
      Box2D.Dynamics.b2World.s_backupA = new b2Sweep();
      Box2D.Dynamics.b2World.s_backupB = new b2Sweep();
      Box2D.Dynamics.b2World.s_timestep = new b2TimeStep();
      Box2D.Dynamics.b2World.s_queue = new Vector();
      Box2D.Dynamics.b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
      Box2D.Dynamics.b2World.e_newFixture = 0x0001;
      Box2D.Dynamics.b2World.e_locked = 0x0002;
   });
})();
(function () {
   var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
      b2Contact = Box2D.Dynamics.Contacts.b2Contact,
      b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
      b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
      b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
      b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
      b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
      b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
      b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
      b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
      b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
      b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
      b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
      b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
      b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   Box2D.inherit(b2CircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2CircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2CircleContact.b2CircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2CircleContact.Create = function (allocator) {
      return new b2CircleContact();
   }
   b2CircleContact.Destroy = function (contact, allocator) {}
   b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2CircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      b2Collision.CollideCircles(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2CircleShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2Contact.b2Contact = function () {
      this.m_nodeA = new b2ContactEdge();
      this.m_nodeB = new b2ContactEdge();
      this.m_manifold = new b2Manifold();
      this.m_oldManifold = new b2Manifold();
   };
   b2Contact.prototype.GetManifold = function () {
      return this.m_manifold;
   }
   b2Contact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody();
      var bodyB = this.m_fixtureB.GetBody();
      var shapeA = this.m_fixtureA.GetShape();
      var shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   }
   b2Contact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
   }
   b2Contact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) == b2Contact.e_continuousFlag;
   }
   b2Contact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   }
   b2Contact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) == b2Contact.e_sensorFlag;
   }
   b2Contact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   }
   b2Contact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) == b2Contact.e_enabledFlag;
   }
   b2Contact.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Contact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   }
   b2Contact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   }
   b2Contact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   }
   b2Contact.prototype.b2Contact = function () {}
   b2Contact.prototype.Reset = function (fixtureA, fixtureB) {
      if (fixtureA === undefined) fixtureA = null;
      if (fixtureB === undefined) fixtureB = null;
      this.m_flags = b2Contact.e_enabledFlag;
      if (!fixtureA || !fixtureB) {
         this.m_fixtureA = null;
         this.m_fixtureB = null;
         return;
      }
      if (fixtureA.IsSensor() || fixtureB.IsSensor()) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
         this.m_flags |= b2Contact.e_continuousFlag;
      }
      this.m_fixtureA = fixtureA;
      this.m_fixtureB = fixtureB;
      this.m_manifold.m_pointCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_nodeA.contact = null;
      this.m_nodeA.prev = null;
      this.m_nodeA.next = null;
      this.m_nodeA.other = null;
      this.m_nodeB.contact = null;
      this.m_nodeB.prev = null;
      this.m_nodeB.next = null;
      this.m_nodeB.other = null;
   }
   b2Contact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false;
      var wasTouching = (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
      var bodyA = this.m_fixtureA.m_body;
      var bodyB = this.m_fixtureB.m_body;
      var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            var xfA = bodyA.GetTransform();
            var xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key == id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching != wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching == false && touching == true) {
         listener.BeginContact(this);
      }
      if (wasTouching == true && touching == false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) == 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   }
   b2Contact.prototype.Evaluate = function () {}
   b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2Contact.e_sensorFlag = 0x0001;
      Box2D.Dynamics.Contacts.b2Contact.e_continuousFlag = 0x0002;
      Box2D.Dynamics.Contacts.b2Contact.e_islandFlag = 0x0004;
      Box2D.Dynamics.Contacts.b2Contact.e_toiFlag = 0x0008;
      Box2D.Dynamics.Contacts.b2Contact.e_touchingFlag = 0x0010;
      Box2D.Dynamics.Contacts.b2Contact.e_enabledFlag = 0x0020;
      Box2D.Dynamics.Contacts.b2Contact.e_filterFlag = 0x0040;
      Box2D.Dynamics.Contacts.b2Contact.s_input = new b2TOIInput();
   });
   b2ContactConstraint.b2ContactConstraint = function () {
      this.localPlaneNormal = new b2Vec2();
      this.localPoint = new b2Vec2();
      this.normal = new b2Vec2();
      this.normalMass = new b2Mat22();
      this.K = new b2Mat22();
   };
   b2ContactConstraint.prototype.b2ContactConstraint = function () {
      this.points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.points[i] = new b2ContactConstraintPoint();
      }
   }
   b2ContactConstraintPoint.b2ContactConstraintPoint = function () {
      this.localPoint = new b2Vec2();
      this.rA = new b2Vec2();
      this.rB = new b2Vec2();
   };
   b2ContactEdge.b2ContactEdge = function () {};
   b2ContactFactory.b2ContactFactory = function () {};
   b2ContactFactory.prototype.b2ContactFactory = function (allocator) {
      this.m_allocator = allocator;
      this.InitializeRegisters();
   }
   b2ContactFactory.prototype.AddType = function (createFcn, destroyFcn, type1, type2) {
      if (type1 === undefined) type1 = 0;
      if (type2 === undefined) type2 = 0;
      this.m_registers[type1][type2].createFcn = createFcn;
      this.m_registers[type1][type2].destroyFcn = destroyFcn;
      this.m_registers[type1][type2].primary = true;
      if (type1 != type2) {
         this.m_registers[type2][type1].createFcn = createFcn;
         this.m_registers[type2][type1].destroyFcn = destroyFcn;
         this.m_registers[type2][type1].primary = false;
      }
   }
   b2ContactFactory.prototype.InitializeRegisters = function () {
      this.m_registers = new Vector(b2Shape.e_shapeTypeCount);
      for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
         this.m_registers[i] = new Vector(b2Shape.e_shapeTypeCount);
         for (var j = 0; j < b2Shape.e_shapeTypeCount; j++) {
            this.m_registers[i][j] = new b2ContactRegister();
         }
      }
      this.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_circleShape);
      this.AddType(b2PolygonContact.Create, b2PolygonContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_polygonShape);
      this.AddType(b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact.Destroy, b2Shape.e_edgeShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndEdgeContact.Create, b2PolyAndEdgeContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_edgeShape);
   }
   b2ContactFactory.prototype.Create = function (fixtureA, fixtureB) {
      var type1 = parseInt(fixtureA.GetType());
      var type2 = parseInt(fixtureB.GetType());
      var reg = this.m_registers[type1][type2];
      var c;
      if (reg.pool) {
         c = reg.pool;
         reg.pool = c.m_next;
         reg.poolCount--;
         c.Reset(fixtureA, fixtureB);
         return c;
      }
      var createFcn = reg.createFcn;
      if (createFcn != null) {
         if (reg.primary) {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureA, fixtureB);
            return c;
         }
         else {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureB, fixtureA);
            return c;
         }
      }
      else {
         return null;
      }
   }
   b2ContactFactory.prototype.Destroy = function (contact) {
      if (contact.m_manifold.m_pointCount > 0) {
         contact.m_fixtureA.m_body.SetAwake(true);
         contact.m_fixtureB.m_body.SetAwake(true);
      }
      var type1 = parseInt(contact.m_fixtureA.GetType());
      var type2 = parseInt(contact.m_fixtureB.GetType());
      var reg = this.m_registers[type1][type2];
      if (true) {
         reg.poolCount++;
         contact.m_next = reg.pool;
         reg.pool = contact;
      }
      var destroyFcn = reg.destroyFcn;
      destroyFcn(contact, this.m_allocator);
   }
   b2ContactRegister.b2ContactRegister = function () {};
   b2ContactResult.b2ContactResult = function () {
      this.position = new b2Vec2();
      this.normal = new b2Vec2();
      this.id = new b2ContactID();
   };
   b2ContactSolver.b2ContactSolver = function () {
      this.m_step = new b2TimeStep();
      this.m_constraints = new Vector();
   };
   b2ContactSolver.prototype.b2ContactSolver = function () {}
   b2ContactSolver.prototype.Initialize = function (step, contacts, contactCount, allocator) {
      if (contactCount === undefined) contactCount = 0;
      var contact;
      this.m_step.Set(step);
      this.m_allocator = allocator;
      var i = 0;
      var tVec;
      var tMat;
      this.m_constraintCount = contactCount;
      while (this.m_constraints.length < this.m_constraintCount) {
         this.m_constraints[this.m_constraints.length] = new b2ContactConstraint();
      }
      for (i = 0;
      i < contactCount; ++i) {
         contact = contacts[i];
         var fixtureA = contact.m_fixtureA;
         var fixtureB = contact.m_fixtureB;
         var shapeA = fixtureA.m_shape;
         var shapeB = fixtureB.m_shape;
         var radiusA = shapeA.m_radius;
         var radiusB = shapeB.m_radius;
         var bodyA = fixtureA.m_body;
         var bodyB = fixtureB.m_body;
         var manifold = contact.GetManifold();
         var friction = b2Settings.b2MixFriction(fixtureA.GetFriction(), fixtureB.GetFriction());
         var restitution = b2Settings.b2MixRestitution(fixtureA.GetRestitution(), fixtureB.GetRestitution());
         var vAX = bodyA.m_linearVelocity.x;
         var vAY = bodyA.m_linearVelocity.y;
         var vBX = bodyB.m_linearVelocity.x;
         var vBY = bodyB.m_linearVelocity.y;
         var wA = bodyA.m_angularVelocity;
         var wB = bodyB.m_angularVelocity;
         b2Settings.b2Assert(manifold.m_pointCount > 0);
         b2ContactSolver.s_worldManifold.Initialize(manifold, bodyA.m_xf, radiusA, bodyB.m_xf, radiusB);
         var normalX = b2ContactSolver.s_worldManifold.m_normal.x;
         var normalY = b2ContactSolver.s_worldManifold.m_normal.y;
         var cc = this.m_constraints[i];
         cc.bodyA = bodyA;
         cc.bodyB = bodyB;
         cc.manifold = manifold;
         cc.normal.x = normalX;
         cc.normal.y = normalY;
         cc.pointCount = manifold.m_pointCount;
         cc.friction = friction;
         cc.restitution = restitution;
         cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
         cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
         cc.localPoint.x = manifold.m_localPoint.x;
         cc.localPoint.y = manifold.m_localPoint.y;
         cc.radius = radiusA + radiusB;
         cc.type = manifold.m_type;
         for (var k = 0; k < cc.pointCount; ++k) {
            var cp = manifold.m_points[k];
            var ccp = cc.points[k];
            ccp.normalImpulse = cp.m_normalImpulse;
            ccp.tangentImpulse = cp.m_tangentImpulse;
            ccp.localPoint.SetV(cp.m_localPoint);
            var rAX = ccp.rA.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x;
            var rAY = ccp.rA.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y;
            var rBX = ccp.rB.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x;
            var rBY = ccp.rB.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y;
            var rnA = rAX * normalY - rAY * normalX;
            var rnB = rBX * normalY - rBY * normalX;
            rnA *= rnA;
            rnB *= rnB;
            var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
            ccp.normalMass = 1.0 / kNormal;
            var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
            kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
            ccp.equalizedMass = 1.0 / kEqualized;
            var tangentX = normalY;
            var tangentY = (-normalX);
            var rtA = rAX * tangentY - rAY * tangentX;
            var rtB = rBX * tangentY - rBY * tangentX;
            rtA *= rtA;
            rtB *= rtB;
            var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
            ccp.tangentMass = 1.0 / kTangent;
            ccp.velocityBias = 0.0;
            var tX = vBX + ((-wB * rBY)) - vAX - ((-wA * rAY));
            var tY = vBY + (wB * rBX) - vAY - (wA * rAX);
            var vRel = cc.normal.x * tX + cc.normal.y * tY;
            if (vRel < (-b2Settings.b2_velocityThreshold)) {
               ccp.velocityBias += (-cc.restitution * vRel);
            }
         }
         if (cc.pointCount == 2) {
            var ccp1 = cc.points[0];
            var ccp2 = cc.points[1];
            var invMassA = bodyA.m_invMass;
            var invIA = bodyA.m_invI;
            var invMassB = bodyB.m_invMass;
            var invIB = bodyB.m_invI;
            var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
            var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
            var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
            var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
            var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
            var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
            var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
            var k_maxConditionNumber = 100.0;
            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
               cc.K.col1.Set(k11, k12);
               cc.K.col2.Set(k12, k22);
               cc.K.GetInverse(cc.normalMass);
            }
            else {
               cc.pointCount = 1;
            }
         }
      }
   }
   b2ContactSolver.prototype.InitVelocityConstraints = function (step) {
      var tVec;
      var tVec2;
      var tMat;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var invMassA = bodyA.m_invMass;
         var invIA = bodyA.m_invI;
         var invMassB = bodyB.m_invMass;
         var invIB = bodyB.m_invI;
         var normalX = c.normal.x;
         var normalY = c.normal.y;
         var tangentX = normalY;
         var tangentY = (-normalX);
         var tX = 0;
         var j = 0;
         var tCount = 0;
         if (step.warmStarting) {
            tCount = c.pointCount;
            for (j = 0;
            j < tCount; ++j) {
               var ccp = c.points[j];
               ccp.normalImpulse *= step.dtRatio;
               ccp.tangentImpulse *= step.dtRatio;
               var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
               var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
               bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
               bodyA.m_linearVelocity.x -= invMassA * PX;
               bodyA.m_linearVelocity.y -= invMassA * PY;
               bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
               bodyB.m_linearVelocity.x += invMassB * PX;
               bodyB.m_linearVelocity.y += invMassB * PY;
            }
         }
         else {
            tCount = c.pointCount;
            for (j = 0;
            j < tCount; ++j) {
               var ccp2 = c.points[j];
               ccp2.normalImpulse = 0.0;
               ccp2.tangentImpulse = 0.0;
            }
         }
      }
   }
   b2ContactSolver.prototype.SolveVelocityConstraints = function () {
      var j = 0;
      var ccp;
      var rAX = 0;
      var rAY = 0;
      var rBX = 0;
      var rBY = 0;
      var dvX = 0;
      var dvY = 0;
      var vn = 0;
      var vt = 0;
      var lambda = 0;
      var maxFriction = 0;
      var newImpulse = 0;
      var PX = 0;
      var PY = 0;
      var dX = 0;
      var dY = 0;
      var P1X = 0;
      var P1Y = 0;
      var P2X = 0;
      var P2Y = 0;
      var tMat;
      var tVec;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var wA = bodyA.m_angularVelocity;
         var wB = bodyB.m_angularVelocity;
         var vA = bodyA.m_linearVelocity;
         var vB = bodyB.m_linearVelocity;
         var invMassA = bodyA.m_invMass;
         var invIA = bodyA.m_invI;
         var invMassB = bodyB.m_invMass;
         var invIB = bodyB.m_invI;
         var normalX = c.normal.x;
         var normalY = c.normal.y;
         var tangentX = normalY;
         var tangentY = (-normalX);
         var friction = c.friction;
         var tX = 0;
         for (j = 0;
         j < c.pointCount; j++) {
            ccp = c.points[j];
            dvX = vB.x - wB * ccp.rB.y - vA.x + wA * ccp.rA.y;
            dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
            vt = dvX * tangentX + dvY * tangentY;
            lambda = ccp.tangentMass * (-vt);
            maxFriction = friction * ccp.normalImpulse;
            newImpulse = b2Math.Clamp(ccp.tangentImpulse + lambda, (-maxFriction), maxFriction);
            lambda = newImpulse - ccp.tangentImpulse;
            PX = lambda * tangentX;
            PY = lambda * tangentY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.tangentImpulse = newImpulse;
         }
         var tCount = parseInt(c.pointCount);
         if (c.pointCount == 1) {
            ccp = c.points[0];
            dvX = vB.x + ((-wB * ccp.rB.y)) - vA.x - ((-wA * ccp.rA.y));
            dvY = vB.y + (wB * ccp.rB.x) - vA.y - (wA * ccp.rA.x);
            vn = dvX * normalX + dvY * normalY;
            lambda = (-ccp.normalMass * (vn - ccp.velocityBias));
            newImpulse = ccp.normalImpulse + lambda;
            newImpulse = newImpulse > 0 ? newImpulse : 0.0;
            lambda = newImpulse - ccp.normalImpulse;
            PX = lambda * normalX;
            PY = lambda * normalY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.normalImpulse = newImpulse;
         }
         else {
            var cp1 = c.points[0];
            var cp2 = c.points[1];
            var aX = cp1.normalImpulse;
            var aY = cp2.normalImpulse;
            var dv1X = vB.x - wB * cp1.rB.y - vA.x + wA * cp1.rA.y;
            var dv1Y = vB.y + wB * cp1.rB.x - vA.y - wA * cp1.rA.x;
            var dv2X = vB.x - wB * cp2.rB.y - vA.x + wA * cp2.rA.y;
            var dv2Y = vB.y + wB * cp2.rB.x - vA.y - wA * cp2.rA.x;
            var vn1 = dv1X * normalX + dv1Y * normalY;
            var vn2 = dv2X * normalX + dv2Y * normalY;
            var bX = vn1 - cp1.velocityBias;
            var bY = vn2 - cp2.velocityBias;
            tMat = c.K;
            bX -= tMat.col1.x * aX + tMat.col2.x * aY;
            bY -= tMat.col1.y * aX + tMat.col2.y * aY;
            var k_errorTol = 0.001;
            for (;;) {
               tMat = c.normalMass;
               var xX = (-(tMat.col1.x * bX + tMat.col2.x * bY));
               var xY = (-(tMat.col1.y * bX + tMat.col2.y * bY));
               if (xX >= 0.0 && xY >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = (-cp1.normalMass * bX);
               xY = 0.0;
               vn1 = 0.0;
               vn2 = c.K.col1.y * xX + bY;
               if (xX >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = (-cp2.normalMass * bY);
               vn1 = c.K.col2.x * xY + bX;
               vn2 = 0.0;
               if (xY >= 0.0 && vn1 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = 0.0;
               vn1 = bX;
               vn2 = bY;
               if (vn1 >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               break;
            }
         }
         bodyA.m_angularVelocity = wA;
         bodyB.m_angularVelocity = wB;
      }
   }
   b2ContactSolver.prototype.FinalizeVelocityConstraints = function () {
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var m = c.manifold;
         for (var j = 0; j < c.pointCount; ++j) {
            var point1 = m.m_points[j];
            var point2 = c.points[j];
            point1.m_normalImpulse = point2.normalImpulse;
            point1.m_tangentImpulse = point2.tangentImpulse;
         }
      }
   }
   b2ContactSolver.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var minSeparation = 0.0;
      for (var i = 0; i < this.m_constraintCount; i++) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var invMassA = bodyA.m_mass * bodyA.m_invMass;
         var invIA = bodyA.m_mass * bodyA.m_invI;
         var invMassB = bodyB.m_mass * bodyB.m_invMass;
         var invIB = bodyB.m_mass * bodyB.m_invI;
         b2ContactSolver.s_psm.Initialize(c);
         var normal = b2ContactSolver.s_psm.m_normal;
         for (var j = 0; j < c.pointCount; j++) {
            var ccp = c.points[j];
            var point = b2ContactSolver.s_psm.m_points[j];
            var separation = b2ContactSolver.s_psm.m_separations[j];
            var rAX = point.x - bodyA.m_sweep.c.x;
            var rAY = point.y - bodyA.m_sweep.c.y;
            var rBX = point.x - bodyB.m_sweep.c.x;
            var rBY = point.y - bodyB.m_sweep.c.y;
            minSeparation = minSeparation < separation ? minSeparation : separation;
            var C = b2Math.Clamp(baumgarte * (separation + b2Settings.b2_linearSlop), (-b2Settings.b2_maxLinearCorrection), 0.0);
            var impulse = (-ccp.equalizedMass * C);
            var PX = impulse * normal.x;
            var PY = impulse * normal.y;bodyA.m_sweep.c.x -= invMassA * PX;
            bodyA.m_sweep.c.y -= invMassA * PY;
            bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
            bodyA.SynchronizeTransform();
            bodyB.m_sweep.c.x += invMassB * PX;
            bodyB.m_sweep.c.y += invMassB * PY;
            bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
            bodyB.SynchronizeTransform();
         }
      }
      return minSeparation > (-1.5 * b2Settings.b2_linearSlop);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new b2WorldManifold();
      Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new b2PositionSolverManifold();
   });
   Box2D.inherit(b2EdgeAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2EdgeAndCircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2EdgeAndCircleContact.b2EdgeAndCircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2EdgeAndCircleContact.Create = function (allocator) {
      return new b2EdgeAndCircleContact();
   }
   b2EdgeAndCircleContact.Destroy = function (contact, allocator) {}
   b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2EdgeAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      this.b2CollideEdgeAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2EdgeShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function (manifold, edge, xf1, circle, xf2) {}
   Box2D.inherit(b2NullContact, Box2D.Dynamics.Contacts.b2Contact);
   b2NullContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2NullContact.b2NullContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2NullContact.prototype.b2NullContact = function () {
      this.__super.b2Contact.call(this);
   }
   b2NullContact.prototype.Evaluate = function () {}
   Box2D.inherit(b2PolyAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolyAndCircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolyAndCircleContact.b2PolyAndCircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolyAndCircleContact.Create = function (allocator) {
      return new b2PolyAndCircleContact();
   }
   b2PolyAndCircleContact.Destroy = function (contact, allocator) {}
   b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
      b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
      b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_circleShape);
   }
   b2PolyAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.m_body;
      var bB = this.m_fixtureB.m_body;
      b2Collision.CollidePolygonAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   Box2D.inherit(b2PolyAndEdgeContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolyAndEdgeContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolyAndEdgeContact.b2PolyAndEdgeContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolyAndEdgeContact.Create = function (allocator) {
      return new b2PolyAndEdgeContact();
   }
   b2PolyAndEdgeContact.Destroy = function (contact, allocator) {}
   b2PolyAndEdgeContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
      b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
      b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_edgeShape);
   }
   b2PolyAndEdgeContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      this.b2CollidePolyAndEdge(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2EdgeShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold, polygon, xf1, edge, xf2) {}
   Box2D.inherit(b2PolygonContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolygonContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolygonContact.b2PolygonContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolygonContact.Create = function (allocator) {
      return new b2PolygonContact();
   }
   b2PolygonContact.Destroy = function (contact, allocator) {}
   b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2PolygonContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      b2Collision.CollidePolygons(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2PolygonShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2PositionSolverManifold.b2PositionSolverManifold = function () {};
   b2PositionSolverManifold.prototype.b2PositionSolverManifold = function () {
      this.m_normal = new b2Vec2();
      this.m_separations = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2Vec2();
      }
   }
   b2PositionSolverManifold.prototype.Initialize = function (cc) {
      b2Settings.b2Assert(cc.pointCount > 0);
      var i = 0;
      var clipPointX = 0;
      var clipPointY = 0;
      var tMat;
      var tVec;
      var planePointX = 0;
      var planePointY = 0;
      switch (cc.type) {
      case b2Manifold.e_circles:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.points[0].localPoint;
            var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            var dX = pointBX - pointAX;
            var dY = pointBY - pointAY;
            var d2 = dX * dX + dY * dY;
            if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1.0;
               this.m_normal.y = 0.0;
            }
            this.m_points[0].x = 0.5 * (pointAX + pointBX);
            this.m_points[0].y = 0.5 * (pointAY + pointBY);
            this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            for (i = 0;
            i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].x = clipPointX;
               this.m_points[i].y = clipPointY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyA.m_xf.R;
            for (i = 0;
            i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].Set(clipPointX, clipPointY);
            }
            this.m_normal.x *= (-1);
            this.m_normal.y *= (-1);
         }
         break;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointA = new b2Vec2();
      Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointB = new b2Vec2();
   });
})();
(function () {
   var b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController,
      b2ConstantAccelController = Box2D.Dynamics.Controllers.b2ConstantAccelController,
      b2ConstantForceController = Box2D.Dynamics.Controllers.b2ConstantForceController,
      b2Controller = Box2D.Dynamics.Controllers.b2Controller,
      b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
      b2GravityController = Box2D.Dynamics.Controllers.b2GravityController,
      b2TensorDampingController = Box2D.Dynamics.Controllers.b2TensorDampingController;

   Box2D.inherit(b2BuoyancyController, Box2D.Dynamics.Controllers.b2Controller);
   b2BuoyancyController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2BuoyancyController.b2BuoyancyController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.normal = new b2Vec2(0, (-1));
      this.offset = 0;
      this.density = 0;
      this.velocity = new b2Vec2(0, 0);
      this.linearDrag = 2;
      this.angularDrag = 1;
      this.useDensity = false;
      this.useWorldGravity = true;
      this.gravity = null;
   };
   b2BuoyancyController.prototype.Step = function (step) {
      if (!this.m_bodyList) return;
      if (this.useWorldGravity) {
         this.gravity = this.GetWorld().GetGravity().Copy();
      }
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (body.IsAwake() == false) {
            continue;
         }
         var areac = new b2Vec2();
         var massc = new b2Vec2();
         var area = 0.0;
         var mass = 0.0;
         for (var fixture = body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
            var sc = new b2Vec2();
            var sarea = fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
            area += sarea;
            areac.x += sarea * sc.x;
            areac.y += sarea * sc.y;
            var shapeDensity = 0;
            if (this.useDensity) {
               shapeDensity = 1;
            }
            else {
               shapeDensity = 1;
            }
            mass += sarea * shapeDensity;
            massc.x += sarea * sc.x * shapeDensity;
            massc.y += sarea * sc.y * shapeDensity;
         }
         areac.x /= area;
         areac.y /= area;
         massc.x /= mass;
         massc.y /= mass;
         if (area < Number.MIN_VALUE) continue;
         var buoyancyForce = this.gravity.GetNegative();
         buoyancyForce.Multiply(this.density * area);
         body.ApplyForce(buoyancyForce, massc);
         var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
         dragForce.Subtract(this.velocity);
         dragForce.Multiply((-this.linearDrag * area));
         body.ApplyForce(dragForce, areac);
         body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
      }
   }
   b2BuoyancyController.prototype.Draw = function (debugDraw) {
      var r = 1000;
      var p1 = new b2Vec2();
      var p2 = new b2Vec2();
      p1.x = this.normal.x * this.offset + this.normal.y * r;
      p1.y = this.normal.y * this.offset - this.normal.x * r;
      p2.x = this.normal.x * this.offset - this.normal.y * r;
      p2.y = this.normal.y * this.offset + this.normal.x * r;
      var color = new b2Color(0, 0, 1);
      debugDraw.DrawSegment(p1, p2, color);
   }
   Box2D.inherit(b2ConstantAccelController, Box2D.Dynamics.Controllers.b2Controller);
   b2ConstantAccelController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2ConstantAccelController.b2ConstantAccelController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.A = new b2Vec2(0, 0);
   };
   b2ConstantAccelController.prototype.Step = function (step) {
      var smallA = new b2Vec2(this.A.x * step.dt, this.A.y * step.dt);
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + smallA.x, body.GetLinearVelocity().y + smallA.y));
      }
   }
   Box2D.inherit(b2ConstantForceController, Box2D.Dynamics.Controllers.b2Controller);
   b2ConstantForceController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2ConstantForceController.b2ConstantForceController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.F = new b2Vec2(0, 0);
   };
   b2ConstantForceController.prototype.Step = function (step) {
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.ApplyForce(this.F, body.GetWorldCenter());
      }
   }
   b2Controller.b2Controller = function () {};
   b2Controller.prototype.Step = function (step) {}
   b2Controller.prototype.Draw = function (debugDraw) {}
   b2Controller.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   }
   b2Controller.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller != this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList == edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList == edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   }
   b2Controller.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   }
   b2Controller.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Controller.prototype.GetWorld = function () {
      return this.m_world;
   }
   b2Controller.prototype.GetBodyList = function () {
      return this.m_bodyList;
   }
   b2ControllerEdge.b2ControllerEdge = function () {};
   Box2D.inherit(b2GravityController, Box2D.Dynamics.Controllers.b2Controller);
   b2GravityController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2GravityController.b2GravityController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.G = 1;
      this.invSqr = true;
   };
   b2GravityController.prototype.Step = function (step) {
      var i = null;
      var body1 = null;
      var p1 = null;
      var mass1 = 0;
      var j = null;
      var body2 = null;
      var p2 = null;
      var dx = 0;
      var dy = 0;
      var r2 = 0;
      var f = null;
      if (this.invSqr) {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList;
            j != i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < Number.MIN_VALUE) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
      else {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList;
            j != i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < Number.MIN_VALUE) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
   }
   Box2D.inherit(b2TensorDampingController, Box2D.Dynamics.Controllers.b2Controller);
   b2TensorDampingController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2TensorDampingController.b2TensorDampingController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.T = new b2Mat22();
      this.maxTimestep = 0;
   };
   b2TensorDampingController.prototype.SetAxisAligned = function (xDamping, yDamping) {
      if (xDamping === undefined) xDamping = 0;
      if (yDamping === undefined) yDamping = 0;
      this.T.col1.x = (-xDamping);
      this.T.col1.y = 0;
      this.T.col2.x = 0;
      this.T.col2.y = (-yDamping);
      if (xDamping > 0 || yDamping > 0) {
         this.maxTimestep = 1 / Math.max(xDamping, yDamping);
      }
      else {
         this.maxTimestep = 0;
      }
   }
   b2TensorDampingController.prototype.Step = function (step) {
      var timestep = step.dt;
      if (timestep <= Number.MIN_VALUE) return;
      if (timestep > this.maxTimestep && this.maxTimestep > 0) timestep = this.maxTimestep;
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) {
            continue;
         }
         var damping = body.GetWorldVector(b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity())));
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + damping.x * timestep, body.GetLinearVelocity().y + damping.y * timestep));
      }
   }
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
      b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
      b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
      b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
      b2Joint = Box2D.Dynamics.Joints.b2Joint,
      b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
      b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
      b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
      b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
      b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
      b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
      b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
      b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
      b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
      b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
      b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World;

   Box2D.inherit(b2DistanceJoint, Box2D.Dynamics.Joints.b2Joint);
   b2DistanceJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2DistanceJoint.b2DistanceJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u = new b2Vec2();
   };
   b2DistanceJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2DistanceJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
   }
   b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2DistanceJoint.prototype.GetLength = function () {
      return this.m_length;
   }
   b2DistanceJoint.prototype.SetLength = function (length) {
      if (length === undefined) length = 0;
      this.m_length = length;
   }
   b2DistanceJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   }
   b2DistanceJoint.prototype.SetFrequency = function (hz) {
      if (hz === undefined) hz = 0;
      this.m_frequencyHz = hz;
   }
   b2DistanceJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   }
   b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_dampingRatio = ratio;
   }
   b2DistanceJoint.prototype.b2DistanceJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_length = def.length;
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
      this.m_impulse = 0.0;
      this.m_gamma = 0.0;
      this.m_bias = 0.0;
   }
   b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
      if (length > b2Settings.b2_linearSlop) {
         this.m_u.Multiply(1.0 / length);
      }
      else {
         this.m_u.SetZero();
      }
      var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
      var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
      var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
      this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
      if (this.m_frequencyHz > 0.0) {
         var C = length - this.m_length;
         var omega = 2.0 * Math.PI * this.m_frequencyHz;
         var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
         var k = this.m_mass * omega * omega;
         this.m_gamma = step.dt * (d + step.dt * k);
         this.m_gamma = this.m_gamma != 0.0 ? 1 / this.m_gamma : 0.0;
         this.m_bias = C * step.dt * k * this.m_gamma;
         this.m_mass = invMass + this.m_gamma;
         this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         var PX = this.m_impulse * this.m_u.x;
         var PY = this.m_impulse * this.m_u.y;
         bA.m_linearVelocity.x -= bA.m_invMass * PX;
         bA.m_linearVelocity.y -= bA.m_invMass * PY;
         bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
         bB.m_linearVelocity.x += bB.m_invMass * PX;
         bB.m_linearVelocity.y += bB.m_invMass * PY;
         bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
      }
      else {
         this.m_impulse = 0.0;
      }
   }
   b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
      var v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
      var v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
      var v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
      var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
      var impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
      this.m_impulse += impulse;
      var PX = impulse * this.m_u.x;
      var PY = impulse * this.m_u.y;
      bA.m_linearVelocity.x -= bA.m_invMass * PX;
      bA.m_linearVelocity.y -= bA.m_invMass * PY;
      bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_linearVelocity.x += bB.m_invMass * PX;
      bB.m_linearVelocity.y += bB.m_invMass * PY;
      bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
   }
   b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var tMat;
      if (this.m_frequencyHz > 0.0) {
         return true;
      }
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(dX * dX + dY * dY);
      dX /= length;
      dY /= length;
      var C = length - this.m_length;
      C = b2Math.Clamp(C, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
      var impulse = (-this.m_mass * C);
      this.m_u.Set(dX, dY);
      var PX = impulse * this.m_u.x;
      var PY = impulse * this.m_u.y;
      bA.m_sweep.c.x -= bA.m_invMass * PX;
      bA.m_sweep.c.y -= bA.m_invMass * PY;
      bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_sweep.c.x += bB.m_invMass * PX;
      bB.m_sweep.c.y += bB.m_invMass * PY;
      bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return b2Math.Abs(C) < b2Settings.b2_linearSlop;
   }
   Box2D.inherit(b2DistanceJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2DistanceJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2DistanceJointDef.b2DistanceJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2DistanceJointDef.prototype.b2DistanceJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_distanceJoint;
      this.length = 1.0;
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   }
   b2DistanceJointDef.prototype.Initialize = function (bA, bB, anchorA, anchorB) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
      var dX = anchorB.x - anchorA.x;
      var dY = anchorB.y - anchorA.y;
      this.length = Math.sqrt(dX * dX + dY * dY);
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   }
   Box2D.inherit(b2FrictionJoint, Box2D.Dynamics.Joints.b2Joint);
   b2FrictionJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2FrictionJoint.b2FrictionJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchorA = new b2Vec2();
      this.m_localAnchorB = new b2Vec2();
      this.m_linearMass = new b2Mat22();
      this.m_linearImpulse = new b2Vec2();
   };
   b2FrictionJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   }
   b2FrictionJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   }
   b2FrictionJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
   }
   b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_angularImpulse;
   }
   b2FrictionJoint.prototype.SetMaxForce = function (force) {
      if (force === undefined) force = 0;
      this.m_maxForce = force;
   }
   b2FrictionJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   }
   b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
      if (torque === undefined) torque = 0;
      this.m_maxTorque = torque;
   }
   b2FrictionJoint.prototype.GetMaxTorque = function () {
      return this.m_maxTorque;
   }
   b2FrictionJoint.prototype.b2FrictionJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_linearMass.SetZero();
      this.m_angularMass = 0.0;
      this.m_linearImpulse.SetZero();
      this.m_angularImpulse = 0.0;
      this.m_maxForce = def.maxForce;
      this.m_maxTorque = def.maxTorque;
   }
   b2FrictionJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      var K = new b2Mat22();
      K.col1.x = mA + mB;
      K.col2.x = 0.0;
      K.col1.y = 0.0;
      K.col2.y = mA + mB;
      K.col1.x += iA * rAY * rAY;
      K.col2.x += (-iA * rAX * rAY);
      K.col1.y += (-iA * rAX * rAY);
      K.col2.y += iA * rAX * rAX;
      K.col1.x += iB * rBY * rBY;
      K.col2.x += (-iB * rBX * rBY);
      K.col1.y += (-iB * rBX * rBY);
      K.col2.y += iB * rBX * rBX;
      K.GetInverse(this.m_linearMass);
      this.m_angularMass = iA + iB;
      if (this.m_angularMass > 0.0) {
         this.m_angularMass = 1.0 / this.m_angularMass;
      }
      if (step.warmStarting) {
         this.m_linearImpulse.x *= step.dtRatio;
         this.m_linearImpulse.y *= step.dtRatio;
         this.m_angularImpulse *= step.dtRatio;
         var P = this.m_linearImpulse;
         bA.m_linearVelocity.x -= mA * P.x;
         bA.m_linearVelocity.y -= mA * P.y;
         bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
         bB.m_linearVelocity.x += mB * P.x;
         bB.m_linearVelocity.y += mB * P.y;
         bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
      }
      else {
         this.m_linearImpulse.SetZero();
         this.m_angularImpulse = 0.0;
      }
   }
   b2FrictionJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var vA = bA.m_linearVelocity;
      var wA = bA.m_angularVelocity;
      var vB = bB.m_linearVelocity;
      var wB = bB.m_angularVelocity;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var maxImpulse = 0; {
         var Cdot = wB - wA;
         var impulse = (-this.m_angularMass * Cdot);
         var oldImpulse = this.m_angularImpulse;
         maxImpulse = step.dt * this.m_maxTorque;
         this.m_angularImpulse = b2Math.Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_angularImpulse - oldImpulse;
         wA -= iA * impulse;
         wB += iB * impulse;
      } {
         var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
         var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
         var impulseV = b2Math.MulMV(this.m_linearMass, new b2Vec2((-CdotX), (-CdotY)));
         var oldImpulseV = this.m_linearImpulse.Copy();
         this.m_linearImpulse.Add(impulseV);
         maxImpulse = step.dt * this.m_maxForce;
         if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
            this.m_linearImpulse.Normalize();
            this.m_linearImpulse.Multiply(maxImpulse);
         }
         impulseV = b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
         vA.x -= mA * impulseV.x;
         vA.y -= mA * impulseV.y;
         wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
         vB.x += mB * impulseV.x;
         vB.y += mB * impulseV.y;
         wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
      }
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   }
   b2FrictionJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return true;
   }
   Box2D.inherit(b2FrictionJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2FrictionJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2FrictionJointDef.b2FrictionJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2FrictionJointDef.prototype.b2FrictionJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_frictionJoint;
      this.maxForce = 0.0;
      this.maxTorque = 0.0;
   }
   b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
   }
   Box2D.inherit(b2GearJoint, Box2D.Dynamics.Joints.b2Joint);
   b2GearJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2GearJoint.b2GearJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_J = new b2Jacobian();
   };
   b2GearJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2GearJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2GearJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_J.linearB.x, inv_dt * this.m_impulse * this.m_J.linearB.y);
   }
   b2GearJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      var tMat = this.m_bodyB.m_xf.R;
      var rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x;
      var rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y;
      var tX = tMat.col1.x * rX + tMat.col2.x * rY;
      rY = tMat.col1.y * rX + tMat.col2.y * rY;
      rX = tX;
      var PX = this.m_impulse * this.m_J.linearB.x;
      var PY = this.m_impulse * this.m_J.linearB.y;
      return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
   }
   b2GearJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   }
   b2GearJoint.prototype.SetRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_ratio = ratio;
   }
   b2GearJoint.prototype.b2GearJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var type1 = parseInt(def.joint1.m_type);
      var type2 = parseInt(def.joint2.m_type);
      this.m_revolute1 = null;
      this.m_prismatic1 = null;
      this.m_revolute2 = null;
      this.m_prismatic2 = null;
      var coordinate1 = 0;
      var coordinate2 = 0;
      this.m_ground1 = def.joint1.GetBodyA();
      this.m_bodyA = def.joint1.GetBodyB();
      if (type1 == b2Joint.e_revoluteJoint) {
         this.m_revolute1 = (def.joint1 instanceof b2RevoluteJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         this.m_prismatic1 = (def.joint1 instanceof b2PrismaticJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      this.m_ground2 = def.joint2.GetBodyA();
      this.m_bodyB = def.joint2.GetBodyB();
      if (type2 == b2Joint.e_revoluteJoint) {
         this.m_revolute2 = (def.joint2 instanceof b2RevoluteJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         this.m_prismatic2 = (def.joint2 instanceof b2PrismaticJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      this.m_ratio = def.ratio;
      this.m_constant = coordinate1 + this.m_ratio * coordinate2;
      this.m_impulse = 0.0;
   }
   b2GearJoint.prototype.InitVelocityConstraints = function (step) {
      var g1 = this.m_ground1;
      var g2 = this.m_ground2;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var ugX = 0;
      var ugY = 0;
      var rX = 0;
      var rY = 0;
      var tMat;
      var tVec;
      var crug = 0;
      var tX = 0;
      var K = 0.0;
      this.m_J.SetZero();
      if (this.m_revolute1) {
         this.m_J.angularA = (-1.0);
         K += bA.m_invI;
      }
      else {
         tMat = g1.m_xf.R;
         tVec = this.m_prismatic1.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bA.m_xf.R;
         rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearA.Set((-ugX), (-ugY));
         this.m_J.angularA = (-crug);
         K += bA.m_invMass + bA.m_invI * crug * crug;
      }
      if (this.m_revolute2) {
         this.m_J.angularB = (-this.m_ratio);
         K += this.m_ratio * this.m_ratio * bB.m_invI;
      }
      else {
         tMat = g2.m_xf.R;
         tVec = this.m_prismatic2.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bB.m_xf.R;
         rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearB.Set((-this.m_ratio * ugX), (-this.m_ratio * ugY));
         this.m_J.angularB = (-this.m_ratio * crug);
         K += this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
      }
      this.m_mass = K > 0.0 ? 1.0 / K : 0.0;
      if (step.warmStarting) {
         bA.m_linearVelocity.x += bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
         bA.m_linearVelocity.y += bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
         bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
         bB.m_linearVelocity.x += bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
         bB.m_linearVelocity.y += bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
         bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
      }
      else {
         this.m_impulse = 0.0;
      }
   }
   b2GearJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var Cdot = this.m_J.Compute(bA.m_linearVelocity, bA.m_angularVelocity, bB.m_linearVelocity, bB.m_angularVelocity);
      var impulse = (-this.m_mass * Cdot);
      this.m_impulse += impulse;
      bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
   }
   b2GearJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var linearError = 0.0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var coordinate1 = 0;
      var coordinate2 = 0;
      if (this.m_revolute1) {
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      if (this.m_revolute2) {
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
      var impulse = (-this.m_mass * C);
      bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError < b2Settings.b2_linearSlop;
   }
   Box2D.inherit(b2GearJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2GearJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2GearJointDef.b2GearJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
   };
   b2GearJointDef.prototype.b2GearJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_gearJoint;
      this.joint1 = null;
      this.joint2 = null;
      this.ratio = 1.0;
   }
   b2Jacobian.b2Jacobian = function () {
      this.linearA = new b2Vec2();
      this.linearB = new b2Vec2();
   };
   b2Jacobian.prototype.SetZero = function () {
      this.linearA.SetZero();
      this.angularA = 0.0;
      this.linearB.SetZero();
      this.angularB = 0.0;
   }
   b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
      if (a1 === undefined) a1 = 0;
      if (a2 === undefined) a2 = 0;
      this.linearA.SetV(x1);
      this.angularA = a1;
      this.linearB.SetV(x2);
      this.angularB = a2;
   }
   b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
      if (a1 === undefined) a1 = 0;
      if (a2 === undefined) a2 = 0;
      return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
   }
   b2Joint.b2Joint = function () {
      this.m_edgeA = new b2JointEdge();
      this.m_edgeB = new b2JointEdge();
      this.m_localCenterA = new b2Vec2();
      this.m_localCenterB = new b2Vec2();
   };
   b2Joint.prototype.GetType = function () {
      return this.m_type;
   }
   b2Joint.prototype.GetAnchorA = function () {
      return null;
   }
   b2Joint.prototype.GetAnchorB = function () {
      return null;
   }
   b2Joint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return null;
   }
   b2Joint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2Joint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   }
   b2Joint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   }
   b2Joint.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Joint.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Joint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Joint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   }
   b2Joint.Create = function (def, allocator) {
      var joint = null;
      switch (def.type) {
      case b2Joint.e_distanceJoint:
         {
            joint = new b2DistanceJoint((def instanceof b2DistanceJointDef ? def : null));
         }
         break;
      case b2Joint.e_mouseJoint:
         {
            joint = new b2MouseJoint((def instanceof b2MouseJointDef ? def : null));
         }
         break;
      case b2Joint.e_prismaticJoint:
         {
            joint = new b2PrismaticJoint((def instanceof b2PrismaticJointDef ? def : null));
         }
         break;
      case b2Joint.e_revoluteJoint:
         {
            joint = new b2RevoluteJoint((def instanceof b2RevoluteJointDef ? def : null));
         }
         break;
      case b2Joint.e_pulleyJoint:
         {
            joint = new b2PulleyJoint((def instanceof b2PulleyJointDef ? def : null));
         }
         break;
      case b2Joint.e_gearJoint:
         {
            joint = new b2GearJoint((def instanceof b2GearJointDef ? def : null));
         }
         break;
      case b2Joint.e_lineJoint:
         {
            joint = new b2LineJoint((def instanceof b2LineJointDef ? def : null));
         }
         break;
      case b2Joint.e_weldJoint:
         {
            joint = new b2WeldJoint((def instanceof b2WeldJointDef ? def : null));
         }
         break;
      case b2Joint.e_frictionJoint:
         {
            joint = new b2FrictionJoint((def instanceof b2FrictionJointDef ? def : null));
         }
         break;
      default:
         break;
      }
      return joint;
   }
   b2Joint.Destroy = function (joint, allocator) {}
   b2Joint.prototype.b2Joint = function (def) {
      b2Settings.b2Assert(def.bodyA != def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   }
   b2Joint.prototype.InitVelocityConstraints = function (step) {}
   b2Joint.prototype.SolveVelocityConstraints = function (step) {}
   b2Joint.prototype.FinalizeVelocityConstraints = function () {}
   b2Joint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return false;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0;
      Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1;
      Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2;
      Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3;
      Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4;
      Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5;
      Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6;
      Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7;
      Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8;
      Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9;
      Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0;
      Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1;
      Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2;
      Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3;
   });
   b2JointDef.b2JointDef = function () {};
   b2JointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   }
   b2JointEdge.b2JointEdge = function () {};
   Box2D.inherit(b2LineJoint, Box2D.Dynamics.Joints.b2Joint);
   b2LineJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2LineJoint.b2LineJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_axis = new b2Vec2();
      this.m_perp = new b2Vec2();
      this.m_K = new b2Mat22();
      this.m_impulse = new b2Vec2();
   };
   b2LineJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2LineJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2LineJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
   }
   b2LineJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.y;
   }
   b2LineJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var p1 = bA.GetWorldPoint(this.m_localAnchor1);
      var p2 = bB.GetWorldPoint(this.m_localAnchor2);
      var dX = p2.x - p1.x;
      var dY = p2.y - p1.y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var translation = axis.x * dX + axis.y * dY;
      return translation;
   }
   b2LineJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var v1 = bA.m_linearVelocity;
      var v2 = bB.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var w2 = bB.m_angularVelocity;
      var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
      return speed;
   }
   b2LineJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2LineJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   }
   b2LineJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   }
   b2LineJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   }
   b2LineJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   }
   b2LineJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   }
   b2LineJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   }
   b2LineJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2LineJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2LineJoint.prototype.SetMaxMotorForce = function (force) {
      if (force === undefined) force = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   }
   b2LineJoint.prototype.GetMaxMotorForce = function () {
      return this.m_maxMotorForce;
   }
   b2LineJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   }
   b2LineJoint.prototype.b2LineJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_impulse.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   }
   b2LineJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform();
      var xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1.0 / this.m_motorMass : 0.0;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA;
         var m2 = this.m_invMassB;
         var i1 = this.m_invIA;
         var i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.y = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
         var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
         var L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
         var L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2LineJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var PX = 0;
      var PY = 0;
      var L1 = 0;
      var L2 = 0;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var f1 = this.m_impulse.Copy();
         var df = this.m_K.Solve(new b2Vec2(), (-Cdot1), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState == b2Joint.e_atLowerLimit) {
            this.m_impulse.y = b2Math.Max(this.m_impulse.y, 0.0);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            this.m_impulse.y = b2Math.Min(this.m_impulse.y, 0.0);
         }
         var b = (-Cdot1) - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
         var f2r = 0;
         if (this.m_K.col1.x != 0.0) {
            f2r = b / this.m_K.col1.x + f1.x;
         }
         else {
            f2r = f1.x;
         }
         this.m_impulse.x = f2r;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y * this.m_a1;
         L2 = df.x * this.m_s2 + df.y * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = 0;
         if (this.m_K.col1.x != 0.0) {
            df2 = ((-Cdot1)) / this.m_K.col1.x;
         }
         else {
            df2 = 0.0;
         }
         this.m_impulse.x += df2;
         PX = df2 * this.m_perp.x;
         PY = df2 * this.m_perp.y;
         L1 = df2 * this.m_s1;
         L2 = df2 * this.m_s2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2LineJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var limitC = 0;
      var oldLimitImpulse = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var c1 = bA.m_sweep.c;
      var a1 = bA.m_sweep.a;
      var c2 = bB.m_sweep.c;
      var a2 = bB.m_sweep.a;
      var tMat;
      var tX = 0;
      var m1 = 0;
      var m2 = 0;
      var i1 = 0;
      var i2 = 0;
      var linearError = 0.0;
      var angularError = 0.0;
      var active = false;
      var C2 = 0.0;
      var R1 = b2Mat22.FromAngle(a1);
      var R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X;
      var dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec2();
      var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1));
      angularError = 0.0;
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve(impulse, (-C1), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         var impulse1 = 0;
         if (k11 != 0.0) {
            impulse1 = ((-C1)) / k11;
         }
         else {
            impulse1 = 0.0;
         }
         impulse.x = impulse1;
         impulse.y = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
      var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
      var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
      var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2LineJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2LineJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2LineJointDef.b2LineJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
      this.localAxisA = new b2Vec2();
   };
   b2LineJointDef.prototype.b2LineJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_lineJoint;
      this.localAxisA.Set(1.0, 0.0);
      this.enableLimit = false;
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.enableMotor = false;
      this.maxMotorForce = 0.0;
      this.motorSpeed = 0.0;
   }
   b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
   }
   Box2D.inherit(b2MouseJoint, Box2D.Dynamics.Joints.b2Joint);
   b2MouseJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2MouseJoint.b2MouseJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.m_localAnchor = new b2Vec2();
      this.m_target = new b2Vec2();
      this.m_impulse = new b2Vec2();
      this.m_mass = new b2Mat22();
      this.m_C = new b2Vec2();
   };
   b2MouseJoint.prototype.GetAnchorA = function () {
      return this.m_target;
   }
   b2MouseJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor);
   }
   b2MouseJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2MouseJoint.prototype.GetTarget = function () {
      return this.m_target;
   }
   b2MouseJoint.prototype.SetTarget = function (target) {
      if (this.m_bodyB.IsAwake() == false) {
         this.m_bodyB.SetAwake(true);
      }
      this.m_target = target;
   }
   b2MouseJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   }
   b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
      if (maxForce === undefined) maxForce = 0;
      this.m_maxForce = maxForce;
   }
   b2MouseJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   }
   b2MouseJoint.prototype.SetFrequency = function (hz) {
      if (hz === undefined) hz = 0;
      this.m_frequencyHz = hz;
   }
   b2MouseJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   }
   b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_dampingRatio = ratio;
   }
   b2MouseJoint.prototype.b2MouseJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_target.SetV(def.target);
      var tX = this.m_target.x - this.m_bodyB.m_xf.position.x;
      var tY = this.m_target.y - this.m_bodyB.m_xf.position.y;
      var tMat = this.m_bodyB.m_xf.R;
      this.m_localAnchor.x = (tX * tMat.col1.x + tY * tMat.col1.y);
      this.m_localAnchor.y = (tX * tMat.col2.x + tY * tMat.col2.y);
      this.m_maxForce = def.maxForce;
      this.m_impulse.SetZero();
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
      this.m_beta = 0.0;
      this.m_gamma = 0.0;
   }
   b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
      var b = this.m_bodyB;
      var mass = b.GetMass();
      var omega = 2.0 * Math.PI * this.m_frequencyHz;
      var d = 2.0 * mass * this.m_dampingRatio * omega;
      var k = mass * omega * omega;
      this.m_gamma = step.dt * (d + step.dt * k);
      this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0.0;
      this.m_beta = step.dt * k * this.m_gamma;
      var tMat;tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
      var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * rX + tMat.col2.x * rY);rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var invMass = b.m_invMass;
      var invI = b.m_invI;this.K1.col1.x = invMass;
      this.K1.col2.x = 0.0;
      this.K1.col1.y = 0.0;
      this.K1.col2.y = invMass;
      this.K2.col1.x = invI * rY * rY;
      this.K2.col2.x = (-invI * rX * rY);
      this.K2.col1.y = (-invI * rX * rY);
      this.K2.col2.y = invI * rX * rX;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.col1.x += this.m_gamma;
      this.K.col2.y += this.m_gamma;
      this.K.GetInverse(this.m_mass);
      this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
      this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
      b.m_angularVelocity *= 0.98;
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      b.m_linearVelocity.x += invMass * this.m_impulse.x;
      b.m_linearVelocity.y += invMass * this.m_impulse.y;
      b.m_angularVelocity += invI * (rX * this.m_impulse.y - rY * this.m_impulse.x);
   }
   b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
      var b = this.m_bodyB;
      var tMat;
      var tX = 0;
      var tY = 0;
      tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
      var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rX + tMat.col2.x * rY);
      rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var CdotX = b.m_linearVelocity.x + ((-b.m_angularVelocity * rY));
      var CdotY = b.m_linearVelocity.y + (b.m_angularVelocity * rX);
      tMat = this.m_mass;
      tX = CdotX + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x;
      tY = CdotY + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
      var impulseX = (-(tMat.col1.x * tX + tMat.col2.x * tY));
      var impulseY = (-(tMat.col1.y * tX + tMat.col2.y * tY));
      var oldImpulseX = this.m_impulse.x;
      var oldImpulseY = this.m_impulse.y;
      this.m_impulse.x += impulseX;
      this.m_impulse.y += impulseY;
      var maxImpulse = step.dt * this.m_maxForce;
      if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
         this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
      }
      impulseX = this.m_impulse.x - oldImpulseX;
      impulseY = this.m_impulse.y - oldImpulseY;
      b.m_linearVelocity.x += b.m_invMass * impulseX;
      b.m_linearVelocity.y += b.m_invMass * impulseY;
      b.m_angularVelocity += b.m_invI * (rX * impulseY - rY * impulseX);
   }
   b2MouseJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return true;
   }
   Box2D.inherit(b2MouseJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2MouseJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2MouseJointDef.b2MouseJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.target = new b2Vec2();
   };
   b2MouseJointDef.prototype.b2MouseJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_mouseJoint;
      this.maxForce = 0.0;
      this.frequencyHz = 5.0;
      this.dampingRatio = 0.7;
   }
   Box2D.inherit(b2PrismaticJoint, Box2D.Dynamics.Joints.b2Joint);
   b2PrismaticJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2PrismaticJoint.b2PrismaticJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_axis = new b2Vec2();
      this.m_perp = new b2Vec2();
      this.m_K = new b2Mat33();
      this.m_impulse = new b2Vec3();
   };
   b2PrismaticJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2PrismaticJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2PrismaticJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
   }
   b2PrismaticJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.y;
   }
   b2PrismaticJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var p1 = bA.GetWorldPoint(this.m_localAnchor1);
      var p2 = bB.GetWorldPoint(this.m_localAnchor2);
      var dX = p2.x - p1.x;
      var dY = p2.y - p1.y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var translation = axis.x * dX + axis.y * dY;
      return translation;
   }
   b2PrismaticJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var v1 = bA.m_linearVelocity;
      var v2 = bB.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var w2 = bB.m_angularVelocity;
      var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
      return speed;
   }
   b2PrismaticJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2PrismaticJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   }
   b2PrismaticJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   }
   b2PrismaticJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   }
   b2PrismaticJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   }
   b2PrismaticJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   }
   b2PrismaticJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   }
   b2PrismaticJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2PrismaticJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2PrismaticJoint.prototype.SetMaxMotorForce = function (force) {
      if (force === undefined) force = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   }
   b2PrismaticJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   }
   b2PrismaticJoint.prototype.b2PrismaticJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_refAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   }
   b2PrismaticJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform();
      var xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         if (this.m_motorMass > Number.MIN_VALUE) this.m_motorMass = 1.0 / this.m_motorMass;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA;
         var m2 = this.m_invMassB;
         var i1 = this.m_invIA;
         var i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x;
         var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y;
         var L1 = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
         var L2 = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2PrismaticJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var PX = 0;
      var PY = 0;
      var L1 = 0;
      var L2 = 0;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1X = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      var Cdot1Y = w2 - w1;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var f1 = this.m_impulse.Copy();
         var df = this.m_K.Solve33(new b2Vec3(), (-Cdot1X), (-Cdot1Y), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState == b2Joint.e_atLowerLimit) {
            this.m_impulse.z = b2Math.Max(this.m_impulse.z, 0.0);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            this.m_impulse.z = b2Math.Min(this.m_impulse.z, 0.0);
         }
         var bX = (-Cdot1X) - (this.m_impulse.z - f1.z) * this.m_K.col3.x;
         var bY = (-Cdot1Y) - (this.m_impulse.z - f1.z) * this.m_K.col3.y;
         var f2r = this.m_K.Solve22(new b2Vec2(), bX, bY);
         f2r.x += f1.x;
         f2r.y += f1.y;
         this.m_impulse.x = f2r.x;
         this.m_impulse.y = f2r.y;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         df.z = this.m_impulse.z - f1.z;
         PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
         L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = this.m_K.Solve22(new b2Vec2(), (-Cdot1X), (-Cdot1Y));
         this.m_impulse.x += df2.x;
         this.m_impulse.y += df2.y;
         PX = df2.x * this.m_perp.x;
         PY = df2.x * this.m_perp.y;
         L1 = df2.x * this.m_s1 + df2.y;
         L2 = df2.x * this.m_s2 + df2.y;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2PrismaticJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var limitC = 0;
      var oldLimitImpulse = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var c1 = bA.m_sweep.c;
      var a1 = bA.m_sweep.a;
      var c2 = bB.m_sweep.c;
      var a2 = bB.m_sweep.a;
      var tMat;
      var tX = 0;
      var m1 = 0;
      var m2 = 0;
      var i1 = 0;
      var i2 = 0;
      var linearError = 0.0;
      var angularError = 0.0;
      var active = false;
      var C2 = 0.0;
      var R1 = b2Mat22.FromAngle(a1);
      var R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X;
      var dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec3();
      var C1X = this.m_perp.x * dX + this.m_perp.y * dY;
      var C1Y = a2 - a1 - this.m_refAngle;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1X));
      angularError = b2Math.Abs(C1Y);
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         var k12 = i1 * this.m_s1 + i2 * this.m_s2;
         var k22 = i1 + i2;
         this.m_K.col1.Set(k11, k12, 0.0);
         this.m_K.col2.Set(k12, k22, 0.0);
         var impulse1 = this.m_K.Solve22(new b2Vec2(), (-C1X), (-C1Y));
         impulse.x = impulse1.x;
         impulse.y = impulse1.y;
         impulse.z = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x;
      var PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y;
      var L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1;
      var L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2PrismaticJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2PrismaticJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2PrismaticJointDef.b2PrismaticJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
      this.localAxisA = new b2Vec2();
   };
   b2PrismaticJointDef.prototype.b2PrismaticJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_prismaticJoint;
      this.localAxisA.Set(1.0, 0.0);
      this.referenceAngle = 0.0;
      this.enableLimit = false;
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.enableMotor = false;
      this.maxMotorForce = 0.0;
      this.motorSpeed = 0.0;
   }
   b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
   Box2D.inherit(b2PulleyJoint, Box2D.Dynamics.Joints.b2Joint);
   b2PulleyJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2PulleyJoint.b2PulleyJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u1 = new b2Vec2();
      this.m_u2 = new b2Vec2();
   };
   b2PulleyJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2PulleyJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2PulleyJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
   }
   b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2PulleyJoint.prototype.GetGroundAnchorA = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor1);
      return a;
   }
   b2PulleyJoint.prototype.GetGroundAnchorB = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor2);
      return a;
   }
   b2PulleyJoint.prototype.GetLength1 = function () {
      var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
      var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var dX = p.x - sX;
      var dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   }
   b2PulleyJoint.prototype.GetLength2 = function () {
      var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
      var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      var dX = p.x - sX;
      var dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   }
   b2PulleyJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   }
   b2PulleyJoint.prototype.b2PulleyJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_ground = this.m_bodyA.m_world.m_groundBody;
      this.m_groundAnchor1.x = def.groundAnchorA.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor1.y = def.groundAnchorA.y - this.m_ground.m_xf.position.y;
      this.m_groundAnchor2.x = def.groundAnchorB.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor2.y = def.groundAnchorB.y - this.m_ground.m_xf.position.y;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_ratio = def.ratio;
      this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
      this.m_maxLength1 = b2Math.Min(def.maxLengthA, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
      this.m_maxLength2 = b2Math.Min(def.maxLengthB, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
      this.m_impulse = 0.0;
      this.m_limitImpulse1 = 0.0;
      this.m_limitImpulse2 = 0.0;
   }
   b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      this.m_u1.Set(p1X - s1X, p1Y - s1Y);
      this.m_u2.Set(p2X - s2X, p2Y - s2Y);
      var length1 = this.m_u1.Length();
      var length2 = this.m_u2.Length();
      if (length1 > b2Settings.b2_linearSlop) {
         this.m_u1.Multiply(1.0 / length1);
      }
      else {
         this.m_u1.SetZero();
      }
      if (length2 > b2Settings.b2_linearSlop) {
         this.m_u2.Multiply(1.0 / length2);
      }
      else {
         this.m_u2.SetZero();
      }
      var C = this.m_constant - length1 - this.m_ratio * length2;
      if (C > 0.0) {
         this.m_state = b2Joint.e_inactiveLimit;
         this.m_impulse = 0.0;
      }
      else {
         this.m_state = b2Joint.e_atUpperLimit;
      }
      if (length1 < this.m_maxLength1) {
         this.m_limitState1 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse1 = 0.0;
      }
      else {
         this.m_limitState1 = b2Joint.e_atUpperLimit;
      }
      if (length2 < this.m_maxLength2) {
         this.m_limitState2 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse2 = 0.0;
      }
      else {
         this.m_limitState2 = b2Joint.e_atUpperLimit;
      }
      var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
      var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
      this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
      this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
      this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
      this.m_limitMass1 = 1.0 / this.m_limitMass1;
      this.m_limitMass2 = 1.0 / this.m_limitMass2;
      this.m_pulleyMass = 1.0 / this.m_pulleyMass;
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         this.m_limitImpulse1 *= step.dtRatio;
         this.m_limitImpulse2 *= step.dtRatio;
         var P1X = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.x;
         var P1Y = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.y;
         var P2X = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.x;
         var P2Y = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.y;
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      else {
         this.m_impulse = 0.0;
         this.m_limitImpulse1 = 0.0;
         this.m_limitImpulse2 = 0.0;
      }
   }
   b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = 0;
      var v1Y = 0;
      var v2X = 0;
      var v2Y = 0;
      var P1X = 0;
      var P1Y = 0;
      var P2X = 0;
      var P2Y = 0;
      var Cdot = 0;
      var impulse = 0;
      var oldImpulse = 0;
      if (this.m_state == b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y)) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
         impulse = this.m_pulleyMass * ((-Cdot));
         oldImpulse = this.m_impulse;
         this.m_impulse = b2Math.Max(0.0, this.m_impulse + impulse);
         impulse = this.m_impulse - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         P2X = (-this.m_ratio * impulse * this.m_u2.x);
         P2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y));
         impulse = (-this.m_limitMass1 * Cdot);
         oldImpulse = this.m_limitImpulse1;
         this.m_limitImpulse1 = b2Math.Max(0.0, this.m_limitImpulse1 + impulse);
         impulse = this.m_limitImpulse1 - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u2.x * v2X + this.m_u2.y * v2Y));
         impulse = (-this.m_limitMass2 * Cdot);
         oldImpulse = this.m_limitImpulse2;
         this.m_limitImpulse2 = b2Math.Max(0.0, this.m_limitImpulse2 + impulse);
         impulse = this.m_limitImpulse2 - oldImpulse;
         P2X = (-impulse * this.m_u2.x);
         P2Y = (-impulse * this.m_u2.y);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
   }
   b2PulleyJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      var r1X = 0;
      var r1Y = 0;
      var r2X = 0;
      var r2Y = 0;
      var p1X = 0;
      var p1Y = 0;
      var p2X = 0;
      var p2Y = 0;
      var length1 = 0;
      var length2 = 0;
      var C = 0;
      var impulse = 0;
      var oldImpulse = 0;
      var oldLimitPositionImpulse = 0;
      var tX = 0;
      var linearError = 0.0;
      if (this.m_state == b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length1 = this.m_u1.Length();
         length2 = this.m_u2.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.Multiply(1.0 / length1);
         }
         else {
            this.m_u1.SetZero();
         }
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.Multiply(1.0 / length2);
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_constant - length1 - this.m_ratio * length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_pulleyMass * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         p2X = (-this.m_ratio * impulse * this.m_u2.x);
         p2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         length1 = this.m_u1.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.x *= 1.0 / length1;
            this.m_u1.y *= 1.0 / length1;
         }
         else {
            this.m_u1.SetZero();
         }
         C = this.m_maxLength1 - length1;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass1 * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bA.SynchronizeTransform();
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length2 = this.m_u2.Length();
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.x *= 1.0 / length2;
            this.m_u2.y *= 1.0 / length2;
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_maxLength2 - length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass2 * C);
         p2X = (-impulse * this.m_u2.x);
         p2Y = (-impulse * this.m_u2.y);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bB.SynchronizeTransform();
      }
      return linearError < b2Settings.b2_linearSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 2.0;
   });
   Box2D.inherit(b2PulleyJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2PulleyJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2PulleyJointDef.b2PulleyJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.groundAnchorA = new b2Vec2();
      this.groundAnchorB = new b2Vec2();
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2PulleyJointDef.prototype.b2PulleyJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_pulleyJoint;
      this.groundAnchorA.Set((-1.0), 1.0);
      this.groundAnchorB.Set(1.0, 1.0);
      this.localAnchorA.Set((-1.0), 0.0);
      this.localAnchorB.Set(1.0, 0.0);
      this.lengthA = 0.0;
      this.maxLengthA = 0.0;
      this.lengthB = 0.0;
      this.maxLengthB = 0.0;
      this.ratio = 1.0;
      this.collideConnected = true;
   }
   b2PulleyJointDef.prototype.Initialize = function (bA, bB, gaA, gaB, anchorA, anchorB, r) {
      if (r === undefined) r = 0;
      this.bodyA = bA;
      this.bodyB = bB;
      this.groundAnchorA.SetV(gaA);
      this.groundAnchorB.SetV(gaB);
      this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
      var d1X = anchorA.x - gaA.x;
      var d1Y = anchorA.y - gaA.y;
      this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
      var d2X = anchorB.x - gaB.x;
      var d2Y = anchorB.y - gaB.y;
      this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
      this.ratio = r;
      var C = this.lengthA + this.ratio * this.lengthB;
      this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
      this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
   }
   Box2D.inherit(b2RevoluteJoint, Box2D.Dynamics.Joints.b2Joint);
   b2RevoluteJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2RevoluteJoint.b2RevoluteJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.K3 = new b2Mat22();
      this.impulse3 = new b2Vec3();
      this.impulse2 = new b2Vec2();
      this.reduced = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_impulse = new b2Vec3();
      this.m_mass = new b2Mat33();
   };
   b2RevoluteJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2RevoluteJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.z;
   }
   b2RevoluteJoint.prototype.GetJointAngle = function () {
      return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
   }
   b2RevoluteJoint.prototype.GetJointSpeed = function () {
      return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
   }
   b2RevoluteJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2RevoluteJoint.prototype.EnableLimit = function (flag) {
      this.m_enableLimit = flag;
   }
   b2RevoluteJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerAngle;
   }
   b2RevoluteJoint.prototype.GetUpperLimit = function () {
      return this.m_upperAngle;
   }
   b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_lowerAngle = lower;
      this.m_upperAngle = upper;
   }
   b2RevoluteJoint.prototype.IsMotorEnabled = function () {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      return this.m_enableMotor;
   }
   b2RevoluteJoint.prototype.EnableMotor = function (flag) {
      this.m_enableMotor = flag;
   }
   b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2RevoluteJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
      if (torque === undefined) torque = 0;
      this.m_maxMotorTorque = torque;
   }
   b2RevoluteJoint.prototype.GetMotorTorque = function () {
      return this.m_maxMotorTorque;
   }
   b2RevoluteJoint.prototype.b2RevoluteJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_motorImpulse = 0.0;
      this.m_lowerAngle = def.lowerAngle;
      this.m_upperAngle = def.upperAngle;
      this.m_maxMotorTorque = def.maxMotorTorque;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
   }
   b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      if (this.m_enableMotor || this.m_enableLimit) {}
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var m1 = bA.m_invMass;
      var m2 = bB.m_invMass;
      var i1 = bA.m_invI;
      var i2 = bB.m_invI;
      this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
      this.m_mass.col2.x = (-r1Y * r1X * i1) - r2Y * r2X * i2;
      this.m_mass.col3.x = (-r1Y * i1) - r2Y * i2;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
      this.m_mass.col3.y = r1X * i1 + r2X * i2;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = i1 + i2;
      this.m_motorMass = 1.0 / (i1 + i2);
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (this.m_enableLimit) {
         var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         if (b2Math.Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointAngle <= this.m_lowerAngle) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atLowerLimit;
         }
         else if (jointAngle >= this.m_upperAngle) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atUpperLimit;
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x;
         var PY = this.m_impulse.y;
         bA.m_linearVelocity.x -= m1 * PX;
         bA.m_linearVelocity.y -= m1 * PY;
         bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
         bB.m_linearVelocity.x += m2 * PX;
         bB.m_linearVelocity.y += m2 * PY;
         bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      var newImpulse = 0;
      var r1X = 0;
      var r1Y = 0;
      var r2X = 0;
      var r2Y = 0;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var m1 = bA.m_invMass;
      var m2 = bB.m_invMass;
      var i1 = bA.m_invI;
      var i2 = bB.m_invI;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = w2 - w1 - this.m_motorSpeed;
         var impulse = this.m_motorMass * ((-Cdot));
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorTorque;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         w1 -= i1 * impulse;
         w2 += i2 * impulse;
      }
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var Cdot1X = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
         var Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         var Cdot2 = w2 - w1;
         this.m_mass.Solve33(this.impulse3, (-Cdot1X), (-Cdot1Y), (-Cdot2));
         if (this.m_limitState == b2Joint.e_equalLimits) {
            this.m_impulse.Add(this.impulse3);
         }
         else if (this.m_limitState == b2Joint.e_atLowerLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse < 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse > 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         v1.x -= m1 * this.impulse3.x;
         v1.y -= m1 * this.impulse3.y;
         w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
         v2.x += m2 * this.impulse3.x;
         v2.y += m2 * this.impulse3.y;
         w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
      }
      else {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CdotX = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
         var CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         this.m_mass.Solve22(this.impulse2, (-CdotX), (-CdotY));
         this.m_impulse.x += this.impulse2.x;
         this.m_impulse.y += this.impulse2.y;
         v1.x -= m1 * this.impulse2.x;
         v1.y -= m1 * this.impulse2.y;
         w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
         v2.x += m2 * this.impulse2.x;
         v2.y += m2 * this.impulse2.y;
         w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2RevoluteJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var oldLimitImpulse = 0;
      var C = 0;
      var tMat;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var angularError = 0.0;
      var positionError = 0.0;
      var tX = 0;
      var impulseX = 0;
      var impulseY = 0;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         var limitImpulse = 0.0;
         if (this.m_limitState == b2Joint.e_equalLimits) {
            C = b2Math.Clamp(angle - this.m_lowerAngle, (-b2Settings.b2_maxAngularCorrection), b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
            angularError = b2Math.Abs(C);
         }
         else if (this.m_limitState == b2Joint.e_atLowerLimit) {
            C = angle - this.m_lowerAngle;
            angularError = (-C);
            C = b2Math.Clamp(C + b2Settings.b2_angularSlop, (-b2Settings.b2_maxAngularCorrection), 0.0);
            limitImpulse = (-this.m_motorMass * C);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            C = angle - this.m_upperAngle;
            angularError = C;
            C = b2Math.Clamp(C - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
         }
         bA.m_sweep.a -= bA.m_invI * limitImpulse;
         bB.m_sweep.a += bB.m_invI * limitImpulse;
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      } {
         tMat = bA.m_xf.R;
         var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
         var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         var CLengthSquared = CX * CX + CY * CY;
         var CLength = Math.sqrt(CLengthSquared);
         positionError = CLength;
         var invMass1 = bA.m_invMass;
         var invMass2 = bB.m_invMass;
         var invI1 = bA.m_invI;
         var invI2 = bB.m_invI;
         var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
         if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
            var uX = CX / CLength;
            var uY = CY / CLength;
            var k = invMass1 + invMass2;
            var m = 1.0 / k;
            impulseX = m * ((-CX));
            impulseY = m * ((-CY));
            var k_beta = 0.5;
            bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
            bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
            bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
            bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
            CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
            CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         }
         this.K1.col1.x = invMass1 + invMass2;
         this.K1.col2.x = 0.0;
         this.K1.col1.y = 0.0;
         this.K1.col2.y = invMass1 + invMass2;
         this.K2.col1.x = invI1 * r1Y * r1Y;
         this.K2.col2.x = (-invI1 * r1X * r1Y);
         this.K2.col1.y = (-invI1 * r1X * r1Y);
         this.K2.col2.y = invI1 * r1X * r1X;
         this.K3.col1.x = invI2 * r2Y * r2Y;
         this.K3.col2.x = (-invI2 * r2X * r2Y);
         this.K3.col1.y = (-invI2 * r2X * r2Y);
         this.K3.col2.y = invI2 * r2X * r2X;
         this.K.SetM(this.K1);
         this.K.AddM(this.K2);
         this.K.AddM(this.K3);
         this.K.Solve(b2RevoluteJoint.tImpulse, (-CX), (-CY));
         impulseX = b2RevoluteJoint.tImpulse.x;
         impulseY = b2RevoluteJoint.tImpulse.y;
         bA.m_sweep.c.x -= bA.m_invMass * impulseX;
         bA.m_sweep.c.y -= bA.m_invMass * impulseY;
         bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
         bB.m_sweep.c.x += bB.m_invMass * impulseX;
         bB.m_sweep.c.y += bB.m_invMass * impulseY;
         bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = new b2Vec2();
   });
   Box2D.inherit(b2RevoluteJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2RevoluteJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2RevoluteJointDef.b2RevoluteJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2RevoluteJointDef.prototype.b2RevoluteJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_revoluteJoint;
      this.localAnchorA.Set(0.0, 0.0);
      this.localAnchorB.Set(0.0, 0.0);
      this.referenceAngle = 0.0;
      this.lowerAngle = 0.0;
      this.upperAngle = 0.0;
      this.maxMotorTorque = 0.0;
      this.motorSpeed = 0.0;
      this.enableLimit = false;
      this.enableMotor = false;
   }
   b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
   Box2D.inherit(b2WeldJoint, Box2D.Dynamics.Joints.b2Joint);
   b2WeldJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2WeldJoint.b2WeldJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchorA = new b2Vec2();
      this.m_localAnchorB = new b2Vec2();
      this.m_impulse = new b2Vec3();
      this.m_mass = new b2Mat33();
   };
   b2WeldJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   }
   b2WeldJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   }
   b2WeldJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.z;
   }
   b2WeldJoint.prototype.b2WeldJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_mass = new b2Mat33();
   }
   b2WeldJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_impulse.z *= step.dtRatio;
         bA.m_linearVelocity.x -= mA * this.m_impulse.x;
         bA.m_linearVelocity.y -= mA * this.m_impulse.y;
         bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
         bB.m_linearVelocity.x += mB * this.m_impulse.x;
         bB.m_linearVelocity.y += mB * this.m_impulse.y;
         bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
      }
   }
   b2WeldJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var vA = bA.m_linearVelocity;
      var wA = bA.m_angularVelocity;
      var vB = bB.m_linearVelocity;
      var wB = bB.m_angularVelocity;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
      var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
      var Cdot2 = wB - wA;
      var impulse = new b2Vec3();
      this.m_mass.Solve33(impulse, (-Cdot1X), (-Cdot1Y), (-Cdot2));
      this.m_impulse.Add(impulse);
      vA.x -= mA * impulse.x;
      vA.y -= mA * impulse.y;
      wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      vB.x += mB * impulse.x;
      vB.y += mB * impulse.y;
      wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   }
   b2WeldJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
      var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
      var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
      var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
      var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
      var angularError = b2Math.Abs(C2);
      if (positionError > k_allowedStretch) {
         iA *= 1.0;
         iB *= 1.0;
      }
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      var impulse = new b2Vec3();
      this.m_mass.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      bA.m_sweep.c.x -= mA * impulse.x;
      bA.m_sweep.c.y -= mA * impulse.y;
      bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      bB.m_sweep.c.x += mB * impulse.x;
      bB.m_sweep.c.y += mB * impulse.y;
      bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2WeldJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2WeldJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2WeldJointDef.b2WeldJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2WeldJointDef.prototype.b2WeldJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_weldJoint;
      this.referenceAngle = 0.0;
   }
   b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
})();
(function () {
   var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
   b2DebugDraw.b2DebugDraw = function () {
      this.m_drawScale = 1.0;
      this.m_lineThickness = 1.0;
      this.m_alpha = 1.0;
      this.m_fillAlpha = 1.0;
      this.m_xformScale = 1.0;
      var __this = this;
      //#WORKAROUND
      this.m_sprite = {
         graphics: {
            clear: function () {
               __this.m_ctx.clearRect(0, 0, __this.m_ctx.canvas.width, __this.m_ctx.canvas.height)
            }
         }
      };
   };
   b2DebugDraw.prototype._color = function (color, alpha) {
      return "rgba(" + ((color & 0xFF0000) >> 16) + "," + ((color & 0xFF00) >> 8) + "," + (color & 0xFF) + "," + alpha + ")";
   };
   b2DebugDraw.prototype.b2DebugDraw = function () {
      this.m_drawFlags = 0;
   };
   b2DebugDraw.prototype.SetFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags = flags;
   };
   b2DebugDraw.prototype.GetFlags = function () {
      return this.m_drawFlags;
   };
   b2DebugDraw.prototype.AppendFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags |= flags;
   };
   b2DebugDraw.prototype.ClearFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags &= ~flags;
   };
   b2DebugDraw.prototype.SetSprite = function (sprite) {
      this.m_ctx = sprite;
   };
   b2DebugDraw.prototype.GetSprite = function () {
      return this.m_ctx;
   };
   b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
      if (drawScale === undefined) drawScale = 0;
      this.m_drawScale = drawScale;
   };
   b2DebugDraw.prototype.GetDrawScale = function () {
      return this.m_drawScale;
   };
   b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
      if (lineThickness === undefined) lineThickness = 0;
      this.m_lineThickness = lineThickness;
      this.m_ctx.strokeWidth = lineThickness;
   };
   b2DebugDraw.prototype.GetLineThickness = function () {
      return this.m_lineThickness;
   };
   b2DebugDraw.prototype.SetAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
      this.m_alpha = alpha;
   };
   b2DebugDraw.prototype.GetAlpha = function () {
      return this.m_alpha;
   };
   b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
      this.m_fillAlpha = alpha;
   };
   b2DebugDraw.prototype.GetFillAlpha = function () {
      return this.m_fillAlpha;
   };
   b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
      if (xformScale === undefined) xformScale = 0;
      this.m_xformScale = xformScale;
   };
   b2DebugDraw.prototype.GetXFormScale = function () {
      return this.m_xformScale;
   };
   b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
      if (!vertexCount) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      for (var i = 1; i < vertexCount; i++) {
         s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
      }
      s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
      if (!vertexCount) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      for (var i = 1; i < vertexCount; i++) {
         s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
      }
      s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      s.closePath();
      s.fill();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
      if (!radius) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.arc(center.x * drawScale, center.y * drawScale, radius * drawScale, 0, Math.PI * 2, true);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
      if (!radius) return;
      var s = this.m_ctx,
         drawScale = this.m_drawScale,
         cx = center.x * drawScale,
         cy = center.y * drawScale;
      s.moveTo(0, 0);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
      s.moveTo(cx, cy);
      s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
      s.closePath();
      s.fill();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
      var s = this.m_ctx,
         drawScale = this.m_drawScale;
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.beginPath();
      s.moveTo(p1.x * drawScale, p1.y * drawScale);
      s.lineTo(p2.x * drawScale, p2.y * drawScale);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawTransform = function (xf) {
      var s = this.m_ctx,
         drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(0xff0000, this.m_alpha);
      s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
      s.lineTo((xf.position.x + this.m_xformScale * xf.R.col1.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col1.y) * drawScale);

      s.strokeStyle = this._color(0xff00, this.m_alpha);
      s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
      s.lineTo((xf.position.x + this.m_xformScale * xf.R.col2.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col2.y) * drawScale);
      s.closePath();
      s.stroke();
   };
})(); //post-definitions
var i;
for (i = 0; i < Box2D.postDefs.length; ++i) Box2D.postDefs[i]();
delete Box2D.postDefs;
/* Attach iio to box2dWeb
-------------------------
*/
if (typeof Box2D !== 'undefined'){
  Box2D.Dynamics.Joints.b2Joint.prototype.set = iio.Drawable.prototype.set;
  Box2D.Dynamics.Joints.b2Joint.prototype.convert_props = iio.Drawable.prototype.convert_props;
  Box2D.Collision.Shapes.b2Shape.prototype.set = iio.Drawable.prototype.set;
  Box2D.Collision.Shapes.b2Shape.prototype.convert_props = iio.Drawable.prototype.convert_props;
  Box2D.Collision.Shapes.b2CircleShape.prototype.set = iio.Drawable.prototype.set;
  Box2D.Collision.Shapes.b2CircleShape.prototype.convert_props = iio.Ellipse.prototype.convert_props;
  Box2D.Collision.Shapes.b2Shape.prototype.playAnim=iio.Shape.prototype.playAnim;
  Box2D.Collision.Shapes.b2Shape.prototype.stopAnim=iio.Shape.prototype.stopAnim;
  Box2D.Collision.Shapes.b2Shape.prototype.setSprite=iio.Shape.prototype.setSprite;
  Box2D.Collision.Shapes.b2Shape.prototype.nextFrame=iio.Shape.prototype.nextFrame;
  Box2D.Collision.Shapes.b2Shape.prototype.prevFrame=iio.Shape.prototype.prevFrame;
  Box2D.Collision.Shapes.b2Shape.prototype.orient_ctx=iio.Shape.prototype.orient_ctx;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_color=iio.Shape.prototype.prep_ctx_color;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_outline=iio.Shape.prototype.prep_ctx_outline;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_lineWidth=iio.Shape.prototype.prep_ctx_lineWidth;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_shadow=iio.Shape.prototype.prep_ctx_shadow;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_dash=iio.Shape.prototype.prep_ctx_dash;
  Box2D.Collision.Shapes.b2Shape.prototype.finish_path_shape=iio.Shape.prototype.finish_path_shape;
  Box2D.Collision.Shapes.b2Shape.prototype.draw_obj=iio.Shape.prototype.draw_obj;
  Box2D.Collision.Shapes.b2Shape.prototype.draw=iio.Shape.prototype.draw;
  Box2D.Collision.Shapes.b2CircleShape.prototype.draw_shape = iio.Ellipse.prototype.draw_shape;
  Box2D.Collision.Shapes.b2PolygonShape.prototype.draw_shape = iio.Polygon.prototype.draw_shape;
  Box2D.Dynamics.Joints.b2Joint.prototype.orient_ctx = iio.Shape.prototype.orient_ctx;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_color = iio.Line.prototype.prep_ctx_color;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_lineWidth=iio.Line.prototype.prep_ctx_lineWidth;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_shadow=iio.Shape.prototype.prep_ctx_shadow;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_dash=iio.Shape.prototype.prep_ctx_dash;
  Box2D.Dynamics.Joints.b2Joint.prototype.draw_obj=iio.Shape.prototype.draw_obj;
  Box2D.Dynamics.Joints.b2Joint.prototype.draw = function(ctx){
    this.draw_obj(ctx);
  }
  Box2D.Dynamics.Joints.b2Joint.prototype.draw_shape = function(ctx){
    var b1 = this.GetBodyA();
    var b2 = this.GetBodyB();
    var xf1 = b1.m_xf;
    var xf2 = b2.m_xf;
    var x1 = xf1.position;
    var x2 = xf2.position;
    var p1 = this.GetAnchorA();
    var p2 = this.GetAnchorB();
    ctx.beginPath();
    switch (this.m_type) {
      case Box2D.Dynamics.Joints.b2Joint.e_distanceJoint:
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
          break;
      case Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint:
        var pulley = ((this instanceof b2PulleyJoint ? this : null));
        var s1 = pulley.GetGroundAnchorA();
        var s2 = pulley.GetGroundAnchorB();
        ctx.moveTo(s1.x*this.app.b2Scale,s1.y*this.app.b2Scale);
        ctx.lineTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.moveTo(s2.x*this.app.b2Scale,s2.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        ctx.moveTo(s1.x*this.app.b2Scale,s1.y*this.app.b2Scale);
        ctx.lineTo(s2.x*this.app.b2Scale,s2.y*this.app.b2Scale);
          break;
      case Box2D.Dynamics.Joints.b2Joint.e_mouseJoint:
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
          break;
      default:
        if (b1 != this.m_groundBody) {
          ctx.moveTo(x1.x*this.app.b2Scale,x1.y*this.app.b2Scale);
          ctx.lineTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        }
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        if (b2 != this.m_groundBody){
          ctx.moveTo(x2.x*this.app.b2Scale,x2.y*this.app.b2Scale);
          ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        }
     }
     ctx.stroke();
  }
  Box2D.Dynamics.b2Body.prototype.draw = function(ctx){
    for (f=this.m_fixtureList;f;f=f.m_next){
      s=f.GetShape(); 
      s.radius=s.m_radius*this.app.b2Scale;
      s.pos=new iio.Vector(
        this.m_xf.position.x*this.app.b2Scale,
        this.m_xf.position.y*this.app.b2Scale);
      s.rotation=this.GetAngle();
      if (s.m_vertices){
        s.vs=[];
        for (var i=0; i<s.m_vertices.length; i++)
          s.vs.push(new iio.Vector(
            s.m_vertices[i].x*this.app.b2Scale,
            s.m_vertices[i].y*this.app.b2Scale));
      }
      if(s.draw) s.draw(ctx);
    }
  }

  // iio.App
  //-------------------------------------------------------------------
  iio.App.prototype.addB2World = function(world,c){
    this.b2World = world;
    this.b2Scale = 30;
    this.b2Cnv = c||0;
    return world;
  }
  iio.App.prototype.b2Loop = function( fps, callback ){
    this.b2lastTime = this.b2lastTime || 0;
    if (this.b2World && !this.b2Pause)
      this.b2World.Step(1/this.fps, 10, 10);
    iio.requestTimeout(fps, this.b2lastTime, function(dt,args){
      args[0].b2lastTime = dt;
      args[0].b2Loop(fps,callback);
      if (args[0].b2World && !args[0].b2Pause)
        args[0].b2World.Step(1/fps, 10, 10);
      callback(dt);
      if (args[0].b2DebugDraw && args[0].b2DebugDraw)
        args[0].b2World.DrawDebugData();
      else args[0].draw(args[0].b2Cnv);
      if (this.b2World)
        args[0].b2World.ClearForces();
    }, [this]);
    return this;
  }
  iio.App.prototype.pauseB2World = function(pause){
    if (typeof pause === 'undefined'){
      if (typeof this.b2Pause === 'undefined')
        this.b2Pause = true;
      else this.b2Pause = !this.b2Pause;
    } else this.b2Pause = pause;
    return this;
  }
  iio.App.prototype.activateB2Debugger = function(turnOn,c){
    turnOn = turnOn||true;
    c = c||0;
    if (turnOn){
      this.b2DebugDraw = new Box2D.Dynamics.b2DebugDraw();
      this.b2DebugDraw.SetSprite(this.ctxs[c]);
      this.b2DebugDraw.SetDrawScale(this.b2Scale);
      this.b2DebugDraw.SetFillAlpha(0.5)
      this.b2DebugDraw.SetLineThickness(1.0)
      this.b2DebugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit)
      this.b2World.SetDebugDraw(this.b2DebugDraw);
      return this.b2DebugDraw;
    }
  }
  iio.App.prototype.b2BodyAt = function(callback,v,y){
    if (typeof v.x === 'undefined')
      v = new Box2D.Common.Math.b2Vec2(v,y);
    var aabb = new Box2D.Collision.b2AABB();
    aabb.lowerBound.Set(v.x - 0.001, v.y - 0.001);
    aabb.upperBound.Set(v.x + 0.001, v.y + 0.001);
    function getBodyCB(fixture){
      if(fixture.GetBody().GetType() !== Box2D.Dynamics.b2Body.b2_staticBody) 
      if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), v)) 
        return fixture.GetBody();
      return false;
    }
    return this.b2World.QueryAABB(getBodyCB, aabb);
  }
}
/**
 * CoffeeScript Compiler v1.9.1
 * http://coffeescript.org
 *
 * Copyright 2011, Jeremy Ashkenas
 * Released under the MIT License
 */
(function(root){var CoffeeScript=function(){function require(e){return require[e]}return require["./helpers"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o;e.starts=function(e,t,n){return t===e.substr(n,t.length)},e.ends=function(e,t,n){var i;return i=t.length,t===e.substr(e.length-i-(n||0),i)},e.repeat=s=function(e,t){var n;for(n="";t>0;)1&t&&(n+=e),t>>>=1,e+=e;return n},e.compact=function(e){var t,n,i,r;for(r=[],t=0,i=e.length;i>t;t++)n=e[t],n&&r.push(n);return r},e.count=function(e,t){var n,i;if(n=i=0,!t.length)return 1/0;for(;i=1+e.indexOf(t,i);)n++;return n},e.merge=function(e,t){return n(n({},e),t)},n=e.extend=function(e,t){var n,i;for(n in t)i=t[n],e[n]=i;return e},e.flatten=i=function(e){var t,n,r,s;for(n=[],r=0,s=e.length;s>r;r++)t=e[r],t instanceof Array?n=n.concat(i(t)):n.push(t);return n},e.del=function(e,t){var n;return n=e[t],delete e[t],n},e.some=null!=(r=Array.prototype.some)?r:function(e){var t,n,i;for(n=0,i=this.length;i>n;n++)if(t=this[n],e(t))return!0;return!1},e.invertLiterate=function(e){var t,n,i;return i=!0,n=function(){var n,r,s,o;for(s=e.split("\n"),o=[],n=0,r=s.length;r>n;n++)t=s[n],i&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?o.push(t):(i=/^\s*$/.test(t))?o.push(t):o.push("# "+t);return o}(),n.join("\n")},t=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},e.addLocationDataFn=function(e,n){return function(i){return"object"==typeof i&&i.updateLocationDataIfMissing&&i.updateLocationDataIfMissing(t(e,n)),i}},e.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?t.first_line+1+":"+(t.first_column+1)+"-"+(t.last_line+1+":"+(t.last_column+1)):"No location data"},e.baseFileName=function(e,t,n){var i,r;return null==t&&(t=!1),null==n&&(n=!1),r=n?/\\|\//:/\//,i=e.split(r),e=i[i.length-1],t&&e.indexOf(".")>=0?(i=e.split("."),i.pop(),"coffee"===i[i.length-1]&&i.length>1&&i.pop(),i.join(".")):e},e.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md)$/.test(e)},e.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},e.throwSyntaxError=function(e,t){var n;throw n=new SyntaxError(e),n.location=t,n.toString=o,n.stack=""+n,n},e.updateSyntaxError=function(e,t,n){return e.toString===o&&(e.code||(e.code=t),e.filename||(e.filename=n),e.stack=""+e),e},o=function(){var e,t,n,i,r,o,a,c,h,l,u,p,d;return this.code&&this.location?(u=this.location,a=u.first_line,o=u.first_column,h=u.last_line,c=u.last_column,null==h&&(h=a),null==c&&(c=o),r=this.filename||"[stdin]",e=this.code.split("\n")[a],d=o,i=a===h?c+1:e.length,l=e.slice(0,d).replace(/[^\s]/g," ")+s("^",i-d),"undefined"!=typeof process&&null!==process&&(n=process.stdout.isTTY&&!process.env.NODE_DISABLE_COLORS),(null!=(p=this.colorful)?p:n)&&(t=function(e){return"[1;31m"+e+"[0m"},e=e.slice(0,d)+t(e.slice(d,i))+e.slice(i),l=t(l)),r+":"+(a+1)+":"+(o+1)+": error: "+this.message+"\n"+e+"\n"+l):Error.prototype.toString.call(this)},e.nameWhitespaceCharacter=function(e){switch(e){case" ":return"space";case"\n":return"newline";case"\r":return"carriage return";case"	":return"tab";default:return e}}}.call(this),t.exports}(),require["./rewriter"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,g,v,y,b,k=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},w=[].slice;for(f=function(e,t,n){var i;return i=[e,t],i.generated=!0,n&&(i.origin=n),i},e.Rewriter=function(){function e(){}return e.prototype.rewrite=function(e){return this.tokens=e,this.removeLeadingNewlines(),this.closeOpenCalls(),this.closeOpenIndexes(),this.normalizeLines(),this.tagPostfixConditionals(),this.addImplicitBracesAndParens(),this.addLocationDataToGeneratedTokens(),this.tokens},e.prototype.scanTokens=function(e){var t,n,i;for(i=this.tokens,t=0;n=i[t];)t+=e.call(this,n,t,i);return!0},e.prototype.detectEnd=function(e,t,n){var i,o,a,c,h;for(h=this.tokens,i=0;c=h[e];){if(0===i&&t.call(this,c,e))return n.call(this,c,e);if(!c||0>i)return n.call(this,c,e-1);o=c[0],k.call(s,o)>=0?i+=1:(a=c[0],k.call(r,a)>=0&&(i-=1)),e+=1}return e-1},e.prototype.removeLeadingNewlines=function(){var e,t,n,i,r;for(i=this.tokens,e=t=0,n=i.length;n>t&&(r=i[e][0],"TERMINATOR"===r);e=++t);return e?this.tokens.splice(0,e):void 0},e.prototype.closeOpenCalls=function(){var e,t;return t=function(e,t){var n;return")"===(n=e[0])||"CALL_END"===n||"OUTDENT"===e[0]&&")"===this.tag(t-1)},e=function(e,t){return this.tokens["OUTDENT"===e[0]?t-1:t][0]="CALL_END"},this.scanTokens(function(n,i){return"CALL_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.closeOpenIndexes=function(){var e,t;return t=function(e){var t;return"]"===(t=e[0])||"INDEX_END"===t},e=function(e){return e[0]="INDEX_END"},this.scanTokens(function(n,i){return"INDEX_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.indexOfTag=function(){var e,t,n,i,r,s,o;for(t=arguments[0],r=arguments.length>=2?w.call(arguments,1):[],e=0,n=i=0,s=r.length;s>=0?s>i:i>s;n=s>=0?++i:--i){for(;"HERECOMMENT"===this.tag(t+n+e);)e+=2;if(null!=r[n]&&("string"==typeof r[n]&&(r[n]=[r[n]]),o=this.tag(t+n+e),0>k.call(r[n],o)))return-1}return t+n+e-1},e.prototype.looksObjectish=function(e){var t,n;return this.indexOfTag(e,"@",null,":")>-1||this.indexOfTag(e,null,":")>-1?!0:(n=this.indexOfTag(e,s),n>-1&&(t=null,this.detectEnd(n+1,function(e){var t;return t=e[0],k.call(r,t)>=0},function(e,n){return t=n}),":"===this.tag(t+1))?!0:!1)},e.prototype.findTagsBackwards=function(e,t){var n,i,o,a,c,h,l;for(n=[];e>=0&&(n.length||(a=this.tag(e),0>k.call(t,a)&&(c=this.tag(e),0>k.call(s,c)||this.tokens[e].generated)&&(h=this.tag(e),0>k.call(u,h))));)i=this.tag(e),k.call(r,i)>=0&&n.push(this.tag(e)),o=this.tag(e),k.call(s,o)>=0&&n.length&&n.pop(),e-=1;return l=this.tag(e),k.call(t,l)>=0},e.prototype.addImplicitBracesAndParens=function(){var e,t;return e=[],t=null,this.scanTokens(function(i,l,p){var d,m,g,v,y,b,w,T,C,E,F,N,L,x,S,D,R,A,I,_,O,$,j,M,B,V,P,U;if(U=i[0],F=(N=l>0?p[l-1]:[])[0],C=(p.length-1>l?p[l+1]:[])[0],j=function(){return e[e.length-1]},M=l,g=function(e){return l-M+e},v=function(){var e,t;return null!=(e=j())?null!=(t=e[2])?t.ours:void 0:void 0},y=function(){var e;return v()&&"("===(null!=(e=j())?e[0]:void 0)},w=function(){var e;return v()&&"{"===(null!=(e=j())?e[0]:void 0)},b=function(){var e;return v&&"CONTROL"===(null!=(e=j())?e[0]:void 0)},B=function(t){var n;return n=null!=t?t:l,e.push(["(",n,{ours:!0}]),p.splice(n,0,f("CALL_START","(")),null==t?l+=1:void 0},d=function(){return e.pop(),p.splice(l,0,f("CALL_END",")",["","end of input",i[2]])),l+=1},V=function(t,n){var r,s;return null==n&&(n=!0),r=null!=t?t:l,e.push(["{",r,{sameLine:!0,startsLine:n,ours:!0}]),s=new String("{"),s.generated=!0,p.splice(r,0,f("{",s,i)),null==t?l+=1:void 0},m=function(t){return t=null!=t?t:l,e.pop(),p.splice(t,0,f("}","}",i)),l+=1},y()&&("IF"===U||"TRY"===U||"FINALLY"===U||"CATCH"===U||"CLASS"===U||"SWITCH"===U))return e.push(["CONTROL",l,{ours:!0}]),g(1);if("INDENT"===U&&v()){if("=>"!==F&&"->"!==F&&"["!==F&&"("!==F&&","!==F&&"{"!==F&&"TRY"!==F&&"ELSE"!==F&&"="!==F)for(;y();)d();return b()&&e.pop(),e.push([U,l]),g(1)}if(k.call(s,U)>=0)return e.push([U,l]),g(1);if(k.call(r,U)>=0){for(;v();)y()?d():w()?m():e.pop();t=e.pop()}if((k.call(c,U)>=0&&i.spaced||"?"===U&&l>0&&!p[l-1].spaced)&&(k.call(o,C)>=0||k.call(h,C)>=0&&!(null!=(L=p[l+1])?L.spaced:void 0)&&!(null!=(x=p[l+1])?x.newLine:void 0)))return"?"===U&&(U=i[0]="FUNC_EXIST"),B(l+1),g(2);if(k.call(c,U)>=0&&this.indexOfTag(l+1,"INDENT",null,":")>-1&&!this.findTagsBackwards(l,["CLASS","EXTENDS","IF","CATCH","SWITCH","LEADING_WHEN","FOR","WHILE","UNTIL"]))return B(l+1),e.push(["INDENT",l+2]),g(3);if(":"===U){for(I=function(){var e;switch(!1){case e=this.tag(l-1),0>k.call(r,e):return t[1];case"@"!==this.tag(l-2):return l-2;default:return l-1}}.call(this);"HERECOMMENT"===this.tag(I-2);)I-=2;return this.insideForDeclaration="FOR"===C,P=0===I||(S=this.tag(I-1),k.call(u,S)>=0)||p[I-1].newLine,j()&&(D=j(),$=D[0],O=D[1],("{"===$||"INDENT"===$&&"{"===this.tag(O-1))&&(P||","===this.tag(I-1)||"{"===this.tag(I-1)))?g(1):(V(I,!!P),g(2))}if(w()&&k.call(u,U)>=0&&(j()[2].sameLine=!1),T="OUTDENT"===F||N.newLine,k.call(a,U)>=0||k.call(n,U)>=0&&T)for(;v();)if(R=j(),$=R[0],O=R[1],A=R[2],_=A.sameLine,P=A.startsLine,y()&&","!==F)d();else if(w()&&!this.insideForDeclaration&&_&&"TERMINATOR"!==U&&":"!==F)m();else{if(!w()||"TERMINATOR"!==U||","===F||P&&this.looksObjectish(l+1))break;if("HERECOMMENT"===C)return g(1);m()}if(!(","!==U||this.looksObjectish(l+1)||!w()||this.insideForDeclaration||"TERMINATOR"===C&&this.looksObjectish(l+2)))for(E="OUTDENT"===C?1:0;w();)m(l+E);return g(1)})},e.prototype.addLocationDataToGeneratedTokens=function(){return this.scanTokens(function(e,t,n){var i,r,s,o,a,c;return e[2]?1:e.generated||e.explicit?("{"===e[0]&&(s=null!=(a=n[t+1])?a[2]:void 0)?(r=s.first_line,i=s.first_column):(o=null!=(c=n[t-1])?c[2]:void 0)?(r=o.last_line,i=o.last_column):r=i=0,e[2]={first_line:r,first_column:i,last_line:r,last_column:i},1):1})},e.prototype.normalizeLines=function(){var e,t,r,s,o;return o=r=s=null,t=function(e,t){var r,s,a,c;return";"!==e[1]&&(r=e[0],k.call(p,r)>=0)&&!("TERMINATOR"===e[0]&&(s=this.tag(t+1),k.call(i,s)>=0))&&!("ELSE"===e[0]&&"THEN"!==o)&&!!("CATCH"!==(a=e[0])&&"FINALLY"!==a||"->"!==o&&"=>"!==o)||(c=e[0],k.call(n,c)>=0&&this.tokens[t-1].newLine)},e=function(e,t){return this.tokens.splice(","===this.tag(t-1)?t-1:t,0,s)},this.scanTokens(function(n,a,c){var h,l,u,p,f,m;if(m=n[0],"TERMINATOR"===m){if("ELSE"===this.tag(a+1)&&"OUTDENT"!==this.tag(a-1))return c.splice.apply(c,[a,1].concat(w.call(this.indentation()))),1;if(u=this.tag(a+1),k.call(i,u)>=0)return c.splice(a,1),0}if("CATCH"===m)for(h=l=1;2>=l;h=++l)if("OUTDENT"===(p=this.tag(a+h))||"TERMINATOR"===p||"FINALLY"===p)return c.splice.apply(c,[a+h,0].concat(w.call(this.indentation()))),2+h;return k.call(d,m)>=0&&"INDENT"!==this.tag(a+1)&&("ELSE"!==m||"IF"!==this.tag(a+1))?(o=m,f=this.indentation(c[a]),r=f[0],s=f[1],"THEN"===o&&(r.fromThen=!0),c.splice(a+1,0,r),this.detectEnd(a+2,t,e),"THEN"===m&&c.splice(a,1),1):1})},e.prototype.tagPostfixConditionals=function(){var e,t,n;return n=null,t=function(e,t){var n,i;return i=e[0],n=this.tokens[t-1][0],"TERMINATOR"===i||"INDENT"===i&&0>k.call(d,n)},e=function(e){return"INDENT"!==e[0]||e.generated&&!e.fromThen?n[0]="POST_"+n[0]:void 0},this.scanTokens(function(i,r){return"IF"!==i[0]?1:(n=i,this.detectEnd(r+1,t,e),1)})},e.prototype.indentation=function(e){var t,n;return t=["INDENT",2],n=["OUTDENT",2],e?(t.generated=n.generated=!0,t.origin=n.origin=e):t.explicit=n.explicit=!0,[t,n]},e.prototype.generate=f,e.prototype.tag=function(e){var t;return null!=(t=this.tokens[e])?t[0]:void 0},e}(),t=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["CALL_START","CALL_END"],["PARAM_START","PARAM_END"],["INDEX_START","INDEX_END"],["STRING_START","STRING_END"],["REGEX_START","REGEX_END"]],e.INVERSES=l={},s=[],r=[],m=0,v=t.length;v>m;m++)y=t[m],g=y[0],b=y[1],s.push(l[b]=g),r.push(l[g]=b);i=["CATCH","THEN","ELSE","FINALLY"].concat(r),c=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@","THIS"],o=["IDENTIFIER","NUMBER","STRING","STRING_START","JS","REGEX","REGEX_START","NEW","PARAM_START","CLASS","IF","TRY","SWITCH","THIS","BOOL","NULL","UNDEFINED","UNARY","YIELD","UNARY_MATH","SUPER","THROW","@","->","=>","[","(","{","--","++"],h=["+","-"],a=["POST_IF","FOR","WHILE","UNTIL","WHEN","BY","LOOP","TERMINATOR"],d=["ELSE","->","=>","TRY","FINALLY","THEN"],p=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"],u=["TERMINATOR","INDENT","OUTDENT"],n=[".","?.","::","?::"]}.call(this),t.exports}(),require["./lexer"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,g,v,y,b,k,w,T,C,E,F,N,L,x,S,D,R,A,I,_,O,$,j,M,B,V,P,U,G,H,q,X,W,Y,K,z,J,Q,Z,et,tt,nt,it,rt,st,ot,at,ct,ht,lt,ut=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};ot=require("./rewriter"),P=ot.Rewriter,w=ot.INVERSES,at=require("./helpers"),nt=at.count,ht=at.starts,tt=at.compact,ct=at.repeat,it=at.invertLiterate,st=at.locationDataToString,lt=at.throwSyntaxError,e.Lexer=S=function(){function e(){}return e.prototype.tokenize=function(e,t){var n,i,r,s;for(null==t&&(t={}),this.literate=t.literate,this.indent=0,this.baseIndent=0,this.indebt=0,this.outdebt=0,this.indents=[],this.ends=[],this.tokens=[],this.chunkLine=t.line||0,this.chunkColumn=t.column||0,e=this.clean(e),r=0;this.chunk=e.slice(r);)if(n=this.identifierToken()||this.commentToken()||this.whitespaceToken()||this.lineToken()||this.stringToken()||this.numberToken()||this.regexToken()||this.jsToken()||this.literalToken(),s=this.getLineAndColumnFromChunk(n),this.chunkLine=s[0],this.chunkColumn=s[1],r+=n,t.untilBalanced&&0===this.ends.length)return{tokens:this.tokens,index:r};return this.closeIndentation(),(i=this.ends.pop())&&this.error("missing "+i.tag,i.origin[2]),t.rewrite===!1?this.tokens:(new P).rewrite(this.tokens)},e.prototype.clean=function(e){return e.charCodeAt(0)===t&&(e=e.slice(1)),e=e.replace(/\r/g,"").replace(z,""),et.test(e)&&(e="\n"+e,this.chunkLine--),this.literate&&(e=it(e)),e},e.prototype.identifierToken=function(){var e,t,n,i,r,c,h,l,u,p,d,f,m,g,y;return(h=v.exec(this.chunk))?(c=h[0],i=h[1],e=h[2],r=i.length,l=void 0,"own"===i&&"FOR"===this.tag()?(this.token("OWN",i),i.length):"from"===i&&"YIELD"===this.tag()?(this.token("FROM",i),i.length):(p=this.tokens,u=p[p.length-1],n=e||null!=u&&("."===(d=u[0])||"?."===d||"::"===d||"?::"===d||!u.spaced&&"@"===u[0]),g="IDENTIFIER",!n&&(ut.call(E,i)>=0||ut.call(a,i)>=0)&&(g=i.toUpperCase(),"WHEN"===g&&(f=this.tag(),ut.call(N,f)>=0)?g="LEADING_WHEN":"FOR"===g?this.seenFor=!0:"UNLESS"===g?g="IF":ut.call(J,g)>=0?g="UNARY":ut.call(B,g)>=0&&("INSTANCEOF"!==g&&this.seenFor?(g="FOR"+g,this.seenFor=!1):(g="RELATION","!"===this.value()&&(l=this.tokens.pop(),i="!"+i)))),ut.call(C,i)>=0&&(n?(g="IDENTIFIER",i=new String(i),i.reserved=!0):ut.call(V,i)>=0&&this.error("reserved word '"+i+"'",{length:i.length})),n||(ut.call(s,i)>=0&&(i=o[i]),g=function(){switch(i){case"!":return"UNARY";case"==":case"!=":return"COMPARE";case"&&":case"||":return"LOGIC";case"true":case"false":return"BOOL";case"break":case"continue":return"STATEMENT";default:return g}}()),y=this.token(g,i,0,r),y.variable=!n,l&&(m=[l[2].first_line,l[2].first_column],y[2].first_line=m[0],y[2].first_column=m[1]),e&&(t=c.lastIndexOf(":"),this.token(":",":",t,e.length)),c.length)):0},e.prototype.numberToken=function(){var e,t,n,i,r;return(n=I.exec(this.chunk))?(i=n[0],t=i.length,/^0[BOX]/.test(i)?this.error("radix prefix in '"+i+"' must be lowercase",{offset:1}):/E/.test(i)&&!/^0x/.test(i)?this.error("exponential notation in '"+i+"' must be indicated with a lowercase 'e'",{offset:i.indexOf("E")}):/^0\d*[89]/.test(i)?this.error("decimal literal '"+i+"' must not be prefixed with '0'",{length:t}):/^0\d+/.test(i)&&this.error("octal literal '"+i+"' must be prefixed with '0o'",{length:t}),(r=/^0o([0-7]+)/.exec(i))&&(i="0x"+parseInt(r[1],8).toString(16)),(e=/^0b([01]+)/.exec(i))&&(i="0x"+parseInt(e[1],2).toString(16)),this.token("NUMBER",i,0,t),t):0},e.prototype.stringToken=function(){var e,t,n,i,r,s,o,a,c,h,l,u,m,g,v,y;if(l=(Y.exec(this.chunk)||[])[0],!l)return 0;if(g=function(){switch(l){case"'":return W;case'"':return q;case"'''":return f;case'"""':return p}}(),s=3===l.length,u=this.matchWithInterpolations(g,l),y=u.tokens,r=u.index,e=y.length-1,n=l[0],s){for(a=null,i=function(){var e,t,n;for(n=[],o=e=0,t=y.length;t>e;o=++e)v=y[o],"NEOSTRING"===v[0]&&n.push(v[1]);return n}().join("#{}");h=d.exec(i);)t=h[1],(null===a||(m=t.length)>0&&a.length>m)&&(a=t);a&&(c=RegExp("^"+a,"gm")),this.mergeInterpolationTokens(y,{delimiter:n},function(t){return function(n,i){return n=t.formatString(n),0===i&&(n=n.replace(F,"")),i===e&&(n=n.replace(K,"")),c&&(n=n.replace(c,"")),n}}(this))}else this.mergeInterpolationTokens(y,{delimiter:n},function(t){return function(n,i){return n=t.formatString(n),n=n.replace(G,function(t,r){return 0===i&&0===r||i===e&&r+t.length===n.length?"":" "})}}(this));return r},e.prototype.commentToken=function(){var e,t,n;return(n=this.chunk.match(c))?(e=n[0],t=n[1],t&&((n=u.exec(e))&&this.error("block comments cannot contain "+n[0],{offset:n.index,length:n[0].length}),t.indexOf("\n")>=0&&(t=t.replace(RegExp("\\n"+ct(" ",this.indent),"g"),"\n")),this.token("HERECOMMENT",t,0,e.length)),e.length):0},e.prototype.jsToken=function(){var e,t;return"`"===this.chunk.charAt(0)&&(e=T.exec(this.chunk))?(this.token("JS",(t=e[0]).slice(1,-1),0,t.length),t.length):0},e.prototype.regexToken=function(){var e,t,n,r,s,o,a,c,h,l,u,p,d;switch(!1){case!(o=M.exec(this.chunk)):this.error("regular expressions cannot begin with "+o[2],{offset:o.index+o[1].length});break;case!(o=this.matchWithInterpolations(m,"///")):d=o.tokens,s=o.index;break;case!(o=$.exec(this.chunk)):if(p=o[0],e=o[1],t=o[2],this.validateEscapes(e,{isRegex:!0,offsetInChunk:1}),s=p.length,h=this.tokens,c=h[h.length-1],c)if(c.spaced&&(l=c[0],ut.call(i,l)>=0)){if(!t||O.test(p))return 0}else if(u=c[0],ut.call(A,u)>=0)return 0;t||this.error("missing / (unclosed regex)");break;default:return 0}switch(r=j.exec(this.chunk.slice(s))[0],n=s+r.length,a=this.makeToken("REGEX",null,0,n),!1){case!!Z.test(r):this.error("invalid regular expression flags "+r,{offset:s,length:r.length});break;case!(p||1===d.length):null==e&&(e=this.formatHeregex(d[0][1])),this.token("REGEX",""+this.makeDelimitedLiteral(e,{delimiter:"/"})+r,0,n,a);break;default:this.token("REGEX_START","(",0,0,a),this.token("IDENTIFIER","RegExp",0,0),this.token("CALL_START","(",0,0),this.mergeInterpolationTokens(d,{delimiter:'"',"double":!0},this.formatHeregex),r&&(this.token(",",",",s,0),this.token("STRING",'"'+r+'"',s,r.length)),this.token(")",")",n,0),this.token("REGEX_END",")",n,0)}return n},e.prototype.lineToken=function(){var e,t,n,i,r;if(!(n=R.exec(this.chunk)))return 0;if(t=n[0],this.seenFor=!1,r=t.length-1-t.lastIndexOf("\n"),i=this.unfinished(),r-this.indebt===this.indent)return i?this.suppressNewlines():this.newlineToken(0),t.length;if(r>this.indent){if(i)return this.indebt=r-this.indent,this.suppressNewlines(),t.length;if(!this.tokens.length)return this.baseIndent=this.indent=r,t.length;e=r-this.indent+this.outdebt,this.token("INDENT",e,t.length-r,r),this.indents.push(e),this.ends.push({tag:"OUTDENT"}),this.outdebt=this.indebt=0,this.indent=r}else this.baseIndent>r?this.error("missing indentation",{offset:t.length}):(this.indebt=0,this.outdentToken(this.indent-r,i,t.length));return t.length},e.prototype.outdentToken=function(e,t,n){var i,r,s,o;for(i=this.indent-e;e>0;)s=this.indents[this.indents.length-1],s?s===this.outdebt?(e-=this.outdebt,this.outdebt=0):this.outdebt>s?(this.outdebt-=s,e-=s):(r=this.indents.pop()+this.outdebt,n&&(o=this.chunk[n],ut.call(y,o)>=0)&&(i-=r-e,e=r),this.outdebt=0,this.pair("OUTDENT"),this.token("OUTDENT",e,0,n),e-=r):e=0;for(r&&(this.outdebt-=e);";"===this.value();)this.tokens.pop();return"TERMINATOR"===this.tag()||t||this.token("TERMINATOR","\n",n,0),this.indent=i,this},e.prototype.whitespaceToken=function(){var e,t,n,i;return(e=et.exec(this.chunk))||(t="\n"===this.chunk.charAt(0))?(i=this.tokens,n=i[i.length-1],n&&(n[e?"spaced":"newLine"]=!0),e?e[0].length:0):0},e.prototype.newlineToken=function(e){for(;";"===this.value();)this.tokens.pop();return"TERMINATOR"!==this.tag()&&this.token("TERMINATOR","\n",e,0),this},e.prototype.suppressNewlines=function(){return"\\"===this.value()&&this.tokens.pop(),this},e.prototype.literalToken=function(){var e,t,n,s,o,a,c,u,p,d;if((e=_.exec(this.chunk))?(d=e[0],r.test(d)&&this.tagParameters()):d=this.chunk.charAt(0),u=d,n=this.tokens,t=n[n.length-1],"="===d&&t&&(!t[1].reserved&&(s=t[1],ut.call(C,s)>=0)&&this.error("reserved word '"+t[1]+"' can't be assigned",t[2]),"||"===(o=t[1])||"&&"===o))return t[0]="COMPOUND_ASSIGN",t[1]+="=",d.length;if(";"===d)this.seenFor=!1,u="TERMINATOR";else if(ut.call(D,d)>=0)u="MATH";else if(ut.call(h,d)>=0)u="COMPARE";else if(ut.call(l,d)>=0)u="COMPOUND_ASSIGN";else if(ut.call(J,d)>=0)u="UNARY";else if(ut.call(Q,d)>=0)u="UNARY_MATH";else if(ut.call(U,d)>=0)u="SHIFT";else if(ut.call(x,d)>=0||"?"===d&&(null!=t?t.spaced:void 0))u="LOGIC";else if(t&&!t.spaced)if("("===d&&(a=t[0],ut.call(i,a)>=0))"?"===t[0]&&(t[0]="FUNC_EXIST"),u="CALL_START";else if("["===d&&(c=t[0],ut.call(b,c)>=0))switch(u="INDEX_START",t[0]){case"?":t[0]="INDEX_SOAK"}switch(p=this.makeToken(u,d),d){case"(":case"{":case"[":this.ends.push({tag:w[d],origin:p});break;case")":case"}":case"]":this.pair(d)}return this.tokens.push(p),d.length},e.prototype.tagParameters=function(){var e,t,n,i;if(")"!==this.tag())return this;for(t=[],i=this.tokens,e=i.length,i[--e][0]="PARAM_END";n=i[--e];)switch(n[0]){case")":t.push(n);break;case"(":case"CALL_START":if(!t.length)return"("===n[0]?(n[0]="PARAM_START",this):this;t.pop()}return this},e.prototype.closeIndentation=function(){return this.outdentToken(this.indent)},e.prototype.matchWithInterpolations=function(t,n){var i,r,s,o,a,c,h,l,u,p,d,f,m,g,v;if(v=[],l=n.length,this.chunk.slice(0,l)!==n)return null;for(m=this.chunk.slice(l);;){if(g=t.exec(m)[0],this.validateEscapes(g,{isRegex:"/"===n.charAt(0),offsetInChunk:l}),v.push(this.makeToken("NEOSTRING",g,l)),m=m.slice(g.length),l+=g.length,"#{"!==m.slice(0,2))break;p=this.getLineAndColumnFromChunk(l+1),c=p[0],r=p[1],d=(new e).tokenize(m.slice(1),{line:c,column:r,untilBalanced:!0}),h=d.tokens,o=d.index,o+=1,u=h[0],i=h[h.length-1],u[0]=u[1]="(",i[0]=i[1]=")",i.origin=["","end of interpolation",i[2]],"TERMINATOR"===(null!=(f=h[1])?f[0]:void 0)&&h.splice(1,1),v.push(["TOKENS",h]),m=m.slice(o),l+=o}return m.slice(0,n.length)!==n&&this.error("missing "+n,{length:n.length}),s=v[0],a=v[v.length-1],s[2].first_column-=n.length,a[2].last_column+=n.length,0===a[1].length&&(a[2].last_column-=1),{tokens:v,index:l+n.length}},e.prototype.mergeInterpolationTokens=function(e,t,n){var i,r,s,o,a,c,h,l,u,p,d,f,m,g,v,y;for(e.length>1&&(u=this.token("STRING_START","(",0,0)),s=this.tokens.length,o=a=0,h=e.length;h>a;o=++a){switch(g=e[o],m=g[0],y=g[1],m){case"TOKENS":if(2===y.length)continue;l=y[0],v=y;break;case"NEOSTRING":if(i=n(g[1],o),0===i.length){if(0!==o)continue;r=this.tokens.length}2===o&&null!=r&&this.tokens.splice(r,2),g[0]="STRING",g[1]=this.makeDelimitedLiteral(i,t),l=g,v=[g]}this.tokens.length>s&&(p=this.token("+","+"),p[2]={first_line:l[2].first_line,first_column:l[2].first_column,last_line:l[2].first_line,last_column:l[2].first_column}),(d=this.tokens).push.apply(d,v)}return u?(c=e[e.length-1],u.origin=["STRING",null,{first_line:u[2].first_line,first_column:u[2].first_column,last_line:c[2].last_line,last_column:c[2].last_column}],f=this.token("STRING_END",")"),f[2]={first_line:c[2].last_line,first_column:c[2].last_column,last_line:c[2].last_line,last_column:c[2].last_column}):void 0},e.prototype.pair=function(e){var t,n,i,r,s;return i=this.ends,n=i[i.length-1],e!==(s=null!=n?n.tag:void 0)?("OUTDENT"!==s&&this.error("unmatched "+e),r=this.indents,t=r[r.length-1],this.outdentToken(t,!0),this.pair(e)):this.ends.pop()},e.prototype.getLineAndColumnFromChunk=function(e){var t,n,i,r,s;return 0===e?[this.chunkLine,this.chunkColumn]:(s=e>=this.chunk.length?this.chunk:this.chunk.slice(0,+(e-1)+1||9e9),i=nt(s,"\n"),t=this.chunkColumn,i>0?(r=s.split("\n"),n=r[r.length-1],t=n.length):t+=s.length,[this.chunkLine+i,t])},e.prototype.makeToken=function(e,t,n,i){var r,s,o,a,c;return null==n&&(n=0),null==i&&(i=t.length),s={},o=this.getLineAndColumnFromChunk(n),s.first_line=o[0],s.first_column=o[1],r=Math.max(0,i-1),a=this.getLineAndColumnFromChunk(n+r),s.last_line=a[0],s.last_column=a[1],c=[e,t,s]},e.prototype.token=function(e,t,n,i,r){var s;return s=this.makeToken(e,t,n,i),r&&(s.origin=r),this.tokens.push(s),s},e.prototype.tag=function(){var e,t;return e=this.tokens,t=e[e.length-1],null!=t?t[0]:void 0},e.prototype.value=function(){var e,t;return e=this.tokens,t=e[e.length-1],null!=t?t[1]:void 0},e.prototype.unfinished=function(){var e;return L.test(this.chunk)||"\\"===(e=this.tag())||"."===e||"?."===e||"?::"===e||"UNARY"===e||"MATH"===e||"UNARY_MATH"===e||"+"===e||"-"===e||"YIELD"===e||"**"===e||"SHIFT"===e||"RELATION"===e||"COMPARE"===e||"LOGIC"===e||"THROW"===e||"EXTENDS"===e},e.prototype.formatString=function(e){return e.replace(X,"$1")},e.prototype.formatHeregex=function(e){return e.replace(g,"$1$2")},e.prototype.validateEscapes=function(e,t){var n,i,r,s,o,a,c,h;return null==t&&(t={}),s=k.exec(e),!s||(s[0],n=s[1],a=s[2],i=s[3],h=s[4],t.isRegex&&a&&"0"!==a.charAt(0))?void 0:(o=a?"octal escape sequences are not allowed":"invalid escape sequence",r="\\"+(a||i||h),this.error(o+" "+r,{offset:(null!=(c=t.offsetInChunk)?c:0)+s.index+n.length,length:r.length}))},e.prototype.makeDelimitedLiteral=function(e,t){var n;return null==t&&(t={}),""===e&&"/"===t.delimiter&&(e="(?:)"),n=RegExp("(\\\\\\\\)|(\\\\0(?=[1-7]))|\\\\?("+t.delimiter+")|\\\\?(?:(\\n)|(\\r)|(\\u2028)|(\\u2029))|(\\\\.)","g"),e=e.replace(n,function(e,n,i,r,s,o,a,c,h){switch(!1){case!n:return t.double?n+n:n;case!i:return"\\x00";case!r:return"\\"+r;case!s:return"\\n";case!o:return"\\r";case!a:return"\\u2028";case!c:return"\\u2029";case!h:return t.double?"\\"+h:h}}),""+t.delimiter+e+t.delimiter},e.prototype.error=function(e,t){var n,i,r,s,o,a;return null==t&&(t={}),r="first_line"in t?t:(o=this.getLineAndColumnFromChunk(null!=(s=t.offset)?s:0),i=o[0],n=o[1],o,{first_line:i,first_column:n,last_column:n+(null!=(a=t.length)?a:1)-1}),lt(e,r)},e}(),E=["true","false","null","this","new","delete","typeof","in","instanceof","return","throw","break","continue","debugger","yield","if","else","switch","for","while","do","try","catch","finally","class","extends","super"],a=["undefined","then","unless","until","loop","of","by","when"],o={and:"&&",or:"||",is:"==",isnt:"!=",not:"!",yes:"true",no:"false",on:"true",off:"false"},s=function(){var e;e=[];for(rt in o)e.push(rt);return e}(),a=a.concat(s),V=["case","default","function","var","void","with","const","let","enum","export","import","native","implements","interface","package","private","protected","public","static"],H=["arguments","eval","yield*"],C=E.concat(V).concat(H),e.RESERVED=V.concat(E).concat(a).concat(H),e.STRICT_PROSCRIBED=H,t=65279,v=/^(?!\d)((?:(?!\s)[$\w\x7f-\uffff])+)([^\n\S]*:(?!:))?/,I=/^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i,_=/^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*\/%])\2=?|\?(\.|::)|\.{2,3})/,et=/^[^\n\S]+/,c=/^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/,r=/^[-=]>/,R=/^(?:\n[^\n\S]*)+/,T=/^`[^\\`]*(?:\\.[^\\`]*)*`/,Y=/^(?:'''|"""|'|")/,W=/^(?:[^\\']|\\[\s\S])*/,q=/^(?:[^\\"#]|\\[\s\S]|\#(?!\{))*/,f=/^(?:[^\\']|\\[\s\S]|'(?!''))*/,p=/^(?:[^\\"#]|\\[\s\S]|"(?!"")|\#(?!\{))*/,X=/((?:\\\\)+)|\\[^\S\n]*\n\s*/g,G=/\s*\n\s*/g,d=/\n+([^\n\S]*)(?=\S)/g,$=/^\/(?!\/)((?:[^[\/\n\\]|\\[^\n]|\[(?:\\[^\n]|[^\]\n\\])*])*)(\/)?/,j=/^\w*/,Z=/^(?!.*(.).*\1)[imgy]*$/,m=/^(?:[^\\\/#]|\\[\s\S]|\/(?!\/\/)|\#(?!\{))*/,g=/((?:\\\\)+)|\\(\s)|\s+(?:#.*)?/g,M=/^(\/|\/{3}\s*)(\*)/,O=/^\/=?\s/,u=/\*\//,L=/^\s*(?:,|\??\.(?![.\d])|::)/,k=/((?:^|[^\\])(?:\\\\)*)\\(?:(0[0-7]|[1-7])|(x(?![\da-fA-F]{2}).{0,2})|(u(?![\da-fA-F]{4}).{0,4}))/,F=/^[^\n\S]*\n/,K=/\n[^\n\S]*$/,z=/\s+$/,l=["-=","+=","/=","*=","%=","||=","&&=","?=","<<=",">>=",">>>=","&=","^=","|=","**=","//=","%%="],J=["NEW","TYPEOF","DELETE","DO"],Q=["!","~"],x=["&&","||","&","|","^"],U=["<<",">>",">>>"],h=["==","!=","<",">","<=",">="],D=["*","/","%","//","%%"],B=["IN","OF","INSTANCEOF"],n=["TRUE","FALSE"],i=["IDENTIFIER",")","]","?","@","THIS","SUPER"],b=i.concat(["NUMBER","STRING","STRING_END","REGEX","REGEX_END","BOOL","NULL","UNDEFINED","}","::"]),A=b.concat(["++","--"]),N=["INDENT","OUTDENT","TERMINATOR"],y=[")","}","]"]}.call(this),t.exports}(),require["./parser"]=function(){var e={},t={exports:e},n=function(){function e(){this.yy={}}var t=function(e,t,n,i){for(n=n||{},i=e.length;i--;n[e[i]]=t);return n},n=[1,20],i=[1,75],r=[1,71],s=[1,76],o=[1,77],a=[1,73],c=[1,74],h=[1,50],l=[1,52],u=[1,53],p=[1,54],d=[1,55],f=[1,45],m=[1,46],g=[1,27],v=[1,60],y=[1,61],b=[1,70],k=[1,43],w=[1,26],T=[1,58],C=[1,59],E=[1,57],F=[1,38],N=[1,44],L=[1,56],x=[1,65],S=[1,66],D=[1,67],R=[1,68],A=[1,42],I=[1,64],_=[1,29],O=[1,30],$=[1,31],j=[1,32],M=[1,33],B=[1,34],V=[1,35],P=[1,78],U=[1,6,26,34,108],G=[1,88],H=[1,81],q=[1,80],X=[1,79],W=[1,82],Y=[1,83],K=[1,84],z=[1,85],J=[1,86],Q=[1,87],Z=[1,91],et=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],tt=[1,97],nt=[1,98],it=[1,99],rt=[1,100],st=[1,102],ot=[1,103],at=[1,96],ct=[2,112],ht=[1,6,25,26,34,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],lt=[2,79],ut=[1,108],pt=[2,58],dt=[1,112],ft=[1,117],mt=[1,118],gt=[1,120],vt=[1,6,25,26,34,46,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],yt=[2,76],bt=[1,6,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],kt=[1,155],wt=[1,157],Tt=[1,152],Ct=[1,6,25,26,34,46,55,60,63,72,73,74,75,77,79,80,84,86,90,91,92,97,99,108,110,111,112,116,117,132,135,136,139,140,141,142,143,144,145,146,147,148],Et=[2,95],Ft=[1,6,25,26,34,49,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],Nt=[1,6,25,26,34,46,49,55,60,63,72,73,74,75,77,79,80,84,86,90,91,92,97,99,108,110,111,112,116,117,123,124,132,135,136,139,140,141,142,143,144,145,146,147,148],Lt=[1,206],xt=[1,205],St=[1,6,25,26,34,38,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],Dt=[2,56],Rt=[1,216],At=[6,25,26,55,60],It=[6,25,26,46,55,60,63],_t=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,142,144,145,146,147],Ot=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132],$t=[72,73,74,75,77,80,90,91],jt=[1,235],Mt=[2,133],Bt=[1,6,25,26,34,46,55,60,63,72,73,74,75,77,79,80,84,90,91,92,97,99,108,110,111,112,116,117,123,124,132,135,136,141,142,143,144,145,146,147],Vt=[1,244],Pt=[6,25,26,60,92,97],Ut=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,117,132],Gt=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,111,117,132],Ht=[123,124],qt=[60,123,124],Xt=[1,255],Wt=[6,25,26,60,84],Yt=[6,25,26,49,60,84],Kt=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,144,145,146,147],zt=[11,28,30,32,33,36,37,40,41,42,43,44,51,52,53,57,58,79,82,85,89,94,95,96,102,106,107,110,112,114,116,125,131,133,134,135,136,137,139,140],Jt=[2,122],Qt=[6,25,26],Zt=[2,57],en=[1,268],tn=[1,269],nn=[1,6,25,26,34,55,60,63,79,84,92,97,99,104,105,108,110,111,112,116,117,127,129,132,135,136,141,142,143,144,145,146,147],rn=[26,127,129],sn=[1,6,26,34,55,60,63,79,84,92,97,99,108,111,117,132],on=[2,71],an=[1,291],cn=[1,292],hn=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,127,132,135,136,141,142,143,144,145,146,147],ln=[1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,112,116,117,132],un=[1,303],pn=[1,304],dn=[6,25,26,60],fn=[1,6,25,26,34,55,60,63,79,84,92,97,99,104,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],mn=[25,60],gn={trace:function(){},yy:{},symbols_:{error:2,Root:3,Body:4,Line:5,TERMINATOR:6,Expression:7,Statement:8,Return:9,Comment:10,STATEMENT:11,Value:12,Invocation:13,Code:14,Operation:15,Assign:16,If:17,Try:18,While:19,For:20,Switch:21,Class:22,Throw:23,Block:24,INDENT:25,OUTDENT:26,Identifier:27,IDENTIFIER:28,AlphaNumeric:29,NUMBER:30,String:31,STRING:32,STRING_START:33,STRING_END:34,Regex:35,REGEX:36,REGEX_START:37,REGEX_END:38,Literal:39,JS:40,DEBUGGER:41,UNDEFINED:42,NULL:43,BOOL:44,Assignable:45,"=":46,AssignObj:47,ObjAssignable:48,":":49,ThisProperty:50,RETURN:51,HERECOMMENT:52,PARAM_START:53,ParamList:54,PARAM_END:55,FuncGlyph:56,"->":57,"=>":58,OptComma:59,",":60,Param:61,ParamVar:62,"...":63,Array:64,Object:65,Splat:66,SimpleAssignable:67,Accessor:68,Parenthetical:69,Range:70,This:71,".":72,"?.":73,"::":74,"?::":75,Index:76,INDEX_START:77,IndexValue:78,INDEX_END:79,INDEX_SOAK:80,Slice:81,"{":82,AssignList:83,"}":84,CLASS:85,EXTENDS:86,OptFuncExist:87,Arguments:88,SUPER:89,FUNC_EXIST:90,CALL_START:91,CALL_END:92,ArgList:93,THIS:94,"@":95,"[":96,"]":97,RangeDots:98,"..":99,Arg:100,SimpleArgs:101,TRY:102,Catch:103,FINALLY:104,CATCH:105,THROW:106,"(":107,")":108,WhileSource:109,WHILE:110,WHEN:111,UNTIL:112,Loop:113,LOOP:114,ForBody:115,FOR:116,BY:117,ForStart:118,ForSource:119,ForVariables:120,OWN:121,ForValue:122,FORIN:123,FOROF:124,SWITCH:125,Whens:126,ELSE:127,When:128,LEADING_WHEN:129,IfBlock:130,IF:131,POST_IF:132,UNARY:133,UNARY_MATH:134,"-":135,"+":136,YIELD:137,FROM:138,"--":139,"++":140,"?":141,MATH:142,"**":143,SHIFT:144,COMPARE:145,LOGIC:146,RELATION:147,COMPOUND_ASSIGN:148,$accept:0,$end:1},terminals_:{2:"error",6:"TERMINATOR",11:"STATEMENT",25:"INDENT",26:"OUTDENT",28:"IDENTIFIER",30:"NUMBER",32:"STRING",33:"STRING_START",34:"STRING_END",36:"REGEX",37:"REGEX_START",38:"REGEX_END",40:"JS",41:"DEBUGGER",42:"UNDEFINED",43:"NULL",44:"BOOL",46:"=",49:":",51:"RETURN",52:"HERECOMMENT",53:"PARAM_START",55:"PARAM_END",57:"->",58:"=>",60:",",63:"...",72:".",73:"?.",74:"::",75:"?::",77:"INDEX_START",79:"INDEX_END",80:"INDEX_SOAK",82:"{",84:"}",85:"CLASS",86:"EXTENDS",89:"SUPER",90:"FUNC_EXIST",91:"CALL_START",92:"CALL_END",94:"THIS",95:"@",96:"[",97:"]",99:"..",102:"TRY",104:"FINALLY",105:"CATCH",106:"THROW",107:"(",108:")",110:"WHILE",111:"WHEN",112:"UNTIL",114:"LOOP",116:"FOR",117:"BY",121:"OWN",123:"FORIN",124:"FOROF",125:"SWITCH",127:"ELSE",129:"LEADING_WHEN",131:"IF",132:"POST_IF",133:"UNARY",134:"UNARY_MATH",135:"-",136:"+",137:"YIELD",138:"FROM",139:"--",140:"++",141:"?",142:"MATH",143:"**",144:"SHIFT",145:"COMPARE",146:"LOGIC",147:"RELATION",148:"COMPOUND_ASSIGN"},productions_:[0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[24,2],[24,3],[27,1],[29,1],[29,1],[31,1],[31,3],[35,1],[35,3],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[16,3],[16,4],[16,5],[47,1],[47,3],[47,5],[47,1],[48,1],[48,1],[48,1],[9,2],[9,1],[10,1],[14,5],[14,2],[56,1],[56,1],[59,0],[59,1],[54,0],[54,1],[54,3],[54,4],[54,6],[61,1],[61,2],[61,3],[61,1],[62,1],[62,1],[62,1],[62,1],[66,2],[67,1],[67,2],[67,2],[67,1],[45,1],[45,1],[45,1],[12,1],[12,1],[12,1],[12,1],[12,1],[68,2],[68,2],[68,2],[68,2],[68,1],[68,1],[76,3],[76,2],[78,1],[78,1],[65,4],[83,0],[83,1],[83,3],[83,4],[83,6],[22,1],[22,2],[22,3],[22,4],[22,2],[22,3],[22,4],[22,5],[13,3],[13,3],[13,1],[13,2],[87,0],[87,1],[88,2],[88,4],[71,1],[71,1],[50,2],[64,2],[64,4],[98,1],[98,1],[70,5],[81,3],[81,2],[81,2],[81,1],[93,1],[93,3],[93,4],[93,4],[93,6],[100,1],[100,1],[100,1],[101,1],[101,3],[18,2],[18,3],[18,4],[18,5],[103,3],[103,3],[103,2],[23,2],[69,3],[69,5],[109,2],[109,4],[109,2],[109,4],[19,2],[19,2],[19,2],[19,1],[113,2],[113,2],[20,2],[20,2],[20,2],[115,2],[115,4],[115,2],[118,2],[118,3],[122,1],[122,1],[122,1],[122,1],[120,1],[120,3],[119,2],[119,2],[119,4],[119,4],[119,4],[119,6],[119,6],[21,5],[21,7],[21,4],[21,6],[126,1],[126,2],[128,3],[128,4],[130,3],[130,5],[17,1],[17,3],[17,3],[17,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,5],[15,4],[15,3]],performAction:function(e,t,n,i,r,s,o){var a=s.length-1;
switch(r){case 1:return this.$=i.addLocationDataFn(o[a],o[a])(new i.Block);case 2:return this.$=s[a];case 3:this.$=i.addLocationDataFn(o[a],o[a])(i.Block.wrap([s[a]]));break;case 4:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].push(s[a]));break;case 5:this.$=s[a-1];break;case 6:case 7:case 8:case 9:case 11:case 12:case 13:case 14:case 15:case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 27:case 32:case 34:case 45:case 46:case 47:case 48:case 56:case 57:case 67:case 68:case 69:case 70:case 75:case 76:case 79:case 83:case 89:case 133:case 134:case 136:case 166:case 167:case 183:case 189:this.$=s[a];break;case 10:case 25:case 26:case 28:case 30:case 33:case 35:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 23:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Block);break;case 24:case 31:case 90:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-1]);break;case 29:case 146:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Parens(s[a-1]));break;case 36:this.$=i.addLocationDataFn(o[a],o[a])(new i.Undefined);break;case 37:this.$=i.addLocationDataFn(o[a],o[a])(new i.Null);break;case 38:this.$=i.addLocationDataFn(o[a],o[a])(new i.Bool(s[a]));break;case 39:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(s[a-2],s[a]));break;case 40:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(s[a-3],s[a]));break;case 41:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(s[a-4],s[a-1]));break;case 42:case 72:case 77:case 78:case 80:case 81:case 82:case 168:case 169:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 43:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(i.addLocationDataFn(o[a-2])(new i.Value(s[a-2])),s[a],"object"));break;case 44:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(i.addLocationDataFn(o[a-4])(new i.Value(s[a-4])),s[a-1],"object"));break;case 49:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Return(s[a]));break;case 50:this.$=i.addLocationDataFn(o[a],o[a])(new i.Return);break;case 51:this.$=i.addLocationDataFn(o[a],o[a])(new i.Comment(s[a]));break;case 52:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Code(s[a-3],s[a],s[a-1]));break;case 53:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Code([],s[a],s[a-1]));break;case 54:this.$=i.addLocationDataFn(o[a],o[a])("func");break;case 55:this.$=i.addLocationDataFn(o[a],o[a])("boundfunc");break;case 58:case 95:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 59:case 96:case 128:case 170:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 60:case 97:case 129:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 61:case 98:case 130:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 62:case 99:case 132:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 63:this.$=i.addLocationDataFn(o[a],o[a])(new i.Param(s[a]));break;case 64:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Param(s[a-1],null,!0));break;case 65:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Param(s[a-2],s[a]));break;case 66:case 135:this.$=i.addLocationDataFn(o[a],o[a])(new i.Expansion);break;case 71:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Splat(s[a-1]));break;case 73:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].add(s[a]));break;case 74:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(s[a-1],[].concat(s[a])));break;case 84:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a]));break;case 85:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a],"soak"));break;case 86:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"))),i.addLocationDataFn(o[a])(new i.Access(s[a]))]);break;case 87:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"),"soak")),i.addLocationDataFn(o[a])(new i.Access(s[a]))]);break;case 88:this.$=i.addLocationDataFn(o[a],o[a])(new i.Access(new i.Literal("prototype")));break;case 91:this.$=i.addLocationDataFn(o[a-1],o[a])(i.extend(s[a],{soak:!0}));break;case 92:this.$=i.addLocationDataFn(o[a],o[a])(new i.Index(s[a]));break;case 93:this.$=i.addLocationDataFn(o[a],o[a])(new i.Slice(s[a]));break;case 94:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Obj(s[a-2],s[a-3].generated));break;case 100:this.$=i.addLocationDataFn(o[a],o[a])(new i.Class);break;case 101:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(null,null,s[a]));break;case 102:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(null,s[a]));break;case 103:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(null,s[a-1],s[a]));break;case 104:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(s[a]));break;case 105:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(s[a-1],null,s[a]));break;case 106:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(s[a-2],s[a]));break;case 107:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Class(s[a-3],s[a-1],s[a]));break;case 108:case 109:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(s[a-2],s[a],s[a-1]));break;case 110:this.$=i.addLocationDataFn(o[a],o[a])(new i.Call("super",[new i.Splat(new i.Literal("arguments"))]));break;case 111:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Call("super",s[a]));break;case 112:this.$=i.addLocationDataFn(o[a],o[a])(!1);break;case 113:this.$=i.addLocationDataFn(o[a],o[a])(!0);break;case 114:this.$=i.addLocationDataFn(o[a-1],o[a])([]);break;case 115:case 131:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-2]);break;case 116:case 117:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 118:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(i.addLocationDataFn(o[a-1])(new i.Literal("this")),[i.addLocationDataFn(o[a])(new i.Access(s[a]))],"this"));break;case 119:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Arr([]));break;case 120:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Arr(s[a-2]));break;case 121:this.$=i.addLocationDataFn(o[a],o[a])("inclusive");break;case 122:this.$=i.addLocationDataFn(o[a],o[a])("exclusive");break;case 123:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Range(s[a-3],s[a-1],s[a-2]));break;case 124:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Range(s[a-2],s[a],s[a-1]));break;case 125:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(s[a-1],null,s[a]));break;case 126:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(null,s[a],s[a-1]));break;case 127:this.$=i.addLocationDataFn(o[a],o[a])(new i.Range(null,null,s[a]));break;case 137:this.$=i.addLocationDataFn(o[a-2],o[a])([].concat(s[a-2],s[a]));break;case 138:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Try(s[a]));break;case 139:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Try(s[a-1],s[a][0],s[a][1]));break;case 140:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Try(s[a-2],null,null,s[a]));break;case 141:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Try(s[a-3],s[a-2][0],s[a-2][1],s[a]));break;case 142:this.$=i.addLocationDataFn(o[a-2],o[a])([s[a-1],s[a]]);break;case 143:this.$=i.addLocationDataFn(o[a-2],o[a])([i.addLocationDataFn(o[a-1])(new i.Value(s[a-1])),s[a]]);break;case 144:this.$=i.addLocationDataFn(o[a-1],o[a])([null,s[a]]);break;case 145:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Throw(s[a]));break;case 147:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Parens(s[a-2]));break;case 148:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(s[a]));break;case 149:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(s[a-2],{guard:s[a]}));break;case 150:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(s[a],{invert:!0}));break;case 151:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(s[a-2],{invert:!0,guard:s[a]}));break;case 152:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].addBody(s[a]));break;case 153:case 154:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([s[a-1]]))));break;case 155:this.$=i.addLocationDataFn(o[a],o[a])(s[a]);break;case 156:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(s[a]));break;case 157:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(i.addLocationDataFn(o[a])(i.Block.wrap([s[a]]))));break;case 158:case 159:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a-1],s[a]));break;case 160:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a],s[a-1]));break;case 161:this.$=i.addLocationDataFn(o[a-1],o[a])({source:i.addLocationDataFn(o[a])(new i.Value(s[a]))});break;case 162:this.$=i.addLocationDataFn(o[a-3],o[a])({source:i.addLocationDataFn(o[a-2])(new i.Value(s[a-2])),step:s[a]});break;case 163:this.$=i.addLocationDataFn(o[a-1],o[a])(function(){return s[a].own=s[a-1].own,s[a].name=s[a-1][0],s[a].index=s[a-1][1],s[a]}());break;case 164:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a]);break;case 165:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return s[a].own=!0,s[a]}());break;case 171:this.$=i.addLocationDataFn(o[a-2],o[a])([s[a-2],s[a]]);break;case 172:this.$=i.addLocationDataFn(o[a-1],o[a])({source:s[a]});break;case 173:this.$=i.addLocationDataFn(o[a-1],o[a])({source:s[a],object:!0});break;case 174:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],guard:s[a]});break;case 175:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],guard:s[a],object:!0});break;case 176:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],step:s[a]});break;case 177:this.$=i.addLocationDataFn(o[a-5],o[a])({source:s[a-4],guard:s[a-2],step:s[a]});break;case 178:this.$=i.addLocationDataFn(o[a-5],o[a])({source:s[a-4],step:s[a-2],guard:s[a]});break;case 179:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Switch(s[a-3],s[a-1]));break;case 180:this.$=i.addLocationDataFn(o[a-6],o[a])(new i.Switch(s[a-5],s[a-3],s[a-1]));break;case 181:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Switch(null,s[a-1]));break;case 182:this.$=i.addLocationDataFn(o[a-5],o[a])(new i.Switch(null,s[a-3],s[a-1]));break;case 184:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].concat(s[a]));break;case 185:this.$=i.addLocationDataFn(o[a-2],o[a])([[s[a-1],s[a]]]);break;case 186:this.$=i.addLocationDataFn(o[a-3],o[a])([[s[a-2],s[a-1]]]);break;case 187:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a-1],s[a],{type:s[a-2]}));break;case 188:this.$=i.addLocationDataFn(o[a-4],o[a])(s[a-4].addElse(i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a-1],s[a],{type:s[a-2]}))));break;case 190:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].addElse(s[a]));break;case 191:case 192:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([s[a-2]])),{type:s[a-1],statement:!0}));break;case 193:case 194:case 197:case 198:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op(s[a-1],s[a]));break;case 195:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("-",s[a]));break;case 196:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("+",s[a]));break;case 199:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-2].concat(s[a-1]),s[a]));break;case 200:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",s[a]));break;case 201:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",s[a]));break;case 202:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",s[a-1],null,!0));break;case 203:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",s[a-1],null,!0));break;case 204:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Existence(s[a-1]));break;case 205:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("+",s[a-2],s[a]));break;case 206:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("-",s[a-2],s[a]));break;case 207:case 208:case 209:case 210:case 211:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 212:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return"!"===s[a-1].charAt(0)?new i.Op(s[a-1].slice(1),s[a-2],s[a]).invert():new i.Op(s[a-1],s[a-2],s[a])}());break;case 213:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(s[a-2],s[a],s[a-1]));break;case 214:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(s[a-4],s[a-1],s[a-3]));break;case 215:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(s[a-3],s[a],s[a-2]));break;case 216:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Extends(s[a-2],s[a]))}},table:[{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{1:[3]},{1:[2,2],6:P},t(U,[2,3]),t(U,[2,6],{118:69,109:89,115:90,110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(U,[2,7],{118:69,109:92,115:93,110:x,112:S,116:R,132:Z}),t(et,[2,11],{87:94,68:95,76:101,72:tt,73:nt,74:it,75:rt,77:st,80:ot,90:at,91:ct}),t(et,[2,12],{76:101,87:104,68:105,72:tt,73:nt,74:it,75:rt,77:st,80:ot,90:at,91:ct}),t(et,[2,13]),t(et,[2,14]),t(et,[2,15]),t(et,[2,16]),t(et,[2,17]),t(et,[2,18]),t(et,[2,19]),t(et,[2,20]),t(et,[2,21]),t(et,[2,22]),t(et,[2,8]),t(et,[2,9]),t(et,[2,10]),t(ht,lt,{46:[1,106]}),t(ht,[2,80]),t(ht,[2,81]),t(ht,[2,82]),t(ht,[2,83]),t([1,6,25,26,34,38,55,60,63,72,73,74,75,77,79,80,84,90,92,97,99,108,110,111,112,116,117,132,135,136,141,142,143,144,145,146,147],[2,110],{88:107,91:ut}),t([6,25,55,60],pt,{54:109,61:110,62:111,27:113,50:114,64:115,65:116,28:i,63:dt,82:b,95:ft,96:mt}),{24:119,25:gt},{7:121,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:123,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:124,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:125,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:127,8:126,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,138:[1,128],139:B,140:V},{12:130,13:131,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:132,50:63,64:47,65:48,67:129,69:23,70:24,71:25,82:b,89:w,94:T,95:C,96:E,107:L},{12:130,13:131,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:132,50:63,64:47,65:48,67:133,69:23,70:24,71:25,82:b,89:w,94:T,95:C,96:E,107:L},t(vt,yt,{86:[1,137],139:[1,134],140:[1,135],148:[1,136]}),t(et,[2,189],{127:[1,138]}),{24:139,25:gt},{24:140,25:gt},t(et,[2,155]),{24:141,25:gt},{7:142,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,143],27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(bt,[2,100],{39:22,69:23,70:24,71:25,64:47,65:48,29:49,35:51,27:62,50:63,31:72,12:130,13:131,45:132,24:144,67:146,25:gt,28:i,30:r,32:s,33:o,36:a,37:c,40:h,41:l,42:u,43:p,44:d,82:b,86:[1,145],89:w,94:T,95:C,96:E,107:L}),{7:147,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,141,142,143,144,145,146,147],[2,50],{12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,69:23,70:24,71:25,56:28,67:36,130:37,109:39,113:40,115:41,64:47,65:48,29:49,35:51,27:62,50:63,118:69,31:72,8:122,7:148,11:n,28:i,30:r,32:s,33:o,36:a,37:c,40:h,41:l,42:u,43:p,44:d,51:f,52:m,53:g,57:v,58:y,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,114:D,125:A,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V}),t(et,[2,51]),t(vt,[2,77]),t(vt,[2,78]),t(ht,[2,32]),t(ht,[2,33]),t(ht,[2,34]),t(ht,[2,35]),t(ht,[2,36]),t(ht,[2,37]),t(ht,[2,38]),{4:149,5:3,7:4,8:5,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,150],27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:151,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:kt,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:wt,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:b,85:k,89:w,93:153,94:T,95:C,96:E,97:Tt,100:154,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(ht,[2,116]),t(ht,[2,117],{27:158,28:i}),{25:[2,54]},{25:[2,55]},t(Ct,[2,72]),t(Ct,[2,75]),{7:159,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:160,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:161,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:163,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:162,25:gt,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{27:168,28:i,50:169,64:170,65:171,70:164,82:b,95:ft,96:E,120:165,121:[1,166],122:167},{119:172,123:[1,173],124:[1,174]},t([6,25,60,84],Et,{31:72,83:175,47:176,48:177,10:178,27:179,29:180,50:181,28:i,30:r,32:s,33:o,52:m,95:ft}),t(Ft,[2,26]),t(Ft,[2,27]),t(ht,[2,30]),{12:130,13:182,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:132,50:63,64:47,65:48,67:183,69:23,70:24,71:25,82:b,89:w,94:T,95:C,96:E,107:L},t(Nt,[2,25]),t(Ft,[2,28]),{4:184,5:3,7:4,8:5,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(U,[2,5],{7:4,8:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,69:23,70:24,71:25,56:28,67:36,130:37,109:39,113:40,115:41,64:47,65:48,29:49,35:51,27:62,50:63,118:69,31:72,5:185,11:n,28:i,30:r,32:s,33:o,36:a,37:c,40:h,41:l,42:u,43:p,44:d,51:f,52:m,53:g,57:v,58:y,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,110:x,112:S,114:D,116:R,125:A,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V}),t(et,[2,204]),{7:186,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:187,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:188,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:189,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:190,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:191,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:192,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:193,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:194,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(et,[2,154]),t(et,[2,159]),{7:195,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(et,[2,153]),t(et,[2,158]),{88:196,91:ut},t(Ct,[2,73]),{91:[2,113]},{27:197,28:i},{27:198,28:i},t(Ct,[2,88],{27:199,28:i}),{27:200,28:i},t(Ct,[2,89]),{7:202,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:Lt,64:47,65:48,67:36,69:23,70:24,71:25,78:201,81:203,82:b,85:k,89:w,94:T,95:C,96:E,98:204,99:xt,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{76:207,77:st,80:ot},{88:208,91:ut},t(Ct,[2,74]),{6:[1,210],7:209,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,211],27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(St,[2,111]),{7:214,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:kt,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:wt,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:b,85:k,89:w,92:[1,212],93:213,94:T,95:C,96:E,100:154,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t([6,25],Dt,{59:217,55:[1,215],60:Rt}),t(At,[2,59]),t(At,[2,63],{46:[1,219],63:[1,218]}),t(At,[2,66]),t(It,[2,67]),t(It,[2,68]),t(It,[2,69]),t(It,[2,70]),{27:158,28:i},{7:214,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:kt,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:wt,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:b,85:k,89:w,93:153,94:T,95:C,96:E,97:Tt,100:154,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(et,[2,53]),{4:221,5:3,7:4,8:5,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[1,220],27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,135,136,142,143,144,145,146,147],[2,193],{118:69,109:89,115:90,141:X}),{109:92,110:x,112:S,115:93,116:R,118:69,132:Z},t(_t,[2,194],{118:69,109:89,115:90,141:X,143:Y}),t(_t,[2,195],{118:69,109:89,115:90,141:X,143:Y}),t(_t,[2,196],{118:69,109:89,115:90,141:X,143:Y}),t(et,[2,197],{118:69,109:92,115:93}),t(Ot,[2,198],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{7:222,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(et,[2,200],{72:yt,73:yt,74:yt,75:yt,77:yt,80:yt,90:yt,91:yt}),{68:95,72:tt,73:nt,74:it,75:rt,76:101,77:st,80:ot,87:94,90:at,91:ct},{68:105,72:tt,73:nt,74:it,75:rt,76:101,77:st,80:ot,87:104,90:at,91:ct},t($t,lt),t(et,[2,201],{72:yt,73:yt,74:yt,75:yt,77:yt,80:yt,90:yt,91:yt}),t(et,[2,202]),t(et,[2,203]),{6:[1,225],7:223,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,224],27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:226,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{24:227,25:gt,131:[1,228]},t(et,[2,138],{103:229,104:[1,230],105:[1,231]}),t(et,[2,152]),t(et,[2,160]),{25:[1,232],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},{126:233,128:234,129:jt},t(et,[2,101]),{7:236,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(bt,[2,104],{24:237,25:gt,72:yt,73:yt,74:yt,75:yt,77:yt,80:yt,90:yt,91:yt,86:[1,238]}),t(Ot,[2,145],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Ot,[2,49],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{6:P,108:[1,239]},{4:240,5:3,7:4,8:5,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t([6,25,60,97],Mt,{118:69,109:89,115:90,98:241,63:[1,242],99:xt,110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Bt,[2,119]),t([6,25,97],Dt,{59:243,60:Vt}),t(Pt,[2,128]),{7:214,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:kt,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:wt,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:b,85:k,89:w,93:245,94:T,95:C,96:E,100:154,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(Pt,[2,134]),t(Pt,[2,135]),t(Nt,[2,118]),{24:246,25:gt,109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},t(Ut,[2,148],{118:69,109:89,115:90,110:x,111:[1,247],112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Ut,[2,150],{118:69,109:89,115:90,110:x,111:[1,248],112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(et,[2,156]),t(Gt,[2,157],{118:69,109:89,115:90,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,132,135,136,141,142,143,144,145,146,147],[2,161],{117:[1,249]}),t(Ht,[2,164]),{27:168,28:i,50:169,64:170,65:171,82:b,95:ft,96:mt,120:250,122:167},t(Ht,[2,170],{60:[1,251]}),t(qt,[2,166]),t(qt,[2,167]),t(qt,[2,168]),t(qt,[2,169]),t(et,[2,163]),{7:252,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:253,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t([6,25,84],Dt,{59:254,60:Xt}),t(Wt,[2,96]),t(Wt,[2,42],{49:[1,256]}),t(Wt,[2,45]),t(Yt,[2,46]),t(Yt,[2,47]),t(Yt,[2,48]),{38:[1,257],68:105,72:tt,73:nt,74:it,75:rt,76:101,77:st,80:ot,87:104,90:at,91:ct},t($t,yt),{6:P,34:[1,258]},t(U,[2,4]),t(Kt,[2,205],{118:69,109:89,115:90,141:X,142:W,143:Y}),t(Kt,[2,206],{118:69,109:89,115:90,141:X,142:W,143:Y}),t(_t,[2,207],{118:69,109:89,115:90,141:X,143:Y}),t(_t,[2,208],{118:69,109:89,115:90,141:X,143:Y}),t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,144,145,146,147],[2,209],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y}),t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,145,146],[2,210],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,147:Q}),t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,146],[2,211],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,147:Q}),t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,117,132,145,146,147],[2,212],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K}),t(Gt,[2,192],{118:69,109:89,115:90,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Gt,[2,191],{118:69,109:89,115:90,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(St,[2,108]),t(Ct,[2,84]),t(Ct,[2,85]),t(Ct,[2,86]),t(Ct,[2,87]),{79:[1,259]},{63:Lt,79:[2,92],98:260,99:xt,109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},{79:[2,93]},{7:261,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,79:[2,127],82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(zt,[2,121]),t(zt,Jt),t(Ct,[2,91]),t(St,[2,109]),t(Ot,[2,39],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{7:262,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:263,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(St,[2,114]),t([6,25,92],Dt,{59:264,60:Vt}),t(Pt,Mt,{118:69,109:89,115:90,63:[1,265],110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{56:266,57:v,58:y},t(Qt,Zt,{62:111,27:113,50:114,64:115,65:116,61:267,28:i,63:dt,82:b,95:ft,96:mt}),{6:en,25:tn},t(At,[2,64]),{7:270,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(nn,[2,23]),{6:P,26:[1,271]},t(Ot,[2,199],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Ot,[2,213],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{7:272,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:273,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(Ot,[2,216],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(et,[2,190]),{7:274,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(et,[2,139],{104:[1,275]}),{24:276,25:gt},{24:279,25:gt,27:277,28:i,65:278,82:b},{126:280,128:234,129:jt},{26:[1,281],127:[1,282],128:283,129:jt},t(rn,[2,183]),{7:285,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,101:284,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(sn,[2,102],{118:69,109:89,115:90,24:286,25:gt,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(et,[2,105]),{7:287,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(ht,[2,146]),{6:P,26:[1,288]},{7:289,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t([11,28,30,32,33,36,37,40,41,42,43,44,51,52,53,57,58,82,85,89,94,95,96,102,106,107,110,112,114,116,125,131,133,134,135,136,137,139,140],Jt,{6:on,25:on,60:on,97:on}),{6:an,25:cn,97:[1,290]},t([6,25,26,92,97],Zt,{12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,69:23,70:24,71:25,56:28,67:36,130:37,109:39,113:40,115:41,64:47,65:48,29:49,35:51,27:62,50:63,118:69,31:72,8:122,66:156,7:214,100:293,11:n,28:i,30:r,32:s,33:o,36:a,37:c,40:h,41:l,42:u,43:p,44:d,51:f,52:m,53:g,57:v,58:y,63:wt,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,110:x,112:S,114:D,116:R,125:A,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V}),t(Qt,Dt,{59:294,60:Vt}),t(hn,[2,187]),{7:295,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:296,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:297,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(Ht,[2,165]),{27:168,28:i,50:169,64:170,65:171,82:b,95:ft,96:mt,122:298},t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,112,116,132],[2,172],{118:69,109:89,115:90,111:[1,299],117:[1,300],135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(ln,[2,173],{118:69,109:89,115:90,111:[1,301],135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{6:un,25:pn,84:[1,302]},t([6,25,26,84],Zt,{31:72,48:177,10:178,27:179,29:180,50:181,47:305,28:i,30:r,32:s,33:o,52:m,95:ft}),{7:306,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,307],27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(ht,[2,31]),t(Ft,[2,29]),t(Ct,[2,90]),{7:308,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,79:[2,125],82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{79:[2,126],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},t(Ot,[2,40],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{26:[1,309],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},{6:an,25:cn,92:[1,310]},t(Pt,on),{24:311,25:gt},t(At,[2,60]),{27:113,28:i,50:114,61:312,62:111,63:dt,64:115,65:116,82:b,95:ft,96:mt},t(dn,pt,{61:110,62:111,27:113,50:114,64:115,65:116,54:313,28:i,63:dt,82:b,95:ft,96:mt}),t(At,[2,65],{118:69,109:89,115:90,110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(nn,[2,24]),{26:[1,314],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},t(Ot,[2,215],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{24:315,25:gt,109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},{24:316,25:gt},t(et,[2,140]),{24:317,25:gt},{24:318,25:gt},t(fn,[2,144]),{26:[1,319],127:[1,320],128:283,129:jt},t(et,[2,181]),{24:321,25:gt},t(rn,[2,184]),{24:322,25:gt,60:[1,323]},t(mn,[2,136],{118:69,109:89,115:90,110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(et,[2,103]),t(sn,[2,106],{118:69,109:89,115:90,24:324,25:gt,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{108:[1,325]},{97:[1,326],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},t(Bt,[2,120]),{7:214,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:wt,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,100:327,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:214,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:kt,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,63:wt,64:47,65:48,66:156,67:36,69:23,70:24,71:25,82:b,85:k,89:w,93:328,94:T,95:C,96:E,100:154,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(Pt,[2,129]),{6:an,25:cn,26:[1,329]},t(Gt,[2,149],{118:69,109:89,115:90,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Gt,[2,151],{118:69,109:89,115:90,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Gt,[2,162],{118:69,109:89,115:90,110:x,112:S,116:R,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Ht,[2,171]),{7:330,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:331,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:332,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(Bt,[2,94]),{10:178,27:179,28:i,29:180,30:r,31:72,32:s,33:o,47:333,48:177,50:181,52:m,95:ft},t(dn,Et,{31:72,47:176,48:177,10:178,27:179,29:180,50:181,83:334,28:i,30:r,32:s,33:o,52:m,95:ft}),t(Wt,[2,97]),t(Wt,[2,43],{118:69,109:89,115:90,110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{7:335,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{79:[2,124],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},t(et,[2,41]),t(St,[2,115]),t(et,[2,52]),t(At,[2,61]),t(Qt,Dt,{59:336,60:Rt}),t(et,[2,214]),t(hn,[2,188]),t(et,[2,141]),t(fn,[2,142]),t(fn,[2,143]),t(et,[2,179]),{24:337,25:gt},{26:[1,338]},t(rn,[2,185],{6:[1,339]}),{7:340,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},t(et,[2,107]),t(ht,[2,147]),t(ht,[2,123]),t(Pt,[2,130]),t(Qt,Dt,{59:341,60:Vt}),t(Pt,[2,131]),t([1,6,25,26,34,55,60,63,79,84,92,97,99,108,110,111,112,116,132],[2,174],{118:69,109:89,115:90,117:[1,342],135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(ln,[2,176],{118:69,109:89,115:90,111:[1,343],135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Ot,[2,175],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Wt,[2,98]),t(Qt,Dt,{59:344,60:Xt}),{26:[1,345],109:89,110:x,112:S,115:90,116:R,118:69,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q},{6:en,25:tn,26:[1,346]},{26:[1,347]},t(et,[2,182]),t(rn,[2,186]),t(mn,[2,137],{118:69,109:89,115:90,110:x,112:S,116:R,132:G,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),{6:an,25:cn,26:[1,348]},{7:349,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{7:350,8:122,9:18,10:19,11:n,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:i,29:49,30:r,31:72,32:s,33:o,35:51,36:a,37:c,39:22,40:h,41:l,42:u,43:p,44:d,45:21,50:63,51:f,52:m,53:g,56:28,57:v,58:y,64:47,65:48,67:36,69:23,70:24,71:25,82:b,85:k,89:w,94:T,95:C,96:E,102:F,106:N,107:L,109:39,110:x,112:S,113:40,114:D,115:41,116:R,118:69,125:A,130:37,131:I,133:_,134:O,135:$,136:j,137:M,139:B,140:V},{6:un,25:pn,26:[1,351]},t(Wt,[2,44]),t(At,[2,62]),t(et,[2,180]),t(Pt,[2,132]),t(Ot,[2,177],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Ot,[2,178],{118:69,109:89,115:90,135:H,136:q,141:X,142:W,143:Y,144:K,145:z,146:J,147:Q}),t(Wt,[2,99])],defaultActions:{60:[2,54],61:[2,55],96:[2,113],203:[2,93]},parseError:function(e,t){if(!t.recoverable)throw Error(e);
this.trace(e)},parse:function(e){function t(){var e;return e=f.lex()||p,"number"!=typeof e&&(e=n.symbols_[e]||e),e}var n=this,i=[0],r=[null],s=[],o=this.table,a="",c=0,h=0,l=0,u=2,p=1,d=s.slice.call(arguments,1),f=Object.create(this.lexer),m={yy:{}};for(var g in this.yy)Object.prototype.hasOwnProperty.call(this.yy,g)&&(m.yy[g]=this.yy[g]);f.setInput(e,m.yy),m.yy.lexer=f,m.yy.parser=this,f.yylloc===void 0&&(f.yylloc={});var v=f.yylloc;s.push(v);var y=f.options&&f.options.ranges;this.parseError="function"==typeof m.yy.parseError?m.yy.parseError:Object.getPrototypeOf(this).parseError;for(var b,k,w,T,C,E,F,N,L,x={};;){if(w=i[i.length-1],this.defaultActions[w]?T=this.defaultActions[w]:((null===b||b===void 0)&&(b=t()),T=o[w]&&o[w][b]),T===void 0||!T.length||!T[0]){var S="";L=[];for(E in o[w])this.terminals_[E]&&E>u&&L.push("'"+this.terminals_[E]+"'");S=f.showPosition?"Parse error on line "+(c+1)+":\n"+f.showPosition()+"\nExpecting "+L.join(", ")+", got '"+(this.terminals_[b]||b)+"'":"Parse error on line "+(c+1)+": Unexpected "+(b==p?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(S,{text:f.match,token:this.terminals_[b]||b,line:f.yylineno,loc:v,expected:L})}if(T[0]instanceof Array&&T.length>1)throw Error("Parse Error: multiple actions possible at state: "+w+", token: "+b);switch(T[0]){case 1:i.push(b),r.push(f.yytext),s.push(f.yylloc),i.push(T[1]),b=null,k?(b=k,k=null):(h=f.yyleng,a=f.yytext,c=f.yylineno,v=f.yylloc,l>0&&l--);break;case 2:if(F=this.productions_[T[1]][1],x.$=r[r.length-F],x._$={first_line:s[s.length-(F||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(F||1)].first_column,last_column:s[s.length-1].last_column},y&&(x._$.range=[s[s.length-(F||1)].range[0],s[s.length-1].range[1]]),C=this.performAction.apply(x,[a,h,c,m.yy,T[1],r,s].concat(d)),C!==void 0)return C;F&&(i=i.slice(0,2*-1*F),r=r.slice(0,-1*F),s=s.slice(0,-1*F)),i.push(this.productions_[T[1]][0]),r.push(x.$),s.push(x._$),N=o[i[i.length-2]][i[i.length-1]],i.push(N);break;case 3:return!0}}return!0}};return e.prototype=gn,gn.Parser=e,new e}();return require!==void 0&&e!==void 0&&(e.parser=n,e.Parser=n.Parser,e.parse=function(){return n.parse.apply(n,arguments)},e.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var n=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return e.parser.parse(n)},t!==void 0&&require.main===t&&e.main(process.argv.slice(1))),t.exports}(),require["./scope"]=function(){var e={},t={exports:e};return function(){var t,n=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};e.Scope=t=function(){function e(e,t,n,i){var r,s;this.parent=e,this.expressions=t,this.method=n,this.referencedVars=i,this.variables=[{name:"arguments",type:"arguments"}],this.positions={},this.parent||(this.utilities={}),this.root=null!=(r=null!=(s=this.parent)?s.root:void 0)?r:this}return e.prototype.add=function(e,t,n){return this.shared&&!n?this.parent.add(e,t,n):Object.prototype.hasOwnProperty.call(this.positions,e)?this.variables[this.positions[e]].type=t:this.positions[e]=this.variables.push({name:e,type:t})-1},e.prototype.namedMethod=function(){var e;return(null!=(e=this.method)?e.name:void 0)||!this.parent?this.method:this.parent.namedMethod()},e.prototype.find=function(e){return this.check(e)?!0:(this.add(e,"var"),!1)},e.prototype.parameter=function(e){return this.shared&&this.parent.check(e,!0)?void 0:this.add(e,"param")},e.prototype.check=function(e){var t;return!!(this.type(e)||(null!=(t=this.parent)?t.check(e):void 0))},e.prototype.temporary=function(e,t,n){return null==n&&(n=!1),n?(t+parseInt(e,36)).toString(36).replace(/\d/g,"a"):e+(t||"")},e.prototype.type=function(e){var t,n,i,r;for(i=this.variables,t=0,n=i.length;n>t;t++)if(r=i[t],r.name===e)return r.type;return null},e.prototype.freeVariable=function(e,t){var i,r,s;for(null==t&&(t={}),i=0;;){if(s=this.temporary(e,i,t.single),!(this.check(s)||n.call(this.root.referencedVars,s)>=0))break;i++}return(null!=(r=t.reserve)?r:!0)&&this.add(s,"var",!0),s},e.prototype.assign=function(e,t){return this.add(e,{value:t,assigned:!0},!0),this.hasAssignments=!0},e.prototype.hasDeclarations=function(){return!!this.declaredVariables().length},e.prototype.declaredVariables=function(){var e;return function(){var t,n,i,r;for(i=this.variables,r=[],t=0,n=i.length;n>t;t++)e=i[t],"var"===e.type&&r.push(e.name);return r}.call(this).sort()},e.prototype.assignedVariables=function(){var e,t,n,i,r;for(n=this.variables,i=[],e=0,t=n.length;t>e;e++)r=n[e],r.type.assigned&&i.push(r.name+" = "+r.type.value);return i},e}()}.call(this),t.exports}(),require["./nodes"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,g,v,y,b,k,w,T,C,E,F,N,L,x,S,D,R,A,I,_,O,$,j,M,B,V,P,U,G,H,q,X,W,Y,K,z,J,Q,Z,et,tt,nt,it,rt,st,ot,at,ct,ht,lt,ut,pt,dt,ft,mt,gt,vt,yt,bt,kt=function(e,t){function n(){this.constructor=e}for(var i in t)wt.call(t,i)&&(e[i]=t[i]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},wt={}.hasOwnProperty,Tt=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},Ct=[].slice;Error.stackTraceLimit=1/0,P=require("./scope").Scope,dt=require("./lexer"),$=dt.RESERVED,V=dt.STRICT_PROSCRIBED,ft=require("./helpers"),et=ft.compact,rt=ft.flatten,it=ft.extend,lt=ft.merge,tt=ft.del,gt=ft.starts,nt=ft.ends,mt=ft.some,Z=ft.addLocationDataFn,ht=ft.locationDataToString,vt=ft.throwSyntaxError,e.extend=it,e.addLocationDataFn=Z,Q=function(){return!0},D=function(){return!1},X=function(){return this},S=function(){return this.negated=!this.negated,this},e.CodeFragment=h=function(){function e(e,t){var n;this.code=""+t,this.locationData=null!=e?e.locationData:void 0,this.type=(null!=e?null!=(n=e.constructor)?n.name:void 0:void 0)||"unknown"}return e.prototype.toString=function(){return""+this.code+(this.locationData?": "+ht(this.locationData):"")},e}(),st=function(e){var t;return function(){var n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],r.push(t.code);return r}().join("")},e.Base=r=function(){function e(){}return e.prototype.compile=function(e,t){return st(this.compileToFragments(e,t))},e.prototype.compileToFragments=function(e,t){var n;return e=it({},e),t&&(e.level=t),n=this.unfoldSoak(e)||this,n.tab=e.indent,e.level!==L&&n.isStatement(e)?n.compileClosure(e):n.compileNode(e)},e.prototype.compileClosure=function(e){var n,i,r,a,h,l;return(a=this.jumps())&&a.error("cannot use a pure statement in an expression"),e.sharedScope=!0,r=new c([],s.wrap([this])),n=[],((i=this.contains(at))||this.contains(ct))&&(n=[new x("this")],i?(h="apply",n.push(new x("arguments"))):h="call",r=new z(r,[new t(new x(h))])),l=new o(r,n).compileNode(e),r.isGenerator&&(l.unshift(this.makeCode("(yield* ")),l.push(this.makeCode(")"))),l},e.prototype.cache=function(e,t,n){var r,s,o;return r=null!=n?n(this):this.isComplex(),r?(s=new x(e.scope.freeVariable("ref")),o=new i(s,this),t?[o.compileToFragments(e,t),[this.makeCode(s.value)]]:[o,s]):(s=t?this.compileToFragments(e,t):this,[s,s])},e.prototype.cacheToCodeFragments=function(e){return[st(e[0]),st(e[1])]},e.prototype.makeReturn=function(e){var t;return t=this.unwrapAll(),e?new o(new x(e+".push"),[t]):new M(t)},e.prototype.contains=function(e){var t;return t=void 0,this.traverseChildren(!1,function(n){return e(n)?(t=n,!1):void 0}),t},e.prototype.lastNonComment=function(e){var t;for(t=e.length;t--;)if(!(e[t]instanceof l))return e[t];return null},e.prototype.toString=function(e,t){var n;return null==e&&(e=""),null==t&&(t=this.constructor.name),n="\n"+e+t,this.soak&&(n+="?"),this.eachChild(function(t){return n+=t.toString(e+q)}),n},e.prototype.eachChild=function(e){var t,n,i,r,s,o,a,c;if(!this.children)return this;for(a=this.children,i=0,s=a.length;s>i;i++)if(t=a[i],this[t])for(c=rt([this[t]]),r=0,o=c.length;o>r;r++)if(n=c[r],e(n)===!1)return this;return this},e.prototype.traverseChildren=function(e,t){return this.eachChild(function(n){var i;return i=t(n),i!==!1?n.traverseChildren(e,t):void 0})},e.prototype.invert=function(){return new I("!",this)},e.prototype.unwrapAll=function(){var e;for(e=this;e!==(e=e.unwrap()););return e},e.prototype.children=[],e.prototype.isStatement=D,e.prototype.jumps=D,e.prototype.isComplex=Q,e.prototype.isChainable=D,e.prototype.isAssignable=D,e.prototype.unwrap=X,e.prototype.unfoldSoak=D,e.prototype.assigns=D,e.prototype.updateLocationDataIfMissing=function(e){return this.locationData?this:(this.locationData=e,this.eachChild(function(t){return t.updateLocationDataIfMissing(e)}))},e.prototype.error=function(e){return vt(e,this.locationData)},e.prototype.makeCode=function(e){return new h(this,e)},e.prototype.wrapInBraces=function(e){return[].concat(this.makeCode("("),e,this.makeCode(")"))},e.prototype.joinFragmentArrays=function(e,t){var n,i,r,s,o;for(n=[],r=s=0,o=e.length;o>s;r=++s)i=e[r],r&&n.push(this.makeCode(t)),n=n.concat(i);return n},e}(),e.Block=s=function(e){function t(e){this.expressions=et(rt(e||[]))}return kt(t,e),t.prototype.children=["expressions"],t.prototype.push=function(e){return this.expressions.push(e),this},t.prototype.pop=function(){return this.expressions.pop()},t.prototype.unshift=function(e){return this.expressions.unshift(e),this},t.prototype.unwrap=function(){return 1===this.expressions.length?this.expressions[0]:this},t.prototype.isEmpty=function(){return!this.expressions.length},t.prototype.isStatement=function(e){var t,n,i,r;for(r=this.expressions,n=0,i=r.length;i>n;n++)if(t=r[n],t.isStatement(e))return!0;return!1},t.prototype.jumps=function(e){var t,n,i,r,s;for(s=this.expressions,n=0,r=s.length;r>n;n++)if(t=s[n],i=t.jumps(e))return i},t.prototype.makeReturn=function(e){var t,n;for(n=this.expressions.length;n--;)if(t=this.expressions[n],!(t instanceof l)){this.expressions[n]=t.makeReturn(e),t instanceof M&&!t.expression&&this.expressions.splice(n,1);break}return this},t.prototype.compileToFragments=function(e,n){return null==e&&(e={}),e.scope?t.__super__.compileToFragments.call(this,e,n):this.compileRoot(e)},t.prototype.compileNode=function(e){var n,i,r,s,o,a,c,h,l;for(this.tab=e.indent,l=e.level===L,i=[],h=this.expressions,s=o=0,a=h.length;a>o;s=++o)c=h[s],c=c.unwrapAll(),c=c.unfoldSoak(e)||c,c instanceof t?i.push(c.compileNode(e)):l?(c.front=!0,r=c.compileToFragments(e),c.isStatement(e)||(r.unshift(this.makeCode(""+this.tab)),r.push(this.makeCode(";"))),i.push(r)):i.push(c.compileToFragments(e,E));return l?this.spaced?[].concat(this.joinFragmentArrays(i,"\n\n"),this.makeCode("\n")):this.joinFragmentArrays(i,"\n"):(n=i.length?this.joinFragmentArrays(i,", "):[this.makeCode("void 0")],i.length>1&&e.level>=E?this.wrapInBraces(n):n)},t.prototype.compileRoot=function(e){var t,n,i,r,s,o,a,c,h,u,p;for(e.indent=e.bare?"":q,e.level=L,this.spaced=!0,e.scope=new P(null,this,null,null!=(h=e.referencedVars)?h:[]),u=e.locals||[],r=0,s=u.length;s>r;r++)o=u[r],e.scope.parameter(o);return a=[],e.bare||(c=function(){var e,n,r,s;for(r=this.expressions,s=[],i=e=0,n=r.length;n>e&&(t=r[i],t.unwrap()instanceof l);i=++e)s.push(t);return s}.call(this),p=this.expressions.slice(c.length),this.expressions=c,c.length&&(a=this.compileNode(lt(e,{indent:""})),a.push(this.makeCode("\n"))),this.expressions=p),n=this.compileWithDeclarations(e),e.bare?n:[].concat(a,this.makeCode("(function() {\n"),n,this.makeCode("\n}).call(this);\n"))},t.prototype.compileWithDeclarations=function(e){var t,n,i,r,s,o,a,c,h,u,p,d,f,m;for(r=[],c=[],h=this.expressions,s=o=0,a=h.length;a>o&&(i=h[s],i=i.unwrap(),i instanceof l||i instanceof x);s=++o);return e=lt(e,{level:L}),s&&(d=this.expressions.splice(s,9e9),u=[this.spaced,!1],m=u[0],this.spaced=u[1],p=[this.compileNode(e),m],r=p[0],this.spaced=p[1],this.expressions=d),c=this.compileNode(e),f=e.scope,f.expressions===this&&(n=e.scope.hasDeclarations(),t=f.hasAssignments,n||t?(s&&r.push(this.makeCode("\n")),r.push(this.makeCode(this.tab+"var ")),n&&r.push(this.makeCode(f.declaredVariables().join(", "))),t&&(n&&r.push(this.makeCode(",\n"+(this.tab+q))),r.push(this.makeCode(f.assignedVariables().join(",\n"+(this.tab+q))))),r.push(this.makeCode(";\n"+(this.spaced?"\n":"")))):r.length&&c.length&&r.push(this.makeCode("\n"))),r.concat(c)},t.wrap=function(e){return 1===e.length&&e[0]instanceof t?e[0]:new t(e)},t}(r),e.Literal=x=function(e){function t(e){this.value=e}return kt(t,e),t.prototype.makeReturn=function(){return this.isStatement()?this:t.__super__.makeReturn.apply(this,arguments)},t.prototype.isAssignable=function(){return g.test(this.value)},t.prototype.isStatement=function(){var e;return"break"===(e=this.value)||"continue"===e||"debugger"===e},t.prototype.isComplex=D,t.prototype.assigns=function(e){return e===this.value},t.prototype.jumps=function(e){return"break"!==this.value||(null!=e?e.loop:void 0)||(null!=e?e.block:void 0)?"continue"!==this.value||(null!=e?e.loop:void 0)?void 0:this:this},t.prototype.compileNode=function(e){var t,n,i;return n="this"===this.value?(null!=(i=e.scope.method)?i.bound:void 0)?e.scope.method.context:this.value:this.value.reserved?'"'+this.value+'"':this.value,t=this.isStatement()?""+this.tab+n+";":n,[this.makeCode(t)]},t.prototype.toString=function(){return' "'+this.value+'"'},t}(r),e.Undefined=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return kt(t,e),t.prototype.isAssignable=D,t.prototype.isComplex=D,t.prototype.compileNode=function(e){return[this.makeCode(e.level>=T?"(void 0)":"void 0")]},t}(r),e.Null=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return kt(t,e),t.prototype.isAssignable=D,t.prototype.isComplex=D,t.prototype.compileNode=function(){return[this.makeCode("null")]},t}(r),e.Bool=function(e){function t(e){this.val=e}return kt(t,e),t.prototype.isAssignable=D,t.prototype.isComplex=D,t.prototype.compileNode=function(){return[this.makeCode(this.val)]},t}(r),e.Return=M=function(e){function t(e){this.expression=e}return kt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=Q,t.prototype.makeReturn=X,t.prototype.jumps=X,t.prototype.compileToFragments=function(e,n){var i,r;return i=null!=(r=this.expression)?r.makeReturn():void 0,!i||i instanceof t?t.__super__.compileToFragments.call(this,e,n):i.compileToFragments(e,n)},t.prototype.compileNode=function(e){var t,n,i;return t=[],n=null!=(i=this.expression)?"function"==typeof i.isYieldReturn?i.isYieldReturn():void 0:void 0,n||t.push(this.makeCode(this.tab+("return"+(this.expression?" ":"")))),this.expression&&(t=t.concat(this.expression.compileToFragments(e,N))),n||t.push(this.makeCode(";")),t},t}(r),e.Value=z=function(e){function t(e,n,i){return!n&&e instanceof t?e:(this.base=e,this.properties=n||[],i&&(this[i]=!0),this)}return kt(t,e),t.prototype.children=["base","properties"],t.prototype.add=function(e){return this.properties=this.properties.concat(e),this},t.prototype.hasProperties=function(){return!!this.properties.length},t.prototype.bareLiteral=function(e){return!this.properties.length&&this.base instanceof e},t.prototype.isArray=function(){return this.bareLiteral(n)},t.prototype.isRange=function(){return this.bareLiteral(j)},t.prototype.isComplex=function(){return this.hasProperties()||this.base.isComplex()},t.prototype.isAssignable=function(){return this.hasProperties()||this.base.isAssignable()},t.prototype.isSimpleNumber=function(){return this.bareLiteral(x)&&B.test(this.base.value)},t.prototype.isString=function(){return this.bareLiteral(x)&&y.test(this.base.value)},t.prototype.isRegex=function(){return this.bareLiteral(x)&&v.test(this.base.value)},t.prototype.isAtomic=function(){var e,t,n,i;for(i=this.properties.concat(this.base),e=0,t=i.length;t>e;e++)if(n=i[e],n.soak||n instanceof o)return!1;return!0},t.prototype.isNotCallable=function(){return this.isSimpleNumber()||this.isString()||this.isRegex()||this.isArray()||this.isRange()||this.isSplice()||this.isObject()},t.prototype.isStatement=function(e){return!this.properties.length&&this.base.isStatement(e)},t.prototype.assigns=function(e){return!this.properties.length&&this.base.assigns(e)},t.prototype.jumps=function(e){return!this.properties.length&&this.base.jumps(e)},t.prototype.isObject=function(e){return this.properties.length?!1:this.base instanceof A&&(!e||this.base.generated)},t.prototype.isSplice=function(){var e,t;return t=this.properties,e=t[t.length-1],e instanceof U},t.prototype.looksStatic=function(e){var t;return this.base.value===e&&1===this.properties.length&&"prototype"!==(null!=(t=this.properties[0].name)?t.value:void 0)},t.prototype.unwrap=function(){return this.properties.length?this:this.base},t.prototype.cacheReference=function(e){var n,r,s,o,a;return a=this.properties,s=a[a.length-1],2>this.properties.length&&!this.base.isComplex()&&!(null!=s?s.isComplex():void 0)?[this,this]:(n=new t(this.base,this.properties.slice(0,-1)),n.isComplex()&&(r=new x(e.scope.freeVariable("base")),n=new t(new O(new i(r,n)))),s?(s.isComplex()&&(o=new x(e.scope.freeVariable("name")),s=new w(new i(o,s.index)),o=new w(o)),[n.add(s),new t(r||n.base,[o||s])]):[n,r])},t.prototype.compileNode=function(e){var t,n,i,r,s;for(this.base.front=this.front,s=this.properties,t=this.base.compileToFragments(e,s.length?T:null),(this.base instanceof O||s.length)&&B.test(st(t))&&t.push(this.makeCode(".")),n=0,i=s.length;i>n;n++)r=s[n],t.push.apply(t,r.compileToFragments(e));return t},t.prototype.unfoldSoak=function(e){return null!=this.unfoldedSoak?this.unfoldedSoak:this.unfoldedSoak=function(n){return function(){var r,s,o,a,c,h,l,p,d,f;if(o=n.base.unfoldSoak(e))return(p=o.body.properties).push.apply(p,n.properties),o;for(d=n.properties,s=a=0,c=d.length;c>a;s=++a)if(h=d[s],h.soak)return h.soak=!1,r=new t(n.base,n.properties.slice(0,s)),f=new t(n.base,n.properties.slice(s)),r.isComplex()&&(l=new x(e.scope.freeVariable("ref")),r=new O(new i(l,r)),f.base=l),new b(new u(r),f,{soak:!0});return!1}}(this)()},t}(r),e.Comment=l=function(e){function t(e){this.comment=e}return kt(t,e),t.prototype.isStatement=Q,t.prototype.makeReturn=X,t.prototype.compileNode=function(e,t){var n,i;return i=this.comment.replace(/^(\s*)# /gm,"$1 * "),n="/*"+ut(i,this.tab)+(Tt.call(i,"\n")>=0?"\n"+this.tab:"")+" */",(t||e.level)===L&&(n=e.indent+n),[this.makeCode("\n"),this.makeCode(n)]},t}(r),e.Call=o=function(e){function n(e,t,n){this.args=null!=t?t:[],this.soak=n,this.isNew=!1,this.isSuper="super"===e,this.variable=this.isSuper?null:e,e instanceof z&&e.isNotCallable()&&e.error("literal is not a function")}return kt(n,e),n.prototype.children=["variable","args"],n.prototype.newInstance=function(){var e,t;return e=(null!=(t=this.variable)?t.base:void 0)||this.variable,e instanceof n&&!e.isNew?e.newInstance():this.isNew=!0,this},n.prototype.superReference=function(e){var n,r,s,o,a,c,h,l;return a=e.scope.namedMethod(),(null!=a?a.klass:void 0)?(o=a.klass,c=a.name,l=a.variable,o.isComplex()&&(s=new x(e.scope.parent.freeVariable("base")),r=new z(new O(new i(s,o))),l.base=r,l.properties.splice(0,o.properties.length)),(c.isComplex()||c instanceof w&&c.index.isAssignable())&&(h=new x(e.scope.parent.freeVariable("name")),c=new w(new i(h,c.index)),l.properties.pop(),l.properties.push(c)),n=[new t(new x("__super__"))],a["static"]&&n.push(new t(new x("constructor"))),n.push(null!=h?new w(h):c),new z(null!=s?s:o,n).compile(e)):(null!=a?a.ctor:void 0)?a.name+".__super__.constructor":this.error("cannot call super outside of an instance method.")},n.prototype.superThis=function(e){var t;return t=e.scope.method,t&&!t.klass&&t.context||"this"},n.prototype.unfoldSoak=function(e){var t,i,r,s,o,a,c,h,l;if(this.soak){if(this.variable){if(i=yt(e,this,"variable"))return i;c=new z(this.variable).cacheReference(e),s=c[0],l=c[1]}else s=new x(this.superReference(e)),l=new z(s);return l=new n(l,this.args),l.isNew=this.isNew,s=new x("typeof "+s.compile(e)+' === "function"'),new b(s,new z(l),{soak:!0})}for(t=this,a=[];;)if(t.variable instanceof n)a.push(t),t=t.variable;else{if(!(t.variable instanceof z))break;if(a.push(t),!((t=t.variable.base)instanceof n))break}for(h=a.reverse(),r=0,o=h.length;o>r;r++)t=h[r],i&&(t.variable instanceof n?t.variable=i:t.variable.base=i),i=yt(e,t,"variable");return i},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,h,l;if(null!=(h=this.variable)&&(h.front=this.front),r=G.compileSplattedArray(e,this.args,!0),r.length)return this.compileSplat(e,r);for(i=[],l=this.args,n=o=0,a=l.length;a>o;n=++o)t=l[n],n&&i.push(this.makeCode(", ")),i.push.apply(i,t.compileToFragments(e,E));return s=[],this.isSuper?(c=this.superReference(e)+(".call("+this.superThis(e)),i.length&&(c+=", "),s.push(this.makeCode(c))):(this.isNew&&s.push(this.makeCode("new ")),s.push.apply(s,this.variable.compileToFragments(e,T)),s.push(this.makeCode("("))),s.push.apply(s,i),s.push(this.makeCode(")")),s},n.prototype.compileSplat=function(e,t){var n,i,r,s,o,a;return this.isSuper?[].concat(this.makeCode(this.superReference(e)+".apply("+this.superThis(e)+", "),t,this.makeCode(")")):this.isNew?(s=this.tab+q,[].concat(this.makeCode("(function(func, args, ctor) {\n"+s+"ctor.prototype = func.prototype;\n"+s+"var child = new ctor, result = func.apply(child, args);\n"+s+"return Object(result) === result ? result : child;\n"+this.tab+"})("),this.variable.compileToFragments(e,E),this.makeCode(", "),t,this.makeCode(", function(){})"))):(n=[],i=new z(this.variable),(o=i.properties.pop())&&i.isComplex()?(a=e.scope.freeVariable("ref"),n=n.concat(this.makeCode("("+a+" = "),i.compileToFragments(e,E),this.makeCode(")"),o.compileToFragments(e))):(r=i.compileToFragments(e,T),B.test(st(r))&&(r=this.wrapInBraces(r)),o?(a=st(r),r.push.apply(r,o.compileToFragments(e))):a="null",n=n.concat(r)),n=n.concat(this.makeCode(".apply("+a+", "),t,this.makeCode(")")))},n}(r),e.Extends=d=function(e){function t(e,t){this.child=e,this.parent=t}return kt(t,e),t.prototype.children=["child","parent"],t.prototype.compileToFragments=function(e){return new o(new z(new x(bt("extend",e))),[this.child,this.parent]).compileToFragments(e)},t}(r),e.Access=t=function(e){function t(e,t){this.name=e,this.name.asKey=!0,this.soak="soak"===t}return kt(t,e),t.prototype.children=["name"],t.prototype.compileToFragments=function(e){var t;return t=this.name.compileToFragments(e),g.test(st(t))?t.unshift(this.makeCode(".")):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.isComplex=D,t}(r),e.Index=w=function(e){function t(e){this.index=e}return kt(t,e),t.prototype.children=["index"],t.prototype.compileToFragments=function(e){return[].concat(this.makeCode("["),this.index.compileToFragments(e,N),this.makeCode("]"))},t.prototype.isComplex=function(){return this.index.isComplex()},t}(r),e.Range=j=function(e){function t(e,t,n){this.from=e,this.to=t,this.exclusive="exclusive"===n,this.equals=this.exclusive?"":"="}return kt(t,e),t.prototype.children=["from","to"],t.prototype.compileVariables=function(e){var t,n,i,r,s,o;return e=lt(e,{top:!0}),t=tt(e,"isComplex"),n=this.cacheToCodeFragments(this.from.cache(e,E,t)),this.fromC=n[0],this.fromVar=n[1],i=this.cacheToCodeFragments(this.to.cache(e,E,t)),this.toC=i[0],this.toVar=i[1],(o=tt(e,"step"))&&(r=this.cacheToCodeFragments(o.cache(e,E,t)),this.step=r[0],this.stepVar=r[1]),s=[this.fromVar.match(R),this.toVar.match(R)],this.fromNum=s[0],this.toNum=s[1],this.stepVar?this.stepNum=this.stepVar.match(R):void 0},t.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,h,l,u,p,d,f;return this.fromVar||this.compileVariables(e),e.index?(a=this.fromNum&&this.toNum,s=tt(e,"index"),o=tt(e,"name"),h=o&&o!==s,f=s+" = "+this.fromC,this.toC!==this.toVar&&(f+=", "+this.toC),this.step!==this.stepVar&&(f+=", "+this.step),l=[s+" <"+this.equals,s+" >"+this.equals],c=l[0],r=l[1],n=this.stepNum?pt(this.stepNum[0])>0?c+" "+this.toVar:r+" "+this.toVar:a?(u=[pt(this.fromNum[0]),pt(this.toNum[0])],i=u[0],d=u[1],u,d>=i?c+" "+d:r+" "+d):(t=this.stepVar?this.stepVar+" > 0":this.fromVar+" <= "+this.toVar,t+" ? "+c+" "+this.toVar+" : "+r+" "+this.toVar),p=this.stepVar?s+" += "+this.stepVar:a?h?d>=i?"++"+s:"--"+s:d>=i?s+"++":s+"--":h?t+" ? ++"+s+" : --"+s:t+" ? "+s+"++ : "+s+"--",h&&(f=o+" = "+f),h&&(p=o+" = "+p),[this.makeCode(f+"; "+n+"; "+p)]):this.compileArray(e)},t.prototype.compileArray=function(e){var t,n,i,r,s,o,a,c,h,l,u,p,d;return this.fromNum&&this.toNum&&20>=Math.abs(this.fromNum-this.toNum)?(h=function(){p=[];for(var e=l=+this.fromNum,t=+this.toNum;t>=l?t>=e:e>=t;t>=l?e++:e--)p.push(e);return p}.apply(this),this.exclusive&&h.pop(),[this.makeCode("["+h.join(", ")+"]")]):(o=this.tab+q,s=e.scope.freeVariable("i",{single:!0}),u=e.scope.freeVariable("results"),c="\n"+o+u+" = [];",this.fromNum&&this.toNum?(e.index=s,n=st(this.compileNode(e))):(d=s+" = "+this.fromC+(this.toC!==this.toVar?", "+this.toC:""),i=this.fromVar+" <= "+this.toVar,n="var "+d+"; "+i+" ? "+s+" <"+this.equals+" "+this.toVar+" : "+s+" >"+this.equals+" "+this.toVar+"; "+i+" ? "+s+"++ : "+s+"--"),a="{ "+u+".push("+s+"); }\n"+o+"return "+u+";\n"+e.indent,r=function(e){return null!=e?e.contains(at):void 0},(r(this.from)||r(this.to))&&(t=", arguments"),[this.makeCode("(function() {"+c+"\n"+o+"for ("+n+")"+a+"}).apply(this"+(null!=t?t:"")+")")])},t}(r),e.Slice=U=function(e){function t(e){this.range=e,t.__super__.constructor.call(this)}return kt(t,e),t.prototype.children=["range"],t.prototype.compileNode=function(e){var t,n,i,r,s,o,a;return s=this.range,o=s.to,i=s.from,r=i&&i.compileToFragments(e,N)||[this.makeCode("0")],o&&(t=o.compileToFragments(e,N),n=st(t),(this.range.exclusive||-1!==+n)&&(a=", "+(this.range.exclusive?n:B.test(n)?""+(+n+1):(t=o.compileToFragments(e,T),"+"+st(t)+" + 1 || 9e9")))),[this.makeCode(".slice("+st(r)+(a||"")+")")]},t}(r),e.Obj=A=function(e){function n(e,t){this.generated=null!=t?t:!1,this.objects=this.properties=e||[]}return kt(n,e),n.prototype.children=["properties"],n.prototype.compileNode=function(e){var n,r,s,o,a,c,h,u,p,d,f,m,g,v,y,b,k,w,T,C,E;if(T=this.properties,this.generated)for(h=0,g=T.length;g>h;h++)b=T[h],b instanceof z&&b.error("cannot have an implicit value in an implicit object");for(r=p=0,v=T.length;v>p&&(w=T[r],!((w.variable||w).base instanceof O));r=++p);for(s=T.length>r,a=e.indent+=q,m=this.lastNonComment(this.properties),n=[],s&&(k=e.scope.freeVariable("obj"),n.push(this.makeCode("(\n"+a+k+" = "))),n.push(this.makeCode("{"+(0===T.length||0===r?"}":"\n"))),o=f=0,y=T.length;y>f;o=++f)w=T[o],o===r&&(0!==o&&n.push(this.makeCode("\n"+a+"}")),n.push(this.makeCode(",\n"))),u=o===T.length-1||o===r-1?"":w===m||w instanceof l?"\n":",\n",c=w instanceof l?"":a,s&&r>o&&(c+=q),w instanceof i&&w.variable instanceof z&&w.variable.hasProperties()&&w.variable.error("Invalid object key"),w instanceof z&&w["this"]&&(w=new i(w.properties[0].name,w,"object")),w instanceof l||(r>o?(w instanceof i||(w=new i(w,w,"object")),(w.variable.base||w.variable).asKey=!0):(w instanceof i?(d=w.variable,E=w.value):(C=w.base.cache(e),d=C[0],E=C[1]),w=new i(new z(new x(k),[new t(d)]),E))),c&&n.push(this.makeCode(c)),n.push.apply(n,w.compileToFragments(e,L)),u&&n.push(this.makeCode(u));return s?n.push(this.makeCode(",\n"+a+k+"\n"+this.tab+")")):0!==T.length&&n.push(this.makeCode("\n"+this.tab+"}")),this.front&&!s?this.wrapInBraces(n):n},n.prototype.assigns=function(e){var t,n,i,r;for(r=this.properties,t=0,n=r.length;n>t;t++)if(i=r[t],i.assigns(e))return!0;return!1},n}(r),e.Arr=n=function(e){function t(e){this.objects=e||[]}return kt(t,e),t.prototype.children=["objects"],t.prototype.compileNode=function(e){var t,n,i,r,s,o,a;if(!this.objects.length)return[this.makeCode("[]")];if(e.indent+=q,t=G.compileSplattedArray(e,this.objects),t.length)return t;for(t=[],n=function(){var t,n,i,r;for(i=this.objects,r=[],t=0,n=i.length;n>t;t++)a=i[t],r.push(a.compileToFragments(e,E));return r}.call(this),r=s=0,o=n.length;o>s;r=++s)i=n[r],r&&t.push(this.makeCode(", ")),t.push.apply(t,i);return st(t).indexOf("\n")>=0?(t.unshift(this.makeCode("[\n"+e.indent)),t.push(this.makeCode("\n"+this.tab+"]"))):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.objects,t=0,n=r.length;n>t;t++)if(i=r[t],i.assigns(e))return!0;return!1},t}(r),e.Class=a=function(e){function n(e,t,n){this.variable=e,this.parent=t,this.body=null!=n?n:new s,this.boundFuncs=[],this.body.classBody=!0}return kt(n,e),n.prototype.children=["variable","parent","body"],n.prototype.determineName=function(){var e,n,i;return this.variable?(n=this.variable.properties,i=n[n.length-1],e=i?i instanceof t&&i.name.value:this.variable.base.value,Tt.call(V,e)>=0&&this.variable.error("class variable name may not be "+e),e&&(e=g.test(e)&&e)):null},n.prototype.setContext=function(e){return this.body.traverseChildren(!1,function(t){return t.classBody?!1:t instanceof x&&"this"===t.value?t.value=e:t instanceof c&&t.bound?t.context=e:void 0})},n.prototype.addBoundFunctions=function(e){var n,i,r,s,o;for(o=this.boundFuncs,i=0,r=o.length;r>i;i++)n=o[i],s=new z(new x("this"),[new t(n)]).compile(e),this.ctor.body.unshift(new x(s+" = "+bt("bind",e)+"("+s+", this)"))},n.prototype.addProperties=function(e,n,r){var s,o,a,h,l,u;return u=e.base.properties.slice(0),h=function(){var e;for(e=[];o=u.shift();)o instanceof i&&(a=o.variable.base,delete o.context,l=o.value,"constructor"===a.value?(this.ctor&&o.error("cannot define more than one constructor in a class"),l.bound&&o.error("cannot define a constructor as a bound function"),l instanceof c?o=this.ctor=l:(this.externalCtor=r.classScope.freeVariable("class"),o=new i(new x(this.externalCtor),l))):o.variable["this"]?l["static"]=!0:(s=a.isComplex()?new w(a):new t(a),o.variable=new z(new x(n),[new t(new x("prototype")),s]),l instanceof c&&l.bound&&(this.boundFuncs.push(a),l.bound=!1))),e.push(o);return e}.call(this),et(h)},n.prototype.walkBody=function(e,t){return this.traverseChildren(!1,function(r){return function(o){var a,c,h,l,u,p,d;if(a=!0,o instanceof n)return!1;if(o instanceof s){for(d=c=o.expressions,h=l=0,u=d.length;u>l;h=++l)p=d[h],p instanceof i&&p.variable.looksStatic(e)?p.value["static"]=!0:p instanceof z&&p.isObject(!0)&&(a=!1,c[h]=r.addProperties(p,e,t));o.expressions=c=rt(c)}return a&&!(o instanceof n)}}(this))},n.prototype.hoistDirectivePrologue=function(){var e,t,n;for(t=0,e=this.body.expressions;(n=e[t])&&n instanceof l||n instanceof z&&n.isString();)++t;return this.directives=e.splice(0,t)},n.prototype.ensureConstructor=function(e){return this.ctor||(this.ctor=new c,this.externalCtor?this.ctor.body.push(new x(this.externalCtor+".apply(this, arguments)")):this.parent&&this.ctor.body.push(new x(e+".__super__.constructor.apply(this, arguments)")),this.ctor.body.makeReturn(),this.body.expressions.unshift(this.ctor)),this.ctor.ctor=this.ctor.name=e,this.ctor.klass=null,this.ctor.noReturn=!0},n.prototype.compileNode=function(e){var t,n,r,a,h,l,u,p,f;return(a=this.body.jumps())&&a.error("Class bodies cannot contain pure statements"),(n=this.body.contains(at))&&n.error("Class bodies shouldn't reference arguments"),u=this.determineName()||"_Class",u.reserved&&(u="_"+u),l=new x(u),r=new c([],s.wrap([this.body])),t=[],e.classScope=r.makeScope(e.scope),this.hoistDirectivePrologue(),this.setContext(u),this.walkBody(u,e),this.ensureConstructor(u),this.addBoundFunctions(e),this.body.spaced=!0,this.body.expressions.push(l),this.parent&&(f=new x(e.classScope.freeVariable("superClass",{reserve:!1})),this.body.expressions.unshift(new d(l,f)),r.params.push(new _(f)),t.push(this.parent)),(p=this.body.expressions).unshift.apply(p,this.directives),h=new O(new o(r,t)),this.variable&&(h=new i(this.variable,h)),h.compileToFragments(e)},n}(r),e.Assign=i=function(e){function n(e,t,n,i){var r,s,o;this.variable=e,this.value=t,this.context=n,this.param=i&&i.param,this.subpattern=i&&i.subpattern,o=s=this.variable.unwrapAll().value,r=Tt.call(V,o)>=0,r&&"object"!==this.context&&this.variable.error('variable name may not be "'+s+'"')}return kt(n,e),n.prototype.children=["variable","value"],n.prototype.isStatement=function(e){return(null!=e?e.level:void 0)===L&&null!=this.context&&Tt.call(this.context,"?")>=0
},n.prototype.assigns=function(e){return this["object"===this.context?"value":"variable"].assigns(e)},n.prototype.unfoldSoak=function(e){return yt(e,this,"variable")},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a,h,l,u,p,d,f,m;if(i=this.variable instanceof z){if(this.variable.isArray()||this.variable.isObject())return this.compilePatternMatch(e);if(this.variable.isSplice())return this.compileSplice(e);if("||="===(h=this.context)||"&&="===h||"?="===h)return this.compileConditional(e);if("**="===(l=this.context)||"//="===l||"%%="===l)return this.compileSpecialMath(e)}return this.value instanceof c&&(this.value["static"]?(this.value.klass=this.variable.base,this.value.name=this.variable.properties[0],this.value.variable=this.variable):(null!=(u=this.variable.properties)?u.length:void 0)>=2&&(p=this.variable.properties,o=p.length>=3?Ct.call(p,0,r=p.length-2):(r=0,[]),a=p[r++],s=p[r++],"prototype"===(null!=(d=a.name)?d.value:void 0)&&(this.value.klass=new z(this.variable.base,o),this.value.name=s,this.value.variable=this.variable))),this.context||(m=this.variable.unwrapAll(),m.isAssignable()||this.variable.error('"'+this.variable.compile(e)+'" cannot be assigned'),("function"==typeof m.hasProperties?m.hasProperties():void 0)||(this.param?e.scope.add(m.value,"var"):e.scope.find(m.value))),f=this.value.compileToFragments(e,E),n=this.variable.compileToFragments(e,E),"object"===this.context?n.concat(this.makeCode(": "),f):(t=n.concat(this.makeCode(" "+(this.context||"=")+" "),f),E>=e.level?t:this.wrapInBraces(t))},n.prototype.compilePatternMatch=function(e){var i,r,s,o,a,c,h,l,u,d,f,m,v,y,b,k,T,C,N,S,D,R,A,I,_,j,M,B;if(I=e.level===L,j=this.value,y=this.variable.base.objects,!(b=y.length))return s=j.compileToFragments(e),e.level>=F?this.wrapInBraces(s):s;if(l=this.variable.isObject(),I&&1===b&&!((v=y[0])instanceof G))return v instanceof n?(T=v,C=T.variable,h=C.base,v=T.value):h=l?v["this"]?v.properties[0].name:v:new x(0),i=g.test(h.unwrap().value||0),j=new z(j),j.properties.push(new(i?t:w)(h)),N=v.unwrap().value,Tt.call($,N)>=0&&v.error("assignment to a reserved word: "+v.compile(e)),new n(v,j,null,{param:this.param}).compileToFragments(e,L);for(M=j.compileToFragments(e,E),B=st(M),r=[],o=!1,(!g.test(B)||this.variable.assigns(B))&&(r.push([this.makeCode((k=e.scope.freeVariable("ref"))+" = ")].concat(Ct.call(M))),M=[this.makeCode(k)],B=k),c=d=0,f=y.length;f>d;c=++d){if(v=y[c],h=c,l&&(v instanceof n?(S=v,D=S.variable,h=D.base,v=S.value):v.base instanceof O?(R=new z(v.unwrapAll()).cacheReference(e),v=R[0],h=R[1]):h=v["this"]?v.properties[0].name:v),!o&&v instanceof G)m=v.name.unwrap().value,v=v.unwrap(),_=b+" <= "+B+".length ? "+bt("slice",e)+".call("+B+", "+c,(A=b-c-1)?(u=e.scope.freeVariable("i",{single:!0}),_+=", "+u+" = "+B+".length - "+A+") : ("+u+" = "+c+", [])"):_+=") : []",_=new x(_),o=u+"++";else{if(!o&&v instanceof p){(A=b-c-1)&&(1===A?o=B+".length - 1":(u=e.scope.freeVariable("i",{single:!0}),_=new x(u+" = "+B+".length - "+A),o=u+"++",r.push(_.compileToFragments(e,E))));continue}m=v.unwrap().value,(v instanceof G||v instanceof p)&&v.error("multiple splats/expansions are disallowed in an assignment"),"number"==typeof h?(h=new x(o||h),i=!1):i=l&&g.test(h.unwrap().value||0),_=new z(new x(B),[new(i?t:w)(h)])}null!=m&&Tt.call($,m)>=0&&v.error("assignment to a reserved word: "+v.compile(e)),r.push(new n(v,_,null,{param:this.param,subpattern:!0}).compileToFragments(e,E))}return I||this.subpattern||r.push(M),a=this.joinFragmentArrays(r,", "),E>e.level?a:this.wrapInBraces(a)},n.prototype.compileConditional=function(e){var t,i,r,s;return r=this.variable.cacheReference(e),i=r[0],s=r[1],!i.properties.length&&i.base instanceof x&&"this"!==i.base.value&&!e.scope.check(i.base.value)&&this.variable.error('the variable "'+i.base.value+"\" can't be assigned with "+this.context+" because it has not been declared before"),Tt.call(this.context,"?")>=0?(e.isExistentialEquals=!0,new b(new u(i),s,{type:"if"}).addElse(new n(s,this.value,"=")).compileToFragments(e)):(t=new I(this.context.slice(0,-1),i,new n(s,this.value,"=")).compileToFragments(e),E>=e.level?t:this.wrapInBraces(t))},n.prototype.compileSpecialMath=function(e){var t,i,r;return i=this.variable.cacheReference(e),t=i[0],r=i[1],new n(t,new I(this.context.slice(0,-1),r,this.value)).compileToFragments(e)},n.prototype.compileSplice=function(e){var t,n,i,r,s,o,a,c,h,l,u,p;return a=this.variable.properties.pop().range,i=a.from,l=a.to,n=a.exclusive,o=this.variable.compile(e),i?(c=this.cacheToCodeFragments(i.cache(e,F)),r=c[0],s=c[1]):r=s="0",l?i instanceof z&&i.isSimpleNumber()&&l instanceof z&&l.isSimpleNumber()?(l=l.compile(e)-s,n||(l+=1)):(l=l.compile(e,T)+" - "+s,n||(l+=" + 1")):l="9e9",h=this.value.cache(e,E),u=h[0],p=h[1],t=[].concat(this.makeCode("[].splice.apply("+o+", ["+r+", "+l+"].concat("),u,this.makeCode(")), "),p),e.level>L?this.wrapInBraces(t):t},n}(r),e.Code=c=function(e){function t(e,t,n){this.params=e||[],this.body=t||new s,this.bound="boundfunc"===n,this.isGenerator=!!this.body.contains(function(e){var t;return e instanceof I&&("yield"===(t=e.operator)||"yield*"===t)})}return kt(t,e),t.prototype.children=["params","body"],t.prototype.isStatement=function(){return!!this.ctor},t.prototype.jumps=D,t.prototype.makeScope=function(e){return new P(e,this.body,this)},t.prototype.compileNode=function(e){var r,a,c,h,l,u,d,f,m,g,v,y,k,w,C,E,F,N,L,S,D,R,A,O,$,j,M,B,V,P,U,G,H;if(this.bound&&(null!=(A=e.scope.method)?A.bound:void 0)&&(this.context=e.scope.method.context),this.bound&&!this.context)return this.context="_this",H=new t([new _(new x(this.context))],new s([this])),a=new o(H,[new x("this")]),a.updateLocationDataIfMissing(this.locationData),a.compileNode(e);for(e.scope=tt(e,"classScope")||this.makeScope(e.scope),e.scope.shared=tt(e,"sharedScope"),e.indent+=q,delete e.bare,delete e.isExistentialEquals,L=[],h=[],O=this.params,u=0,m=O.length;m>u;u++)N=O[u],N instanceof p||e.scope.parameter(N.asReference(e));for($=this.params,d=0,g=$.length;g>d;d++)if(N=$[d],N.splat||N instanceof p){for(j=this.params,f=0,v=j.length;v>f;f++)F=j[f],F instanceof p||!F.name.value||e.scope.add(F.name.value,"var",!0);V=new i(new z(new n(function(){var t,n,i,r;for(i=this.params,r=[],n=0,t=i.length;t>n;n++)F=i[n],r.push(F.asReference(e));return r}.call(this))),new z(new x("arguments")));break}for(M=this.params,E=0,y=M.length;y>E;E++)N=M[E],N.isComplex()?(U=R=N.asReference(e),N.value&&(U=new I("?",R,N.value)),h.push(new i(new z(N.name),U,"=",{param:!0}))):(R=N,N.value&&(C=new x(R.name.value+" == null"),U=new i(new z(N.name),N.value,"="),h.push(new b(C,U)))),V||L.push(R);for(G=this.body.isEmpty(),V&&h.unshift(V),h.length&&(B=this.body.expressions).unshift.apply(B,h),l=S=0,k=L.length;k>S;l=++S)F=L[l],L[l]=F.compileToFragments(e),e.scope.parameter(st(L[l]));for(P=[],this.eachParamName(function(e,t){return Tt.call(P,e)>=0&&t.error("multiple parameters named "+e),P.push(e)}),G||this.noReturn||this.body.makeReturn(),c="function",this.isGenerator&&(c+="*"),this.ctor&&(c+=" "+this.name),c+="(",r=[this.makeCode(c)],l=D=0,w=L.length;w>D;l=++D)F=L[l],l&&r.push(this.makeCode(", ")),r.push.apply(r,F);return r.push(this.makeCode(") {")),this.body.isEmpty()||(r=r.concat(this.makeCode("\n"),this.body.compileWithDeclarations(e),this.makeCode("\n"+this.tab))),r.push(this.makeCode("}")),this.ctor?[this.makeCode(this.tab)].concat(Ct.call(r)):this.front||e.level>=T?this.wrapInBraces(r):r},t.prototype.eachParamName=function(e){var t,n,i,r,s;for(r=this.params,s=[],t=0,n=r.length;n>t;t++)i=r[t],s.push(i.eachName(e));return s},t.prototype.traverseChildren=function(e,n){return e?t.__super__.traverseChildren.call(this,e,n):void 0},t}(r),e.Param=_=function(e){function t(e,t,n){var i,r;this.name=e,this.value=t,this.splat=n,r=i=this.name.unwrapAll().value,Tt.call(V,r)>=0&&this.name.error('parameter name "'+i+'" is not allowed')}return kt(t,e),t.prototype.children=["name","value"],t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e,E)},t.prototype.asReference=function(e){var t,n;return this.reference?this.reference:(n=this.name,n["this"]?(t=n.properties[0].name.value,t.reserved&&(t="_"+t),n=new x(e.scope.freeVariable(t))):n.isComplex()&&(n=new x(e.scope.freeVariable("arg"))),n=new z(n),this.splat&&(n=new G(n)),n.updateLocationDataIfMissing(this.locationData),this.reference=n)},t.prototype.isComplex=function(){return this.name.isComplex()},t.prototype.eachName=function(e,t){var n,r,s,o,a,c;if(null==t&&(t=this.name),n=function(t){return e("@"+t.properties[0].name.value,t)},t instanceof x)return e(t.value,t);if(t instanceof z)return n(t);for(c=t.objects,r=0,s=c.length;s>r;r++)a=c[r],a instanceof i?this.eachName(e,a.value.unwrap()):a instanceof G?(o=a.name.unwrap(),e(o.value,o)):a instanceof z?a.isArray()||a.isObject()?this.eachName(e,a.base):a["this"]?n(a):e(a.base.value,a.base):a instanceof p||a.error("illegal parameter "+a.compile())},t}(r),e.Splat=G=function(e){function t(e){this.name=e.compile?e:new x(e)}return kt(t,e),t.prototype.children=["name"],t.prototype.isAssignable=Q,t.prototype.assigns=function(e){return this.name.assigns(e)},t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e)},t.prototype.unwrap=function(){return this.name},t.compileSplattedArray=function(e,n,i){var r,s,o,a,c,h,l,u,p,d,f;for(l=-1;(f=n[++l])&&!(f instanceof t););if(l>=n.length)return[];if(1===n.length)return f=n[0],c=f.compileToFragments(e,E),i?c:[].concat(f.makeCode(bt("slice",e)+".call("),c,f.makeCode(")"));for(r=n.slice(l),h=u=0,d=r.length;d>u;h=++u)f=r[h],o=f.compileToFragments(e,E),r[h]=f instanceof t?[].concat(f.makeCode(bt("slice",e)+".call("),o,f.makeCode(")")):[].concat(f.makeCode("["),o,f.makeCode("]"));return 0===l?(f=n[0],a=f.joinFragmentArrays(r.slice(1),", "),r[0].concat(f.makeCode(".concat("),a,f.makeCode(")"))):(s=function(){var t,i,r,s;for(r=n.slice(0,l),s=[],t=0,i=r.length;i>t;t++)f=r[t],s.push(f.compileToFragments(e,E));return s}(),s=n[0].joinFragmentArrays(s,", "),a=n[l].joinFragmentArrays(r,", "),p=n[n.length-1],[].concat(n[0].makeCode("["),s,n[l].makeCode("].concat("),a,p.makeCode(")")))},t}(r),e.Expansion=p=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return kt(t,e),t.prototype.isComplex=D,t.prototype.compileNode=function(){return this.error("Expansion must be used inside a destructuring assignment or parameter list")},t.prototype.asReference=function(){return this},t.prototype.eachName=function(){},t}(r),e.While=J=function(e){function t(e,t){this.condition=(null!=t?t.invert:void 0)?e.invert():e,this.guard=null!=t?t.guard:void 0}return kt(t,e),t.prototype.children=["condition","guard","body"],t.prototype.isStatement=Q,t.prototype.makeReturn=function(e){return e?t.__super__.makeReturn.apply(this,arguments):(this.returns=!this.jumps({loop:!0}),this)},t.prototype.addBody=function(e){return this.body=e,this},t.prototype.jumps=function(){var e,t,n,i,r;if(e=this.body.expressions,!e.length)return!1;for(t=0,i=e.length;i>t;t++)if(r=e[t],n=r.jumps({loop:!0}))return n;return!1},t.prototype.compileNode=function(e){var t,n,i,r;return e.indent+=q,r="",n=this.body,n.isEmpty()?n=this.makeCode(""):(this.returns&&(n.makeReturn(i=e.scope.freeVariable("results")),r=""+this.tab+i+" = [];\n"),this.guard&&(n.expressions.length>1?n.expressions.unshift(new b(new O(this.guard).invert(),new x("continue"))):this.guard&&(n=s.wrap([new b(this.guard,n)]))),n=[].concat(this.makeCode("\n"),n.compileToFragments(e,L),this.makeCode("\n"+this.tab))),t=[].concat(this.makeCode(r+this.tab+"while ("),this.condition.compileToFragments(e,N),this.makeCode(") {"),n,this.makeCode("}")),this.returns&&t.push(this.makeCode("\n"+this.tab+"return "+i+";")),t},t}(r),e.Op=I=function(e){function n(e,t,n,i){if("in"===e)return new k(t,n);if("do"===e)return this.generateDo(t);if("new"===e){if(t instanceof o&&!t["do"]&&!t.isNew)return t.newInstance();(t instanceof c&&t.bound||t["do"])&&(t=new O(t))}return this.operator=r[e]||e,this.first=t,this.second=n,this.flip=!!i,this}var r,s;return kt(n,e),r={"==":"===","!=":"!==",of:"in",yieldfrom:"yield*"},s={"!==":"===","===":"!=="},n.prototype.children=["first","second"],n.prototype.isSimpleNumber=D,n.prototype.isYield=function(){var e;return"yield"===(e=this.operator)||"yield*"===e},n.prototype.isYieldReturn=function(){return this.isYield()&&this.first instanceof M},n.prototype.isUnary=function(){return!this.second},n.prototype.isComplex=function(){var e;return!(this.isUnary()&&("+"===(e=this.operator)||"-"===e)&&this.first instanceof z&&this.first.isSimpleNumber())},n.prototype.isChainable=function(){var e;return"<"===(e=this.operator)||">"===e||">="===e||"<="===e||"==="===e||"!=="===e},n.prototype.invert=function(){var e,t,i,r,o;if(this.isChainable()&&this.first.isChainable()){for(e=!0,t=this;t&&t.operator;)e&&(e=t.operator in s),t=t.first;if(!e)return new O(this).invert();for(t=this;t&&t.operator;)t.invert=!t.invert,t.operator=s[t.operator],t=t.first;return this}return(r=s[this.operator])?(this.operator=r,this.first.unwrap()instanceof n&&this.first.invert(),this):this.second?new O(this).invert():"!"===this.operator&&(i=this.first.unwrap())instanceof n&&("!"===(o=i.operator)||"in"===o||"instanceof"===o)?i:new n("!",this)},n.prototype.unfoldSoak=function(e){var t;return("++"===(t=this.operator)||"--"===t||"delete"===t)&&yt(e,this,"first")},n.prototype.generateDo=function(e){var t,n,r,s,a,h,l,u;for(h=[],n=e instanceof i&&(l=e.value.unwrap())instanceof c?l:e,u=n.params||[],r=0,s=u.length;s>r;r++)a=u[r],a.value?(h.push(a.value),delete a.value):h.push(a);return t=new o(e,h),t["do"]=!0,t},n.prototype.compileNode=function(e){var t,n,i,r,s,o;if(n=this.isChainable()&&this.first.isChainable(),n||(this.first.front=this.front),"delete"===this.operator&&e.scope.check(this.first.unwrapAll().value)&&this.error("delete operand may not be argument or var"),("--"===(r=this.operator)||"++"===r)&&(s=this.first.unwrapAll().value,Tt.call(V,s)>=0)&&this.error('cannot increment/decrement "'+this.first.unwrapAll().value+'"'),this.isYield())return this.compileYield(e);if(this.isUnary())return this.compileUnary(e);if(n)return this.compileChain(e);switch(this.operator){case"?":return this.compileExistence(e);case"**":return this.compilePower(e);case"//":return this.compileFloorDivision(e);case"%%":return this.compileModulo(e);default:return i=this.first.compileToFragments(e,F),o=this.second.compileToFragments(e,F),t=[].concat(i,this.makeCode(" "+this.operator+" "),o),F>=e.level?t:this.wrapInBraces(t)}},n.prototype.compileChain=function(e){var t,n,i,r;return i=this.first.second.cache(e),this.first.second=i[0],r=i[1],n=this.first.compileToFragments(e,F),t=n.concat(this.makeCode(" "+(this.invert?"&&":"||")+" "),r.compileToFragments(e),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,F)),this.wrapInBraces(t)},n.prototype.compileExistence=function(e){var t,n;return this.first.isComplex()?(n=new x(e.scope.freeVariable("ref")),t=new O(new i(n,this.first))):(t=this.first,n=t),new b(new u(t),n,{type:"if"}).addElse(this.second).compileToFragments(e)},n.prototype.compileUnary=function(e){var t,i,r;return i=[],t=this.operator,i.push([this.makeCode(t)]),"!"===t&&this.first instanceof u?(this.first.negated=!this.first.negated,this.first.compileToFragments(e)):e.level>=T?new O(this).compileToFragments(e):(r="+"===t||"-"===t,("new"===t||"typeof"===t||"delete"===t||r&&this.first instanceof n&&this.first.operator===t)&&i.push([this.makeCode(" ")]),(r&&this.first instanceof n||"new"===t&&this.first.isStatement(e))&&(this.first=new O(this.first)),i.push(this.first.compileToFragments(e,F)),this.flip&&i.reverse(),this.joinFragmentArrays(i,""))},n.prototype.compileYield=function(e){var t,n;return n=[],t=this.operator,null==e.scope.parent&&this.error("yield statements must occur within a function generator."),Tt.call(Object.keys(this.first),"expression")>=0&&!(this.first instanceof W)?this.isYieldReturn()?n.push(this.first.compileToFragments(e,L)):null!=this.first.expression&&n.push(this.first.expression.compileToFragments(e,F)):(n.push([this.makeCode("("+t+" ")]),n.push(this.first.compileToFragments(e,F)),n.push([this.makeCode(")")])),this.joinFragmentArrays(n,"")},n.prototype.compilePower=function(e){var n;return n=new z(new x("Math"),[new t(new x("pow"))]),new o(n,[this.first,this.second]).compileToFragments(e)},n.prototype.compileFloorDivision=function(e){var i,r;return r=new z(new x("Math"),[new t(new x("floor"))]),i=new n("/",this.first,this.second),new o(r,[i]).compileToFragments(e)},n.prototype.compileModulo=function(e){var t;return t=new z(new x(bt("modulo",e))),new o(t,[this.first,this.second]).compileToFragments(e)},n.prototype.toString=function(e){return n.__super__.toString.call(this,e,this.constructor.name+" "+this.operator)},n}(r),e.In=k=function(e){function t(e,t){this.object=e,this.array=t}return kt(t,e),t.prototype.children=["object","array"],t.prototype.invert=S,t.prototype.compileNode=function(e){var t,n,i,r,s;if(this.array instanceof z&&this.array.isArray()&&this.array.base.objects.length){for(s=this.array.base.objects,n=0,i=s.length;i>n;n++)if(r=s[n],r instanceof G){t=!0;break}if(!t)return this.compileOrTest(e)}return this.compileLoopTest(e)},t.prototype.compileOrTest=function(e){var t,n,i,r,s,o,a,c,h,l,u,p;for(c=this.object.cache(e,F),u=c[0],a=c[1],h=this.negated?[" !== "," && "]:[" === "," || "],t=h[0],n=h[1],p=[],l=this.array.base.objects,i=s=0,o=l.length;o>s;i=++s)r=l[i],i&&p.push(this.makeCode(n)),p=p.concat(i?a:u,this.makeCode(t),r.compileToFragments(e,T));return F>e.level?p:this.wrapInBraces(p)},t.prototype.compileLoopTest=function(e){var t,n,i,r;return i=this.object.cache(e,E),r=i[0],n=i[1],t=[].concat(this.makeCode(bt("indexOf",e)+".call("),this.array.compileToFragments(e,E),this.makeCode(", "),n,this.makeCode(") "+(this.negated?"< 0":">= 0"))),st(r)===st(n)?t:(t=r.concat(this.makeCode(", "),t),E>e.level?t:this.wrapInBraces(t))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+(this.negated?"!":""))},t}(r),e.Try=Y=function(e){function t(e,t,n,i){this.attempt=e,this.errorVariable=t,this.recovery=n,this.ensure=i}return kt(t,e),t.prototype.children=["attempt","recovery","ensure"],t.prototype.isStatement=Q,t.prototype.jumps=function(e){var t;return this.attempt.jumps(e)||(null!=(t=this.recovery)?t.jumps(e):void 0)},t.prototype.makeReturn=function(e){return this.attempt&&(this.attempt=this.attempt.makeReturn(e)),this.recovery&&(this.recovery=this.recovery.makeReturn(e)),this},t.prototype.compileNode=function(e){var t,n,r,s;return e.indent+=q,s=this.attempt.compileToFragments(e,L),t=this.recovery?(r=new x("_error"),this.errorVariable?this.recovery.unshift(new i(this.errorVariable,r)):void 0,[].concat(this.makeCode(" catch ("),r.compileToFragments(e),this.makeCode(") {\n"),this.recovery.compileToFragments(e,L),this.makeCode("\n"+this.tab+"}"))):this.ensure||this.recovery?[]:[this.makeCode(" catch (_error) {}")],n=this.ensure?[].concat(this.makeCode(" finally {\n"),this.ensure.compileToFragments(e,L),this.makeCode("\n"+this.tab+"}")):[],[].concat(this.makeCode(this.tab+"try {\n"),s,this.makeCode("\n"+this.tab+"}"),t,n)},t}(r),e.Throw=W=function(e){function t(e){this.expression=e}return kt(t,e),t.prototype.children=["expression"],t.prototype.isStatement=Q,t.prototype.jumps=D,t.prototype.makeReturn=X,t.prototype.compileNode=function(e){return[].concat(this.makeCode(this.tab+"throw "),this.expression.compileToFragments(e),this.makeCode(";"))},t}(r),e.Existence=u=function(e){function t(e){this.expression=e}return kt(t,e),t.prototype.children=["expression"],t.prototype.invert=S,t.prototype.compileNode=function(e){var t,n,i,r;return this.expression.front=this.front,i=this.expression.compile(e,F),g.test(i)&&!e.scope.check(i)?(r=this.negated?["===","||"]:["!==","&&"],t=r[0],n=r[1],i="typeof "+i+" "+t+' "undefined" '+n+" "+i+" "+t+" null"):i=i+" "+(this.negated?"==":"!=")+" null",[this.makeCode(C>=e.level?i:"("+i+")")]},t}(r),e.Parens=O=function(e){function t(e){this.body=e}return kt(t,e),t.prototype.children=["body"],t.prototype.unwrap=function(){return this.body},t.prototype.isComplex=function(){return this.body.isComplex()},t.prototype.compileNode=function(e){var t,n,i;return n=this.body.unwrap(),n instanceof z&&n.isAtomic()?(n.front=this.front,n.compileToFragments(e)):(i=n.compileToFragments(e,N),t=F>e.level&&(n instanceof I||n instanceof o||n instanceof f&&n.returns),t?i:this.wrapInBraces(i))},t}(r),e.For=f=function(e){function t(e,t){var n;this.source=t.source,this.guard=t.guard,this.step=t.step,this.name=t.name,this.index=t.index,this.body=s.wrap([e]),this.own=!!t.own,this.object=!!t.object,this.object&&(n=[this.index,this.name],this.name=n[0],this.index=n[1]),this.index instanceof z&&this.index.error("index cannot be a pattern matching expression"),this.range=this.source instanceof z&&this.source.base instanceof j&&!this.source.properties.length,this.pattern=this.name instanceof z,this.range&&this.index&&this.index.error("indexes do not apply to range loops"),this.range&&this.pattern&&this.name.error("cannot pattern match over range loops"),this.own&&!this.object&&this.name.error("cannot use own with for-in"),this.returns=!1}return kt(t,e),t.prototype.children=["body","source","guard","step"],t.prototype.compileNode=function(e){var t,n,r,o,a,c,h,l,u,p,d,f,m,v,y,k,w,T,C,F,N,S,D,A,I,_,$,j,B,V,P,U,G,H;return t=s.wrap([this.body]),D=t.expressions,T=D[D.length-1],(null!=T?T.jumps():void 0)instanceof M&&(this.returns=!1),B=this.range?this.source.base:this.source,j=e.scope,this.pattern||(F=this.name&&this.name.compile(e,E)),v=this.index&&this.index.compile(e,E),F&&!this.pattern&&j.find(F),v&&j.find(v),this.returns&&($=j.freeVariable("results")),y=this.object&&v||j.freeVariable("i",{single:!0}),k=this.range&&F||v||y,w=k!==y?k+" = ":"",this.step&&!this.range&&(A=this.cacheToCodeFragments(this.step.cache(e,E,ot)),V=A[0],U=A[1],P=U.match(R)),this.pattern&&(F=y),H="",d="",h="",f=this.tab+q,this.range?p=B.compileToFragments(lt(e,{index:y,name:F,step:this.step,isComplex:ot})):(G=this.source.compile(e,E),!F&&!this.own||g.test(G)||(h+=""+this.tab+(S=j.freeVariable("ref"))+" = "+G+";\n",G=S),F&&!this.pattern&&(N=F+" = "+G+"["+k+"]"),this.object||(V!==U&&(h+=""+this.tab+V+";\n"),this.step&&P&&(u=0>pt(P[0]))||(C=j.freeVariable("len")),a=""+w+y+" = 0, "+C+" = "+G+".length",c=""+w+y+" = "+G+".length - 1",r=y+" < "+C,o=y+" >= 0",this.step?(P?u&&(r=o,a=c):(r=U+" > 0 ? "+r+" : "+o,a="("+U+" > 0 ? ("+a+") : "+c+")"),m=y+" += "+U):m=""+(k!==y?"++"+y:y+"++"),p=[this.makeCode(a+"; "+r+"; "+w+m)])),this.returns&&(I=""+this.tab+$+" = [];\n",_="\n"+this.tab+"return "+$+";",t.makeReturn($)),this.guard&&(t.expressions.length>1?t.expressions.unshift(new b(new O(this.guard).invert(),new x("continue"))):this.guard&&(t=s.wrap([new b(this.guard,t)]))),this.pattern&&t.expressions.unshift(new i(this.name,new x(G+"["+k+"]"))),l=[].concat(this.makeCode(h),this.pluckDirectCall(e,t)),N&&(H="\n"+f+N+";"),this.object&&(p=[this.makeCode(k+" in "+G)],this.own&&(d="\n"+f+"if (!"+bt("hasProp",e)+".call("+G+", "+k+")) continue;")),n=t.compileToFragments(lt(e,{indent:f}),L),n&&n.length>0&&(n=[].concat(this.makeCode("\n"),n,this.makeCode("\n"))),[].concat(l,this.makeCode(""+(I||"")+this.tab+"for ("),p,this.makeCode(") {"+d+H),n,this.makeCode(this.tab+"}"+(_||"")))},t.prototype.pluckDirectCall=function(e,t){var n,r,s,a,h,l,u,p,d,f,m,g,v,y,b,k;for(r=[],d=t.expressions,h=l=0,u=d.length;u>l;h=++l)s=d[h],s=s.unwrapAll(),s instanceof o&&(k=null!=(f=s.variable)?f.unwrapAll():void 0,(k instanceof c||k instanceof z&&(null!=(m=k.base)?m.unwrapAll():void 0)instanceof c&&1===k.properties.length&&("call"===(g=null!=(v=k.properties[0].name)?v.value:void 0)||"apply"===g))&&(a=(null!=(y=k.base)?y.unwrapAll():void 0)||k,p=new x(e.scope.freeVariable("fn")),n=new z(p),k.base&&(b=[n,k],k.base=b[0],n=b[1]),t.expressions[h]=new o(n,s.args),r=r.concat(this.makeCode(this.tab),new i(p,a).compileToFragments(e,L),this.makeCode(";\n"))));return r},t}(J),e.Switch=H=function(e){function t(e,t,n){this.subject=e,this.cases=t,this.otherwise=n}return kt(t,e),t.prototype.children=["subject","cases","otherwise"],t.prototype.isStatement=Q,t.prototype.jumps=function(e){var t,n,i,r,s,o,a,c;for(null==e&&(e={block:!0}),o=this.cases,i=0,s=o.length;s>i;i++)if(a=o[i],n=a[0],t=a[1],r=t.jumps(e))return r;return null!=(c=this.otherwise)?c.jumps(e):void 0},t.prototype.makeReturn=function(e){var t,n,i,r,o;for(r=this.cases,t=0,n=r.length;n>t;t++)i=r[t],i[1].makeReturn(e);return e&&(this.otherwise||(this.otherwise=new s([new x("void 0")]))),null!=(o=this.otherwise)&&o.makeReturn(e),this},t.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,g;for(c=e.indent+q,h=e.indent=c+q,o=[].concat(this.makeCode(this.tab+"switch ("),this.subject?this.subject.compileToFragments(e,N):this.makeCode("false"),this.makeCode(") {\n")),f=this.cases,a=l=0,p=f.length;p>l;a=++l){for(m=f[a],r=m[0],t=m[1],g=rt([r]),u=0,d=g.length;d>u;u++)i=g[u],this.subject||(i=i.invert()),o=o.concat(this.makeCode(c+"case "),i.compileToFragments(e,N),this.makeCode(":\n"));if((n=t.compileToFragments(e,L)).length>0&&(o=o.concat(n,this.makeCode("\n"))),a===this.cases.length-1&&!this.otherwise)break;s=this.lastNonComment(t.expressions),s instanceof M||s instanceof x&&s.jumps()&&"debugger"!==s.value||o.push(i.makeCode(h+"break;\n"))}return this.otherwise&&this.otherwise.expressions.length&&o.push.apply(o,[this.makeCode(c+"default:\n")].concat(Ct.call(this.otherwise.compileToFragments(e,L)),[this.makeCode("\n")])),o.push(this.makeCode(this.tab+"}")),o},t}(r),e.If=b=function(e){function t(e,t,n){this.body=t,null==n&&(n={}),this.condition="unless"===n.type?e.invert():e,this.elseBody=null,this.isChain=!1,this.soak=n.soak}return kt(t,e),t.prototype.children=["condition","body","elseBody"],t.prototype.bodyNode=function(){var e;return null!=(e=this.body)?e.unwrap():void 0},t.prototype.elseBodyNode=function(){var e;return null!=(e=this.elseBody)?e.unwrap():void 0},t.prototype.addElse=function(e){return this.isChain?this.elseBodyNode().addElse(e):(this.isChain=e instanceof t,this.elseBody=this.ensureBlock(e),this.elseBody.updateLocationDataIfMissing(e.locationData)),this},t.prototype.isStatement=function(e){var t;return(null!=e?e.level:void 0)===L||this.bodyNode().isStatement(e)||(null!=(t=this.elseBodyNode())?t.isStatement(e):void 0)},t.prototype.jumps=function(e){var t;return this.body.jumps(e)||(null!=(t=this.elseBody)?t.jumps(e):void 0)},t.prototype.compileNode=function(e){return this.isStatement(e)?this.compileStatement(e):this.compileExpression(e)},t.prototype.makeReturn=function(e){return e&&(this.elseBody||(this.elseBody=new s([new x("void 0")]))),this.body&&(this.body=new s([this.body.makeReturn(e)])),this.elseBody&&(this.elseBody=new s([this.elseBody.makeReturn(e)])),this},t.prototype.ensureBlock=function(e){return e instanceof s?e:new s([e])},t.prototype.compileStatement=function(e){var n,i,r,s,o,a,c;return r=tt(e,"chainChild"),(o=tt(e,"isExistentialEquals"))?new t(this.condition.invert(),this.elseBodyNode(),{type:"if"}).compileToFragments(e):(c=e.indent+q,s=this.condition.compileToFragments(e,N),i=this.ensureBlock(this.body).compileToFragments(lt(e,{indent:c})),a=[].concat(this.makeCode("if ("),s,this.makeCode(") {\n"),i,this.makeCode("\n"+this.tab+"}")),r||a.unshift(this.makeCode(this.tab)),this.elseBody?(n=a.concat(this.makeCode(" else ")),this.isChain?(e.chainChild=!0,n=n.concat(this.elseBody.unwrap().compileToFragments(e,L))):n=n.concat(this.makeCode("{\n"),this.elseBody.compileToFragments(lt(e,{indent:c}),L),this.makeCode("\n"+this.tab+"}")),n):a)},t.prototype.compileExpression=function(e){var t,n,i,r;return i=this.condition.compileToFragments(e,C),n=this.bodyNode().compileToFragments(e,E),t=this.elseBodyNode()?this.elseBodyNode().compileToFragments(e,E):[this.makeCode("void 0")],r=i.concat(this.makeCode(" ? "),n,this.makeCode(" : "),t),e.level>=C?this.wrapInBraces(r):r},t.prototype.unfoldSoak=function(){return this.soak&&this},t}(r),K={extend:function(e){return"function(child, parent) { for (var key in parent) { if ("+bt("hasProp",e)+".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},bind:function(){return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"},indexOf:function(){return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"},modulo:function(){return"function(a, b) { return (+a % (b = +b) + b) % b; }"},hasProp:function(){return"{}.hasOwnProperty"},slice:function(){return"[].slice"}},L=1,N=2,E=3,C=4,F=5,T=6,q="  ",g=/^(?!\d)[$\w\x7f-\uffff]+$/,B=/^[+-]?\d+$/,m=/^[+-]?0x[\da-f]+/i,R=/^[+-]?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)$/i,y=/^['"]/,v=/^\//,bt=function(e,t){var n,i;return i=t.scope.root,e in i.utilities?i.utilities[e]:(n=i.freeVariable(e),i.assign(n,K[e](t)),i.utilities[e]=n)},ut=function(e,t){return e=e.replace(/\n/g,"$&"+t),e.replace(/\s+$/,"")},pt=function(e){return null==e?0:e.match(m)?parseInt(e,16):parseFloat(e)},at=function(e){return e instanceof x&&"arguments"===e.value&&!e.asKey},ct=function(e){return e instanceof x&&"this"===e.value&&!e.asKey||e instanceof c&&e.bound||e instanceof o&&e.isSuper},ot=function(e){return e.isComplex()||("function"==typeof e.isAssignable?e.isAssignable():void 0)},yt=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new z(t),i}}.call(this),t.exports}(),require["./sourcemap"]=function(){var e={},t={exports:e};return function(){var e,n;e=function(){function e(e){this.line=e,this.columns=[]}return e.prototype.add=function(e,t,n){var i,r;return r=t[0],i=t[1],null==n&&(n={}),this.columns[e]&&n.noReplace?void 0:this.columns[e]={line:this.line,column:e,sourceLine:r,sourceColumn:i}},e.prototype.sourceLocation=function(e){for(var t;!((t=this.columns[e])||0>=e);)e--;return t&&[t.sourceLine,t.sourceColumn]},e}(),n=function(){function t(){this.lines=[]}var n,i,r,s;return t.prototype.add=function(t,n,i){var r,s,o,a;return null==i&&(i={}),o=n[0],s=n[1],a=(r=this.lines)[o]||(r[o]=new e(o)),a.add(s,t,i)},t.prototype.sourceLocation=function(e){var t,n,i;for(n=e[0],t=e[1];!((i=this.lines[n])||0>=n);)n--;return i&&i.sourceLocation(t)},t.prototype.generate=function(e,t){var n,i,r,s,o,a,c,h,l,u,p,d,f,m,g,v;for(null==e&&(e={}),null==t&&(t=null),v=0,s=0,a=0,o=0,d=!1,n="",f=this.lines,u=i=0,c=f.length;c>i;u=++i)if(l=f[u])for(m=l.columns,r=0,h=m.length;h>r;r++)if(p=m[r]){for(;p.line>v;)s=0,d=!1,n+=";",v++;d&&(n+=",",d=!1),n+=this.encodeVlq(p.column-s),s=p.column,n+=this.encodeVlq(0),n+=this.encodeVlq(p.sourceLine-a),a=p.sourceLine,n+=this.encodeVlq(p.sourceColumn-o),o=p.sourceColumn,d=!0}return g={version:3,file:e.generatedFile||"",sourceRoot:e.sourceRoot||"",sources:e.sourceFiles||[""],names:[],mappings:n},e.inline&&(g.sourcesContent=[t]),JSON.stringify(g,null,2)},r=5,i=1<<r,s=i-1,t.prototype.encodeVlq=function(e){var t,n,o,a;for(t="",o=0>e?1:0,a=(Math.abs(e)<<1)+o;a||!t;)n=a&s,a>>=r,a&&(n|=i),t+=this.encodeBase64(n);return t},n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t.prototype.encodeBase64=function(e){return n[e]||function(){throw Error("Cannot Base64 encode value: "+e)}()},t}(),t.exports=n}.call(this),t.exports}(),require["./coffee-script"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,g,v,y,b={}.hasOwnProperty,k=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};if(a=require("fs"),v=require("vm"),f=require("path"),t=require("./lexer").Lexer,d=require("./parser").parser,h=require("./helpers"),n=require("./sourcemap"),e.VERSION="1.9.1",e.FILE_EXTENSIONS=[".coffee",".litcoffee",".coffee.md"],e.helpers=h,y=function(e){return function(t,n){var i;null==n&&(n={});try{return e.call(this,t,n)
}catch(r){throw i=r,h.updateSyntaxError(i,t,n.filename)}}},e.compile=r=y(function(e,t){var i,r,s,o,a,c,l,u,f,m,g,v,y,b,k;for(v=h.merge,o=h.extend,t=o({},t),t.sourceMap&&(g=new n),k=p.tokenize(e,t),t.referencedVars=function(){var e,t,n;for(n=[],e=0,t=k.length;t>e;e++)b=k[e],b.variable&&n.push(b[1]);return n}(),c=d.parse(k).compileToFragments(t),s=0,t.header&&(s+=1),t.shiftLine&&(s+=1),r=0,f="",u=0,m=c.length;m>u;u++)a=c[u],t.sourceMap&&(a.locationData&&g.add([a.locationData.first_line,a.locationData.first_column],[s,r],{noReplace:!0}),y=h.count(a.code,"\n"),s+=y,y?r=a.code.length-(a.code.lastIndexOf("\n")+1):r+=a.code.length),f+=a.code;return t.header&&(l="Generated by CoffeeScript "+this.VERSION,f="// "+l+"\n"+f),t.sourceMap?(i={js:f},i.sourceMap=g,i.v3SourceMap=g.generate(t,e),i):f}),e.tokens=y(function(e,t){return p.tokenize(e,t)}),e.nodes=y(function(e,t){return"string"==typeof e?d.parse(p.tokenize(e,t)):d.parse(e)}),e.run=function(e,t){var n,i,s,o;return null==t&&(t={}),s=require.main,s.filename=process.argv[1]=t.filename?a.realpathSync(t.filename):".",s.moduleCache&&(s.moduleCache={}),i=t.filename?f.dirname(a.realpathSync(t.filename)):a.realpathSync("."),s.paths=require("module")._nodeModulePaths(i),(!h.isCoffee(s.filename)||require.extensions)&&(n=r(e,t),e=null!=(o=n.js)?o:n),s._compile(e,s.filename)},e.eval=function(e,t){var n,i,s,o,a,c,h,l,u,p,d,m,g,y,k,w,T;if(null==t&&(t={}),e=e.trim()){if(o=null!=(m=v.Script.createContext)?m:v.createContext,c=null!=(g=v.isContext)?g:function(){return t.sandbox instanceof o().constructor},o){if(null!=t.sandbox){if(c(t.sandbox))w=t.sandbox;else{w=o(),y=t.sandbox;for(l in y)b.call(y,l)&&(T=y[l],w[l]=T)}w.global=w.root=w.GLOBAL=w}else w=global;if(w.__filename=t.filename||"eval",w.__dirname=f.dirname(w.__filename),w===global&&!w.module&&!w.require){for(n=require("module"),w.module=i=new n(t.modulename||"eval"),w.require=s=function(e){return n._load(e,i,!0)},i.filename=w.__filename,k=Object.getOwnPropertyNames(require),a=0,u=k.length;u>a;a++)d=k[a],"paths"!==d&&(s[d]=require[d]);s.paths=i.paths=n._nodeModulePaths(process.cwd()),s.resolve=function(e){return n._resolveFilename(e,i)}}}p={};for(l in t)b.call(t,l)&&(T=t[l],p[l]=T);return p.bare=!0,h=r(e,p),w===global?v.runInThisContext(h):v.runInContext(h,w)}},e.register=function(){return require("./register")},require.extensions)for(m=this.FILE_EXTENSIONS,l=0,u=m.length;u>l;l++)s=m[l],null==(i=require.extensions)[s]&&(i[s]=function(){throw Error("Use CoffeeScript.register() or require the coffee-script/register module to require "+s+" files.")});e._compileFile=function(e,t){var n,i,s,o;null==t&&(t=!1),s=a.readFileSync(e,"utf8"),o=65279===s.charCodeAt(0)?s.substring(1):s;try{n=r(o,{filename:e,sourceMap:t,literate:h.isLiterate(e)})}catch(c){throw i=c,h.updateSyntaxError(i,o,e)}return n},p=new t,d.lexer={lex:function(){var e,t;return t=d.tokens[this.pos++],t?(e=t[0],this.yytext=t[1],this.yylloc=t[2],d.errorToken=t.origin||t,this.yylineno=this.yylloc.first_line):e="",e},setInput:function(e){return d.tokens=e,this.pos=0},upcomingInput:function(){return""}},d.yy=require("./nodes"),d.yy.parseError=function(e,t){var n,i,r,s,o,a;return o=t.token,s=d.errorToken,a=d.tokens,i=s[0],r=s[1],n=s[2],r=function(){switch(!1){case s!==a[a.length-1]:return"end of input";case"INDENT"!==i&&"OUTDENT"!==i:return"indentation";case"IDENTIFIER"!==i&&"NUMBER"!==i&&"STRING"!==i&&"STRING_START"!==i&&"REGEX"!==i&&"REGEX_START"!==i:return i.replace(/_START$/,"").toLowerCase();default:return h.nameWhitespaceCharacter(r)}}(),h.throwSyntaxError("unexpected "+r,n)},o=function(e,t){var n,i,r,s,o,a,c,h,l,u,p,d;return s=void 0,r="",e.isNative()?r="native":(e.isEval()?(s=e.getScriptNameOrSourceURL(),s||(r=e.getEvalOrigin()+", ")):s=e.getFileName(),s||(s="<anonymous>"),h=e.getLineNumber(),i=e.getColumnNumber(),u=t(s,h,i),r=u?s+":"+u[0]+":"+u[1]:s+":"+h+":"+i),o=e.getFunctionName(),a=e.isConstructor(),c=!(e.isToplevel()||a),c?(l=e.getMethodName(),d=e.getTypeName(),o?(p=n="",d&&o.indexOf(d)&&(p=d+"."),l&&o.indexOf("."+l)!==o.length-l.length-1&&(n=" [as "+l+"]"),""+p+o+n+" ("+r+")"):d+"."+(l||"<anonymous>")+" ("+r+")"):a?"new "+(o||"<anonymous>")+" ("+r+")":o?o+" ("+r+")":r},g={},c=function(t){var n,i;if(g[t])return g[t];if(i=null!=f?f.extname(t):void 0,!(0>k.call(e.FILE_EXTENSIONS,i)))return n=e._compileFile(t,!0),g[t]=n.sourceMap},Error.prepareStackTrace=function(t,n){var i,r,s;return s=function(e,t,n){var i,r;return r=c(e),r&&(i=r.sourceLocation([t-1,n-1])),i?[i[0]+1,i[1]+1]:null},r=function(){var t,r,a;for(a=[],t=0,r=n.length;r>t&&(i=n[t],i.getFunction()!==e.run);t++)a.push("  at "+o(i,s));return a}(),""+t+"\n"+r.join("\n")+"\n"}}.call(this),t.exports}(),require["./browser"]=function(){var exports={},module={exports:exports};return function(){var CoffeeScript,compile,runScripts,indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};CoffeeScript=require("./coffee-script"),CoffeeScript.require=require,compile=CoffeeScript.compile,CoffeeScript.eval=function(code,options){return null==options&&(options={}),null==options.bare&&(options.bare=!0),eval(compile(code,options))},CoffeeScript.run=function(e,t){return null==t&&(t={}),t.bare=!0,t.shiftLine=!0,Function(compile(e,t))()},"undefined"!=typeof window&&null!==window&&("undefined"!=typeof btoa&&null!==btoa&&"undefined"!=typeof JSON&&null!==JSON&&"undefined"!=typeof unescape&&null!==unescape&&"undefined"!=typeof encodeURIComponent&&null!==encodeURIComponent&&(compile=function(e,t){var n,i,r;return null==t&&(t={}),t.sourceMap=!0,t.inline=!0,i=CoffeeScript.compile(e,t),n=i.js,r=i.v3SourceMap,n+"\n//# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(r)))+"\n//# sourceURL=coffeescript"}),CoffeeScript.load=function(e,t,n,i){var r;return null==n&&(n={}),null==i&&(i=!1),n.sourceFiles=[e],r=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest,r.open("GET",e,!0),"overrideMimeType"in r&&r.overrideMimeType("text/plain"),r.onreadystatechange=function(){var s,o;if(4===r.readyState){if(0!==(o=r.status)&&200!==o)throw Error("Could not load "+e);if(s=[r.responseText,n],i||CoffeeScript.run.apply(CoffeeScript,s),t)return t(s)}},r.send(null)},runScripts=function(){var e,t,n,i,r,s,o,a,c,h,l;for(l=window.document.getElementsByTagName("script"),t=["text/coffeescript","text/literate-coffeescript"],e=function(){var e,n,i,r;for(r=[],e=0,n=l.length;n>e;e++)c=l[e],i=c.type,indexOf.call(t,i)>=0&&r.push(c);return r}(),s=0,n=function(){var t;return t=e[s],t instanceof Array?(CoffeeScript.run.apply(CoffeeScript,t),s++,n()):void 0},i=function(i,r){var s;return s={literate:i.type===t[1]},i.src?CoffeeScript.load(i.src,function(t){return e[r]=t,n()},s,!0):(s.sourceFiles=["embedded"],e[r]=[i.innerHTML,s])},r=o=0,a=e.length;a>o;r=++o)h=e[r],i(h,r);return n()},window.addEventListener?window.addEventListener("DOMContentLoaded",runScripts,!1):window.attachEvent("onload",runScripts))}.call(this),module.exports}(),require["./coffee-script"]}();"function"==typeof define&&define.amd?define(function(){return CoffeeScript}):root.CoffeeScript=CoffeeScript})(this);
iio.logs = [];

//LOG OBJECT
iio.Log = function(){ this.Log.apply(this, arguments) }
iio.Log.SUCCESS = 1;
iio.Log.FAILURE = 2;
iio.Log.WARNING = 3;
iio.Log.prototype.Log = function() {
  if(iio.is.string(arguments[0])){
    this.msg = arguments[0];
    this.type = arguments[1] || 0;
  } else for (var p in arguments[0]) this[p] = arguments[0][p];
}

iio.log = function(){
  iio.add_log(new iio.Log(arguments[0],arguments[1]));
}

iio.show_logs = function(){
  iio.logDiv = document.createElement('div');
  iio.logDiv.id = 'iio_log';
  iio.logDiv.style.position = 'fixed';
  iio.logDiv.style.bottom = '0';
  iio.logDiv.style.right = '0';
  document.body.appendChild(iio.logDiv);
  for(var i=0; i<iio.logs.length; i++)
    iio.add_log(iio.logs[i]);
}

iio.add_log = function(log){
  var p = document.createElement('p');
  p.innerHTML = log.msg;
  if(log.type == iio.Log.SUCCESS) p.style.color = 'green';
  if(log.type == iio.Log.FAILURE) p.style.color = 'red';
  if(log.type == iio.Log.WARNING) p.style.color = 'yellow';
  p.style.fontFamily = 'monospace';
  iio.logDiv.appendChild(p);
  iio.logs.push(log);
  return log;
}

//STACK TRACING
iio._start = iio.start;
iio.start = function(app, id, d){
  iio.log('START: '+app.name);
  return iio._start(app, id, d)
}

//constructors
iio.App.prototype._App = iio.App.prototype.App;
iio.App.prototype.App = function(view, app, s) {
  iio.log('enter CONSTRUCTOR: App');
  this._App(view, app, s);
  iio.log('- App.pos: '+this.pos.x+','+this.pos.y);
  iio.log('- App.width: '+this.width);
  iio.log('- App.height: '+this.height);
  iio.log('end CONSTRUCTOR: App');
}
iio.Obj.prototype._Obj = iio.Obj.prototype.Obj;
iio.Obj.prototype.Obj = function() {
  iio.log('enter CONSTRUCTOR: Obj');
  this._Obj(arguments[0]);
  if(this.pos) iio.log('- Obj.pos: '+this.pos.x+','+this.pos.y);
  if(this.color) iio.log('- Obj.color: '+this.color.toString());
  iio.log('end CONSTRUCTOR: Obj');
}
iio.Drawable.prototype._Drawable = iio.Drawable.prototype.Drawable;
iio.Drawable.prototype.Drawable = function() {
  iio.log('enter CONSTRUCTOR: Drawable');
  this._Drawable(arguments[0]);
  iio.log('end CONSTRUCTOR: Drawable');
}
iio.Line.prototype._Line = iio.Line.prototype.Line;
iio.Line.prototype.Line = function() {
  iio.log('enter CONSTRUCTOR: Line');
  this._Line(arguments[0]);
  if(this.vs) iio.log('- Line.vs: ['+this.vs[0].x+','+this.vs[0].y+'] ['+this.vs[1].x+','+this.vs[1].y+']');
  iio.log('end CONSTRUCTOR: Line');
}
/*
   iio engine
   Version 1.3- Working Version
*/
iio_dependency_path = "http://iioengine.com/src/core/"
iio_dependencies = [
  'core.js',
  'libs.js',
  'V.js',
  'Color.js',
  'Obj.js',
  'App.js',
  'SpriteMap.js',
  'Drawable.js',
  'Line.js',
  'Polygon.js',
  'Rectangle.js',
  'Square.js',
  'Grid.js',
  'Ellipse.js',
  'Text.js',
]

var load_iio_remote = function(onload){
  iio_load_dependency(0,onload);
}

var iio_load_dependency = function(i,onload){
  var file_element = document.createElement('script');
  file_element.setAttribute("type","text/javascript");
  file_element.setAttribute("src", iio_dependency_path + iio_dependencies[i]);
  if (typeof file_element!="undefined")
        document.getElementsByTagName("head")[0].appendChild(file_element)

  file_element.onload = function(){
    if(i<iio_dependencies.length-1)
      iio_load_dependency(i+1,onload);
    else onload();
  }
}
