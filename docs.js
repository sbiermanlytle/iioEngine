var top_menu_toggles = [];
var headers = [];
headers[0] = 'basics';
//headers[1] = 'functions';
headers[1] = 'data';
headers[2] = 'objects';

show_docs_menu = function(){
	page.append('<div id="api_menu"></div>');
	$('#api_menu').append('<ul id="api_items"></ul>');

	for( var i=0; i<headers.length; i++ ){

		// create section wrapper
		$('#api_items').append('<li><div id="api_item_'+headers[i]+'" class="api_item"></div></li>');
		// create header element
		$('#api_item_'+headers[i]).append('<h5 id="api_item_h_'+headers[i]+'">'+headers[i]+'</h5>');
		// create list
		$('#api_item_'+headers[i]).append('<ul id="'+headers[i]+'"></ul>');

		top_menu_toggles[i] = false;
		document.getElementById('api_item_'+headers[i]).onselectstart = function() { return false }
	}

	append_api_item_sub('basics','overview');

	//append_api_item_sub('functions','iio libraries');
	append_api_item_sub('basics','app control');

	append_api_item_sub('data','Abstract');
	append_api_item_sub('data','Vector');
	append_api_item_sub('data','Color');
	append_api_item_sub('data','Gradient');
	append_api_item_sub('data','Sound');

	append_api_item_sub('objects','Obj');
	append_api_item_sub('objects','Drawable');
	append_api_item_sub('objects','App');
	append_api_item_sub('objects','Text');
	append_api_item_sub('objects','Circle');
	append_api_item_sub('objects','Polygon');
	append_api_item_sub('objects','Rectangle');
	append_api_item_sub('objects','Grid');
	append_api_item_sub('objects','X');

	$('#api_item_h_'+headers[0]).click(function(){
		toggle_menu(headers[0],0);
		return false;
	});
	/*$('#api_item_h_'+headers[1]).click(function(){
		toggle_menu(headers[1],1);
		return false;
	});*/
	$('#api_item_h_'+headers[1]).click(function(){
		toggle_menu(headers[1],1);
		return false;
	});
	$('#api_item_h_'+headers[2]).click(function(){
		toggle_menu(headers[2],2);
		return false;
	});
}

h1 = function(html){ return '<h1>'+html+'</h1>' }
h2 = function(html){ return '<h2>'+html+'</h2>' }
h3 = function(html){ return '<h3>'+html+'</h3>' }
kwd = function(html){ return "<span class='kwd'>"+html+"</span>" }
a = function(name){ return '<a href="#'+name+'">'+name+'</a>' }
pre = function(html){ return "<pre class='prettyprint linenums:1'>"+html+"</span>" }
p = function(html){ return '<p>'+html+'</p>' }
api_list = function(id){ return '<ul class="api_list" id="'+id+'"></ul>' }
api_list_item = function(html){ return '<li class="api_list_item">'+html+'</li>' }
api_list_info = function(html){ return '<p class="api_list_info"> - '+html+'</p>' }
noBold = function(html){ return "<span class='noBold'>"+html+"</span>"}
var clear = '<div class="clear"></div>';
var divide = '<div class="clear divide"></div>';

show_api_basics = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');
	var api_content = $('#api_content');

	api_content.append(h1('iio.js Documentation'));
	api_content.append('<h3><a href="https://github.com/sbiermanlytle/iioengine/archive/master.zip">- Download iio.js 1.4</a></h3>');

	api_content.append(p('iio.js is a JavaScript framework for HTML5 Canvas applications. iio allows for '+kwd('object oriented development')+' and '+kwd('automated object managment')+'.'));

	api_content.append(p('All code samples in the documentation are assumed to be running inside of an iio script with access to '+kwd('app')+', unless full code is provided.'));

	api_content.append(h2('Hello World'));
	api_content.append(pre("&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;body&gt;\n&lt;script type='text/javascript' src='iio.js'&gt;&lt;/script&gt;\n&lt;script type='text/javascript'&gt;\n\n// define a new iio app\n// app is an App object\nHelloWorld = function( app ){\n\n\t// add a new text object to the app\n\tapp.add(new iio.Text({\n\t\t// set position to app center\n\t\tpos: app.center,\n\t\t// set text value\n\t\ttext: 'Hello World'\n\t}));\n}\n\n// start the app fullscreen\niio.start( HelloWorld );\n&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;"));
}

