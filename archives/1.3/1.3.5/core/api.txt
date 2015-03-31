/* iio Engine 1.3.4 api
*/
--------------------------------------------
// Summary
--------------------------------------------
Conditionals
	- if else then

Functions
	- add( position properties )
	- loop( fps code )
	- draw()

Constants
	- randomColor

Physical Properties
	- pos
	- rot
	- width
	- height
	- radius
	- center
	- vel
	- acc
	- hidden
	- simple
	- o

Display Properties
	- color
	- outline
	- lineWidth
	- alpha


--------------------------------------------
// Conditionals
--------------------------------------------
	'add center 50 red hidden 
		loop 1 
			!hidden 
			if hidden 
				app randomColor 
			else app black 
			then app draw'

	-----------------------------
	JS
	-----------------------------
	app.add({
		pos:app.center,
		width:50,
		color:'red',
		hidden:true
	}).loop(1, function(o){
		o.hidden = !o.hidden;
		if(o.hidden)
			app.color = iio.randomColor();
		else 
			app.color = 'black';
		app.draw();
	});


--------------------------------------------
// Functions
--------------------------------------------
/* add( position properties )
	- creates and adds an obj to the parent
	- default parent is app
*/
	app|obj add()
	---------------
	- add obj

		'add center red 50'

	JS - (app|obj).pos
	-----------------------------
	- add shape to app

		var obj = app.add({
			pos:{ x:40, y:90 },
			color:'red',
			width:50
		});

/* loop( fps code )
	- loop code at a specified rate
	- loop terminated by a "|" key
	- default fps is 60
*/
	app|obj loop()
	---------------
	- loop app color at 1 fps

		'loop 1 randomColor'

	- loop object creation

		'loop 1 add center 50 randomColor'

	JS - (app|obj).pos
	-----------------------------
	- add shape to app

		app.loop(1, function(){
			app.color = iio.randomColor();
		})

/* draw()
	- redraw the app and all objects
*/
	app draw()
	---------------
	'draw'

	JS - app.draw()
	-----------------------------
	- add shape to app

		app.draw();

--------------------------------------------
// Constants
--------------------------------------------
/* randomColor
*/
	'radomColor'

	JS
	-----------------------------
	iio.randomColor();

--------------------------------------------
// Physical Properties
--------------------------------------------
/* pos
	- position vector
	- app position relative to DOM origin
	- obj position relative to app origin
	Vector { x:?, y:? }
*/
	app|obj pos
	---------------
	- set pos

		'pos 40:90'

	- create shape with position

		'add 40:90 50 red' 

	JS - (app|obj).pos
	-----------------------------
	- set pos

		obj.pos = { x:40, y:90 };

		obj.set({ pos: { x:40, y:90 }});

	- create shape with position

		var obj = app.add({
			pos:{ x:40, y:90 },
			color:'red',
			width:50
		});

/* rot
	- rotation value in radians
	Number: integer or decimal
*/
	obj rot
	---------------
	- set rot

		'rot 2'

	- create shape with rotation

		'add center 50 red rot 2' 

	JS - obj.rot
	-----------------------------
	- set rot

		obj.rot = Math.PI/4;

		obj.set({ rot:Math.PI/4 });

	- create shape with rotation

		var obj = app.add({
			pos: app.center,
			color:'red',
			width:50,
			rot:Math.PI/4
		});

/* width
	- default property for number values
	Number: integer or decimal
*/
	app|obj width
	---------------
	- set width

		'width'

	- set width

		'width 50'

	- create shape with width

		'add center 50 red' 

	JS - (app|obj).width
	-----------------------------
	- get width

		obj.width;

	- set width

		obj.width = 50;

		obj.set({ width:50 });

	- create shape with width

		var obj = app.add({
			pos: app.center,
			color:'red',
			width:50
		});

/* height
	- depends on the existence of width
	Number: integer or decimal
*/
	app|obj height
	---------------
	- get height

		'height'

	- set height

		'height 100'

	- create shape with height

		'add center 50:100 red' 

	JS - (app|obj).height
	-----------------------------
	- get height

		obj.height;

	- set height

		obj.height = 100;

		obj.set({ height:100 });

	- create shape with height

		var obj = app.add({
			pos: app.center,
			color:'red',
			width:50,
			height:100
		});

/* radius
	- radius of elipse
	- dependent on the existence of width
	- height acts as radius 2 when radius exist
	- requires the "o" key when creating with iio
	Number: integer or decimal
*/
	obj radius
	---------------
	- create shape with radius

		'add center o 100 red' 

	JS - UNACCESSABLE
	-----------------------------

/* center
	- center vector
	- app center relative to app origin
	- obj center relative to app origin
	Vector { x:?, y:? }
*/
	app|obj center
	---------------
	- get center

	'center'

	- create shape at center

		'add center 50 red' 

	JS - (app|obj).center
	-----------------------------
	- get center

		obj.center;

	- create shape at center

		var obj = app.add({
			center: app.center,
			color:'red',
			width:50
		});

