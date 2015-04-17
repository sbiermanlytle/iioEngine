<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'The Basics';
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
/* iioEngine_docs-basics */
google_ad_slot = "9102373532";
google_ad_width = 120;
google_ad_height = 600;
}
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
      <div class="docs-top">
        <a class="anchor top-anchor" name="overview">&nbsp;</a> 
        <h3><span class="ioblue">NOTICE: <span class="kwd">v1.2.2+</span> available on Github</span></h3>
        <p>New functions for object attachment, sprite sheet extraction, and debug console messages are available in the <a target="_new" href="https://github.com/sbiermanlytle/iioengine">Github</a> distribution.</p>
        <p style="margin-bottom:50px">Checkout the updated <a target="_new" href="https://github.com/sbiermanlytle/iioengine/blob/master/demos/scroll-shooter/SpaceShooter%2B.io.js">Space Shooter Demo</a> or the new <a href="https://github.com/sbiermanlytle/iioengine/blob/master/demos/turret-defender/js/TurretDefender.io.js">Turret Defense Demo</a> for usage examples.</p>
        <h1>iio App Basics</h1>
        <p>This document provides an overview of the main features of the iio Engine.</p>
        <p>All code samples are assumed to be in a JavaScript document loaded onto an HTML page.</p>
        <p>Here is the simplest HTML page and iio Application we can create:</p>
  <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="iioEngine-1.2.1.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"&gt;

        Helloiio = function(io){
          io.addObj(new iio.Text('Hello iio!!', io.canvas.center)
              .setFont('30px Consolas')
              .setTextAlign('center')
              .setFillStyle('black'));
        }; iio.start(Helloiio);

    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="main-functions">&nbsp;</a> 
        <h2>Main App Functions</h2>
        <p>The best way to utilize the iio Engine when developing a web application is to create a function that receives an <a href="AppManager.php">AppManager</a> object:</p>
        <pre class="prettyprint linenums:1">
MyApplication = function(AppManager){
  //application code...
};</pre>
        <p>This code structure will allow you to use the <a href="iio-functions.php#start">start</a> functions available in the <span class=
          "kwd">iio</span> core package to easily create canvas elements and bind your application script to them:</p>
                <pre class="prettyprint linenums:1">
//create a full screen canvas and start MyApplication
iio.start(MyApplication);

//attach MyApplication to an existing canvas and start it
iio.start(MyApplication,'canvasId');</pre>
        <p>A new <a href="AppManager.php">AppManager</a> gets created and passed on to the given application script when you call a <a href="iio-functions.php#start">start</a> function.</p>
        <p>The <a href="AppManager.php">AppManager</a> provides structures for manipulating and managing all of the assets in your application. You can create content immediately:</p>
        <pre class="prettyprint linenums:1">
//I shorten AppManager to io for convenience
DrawSquareApp = function(io){

  //draw a 60x60 blue square at canvas center
  io.addObj(new iio.Rect(io.canvas.center,60)
    .setFillStyle('blue'));

}; iio.start(DrawSquareApp, 'canvasId');</pre>
<canvas id="canvas1" width="645px" height="100px"></canvas>
        </div>
        <div class="docs-middle">
        <a class="anchor" name="this">&nbsp;</a> 
        <h2>this &amp; Cascading Code</h2>
        <p>Many of the mutator functions in the iio framework return <span class="kwd">this</span>, which is a reference to the object that called the function. This design frequently allows you to code in a cascading structure - where multiple functions and objects interact in the same line of code.</p>
        <p>This structure is especially useful when initializing objects and setting properties. For example:</p>
        <pre class="prettyprint linenums:1">
//I shorten AppManager to io for convenience
ShadowSquareApp = function(io){

  io.setBGColor('white')
    .setFramerate(40, new iio.Rect(io.canvas.center,60)
      .setFillStyle('#00baff')
      .setStrokeStyle('black')
      .setShadow('rgb(150,150,150)',10,10,4)
      .enableKinematics()
      .setTorque(.15));

}; iio.start(ShadowSquareApp, 'canvasId');</pre>
<canvas id="canvas2" width="645px" height="100px"></canvas>
<p>The entire application is created in just one statement. I like to code like that, but it may not be for everyone.</p>
<p>One downside to structuring code in this way is that it makes it impossible to target a single function with a breakpoint when debugging.</p>
<p>If that concerns you or you if just don't like the cascading style, you can always rewrite code like that to this:</p>
        <pre class="prettyprint linenums:1">
