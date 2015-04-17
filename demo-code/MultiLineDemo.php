<?php 
    $homepath = '../';
    $title = 'MultiLine Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
MultiLineDemo = function(io){

  //vertices are relative to canvas 0,0 (top left)
  //when a position is not specified
  //otherwise, the vertices are relative to
  //the given position
  //..this one is created without a position
  io.addObj(new iio.MultiLine([80,160
                              ,40,100
                              ,80,40
                              ,120,40
                              ,160,100
                              ,120,160])
    .setStrokeStyle('#00baff',2));

}; iio.start(MultiLineDemo, 'canvasId');</pre>
</body>
</html>