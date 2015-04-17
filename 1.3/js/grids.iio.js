grids = function(app,s){

	//140x140 yellow grid with 5x5 cells
	app.add(app.center,"140: R:5 C:5 1 yellow")

	//full screen 10x10 grid with a multiple color stop gradient
	app.add(app.center
		,app.width+":"+app.height+" R:10 C:10 2"+
		" gradient:0,0,300,300"
			+":0,#009b3a"
			+":.10,#009b3a"
			+":.101,00baff"
			+":.284,00baff"
			+":.29,transparent"
			+":.36,transparent"
			+":.37,"+s.color
			+":.6,"+s.color
			+":1,transparent")

	//rotated red grid in the upper left corner
	app.add([app.width/4-20,app.height/4-20]
		,app.width/2+":"+app.height+" R:10 C:5 2 red rotate:"+Math.PI/4)

	app.draw();
}