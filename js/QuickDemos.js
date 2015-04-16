
AnimsDemo = function(io){

  //define path for the images
  var imgPath='demo-apps/platformer/img/';

  /* Space Guy */
  var spaceGuySrcs = [];
  //loop fills an array with images named 'walk-1' ... 'walk-11'
  for (var i=1;i<12;i++)
  	  spaceGuySrcs[i-1]=imgPath+'character/walk/walk-'+i+'.png';

  //create a rectangle with the dimensions of the first image
  var spaceGuy = new iio.SimpleRect(60, io.canvas.height-60);
  spaceGuy.createWithAnim(spaceGuySrcs, function(){
  	  //image onload code
      io.setAnimFPS(15,spaceGuy);
  });

  /* Unhappy Fly */
  //get the source images
  var flySrcs = [imgPath+'enemies/fly_normal.png'
                ,imgPath+'enemies/fly_fly.png'];

  //create the rectangle with the dimensions of the first image
  var fly = new iio.SimpleRect(io.canvas.width-60, 60, 69, 32)
      .addAnim(flySrcs, function(){
  	      //image onload code
          io.setAnimFPS(6,fly);
      });

  /* Unhappy Slime ball thing */
  //get the source images
  var slimeSrcs = [imgPath+'enemies/slime_normal.png'
                ,imgPath+'enemies/slime_walk.png'];

  //create the rectangle with the dimensions of the first image
  var slime = new iio.SimpleRect(io.canvas.width-50, io.canvas.height-24)
      .createWithAnim(slimeSrcs, function(){
          //image onload code
          io.setAnimFPS(3,slime);
      });
}; iio.start(AnimsDemo, 'c1');

KinematicsDemo = function(io){

  //create the flying saucer
  io.addObj(new iio.SimpleRect(60,60,80)
    .enableKinematics()
    .setTorque(.2)
    .addImage('demo-apps/space-shooter/img/enemyUFO.png'));

  //create the crate
  var crate = io.addObj(new iio.SimpleRect(60,150,70)
     .enableKinematics()
     .setVel(1,0)
     .addImage('demo-apps/platformer/img/crate.png'));

  //set frame rate to 60fps
  io.setFramerate(60, function(){
  	  //update code
      if (crate.pos.x > io.canvas.width-60)
      	crate.setVel(-1,0);
      else if (crate.pos.x < 60)
      	crate.setVel(1,0);
  });
}; iio.start(KinematicsDemo, 'c2');

ImageDemo = function(io){

  //create the shroom with the dimensions of the given image
  var shroom = new iio.SimpleRect(60, io.canvas.height-40)
     .createWithImage('demo-apps/platformer/img/shroom.png'
     	//add the object when the image loads
     	,function(){io.addObj(shroom)}); 
  
  //define a 55x120 rectangle and attach the smily hill image
  var smily = new iio.SimpleRect(io.canvas.center.x+50 //xpos
  	                        , io.canvas.height-50 //ypos
  	                        , 55, 120) //size
     .addImage('demo-apps/platformer/img/hill_short.png'
     	//add the object when the image loads
     	,function(){io.addObj(smily)});

  //create a polygon and attach an image
  var polyImage = new iio.Poly(150,50,[25,25
                                         ,0,-25
                                         ,-25,25])
     .addImage('demo-apps/platformer/img/block.png'
     	//add the object when the image loads
     	,function(){io.addObj(polyImage)});

  //create block with the dimensions of the given image
  var block = new iio.SimpleRect(60, 80,60)
     .createWithImage('demo-apps/platformer/img/bonus.png'
     	//add the object when the image loads
	   	,function(){io.addObj(block)});
}; iio.start(ImageDemo, 'c3');

CircleImageDemo = function(io){

  //set background color
  io.setBGColor('white');

  //create a circle in the center of the canvas
  //radius: 80
  var circleImg = new iio.Circle(io.canvas.center,80)
     .setStrokeStyle('black',2)
     //set the shadow color, offset (10,10), and blur (4)
     .setShadow('rgb(150,150,150)',10,10,4)
     .addImage('img/staryNight.jpg', function(){
         //image onLoad code
         circleImg.setImgScale(.5);
         io.addObj(circleImg);
     });
}; iio.start(CircleImageDemo, 'c4');

