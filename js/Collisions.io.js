CollisionApp = function(io){
 
  createBox = function(xPos, xVel, fillStyle){
    return io.addToGroup('boxes'
      ,new iio.Rect(xPos,io.canvas.height/2,150)
      .setFillStyle(fillStyle)
      .enableKinematics()
      .setVel(xVel,xVel)
      .rotate(Math.PI/3)
      .setTorque(.01)
      .setBound('left', 0
        ,function(obj){
          obj.vel.x = 2;
          return true;
         })
      .setBound('right', io.canvas.width
        ,function(obj){
          obj.vel.x = -2;
          return true;
        })
      .setBound('top', 0
        ,function(obj){
          obj.vel.y = 2;
          return true;
         })
      .setBound('bottom', io.canvas.height
        ,function(obj){
          obj.vel.y = -2;
          return true;
        }));
  }

  createBall = function(xPos, xVel, fillStyle){
    return io.addToGroup('boxes'
      ,new iio.Circle(xPos,io.canvas.height/2,50)
      .setFillStyle(fillStyle)
      .enableKinematics()
      .setVel(xVel,xVel)
      //.rotate(Math.PI/4)
      .setTorque(.01)
      .setBound('left', 0
        ,function(obj){
          obj.vel.x = 2;
          return true;
         })
      .setBound('right', io.canvas.width
        ,function(obj){
          obj.vel.x = -2;
          return true;
        })
      .setBound('top', 0
        ,function(obj){
          obj.vel.y = 2;
          return true;
         })
      .setBound('bottom', io.canvas.height
        ,function(obj){
          obj.vel.y = -2;
          return true;
        }));
  }
  createPoly = function(xPos, xVel, fillStyle){
    return io.addToGroup('boxes'
      ,new iio.Poly(xPos, io.canvas.height/2
                                  ,[-70,10
                                  ,-50,30
                                  , 10,10
                                  ,-20,-80])
      .setFillStyle(fillStyle)
      .enableKinematics()
      .setVel(xVel,xVel)
      //.rotate(Math.PI/4)
      .setTorque(.01)
      .setBound('left', 0
        ,function(obj){
          obj.vel.x = 2;
          return true;
         })
      .setBound('right', io.canvas.width
        ,function(obj){
          obj.vel.x = -2;
          return true;
        })
      .setBound('top', 0
        ,function(obj){
          obj.vel.y = 2;
          return true;
         })
      .setBound('bottom', io.canvas.height
        ,function(obj){
          obj.vel.y = -2;
          return true;
        }));
  }
  var b1 = createBox(100, 2, '#00baff');
  var b2 = createBox(io.canvas.width-100, -2, 'red');
  //var b3= createPoly(100, -2, '#a3da58');
 
  io.setCollisionCallback('boxes'
    ,function(box1,box2){
       var temp = box1.vel;
       box1.vel = box2.vel;
       box2.vel = temp;
       box1.torque=box2.torque*=-1;
     });
 
  io.setFramerate(60, function(){
    var a = b1.vel;
    var b = b2.vel;
  });
 
};