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
            if (obj.cellAt) {
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
  finish_path_shape: function(ctx, o) {
    if (o.color) ctx.fill();
    if (o.img) ctx.drawImage(o.img, -o.width / 2, -o.height / 2, o.width, o.height);
    if (o.outline) ctx.stroke();
    if (o.clip) ctx.clip();
  },
  prep_x: function(ctx, o) {
    ctx.save();
    if (o.color.indexOf && o.color.indexOf('gradient') > -1)
      o.color = o.createGradient(ctx, o.color);
    ctx.strokeStyle = o.color||o.outline;
    ctx.lineWidth = o.lineWidth;
  }
}

iio.api = {
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
  createGradient: function(ctx, g) {
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
}