LineDemo = function(io){

  //load Line (make it directly accessable)
  var Line = iio.Line;

  //create a red line
  //p1:40x120
  //p2:160x160
  //color: red
  //lineWidth: 1
  io.addObj(new Line(40,120,160,160)
    .setStrokeStyle('red',1));

  //create another red line
  io.addObj(new Line(40,100,160,140)
  	.setStrokeStyle('red',2));

  //create a gradient
  var gradient=io.context.createLinearGradient(0,0,140,0);
  gradient.addColorStop("0","magenta");
  gradient.addColorStop("0.5","blue");
  gradient.addColorStop("1.0","red");

  //create a line with the gradient
  io.addObj(new Line(40,80,160,120)
  	.setStrokeStyle(gradient,4));

  //create a blue line
  io.addObj(new Line(40,60,160,100)
  	.setStrokeStyle('blue',2));

  //create a green line
  io.addObj(new Line(40,40,160,80)
  	.setStrokeStyle('#a3da58',1));
}; iio.start(LineDemo, 'c9');

RectanglesDemo = function(io){

  //load Line (make it directly accessable)
  var SimpleRect = iio.SimpleRect;

  //create a red, rotated 60x60 square at canvas center
  io.addObj(new SimpleRect(io.canvas.center,60)
    .rotate(Math.PI/4)
    .setFillStyle('red'));

  //create a blue 60x100 box to the right
  io.addObj(new SimpleRect(0,0,60,100)
  	.setPos(io.canvas.center.x+40,io.canvas.center.y)
  	.setFillStyle('rgba(0,0,255,.7)'));

  //create the green stroked 60x100 box
  io.addObj(new SimpleRect(0,0,60,100)
  	.setPos(io.canvas.center.x-40,io.canvas.center.y)
  	.setStrokeStyle('#a3da58',2));
}; iio.start(RectanglesDemo, 'c14');

CirclesDemo = function(io){

  //load Circle (make it directly accessable)
  var Circle = iio.Circle;

  //create a red circle at canvas center with radius 40
  io.addObj(new Circle(io.canvas.center,40)
    .setFillStyle('red'));

  //create an opaque blue circle
  io.addObj(new Circle(0,0,40)
    .setPos(io.canvas.center.x+30,io.canvas.center.y+30)
    .setFillStyle('rgba(0,0,255,.7)'));

  //create the green stroked circle
  io.addObj(new Circle(0,0,40)
    .setPos(io.canvas.center.x-30,io.canvas.center.y-30)
    .setStrokeStyle('#a3da58',2));
}; iio.start(CirclesDemo, 'c15');

PolyDemo = function(io){

  //load Poly (make it directly accessable)
  var Poly = iio.Poly;

  //create a blue triangle at 50,50
  //vertices are relative to specified origin
  io.addObj(new Poly(50,50, [-30,30
                             ,50,50
                             ,0,-30])
    .setFillStyle('#00baff'));

  //create a red polygon at 150x150
  io.addObj(new Poly(150,150, [-70,10
                              ,-50,30
                               ,10,10
                              ,-20,-80])
    .setFillStyle('red'));

  //create a green stroked hexagon
  //vertices are relative to canvas 0,0
  //when no position is specified
  io.addObj(new Poly([70,150
                        ,40,100
                        ,70,50
                        ,130,50
                        ,160,100
                        ,130,150])
    .setStrokeStyle('#a3da58',3));
}; iio.start(PolyDemo, 'c16');

TextDemo = function(io){

  //load Text (make it directly accessable)
  var Text = iio.Text;

  //blue text
  io.addObj(new Text('Text',70,65)
    .setFont('50px Consolas')
    .setTextAlign('center')
    .setFillStyle('#00baff'));

  //stroked text
  io.addObj(new Text('Text',70,115)
  	.setFont('50px Arial')
  	.setTextAlign('center')
  	.setStrokeStyle('#a3da58'));

  //red text
  io.addObj(new Text('Text',70,165)
    .setFont('50px Georgia')
    .setTextAlign('center')
    .setFillStyle('red'));

  //create a gradient
  var gradient=io.context.createLinearGradient(0,0,50,0);
  gradient.addColorStop("0","#00baff");
  gradient.addColorStop(".5","#a3da58");
  gradient.addColorStop("1.0","red");

  //gradient text
  io.addObj(new Text('Text',140,100)
    .setFont('60px Courier New')
    .setTextAlign('center')
    .rotate(Math.PI/2)
    .setFillStyle(gradient));
}; iio.start(TextDemo, 'c5');