ShadowSquareApp = function(io){

  io.setBGColor('white')

  var blueSquare = new iio.Rect(io.canvas.center,60);
  blueSquare.setFillStyle('#00baff');
  blueSquare.setStrokeStyle('black');
  blueSquare.setShadow('rgb(150,150,150)',10,10,4);
  blueSquare.enableKinematics();
  blueSquare.setTorque(.15);

  io.setFramerate(40, blueSquare);

}; iio.start(ShadowSquareApp, 'canvasId');</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="iio">&nbsp;</a> 
        <h2>iio Namespace</h2>
        <p>All of the functions, classes, properties, and constructs included in the iio Engine are contained within the namespace <span class="kwd">iio</span>.</p> 
        <p>When the iio Engine is loaded, all of its core components are synthesized through prototypal inheritance and attachment. After this, all iio objects and functions are directly accessible from the <span class="kwd">iio</span> namespace:</p>
                <pre class="prettyprint linenums:1">
//initialize an iio Object
var line = new iio.Line(0,0,50,50);

//use iio Functions
var rand = iio.getRandomNum(0,10);
var randInt = iio.getRandomInt(-10,10);

//use Application Control functions
var app1 = iio.start(AppName, 'canvasId')
var app2 = iio.start(AnotherAppName, 'canvasId2');</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="drawing">&nbsp;</a> 
        <h2>Drawing Objects</h2>
        <p>iio Objects do not draw themselves by default, but depending on which functions you call and how much you interact with your <a href="AppManager.php">AppManager</a>, you may not need to worry about drawing at all.</p>
        <p>If you want to use an object without drawing it, simply use the constructor and save a local reference:</p>
        <pre class="prettyprint linenums:1">
//create an invisible 3x3 grid with 200x200 pixel cells
var grid = new iio.Grid(0,0,3,3,200);</pre>
        <p>Creating an invisible grid is very useful for tile based apps, since <a href="Grid.php">Grid</a> gives you access to a matrix structure and positioning functions.</p>
        <p>If you want to draw this grid, you have a few options. Most iio Objects have a <span class="kwd">draw</span> function that ultimately gets called when they render. One option is to call this function directly:</p>        
        <pre class="prettyprint linenums:1">
//draw the grid (requires context of the rendering canvas)
grid.draw(io.context);</pre>
        <p>This is a good solution if you only need to draw the grid once and you never need to clear the canvas that its drawn on.</p>
        <p>Another option is to give the grid to your <a href="AppManager.php">AppManager</a>. From then on, the AppManager will manage the grids rendering, and it will clear and redraw the object whenever necessary:</p>        
        <pre class="prettyprint linenums:1">
//give the grid to the AppManager (denoted as io)
io.addObj(grid);</pre>
        <p>This is most often the best way to handle object rendering, so when in doubt about drawing, just give your object to the AppManager.</p>
        <p>For objects that move or have animating images, there are some other functions that trigger drawing. These will be covered in the following sections.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="kinematics">&nbsp;</a> 
        <h2>Moving Objects</h2>
        <p>iio Object translation and rotation can be auto-handled by iio's Kinematics Engine. There are three steps necessary to add automatic movement to an iio Object.</p>
        <p>First, call the <span class="kwd">enableKinematics()</span> function in the desired object:</p>
        <pre class="prettyprint linenums:1">
//create a shape and enable kinematics
var rect = new iio.Rect(100,100,50,70)
                  .enableKinematics();</pre>
        <p>Then add a velocity for movement, or a torque for rotation:</p>
        <pre class="prettyprint linenums:1">
//move to the right 1px per update
rect.setVel(1,0);

//rotate .1 radians every update
rect.setTorque(.1);</pre>
        <p>The last step is to set a loop to handle updates and rendering. There are two primary ways to accomplish this.</p>
        <p>You can assign an update loop to the object itself like this:</p>
        <pre class="prettyprint linenums:1">
//assign a 40fps update loop
io.setFramerate(40,rect);</pre>
        <p>If you need to run some code after each update, you can pass on a callback function like this:</p>
        <pre class="prettyprint linenums:1">
