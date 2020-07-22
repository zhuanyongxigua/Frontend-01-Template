export class Timeline {
  constructor() {
    this.animations = [];
    this.requestID = null;
    this.INITED = 0;
    this.PLAYING = 1;
    this.PAUSE = 2;
    this.FINISHED = 3;
    this.state = this.INITED;
  }

  tick() {
    let t = Date.now() - this.startTime;
    console.log(t);
    let animations = this.animations.filter(animation => !animation.finished)
    for (const animation of this.animations) {
      let { object, property, start, end, timingFunction, delay, duration, template, addTime } = animation;

      let progression = timingFunction((t - delay - addTime) / duration); // 0-1之前的数
      if (t > duration + delay + addTime) {
        progression = 1;
        animation.finished = true;
      }

      let value = animation.valueFromProgression(progression);

      object[property] = template(value);
    }
    if (animations.length) {
      this.requestID = requestAnimationFrame(() => this.tick());
    } else {
      this.state = this.INITED;
      this.animations.forEach(animation => animation.finished = false);
    }
  }

  pause() {
    if (this.state !== this.PLAYING) {
      return;
    }
    this.state = this.PAUSE;
    this.pauseTime = Date.now();
    if (this.requestID !== null) {
      cancelAnimationFrame(this.requestID);
    }
  }

  resume() {
    if (this.state !== this.PAUSE) {
      return;
    }
    this.state = this.PLAYING;
    // 为啥是这个？
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  start() {
    if (this.state !== this.INITED) {
      return;
    }
    this.state = this.PLAYING;
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    if (this.state === this.PLAYING) {
      this.pause();
    }
    this.animations = [];

    this.requestID = null;
    this.state = this.PLAYING;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    this.animations.push(animation);
    animation.finished = false;
    if (this.state === this.PLAYING) {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
    }
  }
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    // 对应ease linear什么的
    this.timingFunction = timingFunction;
  }

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);

  }
}

export class ColorAnimation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.template = template || ((v) => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    // 对应ease linear什么的
    this.timingFunction = timingFunction;
  }

  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    }
  }
}
