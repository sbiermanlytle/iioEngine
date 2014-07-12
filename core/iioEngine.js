/*
The iio Engine
Version 1.2.2+
Last Update 11/23/2013

PARAMETER CHANGE NOTICE:
- setAnim(key,fn,frame,ctx)
   fn can be a function or an array [fn,fnParams]
   setAnim(key,frame,ctx) still works
   setAnim(key,ctx) still works
-the io.rmvFromGroup function now has the parameters (tag, obj, canvasIndex)
   if you only specify a tag, all the objects from that group will be removed
-the io.setBGImage function now has the parameters (src, scaleToFullScreen, canvasIndex)

The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2013, Sebastian Bierman-Lytle
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
//JavaScript Extensions
(function () {
   if ( !Array.prototype.forEach ) {
      Array.prototype.forEach = function(fn){
         var keepGoing=true;
         for (var c=0;c<this.length;c++)
            for(var r=0;r<this[c].length;r++){
               keepGoing=fn(this[c][r],c,r);
               if (typeof keepGoing!='undefined'&&!keepGoing)
                  return [r,c];
            }
      }
     /*Array.prototype.forEach = function(fn, scope) {
       for(var i = 0, len = this.length; i < len; ++i) {
         fn.call(scope, this[i], i, this);
       }
     }*/
   }
   if ( !Array.prototype.insert ) {
      Array.prototype.insert = function (index, item) {
         this.splice(index, 0, item);
      };
   }
   if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
   };   
   //Method by Rod MacDougall
   //stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
   var CP=window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
   if(CP.lineTo) CP.dashedLine = CP.dashedLine||function(x,y,x2,y2,da){
      if(!da)da=[10,5];
      this.save();
      var dx=(x2-x), dy=(y2-y);
      var len=Math.sqrt(dx*dx+dy*dy);
      var rot=Math.atan2(dy,dx);
      this.translate(x,y);
      this.moveTo(0,0);
      this.rotate(rot);
      var dc=da.length;
      var di=0, draw=true;
      x=0;
      while(len>x){
         x+=da[di++ % dc];
         if(x>len)x=len;
         draw ? this.lineTo(x,0): this.moveTo(x,0);
         draw=!draw;
      }
      this.restore();
   }
})();

//iio Engine :: Definition of iio package
var iio = {};
(function (iio) {
   //iio.isiPad = navigator.userAgent.match(/iPad/i) != null;
   function emptyFn() {};
   iio.maxInt = 9007199254740992;
   iio.inherit = function(child, parent) {
      var tmp = child;
      emptyFn.prototype = parent.prototype;
      child.prototype = new emptyFn;
      child.prototype.constructor = tmp;
   };
   iio.start = function(app,id,w,h){
      if (typeof app =='undefined') throw new Error("iio.start: No application script provided");
      if (typeof iio.apps == 'undefined') iio.apps = [];
      iio.apps[iio.apps.length]=new iio.AppManager(app, id, w, h);
      return iio.apps[iio.apps.length-1];
   }
   iio.stop = function(app){
      if (iio.isNumber(app))
         iio.apps.splice(app,1);
      else for (var i=0;i<iio.apps.length;i++)
         if (iio.apps[i] == app)
         iio.apps.splice(i,1);

   }
   iio.requestTimeout = function(fps,lastTime,callback,callbackParams){
       //Callback method by Erik Möller, Paul Irish, Tino Zijdel
       //https://gist.github.com/1579671
       var currTime = new Date().getTime();
       var timeToCall = Math.max(0, (1000/fps) - (currTime - lastTime));
       callbackParams[0].fsID = setTimeout(function() { callback(currTime + timeToCall, callbackParams); }, 
         timeToCall);
       lastTime = currTime + timeToCall;
   }
   /* iio Functions
    */
    iio.loadImage=function(src,onload){
      var img=new Image();
      img.src=src;
      img.onload=onload;
      return img;
    }
    iio.isNumber=function(o){
      return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }
    iio.isString=function(s){
      return typeof s == 'string' || s instanceof String;
    }
    iio.isBetween=function(val,min,max){
      if(max < min) {
         var tmp = min;
         min = max;
         max = tmp;
      } return (val >= min && val <= max);
    }
   iio.addEvent = function(obj,evt,fn,capt){  
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
   iio.delayCall = function(delay,fn,fnParams){
      setTimeout(function(){fn(fnParams)},delay);
   }
   iio.rotatePoint = function(x,y,r){
      if (typeof x.x!='undefined'){ r=y; y=x.y; x=x.x; }
      if (typeof r=='undefined'||r==0) return new iio.Vec(x,y);
      var newX = x * Math.cos(r) - y * Math.sin(r);
      var newY = y * Math.cos(r) + x * Math.sin(r);
      return new iio.Vec(newX,newY);
   }
   iio.getRandomNum = function(min, max) {
      min=min||0;
      max=max||1;
      return Math.random() * (max - min) + min;
   }
   iio.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
   }
   iio.getRandomColor = function() {
      var r = Math.floor(Math.random() * (255 - 0) + 0);
      var g = Math.floor(Math.random() * (255 - 0) + 0);
      var b = Math.floor(Math.random() * (255 - 0) + 0);
      return "rgb("+r+","+g+","+b+")";
   }
   iio.getVecsFromPointList = function(points){
      var vecs = [];
      for (var i=0;i<points.length;i++){
         if (typeof points[i].x !='undefined')
            vecs[vecs.length]=new iio.Vec(points[i]);
         else {
            vecs[vecs.length]=new iio.Vec(points[i],points[i+1]);
            i++;
         }
      } return vecs;
   }
   iio.getCentroid = function(vecs){
      var cX,cY;
      for (var i=0;i<vecs.length;i++){
         cX+=vecs[i].x;
         cY+=vecs[i].y;
      } return new iio.Vec(cX/vecs.length,cY/vecs.length);
   }
   iio.getSpecVertex = function(vertices,comparator){
      var v = vertices[0];
      for (var i=0;i<vertices.length;i++)
         if (comparator(v,vertices[i]))
            v=vertices[i];
      return v;
   }
   iio.lineContains = function(l1, l2, p) {
      if(iio.isBetween(p.x, l1.x, l2.x) && iio.isBetween(p.y, l1.y, l2.y)) {
         var a = (l2.y - l1.y) / (l2.x - l1.x);
         if(!isFinite(a)) {
            return true;
         }
         var y = a * (x - l1.x) + l1.y;
         if(y == p.y) {
            return true;
         }
      }
      return false;
   }
   iio.intersects = function(obj1,obj2){
      if (obj1 instanceof iio.SimpleRect){
         if(obj2 instanceof iio.SimpleRect)
            return iio.rectXrect(obj1,obj2);
         if(obj2 instanceof iio.Circle)
            return iio.polyXcircle(obj1,obj2);
         if(obj2 instanceof iio.Poly)
            return iio.polyXpoly(obj1,obj2);
      }
      if (obj1 instanceof iio.Poly){
         if (obj2 instanceof iio.Circle)
            return iio.polyXcircle(obj1,obj2);
         if (obj2 instanceof iio.Poly)
            return iio.polyXpoly(obj1,obj2,obj1.getTrueVertices(),obj2.getTrueVertices());
      }
      if (obj1 instanceof iio.Circle){
         if (obj2 instanceof iio.Circle)
            return iio.circleXcircle(obj1,obj2);
         if (obj2 instanceof iio.Poly)
            return iio.polyXcircle(obj2,obj1);
      }   
   }
   iio.lineXline = function(v1, v2, v3, v4) {
      var a1 = (v2.y - v1.y) / (v2.x - v1.x);
      var a2 = (v4.y - v3.y) / (v4.x - v3.x);
      var a = a1;
      var x1 = v1.x;
      var y1 = v1.y;
      var i1 = !isFinite(a1);
      var i2 = !isFinite(a2);
      var x;
      if(i1 || i2) {
         if(i1 && i2) {
            return v1.x === v3.x &&
                  (iio.isBetween(v1.y, v3.y, v4.y) || iio.isBetween(v2.y, v3.y, v4.y) ||
                   iio.isBetween(v3.y, v1.y, v2.y) || iio.isBetween(v4.y, v1.y, v2.y));
         }
         if(i1) {
            x = v1.x;
            a = a2;
            x1 = v3.x;
            y1 = v3.y;
         } else {
            x = v3.x;
         }
      } else {
         x = (a1*v1.x - a2*v3.x - v1.y + v3.y) / (a1 - a2);
         if(!isFinite(x)) {
            return (iio.isBetween(v1.x, v3.x, v4.x) && iio.isBetween(v1.y, v3.y, v4.y) ||
                    iio.isBetween(v2.x, v3.x, v4.x) && iio.isBetween(v2.y, v3.y, v4.y) ||
                    iio.isBetween(v3.x, v1.x, v2.x) && iio.isBetween(v3.y, v1.y, v2.y) ||
                    iio.isBetween(v4.x, v1.x, v2.x) && iio.isBetween(v4.y, v1.y, v2.y));
         }
      }
      var y = a * (x - x1) + y1;
      if(iio.isBetween(x, v1.x, v2.x) && iio.isBetween(x, v3.x, v4.x) && iio.isBetween(y, v1.y, v2.y) && iio.isBetween(y, v3.y, v4.y)) {
         return true;
      }
      return false;
   }
   iio.rectXrect = function(r1,r2){
      if (r1.left() < r2.right() && r1.right() > r2.left() && r1.top() < r2.bottom() && r1.bottom() > r2.top())
         return true;
      return false;
   }
   iio.polyXpoly = function(p1,p2){
      var v1=p1.getTrueVertices();
      var v2=p2.getTrueVertices();
      for (i=0;i<v1.length;i++)
         if (p2.contains(v1[i]))
            return true;
      for (i=0;i<v2.length;i++)
         if (p1.contains(v2[i]))
            return true;
      var a,b,j;
      for(i = 0; i < v1.length; i++) {
         a = iio.Vec.add(v1[i], p1.pos);
         b = iio.Vec.add(v1[(i + 1) % v1.length], p1.pos);
         for(j = 0; j < v2.length; j++) {
            if(iio.lineXline(a, b,
                                  iio.Vec.add(v2[j], p2.pos),
                                  iio.Vec.add(v2[(j + 1) % v2.length], p2.pos))) {
               return true;
            }
         }
      } return false;
   }
   iio.circleXcircle = function(c1,c2){
      if (c1.pos.distance(c2.pos) < c1.radius+c2.radius)
         return true;
      return false;
   }
   iio.polyXcircle = function(poly,circle){
      var v=poly.getTrueVertices();
      var i;
      for (i=0;i<v.length;i++)
         if (circle.contains(v[i]))
            return true;
      var j;for (i=0;i<v.length;i++){
         j=i+1; if (j==v.length) j=0;
         if (circle.lineIntersects(v[i],v[j]))
            return true;
      }
      return false;
   }
   iio.getKeyString=function(e){
      switch(e.keyCode){
         case 8: return'backspace';
         case 9: return'tab';
         case 13: return'enter';
         case 16: return'shift';
         case 17: return'ctrl';
         case 18: return'alt';
         case 19: return'pause';
         case 20: return'caps lock';
         case 27: return'escape';
         case 32: return'space';
         case 33: return'page up';
         case 34: return'page down';
         case 35: return'end';
         case 36: return'home';
         case 37: return'left arrow';
         case 38: return'up arrow';
         case 39: return'right arrow';
         case 40: return'down arrow';
         case 45: return'insert';
         case 46: return'delete';
         case 48: return'0';
         case 49: return'1';
         case 50: return'2';
         case 51: return'3';
         case 52: return'4';
         case 53: return'5';
         case 54: return'6';
         case 55: return'7';
         case 56: return'8';
         case 57: return'9';
         case 65: return'a';
         case 66: return'b';
         case 67: return'c';
         case 68: return'd';
         case 69: return'e';
         case 70: return'f';
         case 71: return'g';
         case 72: return'h';
         case 73: return'i';
         case 74: return'j';
         case 75: return'k';
         case 76: return'l';
         case 77: return'm';
         case 78: return'n';
         case 79: return'o';
         case 80: return'p';
         case 81: return'q';
         case 82: return'r';
         case 83: return's';
         case 84: return't';
         case 85: return'u';
         case 86: return'v';
         case 87: return'w';
         case 88: return'x';
         case 89: return'y';
         case 90: return'z';
         case 91: return'left window';
         case 92: return'right window';
         case 93: return'select key';
         case 96: return'n0';
         case 97: return'n1';
         case 98: return'n2';
         case 99: return'n3';
         case 100: return'n4';
         case 101: return'n5';
         case 102: return'n6';
         case 103: return'n7';
         case 104: return'n8';
         case 105: return'n9';
         case 106: return'multiply';
         case 107: return'add';
         case 109: return'subtract';
         case 110: return'dec';
         case 111: return'divide';
         case 112: return'f1';
         case 113: return'f2';
         case 114: return'f3';
         case 115: return'f4';
         case 116: return'f5';
         case 117: return'f6';
         case 118: return'f7';
         case 119: return'f8';
         case 120: return'f9';
         case 121: return'f10';
         case 122: return'f11';
         case 123: return'f12';
         case 144: return'num lock';
         case 156: return'scroll lock';
         case 186: return'semi-colon';
         case 187: return'equal';
         case 188: return'comma';
         case 189: return'dash';
         case 190: return'period';
         case 191: return'forward slash';
         case 192: return'grave accent';
         case 219: return'open bracket';
         case 220: return'back slash';
         case 221: return'close bracket';
         case 222: return'single quote';
         default:return'undefined';
      }
   }
   iio.keyCodeIs = function(key,event){
      if (!(key instanceof Array)) key=[key];
      var str=iio.getKeyString(event);
      for (var _k=0;_k<key.length;_k++){
         if(str==key[_k])
            return true;
      }
      return false;
   }
   if (typeof soundManager != 'undefined'){
      iio.playSound = function(url){
           var SFX;
           SFX=soundManager.createSound({url:url});
           SFX.play({onfinish:function(){this.destruct()}});
       }
       iio.loadSound=function(url,fn){
           var callback = fn;
           var s=soundManager.createSound({
               url:url,
              onload:function(){
                  soundManager._writeDebug(this.id+' loaded');
                  callback();
                }
            });
       }
   }
})(iio);

