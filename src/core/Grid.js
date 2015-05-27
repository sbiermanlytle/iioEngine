
//DEFINITION
iio.Grid = function(){ this.Grid.apply(this, arguments) };
iio.inherit(iio.Grid, iio.Rectangle);
iio.Grid.prototype._super = iio.Rectangle.prototype;

//CONSTRUCTOR
iio.Grid.prototype.Grid = function() {
  this._super.Rectangle.call(this,iio.merge_args(arguments));

  // set res if undefined
  this.res = this.res || new iio.Vector(
    this.width/this.C,
    this.height/this.R
  );

  // set width/height if undefined
  this.width = this.width || this.C * this.res.x;
  this.height = this.height || this.R * this.res.y;

  // initialize cells
  this.init_cells();
}

//FUNCTIONS
iio.Grid.prototype.init_cells = function(){
  this.cells = [];
  var x = -this.res.x * (this.C - 1) / 2;
  var y = -this.res.y * (this.R - 1) / 2;
  for (var c = 0; c < this.C; c++) {
    this.cells[c] = [];
    for (var r = 0; r < this.R; r++) {
      this.cells[c][r] = this.add(new iio.Rectangle({
        pos: new iio.Vector( x,y ),
        c: c,
        r: r,
        width: this.res.x,
        height: this.res.y
      }));
      y += this.res.y;
    }
    y = -this.res.y * (this.R - 1) / 2;
    x += this.res.x;
  }
}
iio.Grid.prototype.infer_res = function(){
  this.res.x = this.width/this.C;
  this.res.y = this.height/this.R;
}
iio.Grid.prototype.clear = function(noDraw){
  this.objs = [];
  this.init_cells();
  if(noDraw);
  else this.app.draw();
}
iio.Grid.prototype.cellCenter = function(c, r) {
  return {
    x: -this.width / 2 + c * this.res.x + this.res.x / 2,
    y: -this.height / 2 + r * this.res.y + this.res.y / 2
  }
}
iio.Grid.prototype.cellAt = function(x, y) {
  if (x.x) return this.cells[Math.floor((x.x - this.left()) / this.res.x)][Math.floor((x.y - this.top()) / this.res.y)];
  else return this.cells[Math.floor((x - this.left()) / this.res.x)][Math.floor((y - this.top()) / this.res.y)];
}
iio.Grid.prototype.foreachCell = function(fn, p) {
  for (var c = 0; c < this.C; c++)
    for (var r = 0; r < this.R; r++)
      if (fn(this.cells[c][r], p) === false)
        return [r, c];
}
iio.Grid.prototype.setSize = function(w,h){
  this.width = w;
  this.height = h;
  this.infer_res();
}
iio.Grid.prototype._shrink = function(s, r) {
  this.setSize( 
    this.width * (1 - s),
    this.height * (1 - s)
  );
  if (this.width < .02 
    || this.width < this.shrink.lowerBound 
    || this.width > this.shrink.upperBound) {
    if (r) return r(this);
    else return true;
  }
}

//DRAW FUNCTIONS
iio.Grid.prototype.prep_ctx_color = iio.Line.prototype.prep_ctx_color;
iio.Grid.prototype.draw_shape = function(ctx) {
  //ctx.translate(-this.width / 2, -this.height / 2);
  /*iio.draw.rect(ctx, this.width, this.height, {
    c: this.color,
    o: this.outline
  }, {
    img: this.img,
    anims: this.anims,
    mov: this.mov,
    round: this.round
  });*/
  if (this.color) {
    for (var c = 1; c < this.C; c++) 
      iio.draw.line(ctx, 
        -this.width / 2 + c * this.res.x, -this.height / 2, 
        -this.width / 2 + c * this.res.x, this.height / 2
      );
    for (var r = 1; r < this.R; r++) 
      iio.draw.line(ctx, 
        -this.width / 2, -this.height / 2 + r * this.res.y,
        this.width / 2, -this.height / 2 + r * this.res.y
      );
  }
}