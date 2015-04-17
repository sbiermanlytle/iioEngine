var ioGroup = Class.create({
	initialize: function(tag, zIndex) {
		this.tag = tag;
		this.zIndex = zIndex;
		this.objs = [];
	},
	addObj: function(obj){
		this.objs[this.objs.length] = obj;
	},
	rmvObj: function(obj){
		for (var i=0; i<this.objs.length; i++)
			if (obj == this.objs[i]){
				this.objs.splice(i,1);
				return true;
				}
		return  false;
				
	},
	addCollisionCallback: function(tag, callback){
		if (typeof(this.collisionTags)=='undefined') this.collisionTags = [];
			this.collisionTags[this.collisionTags.length] = new ioCollisionTag(tag, callback);
	},
	update: function(dt){
		for (var i=this.objs.length-1; i>=0; i--)
			if(this.objs[i].update != null && !this.objs[i].update(dt))
				this.objs.splice(i,1);
	},
	draw: function(ctx){
		for (var i=0; i<this.objs.length; i++)
			this.objs[i].draw(ctx);
	}
});
var ioGrid = Class.create(ioObj, {
	initialize: function($super, pos, y, size, height, resolution){
		$super(pos, y);
		this.res = resolution;
		this.width = size;
		this.height = height;
		this.showBounds = true;
		this.thickness = 1;
		this.C = size;
		this.R = height;
		this.cells = new Array(this.C);
		for(var i=0; i<this.cells.length; i++)
			this.cells[i] = new Array(this.R);
		for(var c=0; c<this.cells[0].length; c++)
			for(var r=0; r<this.cells.length; r++)
				this.cells[r][c] = new Object();
	},
	resize: function(x, y, res){
		this.setSize(x,y);
		this.res = res;
		this.C = x;
		this.R = y;
	},
	draw: function(ctx){
		//draw grid lines
		ctx.lineWidth = this.thickness;
		ctx.strokeStyle = 'white';
		for (var r=1; r<this.R; r++){
			ctx.beginPath();
			ctx.moveTo(this.pos.x, this.pos.y+r*this.res);
			ctx.lineTo(this.pos.x+this.C*this.res, this.pos.y+r*this.res);
			ctx.stroke();
		}
		for (var c=1; c<this.C; c++){
			ctx.beginPath();
			ctx.moveTo(this.pos.x+c*this.res, this.pos.y);
			ctx.lineTo(this.pos.x+c*this.res, this.pos.y+this.R*this.res);
			ctx.stroke();
		}	
		return this;
	}, //new ioCircle(grid.pos.x+cI.x*grid.res+grid.res/2, grid.pos.y+cI.y*grid.res+grid.res/2, 100, false));
	getCellCenter: function(c,r, pixelPos){
		if (pixelPos||false) return getCellCenter(r/this.res,c/this.res)
		else return new ioVec(parseInt(this.pos.x+c*this.res+this.res/2, 10), parseInt(this.pos.y+r*this.res+this.res/2, 10));
	},
	getIndiciesOf: function(pos,y){
		return new ioVec(parseInt((pos.x-this.pos.x)/this.res, 10), parseInt((pos.y-this.pos.y)/this.res, 10));
	}
});