var ioApp = Class.create({
	/* CONSTRUCTORS
	 *	ioApp(app) //attaches full screen canvas to body
	 * 	ioApp(app, w, h) //attaches wxh canvas to body
	 * 	ioApp(app, canvasId) //assigns app to given canvas
	 *  ioApp(app, elementId, w, h) //attaches wxh canvas to elementId
	 */
	initialize: function(app, id, w, h) {
		this.cnvs = [];
		this.ctxs = [];
		if (typeof app=='undefined') throw new Error("ioApp.initialize: No app provided | Docs: ioApp -> Constructors");
		this.app = new app();
		if (typeof w=='undefined' && (typeof id == 'string' || id instanceof String))
			this.addCanvas(id);
		else {
			if (typeof id == 'string' || id instanceof String){
				w = w || window.innerWidth;
				h = h || window.innerHeight;
				if (!document.getElementById(id))
					throw new Error("ioApp.initialize: Invalid element id | Docs: ioApp -> Constructors");
			} else {
				h = w || window.innerHeight;
				w = id || window.innerWidth;
			}
			this.addCanvas(0, w, h, id);
		}
		this.canvas = this.cnvs[0];
		this.context = this.ctxs[0];
		this.app.init(this);
	},
	addEventListeners: function(i){
		this.cnvs[i].addEventListener('mousedown', function(event) {
			event.preventDefault();
			if(typeof this[0].app.mouseDown === 'function') 
				this[0].app.mouseDown(event, this[1]); 
			if(typeof this[0].app.inputDown === 'function') 
				this[0].app.inputDown(event, this[1]); 
		}.bind([this, i]), false);
		this.cnvs[i].addEventListener('touchstart', function(event) {
			event.preventDefault();
			if(typeof this[0].app.touchStart === 'function') 
				this[0].app.touchStart(event, this[1]); 
			if(typeof this[0].app.inputDown === 'function') 
				this[0].app.inputDown(event, this[1]); 
		}.bind([this, i]), false);
		this.cnvs[i].addEventListener('mousemove', function(event) { 
			event.preventDefault();
			if(typeof this[0].app.mouseMove === 'function') 
				this[0].app.mouseMove(event, this[1]); 
		}.bind([this, i]), false);
		this.cnvs[i].addEventListener('touchmove', function(event) {
			event.preventDefault();
			if(typeof this[0].app.touchMove === 'function') 
				this[0].app.touchMove(event, this[1]);
		}.bind([this, i]), false);
		this.cnvs[i].addEventListener('mouseup', function(event) {
			event.preventDefault();
			if(typeof this[0].app.mouseUp === 'function') 
				this[0].app.mouseUp(event, this[1]); 
		}.bind([this, i]), false);
		this.cnvs[i].addEventListener('touchend', function(event) {
			event.preventDefault();
			if(typeof this[0].app.touchEnd === 'function') 
				this[0].app.touchEnd(event, this[1]); 
		}.bind([this, i]), false);
		window.addEventListener('keydown', function(event) {
			event.preventDefault();
			if(typeof this[0].app.keyDown === 'function') 
				this[0].app.keyDown(event, this[1]); 
		}.bind([this, i]), false);
		window.addEventListener('keyup', function(event) {
			event.preventDefault();
			if(typeof this[0].app.keyUp === 'function') 
				this[0].app.keyUp(event, this[1]); 
		}.bind([this, i]), false);
	},
	addCanvas: function( zIndex, w, h, attachId, cssClasses ){
		var i=this.cnvs.length;
		if (typeof zIndex == 'string' || zIndex instanceof String){
			if (!document.getElementById(zIndex))
				throw new Error("ioAppManager.addCanvas: Invalid canvas id");
			this.cnvs[i]=document.getElementById(zIndex);
			this.ctxs[i] = this.cnvs[i].getContext('2d');
			if (typeof this.cnvs[i].getContext=='undefined') 
				throw new Error("ioAppManager.addCanvas: given id did not correspond to a canvas object");
			this.setCanvasProperties(i);
			this.addEventListeners(i);
			return i;
		}

		//Create the canvas
		this.cnvs[i]=document.createElement('canvas');
		this.cnvs[i].width = w || this.cnvs[0].width;
		this.cnvs[i].height = h || this.cnvs[0].height;
		this.cnvs[i].style.zIndex = zIndex || -i;
		
		//Attach the canvas
		if (typeof attachId == 'string' || attachId instanceof String)
			document.getElementById(id).appendChild(this.cnvs[i])
		else if (this.cnvs.length>1) {
			this.cnvs[i].style.position="absolute";
			var offset = this.getCanvasOffset();
			this.cnvs[i].style.left = offset.x+"px";
			this.cnvs[i].style.top = offset.y+"px";
			this.cnvs[i].style.margin = 0;
			this.cnvs[i].style.padding = 0;
			this.cnvs[0].parentNode.appendChild(this.cnvs[i]);
		} else document.body.appendChild(this.cnvs[i]);
		this.cnvs[i].className += " ioCanvas";
		
		if (attachId instanceof Array)
			for (var j=0;j<attachId.length;j++) 
				this.cnvs[i].className += " "+attachId[j];
		if (cssClasses instanceof Array)
			for (var j=0;j<cssClasses.length;j++) 
				this.cnvs[i].className += " "+cssClasses[j];
		else if (typeof cssClasses == 'string' || cssClasses instanceof String)
			this.cnvs[i].className += " "+cssClasses;

		if (this.cnvs[i].width==window.innerWidth && this.cnvs[i].height==window.innerHeight){
			this.cnvs[i].style.display = "block"; //remove scrollbars
			this.cnvs[i].style.position = "absolute";
			//TODO should set document styles back when game is terminated
			this.cnvs[i].style.top = document.body.style.margin = document.body.style.padding = "0";
		}
		this.ctxs[i] = this.cnvs[i].getContext('2d');
		this.setCanvasProperties(i);
		this.addEventListeners(i);
		return i;
	},
	setCanvasProperties: function(c){
		this.cnvs[c].center = new ioVec(this.cnvs[c].width/2, this.cnvs[c].height/2);
	},
	setFramerate: function( fps, c ){
		c=c||0;
		this.fps = fps;
		ioRequestFramerate(this);
	},
	setResizeCallback: function(callback){
		addEvent(window, 'resize', callback, false);
	},
	addObj: function(ioObj, zIndex, cnvId){
		cnvId = cnvId || 0;
		if (typeof(this.cnvs[cnvId].groups)=='undefined') this.cnvs[cnvId].groups = [];
		zIndex = zIndex || 0;
		for (var i=0; i<this.cnvs[cnvId].groups.length; i++)
			if (this.cnvs[cnvId].groups[i].zIndex == zIndex){
				this.cnvs[cnvId].groups[i].addObj(ioObj);
				return ioObj;
			}
		this.createGroup(zIndex, zIndex, cnvId);
		this.addToGroup(zIndex, ioObj, cnvId);
		return ioObj;
	},
	indexFromzIndexInsertSort: function(zIndex, array){
		var i = 0;
		while(i<array.length && array[i].zIndex < zIndex) i++;
		return i;
	},
	createGroup: function(tag, zIndex, cnvId){
		cnvId=cnvId||0;
		if (typeof(this.cnvs[cnvId].groups)=='undefined') this.cnvs[cnvId].groups = [];
		var z = zIndex || 0;
		this.cnvs[cnvId].groups.insert(this.indexFromzIndexInsertSort(z, this.cnvs[cnvId].groups), new ioGroup(tag, z));
	},
	addToGroup: function(tag, ioObj, zIndex, cnvId){
		cnvId=cnvId||0;
		if (typeof(this.cnvs[cnvId].groups)=='undefined'||!this.indexOfTag(tag, cnvId)) 
			this.createGroup(tag, zIndex, cnvId);
		this.cnvs[cnvId].groups[this.indexOfTag(tag, cnvId)].addObj(ioObj, cnvId);
		return ioObj;
	},
	indexOfTag: function(tag, cnvId){
		cnvId=cnvId||0;
		if (typeof(this.cnvs[cnvId].groups)!='undefined')
			for (var i=0; i<this.cnvs[cnvId].groups.length; i++)
				if (this.cnvs[cnvId].groups[i].tag == tag)
					return i;
		return false;
	},
	setCollisionCallback: function(tag1, tag2, callback, c){
		this.cnvs[c||0].groups[this.indexOfTag(tag1)].addCollisionCallback(tag2, callback);
	},
	destroy: function(obj){
		if (typeof(this.groups)=='undefined') return false;
		for (var i=0; i<this.groups.length; i++)
			if (this.groups[i].rmvObj(obj))
				return true;
		return false;
	},
	destroyAll: function(objs){
		for (var i=0; i<objs.length; i++) destory(ioObj);
	},
	destroyInGroup: function(obj, tag, c){
		if (this.cnvs[c||0].groups[this.indexOfTag(tag)].rmvObj(obj))
				return true;
		return false;
	},
	step: function(dt, cnvId){
		if (typeof(this.app.update)!='undefined')
			this.app.update();
		this.update(dt, cnvId);
		this.draw(cnvId);
	},
	update: function(dt, c){ 
		c=c||0;
		if (typeof(this.cnvs[c].groups) != 'undefined')
			for (var i=this.cnvs[c].groups.length-1; i>=0; i--){
				this.cnvs[c].groups[i].update(dt);
				if (typeof(this.cnvs[c].groups[i].collisionTags) != 'undefined')
				for (var j=0; j<this.cnvs[c].groups[i].collisionTags.length; j++)
					this.checkCollisions(this.cnvs[c].groups[i], this.cnvs[c].groups[this.indexOfTag(this.cnvs[c].groups[i].collisionTags[j].tag)], this.cnvs[c].groups[i].collisionTags[j].callback);
			}
	},
	checkCollisions: function(group1, group2, callback){
		for (var i=0; i<group1.objs.length; i++)
			for (var j=0; j<group2.objs.length; j++)
				if (typeof(group1.objs[i]) != 'undefined' && group1.objs[i].intersectsWith(group2.objs[j]))
					callback(group1.objs[i], group2.objs[j]);
	},
	draw: function(cnvId){
		cnvId=cnvId||0; 
		this.ctxs[cnvId].clearRect( 0, 0, this.cnvs[cnvId].width, this.cnvs[cnvId].height );
		//else this.context.fillStyle = this.context.createPattern(this.bgPattern, "repeat");
		for (var i=0; i<this.cnvs[cnvId].groups.length; i++){
			if (this.cnvs[cnvId].groups[i].tag == 'player')
				var b=33;
			this.cnvs[cnvId].groups[i].draw(this.ctxs[cnvId]);
		}
		if (typeof(this.dBugger) != 'undefined')
			this.dBugger.update();
	},
	addInputListeners: function(){
	},
	setBGColor: function(color, c){
		c=c||0;
		this.cnvs[c].style.backgroundColor=color;
		return this;
	},
	setBGPattern: function(src, c){
		c=c||0;
		this.cnvs[c].style.backgroundImage="url('"+src+"')";
		return this;
	},
	setBGImage: function(src, c){
		this.cnvs[c].style.backgroundRepeat="no-repeat";
		return setBGPattern(src, c);
	},
	getEventPosition: function(event){
		var pos;
		if (isiPad) {
			if (event.touches==null || event.touches.item(0)==null) return -1;
			else pos = new ioVec(event.touches.item(0).screenX, event.touches.item(0).screenY);
		} pos = new ioVec(event.clientX, event.clientY);
		pos.sub(this.getCanvasOffset(0));
		return pos;
	},
	getCanvasOffset: function(c){
		c=c||0;
		var node = this.cnvs[c]; 	
	    var curtop = 0;
	    var curtopscroll = 0;
	    if (node.offsetParent) {
	        do {
	            curtop += node.offsetTop;
	            curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
	        } while (node = node.offsetParent);
		}
		return new ioVec(this.cnvs[c].offsetLeft, curtop - curtopscroll);
	},
	drawOnLoad: function(){
		this[1].draw(this[0].ctxs[this[2]||0]);
	},
	runDebugger: function(){
		this.dBugger = new ioDebugger(this);
	}
});