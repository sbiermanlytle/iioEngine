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
	Abstract: {
		classname: 'Abstract',
		overview: [ "An abstract root for all classes in iio. Every method defined here in Abstract is available in every other class." ],
		data: {
			'Member Functions': [
				{ // set()
					definition: 'set( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... ) | ' + small('returns ') + kwd('this')
				},{
					definition: 'set( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ..., '+kwd('Boolean')+' noDraw ) | ' + small('returns ') + kwd('this'),
					descriptions: [
						'Assigns the property and value of each given object to this object, and converts shorthand declarations into correct property data types. Redraws the associated '+a('App')+" if "+kwd('noDraw')+" is undefined or false.",
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
		inherits: [ 'Abstract' ],
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
		inherits: [ 'Abstract' ],
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
		inherits: [ 'Abstract' ],
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
	}
}