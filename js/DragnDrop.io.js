DragAndDropApp = function(io){

      //redraw canvas when objects have moved
      io.setFramerate(60);

      //create a blue circle at with radius 60
      var draggables = [];
      draggables[0] = io.addObj(new iio.Circle(io.canvas.center.x
                                              ,io.canvas.center.y+70
                                              ,60)
                                       .setFillStyle('red')
                                       .setAlpha(.9));

      draggables[1] = io.addObj(new iio.Rect(io.canvas.center.x+120
                                            ,io.canvas.center.y-70
                                            ,160,100)
                                       .setFillStyle('00BAFF')
                                       .setAlpha(.9));

      draggables[2] = io.addObj(new iio.Poly(io.canvas.center.x-130
                                            ,io.canvas.center.y-50 
                                            ,[-36,-64
                                            , 36,-64
                                            , 75,0
                                            , 36,64
                                            ,-36,64
                                            ,-75,0])
                                       .setFillStyle('65B042')
                                       .setAlpha(.9));

      var dV; //remember where the mouse is relative to 
              //circle center

      //keep index of selected object
      var selected = -1;
      //handle mouse down
      io.canvas.addEventListener('mousedown', function(event){
        event.preventDefault();
        for (var i=draggables.length-1;i>=0;i--)
          if (draggables[i].contains(io.getEventPosition(event))){
              draggables[i].active = true;
              dV=iio.Vec.sub(draggables[i].pos
                 ,io.getEventPosition(event));
              selected=i;
              return;
          }
      });

      //handle mouse move
      io.canvas.addEventListener('mousemove', function(event){
          if (selected>-1)
              draggables[selected].setPos(io.getEventPosition(event).add(dV));
      });

      //handle mouse up
      function deselect(event){ selected=-1; }
      io.canvas.addEventListener('mouseup', deselect);
      //release circle when mouse moves off canvas
      this.focusOff = deselect;
    };