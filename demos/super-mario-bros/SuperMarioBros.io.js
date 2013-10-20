/*
The iio Engine is licensed under the BSD 2-clause Open Source license
Copyright (c) 2013, Sebastian Bierman-Lytle
All rights reserved.
*/
function SuperMarioBros(io){

	var mario;
	//create an SpriteMap object, define 16x32 sprite cells, pass onload function
	// - you can redefine sprite cell dimensions any time with setSpriteRes()
	var marioSprites = new iio.SpriteMap('img/mariobros_cmp.png',16,32,function(){

		//code calls when image has loaded
		mario = new iio.Rect(100, io.canvas.height-groundY)
			 .createWithAnim(marioSprites.getSprite(6,6),'standing')
			 .enableKinematics()
			 .setVel();

		mario.addAnim(marioSprites.getSprite(0,2),'walk');
		mario.addAnim(marioSprites.getSprite(4,4),'jump');
		mario.addAnim(marioSprites.getSprite(5,5),'duck');

		io.addObj(mario);
		io.setFramerate(60,update);
	});

	io.setBGImage('img/world1-1.png');
	var groundY=40;

	var LEFT = 0;
	var RIGHT = 1;
	var UP = 2;
	var DOWN = 3;
	var input = [];

	window.addEventListener('keydown', function(event){
	        updateInput(event, true);
	});
	window.addEventListener('keyup', function(event){
	        updateInput(event, false);
	});

	updateInput = function(event, boolValue){
		if (iio.keyCodeIs('left arrow', event) || iio.keyCodeIs('a', event))
			input[LEFT] = boolValue;
		if (iio.keyCodeIs('right arrow', event) || iio.keyCodeIs('d', event))
			input[RIGHT] = boolValue;
	    if (iio.keyCodeIs('up arrow', event) || iio.keyCodeIs('w', event)){
			input[UP] = boolValue;
			event.preventDefault();
		}
		if (iio.keyCodeIs('down arrow', event) || iio.keyCodeIs('s', event)){
			input[DOWN] = boolValue;
			event.preventDefault();
		}
	}

	//Print instructions
	io.addObj(new iio.Text('Use aswd or the arrow keys to move, jump, and duck',iio.Vec.add(io.canvas.center,0,6))
		.setFont('30px Consolas')
		.setTextAlign('center')
		.setFillStyle('black'));

	var animating=false; //prevent continuous triggering of animation
	var marioSpeed=1;

	function update(){

		//handle grounded mario
		if (mario.vel.y==0){
			if (input[LEFT] && input[RIGHT]){
				mario.vel.x=0;
				mario.stopAnim('standing');
				animating=false;
			} 
			else if (input[DOWN]){
				mario.setAnim('duck');
				mario.vel.x=0;
				animating=false;
			} 
			else if (input[LEFT]){
				if (!animating) {
					mario.flipImage(true);
					mario.playAnim('walk',15,io,true);
					animating=true;
				}
				mario.vel.x=-marioSpeed;
			} 
			else if (input[RIGHT]){
				if (!animating) {
					mario.flipImage(false);
					mario.playAnim('walk',15,io,true);
					animating=true;
				}
				mario.vel.x=marioSpeed;
			} 
			else if (mario.vel.y==0){
				mario.vel.x=0;
				mario.setAnim('standing');
				animating=false;
			}
			if(input[UP]&&mario.pos.y==io.canvas.height-groundY){
				mario.setAnim('jump');
				mario.vel.add(0,-7);
				mario.setAcc(0, 0.3);
				animating=true;
			}
		}
		//handle jumping mario
		else if(mario.vel.y>0&&mario.pos.y>=io.canvas.height-groundY){
			mario.vel.y=0;
			mario.acc.y=0;
			mario.pos.y=io.canvas.height-groundY;
			animating=false;
		}
	}
	}