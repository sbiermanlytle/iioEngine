/* Rain
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2018, iio inc. All rights reserved.
*/
Rain = function( app, settings ){
  app.set({ color:'black' });

  var scale = settings.scale || 15;
  var speed = settings.speed || 4;

  // stop the lines from updating once they go off screen
  var stopUpdating = function() {
    this.onUpdate = undefined
  }

  // create a new set of lines from the starting point
  var create = function() {
    for (var i = 0; i < app.width / scale; i += 2) {
      app.add(new iio.Quad({
        pos: [ i * scale, (-scale / 2) - 1 ],
        width: scale,
        color: iio.Color.random(),
        speed: iio.random(0.4, 0.8),
        onUpdate: function() {
          this.pos.y += this.speed / 2;
          this.height += this.speed;
        },
        bounds: {
          bottom: { bound: app.height + scale, callback: stopUpdating },
          top: { bound: -scale, callback: stopUpdating },
          left: { bound: -scale, callback: stopUpdating },
          right: { bound:  app.width + scale, callback: stopUpdating },
        },
        zIndex: -20
      }));
    }
  }
  create();

  // create a new set of lines when the user clicks the screen
  app.onMouseUp = function() {
    create();
  }
}
