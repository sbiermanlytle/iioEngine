/*
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
(function(){
    BGColorDemo = function(io){
        io.setBGColor('red');
    }; iio.start(BGColorDemo, 'c20');

    BGImageDemo = function(io){
        io.setBGImage('img/snes_thumb.jpg');
    }; iio.start(BGImageDemo, 'c21');

    BGPatternDemo = function(io){
        io.setBGPattern('img/bgPattern.jpg');
    }; iio.start(BGPatternDemo, 'c18');

    BGOpaqueDemo = function(io){
        io.setBGColor('rgba(0,186,255,.4)');
    }; iio.start(BGOpaqueDemo, 'c17');

    LineDemo = function(io){
        io.addObj((new iio.Line(40,120,160,160))
          .setLineWidth(1)
          .setStrokeStyle('red'));
        io.addObj((new iio.Line(40,100,160,140))
          .setLineWidth(2)
          .setStrokeStyle('red'));
        var gradient=io.context.createLinearGradient(0,0,140,0);
        gradient.addColorStop("0","magenta");
        gradient.addColorStop("0.5","blue");
        gradient.addColorStop("1.0","red");
        io.addObj((new iio.Line(40,80,160,120))
          .setLineWidth(4)
          .setStrokeStyle(gradient));
        io.addObj((new iio.Line(40,60,160,100))
          .setLineWidth(2)
          .setStrokeStyle('blue'));
        io.addObj((new iio.Line(40,40,160,80))
          .setLineWidth(1)
          .setStrokeStyle('#a3da58'));
    }; iio.start(LineDemo, 'c9');

    MultiLineDemo = function(io){
        io.addObj((new iio.MultiLine([80,160
                                      ,40,100
                                      ,80,40
                                      ,120,40
                                      ,160,100
                                      ,120,160]))
          .setLineWidth(2)
          .setStrokeStyle('#00baff'));
    }; iio.start(MultiLineDemo, 'c7');

    LineShadowDemo = function(io){
        io.setBGColor('white');
        io.addObj((new iio.MultiLine([120,40
                                      ,160,100
                                      ,120,160
                                      ,80,40
                                      ,40,100
                                      ,80,160]))
          .setLineWidth(3)
          .setShadow('rgb(150,150,150)',20,10,4)
          .setStrokeStyle('#a3da58'));
    }; iio.start(LineShadowDemo, 'c77');

    XDemo = function(io){
        io.addObj((new iio.XShape(io.canvas.center,100,100))
          .setLineWidth(2)
          .setStrokeStyle('#a3da58'));
    }; iio.start(XDemo, 'c8');

    TextDemo = function(io){
        io.addObj((new iio.Text('Text',iio.Vec.add(70,50,0,15)))
          .setFont('50px Consolas')
          .setTextAlign('center')
          .setFillStyle('#00baff'));
        io.addObj((new iio.Text('Text',iio.Vec.add(70,100,0,15)))
          .setFont('50px Arial')
          .setTextAlign('center')
          .setStrokeStyle('#a3da58'));
        var gradient=io.context.createLinearGradient(0,0,50,0);
        gradient.addColorStop("0","#00baff");
        gradient.addColorStop(".5","#a3da58");
        gradient.addColorStop("1.0","red");
        io.addObj((new iio.Text('Text',iio.Vec.add(70,150,0,15)))
          .setFont('50px Georgia')
          .setTextAlign('center')
          .setFillStyle('red'));
        io.addObj((new iio.Text('Text',iio.Vec.add(150,80,-10,20)))
          .setFont('60px Courier New')
          .setTextAlign('center')
          .rotate(Math.PI/2)
          .setFillStyle(gradient));
    }; iio.start(TextDemo, 'c5');

    TextShadowDemo = function(io){
        io.setBGColor('white');
        io.addObj((new iio.Text('Shadows',iio.Vec.add(io.canvas.center,0,15)))
          .setFont('50px Consolas')
          .setTextAlign('center')
          .setShadow('rgb(150,150,150)',10,10,4)
          .setFillStyle('black'));
    }; iio.start(TextShadowDemo, 'c12');

    RectanglesDemo = function(io){
        io.addObj((new iio.Rect(io.canvas.center,60))
          .rotate(Math.PI/4)
          .setFillStyle('red'));
        io.addObj((new iio.Rect(0,0,60,100))
          .setPos(io.canvas.center.x+40,io.canvas.center.y)
          .setFillStyle('rgba(0,0,255,.7)'));
        io.addObj((new iio.Rect(0,0,60,100))
          .setPos(io.canvas.center.x-40,io.canvas.center.y)
          .setLineWidth(2)
          .setStrokeStyle('#a3da58'));
    }; iio.start(RectanglesDemo, 'c14');

    CirclesDemo = function(io){
        io.addObj((new iio.Circle(io.canvas.center,40))
          .setFillStyle('red'));
        io.addObj((new iio.Circle(0,0,40))
          .setPos(io.canvas.center.x+30,io.canvas.center.y+30)
          .setFillStyle('rgba(0,0,255,.7)'));
        io.addObj((new iio.Circle(0,0,40))
          .setPos(io.canvas.center.x-30,io.canvas.center.y-30)
          .setLineWidth(2)
          .setStrokeStyle('#a3da58'));
    }; iio.start(CirclesDemo, 'c15');

    PolyDemo = function(io){
        io.addObj((new iio.Poly(50,50, [-30,30
                                        ,50,50
                                        ,0,-30]))
          .setFillStyle('#00baff'));
        io.addObj((new iio.Poly(150,150, [-70,10
                                        ,-50,30
                                        ,10,10
                                        ,-20,-80]))
          .setFillStyle('red'));
        io.addObj((new iio.Poly([70,150
                            ,40,100
                            ,70,50
                            ,130,50
                            ,160,100
                            ,130,150]))
          .setStrokeStyle('#a3da58')
          .setLineWidth(3));
    }; iio.start(PolyDemo, 'c16');

    ImageDemo = function(io){
        addOnLoad = function(){io.addObj(this[0])};
        
        var shroom = new iio.Rect(60, io.canvas.height-40);
        shroom.createWithImage('img/shroom.png', addOnLoad.bind([shroom]));

         window.addEventListener('keydown', function(event){
      if (iio.keyCodeIs('d', event)){
          io.rmvObj(shroom);}
    });

        var smily = new iio.Rect(io.canvas.center.x+50, io.canvas.height-50, 55, 120);
        smily.addImage('img/hill_short.png', addOnLoad.bind([smily]));

        var polyImage = new iio.Poly(150,50,[25,25
                                              ,0,-25
                                             ,-25,25]);
        polyImage.addImage('img/block.png', addOnLoad.bind([polyImage]));

        var block = new iio.Rect(60, 80,60);
        block.createWithImage('img/bonus.png', addOnLoad.bind([block]));
    }; iio.start(ImageDemo, 'c3');

    CircleImageDemo = function(io){
        io.setBGColor('white');
        var circleImg = (new iio.Circle(io.canvas.center,80))
          .setStrokeStyle('black')
          .setLineWidth(2)
          .setShadow('rgb(150,150,150)',10,10,4)
          .addImage('img/staryNight.jpg', function(){
            circleImg.setImgScale(.5);
            io.addObj(circleImg);
          }.bind([io,circleImg]));
    }; iio.start(CircleImageDemo, 'c4');

    GridDemo = function(io){
        io.addObj((new iio.Grid(0,0,10,10,20,22))
          .setStrokeStyle('white'));
        io.addObj((new iio.Grid(0,0,3,4,50))
          .setStrokeStyle('red')
          .setLineWidth(4));
        io.addObj((new iio.Grid(100,0,2,4,50))
          .setStrokeStyle('#00baff')
          .setLineWidth(4));
        io.addObj((new iio.Line(io.canvas.center.x,0,io.canvas.center.x,io.canvas.height))
          .setStrokeStyle('#a3da58')
          .setLineWidth(4));
    }; iio.start(GridDemo, 'c19');

    AnimsDemo = function(io){
        addOnLoad = function(){
            io.addObj(this[0],this[1],this[2])
        };

        //space guy
        var spaceGuySrcs = ['img/character/walk/walk-1.png'
                   ,'img/character/walk/walk-2.png'
                   ,'img/character/walk/walk-3.png'
                   ,'img/character/walk/walk-4.png'
                   ,'img/character/walk/walk-5.png'
                   ,'img/character/walk/walk-6.png'
                   ,'img/character/walk/walk-7.png'
                   ,'img/character/walk/walk-8.png'
                   ,'img/character/walk/walk-9.png'
                   ,'img/character/walk/walk-10.png'
                   ,'img/character/walk/walk-11.png'];

        var spaceGuy = new iio.Rect(60, io.canvas.height-60);
        spaceGuy.createWithAnim(spaceGuySrcs, addOnLoad.bind([spaceGuy,0,0]));
        io.setFramerate(15, function(){
            spaceGuy.nextAnimFrame();
        });

        //Fly
        io.addCanvas();
        var flySrcs = ['img/enemies/fly_normal.png'
                   ,'img/enemies/fly_fly.png'];

        var fly = new iio.Rect(io.canvas.width-60, 60);
        fly.createWithAnim(flySrcs, addOnLoad.bind([fly,-1,1]));

        io.setFramerate(4, function(){
            fly.nextAnimFrame();
        },fly,io.ctxs[1]);
    }; iio.start(AnimsDemo, 'c1');

    KinematicsDemo = function(io){

        io.addObj((new iio.Rect(60,60,80))
          .enableKinematics()
          .setTorque(.2)
          .addImage('img/enemyUFO.png'));

        var crate = io.addObj((new iio.Rect(60,150,70))
          .enableKinematics()
          .setVel(1,0)
          .addImage('img/crate.png'));
        
        io.setFramerate(60, function(){
            if (crate.pos.x > io.canvas.width-60)
                crate.setVel(-1,0);
            else if (crate.pos.x < 60)
                crate.setVel(1,0);
        });
    }; iio.start(KinematicsDemo, 'c2');

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
 }; iio.start(B2BasicRendering, 'b2d');
})();
