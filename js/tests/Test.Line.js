var	_padding = 20;
var	_width = 10;
var	_height = 30;

iio_Test.Line = {
	constructor : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: _width,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
			]
		}));
	},
	constructor_no_pos : function( app, settings ){
		app.add(new iio.Line({
			color: _color[settings.c].clone(),
			width: _width,
			vs:[
				[ _padding, _padding ],
				[ app.width-_padding, app.height-_padding ]
			]
		}));
	},
	rotation : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: _width,
			rotation: Math.PI/2,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
			]
		}));
	},
	rotation_no_pos : function( app, settings ){
		app.add(new iio.Line({
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
		app.add(new iio.Line({
			pos: [ _height,_height ],
			origin: [ _height/2, _height/2 ],
			color: _color[settings.c].clone(),
			width: _width,
			rVel: .02,
			vs:[
				[ -_height/2, -_height/2 ],
				[ _height/2, _height/2 ]
			]
		}));
	},
	vel_bounds : function( app, settings ){

		var speed = 0.4;

		function reverse(o){ o.vel.x *= -1 }

		var line = app.add(new iio.Line({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: 10,
			vel: [ speed,0 ],
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
			bounds: {
				right: {
					bound: app.center.x+15, 
					callback: reverse 
				},
				left: {
					bound: app.center.x-15, 
					callback: reverse
				}
			}
		}));
	},
	acc_bounds : function( app, settings ){

		var speed = 0.4;

		var line = app.add(new iio.Line({
			pos: app.center.clone(),
			color: _color[settings.c].clone(),
			width: 10,
			vel: [ speed,0 ],
			acc: [ .01, 0 ],
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
			bounds: {
				right: {
					bound: app.center.x+15, 
					callback: function(o){
						o.vel.x = -.5;
					} 
				},
				left: {
					bound: app.center.x-15, 
					callback: function(o){
						o.vel.x = .5;
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

		app.add(new iio.Line({
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

		app.add(new iio.Line({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: _width,
			rVel: .02,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
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
			color: _color[settings.c].clone(),
			width: _width,
			rAcc: .0015,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
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
			color: _color[settings.c].clone(),
			width: _width,
			hidden: false,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
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
				[ -_height, -_height ],
				[ _height, _height ]
			],
			color: _color[settings.c].clone(),
			width: _width,
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
			color: _color[settings.c].clone(),
			width: _width,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
			],
			cycle: 0,
			onUpdate: Test_color
		}));
	},
	width : function( app, settings ){

		app.loop(15);

		app.add(new iio.Line({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 1,
			vs:[
				[ -_height, -_height ],
				[ _height, _height ]
			],
			growing: true,
			onUpdate: Test_width
		}));
	},
	lineCap : function( app, settings ){
		var line_props = {
			width: 8,
			color: _color[settings.c].clone(),
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
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
			width: _width,
			color: _color[settings.c].clone(),
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			]
		}

		app.add(new iio.Line(line_props,{
			pos: [ app.center.x - line_props.width*2, app.center.y ],
			dash: _height/3
		}));

		app.add(new iio.Line(line_props,{
			pos: app.center,
			dash: [ .1, _width*1.5 ],
			dashOffset: _width,
			lineCap: 'round'
		}));

		app.add(new iio.Line(line_props,{
			pos: [ app.center.x + line_props.width*2, app.center.y ],
			dash: [ 1, _width*.3 ],
		}));
	},
	gradient : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			width: 30,
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
			color: new iio.Gradient({
				start: [ 0, -_height ],
				end: [ 0, _height ],
				stops: [
					[ 0, _color[settings.c].clone() ],
					[ 1, 'transparent' ]
				]
			})
		}));
	},
	radial_gradient : function( app, settings ){
		app.add(new iio.Line({
			pos: app.center,
			width: 30,
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			],
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
	shadow : function( app, settings ){

		app.set({color:'white'})

		app.add(new iio.Line({
			pos: app.center,
			color: _color[settings.c].clone(),
			width: 10,
			shadow: new iio.Color( 0,0,0,.5 ),
			shadowBlur: 5,
			shadowOffset: [ 4,4 ],
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			]
		}));
	},
	child : function( app, settings ){

		var line_props = {
			color: _color[settings.c].clone(),
			width: 10,
			vs:[
				[ 0, -_height ],
				[ 0, _height ]
			]
		}

		app.add(new iio.Line(line_props,{
			pos: app.center,
			rVel: .02
		})).add(new iio.Line(line_props,{
			vs:[
				[ -_height, 0 ],
				[ _height, 0 ]
			]
		}));
	},
	bezier : function( app, settings ){
		app.add(new iio.Line({
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

		app.add(new iio.Line({
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

		app.add(new iio.Line({
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
	}
}