<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Core Functions';
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
/* iioEngine_docs-functions */
google_ad_slot = "1579106735";
google_ad_width = 120;
google_ad_height = 600;
}
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
      <div class="docs-top">
        <a class="anchor top-anchor" name="overview">&nbsp;</a> 
        <h1 style="margin-bottom:30px;">iio Functions</h1>
        <p>The <span class="kwd">iio</span> package includes static functions that are available to any script through the global <span class="kwd">iio</span> namespace.</p>
      </div>

      <a class="inner-anchor" name="object-extension">&nbsp;</a> 
      <h2 style="margin-bottom:0;">Object Extension</h2>
      <div class="docs-middle">
        <p><span class="kwd">iio</span> has implemented an object inheritance structure that you can use to extend iio objects or create your own object hierarchies.</p>
         <div class="docs-inner">
          <a class="inner-anchor" name="inherit">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.inherit( <span class="red">Class</span> child, <span class="red">Class</span> parent )</h3>
          <p>- makes the child class inherit all data and functions from the parent class.</p>
          <pre class="prettyprint linenums:1">
//Extending iio.Rect to create a Character class

//Definition
function Character(){
    this.Character.apply(this, arguments);
}; 

//Inheritance
iio.inherit(Character, iio.Rect)

//Constructor
Character.prototype._super = iio.Rect.prototype;
Character.prototype.Character = function(x,y,w,h,health){

    //call parent constructor
    this._super.Rect.call(this,x,y,w,h);

    //add new properties
    this.maxHealth = 100;
    this.health = health;

    //call parent functions
    this.setFillStyle('green');
    this.rotate(Math.PI/4);
}

//Character Functions
Character.prototype.injure = function(amount){
  this.health -= amount;
}
Character.prototype.heal = function(){
  this.health = this.maxHealth;
}

//Create a Character
var mCharacter = io.addObj( new Character(io.canvas.center,50,50,50));

//use Character functions
mCharacter.injure(10);
mCharacter.setSize(40,40);

mCharacter.heal();
mCharacter.setSize(50,50);</pre>
        </div>
      </div>

      <a class="inner-anchor" name="start">&nbsp;</a> 
      <h2 style="margin-bottom:0;">Start Functions</h2>
      <p>Use one of these functions to start your application. They instantiate an AppManager and attach or create a canvas element, then they run the given app script.</p>
      <div class="docs-middle">
         <div class="docs-inner">
          <a class="inner-anchor" name="start1">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.start( <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> app )</h3>
          <h5>:: Returns <a href="AppManager.php">AppManager</a></h5>
          <p>- Initializes and starts the given application script.</p>
          <p>- A full screen canvas is automatically created and positioned. The new canvas element is assigned the css class 'ioCanvas', and is given the following css properties: <span class="kwd">position</span>=absolute, <span class="kwd">display</span>=block, <span class="kwd">top</span>=0.</p>
          <p>- This function also sets the margin and padding of the body element to 0 to ensure a full screen.</p>
          <pre class="prettyprint linenums:1">
//start an iio Application in fullscreen mode
iio.start( myApp );
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="start2">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.start( <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> app, <?php echo $StringLink ?> canvasId )</h3>
          <h5>:: Returns <a href="AppManager.php">AppManager</a></h5>
          <p>- Initializes and starts the given application script with the specified canvas. No css properties are changed, and no css classes are added.</p>
          <pre class="prettyprint linenums:1">
//Somewhere in an HTML file
&lt;canvas id="myCanvas" width="600px" height="600px"/&gt;

//..

