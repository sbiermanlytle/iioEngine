var show_demo_index = function(){
	page.append('<h1>iio.js App Demos</h1>');
	page.append('<h3>click an app for full screen and more details</h3>');
	page.append('<div id="iioapps"></div>');
	iioapps = document.getElementById('iioapps');

	prep_demo( ScrollShooter, "ScrollShooter" );
	prep_demo( Snake, "Snake" );
	prep_demo( ColorGrid, "ColorGrid", {w:20} );
	prep_demo( Squares, "Squares" );
	prep_demo( Snow, "Snow" );
}

prep_demo = function( app, title, settings ){
	create_demo_canvas( 200, title )
	$( '#'+title ).click(function(){
		return link_click( DEMOS, function(){
			$('#column').hide();
			$('#header').append('<div id="fullscreen_header"><a id="back" href="">&lt;&lt; back</a> | <h1>'+title+'</h1> | <a id="source" href="">source code</a> </div>');
			$('#back').click(function(){
				return link_click( DEMOS, show_demo_index );
			});
			$('#source').click(function(e){
				codeWindow = window.open("demos/source-code/"+title+".html", "littleWindow", "location=no,menubar=no,toolbar=no,width=700,height=800,left=0"); 
				codeWindow.moveTo(0,0);
				return false;
			});
			if( settings )
				iio.start( [ app, settings ] );
			else iio.start( app )
		});
	});
	if( settings )
		iio.start([ app, iio.merge( { preview:true }, settings) ], title );
	else iio.start([ app, { preview:true }], title );
}