//Vec
(function () {
   //Definition
   function Vec(){
      this.Vec.apply(this, arguments);
   }; iio.Vec=Vec;

   //Constructor
   Vec.prototype.Vec = function(v,y){
      if (typeof v !='undefined' && typeof v.x != 'undefined'){
         this.x=v.x||0;
         this.y=v.y||0;
      } else {
         this.x=v||0;
         this.y=y||0;
      }
   }
   //Functions
   Vec.prototype.clone = function(){
      return new Vec(this.x,this.y);
   }
   Vec.prototype.toString = function(){
      return "x:"+this.x+" y:"+this.y;
   }
   Vec.toString = function(v){
      return "x:"+v.x+" y:"+v.y; 
   }
   Vec.prototype.set = function (v,y){
      if (typeof v.x != 'undefined'){
         this.x=v.x;
         this.y=v.y;
      } else {
         this.x=v;
         this.y=y;
      } return this;
   }
   Vec.prototype.length = function (){
      return Math.sqrt(this.x*this.x+this.y*this.y);
   }
   Vec.length = function(v,y){
      if (typeof v.x !='undefined')
         return Math.sqrt(v.x*v.x+v.y*v.y);
      else return Math.sqrt(v*v+y*y);
   }
   Vec.prototype.add = function(v,y){
      if (typeof v.x != 'undefined'){
         this.x+=v.x;
         this.y+=v.y;
      } else {
         this.x+=v;
         this.y+=y;
      } return this;
   }
   Vec.add = function(v1, v2, x2, y2){
      if (typeof v1.x != 'undefined')
            return (new Vec(v1)).add(v2,x2);
      else return (new Vec(v1,v2)).add(x2,y2);
   }
   Vec.prototype.sub = function (v,y){
      if (typeof v.x != 'undefined')
         this.add(-v.x,-v.y);
      else this.add(-v,-y);
      return this;
   }
   Vec.sub = function(v1, v2, x2, y2){
      if (typeof v1.x != 'undefined')
            return (new Vec(v1)).sub(v2,x2)
      else return (new Vec(v1,v2)).sub(x2,y2);
   }
   Vec.prototype.mult = function (f){
      this.x*=f;
      this.y*=f;
      return this;
   }
   Vec.mult = function(v, y, f){
      if (typeof v.x != 'undefined')
         return (new Vec(v)).mult(y);
      else return (new Vec(v, y)).mult(f);
   }
   Vec.prototype.div = function (d){
      this.x/=d;
      this.y/=d;
      return this;
   }
   Vec.div = function(v, y, f){
      if (typeof v.x != 'undefined')
         return (new Vec(v)).div(y)
      else return (new Vec(v,y)).div(f);
   }
   Vec.prototype.dot = function (v, y){
      if (typeof v.x != 'undefined')
         return this.x*v.x+this.y*v.y;
      else return this.x*v+this.y*y;
   }
   Vec.dot = function (v1, v2, x2, y2){
      if (typeof v1.x != 'undefined'){
         if (typeof v2.x != 'undefined')
            return v1.x*v2.x+v1.y*v2.y;
         else return v1.x*v2+v1.y*x2;
      } else {
         if (typeof x2.x != 'undefined')
            return v1*x2.x+v2*x2.y;
         else return v1*x2+v2*y2;
      }
   }
   Vec.prototype.normalize = function (){
      this.div(this.length());
      return this;
   }
   Vec.normalize = function(v,y){
      return (new Vec(v,y)).normalize();
   }
   Vec.prototype.lerp = function(v,y,p){
      if (typeof v.x != 'undefined')
         this.add(Vec.sub(v,this).mult(y));
      else this.add(Vec.sub(v,y,this).mult(p));
      return this;
   }
   Vec.lerp = function(v1,v2,x2,y2,p){
      if (typeof v1.x != 'undefined')
         return (new Vec(v1)).lerp(v2,x2,y2);
      else return (new Vec(v1,v2)).lerp(x2, y2, p);
   }
   Vec.prototype.distance = function(v,y){
      if (typeof v.x != 'undefined')
         return Math.sqrt((v.x-this.x)*(v.x-this.x)+(v.y-this.y)*(v.y-this.y));
      else return Math.sqrt((v-this.x)*(v-this.x)+(y-this.y)*(y-this.y));
   }
   Vec.distance = function(v1,v2,x2,y2){
      if (typeof v1.x != 'undefined'){
         if (typeof v2.x != 'undefined')
            return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x)+(v1.y-v2.y)*(v1.y-v2.y));
         else return Math.sqrt((v1.x-v2)*(v1.x-v2)+(v1.y-x2)*(v1.y-x2));
      } else {
         if (typeof x2.x != 'undefined')
            return Math.sqrt((v1-x2.x)*(v1-x2.x)+(v2-x2.y)*(v2-x2.y));
         else return Math.sqrt((v1-x2)*(v1-x2)+(v2-y2)*(v2-y2));
      }
   }
})();

//Obj
(function () {
   //Definition
   function Obj(){
      this.Obj.apply(this, arguments);
   }; iio.Obj=Obj;

   //Constructor
   Obj.prototype.Obj = function(v,y){
      this.pos = new iio.Vec(v||0,y||0);
      this.styles={};
   }

   //Functions
   Obj.prototype.clone = function(){
      return new Obj(this.pos);
   }
   Obj.prototype.setPos = function(v,y){
      this.redraw=true;
      this.pos = new iio.Vec(v,y);
      return this;
   }
   Obj.prototype.translate = function(v,y){
      this.pos.add(v,y);
      this.redraw=true;
      if (typeof this.objs!='undefined')
         for (var i=0;i<this.objs.length;i++)
            this.objs[i].translate(v,y);
      return this;
   }
   Obj.prototype.rotate = function(r){
      this.rotation = r;
      return this;
   }
   Obj.prototype.addObj = function(obj,under,ctx,v,y) {
      if (typeof this.objs == 'undefined')
         this.objs=[];
      obj.posOffset=new iio.Vec(v,y);
      obj.pos=this.pos.clone();
      if (typeof obj.posOffset!='undefined')
         obj.pos.add(obj.posOffset);
      this.objs[this.objs.length]=obj;
      this._draw=this.draw;
      if (under) 
         this.draw=function(ctx){
            for (var i=0;i<this.objs.length;i++)
               this.objs[i].draw(ctx);
            this._draw(ctx);
         }
      else this.draw=function(ctx){
            this._draw(ctx);
            for (var i=0;i<this.objs.length;i++)
               this.objs[i].draw(ctx);
         } 
      if (typeof ctx!='undefined') obj.draw(ctx);
      return this.enableUpdates();
   }
   Obj.prototype.enableUpdates = function(fn, fnParams){
      this._update=this.update;
      if (typeof this._update!='undefined')
         this.update=function(dt){
            var keep = fn(this,fnParams);
            if(!this._update(dt)||(typeof keep!='undefined'&&!keep))
               return false;
            return true;
         }
      else {
         this.update=function(dt){
            if (typeof this.objs!='undefined')
               for (var i=0;i<this.objs.length;i++){
                  if (typeof this.objs[i].update!='undefined')
                  this.objs[i].update(dt);
                  this.objs[i].pos.x=this.pos.x;
                  this.objs[i].pos.y=this.pos.y;
                  if (typeof this.objs[i].posOffset!='undefined')
                     this.objs[i].pos.add(this.objs[i].posOffset);
               }
            if (typeof this.fxFade!='undefined'){
               if (typeof this.styles=='undefined')
                  alert('error: styles undefined');
               if ((this.fxFade.rate > 0 && this.fxFade.alpha > this.styles.alpha)
                  ||(this.fxFade.rate < 0 && this.fxFade.alpha < this.styles.alpha)){
                  this.styles.alpha+=this.fxFade.rate;
                  this.clearDraw();
                  if (this.styles.alpha<0) this.styles.alpha=0;
                  if (this.styles.alpha>1) this.styles.alpha=1;
               } else this.fxFade=undefined;
            }
            if (typeof fn!='undefined')
               return fn(this,dt,fnParams);
            return true;
         }
      } return this;
   }
})();

