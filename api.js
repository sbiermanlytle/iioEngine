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
			'Member Functions': [
				{ // set()
					definition: 'set( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... ) | ' + small('returns ') + kwd('this'),
					descriptions: [
						'Assigns the property and value of each given object to this object, and converts shorthand declarations into correct property data types.',
						a('Vector')+' properties may be given as arrays: '+kwd('[ x, y ]'),
						a('Color')+' properties may be given as string keywords: '+kwd("'blue'")
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
				},{	// pos
					definition: a('Vector') + ' pos',
					descriptions: [ "xy position coordinates." ],
					samples: [ 
						"// access a drawable's position coordinates\nvar pos = drawable.pos;\nvar x = drawable.pos.x;\nvar y = drawable.pos.y;",
						"// set a drawable's position\ndrawable.set({ pos: [10,20] });\ndrawable.set({ pos: new iio.Vector(10,20) });"
					]
				},{	// color
					definition: a('Color') + '|' + a('Gradient') + ' color',
					descriptions: [ "Draw color." ],
					samples: [ 
						"// access a drawable's color\nvar color = drawable.color;",
						"// set a drawable's color to a Color\ndrawable.set({ color: 'blue' });",
						"// set a drawable's color to a Gradient\ndrawable.set({ color: new iio.Gradient({\n\tstart: [ 0, -50 ] ),\n\tend: [ 0, 50 ],\n\tstops: [\n\t\t[ 0, 'black' ],\n\t\t[ 0.5, 'blue' ],\n\t\t[ 1, 'blue' ]\n\t]\n})});"
					]
				},{	// objs
					definition: kwd('Array')+'<'+a('Shape') + '> objs',
					descriptions: [ "Array of child shapes." ],
					samples: [ 
						"// access a drawable's objs\nvar obj0 = drawable.objs[0];\nvar obj1 = drawable.objs[1];",
						"// add a shape to the array\ndrawable.add( shape );",
						"// remove a shape from the array\ndrawable.rmv( shape );",
						"// remove all shapes from the array\ndrawable.clear();",
					]
				}
			],
			'Object Management': [
				{	// clear()
					definition: 'clear( '+kwd('bool')+' noDraw ) | ' + small('returns ') + kwd('this'),
					descriptions: [ 'Clears the '+a('objs')+' array and cancels all loops in the cleared objects. Redraws the associated '+a('App')+' if noDraw is undefined or false.' ],
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
					descriptions: [ 'Adds the given shape or array of shapes to this objects '+a('objs')+' array in '+a('z')+' index order, then returns the argument.',
						'Adds a '+a('z')+' value of '+kwd('0')+' if '+a('z')+' is undefined.',
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
					descriptions: [ 'Removes the given shape, array of shapes, or shape at the given index from this objects '+a('objs')+' array, then returns the removed shape or array of shapes.',
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
				}
			]
		}
	}
}