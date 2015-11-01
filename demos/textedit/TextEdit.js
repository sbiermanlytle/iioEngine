/* TextEdit
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

TextEdit = function( app, settings ){

  // set the background color to black
  app.set({ color: 'black' });
        
  // add a new text object
  var editText = app.add(new iio.Text({
    pos: app.center,
    text: 'edit this text',
    font: 'Arial',
    size: 60,
    color: 'white',
    // render a cursor to keep track of edit position
    showCursor: true,
  }));

  // pass the key press event to the text object
  app.onKeyDown = function(event, key){
    editText.onKeyDown(key);
  }
  // pass the key release event to the text object
  app.onKeyUp = function(event, key){
    editText.onKeyUp(key);
  }
}

