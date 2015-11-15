/* Platformer
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Platformer = function( app, settings ){

  // set background color to black
  app.set({ color:'black' });

  // Sound does not work offline
  var soundOn = false;

  // disable sound in preview
  if (settings && settings.preview)
    soundOn = false;

  // physical constants
  var gravity = 0.1;
  var groundPos = app.center.y;

  // add level background image
  var background = app.add(new iio.Quad({
    pos: [0, groundPos-72 ],
    img: 'img/world1-1.png',
  }));

  // load sounds
  // add them to app to allow proper termination on app stop
  if (soundOn) { 
    var jumpSound = app.add(iio.loadSound('sounds/mario_jump.mp3'));
    var themeSong = app.add(iio.loadSound('sounds/mario_theme.mp3', function(){
      themeSong.play();
    }));
  }

  // create mario
  var mario;
  var w = 16; // sprite width
  var h = 32; // sprite height
  // load mario spritemap
  var map = new iio.SpriteMap('img/mariobros_cmp.png',function(){
    // width and height are common sprite properties
    var common = {
      width: w,
      height: h,
    }
    // create and add mario
    mario = app.add(new iio.Quad({
      pos: [150, groundPos],
      imageRounding: true, // prevent edge blurring
      walking: false,
      jumping: false,
      speed: 1,
      jumpSpeed: 3.5,
      vel: [0,0],
      // add animations from the sprite sheet
      anims:[
        map.sprite(common,{ name:'standing', origin: [w*6,0] }),
        map.sprite(common,{ name:'jumping', origin: [w*4,0] }),
        map.sprite(common,{ name:'ducking', origin: [w*5,0] }),
        map.sprite(common,{ name:'walking', origin: [0,0],   numFrames: 3 }),
        // change the origin y value for more colors
        map.sprite(common,{ name:'red_walking', origin: [0,h*2], numFrames: 3 }),
        map.sprite(common,{ name:'green_walking', origin: [0,h*6], numFrames: 3 }),
      ],
      // make mario stand
      stand: function(){
        this.set({
          walking: false,
          vel: [0.0],
        }).setSprite('standing');
      },
      // make mario jump
      jump: function(){
        if (soundOn)
          jumpSound.play({ gain: 0.5 });
        this.walking = false;
        this.jumping = true;
        this.vel.y = -this.jumpSpeed;
        this.setSprite('jumping');
      },
      // make mario duck
      duck: function(){
        this.set({
          walking: false,
          vel: [0.0],
        }).setSprite('ducking');
      },
      // make mario walk left
      walkLeft: function(){
        this.set({
          flip: 'x',
          walking: true,
          vel: [-this.speed,0],
        }).playAnim({ fps:6, name: 'walking' });
      },
      // make mario walk right
      walkRight: function(){
        this.set({
          flip: false,
          walking: true,
          vel: [this.speed,0],
        }).playAnim({ fps:6, name: 'walking' });
      },
      // update marios jump
      onUpdate: function(){
        if(this.jumping){

          // add gravity to y velocity
          this.vel.y += gravity;
          
          // stop jumping if mario has reached the ground 
          if (this.pos.y >= groundPos){
            this.jumping = false;
            this.vel.y = 0;
            this.pos.y = groundPos;
            // walk left if left input is down
            if (input.left)
              this.walkLeft();
            // walk right if right input is down
            else if (input.right)
              this.walkRight();
            // otherwise, stand
            else this.stand();
          }
        }
      }
    }),true);
    // set mario's initial sprite
    mario.setSprite('standing');
  });

  // input controller object
  var input = {
    left: false, // state of left input
    right: false,// state of right input
    up: false,   // state of up input
    down: false, // state of down input
    // update input states
    update: function(key, state){
      if( this.isUp(key) )
        this.up = state;
      else if ( this.isRight(key) )
        this.right = state;
      else if( this.isDown(key) )
        this.down = state;
      else if( this.isLeft(key) )
        this.left = state;
    },
    // return true if key maps to left input
    isLeft: function(key){
      return key == 'left arrow' || key == 'a'
    },
    // return true if key maps to right input
    isRight: function(key){
      return key == 'right arrow' || key == 'd'
    },
    // return true if key maps to up input
    isUp: function(key){
      return key == 'up arrow' || key == 'w'
    },
    // return true if key maps to down input
    isDown: function(key){
      return key == 'down arrow' || key == 's'
    }
  }
  
  // handle key down event
  app.onKeyDown = function( event, key ){
    // update input states
    input.update(key, true);

    // jump if not already jumping and up key is down
    if (!mario.jumping && input.isUp(key))
        mario.jump();

    // if not walking or jumping
    if (!mario.walking && !mario.jumping) {

      // walk right if right input is down
      if( input.isRight(key) ) 
        mario.walkRight();

      // walk left if left input is down
      else if( input.isLeft(key) )
        mario.walkLeft();

      // duck if down input is down
      else if( input.isDown(key) ) 
        mario.duck();
    }
  }

  // handle key up event
  app.onKeyUp = function( event, key ){
    // update input states
    input.update(key, false);

    // if right input is released and left input is down
    // walk left
    if( input.isRight(key) && input.left)
      mario.walkLeft();

    // if left input is released and right input is down
    // walk right
    else if( input.isLeft(key) && input.right)
      mario.walkRight();

    // duck if input down
    else if(input.down)
      mario.duck();

    // stand if not jumping or walking
    else if (!input.left && !input.right && !mario.jumping)
      mario.stand();
  }
}
