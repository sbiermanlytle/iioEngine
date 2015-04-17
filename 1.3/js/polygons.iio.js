polygons = function(app,s){

	//create position coordinates to use
	//as the center of each polygon object
	var x = app.center.x-60
	var y = app.center.y-59

	//add a blue triangle
	app.add([x-30,y+30
			,x+50,y+55
			,x,y-30]
			,"#00baff")

	//add a quadrilateral with a blue outline at 50x50
	x = 50
	y = 50
	app.add([x-35,y-35
			,x+5,y-35
			,x+20,y-12
			,x-20,y+50],"outline:#00baff:4")

	//add a large dashed hexagon in the center of the app
	x = app.center.x
	y = app.center.y
	app.add([x-65,y-110
            ,x+65,y-110
            ,x+130,y
            ,x+65,y+110
            ,x-65,y+110
            ,x-130,y],"outline:"+s.color+":10 dash:1,15:10")

	//add a star with a variable size
	x = app.center.x - 5
	y = 80
	var starSize = 6
	app.add([x-starSize,y-starSize
			,x-starSize*4,y-starSize
			,x-starSize*1.8,y+starSize*.8
			,x-starSize*2.8,y+starSize*3.6
			,x,y+starSize*1.9
			,x+starSize*2.8,y+starSize*3.6
			,x+starSize*1.8,y+starSize*.8
			,x+starSize*4,y-starSize
			,x+starSize,y-starSize
			,x,y-starSize*4],"outline:3:"+s.color)

	//add the shape at the bottom right corner
	x = app.width-10
	y = app.height-100
	app.add([x-70,y+90
			,x-160,y+90
			,x-143,y+70
			,x,y+90
			,x,y-30],
			"gradient:-10,-40,10,0"
			+":0,"+s.color
			+":1,transparent")

	//add a red pentagon with a transparent line gradient
	x = app.width-10
	y = 40 + 2
	app.add([x-65,y-30
			,x-82,y+10
			,x-40,y+130
			,x,y+50
			,x,y-30],
			"gradient:-62,120,90,30"
			+":0,red"
			+":.35,red"
			+":.5,transparent"
			+":.68,rgba(255,0,0,.3)"
			+":1,red")

	//add a blue quadrilateral with a white dotted outline
	//and a radial gradient like a hole in the middle
	x = app.center.x+60
	y = app.center.y+60
	app.add([x-70,y+10
            ,x-50,y+30
            ,x+10,y+10
            ,x-20,y-80],"outline:2:white dash:2,2"
            +" gradient:40,-15,.1,40,-15,20"
			+":0,transparent"
			+":1,#00baff")

	//add a red quadrilateral with a white outline
	//and a radial gradient like a hole in the middle
	x = app.center.x+70
	y = app.center.y-10
	app.add([x-70,y+10
            ,x-18,y+28
            ,x+10,y+10
            ,x-20,y-80],"outline:2:white"
            +" gradient:40,-15,.1,40,-15,25"
			+":0,transparent"
			+":1,red")

	//add a white outlined arrow pointing right
	x = app.center.x-65
	y = app.center.y+20
	app.add([x+60,y+10
            ,x+20,y-20
            ,x+20,y
            ,x-20,y
            ,x-20,y+20
            ,x+20,y+20
            ,x+20,y+40],"outline:white:4")

	//add a red arrow pointing left
	x = 0
	y = app.center.y-9
	app.add([x+40,y+5
            ,x+10,y-10
            ,x+20,y+2
            ,x-10,y+2
            ,x-10,y+8
            ,x+20,y+8
            ,x+10,y+20],"rotate:"+Math.PI+" red")

	//add a dashed outlined arrow pointing right and downward
	x = 20
	y = app.height-30
	app.add([x+50,y+10
            ,x+15,y-15
            ,x+15,y
            ,x-15,y
            ,x-15,y+15
            ,x+15,y+15
            ,x+15,y+30],"outline:"+s.color+":5 rotate:.52 dash:8,10:10 round")

	app.draw()
}