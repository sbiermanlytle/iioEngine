var hostname = 'iioengine.github';

var HOME = 'download';
var DOCS = 'docs';
var DEMOS = 'demos';
var current;
var current_hash = window.location.hash;

var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}
if ((is_chrome)&&(is_opera)) {is_chrome=false;}

function goTo( hash ) {
  if ( !is_safari && !is_firefox ) {
      window.location.hash = hash;
  } else {
      window.location.href = hash;
      window.location.href = hash;
  }
  current_hash = window.location.hash;
  refresh();
}

refresh = function(){
  current_hash = window.location.hash;
  page.empty();
  $('#main').append(bg_glow);
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
}

$(window).bind( 'hashchange', refresh );

display_current = function(){
  if(typeof ga !== 'undefined') ga('send', 'pageview', current_hash.substring(1) );
  var anchor;

  // MAIN ROUTER
  if( current_hash == '#download' || current_hash == '' ){
    current = HOME;
    show_home();
  } else if( current_hash == '#demos' ){
    current = DEMOS;
    show_demo_index();
  } else if( current_hash == '#tests' ){
    current = TESTS;
    show_test_index();
  }

  // API ROUTER
  else if( current_hash.substr( 0, 5 ) == '#api.' ){
    current = DOCS;
    var path = current_hash.substr( 5 );
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
    else if( path == 'Quad' )
      show_api( api.Quad );
    else if( path == 'QuadGrid' )
      show_api( api.QuadGrid );
  } 

  // DEMO ROUTER
  else if( current_hash.substr( 0, 7 ) == '#demos-' ){
    current = DEMOS;
    var path = current_hash.substr( 7 );

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
    else if( path == 'TicTacToe' )
      show_demo( TicTacToe, "TicTacToe" );
    else if( path == 'MineSweeper' )
      show_demo( MineSweeper, "MineSweeper" );
    else if( path == 'ColorLines' )
      show_demo( ColorLines, "ColorLines" );
    else if( path == 'BezierCurves' )
      show_demo( BezierCurves, "BezierCurves" );
    else if( path == 'Panning' )
      show_demo( Panning, "Panning" );
    else if( path == 'DragDrop' )
      show_demo( DragDrop, "DragDrop" );

  }

  highlight_menu();
  prettyPrint();

  if( current_hash.substr( 0, 5 ) == '#api.' )
    $('.prettyprint ol.linenums').css('margin-left', '-40px');

  if(anchor){
    var e = document.getElementById( current_hash.substr(1) );
    if(e) e.scrollIntoView(true);
  }
}

display_current();
