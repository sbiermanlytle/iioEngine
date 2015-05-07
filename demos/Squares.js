Squares = function(app,s){

	var speed = 0.5;
	var avg_width = 100;
	var num = app.width/5;
	if(s&&s.preview){
		num = 20;
		speed = .03;
		avg_width = 50;
	}

	for(var i=0; i<num; i++)
		app.add( new iio.Rectangle({
			pos: [ 
				iio.random(0,app.width),
				iio.random(0,app.height)
			],
			width: iio.random(avg_width-40,avg_width+40),
			color: 'white',
			vel: [
				iio.random(-speed,speed),
				iio.random(-speed,speed)
			],
			alpha: iio.random(.3,.6),
			fade: {
				speed: iio.random(.0001,.0006),
				callback: function(o){
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
				bottom:{
					limit: app.height-app.objs[i].height/2, 
					callback: function(o){ o.vel.y = -speed }
				},
				top:{
					limit: app.objs[i].height/2, 
					callback: function(o){ o.vel.y = speed }
				},
				left:{
					limit: app.objs[i].width/2, 
					callback: function(o){ o.vel.x = speed }
				},
				right:{
					limit: app.width-app.objs[i].width/2, 
					callback: function(o){ o.vel.x = -speed }
				}
			}
	}; this.resize();

}