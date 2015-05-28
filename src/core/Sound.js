/* Sound
------------------
iio.js version 1.4
--------------------------------------------------------------
iio.js is licensed under the BSD 2-clause Open Source license
*/

// Single AudioContext shared across all iio apps
iio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//DEFINITION
iio.Sound = function(){ this.Sound.apply(this, arguments) };
iio.inherit(iio.Sound, iio.Interface);
iio.Sound.prototype._super = iio.Interface.prototype;

//CONSTRUCTOR
iio.Sound.prototype.Sound = function(url, onLoad, onError) {
  var sound = this;
  // Set up a GainNode for volume control
  this.gainNode = iio.audioCtx.createGain();
  this.gainNode.connect(iio.audioCtx.destination);
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    iio.audioCtx.decodeAudioData(xhr.response, function(buffer) {
      sound.buffer = buffer;
      if (onLoad) onLoad(sound, buffer);
    }, onError); 
  };
  xhr.onerror = onError;
  xhr.send();
}

iio.Sound.prototype.play = function(delay, properties) {
  if (properties) this.set(properties);
  if (this.buffer === undefined) return;
  var source = iio.audioCtx.createBufferSource();
  source.buffer = this.buffer;
  if (this.loop)
    source.loop = true;

  if (this.gain)
    this.gainNode.gain.value = this.gain;
  source.connect(this.gainNode);
  source.start(delay || 0);
}

