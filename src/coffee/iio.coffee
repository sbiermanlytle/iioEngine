# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

# Addition to JS Array
Array.prototype.insert = (index, item) ->
  @splice(index, 0, item)
  return @

# Set up iio
(->
  # An array to hold all the apps being run.
  @apps = []

  ###
  Enums for iio object types
  ###
  @APP  = {}
  @OBJ  = {}
  @LINE = {}
  @X    = {}
  @CIRC = {}
  @RECT = {}
  @POLY = {}
  @GRID = {}
  @TEXT = {}

  ###
  Utility functions
  ###
  @addEvent = (obj, event, callback, capt) ->
    if obj.addEventListener
      obj.addEventListener event, callback, capt
      true
    else if obj.attachEvent
      obj.attachEvent "on#{event}", callback
      true
    else
      false

  @set = (objects, property) ->
    object.set property for object in objects

  # TODO loadImg, load, loop

  @cancelLoop = (l) ->
    window.clearTimeout l
    window.cancelAnimationFrame l

  @cancelLoops = (o, c) ->
    @cancelLoop l.id for l in o.loops
    if o.mainLoop then @cancelLoop o.mainLoop.id
    if not c? then @cancelLoops obj for obj in o.objs

  @resize = ->
    for app in @apps
      if app.canvas.fullscreen
        app.width = app.canvas.width = if $ then $(window).width() else window.innerWidth
        app.height = app.canvas.height = if $ then $(window).height() else window.innerHeight
      app.center.x = app.canvas.width / 2
      app.center.y = app.canvas.height / 2
      app.runScript.resize() if app.runScript and app.runScript.resize
      app.draw()

  # TODO prep_input

  # Add some isType methods
  for type in ['Function', 'Number', 'String']
    @["is#{type}"] = (obj) ->
      toString.call(obj) is "[object #{type}]"

  @isImage = (imgName) ->
    ['png', 'jpg', 'gif', 'tiff'].some (ext) -> imgName.indexOf(".#{ext}") isnt -1

  @isBetween = (val, bound1, bound2) -> bound1 <= val <= bound2 or bound2 <= val <= bound1

  @random = {
    num: (min, max) ->
      min = min ? 0
      min = max ? 1
      Math.random() * (max - min) + min

    int: (min, max) ->
      Math.floor @num min, max

    color: () ->
      "rgb(#{Math.floor(Math.random() * 255)},
           #{Math.floor(Math.random() * 255)},
           #{Math.floor(Math.random() * 255)})"
  }

  @color = {
    random: @random.color
    # TODO invert: (color) ->
  }

  @bounds = {
    resolve: (b, c) -> if b.length > 1 then b[1](c) else true
    # TODO overUpperLimit and belowLowerLimit
  }

  @point = {
    rotate: (x, y, r) ->
      return {x: x, y: y} if r is 0
      if x.x?
        r = y
        y = x.y
        x = x.x
      return {
        x: x * Math.cos(r) - y * Math.sin(r)
        y: y * Math.cos(r) + x * Math.sin(r)
      }

    vector: (points) ->
      points = [points] if points not instanceof Array
      vecs = []
      for _, i in points
        if points[i].x?
          vecs.push points[i]
        else
          vecs.push
            x: points[i]
            y: points[i + 1]
      return vecs
  }
).call(iio)