/* vel
	- velocity vector with rotational velocity
	Vector { x:?, y:?, r:? }
*/
	obj vel
	---------------
	- set vel

		'vel 1:1:.01'

	- create shape with velocity

		'add 50 red vel 1:1:.01' 

	JS - obj.vel
	-----------------------------
	- set vel

		obj.vel = { x:1, y:1, r:.01 };

		obj.set({ vel: { x:1, y:1, r:.01 }});

	- create shape with velocity

		var obj = app.add({
			pos:{ x:0, y:0 },
			color:'red',
			width:50,
			vel:{ x:1, y:1, r:.01 }
		});

/* acc
	- acceleration vector with rotational acceleration
	Vector { x:?, y:?, r:? }
*/
	obj acc
	---------------
	- set acc

		'acc 1:1:.01'

	- create shape with acceleration

		'add 50 red acc 1:1:.01' 

	JS - obj.acc
	-----------------------------
	- set acc

		obj.acc = { x:1, y:1, r:.01 };

		obj.set({ acc: { x:1, y:1, r:.01 }});

	- create shape with acceleration

		var obj = app.add({
			pos:{ x:0, y:0 },
			color:'red',
			width:50,
			acc:{ x:1, y:1, r:.01 }
		});

/* hidden
	- hides this object from updates, collisions, and renders
	Boolean
*/
	obj hidden
	---------------
	- set hidden

		'obj hidden'

	- create shape with hidden

		'add center 50 red hidden'

	JS - obj.hidden
	-----------------------------
	- set hidden

		obj.hidden = true;

		obj.set({ hidden:true });

	- create hidden shape

		var obj = app.add({
			pos:app.center,
			color:'red',
			width:50,
			hidden:true
		});

/* o
	- make into elipse
	Boolean
*/
	obj o
	---------------
	- set o

		'obj o'

	- create circle

		'add center 50 red o' 

	- create elipse

		'add center 50:100 red o' 

	JS - UNDEFINED
	-----------------------------

/* simple
	- use a simplified bounding box
	Boolean
*/
	obj simple
	---------------
	- set simple

		'obj simple'

	- create simple shape

		'add center 50 red simple' 

	JS - obj.simple
	-----------------------------
	- set simple

		obj.simple = true;

		obj.set({ simple:true });

	- create simple shape

		var obj = app.add({
			pos:app.center,
			color:'red',
			width:50,
			simple:true
		});

--------------------------------------------
// Display Properties
--------------------------------------------

/* color
	- fill color
	- default property for a given string
	String with:
		css color
		hexadecimal color
		css rgb format
		css rgba format 
*/
	app|obj color
	---------------
	- set color to red

		'red' 

	- create shape with color

		'add center 50 blue' 

	JS - (app|obj).color
	-----------------------------
	- set color to red

		obj.color = 'red';

		obj.set({ color:'red' });

	- create shape with color

		var obj = app.add({
			pos:app.center,
			width:50,
			color:'red'
		});

/* outline
	- outline color
	- function and property in iio Script
	String with:
		css color
		hexadecimal color
		css rgb format
		css rgba format 
*/
	app|obj outline
	---------------
	- set outline color and width

		'outline 3 red'

	- set outline to red

		'outline red' 

	- create shape with outline

		'add center 50 outline blue' 

	JS - (app|obj).outline
	-----------------------------
	- set outline to red

		obj.outline = 'red';

		obj.set({ outline:'red' });

	- create shape with outline

		var obj = app.add({
			pos:app.center,
			width:50,
			outline:'red'
		});

/* lineWidth
	- line and outline width
	- depends on the outline property to outline
	Number: integer or decimal
*/
	app|obj lineWidth
	---------------
	- set lineWidth

		'lineWidth 2'

	- create shape with lineWidth

		'add center 50 outline red 2' 

	JS - (app|obj).lineWidth
	-----------------------------
	- set lineWidth

		obj.lineWidth = 2;

		obj.set({ lineWidth:2 });

	- create shape with lineWidth

		var obj = app.add({
			pos:app.center,
			outline:'red',
			width:50,
			lineWidth:4
		});

/* alpha
	- transparency value
	Decimal between 0 - 1, inclusive
*/
	app|obj alpha
	---------------
	- set alpha

		'alpha .2'

	- create shape with alpha

		'add center 50 red alpha .2' 

	JS - (app|obj).alpha
	-----------------------------
	- set alpha

		obj.alpha = .2;

		obj.set({ alpha:.2 });

	- create shape with alpha

		var obj = app.add({
			pos:app.center,
			color:'red',
			width:50,
			alpha:.4
		});