//assign a 40fps update loop and define a callback function
io.setFramerate(40, rect, function(){
  //code runs on each update
});

//or...

updateRect = function(){
  //code runs on each update
};
io.setFramerate(40, rect, updateRect);
</pre>
        <p>This technique is good to use when you only have a few objects that need to update, because the loop only redraws the object if it has changed position and the object's clearing function only clears its own spot on the canvas.</p>
        <p>JavaScript allows multiple timers to be set at the same time, so you can implement this technique on as many objects as you want.</p>
     <p>If you need to have a lot of objects updating and moving around though, a better approach is to give the objects to your <a href="AppManager.php">AppManager</a> and set an update loop on the canvas element:</p>
    <pre class="prettyprint linenums:1">
//AppManager denoted as io

//add the object
io.addObj(rect);

//assign a 40fps update loop to the base canvas
io.setFramerate(40);

//if a callback is needed:
io.setFramerate(40, function(){
  //update code..
});</pre>
      <p>The <a href="AppManager.php">AppManager</a> will clear the entire canvas and redraw all of its objects on every update.</p>
      <p>When developing apps that need a consistent FPS, this technique will serve you best. Here's an example with multiple updating objects.</p>
         <pre class="prettyprint linenums:1">
MultiSquare = function(io){

  for (var x=50; x&lt;400; x+=100)
    io.addObj(new iio.Rect(x,50,60)
      .setStrokeStyle('#00baff',2)
      .enableKinematics()
      .setTorque(.15));

  io.setFramerate(40);

}; iio.start(MultiSquare, 'canvasId');</pre> 
<canvas id="canvas3" width="645px" height="100px"></canvas>
      <p>Performance gains can be made in some situations by using multiple, overlapping canvas elements that update at different rates. See the <a href="#multiple-canvases">Multiple Canvases</a> section for more info.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="img-attachment">&nbsp;</a> 
        <h2>Attaching Images</h2>
        <p>Images are not given their own class structure in the iio Framework. Instead, they are attached to <a href="Shape.php">Shapes</a>.</p>
        <p><a href="Rect.php">Rect</a> is the most common base shape for an image (since all image files are rectangular), but <a href="Circle.php">Circle</a> and <a href="ioPoly.php">ioPoly</a> can be used as base shapes as well.</p>
        <p>There are two functions you can use to attach an image to a shape: <a href="graphics-engine.php#addImage">addImage</a> and <a href="graphics-engine.php#createWithImage">createWithImage</a>.</p>
        <p>The createWithImage function sets the shapes dimensions to the dimensions of the given image, and the addImage function makes the image conform to the dimensions of the host shape.</p>
        <p>Images must be loaded before they can be drawn, so a good method of creating a shape with an image attachment is as follows:</p>
        <pre class="prettyprint linenums:1">
//create a rectangle with the dimensions of the given image
var imgRect = new iio.Rect(positionVector)
   .createWithImage('imageName.png'
    //add the object when the image loads
    ,function(){io.addObj(imgRect)}); 

//create a 40x40 square and attach an image
var imgSquare = new iio.Rect(positionVector)
   .addImage('imageName.png'
    //add the object when the image loads
    ,function(){io.addObj(imgSquare)});</pre>
     <p>Images can also be loaded before the shape creation takes place, here's a full application sample:</p>
             <pre class="prettyprint linenums:1">
ImageDemo = function(io){

  //define a function to run when the image loads
  initApp = function(){
    io.setFramerate(40,new iio.Rect(io.canvas.center,80)
      .addImage(img)
      .enableKinematics()
      .setTorque(.15));
  };

  //load the image
  var img = new Image();
  img.src='meteorBig.png';
  img.onload = initApp;

}; iio.start(ImageDemo, 'canvasId');</pre>
<canvas id="canvas4" width="645px" height="100px"></canvas>
     <p>This technique is useful for applications that need to load a lot of images before starting up.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="anim-attachment">&nbsp;</a> 
        <h2>Attaching Animations</h2>
        <p>In addition to attaching images, you can also attach animations to a shape by giving it a series of images:</p>
        <pre class="prettyprint linenums:1">
//get the source images
var flySrcs = ['fly_normal.png'
              ,'fly_fly.png'];

