<?php 
chdir('../');
	include('inc/redirector.php');
  $homepath = '../';
  $title = 'Scroll Shooter Tutorial';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
<section class="container tuts tutorial-container top">
  <div id='ad-right'>
  <script type="text/javascript"><!--
  if (document.body.clientWidth > 1000){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_tuts-ss_skyscraper */
google_ad_slot = "3146898335";
google_ad_width = 120;
google_ad_height = 600;
}
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
  <div class="span3 page-anchors">
  <ul class="nav nav-list affix">
    <li>
      <a href="#overview">
        <i class="icon-chevron-right"></i>
        Overview
      </a>
    </li>
    <li>
      <a href="#setting-up">
        <i class="icon-chevron-right"></i>
        Setting Up
      </a>
    </li>
    <li>
      <a href="#scrolling-background">
        <i class="icon-chevron-right"></i>
        Scrolling Background
      </a>
    </li>
    <li>
      <a href="#player-ship">
        <i class="icon-chevron-right"></i>
        The Player's Ship
      </a>
    </li>
    <li>
      <a href="#laser-guns">
        <i class="icon-chevron-right"></i>
        Adding Laser Guns
      </a>
    </li>
    <li>
      <a href="#meteors">
        <i class="icon-chevron-right"></i>
        Adding Meteors
      </a>
    </li>
    <li>
      <a href="#collision-detection">
        <i class="icon-chevron-right"></i>
        Collision Detection
      </a>
    </li>
    <li>
      <a href="#health">
        <i class="icon-chevron-right"></i>
        Giving Objects Health
      </a>
    </li>
    <li>
      <a href="#completed-app">
        <i class="icon-chevron-right"></i>
        The Completed App
      </a>
    </li>
  </ul>
</div>
  <a class="anchor top-anchor" name="overview">&nbsp;</a> 
  <h1>Vertical Scroll Shooter</h1>
  <hr class="featurette-divider">
  <p>This tutorial will walk you through the development of an HTML5 Canvas based scroll shooter game.</p>
  <p>Instead of deploying to a pre-existing canvas (like we did with <a href="tic-tac-toe.php">Tic Tac Toe</a>), we will be using iio's full screen app features to create and manage a canvas for us.</p>
  <p>This tutorial assumes that you have a basic understanding of the iio Framework. If you need some basic info on how iio works, go through the <a href="tic-tac-toe.php">Tic Tac Toe</a> Tutorial or read over the <a href="../docs/iio-basics.php">iio App Basics</a> document.</p>
  <p>To follow this tutorial, you'll need the latest iio Engine and iio Debugger JS files, the Space Shooter image files, a text editor, and a web browser.</p>
  <br/>
  <p>Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine.min']);" href="../js/iioEngine.min.js">iioEngine.min.js</a></p>
  <p>Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioDebugger']);" href="../js/iioDebugger.js">iioDebugger.js</a></p>
  <p>Link to: <a target="_new" href="http://opengameart.org/content/space-shooter-art">Space Shooter Images</a></p>

  <a class="anchor inner-anchor" name="setting-up">&nbsp;</a> 
  <h2>Prepping the Application Environment</h2>
  <p>Even though we will not be defining a canvas element to run our game, we still need to have an HTML page to house our content.</p>
  <p>Any page will work, but here is the simplest implementation:</p>
<pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="iioEngine.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="iioDebugger.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="SpaceShooter.io.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"&gt; iio.start(SpaceShooter) &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
  <p>There is no content other than scripts because the scripts will create all of our content.</p>
  <p>When <a href="../docs/iio-functions.php#start">iio.start</a> is called with only the main application function as a parameter, it automatically creates a full screen, auto-resizing canvas.</p>
  <p>The order of this code is important - each script depends on the ones above it.</p>
  <p>You should have the first two scripts, the third we are going to create. This new script will contain the <span class="red">SpaceShooter</span> application.</p>
  <p>Create the new JavaScript file called <span class="kwd">SpaceShooter.io.js</span> and define the main application function:</p>
  <pre class="prettyprint linenums:1">
SpaceShooter = function(io){

};</pre>
<p>All of our application code will be contained within this function. Put code samples into this function from now on.</p>

<a class="anchor inner-anchor" name="scrolling-background">&nbsp;</a> 
  <h2>Making a Scrolling Background</h2>
  <p>We're going to start with the background because it will be the easiest way to introduce concepts and the fastest way to get stuff moving on the screen.</p>
  <p>Though certainly possible, we are not going to be allowing the player to actually fly through a big meteor field map in this tutorial. Instead, we are going to create the illusion that the player is moving by making objects fly past them.</p>
  <p>Let's start with the color. To make the nebula images blend nicely, we need to give the background a color of <span class="kwd">#5e3f6b</span>, which is a hexadecimal name for a purple color. To set this background color, use the following code:</p>
<pre class="prettyprint linenums:1">
io.setBGColor('#5e3f6b');</pre>
  <p>This line sets the css background color property of our canvas to the given color value.</p>
  <p>Now let's create some stars. Make sure you have the Space Shooter 'png' folder in the same directory as your html page, then use this code to load the big star image:</p>
<pre class="prettyprint linenums:1">
var bigStarImg = new Image();
bigStarImg.src = 'png/Background/starBig.png';</pre>
  <p>After loading the image, we need to attach it to an <a href="../docs/Shape.php">Shape</a> object so that we can add it to our game world and render it.</p>
  <p>The best shape choice will be a <a href="../docs/SimpleRect.php">SimpleRect</a>, since the image is a rectangle. If we want our rectangle to be the same size as the image, we can create it with our star image:</p>
   <pre class="prettyprint linenums:1">
var bigStar = new iio.SimpleRect().createWithImage(bigStarImg);</pre>
  <p>This code will create a new rectangle with the same dimensions as our image, then attach the image to it.</p>
  <p>We need to be careful though, because we don't want this code to run before our image has finished loading. Put this code right after the line where you define the images <span class="kwd">src</span> property:</p>
   <pre class="prettyprint linenums:1">
bigStarImg.onload = function(){    
  var bigStar = new iio.SimpleRect(io.canvas.center)
                           .createWithImage(bigStarImg);
  io.addObj(bigStar);
}</pre>
  <p>If you open or refresh your HTML page, you should now see a big star right in the middle of the window.</p>
<canvas id="canvas1" style="background:white; margin-top:30px" width="450px" height="450px"></canvas>
  <p class="caption">What you should see</p>
  <p>Now let's make the star move. This is easily done if we use <a href="../docs/iio-basics.php#kinematics">iio Kinematics</a> and our AppManager's <a href="../docs/AppManager.php#setFramerate">setFramerate</a> function:</p>
   <pre class="prettyprint linenums:1">
bigStarImg.onload = function(){    
  var bigStar = new iio.SimpleRect(io.canvas.center.x, 0)
                           .createWithImage(bigStarImg)
                           .enableKinematics()
                           .setVel(0,2);
  io.addObj(bigStar);
  io.setFramerate(60);
}</pre>
  <p>This code makes the star journey from the top of the canvas to the bottom of the canvas at 60FPS.</p>
  <p>It doesn't stop when it moves off screen though, and will keep traveling on toward infinity while gradually slowing down all our other processing. To solve this we are going to use the <a href="../docs/iio-basics.php#bounds">bounds</a> property that iio Kinematics gives us to automatically remove the object when it passes the bottom of the canvas:</p>
   <pre class="prettyprint linenums:1">
bigStarImg.onload = function(){    
  var bigStar = new iio.SimpleRect(io.canvas.center.x, 0)
                           .createWithImage(bigStarImg)
                           .enableKinematics()
                           .setVel(0,2)
                           .setBound('bottom',io.canvas.height+80);
  io.addObj(bigStar);
  io.setFramerate(60);
}</pre>
<p>The default behavior for a bounded object is to remove itself when it reaches the bound. We can overide this behavior and set our own though if we wanted to:</p>
   <pre class="prettyprint linenums:1">
bigStar.setBound('bottom',io.canvas.height,
    function(bigStar){
      alert('bigStar has reached the bottom of the canvas');
      return true; //keep the object
      //or
      return false; //remove the object
    });</pre>
<p>In fact, setting our own callback sounds like a better plan. That way, we could move the star back up to the top of the canvas when it reaches the bottom, thereby recycling our background objects instead of constantly creating and destroying them.</p>
<p>Here's a minimalist implementation of the app so far:</p>
   <pre class="prettyprint linenums:1">
