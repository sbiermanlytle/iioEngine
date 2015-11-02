/* Sound
------------------
*/

// Single AudioContext shared across all iio apps
iio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// DEFINITION
iio.Sound = function(){ this.Sound.apply(this, arguments) };
iio.inherit(iio.Sound, iio.Interface);
iio.Sound.prototype._super = iio.Interface.prototype;

// CONSTRUCTOR
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

// SOUND FUNCTIONS
iio.Sound.prototype.play = function() {
  this.set(iio.merge_args(arguments), true);
  if (typeof this.buffer === undefined) return;
  this.source = iio.audioCtx.createBufferSource();
  this.source.buffer = this.buffer;
  if (this.loop)
    this.source.loop = true;
  if (this.gain)
    this.gainNode.gain.value = this.gain;
  this.source.connect(this.gainNode);
  this.source.start(this.delay || 0);
  return this;
}
iio.Sound.prototype.stop = function() {
  if (this.source)
    this.source.disconnect();
  return this;
}