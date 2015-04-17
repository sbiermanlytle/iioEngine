<?php 
    $homepath = '../';
    $title = 'Kinematics Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
KinematicsDemo = function(io){

  //create the flying saucer
  //position: 60,60
  //size: 80x80
  io.addObj(new iio.Rect(60,60,80)
    .enableKinematics()
    .setTorque(.2)
    .addImage('UFO.png'));

  //create the crate
  //position: 60,150
  //size: 70x70
  var crate = io.addObj(new iio.Rect(60,150,70)
     .enableKinematics()
     .setVel(1,0)
     .addImage('crate.png'));

  //set frame rate to 60fps
  io.setFramerate(60, function(){
      //update code
      if (crate.pos.x > io.canvas.width-60)
        crate.setVel(-1,0);
      else if (crate.pos.x &lt; 60)
        crate.setVel(1,0);
  });
  
}; iio.start(KinematicsDemo, 'canvasId');</pre>
</body>
</html>