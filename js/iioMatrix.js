addevent(window, 'resize', this.resize, false);
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 4);
		  };
})();

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var e=document.getElementById("matrix");
var cW = 10;
var cH = 18;
var x, iC;
var tR,C,R,winH,winW,m;
init();
var inputP;
function init(){
	m = [];
	iC=0;
	winH = window.innerHeight;
	winW = window.innerWidth;
	R = Math.round(winH/cH);
	C =  Math.round(winW/cW);
	tR = Math.round(R/6);
	tC = Math.round((C-72)/2);
	if (tC < 0) tC = 0;
	var p;
	x="";
	for (var r=0;r<R;r++){
		p = document.createElement('p');
		for (var c=0;c<C;c++)
			x+=" ";
		p.innerHTML=x;
		e.appendChild(p);
		m[m.length]=p;
		if (r==tR+10)
			inputP = p;
	}
}

var iio=[];
iio[1]="   _____ _____  _____     _______ __   _  ______ _____ __   _ _______   ";
iio[2]="     |     |   |     |    |______ | \\  | |  ____   |   | \\  | |______   ";
iio[3]="   __|__ __|__ |_____|    |______ |  \\_| |_____| __|__ |  \\_| |______   ";
iio[6]="            An open source framework for web app development            ";
iio[7]="                        Coming in March, 2013                           ";
iio[9]="                        Login for Beta Access                           ";
iio[10]="                        Username:                                       ";
iio[11]="                        Password:                                       ";

function getChar(r,c){
	if (r>=tR && r<tR+15 && c>=tC && c<=C-tC){
		if (typeof(iio[r-tR])!='undefined'){
			if (r%2==1) return iio[r-tR].charAt((iio[r-tR].length-1)-c+tC);
			else if (C%2==1) return iio[r-tR].charAt(c-tC);
			else return iio[r-tR].charAt(c-tC-1);
		}
		return " ";
	}
	return "|";
}
function resetMatrix(){
	for (var i=0;i<m.length;i++)
		e.removeChild(m[i]);
	var loginE = document.getElementById("loginForm");
	loginE.style.display = "none";
}

function update(){
	if (iC<=C-tC){
		for (var r=0;r<R;r++){
			x=m[r].innerHTML;
			if (r%2==1) m[r].innerHTML=x.replaceAt(C-iC, getChar(r,iC));
			else m[r].innerHTML=x.replaceAt(iC, getChar(r,iC));
		}
		iC++;
		requestAnimFrame( update );
	} else if (addLogin) setInputForm();
} requestAnimFrame( update );

var addLogin=false;
function setInputForm(){
	var loginE = document.getElementById("loginForm");
	loginE.style.display = "inline";
	loginE.style.top = inputP.offsetTop+"px";
	loginE.style.left = window.innerWidth/2 - 10 + "px";
}

function resize(w, h){
	resetMatrix();
	init();
	requestAnimFrame( update );
}

function addevent(obj,evt,fn,capt){  
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