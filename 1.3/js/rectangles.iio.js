rectangles = function(app,s){

	//red 40x40 red square at 30x30
	app.add([30,30],"40: red");

	//red 40x40 red outlined square at 30x80
	 //lineWidth is set to 2
	app.add([30,80],"40: outline:2:red");

	//45x100 yellow rectangle with a 2px dashed white outline
	app.add([80,70],"45:100 yellow outline:2:white dash:10,5");

	//200x29 blue rectangle with a fade-in/fade-out gradient
	app.add([200,29],"180:50"+
		" gradient:-100,100,100,100"
			+":0,transparent"
			+":.5,#00baff"
			+":1,transparent");

	//red 30x180 rectangle with a gradient like a health bar
	 //white outline with lineWidth of 2
	app.add([30,200],"30:180 outline:2:white"+
		" gradient:0,-90,0,90"
			+":0,rgb(30,181,58)"
			+":.5,yellow"
			+":1,rgb(255,0,0)")

	//45x150 rectangle with a radial gradient like a hole
	app.add([80,210],"45:150 "+
		" gradient:0,0,.01,0,0,20"
			+":0,transparent"
			+":1,"+s.color)

	//170x120 rectangle with a gradient like a flag
	app.add([200,120],"170:120 outline:2:white "+
		" gradient:0,-100,90,30"
			+":0,#009b3a"
			+":.40,#009b3a"
			+":.401,yellow"
			+":.45,yellow"
			+":.451,black"
			+":.6,black"
			+":.601,yellow"
			+":.65,yellow"
			+":.651,#00baff"
			+":1,#00baff");

	//70x70 square with a dashed outline and a radial gradient color
	app.add([160,240],"70: dash:5,5"+
		" rotate:"+Math.PI/4+" outline:2:"+s.color+
		" gradient:0,0,.01,0,0,50"
			+":0,"+s.color
			+":1,transparent")

	//48x80 rectangle with a dotted outline
	app.add([250,240],"48:80 dash:1,15 round"+
		" rotate:3 outline:8:"+s.color)

	app.draw()
}