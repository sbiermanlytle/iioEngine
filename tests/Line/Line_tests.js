
var _color, _width, _padding;

assign_globals = function(){
	_color = [];
	_color[0] = new iio.Color(255,0,0);
	_color[1] = new iio.Color(0,0,255);
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
		torque: .01,
		vs:[
			[ -_height, -_height ],
			[ _height, _height ]
		]
	}));
}
