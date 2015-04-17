<?php 
chdir('../');
	include('inc/redirector.php');
  $homepath = '../';
  $title = 'Tic Tac Toe Tutorial';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
<section class="container tuts tutorial-container top">
</div>
  <div class="span3 page-anchors">
  <ul class="nav nav-list affix">
    <li>
      <a href="#overview">
        <i class="icon-chevron-right"></i>
        Overview
      </a>
    </li>
    <li>
      <a href="#setting-up">
        <i class="icon-chevron-right"></i>
        Setting Up
      </a>
    </li>
    <li>
      <a href="#the-main-function">
        <i class="icon-chevron-right"></i>
        The Main Function
      </a>
    </li>
    <li>
      <a href="#the-grid">
        <i class="icon-chevron-right"></i>
        Adding a Grid
      </a>
    </li>
    <li>
      <a href="#input-detection">
        <i class="icon-chevron-right"></i>
        Detecting Input
      </a>
    </li>
    <li>
      <a href="#creating-shapes">
        <i class="icon-chevron-right"></i>
        Adding Shapes
      </a>
    </li>
    <li>
      <a href="#new-object-properties">
        <i class="icon-chevron-right"></i>
        New Object Properties
      </a>
    </li>
    <li>
      <a href="#complete-app">
        <i class="icon-chevron-right"></i>
        The Completed App
      </a>
    </li>
  </ul>
</div>
  <a class="anchor top-anchor" name="overview">&nbsp;</a> 
  <h1>Tic Tac Toe</h1>
  <hr class="featurette-divider">
  <p>This tutorial will show you how to make Tic Tac Toe with the iio Engine with just 9 code statements. It should serve as an introduction to iio Application development.</p>
  <p>This tutorial is intended for anyone who is new to the iio Engine, and is hopefully accessible even to those who have never programmed before. I will explain most lines of code, but I will sometimes leave easily inferable portions up to you to figure out.</p>
  <p>To follow this tutorial, you'll need the latest iio Engine JS file, a text editor, and a web browser.</p>
  <p>Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine.min']);" href="../js/iioEngine.min.js">iioEngine.min.js</a></p>
  

  <a class="anchor inner-anchor" name="setting-up">&nbsp;</a> 
  <h2>Prepping the Application Environment</h2>
  <p>The first thing to do when developing an iio App is to create an HTML page to hold a canvas element. Application scripts can be written directly into this HTML page, but it is good practice to put self-contained App code into its own file.</p>
  <p>If you need help with these steps refer to the <a href="quick-start.php">quick started guide</a>, or to the <a href="html-css.php">HTML &amp; CSS Tutorial</a>.</p>
  <p>You can set up your app environment any way you want, but this tutorial is based on the following HTML page:</p>
<pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;canvas id="ttt" width="450px" height="450px"/&gt;
    &lt;script type="text/javascript" src="iioEngine.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="TicTacToe.io.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"&gt; iio.start(TicTacToe,'ttt') &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
  <p>This is a simple page with a canvas that loads the iio Engine and our application script. The last line starts our application and binds it to the canvas element.</p>
  <p>You should already have the iio Engine file, so now create a new JavaScript file called <span class="kwd">TicTacToe.io.js</span>, and put it in the same directory as the HTML and Engine files. We will be working in this file from now on.</p>

<a class="anchor inner-anchor" name="the-main-function">&nbsp;</a> 
  <h2>The Main Application Function</h2>
  <p>We need to create a main application function to define our app and give it access to an <a href="../docs/AppManager.php">AppManager</a>. Put the following into your TicTacToe application script.</p>
<pre class="prettyprint linenums:1">
TicTacToe = function(io){

};</pre>
<p>This is the basic setup for all iio apps - declare a function with the same name as our app that receives an <a href="../docs/AppManager.php">AppManager</a> as a parameter (which I always denote as <span class="kwd">io</span> for convenience).</p>
<p>All of our application code will be contained within this function. This structure hides your application data from the global scope, and also allows you to safely deploy your app to any canvas on any webpage without worrying about the surrounding content.</p>
<p>From now on in this tutorial, put the provided sample code into the <span class="red">TicTacToe</span> function. Lets start by adding a grid.</p>