TextShadowDemo = function(io){

  //set background color
  io.setBGColor('white');
	
  //create text
  io.addObj(new iio.Text('Shadows',iio.Vec.add(io.canvas.center,0,15))
  	.setFont('50px Consolas')
  	.setTextAlign('center')
  	//set the shadow color, offset (10,10), and blur (4)
  	.setShadow('rgb(150,150,150)',10,10,4)
  	.setFillStyle('black'));
}; iio.start(TextShadowDemo, 'c12');

BGImageDemo = function(io){
	io.setBGImage('img/snes_thumb.jpg');
}; iio.start(BGImageDemo, 'c21');

BGPatternDemo = function(io){
	io.setBGPattern('img/bgPattern.jpg');
}; iio.start(BGPatternDemo, 'c18');

MultiLineDemo = function(io){

  //vertices are relative to canvas 0,0 (top left)
  //when a position is not specified
  //otherwise, they are relative to
  //the given position
  io.addObj(new iio.MultiLine([80,160
                                 ,40,100
                                 ,80,40
                                 ,120,40
                                 ,160,100
                                 ,120,160])
    .setStrokeStyle('#00baff',2));
}; iio.start(MultiLineDemo, 'c7');

LineShadowDemo = function(io){

  //set background color
  io.setBGColor('white');

  //create multi-line
  io.addObj(new iio.MultiLine([120,40
								  ,160,100
								  ,120,160
								  ,80,40
								  ,40,100
								  ,80,160])

  	//set the shadow color, offset (20,10), and blur (4)
    .setShadow('rgb(150,150,150)',20,10,4)
    .setStrokeStyle('#a3da58',3));
}; iio.start(LineShadowDemo, 'c77');

XDemo = function(io){
  
  //create 100x100 x at canvas center
	io.addObj(new iio.XShape(io.canvas.center,100,100)
	  .setStrokeStyle('#a3da58',2));
}; iio.start(XDemo, 'c8');

GridDemo = function(io){

  //load Grid (make it directly accessable)
  var Grid = iio.Grid;

  //create white 10x10 grid with 20x22 cells
  io.addObj(new Grid(0,0,10,10,20,22)
    .setStrokeStyle('white'));

  //create red 3x4 grid with 50x50 cells
  io.addObj(new Grid(0,0,3,4,50)
  	.setStrokeStyle('red',4));

  //create blue 2x4 grid with 50x50 cells
  io.addObj(new Grid(100,0,2,4,50)
  	.setStrokeStyle('#00baff',4));

  //create line for looks
  io.addObj(new iio.Line(io.canvas.center.x,0,io.canvas.center.x,io.canvas.height)
  	.setStrokeStyle('#a3da58',4));
}; iio.start(GridDemo, 'c19');

BGColorDemo = function(io){
	io.setBGColor('red');
}; iio.start(BGColorDemo, 'c20');

BGOpaqueDemo = function(io){
	io.setBGColor('rgba(0,186,255,.4)');
}; iio.start(BGOpaqueDemo, 'c17');


