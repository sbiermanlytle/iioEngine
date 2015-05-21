
//DEFINITION
iio.Text = function(){ this.Text.apply(this, arguments) };
iio.inherit(iio.Text, iio.Shape);
iio.Text.prototype._super = iio.Shape.prototype;

//CONSTRUCTOR
iio.Text.prototype.Text = function() {
  this._super.Shape.call(this,iio.merge_args(arguments));
  this.size = this.size || 40;
  if(!this.outline)
    this.color = this.color || new iio.Color();
  this.font = this.font || 'Arial';
  this.align = this.align || 'center';

  /*var tX = this.getX(this.text.length);
  this.cursor = this.add([tX, 10, tX, -this.size * .8], '2 ' + (this.color || this.outline), {
    index: this.text.length,
    shift: false
  });
  if (this.showCursor) {
    this.loop(2, function(o) {
      this.cursor.hidden = !this.cursor.hidden;
    })
  } else this.cursor.hidden = true;*/
}

iio.Text.getFontHeight = function(font) {

  var text = $('<span>Hg</span>').css({ fontFamily: font });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

  var div = $('<div></div>');
  div.append(text, block);

  var body = $('body');
  body.append(div);

  try {

    var result = {};

    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent;

  } finally {
    div.remove();
  }

  return result;
};

//FUNCTIONS
iio.Text.prototype.inferSize = function(ctx){
  this.ctx = ctx || this.ctx;

  this.app.ctx.font = this.size + 'px ' + this.font;
  this.width = this.app.ctx.measureText(this.text).width;
  this.height = this.app.ctx.measureText("H").width;
}
iio.Text.prototype.left = function(){
  return this.pos.x - this.width / 2;
}
iio.Text.prototype.right = function(){
  return this.pos.x + this.width / 2;
}
iio.Text.prototype.top = function(){
  return this.pos.y - this.height / 2;
}
iio.Text.prototype.bottom = function(){
  return this.pos.y + this.height / 2;
}
iio.Text.prototype._shrink = function(s, r) {
  this.size *= 1 - s;
  this.inferSize();
  if (this.size < .02 
    || this.size < this.shrink.lowerBound 
    || this.size > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}
iio.Text.prototype.draw_shape = function(ctx) {

  ctx.translate(0,this.height/2);

 /* ctx.strokeStyle = 'red';
  ctx.strokeRect( -this.width/2, -this.height, this.width, this.height );*/

  ctx.font = this.size + 'px ' + this.font;
  ctx.textAlign = this.align;
  if (this.color) ctx.fillText(this.text, 0, 0);
  if (this.outline) ctx.strokeText(this.text, 0, 0);
  if (this.showCursor)
    this.cursor.pos.x = this.cursor.endPos.x = this.getX(this.cursor.index);
}
iio.Text.prototype.contains = function(x, y) {
  if (typeof(y) == 'undefined') {
    y = x.y;
    x = x.x
  }
  x -= this.pos.x;
  y -= this.pos.y;
  if ((typeof(this.align) == 'undefined' || this.align == 'left') && x > 0 && x < this.width && y < 0 && y > -this.height)
    return true;
  else if (this.align == 'center' && x > -this.width / 2 && x < this.width / 2 && y < 0 && y > -this.height)
    return true;
  else if ((this.align == 'right' || this.align == 'end') && x > -this.width && x < 0 && y < 0 && y > -this.height)
    return true;
  return false;
}
iio.Text.prototype.charWidth = function(i) {
  i = i || 0;
  this.app.ctx.font = this.size + 'px ' + this.font;
  return this.app.ctx.measureText(this.text.charAt(i)).width;
}
iio.Text.prototype.getX = function(i) {
  this.app.ctx.font = this.size + 'px ' + this.font;
  if (typeof(this.align) == 'undefined' || this.align == 'left')
    return this.app.ctx.measureText(this.text.substring(0, i)).width;
  if (this.align == 'right' || this.align == 'end')
    return -this.app.ctx.measureText(this.text.substring(0, this.text.length - i)).width;
  if (this.align == 'center') {
    var x = -Math.floor(this.app.ctx.measureText(this.text).width / 2);
    return x + this.app.ctx.measureText(this.text.substring(0, i)).width;
  }
}
iio.Text.prototype.keyUp = function(k) {
  if (k == 'shift')
    this.cursor.shift = false;
}
iio.Text.prototype.keyDown = function(key, cI, shift, fn) {
  if (!iio.is.number(cI)) {
    fn = cI;
    cI = this.cursor.index;
  }
  var str;
  var pre = this.text.substring(0, cI);
  var suf = this.text.substring(cI);
  if (typeof fn != 'undefined') {
    str = fn(key, shift, pre, suf);
    if (str != false) {
      this.text = pre + str + suf;
      this.cursor.index = cI + 1;
      if (this.showCursor) this.cursor.hidden = false;
      this.app.draw();
      return this.cursor.index;
    }
  }
  if (key.length > 1) {
    if (key == 'space') {
      this.text = pre + " " + suf;
      cI++;
    } else if (key == 'backspace' && cI > 0) {
      this.text = pre.substring(0, pre.length - 1) + suf;
      cI--;
    } else if (key == 'delete' && cI < this.text.length)
      this.text = pre + suf.substring(1);
    else if (key == 'left arrow' && cI > 0) cI--;
    else if (key == 'right arrow' && cI < this.text.length) cI++;
    else if (key == 'shift') this.cursor.shift = true;
    else if (key == 'semi-colon') {
      if (shift) this.text = pre + ':' + suf;
      else this.text = pre + ';' + suf;
      cI++;
    } else if (key == 'equal') {
      if (shift) this.text = pre + '+' + suf;
      else this.text = pre + '=' + suf;
      cI++;
    } else if (key == 'comma') {
      if (shift) this.text = pre + '<' + suf;
      else this.text = pre + ',' + suf;
      cI++;
    } else if (key == 'dash') {
      if (shift) this.text = pre + '_' + suf;
      else this.text = pre + '-' + suf;
      cI++;
    } else if (key == 'period') {
      if (shift) this.text = pre + '>' + suf;
      else this.text = pre + '.' + suf;
      cI++;
    } else if (key == 'forward slash') {
      if (shift) this.text = pre + '?' + suf;
      else this.text = pre + '/' + suf;
      cI++;
    } else if (key == 'grave accent') {
      if (shift) this.text = pre + '~' + suf;
      else this.text = pre + '`' + suf;
      cI++;
    } else if (key == 'open bracket') {
      if (shift) this.text = pre + '{' + suf;
      else this.text = pre + '[' + suf;
      cI++;
    } else if (key == 'back slash') {
      if (shift) this.text = pre + '|' + suf;
      else this.text = pre + "/" + suf;
      cI++;
    } else if (key == 'close bracket') {
      if (shift) this.text = pre + '}' + suf;
      else this.text = pre + ']' + suf;
      cI++;
    } else if (key == 'single quote') {
      if (shift) this.text = pre + '"' + suf;
      else this.text = pre + "'" + suf;
      cI++;
    }
  } else {
    if (shift || this.cursor.shift)
      this.text = pre + key.charAt(0).toUpperCase() + suf;
    else this.text = pre + key + suf;
    cI++;
  }
  if (this.showCursor) this.cursor.hidden = false;
  this.cursor.index = cI;
  this.app.draw();
  return cI;
}