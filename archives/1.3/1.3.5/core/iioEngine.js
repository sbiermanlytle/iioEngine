/*
   iio engine
   Version 1.3.5 Working Version
   archived 3/3/2015

   1.3 is a work in progress, but already useful for many apps
   1.2 has more features, less bugs, and is available on github

   API: docs/
   Demos: iioapps.com
   Sandbox: iioengine.com/sandbox

---------------------------------------------------------------------
The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2014, Sebastian Bierman-Lytle
All rights reserved.

*/
iio = {};
(function() {

  //DEFAULT PROPERTIES
  iio.apps = [];

  //OBJECT TYPE SINGLETONS
  iio.APP  = {};
  iio.OBJ  = {};
  iio.LINE = {};
  iio.X    = {};
  iio.CIRC = {};
  iio.RECT = {};
  iio.POLY = {};
  iio.GRID = {};
  iio.TEXT = {};

  //INITIALIZATION
  iio.start = function(app, id, d) {

    var c = iio.canvas.prep(id, d);

    //initialize application with settings
    if (app instanceof Array)
      return new iio.App(c, app[0], app[1]);

    //run iio file
    else if (iio.is.string(app) && app.substring(app.length - 4) == '.iio')
      return iio.read(app, iio.start);

    //initialize application without settings
    return new iio.App(c, app);
  }

  //JS ADDITIONS
  Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
    return this;
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
    } else {
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
    o.loops.forEach(function(loop) {
      iio.cancelLoop(loop.id);
    });
    if (o.mainLoop) iio.cancelLoop(o.mainLoop.id);
    if (typeof c == 'undefined')
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
      if (app.runScript && app.runScript.resize) app.runScript.resize();
      app.draw();
    });
  }
  iio.prep_input = function() {
    window.onresize = iio.resize;
    iio.addEvent(window, 'keydown', function(e) {
      var k = iio.key.string(e);
      iio.apps.forEach(function(app) {
        if (app.runScript && app.runScript.onKeyDown)
          app.runScript.onKeyDown(e, k);
      });
    });
    iio.addEvent(window, 'keyup', function(e) {
      var k = iio.key.string(e);
      iio.apps.forEach(function(app) {
        if (app.runScript && app.runScript.onKeyUp)
          app.runScript.onKeyUp(e, k);
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
  };
  iio.prep_input();

  //UTIL LIBRARIES
  iio.is = {
    fn: function(fn) {
      return typeof fn === 'function'
    },
    number: function(o) {
      if (typeof o === 'number') return true;
      return (o - 0) == o && o.length > 0;
    },
    string: function(s) {
      return typeof s == 'string' || s instanceof String
    },
    image: function(img) {
      return ['png', 'jpg', 'gif', 'tiff'].some(
        function(ie) {
          return (img.indexOf('.' + ie) != -1)
        });
    },
    between: function(val, min, max) {
      if (max < min) {
        var tmp = min;
        min = max;
        max = tmp;
      }
      return (val >= min && val <= max);
    }
  }

  iio.random = {
    num: function(min, max) {
      min = min || 0;
      max = (max === 0 || typeof(max) != 'undefined') ? max : 1;
      return Math.random() * (max - min) + min;
    },
    integer: function(min, max) {
      min = min || 0;
      max = max || 1;
      return Math.floor(Math.random() * (max - min)) + min;
    },
    color: function() {
      return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")"
    }
  }

  iio.color = {
    random: iio.random.color,
    invert: function(c) {
      var ss = c.substr(c.indexOf(',') + 1);
      var ss2 = ss.substr(ss.indexOf(',') + 1);
      return "rgb(" + (255 - parseInt(c.substr(c.indexOf('(') + 1, c.indexOf(',')), 10)) + "," + (255 - parseInt(ss.substr(0, ss.indexOf(',')), 10)) + "," + (255 - parseInt(ss2.substr(0, ss2.indexOf(')')), 10)) + ")"
    }
  }

  iio.bounds = {
    resolve: function(b, c) {
      if (b.length > 1) return b[1](c);
      return true;
    },
    over_upper_limit: function(bnd, lim, c) {
      if (lim > bnd[0]) return iio.bounds.resolve(bnd, c);
      return false;
    },
    below_lower_limit: function(bnd, lim, c) {
      if (lim < bnd[0]) return iio.bounds.resolve(bnd, c);
      return false;
    }
  }

  iio.point = {
    rotate: function(x, y, r) {
      if (typeof x.x != 'undefined') {
        r = y;
        y = x.y;
        x = x.x;
      }
      if (typeof r == 'undefined' || r == 0) return {
        x: x,
        y: y
      }
      var newX = x * Math.cos(r) - y * Math.sin(r);
      var newY = y * Math.cos(r) + x * Math.sin(r);
      return {
        x: newX,
        y: newY
      };
    },
    vector: function(points) {
      var vecs = [];
      if (!(points instanceof Array)) points = [points];
      for (var i = 0; i < points.length; i++) {
        if (typeof points[i].x != 'undefined')
          vecs.push(points[i]);
        else {
          vecs.push({
            x: points[i],
            y: points[i + 1]
          });
          i++;
        }
      }
      return vecs;
    }
  }

  iio.key = {
    string: function(e) {
      switch (e.keyCode) {
        case 8:
          return 'backspace';
        case 9:
          return 'tab';
        case 13:
          return 'enter';
        case 16:
          return 'shift';
        case 17:
          return 'ctrl';
        case 18:
          return 'alt';
        case 19:
          return 'pause';
        case 20:
          return 'caps lock';
        case 27:
          return 'escape';
        case 32:
          return 'space';
        case 33:
          return 'page up';
        case 34:
          return 'page down';
        case 35:
          return 'end';
        case 36:
          return 'home';
        case 37:
          return 'left arrow';
        case 38:
          return 'up arrow';
        case 39:
          return 'right arrow';
        case 40:
          return 'down arrow';
        case 45:
          return 'insert';
        case 46:
          return 'delete';
        case 48:
          return '0';
        case 49:
          return '1';
        case 50:
          return '2';
        case 51:
          return '3';
        case 52:
          return '4';
        case 53:
          return '5';
        case 54:
          return '6';
        case 55:
          return '7';
        case 56:
          return '8';
        case 57:
          return '9';
        case 65:
          return 'a';
        case 66:
          return 'b';
        case 67:
          return 'c';
        case 68:
          return 'd';
        case 69:
          return 'e';
        case 70:
          return 'f';
        case 71:
          return 'g';
        case 72:
          return 'h';
        case 73:
          return 'i';
        case 74:
          return 'j';
        case 75:
          return 'k';
        case 76:
          return 'l';
        case 77:
          return 'm';
        case 78:
          return 'n';
        case 79:
          return 'o';
        case 80:
          return 'p';
        case 81:
          return 'q';
        case 82:
          return 'r';
        case 83:
          return 's';
        case 84:
          return 't';
        case 85:
          return 'u';
        case 86:
          return 'v';
        case 87:
          return 'w';
        case 88:
          return 'x';
        case 89:
          return 'y';
        case 90:
          return 'z';
        case 91:
          return 'left window';
        case 92:
          return 'right window';
        case 93:
          return 'select key';
        case 96:
          return 'n0';
        case 97:
          return 'n1';
        case 98:
          return 'n2';
        case 99:
          return 'n3';
        case 100:
          return 'n4';
        case 101:
          return 'n5';
        case 102:
          return 'n6';
        case 103:
          return 'n7';
        case 104:
          return 'n8';
        case 105:
          return 'n9';
        case 106:
          return 'multiply';
        case 107:
          return 'add';
        case 109:
          return 'subtract';
        case 110:
          return 'dec';
        case 111:
          return 'divide';
        case 112:
          return 'f1';
        case 113:
          return 'f2';
        case 114:
          return 'f3';
        case 115:
          return 'f4';
        case 116:
          return 'f5';
        case 117:
          return 'f6';
        case 118:
          return 'f7';
        case 119:
          return 'f8';
        case 120:
          return 'f9';
        case 121:
          return 'f10';
        case 122:
          return 'f11';
        case 123:
          return 'f12';
        case 144:
          return 'num lock';
        case 156:
          return 'scroll lock';
        case 186:
          return 'semi-colon';
        case 187:
          return 'equal';
        case 188:
          return 'comma';
        case 189:
          return 'dash';
        case 190:
          return 'period';
        case 191:
          return 'forward slash';
        case 192:
          return 'grave accent';
        case 219:
          return 'open bracket';
        case 220:
          return 'back slash';
        case 221:
          return 'close bracket';
        case 222:
          return 'single quote';
        default:
          return 'undefined';
      }
    },
    code_is: function(keys, event) {
      if (!(keys instanceof Array)) keys = [keys];
      var str = iio.key.string(event);
      return keys.some(function(key) {
        return key === str;
      });
    }
  }

  iio.v = {
    add: function(v1, v2) {
      for (var p in v2)
        if (v1[p]) v1[p] += v2[p];
      return v1
    },
    sub: function(v1, v2) {
      for (var p in v2)
        if (v1[p]) v1[p] -= v2[p];
      return v1
    },
    mult: function(v1, v2) {
      for (var p in v2)
        if (v1[p]) v1[p] *= v2[p];
      return v1
    },
    div: function(v1, v2) {
      for (var p in v2)
        if (v1[p]) v1[p] /= v2[p];
      return v1
    },
    dist: function(v1, v2) {
      return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
    }
  }

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
        c.style.position = 'absolute';
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
          if (id.tagName == 'CANVAS') c = id;

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
      o.onmousedown = function(e) {
        var ep = this.parent.convertEventPos(e);
        if (this.parent.click) this.parent.click(e, ep);
        this.parent.objs.forEach(function(obj, i) {
          if (i !== 0) ep = this.parent.convertEventPos(e);
          if (obj.contains && obj.contains(ep))
            if (obj.click) {
              if (obj.type == iio.GRID) {
                var c = obj.cellAt(ep);
                obj.click(e, ep, c, obj.cellCenter(c.c, c.r));
              } else obj.click(e, ep);
            }
        }, this)
      }
    }
  }

  iio.anim = {
    play: function(fps, t, r, fn, s) {
      if (iio.is.string(t)) {
        var o = this;
        this.anims.some(function(anim, i) {
          if (anim.tag == t) {
            o.animKey = i;
            o.width = anim.frames[o.animFrame].w;
            o.height = anim.frames[o.animFrame].h;
            return true;
          }
          return false;
        });
      } else r = t;
      this.animFrame = s || 0;
      if (typeof(r) != 'undefined') {
        this.repeat = r;
        this.onanimstop = fn;
      }
      var loop;
      if (fps > 0) loop = this.loop(fps, iio.anim.next);
      else if (fps < 0) loop = this.loop(fps * -1, iio.anim.prev);
      else this.app.draw();
      return loop;
    },
    next: function(o) {
      o.animFrame++;
      if (o.animFrame >= o.anims[o.animKey].frames.length) {
        o.animFrame = 0;
        if (typeof(o.repeat) != 'undefined') {
          if (o.repeat <= 1) {
            window.cancelAnimationFrame(id);
            window.clearTimeout(id);
            if (o.onanimstop) o.onanimstop(id, o);
            return;
          } else o.repeat--;
        }
      }
    },
    prev: function(o) {
      o.animFrame--;
      if (o.animFrame < 0)
        o.animFrame = o.anims[o.animKey].frames.length - 1;
      o.app.draw();
    },
    shrink: function(s, r) {
      this.width *= 1 - s;
      this.height *= 1 - s;
      if (this.width < .02) {
        if (r) return r(this);
        else return true;
      }
    },
    fade: function(s, r) {
      this.alpha *= 1 - s;
      if (this.alpha < .002) {
        if (r) return r(this);
        else return true;
      }
    }
  }

  iio.collision = {
    check: function(o1, o2) {
      if (typeof(o1) == 'undefined' || typeof(o2) == 'undefined') return false;
      if (o1.type == iio.RECT && o2.type == iio.RECT) {
        if (o1.simple) {
          if (o2.simple) return iio.collision.rectXrect(
            o1.pos.x - o1.bbx[0], o1.pos.x + o1.bbx[0], o1.pos.y - (o1.bbx[1] || o1.bbx[0]), o1.pos.y + (o1.bbx[1] || o1.bbx[0]),
            o2.pos.x - o2.bbx[0], o2.pos.x + o2.bbx[0], o2.pos.y - (o2.bbx[1] || o2.bbx[0]), o2.pos.y + (o2.bbx[1] || o2.bbx[0]));
          else return iio.collision.rectXrect(
            o1.pos.x - o1.bbx[0], o1.pos.x + o1.bbx[0], o1.pos.y - (o1.bbx[1] || o1.bbx[0]), o1.pos.y + (o1.bbx[1] || o1.bbx[0]),
            o2.left, o2.right, o2.top, o2.bottom);
        } else if (o2.simple) return iio.collision.rectXrect(o1.left, o1.right, o1.top, o1.bottom,
          o2.pos.x - o2.bbx[0], o2.pos.x + o2.bbx[0], o2.pos.y - (o2.bbx[1] || o2.bbx[0]), o2.pos.y + (o2.bbx[1] || o2.bbx[0]));
        else return iio.collision.rectXrect(o1.left, o1.right, o1.top, o1.bottom, o2.left, o2.right, o2.top, o2.bottom)
      }
    },
    rectXrect: function(r1L, r1R, r1T, r1B, r2L, r2R, r2T, r2B) {
      if (r1L < r2R && r1R > r2L && r1T < r2B && r1B > r2T) return true;
      return false;
    }
  }

  iio.draw = {
    line: function(ctx, x, y, x1, y1) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    },
    rect: function(ctx, w, h, s, p) {
      if (p.round) {
        ctx.beginPath();
        ctx.moveTo(p.round[0], 0);
        ctx.lineTo(w - p.round[1], 0);
        ctx.quadraticCurveTo(w, 0, w, p.round[1]);
        ctx.lineTo(w, h - p.round[2]);
        ctx.quadraticCurveTo(w, h, w - p.round[2], h);
        ctx.lineTo(p.round[3], h);
        ctx.quadraticCurveTo(0, h, 0, h - p.round[3]);
        ctx.lineTo(0, p.round[0]);
        ctx.quadraticCurveTo(0, 0, p.round[0], 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.clip();
      } else {
        if (s.c) ctx.fillRect(0, 0, w, h);
        if (p.img) ctx.drawImage(p.img, 0, 0, w, h);
        if (p.anims) ctx.drawImage(p.anims[p.animKey].frames[p.animFrame].src,
          p.anims[p.animKey].frames[p.animFrame].x,
          p.anims[p.animKey].frames[p.animFrame].y,
          p.anims[p.animKey].frames[p.animFrame].w,
          p.anims[p.animKey].frames[p.animFrame].h,
          0, 0, w, h);
        if (s.o) ctx.strokeRect(0, 0, w, h);
      }
    },
    poly: function(ctx, vs, bezier, open) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      if (bezier) {
        var _i = 0;
        for (var i = 1; i < vs.length; i++)
          ctx.bezierCurveTo((bezier[_i++] || vs[i - 1].x - vs[0].x), (bezier[_i++] || vs[i - 1].y - vs[0].y), (bezier[_i++] || vs[i].x - vs[0].x), (bezier[_i++] || vs[i].y - vs[0].y), vs[i].x - vs[0].x, vs[i].y - vs[0].y);
        if (typeof(open) == 'undefined' || !open) {
          i--;
          ctx.bezierCurveTo((bezier[_i++] || vs[i].x - vs[0].x), (bezier[_i++] || vs[i].y - vs[0].y), (bezier[_i++] || 0), (bezier[_i++] || 0), 0, 0);
        }
      } else vs.forEach(function(v) {
        ctx.lineTo(v.x - vs[0].x, v.y - vs[0].y);
      });
      if (typeof(open) == 'undefined' || !open)
        ctx.closePath();
    },
    finish_path_shape: function(ctx, o) {
      if (o.color) ctx.fill();
      if (o.img) ctx.drawImage(o.img, -o.width / 2, -o.height / 2, o.width, o.height);
      if (o.outline) ctx.stroke();
      if (o.clip) ctx.clip();
    },
    prep_shape: function(ctx, o) {
      if (o.color) {
        if (o.color.indexOf && o.color.indexOf('gradient') > -1)
          o.color = o.createGradient(ctx, o.color);
        ctx.fillStyle = o.color;
      }
      if (o.outline) {
        if (o.outline.indexOf && o.outline.indexOf('gradient') > -1)
          o.outline = o.createGradient(ctx, o.outline);
        ctx.lineWidth = o.lineWidth;
        ctx.strokeStyle = o.outline;
      }
    },
    prep_x: function(ctx, o) {
      ctx.save();
      if (o.color.indexOf && o.color.indexOf('gradient') > -1)
        o.color = o.createGradient(ctx, o.color);
      ctx.strokeStyle = o.color||o.outline;
      ctx.lineWidth = o.lineWidth;
    },
    obj: function(ctx) {
      if (this.hidden) return;
      if (typeof(ctx) == 'undefined') ctx = this.app.ctx;
      ctx.save();
      if (this.origin)
        ctx.translate(this.origin.x, this.origin.y);
      else ctx.translate(this.pos.x, this.pos.y);
      if (this.rot != 0) ctx.rotate(this.rot);
      if (this.objs.length > 0) {
        var drawnSelf = false;
        this.objs.forEach(function(obj) {
          if (!drawnSelf && obj.z >= this.z) {
            this.finish_draw(ctx);
            drawnSelf = true;
          }
          if (obj.draw) obj.draw(ctx);
        }, this);
        if (!drawnSelf) this.finish_draw(ctx);
      } else this.finish_draw(ctx);
      ctx.restore();
    },
    finish_obj: function(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      if (this.lineCap) ctx.lineCap = this.lineCap;
      if (this.shadow) {
        var s = this.shadow.split(' ');
        s.forEach(function(_s) {
          if (iio.is.number(_s))
            ctx.shadowBlur = _s;
          else if (_s.indexOf(':') > -1) {
            var _i = _s.indexOf(':');
            ctx.shadowOffsetX = _s.substring(0, _i);
            ctx.shadowOffsetY = _s.substring(_i + 1);
          } else ctx.shadowColor = _s;
        });
      }
      if (this.dash) {
        if (this.dash.length > 1 && this.dash.length % 2 == 1)
          ctx.lineDashOffset = this.dash[this.dash.length - 1];
        //ctx.setLineDash(this.dash.slice().splice(0,this.dash.length-1));
        ctx.setLineDash(this.dash);
      }
      this.draw_type(ctx);
      ctx.restore();
    }
  }

  iio.api = {
    run: function(s, nd) {
      return iio.run(s, o, nd)
    },
    set: function(s, no_draw) {

      if(s==null) return this;

      if(s.x && s.y){
        this.pos.x = s.x;
        this.pos.y = s.y;
        return this;
      }

      //set array of settings
      if (s instanceof Array)
        s.forEach(function(_s) {
          this.set(_s, no_draw);
        }, this);

      //set with number defaults
      else if (iio.is.number(s)) {
        if (this.radius) this.radius = s / 2;
        else if (this.width == this.height) this.width = this.height = s;
        else this.width = s;

      //set with string defaults
      } else if(iio.is.string(s))
        this.color = s;

      //set with JSON
      else for (var p in s) this[p] = s[p];

      if (typeof(this.height) == 'undefined')
        this.height = this.width;

      iio.api.update(this);

      //draw if not flagged
      if (no_draw);
      else this.app.draw();

      return this;
    },
    add: function() {
      if (arguments[0] instanceof Array)
        arguments[0].forEach(function() {
          this.add(arguments);
        }, this);
      else if (typeof(arguments[0].app) != 'undefined') {
        arguments[0].parent = this;
        //arguments[0].app = this.app;
        if (typeof(arguments[0].z) == 'undefined') arguments[0].z = 0;
        var i = 0;
        while (i < this.objs.length && typeof(this.objs[i].z) != 'undefined' && arguments[0].z >= this.objs[i].z) i++;
        this.objs.insert(i, arguments[0]);
        if (arguments[0].app && ((arguments[0].vel && (arguments[0].vel.x != 0 || arguments[0].vel.y != 0 || arguments[0].vel.r != 0)) || arguments[0].shrink || arguments[0].fade || (arguments[0].acc && (arguments[0].acc.x != 0 || arguments[0].acc.y != 0 || arguments[0].acc.r != 0))) && (typeof arguments[0].app.looping == 'undefined' || arguments[0].app.looping === false))
          arguments[0].app.loop();
      } else arguments[0] = this.add(new iio.Obj(this, arguments), true);
      if (arguments[arguments.length-1] === true);
      else this.app.draw();
      return arguments[0];
    },
    rmv: function(o, nd) {
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
    },
    loop: function(fps, fn) {
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
    },
    clear_loops: function() {
      for (var i = 0; i < this.loops.length; i++)
        iio.cancelLoop(this.loops[i]);
    },
    pause: function(c) {
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
    },
    eval: function(s) {
      if (!s) return 0;
      if (iio.is.number(s))
        return parseFloat(s);
      else if (s == 'center') return this.center;
      else if (s == 'width') return this.width;
      else if (s == 'height') return this.height;
      else if (s == 'hidden') return this.hidden;
      else if (s == 'random') return iio.random();
      else if (s == 'randomColor') return iio.color.random();
      var op;
      op = s.indexOf('-');
      if (op > -1) return this.eval(s.substring(0, op)) - this.eval(s.substring(op + 1));
      op = s.indexOf('+');
      if (op > -1) return this.eval(s.substring(0, op)) + this.eval(s.substring(op + 1));
      op = s.indexOf('/');
      if (op > -1) return this.eval(s.substring(0, op)) / this.eval(s.substring(op + 1));
      op = s.indexOf('*');
      if (op > -1) return this.eval(s.substring(0, op)) * this.eval(s.substring(op + 1));
      return s;
    },
    clear: function() {
      this.objs = [];
      this.app.draw();
    },
    update: function(o, nd) {
      if (o.text) o.type = iio.TEXT;
      if (o.simple) {
        if (!(o.bbx instanceof Array)) {
          o.bbx = [o.bbx, o.bbx];
        } else if (typeof(o.bbx[1] == 'undefined'))
          o.bbx[1] = o.bbx[0];
      }
      if (o.anims) {
        o.animKey = 0;
        o.animFrame = 0;
        if (!o.width) o.width = o.anims[o.animKey].frames[o.animFrame].w;
        if (!o.height) o.height = o.anims[o.animKey].frames[o.animFrame].h;
      }
      if (o.bezier)
        o.bezier.forEach(function(b, i) {
          if (b === 'n') o.bezier[i] = undefined;
        });
      if (o.img && iio.is.string(o.img)) {
        nd = false;
        var src = o.img;
        o.img = new Image();
        o.img.src = src;
        o.img.parent = o;
        if ((typeof o.width == 'undefined' && typeof o.radius == 'undefined') || o.radius == 0)
          o.img.onload = function(e) {
            if (o.radius == 0) o.radius = o.width / 2;
            else {
              o.width = o.width || 0;
              o.height = o.height || 0;
            }
            if (nd);
            else o.app.draw();
          }
      } else if (o.img) {
        if ((typeof o.width == 'undefined' && typeof o.radius == 'undefined') || o.radius == 0) {
          if (o.radius == 0) o.radius = o.img.width / 2;
          else {
            o.width = o.img.width || 0;
            o.height = o.img.height || 0;
          }
          if (nd);
          else o.app.draw();
        }
      }
    },
    update_physical: function(o, dt) {
      if (this.update) this.update(dt);
      var remove = false;
      if (this.bounds && !this.simple) {
        if (this.bounds.right) remove = iio.bounds.over_upper_limit(this.bounds.right, this.right, this);
        if (this.bounds.left) remove = iio.bounds.below_lower_limit(this.bounds.left, this.left, this);
        if (this.bounds.top) remove = iio.bounds.below_lower_limit(this.bounds.top, this.top, this);
        if (this.bounds.bottom) remove = iio.bounds.over_upper_limit(this.bounds.bottom, this.bottom, this);
      } else if (this.bounds) {
        if (this.bounds.right) remove = iio.bounds.over_upper_limit(this.bounds.right, this.pos.x, this);
        if (this.bounds.left) remove = iio.bounds.below_lower_limit(this.bounds.left, this.pos.x, this);
        if (this.bounds.top) remove = iio.bounds.below_lower_limit(this.bounds.top, this.pos.y, this);
        if (this.bounds.bottom) remove = iio.bounds.over_upper_limit(this.bounds.bottom, this.pos.y, this);
      }
      if (this.shrink) {
        if (this.shrink instanceof Array)
          remove = this._shrink(this.shrink[0], this.shrink[1]);
        else remove = this._shrink(this.shrink);
      }
      if (this.fade) {
        if (this.fade instanceof Array)
          remove = this._fade(this.fade[0], this.fade[1]);
        else remove = this._fade(this.fade);
      }
      if (remove) return remove;
      this.vel.x += this.acc.x;
      this.vel.y += this.acc.y;
      this.vel.r += this.acc.r;
      if (this.vel.x) this.pos.x += this.vel.x;
      if (this.vel.y) this.pos.y += this.vel.y;
      if (this.vel.r) this.rot += this.vel.r;
      if (!this.simple) this.updateProps(this.vel);
      if (this.objs && this.objs.length > 0)
        this.objs.forEach(function(obj) {
          if (obj._update && obj._update(o, dt)) this.rmv(obj);
        }, this);
    },
    createGradient: function(ctx, g) {
      var gradient;
      var p = g.split(':');
      var ps = p[1].split(',');
      if (ps.length == 4)
        gradient = ctx.createLinearGradient(this.eval(ps[0]), this.eval(ps[1]), this.eval(ps[2]), this.eval(ps[3]));
      else gradient = ctx.createRadialGradient(this.eval(ps[0]), this.eval(ps[1]), this.eval(ps[2]), this.eval(ps[3]), this.eval(ps[4]), this.eval(ps[5]));
      var c;
      p.forEach(function(_p) {
        c = _p.indexOf(',');
        var a = parseFloat(_p.substring(0, c));
        var b = this.eval(_p.substring(c + 1));
        gradient.addColorStop(a, b);
      });
      return gradient;
    },
    init_obj: function(o) {

      //Properties
      o.scale = 1;
      o.objs = [];
      o.rqAnimFrame = true;
      o.partialPx = true;
      o.alpha = 1;
      o.loops = [];

      //Functions
      o.run = iio.api.run;
      o.set = iio.api.set;
      o.add = iio.api.add;
      o.rmv = iio.api.rmv;
      o.loop = iio.api.loop;
      o.clearLoops = iio.api.clear_loops;
      o.pause = iio.api.pause;
      o.playAnim = iio.anim.play;
      o.eval = iio.api.eval;
    }
  }

  //APP
  function App() {
    this.App.apply(this, arguments);
  };
  iio.App = App;
  App.prototype.App = function(view, app, s) {

    //set type
    this.type = iio.APP;

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
    this.center = {
      x: this.width / 2,
      y: this.height / 2
    };

    //get DOM offset of canvas
    var offset = view.getBoundingClientRect();

    //set canvas DOM position
    this.pos = {
      x: offset.left,
      y: offset.top
    };

    //create convert function with offset
    this.convertEventPos = function(e) {
      return {
        x: e.clientX - this.pos.x,
        y: e.clientY - this.pos.y
      }
    }

    //initialize iio object
    iio.api.init_obj(this);

    //initialize app properties
    this.collisions = [];

    //add app to global app array
    iio.apps.push(this);

    //run js script
    this.runScript = new app(this, s);
  }
  App.prototype.stop = function() {
    this.objs.forEach(function(obj) {
      iio.cancelLoops(obj);
    });
    iio.cancelLoops(this);
    if (this.mainLoop) iio.cancelLoop(this.mainLoop.id);
    this.clear();
  }
  App.prototype.draw = function(noClear) {
    if (!noClear) this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.color) {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    if (this.round && this.canvas.style.borderRadius != this.round) {
      this.canvas.style.borderRadius = this.round;
      //this.canvas.style.MozBorderRadius=this.round;
      //this.canvas.style.WebkitBorderRadius=this.round;
    }
    if (this.outline)
      this.canvas.style.border = (this.lineWidth || 1) + 'px solid ' + this.outline;
    if (this.alpha)
      this.canvas.style.opacity = this.alpha;
    if (this.objs.length > 0)
      this.objs.forEach(function(obj) {
        if (obj.draw) obj.draw(this.ctx);
      }, this);
  }
  App.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    /*if(this.color){
       this.ctx.fillStyle=this.color;
       this.ctx.fillRect(0,0,this.width,this.height);
    }*/
  }
  App.prototype.collision = function(o1, o2, fn) {
    this.collisions.push(
      [o1, o2, fn]
    );
  }
  App.prototype.cCollisions = function(o1, o2, fn) {
    if (o1 instanceof Array) {
      if (o2 instanceof Array) {
        if (o2.length == 0) return;
        o1.forEach(function(_o1) {
          o2.forEach(function(_o2) {
            if (iio.collision.check(_o1, _o2)) fn(_o1, _o2);
          });
        });
      } else {
        o1.forEach(function(_o1) {
          if (iio.collision.check(_o1, o2)) fn(_o1, o2);
        });
      }
    } else {
      if (o2 instanceof Array) {
        o2.forEach(function(_o2) {
          if (iio.collision.check(o1, _o2)) fn(o1, _o2);
        });
      } else if (iio.collision.check(o1, o2)) fn(o1, o2);
    }
  }
  App.prototype._update = function(o, dt) {
    if (this.update) this.update(dt);
    if (this.objs && this.objs.length > 0)
      this.objs.forEach(function(obj) {
        if (obj._update && obj._update(o, dt)) this.rmv(obj);
      }, this);
    if (this.collisions && this.collisions.length > 0) {
      this.collisions.forEach(function(collision) {
        this.cCollisions(collision[0], collision[1], collision[2]);
      }, this);
    }
  }

  //SPRITEMAP
  function SpriteMap() {
    this.SpriteMap.apply(this, arguments);
  };
  iio.SpriteMap = SpriteMap;

  SpriteMap.prototype.SpriteMap = function(src, p) {
    this.img = new Image();
    this.img.src = src;
    this.img.onload = p.onload;
    return this;
  }
  SpriteMap.prototype.sprite = function(w, h, a, x, y, n) {
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

  //OBJ
  function Obj() {
    this.Obj.apply(this, arguments);
  };
  iio.Obj = Obj;
  Obj.prototype.Obj = function() {

    iio.api.init_obj(this);
    this.parent = arguments[0];
    this.app = this.parent.app;

    //set positional properties
    this.pos = {
      x: 0,
      y: 0
    };
    this.center = {
      x: 0,
      y: 0
    };
    this.rot = 0;
    this.vel = {
      x: 0,
      y: 0,
      r: 0
    };
    this.acc = {
      x: 0,
      y: 0,
      r: 0
    };

    if(arguments.length==2)
      for (var i=0; i<arguments[1].length;i++)
        this.set(arguments[1][i], true);
    else for (var i=1; i<arguments.length;i++)
      this.set(arguments[i], true);

    //init polygon
    if (this.pos.length > 2) {
      this.vs = this.pos;
      iio.poly.init(this);

      //init line
    } else if (this.pos.length == 2) {
      this.endPos = this.pos[1];
      iio.line.init(this);

      //init shape
    } else {

      //init text
      if (this.type == iio.TEXT) iio.text.init(this);

      //init circle
      else if (this.type == iio.CIRC) iio.circ.init(this);
      else {

        //init rect
        iio.rect.init(this);

        //init grid
        if (this.type == iio.GRID)
          iio.grid.init(this);

        //init x
        else if (this.type != iio.X)

        //init rect
          this.type = iio.RECT;
      }

      //define update roperties for shapes
      this.updateProps = function() {
        this.center = this.pos;
        this.left = this.pos.x - this.width / 2;
        this.right = this.pos.x + this.width / 2;
        this.top = this.pos.y - this.height / 2;
        this.bottom = this.pos.y + this.height / 2;
      };
      this.updateProps();
    }

    //init origin
    if (this.origin == 'center') this.origin = this.center;

    this.clear = iio.api.clear;
    this._shrink = iio.anim.shrink;
    this._fade = iio.anim.fade;
    this._update = iio.api.update_physical;
    this.draw = iio.draw.obj;
    this.finish_draw = iio.draw.finish_obj;
    this.createGradient = iio.api.createGradient;
  }

  //SHAPES
  //LINE
  iio.line = {
    init: function(o) {
      o.center.x = (o.pos.x + o.endPos.x) / 2;
      o.center.y = (o.pos.y + o.endPos.y) / 2;
      o.width = iio.v.dist(o.pos, o.endPos);
      o.height = o.lineWidth;
      o.contains = iio.line.contains;
      o.draw_type = iio.line.draw;
      o.updateProps = iio.line.updateProps;
    },
    draw: function(ctx) {
      if (this.color.indexOf && this.color.indexOf('gradient') > -1)
        this.color = this.createGradient(ctx, this.color);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      if (this.origin)
        ctx.translate(-this.origin.x, -this.origin.y);
      else ctx.translate(-this.pos.x, -this.pos.y);
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      if (this.bezier)
        ctx.bezierCurveTo(this.bezier[0], this.bezier[1], this.bezier[2], this.bezier[3], this.endPos.x, this.endPos.y);
      else ctx.lineTo(this.endPos.x, this.endPos.y);
      ctx.stroke();
    },
    updateProps: function(v) {
      this.endPos.x += v.x;
      this.endPos.y += v.y;
      this.center.x += v.x;
      this.center.y += v.y;
    },
    contains: function(v, y) {
      if (typeof(y) != 'undefined') v = {
        x: v,
        y: y
      }
      if (iio.is.between(v.x, this.pos.x, this.endPos.x) && iio.is.between(v.y, this.pos.y, this.endPos.y)) {
        var a = (this.endPos.y - this.pos.y) / (this.endPos.x - this.pos.x);
        if (!isFinite(a)) return true;
        var y = a * (this.endPos.x - this.pos.x) + this.pos.y;
        if (y == v.y) return true;
      }
      return false;
    }
  }

  //RECT
  iio.rect = {
    init: function(o) {
      o.draw_type = iio.rect.draw;
      o.getTrueVertices = iio.rect.getTrueVertices;
      o.contains = iio.rect.contains;
    },
    draw: function(ctx) {
      iio.draw.prep_shape(ctx, this);
      ctx.translate(-this.width / 2, -this.height / 2);
      if (this.bezier) {
        iio.draw.poly(ctx, this.getTrueVertices(), this.bezier);
        iio.draw.finish_path_shape(ctx, this);
      } else if (this.type==iio.X) {
        iio.draw.prep_x(ctx, this);
        iio.draw.line(ctx, 0, 0, this.width, this.height);
        iio.draw.line(ctx, this.width, 0, 0, this.height);
        ctx.restore();
      } else{
        iio.draw.rect(ctx, this.width, this.height, {
          c: this.color,
          o: this.outline
        }, {
          img: this.img,
          anims: this.anims,
          animKey: this.animKey,
          animFrame: this.animFrame,
          mov: this.mov,
          round: this.round
        });
      }

    },
    contains: function(v, y) {
      if (this.rot) return iio.poly.contains(v, y);
      y = v.y || y;
      v = v.x || v;
      v -= this.pos.x;
      y -= this.pos.y;
      if (v > -this.width / 2 && v < this.width / 2 && y > -this.height / 2 && y < this.height / 2)
        return true;
      return false;
    },
    getTrueVertices: function() {
      this.vs = [{
        x: this.left,
        y: this.top
      }, {
        x: this.right,
        y: this.top
      }, {
        x: this.right,
        y: this.bottom
      }, {
        x: this.left,
        y: this.bottom
      }];
      return this.vs.map(function(_v) {
        var v = iio.point.rotate(_v.x - this.pos.x, _v.y - this.pos.y, this.rot);
        v.x += this.pos.x;
        v.y += this.pos.y;
        return v;
      }, this);
    }
  }

  //CIRC
  iio.circ = {
    init: function(o) {
      o.type = iio.CIRC;
      o.contains = iio.circ.contains;
      o.draw_type = iio.circ.draw;
    },
    draw: function(ctx) {
      iio.draw.prep_shape(ctx, this);
      ctx.beginPath();
      if (this.width != this.height) {
        ctx.moveTo(0, -this.height / 2);
        if (this.bezier) {
          ctx.bezierCurveTo((this.bezier[0] || this.width / 2), (this.bezier[1] || -this.height / 2), (this.bezier[2] || this.width / 2), (this.bezier[3] || this.height / 2), 0, this.height / 2);
          ctx.bezierCurveTo((this.bezier[4] || -this.width / 2), (this.bezier[5] || this.height / 2), (this.bezier[6] || -this.width / 2), (this.bezier[7] || -this.height / 2), 0, -this.height / 2);
        } else {
          ctx.bezierCurveTo(this.width / 2, -this.height / 2, this.width / 2, this.height / 2, 0, this.height / 2);
          ctx.bezierCurveTo(-this.width / 2, this.height / 2, -this.width / 2, -this.height / 2, 0, -this.height / 2);
        }
      } else ctx.arc(0, 0, this.width / 2, 0, 2 * Math.PI, false);
      if (this.width != this.height) ctx.closePath();
      iio.draw.finish_path_shape(ctx, this);
      if (this.type==iio.X) {
        ctx.rotate(Math.PI / 4)
        iio.prep_x(ctx, this);
        ctx.translate(0, -o.height / 2);
        iio.draw.line(ctx, 0, 0, 0, o.height);
        ctx.translate(0, o.height / 2);
        iio.draw.line(ctx, o.width / 2, 0, -o.width / 2, 0);
        ctx.restore();
      }
    },
    contains: function(v, y) {
      if (typeof(y) != 'undefined') v = {
        x: v,
        y: y
      }
      if (this.width == this.height && iio.v.dist(v, this.pos) < this.width / 2)
        return true;
      else {
        if (this.rot) {
          v.x -= this.pos.x;
          v.y -= this.pos.y;
          v = iio.rotatePoint(v.x, v.y, -this.rot);
          v.x += this.pos.x;
          v.y += this.pos.y;
        }
        if (Math.pow(v.x - this.pos.x, 2) / Math.pow(this.width / 2, 2) + Math.pow(v.y - this.pos.y, 2) / Math.pow(this.height / 2, 2) <= 1)
          return true;
      }
      return false;
    }
  }

  //POLY
  iio.poly = {
    init: function(o) {
      o.type = iio.POLY;
      o.getTrueVertices = iio.poly.getTrueVertices;
      o.draw_type = iio.poly.draw;
      o.contains = iio.poly.contains;
      o.updateProps = iio.updatePolyProps;
    },
    draw: function(ctx) {
      iio.draw.prep_shape(ctx, this);
      iio.draw.poly(ctx, this.vs, this.bezier, this.open);
      iio.draw.finish_path_shape(ctx, this);
    },
    updateProps: function() {
      this.center = this.pos;
      /*this.left=this.pos.x-this.width/2;
      this.right=this.pos.x+this.width/2;
      this.top=this.pos.y-this.height/2;
      this.bottom=this.pos.y+this.height/2;*/
    },
    contains: function(v, y) {
      y = (v.y || y);
      v = (v.x || v);
      var i = j = c = 0;
      var vs = this.vs;
      if (this.rot) vs = this.getTrueVertices();
      for (i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        if (((vs[i].y > y) != (vs[j].y > y)) &&
          (v < (vs[j].x - vs[i].x) * (y - vs[i].y) / (vs[j].y - vs[i].y) + vs[i].x))
          c = !c;
      }
      return c;
    },
    getTrueVertices: function() {
      return this.vs.map(function(_v) {
        var v = iio.point.rotate(_v.x - this.pos.x, _v.y - this.pos.y, this.rot);
        v.x += this.pos.x;
        v.y += this.pos.y;
        return v;
      }, this);
    }
  }

  //TEXT
  iio.text = {
    init: function(o) {
      o.size = o.width || 20;
      o.color = o.color || 'black';
      o.font = o.font || 'Arial';
      o.align = o.align || 'center';
      o.app.ctx.font = o.size + 'px ' + o.font;
      o.width = o.app.ctx.measureText(o.text).width;
      o.height = o.app.ctx.measureText('W').width;
      o.draw_type = iio.text.draw;
      o.contains = iio.text.contains;
      o.charWidth = iio.text.charWidth;
      o.getX = iio.text.getX;
      var tX = o.getX(o.text.length);
      o.cursor = o.add([tX, 10, tX, -o.size * .8], '2 ' + (o.color || o.outline), {
        index: o.text.length,
        shift: false
      });
      if (o.showCursor) {
        o.loop(2, function(o) {
          o.cursor.hidden = !o.cursor.hidden;
        })
      } else o.cursor.hidden = true;
      o.keyUp = iio.text.keyUp;
      o.keyDown = iio.text.keyDown;
    },
    draw: function(ctx) {
      ctx.font = this.size + 'px ' + this.font;
      ctx.textAlign = this.align;
      iio.draw.prep_shape(ctx, this);
      if (this.color) ctx.fillText(this.text, 0, 0);
      if (this.outline) ctx.strokeText(this.text, 0, 0);
      if (this.showCursor)
        this.cursor.pos.x = this.cursor.endPos.x = this.getX(this.cursor.index);
    },
    contains: function(x, y) {
      if (typeof(y) == 'undefined') {
        y = x.y;
        x = x.x
      }
      x -= this.pos.x;
      y -= this.pos.y;
      if ((typeof(this.align) == 'undefined' || this.align == 'left') && x > 0 && x < this.width && y < 0 && y > -this.height)
        return true;
      else if (this.align == 'center' && x > -this.width / 2 && x < this.width / 2 && y < 0 && y > -this.height)
        return true;
      else if ((this.align == 'right' || this.align == 'end') && x > -this.width && x < 0 && y < 0 && y > -this.height)
        return true;
      return false;
    },
    charWidth: function(i) {
      i = i || 0;
      this.app.ctx.font = this.size + 'px ' + this.font;
      return this.app.ctx.measureText(this.text.charAt(i)).width;
    },
    getX: function(i) {
      this.app.ctx.font = this.size + 'px ' + this.font;
      if (typeof(this.align) == 'undefined' || this.align == 'left')
        return this.app.ctx.measureText(this.text.substring(0, i)).width;
      if (this.align == 'right' || this.align == 'end')
        return -this.app.ctx.measureText(this.text.substring(0, this.text.length - i)).width;
      if (this.align == 'center') {
        var x = -Math.floor(this.app.ctx.measureText(this.text).width / 2);
        return x + this.app.ctx.measureText(this.text.substring(0, i)).width;
      }
    },
    keyUp: function(k) {
      if (k == 'shift')
        this.cursor.shift = false;
    },
    keyDown: function(key, cI, shift, fn) {
      if (!iio.is.number(cI)) {
        fn = cI;
        cI = this.cursor.index;
      }
      var str;
      var pre = this.text.substring(0, cI);
      var suf = this.text.substring(cI);
      if (typeof fn != 'undefined') {
        str = fn(key, shift, pre, suf);
        if (str != false) {
          this.text = pre + str + suf;
          this.cursor.index = cI + 1;
          if (this.showCursor) this.cursor.hidden = false;
          this.app.draw();
          return this.cursor.index;
        }
      }
      if (key.length > 1) {
        if (key == 'space') {
          this.text = pre + " " + suf;
          cI++;
        } else if (key == 'backspace' && cI > 0) {
          this.text = pre.substring(0, pre.length - 1) + suf;
          cI--;
        } else if (key == 'delete' && cI < this.text.length)
          this.text = pre + suf.substring(1);
        else if (key == 'left arrow' && cI > 0) cI--;
        else if (key == 'right arrow' && cI < this.text.length) cI++;
        else if (key == 'shift') this.cursor.shift = true;
        else if (key == 'semi-colon') {
          if (shift) this.text = pre + ':' + suf;
          else this.text = pre + ';' + suf;
          cI++;
        } else if (key == 'equal') {
          if (shift) this.text = pre + '+' + suf;
          else this.text = pre + '=' + suf;
          cI++;
        } else if (key == 'comma') {
          if (shift) this.text = pre + '<' + suf;
          else this.text = pre + ',' + suf;
          cI++;
        } else if (key == 'dash') {
          if (shift) this.text = pre + '_' + suf;
          else this.text = pre + '-' + suf;
          cI++;
        } else if (key == 'period') {
          if (shift) this.text = pre + '>' + suf;
          else this.text = pre + '.' + suf;
          cI++;
        } else if (key == 'forward slash') {
          if (shift) this.text = pre + '?' + suf;
          else this.text = pre + '/' + suf;
          cI++;
        } else if (key == 'grave accent') {
          if (shift) this.text = pre + '~' + suf;
          else this.text = pre + '`' + suf;
          cI++;
        } else if (key == 'open bracket') {
          if (shift) this.text = pre + '{' + suf;
          else this.text = pre + '[' + suf;
          cI++;
        } else if (key == 'back slash') {
          if (shift) this.text = pre + '|' + suf;
          else this.text = pre + "/" + suf;
          cI++;
        } else if (key == 'close bracket') {
          if (shift) this.text = pre + '}' + suf;
          else this.text = pre + ']' + suf;
          cI++;
        } else if (key == 'single quote') {
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
  }

  //GRID
  iio.grid = {
    init: function(o) {
      o.res = { x:o.width/o.C, y:o.height/o.R };
      o.cells = [];
      var x = -o.res.x * (o.C - 1) / 2;
      var y = -o.res.y * (o.R - 1) / 2;
      for (var c = 0; c < o.C; c++) {
        o.cells[c] = [];
        for (var r = 0; r < o.R; r++) {
          o.cells[c][r] = o.add({
            pos:{
              x:x,
              y:y
            },
            c: c,
            r: r,
            width: o.res.x,
            height: o.res.y
          });
          y += o.res.y;
        }
        y = -o.res.y * (o.R - 1) / 2;
        x += o.res.x;
      }
      o.clear = iio.grid.clear;
      o.draw_type = iio.grid.draw;
      o.cellCenter = iio.grid.cellCenter;
      o.cellAt = iio.grid.cellAt;
      o.foreachCell = iio.grid.foreachCell;
    },
    draw: function(ctx) {
      iio.draw.prep_shape(ctx, this);
      ctx.translate(-this.width / 2, -this.height / 2);
      iio.draw.rect(ctx, this.width, this.height, {
        c: this.color,
        o: this.outline
      }, {
        img: this.img,
        anims: this.anims,
        mov: this.mov,
        round: this.round
      });
      if (this.gridColor) {
        if (this.gridColor.indexOf && this.gridColor.indexOf('gradient') > -1)
          this.gridColor = this.createGradient(ctx, this.gridColor);
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = this.lineWidth;
        for (var c = 1; c < this.C; c++) iio.draw.line(ctx, c * this.res.x, 0, c * this.res.x, this.height);
        for (var r = 1; r < this.R; r++) iio.draw.line(ctx, 0, r * this.res.y, this.width, r * this.res.y);
      }
    },
    clear: function() {
      this.objs = [];
      iio.initGrid(this);
      this.app.draw();
    },
    cellCenter: function(c, r) {
      return {
        x: -this.width / 2 + c * this.res.x + this.res.x / 2,
        y: -this.height / 2 + r * this.res.y + this.res.y / 2
      }
    },
    cellAt: function(x, y) {
      if (x.x) return this.cells[Math.floor((x.x - this.left) / this.res.x)][Math.floor((x.y - this.top) / this.res.y)];
      else return this.cells[Math.floor((x - this.left) / this.res.x)][Math.floor((y - this.top) / this.res.y)];
    },
    foreachCell: function(fn, p) {
      for (var c = 0; c < this.C; c++)
        for (var r = 0; r < this.R; r++)
          if (fn(this.cells[c][r], p) === false)
            return [r, c];
    }
  }

  // Set up a hash for storing variables. Scope is limited to app.
  iio.scripts = iio.scripts || {};

  var runScripts = function() {
    var scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
    var iioScripts = scripts.filter(function(s) {
      return s.type === 'text/iioscript';
    });
    iioScripts.forEach(function(script) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", script.src, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status == 0)){
          iio.scripts[script.src] = eval(parser.parse(xhr.responseText));
          iio.start(iio.scripts[script.src]);
        }
      }
      xhr.send(null);
      /*iio.read(script.src, function(code){
        //iio.vars[script.src] = iio.vars[script.src] || {};
        //iio.start([iioParser,{c: code, vars: iio.vars[script.src]}]);
        //iio.scripts[script.src] = eval(iio.read(script.src, parser.parse));
      });*/
    });
  }

  // Listen for window load, both in decent browsers and in IE
  if (window.addEventListener)
    window.addEventListener('DOMContentLoaded', runScripts, false);
  else
    window.attachEvent('onload', runScripts);
})();
