<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'ioPoly';
  include('inc/docsGlobals.php');
	include('inc/preHeader.php');
	include('inc/header.php');
  	include('pan/ioObjsPan.php');
?>
	<section class="container right-container top docs">
        <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-ioPoly */
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
        <h1>ioPoly</h1>
        <h4>Extends :: <a href="ioShape.php">ioShape</a> :: <a href="ioObj.php">ioObj</a></h4>
        <p>A class that defines a polygon with a set of vertices. These vertices can be relative to a polygon's centroid, or relative to canvas (0,0), depending on how you instantiate it.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package. You can create a local variable to make it directly accessible. All the code samples on this page assume the existence of a local declaration.</p>
        <pre class="prettyprint linenums:1">
//use ioPoly without local declaration
var poly = new iio.ioPoly([-30,30
                           ,50,50
                           ,0,-30]);

//local declaration
var ioPoly = iio.ioPoly;

//use ioPoly with local declaration
var poly = new ioPoly(10,10,[-30,30
                             ,50,50
                             ,0,-30]);</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">ioPoly</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="ioPoly1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;">ioPoly</span>( <?php echo $ArrayLink?> vertices )</h3>
         <p>- creates a polygon with the given with the vertices. The vertices will be treated as absolute canvas positions (relative to canvas 0,0).</p>
         <p>- the array of vertices should be a list of coordinates, defined either in x,y coordinates, or as a <a class="red" href="ioVec.php#vector">Vector</a>.</p>
          <pre class="prettyprint linenums:1">
//create a triangle 
var poly = new ioPoly([io.canvas.center,
                      ,50,50
                      ,200,0]);</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="ioPoly2">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;">ioPoly</span>( <a class="red" href="ioVec.php#vector">Vector</a> position, <?php echo $ArrayLink?> vertices )</h3>
         <h3 class="func" style="padding-left:71px"><span style="margin-left:-71px;">ioPoly</span>( <?php echo $NumberLink?>: x, y, <?php echo $ArrayLink?> vertices )</h3>
          <p>- creates a polygon with the given vertices. The vertices will be treated as relative to the given position.</p>
          <pre class="prettyprint linenums:1">
//create a polygon with vertices relative
//to canvas center
var polygon = new ioPoly(io.canvas.center,
                            ,[-30,30
                              ,50,50
                              ,0,-30]));</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>ioPoly :: <a href="ioShape.php#properties">ioShape</a> :: <a href="ioObj.php#properties">ioObj</a></h4>
        <div class="docs-inner">
          <h3>ioObj.<a href="ioObj.php#pos">pos</a> :: <a href="ioVec.php">ioVec</a></h3>
          <h3 class="func">ioObj.<a href="ioObj.php#rotation">rotation</a> :: <?php echo $NumberLink ?></h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="graphics-properties">&nbsp;</a> 
        <h2>Graphics Properties</h2>
        <p>The following properties can are attached by the <a href="graphics-engine.php">iio Graphics Engine</a>. Note that these properties are <span class="kwd">'undefined'</span> by default, so you must define them with their <a href="graphics-functions">set functions</a> or set their values directly.</p>
        <div class="docs-inner">
          <h3>.<a class="kwd" href="graphics-engine.php#style-properties">styles</a>.<a href="graphics-engine.php#strokeStyle">strokeStyle</a> :: Color||Pattern||Gradient</h3>
          <h3 class="func">.<a class="kwd" href="graphics-engine.php#style-properties">styles</a>.<a href="graphics-engine.php#lineWidth">lineWidth</a> :: <?php echo $NumberLink ?></h3>
          <h3 class="func">.<a class="kwd" href="graphics-engine.php#style-properties">styles</a>.<a href="graphics-engine.php#fillStyle">fillStyle</a> :: Color||Pattern||Gradient</h3>
          <h3 class="func">.<a class="kwd" href="graphics-engine.php#style-properties">styles</a>.<a href="graphics-engine.php#shadow">shadow</a> :: Object</h3>
          <h3 class="func">.<a href="graphics-engine.php#img">img</a> :: <a target="_new" href="http://www.w3schools.com/jsref/dom_obj_image.asp">Image</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#anims">anims</a> :: <?php echo $ArrayLink ?></h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="kinematics-properties">&nbsp;</a> 
        <h2>Kinematics Properties</h2>
        <p>The following properties can are attached by the <a href="kinematics-engine.php">iio Kinematics Engine</a>. Note that these properties are <span class="kwd">'undefined'</span> by default, so you must define them with their <a href="kinematics-functions">set functions</a> or set their values directly.</p>
        <div class="docs-inner">
          <h3>.<a href="kinematics-engine.php#vel">vel</a> :: <a href="ioVec.php">ioVec</a></h3>
          <h3 class="func">.<a href="kinematics-engine.php#torque">torque</a> :: <?php echo $NumberLink ?></h3>
          <h3 class="func">.<a href="kinematics-engine.php#shrinkRate">shrinkRate</a> :: <?php echo $NumberLink ?></h3>
          <h3 class="func">.<a href="kinematics-engine.php#bounds">bounds</a> :: Object</h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">ioPoly</a> class.</p>
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
          <pre class="prettyprint linenums:1">
