/*
   iio engine
   Version 1.3.0 Beta
   Last Update 5/30/2014
   This version was never released for production or use

   info: iioengine.com

---------------------------------------------------------------------
The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2014, Sebastian Bierman-Lytle
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
iio={};
(function(){
   Array.prototype.insert = function (index, item) {
      this.splice(index, 0, item);
      return this;
   }
   function emptyFn() {};
   iio.inherit = function(child, parent) {
      var tmp = child;
      emptyFn.prototype = parent.prototype;
      child.prototype = new emptyFn();
      child.prototype.constructor = tmp;
   }
   iio.loop=function(fps,caller,fn){
      if(iio.isNumber(fps)||typeof window.requestAnimationFrame=='undefined'){
         function loop(){
            var n = new Date().getTime();
            var correctedFPS = Math.floor(Math.max(0, 1000/fps - (n - (caller.last||0))));
            caller.last = n + correctedFPS;
            fn(window.setTimeout(loop,correctedFPS),caller,correctedFPS/(1000/fps));
         }; 
         return window.setTimeout(loop,1000/fps)
      } else {
         if(typeof caller=='undefined')
            caller=fps;
         function animloop(){ 
            caller(window.requestAnimationFrame(animloop),fps,1) 
         }
         return window.requestAnimationFrame(animloop);
      }
   }
   iio.start=function(app,id,w,h,p){
      if(app instanceof Array) 
         return iio.addApp(new iio.App(app[0],id,w,h,p,app[1]));
      return iio.addApp(new iio.App(app,id,w,h,p));
   }
   iio.apps=[];
   iio.addApp=function(app){
      iio.apps.push(app);
      return app;
   }
   iio.addEvent = function(obj,evt,fn,capt){  
      if(obj.addEventListener) {  
         obj.addEventListener(evt, fn, capt);  
         return true;  
      } else if(obj.attachEvent) {  
         obj.attachEvent('on'+evt, fn);  
         return true;  
      } else return false;  
   }
   //if fullscreen...
   iio.addEvent(window, 'resize', function(event){
      if(iio.apps&&iio.apps.length>0)
         for(var i=0;i<iio.apps.length;i++)
            iio.apps[i].resize(event);
   });
   iio.isNumber=function(o){return !isNaN(o-0)&&o!==null&&o!==""&&o!==false&&o!==true}
   iio.isString=function(s){return typeof s=='string'||s instanceof String}
   iio.isFunction=function(fn){var getType = {};return fn&&getType.toString.call(fn)==='[object Function]'}
   iio.randomColor = function() {return "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"}
   iio.randomNum = function(min, max) {
      min=min||0;max=max||1;
      return Math.random() * (max - min) + min;
   }
   iio.randomInt = function(min, max) {
      min=min||0;max=max||1;
      return Math.floor(Math.random() * (max - min)) + min;}
   iio.invertColor=function(c){
      var ss=c.substr(c.indexOf(',')+1);
      var ss2=ss.substr(ss.indexOf(',')+1);
      return "rgb("+(255-parseInt(c.substr(c.indexOf('(')+1,c.indexOf(',')),10))+","+(255-parseInt(ss.substr(0,ss.indexOf(',')),10))+","+(255-parseInt(ss2.substr(0,ss2.indexOf(')')),10))+")"
   }
   iio.loadImage=function(src,fn){
      var img=new Image();
      img.src=src;
      img.onload=fn;
      return img;
   }
   iio.specVertex = function(vertices,comparator){
      var v = vertices[0];
      for (var i=0;i<vertices.length;i++)
         if (comparator(v,vertices[i]))
            v=vertices[i];
      return v;
   }
   iio.compareArrayItems=function(index,arr,comp){
      var i=0;
      while(i<arr.length&&comp(index,arr[i]))i++;
      return i;
   }
   iio.vecsFromPoints = function(points){
      var vecs = [];
      if(!(points instanceof Array))points=[points];
      for (var i=0;i<points.length;i++){
         if (typeof points[i].x !='undefined')
            vecs.push(new iio.Vec(points[i]));
         else {
            vecs.push(new iio.Vec(points[i],points[i+1]));
            i++;
         }
      } return vecs;
   }
   iio.rotatePoint = function(x,y,r){
      if (typeof x.x!='undefined'){ r=y; y=x.y; x=x.x; }
      if (typeof r=='undefined'||r==0) return new iio.Vec(x,y);
      var newX = x * Math.cos(r) - y * Math.sin(r);
      var newY = y * Math.cos(r) + x * Math.sin(r);
      return new iio.Vec(newX,newY);
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
      for (var _k=0;_k<key.length;_k++)
         if(str==key[_k])
            return true;
      return false;
   }
})();

//App
(function(){
   function App(){
      this.App.apply(this,arguments);
   }; iio.App=App;
   App.prototype.App=function(app,id,w,h,p,s){
      this.cnvs=[];
      this.addCanvas(id,w,h,p);
      this.center=this.cnvs[0].center;
      this.ctx=this.cnvs[0].ctx;
      this.width=this.cnvs[0].width;
      this.height=this.cnvs[0].height;
      this.add=function(p,s,t){return this.cnvs[0].add(p,s,t)}
      this.rmv=function(o){return this.cnvs[0].rmv(o)}
      this.setBGColor=function(c){this.cnvs[0].setBGColor(c);return this}
      this.setBGPattern=function(c){this.cnvs[0].setBGPattern(c);return this}
      this.setBGImage=function(c,s){this.cnvs[0].setBGImage(c,s);return this}
      this.draw=function(){this.cnvs[0].draw()}
      this.addCollisionCallback=function(t1,t2,fn){this.cnvs[0].addCollisionCallback(t1,t2,fn);return this}
      this.getEventPosition=function(e){return this.cnvs[0].getEventPosition(e)}
      this.onInputDown=function(fn){
         this.cnvs[0].onmousedown=fn;
         return this;
      }
      this.onInputUp=function(fn){
         this.cnvs[0].onmouseup=fn;       
         return this;
      }
      this.onInputMove=function(fn){
         this.cnvs[0].onmousemove=fn;  
         return this;
      }
      this.partialPixels=true;
      this.app = new app(this,s);
   }
   App.prototype.loop=function(t,fn){
      if(!iio.isNumber(t))fn=t;
      if(!this.loops)this.loops=[];
      var __i=this.loops.length;
      function looper(id,app,dt){
         if(!app.pause){
            app.update(dt);
            app.loops[__i]=id;
         } if(fn)fn();
      }
      if(iio.isNumber(t)) this.loops[__i]=iio.loop(t,this,looper);
      else this.loops[__i]=iio.loop(this,looper);
      return this.loops.length-1;
   }
   App.prototype.update=function(dt){
      if(typeof dt=='undefined')dt=1;
      var redraw=false;
      for(var i=0;i<this.cnvs.length;i++){
         redraw=false;
         if(this.cnvs[i].collisions){
            var i;var j;
            for(var q=0;q<this.cnvs[i].collisions.length;q++)
               for(p=0;p<this.cnvs[i].objs.length;p++)
                  if(this.cnvs[i].objs[p].tag==this.cnvs[i].collisions[q].t1)
                     for(j=0;j<this.cnvs[i].objs.length&&this.cnvs[i].objs[p];j++)
                        if(this.cnvs[i].objs[j].tag==this.cnvs[i].collisions[q].t2)
                           if(iio.collision(this.cnvs[i].objs[p],this.cnvs[i].objs[j]))
                              this.cnvs[i].collisions[q].fn(this.cnvs[i].objs[p],this.cnvs[i].objs[j])
         }
         for(var j=0;j<this.cnvs[i].objs.length;j++){
            if(!this.cnvs[i].objs[j].update(dt)){
               this.cnvs[i].rmv(j);
            }
            else if(this.cnvs[i].objs[j].redraw)
               redraw=true;
         }
         if(redraw)
            this.cnvs[i].draw();
      }

   }
   App.prototype.resize=function(e){
      for(var i=0;i<this.cnvs.length;i++){
         var redraw=false;
         if(this.cnvs[i].fullWidth){
            this.cnvs[i].width=window.innerWidth;
            redraw=true;
         }
         if(this.cnvs[i].fullHeight){
            this.cnvs[i].height=window.innerHeight;
            redraw=true;
         }
         if(redraw){
            this.cnvs[i].center=new iio.Vec(this.cnvs[i].width/2,this.cnvs[i].height/2)
            if(this.app.resize)this.app.resize(e);
            this.cnvs[i].draw();
            return;
         }
      }
      if(this.app.resize)this.app.resize(e);
   }
   App.prototype.addCanvas=function(z,id,w,h,p){
      var c;
      if(z instanceof Array){
         var i=0;
         while(i<z.length){
            if(z[i+1]&&iio.isString(z[i+1])&&z[i+1]!='100%') this.addCanvas(z[i]);
            else if(z[i+2]&&iio.isString(z[i+2])&&z[i+2]!='100%'){this.addCanvas(z[i],z[i+1]);i++;}
            else if(z[i+3]&&iio.isString(z[i+3])&&z[i+3]!='100%'){this.addCanvas(z[i],z[i+1],z[i+2]);i+=2}
            else{this.addCanvas(z[i],z[i+1],z[i+2],z[i+3]);i+=3;}
            i++;
         }; 
         if(id)for(i=0;i<this.cnvs.length;i++)
            this.cnvs[i].addAttributes(id);
         return this.cnvs[i-1];
      } else finish=function(o){
         c.addAttributes=function(p){
            if(p.id)this.id=p.id;
            if(p.z)this.style.zIndex=p.z;
            if(p.style)this.style.cssText+=p.style;
            if(p.class){
               if(p.class instanceof Array){
                  this.className+=this.className?' '+p.class[0]:p.class[0];
                  for(var i=1;i<p.class.length;i++)
                     this.className+=' '+p.class[i];
               } else this.className+=this.className?' '+p.class:p.class;
            }
         }; if(p)c.addAttributes(p);
         c.setBGColor = function(color){
            this.style.backgroundColor=color; return this;
         }
         c.setBGPattern = function(src){
            this.style.backgroundImage="url('"+src+"')"; return this;
         }
         c.setBGImage = function(src,scaled){
            if (scaled===true){
               this.style.backgroundRepeat="no-repeat";
               this.style.background='url('+src+') no-repeat center center'; 
               this.style.WebkitBackgroundSize='cover';
               this.style.MozBackgroundSize='cover';
               this.style.OBackgroundSize='cover';
               this.style.backgroundSize='cover';
               this.style.Filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='."+src+"', sizingMethod='scale')";
               this.style.MsFilter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='scale')";
            } else this.style.backgroundRepeat="no-repeat";
            return this.setBGPattern(src);
         }
         c.getEventPosition = function(e){
            var pos;
            if (iio.isiPad) {
               if (e.touches==null || e.touches.item(0)==null) return -1;
               else pos = new iio.Vec(e.touches.item(0).screenX, e.touches.item(0).screenY);
            } pos = new iio.Vec(e.clientX, e.clientY);
            pos.sub(this.pos);
            return pos;
         }
         c.draw=function(){
            this.ctx.clearRect(0,0,this.width,this.height);
            if(this.objs&&this.objs.length>0)
               for(var i=0;i<this.objs.length;i++){
                  if(typeof(this.objs[i].display)=='undefined'||this.objs[i].display)
                     iio.draw(this.ctx,this.objs[i]);
               }
         }
         iio.attachGroupAPI(c);
         c._add=c.add;
         c.add=function(p,s,t){
            return c._add(p,s,t,this.ctx);
         }
         var offset=c.getBoundingClientRect();
         c.pos=new iio.Vec(offset.left,offset.top);
         c.center=new iio.Vec(c.width/2,c.height/2);
         c.onInputDown=function(fn,c){
            this.onmousedown=fn;
            return this;
         }
         c.onInputUp=function(fn){
            this.onmouseup=fn;       
            return this;
         }
         c.onInputMove=function(fn){
            this.onmousemove=fn;  
            return this;
         }
         c.ctx=c.getContext('2d');
         c.ctx.webkitImageSmoothingEnabled=true;
         o.cnvs.push(c);
         return c;
      }
      if(z&&z.nodeName&&z.nodeName.toLowerCase()==='canvas'){
         c=z;p=id;return finish(this);
      } else {
         createCanvas=function(e,_w,_h){
            c=document.createElement('canvas');
            e=e||document.body;
            if(_w===undefined){
               _w=window.innerWidth;
               c.fullWidth=true;
            } 
            if(_h===undefined){
               _h=window.innerHeight;
               c.fullHeight=true;
            } 
            c.width=_w;
            c.height=_h;
            c.style.position="absolute";
            c.style.margin=0;
            c.style.padding=0;
            c.style.left=0;
            c.style.top=0;
            c.objs=[];
            e.appendChild(c);
         }
         if (iio.isString(z)){
            c=document.getElementById(z);
            if(!c)throw new Error("addCanvas: no element exists with id '"+z+"'");
            p=id;
            if(c.nodeName&&c.nodeName.toLowerCase()!=='canvas'){
               if(!(id instanceof Object)){
                  if(!w&&!h&&!p){
                     w=id;h=w;
                  }else if(!(w instanceof Object)){
                     p=h;h=w;
                  } else {
                     p=w;h=id;
                  } w=id;
               }
               createCanvas(c,w,h);
            } 
         } else {
            if(iio.isNumber(z)||z instanceof Object){
               p=id||z;id=iio.isNumber(z)?z:0;
               createCanvas(this.cnvs[id].parentElement,this.cnvs[id].style.width,this.cnvs[id].style.height)
               c.style.zIndex=z;
            } else createCanvas();
         }
      }
      /*if(iio.isNumber(z))
         c.style.zIndex=z;
      else if(!iio.isString(z))
         p=z;*/
      
      //if canvas is not full screen
      /*var offset=c.getBoundingClientRect();
      c.pos=new iio.Vec(offset.left,offset.top);
      c.style.left=c.pos.x+"px";
      c.style.top=c.pos.y+"px";*/
      return finish(this);
   }
})();