//In the JavaScript
//start an application on the existing canvas
iio.start( myApp, 'myCanvas' );
</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="start3">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.start( <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> app, <span class="red">Dim</span>: width, height )</h3>
          <h5>:: Returns <a href="AppManager.php">AppManager</a></h5>
          <p>- Initializes and starts the given application script.</p>
          <p>- <span class="red">Dim</span> is an abbreviation of dimensions. You can specify a <?php echo $NumberLink ?> for a fixed pixel size, or pass <span class="kwd">'auto'</span> or <span class="kwd">null</span>, which will make iio automatically resize your canvas to its parent elements dimension whenever a screen resize occurs.</p>
          <p>- A canvas with the given dimensions (width x height) is automatically created and attached to the body element. If dimensions are not specified, they default to the size of the viewing window.</p>
          <p>- The new canvas is assigned the css class 'ioCanvas', but no css properties are changed.</p>
          <pre class="prettyprint linenums:1">
//start an iio Application with a 400x400 canvas
//attached to the body element
iio.start( myApp, 400, 400 );

//start an iio Application on a new 100%x400 canvas
//attached to the body element
iio.start( myApp, 'auto', 400 );
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="start4">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.start( <a href="http://www.w3schools.com/js/js_functions.asp">Function</a> app, <?php echo $StringLink ?> elementId, <span class="red">Dim</span>: width, height )</h3>
          <h5>:: Returns <a href="AppManager.php">AppManager</a></h5>
          <p>- Initializes and starts the given application script.</p>
          <p>- <span class="red">Dim</span> is an abbreviation of dimensions. You can specify a <?php echo $NumberLink ?> for a fixed pixel size, or pass <span class="kwd">'auto'</span> or <span class="kwd">null</span>, which will make iio automatically resize your canvas to its parent elements dimension whenever a screen resize occurs.</p>
          <p>- A new canvas with the given dimensions (width x height) is automatically created and attached to the element with the given elementId. If dimensions are not specified, they default to the size of the viewing window.</p>
          <p>- if <span class="kwd">'body'</span> is passed as the elementId, the canvas will be attached to the body element.</p>
          <p>- The new canvas element is assigned the class 'ioCanvas', but no styles are altered.</p>
          <pre class="prettyprint linenums:1">
//start an iio Application on a new, 400x400 canvas
//and attach the canvas to an 'appWrapper' element
iio.start( myApp, 'appWrapper', 400, 400 );

//start an iio Application on a new 100%x400 canvas
//and attach the canvas to the body element
iio.start( myApp, 'appWrapper', 'auto', 400 );
</pre>
        </div>
      </div>
      <a class="inner-anchor" name="utility">&nbsp;</a> 
      <h2 style="margin-bottom:0;">Utility Functions</h2>
      <div class="docs-middle">
         <div class="docs-inner">
          <a class="inner-anchor" name="getRandomNum">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.getRandomNum( <?php echo $NumberLink ?>: min, max )</h3>
          <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns a random number in the range [min, max) - inclusive of min, exclusive of max. The given parameters can be floating point or whole, positive or negative.</p>
          <pre class="prettyprint linenums:1">
//get a random number between -1 and 1
var random = iio.getRandomNum(-1,1);</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="getRandomInt">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.getRandomInt( <?php echo $NumberLink ?>: min, max )</h3>
          <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- returns an integer in the range [min, max) - inclusive of min, exclusive of max. The given parameters can be floating point or whole, positive or negative.</p>
          <pre class="prettyprint linenums:1">
//get a random int between -10 and 10
var random = iio.getRandomNum(-10,10);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="isNumber">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.isNumber( Anything )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns <span class="kwd">true</span> if the given object is a number, <span class="kwd">false</span> otherwise.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="isBetween">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.isBetween( <?php echo $NumberLink ?>: value, bound1, bound2)</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns <span class="kwd">true</span> if the given value is in the range defined by the two given bounds. <span class="kwd">false</span> otherwise.</p>
          <p>- this function is inclusive of the boundaries: [<span class="kwd">bound1</span>,<span class="kwd">bound2</span>].</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="rotatePoint">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.rotatePoint( <a href="Vec.php">Vec</a> point, <?php echo $NumberLink ?> angle )</h3>
          <h3 class="func"><span class="kwd">iio</span>.rotatePoint( <?php echo $NumberLink ?>: x, y, angle )</h3>
          <h5>:: Returns <a href="Vec.php">Vec</a></h5>
          <p>- rotates the given point relative to 0,0 and returns the resulting vector.</p>
          <p>- angle should be specified in radians.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="getCentroid">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.getCentroid( <?php echo $ArrayLink ?> vectors )</h3>
          <h5>:: Returns <a href="Vec.php">Vec</a></h5>
          <p>- returns the centroid of the given vector group.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="getSpecVertex">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.getSpecVertex( <?php echo $ArrayLink ?> vectors, <?php echo $FunctionLink ?> comparator )</h3>
          <h5>:: Returns <a href="Vec.php">Vec</a></h5>
          <p>- returns a specific vertex from the given group, with respect to the given comparator.</p>
          <p>- for example, we could use the function to get the left-most vector in the group with this code:</p>
                 <pre class="prettyprint linenums:1">//get the vector with the lowest x coordinate 