show_api_app_control = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');
	var api_content = $('#api_content');

	api_content.append(h1('iio app control'));

	api_content.append(p("iio apps are wrapped in an application script so that they can be managed by iio's centralized app management system."));
	api_content.append(p("This design pattern will also allow you to utilize "+kwd('iio.start')+"."));
	api_content.append(pre("// define a new iio app\n// app is an App object\nHelloWorld = function( app ){\n\t//...\n}\n\n// start the app fullscreen\niio.start( HelloWorld );\n\n// start the app on an existing canvas\niio.start( HelloWorld, 'canvasId' );"));

	api_content.append(h2('iio app settings'));
	api_content.append(p("iio apps can be started with settings that are known to the app."));
	api_content.append(pre("// define a new iio app\nHelloWorld = function( app, settings ){\n\tsettings.mVar //...\n}\n\n// start the app fullscreen with settings\niio.start( [ HelloWorld, { mVar: mVal } ] );\n\n// start the app on an existing canvas\niio.start( [ HelloWorld, { mVar: mVal } ], 'canvasId' );"));
}

show_api_Abstract = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');
	var api_content = $('#api_content');

	// TITLE
	api_content.append( h1('iio.Abstract') );
	api_content.append( h3( kwd('Abstract') ) );
	// OVERVIEW
	api_content.append( p("An abstract root for all classes in iio. Every method defined here in Abstract is available in every other class.") );

	// FUNCTIONS
		api_content.append( h2('Functions') );
		api_content.append( api_list('functions') );
		var functions = $('#functions');
		// clone
		functions.append( api_list_item('clone() | ' + noBold('returns ') + kwd('Object') ) );
		functions.append( api_list_info('returns a deep copy of this object (a new object with equal properties).') );
		functions.append( pre("var obj_clone = obj.clone();") );
		functions.append( divide );
		// toString
		functions.append( api_list_item('toString() | ' + noBold('returns ') + kwd('String') ) );
		functions.append( api_list_info('returns a string that lists all properties and values in this object.') );
		functions.append( pre("var obj_string = obj.toString();") );
		functions.append( clear );
}

show_api_Color = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');
	var api_content = $('#api_content');

	// TITLE
	api_content.append( h1('iio.Color') );
	api_content.append( h3( kwd('Color') +' : '+ a('Abstract') ) );
	// OVERVIEW
	api_content.append( p("An object for storing color defined with Red, Green, Blue, and Alpha channels.") );

	// PROPERTIES
		api_content.append( h2('Properties') );
		api_content.append( api_list('properties') );
		var properties = $('#properties');
		// r
		properties.append( api_list_item( kwd('float')+' r') );
		properties.append( api_list_info("Red color value in the range [ 0, 255 ]") );
		properties.append( clear );
		// g
		properties.append( api_list_item( kwd('float')+' g') );
		properties.append( api_list_info("Green color value in the range [ 0, 255 ]") );
		properties.append( clear );
		// b
		properties.append( api_list_item( kwd('float')+' b') );
		properties.append( api_list_info("Blue color value in the range [ 0, 255 ]") );
		properties.append( clear );
		// a
		properties.append( api_list_item( kwd('float')+' a') );
		properties.append( api_list_info("Alpha color value in the range [ 0, 1 ]") );
		properties.append( clear );
		// sample
		properties.append( pre("// access the properties of a color\nvar red = color.r;\nvar green = color.g;\nvar blue = color.b;\nvar alpha = color.a;") );
		properties.append( pre("// set the properties of a color\ncolor.r = 255;\ncolor.g = 255;\ncolor.b = 255;\ncolor.a = 1;") );

	// CONSTRUCTOR
		api_content.append( h2('Constructor') );
		api_content.append( api_list('constructor') );
		var constructor = $('#constructor');
		// Color( r, g, b, a )
		constructor.append( api_list_item('Color( '+kwd('float')+' r, '+kwd('float')+' g, '+kwd('float')+' b, '+kwd('float')+' a )') );
		constructor.append( api_list_info("create a color with the given values. The default alpha value is 1, all colors default to 0.") );
		constructor.append( pre("// create a new color (black with full alpha)\nvar c0 = new iio.Color();\n\n// create a new blue color with full alpha\nvar c1 = new iio.Color( 0, 0, 255 );\n\n// create a new red color with 50% alpha\nvar c2 = new iio.Color( 255, 0, 0, 0.5 );") );

	// STATIC FUNCTIONS
		api_content.append( h2('Static Functions') );
		api_content.append( api_list('static-functions') );
		var static_functions = $('#static-functions');
		// random
		static_functions.append( api_list_item('Color.random() | ' + noBold('returns ') + a('Color') ) );
		static_functions.append( api_list_info('returns a random color with full alpha') );
		static_functions.append( pre("var random_color = iio.Color.random();") );

	// FUNCTIONS
		api_content.append( h2('Member Functions') );
		api_content.append( api_list('functions') );
		var functions = $('#functions');
		// invert
		functions.append( api_list_item('invert() | ' + noBold('returns ') + a('this') ) );
		functions.append( api_list_info('inverts the r,g,b values of this color. Does not effect alpha.') );
		functions.append( pre("color.invert();") );
		functions.append( divide );
		// randomize
		functions.append( api_list_item('randomize() | ' + noBold('returns ') + a('this') ) );
		functions.append( api_list_info('randomizes the r,g,b values of this color. Does not effect alpha.') );
		functions.append( pre("color.randomize();") );
		functions.append( clear );
}

