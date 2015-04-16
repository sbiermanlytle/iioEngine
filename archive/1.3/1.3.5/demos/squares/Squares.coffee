@Squares = ( app ) -> 

	app.set 'black'

	num = app.width / 5

	speed = .5

	for i in [0..num] by 1
		app.add
			color: 'white'
			simple: true
			width: iio.random.num 60,140
			alpha: iio.random.num .3,.6
			pos:
				x: iio.random.num 0,app.width
				y: iio.random.num 0,app.height
			vel: 
				x:iio.random.num -speed,speed
				y:iio.random.num -speed,speed
			fade: [
				iio.random.num .0001,.0006
				(o)-> o.alpha = 1
			]
			,true

 	this.resize = ()->
 		for obj in app.objs
 			obj.bounds =
 				bottom: [ app.height, (o)-> o.vel.y = -speed ]
 				top: [ 0,  (o)-> o.vel.y = speed ],
 				left: [ 0, (o)-> o.vel.x = speed ],
 				right: [ app.width, (o)-> o.vel.x = -speed ]

 	this.resize()