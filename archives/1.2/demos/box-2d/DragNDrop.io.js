function DragNDrop(io) {

   io.activateDebugger();

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
   bodyDef.position.Set(15,17);
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
   bodyDef.position.Set(15.5,13);
   io.addObj(world.CreateBody(bodyDef))
     .CreateFixture(fixDef).GetShape()
         .prepGraphics(io.b2Scale)
         .setFillStyle('rgba(0,186,255,.4)')
         .setStrokeStyle('white');
   
   //create some objects
   var shape,width,height,obj;
   bodyDef.type = b2Body.b2_dynamicBody;
   for(var i = 0; i < 10; ++i) {
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
      obj=io.addToGroup('objs', world.CreateBody(bodyDef));
      shape=obj.CreateFixture(fixDef).GetShape();
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
   window.addEventListener('keydown', function(e){
      if (iio.keyCodeIs('p',e))
        io.pauseB2World();
      else if (iio.keyCodeIs('d',e))
        io.rmvFromGroup('objs');
   });
   io.canvas.addEventListener('mouseup', mouseUp);
   io.canvas.addEventListener('mousemove', mouseMove);
   this.focusOff = function(e){
      mouseUp(e)
   }
 };