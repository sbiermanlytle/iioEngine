<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Text';
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
/* iioEngine_docs-Text */
google_ad_slot = "2776638339";
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
        <h1>Text</h1>
        <h4>Extends :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a text object with a position vector and style properties.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Text</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
          <h3>Text( <?php echo $StringLink ?> text, <a class="red" href="ioVec.php#vector">Vector</a> pos )</h3>
          <h3 class="func">Text( <?php echo $StringLink ?> text, <?php echo $NumberLink ?>: x, y )</h3>
          <p>- creates a text object at the specified position with the given string.</p>
          <pre class="prettyprint textnums:1">
//create text that says 'hello iio' at canvas center
var text = new iio.Text('hello iio', io.canvas.center);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>Text :: <a href="ioShape.php#properties">ioShape</a> :: <a href="Obj.php#properties">Obj</a></h4>
        <div class="docs-inner">
          <h3>Obj.<a href="Obj.php#pos">pos</a> :: <a href="ioVec.php">ioVec</a></h3>
          <h3 class="func">Obj.<a href="Obj.php#rotation">rotation</a> :: <?php echo $NumberLink ?></h3>
        </div>
      </div>
      <?php include('shared/Obj-graphics-props.php'); ?>
          <h3 class="func">.<a class="kwd" href="graphics-engine.php#style-properties">styles</a>.<a href="graphics-engine.php#fillStyle">fillStyle</a> :: Color||Pattern||Gradient</h3>
        </div>
      </div>
      <?php include('shared/kinematics-props.php'); ?>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">Text</a> class. These properties will always exist for an instantiated <a href="">Text</a> object.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="text">&nbsp;</a> 
          <h3>.text :: <?php echo $StringLink ?></h3>
          <p>- the text of this text object.</p>
          <pre class="prettyprint linenums:1">
//get a text object's text
var message = text.text;

//set a text object's message directly
text.text = 'new message'; </pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="font">&nbsp;</a> 
          <h3>.font :: <?php echo $StringLink ?></h3>
          <p>- the font and font size of this text object.</p>
          <pre class="prettyprint linenums:1">
//get a text object's font
var f = text.font;

//set font directly
text.font = '30px Arial';</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="textAlign">&nbsp;</a> 
          <h3>.textAlign :: <?php echo $StringLink ?></h3>
          <p>- the alignment of this text object. Possible values are <span class="kwd">'center'</span>, <span class="kwd">'right'</span>, and <span class="kwd">'left'</span>. The default value is <span class="kwd">'left'</span>.</p>
          <pre class="prettyprint linenums:1">
//get a text object's textAlign
var f = text.textAlign;

//set the text aligment
text.textAlign = 'center';</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>Text :: <a href="ioShape.php#functions">ioShape</a> :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
        <?php include('shared/Obj-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); ?>
      <h3 class="func">.<a href="graphics-engine.php#setFillStyle">setFillStyle</a></h3>
        </div>
      </div>
      <?php include('shared/kinematics-fns.php'); ?>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">Text</a> class, and available to all instantiated <a href="">Text</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">Text</a></h5>
          <p>- returns a new <a href="">Text</a> object with the same properties as this one. Makes a hard copy of the object.</p>
           <pre class="prettyprint linenums:1">
//clone a text object
var t2 = text.clone();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="setText">&nbsp;</a> 
          <h3>.setText</span>( <?php echo $StringLink?> text )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets the text of this text object to the given message.</p>
          <pre class="prettyprint linenums:1">
//change the text
text.setText('new text');</pre>
        </div>
                <div class="docs-inner">
        <a class="anchor inner-anchor" name="setFont">&nbsp;</a> 
          <h3>.setFont</span>( <?php echo $StringLink?> text )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets the font and font size of this text object.</p>
          <pre class="prettyprint linenums:1">
//change the font and size
text.setFont('30px Consolas');</pre>
        </div>
          <div class="docs-inner">
        <a class="anchor inner-anchor" name="setTextAlign">&nbsp;</a> 
          <h3>.setTextAlign</span>( <?php echo $StringLink?> text )</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- sets the text alignment of this text object. Possible values are <span class="kwd">'center'</span>, <span class="kwd">'right'</span>, and <span class="kwd">'left'</span>.  The default value is <span class="kwd">'left'</span>.</p>
          <pre class="prettyprint linenums:1">
//change the text
text.setTextAlign('center');</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>