function CollisionsDemo(io) {
  //load SimpleRect to a local reference
  var SimpleRect = iio.SimpleRect;
  var imgPath = 'demo-apps/space-shooter/img/';
 
  var meteorImg = new Image();
  meteorImg.src = imgPath+'meteorSmall.png';
  function createMeteor(){
    io.addToGroup('meteors', new SimpleRect(iio.getRandomInt(30,io.canvas.width-30)
                   ,iio.getRandomInt(-800,-50)))
       .enableKinematics()
       .setBound('bottom', io.canvas.height+100)
       .createWithImage(meteorImg)
       .setVel(iio.getRandomInt(-1,1)
              ,iio.getRandomInt(1,4))
       .setTorque(iio.getRandomNum(-.1,.1));
  }

  var lasorImg = new Image();
  lasorImg.src = imgPath+'laserRed.png';
  function createLasor(){
        io.addToGroup('lasors', new SimpleRect(iio.getRandomInt(30,io.canvas.width-30)
                                          ,io.canvas.height+60)
       .enableKinematics()
       .setBound('top', -100)
       .createWithImage(lasorImg)
       .setVel(0,-8));
  }

  io.addGroup('lasors');
  io.addGroup('meteors');
  var lasorFlashImg = new Image();
  lasorFlashImg.src = imgPath+'laserRedShot.png';
  io.setCollisionCallback('lasors', 'meteors', function(lasor, meteor){
      io.addToGroup('lasor flashes'
      ,new SimpleRect((lasor.pos.x+meteor.pos.x)/2
                 ,(lasor.pos.y+meteor.pos.y)/2),10)
          .createWithImage(imgPath+'laserRedShot.png')
          .enableKinematics()
          .shrink(.1);
     
    //remove the colliding objects
    io.rmvFromGroup(lasor, 'lasors');
    io.rmvFromGroup(meteor, 'meteors');
  });
 
  io.setFramerate(60, function(){
    if (Math.random() < .13)
       createMeteor();
    else if (Math.random() < .06)
       createLasor();
  });
}; iio.start(CollisionsDemo, 'collisions');

function B2BasicRendering(io) {
 
   var   b2Vec2 = Box2D.Common.Math.b2Vec2
      ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
      ,  b2Body = Box2D.Dynamics.b2Body
      ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
      ,  b2World = Box2D.Dynamics.b2World
      ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
      ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

   var world = io.addB2World(new b2World(
         new b2Vec2(0, 10)    //gravity
      ,  true                 //allow sleep
   ));
   
   //Define a fixture - used for all objects
   var fixDef = new b2FixtureDef;
   fixDef.density = 1.0;
   fixDef.friction = 0.3;
   fixDef.restitution = 0.5;
   var bodyDef = new b2BodyDef;

   //create ground
   bodyDef.type = b2Body.b2_staticBody;
   fixDef.shape = new b2PolygonShape;
   fixDef.shape.SetAsBox(20,2);
   bodyDef.position.Set(15,17.2);
   world.CreateBody(bodyDef).CreateFixture(fixDef);

   //create walls
   fixDef.shape.SetAsBox(2,14);
   bodyDef.position.Set(-2,13);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(12.2,13);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
  //define image paths
  var imgPath = 'demo-apps/platformer/img/';
  var blockImgs = [imgPath+'bonus.png'
                  ,imgPath+'crate.png'
                  ,imgPath+'block.png'
                  ,imgPath+'lock_green.png'];
  var coinImgs = [imgPath+'coin_gold.png'
                 ,imgPath+'coin_silver.png'];

  function createBlock(y){
    size = iio.getRandomNum(.3,1);
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(size, size);
    prepShape(bodyDef, fixDef, y)
      .addImage(blockImgs[iio.getRandomInt(0,blockImgs.length)]);
  }
  function createSphere(y){
    size = iio.getRandomNum(.3,1);
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2CircleShape(size);
    prepShape(bodyDef, fixDef, y)
      .addImage(coinImgs[iio.getRandomInt(0,coinImgs.length)]);
  }

  function prepShape(bodyDef, fixDef, y){
    bodyDef.position.x = Math.random() * 11;
    bodyDef.position.y = Math.random() * y;
    return io.addObj(world.CreateBody(bodyDef))
                   .CreateFixture(fixDef)
                   .GetShape()
                   .prepGraphics(io.b2Scale);
  }


  var shapeCount=0;
  var maxShapes=90;
  for (var i=0; i<3; i++){
    createSphere(10);
    createBlock(10);
    shapeCount+=2;
  }

   //Set the update loop
   io.setB2Framerate(60, function(){
      if (shapeCount < maxShapes && Math.random()<.03){
        if (Math.random()<.5)
          createBlock(-10);
        else 
          createSphere(-10);
        shapeCount++;
    }
   });

}; iio.start(B2BasicRendering, 'b2d');