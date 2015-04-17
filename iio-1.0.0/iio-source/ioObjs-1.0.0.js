var ioPhysics = {
	update: function(dt){
		if (typeof this.vel != 'undefined') this.translate(new ioVec(this.vel.x, this.vel.y));
		if (typeof this.torque != 'undefined') 
			this.rotation+=this.torque;
		if (this.bounds != null && ((this.bounds.top != null && this.pos.y < this.bounds.top) || (this.bounds.right != null && this.pos.x > this.bounds.right) || (this.bounds.bottom != null && this.pos.y > this.bounds.bottom) || (this.bounds.left != null && this.pos.x < this.bounds.left)))
			return false;
		if (this.shrinking > 0)
			this.setSize(this.width*(1-this.shrinking), this.height*(1-this.shrinking));
		if (this.width > 0 && this.width < .1)
			return false;
		return true;
	},
	setVel: function(v,y){
		if (v instanceof ioVec)
			this.vel = v;
		else if (typeof this.vel == 'undefined')
			this.vel = new ioVec(v,y)
		else this.vel.set(v,y);
		return this;
	},
	setTorque: function(t){
		this.torque = t;
		if (typeof this.rotation == 'undefined')
			this.rotation=0;
		return this;
	},
	setBounds: function(top, right, bottom, left, callback){
		this.bounds = new Object();
		this.bounds.top = top;
		this.bounds.right = right;
		this.bounds.bottom = bottom;
		this.bounds.left = left;
		return this;
	}
};
var ioVec = Class.create({
	initialize: function(x,y) {
		this.x=x||0;
		this.y=y||0;
	},
	clone: function(){
		return new ioVec(this.x, this.y);
	},
	set: function(x, y){
		this.x=x;
		this.y=y;
	},
	add: function(v, y){
		if (typeof(y) == 'undefined'){
			this.x+= v.x;
			this.y+= v.y; }
		else {
			this.x+= v;
			this.y+= y; }
	},
	sub: function(v, y){
		if (typeof(y) == 'undefined'){
			this.x-= v.x;
			this.y-= v.y; }
		else {
			this.x-= v;
			this.y-= y; }
	},
	mult: function(d){
		this.x*=d;
		this.y*=d;
	}
});
var ioObj = Class.create({
	initialize: function(pos,y){
		if (pos instanceof ioVec)
			this.pos = pos;
		else this.pos = new ioVec(pos||0,y||0);
	},
	/* GHOST PROPERTIES
	 *	(user must instantiate them)
	 *	
	 *	rotation
	 * 	strokeStyle
	 *	fillStyle
	 * 	lineWidth
	 * 	drawPartialPixels
	 */
	draw: function(ctx, noRestore){
		ctx.save();
		if (this.drawPartialPixels) ctx.translate(this.pos.x, this.pos.y);
		else ctx.translate(Math.round(this.pos.x), Math.round(this.pos.y));
		if (typeof(this.rotation) != 'undefined') 
			ctx.rotate(this.rotation);
		if (typeof noRestore == 'undefined') ctx.restore();
	},
	setPos: function(v,y){
		if(typeof(y) == 'undefined')
			this.pos = v;
		else {
			this.pos.x = v||0;
			this.pos.y = y||0;
		}
	},
	clone: function(){
		return new ioObj(this.pos.clone());
	},
	translate: function(v,y){
		this.pos.add(v,y);
	},
	setRotation: function(r){
		this.rotation = r;
		return this;
	},
	setStrokeStyle: function(s){
		this.strokeStyle=s;
		return this;
	},
	setFillStyle: function(s){
		this.fillStyle=s;
		return this;
	},
	setLineWidth: function(w){
		this.lineWidth=w;
		return this;
	},
	drawPartialPixels: function(turnOff){
		turnOff=turnOff||false;
		if (turnOff) this.drawPartialPixels = false;
		else this.drawPartialPixels = true;
		return this;
	}
});
var ioLine = Class.create(ioObj, {
	initialize: function($super, pos, y, endpoint, endY, color, lineWidth){
		if (typeof pos == 'string' || pos instanceof String || pos == null){
			$super();
			this.endPos = new ioVec();
			this.color = pos || 'white';
			this.lineWidth = y || 1;
			return;
		} else $super(pos, y);
		if (pos instanceof ioVec) {
			this.endPos = y;
			this.color = endpoint || 'white';
			this.lineWidth = endY || 1;
		} else {
			this.endPos = new ioVec(endpoint||0,endY||0);
			this.color = color || 'white';
			this.lineWidth = lineWidth || 1;
		}
	},
	draw: function(ctx){
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(this.endPos.x, this.endPos.y);
		ctx.stroke();
	},
	clone: function(){
		return new ioLine(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
	},
	set: function( line, end, x2, y2){
		if (typeof line === 'ioLine') {
			this.pos.x = line.pos.x;
			this.pos.y = line.pos.y;
			this.endPos.x = line.endPos.x;
			this.endPos.y = line.endPos.y;
		} else if (typeof line === 'ioVec'){
			this.pos.x = line.x;
			this.pos.y = line.y;
			this.endPos.x = end.x;
			this.endPos.y = end.y;
		} else {
			this.pos.x = line;
			this.pos.y = end;
			this.endPos.x = x2;
			this.enPos.y = y2;
		} 
	},
	setEndPos: function(v, y){
		if (typeof v === 'ioVec') this.endPos = v;
		else this.endPos = new ioVec(v||0,y||0);
	}
});
var ioX = Class.create(ioLine, {
	initialize: function($super, pos, y, size, height){
		$super(pos-size, y-height, pos+size, y+height);
	}, 
	draw: function(ctx){
		ctx.lineWidth = this.lineWidth
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(this.endPos.x, this.endPos.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.endPos.y);
		ctx.lineTo(this.endPos.x, this.pos.y);
		ctx.stroke();
	}
});
var ioShape = Class.create(ioObj, {
	setImage: function(src, onLoadCallback){
		if (src instanceof Image)
			this.img=src;
		else {
			this.img = new Image();
			this.img.src = src;
			this.img.onload = onLoadCallback;
		} return this;
	},
	addAnim: function(srcs){
		if (typeof this.anims == 'undefined') this.anims=[];
		var a = this.anims.length
		this.anims[a]=[];
		for (var j=0;j<srcs.length;j++){
			this.anims[a][j]=new Image();
			this.anims[a][j].src=srcs[j];
		} return this;
	}
});
var ioRect = Class.create(ioShape, {
	/* CONTSTRUCTORS:
	 *	ioRect(pos, width, height)
	 *	ioRect(x, y, width, height)
	 *
	 *	iio.addObj(new ioRect(iio.canvas.center, 50)).setFillColor('red').draw(iio.context);
	 *	iio.addObj(new ioRect(iio.canvas.center, 50)).setImg('img.png', function(){}).draw(iio.context);	
	 */
	initialize: function($super, pos, y, width, height){
		if(pos instanceof ioVec){
			$super(pos);
			this.width=y||0;
			this.height=width||y||0;
		} else if (typeof pos == 'string' || pos instanceof String){
			$super(pos, y, width);
			this.width=0;
			this.height=0;
		} else {
			$super(new ioVec(pos,y));
			this.width=width||0;
			this.height=height||width||0;
		}
	},
	draw: function($super, ctx, noRestore){
		$super(ctx, true);
		if (typeof(this.img) != 'undefined'){
			if (this.drawPartialPixels)
				ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
			else ctx.drawImage(this.img, Math.round(-this.width/2), Math.round(-this.height/2), Math.round(this.width), Math.round(this.height));
		}
		if (typeof this.anims != 'undefined'){
			if (this.drawPartialPixels)
				ctx.drawImage(this.anims[this.animKey][this.animIndex], -this.width/2, -this.height/2, this.width, this.height);
			else ctx.drawImage(this.anims[this.animKey][this.animIndex], Math.round(-this.width/2), Math.round(-this.height/2), Math.round(this.width), Math.round(this.height));
		}
		if (typeof this.fillStyle == 'string' || this.fillStyle instanceof String){
			ctx.fillStyle=this.fillStyle;
			if (this.drawPartialPixels) ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
			else ctx.fillRect(Math.round(-this.width/2),Math.round(-this.height/2),Math.round(this.width),Math.round(this.height));
		}
		if (typeof this.strokeStyle == 'string' || this.strokeStyle instanceof String){
			if (typeof this.lineWidth !='undefined')
				ctx.setLineWidth(this.lineWidth);
			else ctx.setLineWidth(1);
			ctx.strokeStyle=this.strokeStyle;
			if (this.drawPartialPixels) ctx.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
			else ctx.strokeRect(Math.round(-this.width/2),Math.round(-this.height/2),Math.round(this.width),Math.round(this.height));
		}
		if (typeof noRestore == 'undefined') ctx.restore();
	},
	left: function(){ return this.pos.x-this.width/2; },
    right: function(){ return this.pos.x+this.width/2; },
    top: function(){ return this.pos.y-this.height/2; },
    bottom: function(){ return this.pos.y+this.height/2; },
    setSize: function(v,y){
    	if(v instanceof ioVec){
    		this.width=v.x;
    		this.height=v.y;
    	} else {
    		this.width=v;
    		this.height=y;
    	}
    },
    shrink: function(s){
		this.shrinking = s;
		return this;
    },
    intersectsWith: function(obj){
		if (((obj.pos.x <= this.pos.x && obj.pos.x + obj.width >= this.pos.x) || (obj.pos.x >= this.pos.x && (obj.pos.x + obj.width <= this.pos.x + this.width || obj.pos.x <= this.pos.x+this.width))) &&
			((obj.pos.y <= this.pos.y && obj.pos.y + obj.height >= this.pos.y) || (obj.pos.y >= this.pos.y && (obj.pos.y + obj.height <= this.pos.y + this.height || obj.pos.y <= this.pos.y+this.height))))
			return true;
		return false
	  },
    createWithImage: function(src, onLoadCallback){
		if (src instanceof Image){
			this.img = src;
			this.width = src.width;
			this.height = src.height;
		} else {
			this.img = new Image();
			this.img.src = src;
			this.img.onload = function(){
				this.width=this.img.width||0;
				this.height=this.img.height||0;
				if (typeof onLoadCallback != 'undefined')
					onLoadCallback();
			}.bind(this);
		} return this;
	},
	createWithAnim: function(srcs, i, onLoadCallback){
		if (srcs[0] instanceof Image){
			this.addAnim(srcs);
			this.img = src;
			this.width = src.width;
			this.height = src.height;
		} else {
			this.addAnim(srcs);
			this.animKey=0;
			this.animIndex=i;
			this.anims[0][i].onload = function(){
				this.width=this.anims[0][i].width||0;
				this.height=this.anims[0][i].height||0;
				if (typeof onLoadCallback != 'undefined')
					onLoadCallback();
			}.bind(this);
		} return this;
	}
});
var ioCircle = Class.create(ioObj, {
	initialize: function($super, pos, y, radius, filled, color){
		$super(pos, y);
		this.radius = radius;
		this.filled = filled;
		this.color = color;
	}, 
	draw: function(ctx){
		ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
	}
});
var ioBox = Class.create(ioRect, ioPhysics, {});
var ioCollisionTag = Class.create({
	initialize: function(tag, callback){
		this.tag = tag;
		this.callback = callback;
	}
});
var ioText = Class.create(ioObj, {
	initialize: function($super, text, font, color, pos, y){
		$super(pos, y);
		this.text = text;
		this.font = font;
		this.color = color;
	},
	draw: function($super, ctx){
		$super(ctx, true);
		ctx.font = this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.pos.x, this.pos.y);
	},
	setText: function(text){
		this.text = text;
	}
});