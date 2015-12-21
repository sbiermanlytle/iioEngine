/* Drag and Drop
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

DragDrop = function( app, settings ){


  var color = iio.Color.random(); // create a random app color
  var size = 450;

  if (settings && settings.preview)
    size = 80;

  // set the background to the inverse
  app.set({ color: iio.Color.invert(color) });

  // add position text
  if (!settings || !settings.preview) {
    var positionText = app.create('position text', app.center, color);
    positionText.text = positionText.pos;
  }
  
  var selectDistance; // distance between object center and mouse pos
  var selectedObj;

  // set event listener on canvas for mouse move
  iio.addEvent(app.canvas, 'mousemove', function(event){
    // if an object is selected
    if(selectedObj) {
      // move the object to mouse position plus the select distance
      selectedObj.pos = app.eventVector(event).add(selectDistance);
      // set the text to the objects position
      if (positionText) positionText.text = selectedObj.pos;
      // redraw the app
      app.draw();
    }
  });

  // common object properties and functions
  var common = {
    pos: app.center,
    outline: color,
    lineWidth: 10,
    // called when the object is clicked 
    onMouseDown: function(obj, event, pos){
      selectDistance = iio.Vector.sub(obj.pos, pos);
      selectedObj = obj;
    },
    // called when the object is released 
    onMouseUp: function(obj){
      selectedObj = undefined;
    }
  }

  // create one of three shapes
  var shape = iio.randomInt(0,3);
  switch(shape) {
    // create a square (iio.Rectangle)
    case 0: app.create(common,{ width:size });
      break;
    // create a circle (iio.Ellipse)
    case 1: app.create(common,{ radius:size/2 });
      break;
    // create a triangle (iio.Polygon)
    default: app.create(common,{
      vs: [
        [    0,-size/1.4 ],
        [  size/1.5, size/2 ],
        [ -size/1.5, size/2 ]
      ]
    });
  }

  
}

