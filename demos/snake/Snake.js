/* Snake
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Snake = function( app, settings ){

	// define variables to track snake 
	var head, body, direction, snake_speed, snake_color, inverted;

	// define the starting body size
	var starting_body = 4;

	// define the snakes starting speed
	var starting_speed = 4;
	
	// define the cell size of the game grid
	var res = 20;

	// initialize settings
	settings = settings || {};

	// if preview is active
	if( settings.preview )
		// limit the size of the grid cells
		res = 10;

	// set snake size based on the grid size
	var snake_size = Math.floor( app.width/res );

	// define the snake's start position
	var startPos = new iio.Vector(
		snake_size * res/2 + snake_size/2,
		snake_size * 4 + snake_size/2
	)
	
	// define a function to be run when the app is resized
	function reset(){

		// clear all objects and loops from app
		app.clear();

		// if preview is active
		if( false ){ //settings.preview ) 
			// set the snake color to white
			snake_color = new iio.Color(240,240,240);
			// set the background color to black
			app.set({ color: 'black' });
		}
		// preview is not active
		else {
			// set the snake color to a random color
			snake_color = iio.Color.random();
			// set the background color to the inverse color
			app.set({ color: snake_color.clone().invert() });
		}

		head = app.add( new iio.Rectangle({
			pos:[
				startPos.x,
				startPos.y
			], 
			color: snake_color,
			outline: 'white',
			lineWidth: 1,
			shadow: 'black',
			shadowBlur: 20,
			width:snake_size
		}));
		body = [];
		for(var i=0; i<starting_body-1; i++)
			body[i] = app.add( new iio.Rectangle({
				pos:[
					startPos.x - snake_size * (i+1),
					startPos.y
				], 
				color: snake_color,
				outline: 'white',
				lineWidth: 1,
				shadow: 'black',
				shadowBlur: 20,
				width: snake_size
			}));
		direction = RIGHT;
		snake_speed=starting_speed;
		makeFood();
	};

	var food;
	function makeFood(){
		var randomPos = new iio.Vector(
			snake_size*iio.randomInt(0,res)+snake_size/2,
			snake_size*iio.randomInt(0,app.height/snake_size)
				+snake_size/2
		);
		food = app.add( new iio.Rectangle({
			pos: randomPos,
			color:snake_color,
			outline: 'white',
			shadow: 'black',
			shadowBlur: 20,
			width: snake_size
		}));
	}; makeFood();
	
	var UP = 0;
	var RIGHT = 1;
	var DOWN = 2;
	var LEFT = 3;
	this.keyDown=function(e,k){ 
		if(direction!=DOWN && k=='up arrow' || k=='w')
			direction = UP;
		else if(direction!=LEFT && k=='right arrow' || k=='d') 
			direction = RIGHT;
		else if(direction!=UP && k=='down arrow' || k=='s') 
			direction = DOWN;
		else if(direction!=RIGHT && k=='left arrow' || k=='a') 
			direction = LEFT; 
	}

	function updateSnake(){
		if(head.pos.x==food.pos.x 
			&& head.pos.y==food.pos.y){
			food.color=head.color;
			body.push(food);
			makeFood();
			snake_speed++;
		}
		for(var i = body.length-1; i>0; i--){
			body[i].pos.x = body[i-1].pos.x;
			body[i].pos.y = body[i-1].pos.y;
		}
		body[0].pos.x = head.pos.x;
		body[0].pos.y = head.pos.y;
		if(!s || !s.preview)
			for(var i=1; i<body.length; i++)
				if(head.pos.x==body[i].pos.x 
					&& head.pos.y==body[i].pos.y)
					reset();

		if(s && s.preview && iio.random()<.4)
			direction = iio.randomInt(0,4);
		switch(direction){
			case UP: 
				head.pos.y -= snake_size;
				if(head.pos.y-snake_size/2<0) reset(); 
				break;
			case RIGHT: 
				head.pos.x += snake_size; 
				if(head.pos.x>app.width) reset();
				break;
			case DOWN: 
				head.pos.y += snake_size; 
				if(head.pos.y>app.height) reset();
				break;
			case LEFT: 
				head.pos.x -= snake_size;
				if(head.pos.x-snake_size/2<0) reset(); 
				break;
		}
		return snake_speed;
	}

	app.loop(starting_speed,updateSnake);
	reset();
}
