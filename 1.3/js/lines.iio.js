lines = function(app,s){

	var y = 10;
	//4px red line
	app.add([0,y,app.width,y],"4 red")

	y+=10;
	//5px transparent red line
	app.add([0,y,app.width,y],"5 rgba(255,0,0,.5)")

	y+=12;
	//10px red-black gradient line
	app.add([0,y,app.width,y],"10 gradient:0,100,300,100:0,red:1,black")

	y+=18;
	//16px red-yellow-s.color gradient line
	app.add([0,y,app.width,y],"16"+
		" gradient:0,100,300,100"
			+":0,rgb(255,0,0)"
			+":.5,yellow"
			+":1,"+s.color)

	y+=40;
	//52px s.color-black-red-yellow-s.color radial gradient line
	app.add([0,y,app.width,y],"52"+
	  	" gradient:150,1,3,150,1,140"
			+":0,"+s.color
			+":.1,black"
			+":.4,red"
			+":.7,yellow"
			+":1,"+s.color)

	y+=36;
	//8px yellow-s.color-red gradient line
	app.add([0,y,app.width,y],"8"+
		" gradient:0,100,300,100"
			+":0,yellow"
			+":.33,yellow"
			+":.331,"+s.color
			+":.66,"+s.color
			+":.661,red"
			+":1,red")

	y+=14;
	//4px dashed line with yellow-s.color-red gradient 
	 //dash offset is set to 20px
	app.add([0,y,app.width,y],"4 dash:20,12:20"+
		" gradient:0,100,300,100"
			+":0,yellow"
			+":.33,yellow"
			+":.331,"+s.color
			+":.66,"+s.color
			+":.661,red"
			+":1,red");

	y+=12;
	//6px dotted line with s.color
	 //dash offset is set to 11px
	app.add([0,y,app.width,y],"6 "+s.color+" dash:.1,10:11 round");

	y+=14;
	//8px dashed line with red-blue-s.color gradient
	 //dash length is alternating between 15px and 40px
	 //dash spacing is set to 10px
	 //dash offset is set to 8px
	app.add([0,y,app.width,y],"8 dash:15,10,40,10:8 square"+
		" gradient:0,100,300,100"
		+":0,"+s.color
		+":.5,#00baff"
		+":1,"+s.color);

	y+=15;
	//5px dashed blue line with round line caps
	 //dash length is alternating between 15px and 40px
	 //dash spacing is set to 10px
	 //dash offset is set to 8px
	app.add([0,y,app.width,y],"5 #00baff dash:15,10,40,10:8 round");

	y += 14;
	//4px blue line
	app.add([0,y,app.width,y],"4 #00baff");

	y += 16;
	//10px black-blue-black gradient line
	app.add([0,y,app.width,y],"10"+
		" gradient:0,100,300,100"
		+":0,black"
		+":.5,#00baff"
		+":1,black");

	x = 20
	y += 47;
	//10px bezier curve
	app.add([x,y-20,app.width-x,y+20],[
		{bezier:[x*3,y+100,app.width-x*3,y-100]}
		//"bezier:"+(x*3)+','+(y+100)+','+(app.width-x*3)+','+(y-100)
		,"round dash:10,10  10 "+ s.color
	]);


	
	app.draw();
}