var leftMostV = iio.getSpecVertex(vectorArray
                      ,function(v1,v2){
                        if(v1.x&lt;v2.x)
                           return true;
                        return false
                      });</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="getVecsFromPointList">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.getVecsFromPointList( <?php echo $ArrayLink ?> points )</h3>
          <h5>:: Returns <?php echo $ArrayLink ?></h5>
          <p>- returns an array of Vec objects corresponding to the given list of points.</p>
          <p>- a point can be given as a Vec, or as x and y <?php echo $NumberLink ?> Objects.</p>
          <pre class="prettyprint linenums:1">//get an array of Vec objects
var vectors = iio.getVecsFromPointList([io.canvas.center
                                       ,20,50
                                       ,100,100
                                       ,io.canvas.width,500]);</pre>
        </div>
         <div class="docs-inner">
          <a class="inner-anchor" name="hasKeyCode">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.hasKeyCode( <?php echo $StringLink ?> key, <a href="http://www.w3schools.com/jsref/event_onkeydown.asp">Event</a> event )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the key code corresponding to the given key string is active in the given <span class="kwd">onkeydown</span> or <span class="kwd">onkeyup</span> <a href="http://www.w3schools.com/jsref/event_onkeydown.asp">Event</a>.</p>
          <pre class="prettyprint linenums:1">//check if the space key is pushed down
var spaceDown;
this.keyDown = function(event){
  spaceDown = iio.hasKeyCode('space', event);
}

//AVAILABLE KEY STRINGS
'backspace'
'tab'
'enter'
'shift'
'ctrl'
'alt'
'pause'
'caps lock'
'escape'
'space'
'page up'
'page down'
'end'
'home'
'left arrow'
'up arrow'
'right arrow'
'down arrow'
'insert'
'delete'
'0'
'1'
'2'
'3'
'4'
'5'
'6'
'7'
'8'
'9'
'a'
'b'
'c'
'd'
'e'
'f'
'g'
'h'
'i'
'j'
'k'
'l'
'm'
'n'
'o'
'p'
'q'
'r'
's'
't'
'u'
'v'
'w'
'x'
'y'
'z'
'left window'
'right window'
'select key'
'n0'
'n1'
'n2'
'n3'
'n4'
'n5'
'n6'
'n7'
'n8'
'n9'
'multiply'
'add'
'subtract'
'dec'
'divide'
'f1'
'f2'
'f3'
'f4'
'f5'
'f6'
'f7'
'f8'
'f9'
'f10'
'f11'
'f12'
'num lock'
'scroll lock'
'semi-colon'
'equal'
'comma'
'dash'
'period'
'forward slash'
'grave accent'
'open bracket'
'back slash'
'close bracket'
'single quote'</pre>
        </div>
      </div>
      <!--<a class="inner-anchor" name="matrix-functions">&nbsp;</a> 
      <h2 style="margin-bottom:0;">Matrix Functions</h2>
      <p>When an iio Object is rotated, it creates a new property <a href="Obj.php#m">m</a> to hold matrix transformation values.</p>
      <p>If the object's rotation is reset to 0, <a href="Obj.php#m">m</a> is set to <span class="kwd">undefined</span>.</p>
      <p>iio's matrix library is adapted from one created by <a target="_blank" href="https://github.com/simonsarris/Canvas-tutorials/blob/master/transform.js">simonsarris</a>. The default matrix is as follows:</p>
