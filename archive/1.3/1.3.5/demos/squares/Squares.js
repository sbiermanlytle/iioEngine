Squares = function(app,s){

	app.set('black');

	var num;
	if(s&&s.preview) num = 20;
	else num = app.width/5;

	for(var i=0; i<num; i++)
		app.add({
			pos: { 
				x:iio.random.num(0,app.width),
				y:iio.random.num(0,app.height)
			},
			width: iio.random.num(60,140),
			simple: true,
			color: 'white',
			vel: {
				x:iio.random.num(-.5,.5),
				y:iio.random.num(-.5,.5)
			},
			alpha: iio.random.num(.3,.6),
			fade: [ 
				iio.random.num(.0001,.0006),
				function(o){
					o.alpha=1;
				}],
			update: function(){
				this.vel.x += iio.random.num(-.01,.01);
				this.vel.y += iio.random.num(-.01,.01);
			}
		});

	this.resize=function(){
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds = {
				bottom:[ app.height, function(o){ o.vel.y = -1 }],
				top:[ 0, function(o){ o.vel.y = 1 }],
				left:[ 0, function(o){ o.vel.x = 1 }],
				right:[ app.width, function(o){ o.vel.x = -1 }]
			}
	}; this.resize();

}