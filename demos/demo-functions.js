function create_demo_canvas( SIZE, id ){

  var canvas, container, h, p;
  
  container = document.createElement('div');
  container.className += "demo_wrap";

  h = document.createElement('h4');
  h.innerHTML = id;
  h.className += "demo_title";

  canvas = document.createElement('canvas');
  canvas.id = id;
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas.className += "demo";
  /*canvas.codeurl = testcode_url(R,C);
  canvas.onclick = function(e){
    codeWindow = window.open(this.codeurl, "littleWindow", "location=no,menubar=no,toolbar=no,width=500,height=600,left=0"); 
    codeWindow.moveTo(0,0);
  }*/
  
  container.appendChild(canvas);
  container.appendChild(h);
  iioapps.appendChild(container);
  return canvas;
}