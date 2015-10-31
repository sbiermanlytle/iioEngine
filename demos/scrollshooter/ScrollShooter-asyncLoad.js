ScrollShooter = function( app, s ){

   //  SETTINGS
  //////////////////////////////////////////////////

  // Sound do now work with a local connection
  var soundOn = false;

  var meteors = [];
  var stars = [];
  var lasers = [];
  var player;
  var imgPath = 'assets/images/';

  var numSmallStars = 50;
  var numBigStars = 26;
  var numSmallMeteors = 20;
  var numBigMeteors = 10;

   //  APP PREVIEW
  //////////////////////////////////////////////////

  if( s && s.preview ){
    soundOn = false;
    numSmallMeteors /= 2;
    numBigStars /= 2;
    numSmallMeteors /= 2;
    numBigMeteors /= 2;
  } else app.set({ color:'black' });

   //  UTILITY FUNCTIONS
  //////////////////////////////////////////////////

  // move an object a random position above
  // the top of the viewport
  function bringToTop(o){ 
    o.pos.y = -100; 
    o.pos.x = iio.random( 0, app.width );
  }

  // create scrolling objects with the given 
  // properties and fill the given array
  function createScrollObjects(num, arr, props){
    for ( var i=0; i<num; i++ )
      arr.push( app.add( new iio.Quad({
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

   //  INITIALIZATION
  //////////////////////////////////////////////////

  // create small stars
  var starSmallImg = iio.load( imgPath+'starSmall.png', function(){
    createScrollObjects( numSmallStars, stars, {
      img: starSmallImg,
      rotation: { min: 0, max: 0 },
      rVel: { min: 0, max: 0 },
      vel: {
        x: { min: 0, max: 0 },
        y: { min: 1, max: 2 }
      }
    });
  });

  // create big stars
  var starBigImg = iio.load( imgPath+'starBig.png', function(){
    createScrollObjects( numBigStars, stars, {
      z: 10,
      img: starBigImg,
      rotation: { min: 0, max: 0 },
      rVel: { min: 0, max: 0 },
      vel: {
        x: { min: 0, max: 0 },
        y: { min: 2, max: 3 }
      }
    });
  });

  // common properties for meteors
  var meteorProps = {
    z: 25,
    rotation: { min: -7, max: 7 },
    rVel: { min: -.04, max: .04 },
    vel: {
      x: { min: -3, max: 3 },
      y: { min: 4, max: 6 }
    }
  }

  // create big meteors
  var meteorBigImg = iio.load(imgPath+'meteorBig.png',function(){
    createScrollObjects( numBigMeteors, meteors, iio.merge({
      img: meteorBigImg,
      health: 5
    }, meteorProps));
  });
  
  // create big meteors
  var meteorSmallImg = iio.load(imgPath+'meteorSmall.png',function(){
    createScrollObjects( numSmallMeteors, meteors, iio.merge({
      img: meteorSmallImg,
      z: 25
    }, meteorProps));
  });

  // create player object
  var leftImg = iio.load( imgPath+'playerLeft.png' );
  var rightImg = iio.load( imgPath+'playerRight.png' );
  var playerImg = iio.load( imgPath+'player.png', function(){
    player = app.add(new iio.Quad({
      pos: [
        app.center.x,
        app.height-100
      ],
      z:100,
      vel: [0,0],
      img: imgPath+'player.png',
      xSpeed:8, // horizontal speed
      fSpeed:9, // forward speed
      bSpeed:5, // backward speed
      laserCooldown:20,
      laserTimer:20,
      laserSpeed:20,
      // input controller
      onUpdate:function(){
        
        // handle right and left movement
        // update velocity and player image
        if( controller.RIGHT && player.right() < app.width ){
          this.vel.x = this.xSpeed;
          this.img = rightImg;
        } 
        else if( controller.LEFT && player.left() > 0 ){
          this.vel.x = -this.xSpeed;
          this.img = leftImg;
        } 
        else { 
          this.vel.x = 0; 
          this.img = playerImg;
        }

        // handle up and down movement
        // update velocity
        if( controller.UP && player.top() > 0 )
          this.vel.y = -this.fSpeed;
        else if( controller.DOWN && player.bottom() < app.height ) 
          this.vel.y = this.bSpeed;
        else this.vel.y = 0;

        // handle fire lasor key
        if( controller.SPACE && this.laserTimer == 20 ){
          fireLaser( player.pos.x - player.width/3,
            player.pos.y + 10, this.laserSpeed );
          fireLaser( player.pos.x + player.width/3,
            player.pos.y + 10, this.laserSpeed );
          this.laserTimer--;
        } 
        // update laser cooldown timer
        else if( this.laserTimer < 20 ){
          if( !controller.SPACE ) 
            this.laserTimer -= 2;
          else this.laserTimer--;
          if( this.laserTimer < 0 ) 
            this.laserTimer = this.laserCooldown;
        }
      }
    }));
  });

  // laser
  if (soundOn)
    var laserSound = iio.loadSound('sounds/laser.wav');
  var laserFlashImg = iio.load( imgPath+'laserRedShot.png' );
  var laserImg = iio.load( imgPath+'laserRed.png' );
  // fire laser function
  fireLaser = function(x,y,s){
    lasers.push( app.add(new iio.Quad({
      pos: [ x, y ],
      z: 50,
      img: laserImg,
      vel: [ 0, -s ],
      bounds: { top: -100 }
    })));

    if (soundOn) laserSound.play();
  }

   //  INPUT HANDLING
  //////////////////////////////////////////////////

  // player input mapping
  var controller = { 
    LEFT: 0, 
    RIGHT: 0, 
    UP: 0, 
    DOWN: 0, 
    SPACE: 0 
  }

  // update the player input map with the given values
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

  app.onKeyDown = function(e,k){ 
    updateController(k,true) 
  }
  app.onKeyUp = function(e,k){ 
    updateController(k,false) 
  }

  app.onResize = function(){
    if(player.right > app.width)
      player.pos.x = app.width - player.width/2
  }

   //  COLLISION HANDLING
  //////////////////////////////////////////////////

  // define collision callback for lasers vs meteors
  app.collision( lasers, meteors, function( lasor, meteor ){
    if( typeof( meteor.health ) !== 'undefined' ){
      // lower meteor health
      if( meteor.health > 0 ) meteor.health--;
      else {
        // blow up meteor
        // create random debris particles
        for ( var i=0; i<5; i++ )
          meteors.push( app.add( new iio.Quad({
            pos: [
              iio.random( meteor.pos.x-30, meteor.pos.x+30 ),
              iio.random( meteor.pos.y-30, meteor.pos.y+30 )
            ],
            img: meteorSmallImg, 
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

    // add laser flash
    app.add(new iio.Quad({
      z: 75,
      pos: [
        lasor.pos.x,
        lasor.pos.y-20
      ],
      img: laserFlashImg,
      vel: meteor.vel,
      shrink: .2
    }));
    app.rmv(lasor);
  });

}; 
