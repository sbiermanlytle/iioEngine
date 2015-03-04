function Snow(app,s){

	app.set('black');

	var num = 400
	if(s&&s.preview) num = 50;

	for(var i=0; i<num; i++)
		app.add({
			pos:{
				x:iio.random.num(0,app.width),
				y:iio.random.num(-app.height,0)
			},
			width:iio.random.num(30,140),
			type:iio.CIRC,
			simple:true,
			color:(s.color||'white'),
			vel:{
				x:iio.random.num(-.1,.1),
				y:iio.random.num(.3,1)
			},
			fade:[iio.random.num(.0001,.001),function(o){
				return false;
			}],
			update:function(){
				this.vel.x+=iio.random.num(-.01,.01);
			}
		});

	this.resize=function(){
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds={
				bottom:[app.height+140,function(o){
					o.pos.x=iio.random.num(0,app.width);
					o.pos.y=iio.random.num(-app.height,-100);
				}],
				left:[0,function(o){o.vel.x*=-1}],
				right:[app.width,function(o){o.vel.x*=-1}]
			}
	}; this.resize();
}