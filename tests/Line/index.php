<!-- 
	iio Engine v1.4
	***************
	URL: iioengine.com/tests/Line
 -->
<!DOCTYPE html>
<html>
<head>
	<title>Tests | Line</title>
	<style type="text/css">
		html,body,div,canvas{
			padding:0;
			margin:0;
		}
		html{
			background-color: black;
		}
		canvas{
			margin: 5px;
			float: left;
			background-color: black;
		}
		#iio_log{
			margin:10px;
		}
		#iio_log p{
			margin:3px;
			color:white;
		}
		.clear{clear:both}
	</style>
</head>
<body>
	<?php
		$size = 100;
		$C = 1;

		for($R=0; $R<6; $R++) :
			for($C=0; $C<5; $C++) : ?>
				<canvas id="c<?=$R?><?=$C?>" width="<?=$size?>px" height="<?=$size?>px"></canvas>
			<?php endfor; ?>
			<div class="clear"></div>
		<?php endfor; ?>

	<script type="text/javascript" src="../../core/iioEngine.js"></script>
	<script type="text/javascript" src="../Tests.js"></script>
	<script type="text/javascript" src="Line_tests.js"></script>
	<script type="text/javascript">	

	iio_dependencies = [
	  'functions.js',
	  'libs.js',
	  'V.js',
	  'Color.js',
	  'Obj.js',
	  'App.js',
	  'Drawable.js',
	  'Line.js'//,
	  //'debugger.js'
	];

	load_iio_remote(function(){
		assign_globals();
		//iio.show_logs();
		iio.start([Test_Line_Constructor, { c:0 }], 'c00');
		iio.start([Test_Line_Constructor_no_pos, { c:1 }], 'c01');
		iio.start([Test_Line_rotation, { c:0 }], 'c02');
		iio.start([Test_Line_rotation_no_pos, { c:1 }], 'c03');
		iio.start([Test_Line_origin, { c:0 }], 'c04');

		iio.start([Test_Line_vel_bounds, { c:1 }], 'c10');
		iio.start([Test_Line_acc_bounds, { c:0 }], 'c11');
		iio.start([Test_Line_vels, { c:1 }], 'c12');
		iio.start([Test_Line_accs, { c:0 }], 'c13');

		iio.start([Test_Line_rVel_bounds, { c:0 }], 'c20');
		iio.start([Test_Line_rVel_bounds_no_pos, { c:1 }], 'c21');
		iio.start([Test_Line_rAcc, { c:0 }], 'c22');

		iio.start([Test_Line_hidden, { c:1 }], 'c30');
		iio.start([Test_Line_alpha, { c:0 }], 'c31');
		iio.start([Test_Line_color, { c:1 }], 'c32');
		iio.start([Test_Line_width, { c:0 }], 'c33');

		iio.start([Test_Line_lineCap, { c:0 }], 'c40');
		iio.start([Test_Line_dash, { c:1 }], 'c41');
		iio.start([Test_Line_bezier, { c:0 }], 'c42');
		iio.start([Test_Line_shadow, { c:1 }], 'c43');

		iio.start([Test_Line_child, { c:1 }], 'c50');
		iio.start([Test_Line_bezierVels, { c:0 }], 'c51');
		iio.start([Test_Line_bezierAccs, { c:1 }], 'c52');
	});

	</script>
</body>
</html>