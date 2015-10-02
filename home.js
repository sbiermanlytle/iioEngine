show_home = function(){
  page.append(
    h1('iio.JS is a Framework for HTML5 Canvas')
  );

  //page.append('<h1>iio.js App Demos</h1>');
  var iioApps1 = document.createElement('div');
  iioApps1.className = 'iioapps';
  page.append(iioApps1);
  add_demo_preview( iioApps1, ScrollShooter, "ScrollShooter" );
  add_demo_preview( iioApps1, Snake, "Snake" );
  add_demo_preview( iioApps1, ColorGrid, "ColorGrid", {w:20} );

  page.append('<div class="col_two">' +
      h2('lightweight, efficient, with zero dependencies') +
      p('iio.js is a javascript library that speeds the '+kwd('creation and deployment')+' of HTML5 Canvas applications.') +
      '<div class="arrows_btns"><div class="btn_wrap"><img class="big-arrow left-arrow" src="img/arrow-grey.png"/><p style="min-width:190px" class="big-btn"><a id="download-iio" style="padding:15px 26px" class="btn-iio grey" href="https://github.com/iioinc/iio.js/archive/master.zip">Download v1.4</a></p><img class="big-arrow" src="img/arrow.png"/><p id="quickstart-btn" style="min-width:181px;" class="big-btn"><a class="btn-iio" href="#api.overview">Documentation</a></p></div></div>' +
    '</div>' +
    '<div class="col_two">' +
      h2('Free &amp; Open Source') +
      p('The core platform is <span class="kwd">open source and free</span> to use for any purpose. The download includes production and development '+kwd('full source code')+' for all versions of the framework.') +
      p('Submit additions, questions, and bugs on '+ahref('Github', 'https://github.com/iioinc/iio.js/issues')+'. General inquires may be sent to '+ahref('iioinc.com', 'http://iioinc.com/contact')+'.') +
    '</div>' +
    clear +
    h3('click an app for full screen and more details')
  );

  var iioApps2 = document.createElement('div');
  iioApps2.className = 'iioapps';
  page.append(iioApps2);
  add_demo_preview( iioApps2, ColorLines, "ColorLines", { lineWidth:20 } );
  add_demo_preview( iioApps2, MineSweeper, "MineSweeper", { color: new iio.Color(255,255,255) } );
  add_demo_preview( iioApps2, Squares, "Squares" );
  add_demo_preview( iioApps2, Snow, "Snow" );
  add_demo_preview( iioApps2, TicTacToe, "TicTacToe" );
  add_demo_preview( iioApps2, BezierCurves, "BezierCurves" );
};
