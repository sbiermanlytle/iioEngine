
var _color, _width, _padding;

assign_globals = function(){
	_color = [];
	_color[0] = new iio.Color.random();
	_color[1] = new iio.Color.random();
	_padding = 20;
	_width = 10;
	_height = 30;
}

function Test_Line_Constructor( app, settings ){

	app.add(new iio.Line({
		pos: app.center,
		color: _color[settings.c].clone(),
		width: _width,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		]
	}));
}
function Test_Line_Constructor_no_pos( app, settings ){

	app.add(new iio.Line({
		color: _color[settings.c].clone(),
		width: _width,
		vs:[
			[ _padding, _padding ],
			[ app.width-_padding, app.height-_padding ]
		]
	}));
}
function Test_Line_rotation( app, settings ){

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
}
function Test_Line_rotation_no_pos( app, settings ){

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
}
function Test_Line_origin( app, settings ){

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
}
function Test_Line_vel_bounds( app, settings ){

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
			right: [ app.center.x+15, reverse ],
			left: [ app.center.x-15, reverse ]
		}
	}));
}
function Test_Line_acc_bounds( app, settings ){

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
			right: [ app.center.x+15, function(o){
				o.vel.x = -.5;
			} ],
			left: [ app.center.x-15, function(o){
				o.vel.x = .5;
			} ]
		}
	}));
}
function Test_Line_vels( app, settings ){

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
}
function Test_Line_accs( app, settings ){

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
}
function Test_Line_rVel_bounds( app, settings ){

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
			rightRotation: [ Math.PI/2, reverse ],
			leftRotation: [ 0, reverse ]
		}
	}));
}
function Test_Line_rVel_bounds_no_pos( app, settings ){

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
			rightRotation: [ Math.PI/2, reverse ],
			leftRotation: [ 0, reverse ]
		}
	}));
}
function Test_Line_rAcc( app, settings ){

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
}
function Test_Line_hidden( app, settings ){

	app.loop(1);

	app.add(new iio.Line({
		pos: app.center,
		color: _color[settings.c].clone(),
		width: _width,
		hidden: true,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		],
		onUpdate: function(){
			this.hidden = !this.hidden;
		}
	}));
}
function Test_Line_alpha( app, settings ){

	app.add(new iio.Line({
		pos: app.center,
		color: _color[settings.c].clone(),
		width: _width,
		alpha: 1,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		],
		fading: true,
		speed: .01,
		onUpdate: function(){
			if(this.fading){
				this.alpha -= this.speed;
				if(this.alpha <= .02)
					this.fading = false;
			} else {
				this.alpha += this.speed;
				if(this.alpha >= .98)
					this.fading = true;
			}
		}
	}));
}
function Test_Line_color( app, settings ){

	app.add(new iio.Line({
		pos: app.center,
		color: _color[settings.c].clone(),
		width: _width,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		],
		cycle: 0,
		onUpdate: function(){
			switch(this.cycle){
				case 1: 
					if(this.color.g>100)
						this.color.g--;
					else if(this.color.r>100)
						this.color.r--;
					else this.cycle = iio.randomInt(1,3);
					break;
				case 2: 
					if(this.color.b<200)
						this.color.b++;
					else if(this.color.r<200)
						this.color.r++;
					else this.cycle = iio.randomInt(1,3);
					break;
				case 3: 
					if(this.color.g>0)
						this.color.g--;
					else if(this.color.r>0)
						this.color.r--;
					else this.cycle = iio.randomInt(1,3);
					break;
				default: 
					if(this.color.r<255)
						this.color.r++;
					else if(this.color.b<255)
						this.color.b++;
					else this.cycle = iio.randomInt(1,3);
			}
		}
	}));
}
function Test_Line_width( app, settings ){

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
		onUpdate: function(){
			if(this.growing){
				this.width++;
				if(this.width > _height)
					this.growing = false;
			} else {
				this.width--;
				if(this.width < 2)
					this.growing = true;
			}
		}
	}));
}
function Test_Line_lineCap( app, settings ){

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
}
function Test_Line_dash( app, settings ){

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
}
function Test_Line_bezier( app, settings ){

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
}
function Test_Line_shadow( app, settings ){

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
}
function Test_Line_child( app, settings ){

	var line_props = {
		color: _color[settings.c].clone(),
		width: 10,
		vs:[
			[ 0, -_height ],
			[ 0, _height ]
		]
	}

	var parent = app.add( new iio.Line(line_props,{
		pos: app.center,
		rVel: .02
	}) );
	var child = parent.add(new iio.Line(line_props,{
		vs:[
			[ -_height, 0 ],
			[ _height, 0 ]
		]
	}))
}
function Test_Line_bezierVels( app, settings ){

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
}
function Test_Line_bezierAccs( app, settings ){

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