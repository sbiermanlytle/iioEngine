/*
Space Shooter App
Tutorial: http://iioEngine.com/tutorials/scroll-shooter

The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2013, Sebastian Bierman-Lytle
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list 
of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this
list of conditions and the following disclaimer in the documentation and/or other 
materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
*/
function SpaceShooter(io){

    io.activateDebugger();
    var imgPath = 'img/';

    //Background Scene
    (function(){
        moveToTop = function(obj){
            obj.setPos(iio.getRandomInt(10, io.canvas.width-10)
                          ,iio.getRandomInt(-340, -100));
            return true;
        }
        var bgSpeed = 8;
        var bgDensity = io.canvas.width/20;
        var bgImgs = [];
        io.setBGColor('#5e3f6b');

        for (var i=0; i<3; i++)
            bgImgs[i] = new Image();

        bgImgs[0].src = imgPath+'Background/starSmall.png';
        bgImgs[1].src = imgPath+'Background/starBig.png';
        bgImgs[2].src = imgPath+'Background/nebula.png';

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

    //Player ship
    (function(){
        var srcs = [imgPath+'playerLeft.png',
                    imgPath+'player.png',
                    imgPath+'playerRight.png'];
  
        player = io.addToGroup('player', new iio.SimpleRect(io.canvas.center.x, io.canvas.height-100).createWithAnim(srcs,1));

        var playerSpeed=8;

        var LEFT = 0;
        var RIGHT = 1;
        var UP = 2;
        var DOWN = 3;
        var SPACE = 4;
        var input = [];

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

        var laserCooldown = 20;
        var laserTimer = 0;
        updatePlayer = function(){

            //update position
            if (input[LEFT] && !input[RIGHT]
                && player.pos.x - player.width/2> 0)
                    player.translate(-playerSpeed,0); 
            if (input[RIGHT] && !input[LEFT]
                && player.pos.x + player.width/2 < io.canvas.width)
                    player.translate(playerSpeed,0); 
            if (input[UP] && !input[DOWN]
                && player.pos.y - player.height/2 > 0)
                    player.translate(0,-playerSpeed+1); 
            if (input[DOWN] && !input[UP]
                && player.pos.y + player.height/2 < io.canvas.height)
                    player.translate(0,playerSpeed-1);

            //update ship image
            if (input[LEFT] && !input[RIGHT])
                player.setAnimFrame(0);
            else if (input[RIGHT] && !input[LEFT])
                player.setAnimFrame(2);
            else player.setAnimFrame(1);

            //update laser cannons
            if (input[SPACE] && laserTimer < 0){
                fireLasor(player.left()+10, player.pos.y);
                fireLasor(player.right()-8, player.pos.y);
                laserTimer = laserCooldown;
            } 
            if (input[SPACE]) laserTimer--;
            else laserTimer-=3;
        }

        var laserImg = new Image();
        laserImg.src = imgPath+'laserRed.png'
        fireLasor = function(x,y){
            io.addToGroup('lasers', new iio.SimpleRect(x,y),-1)
                .createWithImage(laserImg)
                .enableKinematics()
                .setBound('top',-40)
                .setVel(0,-16);
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

    (function(){
        //Meteors
        var meteorHealth = 4;
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

    (function(){
        io.addGroup('lasers');
        io.addGroup('meteors');
        var laserFlashImg = new Image();
        laserFlashImg.src = imgPath+'laserRedShot.png';
        io.setCollisionCallback('lasers', 'meteors', function(laser, meteor){
            io.addToGroup('laser flashes'
                ,new iio.SimpleRect((laser.pos.x+meteor.pos.x)/2
                           ,(laser.pos.y+meteor.pos.y)/2),10)
                    .createWithImage(laserFlashImg)
                    .enableKinematics()
                    .setVel(meteor.vel.x, meteor.vel.y)
                    .shrink(.1);
            io.rmvFromGroup('lasers',laser);
            if (typeof(meteor.health) != 'undefined'){
                meteor.health--;
                if (meteor.health < 0){
                    var numFragments = iio.getRandomInt(3,6);
                    for (var i=0; i<numFragments; i++)
                        createMeteor(true, meteor.pos.x+iio.getRandomInt(-20,20)
                                          ,meteor.pos.y+iio.getRandomInt(-20,20));
                    io.rmvFromGroup('meteors',meteor);
                }
            } else io.rmvFromGroup('meteors',meteor);
        });
    })();
    
    var meteorDensity = Math.round(io.canvas.width/150);
    var smallToBig = .70;
    io.setFramerate(60, function(){
        updatePlayer();
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