function getRandomNum(min, max) {
	return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function addEvent(obj,evt,fn,capt){  
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
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  }
}
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
function keyCodeIs(key, event){
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