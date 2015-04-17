<?php 
    $homepath = '../';
    $title = 'X-Shape Demo Code';
	include('../inc/preHeader.php');
?>
<body>
<pre class="prettyprint linenums:1">
GridApp = function(io){

  //Size of grid cells
  var gridRes = 52;

  //Create grid
  var grid = io.addObj(
    new iio.Grid(0,0
     ,parseInt(io.canvas.width/gridRes,10)+1
     ,parseInt(io.canvas.height/gridRes,10)+1
     ,gridRes));

  //New Constructor added in Github distrib
  //var grid = io.addObj(
    //new iio.Grid(0,0,io.canvas,gridRes));

  //Draw Grid
  grid.setStrokeStyle('white');
  grid.draw(io.context);

  //Create Red Walls
  function createWall(r,c){
    grid.cells[r][c].wall=true;
    return io.addObj(
      new iio.SimpleRect(
        grid.getCellCenter(r,c),gridRes-2)
        .setFillStyle('red'));
  }
  var reds = [];
  reds[0] = createWall(2,1);
  reds[1] = createWall(3,1);
  reds[2] = createWall(2,2);
  reds[3] = createWall(3,2);
  reds[4] = createWall(6,2);
  reds[5] = createWall(7,2);
  reds[6] = createWall(7,3);
  reds[7] = createWall(6,1);

  //Create Blue Square
  var blue = new iio.SimpleRect();
  blue.r = 4;
  blue.c = 4;
  blue.setSize(gridRes-2,gridRes-2);
  blue.setPos(grid.getCellCenter(blue.r,blue.c));
  blue.setFillStyle('#00baff');
  io.addObj(blue);
  
  //Handle input
  window.addEventListener('keydown', function(event){

    //disable page scrolling for arrow keys
    event.preventDefault();

    if (iio.keyCodeIs('up arrow', event) 
      ||iio.keyCodeIs('w', event))
      &amp;&amp; blue.c-1 &gt;= 0
      &amp;&amp; !grid.cells[blue.r][blue.c-1].wall){
        blue.pos.y-=gridRes;
        blue.c--;
    } 
    else if (iio.keyCodeIs('right arrow', event)
      ||iio.keyCodeIs('d', event))
      &amp;&amp; blue.r+1 &lt; grid.C
      &amp;&amp; !grid.cells[blue.r+1][blue.c].wall){
        blue.pos.x+=gridRes;
        blue.r++;
    } 
    else if (iio.keyCodeIs('down arrow', event) 
      ||iio.keyCodeIs('s', event))
      &amp;&amp; blue.c+1 &lt; grid.R
      &amp;&amp; !grid.cells[blue.r][blue.c+1].wall){
        blue.pos.y+=gridRes;
        blue.c++;
    } 
    else if (iio.keyCodeIs('left arrow', event) 
      ||iio.keyCodeIs('a', event))
      &amp;&amp; blue.r-1 &gt;= 0
      &amp;&amp; !grid.cells[blue.r-1][blue.c].wall){
        blue.pos.x-=gridRes;
        blue.r--;
    }
    //redraw canvas
    io.canvas.draw(io.context);
  });
};</pre>
</body>
</html>