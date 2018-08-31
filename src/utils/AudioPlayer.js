const AudioContext = window.AudioContext || window.webkitAudioContext;

class AudioPlayer {
  constructor() {
    this.audioCtx = new AudioContext();
    this.source = null;
  }

  createBufferSource() {
    this.source = this
      .audioCtx
      .createBufferSource();
    console.log('====================================');
    console.log(this.audioCtx, this.source);
    console.log('====================================');
    return this.source;
  }

  initData(data, success = () => {}, onended = () => {}, fail = () => {}) {
    this.parameter = (time = 0) => [
      data, (buffer) => {
        try {
          success();
          this.source.buffer = buffer;
          this
            .source
            .connect(this.audioCtx.destination);
          this.source.loop = false;
          this
            .source
            .start(time);
          // this.source.stop(0);
          this.source.onended = (event) => {
            onended(event);
          }
        } catch (error) {
          fail(error);
        }
      },
      fail
    ];
  }

  start() {
    this.createBufferSource();
    this
      .audioCtx
      .decodeAudioData(...this.parameter(0));
  }

  restart() {
    this.createBufferSource();
    this
      .audioCtx
      .decodeAudioData(...this.parameter(this.audioCtx.currentTime));
  }

  pause() {
    this
      .source
      .stop(this.audioCtx.currentTime);
  }

  stop() {
    this
      .source
      .stop(0);
  }
};

export default AudioPlayer;