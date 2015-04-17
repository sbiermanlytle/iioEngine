<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Kinematics';
	include('inc/preHeader.php');
  include('inc/docsGlobals.php');
	include('inc/header.php');
  	include('docsPan.php');
?>
	<section class="container right-container top docs">
        <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-kinematics */
google_ad_slot = "7206837931";
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
        <h1 style="margin-bottom:30px;">iio Kinematics Engine</h1>
        <p>Kinematics is a branch of mechanics that deals with the motion of objects without consideration of causal forces.</p>
        <p>iio provides an attachment called the 'iio Kinematics Engine' that implements many of the basic functions that a kinematics driven application will need.</p>
        <p>Put simply, this framework makes it easy to get objects moving, rotating, and colliding.</p>
        <p>The framework attaches to the <a href="Shape.php">Shape</a> class, so all iio Shape classes can access its properties and functions.</p>
        <p>The attachment does not happen by default. You must call the <a href="kinematics-engine.php#enable-kinematics">enableKinematics</a> function to trigger an attachment.</p>
        <p>Kinematics properties will only take effect if a framerate has been set on the shape or the canvas that contains the shape.</p>
<pre class="prettyprint linenums:1">
//create an new Rect and enable kinematics
var box = new iio.Rect(0,0,50).enableKinematics();

//we can now use the kinematics functions
box.setVel(0,4);

//Kinematics properties are not defined by default
//you must call a 'set' function or define them directly
var t = box.torque //will be 'undefined'
var v = box.vel //returns a vector, since we used
                //setVel already

//Must set a framerate for things to move
io.setFramerate(60);</pre>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>Kinematics properties are <span class="kwd">'undefined'</span> by default.</p>
         <div class="docs-inner">
          <a class="inner-anchor" name="vel">&nbsp;</a> 
          <h3>vel :: <a href="Vec.php">Vec</a></h3>
          <h5>Available to: <a href="Shape.php">Shape</a></h5>
          <p>- This objects velocity vector.</p>
          <p>- This property can be set with the <a href="kinematics-engine.php#setVel">setVel</a> function.</p>
          <pre class="prettyprint linenums:1">
//set the vel property directly
shape.vel = new iio.Vec(4,5);

//change the vel properties directly
shape.vel.x = -4;
shape.vel.y = -5;