SpaceShooter = function(io){

  io.setBGColor('#5e3f6b');

  var bigStarImg = new Image();
  bigStarImg.src = 'png/Background/starBig.png';
  bigStarImg.onload = function(){    

    io.addObj(new iio.SimpleRect(io.canvas.center.x, 0)
                      .createWithImage(bigStarImg)
                      .enableKinematics()
                      .setVel(0,2)
                      .setBound('bottom'
                                ,io.canvas.height+140
                                ,function(bigStar){
                                   bigStar.pos.y = 0;
                                   return true;
                                 }));
    io.setFramerate(60);
  }
};</pre>
<p class="caption">If the code structure confuses you, check out <a href="#simpleStarWrap" role="button" data-toggle="modal">this version</a></p>
  <!-- Modal -->
<div id="simpleStarWrap" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">Non-Cascading Code</h3>
  </div>
  <div class="modal-body">
     <pre class="prettyprint linenums:1">
SpaceShooter = function(io){

  io.setBGColor('#5e3f6b');

  var bigStarImg = new Image();
  bigStarImg.src = 'png/Background/starBig.png';
  bigStarImg.onload = function(){    

    moveToTop = function(bigStar){
      bigStar.pos.y = 0;
      return true;
    };

    var bigStar = new iio.SimpleRect(io.canvas.center.x);
    bigStar.createWithImage(bigStarImg);
    bigStar.enableKinematics();
    bigStar.setVel(0,8);
    bigStar.setBound('bottom'
                     ,io.canvas.height+140
                     ,moveToTop);

    io.addObj(bigStar);
    io.setFramerate(60);
  }
};</pre>
</div>
  <div class="modal-footer">
  </div>
</div>
<canvas id="canvas2" style="background:white; margin-top:30px" width="450px" height="450px"></canvas>
  <p class="caption">A screen wrapping star</p>

  <p>Now that we have the basic functionality down, let's think about how to scale this up.</p>
  <p>We are going to use three different images for our background scene, 'starBig', 'starSmall', and 'nebula'. To create the illusion that the nebulas are close and the stars far away, we are going to make each type of background object move at a different speed (a technique called parallax scrolling).</p> 
  <p>Since we are dealing with groups of objects, we should utilize the <a href="../docs/iio-basics.php#groups"></a>group structure that our <a href="../docs/AppManager.php">AppManager</a> already controls.</p>
  <p>Putting objects into groups allows you to control z-indexing (the draw order of objects) and perform actions on entire sets of objects at time.</p>
  <p>A default group at z-index 0 is created the first time you call <span class="kwd">io.addObj</span>. Lets replace this group with one we define.</p>
  <p>Remove the <span class="kwd">io.addObj</span> line in your code, and replace it with this:</p>
     <pre class="prettyprint linenums:1">
io.addGroup('big stars', -10);
io.addToGroup('big stars', bigStar);

//or...

//do both steps in one line
io.addToGroup('big stars', bigStar, -10);</pre>
  <p>This code asks the <a href="../docs/AppManager.php">AppManager</a> to create a new group called 'big stars' at z-index -10, and then adds our new star object to it.</p>
  <p>The <a href="../docs/iio-Debugger.php">iio Debugger</a> provides a very useful debugging tool for applications that use groups. Let's turn it on to see how it works. Put this code at the top of your application function:</p>
       <pre class="prettyprint linenums:1">
io.activateDebugger();</pre>
  <p>When you refresh your HTML page, you will now see that a 'Debug Console' has popped up in the top left corner of the window. This console shows you how your framerate is holding up and also lists all of the canvas elements and object groups that your application contains.</p>
  <p>The debug console makes it really easy to monitor your objects and groups, so I like to use it whenever I have a project that requires a lot of object management.</p>
  <p>The last thing you need to learn for this section is how to get random numbers, as we want to have a bit of randomness in our background image placement.</p>
  <p>iio provides us with two handy <a href="">getRandom</a> functions for just this purpose:
   <pre class="prettyprint linenums:1">
//get a random number between 0 and 1
var randomNumber = iio.getRandomNum();

//get a random number between 0 and 10
var randomNumber = iio.getRandomNum(0,10);

//get a random integer between -10 and 10
var randomNumber = iio.getRandomInt(-10,10);</pre>
  <p>Now that you know about the random functions, you should know everything that you need to to finish up this scrolling background scene. Try designing the rest of it yourself - there are many, many different solutions, and the best way to learn is to come up with one yourself.</p>
  <canvas id="canvas3" style="background:white; margin-top:30px" width="450px" height="450px"></canvas>
  <p class="caption">The completed scrolling background scene</p>
  <p>When your finished with your version, check out my implementation:</p>
     <pre class="prettyprint linenums:1">
function SpaceShooter(io){

  io.activateDebugger();
  io.setBGColor('#5e3f6b');

  //function to move elements to the top 
  //of the canvas when they reach the bottom
  moveToTop = function(obj){
    obj.setPos(iio.getRandomInt(10, io.canvas.width-10)
              ,iio.getRandomInt(-340, -100));
    return true;
  }

  var bgSpeed = 6;
  var bgDensity = io.canvas.width/20;
  var bgImgs = []; //load images into an array

  for (var i=0; i&lt;3; i++)
      bgImgs[i] = new Image();

  bgImgs[0].src = 'png/Background/starSmall.png';
  bgImgs[1].src = 'png/Background/starBig.png';
  bgImgs[2].src = 'png/Background/nebula.png';

  for (var i=0; i&lt;bgImgs.length; i++)
    bgImgs[i].onload = function(){
        var tag,zIndex,vel;
        switch(this[0]){
            case 0: tag = 'small stars'; 
                    zIndex = -20; 
                    vel = bgSpeed; 
                    break;
            case 1: tag = 'big stars'; 
                    zIndex = -15; 
                    vel = bgSpeed+.2; 
                    break;
            case 2: tag = 'nebula'; 
                    zIndex = -5; 
                    vel = bgSpeed+4;
                    break;
        }
        for (var j=0; j&lt;bgDensity; j++)
            if (iio.getRandomNum() &lt; .4){
                io.addToGroup(tag
                   ,new iio.SimpleRect(iio.getRandomInt(10, io.canvas.width-10)
                                ,iio.getRandomInt(0, io.canvas.height))
                                ,zIndex)

                   .createWithImage(bgImgs[this[0]])
                   .enableKinematics()
                   .setVel(0,vel)
                   .setBound('bottom'
                            ,io.canvas.height+140
                            ,moveToTop);
            }
    }.bind([i])
    //when you bind an array, access the elements with this[index]

  io.setFramerate(60);
}</pre>

<a class="anchor inner-anchor" name="player-ship">&nbsp;</a> 
  <h2>Giving the Player a Space Ship</h2>
<p>There are really only two differences between the space ship and the background objects: the ship's image does not remain static (it switches to a banking image when you move side to side), and the ship's movement needs to be controlled by the player instead of by a constant force.</p>
<p>We can create an object with multiple image options by using iio's <a href="../docs/iio-basics.php#anim-attachment">animation</a> structure. The same loading structure that we used for singular images would work for animations too, but since we are only going to instantiate one player ship, it is even easier to just let iio load the images for us:</p>
     <pre class="prettyprint linenums:1">//Create an array with the player images
var playerSrcs = ['png/playerLeft.png',
                  'png/player.png',
                  'png/playerRight.png'];

//create the ship at the bottom of the screen
var player = new iio.SimpleRect(io.canvas.center.x, io.canvas.height-100)
                         .createWithAnim(playerSrcs
                         ,function(){
                            io.addToGroup('player', player);
                          },1); //the last parameter allows us to specify
                                //which src image to start with
                                //0 is default</pre>
<p>I want to show you another way to do this though. When we created the first star object earlier in the tutorial, we had to be sure that we didn't add the object before its image had loaded because adding the object triggered its rendering, and it only got rendered once.</p>
<p>Now that we set a framerate on our canvas, the object is getting cleared and redrawn 60 times a second, so the previous logic doesn't apply. We can therefore safely add the object before the image loads:</p>
     <pre class="prettyprint linenums:1">
//create the ship at the bottom of the screen
var player = new iio.SimpleRect(io.canvas.center.x,io.canvas.height-100)
                    .createWithAnim(playerSrcs, 1);
