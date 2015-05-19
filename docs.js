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

show_api_basics = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');

	$('#api_content').append('<h1>iio.js Documentation</h1>');
	$('#api_content').append('<h3><a href="https://github.com/sbiermanlytle/iioengine/archive/master.zip">- Download iio.js 1.4</a></h3>');

	$('#api_content').append('<p>iio.js is a JavaScript framework for HTML5 Canvas applications. iio allows for <span class="kwd">object oriented development</span> and <span class="kwd">automated object managment</span>.</p>');
	$('#api_content').append('<p>All code samples in the documentation are assumed to be running inside of an iio script with access to <span class="kwd">app</span>, unless full code is provided.</p>');

	$('#api_content').append('<h2>Hello World</h2>');
	$('#api_content').append("<pre class='prettyprint linenums:1'>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;body&gt;\n&lt;script type='text/javascript' src='iio.js'&gt;&lt;/script&gt;\n&lt;script type='text/javascript'&gt;\n\n// define a new iio app\n// app is an App object\nHelloWorld = function( app ){\n\n\t// add a new text object to the app\n\tapp.add(new iio.Text({\n\t\t// set position to app center\n\t\tpos: app.center,\n\t\t// set text value\n\t\ttext: 'Hello World'\n\t}));\n}\n\n// start the app fullscreen\niio.start( HelloWorld );\n&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;</pre>");
}

show_api_app_control = function(){
	show_docs_menu();
	page.append('<div id="api_content"></div>');

	$('#api_content').append('<h1>iio app control</h1>');

	$('#api_content').append("<p>iio apps are wrapped in an application script so that they can be managed by iio's centralized app management system.</p>");
	$('#api_content').append("<p>This design pattern will also allow you to utilize <span class='kwd'>iio.start</span>.</p>");
	$('#api_content').append("<pre class='prettyprint linenums:1'>// define a new iio app\n// app is an App object\nHelloWorld = function( app ){\n\t//...\n}\n\n// start the app fullscreen\niio.start( HelloWorld );\n\n// start the app on an existing canvas\niio.start( HelloWorld, 'canvasId' );</pre>");

	$('#api_content').append('<h2>iio app settings</h2>');
	$('#api_content').append("<p>iio apps can be started with settings that are known to the app.</p>");
	$('#api_content').append("<pre class='prettyprint linenums:1'>// define a new iio app\nHelloWorld = function( app, settings ){\n\tsettings.mVar //...\n}\n\n// start the app fullscreen with settings\niio.start( [ HelloWorld, { mVar: mVal } ] );\n\n// start the app on an existing canvas\niio.start( [ HelloWorld, { mVar: mVal } ], 'canvasId' );</pre>");

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
