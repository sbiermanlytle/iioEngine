iio.test.Collisions = {
  quadXquad : function(app, settings){
    var oWidth = 15;
    var speed = .8;

    function reverse(o,p){ o[p]*=-1 }
    function reverseX(o){
      reverse(o.vel,'x')
    }
    function reverseY(o){ 
      reverse(o.vel,'y');
    }

    var common = {
      width: oWidth*2,
      bounds: {
        left: {
          bound: 0,
          callback: reverseX
        },
        right: {
          bound: app.width,
          callback: reverseX
        },
      }
    }

    var square0 = app.add(new iio.Quad(common,{
      color: 'red',
      vel: [ speed, 0 ],
      pos: [
        app.width/3,
        app.center.y
      ],
    }));

    var square1 = app.add(new iio.Quad(common,{
      color: 'iioblue',
      vel: [ -speed, 0 ],
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
    }));

    app.collision( square0, square1, function(s0,s1){
      var temp = square0.vel;
      square0.vel = square1.vel;
      square1.vel = temp;
      reverse(s0,'rVel');
      reverse(s1,'rVel');
    });
  },
  circleXcircle : function(app, settings){
    var oWidth = 20;
    var speed = .8;

    function reverse(o,p){ o[p]*=-1 }
    function reverseX(o){
      reverse(o.vel,'x')
    }
    function reverseY(o){ 
      reverse(o.vel,'y');
    }

    var common = {
      radius: oWidth,
      bounds: {
        left: {
          bound: 0,
          callback: reverseX
        },
        right: {
          bound: app.width,
          callback: reverseX
        },
        top: {
          bound: 0,
          callback: reverseY
        },
        bottom: {
          bound: app.height,
          callback: reverseY
        },
      }
    }

    var circle0 = app.add(new iio.Ellipse(common,{
      color: 'red',
      vel: [ speed, speed/2 ],
      pos: [
        app.width/3,
        app.center.y
      ],
    }));

    var circle1 = app.add(new iio.Ellipse(common,{
      color: 'iioblue',
      vel: [ -speed, -speed/2 ],
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
    }));

    app.collision( circle0, circle1, function(c0,c1){
      var temp = c0.vel;
      c0.vel = c1.vel;
      c1.vel = temp;
    });
  },
  polyXpoly : function(app, settings){
    var oWidth = 20;
    var speed = .8;

    function reverse(o,p){ o[p]*=-1 }
    function reverseX(o){
      reverse(o.vel,'x');
      reverse(o,'rVel');
    }
    function reverseY(o){ 
      reverse(o.vel,'y');
      reverse(o,'rVel');
    }

    var common = {
      bounds: {
        left: {
          bound: 0,
          callback: reverseX
        },
        right: {
          bound: app.width,
          callback: reverseX
        },
        top: {
          bound: 0,
          callback: reverseY
        },
        bottom: {
          bound: app.height,
          callback: reverseY
        },
      }
    }

    var triangle0 = app.add(new iio.Polygon(common,{
      color: 'red',
      vel: [ speed, speed/2 ],
      rVel: 0.02,
      pos: [
        app.width/3,
        app.center.y
      ],
      vs: [
        [0, -oWidth],
        [oWidth, oWidth],
        [-oWidth, oWidth],
      ],
    }));

    var triangle1 = app.add(new iio.Polygon(common,{
      color: 'iioblue',
      vel: [ -speed, -speed/2 ],
      rVel: -0.02,
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
      vs: [
        [0, -oWidth],
        [oWidth, oWidth],
        [-oWidth, oWidth],
      ],
    }));

    app.collision( triangle0, triangle1, function(t0,t1){
      var temp = t0.vel;
      t0.vel = t1.vel;
      t1.vel = temp;
      reverse(t0,'rVel');
      reverse(t1,'rVel');
    });
  },
  rectXrect : function(app, settings){
    var oWidth = 15;
    var speed = .8;

    function reverse(o,p){ o[p]*=-1 }
    function reverseX(o){
      reverse(o.vel,'x')
    }
    function reverseY(o){ 
      reverse(o.vel,'y');
    }

    var common = {
      width: oWidth*2,
      bounds: {
        left: {
          bound: 0,
          callback: reverseX
        },
        right: {
          bound: app.width,
          callback: reverseX
        },
        top: {
          bound: 0,
          callback: reverseY
        },
        bottom: {
          bound: app.height,
          callback: reverseY
        },
      }
    }

    var square0 = app.add(new iio.Rectangle(common,{
      color: 'red',
      vel: [ speed, speed/2 ],
      rVel: 0.02,
      pos: [
        app.width/3,
        app.center.y
      ],
    }));

    var square1 = app.add(new iio.Rectangle(common,{
      color: 'iioblue',
      vel: [ -speed, -speed/2 ],
      rVel: -0.02,
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
    }));

    app.collision( square0, square1, function(s0,s1){
      var temp = s0.vel;
      s0.vel = s1.vel;
      s1.vel = temp;
      reverse(s0,'rVel');
      reverse(s1,'rVel');
    });
  },
  gridXgrid : function(app, settings){
    var oWidth = 20;
    var speed = .8;

    function reverse(o,p){ o[p]*=-1 }
    function reverseX(o){
      reverse(o.vel,'x');
      reverse(o,'rVel');
    }
    function reverseY(o){ 
      reverse(o.vel,'y');
      reverse(o,'rVel');
    }

    var common = {
      width: oWidth*2,
      R: 5,
      C: 5,
      bounds: {
        left: {
          bound: 0,
          callback: reverseX
        },
        right: {
          bound: app.width,
          callback: reverseX
        },
        top: {
          bound: 0,
          callback: reverseY
        },
        bottom: {
          bound: app.height,
          callback: reverseY
        },
      }
    }

    var grid0 = app.add(new iio.Grid(common,{
      color: 'red',
      vel: [ speed, speed/2 ],
      rVel: 0.02,
      pos: [
        app.width/3,
        app.center.y
      ],
    }));

    var grid1 = app.add(new iio.Grid(common,{
      color: 'iioblue',
      vel: [ -speed, -speed/2 ],
      rVel: -0.02,
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
    }));

    app.collision( grid0, grid1, function(g0,g1){
      var temp = g0.vel;
      g0.vel = g1.vel;
      g1.vel = temp;
      reverse(g0,'rVel');
      reverse(g1,'rVel');
    });
  },
  textXtext : function(app, settings){
    var speed = .8;

    function reverse(o,p){ o[p]*=-1 }
    function reverseX(o){
      reverse(o.vel,'x');
      reverse(o,'rVel');
    }
    function reverseY(o){
      reverse(o.vel,'y');
      reverse(o,'rVel');
    }

    var common = {
      text: 'TEXT',
      size: 20,
      bounds: {
        left: {
          bound: 0,
          callback: reverseX
        },
        right: {
          bound: app.width,
          callback: reverseX
        },
        top: {
          bound: 0,
          callback: reverseY
        },
        bottom: {
          bound: app.height,
          callback: reverseY
        },
      }
    }

    var text0 = app.add(new iio.Text(common,{
      color: 'red',
      vel: [ speed, speed/2 ],
      rVel: 0.02,
      pos: [
        app.width/3,
        app.center.y
      ],
    }));

    var text1 = app.add(new iio.Text(common,{
      color: 'iioblue',
      vel: [ -speed, -speed/2 ],
      rVel: -0.02,
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
    }));

    app.collision( text0, text1, function(t0,t1){
      var temp = t0.vel;
      t0.vel = t1.vel;
      t1.vel = temp;
      reverse(t0,'rVel');
      reverse(t1,'rVel');
    });
  },
}