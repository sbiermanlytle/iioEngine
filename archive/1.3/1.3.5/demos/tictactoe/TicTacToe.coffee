@TicTacToe = (app) ->

	app.set 'black'
				
	grid = app.add
		pos: app.center
		width: if app.height < app.width then app.height else app.width
		lineWidth: 10
		type: iio.GRID
		R: 3
		C: 3
		gridColor: 'white'

	xTurn = true

	grid.click = (event,ePos,cell) ->
 
		if not cell.taken 

			if xTurn 
				cell.add
					width:cell.height/1.3
					type:iio.X
					color:'red'
					lineWidth:10
			
			else cell.add
				width:cell.height/1.3
				type:iio.CIRC
				outline: '#00baff'
				lineWidth:10

			xTurn = not xTurn

		cell.taken = true