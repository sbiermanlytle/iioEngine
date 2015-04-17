<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Grid';
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
/* iioEngine_docs-grid */
google_ad_slot = "7486039530";
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
        <h1>Grid</h1>
        <h4>Extends :: <a href="Obj.php">Obj</a></h4>
        <p>A class that defines a grid at a given position with a number or rows, columns, and a cell resolution. The position vector <span class="kwd">pos</span> is at the top-left corner of an <a href="">Grid</a>.</p>
        <p>This class must be accessed through the <span class="ioblue">iio</span> package.</p>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="constructors">&nbsp;</a> 
        <h2>Constructors</h2>
        <p>These functions are used to instantiate new instances of the <a href="">Grid</a> class. Constructor functions must be preceded by the <span class="kwd">new</span> keyword.</p>
        <div class="docs-inner">
          <h3><span class="kwd">iio</span>.Grid( <a class="red" href="Vec.php#vector">Vector</a> pos, <?php echo $NumberLink ?>: columns, rows, xRes, yRes )</h3>
          <h3 class="func"><span class="kwd">iio</span>.Grid( <?php echo $NumberLink ?>: x1, y1, columns, rows, xRes, yRes )</h3>
          <p>- creates a grid at the given vector with the given properties.</p>
          <p>- <span class="kwd">xRes</span> and <span class="kwd">yRes</span> refer to the resolution of a cell (in pixels). If <span class="kwd">yRes</span> is unspecified, the grid will have square cells with <span class="kwd">xRes</span> as their size.</p>
          <p>- the default value for any undefined parameter (except <span class="kwd">yRes</span> when <span class="kwd">xRes</span> exists) is <span class="kwd">0</span>.</p>
          <pre class="prettyprint gridnums:1">
//create 10x10 grid with 20x22 cells
var grid = new iio.Grid(0,0,10,10,20,22);

//create 3x4 grid with 50x50 cells
var grid2 = new iio.Grid(0,0,3,4,50);</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-properties">&nbsp;</a> 
        <h2>Inherited Properties</h2>
        <h4>Grid :: <a href="Obj.php#properties">Obj</a></h4>
          <?php include('shared/Obj-properties.php'); ?>
      </div>
      <?php include('shared/Obj-graphics-props.php'); ?>
          </div>
      <div class="docs-middle">
         <a class="anchor" name="properties">&nbsp;</a> 
        <h2>Properties</h2>
        <p>The new data added by the <a href="">Grid</a> class.</p>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="cells">&nbsp;</a> 
          <h3>.cells :: <a href="Vec.php">Vec</a></h3>
          <p>- a matrix representing the coordinates of this grid. Cells are indexed as [row][column].</p>
          <pre class="prettyprint gridnums:1">
//get a grids first cell
var cell0 = grid.cells[0][0];

//add a property called 'impassible'
//to the top row of grid cells
for (var c=0; c&lt;grid.C; c++)
  grid.cells[0][c].impassible = true;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="R">&nbsp;</a> 
          <h3>.R :: <?php echo $NumberLink ?></h3>
          <p>- the number of rows in this grid</p>
          <pre class="prettyprint gridnums:1">
//get the number of rows
var r = grid.R;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="C">&nbsp;</a> 
          <h3>.C :: <?php echo $NumberLink ?></h3>
          <p>- the number of columns in this grid</p>
          <pre class="prettyprint gridnums:1">
//get the number of rows
var c = grid.C;</pre>
        </div>
        <div class="docs-inner">
         <a class="anchor inner-anchor" name="res">&nbsp;</a> 
          <h3>.res :: <a href="Vec.php">Vec</a></h3>
          <p>- a vector defining this grids cell resolution.</p>
          <pre class="prettyprint gridnums:1">
//get the cell resolution
var xRes = grid.res.x;
var yRes = grid.res.y;</pre>
        </div>
      </div>
        <div class="docs-middle">
         <a class="anchor" name="inherited-functions">&nbsp;</a> 
        <h2>Inherited Functions</h2>
        <h4>Grid :: <a href="Obj.php#functions">Obj</a></h4>
        <div class="docs-inner">
          <?php include('shared/Obj-functions.php'); ?>
        </div>
      </div>
      <?php include('shared/Obj-graphics-fns.php'); ?>
        </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>Functions</h2>
        <p>These functions are added by the <a href="">Grid</a> class, and available to all instantiated <a href="">Grid</a> objects.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="clone">&nbsp;</a> 
          <h3>.clone</span>()</h3>
        <h5>:: Returns <a href="">Grid</a></h5>
          <p>- returns a new <a href="">Grid</a> with the same properties as this one. Makes a hard copy of the object.</p>
         <pre class="prettyprint gridnums:1">
//clone a grid
var gridClone = grid.clone();</pre>
        </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="resetCells">&nbsp;</a> 
          <h3>.resetCells</span>()</h3>
        <h5>:: Returns <a href="iio-basics.php">this</a></h5>
          <p>- recreates this grids <a href="cells">cells</a> array. All properties previously set will be erased from the structure.</p>
          <pre class="prettyprint gridnums:1">
//reset grid cells
grid.resetCells();</pre>
        </div>
                <div class="docs-inner">
        <a class="anchor inner-anchor" name="getCellAt">&nbsp;</a> 
          <h3>.getCellAt</span>( <a class="red" href="Vec.php#vector">Vector</a> v )</h3>
          <h3 class="func">.getCellAt</span>( <?php echo $NumberLink ?>: x, y )</h3>
        <h5>:: Returns <a href="Vec.php">Vec</a></h5>
          <p>- returns a vector with the coordinates of the cell that contains the given position.</p>
          <p>- if the given position is contained in the grid, this function will return <span class="kwd">false</span>.</p>
          <pre class="prettyprint gridnums:1">
//get the cell at canvas center
var c = grid.getCellAt(io.canvas.center)</pre>
        </div>
       <div class="docs-inner">
        <a class="anchor inner-anchor" name="getCellCenter">&nbsp;</a> 
          <h3>.getCellCenter</span>( <a class="red" href="Vec.php#vector">Vector</a> v, <?php echo $BoolLink?> pixelPos )</h3>
          <h3 class="func">.getCellCenter</span>( <?php echo $NumberLink ?>: x, y, <?php echo $BoolLink?> pixelPos )</h3>
        <h5>:: Returns <a href="Vec.php">Vec</a></h5>
          <p>- returns the center position of the cell of interest.</p>
          <p>- <span class="kwd">pixelPos</span> is a flag to indicate if the given coordinate is a absolute position on the canvas or an index set to this grid's cell structure. The default value for this parameter is <span class="kwd">false</span></p>
          <pre class="prettyprint gridnums:1">
//get the center of cell 1,1
var c = grid.getCellCenter(1,1)

//get the center of whichever
//cell contains the coordinate 50x50
var c = grid.getCellCenter(50,50,true);</pre>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>