io.addToGroup('player',player,1);</pre>
<p>The player object doesn't have a size or any drawing properties until its first animation image has loaded, so we can give it to our <a href="../docs/AppManager.php">AppManager</a> at any time, and it will draw itself when its images are ready.</p>
<p>Now we need to detect input so that the player can move their ship. For most input detection, we attach an event listener to our canvas element. Keyboard input is different - the canvas won't pick up 'keydown' or 'keyup' so we have to attach the listener to the <span class="kwd">window</span> element:</p>
<pre class="prettyprint linenums:1">
window.addEventListener('keydown', function(event){
    alert('keydown');
});</pre>
<p>If you put that code anywhere in your main <span class="red">SpaceShooter</span> function, you'll see an alert popup every time you push a keyboard button.</p>
<p>We're not interested in all the buttons though, for now, just the arrow keys. The <span class="kwd">event</span> parameter has a list of keycodes indexed to keyboard buttons. If a key is down, the 'keydown' event will contain its keycode.</p>
<p>iio provides us with an easy way to sort through these keycodes to find what we're looking for:</p>
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
<p>To get the ship moving, one thing we could do is to replace all of those alert statements with code to change the ship's velocity. You can go pretty far with this method, but I can tell you right now that we will run into issues with boundary detection and input handling later on if we choose to do it.</p>
<p>A more robust way to deal with input for apps that run at a constant framerate is to create an array of input switches, update them whenever an input event occurs, and then process them in the main update loop.</p>
<p>Adding code to the main update loop is easy - just give your AppManager a callback when you set the framerate:</p>
<pre class="prettyprint linenums:1">
io.setFramerate(60, function(){
    //code will run 60x a second
});</pre>
<p>Now that we know that, let's start implementing our input handling system by creating an array of input switches and some constants to make it easier to index the different keys:</p>
<pre class="prettyprint linenums:1">
var LEFT = 0;
var RIGHT = 1;
var UP = 2;
var DOWN = 3;
var input = [];</pre>
<p>The input array will have a slot for each of our directions. If the key is down, the value of its switch will be <span class="kwd">true</span>, otherwise, it will be <span class="kwd">false</span> or <span class="kwd">'undefined'</span>.</p>
<p>We will need to update the values of our input array on each 'keydown' and 'keyup' event. Since the only difference between the two event codes is the value we set to the input switches, we can simplify our code by making a new function:</p>
<pre class="prettyprint linenums:1">
updateInput = function(event, boolValue){

    if (iio.keyCodeIs('left arrow', event))
        input[LEFT] = boolValue;

    if (iio.keyCodeIs('right arrow', event))
        input[RIGHT] = boolValue;

    if (iio.keyCodeIs('up arrow', event))
        input[UP] = boolValue;

    if (iio.keyCodeIs('down arrow', event))
        input[DOWN] = boolValue;
}</pre>
<p>We'll then call this function on each keyboard input event:</p>
<pre class="prettyprint linenums:1">
window.addEventListener('keydown', function(event){
    updateInput(event, true);
});

window.addEventListener('keyup', function(event){
    updateInput(event, false);
});</pre>
<p>Now that we're keeping track of player input, we'll create a new function called <span class="kwd">updatePlayer</span>, and use it input array to control our player ship's movement and images. We could use kinematics to control the ship, but all <a href="../docs/SimpleRect.php#setVel">setVel</a> does is tell the AppManager to translate the object by the velocity vector on each update.</p>
<p>Since we are already going to be taking control of the ship's update loop, let's just skip using kinematics and translate the ship ourselves. Not using kinematics will reduce the amount of data and functions the ship carries (effectively making our code run a bit faster).</p>
<pre class="prettyprint linenums:1">
var playerSpeed = 8;

updatePlayer = function(){

    //update position
    if (input[LEFT] &amp;&amp; !input[RIGHT])
        player.translate(-playerSpeed,0); 

    if (input[RIGHT] &amp;&amp; !input[LEFT])
        player.translate(playerSpeed,0); 

    if (input[UP] &amp;&amp; !input[DOWN])
        player.translate(0,-playerSpeed+1); 

    if (input[DOWN] &amp;&amp; !input[UP])
        player.translate(0,playerSpeed-1);


    //update ship image
    if (input[LEFT] &amp;&amp; !input[RIGHT])
        player.setAnimFrame(0);

    else if (input[RIGHT] &amp;&amp; !input[LEFT])
        player.setAnimFrame(2);

    else player.setAnimFrame(1);
}

io.setFramerate(60, function(){
    updatePlayer();
});
</pre>
<p>The last thing we need to do is to make sure the player doesn't move off screen. We could use iio's <a href="../docs/iio-basics.php#bounds">bounds</a> functions to accomplish this, but again, since we already control the ship's update loop, we should just implement this ourselves.</p>
<p>In fact, we should put the bounds checks right before the translation code.</p>
<pre class="prettyprint linenums:1">
updatePlayer = function(){

    if (input[LEFT] &amp;&amp; !input[RIGHT]
        &amp;&amp; player.pos.x - player.width/2 &gt; 0)
            player.translate(-playerSpeed,0); 

    if (input[RIGHT] &amp;&amp; !input[LEFT]
        &amp;&amp; player.pos.x + player.width/2 &lt; io.canvas.width)
            player.translate(playerSpeed,0); 

    if (input[UP] &amp;&amp; !input[DOWN]
        &amp;&amp; player.pos.y - player.height/2 &gt; 0)
            player.translate(0,-playerSpeed+1); 

    if (input[DOWN] &amp;&amp; !input[UP]
        &amp;&amp; player.pos.y + player.height/2 &lt; io.canvas.height)
            player.translate(0,playerSpeed-1);

    //image code....
}</pre>
<p>A ship's origin is at its center, so we need to add half its width and height to its <span class="kwd">pos</span> whenever we check bounds and collisions.</p>
<canvas id="canvas4" style="background-image:url('../img/scroll-shooter-cnv.png'); margin-top:30px" width="450px" height="450px"></canvas>
  <p class="caption">See the full <a href="#full2" role="button" data-toggle="modal">application code</a> so far</p>
  <!-- Modal -->
<div id="full2" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3>App with a Player Ship</h3>
  </div>
  <div class="modal-body">
     <pre class="prettyprint linenums:1">
