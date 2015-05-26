highlight_menu = function(){
  $('#'+HOME).children().first().removeClass("active");
  $('#'+DOCS).children().first().removeClass("active");
  $('#'+DEMOS).children().first().removeClass("active");
  $('#'+TESTS).children().first().removeClass("active");
  $('#'+current).children().first().addClass("active");
}

$('#download').click(function(){
  window.location.hash = '#download';
  return false;
});
$('#demos').click(function(){
  window.location.hash = '#demos';
  return false;
});
$('#tests').click(function(){
  window.location.hash = '#tests';
  return false;
});
$('#docs').click(function(){
  window.location.hash = '#api.overview';
  return false;
});