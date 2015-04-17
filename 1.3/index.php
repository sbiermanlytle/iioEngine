<?php $home=''; ?>
<?php if (isset($_GET['app'])) { ?>
<?php 
$title='lines demo';
include('inc/code_view.php');
?>
<pre id="iio" class="prettyprint linenums:1"><?php echo file_get_contents("iio/lines.iio")?></pre>
<pre id="js" class="prettyprint linenums:1" style="display:none">
  <?php echo file_get_contents("js/".$_GET['app'].".iio.js") ?>; iio.start(lines, 'canvasId');
</pre>
<script type="text/javascript" src="js/code_view.js"></script>
<?php } else { ?>
<?php 
$title='v1.3 Preview'; 
include('inc/head.php'); ?>
<body>  
	<header>
		<ul>
			<li id='home'><a href="../">iio</a></li>
			<li>v1.3 Preview</li>
		</ul>
	</header>
	<div id='main'>
		<script type="text/javascript">
			function popup(url){
			  codeWindow = window.open(url, "littleWindow", "location=no,menubar=no,toolbar=no,width=600,height="+window.innerHeight+",left=0"); 
			  codeWindow.moveTo(0,0);
			}
		</script>
		<h2>Object Demos</h2>
		<p class='note'>click a canvas to view the code</p>
		<div class='demos'>
			<a href="javascript:popup('?app=lines')">
			<canvas width="300" height="300" id='cnv0'></canvas>
			</a>
			<a href="javascript:popup('?app=circles')">
			<canvas width="300" height="300" id='cnv1'></canvas>
			</a>
			<a href="javascript:popup('?app=rectangles')">
			<canvas width="300" height="300" id='cnv2'></canvas>
			</a>
			<a href="javascript:popup('?app=polygons')">
			<canvas width="300" height="300" id='cnv3'></canvas>
			</a>
			<a href="javascript:popup('?app=grids')">
			<canvas width="300" height="300" id='cnv4'></canvas>
			</a>
			<a href="javascript:popup('?app=text')">
			<canvas width="300" height="300" id='cnv5'></canvas>
			</a>
		</div>
	</div>
	<script type="text/javascript" src="js/iioEngine.min.js"></script>
	<script type="text/javascript" src="js/lines.iio.js"></script>
	<script type="text/javascript" src="js/circles.iio.js"></script>
	<script type="text/javascript" src="js/rectangles.iio.js"></script>
	<script type="text/javascript" src="js/polygons.iio.js"></script>
	<script type="text/javascript" src="js/grids.iio.js"></script>
	<script type="text/javascript" src="js/text.iio.js"></script>
	<script type="text/javascript">
		var c = iio.randomColor();
		iio.start(lines,'cnv0',{color:c});
		iio.start(circles,'cnv1',{color:c});
		iio.start(rectangles,'cnv2',{color:c});
		iio.start(polygons,'cnv3',{color:c});
		iio.start(grids,'cnv4',{color:c});
		iio.start(text,'cnv5',{color:c});
	</script>
<?php } ?>
</body>
</html>