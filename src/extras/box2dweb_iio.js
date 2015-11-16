/* Attach iio to box2dWeb
-------------------------
*/
if (typeof Box2D !== 'undefined'){
  Box2D.Dynamics.Joints.b2Joint.prototype.set = iio.Drawable.prototype.set;
  Box2D.Dynamics.Joints.b2Joint.prototype.convert_props = iio.Drawable.prototype.convert_props;
  Box2D.Collision.Shapes.b2Shape.prototype.set = iio.Drawable.prototype.set;
  Box2D.Collision.Shapes.b2Shape.prototype.convert_props = iio.Drawable.prototype.convert_props;
  Box2D.Collision.Shapes.b2CircleShape.prototype.set = iio.Drawable.prototype.set;
  Box2D.Collision.Shapes.b2CircleShape.prototype.convert_props = iio.Ellipse.prototype.convert_props;
  Box2D.Collision.Shapes.b2Shape.prototype.playAnim=iio.Shape.prototype.playAnim;
  Box2D.Collision.Shapes.b2Shape.prototype.stopAnim=iio.Shape.prototype.stopAnim;
  Box2D.Collision.Shapes.b2Shape.prototype.setSprite=iio.Shape.prototype.setSprite;
  Box2D.Collision.Shapes.b2Shape.prototype.nextFrame=iio.Shape.prototype.nextFrame;
  Box2D.Collision.Shapes.b2Shape.prototype.prevFrame=iio.Shape.prototype.prevFrame;
  Box2D.Collision.Shapes.b2Shape.prototype.orient_ctx=iio.Shape.prototype.orient_ctx;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_color=iio.Shape.prototype.prep_ctx_color;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_outline=iio.Shape.prototype.prep_ctx_outline;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_lineWidth=iio.Shape.prototype.prep_ctx_lineWidth;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_shadow=iio.Shape.prototype.prep_ctx_shadow;
  Box2D.Collision.Shapes.b2Shape.prototype.prep_ctx_dash=iio.Shape.prototype.prep_ctx_dash;
  Box2D.Collision.Shapes.b2Shape.prototype.finish_path_shape=iio.Shape.prototype.finish_path_shape;
  Box2D.Collision.Shapes.b2Shape.prototype.draw_obj=iio.Shape.prototype.draw_obj;
  Box2D.Collision.Shapes.b2Shape.prototype.draw=iio.Shape.prototype.draw;
  Box2D.Collision.Shapes.b2CircleShape.prototype.draw_shape = iio.Ellipse.prototype.draw_shape;
  Box2D.Collision.Shapes.b2PolygonShape.prototype.draw_shape = iio.Polygon.prototype.draw_shape;
  Box2D.Dynamics.Joints.b2Joint.prototype.orient_ctx = iio.Shape.prototype.orient_ctx;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_color = iio.Line.prototype.prep_ctx_color;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_lineWidth=iio.Line.prototype.prep_ctx_lineWidth;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_shadow=iio.Shape.prototype.prep_ctx_shadow;
  Box2D.Dynamics.Joints.b2Joint.prototype.prep_ctx_dash=iio.Shape.prototype.prep_ctx_dash;
  Box2D.Dynamics.Joints.b2Joint.prototype.draw_obj=iio.Shape.prototype.draw_obj;
  Box2D.Dynamics.Joints.b2Joint.prototype.draw = function(ctx){
    this.draw_obj(ctx);
  }
  Box2D.Dynamics.Joints.b2Joint.prototype.draw_shape = function(ctx){
    var b1 = this.GetBodyA();
    var b2 = this.GetBodyB();
    var xf1 = b1.m_xf;
    var xf2 = b2.m_xf;
    var x1 = xf1.position;
    var x2 = xf2.position;
    var p1 = this.GetAnchorA();
    var p2 = this.GetAnchorB();
    ctx.beginPath();
    switch (this.m_type) {
      case Box2D.Dynamics.Joints.b2Joint.e_distanceJoint:
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
          break;
      case Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint:
        var pulley = ((this instanceof b2PulleyJoint ? this : null));
        var s1 = pulley.GetGroundAnchorA();
        var s2 = pulley.GetGroundAnchorB();
        ctx.moveTo(s1.x*this.app.b2Scale,s1.y*this.app.b2Scale);
        ctx.lineTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.moveTo(s2.x*this.app.b2Scale,s2.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        ctx.moveTo(s1.x*this.app.b2Scale,s1.y*this.app.b2Scale);
        ctx.lineTo(s2.x*this.app.b2Scale,s2.y*this.app.b2Scale);
          break;
      case Box2D.Dynamics.Joints.b2Joint.e_mouseJoint:
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
          break;
      default:
        if (b1 != this.m_groundBody) {
          ctx.moveTo(x1.x*this.app.b2Scale,x1.y*this.app.b2Scale);
          ctx.lineTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        }
        ctx.moveTo(p1.x*this.app.b2Scale,p1.y*this.app.b2Scale);
        ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        if (b2 != this.m_groundBody){
          ctx.moveTo(x2.x*this.app.b2Scale,x2.y*this.app.b2Scale);
          ctx.lineTo(p2.x*this.app.b2Scale,p2.y*this.app.b2Scale);
        }
     }
     ctx.stroke();
  }
  Box2D.Dynamics.b2Body.prototype.draw = function(ctx){
    for (f=this.m_fixtureList;f;f=f.m_next){
      s=f.GetShape(); 
      s.radius=s.m_radius*this.app.b2Scale;
      s.pos=new iio.Vector(
        this.m_xf.position.x*this.app.b2Scale,
        this.m_xf.position.y*this.app.b2Scale);
      s.rotation=this.GetAngle();
      if (s.m_vertices){
        s.vs=[];
        for (var i=0; i<s.m_vertices.length; i++)
          s.vs.push(new iio.Vector(
            s.m_vertices[i].x*this.app.b2Scale,
            s.m_vertices[i].y*this.app.b2Scale));
      }
      if(s.draw) s.draw(ctx);
    }
  }

  // iio.App
  //-------------------------------------------------------------------
  iio.App.prototype.addB2World = function(world,c){
    this.b2World = world;
    this.b2Scale = 30;
    this.b2Cnv = c||0;
    return world;
  }
  iio.App.prototype.b2Loop = function( fps, callback ){
    this.b2lastTime = this.b2lastTime || 0;
    if (this.b2World && !this.b2Pause)
      this.b2World.Step(1/this.fps, 10, 10);
    iio.requestTimeout(fps, this.b2lastTime, function(dt,args){
      args[0].b2lastTime = dt;
      args[0].b2Loop(fps,callback);
      if (args[0].b2World && !args[0].b2Pause)
        args[0].b2World.Step(1/fps, 10, 10);
      callback(dt);
      if (args[0].b2DebugDraw && args[0].b2DebugDraw)
        args[0].b2World.DrawDebugData();
      else args[0].draw(args[0].b2Cnv);
      if (this.b2World)
        args[0].b2World.ClearForces();
    }, [this]);
    return this;
  }
  iio.App.prototype.pauseB2World = function(pause){
    if (typeof pause === 'undefined'){
      if (typeof this.b2Pause === 'undefined')
        this.b2Pause = true;
      else this.b2Pause = !this.b2Pause;
    } else this.b2Pause = pause;
    return this;
  }
  iio.App.prototype.activateB2Debugger = function(turnOn,c){
    turnOn = turnOn||true;
    c = c||0;
    if (turnOn){
      this.b2DebugDraw = new Box2D.Dynamics.b2DebugDraw();
      this.b2DebugDraw.SetSprite(this.ctxs[c]);
      this.b2DebugDraw.SetDrawScale(this.b2Scale);
      this.b2DebugDraw.SetFillAlpha(0.5)
      this.b2DebugDraw.SetLineThickness(1.0)
      this.b2DebugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit)
      this.b2World.SetDebugDraw(this.b2DebugDraw);
      return this.b2DebugDraw;
    }
  }
  iio.App.prototype.b2BodyAt = function(callback,v,y){
    if (typeof v.x === 'undefined')
      v = new Box2D.Common.Math.b2Vec2(v,y);
    var aabb = new Box2D.Collision.b2AABB();
    aabb.lowerBound.Set(v.x - 0.001, v.y - 0.001);
    aabb.upperBound.Set(v.x + 0.001, v.y + 0.001);
    function getBodyCB(fixture){
      if(fixture.GetBody().GetType() !== Box2D.Dynamics.b2Body.b2_staticBody) 
      if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), v)) 
        return fixture.GetBody();
      return false;
    }
    return this.b2World.QueryAABB(getBodyCB, aabb);
  }
}