# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Rectangle extends iio.Object
  constructor: (properties, others...) ->
    super

  draw: (ctx) ->
    # TODO Design choice to be made here
    iio.draw.prepShape ctx, @
    ctx.translate -@width / 2, -@height / 2

    if @bezier
      iio.draw.poly ctx, @getTrueVertices(), @bezier
      iio.draw.finishPathShape ctx, @
    else if @type is iio.X # TODO another design choice here
      iio.draw.prepX ctx, @
      iio.draw.line ctx, 0, 0, @width, @height
      iio.draw.line ctx, @width, 0, 0, @height
      ctx.restore()
    else
      iio.draw.rect(ctx, @width, @height, {
        c: @color
        o: @outline
      }, {
        img: @img
        anims: @anims
        animKey: @animKey
        mov: @mov
        round: @round
      })

  # TODO got to be a better way to code this, name these variables
  contains: (x, y) ->
    if @rot then return iio.poly.contains(v, y)
    y = v.y or y
    x = v.x or v
    x -= @pos.x
    y -= @pos.y
    if -@width / 2 < x < @width / 2 and -@height / 2 < y < @height / 2 then true else false

  getTrueVertices: ->
    @vertices = [
      { x: @left, y: @top },
      { x: @right, y: @top },
      { x: @right, y: @bottom}
      { x: @left, y: @bottom }
    ]

    return @vertices.map (vertex) =>
      rotated = iio.point.rotate vertex.x - @pos.x, vertex.y - @pos.y, @rot
      return iio.vector.add rotated, @pos
