iio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

iio.Sound = function(buffer) {
  // Set up a GainNode for volume control
  this.gainNode = iio.audioCtx.createGain();
  this.gainNode.connect(iio.audioCtx.destination);
  this.buffer = buffer;
}

iio.Sound.prototype.play = function(gain, delay) {
  if (this.buffer === undefined) return;
  if (gain !== undefined) {
    this.gainNode.gain.value = gain;
  }
  var source = iio.audioCtx.createBufferSource();
  source.buffer = this.buffer;
  source.connect(this.gainNode);
  source.start(delay || 0);
}

