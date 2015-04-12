var	_radius = 25;

iio_Test.Circle = {
	constructor : function(app, settings){
		app.add(new iio.Circle({
			pos: app.center,
			color: _color[settings.c].clone(),
			radius: _radius
		}));
	},
	rotation : function(app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			color: _color[settings.c].clone(),
			radius: _radius,
			rotation: Math.PI/2
		}));
	},
	origin : function(app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			origin: [ _radius/3, -_radius/3 ],
			color: _color[settings.c].clone(),
			radius: _radius,
			rVel: .02
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 1;

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Circle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			radius: _radius,
			vel: [ speed,0 ],
			bounds: {
				right: [ app.width, reverse ],
				left: [ 0, reverse ]
			}
		}));
	},
	acc_bounds : function( app, settings ){

		var speed = 1;

		app.add(new iio.Circle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			radius: _radius,
			vel: [ speed,0 ],
			acc: [ .01, 0 ],
			bounds: {
				right: [ app.width, function(o){
					o.vel.x = -speed;
				} ],
				left: [ 0, function(o){
					o.vel.x = speed;
				} ]
			}
		}));
	},
	rVel_bounds : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Circle({
			pos: app.center.clone(),
			origin: [ _radius/2, -_radius/2 ],
			color: _color[settings.c].clone(),
			radius: _radius,
			rVel: .02,
			bounds: {
				rightRotation: [ Math.PI/2, reverse ],
				leftRotation: [ 0, reverse ]
			}
		}));
	},
	rAcc_bounds : function( app, settings ){

		app.add(new iio.Circle({
			pos: app.center.clone(),
			origin: [ _radius/2, -_radius/2 ],
			color: _color[settings.c].clone(),
			radius: _radius,
			rAcc: .0015,
			bounds: {
				rightRotation: [ Math.PI/2, function(o){
					o.rAcc *= -1; 
					o.rVel = -.01;
				} ],
				leftRotation: [ -Math.PI/2, function(o){
					o.rAcc *= -1; 
					o.rVel = .01;
				} ]
			}
		}));
	},
	hidden : function( app, settings ){

		app.loop(1);

		app.add(new iio.Circle({
			pos: app.center,
			color: _color[settings.c].clone(),
			radius: _radius,
			hidden: false,
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			color: _color[settings.c].clone(),
			radius: _radius,
			alpha: 1,
			fading: true,
			speed: .01,
			onUpdate: Test_alpha
		}));
	},
	color : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			color: _color[settings.c].clone(),
			radius: _radius,
			cycle: 0,
			onUpdate: Test_color
		}));
	},
	outline : function( app, settings ){

		app.loop(10);

		app.add(new iio.Circle({
			pos: app.center,
			radius: _radius,
			outline: _color[settings.c].clone(),
			lineWidth: 1,
			growing: true,
			onUpdate: Test_outline
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: _radius,
			outline: _color[settings.c].clone(),
			lineWidth: 10,
			dash: [ 10, 5 ]
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: _radius,
			color: new iio.Gradient({
				start: [ 0, -_radius ],
				end: [ 0, _radius ],
				stops: [
					[ 0, _color[settings.c].clone() ],
					[ 1, 'transparent' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: _radius,
			color: new iio.Gradient({
				start: [ 0,0 ],
				startRadius: 1,
				end: [ 0,0 ],
				endRadius: 40,
				stops: [
					[ 0, 'transparent' ],
					[ 0.4, _color[settings.c].clone() ],
					[ 1, _color[settings.c].clone() ]
				]
			})
		}));
	},
	dash_rounded : function ( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: _radius,
			outline: _color[settings.c].clone(),
			lineWidth: 10,
			dash: [ .1, 15 ],
			dashOffset: 10,
			lineCap: 'round'
		}));
	},
	shadow : function( app, settings ){

		app.set({color:'white'})

		app.add(new iio.Circle({
			pos: app.center,
			outline: _color[settings.c].clone(),
			lineWidth: 5,
			dash: 20,
			radius: _radius,
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ],
		}));
	},
	child : function( app, settings ){

		var props = {
			outline: _color[settings.c].clone(),
			lineWidth: 5
		}

		var parent = app.add( new iio.Circle(props,{
			pos: app.center,
			origin: [ _radius/3, -_radius/3 ],
			radius: _radius,
			rVel: .02
		}));

		var child = parent.add( new iio.Circle(props,{
			radius: _radius/2
		}));
	}
}