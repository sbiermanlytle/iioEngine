//JavaScript Object Extensions
(function () {
   if ( !Array.prototype.forEach ) {
     Array.prototype.forEach = function(fn, scope) {
       for(var i = 0, len = this.length; i < len; ++i) {
         fn.call(scope, this[i], i, this);
       }
     }
   }
   if ( !Array.prototype.insert ) {
      Array.prototype.insert = function (index, item) {
         this.splice(index, 0, item);
      };
   }
})();

//iio Engine :: Definition of iio package
var iio = {};
(function (io) {
   function emptyFn() {};
   io.isiPad = navigator.userAgent.match(/iPad/i) != null;
   io.inherit = function(child, parent) {
      var tmp = child;
      emptyFn.prototype = parent.prototype;
      child.prototype = new emptyFn;
      child.prototype.constructor = tmp;
   };
   io.start = function(app,id,w,h){
      if (typeof app =='undefined') throw new Error("ioStart: No application script provided | Docs: ioController -> ioStart");
      if (typeof io.apps == 'undefined') io.apps = [];
      var ioAppManager = iio.ioAppManager;
      io.apps[io.apps.length]=new ioAppManager(app, id, w, h);
   }
   io.requestFramerate = function(app){
      if (typeof io.fpsApps == 'undefined')
         io.fpsApps = [];
      io.fpsApps[io.fpsApps.length]=app;
      if(io.fpsApps.length==1){
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
         requestAnimationFrame(iio.updateApps);
      }
   }
   io.updateApps = function(dt){
      //if (io.fpsApps[0].dBugger != undefined)
         //io.fpsApps[0].dBugger.stats.begin();
      requestAnimationFrame( iio.updateApps );
      for (var a=0; a<io.fpsApps.length; a++){
         io.fpsApps[a].step(dt)
        // if (io.fpsApps[a].dBugger != undefined)
          //  io.fpsApps[a].dBugger.stats.end();
      }
   }

   /* iio Functions
    */
   io.addEvent = function(obj,evt,fn,capt){  
      if(obj.addEventListener) {  
         obj.addEventListener(evt, fn, capt);  
         return true;  
      }  
      else if(obj.attachEvent) {  
         obj.attachEvent('on'+evt, fn);  
         return true;  
      }  
      else return false;  
   }
   io.getRandomNum = function(min, max) {
      return Math.random() * (max - min) + min;
   }
   io.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }
   io.keyCodeIs = function(key, event){
      switch(event.keyCode){
      case 8: if (key == 'backspace') return true; break;
      case 9: if (key == 'tab') return true; break;
      case 13: if (key == 'enter') return true; break;
      case 16: if (key == 'shift') return true; break;
      case 17: if (key == 'ctrl') return true; break;
      case 18: if (key == 'alt') return true; break;
      case 19: if (key == 'pause') return true; break;
      case 20: if (key == 'caps lock') return true; break;
      case 27: if (key == 'escape') return true; break;
      case 32: if (key == 'space') return true; break;
      case 33: if (key == 'page up') return true; break;
      case 34: if (key == 'page down') return true; break;
      case 35: if (key == 'end') return true; break;
      case 36: if (key == 'home') return true; break;
      case 37: if (key == 'left arrow') return true; break;
      case 38: if (key == 'up arrow') return true; break;
      case 39: if (key == 'right arrow') return true; break;
      case 40: if (key == 'down arrow') return true; break;
      case 45: if (key == 'insert') return true; break;
      case 46: if (key == 'delete') return true; break;
      case 48: if (key == '0') return true; break;
      case 49: if (key == '1') return true; break;
      case 50: if (key == '2') return true; break;
      case 51: if (key == '3') return true; break;
      case 52: if (key == '4') return true; break;
      case 53: if (key == '5') return true; break;
      case 54: if (key == '6') return true; break;
      case 55: if (key == '7') return true; break;
      case 56: if (key == '8') return true; break;
      case 57: if (key == '9') return true; break;
      case 65: if (key == 'a') return true; break;
      case 66: if (key == 'b') return true; break;
      case 67: if (key == 'c') return true; break;
      case 68: if (key == 'd') return true; break;
      case 69: if (key == 'e') return true; break;
      case 70: if (key == 'f') return true; break;
      case 71: if (key == 'g') return true; break;
      case 72: if (key == 'h') return true; break;
      case 73: if (key == 'i') return true; break;
      case 74: if (key == 'j') return true; break;
      case 75: if (key == 'k') return true; break;
      case 76: if (key == 'l') return true; break;
      case 77: if (key == 'm') return true; break;
      case 78: if (key == 'n') return true; break;
      case 79: if (key == 'o') return true; break;
      case 80: if (key == 'p') return true; break;
      case 81: if (key == 'q') return true; break;
      case 82: if (key == 'r') return true; break;
      case 83: if (key == 's') return true; break;
      case 84: if (key == 't') return true; break;
      case 85: if (key == 'u') return true; break;
      case 86: if (key == 'v') return true; break;
      case 87: if (key == 'w') return true; break;
      case 88: if (key == 'x') return true; break;
      case 89: if (key == 'y') return true; break;
      case 90: if (key == 'z') return true; break;
      case 91: if (key == 'left window') return true; break;
      case 92: if (key == 'right window') return true; break;
      case 93: if (key == 'select key') return true; break;
      case 96: if (key == 'n0') return true; break;
      case 97: if (key == 'n1') return true; break;
      case 98: if (key == 'n2') return true; break;
      case 99: if (key == 'n3') return true; break;
      case 100: if (key == 'n4') return true; break;
      case 101: if (key == 'n5') return true; break;
      case 102: if (key == 'n6') return true; break;
      case 103: if (key == 'n7') return true; break;
      case 104: if (key == 'n8') return true; break;
      case 105: if (key == 'n9') return true; break;
      case 106: if (key == 'multiply') return true; break;
      case 107: if (key == 'add') return true; break;
      case 109: if (key == 'subtract') return true; break;
      case 110: if (key == 'dec') return true; break;
      case 111: if (key == 'divide') return true; break;
      case 112: if (key == 'f1') return true; break;
      case 113: if (key == 'f2') return true; break;
      case 114: if (key == 'f3') return true; break;
      case 115: if (key == 'f4') return true; break;
      case 116: if (key == 'f5') return true; break;
      case 117: if (key == 'f6') return true; break;
      case 118: if (key == 'f7') return true; break;
      case 119: if (key == 'f8') return true; break;
      case 120: if (key == 'f9') return true; break;
      case 121: if (key == 'f10') return true; break;
      case 122: if (key == 'f11') return true; break;
      case 123: if (key == 'f12') return true; break;
      case 144: if (key == 'num lock') return true; break;
      case 156: if (key == 'scroll lock') return true; break;
      case 186: if (key == 'semi-colon') return true; break;
      case 187: if (key == 'equal') return true; break;
      case 188: if (key == 'comma') return true; break;
      case 189: if (key == 'dash') return true; break;
      case 190: if (key == 'period') return true; break;
      case 191: if (key == 'forward slash') return true; break;
      case 192: if (key == 'grave accent') return true; break;
      case 219: if (key == 'open bracket') return true; break;
      case 220: if (key == 'back slash') return true; break;
      case 221: if (key == 'close bracket') return true; break;
      case 222: if (key == 'single quote') return true; break;
      default: return false;
   }
   }
})(iio);

