/* JS Extensions
------------------
*/
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
  return this;
}
if (Function.prototype.name === undefined){
  // Add a custom property to all function values
  // that actually invokes a method to get the value
  Object.defineProperty(Function.prototype,'name',{
    get: function(){
      return /function ([^(]*)/.exec( this+"" )[1];
    }
  });
}