//Obj
(function () {
   //Definition
   function Obj(){
      this.Obj.apply(this, arguments);
   }; iio.Obj=Obj;

   //Constructor
   Obj.prototype.Obj = function(v,p,p1){
      if(typeof v!='undefined'){
         var vs;
         if(iio.isNumber(p)){
            vs=iio.vecsFromPoints([v,p]);
            p=p1;
         } else vs=iio.vecsFromPoints(v);
         this.pos=new iio.Vec(vs[0]);
         iio.attachGraphicsAPI(this);
         this.init(p);
         if(this.img){
            if(!p.width){
               if(!p.radius){
                  this.width=this.img.width||this.img.w;
                  this.height=this.img.height||this.img.h;
               } else (this.radius=this.img.width||this.img.w)/2;
            }
         }
         if(this.anims){
            if(!this.width){
               if(!this.radius){
                  this.width=this.anims[0].imgs[0].width||this.anims[0].imgs[0].w;
                  this.height=this.anims[0].imgs[0].height||this.anims[0].imgs[0].h;
               } else this.radius=this.anims[0].imgs[0].width/2||this.anims[0].imgs[0].w/2;
            }
         }
         if(vs.length==2){
            this.endPos=vs[1].clone();
            this.initLine();
         } else if(vs.length>2){
            this.vs=[];
            for(var i=1;i<vs.length;i++)
               this.vs[i-1]=vs[i];
            this.initPoly();
         } 
         if(this.C||this.R)this.initGrid(); 
         else if(this.radius) this.initCircle();
         else if(this.width) this.initRect();
         if(this.bezier)this.bezier=iio.vecsFromPoints(p.bezier);
      }
   }
   getTrueVertices=function(pos,vs,r){
      var vList=[];
      for(var i=0;i<vs.length;i++)
         vList[i]=iio.Vec.add(pos,iio.rotatePoint(vs[i].x,vs[i].y,r));
      return vList;
   }
   Obj.prototype.initRect=function(){
      this.height=this.height||this.width;   
      this.left = function(){ return this.pos.x-this.width/2; }
      this.right = function(){ return this.pos.x+this.width/2; }
      this.top = function(){ return this.pos.y-this.height/2; }
      this.bottom = function(){ return this.pos.y+this.height/2; }
      this.contains=function(v,y){
         y=v.y||y;
         v=v.x||v;
         v-=this.pos.x;
         y-=this.pos.y;
         if (v>-this.width/2&&v<this.width/2&&y>-this.height/2&&y<this.height/2)
            return true;
         return false;
      } 
      this.vertices = function(){
         var vs=iio.vecsFromPoints([-this.width/2,-this.height/2
                                        ,this.width/2,-this.height/2
                                        ,this.width/2,this.height/2
                                        ,-this.width/2,this.height/2]);
         var vList=[];
         for(var i=0;i<vs.length;i++)
            vList[i]=iio.Vec.add(this.pos,iio.rotatePoint(vs[i].x,vs[i].y,this.rotation));
         return vList;
      }
      this.draw=function(ctx){
         if (typeof this.styles != 'undefined'&&typeof this.styles.rounding!='undefined'&& this.styles.rounding!=0)
            iio.drawRoundedRectPath(this);
         if(this.X){
            ctx.translate(-Math.floor(this.width/2),-Math.floor(this.height/2));
            iio.drawLine(ctx,0,0,this.width,this.height);
            iio.drawLine(ctx,this.width,0,0,this.height);
            ctx.translate(Math.floor(this.width/2),Math.floor(this.height/2));
         } else iio.completeDraw(ctx,this);
      }
   }
   Obj.prototype.initLine=function(){
      this.draw=function(ctx){
         if(this.bezier) return iio.drawBezierCurve(ctx,this.pos,this.endPos,this.bezier,this.bezierStyles)
         return iio.drawLine(ctx,0,0,this.endPos.x-this.pos.x,this.endPos.y-this.pos.y);
      }
   }
   Obj.prototype.initCircle=function(){
      this.left = function(){ return this.pos.x-this.radius }
      this.right = function(){ return this.pos.x+this.radius }
      this.top = function(){ return this.pos.y-this.radius }
      this.bottom = function(){ return this.pos.y+this.radius }
      this.contains=function(v,y){
         if(v.x===undefined)v=new iio.Vec(v,y);
         if (v.distance(this.pos) < this.radius)
            return true;
         return false;
      }
      this.draw=function(ctx){
         iio.drawCircle(ctx,this.radius)
         iio.completeDraw(ctx,this)
      }
   }
   Obj.prototype.initPoly=function(){
      this.left = function(){ return iio.specVertex(this.vertices(),function(v1,v2){if(v1.x>v2.x)return true;return false}).x }
      this.right = function(){ return iio.specVertex(this.vertices(),function(v1,v2){if(v1.x<v2.x)return true;return false}).x }
      this.top = function(){ return iio.specVertex(this.vertices(),function(v1,v2){if(v1.y>v2.y)return true;return false}).y }
      this.bottom = function(){ return iio.specVertex(this.vertices(),function(v1,v2){if(v1.y<v2.y)return true;return false}).y }
      this.contains = function(v,y){
         y=(v.y||y);
         v=(v.x||v);
         var i = j = c = 0;
         var vs = this.vs();
         for (i = 0, j = vs.length-1; i < vs.length; j = i++) {
            if ( ((vs[i].y>y) != (vs[j].y>y)) &&
               (v < (vs[j].x-vs[i].x) * (y-vs[i].y) / (vs[j].y-vs[i].y) + vs[i].x) )
                  c = !c;
         } return c;
      }
      this.vertices = function(){
         var vList=[];
         for(var i=0;i<this.vs.length;i++)
            vList[i]=iio.Vec.add(this.pos,iio.rotatePoint(this.vs[i].x,this.vs[i].y,this.rotation));
         return vList;
      }
      this.draw=function(ctx){
         iio.drawPoly(ctx,this.vs.insert(0,this.pos));
         iio.completeDraw(ctx,this);
      }
   }
   Obj.prototype.initGrid=function(){
      this.C = Math.floor(this.C);
      this.R = Math.floor(this.R);
      if(typeof this.res=='undefined') 
         this.res=new iio.Vec(Math.floor(this.width/this.C),Math.floor(this.height/this.R));
      this.cellCenter = function(c,r,pixelPos){
         if (c&&c.x!==undefined){
            if (r||false) return this.cellCenter(this.cellAt(c));
            return new iio.Vec(this.pos.x-this.width/2+c.x*this.res.x+this.res.x/2,this.pos.y-this.height/2+c.y*this.res.y+this.res.y/2);
         } else {
            if (pixelPos||false) return this.cellCenter(this.cellAt(c,r));
            return new iio.Vec(this.pos.x-this.width/2+c*this.res.x+this.res.x/2,this.pos.y-this.height/2+r*this.res.y+this.res.y/2);
         }
      }
      this.cellAt = function(pos,y,pixelPos){
         if(pos.x===undefined)pos=new iio.Vec(Math.floor(pos),Math.floor(y));
         else pixelPos=y;
         if(pixelPos) pos = new iio.Vec(Math.floor((pos.x-this.pos.x+this.width/2)/this.res.x),Math.floor((pos.y-this.pos.y+this.height/2)/this.res.y));
         if (pos.x >= 0 && pos.x < this.C && pos.y >=0 && pos.y < this.R)
            return this.cells[pos.x][pos.y];
         return false;
      }
      this.draw = function(ctx){
         return iio.drawGrid(ctx,this.width,this.height,this.C,this.R,this.res.x,this.res.y);
      }
   }
   
   //Functions
   Obj.prototype.clone = function(){ 
      return new Obj(this.pos,this);
   }
   Obj.prototype.update = function(dt){
      if(this.acc){
         if(this.acc.x)this.vel.x+=this.acc.x*dt;
         if(this.acc.y)this.vel.y+=this.acc.y*dt;
         if(this.acc.z)this.vel.r+=this.acc.z*dt;
         this.redraw=true;
      }
      if(this.vel){
         if(this.vel.x){
            this.pos.x+=this.vel.x*dt;
            if(this.vs) for(var i=0;i<this.vs.length;i++)
                  this.vs[i].x+=this.vel.x*dt;
         }
         if(this.vel.y){
            this.pos.y+=this.vel.y*dt;
            if(this.vs) for(var i=0;i<this.vs.length;i++)
                  this.vs[i].y+=this.vel.y*dt;
         }
         if(this.vel.z)this.rotation+=this.vel.z*dt;
         this.redraw=true;
      }
      if(this.bounds){
         if(this.bounds.top&&this.pos.y<this.bounds.top){
            if(this.bounds.t_callback){
               if(this.bounds.t_callback(this))
                  return false;
               return true;
            }
            return false;
         }
         if(this.bounds.left&&this.pos.x<this.bounds.left){
            if(this.bounds.l_callback){
               if(this.bounds.l_callback(this))
                  return false;
               return true;
            }
            return false;
         }
         if(this.bounds.bottom&&this.pos.y>this.bounds.bottom){
            if(this.bounds.b_callback){
               if(this.bounds.b_callback(this))
                  return false;
               return true;
            }
            return false;
         }
         if(this.bounds.right&&this.pos.x>this.bounds.right){
            if(this.bounds.r_callback){
               if(this.bounds.r_callback(this))
                  return false;
               return true;
            }
            return false;
         }
      }
      if(this.fade){
         this.styles.globalAlpha=this.styles.globalAlpha-this.fade.speed||1;
         if(this.styles.globalAlpha<0)this.styles.globalAlpha=0;
         if(this.styles.globalAlpha>1)this.styles.globalAlpha=1;
         if((this.styles.globalAlpha==0||this.styles.globalAlpha==1)&&this.fade.fn)
            if(this.fade.fn(this))
               return false;
         this.redraw=true;
      }
      if(this.shrink){
         this.width-=this.shrink.speed;
         this.height-=this.shrink.speed;
         if(this.width<0||this.height<0)
            return this.shrink.fn||false;
         this.redraw=true;
      }
      if(this.objs&&this.objs.length>0)
         for(var i=0;i<this.objs.length;i++)
            this.objs[i].update(dt);
      return true;
   }
   Obj.prototype.translate = function(v,y,z){
      if(this.pos){
         this.pos.add(v,y,z);
         this.redraw = true;
         if (this.objs!==undefined)
            for (var i=0; i<this.objs.length; i++)
               this.objs[i].translate(v,y,z);
      } return this;
   }
   Obj.prototype.rotate = function(r){
      this.rotation=this.rotation+r||0;
      this.redraw=true;
      return this;
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
      this.text=text; 
   }

   //Functions
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
         if(key=='backspace'&&pre.length>0) {
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
      return cI;}
   Text.prototype.getX = function(i){
      var tt=this.text.substring(0,i);
      this.ctx.font=this.font;
      var w=this.ctx.measureText(tt).width;
      return this.left()+this.ctx.measureText(tt).width;}
   //Text.prototype.addText = function(t){this.text=this.text+t;return this;}
   //Text.prototype.setWrap  =  function(w) { this.wrap = w;return this;}
   //Text.prototype.setLineHeight  =  function(l) { this.lineheight = l;return this;}
   Text.prototype.top = function(){
      return this.pos.y-parseInt(this.font,10)*.7;
   }
   Text.prototype.bottom = function(){
      return this.pos.y+1;
   }
   Text.prototype.right = function(){
      this.ctx.font=this.font;
      if (this.textAlign=='center') return this.pos.x+this.ctx.measureText(this.text).width/2;
      else if (this.textAlign=='right'||this.textAlign=='end') return this.pos.x;
      else return this.pos.x+this.ctx.measureText(this.text).width;
   }
   Text.prototype.left = function(){
      this.ctx.font=this.font;
      if (this.textAlign=='center') return this.pos.x-this.ctx.measureText(this.text).width/2;
      else if (this.textAlign=='right'||this.textAlign=='end') return this.pos.x-this.ctx.measureText(this.text).width;
      else return this.pos.x;
   }
   Text.prototype.draw = function(ctx){
      ctx.font = this.font;
      ctx.textAlign = this.textAlign;
      if(typeof(this.wrap) == 'undefined' || this.wrap <= 0) {
         if (typeof this.styles.fillStyle!='undefined')
            ctx.fillText(this.text,0,0);
         if (typeof this.styles.strokeStyle!='undefined')
            ctx.strokeText(this.text,0,0);
      } else {
        var lineHeight  =  this.lineheight || 28;
        var words       =  this.text.split(' ');
         var line          =  '',
              y         =  0,
              n         =  0;
         for(; n < words.length; n++) {
             var testLine = line + words[n] + ' ';
             var metrics = ctx.measureText(testLine);
             var testWidth = metrics.width;
             if(testWidth > this.wrap) {
               ctx.fillText(line, 0, y);
               line = words[n] + ' ';
               y += lineHeight;
             }
             else {
               line = testLine;
             }
           }
           ctx.fillText(line, 0, y);
      }
      return this;
   }
})();

