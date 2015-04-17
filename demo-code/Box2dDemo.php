<?php 
    $homepath = '../';
    $title = 'Box2D Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
function B2dDemo(io) {

    //load necessary classes
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
       ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
       ,  b2Body = Box2D.Dynamics.b2Body
       ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
       ,  b2World = Box2D.Dynamics.b2World
       ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
       ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

    //create the box2d world
    var world = io.addB2World(new b2World(
        new b2Vec2(0, 10)    //gravity
       ,true                 //allow sleep
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

    //create a block
    function createBlock(y){
      size = iio.getRandomNum(.3,1);
      bodyDef.type = b2Body.b2_dynamicBody;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(size, size);
      prepShape(bodyDef, fixDef, y)
       .addImage(blockImgs[iio.getRandomInt(0,blockImgs.length)]);
    }

    //create a sphere
    function createSphere(y){
      size = iio.getRandomNum(.3,1);
      bodyDef.type = b2Body.b2_dynamicBody;
      fixDef.shape = new b2CircleShape(size);
      prepShape(bodyDef, fixDef, y)
       .addImage(coinImgs[iio.getRandomInt(0,coinImgs.length)]);
    }

    //helper to set shape properties
    function prepShape(bodyDef, fixDef, y){
      bodyDef.position.x = Math.random() * 11;
      bodyDef.position.y = Math.random() * y;
      return io.addObj(world.CreateBody(bodyDef))
                            .CreateFixture(fixDef)
                            .GetShape()
                            .prepGraphics(io.b2Scale);
    }

    //stop making shapes when they fill the
    //entire canvas
    var shapeCount=0;
    var maxShapes=100;

    //create 6 starting shapes
    for (var i=0; i&lt;3; i++){
      createSphere(10);
      createBlock(10);
      shapeCount+=2;
    }

    //Set the update loop
    io.setB2Framerate(60, function(){

      //create new shapes randomly
      if (shapeCount &lt; maxShapes &amp;&amp; Math.random()&lt;.03){
        if (Math.random()&lt;.5)
          createBlock(-10);
        else 
          createSphere(-10);
        shapeCount++;
      }
    });

}; iio.start(B2dDemo, 'canvasId');</pre>
</body>
</html>