//Line
(function () {
   //Definition
   function Line(){
      this.Line.apply(this, arguments);
   }; iio.Line=Line;
   iio.inherit(Line, iio.Obj)

   //Constructor
   Line.prototype._super = iio.Obj.prototype;
   Line.prototype.Line = function(p1, p2, p3, p4){
      this._super.Obj.call(this,p1,p2);
      if (p1 instanceof iio.Vec){
         if(p2 instanceof iio.Vec)
            this.endPos = new iio.Vec(p2);
         else this.endPos = new iio.Vec(p2,p3);
      } 
      else if (p3 instanceof iio.Vec)
         this.endPos = new iio.Vec(p3);
      else this.endPos = new iio.Vec(p3,p4)
   }

   //Functions
   Line.prototype.clone = function(){
      return new Line(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
   }
   Line.prototype.set = function( line, end, x2, y2){
      if (line instanceof iio.Line) {
         this.pos.x = line.pos.x;
         this.pos.y = line.pos.y;
         this.endPos.x = line.endPos.x;
         this.endPos.y = line.endPos.y;
      } else if (line instanceof iio.Vec){
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
   }
   Line.prototype.setDash = function(da){
      if (typeof da == 'undefined') this.dashed = undefined;
      else this.dashed=true;
      this.dashProperties=da;
      return this;
   }
   Line.prototype.setEndPos = function(v, y){
      if (v instanceof iio.Vec) this.endPos = v;
      else this.endPos = new iio.Vec(v||0,y||0);
   }
})();

//MultiLine
(function(){
   //Definition
   function MultiLine(){
      this.MultiLine.apply(this, arguments);
   }; iio.MultiLine=MultiLine;
   iio.inherit(MultiLine, iio.Line)

   //Constructor
   MultiLine.prototype._super = iio.Line.prototype;
   MultiLine.prototype.MultiLine = function(points){
      this.vertices=iio.getVecsFromPointList(points);
      this._super.Line.call(this,this.vertices[0],this.vertices[this.vertices.length-1]);
   }

   //Functions
   MultiLine.prototype.clone = function(){
      return new MultiLine(this.vertices);
   }
})();

//Text
(function () {
   //Definition
   function Text(){
      this.Text.apply(this, arguments);
   }; iio.Text=Text;
   iio.inherit(Text, iio.Obj)

   //Constructor
   Text.prototype._super = iio.Obj.prototype;
   Text.prototype.Text = function(text, v, y){
      this._super.Obj.call(this,v,y);
      this.text = text;
   }

   //Functions
   Text.prototype.clone = function(){
      var t = new Text(this.text, this.pos)
                 .setFont(this.font)
                 .setTextAlign(this.textAlign)
                 .setWrap(this.wrap)
                 .setLineHeight(this.lineheight);
      return t;
   }
   Text.prototype.keyboardEdit=function(e,cI,shift,fn){
      var key=iio.getKeyString(e);
      var str;
      var pre=this.text.substring(0,cI);
      var suf=this.text.substring(cI);
      if(typeof fn!='undefined'){
         str=fn(key,shift,pre,suf);
         if (str!=false){
            this.text=pre+str+suf;
            return cI+1;
         }
      }
      if(key.length>1){
         if(key=='backspace') {
            this.text=pre.substring(0,pre.length-1)+suf;
            return cI-1;
         }
         if(key=='delete') {
            this.text=pre+suf.substring(1);
            return cI;
         }
         if(key=='semi-colon'){
            if (shift) this.text=pre+':'+suf;
            else this.text=pre+';'+suf;
            cI++;
         }
         if(key=='equal') {
            if (shift) this.text=pre+'+'+suf;
            else this.text=pre+'='+suf;
            cI++;
         }
         if(key=='comma') {
            if (shift) this.text=pre+'<'+suf;
            else this.text=pre+','+suf;
            cI++;
         }
         if(key=='dash') {
            if (shift) this.text=pre+'_'+suf;
            else this.text=pre+'-'+suf;
            cI++;
         }
         if(key=='period') {
            if (shift) this.text=pre+'>'+suf;
            else this.text=pre+'.'+suf;
            cI++;
         }
         if(key=='forward slash') {
            if (shift) this.text=pre+'?'+suf;
            else this.text=pre+'/'+suf;
            cI++;
         }
         if(key=='grave accent') {
            if (shift) this.text=pre+'~'+suf;
            else this.text=pre+'`'+suf;
            cI++;
         }
         if(key=='open bracket') {
            if (shift) this.text=pre+'{'+suf;
            else this.text=pre+'['+suf;
            cI++;
         }
         if(key=='back slash') {
            if (shift) this.text=pre+'|'+suf;
            else this.text=pre+"/"+suf;
            cI++;
         }
         if(key=='close bracket') {
            if (shift) this.text=pre+'}'+suf;
            else this.text=pre+']'+suf;
            cI++;
         }
         if(key=='single quote') {
            if (shift) this.text=pre+'"'+suf;
            else this.text=pre+"'"+suf;
            cI++;
         }
         if(key=='space') {
            this.text=pre+" "+suf;
            cI++;
         }
      } else {
         if(shift) this.text=pre+key.charAt(0).toUpperCase()+suf;
         else this.text=pre+key+suf;
         cI++;
      }
      return cI;
   }
   Text.prototype.getX = function(ctx,i){
      var tt=this.text.substring(0,i);
      ctx.font=this.font;
      var w=ctx.measureText(tt).width;
      return this.left()+ctx.measureText(tt).width;
   }
   Text.prototype.setText = function(t){this.text = t;return this;}
   Text.prototype.addText = function(t){this.text=this.text+t;return this;}
   Text.prototype.setFont = function(f){this.font = f;return this;}
   Text.prototype.setWrap	=	function(w) { this.wrap = w;return this;}
   Text.prototype.setLineHeight	=	function(l) { this.lineheight = l;return this;}
   Text.prototype.setTextAlign = function(tA){this.textAlign = tA;return this;}
})();


//Shape
(function (){
   //Definition
   function Shape(){
      this.Shape.apply(this, arguments);
   }; iio.Shape=Shape;
   iio.inherit(Shape, iio.Obj)

   //Constructor
   Shape.prototype._super = iio.Obj.prototype;
   Shape.prototype.Shape = function(v,y){
      this._super.Obj.call(this,v,y);
   }
   //Functions
   Shape.prototype.clone = function(){
      return new Shape(this.pos);
   }
   Shape.prototype.setRotationAxis = function(v,y){
      if (v instanceof iio.Vec)
         this.rAxis = v.clone();
      else this.rAxis = new iio.Vec(v,y);
      return this;
   }
})();

//SimpleRect
(function (){
   //Definition
   function SimpleRect(){
      this.SimpleRect.apply(this, arguments);
   }; iio.SimpleRect=SimpleRect;
   iio.inherit(SimpleRect, iio.Shape)

   //Constructor
   SimpleRect.prototype._super = iio.Shape.prototype;
   SimpleRect.prototype.SimpleRect = function(v,y,w,h){
      this._super.Shape.call(this,v,y);
      if (typeof v!='undefined' && typeof v.x!='undefined'){
         this.width=y||0;
         this.height=w||y||0;
      } else {
         this.width=w||0;
         this.height=h||w||0;
      }
   }
   //Functions
   SimpleRect.prototype.clone = function(){
      return new SimpleRect(this.pos,this.width,this.height);
   }
   SimpleRect.prototype.left = function(){ return this.pos.x-this.width/2; }
   SimpleRect.prototype.right = function(){ return this.pos.x+this.width/2; }
   SimpleRect.prototype.top = function(){ return this.pos.y-this.height/2; }
   SimpleRect.prototype.bottom = function(){ return this.pos.y+this.height/2; }
   SimpleRect.prototype.setSize = function(v,y){
      if(typeof v.x!='undefined'){
         this.width=v.x||0;
         this.height=v.y||0;
      } else {
         this.width=v||0;
         this.height=y||0;
      } 
      return this;
   }
   SimpleRect.prototype.contains = function(v,y){
      y=v.y||y;
      v=v.x||v;
      v-=this.pos.x;
      y-=this.pos.y;
      // Check relative to center of rectangle
      if (v > -0.5 * this.width && v < 0.5 * this.width && y > -0.5 * this.height && y < 0.5 * this.height){
         return true;
      }
      return false;
   }
   SimpleRect.prototype.getTrueVertices = function(){
      return iio.getVecsFromPointList([this.pos.x-this.width/2,this.pos.y-this.height/2
                                        ,this.pos.x+this.width/2,this.pos.y-this.height/2
                                        ,this.pos.x+this.width/2,this.pos.y+this.height/2
                                        ,this.pos.x-this.width/2,this.pos.y+this.height/2])
   }
})();

//Circle
(function(){
   //Definition
   function Circle(){
      this.Circle.apply(this, arguments);
   }; iio.Circle=Circle;
   iio.inherit(Circle, iio.Shape)

   //Constructor
   Circle.prototype._super = iio.Shape.prototype;
   Circle.prototype.Circle = function(v,y,r){
      this._super.Shape.call(this,v,y);
      if (typeof v=='undefined'||typeof v.x!='undefined')
         this.radius=y||0;
      else this.radius=r||0;
   }
   //Functions
   Circle.prototype.clone = function(){
      return new Circle(this.pos,this.radius);
   }
   Circle.prototype.left = function(){ return this.pos.x-this.radius; }
   Circle.prototype.right = function(){ return this.pos.x+this.radius; }
   Circle.prototype.top = function(){ return this.pos.y-this.radius; }
   Circle.prototype.bottom = function(){ return this.pos.y+this.radius; }
   Circle.prototype.setRadius = function(r){this.radius=r||0; return this}
   Circle.prototype.contains = function(v){
      if (v.distance(this.pos) < this.radius)
         return true;
      return false;
   }
   Circle.prototype.lineIntersects = function(v1,v2){
      var a = (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y);
      var b = 2 * ((v2.x - v1.x) * (v1.x - this.pos.x) + (v2.y - v1.y) * (v1.y - this.pos.y));
      var cc = this.pos.x * this.pos.x + this.pos.y * this.pos.y + v1.x * v1.x + v1.y * v1.y - 2 * (this.pos.x * v1.x + this.pos.y * v1.y) - this.radius * this.radius;
      var deter = b * b - 4 * a * cc;
      if(deter > 0) {
        var e = Math.sqrt(deter);
        var u1 = (-b + e) / (2 * a);
        var u2 = (-b - e) / (2 * a);
        if(!((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)))
          return true;
      }
      return false;
   }
})();

//Poly
(function(){
   //Definition
   function Poly(){
      this.Poly.apply(this, arguments);
   }; iio.Poly=Poly;
   iio.inherit(Poly, iio.Shape)

   //Constructor
   Poly.prototype._super = iio.Shape.prototype;
   Poly.prototype.Poly = function(p,p2,p3){
      if (typeof p.x !='undefined'){
         this._super.Shape.call(this,p);
         this.vertices=iio.getVecsFromPointList(p2);
      }
      else if (p instanceof Array){
         this.vertices=iio.getVecsFromPointList(p);
         this.pos=new iio.Vec();
         this.styles={};
      }
      else {
         this._super.Shape.call(this,p,p2);
         this.vertices=iio.getVecsFromPointList(p3);
      }
      this.originToLeft=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.x>v2.x)return true;return false}).x;
      this.originToTop=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.y>v2.y)return true;return false}).y;
      this.width=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.x<v2.x)return true;return false}).x-this.originToLeft;
      this.height=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.y<v2.y)return true;return false}).y-this.originToTop;
   }
   //Functions
   Poly.prototype.clone = function(){
      return new Poly(this.pos,this.vertices);
   }
   Poly.prototype.left = function(){ return iio.getSpecVertex(this.getTrueVertices(),function(v1,v2){if(v1.x>v2.x)return true;return false}).x }
   Poly.prototype.right = function(){ return iio.getSpecVertex(this.getTrueVertices(),function(v1,v2){if(v1.x<v2.x)return true;return false}).x }
   Poly.prototype.top = function(){ return iio.getSpecVertex(this.getTrueVertices(),function(v1,v2){if(v1.y>v2.y)return true;return false}).y }
   Poly.prototype.bottom = function(){ return iio.getSpecVertex(this.getTrueVertices(),function(v1,v2){if(v1.y<v2.y)return true;return false}).y }
   Poly.prototype.contains = function(v,y){
      y=(v.y||y);
      v=(v.x||v);
      var i = j = c = 0;
      var vertices = this.getTrueVertices();
      for (i = 0, j = vertices.length-1; i < vertices.length; j = i++) {
         if ( ((vertices[i].y>y) != (vertices[j].y>y)) &&
            (v < (vertices[j].x-vertices[i].x) * (y-vertices[i].y) / (vertices[j].y-vertices[i].y) + vertices[i].x) )
               c = !c;
      } return c;
   }
   Poly.prototype.getTrueVertices=function(){
      var vList=[]; var x,y;
      for(var i=0;i<this.vertices.length;i++){
         x=this.vertices[i].x;
         y=this.vertices[i].y;
         var v=iio.rotatePoint(x,y,this.rotation);
         v.x+=this.pos.x;
         v.y+=this.pos.y;
         vList[i]=v;
      }
      return vList;
   }
})();

//Rect
(function (){
   //Definition
   function Rect(){
      this.Rect.apply(this, arguments);
   }; iio.Rect=Rect;
   iio.inherit(Rect, iio.Poly)

   //Constructor
   Rect.prototype._super = iio.Poly.prototype;
   Rect.prototype.Rect = function(x,y,w,h){
      if (typeof x!='undefined' && typeof x.x!='undefined'){
         h=w||y||0;
         w=y||0;
         y=x.y;
         x=x.x;
      } else {
         h=h||w||0;
         w=w||0;
         x=x||0;
         y=y||0;
      }
      this._super.Poly.call(this,x,y,[-w/2,-h/2
                                        ,w/2,-h/2
                                        ,w/2,h/2
                                        ,-w/2,h/2]);
   }
   //Functions
   Rect.prototype.clone = function(){
      return new Rect(this.pos,this.width,this.height);
   }
   Rect.prototype.setSize = function(w,h){
      h=h||w.y||w||0;
      w=w.x||w||0;
      this.height=h;
      this.width=w;
      this.originToLeft=-this.width/2;
      this.originToTop=-this.height/2;
      this.vertices=iio.getVecsFromPointList([-w/2,-h/2
                                        ,w/2,-h/2
                                        ,w/2,h/2
                                        ,-w/2,h/2])
      return this;
   }
})();

//XShape
(function(){
   //Definition
   function XShape(){
      this.XShape.apply(this, arguments);
   }; iio.XShape=XShape;
   iio.inherit(XShape, iio.SimpleRect)

   //Constructor
   XShape.prototype._super = iio.Rect.prototype;
   XShape.prototype.XShape = function(v,y,w,h){
      this._super.Rect.call(this,v,y,w,h);
   }
   //Functions
   XShape.prototype.clone = function(){
      return new XShape(this.pos,this.width,this.height);
   }
})();

//iio Graphics Engine
(function (){
   iio.Graphics={};
   iio.Graphics.transformContext = function(ctx,pos,r){
      //if (this.partialPixels) 
      ctx.translate(pos.x, pos.y);
      //else ctx.translate(Math.round(pos.x), Math.round(pos.y));
      if (typeof(r) != 'undefined') 
         ctx.rotate(r);
   }
   iio.Graphics.applyContextStyles = function(ctx,styles){
      if (typeof styles == 'undefined') return;
      if (typeof styles.lineWidth!='undefined') ctx.lineWidth = styles.lineWidth;
      if (typeof styles.shadowColor!='undefined') ctx.shadowColor = styles.shadowColor;
      if (typeof styles.shadowBlur!='undefined') ctx.shadowBlur = styles.shadowBlur;
      ctx.globalAlpha = (styles.alpha === 0)? 0: (styles.alpha || 1);
      if (typeof styles.lineCap!='undefined') ctx.lineCap = styles.lineCap;
      if (typeof styles.shadowOffset !='undefined'){
         ctx.shadowOffsetX = styles.shadowOffset.x;
         ctx.shadowOffsetY = styles.shadowOffset.y;
      }
      if (typeof styles.fillStyle!='undefined') ctx.fillStyle = styles.fillStyle;
      if (typeof styles.strokeStyle!='undefined') ctx.strokeStyle = styles.strokeStyle;
   }
   iio.Graphics.prepStyledContext = function(ctx,styles){
      ctx.save();
      if (typeof styles!='undefined')
         iio.Graphics.applyContextStyles(ctx,styles);
      if (typeof styles!='undefined' && typeof styles.shadow !='undefined')
         iio.Graphics.applyContextStyles(ctx,styles.shadow);
      return ctx;
   }
   iio.Graphics.prepTransformedContext = function(ctx,obj,pos,r){
      ctx=ctx||obj.ctx;
      pos=pos||obj.pos;
      r=r||obj.rotation;
      ctx.save();
      if (typeof obj.styles!='undefined')
         iio.Graphics.applyContextStyles(ctx,obj.styles);
      iio.Graphics.transformContext(ctx,pos,r);
      if (typeof obj.rAxis != 'undefined')
         iio.Graphics.transformContext(ctx,obj.rAxis);
      if (obj.flipImg) ctx.scale(-1, 1);
      return ctx;
   }
   iio.Graphics.finishPathShape = function(ctx,obj,left,top,width,height){
      iio.Graphics.drawShadow(ctx,obj);
      if (!iio.Graphics.drawImage(ctx,obj.img,true)){
         ctx.drawImage(obj.img,left,top,width,height);
         ctx.restore();
      }
      if (typeof obj.anims != 'undefined' && !iio.Graphics.drawImage(ctx,obj.anims[obj.animKey].srcs[obj.animFrame])){
         ctx.drawImage(obj.anims[obj.animKey].srcs[obj.animFrame],left,top,width,height);
         ctx.restore();
      }
      if (typeof obj.styles != 'undefined'){
         if (typeof obj.styles.fillStyle !='undefined') ctx.fill();
         if (typeof obj.styles.strokeStyle !='undefined') ctx.stroke();
      }
      ctx.restore();
   }
   iio.Graphics.drawLine = function(ctx,v1,v2,x2,y2){
      if (typeof v2.x != 'undefined'){
         x2=v2.x;
         y2=v2.y;
      }
      v2=v1.y||v2;
      v1=v1.x||v1;
      ctx.beginPath();
      ctx.moveTo(v1,v2);
      ctx.lineTo(x2,y2);
      ctx.stroke();
   }
   iio.Graphics.drawLine = function(ctx,v1,v2,x2,y2){
      if (typeof v2.x != 'undefined'){
         x2=v2.x;
         y2=v2.y;
      }
      v2=v1.y||v2;
      v1=v1.x||v1;
      ctx.beginPath();
      ctx.moveTo(v1,v2);
      ctx.lineTo(x2,y2);
      ctx.stroke();
   }
   iio.Graphics.drawDottedLine = function(ctx,da,v1,v2,x2,y2){
      if (typeof v2.x != 'undefined'){
         x2=v2.x;
         y2=v2.y;
      }
      v2=v1.y||v2;
      v1=v1.x||v1;
      ctx.beginPath();
      ctx.dashedLine(v1,v2,x2,y2,da);
      ctx.stroke();
   }
   iio.Graphics.drawShadow = function(ctx,obj){
      if (typeof obj.styles=='undefined'||typeof obj.styles.shadow=='undefined')return;
      ctx.save();
      iio.Graphics.applyContextStyles(ctx,obj.styles.shadow);
      if (typeof obj.styles.fillStyle != 'undefined'
       || typeof obj.img != 'undefined'
       || typeof obj.anims != 'undefined')
         ctx.fill();
      else if (typeof obj.styles.strokeStyle!='undefined')
         ctx.stroke();
      ctx.restore();
   }
   iio.Graphics.drawRectShadow = function(ctx,obj){
      if (typeof obj.styles=='undefined'||typeof obj.styles.shadow=='undefined')return;
      ctx.save();
      iio.Graphics.applyContextStyles(ctx,obj.styles.shadow);
      if (typeof obj.styles.rounding!='undefined'&&typeof obj.styles.rounding!=0)
         iio.Graphics.drawRoundedRectPath(ctx,obj);
      else {
         if (typeof obj.styles.fillStyle != 'undefined'
          || typeof obj.img != 'undefined'
          || typeof obj.anims != 'undefined')
            ctx.fillRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
         else if (typeof obj.styles.strokeStyle!='undefined')
            ctx.strokeRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
      }
      ctx.restore();
   }
   iio.Graphics.drawRoundedRectPath = function(ctx,obj){
      ctx.beginPath();
      ctx.moveTo(-obj.width/2 + obj.styles.rounding, -obj.height/2);
      ctx.lineTo(-obj.width/2 + obj.width - obj.styles.rounding, -obj.height/2);
      ctx.quadraticCurveTo(-obj.width/2 + obj.width, -obj.height/2, -obj.width/2 + obj.width, -obj.height/2 + obj.styles.rounding);
      ctx.lineTo(-obj.width/2 + obj.width, -obj.height/2 + obj.height - obj.styles.rounding);
      ctx.quadraticCurveTo(-obj.width/2 + obj.width, -obj.height/2 + obj.height, -obj.width/2 + obj.width - obj.styles.rounding, -obj.height/2 + obj.height);
      ctx.lineTo(-obj.width/2 + obj.styles.rounding, -obj.height/2 + obj.height);
      ctx.quadraticCurveTo(-obj.width/2, -obj.height/2 + obj.height, -obj.width/2, -obj.height/2 + obj.height - obj.styles.rounding);
      ctx.lineTo(-obj.width/2, -obj.height/2 + obj.styles.rounding);
      ctx.quadraticCurveTo(-obj.width/2, -obj.height/2, -obj.width/2 + obj.styles.rounding, -obj.height/2);
      ctx.closePath();
      ctx.strokeStyle=obj.styles.strokeStyle;
      ctx.stroke();
      ctx.fillStyle=obj.styles.fillStyle;
      ctx.fill();
      ctx.clip();
   }
   iio.Graphics.drawImage = function(ctx,img,clip){
      if (typeof img!='undefined'){
         ctx.save();
         if (typeof img.pos!='undefined'||typeof img.rotation!='undefined'){
            var p = img.pos||new iio.Vec();
            var r = img.rotation||0;
            iio.Graphics.transformContext(ctx,p,r);
         }
         if(clip) ctx.clip();
         if (typeof img.size != 'undefined')
            ctx.drawImage(img,-img.size.x/2,-img.size.y/2,img.size.x,img.size.y);
         else if (img.nativeSize)
            ctx.drawImage(img,-img.width/2,-img.height/2,img.width,img.height);
         else if (typeof img.scale!='undefined')
            ctx.drawImage(img,-img.width*img.scale/2,-img.height*img.scale/2,img.width*img.scale,img.height*img.scale);
         else return false;
         ctx.restore();
         return true;
      } return true;
   }
   iio.Graphics.drawSprite = function(ctx,w,h,s,i,flip,clip){
      if (typeof s!='undefined'){
         ctx.save();
         if(clip) ctx.clip();
         if (flip) ctx.scale(-1, 1);
         ctx.drawImage(s.src,s.frames[i].x,s.frames[i].y,s.frames[i].w,s.frames[i].h
                   ,-w/2, -h/2, w, h);
         ctx.restore();
         return true;
      } return true;
   }
})();

