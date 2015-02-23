# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.App
  constructor: (@canvas, app, settings) ->
    @type = @APP
    @app = @

    # Set up canvas and context
    @ctx = @canvas.getContext('2d')
    @canvas.parent = @
    iio.canvas.prepInput(@canvas)

    @width = @canvas.clientWidth or @canvas.width
    @height = @canvas.clientHeight or @canvas.height
    @center = { x: @width / 2, y: @height / 2 }

    offset = @canvas.getBoundingClientRect()
    @pos = { x: offset.left, y: offset.top }

    # Initialize iio object
    @scale = 1
    @objs = []
    @rqAnimFrame = true
    @partialPx = true
    @alpha = 1
    @loops = []
    @run = iio.run
    @set = iio.set
    @add = iio.add
    @rm = iio.rm
    @loop = iio.loop
    @clearLoops = iio.clearLoops
    @pause = iio.pause
    @playAnim = iio.playAnim
    @eval = iio.eval

    # Place to store collisions
    @collisions = []

    # Add app to the global app array
    iio.apps.push(@)

    # Run the iio script (TODO probably obsolete)
    if iio.isString app
      @runScript = iio.run app, @
      @draw()
    else
      @runScript = new app(this, settings)

  convertEventPot: (event) -> { x: event.clientX - @pos.x, y: event.clientY - @pos.y }

  stop: ->
    iio.cancelLoops obj for obj in @objs
    iio.cancelLoops @
    if @mainLoop then iio.cancelLoops @mainLoop.id
    @clear()

  draw: (noClear) ->
    if not noClear then @clear()
    if @color
      @ctx.fillStyle = @color
      @clear()
    if @round then @canvas.style.borderRadius = round
    if @outline then @canvas.style.border = "#{(@lineWidth or 1)}px solid #{@outline}"
    if @alpha then @canvas.style.opacity = @alpha
    obj.draw @ctx for obj in @objs when obj.draw

  clear: -> @ctx.clearRect 0, 0, @width, @height

  collision: (object1, object2, callback) ->
    @collisions.push [object1, object2, func]

  cCollisions: (objects1, objects2, callback) ->
    objects1 = [objects1] if objects1 not instanceof Array
    objects2 = [objects2] if objects2 not instanceof Array
    for obj1 in objects1
      for obj2 in objects2
        callback obj1, obj2 if iio.collision.check obj1, obj2
    return

  _update: (obj, dt) ->
    @update dt if @update
    if @objs and @objs.length > 0
      @rm obj for obj in @objs when obj._update and obj._update obj, dt
    if @collisions and @collisions.length > 0
      @cCollisions collision[0], collision[1], collision[2] for collision in @collisions
