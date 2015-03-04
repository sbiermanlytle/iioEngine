function Collision(app){
	app.set('black').debug();

	var r = app.add({
		pos: {x:app.width/3, y:app.center.y },
		width: 100,
		outline:'white',
		lineWidth:5,
		vel: {x:6} 
	});

	var r2 = app.add({
		pos: {x:app.width*2/3,y:app.center.y},
		width: 100,
		outline: 'white',
		lineWidth: 5,
		vel: {x:-6}
	});

	function reverseX(o){ o.vel.x*=-1 }
	r.bounds=r2.bounds={
		left:[0,reverseX],
		right:[app.width,reverseX]
	}

	app.collision(r,r2,function(r,r2){
		app.log('collision');
		r.vel.x*=-1;
		r2.vel.x*=-1;
	})
}