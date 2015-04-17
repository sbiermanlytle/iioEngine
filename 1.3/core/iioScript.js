iio={};
iio.isNumber=function(o){return !isNaN(o-0)&&o!==null&&o!==""&&o!==false&&o!==true}
iio.isString=function(s){return typeof s=='string'||s instanceof String}
iio.operators=['/','%','*','-','+','===','==','!==','!=','>=','<=','>','<']  
iio.evaluate=function(s){
  if(s=='true')return true;
  if(s=='false')return false;
  if(iio.isNumber(s))
     return parseFloat(s);
  if(s.substring(0,1)=="!") return !iio.evaluate(s.substring(1));
  var op;
  op=s.indexOf('/');
  if(op>-1) return iio.evaluate(s.substring(0,op))/iio.evaluate(s.substring(op+1));
  op=s.indexOf('%');
  if(op>-1) return iio.evaluate(s.substring(0,op))%iio.evaluate(s.substring(op+1));
  op=s.indexOf('*');
  if(op>-1) return iio.evaluate(s.substring(0,op))*iio.evaluate(s.substring(op+1));
  op=s.indexOf('-');
  if(op>-1) return iio.evaluate(s.substring(0,op))-iio.evaluate(s.substring(op+1));
  op=s.indexOf('+');
  if(op>-1) return iio.evaluate(s.substring(0,op))+iio.evaluate(s.substring(op+1));
  op=s.indexOf('===');
  if(op>-1) return iio.evaluate(s.substring(0,op))===iio.evaluate(s.substring(op+3));
  op=s.indexOf('==');
  if(op>-1) return iio.evaluate(s.substring(0,op))==iio.evaluate(s.substring(op+2));
  op=s.indexOf('!==');
  if(op>-1) return iio.evaluate(s.substring(0,op))!==iio.evaluate(s.substring(op+3));
  op=s.indexOf('!=');
  if(op>-1) return iio.evaluate(s.substring(0,op))!=iio.evaluate(s.substring(op+2));
  op=s.indexOf('>=');
  if(op>-1) return iio.evaluate(s.substring(0,op))>=iio.evaluate(s.substring(op+2));
  op=s.indexOf('<=');
  if(op>-1) return iio.evaluate(s.substring(0,op))<=iio.evaluate(s.substring(op+2));
  op=s.indexOf('>');
  if(op>-1) return iio.evaluate(s.substring(0,op))>iio.evaluate(s.substring(op+1));
  op=s.indexOf('<');
  if(op>-1) return iio.evaluate(s.substring(0,op))<iio.evaluate(s.substring(op+1));
  else return s;
}
iio.run=function(msg){
	var c=msg.split(" ");
	var i;
	for(i=0;i<c.length;i++){
		if(c[i]=='!'){
			c.splice(i,2,c[i]+c[i+1]);
			i-=2;
		}
		for(var j=0;j<iio.operators.length;j++)
			if(c[i]==iio.operators[j]){
				c.splice(i-1,3,c[i-1]+c[i]+c[i+1]);
				i-=3;
			}
	}
	for(i=0;i<c.length;i++)
		c[i]=iio.evaluate(c[i]);
	return c;
}
iio.test=function(s,cr){
	var r=iio.run(s);
	if(r[0]!=cr)
		console.log(r[0]+' : '+cr+' ERROR IN INTERPRETER')
	else console.log(r.toString());
}