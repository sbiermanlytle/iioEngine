<?php 
    $homepath = '../';
    $title = 'Rectangles Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
RectanglesDemo = function(io){

  //create a red, rotated 60x60 square at canvas center
  io.addObj(new iio.Rect(io.canvas.center,60)
    .rotate(Math.PI/4)
    .setFillStyle('red'));

  //create an opaque blue 60x100 box
  io.addObj(new iio.Rect(0,0,60,100)
    .setPos(io.canvas.center.x+40,io.canvas.center.y)
    .setFillStyle('rgba(0,0,255,.7)'));

  //create a green stroked 60x100 box
  io.addObj(new iio.Rect(0,0,60,100)
    .setPos(io.canvas.center.x-40,io.canvas.center.y)
    .setStrokeStyle('#a3da58',2));

}; iio.start(RectanglesDemo, 'canvasId');</pre>
</body>
</html>