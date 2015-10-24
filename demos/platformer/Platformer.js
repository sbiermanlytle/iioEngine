/* Platformer
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Platformer = function( app, settings ){

  app.set({ color:'black' });

  var mario;
  var w = 16;
  var h = 32;
  var map = new iio.SpriteMap('img/mariobros_cmp.png',{
    onload:function(){
      var common = {
        width: w,
        height: h,
      }
      mario = app.add(new iio.Quad({
        pixelRounding: true,
        pos: app.center,
        walking: false,
        anims:[
          map.sprite(common,{ name:'standing', origin: [w*6,0] }),
          map.sprite(common,{ name:'jumping',  origin: [w*4,0] }),
          map.sprite(common,{ name:'ducking',  origin: [w*5,0] }),
          map.sprite(common,{ name:'walking',  origin: [0,0],   numFrames: 3 }),
          map.sprite(common,{ name:'red',      origin: [0,h*2], numFrames: 3 }),
          map.sprite(common,{ name:'green',    origin: [0,h*6], numFrames: 3 }),
        ]
      }),true);

      mario.playAnim({ fps:6, name:'standing' })

    }
  });
  
  this.onKeyDown = function( event, key ){
    if (!mario.walking) {
      if( key == 'up arrow' || key == 'w' ) {
        mario.walking = false;
        mario.setSprite('jumping');
      }

      else if( key == 'right arrow' || key == 'd' ) {
        mario.flip = false;
        mario.walking = true;
        mario.playAnim({ fps:6, name: 'walking' });
      }

      else if( key == 'down arrow' || key == 's' ) {
        mario.walking = false;
        mario.setSprite('ducking');
      }

      else if( key == 'left arrow' || key == 'a' ) {
        mario.flip = 'x';
        mario.walking = true;
        mario.playAnim({ fps:6, name: 'walking' });
      }
    }
  }

  this.onKeyUp = function( event, key ){
    mario.walking = false;
    mario.setSprite('standing');
  }
}
