<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'ioAppManager';
	include('inc/preHeader.php');
  include('inc/docsGlobals.php');
	include('inc/header.php');
  	include('pan/docsPan.php');
?>
	<section class="container right-container top docs">
        <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-ioAM */
google_ad_slot = "4532573137";
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
        <h1 style="margin-bottom:30px;">ioAppManager</h1>
        <p>The ioAppManager is a class that assists with the management of application assets. These assets can be canvas elements, iio Objects, or a Box2D word.</p>
        <p>The main iio <a href="iio-functions.php#start">start</a> functions are designed to provide an application script with a new instantiation of an ioAppManager:</p>
        <pre class="prettyprint linenums:1">MyApplication = function(ioAppManager){
  
  //ioAppManager's properties are ready to go
  alert(ioAppManager.canvas.width);

}; iio.start(MyApplication, 'canvasId');</pre>
      <p>Note that you can name the ioAppManager parameter anything you want. I always shorten it to <span class="kwd">io</span> for convenience.</p>
      <p>All code samples on this documentation page are assumed to be inside a main application function where a reference to the ioAppManager exists.</p>
</div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
         <p>Your ioAppManager has references to your application's canvas elements and to those canvas' 2d contexts.</p>
         <p>The initial canvas element assigned to the application - either specified in <a href="iio-functions.php#start">start</a> or auto generated - is referred to as the 'base canvas'.</p>
         <p>The base canvas is the most accessible canvas element and should be used for whichever object layer is updated most frequently.</p>
         <p>You can create additional canvases by using the <a href="#addCanvas">addCanvas</a> function.</p>
         <p>All canvas elements are stored in the array property <span class="kwd">cnvs</span>. The base canvas is at index <span class="kwd">0</span> and can also be accessed through the property <span class="kwd">canvas</span>.</p>
         <div class="docs-inner">
         <a class="inner-anchor" name="canvas">&nbsp;</a> 
          <h3>.canvas :: <?php echo $CanvasLink ?></h3>
          <p>- The base canvas of the application</p>
          <pre class="prettyprint linenums:1">//get the dimenstions of the base canvas element
var w = io.canvas.width;
var h = io.canvas.height;</pre>
        </div>
        <div class="docs-inner">
         <a class="inner-anchor" name="context">&nbsp;</a> 
          <h3>.context :: Canvas 2d Context</h3>
          <p>- The 2d context of the base canvas element.</p>
          <pre class="prettyprint linenums:1">
//get the base canvas' 2d context
var context = io.context;</pre>
        </div>
        <div class="docs-inner">
         <a class="inner-anchor" name="cnvs">&nbsp;</a> 
          <h3>.cnvs :: <?php echo $ArrayLink ?></h3>
          <p>- An array of this application's canvas elements. In many cases, applications will only need one canvas, so the property <span class="kwd">.canvas</span> also exists.</p>
          <p>- <span class="kwd">.canvas</span> and <span class="kwd">.cnvs[0]</span> are pointers to the same Canvas object.</p>
          <pre class="prettyprint linenums:1">//create a new canvas element and get its width
iio.addCanvas();
//assuming this is the first call to addCanvas..
var w = io.cnvs[1].width;</pre>
        </div>
        <div class="docs-inner">
         <a class="inner-anchor" name="ctxs">&nbsp;</a> 
          <h3>.ctxs :: <?php echo $ArrayLink ?></h3>
          <p>- An array of this application's canvas' contexts. In many cases, applications will only need one canvas, so the property <span class="kwd">.context</span> also exists.</p>
          <p><span class="kwd">.context</span> and <span class="kwd">.ctxs[0]</span> are pointers to the same Canvas 2d context.</p>
          <pre class="prettyprint linenums:1">//get the context of a second canvas element
