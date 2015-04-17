<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Poly';
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
/* iioEngine_docs-Poly */
google_ad_slot = "7346438734";
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
        <h1>Poly</h1>
        <h4>Extends :: <a href="Shape.php">Shape</a> :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a polygon with a set of vertices. These vertices can be relative to a polygon's centroid, or relative to canvas (0,0), depending on how you instantiate it.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Poly</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Poly1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Poly</span>( <?php echo $ArrayLink?> vertices )</h3>
         <p>- creates a polygon with the given with the vertices. The vertices will be treated as absolute canvas positions (relative to canvas 0,0).</p>
         <p>- the array of vertices should be a list of coordinates, defined either in x,y coordinates, or as a <a class="red" href="ioVec.php#vector">Vector</a>.</p>
          <pre class="prettyprint linenums:1">
//create a triangle 
var poly = new iio.Poly([io.canvas.center,
                      ,50,50
                      ,200,0]);</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Poly2">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Poly</span>( <a class="red" href="ioVec.php#vector">Vector</a> position, <?php echo $ArrayLink?> vertices )</h3>
         <h3 class="func" style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Poly</span>( <?php echo $NumberLink?>: x, y, <?php echo $ArrayLink?> vertices )</h3>
          <p>- creates a polygon with the given vertices. The vertices will be treated as relative to the given position.</p>
          <pre class="prettyprint linenums:1">
//create a polygon with vertices relative
//to canvas center
var polygon = new iio.Poly(io.canvas.center,
                            ,[-30,30
                              ,50,50
                              ,0,-30]));</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>Poly :: <a href="Shape.php#properties">Shape</a> :: <a href="Obj.php#properties">Obj</a></h4>
        <?php include('shared/Obj-properties.php'); ?>
      </div>
      <?php include('shared/Obj-graphics-props.php');
            include('shared/Shape-graphics-props.php'); ?>
          </div>
      </div>
      <?php include('shared/kinematics-props.php'); ?>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">Poly</a> class.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="vertices">&nbsp;</a> 
          <h3>.vertices :: <?php echo $ArrayLink ?></h3>
          <p>- the vertices of this polygon.</p>
          <pre class="prettyprint linenums:1">
//get a polygon's vertices
var w = poly.vertices;

//get a polygon's second vertex
var v = poly.vertices[1];</pre>
        </div>
       <div class="docs-inner">
         <a class="anchor inner-anchor" name="width">&nbsp;</a> 
          <h3>.width :: <?php echo $NumberLink ?></h3>
          <p>- the width of this polygon, measured in pixels.</p>
          <pre class="prettyprint linenums:1">
//get a polygon's width
var w = polygon.width;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="height">&nbsp;</a> 
          <h3>.height :: <?php echo $NumberLink ?></h3>
          <p>- the height of this polygon, measured in pixels.</p>
          <pre class="prettyprint linenums:1">
//get a polygon's height
var h = polygon.height;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="originToLeft">&nbsp;</a> 
          <h3>.originToLeft :: <?php echo $NumberLink ?></h3>
          <p>- the horizontal distance from this polygon's centroid to its left-most coordinate, measured in pixels.</p>
          <p>- note that this value gets set once on object creation, and does not take rotation into account.</p>
          <pre class="prettyprint linenums:1">
var OTL = polygon.originToLeft;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="originToTop">&nbsp;</a> 
          <h3>.originToTop :: <?php echo $NumberLink ?></h3>
          <p>- the vertical distance from this polygon's centroid to its top-most coordinate, measured in pixels.</p>
          <p>- note that this value gets set once on object creation, and does not take rotation into account.</p>
          <pre class="prettyprint linenums:1">
var OTT = polygon.originToTop;</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>Poly :: <a href="Shape.php#functions">Shape</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
          <?php include('shared/Obj-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); ?>
        </div>
      </div>
      <?php include('shared/kinematics-fns.php'); ?>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">Poly</a> class, and available to all instantiated <a href="">Poly</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">Poly</a></h5>
          <p>- returns a new <a href="">Poly</a> with the same properties as this one. Makes a hard copy of the object.</p>
        </div>
       <div class="docs-inner">
        <a class="anchor inner-anchor" name="contains">&nbsp;</a> 
          <h3>.contains</span>( <a class="red" href="ioVec.php#vector">Vector</a> point )</h3>
          <h3 class="func">.contains</span>( <?php echo $NumberLink ?>: x, y )</h3>
        <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the given point is inside this polygon. Returns false otherwise.</p>
          <pre class="prettyprint linenums:1">
//alert when a polygon is clicked
io.canvas.addEventListener('mousedown', function(event){
    if (polygon.contains(io.getEventPosition(event)))
      alert('you clicked the polygon');
});</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="getTrueVertices">&nbsp;</a> 
          <h3>.getTrueVertices</span>()</h3>
         <h5>:: Returns <?php echo $ArrayLink ?></h5>
          <p>- returns an array with vertices that account for object rotation and are relative to canvas 0,0.</p>
          <pre class="prettyprint linenums:1">//get vertices relative to poly center
var relativeVertices = poly.vertices;

//get true poly vertices
var trueVertices = poly.getTrueVertices();</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>