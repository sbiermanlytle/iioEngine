/////////////////////////////////////////////////////////////////
// iio Engine 1.3 Short API

//
// Functions added to Default JavaScript Classes
//
	Array.insert( index, item )
	inserts 'item' into the array at the specified 'index'

//
// iio Functions
//
	iio.start( app, id )
		starts the given application
		'id' is optional, and corresponds to an existing canvas id
		if no 'id' is provided, a new canvas will be created

	iio.randomNum( min, max )
	iio.randomInt( min, max )
		returns a random float or int within the given range
		the default range is 0-1

	iio.isNumber( obj )
	iio.isString( obj )
	iio.isFunction( obj )
		returns true if 'obj' is of the type specified in the function name
		returns false otherwise

	iio.randomColor()
		returns a random color in the format 'rgb(x,x,x)'

	iio.invertColor()
		returns the inversion of the given color
		Colors must be given in the format 'rgb(x,x,x)'

	iio.getKeyString( event )
		returns the string value of the given event keyCode

	iio.keyCodeIs( key, event )
		returns true if event has a keyCode corresponding to the given 'key' string

	iio.loadImage( src, fn )
		loads the given image, returns the new Image object
		'src' is a string path to the image
		'fn' is a function that runs when the image has finished loading

	iio.specVertex( vertices, comparator )
		returns a single vertex in the given 'vertices' array based on the
		given 'comparator' function
		no early exits

	iio.vecsFromPoints( points )
		retuns an array of new iio.Vec objects using the given 'points'
		'points' can be a mixed array of vector objects and numbers

//
// app Properties
//
	app.center
		returns a vector specifying the center of the canvas

	app.width
		returns the apps width

	app.height
		returns the apps height

//
// app Functions
//
	app.setBGColor( color )
		sets the apps background color
		'color' must be a string in one of the following formats:
			'rgb(255,255,255)'
			'#00baff'
			'white'

	app.setBGImage( src )
	app.setBGPattern( src )
		sets the image or pattern of the background with the given image
		'src' can be a string corresponding to the path of the image
			or a preloaded image object

	app.draw()
		redraws the application

	app.update( dt )
	app.update()
		updates all objects based on their kinematic properties
		'dt' is the time offset multiplier

	app.loop( fps, fn )
	app.loop( fn )
	app.loop()
		loops the applications internal update and render functions 
		at the users computer monitors framerate (usually 60fps)
		if 'fps' is specified, the application will attempt to update at that rate
			note that this will not produce reliable timeouts or smooth animations
		'fn' specifies an additional function to be run on every loop

	app.onInputDown( fn )
	app.onInputMove( fn )
	app.onInputUp( fn )
		sets a callback function for the specified user action
		'fn' will receive an event object

	app.getEventPosition( event )
		returns an iio.Vec of the event objects position relative to (0,0)

	app.add - see add documentation below
	app.rmv - see rmv documentation below

	app.setCollisionCallback( tag1, tag2, fn )
		'tag1' a value corresponding to the first object tag
		'tag2' a value corresponding to the second object tag
		'fn' a function that runs when an object with 'tag1' collides with 'tag2'
			this function will receive parameters obj1 and obj2

//
// Object creation and managment
//
	// ALL objects have the following functions
	*.add( positions, properties )
	*.add( text, position, properties )
	*.rmv( obj )
		the add function creates a new object based on the given properties
		the rmv function removes the specified object
		'positions' can be an iio.Vec, or a mixed array of vectors and numbers
		'text' is a string of text to display, this will create a iio.Text object
		'properties' is an object with optional physical and graphical properties

	'positions'
		1 position will generate a square, circle, or grid
		2 positions will generate a line or curve
		3+ positions will generate a polygon

		positions can be accessed with the properties:
			obj.pos - the center or first vertex of the object
			obj.endPos - the end position of a line or curve
			obj.vs - the rest of the vertices in a polygon

	'properties' possible values:

		width: #  - the width of a rectangle or grid object
		height: #  - the height of a rectangle or grid object

		radius: #  - the radius of a circle object

		rotation: # - the objects roation in Radians

		img: src - a string path or Image object

		tag: * - anything representing this objects group tag

		scale: iio.Vec - controls the scale of the object
		origin: iio.Vec - controls an origin offset for transformations
		
		R: # - the number of rows in a grid
		C: # - the number of columns in a grid
		res: iio.Vec - the pixel resolution of a grid

		bezier:[ h1.x, h1.y, h2.x, h2.y ]
			- the coordinates of 2 handles for a bezier curve

		vel: iio.Vec - velocity vector with z specifying rotation
		acc: iio.Vec - acceleration vector with z specifying torque

		fade:{		
			speed: # - speed at which the object fades
			fn: function - callback for when alpha has reached 0 or 1
		}

		shrink:{
			speed: # - speed at which the object shrinks
			fn: function - callback for when the objects surface area is below 0
		}

		bounds:{
			left: # - the boundary value
			right: #
			top: #
			bottom: #

			l_callback: function - the callback function. default action is to
			r_callback: function 	remove the object
			t_callback: function
			b_callback: function
		}

		// Object Styles 
		styles:{
			
			strokeStyle: 'color' - sets the stroke color of the shape
			lineWidth: # - sets the width of the stroke line

			fillStyle: 'color' - sets the fill color of the shape

			shadowColor: 'color' - sets the color of the shapes shadow
			shadowBlur: # - sets the blur factor of the shadow
			shadowOffsetX: # - the horizontal offset of the shadow
			shadowOffsetY: # - the vertical offset of the shadow
		}

