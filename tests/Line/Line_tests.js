
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
		color: _color[settings.c],
		width: _width,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		]
	}));
}
function Test_Line_Constructor_no_pos( app, settings ){

	app.add(new iio.Line({
		color: _color[settings.c],
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
		color: _color[settings.c],
		width: _width,
		rVel: .02,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		]
	}));
}
function Test_Line_rotation_no_pos( app, settings ){

	app.add(new iio.Line({
		color: _color[settings.c],
		width: _width,
		rVel: -.02,
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
		color: _color[settings.c],
		width: _width,
		rVel: .02,
		vs:[
			[ -_height/2, -_height/2 ],
			[ _height/2, _height/2 ]
		]
	}));
}
function Test_Line_alpha( app, settings ){

	app.add(new iio.Line({
		pos: app.center,
		color: _color[settings.c],
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
		color: _color[settings.c],
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
		color: _color[settings.c],
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