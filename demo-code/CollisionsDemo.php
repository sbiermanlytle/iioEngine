<?php 
    $homepath = '../';
    $title = 'Collisions Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
function CollisionsDemo(io) {

  //define an image path
  var imgPath = 'png/';
 
  //load meteor image
  var meteorImg = new Image();
  meteorImg.src = imgPath+'meteorSmall.png';

  //load lasor image
  var lasorImg = new Image();
  lasorImg.src = imgPath+'laserRed.png';

  //load lasor flash
  var lasorFlashImg = new Image();
  lasorFlashImg.src = imgPath+'laserRedShot.png';

  //add groups
  io.addGroup('lasors');
  io.addGroup('meteors');

  //add collision detection
  io.setCollisionCallback('lasors', 'meteors',
      function(lasor, meteor){
        io.addToGroup('lasor flashes'
          ,new iio.Rect((lasor.pos.x+meteor.pos.x)/2
                     ,(lasor.pos.y+meteor.pos.y)/2),10)
          .createWithImage(imgPath+'laserRedShot.png')
          .enableKinematics()
          .shrink(.1);
     
    //remove the colliding objects
    io.rmvFromGroup(lasor, 'lasors');
    io.rmvFromGroup(meteor, 'meteors');
  });

  //create a meteor
  function createMeteor(){
    io.addToGroup('meteors',
       new iio.Rect(iio.getRandomInt(30,io.canvas.width-30)
                 ,iio.getRandomInt(-800,-50)))
       .enableKinematics()
       .setBound('bottom', io.canvas.height+100)
       .createWithImage(meteorImg)
       .setVel(iio.getRandomInt(-1,1)
              ,iio.getRandomInt(1,4))
       .setTorque(iio.getRandomNum(-.1,.1));
  }

  //create lasor
  function createLasor(){
        io.addToGroup('lasors',
        new iio.Rect(iio.getRandomInt(30,io.canvas.width-30)
                  ,io.canvas.height+60)
       .enableKinematics()
       .setBound('top', -100)
       .createWithImage(lasorImg)
       .setVel(0,-8));
  }
 
  //set 60fps framerate and define update function
  io.setFramerate(60, function(){
    if (Math.random() &lt; .08)
       createMeteor();
    else if (Math.random() &lt; .06)
       createLasor();
  });

}; iio.start(CollisionsDemo, 'canvasId');</pre>
</body>
</html>