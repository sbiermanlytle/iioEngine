/* TextEdit
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

TextEdit = function( app, settings ){

  // set a random background color
  app.set({ color: iio.Color.random() });
        
  // add a new text object
  var editText = app.add(new iio.Text({
    pos: app.center,
    text: settings && settings.preview
      ? 'iio.js'
      : 'edit this text',
    font: 'Arial',
    size: 40,
    color: iio.Color.invert(app.color),
    // render a cursor to keep track of edit position
    showCursor: true,
  }));

  // pass the key press event to the text object
  app.onKeyDown = function(event, key){
    // prevent backspace from navigating to the previous page
    if (key === 'backspace')
      event.preventDefault();
    editText.onKeyDown(key);
  }

  // pass the key release event to the text object
  app.onKeyUp = function(event, key){
    editText.onKeyUp(key);
  }
}

