ColorGrid = function(app,s){

	function reset(){

		app.objs=[];

		for(var c=s.w/2; c<app.width; c+=s.w)
		for(var r=s.w/2; r<app.height; r+=s.w)
			app.add(new iio.Rectangle({
				pos: [c,r],
				width: s.w,
				simple: true,
				color: 'white',
				shrink:{
					speed: iio.random(.05,.2),
					callback:function(o){
						o.width=s.w;
						o.height=s.w;
						o.color=iio.Color.random();
					}
				}
			}), true);
		app.draw();
	}; reset();

	this.resize=reset;
}