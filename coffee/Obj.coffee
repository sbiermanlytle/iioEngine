# Set up global iio
root = exports ? @
iio = root.iio = root.iio ? {}

class iio.Object
  constructor: (properties, others...) ->
    # TODO init_obj

    # TODO add in Sebastian's new changes

    if properties not instanceof Object
      # Set it up so that it is, with no properties set
      unstructured = [properties].concat unstructured
      properties = {}

    # Add all unstructured properties into the properties object
    for property in unstructured
      if property in iio.colors # iio.colors will contain every color mapped to a string repr of that color
        properties.color = property
      if property instanceof Number
        if not properties.size?
          properties.size = property
        else
          # anything else?
      if property instanceof Array # vector TODO: perhaps make a Vector class in iio?
        if not properties.pos?
          properties.pos = property

    # Add all properties to this object
    @[prop] = value for prop, value in properties