<a class="anchor inner-anchor" name="the-grid">&nbsp;</a> 
<h2>Adding the Grid</h2>
<p>The iio Engine provides a class for grids called <a href="../docs/Grid.php">Grid</a>. We'll need a 3x3 grid for Tic Tac Toe, and to fill the entire canvas, each cell should be 150x150 pixels. To create this grid with iio, simply write the following:</p>
<pre class="prettyprint linenums:1">
var grid = new iio.Grid(0,0,3,3,150);</pre>
<p>The first two parameters (<span class="kwd">0</span>,<span class="kwd">0</span>) define the grids starting position. Positions are relative to the top-left corner of an element in HTML and in <a href="../docs/Grid.php">Grid</a>, so this grid will fit our canvas perfectly.</p>
<p>The grid now exists, but we can't see it because it hasn't been drawn. The easiest way to draw the grid is to give it to our <a href="../docs/AppManager.php">AppManager</a>:</p>
<pre class="prettyprint linenums:1">
io.addObj(grid);</pre>
<p>By giving the AppManager a reference to our grid, we are letting it take control of the grid's rendering - so it will draw, clear, and redraw the grid whenever necessary.</p>
<p>The default draw color is black. You can change this color and the width of the draw stroke with these functions:</p>
<pre class="prettyprint linenums:1">
//change the stroke style to red
grid.setStrokeStyle('red');

//make the draw stroke thicker
grid.setLineWidth(4);

//alter both styles with the same function
grid.setStrokeStyle('red',4);</pre>
<p>Note though that the grid will not automatically redraw if you change its style, so you'll either need to tell your <a href="../docs/AppManager.php">AppManager</a> to re-render the canvas:</p>
<pre class="prettyprint linenums:1">
io.draw();</pre>
<p>Or you can just set the styles before you add the grid - here's the full app:</p>
<pre class="prettyprint linenums:1">
TicTacToe = function(io){

   var grid = new iio.Grid(0,0,3,3,150);
   grid.setStrokeStyle('red',4);
   io.addObj(grid);

   //or...
   //with cascading code structure
   var grid = io.addObj((new iio.Grid(0,0,3,3,150))
                  .setStrokeStyle('red',4));
};</pre>
<p>Learn more about cascading code structures <a href="../docs/iio-basics.php#this">here</a>.</p>
<canvas id="canvas1" style="background:white; margin-top:40px" width="450px" height="450px"></canvas>
<p class="caption">What you should be seeing</p>

<a class="anchor inner-anchor" name="input-detection">&nbsp;</a> 
<h2>Detecting Input</h2>
<p>To listen for user input in JavaScript, you add an 'EventListener' to the element of interest and specify which type of input to listen for. For us, the element of interest is our canvas, and the input we want to catch is a mouse click:</p>
<pre class="prettyprint linenums:1">
io.canvas.addEventListener('mousedown', function(event){
  
});</pre>
<p>This code adds an event listener and defines a callback function that will get called each time the <span class="kwd">mousedown</span> event is triggered.</p>
<p>Before moving forward with the callback code, we should first check to see if its actually working. Put this line in the callback function:</p>
<pre class="prettyprint linenums:1">
//create an alert box and display input coordinates
alert(io.getEventPosition(event).toString());</pre>
<p>If you save the JS file and refresh your html page, you should now see an alert dialogue displaying the input coordinates pop up each time you click the canvas. Pretty simple right? Maybe not though, that line does have a lot of parentheses in it - lets break it down:</p>
<p>The <span class="kwd">event</span> parameter in our callback function is an HTML DOM <a href="http://www.w3schools.com/js/js_htmldom_events.asp">Event</a> object. While this object contains lots of information about the mouse click event that triggered our callback, all we really want to know is what the coordinates of the click were, relative to our canvas element. To get that information, we convert the <span class="kwd">event</span> object to an <a href="../docs/Vec.php">Vec</a> using our AppManager's helpful <span class="kwd">getEventPosition()</span> method. After conversion, we can easily get the relative coordinates through <a href="../docs/Vec.php">Vec</a>'s <span class="kwd">x</span> and <span class="kwd">y</span> properties, and convert it to a readable string with its <a href="../docs/Vec.php#toString">toString()</a> function.</p>
<p>Now that we know our input callback works, we need a way to figure out which cell a user has selected when they click the grid. <a href="../docs/Grid.php">Grid</a> provides a function for this, so all you need to do is change the callback function to this:</p>
<pre class="prettyprint linenums:1">
//get the coordinates of the selected cell
var cell = grid.getCellAt(io.getEventPosition(event));
//create an alert box and display the cell coordinates
alert(cell.toString());</pre>
<p>When you click the grid now, the alert pops up with the coordinates of the cell you selected. The next step is to get the center position of the selected cell (relative to the canvas) so that we can place an object there. Again, <a href="../docs/Grid.php">Grid</a> provides us with a function for that. The <a href="../docs/Grid.php#getCellCenter">getCellCenter()</a> function works on cell coordinates or pixel coordinates, so either of the following lines will give us what we want:</p>
<pre class="prettyprint linenums:1">
var cell = grid.getCellAt(io.getEventPosition(event));
var cellCenter = grid.getCellCenter(cell);
alert(cellCenter.toString());

