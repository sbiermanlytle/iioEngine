<?php 
    $homepath = '../';
    $title = 'Circular Image Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
CircleImageDemo = function(io){

  //set background color
  io.setBGColor('white');

  //create a circle in the center of the canvas
  //radius: 80
  var circleImg = new iio.Circle(io.canvas.center,80)
     //set the stroke color and lineWidth (2)
     .setStrokeStyle('black', 2) 
     //set the shadow color, offset (10,10), and blur (4)
     .setShadow('rgb(150,150,150)',10,10,4)
     .addImage('img/staryNight.jpg', function(){
         //image onLoad code
         circleImg.setImgScale(.5);
         io.addObj(circleImg);
     });

}; iio.start(CircleImageDemo, 'canvasId');</pre>
</body>
</html>