//
// iio.Obj
//
	//mostly composed of the properties listed above
	o.right()
	o.left()
	o.bottom()
	o.top()
	o.draw( canvas2dContext )
	o.translate( x, y )
	o.translate( v )
	o.rotate( radiansToRotate )

//
//	iio.Grid extends iio.Obj
//
	g.cellCenter( c, r, pixelPosition )
	g.cellCenter( v, pixelPosition )
		retuns the center of the specified cell
		'c' and 'r' correspond to column and row indices
		unless true is passed for pixelPosition

	g.cellAt( c, r, pixelPosition)
	g.cellAt( v, pixelPosition)
		retuns the specified cell
		'c' and 'r' correspond to column and row indices
		unless true is passed for pixelPosition

//
// iio.Text extends iio.Obj
//
	t.text
		string with objects text value

	t.keyboardEdit( event, cursorIndex, shift, fn )
		edit this text with input from the keyboard
		event is a JavaScript event object
		'cursorIndex' specifies where to edit in the string
		'shift' specifies whether the shift key is down
		'fn' is a function that runs before the default one

	t.getX( index )
		returns the x coordinate of the letter at the given index

//
// Internal Functions
//
	this.resize
		called when the application is resized

//
// iio.Vec
//
	//Constructors
	iio.Vec( x, y, z )
	iio.Vec( v )

	// internal functions
	v.clone()
	v.toString()
	v.set( x, y, z )
	v.set( v )
	V.length()
	v.add( x, y )
	v.add( v )
	v.sub( x, y )
	v.sub( v )
	v.div( divisor )
	v.mult( factor )
	v.dot( x, y )
	v.dot( v )
	v.normalize()
	v.lerp( x, y, percentage )
	v.lerp( v, percentage )
	v.distance( x, y )
	v.distance( v )

	// static functions
	iio.Vec.toString( v )
	iio.Vec.length( x, y )
	iio.Vec.length( v )
	iio.Vec.add( x1, y1, x2, y2 )
	iio.Vec.add( v1, x2, y2 )
	iio.Vec.add( x1, y1, v2 )
	iio.Vec.add( v1, v2 )
	iio.Vec.sub( x1, y1, x2, y2 )
	iio.Vec.sub( v1, x2, y2 )
	iio.Vec.sub( x1, y1, v2 )
	iio.Vec.sub( v1, v2 )
	iio.Vec.div( x1, y1, divisor )
	iio.Vec.div( v1, divisor )
	iio.Vec.mult( x1, y1, factor )
	iio.Vec.mult( v1, factor )
	iio.Vec.dot( x1, y1, x2, y2 )
	iio.Vec.dot( v1, x2, y2 )
	iio.Vec.dot( x1, y1, v2 )
	iio.Vec.dot( v1, v2 )
	iio.Vec.normalize( x, y )
	iio.Vec.normalize( v )
	iio.Vec.lerp( x1, y1, x2, y2, percentage )
	iio.Vec.lerp( v1, x2, y2, percentage )
	iio.Vec.lerp( x1, y1, v2, percentage )
	iio.Vec.lerp( v1, v2, percentage )
	iio.Vec.distance( x1, y1, x2, y2 )
	iio.Vec.distance( v1, x2, y2 )
	iio.Vec.distance( x1, y1, v2 )
	iio.Vec.distance( v1, v2 )