//change the property with its set function
shape.setVel(5,4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="acc">&nbsp;</a> 
          <h3>acc :: <a href="Vec.php">Vec</a></h3>
          <h5>Available to: <a href="Shape.php">Shape</a></h5>
          <p>- This objects acceleration vector.</p>
          <p>- This property can be set with the <a href="kinematics-engine.php#setAcc">setAcc</a> function.</p>
          <pre class="prettyprint linenums:1">
//set the acc property directly
shape.acc = new iio.Vec(4,5);

//change the vel properties directly
shape.acc.x = -.04;
shape.acc.y = -.05;

//change the property with its set function
shape.setAcc(.05,.04);</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="torque">&nbsp;</a> 
          <h3>torque :: <?php echo $NumberLink ?></h3>
          <h5>Available to: <a href="Shape.php">Shape</a></h5>
          <p>- Sets the speed and direction of an objects rotation. This value is measured in radians.</p>
          <p>- This property can be set with the <a href="kinematics-engine.php#setTorque">setTorque</a> function.</p>
          <pre class="prettyprint linenums:1">
//set the torque property directly
shape.torque = .01;

//change the property with its set function
shape.setTorque(.02);</pre>
        </div>
<div class="docs-inner">
          <a class="inner-anchor" name="bounds">&nbsp;</a> 
          <h3>bounds :: Object</h3>
          <h5>Available to: <a href="Shape.php">Shape</a></h5>
          <p>- An object that holds this shapes boundaries and boundary callback functions.</p>
          <p>- bounds has the following structure:</p>
          <p>: <span class="kwd">bounds</span>.top.val :: <?php echo $NumberLink ?> :: the top bound y coordinate</p>
          <p>: <span class="kwd">bounds</span>.top.callback :: <?php echo $FunctionLink ?> :: the top bound callback function</p>
          <p>: <span class="kwd">bounds</span>.right.val :: <?php echo $NumberLink ?> :: the right bound y coordinate</p>
          <p>: <span class="kwd">bounds</span>.right.callback :: <?php echo $FunctionLink ?> :: the right bound callback function</p>
          <p>: .... identical for bottom and left</p>
          <p>: <span class="kwd">bounds</span>.callback :: <?php echo $FunctionLink ?> :: the bounds callback function</p>
          <p>- If an object crosses a 'bound' and that bounds callback exists, the callback will be called. If no callback is specified, the primary <span class="kwd">bounds</span>.callback function will be called. If that function doesn't exist, the object will remove itself. If you want to remove the object in your custom bound callback code, return <span class="kwd">false</span>.</p>
                    <pre class="prettyprint linenums:1">
//create a square that will move down from canvas center
//and remove itself when it hits the bottom of the screen
var square = new iio.Rect(io.canvas.center,50)
                  .enableKinematics()
                  .setVel(0,1)
                  .setBound('bottom', io.canvas.height);

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
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>Kinematics functions are attached to a shape when you call <a href="kinematics-engine.php#enableKinematics">enableKinematics</a>.</p>
        <p>The function <a href="kinematics-engine.php#enableKinematics">enableKinematics</a> is attached by default.</p>
        <p>All kinematics functions return a reference to the object that called them.</p>
         <div class="docs-inner">
          <a class="inner-anchor" name="enable-kinematics">&nbsp;</a> 
          <h3>.enableKinematics()</h3>
          <h5>Available to: <a href="Shape.php">Shape</a></h5>
          <p>- Attaches all of the following kinematics functions to the object.</p>
          <pre class="prettyprint linenums:1">
//create a new box with kinematics
var box = new iio.Rect(0,0,100).enableKinematics();</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="update">&nbsp;</a> 
          <h3>.update()</h3>
          <h5>Available to any kinematics enabled object</h5>
          <p>- Translates this object by its velocity vector and rotates it by its torque value.</p>
          <p>- This function is automatically called by your <a href="AppManager.php">AppManager</a> when you set a framerate on either the object, or the canvas that hold the object.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setVel">&nbsp;</a> 
          <h3>.setVel( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.setVel( <?php echo $NumberLink ?>: vX, vY )</h3>
          <h5>Available to any kinematics enabled object.</h5>
          <p>- Sets this objects velocity. The default value for both parameters is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
//change an objects velocity
myObj.setVel(2,5);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setAcc">&nbsp;</a> 
          <h3>.setAcc( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.setAcc( <?php echo $NumberLink ?>: vX, vY )</h3>
          <h5>Available to any kinematics enabled object.</h5>
          <p>- Sets this objects acceleration. The default value for both parameters is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
//change an objects acceleration
myObj.setAcc(.05,-.04);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setTorque">&nbsp;</a> 
          <h3>.setTorque( <?php echo $NumberLink ?> t )</h3>
          <h5>Available to any kinematics enabled object.</h5>
          <p>- Sets this objects <span class="kwd">torque</span> to the given value.</p>
          <pre class="prettyprint linenums:1">
//set an objects torque
myObj.setTorque(.01);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setBound">&nbsp;</a> 
          <h3>.setBound( <?php echo $StringLink ?> boundName, <?php echo $NumberLink ?> boundCoordinate, <?php echo $FunctionLink ?> callback )</h3>
          <h5>Available to any kinematics enabled object.</h5>
          <p>- Sets a bound property on this object. Refer to <a href="iio-basics.php#bounds">this page</a> for more info about bounds.</p>
          <p>- If a callback function is not specified, the object will remove itself when it reaches the bound.</p>
          <p>- Available bound names are: <span class="kwd">top</span>, <span class="kwd">right</span>, <span class="kwd">bottom</span>, and <span class="kwd">left</span>.</p>
          <pre class="prettyprint linenums:1">
//set a bound on an object
myObj.setBound('bottom', io.canvas.height);

//set a bound with a callback function
myObj.setBound('bottom', io.canvas.height
                    ,function(obj){
                      //perform some action
                      return true;//keep the object
                     });</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setBounds">&nbsp;</a> 
          <h3>.setBounds( <?php echo $NumberLink ?>: top, right, bottom, left, <?php echo $FunctionLink ?> callback )</h3>
          <h5>Available to any kinematics enabled object.</h5>
          <p>- Sets up to 4 bounds on an object at once, and allows you to set one callback function for all the bounds.</p>
          <p>- If a callback function is not specified, the object will remove itself when it reaches a bound.</p>
          <p>- You can leave a bound out by passing <span class="kwd">null</span> in its place.</p>
          <pre class="prettyprint linenums:1">
//set one bound function for the top and bottom
myObj.setBounds(0, null, io.canvas.height, null
                    ,function(obj){
                      //perform some action
                      return true;//keep the object
                     });</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>