var context = io.ctxs[1];</pre>
        </div>

        <!--CANVAS CONTROL FUNCTIONS -->
        <div class="docs-middle">
        <a class="anchor" name="framerates">&nbsp;</a> 
        <h2>Framerate Control Functions</h2>
        <p>You can use these functions to start, pause, and cancel a continuous update loop on a canvas or an object. The loop will automatically update objects based on their properties and re-render them when required.</p>
        <p>In general, it is best to set a framerate on a canvas if you need to have a lot of objects moving around. If movement is occasional, large efficiency gains can be made by attaching framerates to objects instead of their parent canvas.</p>
        <p>Combining both of these methods on mutliple canvas layers can sometimes be the best solution for apps that require both static and dynamic content.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="setFramerate">&nbsp;</a> 
          <h3>setFramerate( <?php echo $NumberLink ?> fps, <?php echo $FunctionLink ?> callback, <?php echo $NumberLink ?> c )</h3>
         <h3 style="margin-left:136px"class="func"><span style="margin-left:-136px">setFramerate( <?php echo $NumberLink ?> fps, <a href="ioObj.php">ioObj</a> obj obj, <span class="red">Context</span> ctx, <?php echo $FunctionLink ?> callback )</h3>
          <h5>:: Returns <a href="iio-basics.php#this">this</a></h5>
          <p>- this function sets a framerate on the given object or canvas at the given speed (frames per second).</p>
          <p>- A canvas with a framerate will update all its objects and call the specified callback function, then clear the canvas and re-render it, on each frame update. <span class="kwd">c</span> is a <span class="kwd">cnvs</span> index. If <span class="kwd">c</span> is undefined, this function will act on the base canvas.</p>
          <p>- An object with a framerate will call its own update function on each new frame. If the object changes its position, rotation, or animation frame, it will clear itself and re-render (which is why you have to give it a context). This technique is useful when you have few moving objects that don't overlap because the only part of the canvas that gets cleared and redrawn is the space the object occupies.</p>
          <pre class="prettyprint linenums:1">//set a 60fps framerate on the base canvas
io.setFramerate(60);

//set a framerate and specify a callback function
io.setFramerate(60, function(){
  //code called 60x a second...
});

//set a framerate on a background canvas
//without a callback function
io.setFramerate(5,null,1);

//set a framerate on an object
//in the base canvas
io.setFramerate(60, new iio.ioRect(0,0,60)
                    .enableKinematics()
                    .setVel(2,2));</pre>
        </div>
                <div class="docs-inner">
          <a class="inner-anchor" name="pauseFramerate">&nbsp;</a> 
          <h3>pauseFramerate( <?php echo $BoolLink?> pause )</h3>
         <h3 class="func">pauseFramerate( <?php echo $BoolLink?> pause, <a href="ioObj.php">ioObj</a> obj obj )</h3>
          <h5>:: Returns <a href="iio-basics.php#this">this</a> || obj</h5>
          <p>- pauses a previously set framerate.</p>
          <p>- if no object is specified, all canvas framerates are paused. Otherwise the framerate loop set on the object is paused.</p>
          <p>- the default value for <span class="kwd">pause</span> is <span class="kwd">true</span> if this function has not been called before. Otherwise, this function will act as a toggle.</p>
          <pre class="prettyprint linenums:1">//pause canvas framerates
io.pauseFramerate();

//unpause canvas framerates
io.pauseFramerate();</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="cancelFramerate">&nbsp;</a> 
          <h3>cancelFramerate( <?php echo $NumberLink?> canvasIndex )</h3>
         <h3 class="func">cancelFramerate( <a href="ioObj.php">ioObj</a> obj )</h3>
          <h5>:: Returns <a href="iio-basics.php#this">this</a> || obj</h5>
          <p>- cancels a previously set framerate.</p>
          <p>- if no parameters are given, the framerate on the base canvas is cancelled. If a canvas index is given, the framerate on that canvas will be cancelled.</p>
          <p>- if an Obj is given, the framerate set on that object will be cancelled and this function will return the object.</p>
          <pre class="prettyprint linenums:1">//cancel base canvas framerate
io.cancelFramerate();

//cancel framerate on object
io.cancelFramerate( obj );</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setAnimFPS">&nbsp;</a> 
          <h3>setAnimFPS( <?php echo $NumberLink ?> fps, <a href="ioObj.php">ioObj</a> obj, <?php echo $NumberLink ?> canvasId )</h3>
          <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- Sets a callback on the given object that changes its animation frame, and clears and redraws itself on each step.</p>
          <pre class="prettyprint linenums:1">