//or

var cellCenter = grid.getCellCenter(io.getEventPosition(event),true);
alert(cellCenter.toString());</pre>
<p>A minimalist implementation at this point would look something like this:</p>
<pre class="prettyprint linenums:1">
TicTacToe = function(io){

  var grid = io.addObj(new iio.Grid(0,0,3,3,150));

  io.canvas.addEventListener('mousedown', function(event){
    alert(grid.getCellCenter(io.getEventPosition(event),true).toString());
  });
};</pre>
<canvas id="canvas2" style="background:white; margin-top:30px" width="450px" height="450px"></canvas>
<p class="caption">Click this canvas to see the cell center</p>

<a class="anchor inner-anchor" name="creating-shapes">&nbsp;</a> 
<h2>Adding Shapes</h2>
<p>Lets now replace the alert box with an XShape. The iio framework provides a class for X shapes called <a href="../docs/XShape.php">XShape</a>. Unlike the grid and canvas element, the origin of an XShape is at its center. This makes adding one to a selected cell very simple:</p>
<pre class="prettyprint linenums:1">
TicTacToe = function(io){

  var grid = io.addObj(new iio.Grid(0,0,3,3,150));

  io.canvas.addEventListener('mousedown', function(event){
    var cellCenter = grid.getCellCenter(io.getEventPosition(event),true);
    io.addObj(new iio.XShape(cellCenter, 100));
  });
};</pre>
<canvas id="canvas3" style="background:white; margin-top:30px" width="450px" height="450px"></canvas>
<p class="caption">Click this canvas to add some X's</p>
<p>The same <a href="../docs/XShape.php#setStrokeStyle">setStrokeStyle</a> and <a href="../docs/XShape.php#setLineWidth">setLineWidth</a> functions that we used on the Grid exist for XShape. If you wanted to make the Xs stroke size larger and red for instance, replace the code with this:</p>
<pre class="prettyprint linenums:1">
var xShape = new iio.XShape(cellCenter, 100);
xShape.setStrokeStyle('red',4);
io.addObj(xShape);

//or...
//with cascading code structure
io.addObj((new iio.XShape(cellCenter,100))
    .setStrokeStyle('red',4));</pre>
<p>Adding Circles is straightforward too, since iio provides us with the <a href="../docs/Circle.php">Circle</a> class.</p>
<p>One important thing to note though is that unlike XShape's, Circle's do not have a default draw style. So in our minimalist implementation, if we wanted to add circles instead of X's, we would replace the XShape creation line with this:</p>
<pre class="prettyprint linenums:1">
//create and add a new black stroked circle shape with a 50px radius
io.addObj((new iio.Circle(cellCenter, 50))
    .setStrokeStyle('black'));</pre>
<p>To alternate between drawing X's and O's, we need to create a local Boolean (true/false) variable in the app script to act as a switch for an <span class="kwd">if</span>, <span class="kwd">else</span> structure:</p>
<pre class="prettyprint linenums:1">
TicTacToe = function(io){

  var grid = io.addObj(new iio.Grid(0,0,3,3,150));
  var xTurn = true;

  io.canvas.addEventListener('mousedown', function(event){

    var cellCenter = grid.getCellCenter(io.getEventPosition(event),true);

    if (xTurn)
      io.addObj(new iio.XShape(cellCenter, 100));
    else
      io.addObj((new iio.Circle(cellCenter, 50))
          .setStrokeStyle('black'));

    xTurn=!xTurn;
  });
};</pre>
<p>The last line sets the value of <span class="kwd">xTurn</span> to the opposite of whatever it is currently, thereby switching which shape gets drawn on every input event (! means 'not').</p>
<canvas id="canvas4" style="background:white; margin-top:30px" width="450px" height="450px"></canvas>
<p class="caption">The app with both shapes</p>

