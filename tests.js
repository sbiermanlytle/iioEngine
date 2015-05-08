var show_test_index = function(){
	page.append('<h1>iio.js Unit Tests</h1>');
	page.append('<h3>click a category to see tests and source code</h3>');
	page.append('<ul id="categories"><li><a id="Line" href="Line">iio.<span class="kwd">Line</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Circle" href="Circle">iio.<span class="kwd">Circle</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Polygon" href="Polygon">iio.<span class="kwd">Polygon</span></a></li></ul>');

	link_listener( iio.test.Line, 'Line' );
	link_listener( iio.test.Circle, 'Circle' );
	link_listener( iio.test.Polygon, 'Polygon' );
}

link_listener = function( test_function, test_class ){
	$('#'+test_class).click(function(){
		return link_click( TESTS, function(){
			show_unit_test( test_function, test_class );
		} );
	});
}

show_unit_test = function( test_function, test_class ){
	page.append('<h1>iio.'+test_class+' Unit Test</h1>');
	page.append('<h3>click any app to view the source code</h3>');
	page.append('<div id="iioapps"></div>');

	iioapps = document.getElementById('iioapps');
	iio.test.create_canvas_grid( 100, 5, 6 );
	iio.test.show_tests( test_function, test_class );
}