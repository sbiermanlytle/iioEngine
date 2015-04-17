<?php 
    $homepath = '../';
    $title = 'Grids Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
GridDemo = function(io){

  //create white 10x10 grid with 20x22 cells
  io.addObj(new iio.Grid(0,0,10,10,20,22)
    .setStrokeStyle('white'));

  //create red 3x4 grid with 50x50 cells
  io.addObj(new iio.Grid(0,0,3,4,50)
    .setStrokeStyle('red',4));

  //create blue 2x4 grid with 50x50 cells
  io.addObj(new iio.Grid(100,0,2,4,50)
    .setStrokeStyle('#00baff',4));

  //create line for looks
  io.addObj(new iio.Line(io.canvas.center.x,0
            ,io.canvas.center.x,io.canvas.height)
    .setStrokeStyle('#a3da58',4));

}; iio.start(GridDemo, 'canvasId');</pre>
</body>
</html>