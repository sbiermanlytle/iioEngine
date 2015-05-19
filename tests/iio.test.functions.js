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
var iioapps;
var app_colors;
iio.test = {};
iio.test.setup_master = function(){

	// DOM container for iio apps
	iioapps = document.body;

	// color array
	app_colors = [];
	app_colors[0] = new iio.Color.random();
	app_colors[1] = app_colors[0].clone().invert();

	iio.test.create_canvas_grid( 100, 5, 6 );
}
iio.test.create_canvas_grid = function( SIZE, COLS, ROWS ){
	var canvas, clear;
	for(var R=0; R<ROWS; R++){
		for(var C=0; C<COLS; C++){
			canvas = document.createElement('canvas');
			canvas.id = "c"+R+""+C;
			canvas.width = SIZE;
			canvas.height = SIZE;
			//canvas.codeurl = iio.test.source_code_url(R,C,test_class);
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
iio.test.show_tests = function( test_class, class_name ){

	var r = 0;
	var c = 0;
	var color = 0;

	function switch_color(){
		if(color == 0) color = 1;
		else color = 0;
	}

	function run_test(test_function,source_code_url){
		if(test_function){
			document.getElementById('c'+r+''+c).codeurl = source_code_url;
			iio.start([test_function, { color:app_colors[color] }], 'c'+r+''+c);
			switch_color();
			c++;
		}
	}

	function next_row(){
		c = 0;
		r++;
	}

	run_test( test_class.constructor,
		'tests/source-code/'+class_name+'/constructor.html' );
	run_test( test_class.constructor_no_pos, 
		'tests/source-code/'+class_name+'/constructor-no-pos.html' );
	run_test( test_class.constructor_res, 
		'tests/source-code/'+class_name+'/constructor-res.html' );
	run_test( test_class.rotation, 
		'tests/source-code/'+class_name+'/rotation.html' );
	run_test( test_class.rotation_no_pos, 
		'tests/source-code/'+class_name+'/rotation-no-pos.html' );
	run_test( test_class.origin, 
		'tests/source-code/'+class_name+'/origin.html' );
	
	run_test( test_class.rectXrect, 
		'tests/source-code/'+class_name+'/rectXrect.html' );

	next_row();

	run_test( test_class.vel_bounds,
		'tests/source-code/'+class_name+'/vel-bounds.html' );
	run_test( test_class.acc_bounds,
		'tests/source-code/'+class_name+'/acc-bounds.html' );
	run_test( test_class.vels,
		'tests/source-code/'+class_name+'/vels.html' );
	run_test( test_class.accs,
		'tests/source-code/'+class_name+'/accs.html' );

	next_row();

	run_test( test_class.rVel_bounds,
	 	'tests/source-code/'+class_name+'/rVel-bounds.html' );
	run_test( test_class.rVel_bounds_no_pos,
		'tests/source-code/'+class_name+'/rVel-bounds-no-pos.html' );
	run_test( test_class.rAcc_bounds,
		'tests/source-code/'+class_name+'/rAcc-bounds.html' );
	run_test( test_class.rAcc_bounds_no_pos,
		'tests/source-code/'+class_name+'/rAcc-bounds.html' );

	next_row();

	run_test( test_class.hidden,
		'tests/source-code/'+class_name+'/hidden.html' );
	run_test( test_class.alpha,
		'tests/source-code/'+class_name+'/alpha.html' );
	run_test( test_class.color,
		'tests/source-code/'+class_name+'/color.html' );
	run_test( test_class.width,	
		'tests/source-code/'+class_name+'/width.html' );
	run_test( test_class.outline,
		'tests/source-code/'+class_name+'/outline.html' );
	run_test( test_class.shrink,
		'tests/source-code/'+class_name+'/shrink.html' );

	next_row();

	run_test( test_class.lineCap,
		'tests/source-code/'+class_name+'/lineCap.html' );
	run_test( test_class.dash,
		'tests/source-code/'+class_name+'/dash.html' );
	run_test( test_class.dash_rounded,
		'tests/source-code/'+class_name+'/dash-rounded.html' );
	run_test( test_class.gradient,
		'tests/source-code/'+class_name+'/gradient.html' );
	run_test( test_class.radial_gradient,
		'tests/source-code/'+class_name+'/radial-gradient.html' );
	run_test( test_class.shadow,
		'tests/source-code/'+class_name+'/shadow.html' );

	next_row();

	run_test( test_class.child,
		'tests/source-code/'+class_name+'/child.html' );
	run_test( test_class.bezier,
		'tests/source-code/'+class_name+'/bezier.html' );
	run_test( test_class.bezierVels,
		'tests/source-code/'+class_name+'/bezierVels.html' );
	run_test( test_class.bezierAccs,
		'tests/source-code/'+class_name+'/bezierAccs.html' );
	run_test( test_class.img, 
		'tests/source-code/'+class_name+'/img.html' );
	run_test( test_class.flip, 
		'tests/source-code/'+class_name+'/flip.html' );
}
iio.test.color = function(){
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
iio.test.alpha = function(){
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
iio.test.width = function(){
	if(this.growing){
		this.width++;
		if(this.width > 20)
			this.growing = false;
	} else {
		this.width--;
		if(this.width < 2)
			this.growing = true;
	}
}
iio.test.outline = function(){
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