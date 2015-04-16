<!-- 
	iio Engine v1.3
	***************
	Live Demo: iioapps.com/scroll-shooter
 -->
<!DOCTYPE html>
<html>
	<body>
		<script type="text/javascript" src="../../core/iioEngine.min.js"></script>
		<script type="text/javascript">

ScrollShooter = function(app,s){

	app.set('black');

	app.set({rqAnimFrame:true});

	var meteors = [];
	var stars = [];
	var lasers = [];
	var player;
	var imgPath = 'img/';

	var num_smallStars = 50;
	var num_bigStars = 26;
	var num_smallMeteors = 20;
	var num_bigMeteors = 10;

	if(s&&s.preview){
		num_smallMeteors/=2;
		num_bigStars/=2;
		num_smallMeteors/=2;
		num_bigMeteors/=2;
	}

	createScrollObjects=function(img,num,arr,smin,smax,
		z,rmin,rmax,xmin,xmax,rotmin,rotmax,bbx,health){
		for (var i=0;i<num;i++)
			arr.push(app.add({x:iio.random(0,app.width)
							 ,y:iio.random(-100,app.height)},{
				vel:{x:iio.random(xmin,xmax)
					,y:iio.random(smin,smax)
					,r:iio.random(rmin,rmax)},
				img:img, z:z, rot:iio.random(rotmin,rotmax),
				bounds:{bottom:[app.height+100,bringToTop]},
				simple:true,
				bbx:bbx,
				health:health
			}));
	}

	var starSmallImg = iio.load(imgPath+'starSmall.png',function(){
		createScrollObjects(starSmallImg,num_smallStars,stars
			,1,2,0,0,0,0,0,0,0);
	});
	var starBigImg = iio.load(imgPath+'starBig.png',function(){
		createScrollObjects(starBigImg,num_bigStars,stars
			,2,3,10,0,0,0,0,0,0);
	});
	var meteorBigImg = iio.load(imgPath+'meteorBig.png',function(){
		createScrollObjects(meteorBigImg,num_bigMeteors,meteors
			,4,6,25,-.04,.04,-3,3,-7,7,30,5);
	});
	var meteorSmallImg = iio.load(imgPath+'meteorSmall.png',function(){
		createScrollObjects(meteorSmallImg,num_smallMeteors,meteors
			,4,6,30,-.04,.04,-3,3,-7,7,20);
	});
	var laserFlashImg = iio.load(imgPath+'laserRedShot.png');
	var laserImg = iio.load(imgPath+'laserRed.png');

	var leftImg = iio.load(imgPath+'playerLeft.png');
	var rightImg = iio.load(imgPath+'playerRight.png');
	var playerImg = iio.load(imgPath+'player.png',function(){
		player = app.add([app.center.x,app.height-100],
			[imgPath+'player.png',{
			xSpeed:8, fSpeed:9, bSpeed:5,
			laserCooldown:20,
			laserTimer:20,
			z:100,
			laserSpeed:20,
			update:function(){
				if(controller.RIGHT&&player.right<app.width) {
					this.vel.x=this.xSpeed;
					this.img=rightImg;
				}
				else if(controller.LEFT&&player.left>0) {
					this.vel.x=-this.xSpeed;
					this.img=leftImg;
				}
				else { this.vel.x=0; this.img=playerImg }
				if(controller.UP&&player.top>0) this.vel.y=-this.fSpeed;
				else if(controller.DOWN&&player.bottom<app.height) 
					this.vel.y=this.bSpeed;
				else this.vel.y=0;
				if(controller.SPACE&&this.laserTimer==20){
					fireLaser(player.pos.x-player.width/3
						,player.pos.y+20,this.laserSpeed);
					fireLaser(player.pos.x+player.width/3
						,player.pos.y+20,this.laserSpeed);
					this.laserTimer--;
				} 
				else if(this.laserTimer<20){
					if(!controller.SPACE) 
						this.laserTimer-=2;
					else this.laserTimer--;
					if(this.laserTimer<0) 
						this.laserTimer = this.laserCooldown;
				}
		}}]);
	});

	function bringToTop(o){ 
		o.pos.y=-100; 
		o.pos.x=iio.random(0,app.width);
	}

	fireLaser=function(x,y,s){
		lasers.push(app.add({x:x,y:y},['z 50 vel :-'+s,{
			img:laserImg,
			simple:true,
			bbx:5,
			bounds:{top:[-100]}
		}]))
	}

	var controller={ LEFT:0, RIGHT:0, UP:0, DOWN:0, SPACE:0 }
	updateController=function(k,bool){
		if(k=='left arrow'||k=='a') controller.LEFT=bool; 
		else if(k=='right arrow'||k=='d') controller.RIGHT=bool;
		else if(k=='up arrow'||k=='w') controller.UP=bool;
		else if(k=='down arrow'||k=='s') controller.DOWN=bool;
		else if(k=='space'||k=='ctrl') controller.SPACE=bool;
	}

	this.onKeyDown=function(e,k){ updateController(k,true) }
	this.onKeyUp=function(e,k){ updateController(k,false) }

	this.resize=function(){
		if(player.right > app.width)
			player.pos.x = app.width - player.width/2
	}

	app.collision(lasers,meteors,function(l,m){
		if(typeof(m.health)!=='undefined'){
			if(m.health>0) m.health--;
			else {
				for (var i=0;i<5;i++)
					meteors.push(app.add({
						x:iio.random(m.pos.x-30,m.pos.x+30),
						y:iio.random(m.pos.y-30,m.pos.y+30)},{
						img:meteorSmallImg, z:25,
						vel:{x:iio.random(-1,2)
							,y:iio.random(4,6)
							,r:iio.random(-.2,.2)},
						rot:iio.random(-7,7),
						bounds:{bottom:[app.height+100,bringToTop]}
					}));
				app.rmv(m);
			}
		} else { app.rmv(m) }
		app.add({x:l.pos.x,y:l.pos.y-20},{img:laserFlashImg,
			vel:m.vel,shrink:.2,z:75});
		app.rmv(l);
	});

}; iio.start(ScrollShooter);

		</script>
	</body>
</html>