<a class="anchor inner-anchor" name="new-object-properties">&nbsp;</a> 
<h2>Adding New Object Properties</h2>
<p>The game is mostly done, but it would be nice if we could prevent players from picking a cell multiple times.</p>
<p>Because JavaScript allows us to add new properties and functions to objects at any time, this can be easily accomplished by adding a new property called 'taken' (or whatever you want) to a cell the first time it is selected, and always checking for that property whenever any cell is selected.</p>
<p><a href="../docs/Grid.php">Grid</a> already has a matrix of objects representing cells, and you can access it directly through Grid's <a href="../docs/Grid.php#cells">cells</a> property.</p>
<p>As an example, if we wanted to get a reference to the center cell in our 3x3 grid, we could use this code:</p>
<pre class="prettyprint linenums:1">
var centerCell = grid.cells[1][1];</pre>
<p>Almost all counting starts with 0 in Computer Science, so the cells in our grid are labeled (0,0) to (2,2), with (1,1) being the center.</p>
<p>To give that cell a new property, use the following code:</p>
<pre class="prettyprint linenums:1">
centerCell.newPropertyName = someValue;</pre>
<p>If we need to test whether or not an object has a property, use this code:</p>
<pre class="prettyprint linenums:1">
if (typeof centerCell.newPropertyName == 'undefined')
  //the property is defined
else
  //the property is not defined</pre>
<p>Try implementing a fix to the multi selection issue yourself as an exercise.</p>
<p>Afterwards, take a look at this one - the entire game is written in just 9 lines of internal app code!</p>
<a class="anchor inner-anchor" name="complete-app">&nbsp;</a> 
 <pre class="prettyprint linenums:1">
TicTacToe = function(io){

  var grid = io.addObj(new iio.Grid(0,0,3,3,150));
  var xTurn=true;

  io.canvas.addEventListener('mousedown', function(event){
  
    var cell = grid.getCellAt(io.getEventPosition(event),true);

    if (typeof grid.cells[cell.x][cell.y].taken == 'undefined'){

      if (xTurn) io.addObj(new iio.XShape(grid.getCellCenter(cell),100));
      else io.addObj(new iio.Circle(grid.getCellCenter(cell),50)
               .setStrokeStyle('black'));
      
      grid.cells[cell.x][cell.y].taken=true;
      xTurn=!xTurn;
    }
   });
};</pre>
<canvas id="canvas5" style="background:white" width="450px" height="450px"></canvas>
<p class="caption">The completed Tic Tac Toe game</p>

<p>You now know the basics on how to create an input driven HTML5 Canvas application using the iio Framework.</p>
<p>If you would like to learn more basics, like how to attach images and animations, or use kinematics, you should read through the <a href="../docs/iio-basics.php">iio Basics</a> documentation page, or just check out the <a href="../demos.php">demos</a> for some quick code samples.</p>
<p>If you would like to move on to more advanced concepts and learn how to make a frame rate driven application, check out the <a href="scroll-shooter.php">Scroll Shooter Tutorial</a>.</p>

<?php include('inc/footer.php'); ?>
</section>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine-1.2.1.js"></script>
<script>
Grid = function(io){
   var grid = io.addObj((new iio.ioGrid(0,0,3,3,150))
                  .setStrokeStyle('red',4));
}; iio.start(Grid,'canvas1');
Input = function(io){
  var grid = io.addObj(new iio.ioGrid(0,0,3,3,150));
  io.canvas.addEventListener('mousedown', function(event){
    alert(grid.getCellCenter(io.getEventPosition(event),true).toString());
  });
}; iio.start(Input,'canvas2');
Xs = function(io){
  var grid = io.addObj(new iio.ioGrid(0,0,3,3,150));
  io.canvas.addEventListener('mousedown', function(event){
    var cellCenter = grid.getCellCenter(io.getEventPosition(event),true);
    io.addObj(new iio.ioX(cellCenter, 100));
  });
}; iio.start(Xs,'canvas3');
XsOs = function(io){
  var grid = io.addObj(new iio.ioGrid(0,0,3,3,150));
  var xTurn = true;
  io.canvas.addEventListener('mousedown', function(event){
    var cellCenter = grid.getCellCenter(io.getEventPosition(event),true);
    if (xTurn)
      io.addObj(new iio.ioX(cellCenter, 100));
    else
      io.addObj((new iio.ioCircle(cellCenter, 50))
          .setStrokeStyle('black'));
    xTurn=!xTurn;
  });
}; iio.start(XsOs,'canvas4');
TicTacToe = function(io){
  var grid = io.addObj(new iio.ioGrid(0,0,3,3,150));
  var xTurn=true;
  io.canvas.addEventListener('mousedown', function(event){
    var cell = grid.getCellAt(io.getEventPosition(event),true);
    if (typeof grid.cells[cell.x][cell.y].taken == 'undefined'){
      if (xTurn) io.addObj(new iio.ioX(grid.getCellCenter(cell),100));
      else io.addObj(new iio.ioCircle(grid.getCellCenter(cell),50)
               .setStrokeStyle('black'));
      grid.cells[cell.x][cell.y].taken=true;
      xTurn=!xTurn;
    }
   });
};  iio.start(TicTacToe,'canvas5');
</script>
</body>
</html>