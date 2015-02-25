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
  @APP =  {}
  @OBJ =  {}
  @LINE = {}
  @X =    {}
  @CIRC = {}
  @RECT = {}
  @POLY = {}
  @GRID = {}
  @TEXT = {}

  # Colors, inefficient to do it this way, perhaps best to keep them as strings?
  @colors = {
    aliceblue: true
    antiquewhite: true
    aqua: true
    aquamarine: true
    azure: true
    beige: true
    bisque: true
    black: true
    blanchedalmond: true
    blue: true
    blueviolet: true
    brown: true
    burlywood: true
    cadetblue: true
    chartreuse: true
    chocolate: true
    coral: true
    cornflowerblue: true
    cornsilk: true
    crimson: true
    cyan: true
    darkblue: true
    darkcyan: true
    darkgoldenrod: true
    darkgray: true
    darkgreen: true
    darkkhaki: true
    darkmagenta: true
    darkolivegreen: true
    darkorange: true
    darkorchid: true
    darkred: true
    darksalmon: true
    darkseagreen: true
    darkslateblue: true
    darkslategray: true
    darkturquoise: true
    darkviolet: true
    deeppink: true
    deepskyblue: true
    dimgray: true
    dodgerblue: true
    firebrick: true
    floralwhite: true
    forestgreen: true
    fuchsia: true
    gainsboro: true
    ghostwhite: true
    gold: true
    goldenrod: true
    gray: true
    green: true
    greenyellow: true
    honeydew: true
    hotpink: true
    indianred: true
    indigo: true
    ivory: true
    khaki: true
    lavender: true
    lavenderblush: true
    lawngreen: true
    lemonchiffon: true
    lightblue: true
    lightcoral: true
    lightcyan: true
    lightgoldenrodyellow: true
    lightgray: true
    lightgreen: true
    lightpink: true
    lightsalmon: true
    lightseagreen: true
    lightskyblue: true
    lightslategray: true
    lightsteelblue: true
    lightyellow: true
    lime: true
    limegreen: true
    linen: true
    magenta: true
    maroon: true
    mediumaquamarine: true
    mediumblue: true
    mediumorchid: true
    mediumpurple: true
    mediumseagreen: true
    mediumslateblue: true
    mediumspringgreen: true
    mediumturquoise: true
    mediumvioletred: true
    midnightblue: true
    mintcream: true
    mistyrose: true
    moccasin: true
    navajowhite: true
    navy: true
    oldlace: true
    olive: true
    olivedrab: true
    orange: true
    orangered: true
    orchid: true
    palegoldenrod: true
    palegreen: true
    paleturquoise: true
    palevioletred: true
    papayawhip: true
    peachpuff: true
    peru: true
    pink: true
    plum: true
    powderblue: true
    purple: true
    red: true
    rosybrown: true
    royalblue: true
    saddlebrown: true
    salmon: true
    sandybrown: true
    seagreen: true
    seashell: true
    sienna: true
    silver: true
    skyblue: true
    slateblue: true
    slategray: true
    snow: true
    springgreen: true
    steelblue: true
    tan: true
    teal: true
    thistle: true
    tomato: true
    turquoise: true
    violet: true
    wheat: true
    white: true
    whitesmoke: true
    yellow: true
    yellowgreen: true
  }

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
