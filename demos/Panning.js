/* Panning
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Panning = function( app, settings ){

  // app settings
  var rows = 30; // number of rows/columns on the grid
  var panDistance = 100;
  var panSpeed = 8;

  // preveiw settings
  if (settings && settings.preview) {
    panDistance = 60;
  }

  // set app background color
  app.set({ color: 'black' });

  // add a grid larger than the window
  var grid = app.add( new iio.Grid({
    pos:app.center.clone(),
    width:app.width*2,
    color:'white',
    R:rows,
    C:rows,
    vel:[0,0],
  }), true);

  // color <200 cells for spatial reference
  for (var i = 0; i < 200; i++) {
    var cell = grid.cells[iio.randomInt(0, rows)][iio.randomInt(0, rows)];
    cell.color = iio.Color.random();
  }

  // draw all objects
  app.draw();

  // add a mouse move event handler to the canvas
  iio.addEvent(app.canvas, 'mousemove', function(event){
    var mousePos = app.eventVector(event);

    // set the grid velocity if the mouse position is
    // past the panning distance on the given axis
    function handlePanning(axis, gridBounds, appBound) {
      // check left/top panning
      if(mousePos[axis] < panDistance) {
        if(grid.vel[axis] === 0 && gridBounds[0] < -panDistance){
          grid.vel[axis] = panSpeed;
          app.unpause(); // start the draw loop
        }
      } 
      // check right/bottom panning
      else if(mousePos[axis] > appBound - panDistance){
        if(grid.vel[axis] === 0 && gridBounds[1] > appBound + panSpeed){
          grid.vel[axis] = -panSpeed;
          app.unpause(); // start the draw loop
        }
      } 
      // stop panning on given axis
      else {
        grid.vel[axis] = 0;
        if(grid.vel.y === 0 && grid.vel.x === 0)
          app.pause(); // cancel the draw loop
      }
    }

    // handle horizontal panning
    handlePanning('x', [grid.left(), grid.right()], app.width);
    // handle vertical padding
    handlePanning('y', [grid.top(), grid.bottom()], app.height);
  });

  // prevent panning past grid edges
  grid.onUpdate = function(){
    if(grid.left() > -panSpeed
     ||grid.right() < app.width + panSpeed)
      grid.vel.x = 0;
    if(grid.top() > -panSpeed
     ||grid.bottom() < app.height + panSpeed)
      grid.vel.y = 0;
  }

  // stop all panning
  function stopAllPanning(){
    grid.vel.x = 0;
    grid.vel.y = 0;
    app.pause(); // cancel the draw loop
  }

  // stop all panning on mouse out of canvas
  iio.addEvent(app.canvas, 'mouseout', function(event){
    stopAllPanning();
  });

  // stop all panning on mouse out of window
  iio.addEvent(window, 'mouseout', function(e){
    stopAllPanning();
  });
}
