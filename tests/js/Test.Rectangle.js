var	_padding = 20;
var	_width = 30;
var	_height = 60;

iio_Test.Rectangle = {
	constructor : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height
		}));
	},
	constructor_no_pos : function( app, settings ){
		app.add(new iio.Rectangle({
			color: _color[settings.c].clone(),
			width: _width,
			vs:[
				[ _padding, _padding ],
				[ app.width-_padding, app.height-_padding ]
			]
		}));
	},
	rotation : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			rotation: Math.PI/4
		}));
	},
	rotation_no_pos : function( app, settings ){
		app.add(new iio.Rectangle({
			color: _color[settings.c].clone(),
			width: _width,
			rotation: Math.PI/2,
			origin: app.center,
			vs:[
				[ _padding, _padding ],
				[ app.width-_padding, app.height-_padding ]
			]
		}));
	},
	origin : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			origin: [ 8, 8 ],
			color: _color[settings.c].clone(),
			width: _width/2,
			height: _height/2,
			rVel: .02
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 0.4;

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			vel: [ speed,0 ],
			bounds: {
				right: [ app.center.x+15, reverse ],
				left: [ app.center.x-15, reverse ]
			}
		}));
	},
	acc_bounds : function( app, settings ){

		var speed = 0.4;

		var Rectangle = app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			vel: [ speed,0 ],
			acc: [ .01, 0 ],
			bounds: {
				right: [ app.width, function(o){
					o.vel.x = -speed*2
				} ],
				left: [ 0, function(o){
					o.vel.x = speed
				} ]
			}
		}));
	},
	vels : function( app, settings ){

		var speed = 0.5;

		var checkBound = function(o,v){
			if(o.vs[v].x > app.width/2 || o.vs[v].x < -app.width/2)
				o.vels[v].x *= -1;
		}

		app.add(new iio.Rectangle({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 10,
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
			vels:[
				[ speed, 0 ],
				[ -speed, 0 ]
			],
			onUpdate: function(){
				checkBound(this,0);
				checkBound(this,1);
			}
		}));
	},
	accs : function( app, settings ){

		var speed = 0.5;

		var checkBound = function(o,v){
			if(o.vs[v].x > app.width/2)
				o.vels[v].x = -1;
			 else if (o.vs[v].x < -app.width/2)
				o.vels[v].x = 1;
		}

		app.add(new iio.Rectangle({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 10,
			vs:[
				[ 0, _height ],
				[ 0, -_height ]
			],
			vels:[
				[ speed, 0 ],
				[ -speed, 0 ]
			],
			accs:[
				[ .01, 0 ],
				[ -.01, 0 ]
			],
			onUpdate: function(){
				checkBound(this,0);
				checkBound(this,1);
			}
		}));
	},
	rVel_bounds : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Rectangle({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			rVel: .02,
			bounds: {
				rightRotation: [ Math.PI/2, reverse ],
				leftRotation: [ 0, reverse ]
			}
		}));
	},
	rVel_bounds_no_pos : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Rectangle({
			color: _color[settings.c].clone(),
			width: _width,
			rotation: Math.PI/2,
			rVel: -.02,
			origin: app.center,
			vs:[
				[ _padding, _padding ],
				[ app.width-_padding, app.height-_padding ]
			],
			bounds: {
				rightRotation: [ Math.PI/2, reverse ],
				leftRotation: [ 0, reverse ]
			}
		}));
	},
	rAcc : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
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

		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			hidden: false,
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			fade: {
				speed: .03,
				lowerBound: .2,
				onFinish: function(o){
					o.fade.speed *= -1;
				}
			}
		}));
	},
	color : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			cycle: 0,
			onUpdate: Test_color
		}));
	},
	outline : function( app, settings ){

		app.loop(10);

		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			width: _width,
			height: _height,
			outline: _color[settings.c].clone(),
			lineWidth: 1,
			growing: true,
			onUpdate: Test_outline
		}));
	},
	shrink : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: _width,
			height: _height,
			shrink: {
				speed: .03,
				upperBound: _width,
				lowerBound: 4,
				onFinish: function(o){
					o.shrink.speed *= -1;
				}
			}
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center.clone(),
			width: _width,
			height: _height,
			outline: _color[settings.c].clone(),
			lineWidth: 10,
			dash: [ 10, 5 ]
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Rectangle({
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
		app.add(new iio.Rectangle({
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
		app.add(new iio.Rectangle({
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

		app.add(new iio.Rectangle({
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
	bezier : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 10,
			bezier: [
				[ app.width,0 ],
				[ -app.width,0 ]
			],
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
			]
		}));
	},
	bezierVels : function( app, settings ){

		var speed = 1;

		var checkBound = function(o,v){
			if(o.bezier[v].x > app.width || o.bezier[v].x < -app.width)
				o.bezierVels[v].x *= -1;
		}

		app.add(new iio.Rectangle({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 10,
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
			bezier: [
				[ app.width,0 ],
				[ -app.width,0 ]
			],
			bezierVels: [
				[ -speed, 0 ],
				[ speed, 0]
			],
			onUpdate: function(){
				checkBound(this,0);
				checkBound(this,1);
			}
		}));
	},
	bezierAccs : function( app, settings ){

		var speed = 2;

		var checkBound = function(o,v){
			if(o.bezier[v].x > app.width)
				o.bezierVels[v].x = -speed;
			 else if (o.bezier[v].x < -app.width)
				o.bezierVels[v].x = speed;
		}

		app.add(new iio.Rectangle({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 10,
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
			bezier: [
				[ -app.width,0 ],
				[ app.width,0 ]
			],
			bezierVels: [
				[ speed, 0 ],
				[ -speed, 0]
			],
			bezierAccs:[
				[ -.01, 0 ],
				[ .01, 0 ]
			],
			onUpdate: function(){
				checkBound(this,0);
				checkBound(this,1);
			}
		}));
	},
	child : function( app, settings ){

		var props = {
			outline: _color[settings.c].clone(),
			lineWidth: 5
		}

		app.add( new iio.Rectangle(props,{
			pos: app.center,
			origin: [ _radius/3, -_radius/3 ],
			radius: _radius,
			rVel: .02
		})).add( new iio.Rectangle(props,{
			radius: _radius/2
		}))
	},
	img : function( app, settings ){
		app.add(new iio.Rectangle({
			pos: app.center,
			radius: app.width/2.5,
			clip: true,
			img: 'http://iioengine.com/img/staryNight.jpg'
		}));
	},
	flip : function( app, settings ){

		app.loop(1);

		app.add(new iio.Rectangle({
			pos: app.center,
			radius: app.width/2.5,
			clip: true,
			img: 'http://iioengine.com/img/flip.png',
			flip: 'x',
			onUpdate: function(){
				if(this.flip == 'x')
					this.flip = false;
				else this.flip = 'x';
			}
		}));
	}
}