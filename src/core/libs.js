//UTIL LIBRARIES
iio.is = {
  fn: function(fn) {
    return typeof fn === 'function'
  },
  number: function(o) {
    if (typeof o === 'number') return true;
    //return (o - 0) == o && o.length > 0;
  },
  string: function(s) {
    return typeof s == 'string' || s instanceof String
  },
  filetype: function(file, extensions) {
    return extensions.some(function(ext) {
      return (file.indexOf('.' + ext) != -1)
    });
  },
  image: function(file) {
    return this.filetype(file, ['png', 'jpg', 'gif', 'tiff']);
  },
  sound: function(file) {
    return this.filetype(file, ['wav', 'mp3', 'aac', 'ogg']);
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

iio.point = {
  rotate: function(x, y, r) {
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
    function route_input(caller, e, handler){
      // orient click position to canvas 0,0
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
              obj[handler](obj, e, ep, c, obj.cellCenter(c.c, c.r));
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

iio.collision = {
  check: function(o1, o2) {
    if (!o1 || !o2) return false;
    if (o1 instanceof iio.Quad && o2 instanceof iio.Quad){
      return iio.collision.rectXrect(o1,o2)
    } else if ((o1 instanceof iio.Polygon && o2 instanceof iio.Polygon)
      || (o1 instanceof iio.Rectangle && o2 instanceof iio.Rectangle)){
      return iio.collision.polyXpoly(o1,o2)
    } else if (o1 instanceof iio.Ellipse && o2 instanceof iio.Ellipse){
      if ((!o1.vRadius||o1.radius === o1.vRadius) && (!o2.vRadius||o2.radius === o2.vRadius) )
        return iio.collision.circleXcircle(o1,o2)
      //else http://yehar.com/blog/?p=2926
    }
  },
  rectXrect: function(o1,o2){
    if (o1.left() < o2.right() && o1.right() > o2.left()
     && o1.top() < o2.bottom() && o1.bottom() > o2.top()) 
      return true;
    return false;
  },
  circleXcircle: function(o1,o2){
    if (o1.pos.distance(o2.pos) < o1.radius+o2.radius)
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
    // var a,b,j;
    // for(i = 0; i < v1.length; i++) {
    //    a = iio.Vec.add(v1[i], p1.pos);
    //    b = iio.Vec.add(v1[(i + 1) % v1.length], p1.pos);
    //    for(j = 0; j < v2.length; j++) {
    //       if(iio.lineXline(a, b,
    //                             iio.Vec.add(v2[j], p2.pos),
    //                             iio.Vec.add(v2[(j + 1) % v2.length], p2.pos))) {
    //          return true;
    //       }
    //    }
    // } 
    return false;
  },
}

iio.draw = {
  line: function( ctx, x1, y1, x2, y2 ){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
}