//Vec
(function () {
   function Vec(){
      this.Vec.apply(this, arguments);
   }; iio.Vec=Vec;
   Vec.prototype.Vec = function(v,y,z){
      if (v&&v.x!==undefined){
         this.x=v.x||0;
         this.y=v.y||0;
         this.z=v.z||y||undefined;
      } else {
         this.x=v||0;
         this.y=y||0;
         this.z=z||undefined;
      }
   }
   Vec.prototype.clone = function(){
      return new Vec(this.x,this.y,this.z);
   }
   Vec.toString = function(v){
      if(!iio.isNumber(v.z)) return "x:"+v.x+" y:"+v.y;
      return "x:"+v.x+" y:"+v.y+" z:"+v.z;
   }
   Vec.prototype.toString = function(){
      if(!iio.isNumber(this.z)) return "x:"+this.x+" y:"+this.y;
      return "x:"+this.x+" y:"+this.y+" z:"+this.z
   }
   Vec.prototype.set = function (v,y,z){
      if (v&&v.x!==undefined){
         this.x=v.x;
         if(v.y!==undefined)this.y=v.y;
         if(y!==undefined)this.z=y;
         if(z!==undefined)this.z=z;
         if(v.z!==undefined)this.z=v.z;
      } else {
         if(v!==undefined)this.x=v;
         else {
            this.x=0;
            this.y=0;
         }
         if(y!==undefined)this.y=y;
         if(z!==undefined)this.z=z;
      } return this;
   }
   Vec.prototype.length = function(){
      return Math.sqrt(this.x*this.x+this.y*this.y);
   }
   Vec.length = function(v,y){
      if (v.x!==undefined)
         return Math.sqrt(v.x*v.x+v.y*v.y);
      else return Math.sqrt(v*v+y*y);
   }
   Vec.prototype.add = function(v,y,z){
      if (v.x!==undefined){
         this.x+=v.x||0;
         this.y+=v.y||0;
         this.z+=v.z||y||0;
      } else {
         this.x+=v||0;
         this.y+=y||0;
         this.z+=z||0;
      } return this;
   }
   Vec.add = function(v1, v2, x2, y2){
      if (v1.x!==undefined)
            return (new Vec(v1)).add(v2,x2);
      else return (new Vec(v1,v2)).add(x2,y2);
   }
   Vec.prototype.sub = function (v,y,z){
      if (v.x!==undefined)
         this.add(-v.x,-v.y,-v.z||-y);
      else this.add(-v,-y,-z );
      return this;
   }
   Vec.sub = function(v1, v2, x2, y2){
      if (v1.x!==undefined)
            return (new Vec(v1)).sub(v2,x2)
      else return (new Vec(v1,v2)).sub(x2,y2);
   }
   Vec.prototype.mult = function (f){
      this.x*=f;
      this.y*=f;
      return this;
   }
   Vec.mult = function(v, y, f){
      if (v.x!==undefined)
         return (new Vec(v)).mult(y);
      else return (new Vec(v, y)).mult(f);
   }
   Vec.prototype.div = function (d){
      this.x/=d;
      this.y/=d;
      return this;
   }
   Vec.div = function(v, y, f){
      if (v.x!==undefined)
         return (new Vec(v)).div(y)
      else return (new Vec(v,y)).div(f);
   }
   Vec.prototype.dot = function (v, y){
      if (v.x!==undefined)
         return this.x*v.x+this.y*v.y;
      else return this.x*v+this.y*y;
   }
   Vec.dot = function (v1, v2, x2, y2){
      if (v1.x!==undefined){
         if (v2.x!==undefined)
            return v1.x*v2.x+v1.y*v2.y;
         else return v1.x*v2+v1.y*x2;
      } else {
         if (x2.x!==undefined)
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
      if (v.x!==undefined)
         this.add(Vec.sub(v,this).mult(y));
      else this.add(Vec.sub(v,y,this).mult(p));
      return this;
   }
   Vec.lerp = function(v1,v2,x2,y2,p){
      if (v1.x!==undefined)
         return (new Vec(v1)).lerp(v2,x2,y2);
      else return (new Vec(v1,v2)).lerp(x2, y2, p);
   }
   Vec.prototype.distance = function(v,y){
      if (v.x!==undefined)
         return Math.sqrt((v.x-this.x)*(v.x-this.x)+(v.y-this.y)*(v.y-this.y));
      else return Math.sqrt((v-this.x)*(v-this.x)+(y-this.y)*(y-this.y));
   }
   Vec.distance = function(v1,v2,x2,y2){
      if (v1.x!==undefined){
         if (v2.x!==undefined)
            return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x)+(v1.y-v2.y)*(v1.y-v2.y));
         else return Math.sqrt((v1.x-v2)*(v1.x-v2)+(v1.y-x2)*(v1.y-x2));
      } else {
         if (x2.x!==undefined)
            return Math.sqrt((v1-x2.x)*(v1-x2.x)+(v2-x2.y)*(v2-x2.y));
         else return Math.sqrt((v1-x2)*(v1-x2)+(v2-y2)*(v2-y2));
      }
   }
})();

