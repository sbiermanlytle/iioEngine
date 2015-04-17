text = function(app,s){

	//70px Impact font, outlined with the given color
	app.add("hello iio",app.center
		,'align:center baseline:middle font:Impact 70 outline:'+s.color)

	//30px Verdana font, colored blue
	app.add("solid text",[app.center.x,app.center.y+65]
		,'align:center font:Verdana 30 #00baff')

	//40px italic Platino font, colored blue
	app.add("italic text",[app.center.x,app.center.y+105]
		,'align:center font:Palatino 40 italic #00baff')

	//20px Verdana bold font, colored red
	app.add("BOLD TEXT",[app.center.x,app.height-14]
		,'align:center font:Verdana 20 bold red')

	//34px Courier font, dotted outline
	app.add("dotted text",[app.center.x,app.center.y-43]
		,'align:center font:Courier 34 dash:2,2 round outline:'+s.color)

	//53px bold Impact font, dashed blue outline
	app.add("dashed text",[app.center.x,70]
		,'align:center font:Impact 56 bold dash:4,3 outline:4:#00baff')

	//20px italic Georgia font, rotated, colored with a radial gradient
	app.add("hidden text",[app.center.x+100,app.center.y+90]
		,'align:center font:Georgia 20 italic rotate:'+Math.PI/2+
		" gradient:0,0,.01,0,0,60"
		+":0,rgba(255,255,120,.75)"
		+":1,transparent")

	//26px Consolas font, black color with an outline, rotated
	app.add("rotated",[50,app.center.y+90]
		,'align:center font:Consolas 26 black outline:1:'+s.color+' rotate:'+Math.PI/2*3)

	app.draw();
}