/*
The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2013, Sebastian Bierman-Lytle
All rights reserved.

Requires iio Engine 1.2.2+
(only available on Github)
*/
function TurretDefender(io){

    //io.activateDebugger();
    io.setBGColor('black')
      .setCursorStyle('crosshair')
     // .mute();

    //Player Turret
    var turret;
    var turretBaseImg = iio.loadImage('img/turretStand.png', function(){
        io.addToGroup('turret stand', new iio.SimpleRect(io.canvas.width/2,io.canvas.height)
            .createWithImage(turretBaseImg), -10);
    });
    var turretImg = iio.loadImage('img/turretTop.png', function(){

        turret = io.addToGroup('turrets', new iio.SimpleRect(io.canvas.width/2,io.canvas.height-30)
            .createWithImage(turretImg)
            .setRotationAxis(0,-14)
            .rotate(0));

        turret.laserCooldown = 20;
        turret.laserTimeout = 0;
        turret.laserSpeed = 10;

        //add mouse listeners
        io.canvas.addEventListener('mousedown', function(event){
            if (turret.laserTimeout <= 0){
                fireLaser();
                turret.laserTimeout = turret.laserCooldown;
                io.playSound('audio/laserShot.mp3');
            } 
            else turret.laserTimeout-=3;
            event.preventDefault();
        });

        io.canvas.addEventListener('mousemove', function(event){
            var mousePos = io.getEventPosition(event);
            var x = mousePos.x-turret.pos.x;
            var y = mousePos.y-turret.pos.y;
            var t = Math.atan2(x,-y);
            turret.rotate(t);
        }); 
    });

    //Lasers
    var laserImg = iio.loadImage('img/laserRed.png');
    fireLaser = function(){
        var vX = 10*Math.sin(turret.rotation);
        var vY = -10*Math.cos(turret.rotation);
        var v = new iio.Vec(vX,vY).normalize().mult(turret.laserSpeed);
        io.addToGroup('lasers', new iio.SimpleRect(turret.pos),-20)
            .createWithImage(laserImg)
            .enableKinematics()
            .setBound('top',-40)
            .setVel(v)
            .rotate(turret.rotation);
    }

    //Enemy Ships
    minAttackDelay = 200;
    attackDelay = 0;
    var enemyShipImg = iio.loadImage('img/enemyShip.png');
    function createEnemyShip(x,y){ 
        var meteor = io.addToGroup('enemies'
            ,new iio.SimpleRect(x,y))
                .enableKinematics()
                .setBound('left', -300)
                .setBound('right', io.canvas.width+300)
                .createWithImage(enemyShipImg);

        //set velocity according to direction (left/right)
        if (x < 0) meteor.setVel(iio.getRandomNum(1,4),0);
        else meteor.setVel(iio.getRandomNum(-4,-1),0);
    }

    //Collisions
    io.addGroup('enemies');
    io.addGroup('lasers', -20);
    var laserFlashImg = iio.loadImage('img/laserRedShot.png');
    io.setCollisionCallback('lasers', 'enemies', function(laser, enemy){

        //create laser flashes
        for (var i=0; i<30; i++){
            io.addToGroup('laser flashes'
                ,new iio.SimpleRect(iio.getRandomNum(enemy.pos.x-20,enemy.pos.x+20)
                           ,iio.getRandomNum(enemy.pos.y-20,enemy.pos.y+20)),10)
                    .createWithImage(laserFlashImg)
                    .enableKinematics()
                    .setVel(enemy.vel.x*iio.getRandomNum(.5,.8), 
                        iio.getRandomNum(enemy.vel.y-1,enemy.vel.y+1))
                    .shrink(iio.getRandomNum(.06, .14));
        }
        
        //remove laser object
        io.rmvFromGroup('lasers',laser);
        io.playSound('audio/explosion.mp3');
        io.rmvFromGroup('enemies',enemy);
        updateScore();
        attackDelay = 0;
    });

    //Score
    var score = -1;
    var text = io.addToGroup('GUI', new iio.Text('',40,io.canvas.height-30)
          .setFont('30px Consolas')
          .setFillStyle('white'));
    function updateScore(){
        score++;
        text.setText('Aliens Destroyed: '+score)
    }; updateScore();

    //60fps update loop
    io.setFramerate(60, function(){

        if (typeof turret != 'undefined') 
            turret.laserTimeout--;
        attackDelay--;

        if (attackDelay <= 0){

            //decide left/right entry
            var left = iio.getRandomNum();
            var x;
            if(left<.5) x = -100;
            else x = io.canvas.width+100;
            
            createEnemyShip(x,iio.getRandomInt(50,200));

            //make ships come more frequenly over time
            minAttackDelay--;
            //reset attack delay with a constrained random
            attackDelay=iio.getRandomInt(minAttackDelay,minAttackDelay+100);
        }
    });
}