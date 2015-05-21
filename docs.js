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
	append_api_item_sub('objects','Line');
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
small = function(html){ return "<span class='small'>"+html+"</span>"}
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

show_api = function( api ){
	show_docs_menu();
	page.append('<div id="api_content"></div>');
	var api_content = $('#api_content');
 
	// TITLE
	api_content.append( h1( 'iio.' + api.classname ) );

	// INHERITANCE HIERARCHY
		var hierarchy = '';
		if( api.inherits )
			for(var i=0; i<api.inherits.length; i++ )
				hierarchy += " : " + a( api.inherits[i] );
		api_content.append( h3( kwd( api.classname ) + hierarchy ) );

		// OVERVIEW
		for(var i=0; i<api.overview.length; i++ )
			api_content.append( p( api.overview[i] ) );

		// OVERVIEW CODE SAMPLES
		if( api.samples )
			for(var i=0; i<api.samples.length; i++ )
				api_content.append( pre( api.samples[i] ) );


		// FUNCTIONS & PROPERTIES
		for(var o in api.data ){
			var encoded = o;
			encoded = encoded.replace(" ","-");
			api_content.append( h2( o ) );
			api_content.append( api_list( encoded ) );
			var list = $( '#' + encoded );
			for(var i=0; i<api.data[o].length; i++ ){
				// definition
				if( api.data[o][i].definition )
					list.append( api_list_item( api.data[o][i].definition ) );
				// descriptions
				if( api.data[o][i].descriptions )
					for(var j=0; j<api.data[o][i].descriptions.length; j++){
						if(j>0) list.append( clear );
						list.append( api_list_info( api.data[o][i].descriptions[j] ) );
				}
				// samples
				if( !api.data[o][i].samples || api.data[o][i].samples.length == 0 )
					list.append( clear );
				else if( api.data[o][i].samples ) for(var j=0; j<api.data[o][i].samples.length; j++)
					list.append( pre( api.data[o][i].samples[j] ) );
				if( api.data[o][i].divider )
					list.append( divide );
			}
		}
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
