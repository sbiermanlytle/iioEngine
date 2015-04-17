<?php 
    $homepath = '../';
    $title = 'Image Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
ImageDemo = function(io){

  //create the shroom with the dimensions of the given image
  var shroom = new iio.Rect(60, io.canvas.height-40)
     .createWithImage('shroom.png'
      //add the object when the image loads
      ,function(){io.addObj(shroom)}); 
  
  //define a 55x120 rectangle and attach the smily hill image
  var smily = new iio.Rect(io.canvas.center.x+50 //xpos
                            , io.canvas.height-50 //ypos
                            , 55, 120) //size
     .addImage('hill_short.png'
      //add the object when the image loads
      ,function(){io.addObj(smily)});

  //create a polygon and attach an image
  var polyImage = new iio.Poly(150,50,[25,25
                                         ,0,-25
                                         ,-25,25])
     .addImage('block.png'
      //add the object when the image loads
      ,function(){io.addObj(polyImage)});

  //create block with the dimensions of the given image
  var block = new iio.Rect(60, 80,60)
     .createWithImage('bonus.png'
      //add the object when the image loads
      ,function(){io.addObj(block)});

}; iio.start(ImageDemo, 'canvasId');</pre>
</body>
</html>