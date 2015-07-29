h1 = function(html, name){ 
  if(name) return '<h1 id="'+name+'">'+html+'</h1>' 
  return '<h1>'+html+'</h1>' 
}
h2 = function(html, name){ 
  if(name) return '<h2 id="'+name+'">'+html+'</h2>' 
  return '<h2>'+html+'</h2>' 
}
h3 = function(html){ return '<h3>'+html+'</h3>' }
kwd = function(html){ return "<span class='kwd'>"+html+"</span>" }
a = function(name){ return '<a href="#api.'+name+'">'+name+'</a>' }
ahref = function(name, href){ return '<a href="'+href+'">'+name+'</a>' }
pre = function(html){ return "<pre class='prettyprint linenums:1'>"+html+"</span>" }
p = function(html){ return '<p>'+html+'</p>' }
api_list = function(id){ return '<ul class="api_list" id="'+id+'"></ul>' }
api_list_item = function(html){ return '<li class="api_list_item">'+html+'</li>' }
api_list_info = function(html){ return '<p class="api_list_info"> - '+html+'</p>' }
small = function(html){ return "<span class='small'>"+html+"</span>"}
var clear = '<div class="clear"></div>';
var divide = '<div class="clear divide"></div>';