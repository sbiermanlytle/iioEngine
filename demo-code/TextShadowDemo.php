<?php 
    $homepath = '../';
    $title = 'Text Shadow Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
TextShadowDemo = function(io){

  //set background color
  io.setBGColor('white');
  
  //create text
  io.addObj(new iio.Text('Shadows'
    ,io.canvas.center.x, io.canvas.center.y+15))
    .setFont('50px Consolas')
    .setTextAlign('center')
    //set the shadow color, offset (10,10), and blur (4)
    .setShadow('rgb(150,150,150)',10,10,4)
    .setFillStyle('black'));

}; iio.start(TextShadowDemo, 'canvasId');</pre>
</body>
</html>