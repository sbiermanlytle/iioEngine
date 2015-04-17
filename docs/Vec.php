<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Vec';
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
/* iioEngine_docs-Vec */
google_ad_slot = "4253371537";
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
        <h1>Vec</h1>
        <a class="anchor top-anchor" style="top:40px;" name="vector">&nbsp;</a> 
        <p>A 2D vector class for a single vector with two coordinates. These coordinates are JavaScript <a href="http://www.w3schools.com/js/js_obj_number.asp">Number</a> Objects, so they can be integers or floating point numbers, positive or negative.</p>
        <p><span class="red">Vector</span> is not a class, it it used to represent any class that has <span class="kwd">x</span>,<span class="kwd">y</span> properties of type <?php echo $NumberLink ?>. <span class="kwd">b2Vec2</span> in the Box2D framework is one of these vector classes - it can be used in place of <a href="">Vec</a> whenever the <span class="red">Vector</span> type is specified.</p>
        <p>All of the functions in this class can accept vectors defined as <span class="red">Vector</span> objects or as 2d coordinate systems (separate <span class="kwd">x</span>,<span class="kwd">y</span> values of type <?php echo $NumberLink ?>).</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Vec</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Vec1">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.Vec( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
          <p>- Creates the vector ( x, y ). Undefined parameters are set to 0.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(1,1);</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Vec2">&nbsp;</a>
          <h3><span class="kwd">iio</span>.Vec( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <p>- Creates a new vector with the same properties as the given one. If the parameter is left undefined, a new vector will be created at 0,0.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(v1);
//v1 and v2 will be different objects with equivalent properties</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The data contained in each <a href="">Vec</a> object.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="x">&nbsp;</a> 
          <h3>.x :: <?php echo $NumberLink ?></h3>
          <p>- The x coordinate of the vector.</p>
          <pre class="prettyprint linenums:1">
var vector = new iio.Vec(1,3);
//get x coordinate
var x = vector.x;
//x will be set to 1</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="y">&nbsp;</a> 
          <h3>.y :: <?php echo $NumberLink ?></h3>
          <p>- The y coordinate of the vector.</p>
          <pre class="prettyprint linenums:1">
var vector = new iio.Vec(1,3);
//get y coordinate
var y = vector.y;
//y will be set to 3</pre>
        </div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are available to all <a href="">Vec</a> objects. Most are mutator functions (they alter the properties of the object that calls them) and return <a href="../docs/iio-basics.php#this">this</a>, to allow for cascading function calls.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
        <h3>.clone()</h3>
        <h5>:: Returns <a href="">Vec</a></h5>
          <p>- returns a new vector with the same properties as this one. Makes a hard copy of the object.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
//get a clone vector
var v2 = v1.clone();
//v1 and v2 will point to two different objects</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="toString">&nbsp;</a> 
        <h3>.toString()</h3>
        <h5>:: Returns <?php echo $StringLink?></h5>
          <p>- returns a string with this vector's coordinates</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
//show the value of v1
alert(v1.toString())</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="length">&nbsp;</a> 
        <h3>.length()</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the length (magnitude) of this vector.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//get the length of v
var mag = v.length(); </pre>
        </div>
         <div class="docs-inner">
          <a class="anchor inner-anchor" name="normalize">&nbsp;</a> 
        <h3>.normalize()</h3>
        <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- normalizes this vector (makes its length equal to one without altering its angle).</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//normalize v
v.normalize();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="set">&nbsp;</a> 
        <h3>.set( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.set( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
        <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- Sets this vector's coordinates to the given values or to those of the given vector.</p>
          <pre class="prettyprint linenums:1">
var vector = new iio.Vec(1,1);
//set vector to new value
vector.set(10,10);
//or
var vector2 = new iio.Vec(10,10);
vector.set(vector2);
//vector will now have the coordinates (10,10)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="add">&nbsp;</a> 
        <h3>.add( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.add( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y)</h3>
        <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- adds the given vector.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(2,3);
//add v2 to v1
v1.add(v2);
//or
v1.add(2,3);
//v1 will have the coordinates (3, 4) after one add operation</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="sub">&nbsp;</a> 
        <h3>.sub( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.sub( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y)</h3>
        <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- subtracts the given vector.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(10,10);
var v2 = new iio.Vec(2,3);
//subtract v2 from v1
v1.sub(v2);
//or
v1.sub(2,3);
//v1 will have the coordinates (8, 7) after one sub operation</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="mult">&nbsp;</a> 
          <h3>.mult( <?php echo $NumberLink ?> factor )</h3>
        <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- multiplies this vector by the given factor.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(1,1);
//multiply v by 5
v.mult(5);
//v will have the coordinates (5,5)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="div">&nbsp;</a> 
          <h3>.div( <?php echo $NumberLink ?> divisor )</h3>
        <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- divides this vector by the given divisor.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//divide v by 2
v.div(2);
//v will have the coordinates (5,5)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="dot">&nbsp;</a> 
        <h3>.dot( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.dot( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y)</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the dot product of this and the given vector. This function does not alter the properties of either object.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(10,10);
var v2 = new iio.Vec(2,2);
//get the dot product
var dP = v1.dot(v2);
//or
var dP = v2.dot(10,10);</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="distance">&nbsp;</a> 
        <h3>.distance( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.distance( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
            <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the absolute distance between this vector and the one given.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(10,10);
//get the distance between v1 and v2
var dist = v1.distance(v2);
//or
var dist = v1.distance(10,10)</pre>
        </div>
      </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="lerp">&nbsp;</a> 
        <h3>.lerp( <a class="red" href="Vec.php#vector">Vector</a> v, <?php echo $NumberLink ?> weight )</h3>
          <h3 class="func">.lerp( <?php echo $NumberLink ?>: x, y, weight )</h3>
          <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- interpolates the value of this vector with the given vector and weight. The weight must be between <span class="kwd">0</span> and <span class="kwd">1</span>. This function performs the following operation: <span class="kwd">this</span> = <span class="kwd">this</span> + (<span class="kwd">v</span> - <span class="kwd">this</span>) * <span class="kwd">weight</span></p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(10,10);
//move v1 halfway between its current position and v2's
v1.lerp(v2,0.5);
//or
v1.lerp(10,10,0.5)</pre>
        </div>

      <!-- STATIC FUNCTIONS -->
      <div class="docs-middle">
        <a class="anchor" name="static-functions">&nbsp;</a> 
        <h2>Static Functions</h2>
        <p>These functions can be called without an instantiated <a href="">Vec</a> object. They are useful when creating new vectors with altered properties of existing ones. None of these functions alter the properties of the given vectors.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="static-toString">&nbsp;</a> 
        <h3>.toString( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.toString( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
        <h5>:: Returns <?php echo $StringLink ?></h5>
          <p>- returns a string of the given vector's coordinates.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//show the value of v
alert(Vec.toString(v))</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="static-length">&nbsp;</a> 
        <h3>.length( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.length( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the length (magnitude) of the given vector.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//get the length of v
var mag = iio.Vec.length(v);
//or
var mag = iio.Vec.length(10,10);</pre>
        </div>
         <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-normalize">&nbsp;</a> 
        <h3>.normalize( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.normalize( <?php echo $NumberLink ?> x, <?php echo $NumberLink ?> y )</h3>
        <h5>:: Returns <a href="">Vec</a></h5>
          <p>- returns a normalized copy of the given vector.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//get normalized v without altering v
var var v2 = iio.Vec.normalize(v);
//or create a normalized vector with int parameters
var var v3 = iio.Vec.normalize(10,10);</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-add">&nbsp;</a> 
        <h3>.add( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">.add( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2 )</h3>
          <h3 class="func">.add( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="Vec.php#vector">Vector</a> v2 )</h3>
          <h3 class="func">.add( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
        <h5>:: Returns <a href="">Vec</a></h5>
          <p>- returns a new vector equal to the sum of the two given vectors.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(2,3);
//get a iio.vector equal to the sum of v1 and v2
var v3 = iio.Vec.add(v1,v2);
//or
var v3 = iio.Vec.add(v1,2,3);
//or
var v3 = iio.Vec.add(1,1,v2);
//or
var v3 = iio.Vec.add(1,1,2,3);
//v3 will have the coordinates (3, 4)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-sub">&nbsp;</a> 
        <h3>.sub( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">.sub( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2 )</h3>
          <h3 class="func">.sub( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="Vec.php#vector">Vector</a> v2 )</h3>
          <h3 class="func">.sub( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
        <h5>:: Returns <a href="">Vec</a></h5>
          <p>- returns a new vector equal to the first given vector subtracted by the second.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(10,10);
var v2 = new iio.Vec(2,3);
//get a iio.vector equal to the sum of v1-v2
var v3 = iio.Vec.sub(v1,v2);
//or
var v3 = iio.Vec.sub(v1,2,3);
//or
var v3 = iio.Vec.sub(10,10,v2);
//or
var v3 = iio.Vec.sub(10,10,2,3);
//v3 will have the coordinates (8,7)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-mult">&nbsp;</a> 
          <h3>.mult( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?> factor )</h3>
          <h3 class="func">.mult( <?php echo $NumberLink ?>: x1, y1, factor )</h3>
        <h5>:: Returns <a href="">Vec</a></h5>
          <p>- returns a new vector equal to the given vector multiplied by the given factor.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(1,1);
//get vector v*5
var v2 = iio.Vec.mult(v,5);
//or
var v2 = iio.Vec.mult(1,1,5);
//v will have the coordinates (5, 5)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-div">&nbsp;</a> 
          <h3>.div( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?> divisor )</h3>
          <h3 class="func">.div( <?php echo $NumberLink ?>: x1, y1, divisor )</h3>
        <h5>:: Returns <a href="">Vec</a></h5>
          <p>- returns a new vector equal to the given vector divided given divisor.</p>
          <pre class="prettyprint linenums:1">
var v = new iio.Vec(10,10);
//get vector v/2
var v2 = iio.Vec.div(v,2);
//or
var v2 = iio.Vec.div(10,10,2);
//v will have the coordinates (5,5)</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-dot">&nbsp;</a> 
        <h3>.dot( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">.dot( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2 )</h3>
          <h3 class="func">.dot( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="Vec.php#vector">Vector</a> v2 )</h3>
          <h3 class="func">.dot( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the dot product of the given vectors.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(10,10);
var v2 = new iio.Vec(2,2);
//get the dot product of v1 and v2
var dP = iio.Vec.dot(v1,v2);
//or
var v3 = iio.Vec.dot(v1,2,2);
//or
var v3 = iio.Vec.dot(10,10,v2);
//or
var v3 = iio.Vec.dot(10,10,2,2);</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-distance">&nbsp;</a> 
        <h3>.distance( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">.distance( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2 )</h3>
          <h3 class="func">.distance( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="Vec.php#vector">Vector</a> v2 )</h3>
          <h3 class="func">.distance( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
            <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the absolute distance between the given vectors.</p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(10,10);
//get the distance between v1 and v2
var dist = iio.Vec.distance(v1,v2);
//or
var dist = iio.Vec.distance(v1,10,10);
//or
var dist = iio.Vec.distance(1,1,v2);
//or
var dist = iio.Vec.distance(1,1,10,10);</pre>
        </div>
        <div class="docs-inner">
          <a class="anchor inner-anchor" name="static-lerp">&nbsp;</a> 
        <h3>.lerp( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2, <?php echo $NumberLink ?> weight )</h3>
          <h3 class="func">.lerp( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2, weight )</h3>
          <h3 class="func">.lerp( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="Vec.php#vector">Vector</a> v2, <?php echo $NumberLink ?> weight )</h3>
          <h3 class="func">.lerp( <?php echo $NumberLink ?>: x1, y1, x2, y2, weight )</h3>
          <h5>:: Returns <a href="../docs/iio-basics.php#this">this</a></h5>
          <p>- returns a new vector that equals the interpolation of the given vectors and weight value. The weight must be between <span class="kwd">0</span> and <span class="kwd">1</span>. This function performs the following operation: <span class="kwd">this</span> = <span class="kwd">this</span> + (<span class="kwd">v</span> - <span class="kwd">this</span>) * <span class="kwd">weight</span></p>
          <pre class="prettyprint linenums:1">
var v1 = new iio.Vec(1,1);
var v2 = new iio.Vec(10,10);
//get a new vector halfway between v1 and v2
var v3 = iio.Vec.lerp(v1,v2,0.5);
//or
var v3 = iio.Vec.lerp(v1,10,10,0.5);
//or
var v3 = iio.Vec.lerp(1,1,v2,0.5);
//or
var v3 = iio.Vec.lerp(1,1,10,10,0.5);</pre>
        </div>
      </div>
<?php include('inc/footer.php'); ?>
    </section>
</div>