//create a rectangle with the dimensions of the first anim image
var fly = new iio.Rect(io.canvas.center)
    .createWithAnim(flySrcs), function(){
        //image onload code
    });</pre>
    <p>To change which animation frame the shape is drawing, you can use the <a href="graphics-engine.php#setAnimFrame">setAnimFrame</a> or <a href="graphics-engine.php#nextAnimFrame">nextAnimFrame</a> functions:</p>
    <pre class="prettyprint linenums:1">
//change the displayed image to the fly_fly one
fly.setAnimIndex(1);

//advance to the next anim frame
fly.nextAnimFrame();</pre>
        <p>In the nextAnimFrame function, if the index gets to the end of the image sequence, it wraps back to the beginning.</p>
        <p>In order to get the animation animating, we need to set a frame rate. We could set a frame rate on the canvas and advance the animation's index on each update:</p>
        <pre class="prettyprint linenums:1">
//set the canvas to update at 3fps
io.setFramerate(3,function(){
  //move to the next image on each update
  fly.nextAnimFrame();
});</pre>
      <p>Or we could attach the loop to just the animating object:</p>
      <pre class="prettyprint linenums:1">
//set the fly to update and redraw at 3fps
io.setFramerate(3,fly,function(){
  fly.nextAnimFrame();
});</pre>
      <p>A shortcut function exists for this option - to advance the animation at a specific framerate, use the <a href="AppManager.php#setAnimFPS">setAnimFPS</a> function:</p>
        <pre class="prettyprint linenums:1">
//set the fly to update and redraw at 3fps
io.setAnimFPS(3,fly);</pre>
      <p>This is a great function to use when you have multiple animating objects that need to animate at different rates. See the animation example on the <a href="../demos.php">demos</a> page for a sample implementation.</p>
      <p>Another way to get animations updating at different rates is to give them an animation timer and update them all with the same canvas loop. This is the best technique to use when you have a large number of animating objects or when you have a lot of animation shapes using kinematics.</p>
      <p>All of the principles of image preloading discussed in the 'image attachment' section also apply to animations.</p>
      <p>Here is a full sample application to show you what I mean:</p>
<pre class="prettyprint linenums:1">
FlyAnims = function(io){

  //define an initialization function
  initApp=function(){
    for (var i=70; i&lt;600; i+=100)
      io.setAnimFPS(i/50+1, //make each fly update faster than the last
        new iio.Rect(i,iio.getRandomInt(30,60))
          .createWithAnim(imgs));
  };

  //load the source images
  var imgs = [];
  imgs[0] = new Image();
  imgs[0].src='enemies/fly_normal.png';
  imgs[1] = new Image();
  imgs[1].src='enemies/fly_fly.png';

  //initialize app once the first image has loaded
  imgs[0].onload = initApp;

}; iio.start(FlyAnims, 'canvasId');</pre>
<canvas id="canvas5" width="645px" height="100px"></canvas>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="bounds">&nbsp;</a> 
        <h2>Object Bounds</h2>
        <p>iio Kinematics adds a <a href="kinematics-engine.php#bounds">bounds</a> structure that you can use to get an object to do something if its position ever gets to a specified x or y coordinate.</p>
        <p>The default behavior for a bounded object is to have it remove itself when it hits the bound:</p>
        <pre class="prettyprint linenums:1">
//create a square that will move down from canvas center
//and remove itself when it hits the bottom of the screen
var square = new iio.Rect(io.canvas.center,50)
                  .enableKinematics()
                  .setVel(0,1)
                  .setBound('bottom', io.canvas.height);</pre>
        <p>We can easily specify our own behaviors though by giving the <span class="kwd">bound</span> a callback function:</p>
<pre class="prettyprint linenums:1">
//create a square that will move down from canvas center
//and reverse its direction when it hits the bottom of the screen
var square = new iio.Rect(io.canvas.center,50)
                  .enableKinematics()
                  .setVel(0,1)
                  .setBound('bottom', io.canvas.height
                    ,function(obj){
                      obj.vel.y = -1;
                      return true;
                     });</pre>
        <p>The parameter <span class="kwd">obj</span> will be a reference to the object that hit the bound.</p>
        <p>Note that you must put <span class="kwd">return true</span> at the end of this callback function if you don't want the object to remove itself.</p>
        <p>Here's a simple demo where bounds are used to keep this box moving back and forth on the canvas:</p>
