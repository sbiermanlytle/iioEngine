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
          ]
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
          ]
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
  },
  Interface: {
    classname: 'Interface',
    overview: [ "A root for all classes in iio. Every method defined in Interface is available in every other class." ],
    data: {
      'Functions': [
        { // set()
          definition: 'set( '+kwd('Object')+' p0, '+kwd('Object')+' p1, ... , '+kwd('boolean')+' suppressDraw )',
        },{
          definition: '| '+small('returns ') + kwd('this'),
          descriptions: [
            'Assigns the property and value of each given object to this object, converts shorthand declarations into correct property data types, and redraws the parent application.',
            a('Vector')+' properties may be given as arrays: '+kwd('[ x, y ]'),
            a('Color')+' properties may be given as hexadecimal strings or '+ahref('CSS color', 'http://www.w3schools.com/cssref/css_colornames.asp')+' keywords: '+kwd("'blue'"),
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
          definition: 'clone() | ' + small('returns ') + kwd('Object'),
          descriptions: [ 'returns a deep copy of this object (a new object with equal properties).' ],
          samples: [ "var obj_clone = obj.clone();" ],
          divider: true
        },
        {  // toString()
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
          definition: '| ' + small('returns ') + kwd('Array<'+a('Vector')+'>'),
          descriptions: [ "takes an array of vectors, specified with numerical coordinates, "+a('Vector')+' objects, or a mixture of the two, and returns an array of equivalent '+a('Vector')+' objects.' ],
          samples: [ "var vectors = iio.Vector.vs( 0,0, 10,20, 50,30 );",
            "var vectors = iio.Vector.vs( 0,0, app.center, 50,30 );" ], 
          divider: true,
        },
        { // leftmost
          definition: 'Vector.leftmost( '+kwd('Array')+'<'+a('Vector')+'> vs ) | ' + small('returns ') + a('Vector'),
        },
        { // rightmost
          definition: 'Vector.rightmost( '+kwd('Array')+'<'+a('Vector')+'> vs ) | ' + small('returns ') + a('Vector'),
        },
        { // highest
          definition: 'Vector.highest( '+kwd('Array')+'<'+a('Vector')+'> vs ) | ' + small('returns ') + a('Vector'),
        },
        { // lowest
          definition: 'Vector.lowest( '+kwd('Array')+'<'+a('Vector')+'> vs ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns the leftmost/rightmost/lowest/highest vector in the given array of vectors.' ],
          samples: [ "var leftside = iio.Vector.leftmost( vs );",
            "var rightside = iio.Vector.rightmost( vs );",
            "var top = iio.Vector.highest( vs );",
            "var bottom = iio.Vector.lowest( vs );" ],
          divider: true,
        },
        { // length
          definition: 'Vector.length( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + kwd('number')
        },{
          definition: 'Vector.length( '+a('Vector')+' v ) | ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the length of the given vector.' ],
          samples: [ "var length = iio.Vector.length( 20,30 );",
            "length = iio.Vector.length( vector );" ],
          divider: true,
        },
        { // normalize
          definition: 'Vector.normalize( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + a('Vector')
        },{
          definition: 'Vector.normalize( '+a('Vector')+' v ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a normalize copy of the given vector.' ],
          samples: [ "var normalize = iio.Vector.normalize( 20,30 );",
            "normalize = iio.Vector.normalize( vector );" ],
          divider: true,
        },
        { // normalize
          definition: 'Vector.normalize( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + a('Vector')
        },{
          definition: 'Vector.normalize( '+a('Vector')+' v ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a normalize copy of the given vector.' ],
          samples: [ "var normalized = iio.Vector.normalize( 20,30 );",
            "var normalized = iio.Vector.normalize( vector );" ],
          divider: true,
        },
        { // rotate
          definition: 'Vector.rotate( '+kwd('number')+' x, '+kwd('number')+' y, '+kwd('number')+' radians )'
        },{
          definition: 'Vector.rotate( '+a('Vector')+' v, '+kwd('number')+' radians )',
        },{
          definition: '| ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a rotated copy of the given vector.' ],
          samples: [ "var rotated = iio.Vector.rotate( 20,30, Math.PI/4 );",
            "var rotated = iio.Vector.rotate( vector, Math.PI/4 );" ],
          divider: true,
        },
        { // add
          definition: 'Vector.add( '+a('Vector')+' v0, '+a('Vector')+' v1, ... ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns the sum of all given vectors.' ],
          samples: [ "var sum = iio.Vector.add( vector0, vector1, vector2 );" ],
          divider: true,
        },
        { // sub
          definition: 'Vector.sub( '+a('Vector')+' v0, '+a('Vector')+' v1, ... ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone of the first vector given, minus all other vectors given.' ],
          samples: [ "var v = iio.Vector.sub( vector0, vector1, vector2 );" ],
          divider: true,
        },
        { // mult
          definition: 'Vector.mult( '+a('Vector')+' v, '+kwd('number')+' factor ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone given vector multiplied by the given factor.' ],
          samples: [ "var v = iio.Vector.mult( vector, 5 );" ],
          divider: true,
        },
        { // div
          definition: 'Vector.div( '+a('Vector')+' v, '+kwd('number')+' divisor ) | ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone given vector divided by the given value.' ],
          samples: [ "var v = iio.Vector.div( vector, 5 );" ],
          divider: true,
        },
        { // dot
          definition: 'Vector.dot( '+kwd('number')+': x1, y1, x2, y2 ) | ' + small('returns ') + a('number')
        },{
          definition: 'Vector.dot( '+a('Vector')+' v, '+kwd('number')+' x2, y2 ) | ' + small('returns ') + a('number')
        },{
          definition: 'Vector.dot( '+a('Vector')+' v0, '+a('Vector')+' v1 ) | ' + small('returns ') + a('number'),
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
          definition: '| ' + small('returns ') + a('Vector'),
          descriptions: [ 'returns a clone of the first given vector, linearly interpolated with the second given value.' ],
          samples: [ "var lerped = iio.Vector.lerp( 10,20, 40,60, 0.5 );",
            "var lerped = iio.Vector.lerp( vector, 10,20, 0.5 );",
            "var lerped = iio.Vector.lerp( vector0, vector1, 0.5);" ],
        },
      ],
      'Instance Functions': [
        { // equals
          definition: 'equals( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + kwd('boolean')
        },{
          definition: 'equals( '+a('Vector')+' v ) | ' + small('returns ') + kwd('boolean'),
          descriptions: [ "returns true if this vector's values are equal to the given values or the given vector's values" ],
          samples: [ "if (vector.equals( 20,30 ))\n\t...",
            "if (vector.equals( vector1 ))\n\t..." ],
          divider: true,
        },
        { // length
          definition: 'length() | ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the length of the vector.' ],
          samples: [ "var vLength = vector.length();" ],
          divider: true,
        },
        { // normalize
          definition: 'normalize() | ' + small('returns ') + kwd('this'),
          descriptions: [ 'reduces the length of the vector to 1.' ],
          samples: [ "vector.normalize();" ],
          divider: true,
        },
        { // rotate
          definition: 'rotate( '+kwd('number')+' radians ) | ' + small('returns ') + kwd('this'),
          descriptions: [ 'rotates the vector by the given radian value.' ],
          samples: [ "vector.rotate( Math.PI / 4 );" ],
          divider: true,
        },
        { // add
          definition: 'add( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + kwd('this')
        },{
          definition: 'add( '+a('Vector')+' v ) | ' + small('returns ') + kwd('this'),
          descriptions: [ 'add the given values or vector to this vector.' ],
          samples: [ "vector.add( 20,30 );",
            "vector.add( vector1 );" ],
          divider: true,
        },
        { // sub
          definition: 'sub( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + kwd('this')
        },{
          definition: 'sub( '+a('Vector')+' v ) | ' + small('returns ') + kwd('this'),
          descriptions: [ 'subtract the given values or vector from this vector.' ],
          samples: [ "vector.sub( 20,30 );",
            "vector.sub( vector1 );" ],
          divider: true,
        },
        { // mult
          definition: 'mult( '+kwd('number')+' factor ) | ' + small('returns ') + kwd('this'),
          descriptions: [ 'multiply the vector by the given factor.' ],
          samples: [ "vector.mult( 3 );" ],
          divider: true,
        },
        { // div
          definition: 'div( '+kwd('number')+' divisor ) | ' + small('returns ') + kwd('this'),
          descriptions: [ 'divides the vector by the given value.' ],
          samples: [ "vector.div( 3 );" ],
          divider: true,
        },
        { // dot
          definition: 'dot( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + kwd('number')
        },{
          definition: 'dot( '+a('Vector')+' v ) | ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the dot product of this vector and the given vector.' ],
          samples: [ "var dotProduct = vector.dot( 2,3 );",
            "var dotProduct = vector.dot( vector1 );" ],
          divider: true,
        },
        { // dist
          definition: 'dist( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + kwd('number')
        },{
          definition: 'dist( '+a('Vector')+' v ) | ' + small('returns ') + kwd('number'),
          descriptions: [ 'returns the distance between this vector and the given vector.' ],
          samples: [ "var distance = vector.dist( 20,30 );",
            "var distance = vector.dist( vector1 );" ],
          divider: true,
        },
        { // lerp
          definition: 'lerp( '+kwd('number')+' x, '+kwd('number')+' y, '+kwd('number')+' interpolant )'
        },{
          definition: 'lerp( '+a('Vector')+' v, '+kwd('number')+' interpolant ) | ' + small('returns ') + kwd('this'),
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
          definition: 'Color.random() | ' + small('returns ') + a('Color'),
          descriptions: [ "Returns a random "+a('Color')+" with full alpha." ],
          samples: [ "var random_color = iio.Color.random();" ]
        }
      ],
      'Instance Functions': [
        {  // invert()
          definition: 'invert() | ' + small('returns ') + kwd('this'),
          descriptions: [ 'Inverts the r,g,b values of this color. Does not effect alpha.' ],
          samples: [ "color.invert();" ],
          divider: true
        },
        {  // randomize()
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
            definition: 'Sound( '+kwd('string')+' soundFile, '+kwd('function')+' onLoad , '+kwd('function')+' onError )',
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
            definition: 'play( [ ' +kwd('Integer') + ' delay, ' + kwd('Object') + ' properties ] )',
            descriptions: [
              "Play the sound through iio's AudioContext, with an optional delay",
              "Subject to it's properties at that moment in time",
              "Or optionally provide properties to be set before being played."
            ],
            samples: [
              "// set volume to 75% before playing\n// loop playback\nsound.play({ gain: 0.75, loop: true })"
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
          ],
          divider: true
        },{  // color
          definition: a('Color') + '|' + a('Gradient') + ' color',
          descriptions: [ "Draw color." ],
          samples: [ 
            "// access a drawable's color\nvar color = drawable.color;",
            "// set a drawable's color to a Color\ndrawable.set({ color: 'blue' });",
            "// set a drawable's color to a Gradient\ndrawable.set({ color: new iio.Gradient({\n\tstart: [ 0, -50 ] ),\n\tend: [ 0, 50 ],\n\tstops: [\n\t\t[ 0, 'black' ],\n\t\t[ 0.5, 'blue' ],\n\t\t[ 1, 'blue' ]\n\t]\n})});"
          ],
          divider: true
        },{  // paused
          definition: kwd('bool') + ' paused',
          descriptions: [ "A toggle indicating whether or not this objects "+kwd('loops')+' are running.' ],
          samples: [ 
            "// access a drawable's paused property\nvar paused = drawable.paused;",
            "// pause or unpause\ndrawable.pause();"
          ]
        }
      ],
      'Functions': [
        {  // onClick
          definition: 'onClick( '+a('Drawable')+' this, '+kwd('Event')+' event, '+a('Vector')+' pos ) | ' + small('returns ') + kwd('boolean'),
          descriptions: [ 
            "Called when a face or edge of the object is clicked. "+kwd('Event')+' is a JavaScript Event object.',
            "Note that this function only runs by default on "+a('App')+' and App.'+a('objs')+'.'
          ],
          samples: [ 
            "// detect when the app is clicked\napp.onClick = function( app, event, pos ){\n  // handle input...\n}",
            "// detect when an object added to app is clicked\napp.add( new iio.Rectangle({\n  //...\n  onClick: function( rectangle, event, pos ){\n    // handle input...\n  })\n});",
            "// simulate a click on the app\napp.onClick( app, null, app.center );"
          ]
        }
      ],
      'Associated Objects': [
        {  // app
          definition: a('App') + ' app',
          descriptions: [ "Associated App." ],
          samples: [ "// access a drawable's app\nvar app = drawable.app;" ]
        },{  // ctx
          definition: a('Context') + ' ctx',
          descriptions: [ "Associated Canvas 2d Context." ],
          samples: [ "// access a drawable's ctx\nvar ctx = drawable.ctx;" ]
        },{  // parent
          definition: a('Drawable') + ' parent',
          descriptions: [ "Parent object." ],
          samples: [ "// access a drawable's parent\nvar parent = drawable.parent;" ]
        }
      ],
      'Object Arrays': [
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
          definition: kwd('Array')+'<'+a('Object') + '> collisions',
          descriptions: [ "Array of collision objects." ],
          samples: [ 
            "// access collision object properties\nvar group0 = drawable.collisions[0][0];\nvar group1 = drawable.collisions[0][1];\nvar collision_callback = drawable.collisions[0][2];\n"
          ],
          divider: true
        },{  // loops
          definition: kwd('Array')+'<'+a('Object') + '> loops',
          descriptions: [ "Array of loop objects." ],
          samples: [ 
            "// access loop properties\nvar loopId = drawable.loops[0].id;\nvar loop_callback = drawable.loops[0].fn;",
          ]
        }
      ],
      'Object Management': [
        {  // clear()
          definition: 'clear( '+kwd('bool')+' noDraw ) | ' + small('returns ') + kwd('this'),
          descriptions: [ 'Clears the '+kwd('objs')+' array and cancels all loops in the cleared objects. Redraws the associated '+a('App')+' if noDraw is undefined or false.' ],
          samples: [
            "// clear all app objects\napp.clear();",
            "// clear all child objects in a Rectangle\n// suppress the redraw\nrectangle.clear( true );"
          ],
          divider: true
        },
        {  // add()
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
        {  // rmv()
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
        {  // create( p0, p1, ... )
          definition: 'create( '+kwd('p0')+', '+kwd('p1')+', ... ) | ' + small('returns ') + kwd('Object'),
          descriptions: [ 'Classifies given values by their type and creates and adds a new object with correct property value pairs. Possible objects created and returned can be: '+a('Vector')+', '+a('Color')+', '+a('Line')+', '+a('Text')+', '+a('Ellipse')+', '+a('Polygon')+', '+a('Rectangle')+', '+a('Grid')+'.' ],
          samples: [ 
            "// create a Vector\nvar vector = app.create( [10,20] );",
            "// create a Color\nvar color = app.create( 'red' );",
            "// create a Text at app center\nvar text = app.create( app.center, 'hello world' );",
            "// create a Rectangle at app center\nvar rectangle = app.create( app.center, 50, 'red' );",
            "// create a Line\nvar line = app.create( 'red', {\n\tvs: [\n\t\t[ 10,10 ],\n\t\t[ 80,80 ]\n\t]\n});",
            "// create a circle at app center\nvar circle = app.create( app.center, 'red', {\n\tradius: 20\n});"
          ],
          divider: true
        },
        {  // collision()
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
        {  // loop()
          definition: 'loop() | ' + small('returns ') + kwd('int')
        },{
          definition: 'loop( '+kwd('number')+' fps ) | ' + small('returns ') + kwd('int')
        },{
          definition: 'loop( '+kwd('function')+' callback ) | ' + small('returns ') + kwd('int')
        },{
          definition: 'loop( '+kwd('number')+' fps, '+kwd('function')+' callback ) | ' + small('returns ') + kwd('int'),
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
        {  // canvas
          definition: a('Canvas') + ' canvas',
          descriptions: [ "Associated HTML Canvas element." ],
          samples: [ "// access an app's canvas\nvar canvas = drawable.canvas;" ]
        },{  // center
          definition: a('Vector') + ' center',
          descriptions: [ "The center coordinate of the app." ],
          samples: [ "// access an app's center coordinate\nvar center = drawable.center;" ]
        }
      ],
      'Functions':[
        {  // draw
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
          definition: kwd('bool')+' hidden',
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
          definition: a('Array') + '|'+kwd('number')+' dash',
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
          definition: 'left() | ' + small('returns ') + kwd('number'),
        },{ // right()
          definition: 'right() | ' + small('returns ') + kwd('number'),
        },{ // top()
          definition: 'top() | ' + small('returns ') + kwd('number'),
        },{ // bottom()
          definition: 'bottom() | ' + small('returns ') + kwd('number'),
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
          definition: '| ' + small('returns ') + kwd('this'),
          descriptions: [ "Sets the shape's current sprite to the given sprite or the sprite in "+a('anims')+" with the given name.",
            "Redraws the parent app unless "+kwd('suppressDraw')+' is defined',
            "If a "+a('Sprite')+' is given, it is inserted at the front of '+a('anims')+'.',
          ],
          samples: [
            "// set the sprite to an existing sprite attachment\nshape.setSprite('walking');",
            "// set the sprite to a new sprite\n// and suppress the redraw\nshape.setSprite( spritemap.map({\n\t//...\n}, true );",
          ],
          divider: true,
        },{  // stopAnim()
          definition: 'stopAnim() | ' + small('returns ') + kwd('this'),
          descriptions: [ "Stops the active animations." ],
          samples: [ "// stop a shape's animations \nshape.stopAnim();" ],
          divider: true,
        },{  // nextFrame()
          definition: 'nextFrame( '+a('Shape')+' shape ) | ' + small('returns ') + kwd('this'),
          descriptions: [ "Advances the "+kwd('animFrame')+", returns to index "+kwd("0")+" if the last frame is active." ],
          samples: [ "// advance to the next frame\nshape.nextFrame(shape);" ],
          divider: true,
        },{  // prevFrame()
          definition: 'prevFrame( '+a('Shape')+' shape ) | ' + small('returns ') + kwd('this'),
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
          definition: 'trueVs( '+kwd('boolean')+' rotateVs ) | ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
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
          definition: 'setSize( '+kwd('number')+' width, '+kwd('number')+' height ) | ' + small('returns ') + kwd('this'),
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
          definition: 'trueVs() | ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
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
          definition: 'setSize( '+kwd('number')+' width, '+kwd('number')+' height ) | ' + small('returns ') + kwd('this'),
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
          definition: 'trueVs() | ' + small('returns ') + kwd('Array')+'<'+a('Vector')+'>',
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
            "// create a new text object\nvar textObj = new iio.Text({\n\tpos: app.center,\n\ttext: 'Hello World',\n\tcolor: 'red',\n\tsize: 40,\n\tfont: 'Arial',\n\talign: 'center'\n});",
            "// add the text object to the app\napp.add( textObj );"
            ]
        }
      ],
      'Properties': [
        {  // text
          definition: kwd('String')+' text',
          descriptions: [ "A string identifying the text object's printed characters." ],
          samples: [
            "// access the text string\nvar text_string = textObj.text;",
            "// set the text string\ntextObj.text = 'new text value';"
          ],
          divider: true
        },
        { // size
          definition: kwd('number')+' size',
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
          definition: kwd('Array')+'<'+a('Rectangle') + '> cells',
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
          definition: '| ' + small('returns ') + kwd('boolean'),
          descriptions: [ 
            "Called when a face or edge of the Grid is clicked. "+kwd('Event')+' is a JavaScript Event object.',
            "Note that this function only runs by default on grids added directly to "+a('App')+'.'
          ],
          samples: [ 
            "// detect when the grid is clicked\ngrid.onClick = function( grid, event, pos, cell ){\n  // handle input...\n}",
          ],
          divider: true
        },{ // cellAt()
          definition: 'cellAt( '+kwd('number')+' x, '+kwd('number')+' y ) | ' + small('returns ') + a('Quad'),
        },{
          definition: 'cellAt( '+a('Vector')+' v ) | ' + small('returns ') + a('Quad'),
          descriptions: [ 
            "Returns the cell that contains the given vector.",
          ],
          samples: [ 
            "// get the cell at the given coordinates\nvar cell = grid.cellAt( 40,10 );",
            "// get the cell at the given vector\nvar cell = grid.cellAt( vector );"
          ],
          divider: true
        },{ // cellCenter()
          definition: 'cellCenter( '+kwd('number')+': row, column ) | ' + small('returns ') + a('Quad'),
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
}
