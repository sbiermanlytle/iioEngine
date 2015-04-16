/*
   iio engine
   Version 1.4.0 Working Version
*/
iio_dependency_path = "http://iioengine.com/src/core/"
iio_dependencies = [
  'core.js',
  'libs.js',
  'V.js',
  'Color.js',
  'Obj.js',
  'App.js',
  'SpriteMap.js',
  'Drawable.js',
  'Line.js',
  'Polygon.js',
  'Rectangle.js',
  'Square.js',
  'Grid.js',
  'Ellipse.js',
  'Text.js',
]

var load_iio_remote = function(onload){
  iio_load_dependency(0,onload);
}

var iio_load_dependency = function(i,onload){
  var file_element = document.createElement('script');
  file_element.setAttribute("type","text/javascript");
  file_element.setAttribute("src", iio_dependency_path + iio_dependencies[i]);
  if (typeof file_element!="undefined")
        document.getElementsByTagName("head")[0].appendChild(file_element)

  file_element.onload = function(){
    if(i<iio_dependencies.length-1)
      iio_load_dependency(i+1,onload);
    else onload();
  }
}
