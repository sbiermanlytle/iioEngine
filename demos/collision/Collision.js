function Collision(app){
	app.set({color:'black'});

	var square_0;
	var square_1;

	function reverseX(o){ o.vel.x*=-1 }

	var app_boundary = {
		right: {
			bound: app.width,
			callback: reverseX
		},
		left: {
			bound: 0,
			callback: reverseX
		}
	}

	square_0 = app.add(new iio.Rectangle({
		width: 100,
		color: 'red',
		vel: [ 2, 0 ],
		bounds: app_boundary,
		pos: [
			app.width/3,
			app.center.y
		]
	}));

	square_1 = app.add(new iio.Rectangle({
		width: 100,
		color: 'blue',
		vel: [ -2, 0 ],
		bounds: app_boundary,
		pos: [
			app.width*2/3,
			app.center.y
		]
	}));

	app.collision( square_0, square_1, function(s0,s1){
		s0.vel.x*=-1;
		s1.vel.x*=-1;
	});
}