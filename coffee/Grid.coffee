# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Grid extends iio.Object
  constructor: (properties, others...) ->
    super

  initGrid: ->
    @tileSize = { width: @width / @C, height: @height / @R }
    @cells = []
    x = -@tileSize.width * (@C - 1) / 2
    y = -@tileSize.height * (@R - 1) / 2
    for (c = 0; c < @C; c++)
      @cells[c] = []
      for (r = 0; r < @R; r++)
        @cells[c][r] = @add
          pos:
            x: x
            y: y
          c: c
          r: r
          width: @tileSize.width
          height: @tileSize.height

        y += @tileSize.height
      y = -@tileSize.height * (@R - 1) / 2
      x += @tileSize.width

  clear: ->
    @objs = []
    @initGrid()
    @draw()

  cellCenter: (c, r) ->
    x: -@width / 2 + c * @tileSize.width + @tileSize.width / 2,
    y: -@height / 2 + r * @tileSize.height + @tileSize.height / 2

  cellAt: (x, y) ->
    y = x.y ? y, x = x.x ? x
    floor = Math.floor
    @cells[floor (x - @left) / @tileSize.width][floor (y - @top) / @tileSize.height]

  forEachCell: (func, params) ->
    for column in @cells
      for cell in column
        if func cell, params is false
          return [r, c]
