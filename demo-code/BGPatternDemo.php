<?php 
    $homepath = '../';
    $title = 'BG Pattern Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
BGPatternDemo = function(io){

  //set canvas css background repeating image
  io.setBGPattern('img/bgPattern.jpg');

}; iio.start(BGPatternDemo, 'canvasId');</pre>
</body>
</html>