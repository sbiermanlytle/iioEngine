//iio Script Properties
   iio.isiioProp=function(s){
      for(var i=0;i<iio.scriptProps.length;i++)
         if(iio.scriptProps[i][0]==s)
            return true;
      return false;
   }
   iio.maxParams=function(s){
      for(var i=0;i<iio.scriptProps.length;i++)
         if(iio.scriptProps[i][0]==s)
            return iio.scriptProps[i][1];
      return -1;
   }
   iio.scriptProps=[
      ['app',1]
      ,['vel',1]
      ,['acc',1]
      ,['o',0]
      ,['z',1]
      ,['round',-1]
      ,['outline',2]
      ,['grid',3]
      ,['rotate',1]
      ,['alpha',1]
      ,['lineCap',1]
      ,['hidden',1]
      ,['dash',-1]
      ,['bezier',9999999]
      ,['shadow',3]
      ,['origin',1]
      ,['font',1]
      ,['simple',0]
      ,['x',2]
      ,['cursor',0]
      ,['open',0]
   ];

//iio Script Functions
iio.scriptFns=[
   'add',
   'loop',
   'draw'
];

//Mathmatical Operators
iio.operators=['/','%','*','+','-'];

//TODO: Should be in a "random" function
iio.scriptConsts=['randomColor'];

/*
   Functions that determine type
*/
iio.isKey=function(arr,itm){
   for(var i=0;i<arr.length;i++)
      if(arr[i]==itm)
         return true;
   return false;
}
iio.isColor=function(s){
   for(var i=0;i<iio.operators.length;i++)
      if(s.indexOf(iio.operators[i])>-1)
         return false;
   if(iio.is.number(s)||s.indexOf(':')>-1||s.indexOf('px')>-1||s=='width'||s=='height'||s=='center') 
      return false;
   return true;
}
iio.takesOther=function(s){
   if(s=='outline'||s=='color'||s=='shadow'||s=='app'||s=='hidden'||s=='grid'||s=='x'||s=='font')
      return true;
   return false;
}

/*
   Functions for Parsing
*/
iio.indexOfiioDelineator=function(s){
   var i=s.indexOf(':');
   if(s.indexOf('http://')==i-4) i=-1;
   return i;
}
iio.parsePos=function(o,s){
   var i=0;
   var ps=[];
   var _i=iio.indexOfiioDelineator(o[i]);
   while((o[i].indexOf('gradient')==-1&&(_i>-1&&_i<o[i].length-1))||o[i]=='center'){
      if(o[i]=='center') {
         if(s.type==iio.APP) ps.push(s.eval('center'));
         else ps.push({x:0,y:0});
      } else {
         ps.push(s.eval(o[i].substring(0,_i)));
         ps.push(s.eval(o[i].substring(_i+1)));
      }
      i++; _i=iio.indexOfiioDelineator(o[i]);
   }
   if(ps.length==0) ps[0]=({x:0,y:0});
   o.splice(0,i); i=1;
   var p=o[0]; while(i<o.length) p+=' '+o[i++];
   return {ps:ps,p:p}
}

/*
   Main run function for iio Parser
*/
iio.run=function(o,s){
   var nO;
   if(o instanceof Array){
      while(o.length>0){
         if(iio.isKey(iio.scriptFns,o[0])){
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
               &&(!(!iio.takesOther(o[0])&&iio.isColor(o[_s]))||o[_s]=='n')
               &&(!iio.isiioProp(o[_s])||(o[_s]=='round'
                  &&o[0]=='lineCap')||(o[0]=='origin'&&o[_s]=='center'))
               &&!(o[0]!='app'&&iio.isKey(iio.scriptFns,o[_s]))
               &&(_s<=i||i==-1))
               p.push(o[_s++]);
            iio.runiioProp(s,p.slice());
            o=o.splice(_s);
         } else if(o[0].charAt(0)=='"'||o[0].charAt(0)=="'"){
            var d=o[0].charAt(0);
            var i=0;
            if(o[i].charAt(o[i].length-1)==d)
               s.text=o[i].substring(1,o[i].length-1);
            else {
               var t=o[0].substring(1);
               var i=1; while(i<o.length&&o[i].charAt(o[i].length-1)!=d){
                  t+=' '+o[i]; i++
               }
               s.text=t+' '+o[i].substring(0,o[i].length-1);
            }
            o=o.splice(i+1);
         } else if(o[0]=='if') {
            var e=-1;
            var t=-1;
            for(var _i=0;_i<o.length;_i++)
               if(o[_i]=='else')
                  e=_i;
            for(var _i=0;_i<o.length;_i++)
               if(o[_i]=='then')
                  t=_i;
            if(s.eval(o[1])){
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
               s.hidden=!s.hidden;
               o=o.splice(1,o.length);
            }
         } else {
            iio.runiioConst(s,o[0]);
            o=o.splice(1);
         }
      }
   } else if(iio.is.string(o)) 
      nO=iio.run(o.split(" "),s);
   else {
      for(var i=0;i<s.length;i++)
         if(iio.is.number(s[i]))
            o.lineWidth=o.eval(s[i]);
         else o.color=s[i];
   }
   return nO;
}