//Grid
(function(){
   //Definition
   function Grid(){
      this.Grid.apply(this, arguments);
   }; iio.Grid=Grid;
   iio.inherit(Grid, iio.Shape)

   //Constructor
   Grid.prototype._super = iio.Obj.prototype;
   Grid.prototype.Grid = function(v,y,c,r,res,yRes){
      if (typeof v.x!='undefined'){
         this._super.Obj.call(this,v);
         c=y;r=c;res=r;yRes=res;
      } else this._super.Obj.call(this,v,y);
      this.set(v,y,c,r,res,yRes);
      this.resetCells();
   }

   //Functions
   Grid.prototype.clone = function(){
      return new Grid(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
   }
   Grid.prototype.resetCells=function(){
      this.cells = new Array(this.C);
      for(var i=0; i<this.cells.length; i++)
         this.cells[i] = new Array(this.R);
      for(var c=0; c<this.cells[0].length; c++)
         for(var r=0; r<this.cells.length; r++)
            this.cells[r][c] = new Object();
   }
   Grid.prototype.getCellCenter = function(c,r, pixelPos){
      if (typeof c.x !='undefined'){
         if (r||false) return this.getCellCenter(this.getCellAt(c));
         return new iio.Vec(this.pos.x+c.x*this.res.x+this.res.x/2, this.pos.y+c.y*this.res.y+this.res.y/2);
      } else {
         if (pixelPos||false) return this.getCellCenter(this.getCellAt(c,r));
         return new iio.Vec(this.pos.x+c*this.res.x+this.res.x/2, this.pos.y+r*this.res.y+this.res.y/2);
      }
   }
   Grid.prototype.getCellAt = function(pos,y){
      if(typeof(pos.x) != 'undefined') {
         var pos2 = pos;
      } else if(typeof(y) != 'undefined') {
         var pos2 = new iio.Vec(pos,y);
      } else {
         return false;
      }
      var cell = new iio.Vec(Math.floor((pos2.x-this.pos.x)/this.res.x), Math.floor((pos2.y-this.pos.y)/this.res.y));
      if (cell.x >= 0 && cell.x < this.C && cell.y >=0 && cell.y < this.R)
         return cell;
      return false;
   }
   Grid.prototype.set = function(v,y,c,r,res,yRes){
      if (c.tagName=="CANVAS"){
         this.C=parseInt(c.width/r,10)+1;
         this.R=parseInt(c.height/(res||r),10)+1;
         this.res = new iio.Vec(r,res||r)
      } else {
         this.R=r;
         this.C=c;
         this.res = new iio.Vec(res,yRes||res);
      }
      this.setPos(v,y);
   }
   Grid.prototype.forEachCell = function(fn){
      var keepGoing=true;
      for (var c=0;c<this.C;c++)
         for(var r=0;r<this.R;r++){
            keepGoing=fn(this.cells[c][r],c,r);
            if (typeof keepGoing!='undefined'&&!keepGoing)
               return [r,c];
         }
   }
})();

//SpriteMap & Sprite
(function (){
   //Definition
   function SpriteMap(){
      this.SpriteMap.apply(this, arguments);
   }; iio.SpriteMap=SpriteMap;

   //Constructor
   SpriteMap.prototype.SpriteMap = function(src,sprW,sprH,onLoadCallback,callbackParams) {
      onLoadCallback=onLoadCallback||sprW||function(){};
      if (sprW!=onLoadCallback) this.sW=sprW||0;
      else this.sW=0;
      this.sH=sprH||0;
      if (typeof src.src != 'undefined'){
         this.srcImg=src;
         this.setSpriteRes(sprW,sprH);
      } else {
         this.srcImg=new Image();
         this.srcImg.src=src;
         this.srcImg.onload = function(){
            this.setSpriteRes(sprW,sprH);
            onLoadCallback(callbackParams);
         }.bind(this);
      } return this;
   }

   //Functions
   //-getSprite(row)
   //-getSprite(startIndex, endIndex)
   //-getSprite(spriteWidth, spriteHeight, row)
   //-getSprite(spriteWidth, spriteHeight, startIndex, endIndex, true)
   //-getSprite(xPos, yPos, width, height)
   SpriteMap.prototype.getSprite = function(p1,p2,p3,p4,p5){
      var s = new iio.Sprite(this.srcImg);
      if (typeof p3 != 'undefined'){
         if (p5){
            var C = this.srcImg.width/p1;
            if (typeof p4 != 'undefined')
               for (var i=p3;i<=p4;i++)
                  s.addFrame(i%C*p1,parseInt(i/C,10)*p2,p1,p2);
            else 
               for (var c=0;c<=this.C;c++)
                  s.addFrame(c*p1,p3*p2,p1,p2);
         } else s.addFrame(p1,p2,p3,p4);
      } else {
            if (typeof p2 != 'undefined')
               for (var i=p1;i<=p2;i++)
                  s.addFrame(i%this.C*this.sW,parseInt(i/this.C,10)*this.sH,this.sW,this.sH);
            else 
               for (var c=0;c<=this.C;c++)
                  s.addFrame(c*this.sW,p1*this.sH,this.sW,this.sH);
      } return s;
   }
   SpriteMap.prototype.setSpriteRes = function(w,h){
      this.sH=w.y||h; this.sW=w.x||w; 
      this.C=this.srcImg.width/this.sW;
      this.R=this.srcImg.height/this.sH;
   }

   //Sprite
   function Sprite(){
      this.Sprite.apply(this, arguments);
   }; iio.Sprite=Sprite;

   //Constructor
   Sprite.prototype.Sprite = function(src) {
         this.src=src;
         this.frames=[];
         return this;
   }

   //Functions
   Sprite.prototype.addFrame = function(x,y,w,h){
      var i=this.frames.length;
      this.frames[i]={};
      this.frames[i].x=x;
      this.frames[i].y=y;
      this.frames[i].w=w;
      this.frames[i].h=h;
   }
})();

//Graphics Attachments
(function (){
   //STYLE FUNCTIONS
   function setLineWidth(w){this.styles.lineWidth=w;return this}
   function setStrokeStyle(s,lW){
      this.styles.strokeStyle=s;
      this.styles.lineWidth=lW||this.styles.lineWidth;
      return this;
   };
   function setAlpha(a){this.styles.alpha=a;return this;}
   function setShadowColor(s){this.styles.shadow.shadowColor=s;return this};
   function setShadowBlur(s){this.styles.shadow.shadowBlur=s;return this};
   function setShadowOffset(v,y){this.styles.shadow.shadowOffset = new iio.Vec(v,y||v);return this};
   function setFillStyle(s){this.styles.fillStyle=s;return this};
   function setRoundingRadius(r){this.styles.rounding=r;return this};
   function drawReferenceLine(bool){this.styles.refLine=bool||true;return this};
   function setShadow(color,v,y,blur){
      this.styles.shadow={};
      this.styles.shadow.shadowColor=color;
      if (typeof v.x !='undefined'){
         this.styles.shadow.shadowOffset=new iio.Vec(v);
         this.styles.shadow.shadowBlur=y;
      } else {
         this.styles.shadow.shadowOffset=new iio.Vec(v,y);
         this.styles.shadow.shadowBlur=blur;
      } return this;
   };
   function setLineCap(style){ this.styles.lineCap=style; return this };
   iio.Obj.prototype.setLineWidth=setLineWidth;
   iio.Obj.prototype.setStrokeStyle=setStrokeStyle;
   iio.Obj.prototype.setShadowColor=setShadowColor;
   iio.Obj.prototype.setShadowBlur=setShadowBlur;
   iio.Obj.prototype.setShadowOffset=setShadowOffset;
   iio.Obj.prototype.setShadow=setShadow;
   iio.Obj.prototype.setAlpha=setAlpha;
   iio.Text.prototype.setFillStyle=setFillStyle;
   iio.Shape.prototype.setFillStyle=setFillStyle;
   iio.Circle.prototype.drawReferenceLine=drawReferenceLine;
   iio.Line.prototype.setLineCap=setLineCap;
   iio.SimpleRect.prototype.setRoundingRadius=iio.Rect.prototype.setRoundingRadius=setRoundingRadius;

   //Image Functions
   function setImgOffset(v,y){this.img.pos=new iio.Vec(v,y||v);return this};
   function setImgScale(s){this.img.scale=s;return this};
   function setImgRotation(r){this.img.rotation=r;return this};
   function flipImage(yes){
      if(typeof yes !='undefined')
         this.flipImg=yes;
      else if (typeof this.flipImg =='undefined')
         this.flipImg=true;
      else this.flipImg=!this.flipImg;
      if (typeof this.fsID == 'undefined')
      this.clearDraw(this.ctx);
   }
   function setImgSize(v,y){
      if (v == 'native') this.img.nativeSize=true;
      else this.img.size=new iio.Vec(v,y||v);
      return this
   };
   function addImage(src, onLoadCallback){
      if (typeof src.src != 'undefined')
         this.img=src;
      else {
         this.img = new Image();
         this.img.src = src;
         this.img.onload = onLoadCallback;
      } return this;
   }
   function addAnim(src, tag, onLoadCallback){
      if (typeof this.anims == 'undefined') this.anims=[];
      if (typeof this.animKey == 'undefined') this.animKey=0;
      if (typeof this.animFrame == 'undefined') this.animFrame=0;
      var nI = this.anims.length;
      if (src instanceof iio.Sprite){
         this.anims[nI]=src;
         this.anims[nI].tag=tag;
         return this;
      }
      this.anims[nI]=new Object();
      this.anims[nI].srcs=[];
      if(typeof tag == 'function')
         onLoadCallback=tag;
      else this.anims[nI].tag=tag;
      for (var j=0;j<src.length;j++){
         if (typeof src[j].src !='undefined')
            this.anims[nI].srcs[j]=src[j];
         else {
            this.anims[nI].srcs[j]=new Image();
            this.anims[nI].srcs[j].src=src[j];
         }
         if (j==this.animFrame&&typeof onLoadCallback!='undefined')
            this.anims[nI].srcs[j].onload = onLoadCallback;
      } return this;
   }
   function createWithImage(src, onLoadCallback){
      if (typeof src.src !='undefined'){
         this.img = src;
         if (typeof this.radius!='undefined'){
            this.radius = src.width/2;
         } else {
            this.width = src.width;
            this.height = src.height;
         }
      } else {
         this.img = new Image();
         this.img.src = src;
         this.img.onload = function(){
            if (typeof this.radius!='undefined'){
               this.radius = this.img.width/2;
            } else {
               this.width=this.img.width||0;
               this.height=this.img.height||0;
            }
            if (typeof onLoadCallback != 'undefined')
               onLoadCallback();
         }.bind(this);
      } return this;
   }
   function createWithAnim(src,tag,onLoadCallback,i){
      if (typeof i=='undefined' && iio.isNumber(onLoadCallback))
         i=onLoadCallback;
      i=i||0;
      if (typeof tag=='function'){
         onLoadCallback=tag;
         this.addAnim(src);
      }
      else this.addAnim(src,tag);
      if (src instanceof iio.Sprite){
         this.width = src.frames[i].w;
         this.height = src.frames[i].h;
         this.animKey=0;
         //this.anims[0].tag=tag;
         this.animFrame=i||0;
         return this;
      }
      if (typeof src[0].src !='undefined'){
         this.width = src[i].width;
         this.height = src[i].height;
      } else {
         this.animKey=0;
         this.animFrame=i;
         this.anims[0].srcs[i].onload = function(){
            this.width=this.anims[0].srcs[i].width||0;
            this.height=this.anims[0].srcs[i].height||0;
            if (typeof onLoadCallback != 'undefined' && !iio.isNumber(onLoadCallback))
               onLoadCallback();
         }.bind(this);
      } return this;
   }
   function nextAnimFrame(reRender){
      function resetFrame(io){
         if (typeof io.onAnimComplete != 'undefined'){
            if (io.onAnimComplete())
               io.animFrame=0;
         } else io.animFrame=0;
      }
      this.animFrame++;
      if (this.anims[this.animKey] instanceof iio.Sprite){
         if(this.animFrame >= this.anims[this.animKey].frames.length)
            resetFrame(this);
      } else if ( this.animFrame >= this.anims[this.animKey].srcs.length)
            resetFrame(this);
      if (reRender) this.clearDraw();
      else this.redraw=true;
      return this;
   }
   function setAnimFrame(i){
      this.animFrame=i;
      return this;
   }
   function playAnim(tag,fps,io,draw,c,f){
      if (!iio.isNumber(tag)){
         this.setAnimKey(tag);
         if (iio.isNumber(draw)) c=draw;
      }else{ f=c;c=draw;draw=io;io=fps;fps=tag; }
      if (!iio.isNumber(c)){
         this.onAnimComplete=c;
         c=f||0;
      } else this.onAnimComplete = f;
      if (typeof this.fsID != 'undefined')
         this.stopAnim();
      if (draw) io.setFramerate(fps,function(){this.nextAnimFrame()}.bind(this),this,io.ctxs[c||0]);
      io.setNoDrawFramerate(fps,function(){this.nextAnimFrame()}.bind(this),this,io.ctxs[c||0]);
      return this;
   }
   function play1Anim(tag,fps,io,draw,c,f){
      return this.playAnim(tag,fps,io,draw,c,function(){
         this.stopAnim();
      }.bind(this));
   }
   function stopAnim(key,ctx){
      clearTimeout(this.fsID);
      this.fsID=undefined;
      this.setAnimKey(key);
      this.animFrame=0;
      if (typeof ctx != 'undefined'){
         this.clearDraw(ctx);
         this.draw(ctx);
      }
      return this;
   }
   function setAnim(key,fn,frame,ctx){
      if (typeof this.fsID!='undefined'){
         clearTimeout(this.fsID);
         this.fsID=undefined;
      }if (iio.isNumber(fn)){
         frame=fn;ctx=frame;
         fn=function(){};
      } else if(fn instanceof Array){
         fn=fn[0];
         var fnParams=fn[1];
      } else fn=function(){};
      if (typeof frame!='undefined')
         if (!iio.isNumber(frame))
            ctx=ctx||frame;
      this.animFrame=frame||0;
      this.setAnimKey(key);
      if (typeof ctx != 'undefined'){
         this.clearDraw(ctx);
         this.draw(ctx);
      }
      if(fnParams!="undefined")fn(fnParams);
      else fn();
      return this;
   }
   function setAnimKey(key){
      if (iio.isNumber(key))
         this.animKey=key;
      else for (var i=0;i<this.anims.length;i++)
         if (this.anims[i].tag == key)
            this.animKey=i;
      return this;
   }
   function fade(rate,opacity){
      if (typeof this.update=='undefined')
         this.enableUpdates();
      this.fxFade={};
      this.fxFade.rate=rate;
      this.fxFade.alpha=opacity;
      return this;
   }
   function fadeIn(rate,opacity){
      //fillStyle=fillStyle||this.styles.fillStyle;
      opacity=opacity||1;
      return this.fade(rate,opacity);
   }
   function fadeOut(rate,opacity){
      //fillStyle=fillStyle||this.styles.fillStyle;
      opacity=opacity||0;
      return this.fade(-rate,opacity);
   }

   iio.Obj.prototype.fadeIn = fadeIn;
   iio.Obj.prototype.fadeOut = fadeOut;
   iio.Obj.prototype.fade = fade;
   iio.Shape.prototype.setImgOffset = setImgOffset;
   iio.Shape.prototype.setImgScale = setImgScale;
   iio.Shape.prototype.setImgRotation = setImgRotation;
   iio.Shape.prototype.setImgSize = setImgSize;
   iio.Shape.prototype.flipImage = flipImage;
   iio.Shape.prototype.addImage = addImage;
   iio.Shape.prototype.addAnim = addAnim;
   iio.Rect.prototype.createWithImage = iio.SimpleRect.prototype.createWithImage = createWithImage;
   iio.Circle.prototype.createWithImage = createWithImage;
   iio.Rect.prototype.createWithAnim = iio.SimpleRect.prototype.createWithAnim = createWithAnim;
   iio.Shape.prototype.nextAnimFrame=nextAnimFrame;
   iio.Shape.prototype.setAnimFrame=setAnimFrame;
   iio.Shape.prototype.setAnimKey=setAnimKey;
   iio.Shape.prototype.playAnim=playAnim;
   iio.Shape.prototype.play1Anim=play1Anim;
   iio.Shape.prototype.stopAnim=stopAnim;
   iio.Shape.prototype.setAnim=setAnim;

   //Draw Functions
   iio.Shape.prototype.clearDraw = function(ctx){
      ctx=ctx||this.ctx;
      this.redraw=true;
      if (typeof this.clearSelf != 'undefined' && typeof ctx!='undefined')
         this.clearSelf(ctx);
      return this;
   }
   iio.Text.prototype.clearDraw = iio.Shape.prototype.clearDraw;
   iio.Line.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      if (this.dashed) iio.Graphics.drawDottedLine(ctx,this.dashProperties,this.pos,this.endPos);
      else iio.Graphics.drawLine(ctx,this.pos,this.endPos);
      ctx.restore();
      return this;
   };
   iio.MultiLine.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      for (var i=1;i<this.vertices.length;i++)
         iio.Graphics.drawLine(ctx,this.vertices[i-1],this.vertices[i]);
      ctx.restore();
      return this;
   };
   iio.Grid.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      if (!iio.Graphics.drawImage(ctx,this.img)){
         ctx.drawImage(this.img, this.pos.x, this.pos.y, this.res.x*this.C, this.res.y*this.R);
         ctx.restore();
      }
      for (var r=1; r<this.R; r++)
         iio.Graphics.drawLine(ctx,this.pos.x,this.pos.y+r*this.res.y,this.pos.x+this.C*this.res.x,this.pos.y+r*this.res.y);
      for (var c=1; c<this.C; c++)
         iio.Graphics.drawLine(ctx,this.pos.x+c*this.res.x,this.pos.y,this.pos.x+c*this.res.x,this.pos.y+this.R*this.res.y);
      ctx.restore();
      return this;
   }
   iio.XShape.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      iio.Graphics.drawLine(ctx,iio.Vec.sub(this.pos,this.width/2,this.height/2)
                               ,iio.Vec.add(this.pos,this.width/2,this.height/2));
      iio.Graphics.drawLine(ctx,iio.Vec.add(this.pos,this.width/2,-this.height/2)
                               ,iio.Vec.add(this.pos,-this.width/2,this.height/2));
      ctx.restore();
      return this;
   }
   iio.Text.prototype.top = function(){
      return this.pos.y;
   }
   iio.Text.prototype.bottom = function(){
      return this.pos.y+parseInt(this.font,10);
   }
   iio.Text.prototype.right = function(){
      this.ctx.save();
      this.ctx.font=this.font;
      if (this.textAlign=='center') return this.pos.x+this.ctx.measureText(this.text).width/2;
      else if (this.textAlign=='right'||this.textAlign=='end') return this.pos.x;
      else return this.pos.x+this.ctx.measureText(this.text).width;
      this.ctx.restore();
   }
   iio.Text.prototype.left = function(){
      this.ctx.save();
      this.ctx.font=this.font;
      if (this.textAlign=='center') return this.pos.x-this.ctx.measureText(this.text).width/2;
      else if (this.textAlign=='right'||this.textAlign=='end') return this.pos.x-this.ctx.measureText(this.text).width;
      else return this.pos.x;
      this.ctx.restore();
   }
   iio.Text.prototype.clearSelf = function(ctx){
      this.ctx=ctx||this.ctx;
      // iio.Graphics.prepStyledContext(ctx,this.styles);
      // iio.Graphics.transformContext(ctx,this.pos,this.rotation);
      this.ctx.font = this.font;
      var fs = parseInt(this.font,10);
      var m = this.ctx.measureText(this.text);
      if (this.textAlign=='center') return clearShape(this.ctx,this,m.width,fs,-m.width/2,-fs/2);
      else if (this.textAlign=='right'||this.textAlign=='end') return clearShape(this.ctx,this,m.width,fs,-m.width,-fs/2);
      else return clearShape(this.ctx,this,m.width,fs,0,-fs/2);
   }
   iio.Text.prototype.draw = function(ctx){
      if(typeof ctx=='undefined')return this;
      this.ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(this.ctx,this.styles);
      iio.Graphics.transformContext(this.ctx,this.pos,this.rotation);
      this.ctx.font = this.font;
      this.ctx.textAlign = this.textAlign;
      if(typeof(this.wrap) == 'undefined' || this.wrap <= 0) {
	      if (typeof this.styles.fillStyle!='undefined')
	         this.ctx.fillText(this.text,0,0);
	      if (typeof this.styles.strokeStyle!='undefined')
	         this.ctx.strokeText(this.text,0,0);
	   } else {
	  	  var lineHeight	=	this.lineheight || 28;
		  var words 		= 	this.text.split(' ');
	      var line 			= 	'',
	      	  y 			=	0,
	      	  n 			=	0;
	      for(; n < words.length; n++) {
	          var testLine = line + words[n] + ' ';
	          var metrics = this.ctx.measureText(testLine);
	          var testWidth = metrics.width;
	          if(testWidth > this.wrap) {
	            this.ctx.fillText(line, 0, y);
	            line = words[n] + ' ';
	            y += lineHeight;
	          }
	          else {
	            line = testLine;
	          }
	        }
	        this.ctx.fillText(line, 0, y);
	   }
      this.ctx.restore();
      return this;
   }
   function drawRect(ctx,pos,r){
      if(typeof ctx=='undefined')return this;
      ctx=iio.Graphics.prepTransformedContext(ctx,this,pos,r);
      iio.Graphics.drawRectShadow(ctx,this);
      if (typeof this.styles != 'undefined'&&typeof this.styles.rounding!='undefined'&& this.styles.rounding!=0)
         iio.Graphics.drawRoundedRectPath(ctx,this);
      if (!iio.Graphics.drawImage(ctx,this.img)){
         ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
         ctx.restore();
      }
      if (typeof this.anims != 'undefined'){
         if (this.anims[this.animKey] instanceof iio.Sprite)
               iio.Graphics.drawSprite(ctx,this.width,this.height,this.anims[this.animKey],this.animFrame);
         else if(!iio.Graphics.drawImage(ctx,this.anims[this.animKey].srcs[this.animFrame])){
            ctx.drawImage(this.anims[this.animKey].srcs[this.animFrame],-this.width/2,-this.height/2,this.width,this.height);
            ctx.restore();
         }
      }
      if (typeof this.styles!='undefined'){
         if (typeof this.styles.fillStyle !='undefined')
            ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
         if (typeof this.styles.strokeStyle !='undefined')
            ctx.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
      }
      ctx.restore();
      return this;
   }
   function setPolyDraw(bool){
      this.polyDraw=bool;
      return this;
   }
   function drawCircle(ctx,pos,r){
      if(typeof ctx=='undefined')return this;
      ctx=iio.Graphics.prepTransformedContext(ctx,this,pos,r);
      ctx.beginPath();
      ctx.arc(0,0,this.radius,0,2*Math.PI,false);
      iio.Graphics.drawShadow(ctx,this);
      if (this.polyDraw)
         var clip = false;
      else var clip = true;
      if (!iio.Graphics.drawImage(ctx,this.img,clip)){
         ctx.drawImage(this.img, -this.radius,-this.radius,this.radius*2,this.radius*2);
         ctx.restore();
      }
      if (typeof this.anims != 'undefined' && !iio.Graphics.drawImage(ctx,this.anims[this.animKey].srcs[this.animFrame])){
         ctx.drawImage(this.anims[this.animKey].srcs[this.animFrame], -this.radius,-this.radius,this.radius*2,this.radius*2);
         ctx.restore();
      }
      if (typeof this.styles != 'undefined'){
         if (typeof this.styles.fillStyle !='undefined') ctx.fill();
         if (typeof this.styles.strokeStyle !='undefined') ctx.stroke();
         if (this.styles.refLine) iio.Graphics.drawLine(ctx,0,0,this.radius,0);
      }
      ctx.restore();
      return this;
   }
   iio.Circle.prototype.draw=drawCircle;
   iio.Circle.prototype.setPolyDraw=setPolyDraw;
   iio.Poly.prototype.draw = function(ctx){
      if(typeof ctx=='undefined')return this;
      ctx=iio.Graphics.prepTransformedContext(ctx,this);
      ctx.beginPath();
      ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
      for(var i=1;i<this.vertices.length;i++)
         ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
      ctx.closePath();
      iio.Graphics.finishPathShape(ctx,this,this.originToLeft,this.originToTop,this.width,this.height);
   }
   iio.Rect.prototype.draw=iio.SimpleRect.prototype.draw=drawRect;
   iio.Rect.prototype.clearSelf=iio.SimpleRect.prototype.clearSelf=function(ctx){
      return clearShape(ctx,this,this.width,this.height);
   }
   iio.Circle.prototype.clearSelf = function(ctx){
      return clearShape(ctx,this,this.radius*2,this.radius*2);
   }
   iio.Poly.prototype.clearSelf = function(ctx){
      return clearShape(ctx,this,this.width,this.height,this.originToLeft,this.originToTop);
   }
   function clearShape(ctx,obj,w,h,oL,oT){
      ctx.save();
      iio.Graphics.transformContext(ctx,obj.pos,obj.rotation);
      if (typeof obj.rAxis != 'undefined')
         iio.Graphics.transformContext(ctx,obj.rAxis);
      var dV=new iio.Vec(2,2);
      if (typeof obj.styles != 'undefined'){
         if (typeof obj.styles.lineWidth!='undefined')
            dV.add(obj.styles.lineWidth,obj.styles.lineWidth);
         else if (typeof obj.styles.strokeStyle!='undefined')
            dV.add(2,2);
         if (typeof obj.styles.shadow!='undefined' && typeof obj.styles.shadow.shadowOffset!='undefined'){
            var origin;
            if (typeof oL !='undefined') origin =  new iio.Vec(oL-dV.x,oT-dV.y)
            else origin = new iio.Vec(-w/2-dV.x,-h/2-dV.y)
            origin.add(-Math.abs(obj.styles.shadow.shadowOffset.x)-8,-Math.abs(obj.styles.shadow.shadowOffset.y)-8);
            dV.add(Math.abs(obj.styles.shadow.shadowOffset.x)*2+16,Math.abs(obj.styles.shadow.shadowOffset.y)*2+16);
            ctx.clearRect(origin.x, origin.y, w+dV.x, h+dV.y);
            ctx.restore();
            return obj;
         }
      }
      ctx.clearRect(-w/2-dV.x/2, -h/2-dV.y/2, w+dV.x, h+dV.y);
      ctx.restore();
      return obj;
   }
   if (typeof Box2D != 'undefined'){
      var b2Shape = Box2D.Collision.Shapes.b2Shape
         ,b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         ,b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         ,b2Joint = Box2D.Dynamics.Joints.b2Joint;

      b2PolygonShape.prototype.prepGraphics=function(scale){
         this.originToLeft=iio.getSpecVertex(this.m_vertices,function(v1,v2){if(v1.x>v2.x)return true;return false}).x*scale;
         this.originToTop=iio.getSpecVertex(this.m_vertices,function(v1,v2){if(v1.y>v2.y)return true;return false}).y*scale;
         this.width=iio.getSpecVertex(this.m_vertices,function(v1,v2){if(v1.x<v2.x)return true;return false}).x*scale-this.originToLeft;
         this.height=iio.getSpecVertex(this.m_vertices,function(v1,v2){if(v1.y<v2.y)return true;return false}).y*scale-this.originToTop;
         this.styles={};
         return this;
      }
      b2CircleShape.prototype.prepGraphics=function(scale){
         this.radius=this.m_radius*scale;
         this.styles={};
         return this;
      }
      function prepGraphics(){this.styles={};return this;}
      b2Joint.prototype.prepGraphics=prepGraphics;
      b2Shape.prototype.prepGraphics=prepGraphics;
      b2Shape.prototype.setAlpha=setAlpha;
      b2Joint.prototype.setAlpha=setAlpha;
      b2Joint.prototype.setLineWidth=setLineWidth;
      b2Shape.prototype.setLineWidth=setLineWidth;
      b2Joint.prototype.setStrokeStyle=setStrokeStyle;
      b2Shape.prototype.setStrokeStyle=setStrokeStyle;
      b2Joint.prototype.setShadowColor=setShadowColor;
      b2Shape.prototype.setShadowColor=setShadowColor;
      b2Joint.prototype.setShadowBlur=setShadowBlur;
      b2Shape.prototype.setShadowBlur=setShadowBlur;
      b2Joint.prototype.setShadowOffset=setShadowOffset;
      b2Shape.prototype.setShadowOffset=setShadowOffset;
      b2Joint.prototype.setShadow=setShadow;
      b2Shape.prototype.setShadow=setShadow;
      b2Shape.prototype.setFillStyle=setFillStyle;
      b2CircleShape.prototype.drawReferenceLine=drawReferenceLine;
      b2Shape.prototype.fadeIn = fadeIn;
      b2Shape.prototype.fadeOut = fadeOut;
      b2Shape.prototype.fade = fade;
      b2Joint.prototype.fadeIn = fadeIn;
      b2Joint.prototype.fadeOut = fadeOut;
      b2Joint.prototype.fade = fade;
      b2Shape.prototype.setImgOffset = setImgOffset;
      b2Shape.prototype.setImgScale = setImgScale;
      b2Shape.prototype.setImgRotation = setImgRotation;
      b2Shape.prototype.setImgSize = setImgSize;
      b2Shape.prototype.addImage = addImage;
      b2Shape.prototype.flipImage = flipImage;
      b2Shape.prototype.addAnim = addAnim;
      //b2Shape.prototype.createWithImage = createWithImage;
      //b2Shape.prototype.createWithAnim = createWithAnim;
      b2Shape.prototype.nextAnimFrame=nextAnimFrame;
      b2Shape.prototype.setAnimFrame=setAnimFrame;
      b2Shape.prototype.setAnimKey=setAnimKey;
      b2Shape.prototype.playAnim=playAnim;
      b2Shape.prototype.play1Anim=play1Anim;
      b2Shape.prototype.stopAnim=stopAnim;
      b2CircleShape.prototype.draw = drawCircle;
      b2CircleShape.prototype.setPolyDraw = setPolyDraw;
      Box2D.Collision.Shapes.b2PolygonShape.prototype.draw = function(ctx,pos,r,scale){
            ctx=iio.Graphics.prepTransformedContext(ctx,this,pos,r);
            ctx.beginPath();
            ctx.moveTo(this.m_vertices[0].x*scale,this.m_vertices[0].y*scale);
            for(var i=1;i<this.m_vertices.length;i++)
               ctx.lineTo(this.m_vertices[i].x*scale,this.m_vertices[i].y*scale);
            ctx.closePath();
            iio.Graphics.finishPathShape(ctx,this,this.originToLeft,this.originToTop,this.width,this.height);
         }
      Box2D.Dynamics.b2Body.draw=function(ctx,scale){
         for (f=this.objs[i].GetFixtureList();f;f=f.m_next){
               s=f.GetShape(); 
               if (typeof s.draw!='undefined')
                  s.draw(ctx,new iio.Vec(this.objs[i].m_xf.position.x*scale,this.objs[i].m_xf.position.y*scale),this.objs[i].GetAngle(),scale);
            }
      }
      function drawJoint(ctx,scale){
         var b1 = this.GetBodyA();
         var b2 = this.GetBodyB();
         var xf1 = b1.m_xf;
         var xf2 = b2.m_xf;
         var x1 = xf1.position;
         var x2 = xf2.position;
         var p1 = this.GetAnchorA();
         var p2 = this.GetAnchorB();
         iio.Graphics.prepStyledContext(ctx,this.styles);
         switch (this.m_type) {
            case Box2D.Dynamics.Joints.b2Joint.e_distanceJoint:
               iio.Graphics.drawLine(ctx,p1.x*scale,p1.y*scale,p2.x*scale,p2.y*scale);
               break;
            case Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint:
               {
                  var pulley = ((this instanceof b2PulleyJoint ? this : null));
                  var s1 = pulley.GetGroundAnchorA();
                  var s2 = pulley.GetGroundAnchorB();
                  iio.Graphics.drawLine(ctx,s1.x*scale,s1.y*scale,p1.x*scale,p1.y*scale);
                  iio.Graphics.drawLine(ctx,s2.x*scale,s2.y*scale,p2.x*scale,p2.y*scale);
                  iio.Graphics.drawLine(ctx,s1.x*scale,s1.y*scale,s2.x*scale,s2.y*scale);
               }
               break;
            case Box2D.Dynamics.Joints.b2Joint.e_mouseJoint:
               iio.Graphics.drawLine(ctx,p1.x*scale,p1.y*scale,p2.x*scale,p2.y*scale);
               break;
            default:
               if (b1 != this.m_groundBody) iio.Graphics.drawLine(ctx,x1.x*scale,x1.y*scale,p1.x*scale,p1.y*scale);
               iio.Graphics.drawLine(ctx,p1.x*scale,p1.y*scale,p2.x*scale,p2.y*scale);
               if (b2 != this.m_groundBody) iio.Graphics.drawLine(ctx,x2.x*scale,x2.y*scale,p2.x*scale,p2.y*scale);
         }
      }
      Box2D.Dynamics.Joints.b2Joint.prototype.draw=drawJoint;
   }
})();

