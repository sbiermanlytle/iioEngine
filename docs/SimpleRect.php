<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'SimpleRect';
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
/* iioEngine_docs-SimpleRect */
google_ad_slot = "8823171931";
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
        <h1>SimpleRect</h1>
        <h4>Extends :: <a href="Shape.php">Shape</a> :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a rectangle with a position, <span class="kwd">width</span>, and <span class="kwd">height</span>. The position vector <span class="kwd">pos</span> is at the center of the rectangle.</p>
        <p><span class="kwd">SimpleRect</span> is a simplified version of <a href="Rect.php">Rect</a>, that limits functionality in exchange for a smaller data footprint and faster functions.</p>
        <p>The only limitation is in object rotation. You can rotate a <span class="kwd">SimpleRect</span>, but its <a href="contains">contains</a> function and collision detection will not take the rotation into account.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">SimpleRect</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="SimpleRect1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.SimpleRect</span>( <a class="red" href="ioVec.php#vector">Vector</a> position, <?php echo $NumberLink?>: width, height )</h3>
         <h3 class="func" style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.SimpleRect</span>( <?php echo $NumberLink?> x, y, width, height )</h3>
          <p>- creates a rectangle with the given position and dimensions. If the <span class="kwd">height</span> is omitted, a square will be created with the <span class="kwd">width</span> as its size.</p>
          <p>- The default value for all parameters is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
//create a 60x60 square at canvas center
var square = new iio.SimpleRect(io.canvas.center,60);

//create a 40x60 rectangle at 0,0
var rect = new iio.SimpleRect(0,0,40,60);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>SimpleRect :: <a href="Shape.php#properties">Shape</a> :: <a href="Obj.php#properties">Obj</a></h4>
        <?php include('shared/Obj-properties.php'); ?>
      </div>
          <?php include('shared/Obj-graphics-props.php');
                include('shared/Shape-graphics-props.php');?>
        </div>
      </div>
      <?php include('shared/kinematics-props.php'); ?>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">SimpleRect</a> class. These properties will always exist for an instantiated <a href="">SimpleRect</a>.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="width">&nbsp;</a> 
          <h3>.width :: <?php echo $NumberLink ?></h3>
          <p>- the width of this rectangle, measured in pixels.</p>
          <pre class="prettyprint linenums:1">
//get a rectangle's width
var w = rectangle.width;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="height">&nbsp;</a> 
          <h3>.height :: <?php echo $NumberLink ?></h3>
          <p>- the height of this rectangle, measured in pixels.</p>
          <pre class="prettyprint linenums:1">
//get a rectangle's height
var h = rectangle.height;</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>SimpleRect :: <a href="Shape.php#functions">Shape</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
      <?php include('shared/Obj-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); 
            include('shared/Shape-graphics-fns.php'); ?>
        </div>
      </div>
      <?php include('shared/kinematics-fns.php'); ?>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">SimpleRect</a> class, and available to all instantiated <a href="">SimpleRect</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">SimpleRect</a></h5>
          <p>- returns a new <a href="">SimpleRect</a> with the same properties as this one. Makes a hard copy of the object.</p>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="setSize">&nbsp;</a> 
          <h3>.setSize</span>( <a class="red" href="ioVec.php#vector">Vector</a> size )</h3>
          <h3 class="func">.setSize</span>( <?php echo $NumberLink ?>: w, h )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets the dimensions of this rectangle to the given width and height. The default value for both parameter is <span class="kwd">0</span></p>
          <pre class="prettyprint linenums:1">
//change the size of a rectangle
rect.setSize(20,40);</pre>
        </div>
       <div class="docs-inner">
        <a class="anchor inner-anchor" name="contains">&nbsp;</a> 
          <h3>.contains</span>( <a class="red" href="ioVec.php#vector">Vector</a> point )</h3>
          <h3 class="func">.contains</span>( <?php echo $NumberLink ?>: x, y )</h3>
        <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the given point is inside this rectangle. Returns false otherwise.</p>
          <pre class="prettyprint linenums:1">
//alert when a rectangle clicked
io.canvas.addEventListener('mousedown', function(event){
    if (rect.contains(io.getEventPosition(event)))
      alert('you clicked the square');
});</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="getTrueVertices">&nbsp;</a> 
          <h3>.getTrueVertices</span>()</h3>
        <h5>:: Returns <?php echo $ArrayLink ?></h5>
          <p>- returns an array of <a href="Vec.php">Vec</a> objects corresponding to this rectangles coordinates relative to canvas 0,0.</p>
          <p>- NOTE: this is more like a getVertices method - it doesn't take the SimpleRect's rotation into account. If you need precise rectangle vertices, use <a href="Rect.php">Rect</a>.</p>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="top-fn">&nbsp;</a> 
          <h3>.top</span>()</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the y-coordinate of the top of this rectangle relative to the application's (0,0) position, which is at the top left-hand corner of the base canvas by default.</p>
          <pre class="prettyprint linenums:1">
//get the y-coordinate of the top of a rectangle
var top = rect.top();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="right">&nbsp;</a> 
          <h3>.right</span>()</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the x-coordinate of the right side of this rectangle relative to the application's (0,0) position, which is at the top left-hand corner of the base canvas by default.</p>
          <pre class="prettyprint linenums:1">
//get the x-coordinate of the right side of a rectangle
var right = rect.right();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="bottom">&nbsp;</a> 
          <h3>.bottom</span>()</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the y-coordinate of the bottom of this rectangle relative to the application's (0,0) position, which is at the top left-hand corner of the base canvas by default.</p>
          <pre class="prettyprint linenums:1">
//get the y-coordinate of the bottom of a rectangle
var bottom = rect.bottom();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="left">&nbsp;</a> 
          <h3>.left</span>()</h3>
        <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns the x-coordinate of the left side of this rectangle relative to the application's (0,0) position, which is at the top left-hand corner of the base canvas by default.</p>
          <pre class="prettyprint linenums:1">
//get the x-coordinate of the left side of a rectangle
var left = rect.left();</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>