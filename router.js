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

  // HOME ROUTER
  if( current_hash === '#download' || current_hash === '' ){
    current = HOME;
    show_home();
  }

  // API ROUTER
  else if( current_hash.substr( 0, 5 ) === '#api/' ){
    current = DOCS;
    var path = current_hash.substr( 5 );
    var anchorPos = path.indexOf('/');
    if(anchorPos > -1){
      anchor = path.substr( anchorPos );
      path = path.substr( 0, anchorPos );
    }
    if( path === 'overview' )
      show_api_basics();
    else if( path === 'app-control' )
      show_api( api.AppControl );
    else if( path === 'loader' )
      show_api( api.Loader );
    else if( path === 'sound' )
      show_api( api.Sound );
    else if( path === 'interface' )
      show_api( api.Interface );
    else if( path === 'vector' )
      show_api( api.Vector );
    else if( path === 'color' )
      show_api( api.Color );
    else if( path === 'gradient' )
      show_api( api.Gradient );
    else if( path === 'drawable' )
      show_api( api.Drawable );
    else if( path === 'app' )
      show_api( api.App );
    else if( path === 'shape' )
      show_api( api.Shape );
    else if( path === 'line' )
      show_api( api.Line );
    else if( path === 'text' )
      show_api( api.Text );
    else if( path === 'ellipse' )
      show_api( api.Ellipse );
    else if( path === 'polygon' )
      show_api( api.Polygon );
    else if( path === 'rectangle' )
      show_api( api.Rectangle );
    else if( path === 'grid' )
      show_api( api.Grid );
    else if( path === 'quad' )
      show_api( api.Quad );
    else if( path === 'quadgrid' )
      show_api( api.QuadGrid );
  } 
  else if( current_hash.substr( 0, 4 ) === '#api' ){
    current = DOCS;
    show_api_basics();
  }

  // DEMO ROUTER
  else if( current_hash.substr( 0, 7 ) === '#demos/' || current_hash.substr( 0, 7 ) === '#demos-' ){
    current = DEMOS;
    var path = current_hash.substr( 7 ).toLowerCase();

    if( path === 'scrollshooter' )
      show_demo( ScrollShooter, "ScrollShooter" );
    else if( path === 'snake' )
      show_demo( Snake, "Snake" );
    else if( path === 'colorgrid' )
      show_demo( ColorGrid, "ColorGrid", { w:20 } );
    else if( path === 'squares' )
      show_demo( Squares, "Squares" );
    else if( path === 'snow' )
      show_demo( Snow, "Snow" );
    else if( path === 'tictactoe' )
      show_demo( TicTacToe, "TicTacToe" );
    else if( path === 'minesweeper' )
      show_demo( MineSweeper, "MineSweeper" );
    else if( path === 'colorlines' )
      show_demo( ColorLines, "ColorLines" );
    else if( path === 'beziercurves' )
      show_demo( BezierCurves, "BezierCurves" );
    else if( path === 'panning' )
      show_demo( Panning, "Panning" );
    else if( path === 'dragdrop' )
      show_demo( DragDrop, "DragDrop" );
    else if( path === 'platformer' )
      show_demo( Platformer, "Platformer" );
    else if( path === 'box2d' )
      show_demo( Box2dDemo, "Box2d" );
    else if( path === 'textedit' )
      show_demo( TextEdit, "TextEdit" );
    else show_demo_index();
  }
  else if( current_hash === '#demos' ){
    current = DEMOS;
    show_demo_index();
  }

  // PRETTIFY
  highlight_menu();
  prettyPrint();
  if( current === DOCS )
    $('.prettyprint ol.linenums').css('margin-left', '-40px');

  // SCROLL TO HASH
  if(anchor){
    var e = document.getElementById( current_hash.substr(1) );
    if(e) e.scrollIntoView(true);
  }
}

display_current();
