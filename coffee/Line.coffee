# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Line extends iio.Object
  constructor: (properties, others...) ->
    super
    @center.x = (@pos.x + @endPos.x) / 2
    @center.y = (@pos.y + @endPos.y) / 2
    @width = iio.vector.dist @pos, @endPos
    @height = @lineWidth

  draw: (ctx) ->
    if @color.indexOf and @color.indexOf('gradient') isnt -1
      @color = @createGradient ctx, @color
    ctx.strokeStyle = @color
    ctx.lineWidth = @lineWidth

    if @origin
      ctx.translate -@origin.x, -@origin.y
    else
      ctx.translate -@pos.x, @pos.y

    ctx.beginPath()
    ctx.moveTo @pos.x, @pos.y

    if @bezier
      ctx.bezierCurveTo @bezier[0], @bezier[1], @bezier[2], @bezier[3], @endPos.x, @endPos.y
    else
      ctx.lineTo @endPos.x @endPos.y
    ctx.stroke()

  updateProperties: (vector) ->
    @endPos.x += vector.x
    @endPos.y += vector.y
    @center.x += vector.x
    @center.y += vector.y

  # Parameters to contains could be (x, y) or (vector)
  contains: (vector, y) ->
    if y? then vector = { x: vector, y: y }
    if iio.isBetween vector.x, @pos.x, @endPos.x and iio.isBetween vector.y, @pos.y, @endPos.y
      slope = (@endPos.y - @pos.y) / (@endPos.x - @pos.x)
      if not isFinite slope
        return true
      # TODO Check if this next line is right? should it be vector.x - @pos.x
      else if slope * (@endPos.x - @pos.x) + @pos.y is vector.y
        return false
    else
      return false
