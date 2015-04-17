<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Graphics';
	include('inc/preHeader.php');
  include('inc/docsGlobals.php');
	include('inc/header.php');
  	include('docsPan.php');
?>
	<section class="container right-container top docs">
        <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-graphics */
google_ad_slot = "7625640330";
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
        <h1 style="margin-bottom:30px;">iio Graphics Engine</h1>
        <p>The properties and functions relating to an objects rendering are not defined within the object itself.</p>
        <p>Instead, these components are attached to the object's class when the iio Engine loads.</p>
        <p>This design enables the iio Graphics Engine to attach itself to classes in non-iio libraries - like <a href="box2d.php">Box2D</a>.</p>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="primary-functions">&nbsp;</a> 
        <h2>Primary Functions</h2>
        <p>Graphics functions are attached to iio and Box2D objects by default.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="draw">&nbsp;</a> 
          <h3>.draw( <span class="red">Canvas2DContext</span> context )</h3>
          <h5>Available to: all iio Objects, b2Joint, b2Body, b2Shape</h5>
          <p>- Draws this object with the given context.</p>
          <pre class="prettyprint linenums:1">
//draw an object with our base canvas's context
obj.draw(io.context);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="clearDraw">&nbsp;</a> 
          <h3>.clearSelf( <span class="red">Canvas2DContext</span> context )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a></h5>
          <p>- Clears this object from the given context (draws a transparent shape in its place).</p>
          <pre class="prettyprint linenums:1">
//clear an object from our canvas
obj.clearSelf(io.context);</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="style-properties">&nbsp;</a> 
        <h2>Style Properties</h2>
        <p>Style properties are stored in a structure called <span class="kwd">styles</span>.</p>
        <p>This structure is attached to iio Objects by default, but must be 'prepped' when used with Box2D.</p>
        <p>The properties that <span class="kwd">styles</span> contains are always left undefined until you call their respective <span class="kwd">set</span> function, or define them directly yourself.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="alpha">&nbsp;</a> 
          <h3><span class="kwd">styles</span>.alpha :: <?php echo $NumberLink ?></h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- The global alpha (opacity) property. The value is between [0,1].</p>
          <p>- This property can be set with the <a href="graphics-engine.php#setAlpha">setAlpha</a> function.</p>
          <pre class="prettyprint linenums:1">
//access the alpha property directly
obj.styles.alpha = 0;

//change the property with its set function
obj.setAlpha(.5);</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="strokeStyle">&nbsp;</a> 
          <h3><span class="kwd">styles</span>.strokeStyle :: Color || Pattern || Gradient</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- The style of this objects stroke. Refer to <a href="http://www.w3schools.com/tags/canvas_strokestyle.asp">w3schools</a> for more information about strokeStyle values.</p>
          <p>- This property can be set with the <a href="graphics-engine.php#setStrokeStyle">setStrokeStyle</a> function.</p>
          <pre class="prettyprint linenums:1">
//access the strokeStyle property directly
obj.styles.strokeStyle = 'red';

//change the property with its set function
obj.setStrokeStyle('red');</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="lineWidth">&nbsp;</a> 
          <h3><span class="kwd">styles</span>.lineWidth :: <?php echo $NumberLink ?></h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- The width of the stroke defined in <a href="graphics-engine.php#strokeStyle">strokeStyle</a>.</p>
          <p>- This property can be set with the <a href="graphics-engine.php#setLineWidth">setLineWidth</a> or the <a href="graphics-engine.php#setStrokeStyle">setStrokeStyle</a> functions.</p>
          <pre class="prettyprint linenums:1">
//access the lineWidth property directly
obj.styles.lineWidth = 4;

//change the property with its set function
obj.setLineWidth(4);

