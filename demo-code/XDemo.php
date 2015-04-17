<?php 
    $homepath = '../';
    $title = 'X-Shape Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
XDemo = function(io){
  
  //create 100x100 x at canvas center
  io.addObj(new iio.XShape(io.canvas.center,100,100)
    .setStrokeStyle('#a3da58',2));
  
}; iio.start(XDemo, 'canvasId');</pre>
</body>
</html>