//iio Kinematics Engine
(function(){
   function updateProperties(obj,dt){
      if ((typeof obj.acc != 'undefined' && obj.acc.length() > 0) || (typeof obj.vel != 'undefined' && obj.vel.length() > 0) || (typeof obj.torque != 'undefined' && obj.torque > 0))
         obj.clearDraw();
      if (typeof obj.acc != 'undefined') {
         if (typeof obj.vel == 'undefined') obj.setVel();
         obj.vel.add(obj.acc);
      }
      if (typeof obj.vel != 'undefined') obj.translate(new iio.Vec(obj.vel.x, obj.vel.y));
      if (typeof obj.torque != 'undefined'){
         obj.rotation+=obj.torque;
         if (obj.rotation>2*Math.PI)
            obj.rotation-=2*Math.PI;
         else if (obj.rotation<-2*Math.PI)
            obj.rotation+=2*Math.PI;
      }
      if (obj.shrinkRate > 0){
         if (typeof obj.radius != 'undefined') {
            obj.setRadius(obj.radius*(1-obj.shrinkRate));
            if (Math.abs(obj.radius < .1))
               return false;
         } else {
            obj.setSize(obj.width*(1-obj.shrinkRate), obj.height*(1-obj.shrinkRate));
            if (Math.abs(obj.width < .1) && Math.abs(obj.height < .1))
               return false;
         } 
      }
      if (obj.bounds != null){
         var top = obj.top()||(obj.pos.y-obj.radius)||0;
         if (typeof obj.bounds.top!='undefined' && top < obj.bounds.top.val){
            if (typeof obj.bounds.top.callback!='undefined')
               return obj.bounds.top.callback(obj)||false;
            return false;
         }

         var right = obj.right()||(obj.pos.x+obj.radius)||0;
         if (typeof obj.bounds.right!='undefined' && right > obj.bounds.right.val){
            if (typeof obj.bounds.right.callback!='undefined')
               return obj.bounds.right.callback(obj)||false;
            return false;
         }

         var bottom = obj.bottom()||(obj.pos.y+obj.radius)||0;
         if (typeof obj.bounds.bottom!='undefined' && bottom > obj.bounds.bottom.val){
            if (typeof obj.bounds.bottom.callback!='undefined')
               return obj.bounds.bottom.callback(obj)||false;
            return false;
         }

         var left = obj.left()||(obj.pos.x-obj.radius)||0;
         if (typeof obj.bounds.left!='undefined' && left < obj.bounds.left.val){
            if (typeof obj.bounds.left.callback!='undefined')
               return obj.bounds.left.callback(obj)||false;
            return false;
         }
      }
      return true;
   }
   function setVel(v,y){
      this.vel = new iio.Vec(v,y);
      return this
   }
   function setAcc(v,y){this.acc = new iio.Vec(v,y);return this}
   function setTorque(t){
      this.torque = t;
      if (typeof this.rotation == 'undefined')
         this.rotation=0;
      return this;
   }
   function setBound(direction, value, callback){
      if (typeof this.bounds =='undefined') this.bounds={};
      if (direction=='top'){
         this.bounds.top={};
         this.bounds.top.val=value;
         this.bounds.top.callback=callback;
      } else if (direction=='right'){
         this.bounds.right={};
         this.bounds.right.val=value;
         this.bounds.right.callback=callback;
      } else if (direction=='bottom'){
         this.bounds.bottom={};
         this.bounds.bottom.val=value;
         this.bounds.bottom.callback=callback;
      } else if (direction=='left'){
         this.bounds.left={};
         this.bounds.left.val=value;
         this.bounds.left.callback=callback;
      }
      return this;
   }
   function setBounds(top, right, bottom, left, callback){
      this.bounds = {};
      if (typeof top != 'undefined'){
         this.bounds.top = {};
         this.bounds.top.val = top;
         this.bounds.top.callback = callback;
      }
      if (typeof right != 'undefined'){
         this.bounds.right = {};
         this.bounds.right.val = right;
         this.bounds.right.callback = callback;
      }
      if (typeof bottom != 'undefined'){
         this.bounds.bottom = {};
         this.bounds.bottom.val = bottom;
         this.bounds.bottom.callback = callback;
      }
      if (typeof left != 'undefined'){
         this.bounds.left = {};
         this.bounds.left.val = left;
         this.bounds.left.callback = callback;
      }
      return this;
   }
   function shrink(s){
      this.shrinkRate = s;
      return this;
   }
   function stopKinematics(){
      this.vel=this.acc=this.torque=this.bounds=undefined;
   }
   function enableKinematics(){
      //this.update=updateProperties;
      this.enableUpdates(updateProperties);
      this.setVel=setVel;
      this.setAcc=setAcc;
      this.setTorque=setTorque;
      this.setBounds=setBounds;
      this.setBound=setBound;
      this.shrink=shrink;
      this.stopKinematics=stopKinematics;
      return this;
   }
   iio.Shape.prototype.enableKinematics = enableKinematics;
   iio.Text.prototype.enableKinematics = enableKinematics;
})();

