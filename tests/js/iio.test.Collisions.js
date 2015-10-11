iio.test.Collisions = {
  rectXrect : function(app, settings){
    var objWidth = 50;

    function reverseX(o){ o.vel.x*=-1 }
    function reverseY(o){ o.vel.y*=-1 }

    var common = {
      width: objWidth,
      lineWidth: 2,
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
      outline: 'red',
      vel: [ 1, .5 ],
      rVel: 0.05,
      pos: [
        app.width/3,
        app.center.y
      ]
    }));

    var square1 = app.add(new iio.Rectangle(common,{
      outline: 'blue',
      vel: [ -1, 1 ],
      rVel: -0.05,
      pos: [
        app.width*2/3,
        app.center.y
      ]
    }));

    app.collision( square0, square1, function(s0,s1){
      s0.vel.x*=-1;
      s1.vel.x*=-1;
      s0.rVel*=-1;
      s1.rVel*=-1;
    });
  },
  polyXpoly : function(app, settings){
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
        [-oWidth, -oWidth],
        [oWidth, -oWidth],
        [oWidth, oWidth],
        [-oWidth, oWidth],
      ],
    }));

    var square1 = app.add(new iio.Polygon(common,{
      color: 'blue',
      vel: [ -speed, -speed/2 ],
      rVel: -0.02,
      pos: [
        app.width*2/3,
        app.center.y + 4
      ],
      vs: [
        [-oWidth, -oWidth],
        [oWidth, -oWidth],
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
}