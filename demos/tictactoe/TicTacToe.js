TicTacToe=function(app){

  //var dingX = app.loadAudio("assets/sounds/coin-3.wav");
  //var dingO = app.loadAudio("assets/sounds/coin-4.wav");

	app.set('black');
				
	var grid = app.add({
		pos:app.center,
		width:(app.height<app.width)?app.height:app.width,
		lineWidth:10,
		type:iio.GRID,
		R:3,
		C:3,
		gridColor:'white'
	});

	var xTurn = true;
	grid.click=function(event,ePos,cell){

		if(!cell.taken){

			if(xTurn) {
        cell.add({
          width:cell.height/1.3,
          type:iio.X,
          color:'red',
          lineWidth:10
        });
        //dingX.play();
      } else {
        cell.add({
          width:cell.height/1.3,
          type:iio.CIRC,
          outline: '#00baff',
          lineWidth:10
        });
        //dingO.play();
      }

			xTurn=!xTurn;

		} cell.taken=true;
	}
}

