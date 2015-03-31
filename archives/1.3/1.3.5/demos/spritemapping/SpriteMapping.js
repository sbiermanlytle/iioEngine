SpriteMapping = function(app,s){

	app.set('black');

	var mario;
	var w=16;
	var h=32;
	var img_src = 'http://iioengine.com/img/mariobros_cmp.png';
	var map = new iio.SpriteMap(img_src,{
		onload:function(){
			mario = app.add(app.center,{
				//width:64,
				//height:128,
				anims:[
					map.sprite('normal',w,h,3,0,0),
					map.sprite('red',w,h,3,0,48),
					map.sprite('green',w,h,3,0,192),
				]
			},true);
			mario.playAnim(-6,'red');
		}
	});

}