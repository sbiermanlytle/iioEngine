/*
 * iio Engine
 * Quick SpriteMap Demo
 * NOTE: this app will only work with the Github distribution of iio
 * 		 and the one in the SDK package available iio's the homepage
 *       a versioned package will be released on the website soon
 */
function SuperMarioBros(io){

	io.setBGImage('img/world1-1.png');
	var groundY=40;

    var LEFT = 0;
    var RIGHT = 1;
    var UP = 2;
    var DOWN = 3;
    var SPACE = 4;
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
        if (iio.keyCodeIs('space', event)){
            input[SPACE] = boolValue;
            event.preventDefault();
        }
    }

	//Print instructions
	io.addObj(new iio.ioText('Use a/s/w or the arrow keys to move and jump', iio.ioVec.add(io.canvas.center,0,6))
              .setFont('30px Consolas')
              .setTextAlign('center')
              .setFillStyle('black'));

	var animating=false; //prevent continuous triggering of animation
	var marioSpeed=1;

	function update(){

		if (input[LEFT] && input[RIGHT] && mario.vel.y==0){
			mario.vel.x=0;
	        mario.stopAnim('standing');
	        animating=false;
		} 
		else if (input[LEFT] && mario.vel.y==0){
			if (!animating) {
				mario.flipImage(true);
	        	mario.playAnim('walk',15,io);
				animating=true;
			}
			mario.vel.x=-marioSpeed;
		} 
		else if (input[RIGHT] && mario.vel.y==0){
			if (!animating) {
				mario.flipImage(false);
	        	mario.playAnim('walk',15,io);
	        	animating=true;dw
			}
			mario.vel.x=marioSpeed;
		} 
		else if (mario.vel.y==0){
			mario.vel.x=0;
	        mario.setSprite('standing');
	        animating=false;
		}
		if(input[UP]&&mario.pos.y==io.canvas.height-groundY){
	        mario.setSprite('jump');
	        mario.vel.add(0,-5);
	        mario.setAcc(0, 0.3);
	        animating=true;
		}
		if(mario.vel.y>0&&mario.pos.y>=io.canvas.height-groundY){
			mario.vel.y=0;
			mario.acc.y=0;
			mario.pos.y=io.canvas.height-groundY;
			animating=false;
		}
	}

	var mario;
	//create an ioSpriteMap object, define 16x32 sprite cells, pass onload function
	// - you can redefine sprite cell dimensions any time with setSpriteRes()
	var marioSprites = new iio.ioSpriteMap('img/mariobros_cmp.png',16,32,function(){

		//code calls when image has loaded
		mario = new iio.ioRect(100, io.canvas.height-groundY)
			 .createWithAnim(marioSprites.getSprite(6,6),'standing')
			 .enableKinematics();

	 	mario.setVel();
		mario.addAnim(marioSprites.getSprite(0,2),'walk');
		mario.addAnim(marioSprites.getSprite(4,4),'jump');
		io.addObj(mario);
		io.setFramerate(60,update);
	});
}