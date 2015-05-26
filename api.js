var api = {
	AppControl: {
		classname: 'App control',
		overview: [
			"iio apps are wrapped in an application script so that they can be managed by iio's centralized app management system.",
			"This design pattern will also allow you to utilize "+kwd('iio.start')+"."
		],
		samples: [
			"// define a new iio app\n// app is an App object\nHelloWorld = function( app ){\n\t//...\n}\n\n// start the app fullscreen\niio.start( HelloWorld );\n\n// start the app on an existing canvas\niio.start( HelloWorld, 'canvasId' );"
		],
		data: {
			'App Settings': [
				{
					descriptions: [ "iio apps can be started with settings that are known to the app." ],
					samples: [
						"// define a new iio app\nHelloWorld = function( app, settings ){\n\tsettings.mVar //...\n}\n\n// start the app fullscreen with settings\niio.start( [ HelloWorld, { mVar: mVal } ] );\n\n// start the app on an existing canvas\niio.start( [ HelloWorld, { mVar: mVal } ], 'canvasId' );"
					]
				}
			]
		}
	},
	Interface: {
		classname: 'Interface',
		overview: [ "An Interface root for all classes in iio. Every method defined here in Interface is available in every other class." ],
		data: {
			'Functions': [
				{ // set()
					definition: 'set( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... ) | ' + small('returns ') + kwd('this'),
					descriptions: [
						'Assigns the property and value of each given object to this object, and converts shorthand declarations into correct property data types.',
						a('Vector')+' properties may be given as arrays: '+kwd('[ x, y ]')+'.',
						a('Color')+' properties may be given as string keywords: '+kwd("'blue'")+'.'
					],
					samples: [
						"// set an objects color to blue\nobj.set({ color: 'blue' });",
						"// set multiple properties\nobj.set({\n\tcolor: 'red',\n\twidth: 100,\n\tmyVar: myVal\n});",
						"// set properties and supress the redraw\nobj.set({\n\tcolor: 'red',\n\t//...\n}, true );"
					],
					divider: true
				},
				{	// clone()
					definition: 'clone() | ' + small('returns ') + kwd('Object'),
					descriptions: [ 'returns a deep copy of this object (a new object with equal properties).' ],
					samples: [ "var obj_clone = obj.clone();" ],
					divider: true
				},
				{	// toString()
					definition: 'toString() | ' + small('returns ') + kwd('String'),
					descriptions: [ 'returns a string that lists all properties and values in this object.' ],
					samples: [ "var obj_string = obj.toString();" ]
				}
			]
		}
	},
	Vector: {
		classname: 'Vector',
		inherits: [ 'Interface' ],
		overview: [ "Represents a 2D vector or point. Contains static and instance mathmatics." ],
		data: {
			'Constructors': [
				{
					definition: 'Vector()',
					descriptions: [ "create a vector with values 0,0" ]
				},{
					definition: 'Vector( '+kwd('float')+' x, '+kwd('float')+' y )',
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
					definition: kwd('float')+' x',
					descriptions: [ "the x (horizontal) coordinate value in pixels" ]
				},{
					definition: kwd('float')+' y',
					descriptions: [ "the y (vertical) coordinate value in pixels" ],
					samples: [
						"// access the x and y values of a vector\nvar x = vector.x;\nvar y = vector.y;",
						"// set the x and y values of a vector\nvector.x = value;\nvector.y = value;"
					]
				}
			],
			'Functions': [
				{
					definition: 'add( '+kwd('float')+' x, '+kwd('float')+' y ) | ' + small('returns ') + kwd('this'),
					descriptions: [ 'add the given values to this vector' ]
				},{
					definition: 'add( '+a('Vector')+' v ) | ' + small('returns ') + kwd('this'),
					descriptions: [ 'add the given vector to this vector' ],
					samples: [ "var v0 = new iio.Vector();\nv0.add( 20, 30 );\n\nvar v1 = new iio.Vector();\nv1.add( v0 );" ]
				}
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
					definition: 'Color( '+kwd('float')+' r, '+kwd('float')+' g, '+kwd('float')+' b, '+kwd('float')+' a )',
					descriptions: [ "Create a color with the given values. The default alpha value is 1, all colors default to 0." ],
					samples: [
						"// create a new color (black with full alpha)\nvar c0 = new iio.Color();",
						"// create a new blue color with full alpha\nvar c1 = new iio.Color( 0, 0, 255 );",
						"// create a new red color with 50% alpha\nvar c2 = new iio.Color( 255, 0, 0, 0.5 );"
					]
				}
			],
			'Properties': [
				{	// r
					definition: kwd('float') + ' r',
					descriptions: [ "Red color value in the range [ 0, 255 ]" ]
				},
				{	// g
					definition: kwd('float') + ' g',
					descriptions: [ "Green color value in the range [ 0, 255 ]" ]
				},
				{	// b
					definition: kwd('float') + ' b',
					descriptions: [ "Blue color value in the range [ 0, 255 ]" ]
				},
				{	// a
					definition: kwd('float') + ' a',
					descriptions: [ "Alpha color value in the range [ 0, 1 ]" ],
					samples: [
						"// access the properties of a color\nvar red = color.r;\nvar green = color.g;\nvar blue = color.b;\nvar alpha = color.a;",
						"// set the properties of a color\ncolor.r = 255;\ncolor.g = 255;\ncolor.b = 255;\ncolor.a = 1;"
					]
				}
			],
			'Static Functions': [
				{	// Color.random()
					definition: 'Color.random() | ' + small('returns ') + a('Color'),
					descriptions: [ "Returns a random "+a('Color')+" with full alpha." ],
					samples: [ "var random_color = iio.Color.random();" ]
				}
			],
			'Member Functions': [
				{	// invert()
					definition: 'invert() | ' + small('returns ') + kwd('this'),
					descriptions: [ 'Inverts the r,g,b values of this color. Does not effect alpha.' ],
					samples: [ "color.invert();" ],
					divider: true
				},
				{	// randomize()
					definition: 'randomize() | ' + small('returns ') + kwd('this'),
					descriptions: [ 'Randomizes the r,g,b values of this color. Does not effect alpha.' ],
					samples: [ "color.randomize();" ]
				}
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
				{	// start
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
					definition: kwd('float')+' startRadius',
					descriptions: [ "An optional start radius for radial gradients" ]
				},{ // endRadius
					definition: kwd('float')+' endRadius',
					descriptions: [ "An optional end radius for radial gradients" ],
					samples: [
						"// access the start and end radii of a gradient\nvar start_radius = gradient.startRadius;\nvar end_radius = gradient.endRadius;",
						"// set the start and end radii of a gradient\ngradient.startRadius = 10;\ngradient.endRadius = 100;"
					]
				}
			]
		}
	},
	Drawable: {
		classname: 'Drawable',
		inherits: [ 'Interface' ],
		overview: [ "A root class for all drawable objects classes in iio. Initializes data and provides functions for iio's object management features." ],
		data: {
			'Properties': [
				{	// pos
					definition: a('Vector') + ' pos',
					descriptions: [ "xy position coordinates." ],
					samples: [ 
						"// access a drawable's position coordinates\nvar pos = drawable.pos;\nvar x = drawable.pos.x;\nvar y = drawable.pos.y;",
						"// set a drawable's position\ndrawable.set({ pos: [ 10,20 ] });\ndrawable.set({ pos: new iio.Vector( 10,20 ) });"
					],
					divider: true
				},{	// width
					definition: kwd('float') + ' width',
					descriptions: [ "Pixel width." ]
				},{	// height
					definition: kwd('float') + ' height',
					descriptions: [ "Pixel height." ],
					samples: [ 
						"// access a drawable's width value\nvar width = drawable.width;",
						"// access a drawable's height value\nvar height = drawable.height;",
					],
					divider: true
				},{	// color
					definition: a('Color') + '|' + a('Gradient') + ' color',
					descriptions: [ "Draw color." ],
					samples: [ 
						"// access a drawable's color\nvar color = drawable.color;",
						"// set a drawable's color to a Color\ndrawable.set({ color: 'blue' });",
						"// set a drawable's color to a Gradient\ndrawable.set({ color: new iio.Gradient({\n\tstart: [ 0, -50 ] ),\n\tend: [ 0, 50 ],\n\tstops: [\n\t\t[ 0, 'black' ],\n\t\t[ 0.5, 'blue' ],\n\t\t[ 1, 'blue' ]\n\t]\n})});"
					],
					divider: true
				},{	// paused
					definition: kwd('bool') + ' paused',
					descriptions: [ "A toggle indicating whether or not this objects "+kwd('loops')+' are running.' ],
					samples: [ 
						"// access a drawable's paused property\nvar paused = drawable.paused;",
						"// pause or unpause\ndrawable.pause();"
					]
				}
			],
			'Associated Objects': [
				{	// app
					definition: a('App') + ' app',
					descriptions: [ "Associated App." ],
					samples: [ "// access a drawable's app\nvar app = drawable.app;" ]
				},{	// ctx
					definition: a('Context') + ' ctx',
					descriptions: [ "Associated Canvas 2d Context." ],
					samples: [ "// access a drawable's ctx\nvar ctx = drawable.ctx;" ]
				},{	// parent
					definition: a('Drawable') + ' parent',
					descriptions: [ "Parent object." ],
					samples: [ "// access a drawable's parent\nvar parent = drawable.parent;" ]
				}
			],
			'Object Arrays': [
				{	// objs
					definition: kwd('Array')+'<'+a('Shape') + '> objs',
					descriptions: [ "Array of child shapes." ],
					samples: [ 
						"// access a drawable's objs\nvar obj0 = drawable.objs[0];\nvar obj1 = drawable.objs[1];",
						"// add a shape to the array\ndrawable.add( shape );",
						"// remove a shape from the array\ndrawable.rmv( shape );",
						"// remove all shapes from the array\ndrawable.clear();"
					],
					divider: true
				},{	// collisions
					definition: kwd('Array')+'<'+a('Object') + '> collisions',
					descriptions: [ "Array of collision objects." ],
					samples: [ 
						"// access collision object properties\nvar group0 = drawable.collisions[0][0];\nvar group1 = drawable.collisions[0][1];\nvar collision_callback = drawable.collisions[0][2];\n"
					],
					divider: true
				},{	// loops
					definition: kwd('Array')+'<'+a('Object') + '> loops',
					descriptions: [ "Array of loop objects." ],
					samples: [ 
						"// access loop properties\nvar loopId = drawable.loops[0].id;\nvar loop_callback = drawable.loops[0].fn;",
					]
				}
			],
			'Object Management': [
				{	// clear()
					definition: 'clear( '+kwd('bool')+' noDraw ) | ' + small('returns ') + kwd('this'),
					descriptions: [ 'Clears the '+kwd('objs')+' array and cancels all loops in the cleared objects. Redraws the associated '+a('App')+' if noDraw is undefined or false.' ],
					samples: [
						"// clear all app objects\napp.clear();",
						"// clear all child objects in a Rectangle\n// suppress the redraw\nrectangle.clear( true );"
					],
					divider: true
				},
				{	// add()
					definition: 'add( '+a('Shape')+' shape, '+kwd('bool')+' noDraw ) | ' + small('returns ') + a('Shape')
				},{
					definition: 'add( [ '+a('Shape')+' s0, '+a('Shape')+' s1, ... ], '+kwd('bool')+' noDraw ) | ' + small('returns ') + kwd('Array'),
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
				{	// rmv()
					definition: 'rmv( '+a('Shape')+' shape, '+kwd('bool')+' noDraw ) | ' + small('returns ') + a('Shape')
				},{
					definition: 'rmv( [ '+a('Shape')+' s0, '+a('Shape')+' s1, ... ], '+kwd('bool')+' noDraw ) | ' + small('returns ') + kwd('Array')
				},{
					definition: 'rmv( '+kwd('int')+' index, '+kwd('bool')+' noDraw ) | ' + small('returns ') + a('Shape'),
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
				{	// create( p0, p1, ... )
					definition: 'create( '+kwd('p0')+', '+kwd('p1')+', ... ) | ' + small('returns ') + kwd('Object'),
					descriptions: [ 'Classifies given values by their type and creates and adds a new object with correct property value pairs. Possible objects created and returned can be: '+a('Vector')+', '+a('Color')+', '+a('Line')+', '+a('Text')+', '+a('Ellipse')+', '+a('Polygon')+', '+a('Rectangle')+', '+a('Grid')+'.' ],
					samples: [ 
						"// create a Vector\nvar vector = app.create( [10,20] );",
						"// create a Color\nvar color = app.create( 'red' );",
						"// create a Text at app center\nvar text = app.create( app.center, 'hello world' );",
						"// create a Rectangle at app center\nvar rectangle = app.create( app.center, 50, 'red' );",
						"// create a Line\nvar line = app.create( 'red', {\n\tvs: [\n\t\t[ 10,10 ],\n\t\t[ 80,80 ]\n\t]\n});",
						"// create a Circle at app center\nvar circle = app.create( app.center, 'red', {\n\tradius: 20\n});"
					],
					divider: true
				},
				{	// collision()
					definition: 'collision( '+a('Shape')+' s0, '+a('Shape')+' s1, '+kwd('function')+' callback ) | ' + small('returns ') + kwd('int')
				},{
					definition: 'collision( '+kwd('Array')+' g0, '+kwd('Array')+' g1, '+kwd('function')+' callback ) | ' + small('returns ') + kwd('int'),
					descriptions: [ 'Creates a collision object which tests collisions between two '+a('Shape')+' objects, two arrays of '+a('Shape')+' objects, or a mix of both types, and runs the given callback function, passing the two colliding objects as parameters.' ],
					samples: [ 
						"// add a collision object\ndrawable.collision( objA, objB, callback );\n\n// add a collision object with arrays\n// and an inline callback function\nvar groupA = [ shape0, shape1, shape2 ];\nvar groupB = [ shape3, shape4 ];\nvar index = drawable.collision( groupA, groupB, function( A, B ){\n\t//...\n});"
					]
				}
			],
			'Loop Management': [
				{	// loop()
					definition: 'loop() | ' + small('returns ') + kwd('int')
				},{
					definition: 'loop( '+kwd('float')+' fps ) | ' + small('returns ') + kwd('int')
				},{
					definition: 'loop( '+kwd('function')+' callback ) | ' + small('returns ') + kwd('int')
				},{
					definition: 'loop( '+kwd('float')+' fps, '+kwd('function')+' callback ) | ' + small('returns ') + kwd('int'),
					descriptions: [ 'Initiates a loop with or without a given callback at 60fps or the given framerate. Returns the new loop id.' ],
					samples: [
						"// add a 60 fps update loop\nvar loopId =  drawable.loop();",
						"// add a 40 fps update loop\nvar loopId =  drawable.loop( 40 );",
						"// add a 60 fps update with a callback\nvar loopId = drawable.loop( callback );",
						"// add a 40 fps update with a callback\nvar loopId = drawable.loop( 40, callback );",
						"// cancel a loop\niio.cancelLoop( loopId );",
					],
					divider: true
				},{ // pause
					definition: 'pause() | ' + small('returns ') + kwd('this'),
					descriptions: [ 'Pauses or unpauses all loops in the '+kwd('loops')+' array, depending upon the value of the '+kwd('paused')+' property.' ],
					samples: [
						"// pause or unpause\ndrawable.pause();"
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
				{	// canvas
					definition: a('Canvas') + ' canvas',
					descriptions: [ "Associated HTML Canvas element." ],
					samples: [ "// access an app's canvas\nvar canvas = drawable.canvas;" ]
				},{	// center
					definition: a('Vector') + ' center',
					descriptions: [ "The center coordinate of the app." ],
					samples: [ "// access an app's center coordinate\nvar center = drawable.center;" ]
				}
			],
			'Functions':[
				{	// draw
					definition: 'draw( '+kwd('bool')+' noClear ) | ' + small('returns ') + kwd('this'),
					descriptions: [ 
						"Draws the background color and all objects in "+kwd('objs')+' in '+kwd('z')+' index order.',
						"The canvas will first be cleared unless "+kwd('noClear')+' is '+kwd('true')+'.'
					],
					samples: [ 
						"// redraw the app\napp.draw();",
						"// redraw the app without clearing the last render\napp.draw( true );"
					]
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
			'Movement Properties': [
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
					]
				}
			],
			'Rotation Properties': [
				{ // rotation
					definition: kwd('float') + ' rotation',
					descriptions: [ "Rotation in radians." ],
					samples: [ 
						"// access a shape's rotation\nvar rotation = shape.rotation;",
						"// set a shape's rotation directly\nshape.rotation = Math.PI / 2;",
						"// set a shape's rotation using set\nshape.set({ rotation: Math.PI / 2 });"
					],
					divider: true
				},{ // rVel
					definition: kwd('float') + ' rVel',
					descriptions: [ "Rotational velocity in radians/update" ]
				},{	// rAcc
					definition: kwd('float') + ' rAcc',
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
					definition: kwd('bool')+' hidden',
					descriptions: [ "A toggle that suppresses rendering and collision detections." ],
					samples: [ 
						"// access a shape's hidden value\nvar hidden = shape.hidden;",
						"// set a shape's hidden value directly\nshape.hidden = true;",
						"// set a shape's hidden value using set\nshape.set({ hidden: true });"
					],
					divider: true
				},{ // alpha
					definition: kwd('float')+' alpha',
					descriptions: [ "A value controlling opacity in the range "+kwd('[0,1]') ],
					samples: [ 
						"// access a shape's alpha value\nvar alpha = shape.alpha;",
						"// set a shape's alpha value directly\nshape.alpha = 0.5;",
						"// set a shape's alpha value using set\nshape.set({ alpha: 0.4 });"
					],
					divider: true
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
					definition: a('Array') + '|'+kwd('float')+' dash',
					descriptions: [ "A value or array of values specifying a dash width and spacing in pixels for the drawing of lines." ],
					samples: [ 
						"// access a shape's dash\nvar dash = shape.dash;",
						"// set a shape's dash directly\nshape.dash = 20;",
						"// set a shape's dash using set\nshape.set({ dash: [ 20,15,30 ] });"
					],
					divider: true
				},{ // outline
					definition: a('Color')+'|'+a('Gradient')+' outline',
					descriptions: [ "The color of a shape outline.", a('Line')+" is the only object that does not have an "+kwd('outline')+'.' ],
					samples: [ 
						"// access a shape's outline color\nvar outline_color = shape.outline;",
						"// set a shape's outline color directly\nshape.outline = iio.Color.red;",
						"// set a shape's outline color using set\nshape.set({ outline: 'red' });"
					],
					divider: true
				},{ // lineWidth
					definition: kwd('float')+' lineWidth',
					descriptions: [ 
						"The width of all lines and outlines that are drawn for the object.", 
						a('Line')+" uses "+kwd('width')+" instead of "+kwd('lineWidth')+" for its size value." 
					],
					samples: [ 
						"// access a shape's lineWidth\nvar lineWidth = shape.lineWidth;",
						"// set a shape's lineWidth directly\nshape.lineWidth = 5;",
						"// set a shape's lineWidth using set\nshape.set({ lineWidth: 5 });"
					]
				}
			],
			'Shadow Properties': [
			{ // shadow
					definition: a('Color') + '|'+a('Gradient') +' shadow',
					descriptions: [ "The shadow color." ],
					samples: [ 
						"// access a shape's shdow color\nvar shadow_color = shape.shadow;",
						"// set a shape's shadow color directly\nshape.shadow = new iio.Color.black;",
						"// set a shape's shadow color using set\nshape.set({ shadow: 'black' });"
					],
					divider: true
				},{	// shadowBlur
					definition: kwd('float') + ' shadowBlur',
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
			]
				// fade
				// shrink
		}
	},
	Line: {
		classname: 'Line',
		inherits: [ 'Shape','Drawable','Interface' ],
		overview: [ "A line shape defined by a start and end position ("+kwd('vs')+').' ],
		unitTests: iio.test.Line,
		data: {
			'Constructor': [
				{
					definition: 'Line( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
					descriptions: [ "Create a line with the properties of any number of given objects." ],
					samples: [ 
						"// create a new line\n// with global coordinates\nvar line = new iio.Line({\n\t// set position coordinates\n\t// relative to app 0,0\n\tvs: {\n\t\t// start position\n\t\t[ 10, 10 ],\n\t\t// end position\n\t\t[ 100, 100 ],\n\t},\n\tcolor: 'red',\n\twidth: 5\n});",
						"// create a new line\n// with local coordinates\nvar line = new iio.Line({\n\t// set line shape position\n\t// relative to app 0,0\n\tpos: app.center,\n\t// set line coordinates\n\t// relative to pos\n\tvs: {\n\t\t// start position\n\t\t[ 10, 10 ],\n\t\t// end position\n\t\t[ 100, 100 ]\n\t},\n\tcolor: 'red',\n\twidth: 5\n});",
						"// add a line shape to the app\napp.add( line );"
						]
				}
			],
			'Properties': [
				{	// vs
					definition: kwd('Array')+'<'+a('Vector')+'> vs',
					descriptions: [ "An array of two coordinates defining the start and end positions of the line." ],
					samples: [
						"// access the start and end positions of a line\nvar start_pos = line.vs[0];\nvar end_pos = line.vs[1];",
						"// set the start and end positions of a line\nline.vs[0] = new iio.Vector( 10,10 );\nline.vs[1] = new iio.Vector( 100,100 );",
						"// set the start and end positions of a line using set\nline.set( { \n\tvs: [\n\t\t[ 10,10 ],\n\t\t[ 100,100 ]\n\t]\n} );"
					],
					divider: true
				},
				{ // width
					definition: kwd('Array')+' width',
					descriptions: [ "The width of the line." ],
					samples: [
						"// access a line's width\nvar line_width = line.width;",
						"// set a line's width\nline.width = 5;"
					],
					divider: true
				},
				{	// vels
					definition: kwd('Array')+'<'+a('Vector')+'> vels',
					descriptions: [ "An array of velocity vectors associated with the position coordinates in "+kwd('vs')+'.' ],
					samples: [
						"// access the coordinate velocities of a line\nvar start_pos_vel = line.vels[0];\nvar end_pos_vel = line.vels[1];",
						"// set the coordinate velocities of a line\nline.vels[0] = new iio.Vector( 1,1 );\nline.vels[1] = new iio.Vector( -1,-1 );",
						"// set the start and end positions of a line using set\nline.set( { \n\tvs: [\n\t\t[ 1,1 ],\n\t\t[ -1,-1 ]\n\t]\n} );"
					]
				},
			],
			'Bezier Properties': [
				{	// bezier
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
				{	// bezierVels
					definition: kwd('Array')+'<'+a('Vector')+'> bezierVels',
					descriptions: [ "An array of velocity vectors associated with the bezier handle position coordinates in "+kwd('bezier')+'.' ],
					samples: [
						"// access the bezier handle velocities\nvar bezier0_vel = line.bezierVels[0];\nvar bezier1_vel = line.bezierVels[1];",
						"// set the bezier handle velocities\nline.bezierVels[0] = new iio.Vector( 1,1 );\nline.bezierVels[1] = new iio.Vector( -1,-1 );",
						"// set the bezier handle velocities using set\nline.set( { \n\tbezierVels: [\n\t\t[ 1,1 ],\n\t\t[ -1,-1 ]\n\t]\n} );"
					],
					divider: true
				},
				{	// bezierAccs
					definition: kwd('Array')+'<'+a('Vector')+'> bezierAccs',
					descriptions: [ "An array of acceleration vectors associated with the bezier handle position coordinates in "+kwd('bezier')+'.' ],
					samples: [
						"// access the bezier handle acclerations\nvar bezier0_acc = line.bezierAccs[0];\nvar bezier1_acc = line.bezierAccs[1];",
						"// set the bezier handle acclerations\nline.bezierAccs[0] = new iio.Vector( 1,1 );\nline.bezierAccs[1] = new iio.Vector( -1,-1 );",
						"// set the bezier handle acclerations using set\nline.set( { \n\tbezierAccs: [\n\t\t[ 1,1 ],\n\t\t[ -1,-1 ]\n\t]\n} );"
					],
				}
			]
		}
	},
	Text: {
		classname: 'Text',
		inherits: [ 'Shape','Drawable','Interface' ],
		overview: [ "A text object defined by a position and text string." ],
		unitTests: iio.test.Text,
		data: {
			'Constructor': [
				{
					definition: 'Text( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
					descriptions: [ "Create text with the properties of any number of given objects." ],
					samples: [ 
						"// create a new text object\nvar textObj = new iio.Text({\n\tpos: app.center,\n\ttext: 'Hello World',\n\tcolor: 'red',\n\tsize: 40,\n\tfont: 'Arial',\n\talign: 'center'\n});",
						"// add the text object to the app\napp.add( textObj );"
						]
				}
			],
			'Properties': [
				{	// text
					definition: kwd('String')+' text',
					descriptions: [ "A string identifying the text object's printed characters." ],
					samples: [
						"// access the text string\nvar text_string = textObj.text;",
						"// set the text string\ntextObj.text = 'new text value';"
					],
					divider: true
				},
				{ // size
					definition: kwd('float')+' size',
					descriptions: [ "The font size." ],
					samples: [
						"// access font size\nvar font_size = textObj.size;",
						"// set the font size\ntextObj.size = 60;"
					],
					divider: true
				},
				{ // font
					definition: kwd('String')+' font',
					descriptions: [ "The font of the printed text." ],
					samples: [
						"// access font\nvar font = textObj.font;",
						"// set the font\ntextObj.font = 'Arial';"
					],
					divider: true
				},
				{ // align
					definition: kwd('String')+' align',
					descriptions: [ "A string keyword indicating the alignmet of the printed text.",
						"Possible values are: "+kwd("'center'")+', '+kwd("'left'")+', '+kwd("'right'")+', '+kwd("'start'")+', or '+kwd("'end'")+'.' ],
					samples: [
						"// access text alignment\nvar alignment = textObj.align;",
						"// set the text alignment\ntextObj.align = 'center';"
					],
					divider: true
				}
			]
		}
	},
	Ellipse: {
		classname: 'Ellipse',
		inherits: [ 'Shape','Drawable','Interface' ],
		overview: [ "An ellipse shape defined by a position and 1 or 2 radii." ],
		unitTests: iio.test.Circle,
		data: {
			'Constructor': [
				{
					definition: 'Ellipse( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
					descriptions: [ "Create an ellipse with the properties of any number of given objects." ],
					samples: [ 
						"// create a new ellispe\nvar ellipse = new iio.Ellipse({\n\tpos: app.center,\n\tradius: 40,\n\tvRadius: 60,\n\tcolor: 'red'\n});",
						"// add the ellipse to the app\napp.add( ellipse );"
						]
				}
			],
			'Properties': [
				{	// radius
					definition: kwd('float')+' radius',
					descriptions: [ "The radius of a circle, or the horizontal radius of an ellipse." ],
					samples: [
						"// access the radius\nvar radius = ellipse.radius;",
						"// set the radius\nellipse.radius = 40;"
					],
					divider: true
				},
				{	// vRadius
					definition: kwd('float')+' vRadius',
					descriptions: [ "The verticle radius of an ellipse." ],
					samples: [
						"// access the vertical radius\nvar vertical_radius = ellipse.vRadius;",
						"// set the vertical radius\nellipse.vRadius = 60;"
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
				{	// vs
					definition: kwd('Array')+'<'+a('Vector')+'> vs',
					descriptions: [ "An array of coordinates defining the vertices of the polygon. Can be any length greater than 2." ],
					samples: [
						"// access a polygon's vertices\nvar vertex0 = polygon.vs[0];\nvar vertex1 = polygon.vs[1];\nvar vertex2 = polygon.vs[2];\n//...",
						"// set a polygon's vertices\npolygon.vs[0] = new iio.Vector( 0, 20 );\npolygon.vs[1] = new iio.Vector( 20, 20 );\npolygon.vs[2] = new iio.Vector( -20, 20 );\n//...",
						"// set a polygon's vertices using set\npolygon.set( {\n\tvs: [\n\t\t[ 0, 20 ],\n\t\t[ 20, 20 ],\n\t\t[ -20, 20 ],\n\t\t//...\n\t]\n} );"
					]
				}
			]
		}
	},
	Rectangle: {
		classname: 'Rectangle',
		inherits: [ 'Shape','Drawable','Interface' ],
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
				{	// width
					definition: kwd('float')+' width',
					descriptions: [ "The width of a rectangle or the size of a square." ],
					samples: [
						"// access the width\nvar width = rectangle.width;",
						"// set the width\nrectangle.width = 40;"
					],
					divider: true
				},
				{	// height
					definition: kwd('float')+' height',
					descriptions: [ "The height." ],
					samples: [
						"// access the height\nvar height = rectangle.height;",
						"// set the height\nrectangle.height = 60;"
					]
				}
			]
		}
	},
	Grid: {
		classname: 'Grid',
		inherits: [ 'Shape','Drawable','Interface' ],
		overview: [ "A grid shape defined by a position, number of columns, number of rows, and either a cell resolution vector or a width and height." ],
		unitTests: iio.test.Grid,
		data: {
			'Constructor': [
				{
					definition: 'Grid( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... )',
					descriptions: [ "Create a grid with the properties of any number of given objects." ],
					samples: [ 
						"// create a new grid\nvar grid = new iio.Grid({\n\tpos: app.center,\n\twidth: 200,\n\theight: 200,\n\tR: 3,\n\tC: 3,\n\tlineWidth: 5,\n\tcolor: 'red'\n});",
						"// add the grid to the app\napp.add( grid );"
						]
				}
			],
			'Properties': [
				{	// R
					definition: kwd('int')+' R',
					descriptions: [ "The number of rows." ]
				},
				{	// C
					definition: kwd('int')+' C',
					descriptions: [ "The number of columns." ],
					samples: [
						"// access the number of rows and columns\nvar numRows = grid.R;\nvar numColumns = grid.C;",
						"// set the number of rows and columns\ngrid.R = 3;\ngrid.C = 3;",
						"// set the number of rows and columns with set\ngrid.set({ C:3, R:3 });"
					],
					divider: true
				},
				{	// width
					definition: kwd('float')+' width',
					descriptions: [ "The width of the grid." ]
				},
				{	// height
					definition: kwd('float')+' height',
					descriptions: [ "The height of the grid." ],
					samples: [
						"// access the grid width and height\nvar width = grid.width;\nvar height = grid.height;",
						"// set the grid width and height\n// use set to auto adjust res\ngrid.set({\n\twidth: 200,\n\theight: 300\n});"
					],
					divider: true
				},
				{	// res
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
					]
				}
			],
			'Object Arrays': [
				{	// cells
					definition: kwd('Array')+'<'+a('Rectangle') + '> cells',
					descriptions: [ "Array of cells." ],
					samples: [ 
						"// access a grids cells\nvar cell00 = grid.cells[0];\nvar cell01 = grid.cells[1];"
					]
				}
			]
		}
	}
}