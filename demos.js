var show_demo_index = function(){
	page.append('<h1>iio.js App Demos</h1>');
	page.append('<h3>click an app for full screen and more details</h3>');
	page.append('<div id="iioapps"></div>');
	iioapps = document.getElementById('iioapps');

	create_demo_canvas( 200, 'Squares', 'squares' )
	$('#squares').click(function(){
		return link_click( DEMOS, show_demo_Squares );
	});
	iio.start([Squares, { preview:true }], 'squares' );

	create_demo_canvas( 200, 'Snow', 'snow' )
	$('#snow').click(function(){
		return link_click( DEMOS, show_demo_Snow );
	});
	iio.start([Snow, { preview:true }], 'snow' );

	create_demo_canvas( 200, 'ColorGrid', 'ColorGrid' )
	$('#ColorGrid').click(function(){
		return link_click( DEMOS, show_demo_ColorGrid );
	});
	iio.start([ColorGrid, { preview:true, w:20 }], 'ColorGrid' );
}

show_demo_Snow = function(){
	$('#column').hide();
	$('#header').append('<div id="fullscreen_header"><a id="back" href="">&lt;&lt; back</a> | <h1>Snow</h1> | <a id="source" href="">source code</a> </div>');
	$('#back').click(function(){
		return link_click( DEMOS, show_demo_index );
	});
	$('#source').click(function(e){
		codeWindow = window.open("demos/source-code/Snow.html", "littleWindow", "location=no,menubar=no,toolbar=no,width=700,height=800,left=0"); 
		codeWindow.moveTo(0,0);
		return false;
	});
	iio.start(Snow);
}

show_demo_Squares = function(){
	$('#column').hide();
	$('#header').append('<div id="fullscreen_header"><a id="back" href="">&lt;&lt; back</a> | <h1>Squares</h1> | <a id="source" href="">source code</a> </div>');
	$('#back').click(function(){
		return link_click( DEMOS, show_demo_index );
	});
	$('#source').click(function(e){
		codeWindow = window.open("demos/source-code/Squares.html", "littleWindow", "location=no,menubar=no,toolbar=no,width=700,height=800,left=0"); 
		codeWindow.moveTo(0,0);
		return false;
	});
	iio.start(Squares);
}

show_demo_ColorGrid = function(){
	$('#column').hide();
	$('#header').append('<div id="fullscreen_header"><a id="back" href="">&lt;&lt; back</a> | <h1>Color Grid</h1> | <a id="source" href="">source code</a> </div>');
	$('#back').click(function(){
		return link_click( DEMOS, show_demo_index );
	});
	$('#source').click(function(e){
		codeWindow = window.open("demos/source-code/ColorGrid.html", "littleWindow", "location=no,menubar=no,toolbar=no,width=700,height=800,left=0"); 
		codeWindow.moveTo(0,0);
		return false;
	});
	iio.start([ColorGrid,{ w:20 }]);
}