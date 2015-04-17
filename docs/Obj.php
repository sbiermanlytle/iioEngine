<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Obj';
  include('inc/docsGlobals.php');
	include('inc/preHeader.php');
	include('inc/header.php');
  	include('ObjsPan.php');
?>
	<section class="container right-container top docs">
        <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-Obj */
google_ad_slot = "4392972336";
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
        <h1>Obj</h1>
        <p>The base class for all iio Objects (except Vec).</p>
        <p>It defines an object with a position vector and translation methods. The rotation property is optional - it is only defined if you define it.</p>
        <p>The properties and functions of Obj are available to all iio Objects (except Vec).</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Obj</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <a class="anchor inner-anchor" name="Obj1">&nbsp;</a> 
        <div class="docs-inner">
          <h3><span class="kwd">iio</span>.Obj( <a class="red" href="Vec.php#vector">Vector</a> position )</h3>
          <p>- Creates an object with the given position vector. The default position is 0,0.</p>
          <pre class="prettyprint linenums:1">
var pos = new iio.Vec(1, 1);            
var obj = new iio.Obj(pos);</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Obj2">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.Obj( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
          <p>- creates an object at the coordinates (x, y). The default position is 0,0.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj(1, 1);</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The data contained in each <a href="">Obj</a> instance.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="pos">&nbsp;</a> 
          <h3>.pos :: <a href="Vec.php">Vec</a></h3>
          <p>- An vector representing the object's position.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj(1,1);
//get obj position
var position = obj.pos; //position will be an Vec
var xPos = obj.pos.x;
var yPos = obj.pos.y;</pre>
         <a class="anchor inner-anchor" name="rotation">&nbsp;</a> 
        <h3>.rotation :: <?php echo $NumberLink ?></h3>
          <p>- This objects rotation. This property is <span class="kwd">UNDEFINED by DEFAULT</span>, you must use the <a href="Obj.php#rotate">rotate()</a> function or set a value directly if you want a rotation that is not equivalent to <span class="kwd">'undefined'</span>.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj(1,1);
var r = obj.rotation //r will be undefined

//set obj rotation
obj.rotation = 90;

//get obj rotation
var r2 = obj.rotation; //r will be 90</pre>
        </div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are available to all <a href="">Obj</a> instances.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
        <h3>.clone()</h3>
        <h5>:: Returns <a href="Obj.php">Obj</a></h5>
          <p>- Creates and returns a new Obj object with the same properties as this object. Makes a hard copy of the object.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj();
//copy the obj
var obj2 = obj; //WRONG: this is a soft copy
                //the variables will point to the same object
obj2 = obj.clone(); //RIGHT: this is a hard copy</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="setPos">&nbsp;</a> 
        <h3>.setPos( <a href="Vec.php">Vec</a> pos )</h3>
          <h3 class="func">.setPos( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
        <h5>:: Returns <a href="iio-basics.php#this">this</a></h5>
          <p>- Sets the position of the object to the given coordinates or vector.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj(1,1);
//set obj position
obj.setPos(10,10);
//or
var pos = new iio.Vec(10,10);
obj.setPos(pos);
//obj.pos will now have the coordinates (10,10)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="translate">&nbsp;</a> 
        <h3>.translate( <a href="Vec.php">Vec</a> v )</h3>
          <h3 class="func">.translate( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
        <h5>:: Returns <a href="Obj.php">this</a></h5>
          <p>- moves the object by adding the given coordinates or vector to its position.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj(1,1);
//translate obj
obj.translate(10,10);
//or
var pos = new iio.Vec(10,10);
obj.translate(pos);
//obj.pos will have the coordinates (11, 11) after one translation</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="rotate">&nbsp;</a> 
        <h3>.rotate( <?php echo $NumberLink ?> radians)</h3>
        <h5>:: Returns <a href="iio-basics.php#this">this</a></h5>
          <p>- sets the rotation of this object to the given value. This <a target="_new" href="http://math.rice.edu/~pcmi/sphere/degrad.gif">radian chart</a> is helpful.</p>
          <pre class="prettyprint linenums:1">
var obj = new iio.Obj();
//rotate the obj 90 degrees
obj.rotate(Math.PI/2);</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="enableUpdates">&nbsp;</a> 
        <h3>.enableUpdates( <?php echo $FunctionLink?> callback, <?php echo $ArrayLink ?> callbackParams )</h3>
        <h5>:: Returns <a href="iio-basics.php#this">this</a></h5>
          <p>- adds an update function, allowing automated movement and effects. This function can be called multiple times to apply additional update callbacks.</p>
          <p>- note that kinematics and effects functions call this function automatically.</p>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>