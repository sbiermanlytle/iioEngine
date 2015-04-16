GridApp = function(io){

  //Create Grid
  var gridRes = 52;

  //New Constructor added in Github distrib
  //var grid = io.addObj(new iio.Grid(0,0,io.canvas,gridRes));

  var grid = io.addObj(new iio.Grid(0,0
                           ,parseInt(io.canvas.width/gridRes,10)+1
                           ,parseInt(io.canvas.height/gridRes,10)+1
                           ,gridRes));

  grid.setStrokeStyle('white');
  grid.draw(io.context);

  //Create Red Walls
  function createWall(r,c){
    grid.cells[r][c].wall=true;
    return io.addObj(new iio.SimpleRect(grid.getCellCenter(r,c),gridRes-2)
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

    if (iio.keyCodeIs('up arrow', event) 
      ||iio.keyCodeIs('down arrow', event))
      event.preventDefault();
        
    if (iio.keyCodeIs('up arrow', event)
      && blue.c-1 >= 0
      && !grid.cells[blue.r][blue.c-1].wall){
        blue.pos.y-=gridRes;
        blue.c--;
    } else if (iio.keyCodeIs('right arrow', event)
      && blue.r+1 < grid.C
      && !grid.cells[blue.r+1][blue.c].wall){
        blue.pos.x+=gridRes;
        blue.r++;
    } else if (iio.keyCodeIs('down arrow', event)
      && blue.c+1 < grid.R
      && !grid.cells[blue.r][blue.c+1].wall){
        blue.pos.y+=gridRes;
        blue.c++;
    } else if (iio.keyCodeIs('left arrow', event)
      && blue.r-1 >= 0
      && !grid.cells[blue.r-1][blue.c].wall){
        blue.pos.x-=gridRes;
        blue.r--;
    } io.canvas.draw(io.context);
  });
};