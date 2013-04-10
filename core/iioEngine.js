/*
* Software: iio Engine
* Version: 1.2.1
* Author: Sebastian Bierman-Lytle
* Released: 3/16/2013
* Website: iioEngine.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:

* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.

* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.

* 3. This notice may not be removed or altered from any source distribution.
*/
//JavaScript Extensions
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
   if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
   };   
})();

//iio Engine :: Definition of iio package
var iio = {};
(function (iio) {
   //iio.isiPad = navigator.userAgent.match(/iPad/i) != null;
   function emptyFn() {};
   iio.inherit = function(child, parent) {
      var tmp = child;
      emptyFn.prototype = parent.prototype;
      child.prototype = new emptyFn;
      child.prototype.constructor = tmp;
   };
   iio.start = function(app,id,w,h){
      if (typeof app =='undefined') throw new Error("ioStart: No application script provided | Docs: ioController -> ioStart");
      if (typeof iio.apps == 'undefined') iio.apps = [];
      iio.apps[iio.apps.length]=new iio.ioAppManager(app, id, w, h);
      return iio.apps[iio.apps.length-1];
   }
   iio.stop = function(app){
      if (iio.isNumber(app))
         iio.apps.splice(app,1);
      else for (var i=0;i<iio.apps.length;i++)
         if (iio.apps[i] == app)
         iio.apps.splice(i,1);

   }
   iio.requestTimeout = function(fps,lastTime,callback){
       //Callback method by Erik Möller, Paul Irish, Tino Zijdel
       //https://gist.github.com/1579671=
       var currTime = new Date().getTime();
       var timeToCall = Math.max(0, (1000/fps) - (currTime - lastTime));
       var id = setTimeout(function() { callback(currTime + timeToCall); }, 
         timeToCall);
       lastTime = currTime + timeToCall;
       return id;
   }
   /*window.addEventListener('keydown',function(event){
      if (typeof iio.apps!='undefined')
         for (var i=0;i<iio.apps.length; i++)
            if (typeof iio.apps[i].app.keyDown!='undefined')
               iio.apps[i].app.keyDown(event);
   });
   window.addEventListener('keyup',function(event){
      if (typeof iio.apps!='undefined')
         for (var i=0;i<iio.apps.length; i++)
            if (typeof iio.apps[i].app.keyUp!='undefined')
               iio.apps[i].app.keyUp(event);
   });*/

   /* iio Functions
    */
    iio.isNumber=function(o){
      return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
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
   iio.getRandomNum = function(min, max) {
      min=min||0;
      max=max||1;
      return Math.random() * (max - min) + min;
   }
   iio.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
   }
   iio.getioVecsFromPointList = function(points){
      var vecs = [];
      for (var i=0;i<points.length;i++){
         if (typeof points[i].x !='undefined')
            vecs[vecs.length]=new iio.ioVec(points[i]);
         else {
            vecs[vecs.length]=new iio.ioVec(points[i],points[i+1]);
            i++;
         }
      } return vecs;
   }
   iio.getCentroid = function(vecs){
      var cX;
      var cY;
      for (var i=0;i<vecs.length;i++){
         cX+=vecs[i].x;
         cY+=vecs[i].y;
      }
      return new iio.ioVec(cX/vecs.length,cY/vecs.length);
   }
   iio.getSpecVertex = function(vertices,comparator){
      var v = vertices[0];
      for (var i=0;i<vertices.length;i++)
         if (comparator(v,vertices[i]))
            v=vertices[i];
      return v;
   }
   iio.keyCodeIs = function(key, event){
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
      if (typeof v !='undefined' && typeof v.x != 'undefined'){
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
   ioVec.prototype.toString = function(){
      return "x:"+this.x+" y:"+this.y;
   }
   ioVec.toString = function(v){
      return "x:"+v.x+" y:"+v.y; 
   }
   ioVec.prototype.set = function (v,y){
      if (typeof v.x != 'undefined'){
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
   ioVec.length = function(v,y){
      if (typeof v.x !='undefined')
         return Math.sqrt(v.x*v.x+v.y*v.y);
      else return Math.sqrt(v*v+y*y);
   }
   ioVec.prototype.add = function (v,y){
      if (typeof v.x != 'undefined'){
         this.x+=v.x;
         this.y+=v.y;
      } else {
         this.x+=v;
         this.y+=y;
      } return this;
   }
   ioVec.add = function(v1, v2, x2, y2){
      if (typeof v1.x != 'undefined')
            return (new ioVec(v1)).add(v2,x2);
      else return (new ioVec(v1,v2)).add(x2,y2);
   }
   ioVec.prototype.sub = function (v,y){
      if (typeof v.x != 'undefined')
         this.add(-v.x,-v.y);
      else this.add(-v,-y);
      return this;
   }
   ioVec.sub = function(v1, v2, x2, y2){
      if (typeof v1.x != 'undefined')
            return (new ioVec(v1)).sub(v2,x2)
      else return (new ioVec(v1,v2)).sub(x2,y2);
   }
   ioVec.prototype.mult = function (f){
      this.x*=f;
      this.y*=f;
      return this;
   }
   ioVec.mult = function(v, y, f){
      if (typeof v.x != 'undefined')
         return (new ioVec(v)).mult(y);
      else return (new ioVec(v, y)).mult(f);
   }
   ioVec.prototype.div = function (d){
      this.x/=d;
      this.y/=d;
      return this;
   }
   ioVec.div = function(v, y, f){
      if (typeof v.x != 'undefined')
         return (new ioVec(v)).div(y)
      else return (new ioVec(v,y)).div(f);
   }
   ioVec.prototype.dot = function (v, y){
      if (typeof v.x != 'undefined')
         return this.x*v.x+this.y*v.y;
      else return this.x*v+this.y*y;
   }
   ioVec.dot = function (v1, v2, x2, y2){
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
   ioVec.prototype.normalize = function (){
      this.div(this.length());
      return this;
   }
   ioVec.normalize = function(v,y){
      return (new ioVec(v,y)).normalize();
   }
   ioVec.prototype.lerp = function(v,y,p){
      if (typeof v.x != 'undefined')
         this.add(ioVec.sub(v,this).mult(y));
      else this.add(ioVec.sub(v,y,this).mult(p));
      return this;
   }
   ioVec.lerp = function(v1,v2,x2,y2,p){
      if (typeof v1.x != 'undefined')
         return (new ioVec(v1)).lerp(v2,x2,y2);
      else return (new ioVec(v1,v2)).lerp(x2, y2, p);
   }
   ioVec.prototype.distance = function(v,y){
      if (typeof v.x != 'undefined')
         return Math.sqrt((v.x-this.x)*(v.x-this.x)+(v.y-this.y)*(v.y-this.y));
      else return Math.sqrt((v-this.x)*(v-this.x)+(y-this.y)*(y-this.y));
   }
   ioVec.distance = function(v1,v2,x2,y2){
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
      this.styles={};
   }

   //Functions
   ioObj.prototype.clone = function(){
      return new ioObj(this.pos);
   }
   ioObj.prototype.setPos = function(v,y){
      this.pos = new ioVec(v,y);
      return this;
   }
   ioObj.prototype.translate = function(v,y){
      this.pos.add(v,y);
      return this;
   }
   ioObj.prototype.rotate = function(r){
      this.rotation = r;
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

   //Constructor
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
   ioLine.prototype.clone = function(){
      return new ioLine(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
   }
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
   }
   ioLine.prototype.setEndPos = function(v, y){
      if (typeof v === 'ioVec') this.endPos = v;
      else this.endPos = new ioVec(v||0,y||0);
   }
})();

//ioMultiLine
(function(){
   //Includes
   var ioVec = iio.ioVec,
       ioLine = iio.ioLine;

   //Definition
   function ioMultiLine(){
      this.ioMultiLine.apply(this, arguments);
   }; iio.ioMultiLine=ioMultiLine;
   iio.inherit(ioMultiLine, ioLine)

   //Constructor
   ioMultiLine.prototype._super = ioLine.prototype;
   ioMultiLine.prototype.ioMultiLine = function(points){
      this.vertices=iio.getioVecsFromPointList(points);
      this._super.ioLine.call(this,this.vertices[0],this.vertices[this.vertices.length-1]);
   }

   //Functions
   ioMultiLine.prototype.clone = function(){
      return new ioMultiLine(this.vertices);
   }
})();

//ioGrid
(function(){
   //Definition
   function ioGrid(){
      this.ioGrid.apply(this, arguments);
   }; iio.ioGrid=ioGrid;
   iio.inherit(ioGrid, iio.ioObj)

   //Constructor
   ioGrid.prototype._super = iio.ioObj.prototype;
   ioGrid.prototype.ioGrid = function(v,y,c,r,res,yRes){
      if (typeof v.x!='undefined'){
         this._super.ioObj.call(this,v);
         c=y;r=c;res=r;yRes=res;
      } else this._super.ioObj.call(this,v,y);
      this.R=r;
      this.C=c;
      this.res = new iio.ioVec(res,yRes||res);
      this.resetCells();
   }

   //Functions
   ioGrid.prototype.clone = function(){
      return new ioGrid(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
   }
   ioGrid.prototype.resetCells=function(){
      this.cells = new Array(this.C);
      for(var i=0; i<this.cells.length; i++)
         this.cells[i] = new Array(this.R);
      for(var c=0; c<this.cells[0].length; c++)
         for(var r=0; r<this.cells.length; r++)
            this.cells[r][c] = new Object();
   }
   ioGrid.prototype.getCellCenter = function(c,r, pixelPos){
      if (typeof c.x !='undefined'){
         if (r||false) return this.getCellCenter(this.getCellAt(c));
         return new iio.ioVec(this.pos.x+c.x*this.res.x+this.res.x/2, this.pos.y+c.y*this.res.y+this.res.y/2);
      } else {
         if (pixelPos||false) return this.getCellCenter(this.getCellAt(c,r));
         return new iio.ioVec(this.pos.x+c*this.res.x+this.res.x/2, this.pos.y+r*this.res.y+this.res.y/2);
      }
   }
   ioGrid.prototype.getCellAt = function(pos,y){
      var cell = new iio.ioVec(Math.floor((pos.x-this.pos.x)/this.res.x), Math.floor((pos.y-this.pos.y)/this.res.y));
      if (cell.x >= 0 && cell.x < this.R && cell.y >=0 && cell.y < this.C)
         return cell;
      return false;
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
   ioText.prototype.ioText = function(text, v, y){
      this._super.ioObj.call(this,v,y);
      this.text = text;
   }

   //Functions
   ioText.prototype.clone = function(){
      var t = new ioText(this.text, this.pos)
                 .setFont(this.font)
                 .setTextAlign(this.textAlign);
      return t;
   }
   ioText.prototype.setText = function(t){this.text = t;return this;}
   ioText.prototype.setFont = function(f){this.font = f;return this;}
   ioText.prototype.setTextAlign = function(tA){this.textAlign = tA;return this;}
})();

//ioShape
(function (){
   //Definition
   function ioShape(){
      this.ioShape.apply(this, arguments);
   }; iio.ioShape=ioShape;
   iio.inherit(ioShape, iio.ioObj)

   //Constructor
   ioShape.prototype._super = iio.ioObj.prototype;
   ioShape.prototype.ioShape = function(v,y){
      this._super.ioObj.call(this,v,y);
   }
   //Functions
   ioShape.prototype.clone = function(){
      return new ioShape(this.pos);
   }
})();

//ioRect
(function (){
   //Definition
   function ioRect(){
      this.ioRect.apply(this, arguments);
   }; iio.ioRect=ioRect;
   iio.inherit(ioRect, iio.ioShape)

   //Constructor
   ioRect.prototype._super = iio.ioShape.prototype;
   ioRect.prototype.ioRect = function(v,y,w,h){
      this._super.ioShape.call(this,v,y);
      if (typeof v!='undefined' && typeof v.x!='undefined'){
         this.width=y||0;
         this.height=w||y||0;
      } else {
         this.width=w||0;
         this.height=h||w||0;
      }
   }
   //Functions
   ioRect.prototype.clone = function(){
      return new ioRect(this.pos,this.width,this.height);
   }
   ioRect.prototype.left = function(){ return this.pos.x-this.width/2; }
   ioRect.prototype.right = function(){ return this.pos.x+this.width/2; }
   ioRect.prototype.top = function(){ return this.pos.y-this.height/2; }
   ioRect.prototype.bottom = function(){ return this.pos.y+this.height/2; }
   ioRect.prototype.setSize = function(v,y){
      if(typeof v.x!='undefined'){
         this.width=v.x||0;
         this.height=v.y||0;
      } else {
         this.width=v||0;
         this.height=y||0;
      } 
      return this;
   }
   ioRect.prototype.contains = function(v,y){
      y=v.y||y;
      v=v.x||v;
      v-=this.pos.x;
      y-=this.pos.y;
      var h1 = Math.sqrt(v*v + y*y);
      var currA = Math.atan2(y,v);
      // Angle of point rotated around origin of rectangle in opposition
      var newA = currA;
      if (typeof this.rotation != 'undefined')
         newA -= this.rotation;
      // New position of mouse point when rotated
      var x2 = Math.cos(newA) * h1;
      var y2 = Math.sin(newA) * h1;
      // Check relative to center of rectangle
      if (x2 > -0.5 * this.width && x2 < 0.5 * this.width && y2 > -0.5 * this.height && y2 < 0.5 * this.height){
         return true;
      }
      return false;
   }
   ioRect.prototype.intersectsWith = function(obj){
      if (this.left() < obj.right() && this.right() > obj.left() && this.top() < obj.bottom() && this.bottom() > obj.top())
         return true;
      return false;
   }
})();

//ioX
(function(){
   //Definition
   function ioX(){
      this.ioX.apply(this, arguments);
   }; iio.ioX=ioX;
   iio.inherit(ioX, iio.ioRect)

   //Constructor
   ioX.prototype._super = iio.ioRect.prototype;
   ioX.prototype.ioX = function(v,y,w,h){
      this._super.ioRect.call(this,v,y,w,h);
   }
   //Functions
   ioX.prototype.clone = function(){
      return new ioX(this.pos,this.width,this.height);
   }
})();

//ioCircle
(function(){
   //Definition
   function ioCircle(){
      this.ioCircle.apply(this, arguments);
   }; iio.ioCircle=ioCircle;
   iio.inherit(ioCircle, iio.ioShape)

   //Constructor
   ioCircle.prototype._super = iio.ioShape.prototype;
   ioCircle.prototype.ioCircle = function(v,y,r){
      this._super.ioShape.call(this,v,y);
      if (typeof v.x!='undefined')
         this.radius=y||0;
      else this.radius=r||0;
   }
   //Functions
   ioCircle.prototype.clone = function(){
      return new ioCircle(this.pos,this.radius);
   }
   ioCircle.prototype.setRadius = function(r){this.radius=r||0; return this}
   ioCircle.prototype.contains = function(v){
      if (v.distance(this.pos) < this.radius)
         return true;
      return false;
   }
})();

//ioPoly
(function(){
   //Definition
   function ioPoly(){
      this.ioPoly.apply(this, arguments);
   }; iio.ioPoly=ioPoly;
   iio.inherit(ioPoly, iio.ioShape)

   //Constructor
   ioPoly.prototype._super = iio.ioShape.prototype;
   ioPoly.prototype.ioPoly = function(p,p2,p3){
      if (typeof p.x !='undefined'){
         this._super.ioShape.call(this,p);
         this.vertices=iio.getioVecsFromPointList(p2);
      }
      else if (p instanceof Array){
         this.vertices=iio.getioVecsFromPointList(p);
         this.pos=new iio.ioVec();
         this.styles={};
      }
      else {
         this._super.ioShape.call(this,p,p2);
         this.vertices=iio.getioVecsFromPointList(p3);
      }
      this.originToLeft=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.x>v2.x)return true;return false}).x;
      this.originToTop=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.y>v2.y)return true;return false}).y;
      this.width=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.x<v2.x)return true;return false}).x-this.originToLeft;
      this.height=iio.getSpecVertex(this.vertices,function(v1,v2){if(v1.y<v2.y)return true;return false}).y-this.originToTop;
   }
   //Functions
   ioPoly.prototype.clone = function(){
      return new ioPoly(this.pos,this.vertices);
   }
   ioPoly.prototype.contains = function(v,y){
      y=v.y||y;
      v=v.x||v;
      v-=this.pos.x;
      y-=this.pos.y;
      if (Math.abs(this.pos.x-v) > this.width/2
         || Math.abs(this.pos.y-y) > this.height/2)
         return false;
      var i = j = c = 0;
      for (i = 0, j = this.vertices.length-1; i < this.vertices.length; j = i++) {
         if ( ((this.vertices[i].y>y) != (this.vertices[j].y>y)) &&
            (v < (this.vertices[j].x-this.vertices[i].x) * (y-this.vertices[i].y) / (this.vertices[j].y-this.vertices[i].y) + this.vertices[i].x) )
               c = !c;
      }
      return c;
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
      ctx.lineWidth = styles.lineWidth;
      ctx.shadowColor = styles.shadowColor;
      ctx.shadowBlur = styles.shadowBlur;
      if (typeof styles.shadowOffset !='undefined'){
         ctx.shadowOffsetX = styles.shadowOffset.x;
         ctx.shadowOffsetY = styles.shadowOffset.y;
      }
      ctx.fillStyle = styles.fillStyle;
      ctx.strokeStyle = styles.strokeStyle;
   }
   iio.Graphics.prepStyledContext = function(ctx,styles){
      ctx.save();
      if (styles!='undefined')
         iio.Graphics.applyContextStyles(ctx,styles);
      if (typeof styles != 'undefined' && typeof styles.shadow !='undefined')
         iio.Graphics.applyContextStyles(ctx,styles.shadow);
      return ctx;
   }
   iio.Graphics.prepTransformedContext = function(ctx,obj,pos,r){
      ctx=ctx||obj.ctx;
      pos=pos||obj.pos;
      r=r||obj.rotation;
      ctx.save();
      if (obj.styles!='undefined')
         iio.Graphics.applyContextStyles(ctx,obj.styles);
      iio.Graphics.transformContext(ctx,pos,r);
      return ctx;
   }
   iio.Graphics.finishPathShape = function(ctx,obj,left,top,width,height){
      iio.Graphics.drawShadow(ctx,obj);
      if (!iio.Graphics.drawImage(ctx,obj.img,true)){
         ctx.drawImage(obj.img,left,top,width,height);
         ctx.restore();
      }
      if (typeof obj.anims != 'undefined' && !iio.Graphics.drawImage(ctx,obj.anims[obj.animKey][obj.animIndex])){
         ctx.drawImage(obj.anims[obj.animKey][obj.animIndex],left,top,width,height);
         ctx.restore();
      }
      if (typeof obj.styles != 'undefined'){
         if (typeof obj.styles.fillStyle !='undefined') ctx.fill();
         if (typeof obj.styles.strokeStyle !='undefined') ctx.stroke();
      }
      ctx.restore();
   }
   iio.Graphics.drawLine = function(ctx,v1,v2,x2,y2){
      ctx.beginPath();
      if (typeof v1.x !='undefined'){
         ctx.moveTo(v1.x,v1.y);
         if (typeof v2.x !='undefined')
            ctx.lineTo(v2.x, v2.y);
         else ctx.lineTo(v2, x2);
      } else {
         ctx.moveTo(v1,v2);
         if (typeof x2.x !='undefined')
            ctx.lineTo(x2.x, x2.y);
         else ctx.lineTo(x2, y2);
      } 
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
      if (typeof obj.styles.fillStyle != 'undefined'
       || typeof obj.img != 'undefined'
       || typeof obj.anims != 'undefined')
         ctx.fillRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
      else if (typeof obj.styles.strokeStyle!='undefined')
         ctx.strokeRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
      ctx.restore();
   }
   iio.Graphics.drawImage = function(ctx,img,clip){
      if (typeof img!='undefined'){
         ctx.save();
         if (typeof img.pos!='undefined')
            iio.Graphics.transformContext(ctx,img.pos,img.rotation);
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
})();

//Graphics Attachments
(function (){
   //STYLE FUNCTIONS
   function setLineWidth(w){this.styles.lineWidth=w;return this}
   function setStrokeStyle(s,lW){
      this.styles.strokeStyle=s;
      this.styles.lineWidth=lW||this.styles.lineWidth;
      return this
   };
   function setShadowColor(s){this.styles.shadow.shadowColor=s;return this};
   function setShadowBlur(s){this.styles.shadow.shadowBlur=s;return this};
   function setShadowOffset(v,y){this.styles.shadow.shadowOffset = new iio.ioVec(v,y||v);return this};
   function setFillStyle(s){this.styles.fillStyle=s;return this};
   function drawReferenceLine(bool){this.styles.refLine=bool||true;return this};
   function setShadow(color,v,y,blur){
      this.styles.shadow={};
      this.styles.shadow.shadowColor=color;
      if (typeof v.x !='undefined'){
         this.styles.shadow.shadowOffset=new iio.ioVec(v);
         this.styles.shadow.shadowBlur=y;
      } else {
         this.styles.shadow.shadowOffset=new iio.ioVec(v,y);
         this.styles.shadow.shadowBlur=blur;
      } return this
   };
   iio.ioObj.prototype.setLineWidth=setLineWidth;
   iio.ioObj.prototype.setStrokeStyle=setStrokeStyle;
   iio.ioObj.prototype.setShadowColor=setShadowColor;
   iio.ioObj.prototype.setShadowBlur=setShadowBlur;
   iio.ioObj.prototype.setShadowOffset=setShadowOffset;
   iio.ioObj.prototype.setShadow=setShadow;
   iio.ioText.prototype.setFillStyle=setFillStyle;
   iio.ioShape.prototype.setFillStyle=setFillStyle;
   iio.ioCircle.prototype.drawReferenceLine=drawReferenceLine;

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
   }

   //Image Functions
   function setImgOffset(v,y){this.img.pos=new iio.ioVec(v,y||v);return this};
   function setImgScale(s){this.img.scale=s;return this};
   function setImgRotation(r){this.img.rotation=r;return this};
   function setImgSize(v,y){
      if (v == 'native') this.img.nativeSize=true;
      else this.img.size=new iio.ioVec(v,y||v);
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
   function addAnim(srcs, onLoadCallback,i){
      this.animIndex=i||0;
      if (typeof this.anims == 'undefined') this.anims=[];
      this.animKey = this.anims.length
      this.anims[this.animKey]=[];
      for (var j=0;j<srcs.length;j++){
         if (typeof srcs[j].src !='undefined')
            this.anims[this.animKey][j]=srcs[j];
         else {
            this.anims[this.animKey][j]=new Image();
            this.anims[this.animKey][j].src=srcs[j];
         }
         if (j==this.animIndex) this.anims[this.animKey][j].onload = onLoadCallback;
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
   function createWithAnim(srcs,onLoadCallback,i){
      if (typeof i=='undefined' && iio.isNumber(onLoadCallback))
         i=onLoadCallback;
      i=i||0;
      if (typeof srcs[0].src !='undefined'){
         this.addAnim(srcs);
         this.width = srcs[0].width;
         this.height = srcs[0].height;
      } else {
         this.addAnim(srcs);
         this.animKey=0;
         this.animIndex=i;
         this.anims[0][i].onload = function(){
            this.width=this.anims[0][i].width||0;
            this.height=this.anims[0][i].height||0;
            if (typeof onLoadCallback != 'undefined' && !iio.isNumber(onLoadCallback))
               onLoadCallback();
         }.bind(this);
      } return this;
   }
   function nextAnimFrame(){
      this.animIndex++;
      if (this.animIndex >= this.anims[this.animKey].length)
         this.animIndex=0;
      this.clearDraw();
      return this;
   }
   function setAnimFrame(i){
      this.animIndex=i;
   }

   iio.ioShape.prototype.setImgOffset = setImgOffset;
   iio.ioShape.prototype.setImgScale = setImgScale;
   iio.ioShape.prototype.setImgRotation = setImgRotation;
   iio.ioShape.prototype.setImgSize = setImgSize;
   iio.ioShape.prototype.addImage = addImage;
   iio.ioShape.prototype.addAnim = addAnim;
   iio.ioRect.prototype.createWithImage = createWithImage;
   iio.ioCircle.prototype.createWithImage = createWithImage;
   iio.ioRect.prototype.createWithAnim = createWithAnim;
   iio.ioShape.prototype.nextAnimFrame=nextAnimFrame;
   iio.ioShape.prototype.setAnimFrame=setAnimFrame;
   if (typeof Box2D != 'undefined'){
      b2Shape.prototype.setImgOffset = setImgOffset;
      b2Shape.prototype.setImgScale = setImgScale;
      b2Shape.prototype.setImgRotation = setImgRotation;
      b2Shape.prototype.setImgSize = setImgSize;
      b2Shape.prototype.addImage = addImage;
      b2Shape.prototype.addAnim = addAnim;
      //b2Shape.prototype.createWithImage = createWithImage;
      //b2Shape.prototype.createWithAnim = createWithAnim;
      b2Shape.prototype.nextAnimFrame=nextAnimFrame;
      b2Shape.prototype.setAnimFrame=setAnimFrame;
   }

   //Draw Functions
   iio.ioShape.prototype.clearDraw = function(ctx){
      this.redraw=true;
      if (typeof this.clearSelf != 'undefined' && typeof this.ctx!='undefined')
         this.clearSelf(this.ctx)
      return this;
   }
   iio.ioLine.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      iio.Graphics.drawLine(ctx,this.pos,this.endPos);
      ctx.restore();
      return this;
   };
   iio.ioMultiLine.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      for (var i=1;i<this.vertices.length;i++)
         iio.Graphics.drawLine(ctx,this.vertices[i-1],this.vertices[i]);
      ctx.restore();
      return this;
   };
   iio.ioGrid.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      for (var r=1; r<this.R; r++)
         iio.Graphics.drawLine(ctx,this.pos.x,this.pos.y+r*this.res.y,this.pos.x+this.C*this.res.x,this.pos.y+r*this.res.y);
      for (var c=1; c<this.C; c++)
         iio.Graphics.drawLine(ctx,this.pos.x+c*this.res.x,this.pos.y,this.pos.x+c*this.res.x,this.pos.y+this.R*this.res.y);
      ctx.restore();
      return this;
   }
   iio.ioX.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      iio.Graphics.drawLine(ctx,iio.ioVec.sub(this.pos,this.width/2,this.height/2)
                               ,iio.ioVec.add(this.pos,this.width/2,this.height/2));
      iio.Graphics.drawLine(ctx,iio.ioVec.add(this.pos,this.width/2,-this.height/2)
                               ,iio.ioVec.add(this.pos,-this.width/2,this.height/2));
      ctx.restore();
      return this;
   }
   iio.ioText.prototype.draw = function(ctx){
      ctx=ctx||this.ctx;
      iio.Graphics.prepStyledContext(ctx,this.styles);
      iio.Graphics.transformContext(ctx,this.pos,this.rotation);
      ctx.font = this.font;
      ctx.textAlign = this.textAlign;
      if (typeof this.styles.fillStyle!='undefined')
         ctx.fillText(this.text,0,0);
      if (typeof this.styles.strokeStyle!='undefined')
         ctx.strokeText(this.text,0,0);
      ctx.restore();
      return this;
   }
   function drawRect(ctx,pos,r){
      ctx=iio.Graphics.prepTransformedContext(ctx,this,pos,r);
      iio.Graphics.drawRectShadow(ctx,this);
      if (!iio.Graphics.drawImage(ctx,this.img)){
         ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
         ctx.restore();
      }
      if (typeof this.anims != 'undefined' && !iio.Graphics.drawImage(ctx,this.anims[this.animKey][this.animIndex])){
         ctx.drawImage(this.anims[this.animKey][this.animIndex], -this.width/2, -this.height/2, this.width, this.height);
         ctx.restore();
      }
      if (typeof this.styles != 'undefined'){
         if (typeof this.styles.fillStyle !='undefined')
            ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
         if (typeof this.styles.strokeStyle !='undefined')
            ctx.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
      }
      ctx.restore();
      return this;
   }
   iio.ioRect.prototype.draw=drawRect;
   iio.ioRect.prototype.clearSelf = function(ctx){
      ctx.save();
      iio.Graphics.transformContext(ctx,this.pos,this.rotation);
      var dV=new iio.ioVec(2,2);
      if (typeof this.styles != 'undefined'){
         if (typeof this.styles.lineWidth!='undefined')
            dV.add(this.styles.lineWidth,this.styles.lineWidth);
         else if (typeof this.styles.strokeStyle!='undefined')
            dV.add(2,2);
         if (typeof this.styles.shadow!='undefined' && typeof this.styles.shadow.shadowOffset!='undefined'){
            var origin = new iio.ioVec(-this.width/2-dV.x,-this.height/2-dV.y)
            origin.add(-Math.abs(this.styles.shadow.shadowOffset.x)-8,-Math.abs(this.styles.shadow.shadowOffset.y)-8);
            dV.add(Math.abs(this.styles.shadow.shadowOffset.x)*2+16,Math.abs(this.styles.shadow.shadowOffset.y)*2+16);
            ctx.clearRect(origin.x, origin.y, this.width+dV.x, this.height+dV.y);
            ctx.restore();
            return this;
         }
      }
      ctx.clearRect(-this.width/2-dV.x/2, -this.height/2-dV.y/2, this.width+dV.x, this.height+dV.y);
      ctx.restore();
      return this;
   }
   function setPolyDraw(bool){
      this.polyDraw=bool;
      return this;
   }
   function drawCircle(ctx,pos,r){
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
      if (typeof this.anims != 'undefined' && !iio.Graphics.drawImage(ctx,this.anims[this.animKey][this.animIndex])){
         ctx.drawImage(this.anims[this.animKey][this.animIndex], -this.radius,-this.radius,this.radius*2,this.radius*2);
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
   iio.ioCircle.prototype.draw=drawCircle;
   iio.ioCircle.prototype.setPolyDraw=setPolyDraw;
   if (typeof Box2D != 'undefined') {
      b2CircleShape.prototype.draw = drawCircle;
      b2CircleShape.prototype.setPolyDraw = setPolyDraw;
   }

   iio.ioCircle.prototype.clearSelf = function(ctx){
      ctx.clearRect( -this.radius,-this.radius,this.radius*2,this.radius*2);
   }
   iio.ioPoly.prototype.draw = function(ctx){
      ctx=iio.Graphics.prepTransformedContext(ctx,this);
      ctx.beginPath();
      ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
      for(var i=1;i<this.vertices.length;i++)
         ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
      ctx.closePath();
      iio.Graphics.finishPathShape(ctx,this,this.originToLeft,this.originToTop,this.width,this.height);
   }
   if (typeof Box2D != 'undefined') 
      Box2D.Collision.Shapes.b2PolygonShape.prototype.draw = function(ctx,pos,r,scale){
      ctx=iio.Graphics.prepTransformedContext(ctx,this,pos,r);
      ctx.beginPath();
      ctx.moveTo(this.m_vertices[0].x*scale,this.m_vertices[0].y*scale);
      for(var i=1;i<this.m_vertices.length;i++)
         ctx.lineTo(this.m_vertices[i].x*scale,this.m_vertices[i].y*scale);
      ctx.closePath();
      iio.Graphics.finishPathShape(ctx,this,this.originToLeft,this.originToTop,this.width,this.height);
   }
   iio.ioPoly.prototype.clearSelf = function(ctx){
      ctx.save();
      iio.Graphics.transformContext(ctx,this.pos,this.rotation);
      ctx.clearRect(this.originToLeft,this.originToTop,this.width,this.height);
      ctx.restore();
      return this;
   }
   if (typeof Box2D != 'undefined'){
      Box2D.Dynamics.b2Body.draw=function(ctx,scale){
         for (f=this.objs[i].GetFixtureList();f;f=f.m_next){
               s=f.GetShape(); 
               if (typeof s.draw!='undefined')
                  s.draw(ctx,new iio.ioVec(this.objs[i].m_xf.position.x*scale,this.objs[i].m_xf.position.y*scale),this.objs[i].GetAngle(),scale);
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
   var ioVec = iio.ioVec
      ,ioObj = iio.ioObj;

   function update(dt){
      if ((typeof this.vel != 'undefined' && this.vel.length() > 0) || (typeof this.torque != 'undefined' && this.torque > 0))
         this.clearDraw();
      if (typeof this.vel != 'undefined') this.translate(new ioVec(this.vel.x, this.vel.y));
      if (typeof this.torque != 'undefined'){
         this.rotation+=this.torque;
         if (this.rotation>2*Math.PI)
            this.rotation-=2*Math.PI;
         else if (this.rotation<-2*Math.PI)
            this.rotation+=2*Math.PI;
      }
      if (this.shrinkRate > 0){
         if (typeof this.radius != 'undefined') {
            this.setRadius(this.radius*(1-this.shrinkRate));
            if (Math.abs(this.radius < .1))
               return false;
         } else {
            this.setSize(this.width*(1-this.shrinkRate), this.height*(1-this.shrinkRate));
            if (Math.abs(this.width < .1) && Math.abs(this.height < .1))
               return false;
         } 
         
      }
      if (this.bounds != null){
         var w = this.width/2||this.radius||0;
         var h = this.height/2||this.radius||0;

         if (typeof this.bounds.top!='undefined' && this.pos.y - h < this.bounds.top.val){
            if (typeof this.bounds.top.callback!='undefined')
               return this.bounds.top.callback(this)||false;
            return false;
         }

         if (typeof this.bounds.right!='undefined' && this.pos.x + w > this.bounds.right.val){
            if (typeof this.bounds.right.callback!='undefined')
               return this.bounds.right.callback(this)||false;
            return false;
         }

         if (typeof this.bounds.bottom!='undefined' && this.pos.y + h > this.bounds.bottom.val){
            if (typeof this.bounds.bottom.callback!='undefined')
               return this.bounds.bottom.callback(this)||false;
            return false;
         }

         if (typeof this.bounds.left!='undefined' && this.pos.x - w < this.bounds.left.val){
            if (typeof this.bounds.left.callback!='undefined')
               return this.bounds.left.callback(this)||false;
            return false;
         }
      }
      return true;
   }
   function setVel(v,y){this.vel = new ioVec(v,y);return this}
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
   function enableKinematics(){
      this.update=update;
      this.setVel=setVel;
      this.setTorque=setTorque;
      this.setBounds=setBounds;
      this.setBound=setBound;
      this.shrink=shrink;
      return this;
   }
   iio.ioShape.prototype.enableKinematics = enableKinematics;
   iio.ioText.prototype.enableKinematics = enableKinematics;
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
         if (typeof this.objs[i]!='undefined'){
            if( typeof this.objs[i].update!='undefined' && !this.objs[i].update(dt))
               this.objs.splice(i,1);
            else if(this.objs[i].redraw)
               this.redraw=true;
         }
   }
   ioGroup.prototype.draw = function(ctx,scale){
      for (var i=0; i<this.objs.length; i++){
         if (typeof this.objs[i].pos!='undefined')
            this.objs[i].draw(ctx);
         else if (typeof this.objs[i].m_I!='undefined')
            for (f=this.objs[i].GetFixtureList();f;f=f.m_next){
               s=f.GetShape(); 
               if (typeof s.draw!='undefined')
                  s.draw(ctx,new ioVec(this.objs[i].m_xf.position.x*scale,this.objs[i].m_xf.position.y*scale),this.objs[i].GetAngle(),scale);
           }
        else if (typeof this.objs[i].m_edgeA!='undefined')
            this.objs[i].draw(ctx,scale);
      }
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
      if (typeof w=='undefined' && (typeof id == 'string' || id instanceof String)){
         this.addCanvas(id);
      }
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
      this.app = new app(this);
      this.addWindowListeners();
   }
   /* APP CONTROL FUNCTIONS
    */
   ioAppManager.prototype.setFramerate = function( fps, callback, obj, ctx ){
      if (typeof callback!='undefined' && typeof callback.draw !='undefined'){
         if (typeof ctx=='undefined')
            var realCallback = ctx;
         ctx=obj||this.ctxs[0];
         obj=callback;
         callback = realCallback||function(){};
         obj.ctx=ctx;
      }
      else obj=obj||0;
      if (iio.isNumber(obj))
         obj=this.cnvs[obj];
      if (typeof obj.lastTime == 'undefined')
         obj.lastTime=0;
      if (typeof ctx != 'undefined')
         obj.ctx=ctx;
      iio.requestTimeout(fps,obj.lastTime, function(dt){
         obj.lastTime=dt;
         io.setFramerate(fps,callback,obj);
         if (typeof obj.update!='undefined')
            obj.update(dt);
         if (typeof callback!='undefined')
            callback(dt);
         if (obj.redraw){
            obj.draw();
            obj.redraw=false;
         }
      }.bind([io=this,obj]));
      return this;
   }
   ioAppManager.prototype.setAnimFPS = function(fps,obj,c){
      c=c||0;
      if (obj instanceof Array)
         this.setFramerate(fps,function(){
            for (var i=0;i<obj.length;i++)
               obj[i].nextAnimFrame()
         },obj,this.ctxs[c]);
      else
      this.setFramerate(fps,function(){obj.nextAnimFrame()},obj,this.ctxs[c]);
   }
   ioAppManager.prototype.setB2Framerate = function( fps, callback ){
      if (typeof this.b2lastTime == 'undefined')
         this.b2lastTime=0;
      if (typeof this.b2World!='undefined')
         this.b2World.Step(1/this.fps, 10, 10);
      iio.requestTimeout(fps,this.b2lastTime, function(dt){
         b2.b2lastTime=dt;
         b2.setB2Framerate(fps,callback);
         if (typeof b2.b2World!='undefined')
            b2.b2World.Step(1/fps, 10, 10);
         callback(dt);
         if (typeof b2.b2DebugDraw!='undefined'&&b2.b2DebugDraw)
            b2.b2World.DrawDebugData();
         else b2.draw(b2.b2Cnv);
         if (typeof this.b2World!='undefined')
            b2.b2World.ClearForces();
      }.bind([b2=this]));
   }
   ioAppManager.prototype.addB2World = function(world,c){
      this.b2World=world;
      this.b2Scale = 30;
      this.b2Cnv=c||0;
      return world;
   }
   ioAppManager.prototype.activateDebugger = function(){
      if (typeof iio.ioAppDebugger == 'undefined') 
            console.warn("ioAppManager.startDebugger: the ioAppDebugger package is missing");
      else this.debugger = new iio.ioAppDebugger(this);
   }
   /* CANVAS CONTROL FUNCTIONS
    */
   ioAppManager.prototype.update = function(dt){ 
      for (var c=0;c<this.cnvs.length;c++) 
         this.cnvs[c].update(dt);
   }

   ioAppManager.prototype.draw = function(i){
      if (typeof i =='undefined')
         for (var c=0;c<this.cnvs.length;c++)
               this.cnvs[c].draw(this.b2Scale);
      else this.cnvs[i].draw(this.b2Scale);
      return this;
   }
   ioAppManager.prototype.addCanvas = function( zIndex, w, h, attachId, cssClasses ){
      var i=this.cnvs.length;
      if (typeof zIndex == 'string' || zIndex instanceof String){
         if (!document.getElementById(zIndex))
            throw new Error("ioAppManager.addCanvas: Invalid canvas id '"+zIndex+"'");
         this.cnvs[i]=document.getElementById(zIndex);
         this.ctxs[i] = this.cnvs[i].getContext('2d');
         if (typeof this.cnvs[i].getContext=='undefined') 
            throw new Error("ioAppManager.addCanvas: given id did not correspond to a canvas object");
         this.setCanvasProperties(i);
         this.setCanvasFunctions(i);
         this.addFocusListeners(i);
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
      this.cnvs[i].className += "ioCanvas";
      
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
         document.body.style.overflow = 'hidden';
         this.fullScreen=true;
      }
      this.ctxs[i] = this.cnvs[i].getContext('2d');
      this.setCanvasProperties(i);
      this.setCanvasFunctions(i);
      this.addFocusListeners(i);
      return i;
   }
   ioAppManager.prototype.setCanvasFunctions = function(c){
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
            if (typeof(this.groups[i].collisionTags) != 'undefined')
            for (var j=0; j<this.groups[i].collisionTags.length; j++)
               this.checkCollisions(this.groups[i], this.groups[this.indexOfTag(this.groups[i].collisionTags[j].tag)], this.groups[i].collisionTags[j].callback);
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
                  && group1.objs[i].intersectsWith(group2.objs[j])){
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
   ioAppManager.prototype.setCanvasProperties = function(c){
      this.cnvs[c].pos = this.getCanvasOffset(c);
      this.cnvs[c].center = new ioVec(this.cnvs[c].width/2, this.cnvs[c].height/2);
   }
   ioAppManager.prototype.addFocusListeners = function(i){
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
   ioAppManager.prototype.addWindowListeners = function(){
      iio.addEvent(window, 'resize', function(event){
         if (this.fullScreen){
            io.canvas.width = window.innerWidth;
            io.canvas.height = window.innerHeight;
         }
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
   ioAppManager.prototype.drawPartialPixels = function(turnOn){
      turnOn=turnOn||true;
      if (turnOn) this.partialPixels = true;
      else this.partialPixels = false;
      return this;
   }
   ioAppManager.prototype.activateB2Debugger = function(turnOn,c){
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

   /* GROUP CONTROL FUNCTIONS
    */
   ioAppManager.prototype.addGroup = function(tag, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined') this.cnvs[c].groups = [];
      var z = zIndex || 0;
      var i = this.indexFromzIndexInsertSort(z, this.cnvs[c].groups);
      this.cnvs[c].groups.insert(i, new ioGroup(tag, z));
      return i;
   }
   ioAppManager.prototype.addToGroup = function(tag, obj, zIndex, c){
      c=c||0;
      var i = this.indexOfTag(tag, c);
      var a = iio.isNumber(i);
      if (typeof(this.cnvs[c].groups)=='undefined'||!a) 
         i = this.addGroup(tag, zIndex, c);
      this.cnvs[c].groups[i].addObj(obj, c);
      return obj;
   }
   ioAppManager.prototype.addObj = function(obj, zIndex, c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)=='undefined') this.cnvs[c].groups = [];
      zIndex = zIndex || 0;
      for (var i=0; i<this.cnvs[c].groups.length; i++)
         if (this.cnvs[c].groups[i].zIndex == zIndex){
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
      return 'NO';
   }
   ioAppManager.prototype.setCollisionCallback = function(tag1, tag2, callback, c){
      if (typeof callback=='undefined' || iio.isNumber(callback)){
         callback = tag2;
         tag2 = tag1;
      }
      this.cnvs[c||0].groups[this.indexOfTag(tag1)].addCollisionCallback(tag2, callback);
   },
   ioAppManager.prototype.rmvObj = function(obj,c){
      c=c||0;
      if (typeof(this.cnvs[c].groups)!='undefined')
         for (var i=0; i<this.cnvs[c].groups.length; i++)
            if (this.cnvs[c].groups[i].rmvObj(obj))
               return true;
      return false;
   }
   ioAppManager.prototype.rmvAll = function(c){
      if (typeof c =='undefined'){
         for (c=0;c<this.cnvs.length;c++)
            if (typeof(this.cnvs[c].groups)!='undefined')
               this.cnvs[c].groups=[];
      } else if (typeof(this.cnvs[c].groups)!='undefined')
         this.cnvs[c].groups=[];
      return this;
   }
   ioAppManager.prototype.rmvFromGroup = function(obj, tag, c){
      if (typeof c=='undefined'){
         for (c=0;c<this.cnvs.length;c++)
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

   /* BG Control
    */
   ioAppManager.prototype.setBGColor = function(color, c){
      c=c||0;
      this.cnvs[c].style.backgroundColor=color;
      return this;
   }
   ioAppManager.prototype.setBGPattern = function(src, c){
      c=c||0;
      this.cnvs[c].style.backgroundImage="url('"+src+"')";
      return this;
   }
   ioAppManager.prototype.setBGImage = function(src, c){
      c=c||0;
      this.cnvs[c].style.backgroundRepeat="no-repeat";
      return this.setBGPattern(src, c);
   }

   /* Utility
    */
   ioAppManager.prototype.getEventPosition = function(event, c){
      c=c||0;
      var pos;
      if (iio.isiPad) {
         if (event.touches==null || event.touches.item(0)==null) return -1;
         else pos = new ioVec(event.touches.item(0).screenX, event.touches.item(0).screenY);
      } pos = new ioVec(event.clientX, event.clientY);
      pos.sub(this.cnvs[c].pos);
      return pos;
   }
   ioAppManager.prototype.getCanvasOffset = function(c){
      c=c||0;  
      var p=this.cnvs[c].getBoundingClientRect();
      return new ioVec(p.left,p.top);
   }

   /* B2D Helpers
    */
    ioAppManager.prototype.getB2BodyAt = function(callback,v,y){
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