//ioVec
(function () {
   //Definition
   function ioVec(){
      this.ioVec.apply(this, arguments);
   }; iio.ioVec=ioVec;

   //Constructor
   ioVec.prototype.ioVec = function(v,y){
      if (v instanceof ioVec){
         this.x=v.x||0;
         this.y=v.y||0;
      } else {
         this.x=v||0;
         this.y=y||0;
      }
   }
   //Functions
   ioVec.prototype.clone = function(){
      return new ioVec(this.x,this.y);
   }
   ioVec.prototype.set = function (v,y){
      if (v instanceof ioVec){
         this.x=v.x;
         this.y=v.y;
      } else {
         this.x=v;
         this.y=y;
      } return this;
   }
   ioVec.prototype.length = function (){
      return Math.sqrt(this.x*this.x+this.y*this.y);
   }
   ioVec.prototype.add = function (v,y){
      if (v instanceof ioVec){
         this.x+=v.x;
         this.y+=v.y;
      } else {
         this.x+=v;
         this.y+=y;
      } return this;
   }
   ioVec.prototype.sub = function (v,y){
      if (v instanceof ioVec)
         this.add(-v.x,-v.y);
      else this.add(-v,-y);
      return this;
   }
   ioVec.prototype.mult = function (f){
      this.x*=f;
      this.y*=f;
      return this;
   }
   ioVec.prototype.div = function (d){
      this.x/=d;
      this.y/=d;
      return this;
   }
   ioVec.prototype.dot = function (v){
      this.x*=v.x;
      this.y*=v.y;
      return this;
   }
   ioVec.prototype.normalize = function (){
      this.div(this.length());
      return this;
   }
})();

