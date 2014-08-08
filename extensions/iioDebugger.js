iio.App.prototype.debug=function(p){
	this.db=new iio.Debugger(this);
	if(p) this.db.set(p);
	return this.db;
}
iio.App.prototype.log=function(msg){
	this.db.log(msg);
	return this.db;
}

function Debugger(){
  this.Debugger.apply(this, arguments);
}; iio.Debugger=Debugger;

Debugger.prototype.Debugger=function(app){
	this.app=app;
	this.app.__update=this.app._update;
	this.app._update=function(dt){
		if(this.__update){
			this.__update(dt);
			if(this.objs&&document.getElementById('objs'))
				document.getElementById('objs').innerHTML=this.objs.length;
		}
	}
	this.div=document.createElement('div');
	this.div.style.position='absolute';
	this.div.style.top=0;
	this.div.style.padding='10px';
	this.div.style.color='white';
	this.div.style.maxHeight='300px';
	this.div.style.overflowY='auto';
	var p=document.createElement('p');
	//p.innerHTML='objs: <span id="objs">0</span>';
	p.style.padding=0;
	p.style.margin=0;
	this.div.appendChild(p);
	document.body.appendChild(this.div);
}
Debugger.prototype.log=function(msg,s){
	var p=document.createElement('p');
	p.innerHTML=msg;
	p.style.margin=0;
	p.style.padding=0;
	if(s) for(var prop in s) p.style[prop]=s[prop];
	this.div.appendChild(p);
	return this;
}
Debugger.prototype.set=function(p){
	for(var prop in p) this.div.style[prop]=p[prop];
}