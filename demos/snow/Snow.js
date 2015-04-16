function Snow(app,s){

	app.set({ color:'black' });

	var num = 400
	if(s&&s.preview) num = 50;

	for(var i=0; i<num; i++)
		app.add(new iio.Circle({
			pos:{
				x:iio.random(0,app.width),
				y:iio.random(-app.height,0)
			},
			radius:iio.random(15,70),
			color:'white',
			vel: [ iio.random(-.1,.1), iio.random(.1,.5) ],
			fade: {
				speed: iio.random(.0001,.001),
				onFinish: function(o){
					return false;
				}
			},
			onUpdate:function(){
				this.vel.x += iio.random(-.01,.01);
			}
		}), true);

	this.resize=function(){
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds={
				bottom:[app.height+140,function(o){
					o.pos.x=iio.random(0,app.width);
					o.pos.y=iio.random(-app.height,-100);
				}],
				left:[0,function(o){o.vel.x*=-1}],
				right:[app.width,function(o){o.vel.x*=-1}]
			}
	}; this.resize();
}