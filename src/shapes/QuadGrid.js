/* QuadGrid
------------------
*/

// DEFINITION
iio.QuadGrid = function(){ this.QuadGrid.apply(this, arguments) };
iio.inherit(iio.QuadGrid, iio.Quad);
iio.QuadGrid.prototype._super = iio.Quad.prototype;

// CONSTRUCTOR
iio.QuadGrid.prototype.QuadGrid = function() {
  this._super.Quad.call(this,iio.merge_args(arguments));
  this.init();
}

// SHARED GRID FUNCTIONS
iio.QuadGrid.prototype.init = iio.Grid.prototype.init;
iio.QuadGrid.prototype.init_cells = iio.Grid.prototype.init_cells;
iio.QuadGrid.prototype.infer_res = iio.Grid.prototype.infer_res;
iio.QuadGrid.prototype.clear = iio.Grid.prototype.clear
iio.QuadGrid.prototype.cellCenter = iio.Grid.prototype.cellCenter;
iio.QuadGrid.prototype.cellAt = iio.Grid.prototype.cellAt;
iio.QuadGrid.prototype.setSize = iio.Grid.prototype.setSize;
iio.QuadGrid.prototype._shrink = iio.Grid.prototype._shrink;
iio.QuadGrid.prototype.prep_ctx_color = iio.Grid.prototype.prep_ctx_color;
iio.QuadGrid.prototype.draw_shape = iio.Grid.prototype.draw_shape;