//CollisionTag
(function () {
   //Definition
   function CollisionTag(){
      this.CollisionTag.apply(this, arguments);
   }; iio.CollisionTag=CollisionTag;

   //Constructor
   CollisionTag.prototype.CollisionTag = function(tag, callback){
      this.tag = tag;
      this.callback = callback;
   }
})();

//Group
(function () {
   //Definition
   function Group(){
      this.Group.apply(this, arguments);
   }; iio.Group=Group;

   //Constructor
   Group.prototype.Group = function(tag, zIndex) {
      this.tag = tag;
      this.zIndex = zIndex;
      this.objs = [];
   }

   //Functions
   Group.prototype.addObj = function(obj){
      this.objs[this.objs.length] = obj;
   }
   Group.prototype.rmvObj = function(obj){
      for (var i=0; i<this.objs.length; i++)
         if (obj == this.objs[i]){
            this.objs.splice(i,1);
            if (typeof obj.m_I !='undefined')
                return obj.GetWorld().DestroyBody(obj);
            return true;
            }
      return  false;
   }
   Group.prototype.rmvAll = function(){
      this.objs=[];
      return true;
   }
   Group.prototype.addCollisionCallback = function(tag, callback){
      if (typeof(this.collisionTags)=='undefined') this.collisionTags = [];
         this.collisionTags[this.collisionTags.length] = new iio.CollisionTag(tag, callback);
   }
   Group.prototype.update = function(dt){
      for (var i=this.objs.length-1; i>=0; i--)
         if (typeof this.objs[i]!='undefined'){
            if( typeof this.objs[i].update!='undefined' && !this.objs[i].update(dt))
               this.objs.splice(i,1);
            else if(this.objs[i].redraw)
               this.redraw=true;
         }
   }
   Group.prototype.draw = function(ctx,scale){
      for (var i=0; i<this.objs.length; i++){
         if (typeof this.objs[i].pos!='undefined')
            this.objs[i].draw(ctx);
         else if (typeof this.objs[i].m_I!='undefined')
            for (f=this.objs[i].GetFixtureList();f;f=f.m_next){
               s=f.GetShape(); 
               if (typeof s.draw!='undefined')
                  s.draw(ctx,new iio.Vec(this.objs[i].m_xf.position.x*scale,this.objs[i].m_xf.position.y*scale),this.objs[i].GetAngle(),scale);
           }
        else if (typeof this.objs[i].m_edgeA!='undefined')
            this.objs[i].draw(ctx,scale);
      }
   }
})();

 //AppManager
