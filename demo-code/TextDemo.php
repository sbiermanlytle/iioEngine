<?php 
    $homepath = '../';
    $title = 'Text Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
TextDemo = function(io){

  //blue text
  io.addObj(new iio.Text('Text',70,65)
    .setFont('50px Consolas')
    .setTextAlign('center')
    .setFillStyle('#00baff'));

  //stroked text
  io.addObj(new iio.Text('Text',70,115)
    .setFont('50px Arial')
    .setTextAlign('center')
    .setStrokeStyle('#a3da58'));

  //red text
  io.addObj(new iio.Text('Text',70,165)
    .setFont('50px Georgia')
    .setTextAlign('center')
    .setFillStyle('red'));

  //create a gradient
  var gradient=io.context.createLinearGradient(0,0,50,0);
  gradient.addColorStop("0","#00baff");
  gradient.addColorStop(".5","#a3da58");
  gradient.addColorStop("1.0","red");

  //gradient text
  io.addObj(new iio.Text('Text',140,100)
    .setFont('60px Courier New')
    .setTextAlign('center')
    .rotate(Math.PI/2)
    .setFillStyle(gradient));

}; iio.start(TextDemo, 'canvasId');</pre>
</body>
</html>