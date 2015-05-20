TicTacToe=function(app){

  //var dingX = app.loadAudio("assets/sounds/coin-3.wav");
  //var dingO = app.loadAudio("assets/sounds/coin-4.wav");

  	/*app.set({ color: 'black'} );
				
	var grid = app.add(new iio.Rectangle({
		pos: app.center,
		width: 300,
		color:'white'
	}))
	var o = grid.add(new iio.Rectangle({
		width: 200,
		color:'red'
	}))
	var q = o.add(new iio.Rectangle({
		width: 100,
		color:'blue'
	}))*/

	app.set({ color: 'black'} );
				
	var grid = app.add(new iio.Grid({
		pos: app.center,
		width: 300,
		color:'white',
		lineWidth:10,
		R:1,
		C:2
	}));

	grid.click = function(ev,p,cell){
		cell.set({color:'blue'});
		cell.add(new iio.X({
			width:40,
			color:'red'
		}))
	}

	/*app.set({ color: 'black'} );
				
	var grid = app.add(new iio.Grid({
		pos: app.center,
		width: ( app.height < app.width ) ? app.height : app.width,
		color:'white',
		lineWidth:10,
		R:3,
		C:3
	}));

	var xTurn = true;
	grid.click=function(event,ePos,cell){

		if(!cell.taken){

			if(xTurn) {
		        cell.add(new iio.X({
		          width: cell.height/1.3,
		          color: 'red',
		          lineWidth: 10
		        }));
		        //dingX.play();
		      } else {
		        cell.add(new iio.Circle({
		          width:cell.height/1.3,
		          outline: '#00baff',
		          lineWidth: 10
		        }));
		        //dingO.play();
		      }

			xTurn=!xTurn;

		} cell.taken=true;
	}*/
}

