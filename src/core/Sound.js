iio.App.prototype.loadAudio = function(url, callback, onError) {
  return new iio.Sound(this.audioCtx, url, callback, onError);
}

iio.Sound = function(audioCtx, url, callback, onError) {
  // Set up a GainNode for volume control
  this.gainNode = audioCtx.createGain();
  this.gainNode.connect(audioCtx.destination);

  // Save this AudioContext for later use
  this.audioCtx = audioCtx;

  // For scoping in xhr.onload
  var sound = this;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function() {
    audioCtx.decodeAudioData(xhr.response, callback || function(buffer) {
      sound.buffer = buffer;
    }, onError); 
  };

  xhr.send();
}

iio.Sound.prototype.play = function(gain) {
  if (this.buffer === undefined) return;
  if (gain !== undefined) {
    this.gainNode.gain.value = gain;
  }
  var source = this.audioCtx.createBufferSource();
  source.buffer = this.buffer;
  source.connect(this.gainNode);
  source.start(0);
}