//ioObj
(function () {
   //Includes
   var ioVec = iio.ioVec;

   //Definition
   function ioObj(){
      this.ioObj.apply(this, arguments);
   }; iio.ioObj=ioObj;

   //Constructor
   ioObj.prototype.ioObj = function(v,y){
      this.pos = new ioVec(v||0,y||0);
   }

   //Functions
   ioObj.prototype.clone = function(){
      return new ioObj(this.pos);
   }
   ioObj.prototype.draw = function(ctx){
      ctx.save();
      if (this.partialPixels) ctx.translate(this.pos.x, this.pos.y);
      else ctx.translate(Math.round(this.pos.x), Math.round(this.pos.y));
      if (typeof(this.rotation) != 'undefined') 
         ctx.rotate(this.rotation);
   }
   ioObj.prototype.clone = function(){
      return new ioObj(this.pos);
   }
   ioObj.prototype.translate = function(v,y){
      this.pos.add(v,y);
      return this;
   }
   ioObj.prototype.rotate = function(r){
      this.rotation = r;
      return this;
   }
   ioObj.prototype.drawPartialPixels = function(turnOn){
      turnOn=turnOn||true;
      if (turnOn) this.partialPixels = true;
      else this.partialPixels = false;
      return this;
   }
})();

//ioLine
(function () {
   //Includes
   var ioObj = iio.ioObj,
       ioVec = iio.ioVec;

   //Definition
   function ioLine(){
      this.ioLine.apply(this, arguments);
   }; iio.ioLine=ioLine;
   iio.inherit(ioLine, ioObj)

   /*Constructors
    * ioLine(startPos, endPos)
    * ioLine(x1,y1,x2,y2)
    * ioLine(startPos,x2,y2)
    * ioLine(x1,y1,endPos)
    */
   ioLine.prototype._super = ioObj.prototype;
   ioLine.prototype.ioLine = function(p1, p2, p3, p4){
      this._super.ioObj.call(this,p1,p2);
      if (p1 instanceof ioVec){
         if(p2 instanceof ioVec)
            this.endPos = new ioVec(p2);
         else this.endPos = new ioVec(p2,p3);
      } 
      else if (p3 instanceof ioVec)
         this.endPos = new ioVec(p3);
      else this.endPos = new ioVec(p3,p4)
   }

   //Functions
   ioLine.prototype.draw = function(ctx){
      ctx.lineWidth = this.lineWidth || 1;
      ctx.strokeStyle = this.color || 'white';
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(this.endPos.x, this.endPos.y);
      ctx.stroke();
   },
   ioLine.prototype.clone = function(){
      return new ioLine(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
   },
   ioLine.prototype.set = function( line, end, x2, y2){
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
   ioLine.prototype.setEndPos = function(v, y){
      if (typeof v === 'ioVec') this.endPos = v;
      else this.endPos = new ioVec(v||0,y||0);
   }
})();

//ioCircle
(function () {
   //Includes
   var ioObj = iio.ioObj;

   //Definition
   function ioCircle(){
      this.ioCircle.apply(this, arguments);
   }; iio.ioCircle=ioCircle;
   iio.inherit(ioCircle, ioObj)

   //Constructor
   ioCircle.prototype._super = ioObj.prototype;
   ioCircle.prototype.ioCircle = function(v, y, radius){
      this._super.ioObj.call(this,v,y);
      this.radius = radius;
   }

   //Functions
   ioCircle.prototype.draw = function(ctx){
      ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
   }
})();

//ioRect
(function () {
   //Includes
   var ioObj = iio.ioObj,
       ioVec = iio.ioVec;

   //Definition
   function ioRect(){
      this.ioRect.apply(this, arguments);
   }; iio.ioRect=ioRect;
   iio.inherit(ioRect, ioObj)

   /* CONTSTRUCTORS:
    * ioRect(pos, width, height)
    * ioRect(x, y, width, height)
    */
   ioRect.prototype._super = ioObj.prototype;
   ioRect.prototype.ioRect = function(v, y, width, height){
      this._super.ioObj.call(this,v,y);
      if(v instanceof ioVec){
         this.width=y||0;
         this.height=width||y||0;
      } else {
         this.width=width||0;
         this.height=height||width||0;
      }
   }

   //Functions
   ioRect.prototype.draw = function(ctx, noRestore){
      ioObj.prototype.draw.call(this,ctx);
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
   }
   ioRect.prototype.left = function(){ return this.pos.x-this.width/2; },
   ioRect.prototype.right = function(){ return this.pos.x+this.width/2; },
   ioRect.prototype.top = function(){ return this.pos.y-this.height/2; },
   ioRect.prototype.bottom = function(){ return this.pos.y+this.height/2; },
   ioRect.prototype.setSize = function(v,y){
      if(v instanceof ioVec){
         this.width=v.x;
         this.height=v.y;
      } else {
         this.width=v;
         this.height=y;
      }
   }
   ioRect.prototype.shrink = function(s){
      this.shrinking = s;
      return this;
   }
   ioRect.prototype.intersectsWith = function(obj){
      if (((obj.pos.x <= this.pos.x && obj.pos.x + obj.width >= this.pos.x) || (obj.pos.x >= this.pos.x && (obj.pos.x + obj.width <= this.pos.x + this.width || obj.pos.x <= this.pos.x+this.width))) &&
         ((obj.pos.y <= this.pos.y && obj.pos.y + obj.height >= this.pos.y) || (obj.pos.y >= this.pos.y && (obj.pos.y + obj.height <= this.pos.y + this.height || obj.pos.y <= this.pos.y+this.height))))
         return true;
      return false
   }
   ioRect.prototype.createWithImage = function(src, onLoadCallback){
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
   }
   ioRect.prototype.createWithAnim = function(srcs, i, onLoadCallback){
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
   ioRect.prototype.setImage = function(src, onLoadCallback){
      if (src instanceof Image)
         this.img=src;
      else {
         this.img = new Image();
         this.img.src = src;
         this.img.onload = onLoadCallback;
      } return this;
   }
   ioRect.prototype.addAnim = function(srcs){
      if (typeof this.anims == 'undefined') this.anims=[];
      var a = this.anims.length
      this.anims[a]=[];
      for (var j=0;j<srcs.length;j++){
         this.anims[a][j]=new Image();
         this.anims[a][j].src=srcs[j];
      } return this;
   }
})();

//ioBox
(function () {
   //Includes
   var ioRect = iio.ioRect,
       ioVec = iio.ioVec;

   //Definition
   function ioBox(){
      this.ioBox.apply(this, arguments);
   }; iio.ioBox=ioBox;
   iio.inherit(ioBox, ioRect);

   //Constructor
   ioBox.prototype._super = ioRect.prototype;
   ioBox.prototype.ioBox = function(v, y, w, h){
      this._super.ioRect.call(this,v,y,w,h);
   }

   ioBox.prototype.update = function(dt){
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
   }
   ioBox.prototype.setVel = function(v,y){
      if (v instanceof ioVec)
         this.vel = v;
      else if (typeof this.vel == 'undefined')
         this.vel = new ioVec(v,y)
      else this.vel.set(v,y);
      return this;
   }
   ioBox.prototype.setTorque = function(t){
      this.torque = t;
      if (typeof this.rotation == 'undefined')
         this.rotation=0;
      return this;
   }
   ioBox.prototype.setBounds = function(top, right, bottom, left, callback){
      this.bounds = new Object();
      this.bounds.top = top;
      this.bounds.right = right;
      this.bounds.bottom = bottom;
      this.bounds.left = left;
      return this;
   }

   //Functions
})();

//ioX
(function () {
   //Includes
   var ioObj = iio.ioObj;

   //Definition
   function ioX(){
      this.ioX.apply(this, arguments);
   }; iio.ioX=ioX;
   iio.inherit(ioX, ioObj)

   //Constructor
   ioX.prototype._super = ioObj.prototype;
   ioX.prototype.ioX = function(v, y, size){
      this._super.ioObj.call(this,v,y);
      this.size = size;
   }

   //Functions
   ioX.prototype.draw = function(ctx){
      ctx.lineWidth = this.lineWidth
      ctx.beginPath();
      ctx.moveTo(this.pos.x-this.size/2, this.pos.y-this.size/2);
      ctx.lineTo(this.pos.x+this.size/2, this.pos.y+this.size/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.pos.x+this.size/2, this.pos.y-this.size/2);
      ctx.lineTo(this.pos.x-this.size/2, this.pos.y+this.size/2);
      ctx.stroke();
   }
})();

//ioText
(function () {
   //Includes
   var ioObj = iio.ioObj;

   //Definition
   function ioText(){
      this.ioText.apply(this, arguments);
   }; iio.ioText=ioText;
   iio.inherit(ioText, ioObj)

   //Constructor
   ioText.prototype._super = ioObj.prototype;
   ioText.prototype.ioText = function(text, font, color, v, y){
      this._super.ioObj.call(this,v,y);
      this.text = text;
      this.font = font;
      this.color = color;
   }

   //Functions
   ioText.prototype.draw = function(ctx){
      this._super.draw.call(this,ctx);
      ctx.font = this.font;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.pos.x, this.pos.y);
      ctx.restore();
   },
   ioText.prototype.setText = function(text){
      this.text = text;
   }
})();

//ioGrid
(function () {
   //Includes
   var ioVec = iio.ioVec,
       ioObj = iio.ioObj;

   //Definition
   function ioGrid(){
      this.ioGrid.apply(this, arguments);
   }; iio.ioGrid=ioGrid;
   iio.inherit(ioGrid, ioObj);

   //Constructor
   ioGrid.prototype._super = ioObj.prototype;
   ioGrid.prototype.ioGrid = function(v, y, size, height, resolution){
      this._super.ioObj.call(this,v,y);
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
   }

   //Functions
   ioGrid.prototype.resize = function(x, y, res){
      this.setSize(x,y);
      this.res = res;
      this.C = x;
      this.R = y;
   }
   ioGrid.prototype.draw = function(ctx){
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
   } //new ioCircle(grid.pos.x+cI.x*grid.res+grid.res/2, grid.pos.y+cI.y*grid.res+grid.res/2, 100, false));
   ioGrid.prototype.getCellCenter = function(c,r, pixelPos){
      if (pixelPos||false) return getCellCenter(r/this.res,c/this.res)
      else return new ioVec(parseInt(this.pos.x+c*this.res+this.res/2, 10), parseInt(this.pos.y+r*this.res+this.res/2, 10));
   }
   ioGrid.prototype.getIndiciesOf = function(pos,y){
      return new ioVec(parseInt((pos.x-this.pos.x)/this.res, 10), parseInt((pos.y-this.pos.y)/this.res, 10));
   }
})();

//ioCollisionTag
(function () {
   //Definition
   function ioCollisionTag(){
      this.ioCollisionTag.apply(this, arguments);
   }; iio.ioCollisionTag=ioCollisionTag;

   //Constructor
   ioCollisionTag.prototype.ioCollisionTag = function(tag, callback){
      this.tag = tag;
      this.callback = callback;
   }
})();

//ioGroup
(function () {
   //Includes
   var ioVec = iio.ioVec,
       ioObj = iio.ioObj,
       ioCollisionTag = iio.ioCollisionTag;

   //Definition
   function ioGroup(){
      this.ioGroup.apply(this, arguments);
   }; iio.ioGroup=ioGroup;

   //Constructor
   ioGroup.prototype.ioGroup = function(tag, zIndex) {
      this.tag = tag;
      this.zIndex = zIndex;
      this.objs = [];
   }

   //Functions
   ioGroup.prototype.addObj = function(obj){
      this.objs[this.objs.length] = obj;
   }
   ioGroup.prototype.rmvObj = function(obj){
      for (var i=0; i<this.objs.length; i++)
         if (obj == this.objs[i]){
            this.objs.splice(i,1);
            return true;
            }
      return  false;
            
   }
   ioGroup.prototype.addCollisionCallback = function(tag, callback){
      if (typeof(this.collisionTags)=='undefined') this.collisionTags = [];
         this.collisionTags[this.collisionTags.length] = new ioCollisionTag(tag, callback);
   }
   ioGroup.prototype.update = function(dt){
      for (var i=this.objs.length-1; i>=0; i--)
         if(this.objs[i].update != null && !this.objs[i].update(dt))
            this.objs.splice(i,1);
   }
   ioGroup.prototype.draw = function(ctx){
      for (var i=0; i<this.objs.length; i++)
         this.objs[i].draw(ctx);
   }
})();

//ioAppManager
(function () {
   //Includes
   var ioVec = iio.ioVec,
       ioGroup = iio.ioGroup,
       ioCollisionTag = iio.ioCollisionTag;

   //Definition
   function ioAppManager(){
      this.ioAppManager.apply(this, arguments);
   }; iio.ioAppManager=ioAppManager;

   /* CONSTRUCTORS
    * ioApp(app) //attaches full screen canvas to body
    * ioApp(app, w, h) //attaches wxh canvas to body
    * ioApp(app, canvasId) //assigns app to given canvas
    * ioApp(app, elementId, w, h) //attaches wxh canvas to elementId
    */
   ioAppManager.prototype.ioAppManager = function(app, id, w, h){
      this.cnvs = [];
      this.ctxs = [];
      if (typeof app=='undefined') throw new Error("ioApp.initialize: No app provided | Docs: ioApp -> Constructors");
      this.app = new app(iio);
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
   }

   /* APP CONTROL FUNCTIONS
    */
    ioAppManager.prototype.setFramerate = function( fps, c ){
      c=c||0;
      this.fps = fps;
      iio.requestFramerate(this);
   },
   ioAppManager.prototype.setResizeCallback = function(callback){
      addEvent(window, 'resize', callback, false);
   },

   /* CANVAS CONTROL FUNCTIONS
    */
    ioAppManager.prototype.draw = function(c){
      c=c||0; 
      this.ctxs[c].clearRect( 0, 0, this.cnvs[c].width, this.cnvs[c].height );
      //else this.context.fillStyle = this.context.createPattern(this.bgPattern, "repeat");
      for (var i=0; i<this.cnvs[c].groups.length; i++)
         this.cnvs[c].groups[i].draw(this.ctxs[c]);
      if (typeof(this.dBugger) != 'undefined')
         this.dBugger.update();
   }
   ioAppManager.prototype.addCanvas = function( zIndex, w, h, attachId, cssClasses ){
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
   }
   ioAppManager.prototype.setCanvasProperties = function(c){
      this.cnvs[c].center = new ioVec(this.cnvs[c].width/2, this.cnvs[c].height/2);
   }
   ioAppManager.prototype.addEventListeners = function(i){
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
         if(!iio.keyCodeIs('f12', event)) event.preventDefault();
         if(typeof this[0].app.keyDown === 'function') 
            this[0].app.keyDown(event, this[1]); 
      }.bind([this, i]), false);
      window.addEventListener('keyup', function(event) {
         event.preventDefault();
         if(typeof this[0].app.keyUp === 'function') 
            this[0].app.keyUp(event, this[1]); 
      }.bind([this, i]), false);
   }

   /* GROUP CONTROL FUNCTIONS
    */
   ioAppManager.prototype.createGroup = function(tag, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined') this.cnvs[c].groups = [];
      var z = zIndex || 0;
      this.cnvs[c].groups.insert(this.indexFromzIndexInsertSort(z, this.cnvs[c].groups), new ioGroup(tag, z));
   }
   ioAppManager.prototype.addToGroup = function(tag, ioObj, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined'||!this.indexOfTag(tag, c)) 
         this.createGroup(tag, zIndex, c);
      this.cnvs[c].groups[this.indexOfTag(tag, c)].addObj(ioObj, c);
      return ioObj;
   }
   ioAppManager.prototype.addObj = function(ioObj, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined') this.cnvs[c].groups = [];
      zIndex = zIndex || 0;
      for (var i=0; i<this.cnvs[c].groups.length; i++)
         if (this.cnvs[c].groups[i].zIndex == zIndex){
            this.cnvs[c].groups[i].addObj(ioObj);
            return ioObj;
         }
      this.createGroup(zIndex, zIndex, c);
      this.addToGroup(zIndex, ioObj, c);
      return ioObj;
   }
   ioAppManager.prototype.indexFromzIndexInsertSort = function(zIndex, array){
      var i = 0;
      while(i<array.length && array[i].zIndex < zIndex) i++;
      return i;
   }
   ioAppManager.prototype.indexOfTag = function(tag, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)!='undefined')
         for (var i=0; i<this.cnvs[c].groups.length; i++)
            if (this.cnvs[c].groups[i].tag == tag)
               return i;
      return false;
   }
   ioAppManager.prototype.setCollisionCallback = function(tag1, tag2, callback, c){
      this.cnvs[c||0].groups[this.indexOfTag(tag1)].addCollisionCallback(tag2, callback);
   },
   ioAppManager.prototype.destroy = function(obj){
      if (typeof(this.groups)=='undefined') return false;
      for (var i=0; i<this.groups.length; i++)
         if (this.groups[i].rmvObj(obj))
            return true;
      return false;
   },
   ioAppManager.prototype.destroyAll = function(objs){
      for (var i=0; i<objs.length; i++) destory(ioObj);
   },
   ioAppManager.prototype.destroyInGroup = function(obj, tag, c){
      if (this.cnvs[c||0].groups[this.indexOfTag(tag)].rmvObj(obj))
            return true;
      return false;
   },
   ioAppManager.prototype.step = function(dt, cnvId){
      if (typeof(this.app.update)!='undefined')
         this.app.update();
      this.update(dt, cnvId);
      this.draw(cnvId);
   },
   ioAppManager.prototype.update = function(dt, c){ 
      c=c||0;
      if (typeof(this.cnvs[c].groups) != 'undefined')
         for (var i=this.cnvs[c].groups.length-1; i>=0; i--){
            this.cnvs[c].groups[i].update(dt);
            if (typeof(this.cnvs[c].groups[i].collisionTags) != 'undefined')
            for (var j=0; j<this.cnvs[c].groups[i].collisionTags.length; j++)
               this.checkCollisions(this.cnvs[c].groups[i], this.cnvs[c].groups[this.indexOfTag(this.cnvs[c].groups[i].collisionTags[j].tag)], this.cnvs[c].groups[i].collisionTags[j].callback);
         }
   },
   ioAppManager.prototype.checkCollisions = function(group1, group2, callback){
      for (var i=0; i<group1.objs.length; i++)
         for (var j=0; j<group2.objs.length; j++)
            if (typeof(group1.objs[i]) != 'undefined' && group1.objs[i].intersectsWith(group2.objs[j]))
               callback(group1.objs[i], group2.objs[j]);
   },
    ioAppManager.prototype.setBGColor = function(color, c){
      c=c||0;
      this.cnvs[c].style.backgroundColor=color;
      return this;
   },
    ioAppManager.prototype.setBGPattern = function(src, c){
      c=c||0;
      this.cnvs[c].style.backgroundImage="url('"+src+"')";
      return this;
   },
    ioAppManager.prototype.setBGImage = function(src, c){
      this.cnvs[c].style.backgroundRepeat="no-repeat";
      return setBGPattern(src, c);
   },

   ioAppManager.prototype.getEventPosition = function(event){
      var pos;
      if (iio.isiPad) {
         if (event.touches==null || event.touches.item(0)==null) return -1;
         else pos = new ioVec(event.touches.item(0).screenX, event.touches.item(0).screenY);
      } pos = new ioVec(event.clientX, event.clientY);
      pos.sub(this.getCanvasOffset(0));
      return pos;
   },
   ioAppManager.prototype.getCanvasOffset = function(c){
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
   ioAppManager.prototype.drawOnLoad = function(){
      this[1].draw(this[0].ctxs[this[2]||0]);
   }
})();