show_api_Vector = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');
	var api_content = $('#api_content');

	// TITLE
	api_content.append( h1('iio.Vector') );
	api_content.append( h3( kwd('Vector') +' : '+ a('Abstract') ) );
	// OVERVIEW
	api_content.append( p("Represents a 2D vector or point. Contains static and instance mathmatics.") );

	// PROPERTIES
		api_content.append( h2('Properties') );
		api_content.append( api_list('properties') );
		var properties = $('#properties');
		// x
		properties.append( api_list_item( kwd('float')+' x') );
		properties.append( api_list_info("the x (horizontal) coordinate value in pixels") );
		properties.append( clear );
		// y
		properties.append( api_list_item( kwd('float')+' y') );
		properties.append( api_list_info("the y (vertical) coordinate value in pixels") );
		// sample
		properties.append( pre("// access the x and y values of a vector\nvar x = vector.x;\nvar y = vector.y;") );
		properties.append( pre("// set the x and y values of a vector\nvector.x = value;\nvector.y = value;") );

	// CONSTRUCTORS
		api_content.append( h2('Constructors') );
		api_content.append( api_list('constructors') );
		var constructors = $('#constructors');
		// Vector()
		constructors.append( api_list_item('Vector()') );
		constructors.append( api_list_info("create a vector with values 0,0") );
		constructors.append( clear );
		// Vector( x,y )
		constructors.append( api_list_item('Vector( '+kwd('float')+' x, '+kwd('float')+' y )') );
		constructors.append( api_list_info('create a vector with the given x and y values') );
		constructors.append( clear );
		// Vector( v )
		constructors.append( api_list_item('Vector( '+a('Vector')+' v )') );
		constructors.append( api_list_info('create a vector with the values of the given vector') );
		constructors.append( pre("\nvar v0 = new iio.Vector();\nvar v1 = new iio.Vector( 40, 50 );\nvar v2 = new iio.Vector( v1 );") );

	// FUNCTIONS
		api_content.append( h2('Functions') );
		api_content.append( api_list('functions') );
		var functions = $('#functions');
		// add( x, y )
		functions.append( api_list_item('add( '+kwd('float')+' x, '+kwd('float')+' y ) | ' + noBold('returns ') + a('this') ) );
		functions.append( api_list_info('add the given values to this vector') );
		functions.append( clear );
		// add( v )
		functions.append( api_list_item('add( '+a('Vector')+' v ) | ' + noBold('returns ') + a('this') ) );
		functions.append( api_list_info('add the given vector to this vector') );
		functions.append( pre("var v0 = new iio.Vector();\nv0.add( 20, 30 );\n\nvar v1 = new iio.Vector();\nv1.add( v0 );") );
}

toggle_menu = function( id, i ){
	if(top_menu_toggles[i]) $('#'+id).slideDown(400);
	else $('#'+id).slideUp(400);
	top_menu_toggles[i] = !top_menu_toggles[i];
}

append_api_item_sub = function( parent, href ){
	var title = href;
	href = href.replace(' ', '-');
	$('#'+parent).append('<li class="api_item_sub"><a href="#'+href+'">'+title+'</a></li>');
}
