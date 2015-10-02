/* BezierCurves
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

BezierCurves = function(app, settings) {

  // padding from edge of view
  var padding = app.width/10;
  var radius = app.width/40;
  var lineWidth = app.width/40;
  
  // set app color
  var color = iio.Color.white();

  // if not in preview mode
  if( !settings || (settings && !settings.preview) ){

    // set color to random
    color = iio.Color.random();

    // set inverse as app background
    app.set({ color:iio.Color.invert(color) });

    // add instructions
    app.add(new iio.Text({
      pos: [app.center.x, 40],
      text: 'click and hold to drag handles',
      color: color,
      size: 18,
    }));
  } 

  // add bezier curve
  var line = app.add(new iio.Line({
    color: color,
    width: lineWidth,
    vs:[
      [ padding, padding ],
      [ app.width-padding, app.height-padding ]
    ],
    bezier: [
      [ app.width-padding*2, padding*2 ],
      [ padding*2 ,app.height-padding*2 ]
    ]
  }));

  // drag selected on mouse move
  var selected;
  app.canvas.addEventListener('mousemove', function(event){
    if(selected) {
      selected.pos.set(app.convert_event_pos(event));
      app.draw();
    }
  });

  // common handle properties
  var common = {
    lineWidth: 4,
    outline: color,
    // select on mouse down
    onMouseDown: function(obj){ 
      selected = obj;
    },
    // deselect on mouse up
    onMouseUp: function(obj){
      selected = undefined;
    },
  }

  // add pairs of handles
  for (var i=0; i<2; i++) {
    app.add(new iio.Ellipse(common,{
      pos: line.vs[i],
      radius: radius*2,
    }));
    app.add(new iio.Ellipse(common,{
      pos: line.bezier[i],
      radius: radius,
    }));
    // add line to connect handles
    app.add(new iio.Line({
      color: color,
      width: 2,
      vs:[ line.vs[i], line.bezier[i] ],
    }));
  }
}