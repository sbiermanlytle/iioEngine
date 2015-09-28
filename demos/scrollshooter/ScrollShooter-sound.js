ScrollShooter = function( app, s ){

	var meteors = [];
	var stars = [];
	var lasers = [];
	var player;
	var imgPath = 'img/';

	var numSmallStars = 50;
	var numBigStars = 26;
	var numSmallMeteors = 20;
	var numBigMeteors = 10;

	if( s && s.preview ){
		numSmallMeteors /= 2;
		numBigStars /= 2;
		numSmallMeteors /= 2;
		numBigMeteors /= 2;
	} else app.set({ color:'black' });

	function bringToTop(o){ 
		o.pos.y = -100; 
		o.pos.x = iio.random( 0, app.width );
	}

	function createScrollObjects(num, arr, props){
		for ( var i=0; i<num; i++ )
			arr.push( app.add( new iio.Rectangle({
				z: props.z,
				img: props.img, 
				health: props.health,
				rotation: iio.random( props.rotation.min,
									  props.rotation.max ),
				pos: [
					iio.random( 0, app.width ),
					iio.random( -100, app.height )
				],
				vel:[
					iio.random( props.vel.x.min,
								props.vel.x.max ),
					iio.random( props.vel.y.min,
								props.vel.y.max )
				],
				rVel: iio.random( props.rVel.min,
								  props.rVel.max ),
				bounds: {
					bottom: {
						bound: app.height + 100,
						callback: bringToTop
					}
				}
			})));
	}

	var starSmallImg = iio.load( imgPath+'starSmall.png', function(){
		createScrollObjects( numSmallStars, stars, {
			img: starSmallImg,
			rotation: { min: 0, max: 0 },
			rVel: { min: 0, max: 0 },
			vel: {
				x: { min: 0, max: 0 },
				y: { min: 1, max: 2 }
			}
		});
	});

	var starBigImg = iio.load( imgPath+'starBig.png', function(){
		createScrollObjects( numBigStars, stars, {
			z: 10,
			img: starBigImg,
			rotation: { min: 0, max: 0 },
			rVel: { min: 0, max: 0 },
			vel: {
				x: { min: 0, max: 0 },
				y: { min: 2, max: 3 }
			}
		});
	});

	var meteorProps = {
		z: 25,
		rotation: { min: -7, max: 7 },
		rVel: { min: -.04, max: .04 },
		vel: {
			x: { min: -3, max: 3 },
			y: { min: 4, max: 6 }
		}
	}

	var meteorBigImg = iio.load(imgPath+'meteorBig.png',function(){
		createScrollObjects( numBigMeteors, meteors, iio.merge({
			img: meteorBigImg,
			health: 5
		}, meteorProps));
	});
	

	var meteorSmallImg = iio.load(imgPath+'meteorSmall.png',function(){
		createScrollObjects( numSmallMeteors, meteors, iio.merge({
			img: meteorSmallImg,
			z: 25
		}, meteorProps));
	});

  var laserSound = iio.loadSound('sounds/laser.wav');
	
	var laserFlashImg = iio.load( imgPath+'laserRedShot.png' );
	var laserImg = iio.load( imgPath+'laserRed.png' );

	var leftImg = iio.load( imgPath+'playerLeft.png' );
	var rightImg = iio.load( imgPath+'playerRight.png' );
	var playerImg = iio.load( imgPath+'player.png', function(){
		player = app.add(new iio.Rectangle({
			pos: [
				app.center.x,
				app.height-100
			],
			z:100,
			vel: [0,0],
			img: imgPath+'player.png',
			xSpeed:8, 
			fSpeed:9, 
			bSpeed:5,
			laserCooldown:20,
			laserTimer:20,
			laserSpeed:20,
			onUpdate:function(){
				
				if( controller.RIGHT && player.right() < app.width ){
					this.vel.x = this.xSpeed;
					this.img = rightImg;
				} 
				else if( controller.LEFT && player.left() > 0 ){
					this.vel.x = -this.xSpeed;
					this.img = leftImg;
				} 
				else { 
					this.vel.x = 0; 
					this.img = playerImg;
				}

				if( controller.UP && player.top() > 0 )
					this.vel.y = -this.fSpeed;
				else if( controller.DOWN && player.bottom() < app.height ) 
					this.vel.y = this.bSpeed;
				else this.vel.y = 0;

				if( controller.SPACE && this.laserTimer == 20 ){
					fireLaser( player.pos.x - player.width/3,
						player.pos.y + 10, this.laserSpeed );
					fireLaser( player.pos.x + player.width/3,
						player.pos.y + 10, this.laserSpeed );
					this.laserTimer--;
				} 
				else if( this.laserTimer < 20 ){
					if( !controller.SPACE ) 
						this.laserTimer -= 2;
					else this.laserTimer--;
					if( this.laserTimer < 0 ) 
						this.laserTimer = this.laserCooldown;
				}
			}
		}));
	});

	fireLaser = function(x,y,s){
		lasers.push( app.add(new iio.Rectangle({
			pos: [ x, y ],
			z: 50,
			img: laserImg,
			vel: [ 0, -s ],
			bounds: { top: -100 }
		})));

    laserSound.play();
	}

	var controller = { 
		LEFT: 0, 
		RIGHT: 0, 
		UP: 0, 
		DOWN: 0, 
		SPACE: 0 
	}
	updateController=function(k,bool){
		if( k == 'left arrow' || k == 'a' ) 
			controller.LEFT = bool; 
		else if( k == 'right arrow' || k == 'd' ) 
			controller.RIGHT = bool;
		else if( k == 'up arrow' || k == 'w' ) 
			controller.UP = bool;
		else if( k == 'down arrow' || k == 's' ) 
			controller.DOWN = bool;
		else if( k == 'space' || k == 'ctrl' ) 
			controller.SPACE = bool;
	}

	this.keyDown = function(e,k){ 
		updateController(k,true) 
	}
	this.keyUp = function(e,k){ 
		updateController(k,false) 
	}

	this.resize=function(){
		if(player.right > app.width)
			player.pos.x = app.width - player.width/2
	}

	app.collision( lasers, meteors, function( lasor, meteor ){
		if( typeof( meteor.health ) !== 'undefined' ){
			if( meteor.health > 0 ) meteor.health--;
			else {
				for ( var i=0; i<5; i++ )
					meteors.push( app.add( new iio.Rectangle({
						pos: [
							iio.random( meteor.pos.x-30, meteor.pos.x+30 ),
							iio.random( meteor.pos.y-30, meteor.pos.y+30 )
						],
						img: meteorSmallImg, 
						z: 25,
						vel: [
							iio.random( -1, 2 ),
							iio.random( 4, 6 )
						],
						rVel: iio.random( -.2, .2 ),
						rot: iio.random( -7, 7 ),
						bounds: {
							bottom: {
								bound: app.height + 100,
								callback: bringToTop
							}
						}
					})));
				app.rmv(meteor);
			}
		} else app.rmv(meteor)

		app.add(new iio.Rectangle({
			z: 75,
			pos: [
				lasor.pos.x,
				lasor.pos.y-20
			],
			img: laserFlashImg,
			vel: meteor.vel,
			shrink: .2
		}));
		app.rmv(lasor);
	});

}; 
