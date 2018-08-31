const AudioContext = window.AudioContext || window.webkitAudioContext;

class AudioPlayer {
  constructor() {
    this.audioCtx = new AudioContext();
    this.source = this
      .audioCtx
      .createBufferSource();
    this.decodeAudio = (time = 0) => {}
  }

  initData(data, success = () => {}, onended = (event) => {}, fail = (error) => {}) {
    // this.audioCtx = new AudioContext();
    console.log('====================================');
    console.log(this.audioCtx, this.source);
    console.log('====================================');
    this.decodeAudio = (time = 0) => this
      .audioCtx
      .decodeAudioData(data, (buffer) => {
        try {
          success();
          this.source.buffer = buffer;
          this
            .source
            .connect(this.audioCtx.destination);
          this.source.loop = false;
          this.source.onended = (event) => {
            this.source = this
              .audioCtx
              .createBufferSource();
            onended(event);
          };
          this
            .source
            .start(time);
        } catch (error) {
          fail("Error with decodeAudioData " + error);
        }
      }, (error) => fail("Error with decoding audio data " + error));
  }

  start() {
    const audio = this.audioCtx,
      setTime = 0;
    this.decodeAudio(setTime);
    audio.onstatechange = function () {
      console.log("onstatechange", audio.state);
    }
  }

  restart() {
    this
      .audioCtx
      .resume();
  }

  pause() {
    this
      .audioCtx
      .suspend();
  }

  stop() {
    this
      .audioCtx
      .close()
      .then(() => {
        console.log("audioCtx close");
      });
  }
};

export default AudioPlayer;