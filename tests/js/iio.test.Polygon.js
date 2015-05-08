iio.test.Polygon = {
	constructor : function(app, settings){
		app.add(new iio.Polygon({
			pos: app.center,
			color: settings.color,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			]
		}));
	},
	constructor_no_pos : function( app, settings ){
		app.add(new iio.Polygon({
			color: settings.color,
			vs:[
				[ app.center.x, app.center.y - 20 ],
				[ app.center.x + 20, app.center.y + 20 ],
				[ app.center.x - 20, app.center.y + 20 ]
			]
		}));
	},
	rotation : function(app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			color: settings.color,
			rotation: Math.PI/2,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			]
		}));
	},
	origin : function(app, settings ){
		app.add(new iio.Polygon({
			origin: app.center,
			color: settings.color,
			rVel: .02,
			vs:[
				[ 30, 15 ],
				[ 15, 45 ],
				[ 45, 45 ]
			]
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 1; 

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: settings.color,
			vel: [ speed,0 ],
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
			bounds: {
				right: {
					bound: app.width,
					callback: reverse
				},
				left: {
					bound: 0,
					callback: reverse
				}
			}
		}));
	},
	acc_bounds : function( app, settings ){

		var speed = 1;

		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: settings.color.clone(),
			vel: [ speed,0 ],
			acc: [ .01, 0 ],
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
			bounds: {
				right: {
					bound: app.width, 
					callback: function(o){
						o.vel.x = -speed;
					}
				}
			}
		}));
	},
	rVel_bounds : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Polygon({
			pos: app.center,
			color: settings.color,
			rVel: .02,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
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
	rVel_bounds_no_pos : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Polygon({
			color: settings.color,
			rVel: -.02,
			rotation: Math.PI/2,
			origin: app.center.clone(),
			vs:[
				[ app.center.x, app.center.y - 20 ],
				[ app.center.x + 20, app.center.y + 20 ],
				[ app.center.x - 20, app.center.y + 20 ]
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
			pos: app.center,
			color: settings.color,
			rAcc: .0015,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
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
	rAcc_bounds_no_pos : function( app, settings ){

		app.add(new iio.Polygon({
			color: settings.color,
			rotation: Math.PI/2,
			rAcc: -.0015,
			origin: app.center.clone(),
			vs: [
				[ app.center.x, app.center.y - 20 ],
				[ app.center.x + 20, app.center.y + 20 ],
				[ app.center.x - 20, app.center.y + 20 ]
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
			color: settings.color,
			hidden: false,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center.clone(),
			color: settings.color,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
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
			color: settings.color.clone(),
			cycle: 0,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
			onUpdate: iio.test.color
		}));
	},
	outline : function( app, settings ){

		app.loop(15);

		app.add(new iio.Polygon({
			pos: app.center,
			outline: settings.color.clone(),
			lineWidth: 1,
			growing: true,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
			onUpdate: iio.test.outline
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			outline: settings.color,
			lineWidth: 10,
			dash: 10,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			]
		}));
	},
	dash_rounded : function ( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			outline: settings.color,
			lineWidth: 8,
			dash: [ .1, 16 ],
			lineCap: 'round',
			vs: [
				[   0,-25 ],
				[  25, 25 ],
				[ -25, 25 ]
			]
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			vs: [
				[   0,-20 ],
				[  20, 20 ],
				[ -20, 20 ]
			],
			color: new iio.Gradient({
				start: [ 0, -20 ],
				end: [ 0, 20 ],
				stops: [
					[ 0, settings.color ],
					[ 1, 'black' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center,
			vs: [
				[   0,-30 ],
				[  30, 30 ],
				[ -30, 30 ]
			],
			color: new iio.Gradient({
				start: [ 0,10 ],
				startRadius: 1,
				end: [ 0,10 ],
				endRadius: 40,
				stops: [
					[ 0, 'transparent' ],
					[ 0.4, settings.color ],
					[ 1, settings.color ]
				]
			})
		}));
	},
	shadow : function( app, settings ){

		app.set({color:'white'})

		app.add(new iio.Polygon({
			pos: app.center,
			outline: settings.color,
			lineWidth: 5,
			dash: [20, 10],
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ],
			vs: [
				[   0,-30 ],
				[  30, 30 ],
				[ -30, 30 ]
			],
		}));
	},
	child : function( app, settings ){

		var props = {
			outline: settings.color.clone(),
			lineWidth: 5
		}

		app.add( new iio.Polygon(props,{
			pos: [
				app.center.x,
				app.center.y-10
			],
			origin: [0,10],
			rVel: .02,
			vs: [
				[   0,-24 ],
				[  30, 30 ],
				[ -30, 30 ]
			],
		})).add( new iio.Polygon(props,{
			vs: [
				[   0,-4 ],
				[  15, 20 ],
				[ -15, 20 ]
			]
		}))
	},
	/*img : function( app, settings ){
		app.add(new iio.Polygon({
			pos: app.center.clone(),
			clip: true,
			img: 'http://iioengine.com/img/staryNight.jpg',
			vs: [
				[   0,-30 ],
				[  30, 30 ],
				[ -30, 30 ]
			]
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
	}*/
}