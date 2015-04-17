function SpaceShooter(){
    var ioVec = iio.ioVec,
    ioObj = iio.ioObj,
    ioX = iio.ioX,
    ioLine = iio.ioLine,
    ioRect = iio.ioRect,
    ioBox = iio.ioBox,
    ioCircle = iio.ioCircle,
    ioText = iio.ioText,
    ioGrid = iio.ioGrid;

	var io;
    var player;
    var playerHSpeed = 9;
    var playerVSpeed = 8;
    var playerMove = [0,0,0,0,0];
    var spaceDown = false;
    var backgroundSpeed = 18;
    var asteroidHealth = 3;

    var imgPath = 'demo-apps/space-shooter/img/';

    var backgroundSrcs = [imgPath+'Background/starBig.png', 
                        imgPath+'Background/starSmall.png', 
                        imgPath+'Background/speedLine.png', 
                        imgPath+'Background/nebula.png'];

    var asteroidSrcs = [imgPath+'meteorBig.png', 
                        imgPath+'meteorSmall.png'];

	this.init = function(appManager){
		io = appManager;
    	io.setBGColor('#5e3f6b');
        io.createGroup('asteroids', 0);
        io.createGroup('stars', -30);
        io.createGroup('nebulas', -20);
        io.createGroup('player', 10);
        io.createGroup('player bullets', 10);
        io.createGroup('lasor flashes', 15);

        //create player
        var srcs = [imgPath+'playerLeft.png',
                    imgPath+'player.png',
                    imgPath+'playerRight.png'];

        player = io.addToGroup('player', new ioBox(io.canvas.center.x, io.canvas.height-100));
        player.createWithAnim(srcs, 1);

        setCollisionCallbacks();
    	io.setFramerate(60);
	}
    
    var shootTimer = 20;
    var shootCount = 0;
    this.update = function(dt){
        updateBackground();
        updatePlayer();
        if (spaceDown && shootCount < 0){
            createBullet(player.left()+10, player.pos.y);
            createBullet(player.right()-8, player.pos.y);
            shootCount = shootTimer;
        } 
        if (spaceDown) shootCount--;
        else shootCount-=4;
    }

    function setCollisionCallbacks(){
        io.setCollisionCallback('player bullets', 'asteroids', function(bullet, asteroid){
            io.addToGroup('lasor flashes', new ioBox((bullet.pos.x+asteroid.pos.x)/2, (bullet.pos.y+asteroid.pos.y)/2)).createWithImage(imgPath+'laserRedShot.png').setVel(asteroid.vel.x, asteroid.vel.y).shrink(.1);
            io.destroyInGroup(bullet, 'player bullets');
            if (typeof(asteroid.health) != 'undefined'){
                asteroid.health--;
                if (asteroid.health < 0){
                    var numFragments = getRandomInt(3,6);
                    for (var i=0; i<numFragments; i++)
                        io.addToGroup('asteroids', new ioBox(asteroid.pos.x+getRandomInt(-20,20), asteroid.pos.y+getRandomInt(-20,20))).createWithImage(asteroidSrcs[1]).setVel(getRandomNum(-2,2), getRandomNum(10,14)).setBounds(null, null, io.canvas.height+40, null).setTorque(getRandomNum(-.1,.1))
                    io.destroyInGroup(asteroid, 'asteroids');
                }
            } else {
                io.destroyInGroup(asteroid, 'asteroids');
                //score+=10;
                //scoreText.setText('Score: '+score);
            }
        });
    }

    function createBullet(x,y){
        io.addToGroup('player bullets', new ioBox(x,y), 10).createWithImage(imgPath+'laserRed.png').setBounds(-40,null,null,null).setVel(0,-16);
    }

    var bgCreatorDelay = 80;
    var bgCount = 0;
    function updateBackground(){
        if (bgCount < 1){
            runBgCreator(-io.canvas.height*2, 0);
            asteroidDensity = 3;
            for (var i=0; i<asteroidDensity; i++){
                createLargeAsteroids();
                createSmallAsteroids();
            }
            bgCount = bgCreatorDelay;
        } else bgCount--;
    }

    function runBgCreator(yMin, yMax){
        for (var i=0; i<4; i++)
            for (var j=i*io.canvas.width/4; j< (i+1)*io.canvas.width/4; j++)
                if (getRandomNum(0,10) < .2)
                    io.addObj(new ioBox(j, getRandomInt(yMin, yMax)), -20).createWithImage(backgroundSrcs[3]).setVel(0,backgroundSpeed).setBounds(null,null,io.canvas.height+100,null);
                else if (getRandomNum(0,10) < .4)
                    io.addObj(new ioBox(j, getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[getRandomInt(0,1)]).setVel(0,Math.round(backgroundSpeed/2)).setBounds(null,null,io.canvas.height+20, null);
    }

    function createLargeAsteroids(){
        var asteroid;
        if (getRandomNum(0, 10) < 8){
            asteroid = io.addToGroup('asteroids', new ioBox(getRandomInt(30,io.canvas.width-30), getRandomInt(-800,-50))).createWithImage(asteroidSrcs[0]).setVel(getRandomInt(-2,2), getRandomInt(10,14)).setBounds(null, null, io.canvas.height+40, null).setTorque(getRandomNum(-.1,.1));
            asteroid.health = asteroidHealth;
        }
    }
    function createSmallAsteroids(){
        if (getRandomNum(0, 10) < 8)
            io.addToGroup('asteroids', new ioBox(getRandomInt(30,io.canvas.width-30), getRandomInt(-800,-50))).setBounds(null, null, io.canvas.height+40, null).createWithImage(asteroidSrcs[1]).setVel(getRandomInt(-2,2), getRandomInt(10,14)).setTorque(getRandomNum(-.1,.1));
    }

    function updatePlayer(){
        if (playerMove[1] > 0){
            if (player.pos.x > Math.round(player.width/2+1)){
                player.translate(-playerHSpeed,0); 
                player.animIndex=0;
            } else player.animIndex=1;
        }
        if (playerMove[2] && player.pos.y > Math.round(player.height/2)) 
            player.translate(0,-playerVSpeed);
        if (playerMove[3] > 0 && player.pos.y < io.canvas.height-Math.round(player.height/2)){
            player.translate(0,playerVSpeed);
        }
        if (playerMove[4] > 0){
            if (player.pos.x < io.canvas.width-Math.round(player.width/2)){
                player.translate(playerHSpeed,0); 
                player.animIndex=2;
            } else player.animIndex=1;
        }
        if (playerMove[1] > 0 && playerMove[4] > 0)
            player.animIndex=1;
    }
    
    this.keyDown = function(event){
        if (keyCodeIs('left arrow', event) || keyCodeIs('a', event))
            playerMove[1] = 1;
        if (keyCodeIs('up arrow', event) || keyCodeIs('w', event))
            playerMove[2] = 1;
        if (keyCodeIs('right arrow', event) || keyCodeIs('d', event))
            playerMove[4] = 1;
        if (keyCodeIs('down arrow', event) || keyCodeIs('s', event))
            playerMove[3] = 1;
        if (keyCodeIs('space', event)){
            spaceDown = true;
        }
    }

    this.keyUp = function(event){
        if (keyCodeIs('left arrow', event) || keyCodeIs('a', event)){
            player.animIndex=1;
            playerMove[1] = 0;
        }
        if(keyCodeIs('up arrow', event) || keyCodeIs('w', event))
            playerMove[2] = 0;
        if (keyCodeIs('right arrow', event) || keyCodeIs('d', event)){
            player.animIndex=1;
            playerMove[4] = 0;
        }
        if (keyCodeIs('down arrow', event) || keyCodeIs('s', event))
            playerMove[3] = 0;
        if (keyCodeIs('space', event))
            spaceDown = false;
    }
}

