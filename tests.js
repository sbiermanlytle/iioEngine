var show_test_index = function(){
	page.append('<h1>iio.js Unit Tests</h1>');
	page.append('<h3>click a category to see tests and source code</h3>');
	page.append('<ul id="categories"><li><a id="Line" href="Line">iio.<span class="kwd">Line</span></a></li></ul>');

	$('#Line').click(function(){
		return link_click( TESTS, show_test_line );
	});
}

var show_test_line = function(){
	page.append('<h1>iio.Line Unit Test</h1>');
	page.append('<h3>click any app to view the source code</h3>');
	page.append('<div id="iioapps"></div>');

	iioapps = document.getElementById('iioapps');

	create_test_canvas_grid( 100, 5, 6 );

	  assign_Test_globals();

	  iio.start([iio_Test.Line.constructor, { c:0 }], 'c00');
	  iio.start([iio_Test.Line.constructor_no_pos, { c:1 }], 'c01');
	  iio.start([iio_Test.Line.rotation, { c:0 }], 'c02');
	  iio.start([iio_Test.Line.rotation_no_pos, { c:1 }], 'c03');
	  iio.start([iio_Test.Line.origin, { c:0 }], 'c04');

	  iio.start([iio_Test.Line.vel_bounds, { c:1 }], 'c10');
	  iio.start([iio_Test.Line.acc_bounds, { c:0 }], 'c11');
	  iio.start([iio_Test.Line.vels, { c:1 }], 'c12');
	  iio.start([iio_Test.Line.accs, { c:0 }], 'c13');

	  iio.start([iio_Test.Line.rVel_bounds, { c:0 }], 'c20');
	  iio.start([iio_Test.Line.rVel_bounds_no_pos, { c:1 }], 'c21');
	  iio.start([iio_Test.Line.rAcc_bounds, { c:0 }], 'c22');

	  iio.start([iio_Test.Line.hidden, { c:1 }], 'c30');
	  iio.start([iio_Test.Line.alpha, { c:0 }], 'c31');
	  iio.start([iio_Test.Line.color, { c:1 }], 'c32');
	  iio.start([iio_Test.Line.width, { c:0 }], 'c33');

	  iio.start([iio_Test.Line.lineCap, { c:0 }], 'c40');
	  iio.start([iio_Test.Line.dash, { c:1 }], 'c41');
	  iio.start([iio_Test.Line.gradient, { c:0 }], 'c42');
	  iio.start([iio_Test.Line.radial_gradient, { c:1 }], 'c43');
	  iio.start([iio_Test.Line.shadow, { c:0 }], 'c44');

	  iio.start([iio_Test.Line.child, { c:1 }], 'c50');
	  iio.start([iio_Test.Line.bezier, { c:0 }], 'c51');
	  iio.start([iio_Test.Line.bezierVels, { c:1 }], 'c52');
	  iio.start([iio_Test.Line.bezierAccs, { c:0 }], 'c53');
}