# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Obj
  constructor: (p, s, ss, pp) ->
    # TODO init_obj

    # Adjust parameters
    if not pp? then pp = ss
    if pp
      @parent = pp
      @app = pp.app

    if iio.isString p
      _p = iio.parsePos p.split(' '), @parent
      p = _p.ps ? { x: 0, y: 0 }
      ss = s
      s = _p.p

    if not s?
      s = p
      p = p.pos
    p = iio.point.vector p
    @pos = p[0]
    @type = iio.LINE if p.length is 2
