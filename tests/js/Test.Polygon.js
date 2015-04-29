var _size = 30;
var	_vs = [
	[ 0, -_size ],
	[ _size, _size ],
	[ -_size, _size ]
]

iio_Test.Polygon = {
	constructor : function(app, settings){
		app.add(new iio.Polygon({
			pos: app.center,
			color: _color[settings.c],
			vs: _vs
		}));
	},
	constructor_no_pos : function( app, settings ){
		app.add(new iio.Polygon({
			color: _color[settings.c],
			vs:[
				[ app.center.x, app.center.y - _size ],
				[ app.center.x + _size, app.center.y + _size ],
				[ app.center.x - _size, app.center.y + _size ]
			]
		}));
	},
	rotation : function(app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			color: _color[settings.c],
			vs: _vs,
			rotation: Math.PI/2
		}));
	},
	origin : function(app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			origin: [ _size/3, -_size/3 ],
			color: _color[settings.c],
			vs: [
				[ 0, -_size/2 ],
				[ _size/2, _size/2 ],
				[ -_size/2, _size/2 ]
			],
			rVel: .02
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 1; 

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: _color[settings.c],
			vs: _vs,
			vel: [ speed,0 ],
			bounds: {
				right: {
					bound: app.width*2,
					callback: reverse
				},
				left: {
					bound: -200,
					callback: reverse
				}
			}
		}));
	},
	acc_bounds : function( app, settings ){

		var speed = 1;

		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			radius: _radius,
			vel: [ speed,0 ],
			acc: [ .01, 0 ],
			bounds: {
				right: {
					bound: app.width, 
					callback: function(o){
						o.vel.x = -speed;
					}
				},
				left: {
					bound: 0, 
					callback: function(o){
						o.vel.x = speed;
					}
				}
			}
		}));
	},
	rVel_bounds : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: _color[settings.c],
			vs: _vs,
			rVel: .02,
			bounds: {
				rightRotation: {
					bound: Math.PI/2, 
					callback: reverse
				},
				leftRotation: {
					bound: 0, 
					callback: reverse
				}
			}
		}));
	},
	rVel_bounds_no_pos : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Polygon({
			color: _color[settings.c],
			rVel: -.02,
			rotation: Math.PI/2,
			origin: app.center.clone(),
			vs: [
				[ app.center.x, app.center.y - _size ],
				[ app.center.x + _size, app.center.y + _size ],
				[ app.center.x - _size, app.center.y + _size ]
			],
			bounds: {
				rightRotation: {
					bound: Math.PI/2, 
					callback: reverse
				},
				leftRotation: {
					bound: 0, 
					callback: reverse
				}
			}
		}));
	},
	rAcc_bounds : function( app, settings ){

		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: _color[settings.c],
			vs: _vs,
			rAcc: .0015,
			bounds: {
				rightRotation: {
					bound: Math.PI/2, 
					callback: function(o){
						o.rAcc *= -1; 
						o.rVel = -.01;
					}
				},
				leftRotation: {
					bound: -Math.PI/2,
					callback: function(o){
						o.rAcc *= -1; 
						o.rVel = .01;
					}
				}
			}
		}));
	},
	rAcc_bounds_no_pos : function( app, settings ){

		app.add(new iio.Polygon({
			color: _color[settings.c],
			rotation: Math.PI/2,
			rAcc: -.0015,
			origin: app.center.clone(),
			vs: [
				[ app.center.x, app.center.y - _size ],
				[ app.center.x + _size, app.center.y + _size ],
				[ app.center.x - _size, app.center.y + _size ]
			],
			bounds: {
				rightRotation: {
					bound: Math.PI/2, 
					callback: function(o){
						o.rAcc *= -1; 
						o.rVel = -.01;
					}
				},
				leftRotation: {
					bound: -Math.PI/2,
					callback: function(o){
						o.rAcc *= -1; 
						o.rVel = .01;
					}
				}
			}
		}));
	},
	hidden : function( app, settings ){

		app.loop(1);

		app.add(new iio.Polygon({
			pos: app.center,
			color: _color[settings.c],
			vs: _vs,
			hidden: false,
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: _color[settings.c],
			vs: _vs,
			fade: {
				speed: .03,
				lowerBound: .2,
				callback: function(o){
					o.fade.speed *= -1;
				}
			}
		}));
	},
	color : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			color: _color[settings.c].clone(),
			vs: _vs,
			cycle: 0,
			onUpdate: Test_color
		}));
	},
	outline : function( app, settings ){

		app.loop(10);

		app.add(new iio.Polygon({
			pos: app.center,
			vs: _vs,
			outline: _color[settings.c].clone(),
			lineWidth: 1,
			growing: true,
			onUpdate: Test_outline
		}));
	},
	shrink : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			color: _color[settings.c].clone(),
			vs: _vs,
			shrink: {
				speed: .03,
				upperBound: _radius,
				lowerBound: 4,
				callback: function(o){
					o.shrink.speed *= -1;
				}
			}
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			vs: _vs,
			outline: _color[settings.c],
			lineWidth: 10,
			dash: [ 10, 17 ]
		}));
	},
	dash_rounded : function ( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			vs: _vs,
			outline: _color[settings.c],
			lineWidth: 10,
			dash: [ .1, 14 ],
			dashOffset: 10,
			lineCap: 'round'
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			vs: _vs,
			color: new iio.Gradient({
				start: [ 0, -_size ],
				end: [ 0, _size ],
				stops: [
					[ 0, _color[settings.c] ],
					[ 1, 'transparent' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			vs: _vs,
			color: new iio.Gradient({
				start: [ 0,0 ],
				startRadius: 1,
				end: [ 0,0 ],
				endRadius: 40,
				stops: [
					[ 0, 'transparent' ],
					[ 0.4, _color[settings.c] ],
					[ 1, _color[settings.c] ]
				]
			})
		}));
	},
	shadow : function( app, settings ){

		app.set({color:'white'})

		app.add(new iio.Polygon({
			pos: app.center,
			outline: _color[settings.c],
			lineWidth: 5,
			dash: 20,
			vs: _vs,
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

		app.add( new iio.Polygon(props,{
			pos: app.center,
			origin: [ _radius/3, -_radius/3 ],
			radius: _radius,
			rVel: .02
		})).add( new iio.Polygon(props,{
			radius: _radius/2
		}))
	},
	img : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			radius: app.width/2.5,
			clip: true,
			img: 'http://iioengine.com/img/staryNight.jpg'
		}));
	},
	flip : function( app, settings ){

		app.loop(1);

		app.add(new iio.Polygon({
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