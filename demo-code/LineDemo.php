<?php 
    $homepath = '../';
    $title = 'Line Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
LineDemo = function(io){

  //create a red line
  //p1:40x120
  //p2:160x160
  //color: red
  //lineWidth: 1
  io.addObj(new iio.Line(40,120,160,160)
    .setStrokeStyle('red',1));

  //create another red line
  io.addObj(new iio.Line(40,100,160,140)
    .setStrokeStyle('red',2));

  //create a gradient
  var gradient=io.context.createLinearGradient(0,0,140,0);
  gradient.addColorStop("0","magenta");
  gradient.addColorStop("0.5","blue");
  gradient.addColorStop("1.0","red");

  //create a line with the gradient
  io.addObj(new iio.Line(40,80,160,120)
    .setStrokeStyle(gradient,4));

  //create a blue line
  io.addObj(new iio.Line(40,60,160,100)
    .setStrokeStyle('blue',2));

  //create a green line
  io.addObj(new iio.Line(40,40,160,80)
    .setStrokeStyle('#a3da58',1));

}; iio.start(LineDemo, 'canvasId');</pre>
</body>
</html>