<canvas id="canvas6" width="645px" height="100px"></canvas>
      <p>Check out the <a href="#full2" role="button" data-toggle="modal">full code</a> for that sample.</p>
      <!-- Modal -->
<div id="full2" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3>Bounded Box</h3>
  </div>
  <div class="modal-body">
     <pre class="prettyprint linenums:1">
BoxBounds = function(io){

  io.addObj(new iio.Rect(io.canvas.center,50)
      .setFillStyle('#00baff')
      .enableKinematics()
      .setVel(5,0)
      .setBound('left', 0
        ,function(obj){
          obj.vel.x = 5;
          return true;
         })
      .setBound('right', io.canvas.width
        ,function(obj){
          obj.vel.x = -5;
          return true;
        }));

  //set the framerate to 60fps
  io.setFramerate(60);

}; iio.start(BoxBounds,'canvasId');</pre>
</div>
  <div class="modal-footer">
  </div>
</div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="groups">&nbsp;</a> 
        <h2>Object Groups</h2>
        <p>If you have multiple different types of objects in your application and you need to control their z-indexing (draw order) or collisions, you can use the group structure that your <a href="AppManager.php">AppManager</a> controls.</p>
        <p>A group has a tag, a z-index value, and the array of objects that you've added to it.</p>
        <p>You can create a group with the <a href="AppManager.php#addGroup">addGroup</a> function.</p>
        <pre class="prettyprint linenums:1">
//create a group called 'background layer'
//with a -10 z-index
io.addGroup('background layer', -10);</pre>
  <p>To add an object to this group, use the <a href="AppManager.php#addToGroup">addToGroup</a> function:</p>
<pre class="prettyprint linenums:1">
//add an object to the 'background layer' group
io.addToGroup('background layer', bgObject);</pre>
         <p>Note that you can also perform both the creation and the object addition with the <a href="AppManager.php#addToGroup">addToGroup</a> function:</p>
<pre class="prettyprint linenums:1">
//do both steps in one line
io.addToGroup('background layer', bgObject, -10);</pre>
        <p>The <a href="AppManager.php">AppManager</a> always manages objects through group structures. When you call <a href="AppManager.php#addObj">addObj</a> the first time, a group at z-index 0 with the tag 0 is created and then all objects from then on out that get added with <a href="AppManager.php#addObj">addObj</a> are added to that default group.</p>
        <p>The <a href="iio-debugger.php">iio Debugger</a> provides a console overlay that allows you to visualize your groups and the arrays of objects that they contain.</p> 
      </div>
      <div class="docs-middle">
        <a class="anchor" name="collisions">&nbsp;</a> 
        <h2>Object Collisions</h2>
        <p>The iio Engine has a built in collision detection framework. In order to use it, you'll need to organize your objects into <a href="#groups">groups</a> so that you can use the <a href="AppManager.php#setCollisionCallback">setCollisionCallback</a> function:</p>
            <pre class="prettyprint linenums:1">
io.setCollisionCallback(groupTag1, groupTag2, function(obj1, obj2){
    //Collision callback code...
});</pre> 
  <p>This code will tell your <a href="AppManager.php">AppManager</a> to run the specified callback code whenever any objects from group 1  collide with group 2. If you need to check for collisions between members of the same group, just leave out 'groupTag2'.</p>
  <p>As an example, here is an app with two boxes that collide and reverse their directions.</p>
<canvas id="canvas7" width="645px" height="100px"></canvas>
      <p>Check out the <a href="#code7" role="button" data-toggle="modal">full code</a> for that sample.</p>
      <!-- Modal -->
<div id="code7" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3>Colliding Boxes</h3>
  </div>
  <div class="modal-body">
     <pre class="prettyprint linenums:1">
CollidingBoxes = function(io){
 
  createBox = function(xPos, xVel, fillStyle){
    io.addToGroup('boxes'
      ,new iio.Rect(xPos,io.canvas.center.y,50)
      .setFillStyle(fillStyle)
      .enableKinematics()
      .setVel(xVel,0)
      .setBound('left', 0
        ,function(obj){
          obj.vel.x = 3;
          return true;
         })
      .setBound('right', io.canvas.width
        ,function(obj){
          obj.vel.x = -3;
          return true;
        }));
  }

  createBox(40, 3, '#00baff');
  createBox(io.canvas.width-40, -3, 'red');

  io.setCollisionCallback('boxes'
    ,function(box1,box2){
       var temp = box1.vel;
       box1.vel = box2.vel;
       box2.vel = temp;
     });

  io.setFramerate(60)
 
}; iio.start(CollidingBoxes);</pre>
</div>
  <div class="modal-footer">
  </div>
