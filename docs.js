show_docs_menu = function(){

  toggle_ids[0] = 'general';
  toggle_ids[1] = 'objects';
  toggle_ids[2] = 'shapes';
  toggle_ids[3] = 'data';

  page.append('<div id="api_menu"></div>');
  $('#api_menu').append('<ul id="api_items"></ul>');

  for( var i=0; i<toggle_ids.length; i++ ){

    // create section wrapper
    $('#api_items').append('<li><div id="api_item_'+toggle_ids[i]+'" class="api_item"></div></li>');
    // create header element
    $('#api_item_'+toggle_ids[i]).append('<h5 id="api_item_h_'+toggle_ids[i]+'">'+toggle_ids[i]+'</h5>');
    // create list
    $('#api_item_'+toggle_ids[i]).append('<ul id="'+toggle_ids[i]+'"></ul>');

    // add collapse listener
    $('#api_item_h_'+toggle_ids[i])[0].toggleIndex = numToggles;
    toggles[i] = false;
    numToggles++;
    $('#api_item_h_'+toggle_ids[i]).click(function(){
      toggle_menu( toggle_ids[this.toggleIndex], this.toggleIndex );
    });

    // disable text highlighting
    document.getElementById('api_item_'+toggle_ids[i]).onselectstart = function() { return false }
  }

  append_api_item_sub_no_api('general','Setup');

  //append_api_item_sub('functions','iio libraries');
  append_api_item_sub('general', api.AppControl);
  append_api_item_sub('general', api.Libraries);

  append_api_item_sub('objects', api.Interface );
  append_api_item_sub('objects', api.Drawable );
  append_api_item_sub('objects', api.App );

  append_api_item_sub('shapes', api.Shape );
  append_api_item_sub('shapes', api.Quad );
  append_api_item_sub('shapes', api.Line );
  append_api_item_sub('shapes', api.Ellipse );
  append_api_item_sub('shapes', api.Polygon );
  append_api_item_sub('shapes', api.Text );
  // append_api_item_sub('shapes', api.Rectangle );
  append_api_item_sub('shapes', api.Grid );

  append_api_item_sub('data', api.Vector );
  append_api_item_sub('data', api.Color );
  append_api_item_sub('data', api.Gradient );
  append_api_item_sub('data', api.Sound);
  append_api_item_sub('data', api.Sprite);
  append_api_item_sub('data', api.SpriteMap);
  append_api_item_sub('data', api.Loader);
}

show_unit_test = function( parent, test_function, test_class, id ){
  parent.append( h2(test_class+' Unit Tests', "api/"+test_class+'/unit-tests') );
  parent.append('<h3>click any app to view the source code</h3>');
  iioapps = document.createElement('div');
  iioapps.className = 'iioapps';
  parent.append(iioapps);
  if (test_class === 'Collisions')
    iio.test.create_canvas_grid( 200, 3, 4, id );
  else iio.test.create_canvas_grid( 100, 5, 6, id );
  iio.test.show_tests( test_function, test_class, id );
}

