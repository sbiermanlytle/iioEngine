<?php 
    $homepath = '../';
    $title = 'Circles Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
CirclesDemo = function(io){

  //create a red circle at canvas center with radius 40
  io.addObj(new iio.Circle(io.canvas.center,40)
    .setFillStyle('red'));

  //create an opaque blue circle
  io.addObj(new iio.Circle(0,0,40)
    .setPos(io.canvas.center.x+30,io.canvas.center.y+30)
    .setFillStyle('rgba(0,0,255,.7)'));

  //create the green stroked circle
  io.addObj(new iio.Circle(0,0,40)
    .setPos(io.canvas.center.x-30,io.canvas.center.y-30)
    .setStrokeStyle('#a3da58',2));

}; iio.start(CirclesDemo, 'canvasId');</pre>
</body>
</html>