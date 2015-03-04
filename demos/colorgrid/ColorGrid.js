ColorGrid = function(app,s){

	var size = 20;
	app.set('black');

	function getShrinkRate(){
		if(s&&s.preview) return iio.random.num(.05,.09);
		else return iio.random.num(.05,.2);
	}

	function reset(){
		app.objs=[];
		for(var c=size/2; c<app.width; c+=size)
		for(var r=size/2; r<app.height; r+=size)
			app.add({
				pos: {x:c,y:r},
				width: size,
				simple: true,
				color: 'white',
				shrink:[getShrinkRate(),function(o){
					o.width=size;
					o.height=size;
					o.color=iio.random.color();
				}]
			}, true);
		app.draw();
	}; reset();

	this.resize=reset;
}