</div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="input">&nbsp;</a> 
        <h2>Detecting Input</h2>
        <p>To listen for an input event, add an EventListener to your canvas:</p>
<pre class="prettyprint linenums:1">
io.canvas.addEventListener('mousedown', function(event){
    //code called when the mouse is clicked
});</pre>
        <p>You can learn more about EventListeners <a target="_new" href="https://developer.mozilla.org/en-US/docs/DOM/element.addEventListener">here</a>.</p>
        <p>The only events that need to be set up differently are 'keydown' and 'keyup'. The canvas cannot listen for these events, so you need to add a listener to the <span class="kwd">window</span> element:</p>
<pre class="prettyprint linenums:1">
window.addEventListener('keydown', function(event){
    //code called when a keyboard button is pushed
}</pre>
      <p>iio's <a href="iio-functions.php#hasKeyCode">hasKeyCode</a> function makes deciphering key events much easier:</p>
<pre class="prettyprint linenums:1">
window.addEventListener('keydown', function(event){
 
    if (iio.keyCodeIs('up arrow', event))
        alert('up arrow pushed');
 
    if (iio.keyCodeIs('right arrow', event))
        alert('right arrow pushed');
 
    if (iio.keyCodeIs('down arrow', event))
        alert('down arrow pushed');
 
    if (iio.keyCodeIs('left arrow', event))
        alert('left arrow pushed');
});</pre>
      </div>
            <div class="docs-middle">
        <a class="anchor" name="resize">&nbsp;</a> 
        <h2>Handling Resize Events</h2>
        <p>When you start an iio application in full screen mode, the <a href="AppManager.php">AppManager</a> will set an <a href="http://www.w3schools.com/jsref/event_onresize.asp">onresize</a> callback on the window element so that it can auto-update its canvas' size properties.</p>
        <p>To add code to this callback function, declare a <span class="kwd">this.onResize</span> function anywhere in your app.</p>
<pre class="prettyprint linenums:1">
this.onResize = function(event){
    //code run when the window is resized
});</pre>
      <p>The <span class="kwd">event</span> parameter will be an <a target="_new" href="http://www.w3schools.com/js/js_htmldom_events.asp">HTML DOM Event</a> object.</p>
      <p>Apps that are not in full screen mode never have an <span class="kwd">onresize</span> listener assigned, so you'll need to add one to the <span class="kwd">window</span> or <span class="kwd">canvas</span> element yourself:</p>
<pre class="prettyprint linenums:1">
//create a callback for a window resize event
window.addEventListener('resize', function(event){
    //code run when window is resized
},false);

//create a callback for a canvas resize event
io.canvas.addEventListener('resize', function(event){
    //code run when canvas is resized
},false);</pre>
      </div>
        <div class="docs-middle">
        <a class="anchor" name="multiple-canvases">&nbsp;</a> 
        <h2>Working with Multiple Canvases</h2>
        <p>In some situations, great efficiency gains can be made if an application is split up into two overlapping canvas elements. Your <a href="AppManager.php">AppManager</a> allows you to do this with its <a href="AppManager.php#addCanvas">addCanvas</a> function.</p>
        <p>This is useful when you have one layer of objects that needs to be constantly updating and redrawing, and another layer of objects that only rarely needs to be redrawn.</p>
        <p>You can add a new canvas with this code:</p>
<pre class="prettyprint linenums:1">
io.addCanvas();</pre>
        <p>There are other options for using this function, but its default behavior is to create a new canvas behind all the other canvases that your current app holds.</p>
        <p>Your first canvas - which is referred to as the 'base' canvas in iio - can still be accessed with <span class="kwd">io.canvas</span>. All your other canvases can be accessed through the <span class="kwd">io.cnvs</span> array.</p>
        <p>The first element in this array is the base canvas, the others are new canvas elements that you add, indexed in the order that you created them.</p>
<pre class="prettyprint linenums:1">
io.canvas;
//is equivalent to
io.cnvs[0];

