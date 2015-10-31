/* Box2dDemo
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Box2dDemo = function( app, settings ){

  // set app background to black
  app.set({ color:'black' });

  // application settings
  var numObjects = app.width / 40;

  // add instructions to top of screen
  var instructions = app.add(new iio.Text({
    text: 'click objects to drag, press p to pause',
    pos: [app.center.x, 100],
    size: 20,
    color: 'white',
  }));

  // define shortcuts to Box2d classes
  var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2AABB = Box2D.Collision.b2AABB,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2World = Box2D.Dynamics.b2World,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

  // add a Box2d World to app
  var world = app.addB2World(new b2World(
    new b2Vec2(0, 10), //gravity
    true //allow sleep
  ));

  // Box2d settings
  var wallWidth = 1;
  var b2Width = app.width / app.b2Scale;
  var b2Height = app.height / app.b2Scale;

  // define a Fixture
  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  // define a Body
  var bodyDef = new b2BodyDef;

  // create static wall object
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;

  // set wall object dimensions
  fixDef.shape.SetAsBox(b2Width, wallWidth);

  // add a new instance of the wall fixture
  // positioned at the bottom
  bodyDef.position.Set(0, b2Height);
  app.add(world.CreateBody(bodyDef))
    .CreateFixture(fixDef).GetShape()
      .set({
        outline: 'red',
        lineWidth: 2,
      });

  // add a new instance of the wall fixture
  // positioned at the top of the view
  bodyDef.position.Set(0,0);
  app.add(world.CreateBody(bodyDef))
    .CreateFixture(fixDef).GetShape()
      .set({
        outline: 'red',
        lineWidth: 2,
      });

  // set wall fixture dimensions
  fixDef.shape.SetAsBox(wallWidth, b2Height);

  // add a new instance of the wall fixture
  // positioned at the left of the view
  bodyDef.position.Set(0,0);
  app.add(world.CreateBody(bodyDef))
    .CreateFixture(fixDef).GetShape()
      .set({
        outline: 'red',
        lineWidth: 2,
      });

  // add a new instance of the wall fixture
  // positioned at the right of the view
  bodyDef.position.Set(b2Width, 0);
  app.add(world.CreateBody(bodyDef))
    .CreateFixture(fixDef).GetShape()
      .set({
        outline: 'red',
        lineWidth: 2,
      });
   
  // create dynamic bodies
  var shape,width,height,obj;
  bodyDef.type = b2Body.b2_dynamicBody;
  for(var i = 0; i < numObjects; ++i) {
    width = iio.random(0.1,1) //half width
    height = iio.random(0.1,1) //half height

    // set shape as polygon or circle
    if(iio.random() > 0.5) {
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(width, height);
    } 
    else fixDef.shape = new b2CircleShape(width);

    // set body position
    bodyDef.position.x = iio.random(1,b2Width-1);
    bodyDef.position.y = iio.random(1,b2Height-1);

    // create body and add to app
    obj = app.add(world.CreateBody(bodyDef));

    // create fixture and set display properties
    obj.CreateFixture(fixDef).GetShape().set({
      outline: 'iioblue',
      lineWidth: 2,
      refLine: true,
    });
  }

  //Set the update loop
  app.b2Loop(60, function(){

    // find selected body
    if(isMouseDown && (!mouseJoint)) {
      var body = getB2BodyAt(mouseX,mouseY);
      // drag selected body
      if(body) {
        var md = new b2MouseJointDef();
        md.bodyA = world.GetGroundBody();
        md.bodyB = body;
        md.target.Set(mouseX, mouseY);
        md.collideConnected = true;
        md.maxForce = 300.0 * body.GetMass();
        mouseJoint = app.add(world.CreateJoint(md)
          .set({
            color: 'white',
            width: 1,
          }));
        body.SetAwake(true);
      }
    }
    // update joint
    if(mouseJoint) {
      if(isMouseDown) {
        mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
      } else {
        world.DestroyJoint(mouseJoint);
        app.rmv(mouseJoint);
        mouseJoint = null;
      }
    }
  });

  // find box 2d object at mouse position
  var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
  function getB2BodyAt(callback, v, y) {
    if (typeof v.x === 'undefined')
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

  // mouse input handlers
  app.onMouseDown = function(app, event, key){
    isMouseDown = true;
    mouseMove(event);
  }
  app.onMouseUp = function(app, event, key){
    isMouseDown = false;
    mouseX = undefined;
    mouseY = undefined;
  }
  mouseMove = function(event){
    var pos = app.eventVector(event);
    mouseX = pos.x / 30;
    mouseY = pos.y / 30;
  }
  iio.addEvent(app.canvas, 'mousemove', mouseMove);

  // keyboard input handlers
  app.onKeyDown = function(event, key){
    if (key === 'p')
      app.pauseB2World();
    else if (key === 'd')
      app.clear();
  }
}
