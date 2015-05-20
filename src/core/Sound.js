iio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

iio.Sound = function(buffer) {
  // Set up a GainNode for volume control
  this.gainNode = iio.audioCtx.createGain();
  this.gainNode.connect(iio.audioCtx.destination);
  this.buffer = buffer;
}

iio.Sound.prototype.play = function(options, delay) {
  if (this.buffer === undefined) return;
  var source = iio.audioCtx.createBufferSource();
  source.buffer = this.buffer;
  if (options) {
    if (options.loop) source.loop = true;
  }
  source.connect(this.gainNode);
  source.start(delay || 0);
}

iio.Sound.prototype.setGain = function(value) {
  this.gainNode.gain.value = value;
}

