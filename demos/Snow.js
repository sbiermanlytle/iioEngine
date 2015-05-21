function Snow(app,s){

	var num = 400;
	var size = 50;
	if(s&&s.preview) {
		num = 50;
		size = 20;
	}

	for(var i=0; i<num; i++)
		app.add( new iio.Circle({
			pos:[ iio.random(0, app.width), iio.random(-app.height, 0) ],
			radius: iio.random(size-15, size+15),
			color: 'white',
			vel:[ iio.random(-.1, .1), iio.random(.1, .3) ],
			fade:{
				speed: iio.random(.0001,.001),
				callback: function(o){

					return false;
				}
			},
			onUpdate: function(){
				this.vel.x += iio.random(-.001, .001);
			}
		}), true);

	this.resize=function(){
		for(var i=0; i<app.objs.length; i++)
			app.objs[i].bounds = {
				bottom:{
					bound: app.height + 140, 
					callback: function(o){
						o.alpha = 1;
						o.pos.x = iio.random(0, app.width);
						o.pos.y = iio.random(-app.height, -100);
					}
				},
				left:{
					bound: 0,
					callback: function(o){ 
						o.vel.x*=-1 
					}
				},
				right:{ 
					bound: app.width, 
					callback: function(o){ 
						o.vel.x*=-1 
					}
				}
			}
	}; this.resize();
}