//if we add a canvas
io.addCanvas();
//we can access it like this:
io.cnvs[1];

//if we add another
io.addCanvas();
//we would access it like this:
io.cnvs[2];</pre>      

        <p>All of the <a href="AppManager.php">AppManager</a> functions you are used to calling can be called on one canvas in particular (the default behavior is to act on the base canvas):</p>
          <pre class="prettyprint linenums:1">
//add a 60fps framerate and callback to our
//second canvas element
io.setFramerate(60, updateFunction, 1);

//redraw our second canvas element
io.draw(1);

//add an object to our second canvas
//0 is the z-index
io.addObj(myObj, 0, 1);</pre>    
      </div>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine-1.2.2.js"></script>
      <script>
DrawSquareApp = function(io){
  io.addObj((new iio.Rect(io.canvas.center,60))
    .setFillStyle('blue'));
}; iio.start(DrawSquareApp, 'canvas1');
ShadowSquareApp = function(io){
  io.setBGColor('white')
    .setFramerate(40, (new iio.Rect(io.canvas.center.x,io.canvas.center.y-5,60))
      .setFillStyle('#00baff')
      .setStrokeStyle('black')
      .setShadow('rgb(150,150,150)',10,10,4)
      .enableKinematics()
      .setTorque(.15));
}; iio.start(ShadowSquareApp, 'canvas2');
MultiSquare = function(io){
  for (var x=70; x<600; x+=100)
    io.addObj((new iio.Rect(x,50,60))
      .setStrokeStyle('#00baff',2)
      .enableKinematics()
      .setTorque(.15));
  io.setFramerate(40);
}; iio.start(MultiSquare, 'canvas3');
ImageDemo = function(io){
  initApp = function(){
    io.setFramerate(40,(new iio.Rect(io.canvas.center,80))
      .addImage(img)
      .enableKinematics()
      .setTorque(.15));
  };
  var img = new Image();
  img.src='../demo-apps/space-shooter/img/meteorBig.png';
  img.onload = initApp;
}; iio.start(ImageDemo, 'canvas4');

FlyAnims = function(io){
  var imgPath = '../demo-apps/platformer/img/'
  //get the source images
  var flySrcs = [imgPath+'enemies/fly_normal.png'
                ,imgPath+'enemies/fly_fly.png'];

  initApp=function(){
    for (var i=70; i<600; i+=100)
      io.setAnimFPS(i/50+1,
        (new iio.Rect(i,iio.getRandomInt(30,60)))
          .createWithAnim(imgs));
  };

  var imgs = [];
  imgs[0] = new Image();
  imgs[0].src=imgPath+'enemies/fly_normal.png';
  imgs[1] = new Image();
  imgs[1].src=imgPath+'enemies/fly_fly.png';
  imgs[0].onload = initApp;
}; iio.start(FlyAnims, 'canvas5');

BoxBounds = function(io){

  io.addObj(new iio.Rect(io.canvas.center,50)
    .setFillStyle('#00baff')
          .enableKinematics()
          .setVel(5,0)
          .setBound('left', 0
            ,function(obj){
              obj.vel.x = 5;
              return true;
             })
          .setBound('right', io.canvas.width
            ,function(obj){
              obj.vel.x = -5;
              return true;
            }));
  io.setFramerate(60);
}; iio.start(BoxBounds,'canvas6');

CollidingBoxes = function(io){
 
  createBox = function(xPos, xVel, fillStyle){
    io.addToGroup('boxes', new iio.Rect(xPos,io.canvas.center.y,50)
      .setFillStyle(fillStyle)
      .enableKinematics()
      .setVel(xVel,0)
      .setBound('left', 0
        ,function(obj){
          obj.vel.x = 3;
          return true;
         })
      .setBound('right', io.canvas.width
        ,function(obj){
          obj.vel.x = -3;
          return true;
        }));
  }

  createBox(40, 3, '#00baff');
  createBox(io.canvas.width-40, -3, 'red');

  io.setCollisionCallback('boxes', function(box1,box2){
    var temp = box1.vel;
    box1.vel = box2.vel;
    box2.vel = temp;
  });

  io.setFramerate(60)
 
}; iio.start(CollidingBoxes, 'canvas7');
</script>
<?php
  include('inc/footer.php');
?>
    </section>