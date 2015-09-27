/*
	iio engine
	Version 1.3.3 API
	url: iioengine.com/api
	Last Update 8/8/2014
	
---------------------------------------------------------------------
The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2014, Sebastian Bierman-Lytle
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list 
of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this
list of conditions and the following disclaimer in the documentation and/or other 
materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
*/
document.getElementById('overview_li').innerHTML="<h2><a id='overview_a' class='primary' href='javascript:showme("+'"'+"overview"+'"'+")'>Overview</a></h2>"
	+"<div class='inner inner2 closed' id='overview'>"
	+"<p>iio Engine is an open source JavaScript framework for HTML5 Canvas applications connected to a free hosting platform.</p>"
	+"<ul>"
		+"<li>Source Code: <a target='_blank' href='https://github.com/sbiermanlytle/iioengine'>github/sbiermanlytle/iioengine</a></li>"
		+"<li>App Hosting: <a target='_blank' href='http://iioapps.com'>iioapps.com</a>"
		+"<li>Homepage: <a target='_blank' href='http://iioengine.com'>iioengine.com</a> <span class='red'>still for 1.2</span></li>"
	+"</ul>"
	+"<p>The homepage will soon be updated, so do not refer to that website for now unless you want to work with <a target='_blank' href='https://github.com/sbiermanlytle/iioengine/tree/master/archives/1.2'>iio 1.2</a> - which is not a bad idea since it currently has more features (like Box2D and sound) and is more stable.</p>"
	+"<h6>Best Practices</h6>"
	+"<p>iio can be used in many different ways, but the best design - which is <span class='red'>required</span> for apps published on <a target='_blank' href='http://iioapps.com'>iioapps.com</a> - is to wrap your main application script in a function with the same name as your app. This allows your app to be started on any canvas, on any webpage, with ease:</p>"
		+"<pre class='prettyprint linenums lang-js'>//starting an iio App named 'MyApp'\n"
		+"iio.start( MyApp, 'canvasId' );\n"
		+"iio.start( MyApp ); //starts full screen</pre>"
	+"<h6>App Settings</h6>"
	+"<p>A settings object may be passed to an application when started:</p>"
		+"<pre class='prettyprint linenums lang-js'>//passing settings\n"
		+"iio.start( [ MyApp, {color:'red',...} ] );</pre>"
	+"<p><a href='http://iioapps.com'>iioapps.com</a> uses the following settings:</p>"
	+"<ul>"
		+"<li>s.<span class='green'>color</span> - a color specified by the user</li>"
		+"<li>s.<span class='green'>preview</span> - a boolean flag for a preview launch. If <span class='green'>true</span>, apps must limit computations and resource use as much as possible</li>"
	+"</ul>"
	+"<h6>Hello World</h6>"
	+"<p>The simplest iio application with text:</p>"
		+"<pre class='prettyprint linenums'>&lt;!DOCTYPE html&gt;\n"
		+"&lt;html&gt;\n"
		+"&lt;body&gt;\n"
		+"&lt;script type='text/javascript' src='iioEngine.js'>&lt;/script&gt;\n"
		+"&lt;script type='text/javascript'&gt;\n\n"
		+'// app is an App object\n'
		+'// s is the settings object\n'
		+'HelloWorld = function(app,s){\n\n'
		+"  app.add('center "+'"Hello iio 1.3"'+"'\n"
   	 	+"    +' red font Arial 50 center');\n\n"
		+"}; iio.start(HelloWorld);\n\n"
		+"&lt;/script&gt;\n"
		+"&lt;/body&gt;\n"
	+"&lt;/html&gt;</pre></div>";