(function () {
   //Definition
   function AppManager(){
      this.AppManager.apply(this, arguments);
   }; iio.AppManager=AppManager;

   /* CONSTRUCTORS
    * App(app) //attaches full screen canvas to body
    * App(app, w, h) //attaches wxh canvas to body
    * App(app, canvasId) //assigns app to given canvas
    * App(app, elementId, w, h) //attaches wxh canvas to elementId
    */
   AppManager.prototype.AppManager = function(app, id, w, h){
      this.cnvs = [];
      this.ctxs = [];
      if (typeof app=='undefined') throw new Error("iio.start: No app provided");
      if (typeof w=='undefined' && iio.isString(id)) 
         this.addCanvas(id);
      else {
         if (iio.isString(id)){
            if (id=='auto'){
               h = w || 'auto';
               w = id;
               id = 'body';
            } else {
               w = w || 'auto';
               h = h || 'auto';
               if (id!='body'&&!document.getElementById(id))
                  throw new Error("iio.start: Invalid element id");
            }
         } else {
            h = w || 'auto';
            w = id || 'auto';
         }
         this.addCanvas(0, w, h, id);
      }
      this.canvas = this.cnvs[0];
      this.context = this.ctxs[0];
      this.app = new app(this);
      this.addWindowListeners();
   }
   /* APP CONTROL FUNCTIONS
    */
   AppManager.prototype.setFramerate = function( fps, callback, obj, ctx ){
      if (typeof callback!='undefined' && typeof callback.draw !='undefined'){
         if (typeof ctx!='undefined')
            var realCallback = ctx;
         ctx=obj||this.ctxs[0];
         obj=callback;
         callback = realCallback||function(){};
         obj.ctx=ctx;
      } else obj=obj||0;
      if (iio.isNumber(obj))
         obj=this.cnvs[obj];
      if (typeof obj.lastTime == 'undefined')
         obj.lastTime=0;
      if (typeof ctx != 'undefined')
         obj.ctx=ctx;
      iio.requestTimeout(fps,obj.lastTime, function(dt,args){
      	if(!args[1].pause) {
	         args[0].lastTime=dt;
	         args[1].setFramerate(fps,args[2],args[0]);
	         if (typeof args[0].update!='undefined')
	            args[0].update(dt);
	         if (typeof args[2]!='undefined')
	            args[2](dt);
	         if (args[0].redraw){
	            args[0].draw();
	            args[0].redraw=false;
	         }
	     } else args[1].setFramerate(fps,args[2],args[0]);
      }, [obj,this,callback]);
      return this;
   }
   AppManager.prototype.setNoDrawFramerate = function( fps, callback, obj, ctx ){
      if (typeof callback!='undefined' && typeof callback.draw !='undefined'){
         if (typeof ctx!='undefined')
            var realCallback = ctx;
         ctx=obj||this.ctxs[0];
         obj=callback;
         callback = realCallback||function(){};
         obj.ctx=ctx;
      } else obj=obj||0;
      if (iio.isNumber(obj))
         obj=this.cnvs[obj];
      if (typeof obj.lastTime == 'undefined')
         obj.lastTime=0;
      if (typeof ctx != 'undefined')
         obj.ctx=ctx;
      iio.requestTimeout(fps,obj.lastTime, function(dt,args){
         if(!args[1].pause) {
            args[0].lastTime=dt;
            args[1].setNoDrawFramerate(fps,args[2],args[0]);
            if (typeof args[0].update!='undefined')
               args[0].update(dt);
            if (typeof args[2]!='undefined')
               args[2](dt);
        } else args[1].setNoDrawFramerate(fps,args[2],args[0]);
      }, [obj,this,callback]);
      return this;
   }
   AppManager.prototype.pauseFramerate = function(pause,obj) {
      var o=obj||this;
      if (typeof pause=='undefined'){
         if (typeof o.pause=='undefined')
            o.pause=true;
         else o.pause=!o.pause;
      } else o.pause = pause;
	   return o;
   }
   AppManager.prototype.cancelFramerate = function(c){
      if (c instanceof iio.Obj) {
         clearTimeout(c.fsID);
         return c;
      } else {
         c=c||0;
         clearTimeout(this.cnvs[c].fsID);
      }
   }
   AppManager.prototype.setCursorStyle = function(style, c){
      this.cnvs[c||0].style.cursor = style||'default';
      return this;
   }
   //DEPRECATED: will be removed in future version, replaced by 'Shape.playAnim'
   AppManager.prototype.setAnimFPS = function(fps,obj,c){
      c=c||0;
      if (obj instanceof Array)
         this.setFramerate(fps,function(){
            for (var i=0;i<obj.length;i++)
               obj[i].nextAnimFrame()
         },obj,this.ctxs[c]);
      else
      this.setFramerate(fps,function(){obj.nextAnimFrame()},obj,this.ctxs[c]);
      return this;
   }
   AppManager.prototype.setB2Framerate = function( fps, callback ){
      if (typeof this.b2lastTime == 'undefined')
         this.b2lastTime=0;
      if (typeof this.b2World!='undefined' && !this.b2Pause)
         this.b2World.Step(1/this.fps, 10, 10);
      iio.requestTimeout(fps,this.b2lastTime, function(dt,args){
         args[0].b2lastTime=dt;
         args[0].setB2Framerate(fps,callback);
         if (typeof args[0].b2World!='undefined' && !args[0].b2Pause)
            args[0].b2World.Step(1/fps, 10, 10);
         callback(dt);
         if (typeof args[0].b2DebugDraw!='undefined'&&args[0].b2DebugDraw)
            args[0].b2World.DrawDebugData();
         else args[0].draw(args[0].b2Cnv);
         if (typeof this.b2World!='undefined')
            args[0].b2World.ClearForces();
      }, [this]);
      return this;
   }
   AppManager.prototype.pauseB2World = function(pause){
      if (typeof pause=='undefined'){
         if (typeof this.b2Pause=='undefined')
            this.b2Pause = true;
         else this.b2Pause = !this.b2Pause;
      } else this.b2Pause = pause;
   }
   AppManager.prototype.addB2World = function(world,c){
      this.b2World=world;
      this.b2Scale = 30;
      this.b2Cnv=c||0;
      return world;
   }
   /* CANVAS CONTROL FUNCTIONS
    */
   AppManager.prototype.update = function(dt){ 
      for (var c=0;c<this.cnvs.length;c++) 
         this.cnvs[c].update(dt);
   }
   AppManager.prototype.draw = function(i){
      if (typeof i =='undefined')
         for (var c=0;c<this.cnvs.length;c++)
               this.cnvs[c].draw(this.b2Scale);
      else this.cnvs[i].draw(this.b2Scale);
      return this;
   }
   AppManager.prototype.addCanvas = function( zIndex, w, h, attachId, cssClasses ){
      var i=this.cnvs.length;
      if (iio.isString(zIndex)){
         if (!document.getElementById(zIndex))
            throw new Error("AppManager.addCanvas: Invalid canvas id '"+zIndex+"'");
         this.cnvs[i]=document.getElementById(zIndex);
         this.ctxs[i] = this.cnvs[i].getContext('2d');
         if (typeof this.cnvs[i].getContext=='undefined') 
            throw new Error("AppManager.addCanvas: given id did not correspond to a canvas object");
         this.setCanvasProperties(i);
         this.setCanvasFunctions(i);
         this.addFocusListeners(i);
         return i;
      }

      //should fit to element, not window
      if (w=='auto') w=window.innerWidth;
      if (h=='auto') h=window.innerHeight;

      //Create the canvas
      this.cnvs[i]=document.createElement('canvas');
      this.cnvs[i].width = w || this.cnvs[0].width;
      this.cnvs[i].height = h || this.cnvs[0].height;
      this.cnvs[i].style.zIndex = zIndex || -i;
      
      //Attach the canvas
      if (iio.isString(attachId)){
         if (attachId=='body') document.body.appendChild(this.cnvs[i])
         else document.getElementById(attachId).appendChild(this.cnvs[i])
      } 
      else if (this.cnvs.length>1) {
         this.cnvs[i].style.position="absolute";
         var offset = this.getCanvasOffset();
         this.cnvs[i].style.left = offset.x+"px";
         this.cnvs[i].style.top = offset.y+"px";
         this.cnvs[i].style.margin = 0;
         this.cnvs[i].style.padding = 0;
         this.cnvs[0].parentNode.appendChild(this.cnvs[i]);
      } else document.body.appendChild(this.cnvs[i]);
      this.cnvs[i].className += "ioCanvas";
      
      if (attachId instanceof Array)
         for (var j=0;j<attachId.length;j++) 
            this.cnvs[i].className += " "+attachId[j];
      if (cssClasses instanceof Array)
         for (var j=0;j<cssClasses.length;j++) 
            this.cnvs[i].className += " "+cssClasses[j];
      else if (iio.isString(cssClasses))
         this.cnvs[i].className += " "+cssClasses;

      //TODO define specific display options and put styles back when app is terminated
      //also make everything relative to parent element instead of directly 'body'
      if (this.cnvs[i].width==window.innerWidth && this.cnvs[i].height==window.innerHeight){
         this.cnvs[i].style.display = "block"; //remove scrollbars
         this.cnvs[i].style.position = "absolute";
         this.cnvs[i].style.top = 0;
         document.body.style.overflow = 'hidden';
      }
      if (this.cnvs[i].width==window.innerWidth){
         document.body.style.marginLeft = document.body.style.marginRight
          = document.body.style.paddingLeft = document.body.style.paddingRight = "0";
         this.fullWidth=true;
      }
      if (this.cnvs[i].height==window.innerHeight){
         document.body.style.marginTop = document.body.style.marginBottom
          = document.body.style.paddingTop = document.body.style.paddingBottom = "0";
         this.fullHeight=true;
      }
      this.ctxs[i] = this.cnvs[i].getContext('2d');
      this.setCanvasProperties(i);
      this.setCanvasFunctions(i);
      this.addFocusListeners(i);
      return i;
   }
   AppManager.prototype.disableContextMenu=function(c){
         c=c||0;
         this.cnvs[c].oncontextmenu=function(){return false};  
   }
   AppManager.prototype.disableStaticCollisionChecks=function(c){
      this.cnvs[c||0].disableStaticCollisions=true;
      return this;
   }
   AppManager.prototype.setOnContextMenu=function(fn, c){
      c=c||0;
      this.cnvs[c].oncontextmenu=fn;
   }
   AppManager.prototype.setCanvasFunctions = function(c){
      this.ctxs[c].webkitImageSmoothingEnabled=true;

      this.cnvs[c].draw = function(scale){
         this.getContext('2d').clearRect( 0, 0, this.width, this.height );
         if (typeof this.groups!='undefined')
            for (var i=0; i<this.groups.length; i++)
               this.groups[i].draw(this.getContext('2d'),scale);
      }
      this.cnvs[c].update = function(dt){
         if (typeof(this.groups) != 'undefined')
         for (var i=this.groups.length-1; i>=0; i--){
            this.groups[i].update(dt);
            var j=0;
            while (typeof(this.groups[i].collisionTags) != 'undefined'&&j<this.groups[i].collisionTags.length){
               this.checkCollisions(this.groups[i], this.groups[this.indexOfTag(this.groups[i].collisionTags[j].tag)], this.groups[i].collisionTags[j].callback);
               j++;
            }
            if (this.groups[i].redraw)
               this.redraw=true;
         }
      }
      this.cnvs[c].indexOfTag = function(tag){
         if (typeof(this.groups)!='undefined')
            for (var i=0; i<this.groups.length; i++)
               if (this.groups[i].tag == tag)
                  return i;
         return 'NO';
      }
      this.cnvs[c].checkCollisions = function(group1, group2, callback){
         if (group1==group2){
            var cPairs=[];
            var alreadyDealtWith;
            var q,p;
         }
         for (var i=0; i<group1.objs.length; i++)
            for (var j=0; j<group2.objs.length; j++)
               if (typeof(group1.objs[i]) != 'undefined' 
                  && group1.objs[i] != group2.objs[j]
                  && !(typeof this.disableStaticCollisions!='undefined'
                     && this.disableStaticCollisions
                        && (typeof group1.objs[i].vel == 'undefined' 
                           && typeof group2.objs[j].vel == 'undefined')
                        && !((typeof group1.objs[i].vel != 'undefined' 
                           && group1.objs[i].vel.length() != 0)
                           && (typeof group2.objs[j].vel != 'undefined'
                           && group2.objs[j].vel.length() != 0)))
                  && iio.intersects(group1.objs[i], group2.objs[j])){
                  if (cPairs instanceof Array){
                     alreadyDealtWith = false;
                     for (p=0; p<cPairs.length;p++)
                        if (i==cPairs[p][0] && j==cPairs[p][1]
                           ||i==cPairs[p][1] && j==cPairs[p][0])
                           alreadyDealtWith=true;
                     if (!alreadyDealtWith){
                        q = cPairs.length;
                        cPairs[q] = [];
                        cPairs[q][0] = i;
                        cPairs[q][1] = j;
                        callback(group1.objs[i], group2.objs[j]);
                     }
                  } else
                     callback(group1.objs[i], group2.objs[j]);
            }
      }
   }
   AppManager.prototype.setCanvasProperties = function(c){
      this.cnvs[c].pos = this.getCanvasOffset(c);
      this.cnvs[c].center = new iio.Vec(this.cnvs[c].width/2, this.cnvs[c].height/2);
   }
   AppManager.prototype.addFocusListeners = function(i){
      this.focused=false;
      this.cnvs[i].addEventListener('mouseover', function(event){
         this[0].focused=true;
         if (typeof this[0].app.focusOn != 'undefined')
            this[0].app.focusOn(event, i);
      }.bind([this, i]), false)
      this.cnvs[i].addEventListener('mouseout', function(event){
         this[0].focused=false;
         if (typeof this[0].app.focusOff != 'undefined')
            this[0].app.focusOff(event, i);
      }.bind([this, i]), false)
   }
   AppManager.prototype.addWindowListeners = function(){
      iio.addEvent(window, 'resize', function(event){
         if (this.fullWidth) this.canvas.width = window.innerWidth;
         if (this.fullHeight) this.canvas.height = window.innerHeight;
         for (var c=0; c<this.cnvs.length;c++){
            this.setCanvasProperties(c);
            if (c>0){
               this.cnvs[c].style.left = this.cnvs[0].offsetLeft+"px";
               this.cnvs[c].style.top = this.cnvs[0].offsetTop+"px";
            }

         }
         if (typeof this.app.onResize != 'undefined')
            this.app.onResize(event);
      }.bind(this), false);
      iio.addEvent(window, 'scroll', function(event){
         for (var c=0; c<this.cnvs.length;c++)
            this.setCanvasProperties(c);
            if (typeof this.app.onScroll != 'undefined')
               this.app.onScroll(event);
      }.bind(this), false);
   }
   AppManager.prototype.drawPartialPixels = function(turnOn){
      turnOn=turnOn||true;
      if (turnOn) this.partialPixels = true;
      else this.partialPixels = false;
      return this;
   }
   AppManager.prototype.activateB2Debugger = function(turnOn,c){
      turnOn=turnOn||true;
      c=c||0;
      if (turnOn){
         this.b2DebugDraw = new Box2D.Dynamics.b2DebugDraw();
         this.b2DebugDraw.SetSprite(this.ctxs[c]);
         this.b2DebugDraw.SetDrawScale(this.b2Scale);
         this.b2DebugDraw.SetFillAlpha(0.5)
         this.b2DebugDraw.SetLineThickness(1.0)
         this.b2DebugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit)
         this.b2World.SetDebugDraw(this.b2DebugDraw);
         return this.b2DebugDraw;
      }
   }

   /* SOUND CONTROL
    */
    AppManager.prototype.playSound = function(pathToSound){
      if (typeof this.muted == 'undefined' || !this.muted) 
         iio.playSound(pathToSound);
      return this;
    }
    AppManager.prototype.mute = function(yes){
      if (typeof this.muted == 'undefined') 
         this.muted = true;
      if (typeof yes != 'undefined')
         this.muted = yes;
      return this;
    }

   /* GROUP CONTROL FUNCTIONS
    */
   AppManager.prototype.addGroup = function(tag, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined') this.cnvs[c].groups = [];
      var z = zIndex || 0;
      var i = this.indexFromzIndexInsertSort(z, this.cnvs[c].groups);
      this.cnvs[c].groups.insert(i, new iio.Group(tag, z));
      return i;
   }
   AppManager.prototype.addToGroup = function(tag, obj, zIndex, c){
      c=c||0;
      var i = this.indexOfTag(tag, c);
      var a = iio.isNumber(i);
      if (typeof(this.cnvs[c].groups)=='undefined'||!a) 
         i = this.addGroup(tag, zIndex, c);
      this.cnvs[c].groups[i].addObj(obj, c);
      if (typeof this.fps == 'undefined' && typeof obj.pos!='undefined')
         obj.draw(this.ctxs[c]);
      return obj;
   }
   AppManager.prototype.getGroup = function(tag,c,from,to) {
   		c=c||0;
   		var i = this.indexOfTag(tag,c),
	   	   	a = iio.isNumber(i);
	   	   
	   if(typeof(this.cnvs[c].groups)=='undefined'||!a)
		   return false;
		var objs	=	this.cnvs[c].groups[i].objs;
		
		if(typeof(from) !== 'undefined' && from >= 0) {
			to=to||(from+1);
			return objs.slice(from,to);
		}
		return objs;
   }
   AppManager.prototype.addObj = function(obj, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined') this.cnvs[c].groups = [];
      zIndex = zIndex || 0;
      for (var i=0; i<this.cnvs[c].groups.length; i++)
         if (this.cnvs[c].groups[i].tag == 0){
            this.cnvs[c].groups[i].addObj(obj);
            if (typeof this.fps == 'undefined' && typeof obj.pos!='undefined')
               obj.draw(this.ctxs[c]);
            return obj;
         }
      this.addGroup(zIndex, zIndex, c);
      this.addToGroup(zIndex, obj, zIndex, c);
      if (typeof this.fps == 'undefined' && typeof obj.pos!='undefined')
         obj.draw(this.ctxs[c]);
      return obj;
   }
   AppManager.prototype.indexFromzIndexInsertSort = function(zIndex, arr){
      var i = 0;
      while(i<arr.length && arr[i].zIndex < zIndex) i++;
      return i;
   }
   AppManager.prototype.indexOfTag = function(tag, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)!='undefined')
         for (var i=0; i<this.cnvs[c].groups.length; i++)
            if (this.cnvs[c].groups[i].tag == tag)
               return i;
      return 'NO';
   }
   AppManager.prototype.setCollisionCallback = function(tag1, tag2, callback, c){
      if (typeof callback=='undefined' || iio.isNumber(callback)){
         callback = tag2;
         tag2 = tag1;
      }
      this.cnvs[c||0].groups[this.indexOfTag(tag1)].addCollisionCallback(tag2, callback);
   }
   AppManager.prototype.rmv = function(obj, group, c){
         if (iio.isNumber(group)) return this.rmvObj(obj,group);
         else if (typeof group == 'undefined') {
            if (iio.isString(obj))
               return this.rmvGroup(obj);
            return this.rmvObj(obj);
         } else return this.rmvFromGroup(group,obj,c);
   }
   AppManager.prototype.delayRmv = function(time, obj, group, c){
      obj.io=this;
      setTimeout(function(){obj.io.rmv(obj,group,c)},time);
   }
   AppManager.prototype.rmvObj = function(obj,c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)!='undefined')
         for (var i=0; i<this.cnvs[c].groups.length; i++){
            if (typeof obj.K=='undefined'){
               this.cancelFramerate(obj);
               if (typeof this.cnvs[c].fps=='undefined')
                  obj.clearSelf(this.ctxs[c]);
            }
            if (this.cnvs[c].groups[i].rmvObj(obj))
               return true;
         }
      return false;
   }
   AppManager.prototype.rmvGroup = function(tag,c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)!='undefined')
         if (typeof(this.cnvs[c].groups)!='undefined')
            for (var i=0; i<this.cnvs[c].groups.length; i++)
               if (this.cnvs[c].groups[i].tag==tag)
                  return this.cnvs[c].groups.splice(i,1);
   }
   AppManager.prototype.rmvAll = function(c){
      if (typeof c =='undefined'){
         for (c=0;c<this.cnvs.length;c++)
            if (typeof(this.cnvs[c].groups)!='undefined')
               this.cnvs[c].groups=[];
      } else if (typeof(this.cnvs[c].groups)!='undefined')
         this.cnvs[c].groups=[];
      return this;
   }
   AppManager.prototype.rmvFromGroup = function(tag, obj, c){
      if (typeof c=='undefined'){
         if (iio.isNumber(obj)||typeof obj=='undefined'){
            c=obj||0;
            return this.clearGroup(tag,c);
         } else for (c=0;c<this.cnvs.length;c++)
            if (typeof(this.cnvs[c].groups)!='undefined')
               for (var i=0; i<this.cnvs[c].groups.length; i++)
                  if (this.cnvs[c].groups[i].tag==tag)
                     return this.cnvs[c].groups[i].rmvObj(obj);
      } else if (typeof(this.cnvs[c].groups)!='undefined')
            for (var i=0; i<this.cnvs[c].groups.length; i++)
               if (this.cnvs[c].groups[i].tag==tag)
                  return this.cnvs[c].groups[i].rmvObj(obj);
      return false;
   }
   AppManager.prototype.clearGroup = function(tag,c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)!='undefined')
         for (var i=0; i<this.cnvs[c].groups.length; i++)
            if (this.cnvs[c].groups[i].tag==tag)
               return this.cnvs[c].groups[i].rmvAll();
   }
   /* BG Control
    */
   AppManager.prototype.setBGColor = function(color, c){
      c=c||0;
      this.cnvs[c].style.backgroundColor=color;
      return this;
   }
   AppManager.prototype.setBGPattern = function(src, c){
      c=c||0;
      this.cnvs[c].style.backgroundImage="url('"+src+"')";
      return this;
   }
   AppManager.prototype.setBGImage = function(src,scaled,c){
      if (iio.isNumber(scaled)) c=scaled;
      else c=c||0;
      if (scaled){
         this.cnvs[c].style.backgroundRepeat="no-repeat";
         this.cnvs[c].style.background='url(images/bg.jpg) no-repeat center center fixed'; 
         this.cnvs[c].style.WebkitBackgroundSize='cover';
         this.cnvs[c].style.MozBackgroundSize='cover';
         this.cnvs[c].style.OBackgroundSize='cover';
         this.cnvs[c].style.backgroundSize='cover';
         this.cnvs[c].style.Filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='."+src+"', sizingMethod='scale')";
         this.cnvs[c].style.MsFilter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')";
      } else this.cnvs[c].style.backgroundRepeat="no-repeat";
      return this.setBGPattern(src, c);
   }

   /* Utility
    */
   AppManager.prototype.getEventPosition = function(event, c){
      c=c||0;
      var pos;
      if (iio.isiPad) {
         if (event.touches==null || event.touches.item(0)==null) return -1;
         else pos = new iio.Vec(event.touches.item(0).screenX, event.touches.item(0).screenY);
      } pos = new iio.Vec(event.clientX, event.clientY);
      pos.sub(this.cnvs[c].pos);
      return pos;
   }
   AppManager.prototype.getCanvasOffset = function(c){
      c=c||0;  
      var p=this.cnvs[c].getBoundingClientRect();
      return new iio.Vec(p.left,p.top);
   }

   /* B2D Helpers
    */
    AppManager.prototype.getB2BodyAt = function(callback,v,y){
      if (typeof v.x =='undefined')
         v=new Box2D.Common.Math.b2Vec2(v,y);
      var aabb = new Box2D.Collision.b2AABB();
      aabb.lowerBound.Set(v.x - 0.001, v.y - 0.001);
      aabb.upperBound.Set(v.x + 0.001, v.y + 0.001);
      function getBodyCB(fixture){
         if(fixture.GetBody().GetType() != Box2D.Dynamics.b2Body.b2_staticBody) 
         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), v)) 
            return fixture.GetBody();
         return false;
      }
      return this.b2World.QueryAABB(getBodyCB, aabb);
    }
})();