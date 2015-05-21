var show_demo_index = function(){
	page.append('<h1>iio.js App Demos</h1>');
	page.append('<h3>click an app for full screen and more details</h3>');
	page.append('<div id="iioapps"></div>');
	iioapps = document.getElementById('iioapps');

	add_demo_preview( ScrollShooter, "ScrollShooter" );
	add_demo_preview( Snake, "Snake" );
	add_demo_preview( ColorGrid, "ColorGrid", {w:20} );
	add_demo_preview( Squares, "Squares" );
	add_demo_preview( Snow, "Snow" );
}

add_demo_preview = function( app, title, settings ){
	create_demo_canvas( 200, title )
	$('#'+title).click(function(){
		window.location.hash = '#demos-'+title;
	    return false;
	});
	if(settings)
		iio.start([ app, iio.merge( { preview:true }, settings ) ], title );
	else 
		iio.start([ app, { preview:true } ], title );
}

show_demo = function( app, title, settings){
	$('#column').hide();
	$('#header').css({ 'left': 0, 'margin-left': 0 });
	$('#footer').css({ 'left': 0, 'margin-left': 0 });
	$('#header').append('<div id="fullscreen_header"><a id="back" href="">&lt;&lt; back</a> | <h1>'+title+'</h1> | <a id="source" href="">source code</a> </div>');
	$('#back').click(function(){
		window.history.back()
	});
	$('#source').click(function(e){
		codeWindow = window.open("demos/source-code/"+title+".html", "littleWindow", "location=no,menubar=no,toolbar=no,width=700,height=800,left=0"); 
		codeWindow.moveTo(0,0);
		return false;
	});
	if( settings )
		iio.start( [ app, settings ] );
	else iio.start( app )
}