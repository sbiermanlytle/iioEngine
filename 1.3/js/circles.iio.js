circles = function(app,s){

	//red circle
	app.add([60,60],"50 red")

	//large outer circle with dotted outline
	app.add(app.center,"140 dash:1,15:11 round outline:10:"+s.color)

	//circle with a colored dashed outline
	app.add([app.width-80,80],"70 dash:10,5 outline:4:white "+s.color)

	radius = 150;
	//circle with a gradient like a light
	app.add([220,200],radius+
		" gradient:0,0,.01,0,0,"+radius
		+":0,rgba(255,255,0,.7)"
		+":1,transparent")

	radius = 80;
	//circle with target gradient
	app.add([radius+50,app.center.y],radius+
		" gradient:0,0,.01,0,0,"+radius
		+":0,rgb(255,238,40)"
		+":.18,rgb(255,238,40)"
		+":.19,rgb(194,66,57)"
		+":.4,rgb(194,66,57)"
		+":.41,rgb(130,194,238)"
		+":.6,rgb(130,194,238)"
		+":.61,rgb(254,254,254)"
		+":.78,rgb(254,254,254)"
		+":.79,rgb(52,50,51)"
		+":.97,rgb(52,50,51)"
		+":.98,white"
		+":1,white")

	radius = app.width/2-35
	//rainbow 
	app.add([app.center.x,app.height],[radius,
		 	,'gradient:0,0,'+radius+',0,0,'+(radius-35)
		 	+':0,transparent'
		 	+':.04,red'
		 	+':.22,orange'
		 	+':.33,yellow'
		 	+':.5,green'
		 	+':.66,aqua'
		 	+':.83,blue'
		 	+':.96,purple'
		 	+':1,transparent']);

	//transparent blue circle
	app.add([70,230],"65 rgba(0,186,255,.3)")

	app.draw()
}