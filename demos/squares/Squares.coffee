@Squares = ( app ) -> 

	irn = iio.random.num

	app.set 'black'

	num = app.width / 5

	speed = .5

	for i in [0..num] by 1
		app.add
			color: 'white'
			simple: true
			width: irn 60,140
			alpha: irn .3,.6
			pos:
				x: irn 0,app.width
				y: irn 0,app.height
			vel: 
				x: irn -speed,speed
				y: irn -speed,speed
			fade: [
				irn .0001,.0006
				(o)-> o.alpha = 1
			]

 	this.resize = ()->
 		for obj in app.objs
 			obj.bounds =
 				bottom: [ app.height, (o)-> o.vel.y = -speed ]
 				top: [ 0,  (o)-> o.vel.y = speed ],
 				left: [ 0, (o)-> o.vel.x = speed ],
 				right: [ app.width, (o)-> o.vel.x = -speed ]

 	this.resize()