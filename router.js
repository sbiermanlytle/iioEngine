var hostname = 'iioengine.github';

var HOME = 'download';
var DOCS = 'docs';
var DEMOS = 'demos';
var current;

$(window).bind('hashchange', function() {

	page.empty();
	iio.stop();
	$('canvas').remove();
	$('#fullscreen_header').remove();
  toggle_ids = [];
  toggles = [];
  numToggles = 0;
	$('#column').show();
	$('#header').css({ 'left': 'inherit', 'margin-left': -140 });
	$('#footer').css({ 'left': 'inherit', 'margin-left': -140 });
	display_current();
});

display_current = function(){
  var anchor;

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
  else if( window.location.hash.substr( 0, 5 ) == '#api.' ){
    current = DOCS;
    var path = window.location.hash.substr( 5 );
    var anchorPos = path.indexOf('.');
    if(anchorPos > -1){
      anchor = path.substr( anchorPos );
      path = path.substr( 0, anchorPos );
    }
    if( path == 'overview' )
      show_api_basics();
    else if( path == 'App-control' )
      show_api( api.AppControl );
    else if( path == 'Loader' )
      show_api( api.Loader );
    else if( path == 'Sound' )
      show_api( api.Sound );
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
    else if( path == 'Shape' ) 
      show_api( api.Shape );
    else if( path == 'Line' ) 
      show_api( api.Line );
    else if( path == 'Text' ) 
      show_api( api.Text );
    else if( path == 'Ellipse' ) 
      show_api( api.Ellipse );
    else if( path == 'Polygon' ) 
      show_api( api.Polygon );
    else if( path == 'Rectangle' ) 
      show_api( api.Rectangle );
    else if( path == 'Grid' ) 
      show_api( api.Grid );
  } 

  // DEMO ROUTER
  else if( window.location.hash.substr( 0, 7 ) == '#demos-' ){
    current = DEMOS;
    var path = window.location.hash.substr( 7 );

    if( path == 'ScrollShooter' )
      show_demo( ScrollShooterSounds, "ScrollShooter" );
    else if( path == 'Snake' )
      show_demo( Snake, "Snake" );
    else if( path == 'ColorGrid' )
      show_demo( ColorGrid, "ColorGrid", { w:20 } );
    else if( path == 'Squares' )
      show_demo( Squares, "Squares" );
    else if( path == 'Snow' )
      show_demo( Snow, "Snow" );
    else if( path == 'TicTacToe' )
      show_demo( TicTacToe, "TicTacToe" );
    else if( path == 'MineSweeper' )
      show_demo( MineSweeper, "MineSweeper" );
    else if( path == 'ColorLines' )
      show_demo( ColorLines, "ColorLines" );

  }

  highlight_menu();
  prettyPrint();

  if( window.location.hash.substr( 0, 5 ) == '#api.' )
    $('.prettyprint ol.linenums').css('margin-left', '-40px');

  if(anchor){
    var e = document.getElementById( window.location.hash.substr(1) );
    if(e) e.scrollIntoView(true);
  }
}

display_current();
