Snake = function(app,s){

	//set size of the game grid
	var res = 20;
	//reduce the size if this is a preview
	if(s&&s.preview) res = 10;

	var snake_size = Math.floor(app.width/res);
	var startPos = {
		x:snake_size*res/2+snake_size/2,
		y:snake_size*4+snake_size/2
	}

	var starting_body = 4;
	var starting_speed = 4;
	var head, body, direction, snake_speed, snake_color, inverted;
	function reset(){
		app.rmv();
		if(s && s.preview) snake_color = 'rgb(240,240,240)';
		else snake_color = iio.random.color();
		inverted = iio.color.invert(snake_color);
		app.set(inverted);
		head = app.add({
			pos:{
				x:startPos.x,
				y:startPos.y
			}, 
			color: snake_color,
			simple: true,
			outline: 'white',
			lineWidth: 1,
			shadow: '0:0 20 black',
			width:snake_size
		});
		body = [];
		for(var i=0; i<starting_body-1; i++)
			body[i] = app.add({
				pos:{
					x:startPos.x-snake_size*(i+1),
					y:startPos.y
				}, 
				color: snake_color,
				simple: true,
				outline: 'white',
				lineWidth: 1,
				shadow: '0:0 20 black',
				width: snake_size
			});
		direction = RIGHT;
		snake_speed=starting_speed;
		makeFood();
	};

	var food;
	function makeFood(){
		var randomPos = {
			x:snake_size*iio.random.integer(0,res)+snake_size/2,
			y:snake_size*iio.random.integer(0,app.height/snake_size)
				+snake_size/2
		}
		food = app.add({
			pos:{
				x:randomPos.x,
				y:randomPos.y
			},
			color:snake_color,
			simple: true,
			outline: 'white',
			shadow: '0:0 20 black',
			width: snake_size
		});
	}; makeFood();
	
	var UP = 0;
	var RIGHT = 1;
	var DOWN = 2;
	var LEFT = 3;
	this.onKeyDown=function(e,k){ 
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

		if(s && s.preview && iio.random.num()<.4)
			direction = iio.random.integer(0,4);
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