function SpaceShooter(io){

  //define input constants
  var LEFT = 0;
  var RIGHT = 1;
  var UP = 2;
  var DOWN = 3;
  var input = [];

  //activate debugger if you want
  //io.activateDebugger();

  //Create the Background Scene
  //  I wrap everything in this funny looking
  //  function syntax so that I can collapse
  //  it in my code editor while I'm working
  //  helps organize things...
  (function(){

    io.setBGColor('#5e3f6b');
    var bgSpeed = 6;
    var bgDensity = io.canvas.width/20;
    var bgImgs = [];

    for (var i=0; i&lt;3; i++)
      bgImgs[i] = new Image();

    bgImgs[0].src = 'png/Background/starSmall.png';
    bgImgs[1].src = 'png/Background/starBig.png';
    bgImgs[2].src = 'png/Background/nebula.png';

    moveToTop = function(obj){
      obj.setPos(iio.getRandomInt(10,io.canvas.width-10)
                    ,iio.getRandomInt(-340, -100));
      return true;
    }

    for (var i=0; i&lt;bgImgs.length; i++)
      bgImgs[i].onload = function(){
        var tag,zIndex,vel;
        switch(this[0]){
            case 0: tag = 'small stars'; 
                    zIndex = -20; 
                    vel = bgSpeed; 
                    break;
            case 1: tag = 'big stars'; 
                    zIndex = -15; 
                    vel = bgSpeed+.2; 
                    break;
            case 2: tag = 'nebula'; 
                    zIndex = -5; 
                    vel = bgSpeed+4; 
                    break;
        }
        for (var j=0; j&lt;bgDensity; j++)
            if (iio.getRandomNum() &lt; .4)
                io.addToGroup(tag
                   ,new iio.SimpleRect(iio.getRandomInt(10, 
                                  io.canvas.width-10)
                                ,iio.getRandomInt(0, 
                                  io.canvas.height))
                   ,zIndex)
                     .createWithImage(bgImgs[this[0]])
                     .enableKinematics()
                     .setVel(0,vel)
                     .setBound('bottom'
                              ,io.canvas.height+140
                              ,moveToTop);
    }.bind([i])
    //when you bind an array, access the 
    //elements with this[index]
  })();

  //Player ship
  (function(){
    var srcs = ['png/playerLeft.png',
                'png/player.png',
                'png/playerRight.png'];

    player = io.addToGroup('player'
               ,new iio.SimpleRect(io.canvas.center.x
                            ,io.canvas.height-100)
               .createWithAnim(srcs,1));

    var playerSpeed=8;

    //Checks for arrow keys and AWSD
    updateInput = function(event, boolValue){

        if (iio.keyCodeIs('left arrow', event) 
         || iio.keyCodeIs('a', event))
            input[LEFT] = boolValue;

        if (iio.keyCodeIs('right arrow', event) 
          || iio.keyCodeIs('d', event))
            input[RIGHT] = boolValue;

        if (iio.keyCodeIs('up arrow', event) 
          || iio.keyCodeIs('w', event))
            input[UP] = boolValue;

        if (iio.keyCodeIs('down arrow', event) 
          || iio.keyCodeIs('s', event))
            input[DOWN] = boolValue;
    }

    updatePlayer = function(){

        //update position
        if (input[LEFT] &amp;&amp; !input[RIGHT]
            &amp;&amp; player.pos.x-player.width/2&gt;0)
              player.translate(-playerSpeed,0); 
        if (input[RIGHT] &amp;&amp; !input[LEFT]
            &amp;&amp; player.pos.x+player.width/2 
            &lt; io.canvas.width)
              player.translate(playerSpeed,0); 
        if (input[UP] &amp;&amp; !input[DOWN]
            &amp;&amp; player.pos.y-player.height/2&gt;0)
              player.translate(0,-playerSpeed+1); 
        if (input[DOWN] &amp;&amp; !input[UP]
            &amp;&amp; player.pos.y+player.height/2 
            &lt; io.canvas.height)
              player.translate(0,playerSpeed-1);

        //update ship image
        if (input[LEFT] &amp;&amp; !input[RIGHT])
            player.setAnimFrame(0);
        else if (input[RIGHT] &amp;&amp; !input[LEFT])
            player.setAnimFrame(2);
        else player.setAnimFrame(1);

    }

    window.addEventListener('keydown',function(event){
        updateInput(event, true);
    });

    window.addEventListener('keyup',function(event){
        updateInput(event, false);
    });
  })();

  io.setFramerate(60, function(){
      updatePlayer(); 
  });
}</pre>
</div>
  <div class="modal-footer">
  </div>
</div>

<a class="anchor inner-anchor" name="laser-guns">&nbsp;</a> 
  <h2>Creating the Laser Cannons</h2>
<p>Flying that ship around is pretty fun, but I'm dissatisfied with its lack of laser cannons right now. Fixing that is easy, because the laser objects behave just like our background images.</p>
<p>We need to add another input switch though, so that the player has a 'fire lasers' button. Lets make it the space bar. Add another input constant to your collection:</p>
     <pre class="prettyprint linenums:1">
var SPACE = 4;</pre>
<p>Then add this to the end of your <span class="kwd">updateInput</span> function:</p>
<pre class="prettyprint linenums:1">
if (iio.keyCodeIs('space', event))
    input[SPACE] = boolValue;</pre>
<p>Now we need a function to create a laser beam. The procedure is very similar to our background images:</p>
<pre class="prettyprint linenums:1">
//Define the image
var laserImg = new Image();
laserImg.src = 'png/laserRed.png';

//Create a laser at the given coordinates
fireLaser = function(x,y){
    io.addToGroup('lasers', new iio.SimpleRect(x,y),-1)
        .createWithImage(laserImg)
        .enableKinematics()
        .setBound('top',-40)
        .setVel(0,-16);
}</pre>
<p>We could now wire this function to the space bar in our <span class="kwd">updatePlayer</span>, but we should think ahead a little bit - do we really want the cannons firing 60 times a second? Probably not right, so we'll need to implement a laser cannon cool down timer.</p>
<p>Right above <span class="kwd">updatePlayer</span>, define these two variables:</p>
<pre class="prettyprint linenums:1">
var laserCooldown = 20;
var laserTimer = 0;</pre>
<p>Then inside <span class="kwd">updatePlayer</span>, put this code:</p>
<pre class="prettyprint linenums:1">
//update laser cannons
if (input[SPACE] &amp;&amp; laserTimer &lt; 0){
    fireLaser(player.left()+10, player.pos.y);
    fireLaser(player.right()-8, player.pos.y);
    laserTimer = laserCooldown;
} 
else laserTimer-=3;</pre>
<p>This code will restrict your player's rate of fire. You can easily give them bonus powers at any point by decreasing the cool down constant or by adding more calls to the <span class="kwd">fireLaser</span> function.</p>
<p>I'd like to add one quick improvement. As we know from any classic arcade game, repetitively pushing the fire button is a lot more fun than just holding it down.</p>
<p>If we make the laser cool down last longer when the space bar is pushed down, we can incentivize the player to rapidly tap it, because they will see that their guns fire faster when they do. One line of code is all we need to accomplish this - change your laser cannon update code to this:</p>
<pre class="prettyprint linenums:1">
//update laser cannons
if (input[SPACE] &amp;&amp; laserTimer &lt; 0){
    fireLaser(player.left()+10, player.pos.y);
    fireLaser(player.right()-8, player.pos.y);
    laserTimer = laserCooldown;
} 
if (input[SPACE]) laserTimer--;
else laserTimer-=3;</pre>
<canvas id="canvas5" style="background-image:url('../img/scroll-shooter-cnv.png'); margin-top:30px" width="450px" height="450px"></canvas>
  <p class="caption">See the full <a href="#full3" role="button" data-toggle="modal">application code</a></p>
<div id="full3" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3>Laser Cannons Online</h3>
  </div>
  <div class="modal-body">
     <pre class="prettyprint linenums:1">
