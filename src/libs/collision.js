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
