Squares = function(app,s){

	app.set({ color:'black' });

	var speed = 0.5;
	var num;
	if(s&&s.preview) num = 20;
	else num = app.width/5;

	for(var i=0; i<num; i++)
		app.add( new iio.Rectangle({
			pos: [ 
				iio.random(0,app.width),
				iio.random(0,app.height)
			],
			width: iio.random(60,140),
			color: 'white',
			vel: [
				iio.random(-speed,speed),
				iio.random(-speed,speed)
			],
			alpha: iio.random(.3,.6),
			fade: {
				speed: iio.random(.0001,.0006),
				onFinish: function(o){
					o.alpha=1;
				}
			},
			onUpdate: function(){
				this.vel.x += iio.random(-.01,.01);
				this.vel.y += iio.random(-.01,.01);
			}
		}), true);

	this.resize=function(){
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds = {
				bottom:[ app.height-app.objs[i].height/2, function(o){ o.vel.y = -speed }],
				top:[ app.objs[i].height/2, function(o){ o.vel.y = speed }],
				left:[ app.objs[i].width/2, function(o){ o.vel.x = speed }],
				right:[ app.width-app.objs[i].width/2, function(o){ o.vel.x = -speed }]
			}
	}; this.resize();

}