function SpaceShooter(io){

  //define input constants
  var LEFT = 0;
  var RIGHT = 1;
  var UP = 2;
  var DOWN = 3;
  var SPACE = 4;
  var input = [];

  //activate debugger if you want
  //io.activateDebugger();

  //Create the Background Scene
  //  I wrap everything in this funny looking
  //  function syntax so that I can collapse
  //  it in my code editor while I'm working
  //  helps organize things...
  (function(){

    io.setBGColor('#5e3f6b');
    var bgSpeed = 6;
    var bgDensity = io.canvas.width/20;
    var bgImgs = [];

    for (var i=0; i&lt;3; i++)
      bgImgs[i] = new Image();

    bgImgs[0].src = 'png/Background/starSmall.png';
    bgImgs[1].src = 'png/Background/starBig.png';
    bgImgs[2].src = 'png/Background/nebula.png';

    moveToTop = function(obj){
      obj.setPos(iio.getRandomInt(10,io.canvas.width-10)
                    ,iio.getRandomInt(-340, -100));
      return true;
    }

    for (var i=0; i&lt;bgImgs.length; i++)
      bgImgs[i].onload = function(){
        var tag,zIndex,vel;
        switch(this[0]){
            case 0: tag = 'small stars'; 
                    zIndex = -20; 
                    vel = bgSpeed; 
                    break;
            case 1: tag = 'big stars'; 
                    zIndex = -15; 
                    vel = bgSpeed+.2; 
                    break;
            case 2: tag = 'nebula'; 
                    zIndex = -5; 
                    vel = bgSpeed+4; 
                    break;
        }
        for (var j=0; j&lt;bgDensity; j++)
            if (iio.getRandomNum() &lt; .4)
                io.addToGroup(tag
                   ,new iio.SimpleRect(iio.getRandomInt(10, 
                                  io.canvas.width-10)
                                ,iio.getRandomInt(0, 
                                  io.canvas.height))
                   ,zIndex)
                     .createWithImage(bgImgs[this[0]])
                     .enableKinematics()
                     .setVel(0,vel)
                     .setBound('bottom'
                              ,io.canvas.height+140
                              ,moveToTop);
    }.bind([i])
    //when you bind an array, access the 
    //elements with this[index]
  })();

  //must be defined outside the player structure
  function checkPlayerBounds(){};

  //Player ship
  (function(){
    var srcs = ['png/playerLeft.png',
                'png/player.png',
                'png/playerRight.png'];

    player = io.addToGroup('player'
               ,new iio.SimpleRect(io.canvas.center.x
                            ,io.canvas.height-100)
               .createWithAnim(srcs,1));

    var playerSpeed=8;

    //Checks for arrow keys and AWSD
    updateInput = function(event, boolValue){

        if (iio.keyCodeIs('left arrow', event) 
         || iio.keyCodeIs('a', event))
            input[LEFT] = boolValue;

        if (iio.keyCodeIs('right arrow', event) 
          || iio.keyCodeIs('d', event))
            input[RIGHT] = boolValue;

        if (iio.keyCodeIs('up arrow', event) 
          || iio.keyCodeIs('w', event))
            input[UP] = boolValue;

        if (iio.keyCodeIs('down arrow', event) 
          || iio.keyCodeIs('s', event))
            input[DOWN] = boolValue;

        if (iio.keyCodeIs('space', event))
            input[SPACE] = boolValue;
    }

    var laserCooldown = 20;
    var laserTimer = 0;
    updatePlayer = function(){

        //update position
        if (input[LEFT] &amp;&amp; !input[RIGHT]
            &amp;&amp; player.pos.x-player.width/2&gt;0)
              player.translate(-playerSpeed,0); 
        if (input[RIGHT] &amp;&amp; !input[LEFT]
            &amp;&amp; player.pos.x+player.width/2 
            &lt; io.canvas.width)
              player.translate(playerSpeed,0); 
        if (input[UP] &amp;&amp; !input[DOWN]
            &amp;&amp; player.pos.y-player.height/2&gt;0)
              player.translate(0,-playerSpeed+1); 
        if (input[DOWN] &amp;&amp; !input[UP]
            &amp;&amp; player.pos.y+player.height/2 
            &lt; io.canvas.height)
              player.translate(0,playerSpeed-1);

        //update ship image
        if (input[LEFT] &amp;&amp; !input[RIGHT])
            player.setAnimFrame(0);
        else if (input[RIGHT] &amp;&amp; !input[LEFT])
            player.setAnimFrame(2);
        else player.setAnimFrame(1);

        //update laser cannons
        if (input[SPACE] &amp;&amp; laserTimer &lt; 0){
            fireLaser(player.left()+10, player.pos.y);
            fireLaser(player.right()-8, player.pos.y);
            laserTimer = laserCooldown;
        } 
        if (input[SPACE]) laserTimer--;
        else laserTimer-=3;
    }

    var laserImg = new Image();
    laserImg.src = 'png/laserRed.png'
    fireLaser = function(x,y){
        io.addToGroup('lasers', new iio.SimpleRect(x,y),-1)
            .createWithImage(laserImg)
            .enableKinematics()
            .setBound('top',-40)
            .setVel(0,-16);
    }

    window.addEventListener('keydown',function(event){
        updateInput(event, true);
    });

    window.addEventListener('keyup',function(event){
        updateInput(event, false);
    });
  })();

  io.setFramerate(60, function(){
      updatePlayer(); 
  });
}</pre>
</div>
  <div class="modal-footer">
  </div>
</div>

<a class="anchor inner-anchor" name="meteors">&nbsp;</a> 
  <h2>Adding the Meteor Field</h2>
  <p>Let's create some meteors so that we can destroy them with our new laser cannons.</p>
  <p>We'll need a stream of randomly placed meteors coming in from the top of the screen at all times. We could use the same algorithm that used for the background images, but since we are intending to destroy these objects, we should be constantly creating them instead of recycling old ones.</p>
  <p>Let's start with a creation method for small and large meteors. This code should look somewhat familiar by now:</p>
  <pre class="prettyprint linenums:1">
//Meteors
var bigMeteorImg = new Image();
var smallMeteorImg = new Image();
bigMeteorImg.src = 'png/meteorBig.png';
smallMeteorImg.src = 'png/meteorSmall.png';

//Create a randomized meteor at the specified position
createMeteor = function(small,x,y){
    var img = bigMeteorImg;
    if (small) img = smallMeteorImg
    var meteor = io.addToGroup('meteors'
        ,new iio.SimpleRect(x,y))
            .enableKinematics()
            .setBound('bottom', io.canvas.height+120)
            .createWithImage(img)
            .setVel(iio.getRandomInt(-2,2)
                   ,iio.getRandomInt(10,14))
            .setTorque(iio.getRandomNum(-.1,.1));
}</pre>
<p>I gave the function positional parameters because later on, we will need to create small meteor at the location of a broken down large meteor.</p>
<p>We should call this function in our update loop, so that we have a constant stream of new meteors flowing into the game space. As with the player's lasers, we don't want this function to run on every update frame, so we'll need to create some kind of timer.</p>
<p>You can use the same technique that we used for the player laser timer, but I'd like to use a different, even more random, method for meteor creation:</p>
  <pre class="prettyprint linenums:1">
//define a meteor density proportional to our players
//screen width
var meteorDensity = Math.round(io.canvas.width/150);

//Define a ratio of small to large meteors
//This will make 70% of all meteors small
var smallToBig = .7;

//Our update loop
io.setFramerate(60, function(){
    updatePlayer();

    //Create meteors 2% of the time
    if (iio.getRandomNum() &lt; .02)
        for (var i=0; i&lt;meteorDensity; i++){
            var x = iio.getRandomInt(30,io.canvas.width-30);
            var y = iio.getRandomInt(-800,-50);
            if (iio.getRandomNum() &lt; smallToBig)
                createMeteor(true,x,y);
            else createMeteor(false,x,y);
        }
});</pre>
<p>This addition to our update function will run a meteor creation loop if a randomly generated number from 0 to 1 is less than .02.</p>
<p>You can play around with all of the density, ratio, and probability variables to get different patterns of meteor creation. If you make these variables change over time, you can scale up the difficulty of the game while the player plays it.</p>

<a class="anchor inner-anchor" name="collision-detection">&nbsp;</a> 
  <h2>Collision Detection</h2>
  <p>We now have our meteors, but we still can't blow them up. To get this functionality, we'll need to implement collision detection between the meteors and the player's lasers.</p>
  <p>This is where the iio Engine really shines - instead of checking for collisions yourself, all you need to do is ask your <a href="../docs/AppManager.php#setCollisionCallback">AppManager</a> to run some callback function whenever any objects from specified groups collide:
    <pre class="prettyprint linenums:1">
io.setCollisionCallback('lasers', 'meteors', function(laser, meteor){
    //Collision callback code...
});</pre> 
<p>We have to make sure both of these groups exist when we call this function though, so add these lines right before it:</p>
<pre class="prettyprint linenums:1">
io.addGroup('lasers');
io.addGroup('meteors');</pre> 
  <p>So what do we want to happen when the objects collide? I think three things should happen: we should remove the meteor, remove the player laser, and add a laser flash image that immediately starts shrinking to nothing to give us a nice effect.</p>
<p>Let's first define this laser flash image. Put this code right above your collision callback line:</p>
    <pre class="prettyprint linenums:1">
var laserFlashImg = new Image();
laserFlashImg.src = 'png/laserRedShot.png';</pre> 
  <p>Now put this code inside the collision callback function:</p>
    <pre class="prettyprint linenums:1">
io.addToGroup('laser flashes'
   //create the flash right in between the two objects
   //center positions for the best effect
  ,new iio.SimpleRect((laser.pos.x+meteor.pos.x)/2
               ,(laser.pos.y+meteor.pos.y)/2),10)
      .createWithImage(laserFlashImg)
      .enableKinematics()
      .setVel(meteor.vel.x, meteor.vel.y)
      //shrink will make the object shrink until
      //it is too small to see, then it will
      //automatically remove itself
      .shrink(.1);

//remove the colliding objects
io.rmvFromGroup(laser, 'lasers');
io.rmvFromGroup(meteor, 'meteors');</pre> 
<p>And we're done.</p>
<p>There is quick improvement we could make though. The big meteors shouldn't go down in one hit like the small ones do. In fact, I think that they should split into a bunch of small meteors when they get broken down instead of just disappearing.</p>
<p>This can be easily accomplished by adding a 'health' property to the large meteors.</p>

<a class="anchor inner-anchor" name="health">&nbsp;</a> 
  <h2>Giving Objects New Properties</h2>
  <p>In JavaScript, you can add a new property or function to any object at any time.</p>
  <p>This means that if we want to give our meteors a 'health' property, all we have to do is add this to the bottom of our <span class="kwd">createMeteor</span> function:</p>
