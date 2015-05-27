/* Snake
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
Copyright (c) 2015, iio inc. All rights reserved.
*/

Snake = function( app, settings ){

	// initialize settings
	settings = settings || {};

	// define the number of columns
	var num_columns = 20;

	// limit column number if preview
	if( settings.preview )
		num_columns = 10;

	// define direction constants
	var UP = 0;
	var RIGHT = 1;
	var DOWN = 2;
	var LEFT = 3;

	// properties shared by snake and food
	var shared_props = {
		outline: 'white',
		lineWidth: 1,
		shadow: 'black',
		shadowBlur: 20,
		width: Math.floor( app.width / num_columns )
	}

	// define game objects and initial values
	var food;
	var snake = {
		head: {},
		body: [],
		initial_direction: RIGHT,
		initial_pos: new iio.Vector(
			shared_props.width * num_columns/2 + shared_props.width/2,
			shared_props.width * 4 + shared_props.width/2
		),
		initial_body_length: 4,
		initial_speed: 4,
		speed: 4,
		width: shared_props.width
	} 
	
	// define a function to be run when the app is resized
	function reset(){

		// clear all objects and loops from app
		app.clear();

		// set the snake color to a random color
		shared_props.color = iio.Color.random();

		// set the background color to the inverse color
		app.set({ color: shared_props.color.clone().invert() });

		// create snake head
		snake.head = app.add( new iio.Rectangle( shared_props, {
			pos: snake.initial_pos.clone()
			// pass true to supress app draw
		}), true );

		// clear snake body
		snake.body = [];

		// create snake body
		for(var i = 0; i < snake.initial_body_length-1; i++)
			snake.body[i] = app.add( new iio.Rectangle( shared_props, {
				pos:[
					snake.initial_pos.x - snake.width * (i+1),
					snake.initial_pos.y
				]
				// pass true to supress app draw
			}), true );

		// set initial properties
		snake.direction = RIGHT;
		snake.speed = snake.initial_speed;

		// create food
		makeFood();
	}

	// create food
	function makeFood(){

		// define a random grid position in the view 
		var randomPos = new iio.Vector(
			snake.width * iio.randomInt(0,num_columns) + snake.width/2,
			snake.width * iio.randomInt(0,app.height / snake.width) 
				+ snake.width/2
		);

		// create food object
		food = app.add( new iio.Rectangle( shared_props, {
			pos: randomPos
			// pass true to supress app draw
		}), true );
	}

	// keypress handling
	// sets snake direction depending on key value
	this.keyDown = function( event, key ){ 

		// if snake isn't moving down
		if( snake.direction != DOWN 
			&& key == 'up arrow' || key == 'w' )
			snake.direction = UP;

		// if snake isn't moving left
		else if( snake.direction != LEFT 
			&& key == 'right arrow' || key == 'd' ) 
			snake.direction = RIGHT;

		// if snake isn't moving up
		else if( snake.direction != UP 
			&& key == 'down arrow' || key == 's' ) 
			snake.direction = DOWN;

		// if snake isn't moving right
		else if( snake.direction != RIGHT 
			&& key == 'left arrow' || key == 'a' ) 
			snake.direction = LEFT; 
	}

	// define a function to be called on every update
	// THE GAME LOOP
	this.onUpdate = function(){

		// if not preview, reset the game if the snake's head
		// overlaps with the snake body
		if( !settings.preview )
			for(var i=1; i<snake.body.length; i++)
				if( snake.head.pos.equals( snake.body[i].pos ) )
					// GAME OVER
					reset();

		// if the snake head overlaps the food, eat the food
		if( snake.head.pos.equals( food.pos ) ){

			// add the food part of the snake body
			snake.body.push( food );
			// make a new food object
			makeFood();
			// increase the snake's speed
			snake.speed++;
		}

		// move all snake body parts to the position of
		// the preceding body part
		for( var i = snake.body.length-1; i>0; i-- ){
			snake.body[i].pos.x = snake.body[i-1].pos.x;
			snake.body[i].pos.y = snake.body[i-1].pos.y;
		}

		// move the snake body directly behind the snake head
		// to the position of the snake head
		snake.body[0].pos.x = snake.head.pos.x;
		snake.body[0].pos.y = snake.head.pos.y;

		// if preview, randomize the snake direction 
		if( settings.preview && iio.random() < 0.4 )
			snake.direction = iio.randomInt(0,4);

		// move the snake head depending upon its direction
		// then check wall collisions for game over
		switch(snake.direction){
			// move the snake head up
			case UP: 
				snake.head.pos.y -= snake.width;
				// GAME OVER if snake hits the wall
				if(snake.head.pos.y-snake.width/2 < 0) 
					reset(); 
				break;
			// move the snake head right
			case RIGHT: 
				snake.head.pos.x += snake.width; 
				// GAME OVER if snake hits the wall
				if(snake.head.pos.x > app.width) 
					reset();
				break;
			// move the snake head down
			case DOWN: 
				snake.head.pos.y += snake.width; 
				// GAME OVER if snake hits the wall
				if(snake.head.pos.y>app.height) 
					reset();
				break;
			// move the snake head left
			case LEFT: 
				snake.head.pos.x -= snake.width;
				// GAME OVER if snake hits the wall
				if(snake.head.pos.x-snake.width/2<0) 
					reset(); 
				break;
		}

		// set the speed of the game loop
		return snake.speed;
	}

	// initialize the game
	reset();

	// loop onUpdate at the initial speed
	app.loop( snake.initial_speed );
}
