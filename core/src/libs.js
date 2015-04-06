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

iio.convert = {
  color: function(c){
    if(c.toLowerCase()=='white') return new iio.Color(255,255,255);
    if(c.toLowerCase()=='black') return new iio.Color();
    if(c.toLowerCase()=='red') return new iio.Color(255);
    if(c.toLowerCase()=='green') return new iio.Color(0,255);
    if(c.toLowerCase()=='blue') return new iio.Color(0,0,255);
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