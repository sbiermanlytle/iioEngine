var api = {
  AppControl: {
    classname: 'App control',
    overview: [
      "The primary entry point for an iio appliation should be wrapped in a main application function that provides access to iio's centralized app management system.",
      "This structure also allows the use of the "+kwd('iio.start')+' method.'
    ],
    samples: [
      "// define a main application function\n// (app is an App object)\nHelloWorld = function( app ){\n\t// objects added to app will be \n\t// drawn and managed automatically\n\tapp.add( ... );\n}",
    ],
    data: {
      'Start and Stop': [
        { // start()
          definition: 'iio.start( '+kwd('function')+' appTitle )',
        },{
          definition: 'iio.start( '+kwd('function')+' appTitle, '+kwd('string')+' canvasId )',
        },{
          definition: ':: '+small('returns ')+a('App'),
          descriptions: [
            "Starts an iio application fullscreen or on an existing canvas, returning the associated App object.",
            "Adds an App reference to the global "+kwd('iio.apps')+' array.'
          ],
          samples: [
            "// start the app fullscreen\niio.start( HelloWorld );\n\n// start the app on an existing canvas\niio.start( HelloWorld, 'canvasId' );"
          ],
          divider: true
        },{ // stop()
          definition: 'iio.stop()',
          descriptions: ['Stop all running apps in '+kwd('iio.apps')+'.' ]
        },{
          definition: 'iio.stop( '+a('App')+' app )',
          descriptions: ['Stop the given app.'],
          samples: ['// stop all running apps\niio.stop()', '// start an app\nvar app = iio.start( MyApp );\n// stop the app\niio.stop( app );\n// equivalent action\napp.stop();']
        }
      ],
      'App Settings': [
        { // start()
          definition: 'iio.start([ '+kwd('function')+' appTitle, '+kwd('object')+' settings ])',
        },{
          definition: 'iio.start([ ... ], '+kwd('string')+' canvasId )',
        },{
          definition: ':: '+small('returns ')+a('App'),
          descriptions: [ "iio apps can also be started with settings that are known to the app." ],
          samples: [
            "// define a new iio app\nHelloWorld = function( app, settings ){\n\tvar mVar = settings.mVar;\n}\n\n// start the app fullscreen with settings\niio.start([ HelloWorld, { mVar: mVal } ]);\n\n// start the app on an existing canvas\niio.start([ HelloWorld, { mVar: mVal } ], 'canvasId' );"
          ]
        }
      ]
    }
  },
  Libraries: {
    classname: 'Libraries',
    overview: [
      'iio includes some static functions and standalone libraries with utility functions.',
    ],
    data: {
      'core': [
        { // random()
          definition: 'iio.random()',
          descriptions: ['Returns a random '+kwd('number')+' in the range '+kwd('[0,1)')],
          samples: [
            "// get a random number between [0,1)\nvar num = iio.random();"
          ],
          divider: true
        },
        { // random(min,max)
          definition: 'iio.random( '+kwd('number')+' min, '+kwd('number')+' max )',
          descriptions: ['Returns a random '+kwd('number')+' in the range '+kwd('[min,max)')],
          samples: [
            "// get a random number between [-10,100)\nvar num = iio.random( -10, 100 );"
          ],
          divider: true
        },
        { // randomInt(min,max)
          definition: 'iio.randomInt( '+kwd('integer')+' min, '+kwd('integer')+' max )',
          descriptions: ['Returns a random '+kwd('integer')+' in the range '+kwd('[min,max)')],
          samples: [
            "// get a random integer between [0,10)\nvar num = iio.randomInt( 0, 10 );"
          ],
          divider: true
        },
        { // centroid(src,max)
          definition: 'iio.centroid( '+kwd('Array')+'<'+kwd('Vector')+'> vertices ) :: '+small('returns ')+a('Vector'),
          descriptions: [
            'Returns the centroid of the given vertices.'
          ],
          samples: [
            "// get the centroid of a polygons vertices\nvar centroid = iio.centroid( polygon.vs );"
          ],
          divider: true
        },
        { // load(src,max)
          definition: 'iio.load( '+kwd('string')+' source, '+kwd('function')+' onLoad )',
          descriptions: [
            'Loads the file from the given path, calling the given callback when complete.'
          ],
          samples: [
            "// load an image and add attach it to a new quad when complete\nvar image = iio.load( 'path/image.png', function(){\n\tapp.add(new iio.Quad({ img: image }));\n});"
          ],
          divider: true
        },
        { // inherit
          definition: 'iio.inherit( '+kwd('function')+ ' child, '+kwd('function')+ ' parent )',
          descriptions: [
            'Use prototypal inheritance to subclass a given parent with a given child.',
            'Child classes have direct access to parent properties and functions, and they can override parent functions by redefining them. Browse the '+ahref('source code of iio Shapes', 'https://github.com/sbiermanlytle/iioEngine/tree/master/src/shapes')+' for more examples.'
          ],
          samples: [
            "// define a child class\niio.QuadChild = function(){\n\tthis.QuadChild.apply(this, arguments)\n};\n// set the parent of the child class\niio.inherit(iio.QuadChild, iio.Quad);\n// create a super access to the parents functions\niio.QuadChild.prototype._super = iio.Quad.prototype;\n\n// define a constructor\niio.QuadChild.prototype.QuadChild = function() {\n\t// call the parent constructor\n\tthis._super.Quad.call(this,iio.merge_args(arguments));\n\t//...\n}"
          ],
          divider: true
        },{ // merge
          definition: 'iio.merge( '+kwd('object')+ ' obj1, '+kwd('object')+ ' obj2 ) :: '+small('returns ')+kwd("object"),
          descriptions: [
            'Merge all properties of '+kwd("obj2")+' into '+kwd('obj1')+', then return '+kwd('obj1')+'.',
          ],
          samples: [
            "// merge ob2 properites into obj1\nvar obj1 = iio.merge( obj1, obj2 );"
          ],
          divider: true
        },
        { // addEvent()
          definition: 'iio.addEvent( '+kwd('object')+' element, '+kwd('string')+' event, '
        },{
          definition: kwd('function')+' callback, '+kwd('boolean')+' useCapture )',
        },{
          definition: ':: '+small('returns ')+kwd('boolean'),
          descriptions: [
            'Attaches a JavaScript '+ahref('EventListener','http://www.w3schools.com/js/js_htmldom_eventlistener.asp')+' to the given element.'
          ],
          samples: [
            "// attach a mouse move event listner\niio.addEvent(app.canvas, 'mousemove', function(event){\n\tvar mousePos = app.eventVector(event);\n\t//...\n}"
          ]
        },
      ],
      'is': [
        { // string()
          definition: 'iio.is.string( '+kwd('anything')+' ) :: '+small('returns ')+kwd('boolean'),
          descriptions: ['Returns '+kwd('true')+' if the given value is a '+kwd('string')+'. Otherwise returns '+kwd('false')],
          samples: [
            "// check if a variable is a string\nif( iio.is.string(value) )\n\t//..."
          ],
          divider: true
        },{ // number()
          definition: 'iio.is.number( '+kwd('anything')+' ) :: '+small('returns ')+kwd('boolean'),
          descriptions: ['Returns '+kwd('true')+' if the given value is a '+kwd('number')+'. Otherwise returns '+kwd('false')],
          samples: [
            "// check if a variable is a number\nif( iio.is.number(value) )\n\t//..."
          ],
          divider: true
        },{ // fn()
          definition: 'iio.is.fn( '+kwd('anything')+' ) :: '+small('returns ')+kwd('boolean'),
          descriptions: ['Returns '+kwd('true')+' if the given value is a '+kwd('function')+'. Otherwise returns '+kwd('false')],
          samples: [
            "// check if a variable is a function\nif( iio.is.fn(value) )\n\t//..."
          ],
          divider: true
        },{ // between()
          definition: 'iio.is.between( '+kwd('number')+' value, min, max )',
        },{
          definition: ':: '+small('returns ')+kwd('boolean'),
          descriptions: ['Returns '+kwd('true')+' if the given value is within the given range. Otherwise returns '+kwd('false')+'.'],
          samples: [
            "// check if a value is within a range\nif( iio.is.between(10, min, max) )\n\t//..."
          ]
        }
      ],
      'key': [
        { // string()
          definition: 'iio.key.string( '+kwd('Event')+' event ) :: '+small('returns ')+kwd('string'),
          descriptions: [
            'Returns the '+kwd('string')+' representation of the given event '+kwd('keyCode')+'.'
          ],
          samples: [
            "// get the key string from an event\nvar key = iio.key.string( event )"
          ]
        },
      ],
      /*'convert': [
        { // color()
          definition: 'iio.convert.color( '+kwd('string')+' colorName ) :: '+small('returns ')+a('Color'),
          descriptions: [
            'Returns a new Color corresponding to the given '+ahref('color name', 'http://www.w3schools.com/cssref/css_colornames.asp')+'.'
          ],
          samples: [
            "// convert a string to a color\nvar redColor = iio.convert.color( 'red' );"
          ]
        },
        { // vector()
          definition: 'iio.convert.vectors( '+kwd('string')+' colorName ) :: '+small('returns ')+a('Color'),
          descriptions: [
            'Returns a new Color corresponding to the given '+ahref('color name', 'http://www.w3schools.com/cssref/css_colornames.asp')+'.'
          ],
          samples: [
            "// convert a string to a color\nvar redColor = iio.convert.color( 'red' );"
          ]
        },
      ]*/
    }
  },
  Extras: {
    classname: 'Extras',
    overview: [
      'iio has a '+kwd('debug')+' build with some useful debugging features and an extension file that attaches it to '+ahref('Box2dWeb','https://github.com/hecht-software/box2dweb')+', a robust 2d physics engine used in many commercial applications.'
    ],
    data: {
      /*'Debugger': [

      ],*/
      'Box2d': [
        {
          descriptions: [
            "iio Engine acts solely as a rendering engine when attached to "+ahref('Box2dWeb','https://github.com/hecht-software/box2dweb')+". Box2d applications can be developed normally, using iio's "+kwd('set')+' function to add display properties to shapes.',
            kwd('b2Shape')+' and '+kwd('b2Joint')+' are given access to all of '+a('Shape')+" display properties and functions.",
            'For Box2d documentation, visit '+ahref('Box2DFlash', 'http://www.box2dflash.org/docs/2.1a/reference/')+', the implementation that Box2dWeb was ported from.',
            "To see a full example demo of a Box2d app using iio Engine, checkout the Box2d demo: "+ahref('iioengine.com/#demos/box2d', 'http://iioengine.com/#demos/box2d'),
            red("NOTE:")+' '+kwd("box2dweb.js")+' must be loaded before '+kwd('iio Engine')+'.'
          ], divider: true
        },
        { // b2World
          definition: kwd('b2World')+' App.b2World',
          descriptions: [ 'The attached b2World.']
        },{ // b2Scale
          definition: kwd('number')+' App.b2Scale',
          descriptions: [ 'The scale of the '+kwd('b2World')+'.']
        },{ // b2Pause
          definition: kwd('boolean')+' App.b2Pause',
          descriptions: [ 'A flag indicating whether the '+kwd('b2World')+' is paused.' ],
          divider: true
        },
        { // addB2World
          definition: 'App.addB2World( '+kwd('b2World')+' world ) :: '+small('returns ')+kwd('b2World'),
          descriptions: [
            'Add a '+kwd('b2World')+' to the app, so that the app can track '+kwd('b2World')+' updates, and draw each frame.'
          ],
          samples: [
            '// add a new b2World to app\nvar world = app.addB2World(new b2World(\n\tnew b2Vec2(0, 10), //gravity\n\ttrue //allow sleep\n));'
          ],
          divider: true
        },
        { // b2Loop
          definition: 'App.b2Loop( '+kwd('number')+' fps, '+kwd('function')+' callback )'
        },{
          definition:':: '+small('returns ')+kwd('this'),
          descriptions: [
            'Start a loop at the given framerate that calls '+kwd('b2World.Step')+' and the given callback.'
          ],
          samples: [
            '// start a b2World loop at 60fps\napp.b2Loop(60, function(){\n\t//...\n}'
          ],
          divider: true
        },
        { // b2Loop
          definition: 'App.pauseB2World( '+kwd('boolean')+' pause ) :: '+small('returns ')+kwd('this'),
          descriptions: [
            'Pause or unpause the b2World, depending upon the given value.'
          ],
          samples: [
            '// pause a b2World\napp.pauseB2World( true );',
            '// unpause a b2World\napp.pauseB2World( false );'
          ]
        }
      ],
    }
  },
  Interface: {
    classname: 'Interface',
    overview: [ "A root for all classes in iio. Every method defined in Interface is available in every other class." ],
    data: {
      'Functions': [
        { // set()
          definition: 'set( '+kwd('Object: ')+' p0, p1, ... , '+kwd('boolean')+' suppressDraw )',
        },{
          definition: ':: '+small('returns ') + kwd('this'),
          descriptions: [
            'Assigns the property and value of each given object to this object, converts shorthand declarations into correct property data types, and redraws the parent application, unless '+kwd('suppressDraw')+' is given as true.',
            a('Vector')+' properties may be given as arrays: '+kwd('[ x, y ]'),
            a('Color')+' properties may be given as hexadecimal strings or '+ahref('CSS color', 'http://www.w3schools.com/cssref/css_colornames.asp')+' keywords, ei. '+kwd("'blue'"),
            'For optimal performance in logic loops or in looping apps, pass '+kwd('true')+' as the last parameter to suppress the redraw.'
          ],
          samples: [
            "// set an objects color to blue\nobj.set({ color: 'blue' });",
            "// set multiple properties\nobj.set({\n\tcolor: 'red',\n\twidth: 100,\n\tmVar: mValue\n});",
            "// set with multiple objects\nvar props0 = { color: '#FFF' };\nvar props1 = {\n\tpos: [ 20,20 ],\n\tvel: [ 1,1 ],\n}\nobj.set( props0, props1, {\n\tacc: [ 0.1,0 ]\n});",
            "// set properties and supress the redraw\nobj.set({\n\tcolor: 'red',\n\t//...\n}, true );"
          ],
          divider: true
        },
        {  // clone()
          definition: 'clone() :: ' + small('returns ') + kwd('Object'),
          descriptions: [ 'returns a deep copy of this object (a new object with equal properties).' ],
          samples: [ "var objClone = obj.clone();" ],
          divider: true
        },
        {  // toString()
          definition: 'toString() :: ' + small('returns ') + kwd('String'),
          descriptions: [ 'returns a string that lists all properties and values in this object.' ],
          samples: [ "var objString = obj.toString();" ]
        }
      ]
    }
  },
  Drawable: {
    classname: 'Drawable',
    inherits: [ 'Interface' ],
    overview: [ "A root class for all drawable and managed object classes in iio." ],
    data: {
      'Position Properties': [
        {  // pos
          definition: a('Vector') + ' pos',
          descriptions: [ "xy position coordinates." ],
          samples: [ 
            "// access a drawable's position coordinates\nvar pos = drawable.pos;\nvar x = drawable.pos.x;\nvar y = drawable.pos.y;",
            "// set a drawable's position\ndrawable.set({ pos: [ 10,20 ] });\ndrawable.set({ pos: new iio.Vector( 10,20 ) });"
          ],
          divider: true
        },{  // width
          definition: kwd('number') + ' width',
          descriptions: [ "Pixel width." ]
        },{  // height
          definition: kwd('number') + ' height',
          descriptions: [ "Pixel height." ],
          samples: [ 
            "// access a drawable's width value\nvar width = drawable.width;",
            "// access a drawable's height value\nvar height = drawable.height;",
          ]
        },
      ],
      'Display Properties': [
        {  // color
          definition: a('Color') + '::' + a('Gradient') + ' color',
          descriptions: [ "Draw color." ],
          samples: [ 
            "// access a drawable's color\nvar color = drawable.color;",
            "// set a drawable's color to a Color\ndrawable.set({ color: 'blue' });",
            "// set a drawable's color to a Gradient\ndrawable.set({ color: new iio.Gradient({\n\tstart: [ 0, -50 ] ),\n\tend: [ 0, 50 ],\n\tstops: [\n\t\t[ 0, 'black' ],\n\t\t[ 0.5, 'blue' ],\n\t\t[ 1, 'blue' ]\n\t]\n})});"
          ]
        },
      ],
      'Loop Properties': [
        {
          definition: kwd('function')+' onUpdate',
          descriptions: [
            "A custom callback run before every draw in a looping drawable.",
            "A reference to the object is passed as a parameter."
          ],
          samples: [
            "// randomize the color before every draw\ndrawable.onUpdate = function(drawable){\n\tdrawable.color.randomize();\n}"
          ],
          divider: true,
        },
        {  // loops
          definition: kwd('Array')+'<'+kwd('object') + '> loops',
          descriptions: [ "Array of loop objects." ],
          samples: [ 
            "// access loop properties\nvar loopId = drawable.loops[0].id;\nvar loopCallback = drawable.loops[0].fn;",
          ],
          divider: true,
        },
        {  // paused
          definition: kwd('boolean') + ' paused',
          descriptions: [ "A toggle indicating whether or not this objects "+kwd('loops')+' are running.' ],
          samples: [ 
            "// access a drawable's paused property\nvar paused = drawable.paused;",
            "// pause or unpause\ndrawable.pause();"
          ]
        }
      ],
      'Parent Properties': [
        {  // app
          definition: a('App') + ' app',
          descriptions: [ "Associated App." ],
          samples: [ "// access a drawable's app\nvar app = drawable.app;" ],
          divider: true,
        },{  // ctx
          definition: ahref('Context','https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D') + ' ctx',
          descriptions: [ "Associated Canvas 2d Context." ],
          samples: [ "// access a drawable's ctx\nvar ctx = drawable.ctx;" ],
          divider: true,
        },{  // parent
          definition: a('Drawable') + ' parent',
          descriptions: [ "Parent object." ],
          samples: [ "// access a drawable's parent\nvar parent = drawable.parent;" ]
        }
      ],
      'Child Properties': [
        {  // objs
          definition: kwd('Array')+'<'+a('Shape') + '> objs',
          descriptions: [ "Array of child shapes." ],
          samples: [ 
            "// access a drawable's objs\nvar obj0 = drawable.objs[0];\nvar obj1 = drawable.objs[1];",
            "// add a shape to the array\ndrawable.add( shape );",
            "// remove a shape from the array\ndrawable.rmv( shape );",
            "// remove all shapes from the array\ndrawable.clear();"
          ],
          divider: true
        },{  // collisions
          definition: kwd('Array')+'<'+kwd('Object') + '> collisions',
          descriptions: [ "Array of collision definitions." ],
          samples: [ 
            "// access collision object properties\nvar group0 = drawable.collisions[0][0];\nvar group1 = drawable.collisions[0][1];\nvar collisionCallback = drawable.collisions[0][2];\n"
          ]
        }
      ],
      'Position Functions': [
        { // localize()
          definition: 'localize( '+a('Vector')+' v ) :: '+small('returns ')+a('Vector'),
        },{
          definition: 'localize( '+kwd('number')+' x, '+kwd('number')+' y ) :: '+small('returns ')+a('Vector'),
          descriptions: [
            'Returns the given vector, localized relative to the objects position, rotation, and origin.',
            'Effectively a combination of '+kwd('localFrameVector')+' and '+kwd('localizeRotation')+'.'
          ],
          samples: [
            'var localV = drawable.localize(v);'
          ],
          divider: true
        },{ // localizeRotation()
          definition: 'localizeRotation( '+a('Vector')+' v, '+kwd('boolean')+' reverse )'
        },{
          definition: ':: '+small('returns ')+a('Vector'),
          descriptions: [
            'Rotates the given vector about the objects origin to the objects rotation.' 
          ],
          samples: [
            'var rotatedV = drawable.localizeRotation(v);'
          ],
          divider: true
        },{ // localFrameVector()
          definition: 'localFrameVector( '+a('Vector')+' v ) :: '+small('returns ')+a('Vector'),
          descriptions: [
            'Returns the given vector relative to the objects position.' 
          ],
          samples: [
            'var localV = drawable.localFrameVector(v);'
          ],
          divider: true
        },{ // LocalLeft()
          definition: 'localLeft() :: '+small('returns ') + kwd('number'),
        },{  // localRight()
          definition: 'localRight() :: '+small('returns ') + kwd('number'),
        },{  // localTop()
          definition: 'localTop() :: '+small('returns ') + kwd('number'),
        },{ // localBottom()
          definition: 'localBottom() :: '+small('returns ') + kwd('number'),
          descriptions: [ "Returns the x or y coordinate relative to the objects position." ],
          samples: [ "var left = drawable.localLeft();\nvar right = drawable.localRight();\nvar top = drawable.localTop();\nvar bottom = drawable.localBottom();" ]
        },
      ],
      'Input Functions': [
        { // onClick
          definition: 'onClick( '+a('Drawable')+' this, '+kwd('Event')+' event, '+a('Vector')+' pos )',
        },{  // onMouseDown
          definition: 'onMouseDown( '+a('Drawable')+' this, '+kwd('Event')+' event, '+a('Vector')+' pos )',
        },{  // onMouseUp
          definition: 'onMouseUp( '+a('Drawable')+' this, '+kwd('Event')+' event, '+a('Vector')+' pos )',
        },{
          definition: ':: ' + small('returns ') + kwd('boolean'),
          descriptions: [
            "Input handlers that are called when the object is clicked.",
            kwd('Event')+' is a JavaScript Event object.',
            "Note that this function only runs by default on "+a('App')+' and App.'+kwd('objs')+'.'
          ],
          samples: [ 
            "// detect when the app is clicked\napp.onClick = function( app, event, pos ){\n  // handle input...\n}",
            "// detect when an object added to app is clicked\napp.add( new iio.Rectangle({\n  //...\n  onMouseDown: function( rectangle, event, pos ){\n    // handle input...\n  })\n});",
            "// simulate a mouse release on the app\napp.onMouseUp( app, null, app.center );"
          ]
        },
      ],
      'Child Functions': [
        {  // clear()
          definition: 'clear( '+kwd('boolean')+' noDraw ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'Clears the '+kwd('objs')+' array and cancels all loops in the cleared objects. Redraws the associated '+a('App')+' if noDraw is undefined or false.' ],
          samples: [
            "// clear all app objects\napp.clear();",
            "// clear all child objects in a Rectangle\n// suppress the redraw\nrectangle.clear( true );"
          ],
          divider: true
        },
        {  // add()
          definition: 'add( '+a('Shape')+' shape, '+kwd('boolean')+' noDraw ) :: ' + small('returns ') + a('Shape')
        },{
          definition: 'add( [ '+a('Shape')+' s0, '+a('Shape')+' s1, ... ], '+kwd('boolean')+' noDraw )'
        },{
          definition: ' :: ' + small('returns ') + kwd('Array'),
          descriptions: [ 'Adds the given shape or array of shapes to this objects '+kwd('objs')+' array in '+kwd('z')+' index order, then returns the argument.',
            'Adds a '+kwd('z')+' value of '+kwd('0')+' if '+kwd('z')+' is undefined.',
            'Redraws the associated '+a('App')+' if '+kwd('noDraw')+' is undefined or false.'
          ],
          samples: [ 
            "// add a shape\nobj.add( shape );",
            "// create a Rectangle and add it\nvar shape = obj.add( new iio.Rectangle({\n\tpos: app.center,\n\twidth: 100,\n\tcolor:'red'\n}));",
            "// add a shape and suppress its redraw\nobj.add( shape, true );",
            "// add multiple shapes\nobj.add( [ shape0, shape1, shape2 ] );"
          ],
          divider: true
        },
        {  // rmv()
          definition: 'rmv( '+a('Shape')+' shape, '+kwd('boolean')+' noDraw ) :: ' + small('returns ') + a('Shape')
        },{
          definition: 'rmv( [ '+a('Shape')+' s0, '+a('Shape')+' s1, ... ], '+kwd('boolean')+' noDraw )'
        },{
          definition: ' :: ' + small('returns ') + kwd('Array')
        },{
          definition: 'rmv( '+kwd('int')+' index, '+kwd('boolean')+' noDraw ) :: ' + small('returns ') + a('Shape'),
          descriptions: [ 'Removes the given shape, array of shapes, or shape at the given index from this objects '+kwd('objs')+' array, then returns the removed shape or array of shapes.',
            'Stops all associated loops from the removed shape and all of its child shapes.',
            'Removes the shape from all collision references in this object.',
            'Redraws the associated '+a('App')+' if '+kwd('noDraw')+' is undefined or false.' 
          ],
          samples: [ 
            "// remove a shape\nobj.rmv( shape );",
            "// remove a shape at index 4\nobj.rmv( 4 );",
            "// remove multiple shapes and suppress the redraw\nobj.rmv( [ shape0, shape1 ], true );"
          ],
          divider: true
        },
        {  // create( p0, p1, ... )
          definition: 'create( '+kwd('p0')+', '+kwd('p1')+', ... ) :: ' + small('returns ') + kwd('Object'),
          descriptions: [ 'Classifies given values by their type and creates and adds a new object with correct property value pairs. Possible objects created and returned can be: '+a('Vector')+', '+a('Color')+', '+a('Line')+', '+a('Text')+', '+a('Ellipse')+', '+a('Polygon')+', '+a('Quad')+', '+a('Grid')+'.' ],
          samples: [ 
            "// create a Vector\nvar vector = app.create( [10,20] );",
            "// create a Color\nvar color = app.create( 'red' );",
            "// create a Text at app center\nvar text = app.create( app.center, 'hello world', 'red' );",
            "// create a Quad at app center\nvar rectangle = app.create( app.center, 50, 'red' );",
            "// create a Line\nvar line = app.create( 'red', {\n\tvs: [\n\t\t[ 10,10 ],\n\t\t[ 80,80 ]\n\t]\n});",
            "// create a circle at app center\nvar circle = app.create( app.center, 'red', {\n\tradius: 20\n});"
          ],
          divider: true
        },
        {  // collision()
          definition: 'collision( '+a('Shape')+' s0, '+a('Shape')+' s1, '+kwd('function')+' callback )'
        },{
          definition: ' :: ' + small('returns ') + kwd('int')
        },{
          definition: 'collision( '+kwd('Array')+' g0, '+kwd('Array')+' g1, '+kwd('function')+' callback )'
        },{
          definition: ' :: ' + small('returns ') + kwd('int'),
          descriptions: [ 'Creates a collision definition which tests collisions between two '+a('Shape')+' objects, two arrays of '+a('Shape')+' objects, or a mix of both types, and runs the given callback function, passing the two colliding objects as parameters.' ],
          samples: [ 
            "// add a collision object\ndrawable.collision( objA, objB, callback );\n\n// add a collision object with arrays\n// and an inline callback function\nvar groupA = [ shape0, shape1, shape2 ];\nvar groupB = [ shape3, shape4 ];\nvar index = drawable.collision( groupA, groupB, function( A, B ){\n\t//...\n});"
          ]
        }
      ],
      'Loop Functions': [
        {  // loop()
          definition: 'loop() :: ' + small('returns ') + kwd('int')
        },{
          definition: 'loop( '+kwd('number')+' fps ) :: ' + small('returns ') + kwd('int')
        },{
          definition: 'loop( '+kwd('function')+' callback ) :: ' + small('returns ') + kwd('int')
        },{
          definition: 'loop( '+kwd('number')+' fps, '+kwd('function')+' callback ) :: ' + small('returns ') + kwd('int'),
          descriptions: [ 'Initiates a loop with or without a given callback at 60fps or the given framerate. Returns the new loop id.' ],
          samples: [
            "// add a 60 fps update loop\nvar loopId =  drawable.loop();",
            "// add a 40 fps update loop\nvar loopId =  drawable.loop( 40 );",
            "// add a 60 fps update with a callback\nvar loopId = drawable.loop( callback );",
            "// add a 40 fps update with a callback\nvar loopId = drawable.loop( 40, callback );",
            "// cancel a loop\niio.cancelLoop( loopId );",
          ],
          divider: true
        },{ // pause()
          definition: 'pause() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'Pause all loops in the '+kwd('loops')+' array.' ],
        },{ // unPause()
          definition: 'unPause() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'play all paused loops in the '+kwd('loops')+' array.' ],
          samples: [
            "// pause loops\ndrawable.pause();",
            "// play paused loops\ndrawable.unPause();"
          ],
          divider: true
        },{ // togglePause
          definition: 'togglePause() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'Pauses or unpauses all loops in the '+kwd('loops')+' array, depending upon the value of the '+kwd('paused')+' property.' ],
          samples: [
            "// pause or unpause\ndrawable.togglePause();"
          ],
        }
      ]
    }
  },
  App: {
    classname: 'App',
    inherits: [ 'Drawable', 'Interface' ],
    overview: [ 
      'A HTML Canvas wrapper that manages the updating and rendering of attached '+a('Shape')+' objects.',
      "An initilized "+a('App')+" is passed to a custom iio script whenever "+kwd('iio.start')+" is called."
    ],
    samples: [
      "// define a new script to receive\n// an instance of App\nvar MyApp = function( app ){\n\t//...\n}\n// start the script\niio.start( MyApp );"
    ],
    data: {
      'Properties':[
        {  // canvas
          definition: ahref('Canvas', "http://www.w3schools.com/html/html5_canvas.asp") + ' canvas',
          descriptions: [ "Associated HTML Canvas element." ],
          samples: [ "// access an app's canvas\nvar canvas = app.canvas;" ],
          divider: true,
        },{  // center
          definition: a('Vector') + ' center',
          descriptions: [ "The center coordinate of the app." ],
          samples: [ "// access an app's center coordinate\nvar center = app.center;" ]
        }
      ],
      'Functions':[
        {  // draw()
          definition: 'draw( '+kwd('boolean')+' noClear ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 
            "Draws the background color and all objects in "+kwd('objs')+' in '+kwd('z')+' index order.',
            "The canvas will first be cleared unless "+kwd('noClear')+' is '+kwd('true')+'.'
          ],
          samples: [ 
            "// redraw the app\napp.draw();",
            "// redraw the app without clearing the last render\napp.draw( true );"
          ],
          divider: true
        },{  // stop()
          definition: 'stop() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 
            'Clears the app child objects and cancels all app loops and sounds.',
          ],
          samples: [ 
            "// start an App\nvar app = iio.start( iioApp );\n// stop an iio app\napp.stop();"
          ],
          divider: true,
        },{  // trueVs
          definition: 'trueVs() :: ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
          descriptions: [ 
            'Adds the array '+kwd('vs')+' to the app, and populates it with the vector of each corner, then returns an a copy of that array.'
          ],
          samples: [ 
            "// get the vertices of an app\nvar appCorners = app.trueVs();\n// access the new vs property\ncorners = app.vs;"
          ],
          divider: true
        },{  // eventVector()
          definition: 'eventVector( '+kwd('Event')+' event ) :: ' + small('returns ') + a('Vector'),
          descriptions: [ 
            'Returns a Vector representation of the events position, relative to the apps position.',
          ],
          samples: [ 
            "// get the event position, relative to the apps position\napp.onClick = function( app, event, pos ){\n\tvar eventPos = app.eventVector(event);\n\t// note that pos is equivalent to the eventPos vector\n\t// and already provided\n}"
          ]
        }
      ],
      'Input Handling': [
        { // onResize
          definition:'onResize()',
          descriptions: [
            "Called when the app is resized, the "+kwd('width')+', '+kwd('height')+', and '+kwd("center")+' will already be updated to the new dimensions.'
          ],
          samples: [
            "// peform actions on app resize event\napp.onResize = function(){\n\t//...\n}"
          ],
          divider: true
        },{ // onClick
          definition: 'onClick( '+a('App')+' app, '+kwd('Event')+' event, '+a('Vector')+' pos )',
          descriptions: [
            "Called when the app is clicked.",
            "The event parameter is a JavaScript Event object",
            "Note that every "+a('Shape')+' added to app also has an '+kwd('onClick')+' callback.'
          ],
          samples: [
            "// peform action when the app is clicked\napp.onClick = function( app, event, pos ){\n\t//...\n}"
          ],
          divider: true
        },{ // onMouseDown
          definition: 'onMouseDown( '+a('App')+' app, '+kwd('Event')+' event, '+a('Vector')+' pos )',
        },{ // onMouseUp
          definition: 'onMouseUp( '+a('App')+' app, '+kwd('Event')+' event, '+a('Vector')+' pos )',
          descriptions: [
            "Called on a mouse down or up event over app.",
            "The event parameter is a JavaScript Event object",
            "Note that every "+a('Shape')+' added to app also has '+kwd('onMouseDown')+' and '+kwd('onMouseUp')+' callbacks.'
          ],
          samples: [
            "// peform action when the app is clicked\napp.onMouseDown = function( app, event, pos ){\n\t//...\n}",
            "// peform action when the mouse is released over app\napp.onMouseUp = function( app, event, pos ){\n\t//...\n}"
          ],
          divider: true
        },{ // mouse movement
          definition: 'Mouse Movement',
          descriptions: [ "Mouse movement is not tracked automatically. An event listener must be attached to the canvas in order to receive input:" ],
          samples: [
            "// attach a mouse move event listner\niio.addEvent(app.canvas, 'mousemove', function(event){\n\tvar mousePos = app.eventVector(event);\n\t//...\n}"
          ],
          divider: true
        },{ // onKeyDown
          definition: 'onKeyDown( '+kwd('Event')+' event, '+kwd('string')+' key )',
        },{ // onKeyUp
          definition: 'onKeyUp( '+kwd('Event')+' event, '+kwd('string')+' key )',
          descriptions: [
            "Called when a key is pressed or released.",
            kwd('key')+' is the string representation of the JavaScript Event '+kwd('keyCode')+'.'
          ],
          samples: [
            "// peform action when a key is pressed\napp.onKeyDown = function( app, key ){\n\t//...\n}",
            "// peform action when a key is released\napp.onKeyUp = function( app, key ){\n\t//...\n}",
          ],
          divider: true
        },{ // onScroll
          definition: 'onScroll( '+kwd('Event')+' event, '+kwd('string')+' key )',
          descriptions: [
            "Called when the page is scrolled.",
            kwd('key')+' is the string representation of the JavaScript Event '+kwd('keyCode')+'.',
            'Note that the apps position vector will already be updated according to the new page origin.'
          ],
          samples: [
            "// peform action when the app is scrolled\napp.onScroll = function( app, key ){\n\t//...\n}"
          ],
        }
      ]
    }
  },
  Shape: {
    classname: "Shape",
    inherits: [ 'Drawable', 'Interface' ],
    overview: [
      "A root class for all shapes managed by an "+a('App')+" and drawn on the Canvas.",
      "Initializes routines for movement, input handling, and rendering."
    ],
    data: {
      'Translation Properties': [
        { // vel
          definition: a('Vector') + ' vel',
          descriptions: [ "Velocity in px/update" ]
        },{
          definition: a('Vector') + ' acc',
          descriptions: [ "Accleration in px/update" ],
          samples: [ 
            "// access a shape's velocity and accleration\nvar velocity = shape.vel;\nvar acceleration = shape.acc;",
            "// set a shape's velocity and acceleration directly\nshape.vel = new iio.Vector( 2,3 );\nshape.acc = new iio.Vector( .02, .03 );",
            "// set a shape's velocity and acceleration using set\nshape.set({ vel: [ 2,3 ] });\nshape.set({ acc: [ .02, .03 ] });"
          ],
          divider: true
        },{ // bounds
          definition: kwd('object')+' bounds',
          descriptions: [
            "A data structure containing boundary values and callbacks.",
            "If a "+kwd('callback')+' is '+kwd('undefined')+' or returns '+kwd('false')+' for a boundary, the shape is removed when the boundary is crossed.',
          ],
          samples: [
            "// specify all four bounds\nvar bounds = {\n\tleft: {\n\t\tbound: 0,\n\t\tcallback: reverseX,\n\t},\n\tright: {\n\t\tbound: 0,\n\t\tcallback: reverseX,\n\t},\n\ttop: {\n\t\tbound: 0,\n\t\tcallback: reverseY,\n\t},\n\tbottom: {\n\t\tbound: 0,\n\t\tcallback: reverseY,\n\t}\n}",
            "// create a shape with bounds\nvar shape = new iio.Quad( bounds,{\n\t//...\n});"
          ]
        }
      ],
      'Rotation Properties': [
        { // rotation
          definition: kwd('number') + ' rotation',
          descriptions: [ "Rotation in radians." ],
          samples: [ 
            "// access a shape's rotation\nvar rotation = shape.rotation;",
            "// set a shape's rotation directly\nshape.rotation = Math.PI / 2;",
            "// set a shape's rotation using set\nshape.set({ rotation: Math.PI / 2 });"
          ],
          divider: true
        },{ // rVel
          definition: kwd('number') + ' rVel',
          descriptions: [ "Rotational velocity in radians/update" ]
        },{  // rAcc
          definition: kwd('number') + ' rAcc',
          descriptions: [ "Rotational accleration (torque) in radians/update" ],
          samples: [ 
            "// access a shape's rVel and rAcc\nvar rotational_velocity = shape.rVel;\nvar torque = shape.rAcc;",
            "// set a shape's rVel and rAcc directly\nshape.rVel = .01;\nshape.rAcc = .001;",
            "// set a shape's rVel and rAcc using set\nshape.set({ rVel: .01 });\nshape.set({ rAcc: .001 });"
          ],
          divider: true
        },{ // origin
          definition: a('Vector') + ' origin',
          descriptions: [ "The origin of rotation." ],
          samples: [ 
            "// access a shape's origin\nvar origin = shape.origin;",
            "// set a shape's origin directly\nshape.origin = new iio.Vector( 20,20 );",
            "// set a shape's origin using set\nshape.set({ origin: [ 20,20 ] });"
          ]
        }
      ],
      'Display Properties': [
        { // hidden
          definition: kwd('boolean')+' hidden',
          descriptions: [ "A toggle that suppresses rendering and collision detections." ],
          samples: [ 
            "// access a shape's hidden value\nvar hidden = shape.hidden;",
            "// set a shape's hidden value directly\nshape.hidden = true;",
            "// set a shape's hidden value using set\nshape.set({ hidden: true });"
          ],
          divider: true
        },{ // alpha
          definition: kwd('number')+' alpha',
          descriptions: [ "A value controlling opacity in the range "+kwd('[0,1]') ],
          samples: [ 
            "// access a shape's alpha value\nvar alpha = shape.alpha;",
            "// set a shape's alpha value directly\nshape.alpha = 0.5;",
            "// set a shape's alpha value using set\nshape.set({ alpha: 0.4 });"
          ],
        },
      ],
      'Outline Properties': [
        { // outline
          definition: a('Color')+'|'+a('Gradient')+' outline',
          descriptions: [ "The color of a shape outline.", a('Line')+" is the only object that does not have an "+kwd('outline')+'.' ],
          samples: [ 
            "// access a shape's outline color\nvar outline_color = shape.outline;",
            "// set a shape's outline color directly\nshape.outline = iio.Color.red();",
            "// set a shape's outline color using set\nshape.set({ outline: 'red' });"
          ],
          divider: true
        },{ // lineWidth
          definition: kwd('number')+' lineWidth',
          descriptions: [ 
            "The width of all lines and outlines that are drawn for the object.", 
            a('Line')+" uses "+kwd('width')+" instead of "+kwd('lineWidth')+" for its size value." 
          ],
          samples: [ 
            "// access a shape's lineWidth\nvar lineWidth = shape.lineWidth;",
            "// set a shape's lineWidth directly\nshape.lineWidth = 5;",
            "// set a shape's lineWidth using set\nshape.set({ lineWidth: 5 });"
          ],
          divider: true,
        },{ // lineCap
          definition: kwd('String')+' lineCap',
          descriptions: [ 
            "A string keyword indicating the shape of the cap of drawn lines or dashes.",
            "Possible values are: "+kwd("'square'")+', '+kwd("'butt'")+', '+kwd("'round'"),
            ],
          samples: [ 
            "// access a shape's line cap\nvar lineCap = shape.lineCap;",
            "// set a shape's line cap directly\nshape.lineCap = 'round';",
            "// set a shape's line cap using set\nshape.set({ lineCap: 'square' });"
          ],
          divider: true
        },{ // dash
          definition: kwd('Array') + '|'+kwd('number')+' dash',
          descriptions: [ "A value or array of values specifying a dash width and spacing in pixels for the drawing of lines." ],
          samples: [ 
            "// access a shape's dash\nvar dash = shape.dash;",
            "// set a shape's dash directly\nshape.dash = 20;",
            "// set a shape's dash using set\nshape.set({ dash: [ 20,15,30 ] });"
          ],
        },
      ],
      'Shadow Properties': [
        { // shadow
          definition: a('Color') + '|'+a('Gradient') +' shadow',
          descriptions: [ "The shadow color." ],
          samples: [ 
            "// access a shape's shdow color\nvar shadow_color = shape.shadow;",
            "// set a shape's shadow color directly\nshape.shadow = new iio.Color.black();",
            "// set a shape's shadow color using set\nshape.set({ shadow: 'black' });"
          ],
          divider: true
        },{  // shadowBlur
          definition: kwd('number') + ' shadowBlur',
          descriptions: [ "Shadow color blur distance in pixels." ],
          samples: [ 
            "// access a shape's shadow blur and rAcc\nvar shadowBlur = shape.shadowBlur;",
            "// set a shape's shadow blur and rAcc directly\nshape.shadowBlur = 15;",
            "// set a shape's shadow blur and rAcc using set\nshape.set({ shadowBlur: 15 });"
          ],
          divider: true
        },{ // shadowOffset
          definition: a('Vector') + ' shadowOffset',
          descriptions: [ "The x and y offset distance of the shadow." ],
          samples: [ 
            "// access a shape's shadowOffset\nvar shadowOffset = shape.shadowOffset;",
            "// set a shape's shadowOffset directly\nshape.shadowOffset = new iio.Vector( 20,20 );",
            "// set a shape's shadowOffset using set\nshape.set({ shadowOffset: [ 20,20 ] });"
          ]
        }
      ],
      'Image Properties': [
        { // img
          definition: ahref('Image', 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image')+' img',
          descriptions: [ "The attached image." ],
          samples: [ 
            "// access a shape's image\nvar img = shape.img;",
            "// set a shape's image directly\nshape.img = new Image();\nshape.img.src = 'path/image.png'",
            "// set a shape's image using set\nshape.set({ img: 'path/image.png' });"
          ]
        }
      ],
      'Animation Properties': [
        { // anims
          definition: kwd('Array')+'<'+a('Sprite')+'> anims',
          descriptions: [ "An array of animations." ],
          samples: [
            "// access a shape's animations\nvar anims = shape.anims;",
            "// set a shape's animations directly\nshape.anims = [ anim0, anim1, anim2 ];",
            "// set a shape's animations using set\nshape.set({ anims: [ anim0, anim1, anim2 ] });"
          ],
          divider: true
        },{ // animKey
          definition: kwd('integer')+' animKey',
          descriptions: [ "Index of the active animation object in "+kwd('anims')+"." ],
          samples: [
            "// access a shape's animation key\nvar animKey = shape.animKey;",
            "// set a shape's animation index directly\nshape.animKey = 2;",
            "// set a shape's animation index using set\nshape.set({ animKey: 2 });"
          ],
          divider: true
        },{ // animFrame
          definition: kwd('integer')+' animFrame',
          descriptions: [ "Index of the active animation frame in "+kwd('anims')+"." ],
          samples: [
            "// access a shape's animation frame index\nvar animFrame = shape.animFrame;",
            "// set a shape's animation frame index directly\nshape.animFrame = 2;",
            "// set a shape's animation frame index using set\nshape.set({ animFrame: 2 });"
          ],
          divider: true,
        },{ // animRepeat
          definition: kwd('integer')+' animRepeats',
          descriptions: [ "The number of times the animation will repeat.",
            "If "+kwd('undefined')+", the animation will repeat indefinitely." ],
          samples: [
            "// access a shape's animation repeat value\nvar animRepeats = shape.animRepeats;",
            "// set a shape's animation repeat value directly\nshape.animRepeats = 4;",
            "// set a shape's animation repeat value using set\nshape.set({ animRepeats: 4 });"
          ],
          divider: true,
        },{ // onAnimComplete
          definition: kwd('boolean')+' onAnimComplete',
          descriptions: [ "A callback run when the animation finishes." ],
          samples: [
            "// access a shape's animation repeat value\nvar onAnimStop = shape.onAnimStop;",
            "// set a shape's animation repeat value directly\nshape.onAnimStop = true;",
            "// set a shape's animation repeat value using set\nshape.set({ onAnimStop: true });"
          ],
          divider: true,
        },{ // fade
          definition: kwd('Object')+' fade',
          descriptions: [ "An object defining a shrink animation, which will continually adjust the shape's "+kwd('alpha')+" value.",
            "If "+kwd('fade.callback')+' is undefined, the shape will remove itself from its parent when the animation is finished.' ],
          samples: [
            "// access a shape's fade animation\nvar fade = shape.fade;\nvar fadeSpeed = shape.fade.speed;\nvar fadeLowerBound = shape.fade.lowerBound;\nvar fadeUpperBound = shape.fade.upperBound;\nvar fadeCallback = shape.fade.callback;",
            "// set a fade animation directly\nshape.fade = {\n\tspeed: .3,\n\tlowerBound: .2,\n\tupperBound: .9,\n\tcallback: function(shape) {\n\t\t//...\n\t}\n};",
            "// set a fade animation with set\nshape.set({\n\tfade:\n\t\tspeed: .3,\n\t\tlowerBound: .2,\n\t\tupperBound: .9,\n\t\tcallback: function(shape) {\n\t\t\t//...\n\t\t}\n\t}\n)};",
          ],
          divider: true
        },{ // shrink
          definition: kwd('Object')+' shrink',
          descriptions: [ "An object defining a fade animation, which will continually adjust the shape's "+kwd('width')+" and "+kwd('height')+", or equivalent values.",
            "If "+kwd('shrink.callback')+' is undefined, the shape will remove itself from its parent when the animation is finished.' ],
          samples: [
            "// access a shape's shrink animation\nvar shrink = shape.shrink;\nvar shrinkSpeed = shape.shrink.speed;\nvar shrinkLowerBound = shape.shrink.lowerBound;\nvar shrinkUpperBound = shape.shrink.upperBound;\nvar shrinkCallback = shape.shrink.callback;",
            "// set a shrink animation directly\nshape.shrink = {\n\tspeed: .3,\n\tlowerBound: .2,\n\tupperBound: .9,\n\tcallback: function(shape) {\n\t\t//...\n\t}\n};",
            "// set a shrink animation with set\nshape.set({\n\tshrink:\n\t\tspeed: .3,\n\t\tlowerBound: .2,\n\t\tupperBound: .9,\n\t\tcallback: function(shape) {\n\t\t\t//...\n\t\t}\n\t}\n)};",
          ]
        },
      ],
      'Position Funtions': [
        {  // left()
          definition: 'left() :: ' + small('returns ') + kwd('number'),
        },{ // right()
          definition: 'right() :: ' + small('returns ') + kwd('number'),
        },{ // top()
          definition: 'top() :: ' + small('returns ') + kwd('number'),
        },{ // bottom()
          definition: 'bottom() :: ' + small('returns ') + kwd('number'),
        },{
          descriptions: [ 'returns the leftmost/rightmost x coordinate of the shape, or the highest/lowest y coordinate.' ],
          samples: [ "var left = obj.left();",
            "var right = obj.right();",
            "var top = obj.top();",
            "var bottom = obj.bottom();",
            ],
        },
      ],
      'Animation Funtions': [
        { // setSprite
          definition: 'setSprite( '+kwd('String')+' name, '+kwd('boolean')+' suppressDraw )',
        },{
          definition: 'setSprite( '+a('Sprite')+' sprite, '+kwd('boolean')+' suppressDraw )',
        },{
          definition: ':: ' + small('returns ') + kwd('this'),
          descriptions: [ "Sets the shape's current sprite to the given sprite or the sprite in "+kwd('anims')+" with the given name.",
            "Redraws the parent app unless "+kwd('suppressDraw')+' is defined',
            "If a "+a('Sprite')+' is given, it is inserted at the front of '+kwd('anims')+'.',
          ],
          samples: [
            "// set the sprite to an existing sprite attachment\nshape.setSprite('walking');",
            "// set the sprite to a new sprite\n// and suppress the redraw\nshape.setSprite( spritemap.map({\n\t//...\n}, true );",
          ],
          divider: true,
        },{  // stopAnim()
          definition: 'stopAnim() :: ' + small('returns ') + kwd('this'),
          descriptions: [ "Stops the active animations." ],
          samples: [ "// stop a shape's animations \nshape.stopAnim();" ],
          divider: true,
        },{  // nextFrame()
          definition: 'nextFrame( '+a('Shape')+' shape ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ "Advances the "+kwd('animFrame')+", returns to index "+kwd("0")+" if the last frame is active." ],
          samples: [ "// advance to the next frame\nshape.nextFrame(shape);" ],
          divider: true,
        },{  // prevFrame()
          definition: 'prevFrame( '+a('Shape')+' shape ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ "Returns to the previous "+kwd('animFrame')+", activates the last "+kwd('animFrame')+" if currently at index "+kwd("0")+"." ],
          samples: [ "// return to the previous frame\nshape.prevFrame(shape);" ],
        },
      ],
    }
  },
  Quad: {
    classname: 'Quad',
    inherits: [ 'Shape','Drawable','Interface' ],
    overview: [ "A simplified rectangle shape defined by a position, width, and height. All functions are as precise as "+a('iio.Rectangle')+", except for collision detection - "+kwd('Quads do not account for rotation in collisions by default')+'.',
      'Rotated collision detection can be activated with the '+kwd('rotatedVs')+' flag', 
      'Quads use fewer calculations than any other Shape, so they should be used whenever possible.'],
    unitTests: iio.test.Quad,
    data: {
      'Constructor': [
        {
          definition: 'Quad( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create a quad with the properties of any number of given objects." ],
          samples: [
            "// create a new square quad\nvar quad = new iio.Quad({\n\tpos: app.center,\n\twidth: 40,\n\tcolor: 'red',\n});",
            "// create a new rectangle quad\nvar quad = new iio.Quad({\n\tpos: app.center,\n\twidth: 40,\n\theight: 60,\n\tcolor: 'red',\n});",
            "// add a quad to the app\napp.add( quad );",
            "// create a new square quad and add it to app\nvar quad = app.create( app.center, 40, 'red' );",
            ]
        }
      ],
      'Properties': [
        {  // width
          definition: kwd('number')+' width',
          descriptions: [ "The width of the rectangular quad or the size of the square quad." ],
          samples: [
            "// access the width\nvar width = quad.width;",
            "// set the width directly\nquad.width = 40;",
            "// set the width using set\nquad.set({ width: 40 });",
          ],
          divider: true
        },
        {  // height
          definition: kwd('number')+' height',
          descriptions: [ "The height of the quad." ],
          samples: [
            "// access the height\nvar height = quad.height;",
            "// set the height directly\nquad.height = 60;",
            "// set the height using set\nquad.set({ height: 60 });",
          ],
          divider: true
        },
        {  // rotateVs
          definition: kwd('boolean')+' rotateVs',
          descriptions: [ "Rotate vertices when calculating collisions and checking bounds. Increases the number of calculations." ],
          samples: [
            "// access the value\nvar rotatedVs = quad.rotatedVs;",
            "// set the value\nquad.rotatedVs = true;",
            "// set the value using set\nquad.set({ rotatedVs: true });",
          ]
        }
      ],
      'Functions': [
        {  // trueVs
          definition: 'trueVs( '+kwd('boolean')+' rotateVs ) :: ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
          descriptions: [ 
            'Adds the array '+kwd('vs')+' to the quad, and populates it with the vector of each corner, relative to the quads position, then returns an array of corner vertices relative to app origin.',
            "Returned corner vectors will not be rotated unless "+kwd('rotateVs')+' or '+kwd('this.rotateVs')+' is '+kwd('true')+'.'
          ],
          samples: [ 
            "// get the global vertices of a quad\nvar corners = quad.trueVs();\n// access the new vs property\ncorners = quad.vs;",
            "// get the rotated global vertices of a quad\nvar rotatedCorners = quad.trueVs( true );"
          ],
          divider: true
        },
        {  // setSize
          definition: 'setSize( '+kwd('number')+' width, '+kwd('number')+' height ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 
            'Sets the width and height of the square or rectangle.'
          ],
          samples: [ 
            "// set the width of a square\nsquare.setSize( 30 );",
            "// set the width and height of an rectangle\nrectangle.setSize( 30, 40 );",
          ]
        }
      ]
    }
  },
  Line: {
    classname: 'Line',
    inherits: [ 'Shape','Drawable','Interface' ],
    overview: [ "A line shape defined by two vectors, a start and end position ("+kwd('vs')+').' ],
    unitTests: iio.test.Line,
    data: {
      'Constructor': [
        {
          definition: 'Line( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create a line with the properties of any number of given objects." ],
          samples: [
            "// create a new line\n// with global coordinates\nvar line = new iio.Line({\n\t// set position coordinates\n\t// relative to app 0,0\n\tvs: {\n\t\t// start position\n\t\t[ 10, 10 ],\n\t\t// end position\n\t\t[ 100, 100 ],\n\t},\n\tcolor: 'red',\n\twidth: 5\n});",
            "// create a new line\n// with local coordinates\nvar line = new iio.Line({\n\t// set line shape position\n\t// relative to app 0,0\n\tpos: app.center,\n\t// set line coordinates\n\t// relative to pos\n\tvs: {\n\t\t// start position\n\t\t[ 10, 10 ],\n\t\t// end position\n\t\t[ 100, 100 ]\n\t},\n\tcolor: 'red',\n\twidth: 5\n});",
            "// add a line shape to the app\napp.add( line );",
            "// create a new line and add it to an app\napp.create( 10, 'red', {\n\tvs: [ app.center, [10,10] ],\n});",
            ]
        }
      ],
      'Position Properties': [
        { // width
          definition: kwd('Array')+' width',
          descriptions: [ "The width of the line." ],
          samples: [
            "// access a line's width\nvar line_width = line.width;",
            "// set a line's width\nline.width = 5;"
          ],
          divider: true
        },
        {  // vs
          definition: kwd('Array')+'<'+a('Vector')+'> vs',
          descriptions: [ "An array of two coordinates defining the start and end positions of the line." ],
          samples: [
            "// access the start and end positions of a line\nvar startPos = line.vs[0];\nvar endPos = line.vs[1];",
            "// set the start and end positions of a line\nline.vs[0] = new iio.Vector( 10,10 );\nline.vs[1] = new iio.Vector( 100,100 );",
            "// set the start and end positions of a line using set\nline.set( { \n\tvs: [\n\t\t[ 10,10 ],\n\t\t[ 100,100 ]\n\t]\n} );"
          ],
          divider: true
        },
        {  // vels
          definition: kwd('Array')+'<'+a('Vector')+'> vels',
          descriptions: [ "An array of velocity vectors associated with the position coordinates in "+kwd('vs')+'.' ],
          samples: [
            "// access the coordinate velocities of a line\nvar start_pos_vel = line.vels[0];\nvar end_pos_vel = line.vels[1];",
            "// set the coordinate velocities of a line\nline.vels[0] = new iio.Vector( 1,1 );\nline.vels[1] = new iio.Vector( -1,-1 );",
            "// set the start and end positions of a line using set\nline.set({ \n\tvs:[\n\t\t[ 1,1 ],\n\t\t[ -1,-1 ]\n\t]\n});"
          ]
        },
      ],
      'Bezier Properties': [
        {  // bezier
          definition: kwd('Array')+'<'+a('Vector')+'> bezier',
          descriptions: [ 
            "An array of two coordinates defining the positions of two bezier handles.",
            "If "+kwd('pos')+' is specified, bezier handles are positioned locally, otherwise they are positioned globally.' 
          ],
          samples: [
            "// access the bezier handle positions of a line\nvar bezier0_pos = line.bezier[0];\nvar bezier1_pos = line.bezier[1];",
            "// set the bezier handle positions of a line\nline.bezier[0] = new iio.Vector( 10,10 );\nline.bezier[1] = new iio.Vector( 100,100 );",
            "// set the start and end positions of a line using set\nline.set( { \n\tbezier: [\n\t\t[ 10,10 ],\n\t\t[ 100,100 ]\n\t]\n} );"
          ],
          divider: true
        },
        {  // bezierVels
          definition: kwd('Array')+'<'+a('Vector')+'> bezierVels',
          descriptions: [ "An array of velocity vectors associated with the bezier handle position coordinates in "+kwd('bezier')+'.' ],
          samples: [
            "// access the bezier handle velocities\nvar bezier0_vel = line.bezierVels[0];\nvar bezier1_vel = line.bezierVels[1];",
            "// set the bezier handle velocities\nline.bezierVels[0] = new iio.Vector( 1,1 );\nline.bezierVels[1] = new iio.Vector( -1,-1 );",
            "// set the bezier handle velocities using set\nline.set( { \n\tbezierVels: [\n\t\t[ 1,1 ],\n\t\t[ -1,-1 ]\n\t]\n} );"
          ],
          divider: true
        },
        {  // bezierAccs
          definition: kwd('Array')+'<'+a('Vector')+'> bezierAccs',
          descriptions: [ "An array of acceleration vectors associated with the bezier handle position coordinates in "+kwd('bezier')+'.' ],
          samples: [
            "// access the bezier handle acclerations\nvar bezier0_acc = line.bezierAccs[0];\nvar bezier1_acc = line.bezierAccs[1];",
            "// set the bezier handle acclerations\nline.bezierAccs[0] = new iio.Vector( 1,1 );\nline.bezierAccs[1] = new iio.Vector( -1,-1 );",
            "// set the bezier handle acclerations using set\nline.set( { \n\tbezierAccs: [\n\t\t[ 1,1 ],\n\t\t[ -1,-1 ]\n\t]\n} );"
          ],
        }
      ],
      'Functions': [
        {  // trueVs
          definition: 'trueVs() :: ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
          descriptions: [ 
            'Returns a rotated copy of '+kwd('vs')+' relative to app origin.'
          ],
          samples: [ 
            "// get the global vertices of a line\nvar corners = line.trueVs();",
          ]
        }
      ]
    },
  },
  Ellipse: {
    classname: 'Ellipse',
    inherits: [ 'Shape','Drawable','Interface' ],
    overview: [ "An ellipse shape defined by a position and 1 or 2 radii." ],
    unitTests: iio.test.Ellipse,
    data: {
      'Constructor': [
        {
          definition: 'Ellipse( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create an ellipse with the properties of any number of given objects." ],
          samples: [ 
            "// create a new ellispe\nvar ellipse = new iio.Ellipse({\n\tpos: app.center,\n\tradius: 40,\n\tvRadius: 60,\n\tcolor: 'red'\n});",
            "// add the ellipse to the app\napp.add( ellipse );",
            "// create a new circle and add it to the app\napp.create( app.center, 'red',{ radius: 10 });"
            ]
        }
      ],
      'Properties': [
        {  // radius
          definition: kwd('number')+' radius',
          descriptions: [ "The radius of a circle, or the horizontal radius of an ellipse." ],
          samples: [
            "// access the radius\nvar radius = ellipse.radius;",
            "// set the radius\nellipse.radius = 40;"
          ],
          divider: true
        },
        {  // vRadius
          definition: kwd('number')+' vRadius',
          descriptions: [ "The verticle radius of an ellipse." ],
          samples: [
            "// access the vertical radius\nvar verticalRadius = ellipse.vRadius;",
            "// set the vertical radius\nellipse.vRadius = 60;"
          ]
        }
      ],
      'Functions': [
        {  // setSize
          definition: 'setSize( '+kwd('number')+' width, '+kwd('number')+' height ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 
            'Sets the width and height of the circle or ellipse.'
          ],
          samples: [ 
            "// set the width of a circle\ncircle.setSize( 30 );",
            "// set the width and height of an ellipse\nellipse.setSize( 30, 40 );",
          ]
        }
      ]
    }
  },
  Polygon: {
    classname: 'Polygon',
    inherits: [ 'Shape','Drawable','Interface' ],
    overview: [ "A polygon shape defined by an array of vertices. An optional "+kwd('pos')+' property allows for relative local coordinate positioning instead of global positioning.' ],
    unitTests: iio.test.Polygon,
    data: {
      'Constructor': [
        {
          definition: 'Polygon( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create a polygon with the properties of any number of given objects." ],
          samples: [ 
            "// create a new polygon\n// with global coordinates\nvar polygon = new iio.Polygon({\n\t// set position coordinates\n\t// relative to app 0,0\n\tvs: {\n\t\t[ 50, 30 ],\n\t\t[ 70, 70 ],\n\t\t[ 30, 70 ]\n\t},\n\tcolor: 'red'\n});",
            "// create a new polygon\n// with local coordinates\nvar polygon = new iio.Polygon({\n\t// set polygon shape position\n\t// relative to app 0,0\n\tpos: app.center,\n\t// set polygon coordinates\n\t// relative to pos\n\tvs: {\n\t\t[ 0, -20 ],\n\t\t[ 20, 20 ],\n\t\t[ -20, 20 ]\n\t},\n\tcolor: 'red'\n});",
            "// add a polygon shape to the app\napp.add( polygon );"
            ]
        }
      ],
      'Properties': [
        {  // vs
          definition: kwd('Array')+'<'+a('Vector')+'> vs',
          descriptions: [ "An array of coordinates defining the vertices of the polygon. Can be any length greater than 2." ],
          samples: [
            "// access a polygon's vertices\nvar vertex0 = polygon.vs[0];\nvar vertex1 = polygon.vs[1];\nvar vertex2 = polygon.vs[2];\n//...",
            "// set a polygon's vertices\npolygon.vs[0] = new iio.Vector( 0, 20 );\npolygon.vs[1] = new iio.Vector( 20, 20 );\npolygon.vs[2] = new iio.Vector( -20, 20 );\n//...",
            "// set a polygon's vertices using set\npolygon.set( {\n\tvs: [\n\t\t[ 0, 20 ],\n\t\t[ 20, 20 ],\n\t\t[ -20, 20 ],\n\t\t//...\n\t]\n} );",
            "// create a new polygon and add it to an app\napp.create( 'red', {\n\tvs: [ app.center, [10,10], [app.center.x,10] ],\n});",
          ]
        }
      ],
      'Functions': [
        {  // trueVs
          definition: 'trueVs() :: ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
          descriptions: [ 
            'Returns a rotated copy of '+kwd('vs')+' relative to app origin.'
          ],
          samples: [ 
            "// get the global vertices\nvar corners = polygon.trueVs();",
          ]
        }
      ]
    }
  },
  Text: {
    classname: 'Text',
    inherits: [ 'Polygon','Shape','Drawable','Interface' ],
    overview: [ "A text object defined by a position and text string." ],
    unitTests: iio.test.Text,
    data: {
      'Constructor': [
        {
          definition: 'Text( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create text with the properties of any number of given objects." ],
          samples: [ 
            "// create a new text object\nvar textShape = new iio.Text({\n\tpos: app.center,\n\ttext: 'Hello World',\n\tcolor: 'red',\n\tsize: 40,\n\tfont: 'Arial',\n\talign: 'center'\n});",
            "// add the text object to the app\napp.add( textShape );",
            "// create a new text object and add it to the app\napp.create( app.center, 50, 'red', 'hello world' );"
            ]
        }
      ],
      'Properties': [
        {  // text
          definition: kwd('String')+' text',
          descriptions: [ "A string identifying the text object's printed characters." ],
          samples: [
            "// access the text string\nvar textValue = textShape.text;",
            "// set the text string\ntextShape.text = 'new text value';"
          ],
          divider: true
        },
        { // size
          definition: kwd('number')+' size',
          descriptions: [ "The font size." ],
          samples: [
            "// access font size\nvar fontSize = text.size;",
            "// set the font size\ntext.size = 60;"
          ],
          divider: true
        },
        { // font
          definition: kwd('String')+' font',
          descriptions: [ "The font of the printed text." ],
          samples: [
            "// access font\nvar font = text.font;",
            "// set the font\ntext.font = 'Arial';"
          ],
          divider: true
        },
        { // align
          definition: kwd('String')+' align',
          descriptions: [ "A string keyword indicating the alignmet of the printed text.",
            "Possible values are: "+kwd("'center'")+', '+kwd("'left'")+', '+kwd("'right'")+', '+kwd("'start'")+', or '+kwd("'end'")+'.' ],
          samples: [
            "// access text alignment\nvar alignment = text.align;",
            "// set the text alignment\ntext.align = 'center';"
          ],
          divider: true
        },
        { // showCursor
          definition: kwd('boolean')+' showCursor',
          descriptions: [ "A flag that activates the text cursor." ],
          samples: [
            "// access showCursor\nvar showCursor = text.showCursor;",
            "// create a text object with a cursor\nvar text = new iio.Text({\n\tshowCursor: true,\n\tcolor: 'red',\n\ttext: 'hello world',\n});"
          ],
          divider: true
        },
        { // cursor
          definition: kwd('Object')+' cursor',
          descriptions: [ "A "+a('Line')+' with cursor properties.',
            kwd('cursor.index')+': the index of the cursor in the '+kwd('text')+' string',
            kwd('cursor.shift')+': a flag shifting input keys into uppercase and secondary characters',
          ],
          samples: [
            "// access text cursor\nvar cursor = text.cursor;",
            "// set text cursor properties\ntext.cursor.index = 0;\ntext.cursor.shift = true;"
          ]
        }
      ],
      'Functions': [
        {  // onKeyDown()
          definition: 'onKeyDown( '+kwd('string')+' key, '+kwd('number')+' index, '+kwd('boolean')+' shift )',
        },{
          definition: ':: ' + small('returns ') + kwd('number'),
          descriptions: [
            'Modifies the '+kwd('text')+' by inserting the given key character, or deleting the previous/next character if backspace/delete are given.',
            'If '+kwd('index')+' is '+kwd('undefined')+', the index value of the '+kwd('cursor')+' object is used.',
            'The '+kwd('shift')+' flag forces the key in uppercase or secondary character mode. If '+kwd('undefined')+', the shift value of the '+kwd('cursor')+' object is used.',
            'Returns the new '+kwd('cursor')+' index.',
            'Note that this function does not run by default, you must call it in the '+a('App')+'.'+kwd('onClick')+' callback.'
          ],
          samples: [ 
            "// create a text object with a cursor\nvar text = app.add(new iio.Text({\n\t//...\n\tshowCursor: true,\n});\n\n// modify the text on key presses\napp.onKeyDown = function(event, key){\n\ttext.onKeyDown(key);\n}",
          ],
          divider: true,
        },{ // onKeyUp()
          definition: 'onKeyUp( '+kwd('string')+' key )',
          descriptions: [
            'If '+kwd('shift')+' is given, sets '+kwd('cursor.shift')+' to false.'
          ],
          samples: [
            "// pass key up events to a text object\napp.onKeyUp = function(event, key){\n\ttext.onKeyDown(key);\n}"
          ],
          divider: true,
        },{ // inferSize()
          definition: 'inferSize( '+ahref('Context','https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D')+' context ) :: returns '+kwd('this'),
          descriptions: [
            'Update the '+kwd('vs')+', '+kwd('width')+', and '+kwd('height')+' based on the current '+kwd('text')+' value.',
            'This function should be called whenever '+kwd('text')+' changes, if collision detection is needed.',
            'If '+kwd('context')+' is '+kwd('undefined')+', the parent app context is used.'
          ],
          samples: [
            '// update the text size values\ntext.inferSize();'
          ],
          divider: true,
        },{ // charWidth()
          definition: 'charWidth( '+kwd('number')+' index ) :: returns '+kwd('number'),
          descriptions: [ 
            'Returns the width of the character in '+kwd('text')+" at the given index, based on the objects current "+kwd('size')+'.'
          ],
          samples: [
            "// set the text value\ntextObj.text = 'hello';\n// get the width of h\nvar hWidth = textObj.charWidth(0);\n// get the width of e\nvar eWidth = textObj.charWidth(1);"
          ],
          divider: true,
        },{ // charX()
          definition: 'charX( '+kwd('number')+' index ) :: returns '+kwd('number'),
          descriptions: [ 
            'Returns the x coordinate position of the character in '+kwd('text')+' at the given index, relative to the objects position and alignment.'
          ],
          samples: [
            "// set the text value\ntextObj.text = 'hello';\n// get the x coordinate of h\nvar hx = textObj.charX(0);\n// get the x coordinate of e\nvar ex = textObj.charX(1);"
          ],
        }
      ]
    }
  },
  Grid: {
    classname: 'Grid',
    inherits: [ 'Quad','Shape','Drawable','Interface' ],
    overview: [ "A grid shape defined by a position, number of columns, number of rows, and either a cell resolution vector or a width and height." ],
    unitTests: iio.test.Grid,
    data: {
      'Constructor': [
        {
          definition: 'Grid( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create a grid with the properties of any number of given objects." ],
          samples: [ 
            "// create a new grid\nvar grid = new iio.Grid({\n\tpos: app.center,\n\twidth: 200,\n\theight: 200,\n\tR: 3,\n\tC: 3,\n\tlineWidth: 5,\n\tcolor: 'red'\n});",
            "// add the grid to the app\napp.add( grid );",
            "// create a new grid and add it to the app\napp.create( app.center, 200, 'red',{\n\tR: 3,\n\tC: 3,\n});"
            ]
        }
      ],
      'Properties': [
        {  // R
          definition: kwd('int')+' R',
          descriptions: [ "The number of rows." ]
        },
        {  // C
          definition: kwd('int')+' C',
          descriptions: [ "The number of columns." ],
          samples: [
            "// access the number of rows and columns\nvar numRows = grid.R;\nvar numColumns = grid.C;",
            "// set the number of rows and columns\ngrid.R = 3;\ngrid.C = 3;",
            "// set the number of rows and columns with set\ngrid.set({ C:3, R:3 });"
          ],
          divider: true
        },
        {  // width
          definition: kwd('number')+' width',
          descriptions: [ "The width of the grid." ]
        },
        {  // height
          definition: kwd('number')+' height',
          descriptions: [ "The height of the grid." ],
          samples: [
            "// access the grid width and height\nvar width = grid.width;\nvar height = grid.height;",
            "// set the grid width and height\n// use set to auto adjust res\ngrid.set({\n\twidth: 200,\n\theight: 300\n});"
          ],
          divider: true
        },
        {  // res
          definition: a('Vector')+' res',
          descriptions: [ 
            "The resolution (width and height) of the grid's cells.",
            "This property is inferred upon creation if only "+kwd('width')+", "+kwd('height')+", and number of rows and columns are given.",
              "If this property is given and "+kwd('width')+" and "+kwd('height')+" are undefined, then the width and height are inferred from "+kwd('res')+'.',
              "Because of the correlation between these properties, always use "+kwd('set')+' when changing the value of '+kwd('res')+'.'
          ],
          samples: [
            "// access the grid resolution\nvar cell_width = grid.res.x;\nvar cell_height = grid.res.y;",
            "// set grid resolution using set\ngrid.set({ res: [ 30,40 ] });"
          ],
          divider: true
        },
        {  // cells
          definition: kwd('Array')+'<'+a('Quad') + '> cells',
          descriptions: [ "Array of cells." ],
          samples: [ 
            "// access a grids cells\nvar cell00 = grid.cells[0];\nvar cell01 = grid.cells[1];"
          ]
        }
      ],
      'Functions': [
        {  // onClick()
          definition: 'onClick('+a('Grid')+' this, '+kwd('Event')+' event, '+a('Vector')+' pos, '+a('Quad')+' cell)',
        },{
          definition: ':: ' + small('returns ') + kwd('boolean'),
          descriptions: [ 
            "Called when a face or edge of the Grid is clicked. "+kwd('Event')+' is a JavaScript Event object.',
            "Note that this function only runs by default on grids added directly to "+a('App')+'.',
            kwd('pos')+' is the position of the click, relative to app origin.'
          ],
          samples: [ 
            "// detect when the grid is clicked\ngrid.onClick = function( grid, event, pos, cell ){\n  // handle input...\n}",
          ],
          divider: true
        },{ // cellAt()
          definition: 'cellAt( '+kwd('number')+' x, '+kwd('number')+' y ) :: ' + small('returns ') + a('Quad'),
        },{
          definition: 'cellAt( '+a('Vector')+' v ) :: ' + small('returns ') + a('Quad'),
          descriptions: [ 
            "Returns the cell that contains the given vector.",
          ],
          samples: [ 
            "// get the cell at the given coordinates\nvar cell = grid.cellAt( 40,10 );",
            "// get the cell at the given vector\nvar cell = grid.cellAt( vector );"
          ],
          divider: true
        },{ // cellCenter()
          definition: 'cellCenter( '+kwd('number')+': row, column ) :: ' + small('returns ') + a('Quad'),
          descriptions: [ 
            "Returns the center vector of the cell at the given grid coordinates.",
          ],
          samples: [ 
            "// get the center of the first cell\nvar cellCenter = grid.cellCenter( 0,0 );"
          ]
        }
      ],
    }
  },
  // -- deprecated --
  Rectangle: {
    classname: 'Rectangle',
    inherits: [ 'Polygon','Shape','Drawable','Interface' ],
    overview: [ "A rectangle shape defined by a position, width, and height." ],
    unitTests: iio.test.Rectangle,
    data: {
      'Constructor': [
        {
          definition: 'Rectangle( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create a rectangle with the properties of any number of given objects." ],
          samples: [ 
            "// create a new rectangle\nvar rectangle = new iio.Rectangle({\n\tpos: app.center,\n\twidth: 40,\n\theight: 60,\n\tcolor: 'red'\n});",
            "// add the rectangle to the app\napp.add( rectangle );"
            ]
        }
      ],
      'Properties': [
        {  // width
          definition: kwd('number')+' width',
          descriptions: [ "The width of a rectangle or the size of a square." ],
          samples: [
            "// access the width\nvar width = rectangle.width;",
            "// set the width\nrectangle.width = 40;"
          ],
          divider: true
        },
        {  // height
          definition: kwd('number')+' height',
          descriptions: [ "The height." ],
          samples: [
            "// access the height\nvar height = rectangle.height;",
            "// set the height\nrectangle.height = 60;"
          ]
        }
      ]
    }
  },
  // ----------------
  Vector: {
    classname: 'Vector',
    inherits: [ 'Interface' ],
    overview: [ "Represents a 2D vector. Contains static and instance vector operations." ],
    data: {
      'Constructors': [
        {
          definition: 'Vector()',
          descriptions: [ "create a vector with values 0,0" ]
        },{
          definition: 'Vector( '+kwd('number')+' x, '+kwd('number')+' y )',
          descriptions: [ 'create a vector with the given x and y values' ]
        },{
          definition: 'Vector( '+a('Vector')+' v )',
          descriptions: [ 'create a vector with the values of the given vector' ],
          samples: [
            "\nvar v0 = new iio.Vector();\nvar v1 = new iio.Vector( 40, 50 );\nvar v2 = new iio.Vector( v1 );"
          ]
        }
      ],
      'Properties': [
        {
          definition: kwd('number')+' x',
          descriptions: [ "the x (horizontal) coordinate value in pixels" ]
        },{
          definition: kwd('number')+' y',
          descriptions: [ "the y (vertical) coordinate value in pixels" ],
          samples: [
            "// access the x and y values of a vector\nvar x = vector.x;\nvar y = vector.y;",
            "// set the x and y values of a vector\nvector.x = value;\nvector.y = value;"
          ]
        }
      ],
      'Static Functions': [
        { // vs
          definition: 'Vector.vs( '+kwd('Array')+'<'+kwd('number') + '|'+a('Vector')+'>'+' points )'
        },{
          definition: ':: ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
          descriptions: [ "takes an array of vectors, specified with numerical coordinates, "+a('Vector')+' objects, or a mixture of the two, and returns an array of equivalent '+a('Vector')+' objects.' ],
          samples: [ "var vectors = iio.Vector.vs( 0,0, 10,20, 50,30 );",
            "var vectors = iio.Vector.vs( 0,0, app.center, 50,30 );" ], 
          divider: true,
        },
        { // leftmost
          definition: 'Vector.leftmost( '+kwd('Array')+'<'+a('Vector')+'> vs ) :: ' + small('returns ') + a('Vector'),
        },
        { // rightmost
          definition: 'Vector.rightmost( '+kwd('Array')+'<'+a('Vector')+'> vs ) :: ' + small('returns ') + a('Vector'),
        },
        { // highest
          definition: 'Vector.highest( '+kwd('Array')+'<'+a('Vector')+'> vs ) :: ' + small('returns ') + a('Vector'),
        },
        { // lowest
          definition: 'Vector.lowest( '+kwd('Array')+'<'+a('Vector')+'> vs ) :: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns the leftmost/rightmost/lowest/highest vector in the given array of vectors.' ],
          samples: [ "var leftside = iio.Vector.leftmost( vs );",
            "var rightside = iio.Vector.rightmost( vs );",
            "var top = iio.Vector.highest( vs );",
            "var bottom = iio.Vector.lowest( vs );" ],
          divider: true,
        },
        { // length
          definition: 'Vector.length( '+kwd('number')+': x, y ) :: ' + small('returns ') + kwd('number')
        },{
          definition: 'Vector.length( '+a('Vector')+' v ) :: ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the length of the given vector.' ],
          samples: [ "var length = iio.Vector.length( 20,30 );",
            "length = iio.Vector.length( vector );" ],
          divider: true,
        },
        { // normalize
          definition: 'Vector.normalize( '+kwd('number')+': x, y ) :: ' + small('returns ') + a('Vector')
        },{
          definition: 'Vector.normalize( '+a('Vector')+' v ) :: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a normalize copy of the given vector.' ],
          samples: [ "var normalize = iio.Vector.normalize( 20,30 );",
            "normalize = iio.Vector.normalize( vector );" ],
          divider: true,
        },
        { // normalize
          definition: 'Vector.normalize( '+kwd('number')+': x, y ) :: ' + small('returns ') + a('Vector')
        },{
          definition: 'Vector.normalize( '+a('Vector')+' v ) :: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a normalize copy of the given vector.' ],
          samples: [ "var normalized = iio.Vector.normalize( 20,30 );",
            "var normalized = iio.Vector.normalize( vector );" ],
          divider: true,
        },
        { // rotate
          definition: 'Vector.rotate( '+kwd('number')+': x, y, radians )'
        },{
          definition: 'Vector.rotate( '+a('Vector')+' v, '+kwd('number')+' radians )',
        },{
          definition: ':: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a rotated copy of the given vector.' ],
          samples: [ "var rotated = iio.Vector.rotate( 20,30, Math.PI/4 );",
            "var rotated = iio.Vector.rotate( vector, Math.PI/4 );" ],
          divider: true,
        },
        { // add
          definition: 'Vector.add( '+a('Vector')+': v0, v1, ... ) :: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns the sum of all given vectors.' ],
          samples: [ "var sum = iio.Vector.add( vector0, vector1, vector2 );" ],
          divider: true,
        },
        { // sub
          definition: 'Vector.sub( '+a('Vector')+': v0, v1, ... ) :: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone of the first vector given, minus all other vectors given.' ],
          samples: [ "var v = iio.Vector.sub( vector0, vector1, vector2 );" ],
          divider: true,
        },
        { // mult
          definition: 'Vector.mult( '+a('Vector')+' v, '+kwd('number')+' factor )'
        },{
          definition: ':: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone given vector multiplied by the given factor.' ],
          samples: [ "var v = iio.Vector.mult( vector, 5 );" ],
          divider: true,
        },
        { // div
          definition: 'Vector.div( '+a('Vector')+' v, '+kwd('number')+' divisor )'
        },{
          definition: ':: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone given vector divided by the given value.' ],
          samples: [ "var v = iio.Vector.div( vector, 5 );" ],
          divider: true,
        },
        { // dot
          definition: 'Vector.dot( '+kwd('number')+': x1, y1, x2, y2 )'
        },{
          definition: 'Vector.dot( '+a('Vector')+' v, '+kwd('number')+' x2, y2 )'
        },{
          definition: 'Vector.dot( '+a('Vector')+' v0, '+a('Vector')+' v1 )'
        },{
          definition: ':: ' + small('returns ') + a('number'),
          descriptions: [ 'returns the dot product of the given vectors.' ],
          samples: [ "var dotProduct = iio.Vector.dot( 10,20, 40,60 );",
            "var dotProduct = iio.Vector.dot( vector, 10,20 );",
            "var dotProduct = iio.Vector.dot( vector0, vector1 );" ],
          divider: true,
        },
        { // lerp
          definition: 'Vector.lerp( '+kwd('number')+': x1, y1, x2, y2, interpolant )'
        },{
          definition: 'Vector.lerp( '+a('Vector')+' v, '+kwd('number')+': x, y, interpolant )'
        },{
          definition: 'Vector.lerp( '+a('Vector')+': v0, v1, '+kwd('number')+' interpolant )'
        },{
          definition: ':: ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone of the first given vector, linearly interpolated with the second given value.' ],
          samples: [ "var lerped = iio.Vector.lerp( 10,20, 40,60, 0.5 );",
            "var lerped = iio.Vector.lerp( vector, 10,20, 0.5 );",
            "var lerped = iio.Vector.lerp( vector0, vector1, 0.5);" ],
        },
      ],
      'Instance Functions': [
        { // equals
          definition: 'equals( '+kwd('number')+' x, '+kwd('number')+' y ) :: ' + small('returns ') + kwd('boolean')
        },{
          definition: 'equals( '+a('Vector')+' v ) :: ' + small('returns ') + kwd('boolean'),
          descriptions: [ "returns true if this vector's values are equal to the given values or the given vector's values" ],
          samples: [ "if (vector.equals( 20,30 ))\n\t...",
            "if (vector.equals( vector1 ))\n\t..." ],
          divider: true,
        },
        { // length
          definition: 'length() :: ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the length of the vector.' ],
          samples: [ "var vLength = vector.length();" ],
          divider: true,
        },
        { // normalize
          definition: 'normalize() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'reduces the length of the vector to 1.' ],
          samples: [ "vector.normalize();" ],
          divider: true,
        },
        { // rotate
          definition: 'rotate( '+kwd('number')+' radians ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'rotates the vector by the given radian value.' ],
          samples: [ "vector.rotate( Math.PI / 4 );" ],
          divider: true,
        },
        { // add
          definition: 'add( '+kwd('number')+' x, '+kwd('number')+' y ) :: ' + small('returns ') + kwd('this')
        },{
          definition: 'add( '+a('Vector')+' v ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'add the given values or vector to this vector.' ],
          samples: [ "vector.add( 20,30 );",
            "vector.add( vector1 );" ],
          divider: true,
        },
        { // sub
          definition: 'sub( '+kwd('number')+' x, '+kwd('number')+' y ) :: ' + small('returns ') + kwd('this')
        },{
          definition: 'sub( '+a('Vector')+' v ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'subtract the given values or vector from this vector.' ],
          samples: [ "vector.sub( 20,30 );",
            "vector.sub( vector1 );" ],
          divider: true,
        },
        { // mult
          definition: 'mult( '+kwd('number')+' factor ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'multiply the vector by the given factor.' ],
          samples: [ "vector.mult( 3 );" ],
          divider: true,
        },
        { // div
          definition: 'div( '+kwd('number')+' divisor ) :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'divides the vector by the given value.' ],
          samples: [ "vector.div( 3 );" ],
          divider: true,
        },
        { // dot
          definition: 'dot( '+kwd('number')+' x, '+kwd('number')+' y ) :: ' + small('returns ') + kwd('number')
        },{
          definition: 'dot( '+a('Vector')+' v ) :: ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the dot product of this vector and the given vector.' ],
          samples: [ "var dotProduct = vector.dot( 2,3 );",
            "var dotProduct = vector.dot( vector1 );" ],
          divider: true,
        },
        { // dist
          definition: 'dist( '+kwd('number')+' x, '+kwd('number')+' y ) :: ' + small('returns ') + kwd('number')
        },{
          definition: 'dist( '+a('Vector')+' v ) :: ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the distance between this vector and the given vector.' ],
          samples: [ "var distance = vector.dist( 20,30 );",
            "var distance = vector.dist( vector1 );" ],
          divider: true,
        },
        { // lerp
          definition: 'lerp( '+kwd('number')+' x, '+kwd('number')+' y, '+kwd('number')+' interpolant )'
        },{
          definition: 'lerp( '+a('Vector')+' v, '+kwd('number')+' interpolant )'
        },{
          definition: ':: ' + small('returns ') + kwd('this'),
          descriptions: [ 'interpolates the vector with the given values or vector.',
            kwd('interpolant')+' is the weight of the interpolation in the range '+kwd('[0,1]') ],
          samples: [ "vector.lerp( 20,30, 0.5 );",
            "vector.lerp( vector1, 0.3 );" ]
        },
      ]
    }
  },
  Color: {
    classname: 'Color',
    inherits: [ 'Interface' ],
    overview: [ "An object for storing color defined with Red, Green, Blue, and Alpha channels." ],
    data: {
      'Constructor': [ 
        { // Color( r, g, b, a )
          definition: 'Color( '+kwd('number')+' r, '+kwd('number')+' g, '+kwd('number')+' b, '+kwd('number')+' a )',
          descriptions: [ "Create a color with the given values. The default alpha value is 1, all colors default to 0." ],
          samples: [
            "// create a new color (black with full alpha)\nvar c0 = new iio.Color();",
            "// create a new blue color with full alpha\nvar c1 = new iio.Color( 0, 0, 255 );",
            "// create a new red color with 50% alpha\nvar c2 = new iio.Color( 255, 0, 0, 0.5 );"
          ]
        }
      ],
      'Properties': [
        {  // r
          definition: kwd('number') + ' r',
          descriptions: [ "Red color value in the range [ 0, 255 ]" ]
        },
        {  // g
          definition: kwd('number') + ' g',
          descriptions: [ "Green color value in the range [ 0, 255 ]" ]
        },
        {  // b
          definition: kwd('number') + ' b',
          descriptions: [ "Blue color value in the range [ 0, 255 ]" ]
        },
        {  // a
          definition: kwd('number') + ' a',
          descriptions: [ "Alpha color value in the range [ 0, 1 ]" ],
          samples: [
            "// access the properties of a color\nvar red = color.r;\nvar green = color.g;\nvar blue = color.b;\nvar alpha = color.a;",
            "// set the properties of a color\ncolor.r = 255;\ncolor.g = 255;\ncolor.b = 255;\ncolor.a = 1;"
          ]
        }
      ],
      'Static Functions': [
        {  // Color.random()
          definition: 'Color.random() :: ' + small('returns ') + a('Color'),
          descriptions: [ "Returns a random Color with full alpha." ],
          samples: [ "var randomColor = iio.Color.random();" ],
          divider: true,
        },{  // Color.invert()
          definition: 'Color.invert( '+a("Color")+' color ) :: ' + small('returns ') + a('Color'),
          descriptions: [ "Returns a new Color with the inverse color value of the given color object." ],
          samples: [ "var color = iio.Color();\nvar inverseColor = iio.Color.invert(color);" ],
          divider: true,
        },{  // Color.hexToRgb()
          definition: 'Color.hexToRgb( '+kwd("string")+' hex ) :: ' + small('returns ') + kwd('object'),
          descriptions: [ "Returns an object with "+kwd('r')+','+kwd('g')+','+kwd('b')+' values' ],
          samples: [ "var rgb = iio.Color.hexToRgb('#00BAFF');\nvar r = rgb.r;\nvar g = rgb.g;\nvar b = rgb.b;" ],
          divider: true,
        },{  // Color.rgbToHex()
          definition: 'Color.rgbToHex( '+kwd("number")+': r, g, b ) :: ' + small('returns ') + kwd('string'),
          descriptions: [ "Returns a hexadecimal string representing the given rgb color" ],
          samples: [ "var hex = iio.Color.rgbToHex(255,0,0);" ],
          divider: true,
        },{ // Color.<constant>
          definition: 'Color.<'+kwd('constant')+'>() }:: '+small('returns ')+a('Color'),
          descriptions: [
            'Returns a new Color corresponding the the given constant. All '+ahref('CSS color', 'http://www.w3schools.com/cssref/css_colornames.asp')+' keywords are available.'
          ],
          samples: [
            "var red = iio.Color.red();\nvar aqua = iio.Color.aqua();\nvar transparent = iio.Color.transparent();"
          ]
        }
      ],
      'Instance Functions': [
        {  // randomize()
          definition: 'randomize() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'Randomizes the r,g,b values of this color. Does not effect alpha.' ],
          samples: [ "color.randomize();" ],
          divider: true
        },{  // invert()
          definition: 'invert() :: ' + small('returns ') + kwd('this'),
          descriptions: [ 'Inverts the r,g,b values of this color. Does not effect alpha.' ],
          samples: [ "color.invert();" ],
          divider: true
        },{  // rgbaString()
          definition: 'rgbaString() :: ' + small('returns ') + kwd('string'),
          descriptions: [ 'Returns a string in the format: '+kwd('rgba(r,g,b,a)') ],
          samples: [ "var rgbaString = color.rgbaString();" ],
          divider: true
        },{  // hexString()
          definition: 'hexString() :: ' + small('returns ') + kwd('string'),
          descriptions: [ 'Returns a hexadecimal color string.' ],
          samples: [ "var hexString = color.hexString();" ]
        },
      ]
    }
  },
  Gradient: {
    classname: 'Gradient',
    inherits: [ 'Interface' ],
    overview: [ "An object for storing a gradient defined with a start position, an end position, an array of color stops, and an optional start and end radius for a radial orientation." ],
    data: {
      'Constructor': [
        {
          definition: 'Gradient( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
          descriptions: [ "Create a gradient with the properties of any number of given objects. Vectors may be given in array format or a singular number for identical x,y coordinates." ],
          samples: [ "// create a new linear gradient\nvar gradient = new iio.Gradient({\n\t// set start position with Vector\n\tstart: new iio.Vector( 0, -50 ),\n\t// set end position with array\n\tend: [ 0, 50 ],\n\t// define color stops\n\tstops: [\n\t\t[ 0, 'black' ],\n\t\t[ 0.5, 'blue' ],\n\t\t[ 1, 'blue' ]\n\t]\n});" ]
        }
      ],
      'Properties': [
        {  // start
          definition: a('Vector')+' start',
          descriptions: [ "The start position of the gradient" ]
        },{ // end
          definition: a('Vector')+' end',
          descriptions: [ "The end position of the gradient" ],
          samples: [
            "// access the start and stop positions\nvar start_pos = gradient.start;\nvar end_pos = gradient.end;",
            "// set a gradients start and end positions\ngradient.start = new iio.Vector( 50, 50 );\ngradient.stop = new iio.Vector( 50, 100 );"
          ],
          divider: true
        },
        { // stops
          definition: kwd('Array')+' stops',
          descriptions: [ "An array of color stops. A color stop is defined as an array where "+kwd('stop[0]')+" is the stop position normalized to the range [0,1], and "+kwd('stop[1]')+" is a "+a('Color')+"." ],
          samples: [
            "// access a gradients color stop array\nvar color_stop = gradient.stops[0];\n// access the color stop's properties\nvar color_stop_position = color_stop[0];\nvar color_stop_color = color_stop[1];",
            "// define a color stop in stops\ngradient.stops[0] = [ .5, 'blue' ]\n// set each color stop property\ngradient.stops[0][0] = 1;\ngradient.stops[0][1] = 'red';"
          ],
          divider: true
        },
        { // startRadius
          definition: kwd('number')+' startRadius',
          descriptions: [ "An optional start radius for radial gradients" ]
        },{ // endRadius
          definition: kwd('number')+' endRadius',
          descriptions: [ "An optional end radius for radial gradients" ],
          samples: [
            "// access the start and end radii of a gradient\nvar start_radius = gradient.startRadius;\nvar end_radius = gradient.endRadius;",
            "// set the start and end radii of a gradient\ngradient.startRadius = 10;\ngradient.endRadius = 100;"
          ]
        }
      ]
    }
  },
  Sound: {
    classname: 'Sound',
    inherits: [ 'Interface' ],
    overview: [ "Represents a sound buffer. Similar fashion to JavaScript's native Image class." ],
    data: {
      Constructor: [
        {
          definition: 'Sound( '+kwd('string')+' soundFile, '+kwd('function')+': onLoad, onError )',
          descriptions: [ 
            "Create a Sound instance from the audio file located at soundFile",
            "Call optional callback functions for success and error."
          ],
          samples: [
            "var sound = new iio.Sound(\n\t'bark.wav', \n\tfunction(sound, buffer) { ... }, \n\tfunction(error) { ... }\n)"
          ]
        }
      ],
      Properties: [
        {
          definition: kwd('number') + ' gain',
          descriptions: [ "Gain (volume) level, must be between 0 and 1" ]
        },
        {
          definition: kwd('boolean') + ' loop',
          descriptions: [ "Flag to loop playback" ]
        },
        {
          definition: kwd('Function') + ' onLoad',
          descriptions: [ "Called on successful load" ]
        },
        {
          definition: kwd('Function') + ' onError',
          descriptions: [ 
            "Callback to be called if an error occurs in loading",
            "Errors can occur due to multiple reasons: nonexistent file, corrupted buffer, etc"
          ]
        },
      ],
      Functions: [
        {
          definition: 'play( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... ) :: '+small('returns ')+kwd('this'),
          descriptions: [
            "Play the sound through iio's AudioContext, with an the given properties or the previously set sound properties.",
          ],
          samples: [
            "// set volume to 75% before playing\n// loop playback\nsound.play({ gain: 0.75, loop: true })"
          ],
          divider: true,
        },{
          definition: 'stop() :: '+small('returns ')+kwd('this'),
          descriptions: ['Stops the sound from playing.' ],
          samples: [ 'sound.stop();' ]
        }
      ]
    }
  },
  Sprite: {
    classname: 'Sprite',
    overview: [ "A data structure for a frame animation. Sprites can use a sprite sheet, or a series of individual images." ],
    data: {
      'Creation': [
        {
          descriptions: [ "Sprites can be created manually or with "+a('SpriteMap')+'.'+kwd('sprite') ],
          samples: [
            "// create a Sprite with a single image SpriteMap\nvar sprite = spriteMap.sprite({\n\tname: 'walking',\n\torigin: [0,0],\n\twidth: 16,\n\theight: 32,\n\tnumFrames: 4,\n});",
            "// create a single image Sprite manually\nvar anim = {\n\tname: 'walking',\n\torigin: [0,0],\n\tframes: [{\n\t\tsrc: 'path/image.png',\n\t\tx: 16,\n\t\ty: 0,\n\t\tw: 16,\n\t\th: 32,\n\t},{\n\t\tsrc: 'path/image.png',\n\t\tx: 0,\n\t\ty: 0,\n\t\tw: 16,\n\t\th: 32,\n\t},\n\t//...\n\t]\n};",
            "// create a Sprite with multiple images\nvar anim = {\n\tname: 'walking',\n\torigin: [0,0],\n\tframes: [\n\t\t{ src: 'path/image0.png' },\n\t\t{ src: 'path/image1.png' },\n\t\t//...\n\t]\n};",
          ]
        }
      ],
      'Properties': [
        {  // name
          definition: kwd('string') + ' name',
          descriptions: [ "The name of the animation." ],
        },{  // origin
          definition: a('Vector') + ' origin',
          descriptions: [ "The origin of the frames on the source image." ],
        },{  // numFrames
          definition: kwd('number') + ' numFrames',
          descriptions: [ "The number of frames." ],
        },{  // frames
          definition: kwd('Array')+'<'+kwd('Object')+'> frames',
          descriptions: [ 
          "An array of frames.",
          'frame.'+kwd('src')+': the path of the frames source image',
          'frame.'+kwd('x')+': the x position of the frame on the source image',
          'frame.'+kwd('y')+': the y position of the frame on the source image',
          'frame.'+kwd('w')+': the width of the frame on the source image',
          'frame.'+kwd('h')+': the height of the frame on the source image',
          ],
        }
      ],
    }
  },
  SpriteMap: {
    classname: 'SpriteMap',
    overview: [ "A wrapper for a sprite sheet that can be used to make "+a('Sprite')+' objects.' ],
    data: {
      'Constructor': [
        {
          definition: 'SpriteMap( '+kwd('string')+' source, '+kwd('function')+' onLoad )',
          descriptions: [ "Create a spritemap with the given image and onload callback." ],
          samples: [ 
            "var map = new iio.SpriteMap('img/mariobros_cmp.png');"
          ]
        }
      ],
      'Properties': [
        { // img
          definition: ahref('Image', 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image')+' img',
          descriptions: [ 'The the source image object.' ],
          samples: [ "// set the soure image\n\tmap.img.src = 'path/image.png';" ]
        }
      ],
      'Functions': [
        { // sprite()
          definition: 'sprite( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... ) :: '+small('returns ')+' '+a('Sprite'),
          descriptions: [ 'Creates a sprite with all properties of the given objects.' ],
          samples: [ "// create a Sprite with a single image SpriteMap\nvar sprite = map.sprite({\n\tname: 'walking',\n\torigin: [0,0],\n\twidth: 16,\n\theight: 32,\n\tnumFrames: 4,\n});", ]
        }
      ],
    }
  },
  Loader: {
    classname: 'Loader',
    overview: [
      "To help developers with creating games that utilize large assets such as images and sounds, iio provides a loader."
    ],
    samples: [
      "// Create an instance of a Loader\n" + 
      "// Provide it with a base path and a callback\n" +
      "// to be invoked on completion\n" + 
      "loader = new iio.Loader( './assets' );"
    ],
    data: {
      'Functions': [
        {
          definition: 'load( ' + kwd('string') + ' asset, ' + kwd('function') + ' onComplete )',
          descriptions: [ 
            "Load one asset with an optional callback function on completion"
          ],
          samples: [
            "loader.load( 'sprite.png', function(assets) { ... } );"
          ],
          divider: true
        },
        {
          definition: 'load( ' + kwd('Array') + ' assets, ' + kwd('function') + ' onComplete )',
          descriptions: [ 
            "Pass multiple assets in an array to the loader with optional callback function on completion",
            "optionally specify a callback function for each asset for post load processing"
          ],
          samples: [
            "loader.load([\n\t'sprite1.png',\n\t'ping.wav',\n\t'background.jpg'\n], function(assets) { ... })",
            "loader.load([\n\t{ name: 'sprite1.png', callback: processImage },\n\t{ name: 'ping.wav', callback: processSound },\n\t{ name: 'background.png', callback: processImage }\n], function(assets) { ... })"
          ],
          divider: true
        },
        {
          definition: 'load( ' + kwd('object') + ' assets, ' + kwd('function') + ' onComplete )',
          descriptions: [ 
            "Pass multiple assets in object format to the loader " +
            "callback function on completion"
          ],
          samples: [
            "loader.load({\n\tname: 'sprite1.png',\n\tcallback: processSprite\n}, function(assets) { ... });",
            "loader.load({\n\tmainCharacter: {\n\t\tname: 'sprite1.png',\n\t\tcallback: processSprite\n\t}, \n\tloadingSound: 'ping.wav',\n\tbackground: 'background.jpg'\n}, function(assets) { ... });"
          ]
        },
      ]
    }
  }
}
