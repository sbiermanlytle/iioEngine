MineSweeper = function(app,s){

	//set colors with random values
	var color = iio.random.color();
	var inverted = iio.color.invert(color);
	app.set(inverted);

	//decide max number of rows/columns
	var res = 15;

	//decide number of bombs 
	var num_bombs = 30;

	//set preview values (lower is better)
	if(s && s.preview) {
		res = 6;
		num_bombs = 7;
	}
				
	//create the grid
	var grid = app.add({
		pos:app.center,
		width: ( app.height < app.width ) ? app.height : app.width,
		lineWidth: 4,
		simple: true,
		type: iio.GRID,
		R: res,
		C: res,
		gridColor: color
	}, true);

	//place bombs
	var bombs = [];
	var bombs_placed = 0;
	var c,r;
	while(bombs_placed < num_bombs){

		//get random coordinate
		c = iio.random.integer( 0, grid.C );
		r = iio.random.integer( 0, grid.R );

		//if no bomb is present, place a bomb
		if( !grid.cells[c][r].BOMB ){
			if(!s || !s.preview) grid.cells[c][r].add({
				poa:{x:0,y:6},
				text:"!",
				font:'Consolas',
				width:20,
				align:'center',
				color:'red'
			}, true);
			grid.cells[c][r].add({
				width: grid.cells[c][r].height/1.2, 
				simple: true, 
				color: color
			}, true);
			grid.cells[c][r].BOMB = true;
			bombs_placed++;
		}
	}

	function checkForBomb(c,r){
		if(c>=0 && c<grid.C && r>=0 && r<grid.R 
			&& grid.cells[c][r].BOMB)
			bombs_placed++;
	}

	function checkforZero(c,r){
		if(c>=0 && c<grid.C && r>=0 && r<grid.R 
			&& grid.cells[c][r].objs.length>1 
			&& grid.cells[c][r].objs[0].text == '0')
			return true;
		return false;
	}

	function unhide(c,r){
		if(c>=0 && c<grid.C && r>=0 && r<grid.R 
			&& grid.cells[c][r].objs.length>1)
			grid.cells[c][r].rmv(1);
	}

	//set numbers on non-bomb cells
	for(c=0; c<grid.C; c++)
		for(r=0; r<grid.R; r++)
			if( !grid.cells[c][r].BOMB ){
				bombs_placed = 0;
				checkForBomb(c-1,r-1);
				checkForBomb(c-1,r);
				checkForBomb(c-1,r+1);
				checkForBomb(c,r-1);
				checkForBomb(c,r+1);
				checkForBomb(c+1,r-1);
				checkForBomb(c+1,r);
				checkForBomb(c+1,r+1);
				grid.cells[c][r].add({
					pos:{x:0,y:6},
					text:""+bombs_placed,
					font:'Consolas',
					width:20,
					align:'center',
					color:color
				}, true);
				grid.cells[c][r].add({
					width:grid.cells[c][r].height/1.2,
					simple:true,
					color:color,
					cover:true
				}, true);
			}
	app.draw();

	app.canvas.oncontextmenu=function(){ return false };

	explosion = function(x,y){
		for(var i=0; i<100; i++)
			app.add({
				pos:{x:x,y:y},
				color:color,
				width: 5,
				simple:true,
				vel:{
					x:iio.random.num(-8,8),
					y:iio.random.num(-8,8),
					r:iio.random.num(-.01,.01)
				},
				bounds:{
					top:0,
					bottom:app.height,
					right:app.width,
					left:0,
				}
			},true)
	}

	clearZeros = function(c,r){
		grid.cells[c][r].rmv(1);
		if(checkforZero(c-1,r-1)) clearZeros(c-1,r-1);
		else unhide(c-1,r-1);
		if(checkforZero(c-1,r)) clearZeros(c-1,r);
		else unhide(c-1,r);
		if(checkforZero(c-1,r+1)) clearZeros(c-1,r+1);
		else unhide(c-1,r+1);
		if(checkforZero(c,r-1)) clearZeros(c,r-1);
		else unhide(c,r-1);
		if(checkforZero(c,r+1)) clearZeros(c,r+1);
		else unhide(c,r+1);
		if(checkforZero(c+1,r-1)) clearZeros(c+1,r-1);
		else unhide(c+1,r-1);
		if(checkforZero(c+1,r)) clearZeros(c+1,r);
		else unhide(c+1,r);
		if(checkforZero(c+1,r+1)) clearZeros(c+1,r+1);
		else unhide(c+1,r+1); 
	}

	//handle click events
	var xTurn = true;
	grid.click=function(event,ePos,cell){
		if(event.button==2) {
			event.preventDefault();
			cell.objs[1].set('red');
		} else {
			cell.rmv(1);
			if(cell.objs[0].text=="0")
				clearZeros(cell.c,cell.r);
			else if(cell.BOMB)
				explosion(grid.pos.x+cell.pos.x,
					grid.pos.y+cell.pos.y)
		}
	}

	//if preview, click a random square
	//to simulate gameplay
	if(s && s.preview)
		for(c=1; c<grid.C; c++)
			for(r=1; r<grid.R; r++)
				if(grid.cells[c][r].objs[0].text=="0"){
					grid.click({},{},grid.cells[c][r]);
					break;
				}
}; iio.start(MineSweeper);