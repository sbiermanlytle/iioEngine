<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Rect';
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
/* iioEngine_docs-Rect */
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
        <h1>Rect</h1>
        <h4>Extends :: <a href="Poly.php">Poly</a> :: <a href="Shape.php">Shape</a> :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a rectangle with a position and 4 corner vertices. The position vector <span class="kwd">pos</span> is at the center of the rectangle.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Rect</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="Rect1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Rect</span>( <a class="red" href="ioVec.php#vector">Vector</a> position, <?php echo $NumberLink?>: width, height )</h3>
         <h3 class="func" style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.Rect</span>( <?php echo $NumberLink?> x, y, width, height )</h3>
          <p>- creates a rectangle with the given position and dimensions. If the <span class="kwd">height</span> is omitted, a square will be created with the <span class="kwd">width</span> as its size.</p>
          <p>- The default value for all parameters is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
//create a 60x60 square at canvas center
var square = new iio.Rect(io.canvas.center,60);

//create a 40x60 rectangle at 0,0
var rect = new iio.Rect(0,0,40,60);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>Rect :: <a href="Poly.php">Poly</a> :: <a href="Shape.php#properties">Shape</a> :: <a href="Obj.php#properties">Obj</a></h4>
        <?php include('shared/Obj-properties.php');
              include('shared/Poly-properties.php'); ?>
      </div>
      <?php include('shared/Obj-graphics-props.php');
            include('shared/Shape-graphics-props.php'); ?>
          </div>
      </div>
      <?php include('shared/kinematics-props.php'); ?>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>Rect :: <a href="Poly.php#functions">Poly</a> :: <a href="Shape.php#functions">Shape</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
          <?php include('shared/Obj-functions.php');
               include('shared/Poly-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); ?>
        </div>
      </div>
      <?php include('shared/kinematics-fns.php'); ?>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">Rect</a> class, and available to all instantiated <a href="">Rect</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">Rect</a></h5>
          <p>- returns a new <a href="">Rect</a> with the same properties as this one. Makes a hard copy of the object.</p>
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
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>