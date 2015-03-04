@ColorGrid = ( app, s ) ->

	size = 20
	app.set 'black'

	getShrinkRate = ()->
		if s and s.preview 
			iio.random.num .05,.09
		else 
			iio.random.num .05,.2

	reset = ()->

		app.objs = []

		for c in [size/2..app.width] by size
			for r in [size/2..app.height] by size
				app.add
					pos: 
						x:c
						y:r
					width: size
					simple: true
					color: 'white'
					shrink: [
						getShrinkRate(),
						(o)->
							o.width = size
							o.height = size
							o.color = iio.random.color()
							false
					]
				,true

		app.draw()
	
	reset()

	this.resize = reset