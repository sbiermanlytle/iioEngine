<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Circle';
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
/* iioEngine_docs-circle */
google_ad_slot = "6009306334";
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
        <h1>Circle</h1>
        <h4>Extends :: <a href="Shape.php">Shape</a> :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a circle with a position and a radius. The position vector <span class="kwd">pos</span> is at the center of the circle.</p>
        <p>This class must be accessed through the <span class="kwd">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Circle</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Circle1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Circle</span>( <a class="red" href="Vec.php#vector">Vector</a> position, <?php echo $NumberLink?> radius )</h3>
         <h3 class="func" style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Circle</span>( <?php echo $NumberLink?> x, y, radius )</h3>
          <p>- creates a circle with the given position and radius. The default value for all parameters is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
//create a circle at canvas center
//with a 40px radius
var circle = new iio.Circle(io.canvas.center,40);

//create a circle at 20,40
//with a 40px radius
var circle = new iio.Circle(20,40,40);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>Circle :: <a href="Shape.php#properties">Shape</a> :: <a href="Obj.php#properties">Obj</a></h4>
          <?php include('shared/Obj-properties.php'); ?>
      </div>
      <?php include('shared/Obj-graphics-props.php');
            include('shared/Shape-graphics-props.php');
            include('shared/Circle-graphics-props.php');?>
        </div>
      </div>
      <?php include('shared/kinematics-props.php'); ?>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">Circle</a> class.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="radius">&nbsp;</a> 
          <h3>.radius :: <?php echo $NumberLink ?></h3>
          <p>- the radius of this circle, measured in pixels.</p>
          <pre class="prettyprint linenums:1">
//get a circle's radius
var r = circle.radius;</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>Circle :: <a href="Shape.php#functions">Shape</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
      <?php include('shared/Obj-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); 
            include('shared/Circle-graphics-fns.php'); 
            include('shared/Shape-graphics-fns.php'); ?>
        </div>
      </div>
      <?php include('shared/kinematics-fns.php'); ?>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">Circle</a> class, and available to all instantiated <a href="">Circle</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">Circle</a></h5>
          <p>- returns a new <a href="">Circle</a> with the same properties as this one. Makes a hard copy of the object.</p>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="setRadius">&nbsp;</a> 
          <h3>.setRadius</span>( <?php echo $NumberLink ?> radius )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets this circles radius to the given value. The default value for <span class="kwd">radius</span> is <span class="kwd">0</span></p>
          <pre class="prettyprint linenums:1">
//change the radius of a circle
circle.setRadius(20);</pre>
        </div>
       <div class="docs-inner">
        <a class="anchor inner-anchor" name="contains">&nbsp;</a> 
          <h3>.contains</span>( <a class="red" href="Vec.php#vector">Vector</a> point )</h3>
          <h3 class="func">.contains</span>( <?php echo $NumberLink ?>: x, y )</h3>
        <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the given point is inside this circle. Returns false otherwise.</p>
          <pre class="prettyprint linenums:1">
//alert when a circle is clicked
io.canvas.addEventListener('mousedown', function(event){
    if (circle.contains(io.getEventPosition(event)))
      alert('you clicked the circle');
});</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>