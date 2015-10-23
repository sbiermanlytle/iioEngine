iio.test.Rectangle = {
  constructor_default : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60
    }));
  },
  rotation : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60,
      rotation: Math.PI/4
    }));
  },
  origin : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      origin: [ 8, 8 ],
      color: settings.color.clone(),
      width: 20,
      height: 30,
      rVel: .02
    }));
  },
  vel_bounds : function( app, settings ){

    var speed = 0.6;

    function reverse(o){ o.vel.x *= -1 }

    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60,
      vel: [ speed,0 ],
      bounds: {
        right: {
          bound: app.width,
          callback: reverse
        },
        left: {
          bound: 0,
          callback: reverse
        }
      }
    }));
  },
  acc_bounds : function( app, settings ){

    var speed = 0.5;

    var Rectangle = app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60,
      vel: [ speed, 0 ],
      acc: [ .01, 0 ],
      bounds: {
        right: {
          bound: app.width,
          callback: function(o){
            o.vel.x = -speed*2
          }
        }
      }
    }));
  },
  /*vels : function( app, settings ){

    var speed = 0.5;

    var checkBound = function(o,v){
      if(o.vs[v].x > app.width/2 || o.vs[v].x < -app.width/2)
        o.vels[v].x *= -1;
    }

    app.add(new iio.Rectangle({
      pos: app.center,
      color: settings.color.clone(),
      width: 10,
      vs:[
        [ 0, -60 ],
        [ 0, 60 ]
      ],
      vels:[
        [ speed, 0 ],
        [ -speed, 0 ]
      ],
      onUpdate: function(){
        checkBound(this,0);
        checkBound(this,1);
      }
    }));
  },
  accs : function( app, settings ){

    var speed = 0.5;

    var checkBound = function(o,v){
      if(o.vs[v].x > app.width/2)
        o.vels[v].x = -1;
       else if (o.vs[v].x < -app.width/2)
        o.vels[v].x = 1;
    }

    app.add(new iio.Rectangle({
      pos: app.center,
      color: settings.color.clone(),
      width: 10,
      vs:[
        [ 0, 60 ],
        [ 0, -60 ]
      ],
      vels:[
        [ speed, 0 ],
        [ -speed, 0 ]
      ],
      accs:[
        [ .01, 0 ],
        [ -.01, 0 ]
      ],
      onUpdate: function(){
        checkBound(this,0);
        checkBound(this,1);
      }
    }));
  },*/
  rVel_bounds : function( app, settings ){

    function reverse(o){ o.rVel *= -1 }

    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60,
      rVel: .02,
      bounds: {
        rightRotation: {
          bound: Math.PI/2, 
          callback: reverse
        },
        leftRotation: {
          bound: 0,
          callback: reverse
        }
      }
    }));
  },
  /*rVel_bounds_no_pos : function( app, settings ){

    function reverse(o){ o.rVel *= -1 }

    app.add(new iio.Rectangle({
      color: settings.color.clone(),
      width: 30,
      rotation: Math.PI/2,
      rVel: -.02,
      origin: app.center,
      vs:[
        [ 20, 20 ],
        [ app.width-20, app.height-20 ]
      ],
      bounds: {
        rightRotation: [ Math.PI/2, reverse ],
        leftRotation: [ 0, reverse ]
      }
    }));
  },*/
  rAcc_bounds : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60,
      rAcc: .0015,
      bounds: {
        rightRotation: {
          bound: Math.PI/2,
          callback: function(o){
            o.rAcc *= -1; 
            o.rVel = -.01;
          }
        },
        leftRotation: {
          bound: -Math.PI/2,
          callback: function(o){
            o.rAcc *= -1; 
            o.rVel = .01;
          }
        }
      }
    }));
  },
  hidden : function( app, settings ){

    app.loop(1);

    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color.clone(),
      width: 30,
      height: 60,
      hidden: false,
      onUpdate: function(){
        this.hidden = !this.hidden;
      }
    }));
  },
  alpha : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color,
      width: 30,
      height: 60,
      fade: {
        speed: .03,
        lowerBound: .2,
        callback: function(o){
          o.fade.speed *= -1;
        }
      }
    }));
  },
  color : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color.clone(),
      width: 30,
      height: 60,
      cycle: 0,
      onUpdate: iio.test.color
    }));
  },
  outline : function( app, settings ){

    app.loop(15);

    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      width: 30,
      height: 60,
      outline: settings.color.clone(),
      lineWidth: 1,
      growing: true,
      onUpdate: iio.test.outline
    }));
  },
  shrink : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      color: settings.color.clone(),
      width: 30,
      height: 60,
      shrink: {
        speed: .03,
        upperBound: 30,
        lowerBound: 4,
        callback: function(o){
          if(o.width < o.shrink.lowerBound)
            o.shrink.speed = -.03;
          else o.shrink.speed = .03;
        }
      }
    }));
  },
  dash : function ( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center.clone(),
      width: 30,
      height: 60,
      outline: settings.color.clone(),
      lineWidth: 10,
      dash: [ 5, 5 ]
    }));
  },
  dash_rounded : function ( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center,
      width: 30,
      height: 60,
      outline: settings.color.clone(),
      lineWidth: 10,
      dash: [ .1, 15 ],
      dashOffset: 10,
      lineCap: 'round'
    }));
  },
  gradient : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center,
      width: 30,
      height: 60,
      color: new iio.Gradient({
        start: [ 0, 0 ],
        end: [ 0, 60 ],
        stops: [
          [ 0, settings.color.clone() ],
          [ 1, 'black' ]
        ]
      })
    }));
  },
  radial_gradient : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center,
      width: 30,
      height: 60,
      color: new iio.Gradient({
        start: [ 15, 30 ],
        startRadius: 1,
        end: [ 15, 30 ],
        endRadius: 40,
        stops: [
          [ 0, 'black' ],
          [ 0.4, settings.color.clone() ],
          [ 1, settings.color.clone() ]
        ]
      })
    }));
  },
  shadow : function( app, settings ){

    app.set({color:'white'})

    app.add(new iio.Rectangle({
      pos: app.center,
      width: 30,
      height: 60,
      outline: settings.color.clone(),
      lineWidth: 5,
      dash: 20,
      shadow: new iio.Color( 0,0,0,.5 ),
      shadowBlur: 5,
      shadowOffset: [ 4,4 ],
    }));
  },
  /*bezier : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center,
      color: settings.color.clone(),
      width: 10,
      bezier: [
        [ app.width,0 ],
        [ -app.width,0 ]
      ],
      vs:[
        [ -60, -60 ],
        [ 60, 60 ]
      ]
    }));
  },
  bezierVels : function( app, settings ){

    var speed = 1;

    var checkBound = function(o,v){
      if(o.bezier[v].x > app.width || o.bezier[v].x < -app.width)
        o.bezierVels[v].x *= -1;
    }

    app.add(new iio.Rectangle({
      pos: app.center,
      color: settings.color.clone(),
      width: 10,
      vs:[
        [ 0, -60 ],
        [ 0, 60 ]
      ],
      bezier: [
        [ app.width,0 ],
        [ -app.width,0 ]
      ],
      bezierVels: [
        [ -speed, 0 ],
        [ speed, 0]
      ],
      onUpdate: function(){
        checkBound(this,0);
        checkBound(this,1);
      }
    }));
  },
  bezierAccs : function( app, settings ){

    var speed = 2;

    var checkBound = function(o,v){
      if(o.bezier[v].x > app.width)
        o.bezierVels[v].x = -speed;
       else if (o.bezier[v].x < -app.width)
        o.bezierVels[v].x = speed;
    }

    app.add(new iio.Rectangle({
      pos: app.center,
      color: settings.color.clone(),
      width: 10,
      vs:[
        [ 0, -60 ],
        [ 0, 60 ]
      ],
      bezier: [
        [ -app.width,0 ],
        [ app.width,0 ]
      ],
      bezierVels: [
        [ speed, 0 ],
        [ -speed, 0]
      ],
      bezierAccs:[
        [ -.01, 0 ],
        [ .01, 0 ]
      ],
      onUpdate: function(){
        checkBound(this,0);
        checkBound(this,1);
      }
    }));
  },
  child : function( app, settings ){

    var props = {
      outline: settings.color.clone(),
      lineWidth: 5
    }

    app.add( new iio.Rectangle(props,{
      pos: app.center,
      origin: [ _radius/3, -_radius/3 ],
      radius: _radius,
      rVel: .02
    })).add( new iio.Rectangle(props,{
      radius: _radius/2
    }))
  },*/
  img : function( app, settings ){
    app.add(new iio.Rectangle({
      pos: app.center,
      img: 'img/bonus.png'
    }));
  },
  /*flip : function( app, settings ){

    app.loop(1);

    app.add(new iio.Rectangle({
      pos: app.center,
      radius: app.width/2.5,
      clip: true,
      img: 'http://iioengine.com/img/flip.png',
      flip: 'x',
      onUpdate: function(){
        if(this.flip == 'x')
          this.flip = false;
        else this.flip = 'x';
      }
    }));
  }*/
}