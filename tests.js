var show_test_index = function(){
	page.append('<h1>iio.js Unit Tests</h1>');
	page.append('<h3>click a category to see tests and source code</h3>');
	page.append('<ul id="categories"><li><a id="Line" href="Line">iio.<span class="kwd">Line</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Circle" href="Circle">iio.<span class="kwd">Circle</span></a></li></ul>');

	$('#Line').click(function(){
		return link_click( TESTS, show_test_Line );
	});

	$('#Circle').click(function(){
		return link_click( TESTS, show_test_Circle );
	});
}

var show_test_Line = function(){
	page.append('<h1>iio.Line Unit Test</h1>');
	page.append('<h3>click any app to view the source code</h3>');
	page.append('<div id="iioapps"></div>');

	iioapps = document.getElementById('iioapps');
	iio.test.create_canvas_grid( 100, 5, 6 );
	iio.test.show_tests( iio.test.Line, 'Line' );
}

var show_test_Circle = function(){
	page.append('<h1>iio.Circle Unit Test</h1>');
	page.append('<h3>click any app to view the source code</h3>');
	page.append('<div id="iioapps"></div>');

	iioapps = document.getElementById('iioapps');
	iio.test.create_canvas_grid( 100, 5, 6);
	iio.test.show_tests( iio.test.Circle, 'Circle' );
}