<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'XShape';
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
/* iioEngine_docs-XShape */
google_ad_slot = "5730104736";
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
        <h1>XShape</h1>
        <h4>Extends :: <a href="SimpleRect.php">SimpleRect</a> :: <a href="Shape.php">Shape</a> :: <a href="Obj.php">Obj</a></h4>
        <p>Essentially, all this class does is provide a class so that the Graphics Engine can override SimpleRect's <a href="graphics-engine.php#draw">draw</a> function to draw an x-shape instead of a rectangle.</p>
        <p>Therefore, although this class inherits all the shape and image graphics properties, none of them can be used.</p>
        <p>Think of this class as extending a line when it comes to rendering.</p>
        <p>Kinematics are still available though.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">XShape</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="XShape1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.XShape</span>( <a class="red" href="Vec.php#vector">Vector</a> position, <?php echo $NumberLink?>: width, height )</h3>
         <h3 class="func" style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.XShape</span>( <?php echo $NumberLink?> x, y, width, height )</h3>
          <p>- creates a x-shape with the given position and dimensions. If the <span class="kwd">height</span> is omitted, a square x-shape will be created with the <span class="kwd">width</span> as its size.</p>
          <p>- The default value for all parameters is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
//create a 60x60 x-shape at canvas center
var squareX = new iio.XShape(io.canvas.center,60);

//create a 40x60 x-shape at 0,0
var x = new iio.XShape(0,0,40,60);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>XShape :: <a href="SimpleRect.php#properties">SimpleRect</a> :: <a href="Shape.php#properties">Shape</a> :: <a href="Obj.php#properties">Obj</a></h4>
        <?php include('shared/Obj-properties.php');     
        include('shared/SimpleRect-properties.php'); ?>
      </div>
          <?php include('shared/Obj-graphics-props.php');
                include('shared/Shape-graphics-props.php');?>
        </div>
      </div>
      <?php include('shared/kinematics-props.php'); ?>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>XShape :: <a href="SimpleRect.php#functions">SimpleRect</a> :: <a href="Shape.php#functions">Shape</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
        <?php include('shared/Obj-functions.php'); 
         include('shared/SimpleRect-functions.php'); ?>
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
        <p>These functions are added by the <a href="">XShape</a> class, and available to all instantiated <a href="">XShape</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">XShape</a></h5>
          <p>- returns a new <a href="">XShape</a> with the same properties as this one. Makes a hard copy of the object.</p>
         <pre class="prettyprint linenums:1">
//clone an x-shape
var x2 = x.clone();</pre>
        </div>
      </div>
<?php include('inc/footer.php'); ?>
    </section>
</div>