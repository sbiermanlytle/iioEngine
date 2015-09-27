/*
The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2013, Sebastian Bierman-Lytle
All rights reserved.

Space Shooter App +

Plus version includes:
+ sound fx
+ multi-player
+ player ship spritesheet
+ player name tags
+ debug messages

Requires iio Engine 1.2.2+
(only available on Github)

CONTROLS:
player 1
-move: awsd
-shoot: space bar
player 2
-move: arrow keys
-shoot: enter or number pad 0

Tutorial for non-plus version:
http://iioEngine.com/tutorials/scroll-shooter
*/
function SpaceShooter(io){

    io.activateDebugger()
      .setOutlineStyle('red');

    var imgPath = 'img/';

    //Background Scene
    (function(){
        //function to move objects back to top of the screen
        moveToTop = function(obj){
            obj.setPos(iio.getRandomInt(10, io.canvas.width-10)
                          ,iio.getRandomInt(-340, -100));
            return true;
        }
        var bgSpeed = 8;
        var bgDensity = io.canvas.width/20;
        var bgImgs = [];
        io.setBGColor('#5e3f6b');

        //load background images
        for (var i=0; i<3; i++)
            bgImgs[i] = new Image();
        bgImgs[0].src = imgPath+'Background/starSmall.png';
        bgImgs[1].src = imgPath+'Background/starBig.png';
        bgImgs[2].src = imgPath+'Background/nebula.png';

        //create background objects
        for (var i=0; i<bgImgs.length; i++)
            bgImgs[i].onload = function(){
                var tag,zIndex,vel;
                switch(this[0]){
                    case 0: tag = 'small stars'; zIndex = -20; vel = bgSpeed; break;
                    case 1: tag = 'big stars'; zIndex = -15; vel = bgSpeed+.2; break;
                    case 2: tag = 'nebula'; zIndex = -5; vel = bgSpeed+4; break;
                }
                for (var j=0; j<bgDensity; j++)
                    if (iio.getRandomNum() < .4){
                        io.addToGroup(tag, new iio.SimpleRect(iio.getRandomInt(10, io.canvas.width-10)
                                            ,iio.getRandomInt(0, io.canvas.height)),zIndex)
                           .createWithImage(bgImgs[this[0]])
                           .enableKinematics()
                           .setVel(0,vel)
                           .setBound('bottom',io.canvas.height+140
                                     ,moveToTop);
                    }
            }.bind([i])
    })();
    
    //Player Ships
    var playersLoaded=false;
    (function(){

        var players = [];
        var playerSpeed=8;
        var LEFT = 0;
        var RIGHT = 1;
        var UP = 2;
        var DOWN = 3;
        var SPACE = 4;
        var inputs = [];
        var laserCooldown = 20;
        var laserTimers = [];

        function createPlayer(name,x,y){
            return io.addToGroup('players', new iio.SimpleRect(x,y)
                .createWithAnim(playerSprites.getSprite(0,0,99,75),'level'))
                .addAnim(playerSprites.getSprite(0,76,99,77),'left')
                .addAnim(playerSprites.getSprite(0,153,99,76),'right')
                .addObj(new iio.Text(name)
                    .setFont('20px Consolas')
                    .setTextAlign('center')
                    .setFillStyle('white')
                    ,false,io.context,0,60);
                    //boolean controls draw order
        }

        var playerSprites = new iio.SpriteMap('img/playerShips.png',function(){
            //image onload function

            players[1] = createPlayer('Player 1',io.canvas.width/3, io.canvas.height-100);
            players[2] = createPlayer('Player 2',io.canvas.width/3*2, io.canvas.height-100);

            for (var i=1;i<players.length;i++){
                inputs[i]=[];
                laserTimers[i]=0;
            }
            playersLoaded=true;
        });

        updateInput = function(event, boolValue){

            //Player 1
            if (iio.keyCodeIs('a', event))
                inputs[1][LEFT] = boolValue;
            if (iio.keyCodeIs('d', event))
                inputs[1][RIGHT] = boolValue;
            if (iio.keyCodeIs('w', event)){
                inputs[1][UP] = boolValue;
                event.preventDefault();
            }
            if (iio.keyCodeIs('s', event)){
                inputs[1][DOWN] = boolValue;
                event.preventDefault();
            }
            if (iio.keyCodeIs('space', event)){
                inputs[1][SPACE] = boolValue;
                //io.rmvGroup('nebula');
                event.preventDefault();
            }

            //Player 2 
            if (iio.keyCodeIs('left arrow', event))
                inputs[2][LEFT] = boolValue;
            if (iio.keyCodeIs('right arrow', event))
                inputs[2][RIGHT] = boolValue;
            if (iio.keyCodeIs('up arrow', event)){
                inputs[2][UP] = boolValue;
                event.preventDefault();
            }
            if (iio.keyCodeIs('down arrow', event)){
                inputs[2][DOWN] = boolValue;
                event.preventDefault();
            }
            if (iio.keyCodeIs('n0', event) 
                || iio.keyCodeIs('enter', event) ){
                inputs[2][SPACE] = boolValue;
                event.preventDefault();
            }
        }

        updatePlayers = function(){
            for (var i=1;i<players.length;i++){

                //update position

                //input Left
                if (inputs[i][LEFT] && !inputs[i][RIGHT]
                    && players[i].pos.x - players[i].width/2> 0)
                        players[i].translate(-playerSpeed,0); 
                //input right
                if (inputs[i][RIGHT] && !inputs[i][LEFT]
                    && players[i].pos.x + players[i].width/2 < io.canvas.width)
                        players[i].translate(playerSpeed,0); 
                //input up
                if (inputs[i][UP] && !inputs[i][DOWN]
                    && players[i].pos.y - players[i].height/2 > 0)
                        players[i].translate(0,-playerSpeed+1); 
                //input down
                if (inputs[i][DOWN] && !inputs[i][UP]
                    && players[i].pos.y + players[i].height/2 < io.canvas.height - 30)
                        players[i].translate(0,playerSpeed-1);

                //update ship sprite
                if (inputs[i][LEFT] && !inputs[i][RIGHT])
                    players[i].setAnim('left');
                else if (inputs[i][RIGHT] && !inputs[i][LEFT])
                    players[i].setAnim('right');
                else players[i].setAnim('level');

                //update laser cannons
                if (inputs[i][SPACE] && laserTimers[i] < 0){
                    io.debugMsg('player '+i+': fire lasors');
                    fireLasor(players[i].left()+10, players[i].pos.y,i);
                    fireLasor(players[i].right()-8, players[i].pos.y,i);
                    laserTimers[i] = laserCooldown;
                    iio.playSound('audio/lasers.mp3');
                } 
                if (inputs[i][SPACE]) laserTimers[i]--;
                else laserTimers[i]-=3;
            }
        }

        //load laser image
        var laserImg = new Image();
        laserImg.src = imgPath+'laserRed.png';
        
        fireLasor = function(x,y,playerNum){
            io.addToGroup('lasers', new iio.SimpleRect(x,y),-1)
                .createWithImage(laserImg)
                .enableKinematics()
                .setBound('top',-40)
                .setVel(0,-16)
                .source = playerNum;
        }

        window.addEventListener('keydown', function(event){
            updateInput(event, true);

            //check for pause
            if (iio.keyCodeIs('pause', event) || iio.keyCodeIs('p', event))
                io.pauseFramerate();
        });

        window.addEventListener('keyup', function(event){
            updateInput(event, false);
        });
    })();    

    //Meteors
    (function(){
        var meteorHealth = 4;

        //load meteor images
        var bigMeteorImg = new Image();
        var smallMeteorImg = new Image();
        bigMeteorImg.src = imgPath+'meteorBig.png';
        smallMeteorImg.src = imgPath+'meteorSmall.png';

        createMeteor = function(small,x,y){    
            var img = bigMeteorImg;
            if (small) img = smallMeteorImg
            var meteor = io.addToGroup('meteors'
                ,new iio.SimpleRect(x,y))
                    .enableKinematics()
                    .setBound('bottom', io.canvas.height+120)
                    .createWithImage(img)
                    .setVel(iio.getRandomInt(-2,2)
                           ,iio.getRandomInt(10,14))
                    .setTorque(iio.getRandomNum(-.1,.1));
            if (!small) meteor.health = meteorHealth;
        }
    })();

    //Collisions
    (function(){
        io.addGroup('lasers');
        io.addGroup('meteors');

        //load laser image
        var laserFlashImg = new Image();
        laserFlashImg.src = imgPath+'laserRedShot.png';

        io.setCollisionCallback('lasers', 'meteors', function(laser, meteor){

            //create laser flash
            io.addToGroup('laser flashes'
                ,new iio.SimpleRect((laser.pos.x+meteor.pos.x)/2
                           ,(laser.pos.y+meteor.pos.y)/2),10)
                    .createWithImage(laserFlashImg)
                    .enableKinematics()
                    .setVel(meteor.vel.x, meteor.vel.y)
                    .shrink(.1);
            
            //remove laser object
            io.rmvFromGroup('lasers',laser);

            //hit a big meteor
            if (typeof(meteor.health) != 'undefined'){
                io.debugMsg('player '+laser.source+': hit big meteor');
                meteor.health--;
                if (meteor.health < 0){
                    io.debugMsg('player '+laser.source+': broke large meteor');
                    var numFragments = iio.getRandomInt(3,6);
                    for (var i=0; i<numFragments; i++)
                        createMeteor(true, meteor.pos.x+iio.getRandomInt(-20,20)
                                          ,meteor.pos.y+iio.getRandomInt(-20,20));
                    io.rmvFromGroup('meteors',meteor);
                    iio.playSound('audio/explosion-big.mp3');
                } 
                else iio.playSound('audio/explosion-small.mp3');
            } 
            //hit a small meteor
            else {
                io.debugMsg('player '+laser.source+': hit small meteor');
                io.rmvFromGroup('meteors', meteor);
                iio.playSound('audio/explosion-small.mp3');
            }
        });
    })();
    
    //control meteor density and size ratios
    var meteorDensity = Math.round(io.canvas.width/150);
    var smallToBig = .70;

    //set a 60fps framerate and define update function
    io.setFramerate(60, function(){

        if (playersLoaded) updatePlayers();

        //create meteors at random intervals
        if (iio.getRandomNum() < .02)
            for (var i=0; i<meteorDensity; i++){
                var x = iio.getRandomInt(30,io.canvas.width-30);
                var y = iio.getRandomInt(-800,-50);
                if (iio.getRandomNum() < smallToBig)
                    createMeteor(true,x,y);
                else createMeteor(false,x,y);
            }
    });
}