var ioImage = Class.create(ioObj, {
	initialize: function($super, src, pos, y, callback) {
	$super(pos, y);
	if (src instanceof Image) {
		this.img = src;
		this.width=size||this.img.width||0;
		this.height=h||size||this.img.height||0;
	}
	else{
		this.img = new Image();
		this.img.src = src;
		this.img.onload = function(){
			this.width=this.img.width||0;
			this.height=this.img.height||0;
			callback();
		}.bind(this);
	}
  },
  draw: function($super, ctx){
  	$super(ctx);
	if (typeof(this.img) != 'undefined'){
		if (this.drawPartialPixels)
			ctx.drawImage(this.img, -this.width/2, -this.height/2, this.img.width, this.img.height);
		else ctx.drawImage(this.img, Math.round(-this.width/2), Math.round(-this.height/2), Math.round(this.img.width), Math.round(this.img.height));
	}
	ctx.restore();
  }
});