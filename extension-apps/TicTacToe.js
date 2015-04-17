function TicTacToe(iio){
	var ioVec = iio.ioVec,
    	ioObj = iio.ioObj,
    	ioX = iio.ioX,
    	ioLine = iio.ioLine,
    	ioRect = iio.ioRect,
    	ioBox = iio.ioBox,
    	ioCircle = iio.ioCircle,
    	ioText = iio.ioText,
    	ioGrid = iio.ioGrid;

	var app, grid;
	var xTurn = true;
	this.init = function(appManager){
		app = appManager;
		grid = app.addObj(new ioGrid(13, 13, 3, 3, 118)).draw(app.context);
	}
	this.inputDown = function(event){
		var pos = app.getEventPosition(event);
		var cI = grid.getIndiciesOf(pos);
		if (typeof(grid.cells[cI.x][cI.y].taken) == 'undefined'){
			var p = grid.getCellCenter(cI.x, cI.y);
			if (xTurn) app.addObj(new ioX(p.x, p.y, 80)).draw(app.context);
			else app.addObj(new ioCircle(p.x, p.y, 40, false)).draw(app.context);
			grid.cells[cI.x][cI.y].taken = true;
			xTurn=!xTurn;
		}
	}
}