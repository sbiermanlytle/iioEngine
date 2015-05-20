var show_test_index = function(){
	page.append('<h1>iio.js Unit Tests</h1>');
	page.append('<h3>click a category to see tests and source code</h3>');
	page.append('<ul id="categories"><li><a id="Line" href="#Line">iio.<span class="kwd">Line</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Circle" href="#Circle">iio.<span class="kwd">Circle</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Polygon" href="#Polygon">iio.<span class="kwd">Polygon</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Rectangle" href="#Rectangle">iio.<span class="kwd">Rectangle</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Text" href="#Text">iio.<span class="kwd">Text</span></a></li></ul>');
	page.append('<ul id="categories"><li><a id="Grid" href="#Grid">iio.<span class="kwd">Grid</span></a></li></ul>');
}

show_unit_test = function( test_function, test_class ){
	page.append('<h1>iio.'+test_class+' Unit Test</h1>');
	page.append('<h3>click any app to view the source code</h3>');
	page.append('<div id="iioapps"></div>');

	iioapps = document.getElementById('iioapps');
	iio.test.create_canvas_grid( 100, 5, 6 );
	iio.test.show_tests( test_function, test_class );
}