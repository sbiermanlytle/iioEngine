show_tests = function(test_class){

	iio.start([test_class.constructor, { color:0 }], 'c00');
	iio.start([test_class.constructor_no_pos, { color:1 }], 'c01');
	iio.start([test_class.rotation, { color:0 }], 'c02');
	iio.start([test_class.rotation_no_pos, { color:1 }], 'c03');
	iio.start([test_class.origin, { color:0 }], 'c04');

	iio.start([test_class.vel_bounds, { color:1 }], 'c10');
	iio.start([test_class.acc_bounds, { color:0 }], 'c11');
	iio.start([test_class.vels, { color:1 }], 'c12');
	iio.start([test_class.accs, { color:0 }], 'c13');

	iio.start([test_class.rVel_bounds, { color:0 }], 'c20');
	iio.start([test_class.rVel_bounds_no_pos, { color:1 }], 'c21');
	iio.start([test_class.rAcc_bounds, { color:0 }], 'c22');

	iio.start([test_class.hidden, { color:1 }], 'c30');
	iio.start([test_class.alpha, { color:0 }], 'c31');
	iio.start([test_class.color, { color:1 }], 'c32');
	iio.start([test_class.width, { color:0 }], 'c33');

	iio.start([test_class.lineCap, { color:0 }], 'c40');
	iio.start([test_class.dash, { color:1 }], 'c41');
	iio.start([test_class.gradient, { color:0 }], 'c42');
	iio.start([test_class.radial_gradient, { color:1 }], 'c43');
	iio.start([test_class.shadow, { color:0 }], 'c44');

	iio.start([test_class.child, { color:1 }], 'c50');
	iio.start([test_class.bezier, { color:0 }], 'c51');
	iio.start([test_class.bezierVels, { color:1 }], 'c52');
	iio.start([test_class.bezierAccs, { color:0 }], 'c53');
}

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
	show_tests(iio.test.Line);
}