<pre class="prettyprint linenums:1">
 if (!small) meteor.health = 5;</pre> 
 <p>Now that our large meteors have a health property, we'll need to check for it and perform a different behavior in our collision detection function:</p>
     <pre class="prettyprint linenums:1">
//Replace this line
io.rmvFromGroup(meteor, 'meteors');

//With this
if (typeof(meteor.health) != 'undefined'){
    meteor.health--;
    if (meteor.health == 0){
        var numFragments = iio.getRandomInt(3,6);
        for (var i=0; i&lt;numFragments; i++)
            createMeteor(true,meteor.pos.x+iio.getRandomInt(-20,20)
                             ,meteor.pos.y+iio.getRandomInt(-20,20));
        io.rmvFromGroup(meteor, 'meteors');
    }
} else io.rmvFromGroup(meteor, 'meteors');</pre> 
<p>This code checks if the meteor is large or small by looking to see if the 'health' property is defined. If so, then it decreases the value whenever the meteor is hit, and replaces the big meteor with a random number of small meteors when its health reaches 0.</p>
<p>You could now use these techniques to give the player ship some health and create a new collision callback to deal with meteor-ship collisions:</p>
<pre class="prettyprint linenums:1">
io.setCollisionCallback('meteors', 'player', function(meteor, player){
    //Collision callback code...
});</pre> 
<p>This is where I leave it up to you though. The purpose of this tutorial was to introduce you to iio Programming and show you some techniques to accomplish common tasks.</p>
<p>You can feel free to continue making this game if you want - all of the code and graphics used in this tutorial are open source and freely available to use for commercial projects.</p>
<p>The creator of these graphics, 'Kenney.nl', has even released some expansion packs:</p>
<p>Link to: <a target="_new" href="http://opengameart.org/content/space-ship-guns-engines-art">Space Ship Guns &amp; Engines</a></p>
<p>Link to: <a target="_new" href="http://opengameart.org/content/space-ship-parts-art">Space Ship Parts</a></p>


<a class="anchor inner-anchor" name="completed-app">&nbsp;</a> 
  <h2 style="text-align:center">The Completed Scroll Shooter App</h2>
  <canvas id="canvas6" style="background-image:url('../img/scroll-shooter-cnv.png'); margin-top:30px" width="450px" height="450px"></canvas>
  <p class="caption">The completed app</p>
  <pre class="prettyprint linenums:1">
function SpaceShooter(io){

  //Turn on the debugger if you want
  //io.activateDebugger();

  //Create the Background Scene
  //  I wrap everything in this funny looking
  //  function syntax so that I can collapse
  //  it in my code editor while I'm working
  //  helps organize things...
  (function(){

    io.setBGColor('#5e3f6b');
    var bgSpeed = 6; //moves 6px 60 times a second

    //control the number of background images
    var bgDensity = io.canvas.width/20;

    //Load Background images
    var bgImgs = [];

    for (var i=0; i&lt;3; i++)
      bgImgs[i] = new Image();

    bgImgs[0].src = 'png/Background/starSmall.png';
    bgImgs[1].src = 'png/Background/starBig.png';
    bgImgs[2].src = 'png/Background/nebula.png';

    moveToTop = function(obj){
      obj.setPos(iio.getRandomInt(10,io.canvas.width-10)
                ,iio.getRandomInt(-340, -100));
      return true;
    }

    for (var i=0; i&lt;bgImgs.length; i++)
      bgImgs[i].onload = function(){
        var tag,zIndex,vel;
        switch(this[0]){
            case 0: tag = 'small stars'; 
                    zIndex = -20; 
                    vel = bgSpeed; 
                    break;
            case 1: tag = 'big stars'; 
                    zIndex = -15; 
                    vel = bgSpeed+.2; 
                    break;
            case 2: tag = 'nebula'; 
                    zIndex = -5; 
                    vel = bgSpeed+4; 
                    break;
        }
        for (var j=0; j&lt;bgDensity; j++)
            if (iio.getRandomNum() &lt; .4)
                io.addToGroup(tag
                   ,new iio.SimpleRect(iio.getRandomInt(10, io.canvas.width-10)
                                ,iio.getRandomInt(0, io.canvas.height))
                   ,zIndex)
                     .createWithImage(bgImgs[this[0]])
                     .enableKinematics()
                     .setVel(0,vel)
                     .setBound('bottom'
                              ,io.canvas.height+140
                              ,moveToTop);
    }.bind([i])
    //when you bind an array, access the 
    //elements with this[index]
  })();


  //Define our input switches
  var LEFT = 0;
  var RIGHT = 1;
  var UP = 2;
  var DOWN = 3;
  var SPACE = 4;
  var input = [];

  //Player ship
  (function(){
      var srcs = ['png/playerLeft.png',
                  'png/player.png',
                  'png/playerRight.png'];

      player = io.addToGroup('player'
               ,new iio.SimpleRect(io.canvas.center.x
                          ,io.canvas.height-100)
               .createWithAnim(srcs,1));

      var playerSpeed=8;

      updateInput = function(event, boolValue){

          if (iio.keyCodeIs('left arrow', event) 
           || iio.keyCodeIs('a', event))
              input[LEFT] = boolValue;

          if (iio.keyCodeIs('right arrow', event) 
           || iio.keyCodeIs('d', event))
              input[RIGHT] = boolValue;

          if (iio.keyCodeIs('up arrow', event) 
           || iio.keyCodeIs('w', event))
              input[UP] = boolValue;
      
          if (iio.keyCodeIs('down arrow', event)
           || iio.keyCodeIs('s', event))
              input[DOWN] = boolValue;
          
          if (iio.keyCodeIs('space', event))
              input[SPACE] = boolValue;
      }

      var laserCooldown = 20;
      var laserTimer = 0;
      updatePlayer = function(){

          //update position
          if (input[LEFT] &amp;&amp; !input[RIGHT]
              &amp;&amp; player.pos.x - player.width/2 &gt; 0)
                  player.translate(-playerSpeed,0); 

          if (input[RIGHT] &amp;&amp; !input[LEFT]
              &amp;&amp; player.pos.x + player.width/2 &lt; io.canvas.width)
                  player.translate(playerSpeed,0); 

          if (input[UP] &amp;&amp; !input[DOWN]
              &amp;&amp; player.pos.y - player.height/2 &gt; 0)
                  player.translate(0,-playerSpeed+1); 

          if (input[DOWN] &amp;&amp; !input[UP]
              &amp;&amp; player.pos.y + player.height/2 &lt; io.canvas.height)
                  player.translate(0,playerSpeed-1);


          //update ship image
          if (input[LEFT] &amp;&amp; !input[RIGHT])
              player.setAnimFrame(0);

          else if (input[RIGHT] &amp;&amp; !input[LEFT])
              player.setAnimFrame(2);

          else player.setAnimFrame(1);


          //update laser cannons
          if (input[SPACE] &amp;&amp; laserTimer &lt; 0){
              fireLaser(player.left()+10, player.pos.y);
              fireLaser(player.right()-8, player.pos.y);
              laserTimer = laserCooldown;
          } 
          if (input[SPACE]) laserTimer--;
          else laserTimer-=3;
      }

      //Laser Cannons
      var laserImg = new Image();
      laserImg.src = 'png/laserRed.png'

      fireLaser = function(x,y){
          io.addToGroup('lasers', new iio.SimpleRect(x,y),-1)
              .createWithImage(laserImg)
              .enableKinematics()
              .setBound('top',-40)
              .setVel(0,-16);
      }

      window.addEventListener('keydown', function(event){
          updateInput(event, true);
      });

      window.addEventListener('keyup', function(event){
          updateInput(event, false);
      });
  })();

  //Meteors
  (function(){
      var meteorHealth = 5;

      var bigMeteorImg = new Image();
      var smallMeteorImg = new Image();
      bigMeteorImg.src = 'png/meteorBig.png';
      smallMeteorImg.src = 'png/meteorSmall.png';

      createMeteor = function(small,x,y){    
          var img = bigMeteorImg;
          if (small) img = smallMeteorImg
          var meteor = io.addToGroup('meteors'
              ,new iio.SimpleRect(x,y))
                  .enableKinematics()
                  .setBound('bottom', io.canvas.height+120)
                  .createWithImage(img)
                  .setVel(iio.getRandomInt(-2,2)
                         ,iio.getRandomInt(10,14))
                  .setTorque(iio.getRandomNum(-.1,.1));

          //Set big meteor health property
          if (!small) meteor.health = meteorHealth;
      }
  })();


  //Collision Callback
  //make sure these groups are defined
  io.addGroup('lasers');
  io.addGroup('meteors');

  //load laser flash image
  var laserFlashImg = new Image();
  laserFlashImg.src = 'png/laserRedShot.png';

  //set collision callback
  io.setCollisionCallback('lasers', 'meteors', function(laser, meteor){
      //add the laser flash
      io.addToGroup('laser flashes'
          ,new iio.SimpleRect((laser.pos.x+meteor.pos.x)/2
                       ,(laser.pos.y+meteor.pos.y)/2),10)
              .createWithImage(laserFlashImg)
              .enableKinematics()
              .setVel(meteor.vel.x, meteor.vel.y)
              .shrink(.1);

      //remove the laser object
      io.rmvFromGroup(laser, 'lasers');

      //check if the meteor has health
      if (typeof(meteor.health) != 'undefined'){

          //if so, damage it
          meteor.health--;

          //if health is below 0, create a bunch of 
          //small meteors in its place
          if (meteor.health == 0){
              var numFragments = iio.getRandomInt(3,6);
              for (var i=0; i&lt;numFragments; i++)
                  createMeteor(treu,meteor.pos.x+iio.getRandomInt(-20,20)
                                   ,meteor.pos.y+iio.getRandomInt(-20,20));

              //remove the large meteor
              io.rmvFromGroup(meteor, 'meteors');
          }
      //Otherwise, its a small meteor, so just remove it
      } else io.rmvFromGroup(meteor, 'meteors');
  });
  
  //set the number of meteors relative to the screen width
  var meteorDensity = Math.round(io.canvas.width/150);
  //set the ratio of small to big meteors
  var smallToBig = .70;

  //Main Update Function
  io.setFramerate(60, function(){
      //update the player
      updatePlayer();

      //create new meteors 2% of the time
      if (iio.getRandomNum() &lt; .02)
          for (var i=0; i&lt;meteorDensity; i++){
              var x = iio.getRandomInt(30,io.canvas.width-30);
              var y = iio.getRandomInt(-800,-50);
              if (iio.getRandomNum() &lt; smallToBig)
                  createMeteor(true,x,y);
              else createMeteor(false,x,y);
          }

  });
}</pre> 

