<?php 
    $homepath = '../';
    $title = 'BG Image Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
BGImageDemo = function(io){

  //set the canvas css background image
  io.setBGImage('img/snes_thumb.jpg');

}; iio.start(BGImageDemo, 'canvasId');</pre>
</body>
</html>