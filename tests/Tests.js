/*iio.Test = {
	constructor: function( canvas, test_class, custom_properties, color ){
		iio.start([ function( app, settings ){
			app.add(new test_class({
				pos: app.center,
				color: _color[settings.c].clone()
			}, custom_properties ));
		}, { c: color || iio.Color.random() } ], canvas )
	}
}*/

var _color, _width, _height, _padding;
function assign_Test_globals(){
	_color = [];
	_color[0] = new iio.Color.random();
	_color[1] = new iio.Color.random();
	_padding = 20;
	_width = 10;
	_height = 30;
}

function create_test_canvas_grid( SIZE, COLS, ROWS ){
	var canvas, clear;
	for(var R=0; R<ROWS; R++){
		for(var C=0; C<COLS; C++){
			canvas = document.createElement('canvas');
			canvas.id = "c"+R+""+C;
			canvas.width = SIZE;
			canvas.height = SIZE;
			document.body.appendChild(canvas);
		}
		clear = document.createElement('div');
		clear.className = "clear";
		document.body.appendChild(clear);
	}
}

function Test_color(){
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
function Test_alpha(){
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
function Test_width(){
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