//animate an object at 24fps
io.setAnimFPS(24, myAnimObject);</pre>
        </div>

        <!--CANVAS CONTROL FUNCTIONS -->
        <div class="docs-middle">
        <a class="anchor" name="canvas-control">&nbsp;</a> 
        <h2>Canvas Control Functions</h2>
        <p>These functions give you control over your application's canvas elements. Most applications are best off using just one canvas, but an <a href="ioAppManager.php#addCanvas">addCanvas</a> function exists for cases in which an application has object layers that do not have to be redrawn on every update.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="draw">&nbsp;</a> 
          <h3>draw( <?php echo $NumberLink ?> c )</h3>
           <h5>:: Returns <a href="iio-basics.php#this">this</a></h5>
          <p>- clears and re-renders the canvas at <span class="kwd">cnvs</span> index <span class="kwd">c</span>. If <span class="kwd">c</span> is undefined, this function acts on the base canvas.</p>
          <pre class="prettyprint linenums:1">//render a canvas with objects
//(see object control)
io.draw();

//render a background canvas
io.draw(1);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="addCanvas">&nbsp;</a> 
          <h3>addCanvas()</h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas( <?php echo $StringLink ?> canvasId )</h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas( <?php echo $NumberLink ?> zIndex )</h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas( <?php echo $NumberLink ?>: zIndex, w, h )</h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas( <?php echo $NumberLink ?>: zIndex, w, h, <?php echo $ArrayLink ?> cssClasses )</span></h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas( <?php echo $NumberLink ?>: zIndex, w, h, <?php echo $StringLink ?> attachElementId )</span></h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas( <?php echo $NumberLink ?>: zIndex, w, h, <?php echo $StringLink ?>: attachElementId, cssClass )</span></h3>
          <h3 style="margin-left:114px"class="func"><span style="margin-left:-114px">addCanvas</span>( <?php echo $NumberLink ?> zIndex, w, h, <?php echo $StringLink ?> attachElementId, <?php echo $ArrayLink ?> cssClasses )</span></h3>
          <h5>:: Returns <?php echo $NumberLink ?> :: the index of the new canvas</h5>
          <p>- Creates a new canvas element. This canvas will be positioned absolutely behind the base canvas unless a <span class="kwd">canvasId</span> or <span class="kwd">attachElementId</span> is specified.</p>
          <p>- The <span class="kwd">zIndex</span> controls the new canvas' position in the stack - a higher number puts it closer to the top, a lower number puts it closer to the bottom. This number may be negative. The base canvas has a zIndex of 0. If <span class="kwd">zIndex</span> is not provided, the new canvas will be given a zIndex equal to the negative value of its index.</p>
          <p>- If a <span class="kwd">canvasId</span> is provided, the new canvas index will refer to the given element. If an <span class="kwd">attachElementId</span> is provided, a new canvas will be created and attached to the given element. No css properties will be altered in either of these cases. If no ids are specified though, the new canvas will be auto generated and given the css class <span class="kwd">ioCanvas</span>.</p>
          <p>- The css class's referred to in the <span class="kwd">cssClass</span> or <span class="kwd">cssClasses</span> parameters will applied to the new canvas object.</p>
          <p>- If you send <span class="kwd">null</span> as a parameter value, the function will get the value from the base canvas.</p>
          <pre class="prettyprint linenums:1">

//the base canvas already exists
//we can get properties from it like this:
var w = io.canvas.width;
//or
var w = io.cnvs[0].width;

//create a red background canvas
io.setBGColor('red',io.addCanvas());

//add a canvas that already exists
io.addCanvas('myCanvasId');

//add a foreground canvas
io.addCanvas(10); //zIndex will be 10

//add a new canvas and assign it a class
//use null so we keep the dimensions of the base canvas
io.addCanvas(-10, null, null, ['myCssClass']);

