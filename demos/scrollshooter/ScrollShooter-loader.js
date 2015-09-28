ScrollShooter = function( app, s ){
  // For namespace of the new Object passed to here.
  // TODO there's got to be a better way to do this
  var user = this;

  var meteors = [];
  var stars = [];
  var lasers = [];
  var player;
  var imgPath = 'img/';

  var numSmallStars = 50;
  var numBigStars = 26;
  var numSmallMeteors = 20;
  var numBigMeteors = 10;

  if( s && s.preview ){
    numSmallMeteors /= 2;
    numBigStars /= 2;
    numSmallMeteors /= 2;
    numBigMeteors /= 2;
  } else app.set({ color:'black' });

  function bringToTop(o){ 
    o.pos.y = -100; 
    o.pos.x = iio.random( 0, app.width );
  }

  function createScrollObjects(num, arr, props){
    for ( var i=0; i<num; i++ )
      arr.push( app.add( new iio.Rectangle({
        z: props.z,
        img: props.img, 
        health: props.health,
        rotation: iio.random( props.rotation.min,
                    props.rotation.max ),
        pos: [
          iio.random( 0, app.width ),
          iio.random( -100, app.height )
        ],
        vel:[
          iio.random( props.vel.x.min,
                props.vel.x.max ),
          iio.random( props.vel.y.min,
                props.vel.y.max )
        ],
        rVel: iio.random( props.rVel.min,
                  props.rVel.max ),
        bounds: {
          bottom: {
            bound: app.height + 100,
            callback: bringToTop
          }
        }
      })));
  }

  var loader = new iio.Loader('assets');

  var assets = {
    starSmall: 'images/starSmall.png',
    starBig: 'images/starBig.png',
    meteorBig: 'images/meteorBig.png',
    meteorSmall: 'images/meteorSmall.png',
    laserSound: 'sounds/laser.wav',
    explode: 'sounds/explode.wav',
    player: 'images/player.png',
    playerLeft: 'images/playerleft.png',
    playerRight: 'images/playerRight.png',
    laser: 'images/laserRed.png',
    laserFlash: 'images/laserRedShot.png',
    theme: 'sounds/theme.mp3',
  }

  var main = function(assets) {
    assets.theme.play(0, {loop: true});

    createScrollObjects( numSmallStars, stars, {
      img: assets.starSmall,
      rotation: { min: 0, max: 0 },
      rVel: { min: 0, max: 0 },
      vel: {
        x: { min: 0, max: 0 },
        y: { min: 1, max: 2 }
      }
    });

    createScrollObjects( numBigStars, stars, {
      z: 10,
      img: assets.starBig,
      rotation: { min: 0, max: 0 },
      rVel: { min: 0, max: 0 },
      vel: {
        x: { min: 0, max: 0 },
        y: { min: 2, max: 3 }
      }
    });

    var meteorProps = {
      z: 25,
      rotation: { min: -7, max: 7 },
      rVel: { min: -.04, max: .04 },
      vel: {
        x: { min: -3, max: 3 },
        y: { min: 4, max: 6 }
      }
    }

    createScrollObjects( numBigMeteors, meteors, iio.merge({
      img: assets.meteorBig,
      health: 5
    }, meteorProps));

    createScrollObjects( numSmallMeteors, meteors, iio.merge({
      img: assets.meteorSmall,
      z: 25
    }, meteorProps));

    var laserSound = assets.laserSound;
    laserSound.set({gain: 0.125});
    var explode = assets.explode;
    explode.set({gain: 0.25});
    var laser = assets.laser;
    var laserFlash = assets.laserFlash;
    fireLaser = function(x,y,s){
      lasers.push(app.add(new iio.Rectangle({
        pos: [ x, y ],
        z: 50,
        img: laser,
        vel: [ 0, -s ],
        bounds: { top: -100 }
      })));
      laserSound.play();
    }

    var controller = { 
      LEFT: 0, 
      RIGHT: 0, 
      UP: 0, 
      DOWN: 0, 
      SPACE: 0 
    }
    updateController=function(k,bool){
      if( k == 'left arrow' || k == 'a' ) 
        controller.LEFT = bool; 
      else if( k == 'right arrow' || k == 'd' ) 
        controller.RIGHT = bool;
      else if( k == 'up arrow' || k == 'w' ) 
        controller.UP = bool;
      else if( k == 'down arrow' || k == 's' ) 
        controller.DOWN = bool;
      else if( k == 'space' || k == 'ctrl' ) 
        controller.SPACE = bool;
    }

    var player = assets.player;
    var playerLeft = assets.playerLeft;
    var playerRight = assets.playerRight;
    var playerObj = app.add(new iio.Rectangle({
      pos: [
        app.center.x,
        app.height-100
      ],
      z:100,
      vel: [0,0],
      img: player,
      xSpeed:8, 
      fSpeed:9, 
      bSpeed:5,
      laserCooldown:20,
      laserTimer:20,
      laserSpeed:20,
      onUpdate:function(){
        
        if( controller.RIGHT && this.right() < app.width ){
          this.vel.x = this.xSpeed;
          this.img = playerRight;
        } 
        else if( controller.LEFT && this.left() > 0 ){
          this.vel.x = -this.xSpeed;
          this.img = playerLeft;
        } 
        else { 
          this.vel.x = 0; 
          this.img = player;
        }

        if( controller.UP && this.top() > 0 )
          this.vel.y = -this.fSpeed;
        else if( controller.DOWN && this.bottom() < app.height ) 
          this.vel.y = this.bSpeed;
        else this.vel.y = 0;

        if( controller.SPACE && this.laserTimer == 20 ){
          fireLaser( this.pos.x - this.width/3,
            this.pos.y + 10, this.laserSpeed );
          fireLaser( this.pos.x + this.width/3,
            this.pos.y + 10, this.laserSpeed );
          this.laserTimer--;
        } 
        else if( this.laserTimer < 20 ){
          if( !controller.SPACE ) 
            this.laserTimer -= 2;
          else this.laserTimer--;
          if( this.laserTimer < 0 ) 
            this.laserTimer = this.laserCooldown;
        }
      }
    }));

    user.keyDown = function(e,k){ 
      updateController(k,true) 
    }
    user.keyUp = function(e,k){ 
      updateController(k,false) 
    }

    user.resize=function(){
      if(playerObj.right > app.width)
        playerObj.pos.x = app.width - playerObj.width/2
    }

    app.collision( lasers, meteors, function( laser, meteor ){
      if( typeof( meteor.health ) !== 'undefined' ){
        if( meteor.health > 0 ) meteor.health--;
        else {
          for ( var i=0; i<5; i++ )
            meteors.push( app.add( new iio.Rectangle({
              pos: [
                iio.random( meteor.pos.x-30, meteor.pos.x+30 ),
                iio.random( meteor.pos.y-30, meteor.pos.y+30 )
              ],
              img: assets.meteorSmall, 
              z: 25,
              vel: [
                iio.random( -1, 2 ),
                iio.random( 4, 6 )
              ],
              rVel: iio.random( -.2, .2 ),
              rot: iio.random( -7, 7 ),
              bounds: {
                bottom: {
                  bound: app.height + 100,
                  callback: bringToTop
                }
              }
            })));
          app.rmv(meteor);
        }
      } else app.rmv(meteor)

      app.add(new iio.Rectangle({
        z: 75,
        pos: [
          laser.pos.x,
          laser.pos.y-20
        ],
        img: assets.laserFlash,
        vel: meteor.vel,
        shrink: .2
      }));
      explode.play();

      app.rmv(laser);
    });

  }

  loader.load(assets, main);
}; 