//iio
(function(){
   iio.attachGroupAPI=function(obj){
      obj.objs=[];
      obj.addCollisionCallback=function(t1,t2,fn){
         if(!this.collisions)this.collisions=[];
         this.collisions.push({t1:t1,t2:t2,fn:fn});
         return this;
      }
      add = function(p,s,t,ctx){
         var obj;
         if(iio.isString(p)){
            obj=new iio.Text(p,s,t);
            if(this.ctx||ctx)
               obj.ctx=this.ctx||ctx;
         } else if(iio.isNumber(p))
            obj=new iio.Obj(p,s,t);
         else if(p instanceof Array||p instanceof iio.Vec)
            obj=new iio.Obj(p,s);
         else obj=p.set(s);
         ctx=ctx||this.ctx;
         if(ctx&&(obj.pos||obj.m_I||obj.m_edgeA))iio.draw(ctx,obj);
         if(this.objs.length==0)this.objs[0]=obj;
         else if(typeof obj.z!='undefined'){
            var l=this.objs.length;
            for(var a=0;a<this.objs.length;a++)
               if(typeof this.objs[a].z!='undefined'&&obj.z<this.objs[a].z){
                  this.objs.insert(a,obj);
                  break;
               }
            if(l==this.objs.length)
               this.objs.push(obj);
         }
         else this.objs.push(obj);
         return obj;
      }
      if(typeof Box2D!='undefined'){
         obj.add = function(p,s,t,ctx){
            if(p instanceof Box2D.Dynamics.b2World){
               this.objs.push(p);
               p.ctx=this.ctx;
               return p;
            } else if (p instanceof Box2D.Dynamics.b2Body){
               this.objs.push(p);
               p.ctx=this.ctx;
               return p;
            }
            return add(p,s,t,ctx)
         }
      } else obj.add=add;
      obj.rmv=function(obj){
         if(iio.isNumber(obj))
            return this.objs.splice(obj,1);
         else for(var i=0;i<this.objs.length;i++)
            if(this.objs[i]==obj)
               return this.objs.splice(i,1);
      }
   }
   iio.attachGraphicsAPI=function(obj){
      iio.attachGroupAPI(obj);
      obj.set = function(p){
         for(var prop in p)this[prop]=p[prop];
         return this;
      }
      obj.setAnim = function(i,k){
         if(iio.isString(i))
            for(var j=0;j<this.anims.length;j++)
               if(this.anims[j].id==i)
                  this.animIndex=j;
         this.animKey=k||0;
      }
      obj.playAnim = function(fps,fn){
         iio.loop(fps,this,function(id,obj,dt){
            obj.animKey++;
            if(obj.animKey>=obj.anims[obj.animIndex].imgs.length){
               obj.animKey=0;
               if(fn)fn();
            }
         })
      }
      obj.init = function(p){
         this.set(p);
         this.rotation=0;
         if(this.fade)this.styles.globalAlpha=1;
         if(this.img){
            if(iio.isString(this.img)) this.img=iio.loadImage(this.img);
            else if(iio.isString(this.img.img)) this.img.img=iio.loadImage(this.img.img);
         }
         if(this.anims){
            this.animKey=0;
            this.animIndex=0;
            for(var i=0;i<this.anims.length;i++)
               for(var j=0;j<this.anims[i].imgs.length;j++)
                  if(iio.isString(this.anims[i].imgs[j]))
                     this.anims[i].imgs[j]=iio.loadImage(this.anims[i].imgs[j])
         }
         if(this.C||this.R){
            this.C = Math.floor(this.C);
            this.R = Math.floor(this.R);
            this.resetCells=function(){
               this.cells = new Array(this.C);
               for(var i=0; i<this.cells.length; i++)
                  this.cells[i] = new Array(this.R);
               for(var c=0; c<this.cells[0].length; c++)
                  for(var r=0; r<this.cells.length; r++){
                     this.cells[r][c] = new Object();
                     this.cells[r][c].grid=this;
                     this.cells[r][c].r=c;
                     this.cells[r][c].c=r;
                  }
            };this.resetCells();
            this.foreachCell = function(fn,p){
               var keepGoing=true;
               for (var c=0;c<this.C;c++)
                  for(var r=0;r<this.R;r++){
                     keepGoing=fn(this.cells[c][r],p);
                     if (typeof keepGoing!='undefined'&&!keepGoing)
                        return [r,c];
                  }
            }
         }
         if(typeof Box2D!='undefined'){
            if(this.m_vertices){
               this._draw=iio.setDraw(this.m_vertices.length)
               this.draw=function(b,s){
                  this._draw({ctx:s.ctx})
               }
            }
         }
         return this;
      }
   }
   iio.collision=function(r1,r2){
      if (r1.left() < r2.right() && r1.right() > r2.left() && r1.top() < r2.bottom() && r1.bottom() > r2.top())
         return true;
      return false;
   }
   iio.transformContext = function(ctx,pos,r,origin,scale){
      ctx.save();
      if(pos)ctx.translate(Math.floor(pos.x),Math.floor(pos.y));
      if(origin)ctx.translate(origin.x,origin.y);
      if(r)ctx.rotate(r);
      if(origin)ctx.translate(-origin.x,-origin.y);
      if(scale)ctx.scale(scale.x,scale.y);
      return ctx;
   }
   iio.b2scale=30;
   iio.draw = function(ctx,o){
      if(o.pos)
         iio.transformContext(ctx,o.pos,o.rotation,o.origin,o.scale);
      /*else if(typeof o.m_I!='undefined')
         for(f=o.GetFixtureList();f;f=f.m_next){
            var s=f.GetShape();
            if(s.draw) iio.transformContext(o.ctx,
               new iio.Vec(o.m_xf.position.x*iio.b2scale
                           ,o.m_xf.position.y*iio.b2scale),
               o.GetAngle(),
               null,
               iio.b2scale,
               s.styles);
         }
      else if (o.m_edgeA)
         iio.transformContext(o.ctx,o.pos,o.rotation,o.origin,o.scale);*/
      sNd=function(ob){
         ctx.save();
         iio.applyContextStyles(ctx,ob.styles);
         ob.draw(ctx);
         ctx.restore();
      }
      if(o.objs&&o.objs.length!=0){
         var oNotDrawn=true;
         for(var i=0;i<o.objs.length;i++){
            if(oNotDrawn&&(typeof o.objs[i].z=='undefined'||o.z<o.objs[i].z&&o.draw)){
               sNd(o);
               oNotDrawn=false;
            }
            iio.transformContext(ctx,o.objs[i].pos,o.objs[i].rotation,o.objs[i].origin,o.objs[i].scale,o.objs[i].styles);
            sNd(o.objs[i]);
            ctx.restore();
         }
         if(oNotDrawn&&o.draw) sNd(o); 
      }else if(o.draw) sNd(o);
      //if(s&&s.draw) s.draw()
      ctx.restore();
   }
   function setDash(da){
      if (typeof da == 'undefined') this.dashed = undefined;
      else this.dashed=true;
      this.dashProperties=da;
      return this;
   }
   iio.Obj.prototype.setDash=setDash;
   iio.applyContextStyles = function(ctx,s){
      for(var prop in s)ctx[prop]=s[prop];
      if(!s||!s.strokeStyle)ctx.strokeStyle='rgba(0, 0, 0, 0)';
      if(!s||s&&!s.fillStyle)ctx.fillStyle='rgba(0, 0, 0, 0)';
      return ctx;
   }
   iio.drawImage = function(ctx,img,left,top,right,bottom){
      if(img.img){
         ctx.save();
         ctx.translate(-img.w,-img.h)
         ctx.drawImage(img.img,img.x,img.y,img.w,img.h,img.w/2,img.h/2,right,bottom);
         ctx.restore();
      }
      else ctx.drawImage(img,Math.floor(left),top,Math.ceil(right),bottom);
   }
   iio.completeDraw = function(ctx,obj){
      stroke=function(){
         if(obj.width)ctx.strokeRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
         else ctx.stroke();
         if(obj.clip)ctx.clip();
      }
      if(obj.img||obj.anims) drawImage=function(obj){
         iio.drawImage(ctx,obj.img||obj.anims[obj.animIndex].imgs[obj.animKey],-(obj.width/2||obj.radius),-(obj.width/2||obj.radius),obj.width||(obj.radius*2),(obj.width||obj.radius*2));
      }
      if (ctx.fillStyle&&ctx.fillStyle!=='rgba(0, 0, 0, 0)'){
         if(obj.width)ctx.fillRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
         else ctx.fill();
         if((!ctx.fillStyle||ctx.fillStyle=='rgba(0, 0, 0, 0)')&&!obj.clip)
            if(obj.img||obj.anims)
               drawImage(obj);
         if(ctx.strokeStyle&&!obj.clip){
            var saved=false;
            if (ctx.shadowColor&&ctx.shadowColor!=='rgba(0, 0, 0, 0)'){
               ctx.save();
               ctx.shadowColor = 'rgba(0, 0, 0, 0)';
               ctx.shadowOffsetX = null;
               ctx.shadowOffsetY = null; 
               saved=true;
            }
            stroke();
            if(ctx.fillStyle&&ctx.fillStyle!=='rgba(0, 0, 0, 0)') 
               if(obj.img||obj.anims)
                  drawImage(obj);
            if(saved)ctx.restore();
         } else {
            stroke();
            if(obj.img||obj.anims)drawImage(obj);
         }
      } else if (ctx.strokeStyle){
         stroke();
         if(obj.img||obj.anims)drawImage(obj);
      } else {
         if(obj.img||obj.anims)drawImage(obj);
      }
      //if (obj.styles.refLine) iio.drawLine(ctx,0,0,obj.radius,0);
      return ctx;
   }
   iio.drawGrid = function(ctx,w,h,C,R,cw,ch){
      ctx.translate(-Math.floor(w/2),-Math.floor(h/2));
      for (var r=1; r<R; r++)
         iio.drawLine(ctx,0,r*ch,C*cw,r*ch);
      for (var c=1; c<C; c++)
         iio.drawLine(ctx,c*cw,0,c*cw,R*ch);
      ctx.translate(Math.floor(w/2),Math.floor(h/2));
      return ctx;
   }
   iio.drawLine = function(ctx,x1,y1,x2,y2){
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
   }
   iio.drawBezierCurve = function(ctx,v1,v2,h,dS){
      ctx.translate(-v1.x,-v1.y);
      if(dS){
         ctx.save();
         iio.applyContextStyles(ctx,dS);
         ctx.beginPath();
         ctx.moveTo(v1.x,v1.y);
         ctx.lineTo(h[0].x,h[0].y);
         ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(v2.x,v2.y);
         ctx.lineTo(h[1].x,h[1].y);
         ctx.stroke();
         ctx.restore();
      }
      ctx.beginPath();
      ctx.moveTo(v1.x,v1.y);
      ctx.bezierCurveTo(h[0].x,h[0].y,h[1].x,h[1].y,v2.x,v2.y);
      ctx.stroke();
   }
   iio.drawCircle = function(ctx,radius){
      ctx.beginPath();
      ctx.arc(0,0,radius,0,2*Math.PI,false);
   }
   iio.drawPoly = function(ctx,vs){
      ctx.beginPath();
      ctx.moveTo(0,0);
      for(var i=1;i<vs.length;i++)
         ctx.lineTo(vs[i].x-vs[0].x,vs[i].y-vs[0].y);
      ctx.closePath();
   }
})();