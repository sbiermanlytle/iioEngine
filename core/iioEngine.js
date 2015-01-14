/*
   iio engine
   Version 1.3.4 Working Version

   1.3 is a work in progress, but already useful for many apps
   1.2 has more features, less bugs, and is available on github

   API: docs/
   Demos: iioapps.com
   Sandbox: iioengine.com/sandbox

---------------------------------------------------------------------
The iio Engine is licensed under the BSD 2-clause Open Source license

Copyright (c) 2014, Sebastian Bierman-Lytle
All rights reserved.

*/
iio={};
(function(){

   //ENGINE DEFINITIONS
   iio.APP="App";
   iio.OBJ="Obj";
   iio.LINE="Line";
   iio.CIRC="Ellipse";
   iio.RECT="Rectangle";
   iio.POLY="Polygon";
   iio.GRID="Grid";
   iio.TEXT="Text";

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
   iio.isNumber=function(o) {
      if (typeof o === 'number') return true;
      return (o-0)==o && o.length>0;
   }
   iio.isString=function(s){return typeof s=='string'||s instanceof String}
   iio.isBetween=function(val,min,max){
      if(max < min) {
         var tmp = min;
         min = max;
         max = tmp;
      } return (val >= min && val <= max);
   }
   iio.isImage=function(img){
      var ies=['png','jpg','gif','tiff'];
      for(var i=0;i<ies.length;i++)
         if(img.indexOf('.'+ies[i])!=-1)
            return true;
      return false;
   }
   iio.isFunction = function (fn) { return typeof fn === 'function' }
   iio.randomColor = function() {return "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"}
   iio.random = function(min, max) {
      min=min||0;max=(max===0||typeof(max)!='undefined')?max:1;
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
   iio.load=function(src,onload){
      var img=new Image();
      img.src=src;
      img.onload=onload;
      return img;
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
   iio.rotatePoint = function(x,y,r){
      if (typeof x.x!='undefined'){ r=y; y=x.y; x=x.x; }
      if (typeof r=='undefined'||r==0) return {x:x,y:y}
      var newX = x * Math.cos(r) - y * Math.sin(r);
      var newY = y * Math.cos(r) + x * Math.sin(r);
      return {x:newX,y:newY};
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
   iio.cancelLoop=function(l){
      window.clearTimeout(l);
      window.cancelAnimationFrame(l);
   }
   iio.cancelLoops=function(o,c){
      var i;
      for(i=0;i<o.loops.length;i++)
            iio.cancelLoop(o.loops[i].id);
      if(o.mainLoop) iio.cancelLoop(o.mainLoop.id);
      if(typeof c=='undefined')
         for(i=0;i<o.objs.length;i++)
            iio.cancelLoops(o.objs[i]);
   }
   iio.loop=function(fps,caller,fn){
      if(iio.isNumber(fps)||typeof window.requestAnimationFrame=='undefined'||!fps.af){
         if(typeof(fps.af)!='undefined'&&typeof(fps.fps)=='undefined'){ fn=caller; caller=fps; fps=60 }
         else if(!iio.isNumber(fps)) { caller=fps; fps=fps.fps; }
         function loop(){
            var n = new Date().getTime();
            if(typeof caller.last=='undefined') var first=true;
            var correctedFPS = Math.floor(Math.max(0, 1000/fps - (n - (caller.last||fps))));
            caller.last = n + correctedFPS;
            var nufps;
            if(typeof first=='undefined'){
               if(typeof caller.fn=='undefined')
                  nufps=caller.o._update(caller.o,correctedFPS);
               else if(iio.isFunction(caller.fn))
                  nufps=caller.fn(caller.o,caller,correctedFPS);
               else nufps=caller.fn._update(caller,correctedFPS);
               caller.o.app.draw();
            }
            if(typeof nufps=='undefined')
               caller.id=window.setTimeout(loop,correctedFPS);
            else {
               fps=nufps;
               caller.id=window.setTimeout(loop,1000/nufps);
            }
            //if(fn)fn(caller,correctedFPS/(1000/fps));
         }; 
         caller.id=window.setTimeout(loop,1000/fps);
         return caller.id;
      } else {
         fn=caller;
         caller=fps;
         function animloop(){
            if(typeof caller.fn=='undefined') caller.o.draw();
            else if(iio.isFunction(caller.fn)) caller.fn(caller.o);
            else {
               caller.fn._update();
               caller.fn.draw();
            }
            caller.o.app.draw();
            caller.id=window.requestAnimationFrame(animloop);
         }
         caller.id=window.requestAnimationFrame(animloop);
         return caller.id;
      }
   }
   iio.resize=function(){
      for(var i=0;i<iio.apps.length;i++){
         if(iio.apps[i].canvas.fullscreen){
            if(window.jQuery){
               iio.apps[i].canvas.width=$(window).width();
               iio.apps[i].canvas.height=$(window).height();
            } else {
               iio.apps[i].canvas.width=window.innerWidth;
               iio.apps[i].canvas.height=window.innerHeight;
            }
         }
         iio.apps[i].width=iio.apps[i].canvas.width;
         iio.apps[i].height=iio.apps[i].canvas.height;
         iio.apps[i].center.x=iio.apps[i].canvas.width/2;
         iio.apps[i].center.y=iio.apps[i].canvas.height/2;
         if(iio.apps[i].runScript.resize) iio.apps[i].runScript.resize();
         iio.apps[i].draw();
      }
   }
   window.onresize=function(){iio.resize()}

   //DEFAULT PROPERTIES
   iio.apps=[];

   //INITIALIZATION FUNCTIONS
   iio.start=function(app,id,d){
      var c;

      //create with element id
      if(id){
         c=document.getElementById(id);
         if(!c){

            //create with existing canvas
            if(id.tagName=='CANVAS')c=id;

            //create in existing element
            else if(iio.isNumber(id)||id.x){
               c = iio.create_canvas(id.x||id,id.y||id);
               if(d) d.appendChild(c);
               else document.body.appendChild(c);
            }
         }
      //create fullscreen
      } else {
         iio.prep_fullscreen();
         c = iio.create_canvas();
         document.body.appendChild(c);
      }

      //initialize application with settings
      if(app instanceof Array)
         return new iio.App(c,app[0],app[1]);

      //run iio file 
      else if(iio.isString(app)&&app.substring(app.length-4)=='.iio')
         return iio.read(app,function(s){iio.start(s)});

      //initialize application without settings
      return new iio.App(c,app);
   }
   iio.prep_fullscreen = function(){
      document.body.style.margin=0;
      document.body.style.padding=0;
   }
   iio.create_canvas = function( w, h ){
      var c = document.createElement('canvas');

      //create with size
      if(w) {
         c.width=w;
         c.height=h;
      }

      //create fullscreen
      else {
         c.margin=0;
         c.padding=0;
         c.style.position='absolute';
         c.fullscreen=true;
         if(window.jQuery){
            c.width=$(document).width();
            c.height=$(document).height();
         } else {
            c.width=window.innerWidth;
            c.height=window.innerHeight;
         }
      }

      return c;
   }

   //SHARED FUNCTIONS
   iio.init_obj = function(o){

      iio.init_obj_properties(o);

      o.run=function(s,nd){ return iio.run(s,o,nd) }

      o.loop=function(fps,fn){
         o.looping=true;
         var loop;
         if(typeof fn=='undefined'){
            if(typeof fps=='undefined'){
               if(o.app.mainLoop) iio.cancelLoop(o.app.mainLoop.id);
               loop = o.app.mainLoop={fps:60,fn:o,af:o.rqAnimFrame,o:o.app};
               o.app.fps=60;
               loop.id = o.app.mainLoop.id=iio.loop(o.app.mainLoop);
            } else {
               if(!iio.isNumber(fps)){
                  loop = {fps:60,fn:fps,af:o.rqAnimFrame}
                  loop.id = iio.loop(loop,fps);
               } else {
                  if(o.app.mainLoop) iio.cancelLoop(o.app.mainLoop.id);
                  loop=o.app.mainLoop={fps:fps,o:o.app,af:false}
                  o.app.fps=fps;
                  loop.id=o.app.mainLoop.id=iio.loop(o.app.mainLoop);
               }
            }
         } else {
            loop = {fps:fps,fn:fn,o:o,af:o.rqAnimFrame};
            loop.id = iio.loop(fps,loop);
         }
         o.loops.push(loop);
         /*if(typeof o.app.fps=='undefined'||o.app.fps<fps){
            if(o.app.mainLoop) iio.cancelLoop(o.app.mainLoop.id);
            o.app.mainLoop={fps:fps,o:o.app,af:o.app.rqAnimFrame}
            o.app.fps=fps;
            o.app.mainLoop.id=iio.loop(o.app.mainLoop);
         }*/
         return loop.id;
      }
      o.clearLoops=function(){
         for(var i=0;i<o.loops.length;i++)
            iio.cancelLoop
      }
      o.pause=function(c){
         if(o.paused){
            o.paused=false;
            for(var i=0;i<o.loops.length;i++)
               iio.loop(o.loops[i]);
            if(o.mainLoop) iio.loop(o.mainLoop);
            if(typeof c=='undefined')
               for(var i=0;i<o.objs.length;i++)
                  for(var l=0;l<o.objs[i].loops.length;l++)
                     iio.loop(o.objs[i].loops[l]);
         } else {
            iio.cancelLoops(o);
            iio.cancelLoop(o.mainLoop.id);
            o.paused=true;
         }
      }
      o.playAnim=function(fps,t,r,fn,s){
         if(iio.isString(t)){
            for(var i=0;i<o.anims.length;i++)
               if(o.anims[i].tag==t) {
                  o.animKey=i;
                  o.width=o.anims[i].frames[o.animFrame].w;
                  o.height=o.anims[i].frames[o.animFrame].h;
                  break;
               }
         } else r=t;
         o.animFrame=s||0;
         if(typeof(r)!='undefined'){
            o.repeat=r;
            o.onanimstop=fn;
         } 
         forward=function(o){
            o.animFrame++;
            if(o.animFrame>=o.anims[o.animKey].frames.length){
               o.animFrame=0;
               if(typeof(o.repeat)!='undefined'){
                  if(o.repeat<=1){
                     window.cancelAnimationFrame(id);
                     window.clearTimeout(id);
                     if(o.onanimstop) o.onanimstop(id,o);
                     return;
                  } else o.repeat--;
               }
            }
         }
         backward=function(o){
            o.animFrame--;
            if(o.animFrame<0)
               o.animFrame=o.anims[o.animKey].frames.length-1;
            o.app.draw();
         }
         var loop;
         if(fps>0) loop=o.loop(fps,forward);
         else if(fps<0) loop=o.loop(fps*-1,backward);
         else o.app.draw();
         return loop;
      }
      o.eval=function(s){
         if(!s)return 0;
         if(iio.isNumber(s))
            return parseFloat(s);
         else if(s=='center') return o.center;
         else if(s=='width') return o.width;
         else if(s=='height') return o.height;
         else if(s=='hidden') return o.hidden;
         else if(s=='random') return iio.random();
         else if(s=='randomColor') return iio.randomColor();
         var op; op=s.indexOf('-');
         if(op>-1) return o.eval(s.substring(0,op))-o.eval(s.substring(op+1));
         op=s.indexOf('+');
         if(op>-1) return o.eval(s.substring(0,op))+o.eval(s.substring(op+1));
         op=s.indexOf('/');
         if(op>-1) return o.eval(s.substring(0,op))/o.eval(s.substring(op+1));
         op=s.indexOf('*');
         if(op>-1) return o.eval(s.substring(0,op))*o.eval(s.substring(op+1));
         return s;
      }
   }
   iio.init_obj_properties = function(o){
      o.scale=1;
      o.objs=[];
      o.set=set;
      o.add=add;
      o.rmv=rmv;
      o.rqAnimFrame=true;
      o.partialPx=true;
      o.alpha=1;
      o.loops=[];
   }
   iio.set=function(os,p){
      for(var i=0;i<os.length;i++)
         os[i].set(p);
   }
   iio.update_object=function(o){
      if(o.text)o.type=iio.TEXT;
      if(o.simple){
         if(!(o.bbx instanceof Array)){
            o.bbx=[o.bbx,o.bbx];
         } else if(typeof(o.bbx[1]=='undefined'))
            o.bbx[1]=o.bbx[0];
      }
      if(o.anims){
         o.animKey=0;
         o.animFrame=0;
         if(!o.width)o.width=o.anims[o.animKey].frames[o.animFrame].w;
         if(!o.height)o.height=o.anims[o.animKey].frames[o.animFrame].h;
      }
      if(o.bezier)
         for(var i=0;i<o.bezier.length;i++)
            if(o.bezier[i]=='n')o.bezier[i]=undefined;
      if(o.img&&iio.isString(o.img)){
         nd=false;
         var src=o.img;
         o.img=new Image();
         o.img.src=src;
         o.img.parent=o;
         if((typeof o.width=='undefined'&&typeof o.radius=='undefined')||o.radius==0)
            o.img.onload=function(e){
               if(o.parent.radius==0) o.parent.radius=o.width/2;
               else {
                  o.parent.width=o.width||0;
                  o.parent.height=o.height||0;
               }
               if(nd); else o.parent.app.draw();
            }
      } else if(o.img){
         if((typeof o.width=='undefined'&&typeof o.radius=='undefined')||o.radius==0){
            if(o.radius==0) o.radius=o.img.width/2;
               else {
                  o.width=o.img.width||0;
                  o.height=o.img.height||0;
               }
               if(nd); else o.app.draw();
         }
      }
      if(((o.vel&&(o.vel.x!=0||o.vel.y!=0||o.vel.r!=0))||o.shrink||o.fade||(o.acc&&(o.acc.x!=0||o.acc.y!=0||o.acc.r!=0)))
         &&(typeof o.app.looping=='undefined'||o.app.looping===false))
         o.app.loop();
   }
   set = function( s, no_draw ){

      //set array of settings
      if(s instanceof Array)
         for(var i=0;i<s.length;i++)
            this.set(s[i],no_draw);

      //set with iio script
      else if(iio.isNumber(s)){
         if(this.radius) this.radius=s/2;
         else if(this.width==this.height) this.width=this.height=s;
         else this.width=s;
      } else if(iio.isString(s)) iio.run(s.split(" "),this,true);

      //set with JSON
      else for(var p in s) this[p]=s[p];

      iio.update_object(this);

      //draw if not flagged
      if(no_draw); else this.app.draw();

      return this;
   }
   add=function(o,ii,s,nd){
      if(typeof nd=='undefined') nd=s;
      if(o instanceof Array&&!iio.isNumber(o[0])&&typeof(o[0].x)=='undefined')
         for(var i=0;i<o.length;i++)
            this.add(o[i],ii,s,nd);
      else if(typeof(o.type)!='undefined'){
         o.parent=this;
         o.app=this.app;
         nd=ii;
         if(typeof(o.z)=='undefined') o.z=0;
         var i=0;while(i<this.objs.length&&typeof(this.objs[i].z)!='undefined'&&o.z>=this.objs[i].z)i++;
         this.objs.insert(i,o);
      } else o=this.add(new iio.Obj(o,ii,s,this),true);
      if(nd); else this.app.draw();
      return o;
   }
   rmv=function(o,nd){
      if(typeof o=='undefined')
         this.objs=[];
      else if(o instanceof Array)
         for(var i=0;i<o.length;i++) this.rmv(o[i]);
      else if(iio.isNumber(o)&&o<this.objs.length)
         this.objs.splice(o,1);
      else if(this.objs) for(var i=0;i<this.objs.length;i++)
         if(this.objs[i]==o) { this.objs.splice(i,1); break }
      if(this.collisions) for(var i=0;i<this.collisions.length;i++){
         if(this.collisions[i][0]==o||this.collisions[i][1]==o)
            this.collisions.splice(i,1);
         else if(this.collisions[i][0] instanceof Array)
            for(var j=0;j<this.collisions[i][0].length;j++)
               if(this.collisions[i][0][j]==o){
                  this.collisions[i][0].splice(j,1);
                  break;
               }
         if(this.collisions[i][1] instanceof Array)
            for(var j=0;j<this.collisions[i][1].length;j++)
               if(this.collisions[i][1][j]==o){
                  this.collisions[i][1].splice(j,1);
                  break;
               }
      }
      if(nd); else this.app.draw();
      return o;
   }

   iio.addInputListeners=function(o){
      o.onmousedown=function(e){
         var ep=this.parent.convertEventPos(e);
         if(this.parent.click) this.parent.click(e,ep);
         for(var i=0;i<this.parent.objs.length;i++){
            if(i!==0)ep=this.parent.convertEventPos(e);
            if(this.parent.objs[i].contains&&this.parent.objs[i].contains(ep))
               if(this.parent.objs[i].click){
                  if(this.parent.objs[i].type==iio.GRID){
                     var c=this.parent.objs[i].cellAt(ep);
                     this.parent.objs[i].click(e,ep,c,this.parent.objs[i].cellCenter(c.c,c.r));
                  }
                  else this.parent.objs[i].click(e,ep);
               }
         }
      }
   }
   iio.addEvent(window,'keydown',function(e){
      var k=iio.getKeyString(e);
      for(var i=0;i<iio.apps.length;i++)
         if(iio.apps[i].runScript&&iio.apps[i].runScript.onKeyDown)
            iio.apps[i].runScript.onKeyDown(e,k);
   });
   iio.addEvent(window,'keyup',function(e){
      var k=iio.getKeyString(e);
      for(var i=0;i<iio.apps.length;i++)
         if(iio.apps[i].runScript&&iio.apps[i].runScript.onKeyUp)
            iio.apps[i].runScript.onKeyUp(e,k);
   });
   iio.addEvent(window, 'scroll', function(event){
      for(var i=0;i<iio.apps.length;i++){
         var p=iio.apps[i].canvas.getBoundingClientRect();
         iio.apps[i].pos={x:p.left,y:p.top};
      }
   });
   //APP
   function App(){
      this.App.apply(this,arguments);
   }; iio.App=App;
   App.prototype.App=function(view,app,s){

      //set type
      this.type = iio.APP;
      this.app=this;

      //set canvas & context
      this.canvas = view;
      this.ctx = view.getContext('2d');

      //prep canvas
      this.canvas.parent=this;
      iio.addInputListeners(this.canvas);

      //get width & height from canvas
      this.width=view.clientWidth||view.width;
      this.height=view.clientHeight||view.height;

      //set center
      this.center={x:this.width/2,y:this.height/2};

      //get DOM offset of canvas
      var offset=view.getBoundingClientRect();

      //set canvas DOM position
      this.pos={x:offset.left,y:offset.top};

      //create convert function with offset
      this.convertEventPos=function(e){
         return {x:e.clientX-this.pos.x,y:e.clientY-this.pos.y}
      }

      //initialize iio object
      iio.init_obj(this);

      //initialize app properties
      this.collisions=[];

      //add app to global app array
      iio.apps.push(this);

      //run iio script
      if(iio.isString(app)){
         this.runScript=iio.run(app,this);
         this.draw();
      } else this.runScript = new app(this,s);
   }
   App.prototype.stop=function(){
      for(var i=0;i<this.objs.length;i++)
         iio.cancelLoops(this.objs[i]);
      iio.cancelLoops(this);
      if(this.mainLoop) iio.cancelLoop(this.mainLoop.id);
      this.clear();
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
         this.canvas.style.opacity=this.alpha;
      if(this.objs.length>0)
         for(var i=0;i<this.objs.length;i++)
            if(this.objs[i].draw)
               this.objs[i].draw(this.ctx);
   }
   App.prototype.clear=function(){
      this.ctx.clearRect(0,0,this.width,this.height);
      /*if(this.color){
         this.ctx.fillStyle=this.color;
         this.ctx.fillRect(0,0,this.width,this.height);
      }*/
   }
   App.prototype.collision=function(o1,o2,fn){
      this.collisions.push([o1,o2,fn]);
   }
   App.prototype.cCollisions=function(o1,o2,fn){
      if(o1 instanceof Array){
         if(o2 instanceof Array){
            if(o2.length==0) return;
            for(var i1=0;i1<o1.length;i1++)
               for(var i2=0;i2<o2.length;i2++)
                  if(iio.checkCollision(o1[i1],o2[i2]))
                     fn(o1[i1],o2[i2]);
         } else {
            for(var i=0;i<o1.length;i++)
               if(iio.checkCollision(o1[i],o2))
                  fn(o1[i],o2);
         }
      } else {
         if(o2 instanceof Array){
            for(var i=0;i<o2.length;i++)
               if(iio.checkCollision(o1,o2[i]))
                  fn(o1,o2[i]);
         } else if(iio.checkCollision(o1,o2))
            fn(o1,o2);
      }
   }
   App.prototype._update=function(o,dt){
      if(this.update)this.update(dt);
      if(this.objs&&this.objs.length>0)
         for(var i=0;i<this.objs.length;i++)
            if(this.objs[i]._update)
               if(this.objs[i]._update(o,dt))
                  this.rmv(this.objs[i]);
      if(this.collisions&&this.collisions.length>0){
         for(var i=0;i<this.collisions.length;i++)
            this.cCollisions(this.collisions[i][0],this.collisions[i][1],this.collisions[i][2]);
      }
   }
   iio.checkCollision=function(o1,o2){
      if(typeof(o1)=='undefined'||typeof(o2)=='undefined') return false;
      if(o1.type==iio.RECT&&o2.type==iio.RECT){
         if(o1.simple){
            if(o2.simple) return iio.rectXrect(
               o1.pos.x-o1.bbx[0],o1.pos.x+o1.bbx[0],o1.pos.y-(o1.bbx[1]||o1.bbx[0]),o1.pos.y+(o1.bbx[1]||o1.bbx[0]),
               o2.pos.x-o2.bbx[0],o2.pos.x+o2.bbx[0],o2.pos.y-(o2.bbx[1]||o2.bbx[0]),o2.pos.y+(o2.bbx[1]||o2.bbx[0]));
            else return iio.rectXrect(
               o1.pos.x-o1.bbx[0],o1.pos.x+o1.bbx[0],o1.pos.y-(o1.bbx[1]||o1.bbx[0]),o1.pos.y+(o1.bbx[1]||o1.bbx[0]),
               o2.left,o2.right,o2.top,o2.bottom);
         } else if(o2.simple) return iio.rectXrect(o1.left,o1.right,o1.top,o1.bottom,
            o2.pos.x-o2.bbx[0],o2.pos.x+o2.bbx[0],o2.pos.y-(o2.bbx[1]||o2.bbx[0]),o2.pos.y+(o2.bbx[1]||o2.bbx[0]));
         else return iio.rectXrect(o1.left,o1.right,o1.top,o1.bottom,o2.left,o2.right,o2.top,o2.bottom)
      }
   }
   iio.rectXrect = function(r1L,r1R,r1T,r1B,r2L,r2R,r2T,r2B){
      if (r1L<r2R&&r1R>r2L&&r1T<r2B&&r1B>r2T) return true; return false;
   }

   function SpriteMap(){
      this.SpriteMap.apply(this,arguments);
   }; iio.SpriteMap=SpriteMap;

   SpriteMap.prototype.SpriteMap=function(src,p){
      this.img = new Image();
      this.img.src=src;
      this.img.onload=p.onload;
      return this;
   }
   SpriteMap.prototype.sprite=function(w,h,a,x,y,n){
      var s={};
      if(iio.isString(w)){
         s.tag=w; w=h; h=a; a=x; x=y; y=n;
      } 
      if(w instanceof Array) s.frames=w;
      else if(a instanceof Array) s.frames=a;
      else {
         s.frames=[];
         for(var i=0;i<a;i++) 
            s.frames[i]={x:w*i,y:y,w:w,h:h};
      }
      for(var i=0;i<s.frames.length;i++){
         if(typeof(s.frames[i].src)=='undefined')
            s.frames[i].src=this.img;
         if(typeof(s.frames[i].w)=='undefined')
            s.frames[i].w=w;
         if(typeof(s.frames[i].h)=='undefined')
            s.frames[i].h=h;
      }
      return s;
   }

   //OBJ
   function Obj(){
      this.Obj.apply(this, arguments);
   }; iio.Obj=Obj;

   Obj.prototype.Obj = function(p,s,ss,pp){

      iio.init_obj(this);

      //adjust parameters
      if(typeof(pp)=='undefined')pp=ss;
      if(pp){ this.parent=pp; this.app=pp.app }

      //run iio script
      if(iio.isString(p)){
         var _p=iio.parsePos(p.split(' '),this.parent);
         if(_p.ps) p=_p.ps;
         else p={x:0,y:0};
         ss=s; s=_p.p; 
      } 

      //get position
      p=iio.pointsToVecs(p);
      this.pos=p[0];
      if(p.length==2) this.type=iio.LINE;

      //set positional properties
      this.center={x:0,y:0};
      this.rot=0;
      this.vel={x:0,y:0,r:0};
      this.acc={x:0,y:0,r:0};

      //set specified properties
      s=[s,ss]; this.set(s,true);

      //init polygon
      if(p.length>2){
         this.vs=p;
         iio.initPoly(this);

      //init line
      } else if(p.length==2) {
         this.endPos=p[1];
         iio.initLine(this);

      //init shape
      } else {

         //init text
         if(this.type==iio.TEXT) iio.initText(this);

         //init circle
         else if(this.type==iio.CIRC) iio.initCirc(this);
         else {

            //init rect
            iio.initRect(this);

            //init grid
            if(this.type==iio.GRID) 
               iio.initGrid(this);

            else this.type=iio.RECT;
         }

         //define update properties for shapes
         this.updateProps=function(){
            this.center=this.pos;
            this.left=this.pos.x-this.width/2;
            this.right=this.pos.x+this.width/2;
            this.top=this.pos.y-this.height/2;
            this.bottom=this.pos.y+this.height/2;
         }; this.updateProps();
      }  

      //init origin
      if(this.origin=='center') this.origin=this.center;

      iio.init_obj_functions(this);
   }
   iio.init_obj_functions = function(o){
      o.clear=function(){
         this.objs=[];
         this.app.draw();
      }
      iio.resolveBounds=function(b,c){
         if(b.length>1) return b[1](c);
         return true;
      }
      iio.upperBoundReached=function(bnd,lim,c){
         if(lim>bnd[0]) return iio.resolveBounds(bnd,c);
         return false;
      }
      iio.lowerBoundReached=function(bnd,lim,c){
         if(lim<bnd[0]) return iio.resolveBounds(bnd,c);
         return false;
      }
      o._shrink=function(s,r){
         this.width*=1-s;
         this.height*=1-s; 
         if(this.width<.02){
            if(r) return r(this);
            else return true;
         }
      }
      o._fade=function(s,r){
         this.alpha*=1-s;
         if(this.alpha<.002){
            if(r) return r(this);
            else return true;
         }
      }
      o._update=function(o,dt){
         if(this.update)this.update(dt);
         var remove = false;
         if(this.bounds&&!this.simple){
            if(this.bounds.right)remove = iio.upperBoundReached(this.bounds.right,this.right,this);
            if(this.bounds.left) remove = iio.lowerBoundReached(this.bounds.left,this.left,this);
            if(this.bounds.top) remove = iio.lowerBoundReached(this.bounds.top,this.top,this);
            if(this.bounds.bottom) remove = iio.upperBoundReached(this.bounds.bottom,this.bottom,this);
         } else if(this.bounds){
            if(this.bounds.right) remove = iio.upperBoundReached(this.bounds.right,this.pos.x,this);
            if(this.bounds.left) remove = iio.lowerBoundReached(this.bounds.left,this.pos.x,this);
            if(this.bounds.top) remove = iio.lowerBoundReached(this.bounds.top,this.pos.y,this);
            if(this.bounds.bottom) remove = iio.upperBoundReached(this.bounds.bottom,this.pos.y,this);
         }
         if(this.shrink){
            if(this.shrink instanceof Array)
               remove=this._shrink(this.shrink[0],this.shrink[1]);
            else remove=this._shrink(this.shrink);
         } if(this.fade){
            if(this.fade instanceof Array)
               remove=this._fade(this.fade[0],this.fade[1]);
            else remove=this._fade(this.fade);
         } if(remove) return remove;
         this.vel.x+=this.acc.x;
         this.vel.y+=this.acc.y;
         this.vel.r+=this.acc.r;
         if(this.vel.x)this.pos.x+=this.vel.x;
         if(this.vel.y)this.pos.y+=this.vel.y;
         if(this.vel.r)this.rot+=this.vel.r;
         if(!this.simple) this.updateProps(this.vel);
         if(this.objs&&this.objs.length>0)
         for(var i=0;i<this.objs.length;i++)
            if(this.objs[i]._update)
               if(this.objs[i]._update(o,dt))
                  this.rmv(this.objs[i]);
      }
      o.draw=function(ctx){
         if(this.hidden)return;
         if(typeof(ctx)=='undefined') ctx=this.app.ctx;
         ctx.save();
         if(this.origin)
            ctx.translate(this.origin.x,this.origin.y);
         else ctx.translate(this.pos.x,this.pos.y);
         if(this.rot!=0) ctx.rotate(this.rot);
         if(this.objs.length>0){
            var drawnSelf=false;
            for(var i=0;i<this.objs.length;i++){
               if(!drawnSelf&&this.objs[i].z>=this.z){
                  this.__draw(ctx);
                  drawnSelf=true;
               }
               if(this.objs[i].draw)
                  this.objs[i].draw(ctx);
            }
            if(!drawnSelf)this.__draw(ctx);
         } else this.__draw(ctx);
         ctx.restore();
      }
      o.__draw=function(ctx){
         ctx.save();
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
         ctx.restore();
      }
      o.createGradient=function(ctx,g){
         var gradient;
         var p=g.split(':');
         var ps=p[1].split(',');
         if(ps.length==4)
            gradient=ctx.createLinearGradient(this.eval(ps[0]),this.eval(ps[1]),this.eval(ps[2]),this.eval(ps[3]));
         else gradient=ctx.createRadialGradient(this.eval(ps[0]),this.eval(ps[1]),this.eval(ps[2]),this.eval(ps[3]),this.eval(ps[4]),this.eval(ps[5]));
         var c;
         for(var i=2;i<p.length;i++){
            c=p[i].indexOf(',');
            var a=parseFloat(p[i].substring(0,c));
            var b=this.eval(p[i].substring(c+1));
            gradient.addColorStop(a,b);
         }
         return gradient;
      }
   }
   iio.prepShape=function(ctx,o){
      if(o.color){
         if(o.color.indexOf&&o.color.indexOf('gradient')>-1)
            o.color=o.createGradient(ctx,o.color);
         ctx.fillStyle=o.color;
      }
      if(o.outline){
         if(o.outline.indexOf&&o.outline.indexOf('gradient')>-1)
            o.outline=o.createGradient(ctx,o.outline);
         ctx.lineWidth=o.lineWidth;
         ctx.strokeStyle=o.outline;
      }
   }
   iio.finishPathShape=function(ctx,o){
      if(o.color) ctx.fill();
      if(o.img) ctx.drawImage(o.img,-o.width/2,-o.height/2,o.width,o.height);
      if(o.outline) ctx.stroke();
      if(o.clip) ctx.clip();
   }
   iio.prepX=function(ctx,o){
      ctx.save();
      if(o.xColor.indexOf&&o.xColor.indexOf('gradient')>-1)
         o.xColor=o.createGradient(ctx,o.xColor);
      ctx.strokeStyle=o.xColor;
      ctx.lineWidth=o.lineWidth;
   }
   iio.initLine=function(o){
      o.center.x=(o.pos.x+o.endPos.x)/2;
      o.center.y=(o.pos.y+o.endPos.y)/2;
      o.width=iio.V.dist(o.pos,o.endPos);
      o.height=o.lineWidth;
      /*o.contains=function(v,y){
         if(typeof(y)!='undefined') v={x:v,y:y}
         if(iio.isBetween(v.x,this.pos.x,this.endPos.x)&&iio.isBetween(v.y,this.pos.y,this.endPos.y)){
            var a=(this.endPos.y-this.pos.y)/(this.endPos.x-this.pos.x);
            if(!isFinite(a))return true;
            var y=a*(this.endPos.x-this.pos.x)+this.pos.y;
            if(y==v.y) return true;
         }
         return false;
      }*/
      o._draw=function(ctx){
         if(o.color.indexOf&&o.color.indexOf('gradient')>-1)
            o.color=o.createGradient(ctx,o.color);
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
      }
      o.updateProps=function(v){
      	this.endPos.x+=v.x;
      	this.endPos.y+=v.y;
      	this.center.x+=v.x;
      	this.center.y+=v.y;
      }
   }
   iio.initRect=function(o){
      o._draw=function(ctx){
         iio.prepShape(ctx,this);
         ctx.translate(-this.width/2,-this.height/2);
         if(this.bezier){
            iio.drawPoly(ctx,this.getTrueVertices(),this.bezier);
            iio.finishPathShape(ctx,this);
         } else {
            iio.drawRect(ctx,this.width,this.height,{c:this.color,o:this.outline},{img:this.img,anims:this.anims,animKey:this.animKey,animFrame:this.animFrame,mov:this.mov,round:this.round});
         }
         if(this.xColor){
            iio.prepX(ctx,this);
            iio.drawLine(ctx,0,0,this.width,this.height);
            iio.drawLine(ctx,this.width,0,0,this.height);
            ctx.restore();
         }
      }
      o.getTrueVertices=function(){
         this.vs=[{x:this.left,y:this.top}
                 ,{x:this.right,y:this.top}
                 ,{x:this.right,y:this.bottom}
                 ,{x:this.left,y:this.bottom}];
         var vList=[];var x,y;
         for(var i=0;i<this.vs.length;i++){
            x=this.vs[i].x-this.pos.x;
            y=this.vs[i].y-this.pos.y;
            var v=iio.rotatePoint(x,y,this.rot);
            v.x+=this.pos.x;
            v.y+=this.pos.y;
            vList[i]=v;
         }
         return vList;
      }
      o.contains=function(v,y){
         if(this.rot) return iio.polyContains(this,v,y);
         y=v.y||y;
         v=v.x||v;
         v-=this.pos.x;
         y-=this.pos.y;
         if (v>-this.width/2&&v<this.width/2&&y>-this.height/2&&y<this.height/2)
            return true;
         return false;
      }
   }
   iio.initGrid=function(o){
      o.cells=[];
      var x=-o.res.x*(o.C-1)/2;
      var y=-o.res.y*(o.R-1)/2;
      for(var c=0;c<o.C;c++){
         o.cells[c]=[];
         for(var r=0;r<o.R;r++){
            o.cells[c][r]=o.add(new iio.Obj([x,y],{
               c:c,r:r,
               width:o.res.x,
               height:o.res.y
            },undefined,o));
            y+=o.res.y;
         }
         y=-o.res.y*(o.R-1)/2;
         x+=o.res.x;
      }
      o.clear=function(){
         this.objs=[];
         iio.initGrid(this);
         this.app.draw();
      }
      o._draw=function(ctx){
         iio.prepShape(ctx,this);
         ctx.translate(-this.width/2,-this.height/2);
         iio.drawRect(ctx,this.width,this.height,{c:this.color,o:this.outline},{img:this.img,anims:this.anims,mov:this.mov,round:this.round});
         if(this.gridColor){
            if(this.gridColor.indexOf&&this.gridColor.indexOf('gradient')>-1)
               this.gridColor=this.createGradient(ctx,this.gridColor);
            ctx.strokeStyle=this.gridColor;
            ctx.lineWidth=this.lineWidth;
            for(var c=1;c<this.C;c++)iio.drawLine(ctx,c*this.res.x,0,c*this.res.x,this.height);
            for(var r=1;r<this.R;r++)iio.drawLine(ctx,0,r*this.res.y,this.width,r*this.res.y);
         }
      }
      o.cellCenter=function(c,r){
         return {x:-this.width/2+c*this.res.x+this.res.x/2
            ,y:-this.height/2+r*this.res.y+this.res.y/2}
      }
      o.cellAt=function(x,y){
         if(x.x) return this.cells[Math.floor((x.x-this.left)/this.res.x)][Math.floor((x.y-this.top)/this.res.y)];
         else return this.cells[Math.floor((x-this.left)/this.res.x)][Math.floor((y-this.top)/this.res.y)];
      }
      o.foreachCell = function(fn,p){
         var keepGoing=true;
         for (var c=0;c<this.C;c++)
            for(var r=0;r<this.R;r++){
               keepGoing=fn(this.cells[c][r],p);
               if (typeof keepGoing!='undefined'&&!keepGoing)
                  return [r,c];
            }
      }
   }
   iio.initCirc=function(o){
      o.type=iio.CIRC;
      o.contains=function(v,y){
         if(typeof(y)!='undefined') v={x:v,y:y}
         if(this.width==this.height&&iio.V.dist(v,this.pos)<this.width/2)
            return true;
         else {
            if(this.rot){
               v.x-=this.pos.x;
               v.y-=this.pos.y;
               v=iio.rotatePoint(v.x,v.y,-this.rot);
               v.x+=this.pos.x;
               v.y+=this.pos.y;
            }
            if(Math.pow(v.x-this.pos.x,2)/Math.pow(this.width/2,2)+Math.pow(v.y-this.pos.y,2)/Math.pow(this.height/2,2)<=1)
               return true;
         }
         return false;
      }
      o._draw=function(ctx){
         iio.prepShape(ctx,this);
         ctx.beginPath();
         if(this.width!=this.height){
            ctx.moveTo(0,-this.height/2);
            if(this.bezier){
               ctx.bezierCurveTo((this.bezier[0]||this.width/2),(this.bezier[1]||-this.height/2),(this.bezier[2]||this.width/2),(this.bezier[3]||this.height/2),0,this.height/2);
               ctx.bezierCurveTo((this.bezier[4]||-this.width/2),(this.bezier[5]||this.height/2),(this.bezier[6]||-this.width/2),(this.bezier[7]||-this.height/2),0,-this.height/2);
            } else {
               ctx.bezierCurveTo(this.width/2,-this.height/2,this.width/2,this.height/2,0,this.height/2);
               ctx.bezierCurveTo(-this.width/2,this.height/2,-this.width/2,-this.height/2,0,-this.height/2);
            }
         } else ctx.arc(0,0,this.width/2,0,2*Math.PI,false);
         if(this.width!=this.height)ctx.closePath();
         iio.finishPathShape(ctx,this);
         if(this.xColor) {
            ctx.rotate(Math.PI/4)
            iio.prepX(ctx,this);
            ctx.translate(0,-o.height/2);
            iio.drawLine(ctx,0,0,0,o.height);
            ctx.translate(0,o.height/2);
            iio.drawLine(ctx,o.width/2,0,-o.width/2,0);
            ctx.restore();
         }
      }
   }
   iio.initPoly=function(o){
      o.type=iio.POLY;
      o.getTrueVertices=function(){
         var vList=[];var x,y;
         for(var i=0;i<this.vs.length;i++){
            x=this.vs[i].x-this.pos.x;
            y=this.vs[i].y-this.pos.y;
            var v=iio.rotatePoint(x,y,this.rot);
            v.x+=this.pos.x;
            v.y+=this.pos.y;
            vList[i]=v;
         }
         return vList;
      }
      o._draw=function(ctx){
         iio.prepShape(ctx,this);
         iio.drawPoly(ctx,this.vs,this.bezier,this.open);
         iio.finishPathShape(ctx,this);
      }
      o.contains=function(v,y){return iio.polyContains(this,v,y)}
      o.updateProps=function(){
         this.center=this.pos;
         /*this.left=this.pos.x-this.width/2;
         this.right=this.pos.x+this.width/2;
         this.top=this.pos.y-this.height/2;
         this.bottom=this.pos.y+this.height/2;*/
      }
   }
   iio.polyContains=function(p,v,y){
      y=(v.y||y);
      v=(v.x||v);
      var i = j = c = 0;
      var vs = p.vs;
      if(p.rot) vs = p.getTrueVertices();
      for (i = 0, j = vs.length-1; i < vs.length; j = i++) {
         if ( ((vs[i].y>y) != (vs[j].y>y)) &&
            (v < (vs[j].x-vs[i].x) * (y-vs[i].y) / (vs[j].y-vs[i].y) + vs[i].x) )
               c = !c;
      } return c;
   }
   iio.drawPoly=function(ctx,vs,bezier,open){
      ctx.beginPath();
      ctx.moveTo(0,0);
      if(bezier){
         var _i=0;
         for(var i=1;i<vs.length;i++)
            ctx.bezierCurveTo((bezier[_i++]||vs[i-1].x-vs[0].x),(bezier[_i++]||vs[i-1].y-vs[0].y)
               ,(bezier[_i++]||vs[i].x-vs[0].x),(bezier[_i++]||vs[i].y-vs[0].y)
               ,vs[i].x-vs[0].x,vs[i].y-vs[0].y);
         if(typeof(open)=='undefined'||!open){
            i--; ctx.bezierCurveTo((bezier[_i++]||vs[i].x-vs[0].x),(bezier[_i++]||vs[i].y-vs[0].y)
                  ,(bezier[_i++]||0),(bezier[_i++]||0)
                  ,0,0);
         }
      } else for(var i=1;i<vs.length;i++)
         ctx.lineTo(vs[i].x-vs[0].x,vs[i].y-vs[0].y);
      if(typeof(open)=='undefined'||!open)
         ctx.closePath();
   }
   iio.drawRect=function(ctx,w,h,s,p){
      if(p.round){
         ctx.beginPath();
         ctx.moveTo(p.round[0],0);
         ctx.lineTo(w-p.round[1],0);
         ctx.quadraticCurveTo(w,0,w,p.round[1]);
         ctx.lineTo(w,h-p.round[2]);
         ctx.quadraticCurveTo(w,h,w-p.round[2],h);
         ctx.lineTo(p.round[3],h);
         ctx.quadraticCurveTo(0,h,0,h-p.round[3]);
         ctx.lineTo(0,p.round[0]);
         ctx.quadraticCurveTo(0,0,p.round[0],0);
         ctx.closePath();
         ctx.stroke();
         ctx.fill();
         ctx.clip();
      } else {
         if(s.c) ctx.fillRect(0,0,w,h);
         if(p.img) ctx.drawImage(p.img,0,0,w,h);
         if(p.anims) ctx.drawImage(p.anims[p.animKey].frames[p.animFrame].src,
            p.anims[p.animKey].frames[p.animFrame].x,
            p.anims[p.animKey].frames[p.animFrame].y,
            p.anims[p.animKey].frames[p.animFrame].w,
            p.anims[p.animKey].frames[p.animFrame].h,
            0,0,w,h);
         if(s.o) ctx.strokeRect(0,0,w,h);
      }
   }
   iio.drawLine=function(ctx,x,y,x1,y1){
         ctx.beginPath();
         ctx.moveTo(x,y);
         ctx.lineTo(x1,y1);
         ctx.stroke();
   }
   iio.initText=function(o){
      o.size=o.width;
      o.app.ctx.font=o.size+'px '+o.font;
      o.width=o.app.ctx.measureText(o.text).width;
      o.height=o.app.ctx.measureText('W').width;
      o._draw=function(ctx){
         ctx.font=this.size+'px '+this.font;
         ctx.textAlign=this.align;
         iio.prepShape(ctx,this);
         if(this.color) ctx.fillText(this.text,0,0);
         if(this.outline) ctx.strokeText(this.text,0,0);
         if(this.showCursor)
            this.cursor.pos.x=this.cursor.endPos.x=this.getX(this.cursor.index);
      }
      o.contains=function(x,y){
         if(typeof(y)=='undefined'){y=x.y;x=x.x}
         x-=this.pos.x;
         y-=this.pos.y;
         if((typeof(this.align)=='undefined'||this.align=='left')&&x>0&&x<this.width&&y<0&&y>-this.height)
            return true;
         else if(this.align=='center'&&x>-this.width/2&&x<this.width/2&&y<0&&y>-this.height)
            return true;
         else if((this.align=='right'||this.align=='end')&&x>-this.width&&x<0&&y<0&&y>-this.height)
            return true;
         return false;
      }
      o.charWidth=function(i){
         i=i||0;
         this.app.ctx.font=this.size+'px '+this.font;
         return this.app.ctx.measureText(this.text.charAt(i)).width;
      }
      o.getX=function(i){
         this.app.ctx.font=this.size+'px '+this.font;
         if(typeof(this.align)=='undefined'||this.align=='left')
            return this.app.ctx.measureText(this.text.substring(0,i)).width;
         if(this.align=='right'||this.align=='end')
            return -this.app.ctx.measureText(this.text.substring(0,this.text.length-i)).width;
         if(this.align=='center'){
            var x=-Math.floor(this.app.ctx.measureText(this.text).width/2);
            return x+this.app.ctx.measureText(this.text.substring(0,i)).width;
         }
      }
      var tX=o.getX(o.text.length);
      o.cursor = o.add([tX,10,tX,-o.size*.8],'2 '+(o.color||o.outline),{index:o.text.length,shift:false});
      if(o.showCursor){
         o.loop(2,function(o){
            o.cursor.hidden=!o.cursor.hidden;
         })
      } else o.cursor.hidden=true;
      o.keyUp=function(k){
         if(k=='shift') this.cursor.shift=false;
      }
      o.keyDown=function(key,cI,shift,fn){
         if(!iio.isNumber(cI)){
            fn=cI; cI=this.cursor.index;
         }
         var str;
         var pre=this.text.substring(0,cI);
         var suf=this.text.substring(cI);
         if(typeof fn!='undefined'){
            str=fn(key,shift,pre,suf);
            if (str!=false){
               this.text=pre+str+suf;
               this.cursor.index=cI+1;
               if(this.showCursor) this.cursor.hidden=false;
               this.app.draw();
               return this.cursor.index;
            }
         }
         if(key.length>1){
            if(key=='space') {
               this.text=pre+" "+suf;
               cI++;
            } else if(key=='backspace'&&cI>0) {
               this.text=pre.substring(0,pre.length-1)+suf;
               cI--;
            } else if(key=='delete'&&cI<this.text.length)
               this.text=pre+suf.substring(1);
            else if(key=='left arrow'&&cI>0) cI--;
            else if(key=='right arrow'&&cI<this.text.length) cI++;
            else if(key=='shift') this.cursor.shift=true;
            else if(key=='semi-colon'){
               if (shift) this.text=pre+':'+suf;
               else this.text=pre+';'+suf;
               cI++;
            } else if(key=='equal') {
               if (shift) this.text=pre+'+'+suf;
               else this.text=pre+'='+suf;
               cI++;
            } else if(key=='comma') {
               if (shift) this.text=pre+'<'+suf;
               else this.text=pre+','+suf;
               cI++;
            } else if(key=='dash') {
               if (shift) this.text=pre+'_'+suf;
               else this.text=pre+'-'+suf;
               cI++;
            } else if(key=='period') {
               if (shift) this.text=pre+'>'+suf;
               else this.text=pre+'.'+suf;
               cI++;
            } else if(key=='forward slash') {
               if (shift) this.text=pre+'?'+suf;
               else this.text=pre+'/'+suf;
               cI++;
            } else if(key=='grave accent') {
               if (shift) this.text=pre+'~'+suf;
               else this.text=pre+'`'+suf;
               cI++;
            } else if(key=='open bracket') {
               if (shift) this.text=pre+'{'+suf;
               else this.text=pre+'['+suf;
               cI++;
            } else if(key=='back slash') {
               if (shift) this.text=pre+'|'+suf;
               else this.text=pre+"/"+suf;
               cI++;
            } else if(key=='close bracket') {
               if (shift) this.text=pre+'}'+suf;
               else this.text=pre+']'+suf;
               cI++;
            } else if(key=='single quote') {
               if (shift) this.text=pre+'"'+suf;
               else this.text=pre+"'"+suf;
               cI++;
            } 
         } else {
            if(shift||this.cursor.shift) 
               this.text=pre+key.charAt(0).toUpperCase()+suf;
            else this.text=pre+key+suf;
            cI++;
         }
         if(this.showCursor)this.cursor.hidden=false;
         this.cursor.index=cI;
         this.app.draw();
         return cI;
      }
   }
   iio.V={};
   iio.V.add = function(v1, v2){for(var p in v2) if(v1[p]) v1[p]+=v2[p];return v1}
   iio.V.sub = function(v1, v2){for(var p in v2) if(v1[p]) v1[p]-=v2[p];return v1}
   iio.V.mult = function(v1, v2){for(var p in v2) if(v1[p]) v1[p]*=v2[p];return v1}
   iio.V.div = function(v1, v2){for(var p in v2) if(v1[p]) v1[p]/=v2[p];return v1}
   iio.V.dist = function(v1, v2){return Math.sqrt(Math.pow(v2.x-v1.x,2)+Math.pow(v2.y-v1.y,2))}
})();