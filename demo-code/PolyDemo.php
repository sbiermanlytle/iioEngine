<?php 
    $homepath = '../';
    $title = 'Polygon Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
PolyDemo = function(io){

  //create a blue triangle at 50,50
  //vertices are relative to specified origin
  io.addObj(new iio.Poly(50,50, [-30,30
                                ,50,50
                                ,0,-30])
    .setFillStyle('#00baff'));

  //create a red polygon at 150x150
  io.addObj(new iio.Poly(150,150, [-70,10
                                  ,-50,30
                                  , 10,10
                                  ,-20,-80])
    .setFillStyle('red'));

  //create a green stroked hexagon
  //vertices are relative to canvas 0,0
  //when no position is specified
  io.addObj(new iio.Poly([70,150
                         ,40,100
                         ,70,50
                         ,130,50
                         ,160,100
                         ,130,150])
    .setStrokeStyle('#a3da58',3));

}; iio.start(PolyDemo, 'canvasId');</pre>
</body>
</html>