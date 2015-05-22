var hostname = 'iioengine.github';

var HOME = 'download';
var DOCS = 'docs';
var DEMOS = 'demos';
var TESTS = 'tests';
var current;

$(window).bind('hashchange', function() {

	page.empty();
	iio.stop();
	$('canvas').remove();
	$('#fullscreen_header').remove();
	$('#column').show();
	$('#header').css({ 'left': 'inherit', 'margin-left': -140 });
	$('#footer').css({ 'left': 'inherit', 'margin-left': -140 });
	display_current();
});

display_current = function(){

  // MAIN ROUTER
  if( window.location.hash == '#download' || window.location.hash == '' ){
    current = HOME;
    show_home();
  } else if( window.location.hash == '#demos' ){
    current = DEMOS;
    show_demo_index();
  } else if( window.location.hash == '#tests' ){
    current = TESTS;
    show_test_index();
  }

  // API ROUTER
  else if( window.location.hash.substr( 0, 5 ) == '#api-' ){
    current = DOCS;
    var path = window.location.hash.substr( 5 );
    if( path == 'overview' )
      show_api_basics();
    else if( path == 'app-control' )
      show_api( api.AppControl );
    else if( path == 'Interface' ) 
      show_api( api.Interface );
    else if( path == 'Vector' ) 
      show_api( api.Vector );
    else if( path == 'Color' ) 
      show_api( api.Color );
    else if( path == 'Gradient' ) 
      show_api( api.Gradient );
    else if( path == 'Drawable' ) 
      show_api( api.Drawable );
    else if( path == 'App' ) 
      show_api( api.App );
  } 

  // DEMO ROUTER
  else if( window.location.hash.substr( 0, 7 ) == '#demos-' ){
    current = DEMOS;
    var path = window.location.hash.substr( 7 );

    if( path == 'ScrollShooter' )
      show_demo( ScrollShooter, "ScrollShooter" );
    else if( path == 'Snake' )
      show_demo( Snake, "Snake" );
    else if( path == 'ColorGrid' )
      show_demo( ColorGrid, "ColorGrid", { w:20 } );
    else if( path == 'Squares' )
      show_demo( Squares, "Squares" );
    else if( path == 'Snow' )
      show_demo( Snow, "Snow" );

  } else if( window.location.hash.substr( 0, 6 ) == '#test-' ){
    current = TESTS;
    var path = window.location.hash.substr( 6 );
    
    if( path == 'Line' )
      show_unit_test( iio.test.Line, 'Line' );
    else if( path == 'Circle' )
      show_unit_test( iio.test.Circle, "Circle" );
    else if( path == 'Polygon' )
      show_unit_test( iio.test.Polygon, "Polygon" );
    else if( path == 'Rectangle' )
      show_unit_test( iio.test.Rectangle, "Rectangle" );
    else if( path == 'Text' )
      show_unit_test( iio.test.Text, "Text" );
    else if( path == 'Grid' )
      show_unit_test( iio.test.Grid, "Grid" );
  }

  highlight_menu();
  prettyPrint();

  if( window.location.hash.substr( 0, 5 ) == '#api-' )
    $('.prettyprint ol.linenums').css('margin-left', '-40px');
}

display_current();