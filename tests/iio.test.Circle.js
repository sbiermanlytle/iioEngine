iio.test.Circle = {
	constructor : function(app, settings){
		app.add(new iio.Circle({
			pos: app.center,
			color: settings.color,
			radius: 25
		}));
	},
	rotation : function(app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			color: settings.color,
			radius: 25,
			rotation: Math.PI/2
		}));
	},
	origin : function(app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			origin: [ 8, -8 ],
			color: settings.color,
			radius: 25,
			rVel: .02
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 1;

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Circle({
			pos: app.center.clone(),
			color: settings.color,
			radius: 25,
			vel: [ speed,0 ],
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

		app.add(new iio.Circle({
			pos: app.center.clone(),
			color: settings.color,
			radius: 25,
			vel: [ speed, 0 ],
			acc: [ .01, 0 ],
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

		app.add(new iio.Circle({
			pos: app.center.clone(),
			origin: [ 12, -12 ],
			color: settings.color,
			radius: 25,
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
	rAcc_bounds : function( app, settings ){

		app.add(new iio.Circle({
			pos: app.center.clone(),
			origin: [ 12, -12 ],
			color: settings.color,
			radius: 25,
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
	hidden : function( app, settings ){

		app.loop(1);

		app.add(new iio.Circle({
			pos: app.center,
			color: settings.color,
			radius: 25,
			hidden: false,
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			color: settings.color,
			radius: 25,
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
		app.add(new iio.Circle({
			pos: app.center,
			color: settings.color.clone(),
			radius: 25,
			cycle: 0,
			onUpdate: iio.test.color
		}));
	},
	outline : function( app, settings ){

		app.loop(10);

		app.add(new iio.Circle({
			pos: app.center,
			radius: 25,
			outline: settings.color.clone(),
			lineWidth: 1,
			growing: true,
			onUpdate: iio.test.outline
		}));
	},
	shrink : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			color: settings.color,
			radius: 25,
			shrink: {
				speed: .03,
				upperBound: 25,
				lowerBound: 4,
				callback: function(o){
					if(o.radius < o.shrink.lowerBound)
						o.shrink.speed = -.03;
					else o.shrink.speed = .03;
				}
			}
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: 25,
			outline: settings.color,
			lineWidth: 10,
			dash: [ 10, 3 ]
		}));
	},
	dash_rounded : function ( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: 25,
			outline: settings.color,
			lineWidth: 10,
			dash: [ .1, 17.2 ],
			dashOffset: 10,
			lineCap: 'round'
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: 25,
			color: new iio.Gradient({
				start: [ 0, -25 ],
				end: [ 0, 25 ],
				stops: [
					[ 0, settings.color ],
					[ 1, 'black' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: 25,
			color: new iio.Gradient({
				start: [ 0,0 ],
				startRadius: 1,
				end: [ 0,0 ],
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

		app.add(new iio.Circle({
			pos: app.center,
			outline: settings.color,
			lineWidth: 5,
			dash: 20,
			radius: 25,
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ],
		}));
	},
	child : function( app, settings ){

		var props = {
			outline: settings.color,
			lineWidth: 5
		}

		app.add( new iio.Circle(props,{
			pos: app.center,
			origin: [ 8, -8 ],
			radius: 25,
			rVel: .02
		})).add( new iio.Circle(props,{
			radius: 12
		}))
	},
	img : function( app, settings ){
		app.add(new iio.Circle({
			pos: app.center,
			radius: app.width/2.5,
			clip: true,
			img: 'http://iioengine.com/img/staryNight.jpg'
		}));
	},
	flip : function( app, settings ){

		app.loop(1);

		app.add(new iio.Circle({
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