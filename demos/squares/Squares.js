Squares = function(app,s){

	var speed = 0.2;
	var num = 80;
	if(s&&s.preview) num = 40;

	for(var i=0; i<num; i++)
		app.add( new iio.Rectangle({
			pos: [ 
				iio.random(0,app.width),
				iio.random(0,app.height)
			],
			width: iio.random(num-20,num+20),
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

	this.resize = function(){
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds = {
				bottom: {
					bound: app.height, 
					callback: function(o){ 
						o.vel.y = -speed 
					}
				},
				top: {
					bound: 0, 
					callback: function(o){ 
						o.vel.y = speed 
					}
				},
				left: {
					bound: 0, 
					callback: function(o){ 
						o.vel.x = speed 
					}
				},
				right: {
					bound: app.width, 
					callback: function(o){ 
						o.vel.x = -speed
					}
				}
			}
	}; this.resize();

}