# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Line extends iio.Object
  constructor: (properties, others...) ->
    super
    # Do some stuff
