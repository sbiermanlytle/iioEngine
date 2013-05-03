/*
 * iio Engine
 * Quick SpriteMap Demo
 * NOTE: this app will only work with the Github distribution of iio
 * 		 and the one in the SDK package available iio's the homepage
 *       a versioned package will be released on the website soon
 */
function SuperMarioBros(io){

	io.setBGImage('img/world1-1.png');

	//Print instructions
	io.addObj(new iio.ioText('Use a/s or the left/right arrow keys to move', iio.ioVec.add(io.canvas.center,0,6))
              .setFont('30px Consolas')
              .setTextAlign('center')
              .setFillStyle('black'));

	var mario;

	//create an ioSpriteMap object, define 16x32 sprite cells, pass onload function
	// - you can redefine sprite cell dimensions any time with setSpriteRes()
	var marioSprites = new iio.ioSpriteMap('img/mariobros_cmp.png',16,32,function(){

		mario = new iio.ioRect(100, io.canvas.height-40)
			 .createWithAnim(marioSprites.getSprite(6,6),'standing')
			 .enableKinematics();

		mario.addAnim(marioSprites.getSprite(0,2),'walk');
		io.addObj(mario);
	});

	var animating=false; //prevent continuous triggering of animation

	window.addEventListener('keydown', function(event){
	 
	    if (!animating&&(iio.keyCodeIs('right arrow',event)
	    		||iio.keyCodeIs('d',event))){
	    	animating=true;
	        mario.flipImage(false);
	        mario.playAnim('walk',15,io);
	        mario.setVel(4,0);
	    }
	 
	    else if (!animating&&(iio.keyCodeIs('left arrow',event)
	    		||iio.keyCodeIs('a',event))){
	    	animating=true;
	        mario.flipImage(true);
	        mario.playAnim('walk',15,io);
	        mario.setVel(-4,0);
	    }
	});

	window.addEventListener('keyup', function(event){
	 
	    if (iio.keyCodeIs('right arrow', event)
            ||iio.keyCodeIs('left arrow', event)
            ||iio.keyCodeIs('d',event)
            ||iio.keyCodeIs('a',event)){

	    	//'standing' is what will replace the current Anim
	    	//NOTE: you dont need to give it the context if
	    	//      you have a framerate set on the canvas
	        mario.stopAnim('standing',io.context);
	        
	    	animating=false;
		}
	});
}