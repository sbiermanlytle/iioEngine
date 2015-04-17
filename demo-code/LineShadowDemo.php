<?php 
    $homepath = '../';
    $title = 'Line Shadow Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
LineShadowDemo = function(io){

  //set background color
  io.setBGColor('white');

  //create multi-line
  //vertices are relative to canvas 0,0 (top left)
  //when a position is not specified
  //otherwise, the vertices are relative to
  //the given position
  //..this one is created without a position
  io.addObj(new iio.MultiLine([120,40
                              ,160,100
                              ,120,160
                              ,80,40
                              ,40,100
                              ,80,160])
    //set the shadow color, offset (20,10), and blur (4)
    .setShadow('rgb(150,150,150)',20,10,4)
    .setStrokeStyle('#a3da58',3));
  
}; iio.start(LineShadowDemo, 'canvasId');</pre>
</body>
</html>