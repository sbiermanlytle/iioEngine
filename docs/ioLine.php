<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'ioLine';
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
/* iioEngine_docs-ioLine */
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
        <h1>ioLine</h1>
        <h4>Extends :: <a href="ioObj.php">ioObj</a></h4>
        <p>A class that defines a line with two coordinates The position vector <span class="kwd">pos</span> and <span class="kwd">endPos</span>.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package. You can create a local variable to make it directly accessible. All the code samples on this page assume the existence of a local declaration.</p>
        <pre class="prettyprint linenums:1">
//use ioLine without local declaration
var line = new iio.ioLine(10,10,40,50);

//local declaration
var ioLine = iio.ioLine;

//use ioLine with local declaration
var line = new ioLine(10,10,40,50);</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">ioLine</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
          <h3>ioLine( <a class="red" href="ioVec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">ioLine( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
          <h3 class="func">ioLine( <?php echo $NumberLink ?>: x1, y1, <a class="red" href="ioVec.php#vector">Vector</a> v2 )</h3>
          <h3 class="func">ioLine( <a class="red" href="ioVec.php#vector">Vector</a> v1, <?php echo $NumberLink ?>: x2, y2 )</h3>
          <p>- Creates a line starting at the first given vector and ending at the second given vector. The default value for any undefined coordinate is <span class="kwd">0</span>.</p>
          <pre class="prettyprint linenums:1">
var l1 = new ioLine();

var l2 = new ioLine(0,0,io.canvas.width,io.canvas.height);

var topRight = new ioVec(io.canvas.width,0);
var l3 = new ioLine(topRight,io.canvas.center);

var l4 = new ioLine(0,io.canvas.height,topRight);

var l5 = new ioLine(io.canvas.center,0,0);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>ioLine :: <a href="ioObj.php#properties">ioObj</a></h4>
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
          <h3 class="func">.<a class="kwd" href="graphics-engine.php#style-properties">styles</a>.<a href="graphics-engine.php#shadow">shadow</a> :: Object</h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">ioLine</a> class.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="endPos">&nbsp;</a> 
          <h3>.endPos :: <a href="ioVec.php">ioVec</a></h3>
          <p>- the end position of this line.</p>
          <pre class="prettyprint linenums:1">
//get a line's endPos
var end = line.endPos;</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>ioLine :: <a href="ioObj.php#functions">ioObj</a></h4>
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
          <h3 class="func">.<a href="graphics-engine.php#setStrokeStyle">setStrokeStyle</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setLineWidth">setLineWidth</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadow">setShadow</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowColor">setShadowColor</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowBlur">setShadowBlur</a></h3>
          <h3 class="func">.<a href="graphics-engine.php#setShadowOffset">setShadowOffset</a></h3>
        </div>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">ioLine</a> class, and available to all instantiated <a href="">ioLine</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">ioLine</a></h5>
          <p>- returns a new <a href="">ioLine</a> with the same properties as this one. Makes a hard copy of the object.</p>
         <pre class="prettyprint linenums:1">
//clone a line
var lineClone = line.clone();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="set">&nbsp;</a> 
          <h3>.set</span>( <a href="">ioLine</a> line )</h3>
          <h3 class="func">.set</span>( <a class="red" href="ioVec.php#vector">Vector</a>: v1, v2 )</h3>
          <h3 class="func">.set</span>( <?php echo $NumberLink ?>: x1, y1, x2, y2 )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets this line's start and end positions to the given coordinates.</p>
          <pre class="prettyprint linenums:1">
//change a line's position properties
line.set(10,10,50,50);</pre>
        </div>
       <div class="docs-inner">
        <a class="anchor inner-anchor" name="setEndPos">&nbsp;</a> 
          <h3>.setEndPos</span>( <a class="red" href="ioVec.php#vector">Vector</a> point )</h3>
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