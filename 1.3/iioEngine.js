/*iio Engine
Vecersion 1.3.1*/
iio={};
(function(){
   //STATIC PROPERTIES : ENGINE SETTINGS
   iio.MIRROR=true;

   //FINAL PROPERTIES : ENGINE DEFINITIONS
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
   Array.prototype.insert = function (index, item) {
      this.splice(index, 0, item);
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
   iio.read=function(f,c){
       var raw=new XMLHttpRequest();
       raw.open("GET",f,true);
       raw.onreadystatechange=function(){
           if(raw.readyState===4)
               if(raw.status===200 || raw.status==0)
                   c(raw.responseText);
       }
       raw.send(null);
   }

   //INITIALIZATION FUNCTIONS
   iio.start=function(app,id){
      var c;
      if(id) c=document.getElementById(id);
      else c=document.createElement('canvas');
      if(app instanceof Array)
         return new iio.App(c,app[0],app[1]);
      return new iio.App(c,app);
   }

   //iioScript INTERPRETERS
   iio.run=function(o,s){
      if(iio.isString(s[0]))
         o.color=s[0];
      return true;
   }

   //SHARED FUNCTIONS
   init=function(){
      this.scale=1;
      this.objs=[];
      this.set=set;
      this.partialPx=true;
   }
   set=function(s,noDraw){
      if(s instanceof Array)
         for(var i=0;i<s.length;i++)
            this.set(s[i]);
      else if(iio.isString(s)){
         if(iio.isNumber(s)){

         }else{
            var ss=s.split(" ");
            var _s=0;var p;
            while(_s<ss.length){
               p=[];p[0]=ss[_s];
               while(!iio.run(this,p))
                  p.push(ss[++_s])
               _s++;
            }
         }
      }
      else for(var prop in s) this[prop]=s[prop];
      if(noDraw);else this.draw();
      return this;
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
      this.ctx=view.getContext('2d');
      this.width=view.clientWidth;
      this.height=view.clientHeight;
      this.center=new iio.Vec(this.width/2,this.height/2);
      this.init=init;this.init();
      this.app = new app(this,s);
   }
   App.prototype.draw=function(noClear){
      if(!noClear) this.ctx.clearRect(0,0,this.width,this.height);
      if(this.color){
         this.ctx.fillStyle=this.color;
         this.ctx.fillRect(0,0,this.width,this.height);
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
   Obj.prototype.Obj = function(v,p,p1){
      if(iio.isString(v)){
         p=v; v=undefined;
      }
      if(!v)v=new iio.Vec();
      var vs;
      if(iio.isNumber(p)){
         vs=iio.vecsFromPoints([v,p]);
         p=p1;
      } else vs=iio.vecsFromPoints(v);
      this.pos=new iio.Vec(vs[0]);
      iio.attachGraphicsAPI(this);

      if(vs.length==2){
         this.endPos=vs[1].clone();
         this.initLine();
         this.type=iio.LINE;
      } else if(vs.length>2){
         this.vs=[];
         for(var i=1;i<vs.length;i++)
            this.vs[i-1]=vs[i];
         this.initPoly();
         this.type=iio.POLY;
      } 

      this.init(p);

      if(this.C||this.R)this.initGrid(); 
      else if(this.radius) this.initCircle();
      else if(this.width) this.initRect();
      if(this.bezier)this.bezier=iio.vecsFromPoints(this.bezier);
   }
   getTrueVertices=function(pos,vs,r){
      var vList=[];
      for(var i=0;i<vs.length;i++)
         vList[i]=iio.Vec.add(pos,iio.rotatePoint(vs[i].x,vs[i].y,r));
      return vList;
   }
   Obj.prototype.initLine=function(){
      this.draw=function(ctx){
         if(this.bezier) return iio.drawBezierCurve(ctx,this.pos,this.endPos,this.bezier,this.bezierStyle)
         //else if(this.dash) 
            //return iio.drawDashedLine(ctx,0,0,this.endPos.x-this.pos.x,this.endPos.y-this.pos.y,this.dash)
         return iio.drawLine(ctx,0,0,this.endPos.x-this.pos.x,this.endPos.y-this.pos.y);
      }
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
   iio.script=function(obj,cmd){
      setColor=function(c){
         if(obj.type==iio.LINE||obj.type==iio.GRID)
            obj.style.strokeStyle=c;
         else obj.style.fillStyle=c;
      }
      if(iio.isNumber(cmd)){
         if(obj.type==iio.LINE||obj.type==iio.GRID)
            obj.style.lineWidth=cmd;
         else if(obj.type==iio.TEXT)
            obj.size=cmd;
         else obj.radius=cmd;
      } else {
         var cmds = cmd.split(":");
         if(iio.isNumber(cmds[0])){
            obj.width=cmds[0];
            obj.height=cmds[1]||cmds[0];
         } else if(cmds.length>1){
            if(cmds[0]=='rotate')
               obj.rotation+=cmds[1];
            else if(cmds[0]=='gradient')
               obj.style.gradient=cmds;
            else if(cmds[0]=='dash'){
               obj.dash={};
               obj.dash.segments=cmds[1].split(",");
               obj.dash.offset=cmds[2];
               for(var i=0;i<obj.dash.segments.length;i++)
                  obj.dash.segments[i]=parseFloat(obj.dash.segments[i]);
            } else if(cmds[0]=='outline'){
               for(var i=1;i<cmds.length;i++)
                  if(iio.isNumber(cmds[i]))
                     obj.style.lineWidth=parseFloat(cmds[i]);
                  else obj.style.strokeStyle=cmds[i];
            } else if(cmds[0]=='bezier'){
               var ss = cmds[1].split(",");
               obj.bezier=[];
               obj.bezier[0] = {x:ss[0],y:ss[1]};
               obj.bezier[1] = {x:ss[2],y:ss[3]};
            } else if(cmds[0]=='round')
               obj.style.round=cmds[1];
            else if(cmds[0]=='font')
               obj.font=cmds[1];
            else if(cmds[0]=='align')
               obj.align=cmds[1];
            else if(cmds[0]=='baseline')
               obj.baseline=cmds[1];
            else if(cmds[0]=='R')
               obj.R=parseInt(cmds[1],10);
            else if(cmds[0]=='C')
               obj.C=parseInt(cmds[1],10)
            else if(cmds[0]=='refLine'){
               if(!obj.refLine) obj.refLine={};
               if(iio.isNumber(cmds[1]))
                  obj.refLine.lineWidth=cmds[1];
               else obj.refLine.color=cmds[1];
               if(iio.isNumber(cmds[2]))
                  obj.refLine.lineWidth=cmds[2];
               else obj.refLine.color=cmds[2];

            }
            else console.log("iioScript error: '"+cmds[0]+"' is not a valid command");
         } else if(cmd=='butt'||cmd=='round'||cmd=='square')
            obj.style.lineCap=cmd;
         else if(cmd=='italic')
            obj.italic=true;
         else if(cmd=='bold')
            obj.bold=true;
         else setColor(cmd);/**/
         if(obj.R)obj.type=iio.GRID;
      }
   }
   iio.attachGroupAPI=function(obj){
      obj.objs=[];
      add = function(p,s,t){
         var obj;
         if(typeof s!='undefined'&&iio.isString(p)){
            obj=new iio.Text(p,s,t);

         } else if(iio.isNumber(p)||iio.isString(p))
            obj=new iio.Obj(p,s,t);
         else if(p instanceof Array||p instanceof iio.Vec)
            obj=new iio.Obj(p,s);
         else obj=p.set(s);

         if(this.objs.length!=0&&typeof obj.z!='undefined'){
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
      obj.add=add;
   }
   iio.attachGraphicsAPI=function(obj){

      iio.attachGroupAPI(obj);

      obj.setProperties = function(p){
         for(var prop in p)this[prop]=p[prop];
         return this;
      }
      obj._set = function(s){
            if(iio.isString(s)){
               var cmds = s.split(" ");
               for(var i=0;i<cmds.length;i++)
                  iio.script(obj,cmds[i]);
            } else if(iio.isNumber(s))
               iio.script(obj,s);
            else for(var prop in s) this[prop]=s[prop];
         }
      obj.set = function(s){
         if(s instanceof Array)
            for(var i=0;i<s.length;i++)
               this._set(s[i]);
         else this._set(s)
         return this;
      }

      obj.init = function(p){
         this.style={};
         this.rotation=0;
         this.set(p);
      }
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
               s.style);
         }
      else if (o.m_edgeA)
         iio.transformContext(o.ctx,o.pos,o.rotation,o.origin,o.scale);*/
      if(o.style.gradient&&o.style.gradient instanceof Array){
         var ps = o.style.gradient[1].split(",");
         var g;
         if(ps.length==4)
            g = ctx.createLinearGradient(ps[0],ps[1],ps[2],ps[3]);
         else g = ctx.createRadialGradient(ps[0],ps[1],ps[2],ps[3],ps[4],ps[5])
         for(var i=2;i<o.style.gradient.length;i++){
            ps=o.style.gradient[i];
            var c=ps.indexOf(",")
            g.addColorStop(ps.substr(0,c),ps.substr(c+1));
         }
         if(o.type==iio.LINE||o.type==iio.GRID)
            o.style.strokeStyle=g;
         else o.style.fillStyle=g;
         o.style.gradient=undefined;
      }
      sNd=function(ob){
         ctx.save();
         iio.applyContextStyle(ctx,ob.style);
         if(ob.dash) {
            ctx.setLineDash(ob.dash.segments);
            if(ob.dash.offset) ctx.lineDashOffset = ob.dash.offset;
         }
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
            iio.transformContext(ctx,o.objs[i].pos,o.objs[i].rotation,o.objs[i].origin,o.objs[i].scale,o.objs[i].style);
            sNd(o.objs[i]);
            ctx.restore();
         }
         if(oNotDrawn&&o.draw) sNd(o); 
      }else if(o.draw) sNd(o);
      //if(s&&s.draw) s.draw()
      ctx.restore();
   }
   iio.applyContextStyle = function(ctx,s){
      for(var prop in s)ctx[prop]=s[prop];
      if(!s||!s.strokeStyle)ctx.strokeStyle='rgba(0, 0, 0, 0)';
      if(!s||s&&!s.fillStyle)ctx.fillStyle='rgba(0, 0, 0, 0)';
      return ctx;
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
      //if (obj.style.refLine) iio.drawLine(ctx,0,0,obj.radius,0);
      return ctx;
   }
   iio.drawLine = function(ctx,x1,y1,x2,y2){
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
   }
})();