//change the property with setStrokeStyle
obj.setStrokeStyle('red', 4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="fillStyle">&nbsp;</a> 
          <h3><span class="kwd">styles</span>.fillStyle :: Color || Pattern || Gradient</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, <a href="Text.php">Text</a>, b2Shape</h5>
          <p>- The style of this objects fill. Refer to <a href="http://www.w3schools.com/tags/canvas_fillstyle.asp">w3schools</a> for more information about fillStyle values.</p>
          <p>- This property can be set with the <a href="graphics-engine.php#setLineWidth">setFillStyle</a> function.</p>
          <pre class="prettyprint linenums:1">
//access the fillStyle property directly
obj.styles.fillStyle = 'blue';

//change the property with its set function
obj.setFillStyle('blue');</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="shadow">&nbsp;</a> 
          <h3><span class="kwd">styles</span>.shadow :: Object</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- An object that holds all of the styles relating to this objects shadow.</p>
          <p>: <span class="kwd">shadow</span>.shadowColor :: <?php echo $StringLink ?></p>
          <p>: <span class="kwd">shadow</span>.shadowBlur :: <?php echo $NumberLink ?></p>
          <p>: <span class="kwd">shadow</span>.shadowOffset :: <a href="Vec.php">Vec</a></p>
          <p>- These properties all have a respective <span class="kwd">set</span> function, or they can all be set at once by using the <a href="graphics-engine.php#setShadow">setShadow</a> function.</p>
          <pre class="prettyprint linenums:1">
//access the shadow properties directly
obj.styles.shadow.shadowColor = 'blue';
obj.styles.shadow.shadowOffset = new iio.Vec(10,10);

//set properties with their set functions
obj.setShadowBlur(4);
obj.setShadowColor('red');

//set all properties at once
obj.setShadow('rgb(150,150,150)',10,10,4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="refLine">&nbsp;</a> 
          <h3><span class="kwd">styles</span>.refLine :: Object</h3>
          <h5>Available to: <a href="Circle.php">Circle</a>, b2CircleShape</h5>
          <p>- This property activates the drawing of a reference line from the circle's center to its edge at 0 degrees.</p>
          <p>- This properties can be set with the <a href="graphics-engine.php#drawReferenceLine">drawReferenceLine</a> function.</p>
          <pre class="prettyprint linenums:1">
//draw a rotation reference line on the circle
CircleInstance.refLine=true;
//is equivalent to
CircleInstance.drawReferenceLine();

//turn refLine off
CircleInstance.refLine=false;
//is equivalent to
CircleInstance.drawReferenceLine(false);</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="style-functions">&nbsp;</a> 
        <h2>Style Functions</h2>
        <p>Style functions are attached to iio and Box2D objects by default.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="setAlpha">&nbsp;</a> 
          <h3>.setAlpha( <?php echo $NumberLink?> alpha )</h3>
          <p>- sets the global alpha (opacity) for this object.</p>
          <p>- alpha values are in the range [0,1].</p>
          <pre class="prettyprint linenums:1">
//make object transparent
obj.setAlpha(0);

//make object partially transparent
obj.setAlpha(.8);</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="setStrokeStyle">&nbsp;</a> 
          <h3>.setStrokeStyle( Color||Pattern||Gradient style, <?php echo $NumberLink?> width )</h3>
          <p>- sets the strokeStyle and optionally the lineWidth of this object. Refer to <a href="http://www.w3schools.com/tags/canvas_strokestyle.asp">w3schools</a> for more information about strokeStyle values.</p>
          <pre class="prettyprint linenums:1">
//change an objects strokeStyle
obj.setStrokeStyle('red');

//change an objects strokeStyle and lineWidth
obj.setStrokeStyle('red', 4);</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="setLineWidth">&nbsp;</a> 
          <h3>.setLineWidth( <?php echo $NumberLink?> lineWidth )</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- Sets the width this objects stroke.</p>
          <pre class="prettyprint linenums:1">
//change an objects lineWidth
obj.setLineWidth(4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setFillStyle">&nbsp;</a> 
          <h3>.setFillStyle( Color||Pattern||Gradient style )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, <a href="Text.php">Text</a>, b2Shape</h5>
          <p>- Sets the style of this objects fill. Refer to <a href="http://www.w3schools.com/tags/canvas_fillstyle.asp">w3schools</a> for more information about fillStyle values.</p>
          <pre class="prettyprint linenums:1">
//change an objects fillStyle
obj.setFillStyle('blue');</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setShadow">&nbsp;</a> 
          <h3>.setShadow( <?php echo $StringLink ?> color, <a href="Vec.php">Vec</a> offset, <?php echo $NumberLink ?> blur )</h3>
          <h3 class="func">.setShadow( <?php echo $StringLink ?> color, <?php echo $NumberLink ?>: offsetX, offsetY, <?php echo $NumberLink ?> blur )</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- Sets an objects shadow styles.</p>
          <pre class="prettyprint linenums:1">
//set all shadow properties at once
obj.setShadow('rgb(150,150,150)',10,10,4);
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setShadowColor">&nbsp;</a> 
          <h3>.setShadowColor( <?php echo $StringLink ?> color )</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- Sets the color of this objects shadow.</p>
          <pre class="prettyprint linenums:1">
//set an objects shadow color
obj.setShadowColor('red');
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setShadowOffset">&nbsp;</a> 
          <h3>.setShadowOffset( <a href="Vec.php">Vec</a> offset )</h3>
          <h3 class="func">.setShadowOffset( <?php echo $NumberLink ?>: offsetX, offsetY )</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- Sets an objects shadow offset.</p>
          <pre class="prettyprint linenums:1">
//set an objects shadow offset
obj.setShadowOffset(10,10);
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setShadowBlur">&nbsp;</a> 
          <h3>.setShadowBlur( <?php echo $NumberLink ?> blur )</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Joint, b2Shape</h5>
          <p>- Sets this objects shadow blur.</p>
          <pre class="prettyprint linenums:1">
//set an objects shadow blur
obj.setShadowBlur(4);
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="drawReferenceLine">&nbsp;</a> 
          <h3>.drawReferenceLine( <?php echo $BoolLink ?> turnOn )</h3>
          <h5>Available to: <a href="Circle.php">Circle</a>, b2CircleShape</h5>
          <p>- Activates or deactivates the drawing of a reference line from the circle's center to its edge at 0 degrees.</p>
          <p>- <span class="kwd">turnOn</span> is <span class="kwd">true</span> by default.</p>
          <pre class="prettyprint linenums:1">
//draw a rotation reference line on the circle
CircleInstance.drawReferenceLine();

//turn refLine off
CircleInstance.drawReferenceLine(false);
</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="fx-properties">&nbsp;</a> 
        <h2>Effects Properties</h2>
        <p>These properties are undefined until you call an effects function or define them directly yourself.</p>
<div class="docs-inner">
          <a class="inner-anchor" name="fxFade">&nbsp;</a> 
          <h3>fxFade :: Object</h3>
          <h5>Available to: <a href="Obj.php">Obj</a>, b2Shape, b2Joint</h5>
          <p>- an object with properties that control an automated fade in or fade out effect.</p>
          <p>: <span class="kwd">fxFade</span>.rate :: <?php echo $NumberLink ?></p>
          <p>: <span class="kwd">fxFade</span>.alpha :: <?php echo $NumberLink ?> (target alpha value)</p>
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="fx-functions">&nbsp;</a> 
        <h2>Effects Functions</h2>
        <p>Effects functions are attached to iio and Box2d objects by default.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="fade">&nbsp;</a> 
          <h3>.fade( <?php echo $NumberLink ?>: rate, alpha )</h3>
          <h5>Available to: <a href="Shape.php">Obj</a>, b2Shape, b2Joint</h5>
          <p>- starts a fade animation at the given rate. The fade animation will stop when the object's alpha (opacity) reaches the specified value.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="fadeIn">&nbsp;</a> 
          <h3>.fadeIn( <?php echo $NumberLink ?>: rate, alpha )</h3>
          <h5>Available to: <a href="Shape.php">Obj</a>, b2Shape, b2Joint</h5>
          <p>- starts a fade in animation at the given rate. The fade animation will stop when the object's alpha (opacity) reaches the specified value.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="fadeOut">&nbsp;</a> 
          <h3>.fadeOut( <?php echo $NumberLink ?>: rate, alpha )</h3>
          <h5>Available to: <a href="Shape.php">Obj</a>, b2Shape, b2Joint</h5>
          <p>- starts a fade out animation at the given rate. The fade animation will stop when the object's alpha (opacity) reaches the specified value.</p>
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="image-properties">&nbsp;</a> 
        <h2>Image Properties</h2>
        <p>These properties are undefined until you attach an image or define them directly yourself.</p>
<div class="docs-inner">
          <a class="inner-anchor" name="img">&nbsp;</a> 
          <h3>img :: <a href="http://www.w3schools.com/jsref/dom_obj_image.asp">Image</a></h3>
          <h5>Available to: <a href="Obj.php">Shape</a>, b2Shape</h5>
          <p>- A singular image that has been attached to this shape.</p>
          <p>- The iio Graphics engine attaches additional properties to JS Images:</p>
          <p>: <span class="kwd">img</span>.pos :: <a href="Vec.php">Vec</a> (offset relative to objects center)</p>
          <p>: <span class="kwd">img</span>.size :: <a href="Vec.php">Vec</a> (drawing size of the image in pixels)</p>
          <p>: <span class="kwd">img</span>.scale :: <?php echo $NumberLink ?> (the drawing scale of the image)</p>
          <p>: <span class="kwd">img</span>.rotation :: <?php echo $NumberLink ?> (image rotation in radians)</p>
          <p>- Note that these properties do not control the main objects properties - they are all directly applied to the image and relative to the parent shape's properties.</p>
          <p>- These properties all have a respective <span class="kwd">set</span> function.</p>
        </div>
      </div>

            <div class="docs-middle">
         <a class="inner-anchor" name="image-functions">&nbsp;</a> 
        <h2>Image Functions</h2>
        <p>Image functions are attached to iio and Box2D objects by default.</p>
         <div class="docs-inner">
          <a class="inner-anchor" name="addImage">&nbsp;</a> 
          <h3>.addImage( <a href="http://www.w3schools.com/jsref/dom_obj_image.asp">Image</a> img )</h3>
          <h3 class="func">.addImage( <?php echo $StringLink ?> src, <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> onloadCallback )</h3>
          <h5>Available to: <a href="Obj.php">Shape</a>, b2Shape</h5>
          <p>- Attaches a new image to this object.</p>
          <pre class="prettyprint linenums:1">
//load the image
var img = new Image();
img.src = 'myImage.png';

//attach it when its done loading
img.onload = function(){
  shape.addImage(img);
}

//or..

//let iio load the image for us
obj.addImage('myImage.png', function(){
  //do something on load..
});</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="createWithImage">&nbsp;</a> 
          <h3>.createWithImage( <a href="http://www.w3schools.com/jsref/dom_obj_image.asp">Image</a> img )</h3>
          <h3 class="func">.createWithImage( <?php echo $StringLink ?> src, <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> onloadCallback )</h3>
          <h5>Available to: <a href="Obj.php">Rect</a>, <a href="Obj.php">Circle</a></h5>
          <p>- Attaches the given image and sets the objects dimensions to match it.</p>
          <pre class="prettyprint linenums:1">
//load the image
var img = new Image();
img.src = 'myImage.png';

//create a shape with the dimensions
//of our image
var box;
img.onload = function(){
  box = new iio.Rect().createWithImage(img);
}

//or..

//let iio load the image for us
box = new iio.Rect().createWithImage('myImage.png'
  ,function(){
    //do something on load..
   });</pre>
        </div>
<div class="docs-inner">
          <a class="inner-anchor" name="flipImage">&nbsp;</a> 
          <h3>.flipImage( <?php echo $BoolLink ?> yes )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- flips the image along a vertical axis.</p>
          <p>- default value is <span class="kwd">true</span> the first time this function is called, then it acts as a toggle.</p>
          <pre class="prettyprint linenums:1">
//flip image
obj.flipImage();</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setImgOffset">&nbsp;</a> 
          <h3>.setImgOffset( <a href="Vec.php">Vec</a> offset )</h3>
          <h3 class="func">.setImgOffset( <?php echo $NumberLink ?> offsetX, <?php echo $NumberLink ?>, offsetY )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Sets the offset of the attached image.</p>
          <pre class="prettyprint linenums:1">
//change an objects image offset
obj.setImgOffset(20,20);</pre>
        </div>
          <div class="docs-inner">
          <a class="inner-anchor" name="setImgSize">&nbsp;</a> 
          <h3>.setImgSize( <a href="Vec.php">Vec</a> size )</h3>
          <h3 class="func">.setImgSize( <?php echo $NumberLink ?> width, <?php echo $NumberLink ?>, height )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Sets the draw size of the attached image.</p>
          <p>- Note that if <span class="kwd">'native'</span> is passed instead of a vector, the image will draw at its native size.</p>
          <pre class="prettyprint linenums:1">
//change an objects image size
obj.setImgSize(50,50);

//set an objects image size to its
//native resolution
obj.setImgSize('native');</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setImgScale">&nbsp;</a> 
          <h3>.setImgScale( <?php echo $NumberLink ?> scale )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Sets the drawing scale of the attached image.</p>
          <pre class="prettyprint linenums:1">
//make the attached image draw
//at half its true size
obj.setImgScale(0.5);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setImgRotation">&nbsp;</a> 
          <h3>.setImgRotation( <?php echo $NumberLink ?> rotation )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Sets the rotation of the attached image relative to the rotation of the shape.</p>
          <p>- Rotation is measured in radians.</p>
          <pre class="prettyprint linenums:1">
//change an objects image rotation
obj.setImgRotation(Math.PI/4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setPolyDraw">&nbsp;</a> 
          <h3>.setPolyDraw( <?php echo $BoolLink ?> turnOn )</h3>
          <h5>Available to: <a href="Shape.php">Circle</a>, b2CircleShape</h5>
          <p>- Turning on <span class="kwd">polyDraw</span> will make your circle shapes draw images as rectangles instead of as circles.</p>
          <p>- You should use this if you have a circular image with a transparent background, as it will speed up the rendering process.</p>
          <p>- <span class="kwd">turnOn</span> is <span class="kwd">true</span> by default.</p>
          <pre class="prettyprint linenums:1">
//Draw image as a rectangle instead of
//as a circle
Circle.setPolyDraw();

//reverse the last code
Circle.setPolyDraw(false);</pre>
        </div>
      </div>
            <div class="docs-middle">
         <a class="inner-anchor" name="anim-properties">&nbsp;</a> 
        <h2>Anim Properties</h2>
        <p>These properties are undefined until you attach an anim or define them directly.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="anims">&nbsp;</a> 
          <h3>anims :: <?php echo $ArrayLink ?></h3>
          <h5>Available to: <a href="Obj.php">Shape</a>, b2Shape</h5>
          <p>- An array containing attached animations. An animation is an array of images or an <a href="Sprite">Sprite</a>.</p>
          <p>- You can auto advance and restart an animation by using the <a href="nextAnimFrame">nextAnimFrame</a> function.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="animKey">&nbsp;</a> 
          <h3>animKey :: <?php echo $NumberLink ?></h3>
          <h5>Available to: <a href="Obj.php">Shape</a>, b2Shape</h5>
          <p>- the current animation index.</p>
             <pre class="prettyprint linenums:1">obj.anims[animKey][animFrame]</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="animFrame">&nbsp;</a> 
          <h3>animFrame :: <?php echo $NumberLink ?></h3>
          <h5>Available to: <a href="Obj.php">Shape</a>, b2Shape</h5>
          <p>- the current animation frame index.</p>
             <pre class="prettyprint linenums:1">obj.anims[animKey][animFrame]</pre>
        </div>
      </div>
      <div class="docs-middle">
         <a class="inner-anchor" name="anim-functions">&nbsp;</a> 
        <h2>Anim Functions</h2>
        <p>These functions are attached to iio Objects and Box2d Objects by default.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="addAnim">&nbsp;</a> 
          <h3>.addAnim( <?php echo $ArrayLink ?> imgs )</h3>
          <h3 class="func">.addAnim( <a href="Sprite">Sprite</a> sprite, <?php echo $StringLink ?> tag )</h3>
          <h3 class="func">.addAnim( <?php echo $ArrayLink ?> imgSrcs, <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> onloadCallback )</h3>
          <h5>Available to: <a href="Obj.php">Shape</a>, b2Shape</h5>
          <p>- Attaches a new animation to this object.</p>
          <pre class="prettyprint linenums:1">
//load the images
var imgs = [];
imgs[0] = new Image();
imgs[1] = new Image();
imgs[0].src = 'anim-frame-1.png';
imgs[1].src = 'anim-frame-2.png';

//attach an animation when the images
//are done loading
img.onload = function(){
  shape.addAnim(imgs);
}

//or..

//let iio load the images for us
obj.addAnim(['anim-frame-1.png'
            ,'anim-frame-2.png']
            ,function(){
               //do something on load..
             });
//or..

//get anim from a sprite in a sprite sheet
var marioSprites = new iio.SpriteMap('img/mariobros_cmp.png'
                                    ,16,32,function(){

  //code calls when image has loaded
  mario = new iio.Rect(100, io.canvas.height-groundY,16,32);

  mario.addAnim(marioSprites.getSprite(0,2),'walk');
  mario.addAnim(marioSprites.getSprite(4,4),'jump');
  mario.addAnim(marioSprites.getSprite(5,5),'duck');
});</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="createWithAnim">&nbsp;</a> 
          <h3>.createWithAnim( <?php echo $ArrayLink ?> imgs )</h3>
          <h3 class="func">.createWithAnim( <?php echo $ArrayLink ?> imgSrcs, <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> onloadCallback, <?php echo $NumberLink ?> animFrame )</h3>
          <h3 class="func">.createWithAnim( <a href="Sprite">Sprite</a> sprite, <?php echo $StringLink ?> tag, <?php echo $NumberLink ?> animFrame )</h3>
          <h5>Available to: <a href="Obj.php">Rect</a>, <a href="Obj.php">Circle</a></h5>
          <p>- Attaches the given animation and sets the objects dimensions to match it.</p>
          <pre class="prettyprint linenums:1">
//load the images
var imgs = [];
imgs[0] = new Image();
imgs[1] = new Image();
imgs[0].src = 'anim-frame-1.png';
imgs[1].src = 'anim-frame-2.png';

//create a shape with the dimensions
//of our first animation image
var box;
img.onload = function(){
  box = new iio.Rect().createWithAnim(img);
}

//or..

//let iio load the image for us
box = new iio.Rect().createWithAnim(
                         ['anim-frame-1.png'
                         ,'anim-frame-2.png']
                         ,function(){
                          //do something on load..
                         });
//or...

//create with a sprite from a sprite sheet
var marioSprites = new iio.SpriteMap('img/mariobros_cmp.png'
                                     ,16,32,function(){
    //code calls when image has loaded
    mario = new iio.Rect(100, io.canvas.height-groundY)
       .createWithAnim(marioSprites.getSprite(6,6),'standing');
});</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setAnim">&nbsp;</a> 
          <h3>.setAnim( <?php echo $StringLink ?> tag, <?php echo $NumberLink ?> frame, Context ctx )</h3>
          <h3 class="func">.setAnim( <?php echo $NumberLink ?>: key, frame, Context ctx )</h3>
          <h3 class="func">.setAnim( <?php echo $StringLink ?>: tag, Context ctx )</h3>
          <h3 class="func">.setAnim( <?php echo $NumberLink ?>: key, Context ctx )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- sets the animation properties of this object.</p>
          <p>- a context must be specified if there is no global framerate and you want the object to redraw itself with the new image.</p>
          <pre class="prettyprint linenums:1">
//set a new animation
obj.setAnim('standing');</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setAnimKey">&nbsp;</a> 
          <h3>.setAnimKey( <?php echo $NumberLink ?> frame )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Changes the value of <span class="kwd">animKey</span> to the given number.</p>
          <pre class="prettyprint linenums:1">
//set a different animation frame
obj.setAnimKey(4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setAnimFrame">&nbsp;</a> 
          <h3>.setAnimFrame( <?php echo $NumberLink ?> frame )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Changes the value of <span class="kwd">animFrame</span> to the given number.</p>
          <pre class="prettyprint linenums:1">
//set a different animation frame
obj.setAnimFrame(4);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="nextAnimFrame">&nbsp;</a> 
          <h3>.nextAnimFrame()</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- Advances the animation by one frame. If the animation frame reaches the end of the image sequence, this function will wrap it back to the start.</p>
          <pre class="prettyprint linenums:1">
//advance an animation
obj.nextAnimFrame();</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="playAnim">&nbsp;</a> 
          <h3>.playAnim( <?php echo $NumberLink ?> fps, <a href="AppManager.php">AppManager</a> io, <?php echo $NumberLink ?> canvasId )</h3>
          <h3 class="func">.playAnim( <?php echo $StringLink ?> tag, <?php echo $NumberLink ?> fps, <a href="AppManager.php">AppManager</a> io, <?php echo $NumberLink ?> canvasId )</h3>
          <h3 class="func">.playAnim( <?php echo $NumberLink ?>: tag, fps, <a href="AppManager.php">AppManager</a> io, <?php echo $NumberLink ?> canvasId )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- plays an attached animation at the given framerate.</p>
          <p>- if no animation tag is specified, the animation at the current <span class="kwd">animKey</span> is activated.</p>
          <p>- you must pass a reference to your app's <a href="AppManager.php">AppManager</a> if you have not set a framerate on the canvas that the object is on.</p>
          <pre class="prettyprint linenums:1">//play a walk animation
mario.playAnim('walk',15,io);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="stopAnim">&nbsp;</a> 
          <h3>.stopAnim( <?php echo $StringLink ?> tag, Context ctx )</h3>
          <h3 class="func">.stopAnim( <?php echo $NumberLink ?> tag, Context ctx )</h3>
          <h5>Available to: <a href="Shape.php">Shape</a>, b2Shape</h5>
          <p>- stops the animation this object is currently playing.</p>
          <p>- if a <span class="kwd">tag</span> is specified, this function will stop the current animation and replace it with the first frame of the new one. Otherwise, it will keep the current animation but set its frame index to 0.</p>
          <p>- a Context parametter is only necessary if there is no global framerate and the object will need to redraw itself.</p>
          <pre class="prettyprint linenums:1">//stop an animation
obj.stopAnim();

//stop an anim and replace with new anim
//..assume no global framerate
obj.stopAnim('standing',io.context);</pre>
        </div>
      </div>
      <div style="margin-top:80px"></div>
        <a class="anchor top-anchor" name="SpriteMap">&nbsp;</a> 
        <h1>SpriteMap</h1>
        <p>A class to help segment a sprite sheet into different Sprite animations.</p>
      <div class="docs-middle">
         <a class="inner-anchor" name="SpriteMap-constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>Functions used to instantiate new intances of the SpriteMap class.</p>
        <div class="docs-inner"> 
          <h3><span class="kwd">iio</span>.SpriteMap( Image src, <?php echo $NumberLink ?> sprW, sprH )</h3>
          <h3 style="margin-left:136px" class="func"><span style="margin-left:-136px"><span class="kwd">iio</span>.SpriteMap( <?php echo $StringLink ?> src, <?php echo $NumberLink ?> sprW, sprH, <?php echo $FunctionLink ?> onloadCallback, Anything callbackParam )</span></h3>
          <h3 style="margin-left:136px" class="func"><span style="margin-left:-136px"><span class="kwd">iio</span>.SpriteMap( <?php echo $StringLink ?> src, <?php echo $FunctionLink ?> onloadCallback, Anything callbackParam )</span></h3>
          <p>- creates a new SpriteMap object with the given sprite sheet source.</p>
          <p>- <span class="kwd">sprW</span> is short for sprite-width. Dito for <span class="kwd">sprH</span>. Default values for both are 0.</p>
          <pre class="prettyprint linenums:1">//create a SpriteMap object, define 16x32 sprite cells, pass onload function
// - you can redefine sprite cell dimensions any time with setSpriteRes()
var marioSprites = new iio.SpriteMap('img/mariobros_cmp.png',16,32,function(){
  //code calls when image has loaded
  mario = new iio.Rect(100, io.canvas.height-groundY)
      .createWithAnim(marioSprites.getSprite(6,6),'standing');
});</pre>
        </div>
        <h2>Functions</h2>
        <div class="docs-inner">
          <a class="inner-anchor" name="SpriteMap-getSprite">&nbsp;</a> 
          <h3>.getSprite( <?php echo $NumberLink ?>: start, end )</h3>
          <h3 class="func">.getSprite( <?php echo $NumberLink ?> row )</h3>
          <p>- returns a <a href="Sprite">Sprite</a> object with the specified frames.</p>
          <p>- if <span class="kwd">start</span> and <span class="kwd">end</span> are specified, the returned <a href="Sprite">Sprite</a> will have frames corresponding to the specified range where the sprite grid is being read left to right.</p>
          <p>- if <span class="kwd">row</span> is specified, the returned sprite will have all frames in the indicated row.</p>
<pre class="prettyprint linenums:1">//get a sprite from the SpriteMap
mario.addAnim(marioSprites.getSprite(0,2),'walk');
mario.addAnim(marioSprites.getSprite(4,4),'jump');
mario.addAnim(marioSprites.getSprite(5,5),'duck');</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="SpriteMap-setSpriteRes">&nbsp;</a> 
          <h3>.setSpriteRes( <a href="Vec.php#vector"><span class="red">Vector</span></a> res )</h3>
          <h3 class="func">.setSpriteRes( <?php echo $NumberLink ?>: x, y )</h3>
          <p>- sets this SpriteMap's sprite resolution to the given value.</p>
          <pre class="prettyprint linenums:1">//change this Map's sprite resolution
marioSprites.setSpriteRes(30,40);</pre>
        </div>
      </div>
      <div style="margin-top:60px"></div>
      <a class="anchor top-anchor" name="Sprite">&nbsp;</a> 
        <h1>Sprite</h1>
        <p>A class that indexes animation frames from a single SpriteMap.</p>
      <div class="docs-middle">
         <a class="inner-anchor" name="Sprite-constructor">&nbsp;</a> 
        <h2>Constructor</h2>
        <div class="docs-inner">
          <h3><span class="kwd">iio</span>.Sprite( Image src )</h3>
          <p>- creates a new Sprite object that references the given sprite sheet source.</p>
        </div>
         <a class="inner-anchor" name="Sprite-properties">&nbsp;</a> 
        <h2>Properties</h2>
        <div class="docs-inner">
          <h3>.frames :: <?php echo $ArrayLink?></h3>
          <p>- an array containing sprite frame definitions .</p>
          <p>: .frames[i].<span class="kwd">x</span> : the x coordinate of the sprite frame at index i</p>
          <p>: .frames[i].<span class="kwd">y</span> : the y coordinate of the sprite frame</p>
          <p>: .frames[i].<span class="kwd">w</span> : the width of the sprite frame</p>
          <p>: .frames[i].<span class="kwd">h</span> : the height of the sprite frame</p>
        </div>
         <a class="inner-anchor" name="Sprite-addFrame">&nbsp;</a> 
        <h2>Functions</h2>
        <div class="docs-inner">
          <h3>.addFrame( <?php echo $NumberLink ?>: x, y, w, h )</h3>
          <p>- adds a frame from this Sprite's source sheet with the specified dimensions, relative to the given position.</p>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>