createLi('Properties',[
{
	t:'Reference',
	l:[{ t:'type',
		o:true,
		a:true,
		i:true,
		l:[
			'type :: <a class="const" href="">Constant</a>'
			,'<p>the type specifier</p>'
			,'<p><span class="const">App</span> - the application manager</p>'
			,'<p><span class="const">Obj</span> - the parent of all app objects</p>'
			,'<p><span class="const">Line</span> - a line object</p>'
			,'<p><span class="const">Ellipse</span> - a ellipse object</p>'
			,'<p><span class="const">Rectangle</span> - a rectangle object</p>'
			,'<p><span class="const">Polygon</span> - a polygon object</p>'
			,'<p><span class="const">Grid</span> - a grid object</p>'
			,'<p><span class="const">Text</span> - a text object</p>'
			,'<pre class="prettyprint linenums lang-js">//get the type of app\n'
			+'var app_type = app.type;\n\n'
			+'//get an objects type\n'
			+'var obj = app.add("center 50 red");\n'
			+'var obj_type = obj.type;\n'
		]
	},{ t:'parent',
		o:true,
		i:true,
		l:['parent :: <span class="normal">object</span>',
			'<p>the object that manages this object.</p><p>parent objects often trigger updates and renders</p>'
			+'<pre class="prettyprint linenums lang-js">//create an object\n'
			+'var obj = app.add("center 50 red");\n\n'
			+'//get the parent (will equal to app)\n'
			+'var parent = obj.parent;</pre>']
	}]
},{
	t:'Physical',
	l:[{ t:'pos',
		a:true,
		o:true,
		i:true,
		l:[
			'pos :: <span class="normal">{ x,y }</span>',
			'<p>the primary x,y coordinate</p>',
			'<p><span class="app">app</span>: top left corner relative to the client window</p>',
			'<p><span class="obj">obj</span>: usually the center, relative to app</p>',
			'<pre class="prettyprint linenums lang-js">//get the app position\n'
			+'var app_x = app.pos.x\n'
			+'var app_y = app.pos.y\n\n'
			+'//create an object\n'
			+'var obj = app.add("center 50 red");\n\n'
			+'//get an objects position\n'
			+'var obj_x = obj.pos.x;\n'
			+'var obj_y = obj.pos.y;\n\n'
			+'//set an objects position\n'
			+'obj.set({ pos:{ x:10, y:10 } });\n'
			+'//or\n'
			+'obj.pos = { x:10, y:10 };\n'
			+'app.draw();\n'
			+'//or\n'
			+'obj.pos.x = 10;\n'
			+'obj.pos.y = 10;\n'
			+'app.draw();</pre>'
		]
	},{ t:'rot',
		o:true,
		i:true,
		l:['rot :: <span class="normal">float</span>',
			'<p>the rotation value, in radians</p>',
			'<p><span class="const">PI</span>/2 = 90 degrees</p>',
			'<p><span class="const">PI</span> = 180 degrees</p>',
			'<p><span class="const">PI</span>*3/2 = 270 degrees</p>',
			'<p><span class="const">PI</span>*2 = 360 degrees</p>',
			'<pre class="prettyprint linenums lang-js">//create an object rotated 90 degrees\n'
			+"var obj = app.add( 'center 100 red rotate ' + Math.PI/4 );\n\n"
			+'//get an objects rotation\n'
			+'var rotation = obj.rot;\n\n'
			+'//set an objects rotation\n'
			+"obj.set('rotate .6');\n"
			+'//or\n'
			+"obj.set('rotate ' + Math.PI);\n"
			+'//or\n'
			+'obj.set({ rot:Math.PI });\n'
			+'//or\n'
			+'obj.rot = Math.PI;\n'
			+'app.draw();\n\n'
			+'//create a spinning object\n'
			+"app.add( 'center 100 red vel ::.01' );</pre>"
		]
	},{
		t:'vel',
		o:true,
		i:true,
		l:['vel :: <span class="normal">{ x,y,r }</span>',
			'<p>velocity and torque values</p>',
			'<p><span class="green">x</span>: the horizontal velocity in px/update</p>',
			'<p><span class="green">y</span>: the vertical velocity in px/update</p>',
			'<p><span class="green">r</span>: the rotational velocity in radians/update</p>',
			'<pre class="prettyprint linenums lang-js">//create an object that moves to the right\n'
			+"var obj = app.add('center 40 red vel 1')\n\n"
			+'//create an object that moves upwards\n'
			+"app.add('center 40 red vel :-1');\n\n"
			+'//create an object that spins\n'
			+"app.add('center 40 red vel ::.01');\n\n"
			+'//create an object that moves and spins\n'
			+"app.add('center 40 red vel 1:1:.01');\n\n"
			+'//get an objects velocity\n'
			+'var velx = obj.vel.x;\n'
			+'var velx = obj.vel.y;\n'
			+'var velr = obj.vel.r;\n\n'
			+'//set an objects velocity\n'
			+"obj.set('vel 1:1:.01');\n"
			+'//or\n'
			+'obj.set({ vel:{ x:1, y:1, r:.01 } });\n'
			+'//or\n'
			+'obj.vel = { x:1, y:1, r:.01 };\n'
			+'app.loop();\n'
			+'//or\n'
			+'obj.vel.x = 1;\n'
			+'obj.vel.y = 1;\n'
			+'obj.vel.r = .01;\n'
			+'app.loop();\n\n'
			+'//create an object that steps instead of slides\n'
			+"app.add('center 50 red vel 50');\n"
			+'app.loop(1); //sets loop rate to 1 update/second</pre>'
		]
	},{
		t:'acc',
		o:true,
		i:true,
		l:['acc :: <span class="normal">{ x,y,r }</span>',
			'<p>acceleration values</p>',
			'<p><span class="green">x</span>: the horizontal acceleration in px/update</p>',
			'<p><span class="green">y</span>: the vertical acceleration in px/update</p>',
			'<p><span class="green">r</span>: the rotational acceleration in radians/update</p>',
			'<pre class="prettyprint linenums lang-js">//create an object that accelerates to the right\n'
			+"var obj = app.add('center 40 red acc 1')\n\n"
			+'//create an object that accelerates upwards\n'
			+"app.add('center 40 red acc :-1');\n\n"
			+'//create an object with an accelerated spin\n'
			+"app.add('center 40 red acc ::.01');\n\n"
			+'//create an object with accelerating motion and torque\n'
			+"app.add('center 40 red acc 1:1:.01');\n\n"
			+'//get an objects accleration\n'
			+'var accx = obj.acc.x;\n'
			+'var accx = obj.acc.y;\n'
			+'var accr = obj.acc.r;\n\n'
			+'//set an objects accleration\n'
			+"obj.set('acc 1:1:.01');\n"
			+'//or\n'
			+'obj.set({ acc:{ x:1, y:1, r:.01 } });\n'
			+'//or\n'
			+'obj.acc = { x:1, y:1, r:.01 };\n'
			+'app.loop();\n'
			+'//or\n'
			+'obj.acc.x = 1;\n'
			+'obj.acc.y = 1;\n'
			+'obj.acc.r = .01;\n'
			+'app.loop();\n\n'
			+'//create an object that steps instead of slides\n'
			+"app.add('center 50 red acc 50');\n"
			+'app.loop(1); //sets loop rate to 1 update/second</pre>'
		]
	},/*{
		t:'scale',
		a:true,
		o:true,
		l:''
	},*/{ t:'width',
		a:true,
		o:true,
		i:true,
		l:['width :: <span class="normal">float</span>',
			'<p>width in pixels</p>',
			'<pre class="prettyprint linenums lang-js">//get the app width\n'
			+'var app_width = app.width;\n\n'
			+'//create an object as wide as the app\n'
			+'var obj = app.add("center width:100 red");\n\n'
			+'//get the objects width\n'
			+'var obj_width = obj.width;\n\n'
			+'//set the objects width\n'
			+'obj.set(20); //sets width and height if they are equal\n'
			+'//or\n'
			+'obj.set({ width:20 });\n'
			+'//or\n'
			+'obj.width = 20;\n'
			+'app.draw();</pre>']
	},{ t:'height',
		a:true,
		o:true,
		i:true,
		l:['height :: <span class="normal">float</span>',
			'<p>height in pixels</p>',
			'<pre class="prettyprint linenums lang-js">//get the app height\n'
			+'var app_height = app.height;\n\n'
			+'//create an object as tall as the app\n'
			+'var obj = app.add("center 100:height red");\n\n'
			+'//get the objects height\n'
			+'var obj_height = obj.height;\n\n'
			+'//set the objects height\n'
			+'obj.set(":20");\n'
			+'//or\n'
			+'obj.set(":" + 20);\n'
			+'//or\n'
			+'obj.set({ height:20 });\n'
			+'//or\n'
			+'obj.height = 20;\n'
			+'app.draw();</pre>']
	},{
		t:'radius',
		o:true,
		i:true,
		l:['radius :: <span class="normal">float</span>',
			'<p>radius in pixels. objects with a radius property will be drawn as ellipses.</p>',
			'<p>use the iioScript keyword <span class="green">o</span> to create an ellipse</p>',
			'<pre class="prettyprint linenums lang-js">//create a circle with a 25px radius\n'
			+'var circle = app.add("center o 50 red");\n\n'
			+'//create a 50x100 ellipse\n'
			+'var ellipse = app.add("center o 50:100 red");\n\n'
			+'//get the radius\n'
			+'var radius = circle.radius;\n\n'
			+'//set the radius\n'
			+'//pass the width to set: radius*2\n'
			+'circle.set(20); //sets the radius to 10\n'
			+'circle.set("20:40"); //sets r1 to 10 and r2 to 20\n'
			+'circle.set(20 +":"+ 40);\n'
			+'//or\n'
			+'circle.set({ radius:20 });\n'
			+'//or\n'
			+'circle.radius = 20;\n'
			+'app.draw();</pre>']
	},{ t:'center',
		a:true,
		o:true,
		i:true,
		l:[
			'center :: <span class="normal">{ x,y }</span>',
			'<p>the center x,y coordinate relative to the top left corner of the app (0,0)</p>',
			'<pre class="prettyprint linenums lang-js">//get the app position\n'
			+'var app_center_x = app.center.x\n'
			+'var app_center_y = app.center.y\n\n'
			+'//create an object\n'
			+'var obj = app.add( app.center, "50 red" );\n\n'
			+'//get an objects center\n'
			+'var obj_center_x = obj.center.x;\n'
			+'var obj_center_y = obj.center.y;</pre>',
			'<p class="bottomp">set the objects <a href="#pos">pos</a>, not its center when updating'
		]
	},{
		t:'origin',
		o:true,
		l:[
			'origin :: <span class="normal">{ x,y }</span> <span class="red">BETA ALERT: not ready for use</span>',
			'<p>the x,y coordinate of the rotation axis, initially set to <a href="#center">center</a></p>'
		]
	},{
		t:'vs',
		o:true,
		i:true,
		l:[
			'vs :: <span class="normal">Array</span>',
			'<p>a list of coordinates that define the position vectors of a polygon object</p>',
			'<pre class="prettyprint linenums lang-js">//create a triangle\n'
			+"var poly = app.add('center 0:0 width:0 red');\n\n"
			+'//get the triangles coordinates\n'
			+'var p0 = poly.vs[0]; //equals poly.pos\n'
			+'var p1 = poly.vs[1];\n'
			+'var p2 = poly.vs[2];</pre>',
			'<p class="bottomp">set the objects <a href="#pos">pos</a>, not its vs when updating'
		]
	},{ t:'left',
		o:true,
		i:true,
		l:['left :: <span class="normal">float</span> <span class="red">BETA ALERT: does not take rotation into account</span>',
			'<p>the x-coordinate furthest to the left relative to canvas 0,0</p>',
			'<pre class="prettyprint linenums lang-js">//create an object\n'
			+"var obj = app.add('center 100 red');\n\n"
			+'//get the left position value\n'
			+'var left = obj.left;</pre>',
			'<p class="bottomp">set the objects <a href="#pos">pos</a>, not its left value when updating'
		]
	},{ t:'right',
		o:true,
		i:true,
		l:['right :: <span class="normal">float</span> <span class="red">BETA ALERT: does not take rotation into account</span>',
			'<p>the x-coordinate furthest to the right relative to canvas 0,0</p>',
			'<pre class="prettyprint linenums lang-js">//create an object\n'
			+"var obj = app.add('center 100 red');\n\n"
			+'//get the right position value\n'
			+'var right = obj.right;</pre>',
			'<p class="bottomp">set the objects <a href="#pos">pos</a>, not its right value when updating'
		]
	},{ t:'top',
		o:true,
		i:true,
		l:['top :: <span class="normal">float</span> <span class="red">BETA ALERT: does not take rotation into account</span>',
			'<p>the highest x-coordinate of the object relative to canvas 0,0</p>',
			'<pre class="prettyprint linenums lang-js">//create an object\n'
			+"var obj = app.add('center 100 red');\n\n"
			+'//get the top position value\n'
			+'var top = obj.top;</pre>',
			'<p class="bottomp">set the objects <a href="#pos">pos</a>, not its top value when updating'
		]
	},{ t:'bottom',
		o:true,
		i:true,
		l:['bottom :: <span class="normal">float</span> <span class="red">BETA ALERT: does not take rotation into account</span>',
			'<p>the lowest x-coordinate of the object relative to canvas 0,0</p>',
			'<pre class="prettyprint linenums lang-js">//create an object\n'
			+"var obj = app.add('center 100 red');\n\n"
			+'//get the bottom position value\n'
			+'var bottom = obj.bottom;</pre>',
			'<p class="bottomp">set the objects <a href="#pos">pos</a>, not its bottom value when updating'
		]
	},{ t:'simple',
		o:true,
		i:true,
		l:['simple :: <span class="normal">boolean</span>',
			'<p>A flag that simplifies the objects data and update calculations at the cost of some precision.</p>',
			'<p>The following properties are dropped from <span class="green">simple</span> objects: <span class="red">left</span>, <span class="red">right</span>, <span class="red">top</span>, <span class="red">bottom</span>, <span class="red">center</span></p>',
			'<p><span class="green">simple</span> objects use the simplest rectangular collision algorithm, and use only their position coordinate to resolve bounds.',
			'<p>Most objects can be simple objects, so <span class="green">use this property whenever possible</span>.</p>',
			'<pre class="prettyprint linenums lang-js">//create a simple object\n'
			+"var obj = app.add('center 100 red simple');</pre>"
		]
	}]
},{ t:'Display',
	l:[{ t:'fps',
		a:true,
		i:true,
		l:[
			'fps :: <span class="normal">float</span>'
			,'<p>The number of times per second that the app updates and redraws. The default value is 60.</p>'
			,'<p>This property is automatically set whenever an object is given a velocity or acceleration.</p>'
			,'<p>The rate can be changed by using the <a href="#loop">loop</a> function.</p>'
			,'<pre class="prettyprint linenums lang-js">//make an object move with a rate of 60fps\n'
			+'var obj = app.add("center 50 red vel 25");\n\n'
			+'//change the rate to 1fps\n'
			+'app.loop(1);\n\n\n'
			+'//set a 60fps update loop\n'
			+'app.loop(function(){\n\n'
			+"  obj.set('randomColor');\n\n"
			+'});\n\n'
			+'//set a 4fps update loop\n'
			+'app.loop(4, function(){\n\n'
			+"  obj.set('randomColor');\n\n"
			+'});</pre>'
		]
	},{ t:'alpha',
		o:true,
		a:true,
		i:true,
		l:[
			'alpha :: <span class="normal">float</span>'
			,'<p>transparency value in the range [0-1]</p>'
			,'<pre class="prettyprint linenums lang-js">//create an object with transparency\n'
			+'var obj = app.add("center 50 red alpha .2");\n\n'
			+'//get transparency value\n'
			+'var app_alpha = app.alpha;\n'
			+'var obj_alpha = obj.alpha;\n\n'
			+'//set transparency\n'
			+'obj.set("alpha .8");\n'
			+'//or\n'
			+'obj.set({ alpha:0.8 });\n'
			+'//or\n'
			+'obj.alpha = .8;\n'
			+'app.draw();\n'
		]
	},{t:'color',
		o:true,
		a:true,
		i:true,
		l:[
			'color :: <span class="normal">String</span>',
			'<p><span class="app">app</span>: background color of the app</p>',
			'<p><span class="obj">obj</span>: color used to draw the object</p>'
			,'<pre class="prettyprint linenums lang-js">//change the application background color\n'
			+"app.set('red');\n"
			+"app.set('#00baff'); //hexadecimal blue\n"
			+"app.set('rgb(0,255,0)'); //full green\n"
			+"app.set('rgba(255,0,0,.4)'); //transparent red\n"
			+"app.set('randomColor');\n"
			+"app.set( s.color || 'white' ); //use the settings color if it exists\n"
			+"//for gradients, see the example below\n\n"
			+'//get the app background color\n'
			+'var bg_color = app.color;\n\n'
			+'//create an object with a red color\n'
			+"var obj = app.add('center 50 red');\n\n"
			+"//get the object's color\n"
			+"var obj_color = obj.color\n\n"
			+"//change the object's color\n"
			+"obj.set('blue');\n"
			+'//or\n'
			+"obj.set({ color:'#00baff' });\n"
			+'//or\n'
			+"obj.color = 'blue';\n"
			+'app.draw();\n\n'
			+"//set a linear gradient as the object's color\n"
			+"app.add('center 180:'\n"
			+"  +' gradient:0,30,0,-60'\n"
			+"    +':0,red'\n"
			+"    +':.6,black');\n\n"
			+"//set a radial gradient as the object's color\n"
			+"app.add('center 180:'\n"
			+"  +' gradient:90,90,.01,90,90,90'\n"
			+"    +':0,rgba(255,255,0,.7)'\n"
			+"    +':1,transparent');</pre>",
			'<p class="bottomp" style="margin-bottom:0">To set a gradient as the application background color, the canvas style property must be set directly:</p>',
			'<pre class="prettyprint linenums lang-js">//set the application background color to a gradient\n'
			+"//W3C Standard\n"
			+"app.canvas.style.background='linear-gradient(to bottom, red 0%, black 100%)';\n\n"
			+"//for old browsers, add these:\n\n"
			+"//FF3.6+\n"
			+"app.canvas.style.background='-moz-linear-gradient(to bottom, red 0%, black 100%)';\n\n"
			+'//Chrome,Safari4+\n'
			+"app.canvas.style.background='-webkit-gradient(linear, left top, left bottom,'\n"
			+"   +'color-stop(0%,red), color-stop(100%,black));';\n\n"
			+'//Chrome10+,Safari5.1+\n'
			+"app.canvas.style.background='-webkit-linear-gradient(top, red 0%, black 100%)';\n\n"
			+'//Opera 11.10+\n'
			+"app.canvas.style.background='-o-linear-gradient(top, red 0%, black 100%';\n\n"
			+'//IE10+\n'
			+"app.canvas.style.background='-ms-linear-gradient(top, red 0%, black 100%)';\n\n"
			+'//IE6-9\n'
			+"app.canvas.style.filter='progid:DXImageTransform.Microsoft.gradient('\n"+'  '+"+'"+'startColorstr="red", endColorstr="black", GradientType=0 );'+"'"+';</pre>'
		]
	},{ t:'outline',
		a:true,
		o:true,
		i:true,
		l:[
			'outline :: <span class="normal">String</span>',
			'<p><span class="app">app</span>: outline color of the app</p>',
			'<p><span class="obj">obj</span>: color used to draw an outline around the object</p>'
			,'<pre class="prettyprint linenums lang-js">//change the application outline color\n'
			+"app.set('outline red 1');\n"
			+"app.set('outline 1 #00baff'); //hexadecimal blue\n"
			+"app.set('outline 1 rgb(0,255,0)'); //full green\n"
			+"app.set('outline 1 rgba(255,0,0,.4)'); //transparent red\n"
			+"app.set('outline 1 randomColor');\n"
			+"app.set( 'outline' + (s.color || 'white') ); //use the settings color if it exists\n"
			+"//for gradients, see the example below\n\n"
			+'//get the app outline color\n'
			+'var bg_outline = app.outline;\n\n'
			+'//create an object with a red 1px outline\n'
			+"var obj = app.add('center 50 outline 1 red');\n\n"
			+"//get the object's outline color\n"
			+"var obj_outline = obj.outline\n\n"
			+"//change the object's outline color\n"
			+"obj.set('outline blue');\n"
			+'//or\n'
			+"obj.set({ outline:'#00baff' });\n"
			+'//or\n'
			+"obj.outline = 'blue';\n"
			+'app.draw();\n\n'
			+"//set a linear gradient as the object's outline color\n"
			+"app.add('center 180: outline 1 '\n"
			+"  +' gradient:0,30,0,-60'\n"
			+"    +':0,red'\n"
			+"    +':.6,black');\n\n"
			+"//set a radial gradient as the object's outline color\n"
			+"app.add('center 180: outline 1 '\n"
			+"  +' gradient:90,90,.01,90,90,90'\n"
			+"    +':0,rgba(255,255,0,.7)'\n"
			+"    +':1,transparent');</pre>",
			'<p class="bottomp" style="margin-bottom:0">To set a gradient as the application outline color, the canvas style property must be set directly:</p>',
			'<pre class="prettyprint linenums lang-js">//set the application outline color to a gradient\n'
			+"//W3C Standard\n"
			+"app.canvas.style.borderColor='linear-gradient(to bottom, red 0%, black 100%)';\n\n"
			+"//for old browsers, add these:\n\n"
			+"//FF3.6+\n"
			+"app.canvas.style.borderColor='-moz-linear-gradient(to bottom, red 0%, black 100%)';\n\n"
			+'//Chrome,Safari4+\n'
			+"app.canvas.style.borderColor='-webkit-gradient(linear, left top, left bottom,'\n"
			+"   +'color-stop(0%,red), color-stop(100%,black));';\n\n"
			+'//Chrome10+,Safari5.1+\n'
			+"app.canvas.style.borderColor='-webkit-linear-gradient(top, red 0%, black 100%)';\n\n"
			+'//Opera 11.10+\n'
			+"app.canvas.style.borderColor='-o-linear-gradient(top, red 0%, black 100%';\n\n"
			+'//IE10+\n'
			+"app.canvas.style.borderColor='-ms-linear-gradient(top, red 0%, black 100%)';\n\n"
			+'//IE6-9\n'
			+"app.canvas.style.filter='progid:DXImageTransform.Microsoft.gradient('\n"+'  '+"+'"+'startColorstr="red", endColorstr="black", GradientType=0 );'+"'"+';</pre>'
		]
	},{ t:'lineWidth',
		o:true,
		a:true,
		i:true,
		l:
		[
			'lineWidth :: <span class="normal">float</span>',
			'<p>draw width of lines and a shapes <a href="#outline">outline</a></p>',
			'<pre class="prettyprint linenums lang-js">//create a line with a 10px width\n'
			+'var line = app.add("0:0 width:height 10 red");\n\n'
			+'//create a square with a 10px outline\n'
			+'var square = app.add("center 50 outline 10 red");\n\n'
			+'//get an objects lineWidth\n'
			+'var line_lineWidth = line.lineWidth;\n'
			+'var square_lineWidth = square.lineWidth;\n\n'
			+'//set lineWidth\n'
			+'line.set("20");\n'
			+'square.set("outline 20");\n'
			+'//or\n'
			+'line.set({ lineWidth:20 });\n'
			+'square.set({ lineWidth:20 });\n'
			+'//or\n'
			+'line.lineWidth = 20;\n'
			+'square.lineWidth = 20;\n'
			+'app.draw();</pre>\n'
		]
	},{ t:'lineCap',
		o:true,
		l:[
			'lineCap :: <span class="normal">String</span>'
			,'<p class="info">the style of cap used at the endpoints of a line object</p>'
			,'<p><span class="const">square</span> - straight cut off</p>'
			,'<p><span class="const">round</span> - rounded cut off</p>'
			,'<pre class="prettyprint linenums lang-js">//create a line with round cap\n'
			+'var line = app.add("20:20 width-20:height-20 10 red round");\n\n'
			+'//create a square with a 10px outline\n'
			+'var square = app.add("center 50 outline 10 red");\n\n'
			+'//get an objects lineWidth\n'
			+'var line_lineWidth = line.lineWidth;\n'
			+'var square_lineWidth = square.lineWidth;\n\n'
			+'//set lineWidth\n'
			+'line.set("20");\n'
			+'square.set("outline 20");\n'
			+'//or\n'
			+'line.set({ lineWidth:20 });\n'
			+'square.set({ lineWidth:20 });\n'
			+'//or\n'
			+'line.lineWidth = 20;\n'
			+'square.lineWidth = 20;\n'
			+'app.draw();</pre>\n'
		]
	},{ t:'dash',
		o:true,
		i:true,
		l:[
			'dash :: <span class="normal">Array</span>'
			,'<p>an array of any size that specifies dash widths and offsets</p>'
			,'<p><span class="red">[ size ]</span> - dash and offset will equal the given size</p>'
			,'<p><span class="red">[ dash, offset ]</span></p>'
			,'<p><span class="red">[ s1, s2, s3, ... (odd) ]</span> - dash and offset will alternate between s values</p>'
			,'<p><span class="red">[ s1, s2, s3, ... (even) ]</span> - dash will alternate between even values, offset will alternate between the odds</p>'
			,'<pre class="prettyprint linenums lang-js">//create dashed lines\n'
			+"var line = app.add('0:0 width:height 10 dash 10');\n"
			+"app.add('0:20 width:height+20 10 dash 10 100');\n"
			+"app.add('0:40 width:height+40 10 dash 10 100 10');\n"
			+"app.add('0:60 width:height+60 10 dash 10 100 10 40');\n\n"
			+'//create a square with a dashed outline\n'
			+"var square = app.add('center 200 red outline black 4 dash 10');\n\n"
			+'//get an objects dash properties\n'
			+'var line_dash = line.dash;\n'
			+'var square_dash = square.dash;\n\n'
			+'//set dash\n'
			+"line.set('dash 40 10');\n"
			+"square.set('dash 40 10');\n"
			+'//or\n'
			+'line.set({ dash:[40,10] });\n'
			+'square.set({ dash:[40,10] });\n'
			+'//or\n'
			+'line.dash = [40,10];\n'
			+'square.dash = [40,10];\n'
			+'app.draw();</pre>\n'
			,'<p class="bottomp">setting a dash for <span class="green">app</span> requires direct css manipulation. Refer to <a href="http://www.w3schools.com/css/css_border.asp">w3schools</a> for the API</p>'
			,'<pre class="prettyprint linenums lang-js">//give the app a dashed outline\n'
			+"app.canvas.style.border='2px #00baff dashed';</pre>'"
		]
	},{ t:'shadow',
		o:true,					
		a:true,
		l:[
		{
			t:'offset',
			l:['<span class="parent">outline.</span>color :: <a class="const" href="javascript:redirect('+"'"+'color'+"'"+')">Color</a>',
			   '<p>color used to draw the outline</p>']
		},{
			t:'color',
			l:['<span class="parent">outline.</span>dash :: <a class="const" href="">List</a>',
			   '<p>color used to draw the outline</p>']
		},{
			t:'blur',
			l:['<span class="parent">outline.</span>dash :: <a class="const" href="">List</a>',
			   '<p>color used to draw the outline</p>']
		}]
	},{ t:'round',
		a:true,
		i:true,
		l:['round :: <span class="normal">String</span>',
			"<p>a sequence specifying the rounding radius of this object's corners.</p>",
			'<p>if one parameter is passed, it will effect all corners.</p>',
			'<p>if two or more parameters are passed, it will alternate its effect</p>',
			'<p>parameters can be given in pixels or a percentage:</p>',
			'<p><span class="normal">pixels:</span> 10px',
			'<p><span class="normal">percentages:</span> 10%',
			,'<pre class="prettyprint linenums lang-js">//round the app\n'
			+"app.set('red round 10px 20px');\n"
			+"//or\n"
			+"app.set({ round:'10px 15px 20px 5px' });\n"
			+"//or\n"
			+"app.round = '50%';\n"
			+"app.draw();\n\n"
			+"//or\n"
			+"app.canvas.style.backgroundColor='#00baff';\n"
			+"app.canvas.style.borderRadius='50% 0';\n\n"
			+'//get the apps rounding\n'
			+'var app_round = app.round;\n'
			+'var square_dash = square.dash;\n\n'
			+'//set dash\n'
			+"line.set('dash 40 10');\n"
			+"square.set('dash 40 10');\n"
			+'//or\n'
			+'line.set({ dash:[40,10] });\n'
			+'square.set({ dash:[40,10] });\n'
			+'//or\n'
			+'line.dash = [40,10];\n'
			+'square.dash = [40,10];\n'
			+'app.draw();</pre>\n'
			,'<p class="bottomp">setting a dash for <span class="green">app</span> requires direct css manipulation. Refer to <a href="http://www.w3schools.com/css/css_border.asp">w3schools</a> for the API</p>'
			,'<pre class="prettyprint linenums lang-js">//give the app a dashed outline\n'
			+"app.canvas.style.border='2px #00baff dashed';</pre>'"
		]
	},{
		t:'bezier',
		o:true,
		i:true,
		l:['bezier :: <span class="normal">Array</span> <span class="red">BETA ALERT: only works for lines right now</span>',
			"<p>a list of coordinates defining this objects bezier handles. One handle may be given for each vertex.</p>",
			'<p><span class="normal">[ x1,y1 , x2,y2 , ... ]</span></p>'
			,'<pre class="prettyprint linenums lang-js">//create a bezier curve\n'
			+"var bezierCurve = app.add('width-10:10 10:height-10 red 6 bezier 10 10 10 10');\n\n"
			+"//get an objects bezier handle positions\n"
			+"var bezierVs = bezierCurve.bezier\n\n"
			+'//set the objects bezier handle positions\n'
			+"bezierCurve.set('bezier 0 0 width height');\n"
			+'//or\n'
			+"bezierCurve.set({ bezier:[0,0,app.width,app.height] });\n"
			+'//or\n'
			+'bezierCurve.bezier = [0, 0, app.width, app.height];\n'
			+'app.draw();</pre>\n'
		]
	},{ t:'hidden',
		o:true,
		i:true,
		l:
		['hidden :: <span class="normal">boolean</span>'
			,'<p>a flag that hides this object from updates, collisions, and renders.</p>'
			,'<pre class="prettyprint linenums lang-js">//create a hidden object\n'
			+"var obj = app.add('center red 50 hidden');\n\n"
			+"//show the object\n"
			+"obj.set('hidden false');\n"
			+'//or\n'
			+"obj.set({ hidden:false });\n"
			+'//or\n'
			+"obj.hidden = false;\n"
			+"app.draw();</pre>\n"
		]
	},{ t:'rqAnimFrame',
		o:true,
		i:true,
		l:
		['rqAnimFrame :: <span class="normal">boolean</span>'
			,'<p>if <span class="green">true</span>, <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame">window.requestAnimationFrame</a> will be used for any 60fps loops</p>'
			,'<p>if <span class="red">false</span>, <a target="_blank" href="http://www.w3schools.com/jsref/met_win_settimeout.asp">setTimeout</a> will be used for all loops</p>'
			,'<pre class="prettyprint linenums lang-js">//create a hidden object\n'
			+"var obj = app.add('center red 50 hidden');\n\n"
			+'//get rqAnimFrame\n'
			+'var app_use_requestAnimationFrame = app.rqAnimFrame;\n'
			+'var obj_use_requestAnimationFrame = obj.rqAnimFrame;\n\n'
			+'//force app or obj to use setTimeout\n'
			+'app.rqAnimFrame = false;\n'
			+'obj.rqAnimFrame = false;</pre>'
		]
	}]
},{
	t:'Attachment',
	l:[{
		t:'objs',
		o:true,
		a:true,
		i:true,
		l:['objs :: <span class="normal">array</span>'
			,'<p>a list of objects attached to this object, ordered by z-index and order of attachment. All objects passed to <a href="#add">add</a> end up in this array.</p>'
			,'<pre class="prettyprint linenums lang-js">//add an object attached to an object\n'
			+'app.add("center 100 red add 50 blue");\n\n'
			+'//get the parent object\n'
			+'var parent = app.objs[0];\n\n'
			+'//get the child object\n'
			+'var child = parent.objs[0];\n\n'
			+'//remove the child object\n'
			+'parent.rmv(child);\n\n'
			+'//remove all objects\n'
			+'app.rmv();</pre>'
		]
	},{
		t:'img',
		o:true,
		a:true,
		i:true,
		l:['img :: <a href="http://www.w3schools.com/jsref/dom_obj_image.asp" target="_blank" class="normal">Image</a>'
			,'<p>an Image that is drawn with the object. If an image is given to an object upon creation, the image will be drawn when loaded and the object will be sized appropriately.</p>'
			,'<pre class="prettyprint linenums lang-js">//add an image from a url\n'
			+"var obj = app.add('center http://iioengine.com/img/ufo.png');\n\n"
			+'//add an image from a local file\n'
			+"app.add('center ufo.png');\n\n"
			+'//get the image\n'
			+'var img = obj.img;\n\n'
			+'//change the image\n'
			+"obj.img.src = 'http://iioengine.com/img/arrow.png';\n\n"
			+'//remove the image\n'
			+'//note that the image must be loaded for removing to take effect\n'
			+'obj.set({ img:null });\n'
			+'//or\n'
			+'obj.img = null;\n'
			+'app.draw();</pre>'
			,'<p class="bottomp">an image can also loaded before being attached to an object</p>',
			'<pre class="prettyprint linenums lang-js">//create an object once an image has loaded\n'
			+"var obj;\n"
			+"var img = app.load('http://iioengine.com/img/ufo.png', function(){\n"
			+"    obj = app.add( app.center, {img:img} );\n"
			+"}</pre>"
		]
	},{
		t:'anims',
		o:true,
		a:true,
		l:''
	},{
		t:'mov',
		o:true,
		a:true,
		l:''
	},{
		t:'flip',
		o:true,
		a:true,
		l:''
	},{
		t:'fit',
		o:true,
		a:true,
		l:''
	},{
		t:'sounds',
		o:true,
		a:true,
		l:''
	}]
},{
	t:'Action',
	l:[{
		t:'collision',
		o:true,
		l:''
	},{
		t:'bounds',
		o:true,
		l:''
	},{
		t:'fade',
		o:true,
		l:''
	},{
		t:'grow',
		o:true,
		l:''
	},{
		t:'shrink',
		o:true,
		l:''
	}]
},{
	t:'Text',
	l:[{
		t:'text',
		o:true,
		l:''
	},{
		t:'font',
		o:true,
		l:''
	},{
		t:'italic',
		o:true,
		l:''
	},{
		t:'bold',
		o:true,
		l:''
	},{
		t:'textWrap',
		o:true,
		l:''
	},{
		t:'lineHeight',
		o:true,
		l:''
	}]
},{
	t:'Grid',
	l:[{
		t:'cells',
		o:true,
		l:''
	},{
		t:'res',
		o:true,
		l:''
	},{
		t:'R',
		o:true,
		l:''
	},{
		t:'C',
		o:true,
		l:''
	}]
}
]);
createLi('Functions',[
{
	t:'General',
	l:[
	{
		t:'set',
		a:true,
		o:true,
		l:''
	}]
},{
	t:'Physical',
	l:[
	{
		t:'contains',
		a:true,
		o:true,
		l:''
	}]
},{
	t:'Display',
	l:[
	{
		t:'draw',
		a:true,
		o:true,
		l:''
	}
	,{
		t:'clear',
		a:true,
		o:true,
		l:''
	}]
},{
	t:'Action',
	l:[
	{
		t:'play',
		a:true,
		o:true,
		l:''
	},{
		t:'pause',
		a:true,
		o:true,
		l:''
	},{
		t:'loop',
		a:true,
		o:true,
		l:''
	},{
		t:'delay',
		a:true,
		o:true,
		l:''
	},{
		t:'fadeIn',
		o:true,
		l:''
	},{
		t:'fadeOut',
		o:true,
		l:''
	}]
},{
	t:'Input',
	l:[
	{
		t:'onInputDown',
		a:true,
		o:true,
		l:''
	},{
		t:'onInputMove',
		a:true,
		o:true,
		l:''
	},{
		t:'onInputUp',
		a:true,
		o:true,
		l:''
	},{
		t:'onKeyDown',
		a:true,
		l:''
	},{
		t:'onKeyUp',
		a:true,
		l:''
	},{
		t:'onResize',
		a:true,
		l:''
	}]
},{
	t:'Grid',
	l:[
	{
		t:'cellAt',
		o:true,
		l:''
	},{
		t:'cellCenter',
		o:true,
		l:''
	},{
		t:'resetCells',
		o:true,
		l:''
	}]
},{
	t:'Util',
	l:[
	{
		t:'loadImage',
		a:true,
		l:''
	},{
		t:'isNumber',
		a:true,
		l:''
	},{
		t:'isString',
		a:true,
		l:''
	},{
		t:'random',
		a:true,
		l:''
	},{
		t:'randomNum',
		a:true,
		l:''
	},{
		t:'randomInt',
		a:true,
		l:''
	},{
		t:'randomColor',
		a:true,
		l:''
	},{
		t:'invertColor',
		a:true,
		l:''
	},{
		t:'compare',
		a:true,
		l:''
	},{
		t:'pointsToVecs',
		a:true,
		l:''
	}]
}
]);