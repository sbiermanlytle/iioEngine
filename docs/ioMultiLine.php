<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'ioMultiLine';
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
/* iioEngine_docs-ioMultiLine */
google_ad_slot = "1439505937";
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
        <h1>ioMultiLine</h1>
        <h4>Extends :: <a href="ioLine.php">ioLine</a> :: <a href="ioObj.php">ioObj</a></h4>
        <p>A class that defines a multi-line object with a set of vertices. These vertices are relative to canvas (0,0).</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package. You can create a local variable to make it directly accessible. All the code samples on this page assume the existence of a local declaration.</p>
        <pre class="prettyprint linenums:1">
//use ioMultiLine without local declaration
var mL = new iio.ioMultiLine([-30,30
                           ,50,50
                           ,0,-30]);

//local declaration
var ioMultiLine = iio.ioMultiLine;

//use ioMultiLine with local declaration
var mL = new ioMultiLine(10,10,[-30,30
                             ,50,50
                             ,0,-30]);</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructor">&nbsp;</a> 
        <h2>Constructor</h2>
        <p>This function is used to instantiate new instances of the <a href="">ioMultiLine</a> class. It must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="ioMultiLine1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;">ioMultiLine</span>( <?php echo $ArrayLink?> vertices )</h3>
         <p>- creates a multi-line with the given with the vertices. The vertices will be treated as absolute canvas positions (relative to canvas 0,0).</p>
         <p>- the array of vertices should be a list of coordinates, defined either in x,y coordinates, or as a <a class="red" href="ioVec.php#vector">Vector</a>.</p>
          <pre class="prettyprint linenums:1">
//create two connected lines 
var poly = new ioMultiLine([io.canvas.center,
                      ,50,50
                      ,200,0]);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>ioMultiLine :: <a href="ioLine.php#properties">ioLine</a> :: <a href="ioObj.php#properties">ioObj</a></h4>
        <div class="docs-inner">
          <h3>ioLine.<a href="ioLine.php#endPos">endPos</a> :: <a href="ioVec.php">ioVec</a></h3>
        </div>
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
        <p>The new data added by the <a href="">ioMultiLine</a> class.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="vertices">&nbsp;</a> 
          <h3>.vertices :: <?php echo $ArrayLink ?></h3>
          <p>- the vertices of this multi-line.</p>
          <pre class="prettyprint linenums:1">
//get a multi-line's vertices
var vs = multiLine.vertices;

//get a multi-line's second vertex
var v = multiLine.vertices[1];</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>ioMultiLine :: <a href="ioLine.php#functions">ioLine</a> :: <a href="ioObj.php#functions">ioObj</a></h4>
        <div class="docs-inner">
          <h3>ioLine.<a href="ioLine.php#set">set</a></h3>
          <h3 class="func">ioLine.<a href="ioLine.php#setEndPos">setEndPos</a></h3>
        </div>
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
        <p>These functions are added by the <a href="">ioMultiLine</a> class, and available to all instantiated <a href="">ioMultiLine</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">ioMultiLine</a></h5>
          <p>- returns a new <a href="">ioMultiLine</a> with the same properties as this one. Makes a hard copy of the object.</p>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>