<pre class="prettyprint linenums:1">m = [1,0,0,1,0,0];</pre>
      <div class="docs-middle">
        <div class="docs-inner">
          <a class="inner-anchor" name="resetMatrix">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.resetMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix )</h3>
          <h5>:: Returns <a href="Obj.php#m"><span class="red">M</span></a></h5>
          <p>- resets and returns the given matrix.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="translateMatrix">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.translateMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix, <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func"><span class="kwd">iio</span>.translateMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix, <?php echo $NumberLink ?>: x, y )</h3>
          <h5>:: Returns <a href="Obj.php#m"><span class="red">M</span></a></h5>
          <p>- translates and returns the given matrix.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="rotateMatrix">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.rotateMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix, <?php echo $NumberLink ?> angle )</h3>
          <h5>:: Returns <a href="Obj.php#m"><span class="red">M</span></a></h5>
          <p>- rotates and returns the given matrix.</p>
          <p>- angle should be given in radians.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="invertMatrix">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.invertMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix )</h3>
          <h5>:: Returns <a href="Obj.php#m"><span class="red">M</span></a></h5>
          <p>- inverts and returns the given matrix.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="scaleMatrix">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.scaleMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix, <a class="red" href="Vec.php#vector">Vector</a> )</h3>
          <h3 class="func"><span class="kwd">iio</span>.scaleMatrix( <a href="Obj.php#m"><span class="red">M</span></a> matrix, <?php echo $NumberLink ?>: x, y )</h3>
          <h5>:: Returns <a href="Obj.php#m"><span class="red">M</span></a></h5>
          <p>- scales the matrix by the given scale vector and returns the result.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="multiplyMatrices">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.multiplyMatrices( <a href="Obj.php#m"><span class="red">M</span></a>: m1, m2 )</h3>
          <h5>:: Returns <a href="Obj.php#m"><span class="red">M</span></a></h5>
          <p>- multiplies the given matrices and returns the result.</p>
        </div>
      </div>-->
      <a class="inner-anchor" name="intersection">&nbsp;</a> 
      <h2 style="margin-bottom:0;">Intersection Functions</h2>
      <p>There is little reason to call most of these functions directly. iio can handle collision detection for you.</p>
      <p>See the <a href="iio-basics.php#collisions">Collision Detection</a> docs for more info.</p>
      <div class="docs-middle">
        <div class="docs-inner">
          <a class="inner-anchor" name="lineContains">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.lineContains( <a class="red" href="Vec.php#vector">Vector</a>: lineStart, lineEnd, point )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- return indicates whether or not the given line contains the given point.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="intersects">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.intersects( <a href="Shape.php">Shape</a>: shape1, shape2 )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the given shapes intersect, false otherwise.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="lineXline">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.lineXline( <a class="red" href="Vec.php#vector">Vector</a>: l1Start, l1End, l2Start, l2End )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- return indicates whether or not the given lines intersect.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="rectXrect">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.rectXrect( <a href="SimpleRect.php">SimpleRect</a>: rect1, rect2 )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the given rectangles intersect. Returns false otherwise.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="polyXpoly">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.polyXpoly( <a href="Poly.php">Poly</a>: poly1, poly2 )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- returns true if the given polygons intersect, false otherwise.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="circleXcircle">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.circleXcircle( <a href="Circle.php">Circle</a>: circle1, circle2 )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- return indicates whether or not the given circles intersect.</p>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="polyXcircle">&nbsp;</a> 
          <h3><span class="kwd">iio</span>.polyXcircle( <a href="Poly.php">Poly</a> poly, <a href="Circle.php">Circle</a> circle )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- return indicates whether or not the given polygon and circle intersect.</p>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>