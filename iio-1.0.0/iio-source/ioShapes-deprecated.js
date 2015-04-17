var Physics = {
	update: function($super, dt){
		if (typeof(this.drawables) != 'undefined')
			for (var i=0;i<this.drawables.length;i++)
				if (typeof(this.drawables[i].update) != 'undefined')
					if(!this.drawables[i].update())
						return false;
		this.move(new ioVec(this.vel.x*dt, this.vel.y*dt));
		if (typeof(this.torque) != 'undefined') this.rotation+=this.torque;
		if (this.bounds != null && ((this.bounds.top != null && this.pos.y < this.bounds.top) || (this.bounds.right != null && this.pos.x > this.bounds.right) || (this.bounds.bottom != null && this.pos.y > this.bounds.bottom) || (this.bounds.left != null && this.pos.x < this.bounds.left)))
			return false;
		return true;
	},
	draw: function($super, ctx){
		if (typeof(this.drawables) != 'undefined'){
			ctx.save();
			ctx.translate(this.pos.x, this.pos.y);
			if (typeof(this.rotation) != 'undefined') 
				ctx.rotate(this.rotation);
			for (var i=0; i<this.drawables.length; i++)
				this.drawables[i].draw(ctx, this.pos);
			ctx.restore();
		}
		if (this.drawBox){
			//draw outside border
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(this.left(), this.top(), this.width, this.height);
		}
		$super(ctx);
	},
	setVel: function(x,y){
		this.vel.x = x;
		this.vel.y = y;
		return this;
	  },
  	setTorque: function(t){
		this.torque = t;
		if (typeof(this.rotation)=='undefined') 
			this.rotation = 0;
		return this;
  	},
  	setBounds: function(top, right, bottom, left){
		this.bounds = new Object();
		this.bounds.top = top;
		this.bounds.right = right;
		this.bounds.bottom = bottom;
		this.bounds.left = left;
		return this;
  	}
}
var ioShape = Class.create(ioObj, {
	initialize: function($super, pos, y, vel, velY){
		$super(pos, y);
		if (typeof(velY) == 'undefined')
			this.vel = vel || new ioVec();
		else this.vel = new ioVec(vel,velY);
	},
});