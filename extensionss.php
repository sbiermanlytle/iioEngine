<?php 
	include('inc/redirector.php');
  $homepath = '';
  $title = 'Extensions';
	include('inc/preHeader.php');
	include('inc/header.php');
?>

 <!-- Marketing messaging and featurettes
    ================================================== -->
    <!-- Wrap the rest of the page in another container to center all the content. -->

    <div class="container marketing extensions">
    <hr class="featurette-divider">
    <h1>Extension Packages</h1>
    <hr class="featurette-divider">

      <!-- Three columns of text below the carousel -->
      <div class="row">
        <div class="span7" id="ext-b2d">
          <h2 id="b2d">Box2D</h2>
          <h3>Advanced physics, open source libraries</h3>
          <p><a href="http://box2d.org/">Box2D</a> is a popular free and open source 2D physics engine. The iio Engine integrates with <a href="http://code.google.com/p/box2dweb/">Box2dWeb</a>, which is a JavaScript port of <a href="http://www.box2dflash.org/">Box2DFlash</a>. The iio framework provides a graphics engine for Box2D, and their respective motion systems can operate simultaneously within the same application. Aside from adding new properties and methods, the iio Framework does not alter the normal Box2D workflow.</p>
          <div class="arrows-btns">
            <p style="min-width:208px" class="big-btn"><a class="btn-iio grey" target="_new" href="http://code.google.com/p/box2dweb/downloads/list">Download Box2dWeb</a></p>
            <p style="min-width:227px" class="big-btn"><a class="btn-iio" href="docs/box2d.php">iio-B2D Documentation</a></p>
        </div>
        </div>
        <div class="span5">
          <canvas id="b2d-demo"class="mid-square" width="380px" height="380px">Please update your browser to a version that supports canvas</canvas> 
          <p class="caption annoying-caption">click and hold to drag objects around</p>
        </div>
      </div><!-- /.row -->

    <!-- START THE FEATURETTES -->
    <hr class="featurette-divider">

    <div class="row">
        <div class="span5">
          <canvas id="debugger-demo"class="mid-square" width="380px" height="380px">Please update your browser to a version that supports canvas</canvas> 
        </div>
        <div class="span7" id="ext-db">
          <h2 id="iio-debugger">iio Debugger</h2>
          <h3>Keep track of performance and assets</h3>
          <p>The iio Debugger is a simple console that allows you to monitor your application's framerate and canvas groups. It is integrated with <a target="_new" href="https://github.com/mrdoob/stats.js/">Stats.js</a> to provide an accurate FPS reading and log performance over time. The debugger auto-attaches to your application when you load the file, so setup is simple and customization is easy.</p>
          <pre class="prettyprint linenums:1" style="width:auto;float:left;margin-top:8px;">
//The only setup step
io.activateDebugger();</pre>
          <div class="arrows-btns">
            <p style="min-width:229px" class="big-btn"><a class="btn-iio grey" onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioDebugger']);" href="js/iioDebugger.js"  download="iioDebugger.js">Download iio Debugger</a></p>
            <p style="min-width:126px" class="big-btn"><a class="btn-iio" href="docs/iio-debugger.php">Instructions</a></p>
        </div>
        </div>
      </div><!-- /.row -->

  <?php include('inc/footer.php'); ?>
  </div> <!-- end marketing container -->