<?php include('inc/footer.php'); ?>
</section>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine-1.2.1.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioDebugger-1.0.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SpaceShooter.io.js"></script>
  <script type="text/javascript">
  window.onload = function() {
    prettyPrint();
    var app4,app5,app6;
          var c4 = document.getElementById("canvas4");
          c4.onclick = function() { 
            c4.style.backgroundImage='none';
            app4=iio.start(SS4, 'canvas4');
            c4.onclick = 'undefined';
            if (typeof app5 != 'undefined'){
              iio.stop(app5);
              c5.backgroundImage = "url('../img/scroll-shooter-cnv.png')";
            }
            if (typeof app6 != 'undefined'){
              iio.stop(app6);
              c6.backgroundImage = "url('../img/scroll-shooter-cnv.png')";
            }
            return false;
          }
          var c5 = document.getElementById("canvas5");
          c5.onclick = function() { 
            c5.style.backgroundImage='none';
            app5=iio.start(SS5, 'canvas5');
            c5.onclick = 'undefined';
            if (typeof app4 != 'undefined'){
              iio.stop(app4);
              c4.backgroundImage = "url('../img/scroll-shooter-cnv.png')";
            }
            if (typeof app6 != 'undefined'){
              iio.stop(app6);
              c6.backgroundImage = "url('../img/scroll-shooter-cnv.png')";
            }
            return false;
          }
          var c6 = document.getElementById("canvas6");
          c6.onclick = function() { 
            c6.style.backgroundImage='none';
            app6=iio.start(SpaceShooter, 'canvas6');
            c6.onclick = 'undefined';
            if (typeof app5 != 'undefined'){
              iio.stop(app5);
              c5.backgroundImage = "url('../img/scroll-shooter-cnv.png')";
            }
            if (typeof app4 != 'undefined'){
              iio.stop(app4);
              c4.backgroundImage = "url('../img/scroll-shooter-cnv.png')";
            }
            return false;
          }

        }
function SS1(io){
    var ioRect = iio.ioRect;
    io.setBGColor('#5e3f6b');
    var imgPath = '../demo-apps/space-shooter/img/';
    var starImg = new Image();
    starImg.src = imgPath+'Background/starBig.png';
    starImg.onload = function(){
      io.addObj(new ioRect(io.canvas.center).createWithImage(starImg));
    };
  }; iio.start(SS1,'canvas1');

  SS2 = function(io){

    io.setBGColor('#5e3f6b');
    var imgPath = '../demo-apps/space-shooter/img/';
    var bigStarImg = new Image();
    bigStarImg.src = imgPath+'Background/starBig.png';
    bigStarImg.onload = function(){    
      io.addObj(new iio.ioRect(io.canvas.center.x, 0)
                                  .createWithImage(bigStarImg)
                                  .enableKinematics()
                                  .setVel(0,8)
                                  .setBound('bottom'
                                            ,io.canvas.height+140
                                            ,function(bigStar){
                                               bigStar.pos.y = 0;
                                               return true;
                                             }));
      io.setFramerate(60);
  }
}; iio.start(SS2,'canvas2');

function SS3(io){
  var ioRect = iio.ioRect;
  io.setBGColor('#5e3f6b');
  //io.activateDebugger();
  moveToTop = function(obj){
    obj.setPos(iio.getRandomInt(10, io.canvas.width-10)
                  ,iio.getRandomInt(-340, -100));
    return true;
  }
  var bgSpeed = 6;
  var bgDensity = io.canvas.width/20;
  var imgPath = '../demo-apps/space-shooter/img/';
  var bgImgs = []; //load images into an array
  for (var i=0; i<3; i++)
      bgImgs[i] = new Image();
  bgImgs[0].src = imgPath+'Background/starSmall.png';
  bgImgs[1].src = imgPath+'Background/starBig.png';
  bgImgs[2].src = imgPath+'Background/nebula.png';
  for (var i=0; i<bgImgs.length; i++)
    bgImgs[i].onload = function(){
      var obj,tag,zIndex,vel;
      switch(this[0]){
        case 0: tag = 'small stars'; zIndex = -20; vel = bgSpeed; break;
        case 1: tag = 'big stars'; zIndex = -15; vel = bgSpeed+0.2; break;
        case 2: tag = 'nebula'; zIndex = -5; vel = bgSpeed+4; break;
      }
      for (var j=0; j<bgDensity; j++)
        if (iio.getRandomNum() < .3){ //give it a bit more randomness
          io.addToGroup(tag, new iio.ioRect(iio.getRandomInt(10, io.canvas.width-10)
                              ,iio.getRandomInt(0, io.canvas.height)),zIndex)
            .createWithImage(bgImgs[this[0]])
             .enableKinematics()
             .setVel(0,vel)
             .setBound('bottom',io.canvas.height+140
                       ,moveToTop);
              }
      }.bind([i]) 
  io.setFramerate(60);
}; iio.start(SS3,'canvas3');

