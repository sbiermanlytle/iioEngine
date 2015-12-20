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