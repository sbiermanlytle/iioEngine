# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Circle extends iio.Object
  constructor: (properties, others...) ->
    super

  draw: (ctx) ->
    # TODO Design choice to be made here
    iio.draw.prepShape ctx, @
    ctx.beginPath()
    if @width isnt @height
      ctx.moveTo 0, -@height / 2
      if @bezier
        ctx.bezierCurveTo(
          @bezier[0] or @width / 2,
          @bezier[1] or -@height / 2,
          @bezier[2] or @width / 2,
          @bezier[3] or @height / 2,
          0,
          @height / 2
        )
        ctx.bezierCurveTo(
          @bezier[4] or -@width / 2,
          @bezier[5] or @height / 2,
          @bezier[6] or -@width / 2,
          @bezier[7] or -@height / 2,
          0,
          -@height / 2
        )
      else
        ctx.bezierCurveTo(
          @width / 2,
          -@height / 2,
          @width / 2,
          @height / 2,
          0,
          @height / 2
        )
        ctx.bezierCurveTo(
          -@width / 2,
          @height / 2,
          -@width / 2,
          -@height / 2,
          0,
          -@height / 2
        )

      ctx.closePath()
    else
      ctx.arc 0, 0, @width / 2, 0, 2 * Math.PI, false

    iio.draw.finishPathShape ctx, @

    # TODO design change
    if @type is iio.X
      ctx.rotate Math.PI / 4
      iio.prep_x ctx, @
      ctx.translate 0, -@height / 2
      iio.draw.line ctx, 0, 0, 0, @height
      ctx.translate 0, @height / 2
      iio.draw.line ctx, @width / 2, 0, -@width / 2, 0
      ctx.restore()
