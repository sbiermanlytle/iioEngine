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

    var o0 = app.add(new iio.Ellipse(common,{
      color: 'red',
      vel: [ speed, speed/2 ],
      pos: [
        app.width/3,
        app.center.y
      ],
    }));

    var o1 = app.add(new iio.Ellipse(common,{
      color: 'iioblue',
      vel: [ -speed, -speed/2 ],
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
    }));

    app.collision( o0, o1, function(s0,s1){
      var temp = o0.vel;
      o0.vel = o1.vel;
      o1.vel = temp;
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

    var square0 = app.add(new iio.Polygon(common,{
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

    var square1 = app.add(new iio.Polygon(common,{
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

    app.collision( square0, square1, function(s0,s1){
      var temp = square0.vel;
      square0.vel = square1.vel;
      square1.vel = temp;
      reverse(s0,'rVel');
      reverse(s1,'rVel');
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
      var temp = square0.vel;
      square0.vel = square1.vel;
      square1.vel = temp;
      reverse(s0,'rVel');
      reverse(s1,'rVel');
    });
  },
}