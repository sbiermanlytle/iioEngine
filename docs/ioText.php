<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'ioText';
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
/* iioEngine_docs-ioText */
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
        <h1>ioText</h1>
        <h4>Extends :: <a href="ioObj.php">ioObj</a></h4>
        <p>A class that defines a text object with a position vector and style properties.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package. You can create a local variable to make it directly accessible. All the code samples on this page assume the existence of a local declaration.</p>
        <pre class="prettyprint textnums:1">
//use ioText without local declaration
var text = new iio.ioText();

//local declaration
var ioText = iio.ioText;

//use ioText with local declaration
var text = new ioText();</pre>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">ioText</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
          <h3>ioText( <?php echo $StringLink ?> text, <a class="red" href="ioVec.php#vector">Vector</a> pos )</h3>
          <h3 class="func">ioText( <?php echo $StringLink ?> text, <?php echo $NumberLink ?>: x, y )</h3>
          <p>- creates a text object at the specified position with the given string.</p>
          <pre class="prettyprint textnums:1">
//create text that says 'hello iio' at canvas center
var text = new ioText('hello iio', io.canvas.center);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>ioText :: <a href="ioShape.php#properties">ioShape</a> :: <a href="ioObj.php#properties">ioObj</a></h4>
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
          <h3 class="func">.<a href="kinematics-engine.php#bounds">bounds</a> :: Object</h3>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">ioText</a> class. These properties will always exist for an instantiated <a href="">ioText</a> object.</p>
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
        <h4>ioText :: <a href="ioShape.php#functions">ioShape</a> :: <a href="ioObj.php#functions">ioObj</a></h4>
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
        <p>These functions are added by the <a href="">ioText</a> class, and available to all instantiated <a href="">ioText</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">ioText</a></h5>
          <p>- returns a new <a href="">ioText</a> object with the same properties as this one. Makes a hard copy of the object.</p>
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