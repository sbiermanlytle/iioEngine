<?php 
    $homepath = '../';
    $title = 'Animation Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
AnimsDemo = function(io){

  //define path for the images
  var imgPath='demo-apps/platformer/img/';

  /* Space Guy */
  var spaceGuySrcs = [];
  //loop fills an array with images named 'walk-1' ... 'walk-11'
  for (var i=1; i&lt;12; i++)
      spaceGuySrcs[i-1]=imgPath+'character/walk/walk-'+i+'.png';

  //create a rectangle with the dimensions of the first anim image
  var spaceGuy = new iio.Rect(60, io.canvas.height-60);
  spaceGuy.createWithAnim(spaceGuySrcs, function(){
      //image onload code
      io.setAnimFPS(15,spaceGuy);
  });

  /* Unhappy Fly */
  //get the source images
  var flySrcs = [imgPath+'enemies/fly_normal.png'
                ,imgPath+'enemies/fly_fly.png'];

  //create a 69x32 rectangle and add an animation
  var fly = new iio.Rect(io.canvas.width-60, 60, 69, 32)
      .addAnim(flySrcs, function(){
          //image onload code
          io.setAnimFPS(3,fly);
      });

  /* Unhappy Slime ball thing */
  //get the source images
  var slimeSrcs = [imgPath+'enemies/slime_normal.png'
                  ,imgPath+'enemies/slime_walk.png'];

  //create the rectangle with the dimensions of the first image
  var slime = new iio.Rect(io.canvas.width-50
                        ,io.canvas.height-24)
      .createWithAnim(slimeSrcs, function(){
          //image onload code
          io.setAnimFPS(3,slime);
      });

}; iio.start(AnimsDemo, 'canvasId');</pre>
</body>
</html>