iio.logs = [];

//LOG OBJECT
iio.Log = function(){ this.Log.apply(this, arguments) }
iio.Log.SUCCESS = 1;
iio.Log.FAILURE = 2;
iio.Log.WARNING = 3;
iio.Log.prototype.Log = function() {
	if(iio.is.string(arguments[0])){
		this.msg = arguments[0];
		this.type = arguments[1] || 0;
	} else for (var p in arguments[0]) this[p] = arguments[0][p];
}

iio.log = function(){
	iio.add_log(new iio.Log(arguments[0],arguments[1]));
}

iio.show_logs = function(){
	iio.logDiv = document.createElement('div');
	iio.logDiv.id = 'iio_log';
	iio.logDiv.style.position = 'fixed';
	iio.logDiv.style.bottom = '0';
	iio.logDiv.style.right = '0';
	document.body.appendChild(iio.logDiv);
	for(var i=0; i<iio.logs.length; i++)
		iio.add_log(iio.logs[i]);
}

iio.add_log = function(log){
	var p = document.createElement('p');
	p.innerHTML = log.msg;
	if(log.type == iio.Log.SUCCESS) p.style.color = 'green';
	if(log.type == iio.Log.FAILURE) p.style.color = 'red';
	if(log.type == iio.Log.WARNING) p.style.color = 'yellow';
	p.style.fontFamily = 'monospace';
	iio.logDiv.appendChild(p);
	iio.logs.push(log);
	return log;
}

//STACK TRACING
iio._start = iio.start;
iio.start = function(app, id, d){
	iio.log('START: '+app.name);
	return iio._start(app, id, d)
}

//constructors
iio.App.prototype._App = iio.App.prototype.App;
iio.App.prototype.App = function(view, app, s) {
	iio.log('enter CONSTRUCTOR: App');
	this._App(view, app, s);
	iio.log('- App.pos: '+this.pos.x+','+this.pos.y);
	iio.log('- App.width: '+this.width);
	iio.log('- App.height: '+this.height);
	iio.log('end CONSTRUCTOR: App');
}
iio.Obj.prototype._Obj = iio.Obj.prototype.Obj;
iio.Obj.prototype.Obj = function() {
	iio.log('enter CONSTRUCTOR: Obj');
	this._Obj(arguments[0]);
	if(this.pos) iio.log('- Obj.pos: '+this.pos.x+','+this.pos.y);
	if(this.color) iio.log('- Obj.color: '+this.color.toString());
	iio.log('end CONSTRUCTOR: Obj');
}
iio.Drawable.prototype._Drawable = iio.Drawable.prototype.Drawable;
iio.Drawable.prototype.Drawable = function() {
	iio.log('enter CONSTRUCTOR: Drawable');
	this._Drawable(arguments[0]);
	iio.log('end CONSTRUCTOR: Drawable');
}
iio.Line.prototype._Line = iio.Line.prototype.Line;
iio.Line.prototype.Line = function() {
	iio.log('enter CONSTRUCTOR: Line');
	this._Line(arguments[0]);
	if(this.vs) iio.log('- Line.vs: ['+this.vs[0].x+','+this.vs[0].y+'] ['+this.vs[1].x+','+this.vs[1].y+']');
	iio.log('end CONSTRUCTOR: Line');
}