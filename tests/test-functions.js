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

iio.test = {};

function create_test_canvas_grid( SIZE, COLS, ROWS ){
	var canvas, clear;
	for(var R=0; R<ROWS; R++){
		for(var C=0; C<COLS; C++){
			canvas = document.createElement('canvas');
			canvas.id = "c"+R+""+C;
			canvas.width = SIZE;
			canvas.height = SIZE;
			canvas.codeurl = testcode_url(R,C);
			canvas.onclick = function(e){
				codeWindow = window.open(this.codeurl, "littleWindow", "location=no,menubar=no,toolbar=no,width=500,height=600,left=0"); 
    			codeWindow.moveTo(0,0);
			}
			iioapps.appendChild(canvas);
		}
		clear = document.createElement('div');
		clear.className = "clear";
		iioapps.appendChild(clear);
	}
}

function testcode_url(R,C){
	if(R==0&&C==0) return 'tests/source-code/Line/constructor.html';
	if(R==0&&C==1) return 'tests/source-code/Line/constructor-no-pos.html';
	if(R==0&&C==2) return 'tests/source-code/Line/rotation.html';
	if(R==0&&C==3) return 'tests/source-code/Line/rotation-no-pos.html';
	if(R==0&&C==4) return 'tests/source-code/Line/origin.html';
	if(R==1&&C==0) return 'tests/source-code/Line/vel-bounds.html';
	if(R==1&&C==1) return 'tests/source-code/Line/acc-bounds.html';
	if(R==1&&C==2) return 'tests/source-code/Line/vels.html';
	if(R==1&&C==3) return 'tests/source-code/Line/accs.html';
	if(R==2&&C==0) return 'tests/source-code/Line/rVel-bounds.html';
	if(R==2&&C==1) return 'tests/source-code/Line/rVel-bounds-no-pos.html';
	if(R==2&&C==2) return 'tests/source-code/Line/rAcc-bounds.html';
	if(R==3&&C==0) return 'tests/source-code/Line/hidden.html';
	if(R==3&&C==1) return 'tests/source-code/Line/alpha.html';
	if(R==3&&C==2) return 'tests/source-code/Line/color.html';
	if(R==3&&C==3) return 'tests/source-code/Line/width.html';
	if(R==4&&C==0) return 'tests/source-code/Line/lineCap.html';
	if(R==4&&C==1) return 'tests/source-code/Line/dash.html';
	if(R==4&&C==2) return 'tests/source-code/Line/gradient.html';
	if(R==4&&C==3) return 'tests/source-code/Line/radial-gradient.html';
	if(R==4&&C==4) return 'tests/source-code/Line/shadow.html';
	if(R==5&&C==0) return 'tests/source-code/Line/child.html';
	if(R==5&&C==1) return 'tests/source-code/Line/bezier.html';
	if(R==5&&C==2) return 'tests/source-code/Line/bezierVels.html';
	if(R==5&&C==3) return 'tests/source-code/Line/bezierAccs.html';
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
function Test_outline(){
	if(this.growing){
		this.lineWidth++;
		if(this.lineWidth > 20)
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