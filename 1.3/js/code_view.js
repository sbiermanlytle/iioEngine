var iio_i=0;
var js_i=1;
var btns=[];
btns[iio_i] = document.getElementById('opt_iio');
btns[js_i] = document.getElementById('opt_js');
var scrs=[];
scrs[iio_i] = document.getElementById('iio');
scrs[js_i] = document.getElementById('js');
var current=iio_i;
oc = function(index){
  if(index==current)
    return;
  current=index;
  for(var i=0;i<btns.length;i++){
    btns[i].style.backgroundColor='transparent';
    scrs[i].style.display='none';
    btns[i].style.cursor='pointer';
  }
  btns[current].style.backgroundColor='#00baff';
  scrs[current].style.display='block';
  btns[current].style.cursor='default';
}