show_api_basics = function(){
  show_docs_menu();

  page.append('<div id="api_content"></div>');
  var api_content = $('#api_content');

  api_content.append(h1('iio.js Documentation'));
  api_content.append('<div class="arrows_btns"><img class="big-arrow left-arrow" src="img/arrow.png"/><p style="min-width:190px" class="big-btn"><a id="download-iio" style="padding:15px 26px" class="btn-iio" href="https://github.com/iioinc/iio.js/archive/master.zip">Download v1.4</a></p></div>');

  api_content.append(p('iio.js is a '+kwd('dependency free')+' JavaScript library for HTML5 Canvas applications. iio.js provides an environment for '+kwd('object oriented development')+' and '+kwd('automated object managment')+'.'));

  api_content.append(p('All code samples in the documentation are assumed to be running with access to an '+a('App')+', unless full code is provided.'));

  api_content.append(p('The iio.js library needs to be included in order to run an iio application. The file can be included locally, or directly from this website:'));

  api_content.append(p(red('minified')+': '+kwd('http://iio.js.org/iio.min.js')));
  api_content.append(p(red('unminified')+': '+kwd('http://iio.js.org/iio.js')));
  api_content.append(p(red('debug')+': '+kwd('http://iio.js.org/iio.debug.js')));
  api_content.append(divide);

  api_content.append(p('Below is an example of a simple iio application, running full screen on a basic HTML page. You can copy and paste this code directly into a new file and the iio app will run if you open the file with a browser:'));

  api_content.append(h2('Hello World'));
  api_content.append(pre("&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;body&gt;\n&lt;script type='text/javascript'\n\tsrc='http://iio.js.org/iio.js'&gt;\n&lt;/script&gt;\n&lt;script type='text/javascript'&gt;\n\n// app is an App object\nHelloWorld = function( app ){\n\n\t// create and add a text object\n\tapp.create( app.center, 'Hello World' );\n\n}\n\n// start the app fullscreen\niio.start( HelloWorld );\n&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;"));
}

show_api = function( api ){
  show_docs_menu();
  page.append('<div id="api_content"><div id="'+'api/'+api.classname.replace(/ /g,"-").toLowerCase()+'" class="overview_anchor"></div></div>');
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

    // UNIT TESTS
    if( api.unitTests )
      show_unit_test( $('#api_content'), api.unitTests, api.classname )

    // FUNCTIONS & PROPERTIES
    for(var o in api.data ){
      var encoded = o;
      encoded = encoded.replace(/ /g,"-").toLowerCase();
      api_content.append( h2( o, "api/"+api.classname.replace(/ /g ,"-").toLowerCase()+'/'+encoded ) );
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
  if(toggles[i]) $('#'+id).slideDown(400);
  else $('#'+id).slideUp(400);
  toggles[i] = !toggles[i];
}

append_api_item_sub_no_api = function( parent, href ){
  var title = href;
  href = title.replace(/ /g, '-');
  var html = '<li class="api_item_sub"><a href="#api">'+title+'</a>';
  html += '<ul class="api_property"></ul>';
  html += '</li>';
  $('#'+parent).append(html);
}
append_api_item_sub = function( parent, api ){
  var title = api.classname;
  var href = title.replace(/ /g, '-').toLowerCase();
  var html = '<li class="api_item_sub"><a id="api_item_sub_h_'+parent+'-'+href+'"'
    + ( ( current_hash.indexOf('#api/'+href+'/' ) >= 0 ) ? ' class="hashed"' : '' )
    +'>'+title+'</a>';
  html += '<ul class="api_property_list" id="'+parent+'-'+href+'">';
  html += '<li class="api_property first_prop"><a href="#api/'+href+'"'
  + ( ( current_hash === '#api/'+href ) ? ' class="hashed"' : '' )
  +'>Overview</a></li>';
  var html_prop;
  for( var prop in api.data ){
    html_prop = prop.replace(/ /g,'-').toLowerCase();
    html += '<li class="api_property"><a href="#api/'+href+'/'+html_prop+'"'
    + ( ( current_hash === '#api/'+href+'/'+html_prop ) ? ' class="hashed"' : '' )
    +'>'+prop+'</a></li>';
  }
  html += '</ul></li>';
  $('#'+parent).append(html);

  // add collapse listener
  toggle_ids[numToggles] = parent+'-'+href;
  $('#api_item_sub_h_'+parent+'-'+href)[0].toggleIndex = numToggles;
  $('#api_item_sub_h_'+parent+'-'+href).click(function(){
    toggle_menu( toggle_ids[this.toggleIndex], this.toggleIndex );
  });
  if( !(current_hash.indexOf('#api/'+href+'/') >= 0) && current_hash != '#api/'+href ){
    $('#'+parent+'-'+href).hide();
    toggles[numToggles] = true;
  } else toggles[numToggles] = false;
  numToggles++;
  //$('#'+parent+'-'+href).slideUp();
}
