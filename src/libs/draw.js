/* iio.draw
------------------
*/
iio.draw = {
  line: function( ctx, x1, y1, x2, y2 ){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  },
}
