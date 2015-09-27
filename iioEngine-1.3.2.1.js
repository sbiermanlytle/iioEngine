/*
   iio engine
   Version 1.3.2.1 Beta
   Last Update 6/26/2014
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
   //ENGINE DEFINITIONS
   iio.APP=0;
   iio.OBJ=1;
   iio.VEC=2;
   iio.LINE=3;
   iio.CIRCLE=4;
   iio.RECT=5;
   iio.POLY=6;
   iio.GRID=7;
   iio.TEXT=8;

   //JS ADDITIONS
   Array.prototype.insert = function (index,item) {
      this.splice(index,0,item);
      return this;
   }

   //UTIL FUNCTIONS
   function emptyFn() {};
   iio.inherit = function(child, parent) {
      var tmp = child;
      emptyFn.prototype = parent.prototype;
      child.prototype = new emptyFn();
      child.prototype.constructor = tmp;
   }
   iio.isNumber=function(o){return !isNaN(o-0)&&o!==null&&o!==""&&o!==false&&o!==true}
   iio.isString=function(s){return typeof s=='string'||s instanceof String}
   iio.randomColor = function() {return "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"}
   iio.randomNum = function(min, max) {
      min=min||0;max=max||1;
      return Math.random() * (max - min) + min;
   }
   iio.randomInt = function(min, max) {
      min=min||0;max=max||1;
      return Math.floor(Math.random() * (max - min)) + min;
   }
   iio.invertColor=function(c){
      var ss=c.substr(c.indexOf(',')+1);
      var ss2=ss.substr(ss.indexOf(',')+1);
      return "rgb("+(255-parseInt(c.substr(c.indexOf('(')+1,c.indexOf(',')),10))+","+(255-parseInt(ss.substr(0,ss.indexOf(',')),10))+","+(255-parseInt(ss2.substr(0,ss2.indexOf(')')),10))+")"
   }
   iio.pointsToVecs = function(points){
      var vecs = [];
      if(!(points instanceof Array))points=[points];
      for (var i=0;i<points.length;i++){
         if (typeof points[i].x !='undefined')
            vecs.push(points[i]);
         else {
            vecs.push({x:points[i],y:points[i+1]});
            i++;
         }
      } return vecs;
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
   iio.read=function(f,c){
       var raw=new XMLHttpRequest();
       raw.open("GET",f,true);
       raw.onreadystatechange=function(){
         if(raw.readyState===4&&(raw.status===200 || raw.status==0))
            c(raw.responseText);
       }
       raw.send(null);
   }
   iio.loop=function(fps,caller,fn){
      if(iio.isNumber(fps)||typeof window.requestAnimationFrame=='undefined'){
         function loop(){
            var n = new Date().getTime();
            var correctedFPS = Math.floor(Math.max(0, 1000/fps - (n - (caller.last||0))));
            caller.last = n + correctedFPS;
            if(caller.update) caller.update(correctedFPS);
            if(caller.draw) caller.draw();
            fn(window.setTimeout(loop,correctedFPS),caller,correctedFPS/(1000/fps));
         }; 
         return window.setTimeout(loop,1000/fps)
      } else {
         fn=caller;
         caller=fps;
         function animloop(){ 
            if(caller.update) caller.update();
            if(caller.draw) caller.draw();
            fn(window.requestAnimationFrame(animloop),caller,1) 
         }
         return window.requestAnimationFrame(animloop);
      }
   }

   //DEFAULT PROPERTIES
   iio.app={};

   //INITIALIZATION FUNCTIONS
   iio.start=function(app,id,d){
      var c;
      if(id){
         c=document.getElementById(id);
         if(!c){
            if(id.tagName=='CANVAS')c=id;
            else if(iio.isNumber(id)||id.x){
               c=document.createElement('canvas');
               c.width=id.x||id;
               c.height=id.y||id;
               d.appendChild(c);
            }
         }
      } else {
         document.body.style.margin=0;
         document.body.style.padding=0;
         c=document.createElement('canvas');
         c.margin=0;
         c.padding=0;
         c.style.position='absolute';
         c.width=window.innerWidth;
         c.height=window.innerHeight;
         document.body.appendChild(c);
         window.onresize=function(){
            c.width=window.innerWidth;
            c.height=window.innerHeight;
            c.parent.width=c.width;
            c.parent.height=c.height;
            c.parent.center.x=c.width/2;
            c.parent.center.y=c.height/2;
            c.parent.draw();
            if(c.parent.app.onresize) c.parent.app.onresize();
         }
      }
      if(app instanceof Array)
         return new iio.App(c,app[0],app[1]);
      if(iio.isString(app)&&app.substring(app.length-4)=='.iio')
         return iio.read('App.iio',function(s){iio.start(s)});
      return new iio.App(c,app);
   }

   //iioScript INTERPRETERS
   iio.scriptProps=[
      ['app',1]
      ,['vel',1]
      ,['acc',1]
      ,['o',0]
      ,['center',1]
      ,['round',-1]
      ,['outline',2]
      ,['grid',3]
      ,['rotate',1]
      ,['alpha',1]
      ,['lineCap',1]
      ,['hidden',1]
      ,['dash',-1]
      ,['bezier',4]
      ,['shadow',3]
      ,['origin',1]
      ,['x',1]
   ];
   iio.scriptFns=[
      'add',
      'loop',
      'draw'
   ];
   iio.operators=['/','%','*','+','-']
   iio.scriptConsts=['randomColor'];
   iio.isConstant=function(arr,itm){
      for(var i=0;i<arr.length;i++)
         if(arr[i]==itm)
            return true;
      return false;
   }
   iio.isiioProp=function(s){
      for(var i=0;i<iio.scriptProps.length;i++)
         if(iio.scriptProps[i][0]==s)
            return true;
      return false;
   }
   iio.isColor=function(s){
      for(var i=0;i<iio.operators.length;i++)
         if(s.indexOf(iio.operators[i])>-1)
            return false;
      if(iio.isNumber(s)||s.indexOf(':')>-1||s.indexOf('px')>-1||s=='width'||s=='height'||s=='center') 
         return false;
      return true;
   }
   iio.takesColor=function(s){
      if(s=='outline'||s=='color'||s=='shadow'||s=='app'||s=='grid'||s=='x')
         return true;
      return false;
   }
   iio.maxParams=function(s){
      for(var i=0;i<iio.scriptProps.length;i++)
         if(iio.scriptProps[i][0]==s)
            return iio.scriptProps[i][1];
      return -1;
   }
   iio.evaluate=function(o,s){
      if(!s)return 0;
      if(iio.isNumber(s))
         return parseFloat(s);
      else if(s=='center') return o.center;
      else if(s=='width') return o.width;
      else if(s=='height') return o.height;
      else if(s=='hidden') return o.hidden;
      else if(s=='randomColor') return iio.randomColor();
      var op;
      op=s.indexOf('-');
      if(op>-1) return iio.evaluate(o,s.substring(0,op))-iio.evaluate(o,s.substring(op+1));
      op=s.indexOf('+');
      if(op>-1) return iio.evaluate(o,s.substring(0,op))+iio.evaluate(o,s.substring(op+1));
      op=s.indexOf('/');
      if(op>-1) return iio.evaluate(o,s.substring(0,op))/iio.evaluate(o,s.substring(op+1));
      op=s.indexOf('*');
      if(op>-1) return iio.evaluate(o,s.substring(0,op))*iio.evaluate(o,s.substring(op+1));
      return s;
   }
   iio.runiioFn=function(o,s){
      if(o[0]=='loop'){
         var ps;
         if(iio.isNumber(o[1])){
            ps=o.slice().splice(2,o.length);
            s.loop(o[1],function(){
               iio.run(ps.slice(),s);
            });
         } else { 
            ps=o.slice().splice(1,o.length);
            s.loop(function(){
               iio.run(ps.slice(),s);
            });
         }
      } else if(o[0]=='add'){
         var i=1;
         var ps=[];
         var _i=o[i].indexOf(':');
         while((o[i].indexOf('gradient')==-1&&(_i>-1&&_i<o[i].length-1))||o[i]=='center'){
            if(o[i]=='center') ps.push(iio.evaluate(s,'center'));
            else {
               ps.push(iio.evaluate(s,o[i].substring(0,_i)));
               ps.push(iio.evaluate(s,o[i].substring(_i+1)));
            }
            i++; _i=o[i].indexOf(':');
         }
         o.splice(0,i); i=1;
         var p=o[0]; while(i<o.length) p+=' '+o[i++];
         return s.add(ps,p);
      } else if(o[0]=='draw')
         s.draw();
   }
   iio.runiioProp=function(o,s){
      if(s[0]=='app'){
         var p;
         if(o.type!=iio.APP){
            var p=o.parent;
            while(p.type!=iio.APP)
               p=p.parent;
         } else p=o;
         if(s[1])iio.run([s[1]],p,true);
      } else if(s[0]=='rotate')
         o.rot+=iio.evaluate(o,s[1]);
      else if(s[0]=='vel'||s[0]=='acc'){
         var v=s[1].split(':');
         if(s[0]=='vel'){
            o.vel.x=iio.evaluate(o,v[0]);
            o.vel.y=iio.evaluate(o,v[1]);
            o.vel.r=iio.evaluate(o,v[2]);
         } else {
            o.acc.x=iio.evaluate(o,v[0]);
            o.acc.y=iio.evaluate(o,v[1]);
            o.acc.r=iio.evaluate(o,v[2]);
         }
      } else if(s[0]=='o'){
         o.radius=o.width;
      } else if(s[0]=='hidden'){
         if(s[1]){
            if(s[1]=='true') o.hidden=true;
            else o.hidden=false;
         } else o.hidden=true;
      }
      else if(s[0]=='round'){
         o.round=s[1];
         for(var i=2;i<s.length;i++)
            o.round+=' '+s[i];
      } else if(s[0]=='outline'){
         for(var i=1;i<s.length;i++)
            if(iio.isNumber(s[i].substring(0,1))||(s[i].substring(0,1)=='-'))
               o.lineWidth=iio.evaluate(o,s[i]);
            else if(s[i]=='randomColor')
               o.outline=iio.randomColor();
            else o.outline=s[i];
      } else if(s[0]=='alpha')
         o.alpha=s[1];
      else if(s[0]=='lineCap')
         o.lineCap=s[1];
      else if(s[0]=='shadow'){
         o.shadow=s[1];
         for(var i=2;i<s.length;i++)
            o.shadow+=' '+s[i];
      } else if(s[0]=='origin'){
         if(s[1]=='center') o.origin=o.center;
         else {
            var v=s[1].split(':');
            o.origin={x:v[0],y:v[1],r:v[2]};
         }
      } else if(s[0]=='dash'){
         for(var _i=1;_i<s.length;_i++)
            s[_i]=iio.evaluate(o,s[_i]);
         o.dash=s.splice(1,s.length);
      } else if(s[0]=='bezier'){
         for(var _i=1;_i<=4;_i++)
            s[_i]=iio.evaluate(o,s[_i]);
         o.bezier=s.splice(1,s.length);
      } else if(s[0]=='grid'){
         o.type=iio.GRID;
         for(var _i=1;_i<s.length;_i++){
            var _c=s[_i].indexOf(':');
            if(_c<0){
               var v=iio.evaluate(o,s[_i]);
               if(iio.isString(v))
                  o.gridColor=v;
               else {
                  o.C=v;
                  o.R=o.C;
               }
            } else {
               var g=s[_i].split(':');
               o.C=g[0]; o.R=g[1];
            }
            o.res={x:o.width/o.C,y:o.height/o.R};
         }
      } else if(s[0]=='x') o.xColor=iio.evaluate(o,s[1]);
   }
   iio.runiioConst=function(o,c){
      var i=c.indexOf(':');
      var ii=c.indexOf('gradient');
      if(i>-1&&ii==-1){
         o.width=iio.evaluate(o.parent,c.substring(0,i));
         o.height=(i+1<c.length)?iio.evaluate(o.parent,c.substring(i+1)):o.width;
         o.center.x=o.pos.x;
         o.center.y=o.pos.y;
      } else if(c=='randomColor')
         o.color=iio.randomColor();
      else if(iio.isNumber(c.substring(0,1)))
            o.lineWidth=iio.evaluate(o,c);
      else if(c!='') o.color=c;
   }
   iio.run=function(o,s,nd){
      var nO;
      if(o instanceof Array){
         while(o.length>0){
            if(iio.isConstant(iio.scriptFns,o[0])){
               var l=-1;
               for(var _i=0;_i<o.length;_i++)
                  if(o[_i]=='|')
                     l=_i;
               if(l==-1) {
                  nO=iio.runiioFn(o.slice(),s);
                  l=o.length;
               }
               else nO=iio.runiioFn(o.slice().splice(0,l),s);
               o=o.splice(l+1,o.length);
            } else if(iio.isiioProp(o[0])){
               var _s=0;var p;var i;
               p=[];p[0]=o[_s];
               i=iio.maxParams(o[_s++]);
               while(o[_s]&&o[_s]!='|'
                  &&!(!iio.takesColor(o[0])&&iio.isColor(o[_s]))
                  &&(!iio.isiioProp(o[_s])||(o[_s]=='round'
                     &&o[0]=='lineCap')||(o[0]=='origin'&&o[_s]=='center'))
                  &&!(o[0]!='app'&&iio.isConstant(iio.scriptFns,o[_s]))
                  &&(_s<=i||i==-1))
                  p.push(o[_s++]);
               iio.runiioProp(s,p.slice());
               o=o.splice(_s,o.length);
            } else if(o[0]=='if') {
               var e=-1;
               var t=-1;
               for(var _i=0;_i<o.length;_i++)
                  if(o[_i]=='else')
                     e=_i;
               for(var _i=0;_i<o.length;_i++)
                  if(o[_i]=='then')
                     t=_i;
               if(iio.evaluate(s,o[1])){
                  if(e>-1) iio.run(o.slice().splice(2,e-2),s,true);
                  else if(t>-1) iio.run(o.slice().splice(2,t-2),s,true);
                  else iio.run(o.slice().splice(2,o.length),s,true);
               }
               else if(e!=-1){
                  if(t>-1) iio.run(o.slice().splice(e+1,t-e-1),s,true);
                  else iio.run(o.slice().splice(e+1,o.length),s,true);
               }
               if(t>-1)o=o.splice(t+1,o.length);
               else o=[];
            } else if(o[0].substring(0,1)=='!'){
               o[0]=o[0].substring(1);
               if(o[0]=='hidden'){
                  if(!s.hidden) s.hidden=true;
                  else s.hidden=false;
                  this.redraw=true;
                  o=o.splice(1,o.length);
               }
            } else {
               iio.runiioConst(s,o[0]);
               o=o.splice(1,o.length);
            }
         }
         if(nd);else s.draw();
      } else if(iio.isString(o)){
         nO=iio.run(o.split(" "),s,true);
         if(nd);else s.draw();
      } else {
         for(var i=0;i<s.length;i++)
            if(iio.isNumber(s[i]))
               o.lineWidth=iio.evaluate(o,s[i]);
            else o.color=s[i];
         if(nd);else o.draw();
      }
      return nO;
   }

   //SHARED FUNCTIONS
   init=function(){
      this.scale=1;
      this.objs=[];
      this.set=set;
      this.add=add;
      this.partialPx=true;
      this.run=function(s,nd){
         return iio.run(s,this,nd);
      }
      this.loop=function(fps,fn){
         if(this.looping){
            if(window.cancelAnimationFrame)
               window.cancelAnimationFrame(this.loopID);
            else window.clearTimeout(this.loopID);
         }
         this.looping=true;
         if(typeof fn=='undefined'){
            if(typeof fps=='undefined')
               this.loopID = iio.loop(this,this.update);
            else  this.loopID = iio.loop(this,fps);
         }
         else this.loopID = iio.loop(fps,this,fn);
      }
   }
   iio.set=function(os,p){
      for(var i=0;i<os.length;i++)
         os[i].set(p);
   }
   set=function(s,nd){
      if(s instanceof Array)
         for(var i=0;i<s.length;i++)
            this.set(s[i],true);
      else if(iio.isString(s)){
         if(iio.isNumber(s)){

         } else iio.run(s.split(" "),this,true);
      }
      else for(var prop in s) this[prop]=s[prop];
      if(nd);else this.draw();
      if(((this.vel&&(this.vel.x!=0||this.vel.y!=0||this.vel.r!=0))||(this.acc&&(this.acc.x!=0||this.acc.y!=0||this.acc.r!=0)))
         &&(typeof this.app.looping=='undefined'||this.app.looping===false))
         this.app.loop();
      return this;
   }
   add=function(o,s,a,nd){
      function addApp(t,o){
         if(t.type==iio.APP) o.app=t;
         else o.app=t.app;
      }
      if(typeof(o.type)!='undefined'){
         if(o instanceof Array)
            for(var i=0;i<o.length;i++)
               this.add(o[i]);
         else if(o.z){
            var i=0;
            while(i<this.objs.length&&typeof(this.objs[i].z)!='undefined'&&o.z<=this.objs[i].z)i++;
            this.objs.insert(i,o);
         }
         else this.objs.push(o);
         o.parent=this;
         addApp(this,o);
         if(s);else this.draw();
         return o;
      } else {
         var ob=this.add(new iio.Obj(o,s,a,this),true);
         addApp(this,ob);
         if(nd);else if(this.draw)this.draw(undefined,true);
         return ob;
      }
   }

   iio.addInputListeners=function(o){
      o.onmousedown=function(e){
         var ep=this.parent.convertEventPos(e);
         if(this.parent.onmousedown) this.parent.onmousedown(e,ep);
         for(var i=0;i<this.parent.objs.length;i++){
            if(i!==0)ep=this.parent.convertEventPos(e);
            if(this.parent.objs[i].contains&&this.parent.objs[i].contains(ep))
               if(this.parent.objs[i].onmousedown){
                  if(this.parent.objs[i].type==iio.GRID){
                     var c=this.parent.objs[i].cellAt(ep);
                     this.parent.objs[i].onmousedown(ep,c,this.parent.objs[i].cellCenter(c.c,c.r));
                  }
                  else this.parent.objs[i].onmousedown(e,ep);
               }
         }
      }
   }
   //APP
   function App(){
      this.App.apply(this,arguments);
   }; iio.App=App;
   App.prototype.App=function(view,app,s){

      //STATIC PROPERTIES : APP SETTINGS

      //APP REFERENCES & PROPERTIES
      this.type=iio.APP;
      this.canvas=view;
      this.canvas.parent=this;
      iio.addInputListeners(this.canvas);
      this.ctx=view.getContext('2d');
      this.width=view.clientWidth;
      this.height=view.clientHeight;
      this.center={x:this.width/2,y:this.height/2};
      var offset=view.getBoundingClientRect();
      this.pos={x:offset.left,y:offset.top};
      this.convertEventPos=function(e){
         return {x:e.clientX-this.pos.x,y:e.clientY-this.pos.y}
      }
      this.init=init;this.init();
      this.set(iio.app);
      if(iio.isString(app)) this.app=iio.run(app,this);
      else this.app = new app(this,s);
   }

   App.prototype.draw=function(noClear){
      if(!noClear) this.ctx.clearRect(0,0,this.width,this.height);
      if(this.color){
         this.ctx.fillStyle=this.color;
         this.ctx.fillRect(0,0,this.width,this.height);
      }
      if(this.round&&this.canvas.style.borderRadius!=this.round){
         this.canvas.style.borderRadius=this.round;
         //this.canvas.style.MozBorderRadius=this.round;
         //this.canvas.style.WebkitBorderRadius=this.round;
      }
      if(this.outline)
         this.canvas.style.border=(this.lineWidth||1)+'px solid '+this.outline;
      if(this.alpha)
         this.canvas.style.opacity=this.alpha;/*
      if(this.cells)
         for(var c=0;c<this.C;c++)
            for(var r=0;r<this.R;r++)
               this.cells[c][r].draw(this.ctx);*/
      if(this.objs.length>0)
         for(var i=0;i<this.objs.length;i++)
            if(this.objs[i].draw)
               this.objs[i].draw(this.ctx);
   }
   App.prototype.clear=function(){
      this.ctx.clearRect(0,0,this.width,this.height);
      if(this.color){
         this.ctx.fillStyle=this.color;
         this.ctx.fillRect(0,0,this.width,this.height);
      }
   }
   App.prototype.update=function(dt){
      if(this.objs&&this.objs.length>0)
         for(var i=0;i<this.objs.length;i++)
            if(this.objs[i].update)
               this.objs[i].update(dt);
   }

   //OBJ
   function Obj(){
      this.Obj.apply(this, arguments);
   }; iio.Obj=Obj;
   Obj.prototype.Obj = function(o,s,a,r){
      if(iio.isString(o)){
         if(typeof(s)=='undefined'){
            s=o; o=[0,0]; a=r;
         } else {
            this.text=o;
            this.type=iio.TEXT;
            this._draw=drawText;
            o=s; s=a; a=r;
         }
      } else a=r;
      if(a){
         this.parent=a;
         if(a.type==iio.APP) this.app=a;
         else this.app=a.app;
      }
      this.init=init;this.init();
      o=iio.pointsToVecs(o);
      this.pos=o[0];
      this.rot=0;
      this.center={x:this.pos.x,y:this.pos.y};
      this.vel={x:0,y:0,r:0};
      this.acc={x:0,y:0,r:0};
      this.update=function(dt){
         iio.V.add(this.vel,this.acc);
         if(this.vel.x)this.pos.x+=this.vel.x;
         if(this.vel.y)this.pos.y+=this.vel.y;
         if(this.vel.r)this.rot+=this.vel.r;
         if(this.endPos)iio.V.add(this.endPos,this.vel);
         this.updateProps();
      }
      this.draw=function(ctx,one){
         if(this.hidden)return;
         var p;
         if(typeof(ctx)=='undefined'){
            if(!this.parent)return;
            p=this.parent;
            while(typeof(ctx)=='undefined'){
               ctx=p.ctx;
               p=p.parent;
            }
         }
         if(this.looping&&this.parent&&this.parent.clear&&!this.parent.looping)
            this.parent.clear(ctx);
         ctx.save();
         if(one){
            p=this.parent;
            while(p.type!=iio.APP){
               ctx.translate(p.pos.x,p.pos.y);
               p=p.parent;
            }
         }
         if(this.origin)
            ctx.translate(this.origin.x,this.origin.y);
         else ctx.translate(this.pos.x,this.pos.y);
         if(this.rot!=0) ctx.rotate(this.rot);
         if(typeof this.alpha!='undefined')
            ctx.globalAlpha=this.alpha;
         if(this.lineCap) ctx.lineCap=this.lineCap;
         if(this.shadow){
            var s=this.shadow.split(' ');
            for(var i=0;i<s.length;i++){
               if(iio.isNumber(s[i]))
                  ctx.shadowBlur=s[i];
               else if(s[i].indexOf(':')>-1){
                  var _i=s[i].indexOf(':');
                  ctx.shadowOffsetX=s[i].substring(0,_i);
                  ctx.shadowOffsetY=s[i].substring(_i+1);
               } else ctx.shadowColor=s[i];
            }
         }
         if(this.dash){
            if(this.dash.length>1&&this.dash.length%2==1)
               ctx.lineDashOffset=this.dash[this.dash.length-1];
            //ctx.setLineDash(this.dash.slice().splice(0,this.dash.length-1));
            ctx.setLineDash(this.dash);
         }
         this._draw(ctx);
         if(this.objs.length>0){
            //ctx.translate(-this.pos.x,-this.pos.y);
            for(var i=0;i<this.objs.length;i++)
               if(this.objs[i].draw)
                  this.objs[i].draw(this.ctx);
         }
         ctx.restore();
      }
      if(o.length==2){
         this.type=iio.LINE;
         this.endPos=o[1];
         this.updateProps=function(){
            this.width=Math.abs(this.endPos.x-this.pos.x);
            this.height=Math.abs(this.endPos.y-this.pos.y);
            this.center.x=(this.pos.x+this.endPos.x)/2;
            this.center.y=(this.pos.y+this.endPos.y)/2;
         }; this.updateProps();
         this._draw=drawLine;
      } else if(o.length>2){
         this.type=iio.POLY;
      } else {
         if(this.radius){
            this.type=iio.CIRCLE;
            this._draw=drawCircle;
         } else {
            this.type=iio.RECT;
            this.updateProps=function(){
               this.center=this.pos;
            }
            if(iio.isString(s)&&s.indexOf('grid')>-1)
               this._draw=drawGrid;
            else this._draw=drawRect;
            this.contains=rectContains;
         }
      }
      this.set(s,true);
      if(this.radius){
         this._draw=drawCircle;
         this.width*=2;
         this.height*=2;
      }
      if(this.origin=='center') this.origin=this.center;
      if(this.R){
         this.cells=[];
         var x=-this.res.x;
         var y=-this.res.y;
         for(var c=0;c<this.C;c++){
            this.cells[c]=[];
            for(var r=0;r<this.R;r++){
               this.cells[c][r]=this.add(new iio.Obj([x,y],{
                  c:c,r:r,
                  width:this.res.x,
                  height:this.res.y
               },this));
               y+=this.res.y;
            }
            y=-this.res.y;
            x+=this.res.x;
         }
         this.cellCenter=function(c,r){
            return {x:-this.width/2+c*this.res.x+this.res.x/2
               ,y:-this.height/2+r*this.res.y+this.res.y/2}
         }
         this.cellAt=function(x,y){
            if(x.x) return this.cells[Math.floor((x.x-this.left)/this.res.x)][Math.floor((x.y-this.top)/this.res.y)];
            else return this.cells[Math.floor((x-this.left)/this.res.x)][Math.floor((y-this.top)/this.res.y)];
         }
         this.left=this.pos.x-this.width/2;
         this.top=this.pos.y-this.height/2;
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
   }
   drawCircle=function(ctx){
      iio.startShape(ctx,this);
      ctx.beginPath();
      ctx.arc(0,0,this.radius,0,2*Math.PI,false);
      if(this.color) ctx.fill();
      if(this.outline) ctx.stroke();
      ctx.restore();
   }
   drawLine=function(ctx){
      ctx.save();
      ctx.strokeStyle=this.color;
      ctx.lineWidth=this.lineWidth;
      if(this.origin)
         ctx.translate(-this.origin.x,-this.origin.y);
      else ctx.translate(-this.pos.x,-this.pos.y);
      ctx.beginPath();
      ctx.moveTo(this.pos.x,this.pos.y);
      if(this.bezier)
         ctx.bezierCurveTo(this.bezier[0],this.bezier[1],this.bezier[2],this.bezier[3],this.endPos.x,this.endPos.y);
      else ctx.lineTo(this.endPos.x,this.endPos.y);
      ctx.stroke();
      ctx.restore();
   }
   iio.createGradient=function(ctx,o,g){
      var gradient;
      var p=g.split(':');
      var ps=p[1].split(',');
      if(ps.length==4)
         gradient=ctx.createLinearGradient(iio.evaluate(o,ps[0]),iio.evaluate(o,ps[1]),iio.evaluate(o,ps[2]),iio.evaluate(o,ps[3]));
      else gradient=ctx.createRadialGradient(iio.evaluate(o,ps[0]),iio.evaluate(o,ps[1]),iio.evaluate(o,ps[2]),iio.evaluate(o,ps[3]),iio.evaluate(o,ps[4]),iio.evaluate(o,ps[5]));
      var c;
      for(var i=2;i<p.length;i++){
         c=p[i].indexOf(',');
         gradient.addColorStop(parseFloat(p[i].substring(0,c)),iio.evaluate(o,p[i].substring(c+1)));
      }
      o.color='g';
      return gradient;
   }
   iio.startShape=function(ctx,o){
      ctx.save();
      if(o.color){
         if(o.color.indexOf('gradient')>-1){
            o.colorGradient=iio.createGradient(ctx,o,o.color)
            ctx.fillStyle=o.colorGradient;
         } else if(o.colorGradient)
            ctx.fillStyle=o.colorGradient;
         else ctx.fillStyle=o.color;
      }
      if(o.outline){
         ctx.lineWidth=o.lineWidth;
         if(o.outlineGradient){
            ctx.strokeStyle=o.outlineGradient;
         } else if(o.outline.indexOf('gradient')>-1){
            o.outlineGradient=iio.createGradient(ctx,o,o.outline)
            ctx.strokeStyle=o.outlineGradient;
         } else ctx.strokeStyle=o.outline;
      }
   }
   iio.drawLine=function(ctx,x,y,x1,y1){
         ctx.beginPath();
         ctx.moveTo(x,y);
         ctx.lineTo(x1,y1);
         ctx.stroke();
   }
   drawRect=function(ctx){
      iio.startShape(ctx,this);
      if(this.color) ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
      if(this.outline) ctx.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
      if(this.xColor) {
         ctx.save();
         ctx.strokeStyle=this.xColor;
         ctx.lineWidth=this.lineWidth;
         ctx.translate(-this.width/2,-this.height/2);
         iio.drawLine(ctx,0,0,this.width,this.height);
         iio.drawLine(ctx,this.width,0,0,this.height);
         ctx.restore();
      }
      ctx.restore();
   }
   rectContains=function(v,y){
      y=v.y||y;
      v=v.x||v;
      v-=this.pos.x;
      y-=this.pos.y;
      if (v>-this.width/2&&v<this.width/2&&y>-this.height/2&&y<this.height/2)
         return true;
      return false;
   } 
   drawGrid=function(ctx){
      iio.startShape(ctx,this);
      ctx.translate(-this.width/2,-this.height/2)
      if(this.color) ctx.fillRect(0,0,this.width,this.height);
      ctx.strokeStyle=this.gridColor;
      ctx.lineWidth=this.lineWidth;
      for(var c=1;c<this.C;c++)iio.drawLine(ctx,c*this.res.x,0,c*this.res.x,this.height);
      for(var r=1;r<this.R;r++)iio.drawLine(ctx,0,r*this.res.y,this.width,r*this.res.y);
      if(this.outline&&this.lineWidth) {
         ctx.strokeStyle=this.outline;
         ctx.strokeRect(0,0,this.width,this.height);
      }
      ctx.restore();
   }
   drawText=function(ctx){
      ctx.font='10px Consolas';
      ctx.textAlign='center';
      //ctx.textBaseline=0;
      ctx.fillStyle='white';
      ctx.fillText(this.text,0,0);
   }
   iio.V={};
   iio.V.add = function(v1, v2){for(var p in v2) if(v1[p]) v1[p]+=v2[p]}
})();