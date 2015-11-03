highlight_menu = function(){
  $('#'+HOME).children().first().removeClass("active");
  $('#'+DOCS).children().first().removeClass("active");
  $('#'+DEMOS).children().first().removeClass("active");
  $('#'+current).children().first().addClass("active");
}

$('#download').click(function(){
  goTo('download');
  return false;
});
$('#demos').click(function(){
  goTo('demos');
  return false;
});
$('#docs').click(function(){
  goTo('api');
  return false;
});