/*
   Functions to execute iio engine scripts
*/
iio.runiioFn=function(o,s){
   if(o[0]=='loop'){
      var ps;
      if(iio.is.number(o[1])){
         ps=o.slice().splice(2,o.length);
         s.loop(o[1],function(){
            iio.run(ps.slice(),s);
            s.draw();
         });
      } else { 
         ps=o.slice().splice(1,o.length);
         s.loop(function(){
            iio.run(ps.slice(),s);
            s.draw();
         });
      }
   } else if(o[0]=='add'){
      var p=iio.parsePos(o.splice(01),s);
      return s.add(p.ps,p.p);
   } else if(o[0]=='draw')
      s.app.draw();
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
      o.rot+=o.eval(s[1]);
   else if(s[0]=='vel'||s[0]=='acc'){
      var v=s[1].split(':');
      if(s[0]=='vel'){
         o.vel.x=o.eval(v[0]);
         o.vel.y=o.eval(v[1]);
         o.vel.r=o.eval(v[2]);
      } else {
         o.acc.x=o.eval(v[0]);
         o.acc.y=o.eval(v[1]);
         o.acc.r=o.eval(v[2]);
      }
   } else if(s[0]=='o'){
      o.type=iio.CIRC;
   } else if(s[0]=='z'){
      o.z=parseFloat(s[1]);
   } else if(s[0]=='hidden'){
      if(s[1]&&s[1]=='false') 
         o.hidden=false;
      else o.hidden=true;
   }
   else if(s[0]=='round'){
      if(o.type==iio.APP){
         o.round=s[1];
         for(var i=2;i<s.length;i++)
            o.round+=' '+s[i];
      } else {
         if(s.length==2) o.round=[s[1],s[1],s[1],s[1]];
         else if(s.length==3) o.round=[s[1],s[2],s[1],s[2]];
         else o.round=[s[1],s[2],s[3],s[4]];
      }
   } else if(s[0]=='outline'){
      for(var i=1;i<s.length;i++)
         if(iio.is.number(s[i].substring(0,1))||(s[i].substring(0,1)=='-'))
            o.lineWidth=o.eval(s[i]);
         else if(s[i]=='randomColor')
            o.outline=iio.random.color();
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
         s[_i]=o.eval(s[_i]);
      o.dash=s.splice(1,s.length);
   } else if(s[0]=='bezier'){
      for(var _i=1;_i<s.length;_i++)
         s[_i]=o.parent.eval(s[_i]);
      o.bezier=s.splice(1,s.length);
   } else if(s[0]=='grid'){
      o.type=iio.GRID;
      for(var _i=1;_i<s.length;_i++){
         var _c=s[_i].indexOf(':');
         if(_c<0){
            var v=o.eval(s[_i]);
            if(iio.is.string(v))
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
   } else if(s[0]=='x') {
      if(s.length==1) o.type=iio.X;
      else for(var _i=1;_i<s.length;_i++)
         if(iio.is.number(s[_i])) o.lineWidth=o.eval(s[_i]);
         else { o.color=o.eval(s[_i]); o.type=iio.X }
   } else if(s[0]=='font') o.font=s[1];
   else if(s[0]=='simple') o.simple=true;
   else if(s[0]=='cursor') o.showCursor=true;
   else if(s[0]=='open') o.open=true;
}
iio.runiioConst=function(o,c){
   var i=iio.indexOfiioDelineator(c);
   var ii=c.indexOf('gradient');
   if(i>-1&&ii==-1){
   	 if(i>0) o.width=o.parent.eval(c.substring(0,i));
      o.height=(i+1<c.length)?o.parent.eval(c.substring(i+1)):o.width;
      o.center.x=o.pos.x;
      o.center.y=o.pos.y;
   } else if(c=='randomColor')
      o.color=iio.random.color();
   else if(iio.is.number(c.substring(0,1))){
      if(o.type==iio.LINE) o.lineWidth=o.eval(c);
      else o.width=o.height=o.eval(c);
   }
   else if(iio.is.image(c))
      o.img=c;
   else if(c=='center'||c=='left'||c=='right'||c=='end') o.align=c;
   else if(c!='') o.color=c;
}