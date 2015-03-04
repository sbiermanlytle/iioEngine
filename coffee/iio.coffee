# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

# Addition to JS Array
Array.prototype.insert = (index, item) ->
  @splice(index, 0, item)
  return @

# Set up iio, called on iio, so access iio with @ or this
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

  @set = (objects, properties) ->
    object.set properties for object in objects

  # TODO loop
  @loadImg = (src, onload) ->
    img = new Image()
    img.src = src
    img.onload = onload
    return img

  @load = (url, callback) ->
    xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = ->
      if xhr.readyState is 4 and (xhr.status is 0 or xhr.status is 200)
        return callback xhr.responseText
    xhr.send null

  @loop = (fps, caller, fn) ->
    if @isNumber fps or not window.requestAnimationFrame? or not !fps.af
      if fps.af? and fps.fps?
        fn = caller
        caller = fps
        fps = 60
      else if not @isNumber fps
        caller = fps
        fps = fps.fps

      _loop = =>
        now = new Date().getTime()
        if not caller.last? then first = true
        correctedFps = Math.floor Math.max 0, 1000 / fps - (now - (caller.last or fps))
        caller.last = now + correctedFps
        if not first?
          if not caller.fn
            nuFps = caller.o._update caller.o, correctedFps
          else if @isFunction caller.fn
            nuFps = caller.fn caller.o, caller, correctedFps
          else
            nuFps = caller.fn._update caller, correctedFps
          caller.o.app.draw()
        if not nuFps?
          caller.id = window.setTimeout _loop, correctedFps
        else
          fps = nuFps
          caller.id = window.setTimeout _loop, 1000 / nuFps

      caller.id = window.setTimeout _loop, 1000 / fps
      return caller.id
    else
      fn = caller
      caller = fps

      animLoop = =>
        if not caller.fn?
          caller.o.draw()
        else if @isFunction caller.fn
          caller.fn caller.o
        else
          caller.fn._update()
          caller.fn.draw()

        caller.o.app.draw()
        caller.id = window.requestAnimationFrame animLoop

      caller.id = window.requestAnimationFrame animLoop
      return caller.id

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

  @prepInput = ->
    window.onresize = @resize
    @addEvent window, 'keydown', (event) =>
      key = @getKeyString event
      app.runScript.onKeyDown event, key for app in @apps when app.runScript and app.runScript.onKeyDown
    @addEvent window, 'keyup', (event) =>
      key = @getKeyString event
      app.runScript.onKeyUp event, key for app in @apps when app.runScript and app.runScript.onKeyUp
    @addEvent window, 'scroll', (event) =>
      for app in @apps
        p = app.canvas.getBoundingClientRect()
        app.pos = { x: p.left, y: p.top }
  @prepInput()

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
    invert: (color) ->
      if color.indexOf("rgb") isnt -1
        rgb = color.match(/(\d+)/g)
        # With error catching in case parseInt returns NaN
        return "rgb(#{(255 - parseInt(rgb[0])) or 0},
                    #{(255 - parseInt(rgb[1])) or 0},
                    #{(255 - parseInt(rgb[2])) or 0})"
  }

  @bounds = {
    resolve: (bound, c) -> if bound.length > 1 then bound[1](c) else true
    overUpperLimit: (bound, limit, c) -> if lim > bound[0] then @resolve bound, c else false
    belowLowerLimit: (bound, limit, c) -> if lim < bound[0] then @resolve bound, c else false
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
  @getKeyString = (event) ->
    switch e.keyCode
      when 8 then 'backspace'
      when 9 then 'tab'
      when 13 then 'enter'
      when 16 then 'shift'
      when 17 then 'ctrl'
      when 18 then 'alt'
      when 19 then 'pause'
      when 20 then 'caps lock'
      when 27 then 'escape'
      when 32 then 'space'
      when 33 then 'page up'
      when 34 then 'page down'
      when 35 then 'end'
      when 36 then 'home'
      when 37 then 'left arrow'
      when 38 then 'up arrow'
      when 39 then 'right arrow'
      when 40 then 'down arrow'
      when 45 then 'insert'
      when 46 then 'delete'
      when 48 then '0'
      when 49 then '1'
      when 50 then '2'
      when 51 then '3'
      when 52 then '4'
      when 53 then '5'
      when 54 then '6'
      when 55 then '7'
      when 56 then '8'
      when 57 then '9'
      when 65 then 'a'
      when 66 then 'b'
      when 67 then 'c'
      when 68 then 'd'
      when 69 then 'e'
      when 70 then 'f'
      when 71 then 'g'
      when 72 then 'h'
      when 73 then 'i'
      when 74 then 'j'
      when 75 then 'k'
      when 76 then 'l'
      when 77 then 'm'
      when 78 then 'n'
      when 79 then 'o'
      when 80 then 'p'
      when 81 then 'q'
      when 82 then 'r'
      when 83 then 's'
      when 84 then 't'
      when 85 then 'u'
      when 86 then 'v'
      when 87 then 'w'
      when 88 then 'x'
      when 89 then 'y'
      when 90 then 'z'
      when 91 then 'left window'
      when 92 then 'right window'
      when 93 then 'select key'
      when 96 then 'n0'
      when 97 then 'n1'
      when 98 then 'n2'
      when 99 then 'n3'
      when 100 then 'n4'
      when 101 then 'n5'
      when 102 then 'n6'
      when 103 then 'n7'
      when 104 then 'n8'
      when 105 then 'n9'
      when 106 then 'multiply'
      when 107 then 'add'
      when 109 then 'subtract'
      when 110 then 'dec'
      when 111 then 'divide'
      when 112 then 'f1'
      when 113 then 'f2'
      when 114 then 'f3'
      when 115 then 'f4'
      when 116 then 'f5'
      when 117 then 'f6'
      when 118 then 'f7'
      when 119 then 'f8'
      when 120 then 'f9'
      when 121 then 'f10'
      when 122 then 'f11'
      when 123 then 'f12'
      when 144 then 'num lock'
      when 156 then 'scroll lock'
      when 186 then 'semi-colon'
      when 187 then 'equal'
      when 188 then 'comma'
      when 189 then 'dash'
      when 190 then 'period'
      when 191 then 'forward slash'
      when 192 then 'grave accent'
      when 219 then 'open bracket'
      when 220 then 'back slash'
      when 221 then 'close bracket'
      when 222 then 'single quote'
      else 'undefined'

  @codeIs = (keys, event) ->
    if keys not instanceof Array then keys = [keys]
    str = @getKeyString event
    keys.some (key) -> key is str

  # Probably need to split into class
  @vector = {
    add: (v1, v2) ->
      v = {}
      v[p] = v1[p] + v2[p] for p in v2 when v1[p]
      return v
    sub: (v1, v2) ->
      v = {}
      v[p] = v1[p] - v2[p] for p in v2 when v1[p]
      return v
    mult: (v1, v2) ->
      v = {}
      v[p] = v1[p] * v2[p] for p in v2 when v1[p]
      return v
    div: (v1, v2) ->
      v = {}
      v[p] = v1[p] / v2[p] for p in v2 when v1[p]
      return v
    dist: (v1, v2) ->
      sumDiffSquared = 0
      sumDiffSquared += (v1[p] - v2[p]) ** 2 for p in v2 when v1[p]
      return Math.sqrt sumDiffSquared
  }

  @canvas = {
    create: (width, height) ->
      canvas = document.createElement 'canvas'
      if width
        canvas.width = width
        canvas.height = height
      else
        # Create fullscreen
        canvas.margin = 0
        canvas.padding = 0
        canvas.style.position = 'absolute'
        canvas.fullscreen = true
        canvas.width = if $ then $(document).width() else window.innerWidth
        canvas.height = if $ then $(document).height() else window.innerHeight
      return canvas

    prep: (id, d) ->
      if id
        canvas = document.getElementById id
        if not canvas?
          if id.tagName is 'CANVAS'
            canvas = id
          else if iio.isNumber(id) or id.x
            canvas = @create id.x or id, id.y or id
            (d or document.body).appendChild canvas
      else
        @prepFullscreen()
        canvas = @create()
        document.body.appendChild canvas
      return canvas

    prepFullscreen: ->
      document.body.style.margin = document.body.style.padding = 0

    prepInput: (object) ->
      object.onmousedown = (event) ->
        eventPos = @parent.convertEventPos(event)
        @parent.click event, eventPos if @parent.click
        for obj, i in @parent.objs
          if i isnt 0 then eventPos = @parent.convertEventPos(event)
          if obj.contains and obj.contains eventPos
            if obj.click
              if obj.type is iio.GRID
                cell = obj.cellAt eventPos
                obj.click event, eventPos, cell, obj.cellCenter cell.c, cell.r
              else
                obj.click event, eventPos
        return
  }

  @collision = {
    check: (obj1, obj2) ->
      if not obj1? or not obj2? then return false
      if obj1.type is iio.RECT and obj2.type is iio.RECT
        if obj1.simple
          if obj2.simple
            return @rectXrect(
              obj1.pos.x - obj1.bbx[0],
              obj1.pos.x + obj1.bbx[0],
              obj1.pos.y - (obj1.bbx[1] or obj1.bbx[0]),
              obj1.pos.y + (obj1.bbx[1] or obj1.bbx[0]),
              obj2.pos.x - obj2.bbx[0],
              obj2.pos.x + obj2.bbx[0],
              obj2.pos.y - (obj2.bbx[1] or obj2.bbx[0]),
              obj2.pos.y + (obj2.bbx[1] or obj2.bbx[0])
            )
          else
            return @rectXrect(
              obj1.pos.x - obj1.bbx[0],
              obj1.pos.x + obj1.bbx[0],
              obj1.pos.y - (obj1.bbx[1] or obj1.bbx[0]),
              obj1.pos.y + (obj1.bbx[1] or obj1.bbx[0]),
              obj2.left,
              obj2.right,
              obj2.top,
              obj2.bottom
            )
        else if obj2.simple
          return @rectXrect(
            obj1.left,
            obj1.right,
            obj1.top,
            obj1.bottom,
            obj2.pos.x - obj2.bbx[0],
            obj2.pos.x + obj2.bbx[0],
            obj2.pos.y - (obj2.bbx[1] or obj2.bbx[0]),
            obj2.pos.y + (obj2.bbx[1] or obj2.bbx[0])
          )
        else
          return @rectXrect(obj1.left, obj1.right, obj1.top, obj1.bottom,
                            obj2.left, obj2.right, obj2.top, obj2.bottom)

    rectXrect: (r1L, r1R, r1T, r1B, r2L, r2R, r2T, r2B) ->
      if r1L < r2R or r1R > r2L or r1T < r2B or r1B > r2T then true else false
  }

  # TODO These should probably be instance methods of each object class
  @draw = {
    line: (ctx, x, y, x1, y1) ->
      ctx.beginPath()
      ctx.moveTo x, y
      ctx.lineTo x1, y1
      ctx.stroke()

    rect: (ctx, w, h, s, p) ->
      if p.round
        ctx.beginPath()
        ctx.moveTo p.round[0], 0
        ctx.lineTo w - p.round[1], 0
        ctx.quadraticCurveTo w, 0, w, p.round[1]
        ctx.lineTo w, h - p.round[2]
        ctx.quadraticCurveTo w, h, w - p.round[2], h
        ctx.lineTo p.round[3], h
        ctx.quadraticCurveTo 0, h, 0, h - p.round[3]
        ctx.lineTo 0, p.round[0]
        ctx.quadraticCurveTo 0, 0, p.round[0], 0
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
        ctx.clip()
      else
        if s.c then ctx.fillRect 0, 0, w, h
        if p.img then ctx.drawImage p.img, 0, 0, w, h
        if p.anims then ctx.drawImage(
          p.anims[p.animKey].frames[p.animFrame].src,
          p.anims[p.animKey].frames[p.animFrame].x,
          p.anims[p.animKey].frames[p.animFrame].y,
          p.anims[p.animKey].frames[p.animFrame].w,
          p.anims[p.animKey].frames[p.animFrame].h,
          0, 0, w, h
        )
        if s.o then ctx.strokeRect 0, 0, w, h

    poly: (ctx, vectors, bezier, open) ->
      ctx.beginPath()
      ctx.moveTo 0, 0
      if bezier
        _i = 0
        for vector, i in vectors
          ctx.bezierCurveTo(
            bezier[_i++] or vectors[i - 1].x - vectors[0].x,
            bezier[_i++] or vectors[i - 1].y - vectors[0].y,
            bezier[_i++] or vector.x - vectors[0].x,
            bezier[_i++] or vector.y - vectors[0].y,
            vector.x - vectors[0].x,
            vector.y - vectors[0].y
          )
        if not open? or not open
          i--
          ctx.bezierCurveTo(
            bezier[_i++] or vectors[i].x - vectors[0].x,
            bezier[_i++] or vectors[i].y - vectors[0].y,
            bezier[_i++] or 0,
            bezier[_i++] or 0,
            0,
            0
          )
      else
        vector0 = vectors[0]
        ctx.lineTo vector.x - vector0.x, vector.y - vector0.y for vector in vectors

      if not open? or not open
        ctx.closePath()

    finishPathShape: (ctx, obj) ->
      ctx.fill() if obj.color
      ctx.drawImage obj.img, -obj.width / 2, -obj.height / 2, obj.width, obj.height if obj.img
      ctx.stroke() if obj.outline
      ctx.clip() if obj.clip

    prepShape: (ctx, obj) ->
      if obj.color
        if obj.color.indexOf and obj.color.indexOf('gradient') isnt -1
          obj.color = obj.createGradient ctx, obj.color
        ctx.fillStyle = obj.color
      if obj.outline
        if obj.outline.indexOf and obj.outline.indexOf('gradient') isnt -1
          obj.outline = o.createGradient ctx, obj.outline
        ctx.lineWidth = obj.lineWidth
        ctx.strokeStyle = obj.outline

    prepX: (ctx, obj) ->
      ctx.save()
      if obj.color.indexOf and obj.color.indexOf('gradient') isnt -1
        obj.color = obj.createGradient ctx, obj.color
      ctx.lineWidth = obj.lineWidth
      ctx.strokeStyle = obj.color or obj.outline

    # TODO this doesn't seem right. Is the scope correct here?
    obj: (ctx) ->
      if @hidden then return
      if not ctx? then ctx = @app.ctx
      ctx.save()
      if @origin then ctx.translate @origin.x, @origin.y else ctx.translate @pos.x, @pos.y
      if @rot isnt 0 then ctx.rotate @rot
      if @objs.length > 0
        drawnSelf = false
        for obj in @objs
          if not drawnSelf and obj.z >= @z
            @finishDraw ctx
            drawnSelf = true
          if obj.draw then obj.draw ctx
        if not drawnSelf then @finishDraw ctx
      else
        @finishDraw ctx
      ctx.restore()

    finishObj: (ctx) ->
      ctx.save()
      ctx.globalAlpha = @alpha
      if @lineCap then ctx.lineCap = @lineCap
      if @shadow
        shadows = @shadow.split(' ')
        for shadow in shadows
          if iio.isNumber shadow
            ctx.shadowBlur = shadow
          else if shadow.indexOf(':') isnt -1
            i = shadow.indexOf(':')
            ctx.shadowOffsetX = shadow.substring(0, i)
            ctx.shadowOffsetY = shadow.substring(i + 1)
          else
            ctx.shadowColor = shadow

      if @dash
        if @dash.length > 1 and @dash.length % 2 is 1
          ctx.lineDashOffset = @dash[@dash.length - 1]
        ctx.setLineDash @dash

      @drawType ctx
      ctx.restore()
  }

  # TODO This probably shouldn't be functions of iio. Should be instance methods
  # of classes such as App, Obj, etc
  @set = (properties, noDraw) ->
    if not properties? then return @
    if properties.x and properties.y
      @pos.x = properties.x
      @pos.y = properties.y
      return @

    # Array of settings
    if properties instanceof Array
      @set property, noDraw for property in properties

    # TODO set with iio script, likely getting rid of this

    # Set with a properties object
    else
      @[key] = properties[key] for key in properties

    if not @height?
      @height = @width

    @update @
    if not noDraw then @app.draw()

    return @

  @add = (obj, noDraw) ->
    if obj instanceof Array
      @add _obj for _obj in obj
    else
      obj.parent = @
      obj.app = @app
      if not obj.z? then obj.z = 0
      # TODO

  @remove = (obj, noDraw) ->
    callback = (c, i, arr) ->
      if c is obj
        arr.splice i, 1
        return true
      else
        return false

    if not obj?
      @objs = [] # Remove all
    else if obj instanceof Array
      @remove _obj for _obj in obj
    else if @isNumber obj and obj < @objs.length
      numObjsToRemove = obj
      @objs.splice numObjsToRemove, 1
    else if @objs
      @objs.some callback

    if @collisions
      for collision, i in @collisions
        if collision[0] is obj or collision[1] is obj
          @collisions.splice i, 1
        else if collision[0] instanceof Array
          collision[0].some callback

        if collision[1] instanceof Array
          collision[1].some callback

    if not noDraw
      @app.draw()

    return obj

  @clearLoops = ->
    @cancelLoop l for l in @loops

  @clear = ->
    @objs = []
    @app.draw()

  # TODO @update = (obj, noDraw) ->
  #   if obj.text then obj.type = @TEXT

  @updatePhysics = (obj, dt) ->
    if @update then @update dt

    remove = false
    if @bounds and not @simple
      if @bounds.right then remove = iio.bounds.overUpperLimit @bounds.right, @right, @
      if @bounds.left then remove = iio.bounds.belowLowerLimit @bounds.left, @left, @
      if @bounds.top then remove = iio.bounds.belowLowerLimit @bounds.top, @top, @
      if @bounds.bottom then remove = iio.bounds.overUpperLimit @bounds.bottom, @bottom, @
    else if @bounds
      if @bounds.right then remove = iio.bounds.overUpperLimit @bounds.right, @pos.x, @
      if @bounds.left then remove = iio.bounds.belowLowerLimit @bounds.left, @pos.x, @
      if @bounds.top then remove = iio.bounds.belowLowerLimit @bounds.top, @pos.y, @
      if @bounds.bottom then remove = iio.bounds.overUpperLimit @bounds.bottom, @pos.y, @

    if @shrink
      remove = if @shrink instanceof Array then @_shrink @shrink[0], @shrink[1] else @_shrink @shrink

    if @fade
      remove = if @fade instanceof Array then @_fade @fade[0], @fade[1] else @_fade @fade

    if remove then return remove

    @vel.x += @acc.y
    @vel.y += @acc.y
    @vel.r += @acc.r
    @pos.x += @vel.x
    @pos.y += @vel.y
    @rot += @vel.r

    if not @simple then @updateProps @vel
    for _obj in @objs
      if _obj._update and _obj._update obj, dt then @remove _obj

).call(iio)
