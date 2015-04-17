<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Box 2D';
  include('inc/docsGlobals.php');
	include('inc/preHeader.php');
	include('inc/header.php');
  	include('docsPan.php');
?>
	<section class="container right-container top docs">
    <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-b2d */
google_ad_slot = "6148907132";
google_ad_width = 120;
google_ad_height = 600;
}
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</script>
</div>
      <div class="docs-top">
        <a class="anchor top-anchor" name="overview">&nbsp;</a> 
        <h1>iio with Box2D</h1>
        <h4>Download <a target="_new" href="https://code.google.com/p/box2dweb/downloads/detail?name=Box2dWeb-2.1a.3.zip">Box2DWeb</a></h4>
        <p>The iio Engine integrates with <a href="http://code.google.com/p/box2dweb/">Box2dWeb</a> by providing a graphics engine and an application deployment framework.</p>
        <p><a href="http://code.google.com/p/box2dweb/">Box2dWeb</a> is a JavaScript port of <a href="http://www.box2dflash.org/">Box2DFlash</a>. The libraries are almost identical, so the <a target="_new" href="http://www.box2dflash.org/docs/2.0.2/manual">Box2DFlash Documentation</a> page can be used as a coding reference.</p>
        <p>You can find a lot of resources and help at the main <a href="http://www.box2d.org/forum/index.php">Box2D Forums</a>. JavaScript specific discussions can be found at their <a target="_new" href="http://www.box2d.org/forum/viewforum.php?f=22">JS Forums</a>.</p>
        <p>Using Box2D with iio is very straightforward. First, make sure you load the <span class="kwd">Box2DWeb</span> JS file before the <span class="kwd">iioEngine</span> JS file:</p>
  <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="Box2dWeb-2.1.a.3.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="iioEngine-1.2.1.js"&gt;&lt;/script&gt;
    &lt;!-- application script --&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
      <p>The iio Engine attaches functions to classes in the Box2D libraries, so the Box2D framework needs to loaded first.</p>
      <p>You will now have access to the Box2D framework in your iio Application script.</p>
      <p>Similar to iio Objects, you need to access Box2D classes through a package structure.</p>
      <p>Box2D has a lot of packages, so you'll want to load local variables for them before you do anything else:</p>
        <pre class="prettyprint linenums:1">
//load some common classes
var b2Vec2 = Box2D.Common.Math.b2Vec2
   ,b2BodyDef = Box2D.Dynamics.b2BodyDef
   ,b2Body = Box2D.Dynamics.b2Body
   ,b2FixtureDef = Box2D.Dynamics.b2FixtureDef
   ,b2World = Box2D.Dynamics.b2World
   ,b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
   ,b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;</pre>
   <p>As always, the first step in creating content for a Box2D application is to create a <span class="kwd">world</span> object.</p>
           <pre class="prettyprint linenums:1">
//create a box2d world
var world = new b2World(
        new b2Vec2(0, 10) //gravity
       ,true              //allow sleep
    );</pre>
   <p>The next thing that is good to do is to pass the new <span class="kwd">world</span> object to your <a href="AppManager.php">AppManager</a>:</p>
           <pre class="prettyprint linenums:1">
//give io a reference to the world
io.addB2World(world);</pre>
    <p>This will allow the <a href="AppManager.php">AppManager</a> to control the world's <span class="kwd">step</span> function. You can set your <span class="kwd">world's</span> FPS and define a custom update script by using the <span class="kwd">setB2Framerate</span> function:</p>
           <pre class="prettyprint linenums:1">
//start the update loop
io.setB2Framerate(60, function(){
  //code called 60x a second
}</pre>
    <p>The process for creating objects is unaltered:</p>
               <pre class="prettyprint linenums:1">
//Define a fixture
var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.3;
fixDef.restitution = 0.5;

//Set the shape
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(2,2);

//Define a body
var bodyDef = new b2BodyDef;
bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.position.Set(5,5);

//Create the body
var body = world.CreateBody(bodyDef);

//Create the fixture
var fixture = body.CreateFixture(fixDef);
</pre>
      <p>After you create the object though, you must pass the new <span class="kwd">body</span> object to your <a href="AppManager.php">AppManager</a>, so that it can render its fixture(s):</p>
<pre class="prettyprint linenums:1">
//give new bodies to your AppManager
io.addObj(body);</pre>
    <p>Images and styles can be applied to a fixture's <span class="kwd">shape</span> property just like any iio Object, but you must call the <span class="kwd">prepGraphics</span> function with your <span class="kwd">b2Scale</span> variable (which is auto set by the <a href="AppManager.php">AppManager</a> to <span class="kwd">30</span>) before hand:</p>
    <pre class="prettyprint linenums:1">
fixture.GetShape()
       .prepGraphics(io.b2Scale)
       .setStrokeStyle('black', 2)
       .addImage('path/image.png');</pre>
       <p>The next section documents exactly which graphics functions are added to which Box2D classes.</p>
       <p>Two B2D demo applications are available to view and download. Visit the <a href="../extensions">extensions</a> or <a href="../demos">demos</a> pages to find them.</p>
      </div>
      <div class="docs-middle">
<a class="anchor" name="attached-functions">&nbsp;</a> 
        <h2>Attached Functions</h2>
        <h4 style="margin:30px 0 -25px 20px">b2Joint</h4>
        <div class="docs-inner">
          <h3>.<span class="kwd">prepGraphics</span></h3>
          <h3 class="func">.<a href="graphics-engine.php#draw">draw</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setAlpha">setAlpha</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setStrokeStyle">setStrokeStyle</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setLineWidth">setLineWidth</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadow">setShadow</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowColor">setShadowColor</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowBlur">setShadowBlur</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowOffset">setShadowOffset</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#fade">fade</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#fadeIn">fadeIn</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#fadeOut">fadeOut</a></h3>
        </div>
        <h4 style="margin:30px 0 -25px 20px">b2Shape -> b2PolygonShape, b2CircleShape</h4>
        <div class="docs-inner">
          <h3>.<span class="kwd">prepGraphics</span></h3>
          <h3 class="func">.<a href="graphics-engine.php#draw">draw</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setAlpha">setAlpha</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setStrokeStyle">setStrokeStyle</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setLineWidth">setLineWidth</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setFillStyle">setFillStyle</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadow">setShadow</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowColor">setShadowColor</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowBlur">setShadowBlur</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowOffset">setShadowOffset</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#fade">fade</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#fadeIn">fadeIn</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#fadeOut">fadeOut</a></h3>

          <h3 class="func">.<a href="graphics-engine.php#addImage">addImage</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#addAnim">addAnim</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#flipImage">flipImage</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgOffset">setImgOffset</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgSize">setImgSize</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgScale">setImgScale</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgRotation">setImgRotation</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setAnimKey">setAnimKey</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setAnimFrame">setAnimFrame</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#nextAnimFrame">nextAnimFrame</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#playAnim">playAnim</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#stopAnim">stopAnim</a></h3>
        </div>
        <h4 style="margin:30px 0 -25px 20px">b2CircleShape</h4>
        <div class="docs-inner">
          <h3>.<a href="graphics-engine.php#drawReferenceLine">drawReferenceLine</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setPolyDraw">setPolyDraw</a></h3>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>