function SS4(io){
    var ioRect = iio.ioRect;
    var imgPath = '../demo-apps/space-shooter/img/';

    //define input constants
    var LEFT = 0;
    var RIGHT = 1;
    var UP = 2;
    var DOWN = 3;
    var SPACE = 4;
    var input = [];

    //Background Scene
    (function(){
        moveToTop = function(obj){
            obj.setPos(iio.getRandomInt(10, io.canvas.width-10)
                          ,iio.getRandomInt(-340, -100));
            return true;
        }
        var bgSpeed = 6;
        var bgDensity = io.canvas.width/20;
        var bgImgs = [];
        io.setBGColor('#5e3f6b');

        for (var i=0; i<3; i++)
            bgImgs[i] = new Image();

        bgImgs[0].src = imgPath+'Background/starSmall.png';
        bgImgs[1].src = imgPath+'Background/starBig.png';
        bgImgs[2].src = imgPath+'Background/nebula.png';

        for (var i=0; i<bgImgs.length; i++)
            bgImgs[i].onload = function(){
                var obj,tag,zIndex,vel;
                switch(this[0]){
                    case 0: tag = 'small stars'; zIndex = -20; vel = bgSpeed; break;
                    case 1: tag = 'big stars'; zIndex = -15; vel = bgSpeed+.2; break;
                    case 2: tag = 'nebula'; zIndex = -5; vel = bgSpeed+4; break;
                }
                for (var j=0; j<bgDensity; j++)
                  if (iio.getRandomNum() < .3){ //give it a bit more randomness
                    io.addToGroup(tag, new iio.ioRect(iio.getRandomInt(10, io.canvas.width-10)
                                        ,iio.getRandomInt(0, io.canvas.height)),zIndex)
                      .createWithImage(bgImgs[this[0]])
                       .enableKinematics()
                       .setVel(0,vel)
                       .setBound('bottom',io.canvas.height+140
                                 ,moveToTop);
                        }
            }.bind([i])
    })();

    //Player ship
    (function(){
        var srcs = [imgPath+'playerLeft.png',
                    imgPath+'player.png',
                    imgPath+'playerRight.png'];
  
        player = io.addToGroup('player', new ioRect(io.canvas.center.x, io.canvas.height-100).createWithAnim(srcs,1));

        var playerSpeed=8;

        updateInput = function(event, boolValue){
            if (iio.keyCodeIs('left arrow', event) || iio.keyCodeIs('a', event))
                input[LEFT] = boolValue;
            if (iio.keyCodeIs('right arrow', event) || iio.keyCodeIs('d', event))
                input[RIGHT] = boolValue;
            if (iio.keyCodeIs('up arrow', event) || iio.keyCodeIs('w', event)){
                input[UP] = boolValue;
                event.preventDefault();
            }
            if (iio.keyCodeIs('down arrow', event) || iio.keyCodeIs('s', event)){
                input[DOWN] = boolValue;
                event.preventDefault();
            }
            if (iio.keyCodeIs('space', event)){
                input[SPACE] = boolValue;
                event.preventDefault();
            }
        }

        var shootTimer = 20;
        var shootCount = 0;
        updatePlayer = function(){

            //update position
            if (input[LEFT] && !input[RIGHT]
                && player.pos.x - player.width/2> 0)
                    player.translate(-playerSpeed,0); 
            if (input[RIGHT] && !input[LEFT]
                && player.pos.x + player.width/2 < io.canvas.width)
                    player.translate(playerSpeed,0); 
            if (input[UP] && !input[DOWN]
                && player.pos.y - player.height/2 > 0)
                    player.translate(0,-playerSpeed+1); 
            if (input[DOWN] && !input[UP]
                && player.pos.y + player.height/2 < io.canvas.height)
                    player.translate(0,playerSpeed-1);

            //update ship image
            if (input[LEFT] && !input[RIGHT])
                player.setAnimFrame(0);
            else if (input[RIGHT] && !input[LEFT])
                player.setAnimFrame(2);
            else player.setAnimFrame(1);

        }

        window.addEventListener('keydown', function(event){
            updateInput(event, true);
        });

        window.addEventListener('keyup', function(event){
            updateInput(event, false);
        });
    })();

    io.setFramerate(60, function(){
        updatePlayer();
    });
};

function SS5(io){

  //get a local reference to ioRect
  var ioRect = iio.ioRect;
    var imgPath = '../demo-apps/space-shooter/img/';

  //define input constants
  var LEFT = 0;
  var RIGHT = 1;
  var UP = 2;
  var DOWN = 3;
  var SPACE = 4;
  var input = [];

  //activate debugger if you want
  //io.activateDebugger();

  //Create the Background Scene
  //  I wrap everything in this funny looking
  //  function syntax so that I can collapse
  //  it in my code editor while I'm working
  //  helps organize things...
  (function(){

    io.setBGColor('#5e3f6b');
    var bgSpeed = 6;
    var bgDensity = io.canvas.width/20;
    var bgImgs = [];

    for (var i=0; i<3; i++)
      bgImgs[i] = new Image();

    bgImgs[0].src = imgPath+'Background/starSmall.png';
    bgImgs[1].src = imgPath+'Background/starBig.png';
    bgImgs[2].src = imgPath+'Background/nebula.png';

    moveToTop = function(obj){
      obj.setPos(iio.getRandomInt(10,io.canvas.width-10)
                    ,iio.getRandomInt(-340, -100));
      return true;
    }

    for (var i=0; i<bgImgs.length; i++)
      bgImgs[i].onload = function(){
          var obj,tag,zIndex,vel;
          switch(this[0]){
            case 0: tag = 'small stars'; 
                    zIndex = -20; 
                    vel = bgSpeed; 
                    break;
            case 1: tag = 'big stars'; 
                    zIndex = -15; 
                    vel = bgSpeed+.2; 
                    break;
            case 2: tag = 'nebula'; 
                    zIndex = -5; 
                    vel = bgSpeed+4; 
                    break;
          }
                for (var j=0; j<bgDensity; j++)
        if (iio.getRandomNum() < .3){ //give it a bit more randomness
          io.addToGroup(tag, new iio.ioRect(iio.getRandomInt(10, io.canvas.width-10)
                              ,iio.getRandomInt(0, io.canvas.height)),zIndex)
            .createWithImage(bgImgs[this[0]])
             .enableKinematics()
             .setVel(0,vel)
             .setBound('bottom',io.canvas.height+140
                       ,moveToTop);
              }
      }.bind([i])
  })();

  //must be defined outside the player structure
  function checkPlayerBounds(){};

  //Player ship
  (function(){
    var srcs = [imgPath+'playerLeft.png',
                imgPath+'player.png',
                imgPath+'playerRight.png'];

    player = io.addToGroup('player'
               ,new Rect(io.canvas.center.x
                          ,io.canvas.height-100)
               .createWithAnim(srcs,1));

    var playerSpeed=8;

    //Checks for arrow keys and AWSD
    updateInput = function(event, boolValue){

        if (iio.keyCodeIs('left arrow', event) 
         || iio.keyCodeIs('a', event))
            input[LEFT] = boolValue;

        if (iio.keyCodeIs('right arrow', event) 
          || iio.keyCodeIs('d', event))
            input[RIGHT] = boolValue;

        if (iio.keyCodeIs('up arrow', event) || iio.keyCodeIs('w', event)){
            input[UP] = boolValue;
            event.preventDefault();
        }
        if (iio.keyCodeIs('down arrow', event) || iio.keyCodeIs('s', event)){
            input[DOWN] = boolValue;
            event.preventDefault();
          }

        if (iio.keyCodeIs('space', event)){
            input[SPACE] = boolValue;
            event.preventDefault();
        }
    }

    var laserCooldown = 20;
    var laserTimer = 0;
    updatePlayer = function(){

        //update position
        if (input[LEFT] && !input[RIGHT]
            && player.pos.x-player.width/2>0)
              player.translate(-playerSpeed,0); 
        if (input[RIGHT] && !input[LEFT]
            && player.pos.x+player.width/2 
            < io.canvas.width)
              player.translate(playerSpeed,0); 
        if (input[UP] && !input[DOWN]
            && player.pos.y-player.height/2>0)
              player.translate(0,-playerSpeed+1); 
        if (input[DOWN] && !input[UP]
            && player.pos.y+player.height/2 
            < io.canvas.height)
              player.translate(0,playerSpeed-1);

        //update ship image
        if (input[LEFT] && !input[RIGHT])
            player.setAnimFrame(0);
        else if (input[RIGHT] && !input[LEFT])
            player.setAnimFrame(2);
        else player.setAnimFrame(1);

        //update laser cannons
        if (input[SPACE] && laserTimer < 0){
            fireLaser(player.left()+10, player.pos.y);
            fireLaser(player.right()-8, player.pos.y);
            laserTimer = laserCooldown;
        } 
        if (input[SPACE]) laserTimer--;
        else laserTimer-=3;
    }

    window.addEventListener('keydown', function(event){
        updateInput(event, true);
    });

    window.addEventListener('keyup', function(event){
        updateInput(event, false);
    });

    var laserImg = new Image();
    laserImg.src = imgPath+'laserRed.png'
    fireLaser = function(x,y){
        io.addToGroup('lasers', new ioRect(x,y),-1)
            .createWithImage(laserImg)
            .enableKinematics()
            .setBound('top',-40)
            .setVel(0,-16);
    }
  })();

  io.setFramerate(60, function(){
      updatePlayer(); 
  });
};
  </script>
</body>
</html>