iio.test.Line = {
	constructor : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			]
		}));
	},
	constructor_no_pos : function( app, settings ){
		app.add(new iio.Line({
			color: settings.color,
			width: 10,
			vs:[
				[ 20, 20 ],
				[ app.width-20, app.height-20 ]
			]
		}));
	},
	rotation : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			rotation: Math.PI/2,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			]
		}));
	},
	rotation_no_pos : function( app, settings ){
		app.add(new iio.Line({
			color: settings.color,
			width: 10,
			rotation: Math.PI/2,
			origin: app.center,
			vs:[
				[ 20, 20 ],
				[ app.width-20, app.height-20 ]
			]
		}));
	},
	origin : function( app, settings ){
		app.add(new iio.Line({
			pos: [ 30,30 ],
			origin: [ 15, 15 ],
			color: settings.color,
			width: 10,
			rVel: .02,
			vs:[
				[ -15, -15 ],
				[ 15, 15 ]
			]
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 0.6;

		function reverse(o){ o.vel.x *= -1 }

		var line = app.add(new iio.Line({
			pos: app.center.clone(),
			color: settings.color,
			width: 10,
			vel: [ speed, 0 ],
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			],
			bounds: {
				right: {
					bound: app.width - 5, 
					callback: reverse 
				},
				left: {
					bound: 5, 
					callback: reverse
				}
			}
		}));
	},
	acc_bounds : function( app, settings ){

		var speed = 1;

		app.add(new iio.Line({
			pos: app.center.clone(),
			color: settings.color,
			width: 10,
			vel: [ speed, 0 ],
			acc: [ .01, 0 ],
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			],
			bounds: {
				right: {
					bound: app.width - 5, 
					callback: function(o){
						o.vel.x = -speed;
					} 
				}
			}
		}));
	},
	vels : function( app, settings ){

		var speed = 0.5;

		var checkBound = function(o,v){
			if(o.vs[v].x > app.width/2 || o.vs[v].x < -app.width/2)
				o.vels[v].x *= -1;
		}

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
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

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			vs:[
				[ 0, 30 ],
				[ 0, -30 ]
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

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			rVel: .02,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
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

		app.add(new iio.Line({
			color: settings.color,
			width: 10,
			rotation: Math.PI/2,
			rVel: -.02,
			origin: app.center,
			vs:[
				[ 20, 20 ],
				[ app.width-20, app.height-20 ]
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
		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			rAcc: .0015,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
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

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			hidden: false,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			],
			onUpdate: function(){
				this.hidden = !this.hidden;
			}
		}));
	},
	alpha : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			],
			color: settings.color,
			width: 10,
			fade: {
				speed: .03,
				callback: function(o){
					o.fade.speed *= -1;
				}
			}
		}));
	},
	color : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			color: settings.color.clone(),
			width: 10,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			],
			cycle: 0,
			onUpdate: iio.test.color
		}));
	},
	width : function( app, settings ){

		app.loop(15);

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 1,
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			],
			growing: true,
			onUpdate: iio.test.width
		}));
	},
	lineCap : function( app, settings ){
		var line_props = {
			width: 8,
			color: settings.color,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			]
		}

		app.add(new iio.Line(line_props,{
			pos: [ app.center.x - line_props.width*2, app.center.y ],
			lineCap: 'butt',
		}));

		app.add(new iio.Line(line_props,{
			pos: app.center,
			lineCap: 'round'
		}));

		app.add(new iio.Line(line_props,{
			pos: [ app.center.x + line_props.width*2, app.center.y ],
			lineCap: 'square'
		}));
	},
	dash : function( app, settings ){

		var line_props = {
			width: 10,
			color: settings.color,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			]
		}

		app.add(new iio.Line(line_props,{
			pos: [ app.center.x - line_props.width*2, app.center.y ],
			dash: 30/3
		}));

		app.add(new iio.Line(line_props,{
			pos: app.center,
			dash: [ .1, 10*1.5 ],
			dashOffset: 10,
			lineCap: 'round'
		}));

		app.add(new iio.Line(line_props,{
			pos: [ app.center.x + line_props.width*2, app.center.y ],
			dash: [ 1, 10*.3 ],
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			width: 30,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			],
			color: new iio.Gradient({
				start: [ 0, -30 ],
				end: [ 0, 30 ],
				stops: [
					[ 0, settings.color ],
					[ 1, new iio.Color(0,186,255) ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			width: 30,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			],
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

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ],
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			]
		}));
	},
	child : function( app, settings ){

		var line_props = {
			color: settings.color,
			width: 10,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
			]
		}

		app.add(new iio.Line(line_props,{
			pos: app.center,
			rVel: .02
		})).add(new iio.Line(line_props,{
			vs:[
				[ -30, 0 ],
				[ 30, 0 ]
			]
		}));
	},
	bezier : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			bezier: [
				[ app.width,0 ],
				[ -app.width,0 ]
			],
			vs:[
				[ -30, -30 ],
				[ 30, 30 ]
			]
		}));
	},
	bezierVels : function( app, settings ){

		var speed = 1;

		var checkBound = function(o,v){
			if(o.bezier[v].x > app.width || o.bezier[v].x < -app.width)
				o.bezierVels[v].x *= -1;
		}

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
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

		app.add(new iio.Line({
			pos: app.center,
			color: settings.color,
			width: 10,
			vs:[
				[ 0, -30 ],
				[ 0, 30 ]
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
	}
}