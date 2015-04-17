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
<script type="text/javascript">
//NOTE: MAKE HEIGHT VARIABLE FOR DEBUGGER
(function(){function t(){this.AppDebugger.apply(this,arguments)}var e="white";iio.AppDebugger=t;t.prototype.AppDebugger=function(e){this.io=e;this.section=document.createElement("section");this.section.setAttribute("class","AppDebugger");this.section.style.position="absolute";this.section.style.left=e.canvas.pos.x+"px";this.section.style.top=e.canvas.pos.y+"px";this.section.style.zIndex=100;this.section.style.backgroundColor="rgba(0,0,0,0.2)";this.section.style.padding=5+"px";this.section.style.fontFamily="Calibri";this.section.style.color="#f8f8f8";this.section.style.maxWidth=202+"px";this.section.style.maxHeight=e.canvas.height-20+"px";this.section.style.overflowY="auto";this.section.style.overflowX="hidden";document.body.appendChild(this.section);this.drawOutlineToggle=document.createElement("div");this.drawOutlineToggle.setAttribute("id","ioDBOpts");this.drawOutlineToggle.innerHTML='<input id="ioDBshowOutline" style="margin:0" type="checkbox"><label for="ioDBshowOutline" style="display:inline-block;margin:5px;">Outline Objects</label>';this.section.appendChild(this.drawOutlineToggle);this.drawOutline=false;var t=this;document.getElementById("ioDBshowOutline").addEventListener("change",function(){t.drawOutline=!t.drawOutline;t.toggleOutlines()});this.table=document.createElement("table");this.table.setAttribute("class","ioDBTable");tr=document.createElement("tr");var n=document.createElement("td");n.innerHTML="Total Objects:";n.setAttribute("class","ioDBtdLeft");n.style.textAlign="right";this.totalObjs=document.createElement("td");this.totalObjs.setAttribute("class","ioDBtdRight");this.totalObjs.style.paddingLeft=5+"px";this.totalObjs.style.textAlign="left";tr.appendChild(n);tr.appendChild(this.totalObjs);this.table.appendChild(tr);this.section.appendChild(this.table);this.cnvs=[];this.lastTime=0;this.update(0,this);iio.addEvent(window,"resize",function(t){if(this[0].io.fullScreen){e.canvas.width=window.innerWidth;e.canvas.height=window.innerHeight}for(var n=0;n<this[0].io.cnvs.length;n++){if(n>0){this[0].io.cnvs[n].style.left=this[0].io.cnvs[0].offsetLeft+"px";this[0].io.cnvs[n].style.top=this[0].io.cnvs[0].offsetTop+"px"}this[0].io.setCanvasProperties(n)}this[0].section.style.left=e.canvas.pos.x+"px";var r=document.body.scrollTop;if(r==0){if(window.pageYOffset)r=window.pageYOffset;else r=document.body.parentElement?document.body.parentElement.scrollTop:0}this[0].section.style.top=e.canvas.pos.y+r+"px";if(typeof this[0].io.app.onResize!="undefined")this[0].io.app.onResize(t)}.bind([this]),false)};t.prototype.toggleOutlines=function(){for(var t=0;t<this.io.cnvs.length;t++)for(var n=0;n<this.io.cnvs[t].groups.length;n++)for(var r=0;r<this.io.cnvs[t].groups[n].objs.length;r++)if(this.drawOutline){if(typeof this.io.cnvs[t].groups[n].objs[r].styles!="undefined"&&typeof this.io.cnvs[t].groups[n].objs[r].styles.strokeStyle!="undefined")this.io.cnvs[t].groups[n].objs[r].alreadyStroked=true;else{this.io.cnvs[t].groups[n].objs[r].setStrokeStyle(e);this.io.cnvs[t].groups[n].objs[r].clearSelf(this.io.ctxs[t]);this.io.cnvs[t].groups[n].objs[r].draw(this.io.ctxs[t])}}else if(this.io.cnvs[t].groups[n].objs[r].alreadyStroked)break;else{this.io.cnvs[t].groups[n].objs[r].clearSelf(this.io.ctxs[t]);this.io.cnvs[t].groups[n].objs[r].styles.strokeStyle=undefined;this.io.cnvs[t].groups[n].objs[r].draw(this.io.ctxs[t])}};t.prototype.addOutlines=function(){for(var t=0;t<this.io.cnvs.length;t++)for(var n=0;n<this.io.cnvs[t].groups.length;n++)for(var r=0;r<this.io.cnvs[t].groups[n].objs.length;r++)this.io.cnvs[t].groups[n].objs[r].setStrokeStyle(e)};t.prototype.update=function(e,t){iio.requestTimeout(5,t.lastTime,function(e,t){t[0].lastTime=e;t[0].update(5,t[0]);t[0].totalObjs.innerHTML=t[0].updateData();t[0].updateMsgs();if(t[0].drawOutline)t[0].addOutlines()},[this])};t.prototype.updateMsgs=function(){if(typeof this.msgs!="undefined"){if(typeof this.msgBox=="undefined"){this.msgBox=document.createElement("div");this.msgBox.setAttribute("class","ioDBMsgBox");this.msgBox.style.marginTop="5px";this.msgBox.style.maxHeight="100px";this.msgBox.style.overflowY="scroll";this.msgBox.style.textAlign="left";this.msgBox.style.borderTop="1px solid white";this.section.appendChild(this.msgBox)}for(var e=0;e<this.msgs.length;e++){var t=document.createElement("p");t.innerHTML=this.msgs[e];t.style.margin=0;this.msgBox.appendChild(t);this.msgBox.scrollTop=this.msgBox.scrollHeight}this.msgs=undefined}};t.prototype.updateCanvasData=function(e){if(typeof this.io.cnvs[e].groups=="undefined")return 0;var t=0;for(var n=0;n<this.io.cnvs[e].groups.length;n++){if(this.cnvs[e].groups.length<=n){tr=document.createElement("tr");this.cnvs[e].tags[n]=document.createElement("td");this.cnvs[e].tags[n].setAttribute("class","ioDBtdLeft");this.cnvs[e].tags[n].style.textAlign="right";tr.appendChild(this.cnvs[e].tags[n]);this.cnvs[e].groups[n]=document.createElement("td");this.cnvs[e].groups[n].setAttribute("class","ioDBtdRight");this.cnvs[e].groups[n].style.paddingLeft=5+"px";this.cnvs[e].groups[n].style.textAlign="left";tr.appendChild(this.cnvs[e].groups[n]);this.cnvs[e].appendChild(tr)}var r=this.io.cnvs[e].groups[n].objs.length;this.cnvs[e].groups[n].innerHTML=r;this.cnvs[e].tags[n].innerHTML=this.io.cnvs[e].groups[n].tag+":";t+=r}return t};t.prototype.updateData=function(){if(typeof this.io.cnvs=="undefined")return"no canvas elements";var e=0;for(var t=0;t<this.io.cnvs.length;t++){if(this.cnvs.length<=t){this.cnvs[t]=document.createElement("this.table");this.cnvs[t].setAttribute("class","ioDBtable");this.cnvs[t].style.width=100+"%";this.section.appendChild(this.cnvs[t]);tr=document.createElement("tr");var n=document.createElement("td");if(t==0)n.innerHTML="Base Canvas";else n.innerHTML="Canvas "+t;n.setAttribute("class","ioDBtdLeft");n.style.textAlign="right";n.style.color="#00baff";tr.appendChild(n);this.cnvs[t].appendChild(tr);this.cnvs[t].groups=[];this.cnvs[t].tags=[]}e+=this.updateCanvasData(t)}return e};iio.AppManager.prototype.debugMsg=function(e){if(typeof this.debugger!="undefined"){if(typeof this.debugger.msgs=="undefined")this.debugger.msgs=[];this.debugger.msgs[this.debugger.msgs.length]=e}};iio.AppManager.prototype._setFramerate=iio.AppManager.prototype.setFramerate;iio.AppManager.prototype.setFramerate=function(e,t,n,r){if(typeof this.debugger!="undefined"&&document.getElementById("ioDBOpts")!=null&&this.debugger.section!=null){if(typeof this.debugger.stats=="undefined"){this.debugger.stats=new Stats;this.debugger.stats.setMode(0);this.debugger.section.insertBefore(this.debugger.stats.domElement,document.getElementById("ioDBOpts"))}this.debugger.stats.begin();this._setFramerate(e,t,n,r);this.debugger.stats.end()}else this._setFramerate(e,t,n,r)};iio.AppManager.prototype._AppManager=iio.AppManager.prototype.AppManager;iio.AppManager.prototype.activateDebugger=function(e,t,n,r){this.debugger=new iio.AppDebugger(this)}})();var Stats=function(){var e=Date.now(),t=e;var n=0,r=Infinity,i=0;var s=0,o=Infinity,u=0;var a=0,f=0;var l=document.createElement("div");l.id="stats";l.addEventListener("mousedown",function(e){e.preventDefault();y(++f%2)},false);l.style.cssText="width:100%;opacity:0.9;cursor:pointer";var c=document.createElement("div");c.id="fps";c.style.cssText="padding:0 0 3px 3px;text-align:left;";l.appendChild(c);var h=document.createElement("div");h.id="fpsText";h.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";h.innerHTML="FPS";c.appendChild(h);var p=document.createElement("div");p.id="fpsGraph";p.style.cssText="position:relative;width:100%;height:30px;background-color:#0ff";c.appendChild(p);while(p.children.length<199){var d=document.createElement("span");d.style.cssText="width:1px;height:30px;float:left;background-color:#113";p.appendChild(d)}var v=document.createElement("div");v.id="ms";v.style.cssText="padding:0 0 3px 3px;text-align:left;display:none";l.appendChild(v);var m=document.createElement("div");m.id="msText";m.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";m.innerHTML="MS";v.appendChild(m);var g=document.createElement("div");g.id="msGraph";g.style.cssText="position:relative;width:100%;height:30px;background-color:#0f0";v.appendChild(g);while(g.children.length<199){var d=document.createElement("span");d.style.cssText="width:1px;height:30px;float:left;background-color:#131";g.appendChild(d)}var y=function(e){f=e;switch(f){case 0:c.style.display="block";v.style.display="none";break;case 1:c.style.display="none";v.style.display="block";break}};var b=function(e,t){var n=e.appendChild(e.firstChild);n.style.height=t+"px"};return{REVISION:11,domElement:l,setMode:y,begin:function(){e=Date.now()},end:function(){var f=Date.now();n=f-e;r=Math.min(r,n);i=Math.max(i,n);m.textContent=n+" MS ("+r+"-"+i+")";b(g,Math.min(30,30-n/200*30));a++;if(f>t+1e3){s=Math.round(a*1e3/(f-t));o=Math.min(o,s);u=Math.max(u,s);h.textContent=s+" FPS ("+o+"-"+u+")";b(p,Math.min(30,30-s/100*30));t=f;a=0}return f},update:function(){e=this.end()}}}
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
  io.activateDebugger();
 
        io.debugMsg('Hello Debugger!');
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
              }
              else if (iio.getRandomNum(0,10) < .2)
                  io.addToGroup('small stars',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[1]).enableKinematics().setVel(0,Math.round(backgroundSpeed/2)).setBound('bottom',io.canvas.height+100);
              else if (iio.getRandomNum(0,10) < .2)
                  io.addToGroup('big stars',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[0]).enableKinematics().setVel(0,Math.round(backgroundSpeed/2)+.2).setBound('bottom',io.canvas.height+100);
  }

  function createLargeAsteroids(){
      var asteroid;
      if (iio.getRandomNum(0, 10) < 8){
          asteroid = io.addToGroup('large meteors', new iio.Rect(iio.getRandomInt(30,io.canvas.width-30), iio.getRandomInt(-800,-50))).createWithImage(asteroidSrcs[0]).enableKinematics().setVel(iio.getRandomInt(-2,2), iio.getRandomInt(10,14)).setBound('bottom', io.canvas.height+200).setTorque(iio.getRandomNum(-.1,.1));
        io.debugMsg('New meteor at: '+asteroid.pos.toString());
        }
  }
  function createSmallAsteroids(){
      if (iio.getRandomNum(0, 10) < 8){
          var asteroid = io.addToGroup('small meteors', new iio.Rect(iio.getRandomInt(30,io.canvas.width-30), iio.getRandomInt(-800,-50))).enableKinematics().setBound('bottom', io.canvas.height+200).createWithImage(asteroidSrcs[1]).setVel(iio.getRandomInt(-2,2), iio.getRandomInt(10,14)).setTorque(iio.getRandomNum(-.1,.1));
          io.debugMsg('New  meteor at: '+asteroid.pos.toString());
        
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