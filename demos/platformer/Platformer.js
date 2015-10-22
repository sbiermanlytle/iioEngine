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
        numFrames: 3,
      }
      mario = app.add(new iio.Quad({
        pos: app.center,
        anims:[
          map.sprite(common,{ name:'normal', origin: [0,0] }),
          map.sprite(common,{ name:'red', origin: [0,48] }),
          map.sprite(common,{ name:'green', origin: [0,192] }),
        ]
      }),true);

      animLoop = mario.playAnim({ fps:6, name:'normal' })

    }
  });
  
  var animLoop;
  this.keyDown = function( event, key ){
    if( key == 'up arrow' || key == 'w' )
      ;//direction = UP;

    else if( key == 'right arrow' || key == 'd' ) 
      mario.flip = false;

    else if( key == 'down arrow' || key == 's' ) 
      ;//direction = DOWN;

    else if( key == 'left arrow' || key == 'a' ) 
      mario.flip = 'x';
  }

  this.keyUp = function( event, key ){
    iio.cancelLoop(animLoop);
  }
}
