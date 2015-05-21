iio.test.Text = {
	constructor : function(app, settings){
		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: "iio"
		}));
	},
	rotation : function(app, settings ){
		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: "iio",
			rotation: Math.PI/2
		}));
	},
	origin : function(app, settings ){
		app.add(new iio.Text({
			pos: app.center.clone().sub(18,18),
			origin: [18,18],
			color: settings.color,
			text: "iio",
			rVel: .02
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 1;

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Text({
			pos: app.center.clone(),
			color: settings.color,
			text: 'iio', 
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

		app.add(new iio.Text({
			pos: app.center.clone(),
			color: settings.color,
			text: 'iio',
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

		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
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

		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
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

		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
			hidden: false,
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
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
		app.add(new iio.Text({
			pos: app.center,
			color: settings.color.clone(),
			text: 'iio',
			cycle: 0,
			onUpdate: iio.test.color
		}));
	},
	outline : function( app, settings ){

		app.loop(5);

		app.add(new iio.Text({
			pos: app.center,
			text: 'iio',
			outline: settings.color.clone(),
			lineWidth: 1,
			growing: true,
			onUpdate: function(){
				if(this.growing){
					this.lineWidth++;
					if(this.lineWidth > 3)
						this.growing = false;
				} else {
					this.lineWidth--;
					if(this.lineWidth < 1)
						this.growing = true;
				}
				switch(this.cycle){
					case 1: 
						if(this.outline.g>100)
							this.outline.g--;
						else if(this.outline.r>100)
							this.outline.r--;
						else this.cycle = iio.randomInt(1,3);
						break;
					case 2: 
						if(this.outline.b<200)
							this.outline.b++;
						else if(this.outline.r<200)
							this.outline.r++;
						else this.cycle = iio.randomInt(1,3);
						break;
					case 3: 
						if(this.outline.g>0)
							this.outline.g--;
						else if(this.outline.r>0)
							this.outline.r--;
						else this.cycle = iio.randomInt(1,3);
						break;
					default: 
						if(this.outline.r<255)
							this.outline.r++;
						else if(this.outline.b<255)
							this.outline.b++;
						else this.cycle = iio.randomInt(1,3);
				}
			}
		}));
	},
	shrink : function( app, settings ){
		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
			size: 60,
			shrink: {
				speed: .03,
				upperBound: 60,
				lowerBound: 4,
				callback: function(o){
					if(o.size < o.shrink.lowerBound)
						o.shrink.speed = -.03;
					else o.shrink.speed = .03;
				}
			}
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Text({
			pos: app.center,
			text: 'iio',
			size: 40,
			outline: settings.color,
			lineWidth: 1,
			dash: [ 2, 2 ]
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Text({
			pos: app.center,
			text: 'iio',
			color: new iio.Gradient({
				start: [ 0, -100 ],
				end: [ 0, 10 ],
				stops: [
					[ 0, settings.color ],
					[ 1, 'black' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Text({
			pos: app.center,
			text: 'iio',
			color: new iio.Gradient({
				start: [ 0,-10 ],
				startRadius: 1,
				end: [ 0,-10 ],
				endRadius: 40,
				stops: [
					[ 0, settings.color ],
					[ 0.7, 'black' ],
					[ 1, 'black' ]
				]
			})
		}));
	},
	shadow : function( app, settings ){

		app.set({color:'white'})

		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ]
		}));
	},
	child : function( app, settings ){

		app.add( new iio.Text({
			color: settings.color,
			pos: app.center.clone().sub(0,18),
			origin: [ 0, 18 ],
			text: 'iio',
			rVel: .01
		})).add( new iio.Text({
			pos: [0, 36],
			color: settings.color.clone().invert(),
			text: 'iio'
		}))
	},
	flip : function( app, settings ){

		app.loop(1);

		app.add(new iio.Text({
			pos: app.center,
			color: settings.color,
			text: 'iio',
			flip: 'x',
			onUpdate: function(){
				if(this.flip == 'x')
					this.flip = false;
				else this.flip = 'x';
			}
		}));
	}
}