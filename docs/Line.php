<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Line';
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
/* iioEngine_docs-Line */
google_ad_slot = "8962772737";
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
        <h1>Line</h1>
        <h4>Extends :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a line with two coordinates The position vector <span class="kwd">pos</span> and <span class="kwd">endPos</span>.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Line</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
          <h3><span class="kwd">iio</span>.Line( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func"><span class="kwd">iio</span>.Line( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
          <h3 class="func"><span class="kwd">iio</span>.Line( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="Vec.php#vector">Vector</a> v2 )</h3>
          <h3 class="func"><span class="kwd">iio</span>.Line( <a class="red" href="Vec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2 )</h3>
          <p>- Creates a line starting at the first given vector and ending at the second given vector. The default value for any undefined coordinate is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
var l1 = new iio.Line();

var l2 = new iio.Line(0,0,io.canvas.width,io.canvas.height);

var topRight = new iio.Vec(io.canvas.width,0);
var l3 = new iio.Line(topRight,io.canvas.center);

var l4 = new iio.Line(0,io.canvas.height,topRight);

var l5 = new iio.Line(io.canvas.center,0,0);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>Line :: <a href="Obj.php#properties">Obj</a></h4>
          <?php include('shared/Obj-properties.php'); ?>
      </div>
      <?php include('shared/Obj-graphics-props.php'); ?>
          </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">Line</a> class.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="endPos">&nbsp;</a> 
          <h3>.endPos :: <a href="Vec.php">Vec</a></h3>
          <p>- the end position of this line.</p>
          <pre class="prettyprint linenums:1">
//get a line's endPos
var end = line.endPos;</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>Line :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
          <?php include('shared/Obj-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); ?>
        </div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">Line</a> class, and available to all instantiated <a href="">Line</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">Line</a></h5>
          <p>- returns a new <a href="">Line</a> with the same properties as this one. Makes a hard copy of the object.</p>
         <pre class="prettyprint linenums:1">
//clone a line
var lineClone = line.clone();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="set">&nbsp;</a> 
          <h3>.set</span>( <a href="">Line</a> line )</h3>
          <h3 class="func">.set</span>( <a class="red" href="Vec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">.set</span>( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets this line's start and end positions to the given coordinates.</p>
          <pre class="prettyprint linenums:1">
//change a line's position properties
line.set(10,10,50,50);</pre>
        </div>
       <div class="docs-inner">
        <a class="anchor inner-anchor" name="setEndPos">&nbsp;</a> 
          <h3>.setEndPos</span>( <a class="red" href="Vec.php#vector">Vector</a> point )</h3>
          <h3 class="func">.setEndPos</span>( <?php echo $NumberLink ?>: x, y )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets the end position of this line to the given vector.</p>
          <pre class="prettyprint linenums:1">
//change a line's end position
line.set(50,50);

//change it again
line.set(io.canvas.center);</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>