<script type="text/javascript" src="<?php echo $homepath ?>js/Box2dWeb-2.1.a.3.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine.min.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioDebugger.js"></script>
<script type="text/javascript">
function B2BasicRendering(io) {
   var   b2Vec2 = Box2D.Common.Math.b2Vec2
      ,  b2AABB = Box2D.Collision.b2AABB
      ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
      ,  b2Body = Box2D.Dynamics.b2Body
      ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
      ,  b2Fixture = Box2D.Dynamics.b2Fixture
      ,  b2World = Box2D.Dynamics.b2World
      ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
      ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
      ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

   var world = io.addB2World(new b2World(
         new b2Vec2(0, 10)    //gravity
      ,  true                 //allow sleep
   ));
   
   var fixDef = new b2FixtureDef;
   fixDef.density = 1.0;
   fixDef.friction = 0.5;
   fixDef.restitution = 0.2;
   var bodyDef = new b2BodyDef;

   //create ground
   bodyDef.type = b2Body.b2_staticBody;
   fixDef.shape = new b2PolygonShape;
   fixDef.shape.SetAsBox(20,2);
   bodyDef.position.Set(15,14.45);
   io.addObj(world.CreateBody(bodyDef))
     .CreateFixture(fixDef).GetShape()
         .prepGraphics(io.b2Scale)
         .setFillStyle('rgba(0,186,255,.4)')
         .setStrokeStyle('white');
   bodyDef.position.Set(15,-1.8);
   io.addObj(world.CreateBody(bodyDef))
     .CreateFixture(fixDef).GetShape()
         .prepGraphics(io.b2Scale)
         .setFillStyle('rgba(0,186,255,.4)')
         .setStrokeStyle('white');

   fixDef.shape.SetAsBox(2,14);
   bodyDef.position.Set(-1.8,13);
   io.addObj(world.CreateBody(bodyDef))
     .CreateFixture(fixDef).GetShape()
         .prepGraphics(io.b2Scale)
         .setFillStyle('rgba(0,186,255,.4)')
         .setStrokeStyle('white');
   bodyDef.position.Set(14.45,13);
   io.addObj(world.CreateBody(bodyDef))
     .CreateFixture(fixDef).GetShape()
         .prepGraphics(io.b2Scale)
         .setFillStyle('rgba(0,186,255,.4)')
         .setStrokeStyle('white');
   
   //create some objects
   var shape,width,height;
   bodyDef.type = b2Body.b2_dynamicBody;
   for(var i = 0; i < 20; ++i) {
      width = Math.random() + 0.1 //half width
      height = Math.random() + 0.1 //half height
      if(Math.random() > 0.5) {
         fixDef.shape = new b2PolygonShape;
         fixDef.shape.SetAsBox(width, height);
      } else {
         fixDef.shape = new b2CircleShape(width);
      }
      bodyDef.position.x = Math.random() * 13;
      bodyDef.position.y = Math.random() * 10;
      shape=io.addObj(world.CreateBody(bodyDef)).CreateFixture(fixDef).GetShape();
      if (shape instanceof b2CircleShape)
         shape.prepGraphics(io.b2Scale)
              .setFillStyle('rgba(0,186,255,.4)')
              .setStrokeStyle('white')
              .drawReferenceLine();
      else
         shape.prepGraphics(io.b2Scale)
              .setFillStyle('rgba(0,186,255,.4)')
              .setStrokeStyle('white');
   }

   //Set the update loop
   io.setB2Framerate(60, function(){
      if(isMouseDown && (!mouseJoint)) {
         var body = getB2BodyAt(mouseX,mouseY);
         if(body) {
            var md = new b2MouseJointDef();
            md.bodyA = world.GetGroundBody();
            md.bodyB = body;
            md.target.Set(mouseX, mouseY);
            md.collideConnected = true;
            md.maxForce = 300.0 * body.GetMass();
            mouseJoint = io.addObj(world.CreateJoint(md).prepGraphics().setStrokeStyle('white').setLineWidth(1));
            body.SetAwake(true);
         }
      }
      if(mouseJoint) {
         if(isMouseDown) {
            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
         } else {
            world.DestroyJoint(mouseJoint);
            io.rmvObj(mouseJoint);
            mouseJoint = null;
         }
      }
   });

   var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
   function getB2BodyAt(callback,v,y) {
      if (typeof v.x =='undefined')
         v=new Box2D.Common.Math.b2Vec2(v,y);
      mousePVec = new b2Vec2(mouseX, mouseY);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
      aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
      selectedBody = null;
      world.QueryAABB(getBodyCB, aabb);
      return selectedBody;
   }
   function getBodyCB(fixture) {
      if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
            selectedBody = fixture.GetBody();
            return false;
         }
      }
      return true;
   }

   function mouseDown(e){
      e.preventDefault();
      isMouseDown = true;
      mouseMove(e);
   }
   function mouseUp(e){
      isMouseDown = false;
      mouseX = undefined;
      mouseY = undefined;
   }
   function mouseMove(e){
      mouseX = (io.getEventPosition(e).x) / 30;
      mouseY = (io.getEventPosition(e).y) / 30;
   }
   io.canvas.addEventListener('mousedown', mouseDown);
   io.canvas.addEventListener('mouseup', mouseUp);
   io.canvas.addEventListener('mousemove', mouseMove);
   this.focusOff = function(e){
      mouseUp(e)
   }
}; iio.start(B2BasicRendering, 'b2d-demo');
function DebuggerDemo(io){
 
  io.setBGColor('#5e3f6b');
 
  var backgroundSpeed = 6;
  var imgPath = 'demo-apps/space-shooter/img/'
  var backgroundSrcs = [imgPath+'Background/starBig.png', 
                    imgPath+'Background/starSmall.png', 
                    imgPath+'Background/speedLine.png', 
                    imgPath+'Background/nebula.png'];

  var asteroidSrcs = [imgPath+'meteorBig.png', 
                      imgPath+'meteorSmall.png'];

 

  function runBgCreator(yMin, yMax){
      for (var i=0; i<4; i++)
          for (var j=i*io.canvas.width/4; j< (i+1)*io.canvas.width/4; j++)
              if (iio.getRandomNum(0,10) < .2){
                  io.addToGroup('nebulas',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -20).createWithImage(backgroundSrcs[3]).enableKinematics().setVel(0,backgroundSpeed).setBound('bottom',io.canvas.height+200);
                io.debugMsg('create nebula');
              }
              else if (iio.getRandomNum(0,10) < .2)
                  io.addToGroup('small stars',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[1]).enableKinematics().setVel(0,Math.round(backgroundSpeed/2)).setBound('bottom',io.canvas.height+100);
              else if (iio.getRandomNum(0,10) < .2)
                  io.addToGroup('big stars',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[0]).enableKinematics().setVel(0,Math.round(backgroundSpeed/2)+.2).setBound('bottom',io.canvas.height+100);
  }

  function createLargeAsteroids(){
      var asteroid;
      if (iio.getRandomNum(0, 10) < 8){
          asteroid = io.addToGroup('large meteors', new iio.Rect(iio.getRandomInt(30,io.canvas.width-30), iio.getRandomInt(-800,-50))).createWithImage(asteroidSrcs[0]).enableKinematics().setVel(iio.getRandomInt(-2,2), iio.getRandomInt(10,14)).setBound('bottom', io.canvas.height+200, function(){io.debugMsg('remove large meteor');return false}).setTorque(iio.getRandomNum(-.1,.1));
          io.debugMsg('new large meteor: '+asteroid.pos.toString());
        }
  }
  function createSmallAsteroids(){
      if (iio.getRandomNum(0, 10) < 8){
          var asteroid = io.addToGroup('small meteors', new iio.Rect(iio.getRandomInt(30,io.canvas.width-30), iio.getRandomInt(-800,-50))).enableKinematics().setBound('bottom', io.canvas.height+200, function(){io.debugMsg('remove small meteor');return false}).createWithImage(asteroidSrcs[1]).setVel(iio.getRandomInt(-2,2), iio.getRandomInt(10,14)).setTorque(iio.getRandomNum(-.1,.1));
          io.debugMsg('new small meteor: '+asteroid.pos.toString());
      }
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
 
  io.setFramerate(60, function(){
      updateBackground();
  });
}; iio.start(DebuggerDemo,'debugger-demo');
</script>
</body>
</html>