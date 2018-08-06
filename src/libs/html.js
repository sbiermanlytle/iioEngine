/* iio.html
------------------ */

iio.html = {
  defaults: {
    tag: 'div',
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      margin: '0',
      padding: '0'
    }
  },
  create: function(opts) {
    var elem = document.createElement(opts.tag || iio.html.defaults.tag);
    elem.innerHTML = opts.innerHTML;
    for (var style in iio.html.defaults.style)
      elem.style[style] = iio.html.defaults.style[style];
    for (var style in opts.style)
      elem.style[style] = opts.style[style];
    return elem;
  }
}
