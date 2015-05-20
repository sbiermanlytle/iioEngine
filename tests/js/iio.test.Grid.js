iio.test.Grid = {
	constructor : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3
		}));
	},
	constructor_res : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			lineWidth: 5,
			res: 25,
			R: 3,
			C: 3
		}));
	},
	rotation : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			rotation: Math.PI/4
		}));
	},
	origin : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center.clone().sub(10,10),
			origin: [10,10],
			color: settings.color,
			width: 60,
			lineWidth: 5,
			R: 3,
			C: 3,
			rVel: .02
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 0.6;

		function reverse(o){ o.vel.x *= -1 }

		app.add(new iio.Grid({
			pos: app.center.clone(),
			color: settings.color,
			width: 60,
			lineWidth: 5,
			R: 3,
			C: 3,
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

		var speed = 0.4;

		var Grid = app.add(new iio.Grid({
			pos: app.center.clone(),
			color: settings.color,
			width: 60,
			lineWidth: 5,
			R: 3,
			C: 3,
			vel: [ speed, 0 ],
			acc: [ .01, 0 ],
			bounds: {
				right: {
					bound: app.width,
					callback: function(o){
						o.vel.x = -speed*2
					}
				}
			}
		}));
	},
	rVel_bounds : function( app, settings ){

		function reverse(o){ o.rVel *= -1 }

		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 60,
			lineWidth: 5,
			R: 3,
			C: 3,
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
		app.add(new iio.Grid({
			pos: app.center.clone(),
			color: settings.color,
			width: 60,
			lineWidth: 5,
			R: 3,
			C: 3,
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

		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			hidden: false,
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
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
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color.clone(),
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			cycle: 0,
			onUpdate: iio.test.color
		}));
	},
	shrink : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			shrink: {
				speed: .02,
				upperBound: 80,
				lowerBound: 20,
				callback: function(o){
					if(o.width < o.shrink.lowerBound)
						o.shrink.speed = -.03;
					else o.shrink.speed = .03;
				}
			}
		}));
	},
	dash : function ( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			R: 3,
			C: 3,
			lineWidth: 5,
			dash: [ 2,5 ]
		}));
	},
	dash_rounded : function ( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			dash: [ .1, 9 ],
			dashOffset: 10,
			lineCap: 'round'
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			color: new iio.Gradient({
				start: [ 0, -80 ],
				end: [ 0, 80 ],
				stops: [
					[ 0, settings.color ],
					[ 1, 'black' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			color: new iio.Gradient({
				start: [ 0, 0 ],
				startRadius: 1,
				end: [ 0, 0 ],
				endRadius: 40,
				stops: [
					[ 0, settings.color ],
					[ 0.7, settings.color.clone() ],
					[ 1, 'black' ]
				]
			})
		}));
	},
	shadow : function( app, settings ){

		app.set({color:'white'})

		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color,
			width: 80,
			lineWidth: 5,
			R: 3,
			C: 3,
			dash: [ 10, 4 ],
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ],
		}));
	},
	/*bezier : function( app, settings ){
		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color.clone(),
			width: 10,
			bezier: [
				[ app.width,0 ],
				[ -app.width,0 ]
			],
			vs:[
				[ -60, -60 ],
				[ 60, 60 ]
			]
		}));
	},
	bezierVels : function( app, settings ){

		var speed = 1;

		var checkBound = function(o,v){
			if(o.bezier[v].x > app.width || o.bezier[v].x < -app.width)
				o.bezierVels[v].x *= -1;
		}

		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color.clone(),
			width: 10,
			vs:[
				[ 0, -60 ],
				[ 0, 60 ]
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

		app.add(new iio.Grid({
			pos: app.center,
			color: settings.color.clone(),
			width: 10,
			vs:[
				[ 0, -60 ],
				[ 0, 60 ]
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
	},*/
	child : function( app, settings ){

		var props = {
			R: 3,
			C: 3,
			width: 80,
			lineWidth: 5,
		}

		app.add( new iio.Grid( props, {
			pos: app.center,
			color: settings.color,
			rVel: .02
		})).add( new iio.Grid( props, {
			rotation: Math.PI/4,
			color: settings.color.clone().invert()
		}))
	}
}