<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'MultiLine';
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
/* iioEngine_docs-MultiLine */
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
        <h1>MultiLine</h1>
        <h4>Extends :: <a href="Line.php">Line</a> :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a multi-line object with a set of vertices. These vertices are relative to canvas (0,0).</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructor">&nbsp;</a> 
        <h2>Constructor</h2>
        <p>This function is used to instantiate new instances of the <a href="">MultiLine</a> class. It must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="MultiLine1">&nbsp;</a> 
         <h3 style="padding-left:71px"><span style="margin-left:-71px;"><span class="kwd">iio</span>.MultiLine</span>( <?php echo $ArrayLink?> vertices )</h3>
         <p>- creates a multi-line with the given with the vertices. The vertices will be treated as absolute canvas positions (relative to canvas 0,0).</p>
         <p>- the array of vertices should be a list of coordinates, defined either in x,y coordinates, or as a <a class="red" href="Vec.php#vector">Vector</a>.</p>
          <pre class="prettyprint linenums:1">
//create two connected lines 
var poly = new iio.MultiLine([io.canvas.center,
                      ,50,50
                      ,200,0]);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>MultiLine :: <a href="Line.php#properties">Line</a> :: <a href="Obj.php#properties">Obj</a></h4>
        <?php include('shared/Obj-properties.php'); ?>
        <div class="docs-inner">
          <h3>Line.<a href="Line.php#endPos">endPos</a> :: <a href="Vec.php">Vec</a></h3>
        </div>
      </div>
      <?php include('shared/Obj-graphics-props.php'); ?>
          </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">MultiLine</a> class.</p>
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
        <h4>MultiLine :: <a href="Line.php#functions">Line</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
          <?php include('shared/Obj-functions.php'); ?>
        </div>
        <div class="docs-inner">
          <h3>Line.<a href="Line.php#set">set</a></h3>
          <h3 class="func">Line.<a href="Line.php#setEndPos">setEndPos</a></h3>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); ?>
        </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">MultiLine</a> class, and available to all instantiated <a href="">MultiLine</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">MultiLine</a></h5>
          <p>- returns a new <a href="">MultiLine</a> with the same properties as this one. Makes a hard copy of the object.</p>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>