//add a 400x600 canvas 
//attach it to a specified element
//assign it a list of class's
io.addCanvas(0, 400, 600, 'myElementId', ['class1', 'class2']);</pre>
        </div>
                <div class="docs-inner">
          <a class="inner-anchor" name="getEventPosition">&nbsp;</a> 
          <h3>getEventPosition( <a target="_new" href="http://www.w3schools.com/js/js_htmldom_events.asp">DOM Event</a> event, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <a href="ioVec.php">ioVec</a></h5>
          <p>- returns the event's position as an <a href="ioVec.php">ioVec</a> relative to the specified canvas's origin (its top-left corner). If no <span class="kwd">c</span> is specified, the base canvas is used.</p>
          <p>- this function can handle all canvas positioning possibilities. It doesn't matter where a canvas is or if the user has scrolled across the page - this function will give you the accurate event position relative to the canvas's origin.</p>
          <pre class="prettyprint linenums:1">
//alert with mouse click position
io.canvas.addEventListener('mousedown', function(event){
    alert(io.getEventPosition(event).toString());
});
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setBGColor">&nbsp;</a> 
          <h3>setBGColor( <?php echo $StringLink ?> color, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <a href="ioAppManager.php#overview">ioAppManager</a></h5>
          <p>- Sets the css <a target="_new" href="http://www.w3schools.com/cssref/pr_background-color.asp">background-color</a> property to the given color. This function will act on the base canvas unless a different <a href="ioAppManager.php#cnvs">c</a> is specified.</p>
          <p>- Colors can be specified as css <a target="_new" href="http://www.w3schools.com/cssref/css_colornames.asp">color keywords</a>, hexadecimal values, rgb values, or rgba values. See <a target="_new" href="http://www.w3schools.com/tags/ref_colorpicker.asp">w3schools</a> for a good hexadecimal color picker.</p>
          <pre class="prettyprint linenums:1">
//set background color to white
//using a css color keyword
io.setBGColor('white');

//set background color to red
//using rbg values
io.setBGColor('rgb(255,0,0)');

//add a background canvas
//set its background color to blue
//using a hexadecimal value
io.addCanvas();
io.setBGColor('#00F',1);

//add a foreground canvas
//set its background color to semi-transparent black
//using rgba values
io.addCanvas();
io.setBGColor('rgba(0,0,0,.5)',2);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setBGPattern">&nbsp;</a> 
          <h3>setBGPattern( <?php echo $StringLink ?> imagePath )</h3>
          <h3 class="func">setBGPattern( <?php echo $StringLink ?> imagePath, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <?php echo $BoolLink ?></h5>
          <p>- Sets the css <a href="http://www.w3schools.com/cssref/pr_background-image.asp">background image</a> of this canvas to the given image. Horizontal and vertical image repetition are active by default. This function will act on the base canvas unless a different <a href="ioAppManager.php#cnvs">c</a> is specified.</p>
          <pre class="prettyprint linenums:1">
//set a background image
io.setBGPattern('myBGPattern.png');

//add a canvas and give it a background pattern
io.setBGPattern('myBGPattern.png', io.addCanvas());</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setBGImage">&nbsp;</a> 
          <h3>setBGImage( <?php echo $StringLink ?> imagePath )</h3>
          <h3 class="func">setBGImage( <?php echo $StringLink ?> imagePath, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <a href="ioAppManager.php#overview">ioAppManager</a></h5>
          <p>- Sets the css <a href="http://www.w3schools.com/cssref/pr_background-image.asp">background image</a> of this canvas to the given image and disables vertical and horizontal repeats. This function will act on the base canvas unless a different <a href="ioAppManager.php#cnvs">c</a> is specified.</p>
          <pre class="prettyprint linenums:1">
//set a background image
io.setBGImage('myBG.jpg');

//add a canvas and give it a background image
io.setBGImage('myBG.jpg', io.addCanvas());</pre>
        </div>

        <!--OBJECT CONTROL FUNCTIONS -->
        <div class="docs-middle">
        <a class="anchor" name="object-control">&nbsp;</a> 
        <h2>Object Control Functions</h2>
        <p>The ioAppManager can help you manage objects by automatically calling their update and draw functions when you need to re-render the screen.</p>
        <p>Objects are always stored in a <a href="iio-basics.php#groups">group</a> structure, but you can simplify dealing with a mono-group by using the <a href="#addObj">addObj</a> and <a href="#rmvObj">rmvObj</a> functions.</p>
        <div class="docs-inner">
          <a class="inner-anchor" name="addObj">&nbsp;</a> 
          <h3>addObj( <a href="ioObj.php">ioObj</a> obj, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <a href="ioObj.php">ioObj</a> - the object you gave it</h5>
          <p>- Adds the given object to the canvas at the given index. If no index is specified, the object is added to the base canvas.</p>
          <pre class="prettyprint linenums:1">
//give a new blue box to the base canvas
io.addObj(new iio.ioRect(0,0,60)
    .setFillStyle('blue'));

//give a new blue box to a second canvas
io.addObj(new iio.ioRect(0,0,60)
    .setFillStyle('blue'), 1);
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="rmvObj">&nbsp;</a> 
          <h3>rmvObj( <a href="ioObj.php">ioObj</a> obj, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <?php echo $BoolLink ?> - tells you if it was successful</h5>
          <p>- removes the given object from the canvas at the given index. If no index is specified, the object is removed from the base canvas.</p>
          <pre class="prettyprint linenums:1">
//remove an object from the base canvas
io.rmvObj(myObj);

//remove an object from the second canvas
io.rmvObj(myObj, 1);
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="rmvAll">&nbsp;</a> 
          <h3>rmvAll( <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <a href="iio-basics.php#this">this</a></h5>
          <p>- removes all objects from the canvas at the given index. If no index is specified, the objects are removed from the base canvas.</p>
          <pre class="prettyprint linenums:1">
//remove all objects from the base canvas
io.rmvAll();

//remove all objects from the second canvas
io.rmvAll(1);
</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="addGroup">&nbsp;</a> 
          <h3>addGroup( <?php echo $StringLink ?> tag, <?php echo $NumberLink ?> zIndex, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- creates a new group in the specified canvas with the given tag at the given z-index. <span class="kwd">0</span> is the default zIndex, and the function will act on the base canvas if no <span class="kwd">c</span> is given.</p>
          <pre class="prettyprint linenums:1">
//add a group for box objects
//at zIndex 10
io.addGroup('boxes', 10);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="addToGroup">&nbsp;</a> 
          <h3>addToGroup( <?php echo $StringLink ?> tag, <a href="ioObjects.php">ioObj</a> obj, <?php echo $NumberLink ?> zIndex, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <a href="ioObjects.php">ioObj</a></h5>
          <p>- adds the given object to the given group in the specified canvas. If the group does not exist, a new group is created and added. <span class="kwd">0</span> is the default zIndex, and the function will act on the base canvas if no <span class="kwd">c</span> is given.</p>
          <pre class="prettyprint linenums:1">
//add a new box to a new 'boxes' group
io.addToGroup('boxes', new iio.ioRect(0,0,60), 10);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="rmvFromGroup">&nbsp;</a> 
          <h3>rmvFromGroup( <a href="ioObj.php">ioObj</a> obj, <?php echo $StringLink ?> tag, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- removes the given object from the given group in the specified canvas. This function will act on the base canvas if no <span class="kwd">c</span> is given.</p>
          <pre class="prettyprint linenums:1">
//remove an object from a group
io.rmvFromGroup('boxes', myBox);</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="getGroup">&nbsp;</a> 
          <h3>getGroup( <?php echo $StringLink ?> tag, <?php echo $NumberLink ?>: canvasId, from, to )</h3>
          <h5>:: Returns <?php echo $ArrayLink ?></h5>
          <p>- returns an array containing the objects in the specified group.</p>
          <p>- if <span class="kwd">from</span> and <span class="kwd">to</span> are specified, the returned array will contain the objects in the group in the range [<span class="kwd">from</span>, <span class="kwd">to</span>).</p>
          <p>- if only <span class="kwd">from</span> is specified, the returned array will only contain the object at that that index.</p>
          <pre class="prettyprint linenums:1">
//get all objects in 'boxes' group
var boxes = io.getGroup('boxes');

//get the second object in 'boxes' group
var scndBox = io.getGroup('boxes', 0, 2)[0];</pre>
        </div>
        <div class="docs-inner">
          <a class="inner-anchor" name="setCollisionCallback">&nbsp;</a> 
          <h3>setCollisionCallback( <?php echo $StringLink ?> tag, <?php echo $FunctionLink ?> callback, <?php echo $NumberLink ?> c )</h3>
          <h3 class="func">setCollisionCallback( <?php echo $StringLink ?> tag1, <?php echo $StringLink ?> tag2, <?php echo $FunctionLink ?> callback, <?php echo $NumberLink ?> c )</h3>
          <h5>:: Returns <?php echo $NumberLink ?></h5>
          <p>- Sets a callback function for the collision between objects in a single group or between two groups in the specified canvas. If no <span class="kwd">c</span> is given, this method acts on the base canvas</p>
          <p>- See <a href="iio-basics.php#collisions">this page</a> for an in depth look at a collision example.</p>
          <pre class="prettyprint linenums:1">
//set a collision callback on objects of two groups
io.setCollisionCallback(groupTag1, groupTag2, function(obj1, obj2){
    //Collision callback code...
});

//set a collision callback on objects in the same group
io.setCollisionCallback(groupTag, function(obj1, obj2){
    //Collision callback code...
});</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>