var ioApps=[];
var ioFPSApps=[];
isiPad = navigator.userAgent.match(/iPad/i) != null;

function ioStart(app, id, w, h){
	if (typeof(app)=='undefined') throw new Error("ioStart: No application script provided | Docs: ioController -> ioStart");
	ioApps[ioApps.length]=new ioApp(app, id, w, h);
}
function ioRequestFramerate(app){
	ioFPSApps[ioFPSApps.length]=app;
	if(ioFPSApps.length==1){
		//Callback method by Erik Möller
		//https://gist.github.com/1579671
		var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = 
	          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 1000/app.fps - (currTime - lastTime));
				var dt = timeToCall/(1000/app.fps);
				dt=1;
	            var id = window.setTimeout(function() { callback(dt); },
	              1000/app.fps);//timeToCall);
				  if (timeToCall > 0) 
	            lastTime = currTime + timeToCall;
	            return id;
		}.bind(app);
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
        };		

		requestAnimationFrame(ioUpdateApps);
	}
}
function ioUpdateApps(dt){
	if (ioFPSApps[0].dBugger != undefined)
		ioFPSApps[0].dBugger.stats.begin();
	requestAnimationFrame( ioUpdateApps );
	for (var a=0; a<ioFPSApps.length; a++){
		ioFPSApps[a].step(dt)
		if (ioFPSApps[a].dBugger != undefined)
			ioFPSApps[a].dBugger.stats.end();
	}
}
function ioResizeApps(){
	//for (var a=0; a<ioApps.length; a++)
	//	ioApps[a].resize();
	lastTime = 0;
}