var OTL = polygon.originToLeft;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="originToTop">&nbsp;</a> 
          <h3>.originToTop :: <?php echo $NumberLink ?></h3>
          <p>- the vertical distance from this polygon's centroid to its top-most coordinate, measured in pixels.</p>
          <pre class="prettyprint linenums:1">
var OTT = polygon.originToTop;</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>ioPoly :: <a href="ioShape.php#functions">ioShape</a> :: <a href="ioObj.php#functions">ioObj</a></h4>
        <div class="docs-inner">
          <h3>ioObj.<a href="ioObj.php#setPos">setPos</a></h3>
          <h3 class="func">ioObj.<a href="ioObj.php#translate">translate</a></h3>
          <h3 class="func">ioObj.<a href="ioObj.php#rotate">rotate</a></h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="graphics-functions">&nbsp;</a> 
        <h2>Graphics Functions</h2>
        <p>The following functions can are attached by the <a href="graphics-engine.php">iio Graphics Engine</a>.</p>
        <div class="docs-inner">
          <h3>.<a href="graphics-engine.php#draw">draw</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#clearDraw">clearDraw</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setStrokeStyle">setStrokeStyle</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setLineWidth">setLineWidth</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setFillStyle">setFillStyle</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadow">setShadow</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowColor">setShadowColor</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowBlur">setShadowBlur</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowOffset">setShadowOffset</a></h3>

          <h3 class="func">.<a href="graphics-engine.php#addImage">addImage</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#addAnim">addAnim</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#createWithImage">createWithImage</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#createWithAnim">createWithAnim</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgOffset">setImgOffset</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgSize">setImgSize</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgScale">setImgScale</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setImgRotation">setImgRotation</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setAnimFrame">setAnimFrame</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#nextAnimFrame">nextAnimFrame</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setPolyDraw">setPolyDraw</a></h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="kinematics-functions">&nbsp;</a> 
        <h2>Kinematics Functions</h2>
        <p>The following functions can are attached by the <a href="kinematics-engine.php">iio Kinematics Engine</a>. Note that you must call the <a href="kinematics-engine.php#enableKinematics">enableKinematics</a> function before you can utilize any of these functions.</p>
        <div class="docs-inner">
          <h3>.<a href="kinematics-engine.php#enableKinematics">enableKinematics</a></h3>
          <h3 class="func">.<a href="kinematics-engine.php#update">update</a></h3>
          <h3 class="func">.<a href="kinematics-engine.php#setVel">setVel</a></h3>
          <h3 class="func">.<a href="kinematics-engine.php#setTorque">setTorque</a></h3>
          <h3 class="func">.<a href="kinematics-engine.php#setBound">setBound</a></h3>
          <h3 class="func">.<a href="kinematics-engine.php#setBounds">setBounds</a></h3>
        </div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">ioPoly</a> class, and available to all instantiated <a href="">ioPoly</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">ioPoly</a></h5>
          <p>- returns a new <a href="">ioPoly</a> with the same properties as this one. Makes a hard copy of the object.</p>
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