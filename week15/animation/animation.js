export class Timeline {
  constructor() {
    this.animations = [];
    this.requestID = null;
    this.INITED = 0;
    this.PLAYING = 1;
    this.PAUSE = 2;
    this.FINISHED = 4;
    this.state = this.INITED;
    this.accelerateTimes = 0;
    this.preTime = null;
    this.reverseTime = null;
  }

  tick() {
    let cur = Date.now();
    let t = null;
    if (this.reverseTime) {
      this.startTime = this.startTime + (cur - this.preTime) * this.accelerateTimes;
      t = this.reverseTime - (cur - this.reverseTime) - this.startTime;
      this.preTime = cur;
      if (t <= 0) {
        return;
      }
    } else {
      // 这种是把起点向向反方向移动，这样跟终点的移动加成就可以做到倍速了
      // 试过直接加速到t上面，或者progression，或者改duration的方法
      // 都失败了，直接加成到t和progression的方法差不多，都会出现问题
      // 具体原因没有彻底想清楚，总之就是计算cur和pre的时候pre有可能会超过pre
      // duration的方法由于duration变了，在刚刚变化的时候，计算(t - delay - addTime) / duration
      // 会跟上一次的结果出现较大的差距，所以会出现跳跃的情况
      this.startTime = this.startTime - (cur - this.preTime) * this.accelerateTimes;
      t = cur - this.startTime;
      this.preTime = cur;
    }
    let animations = this.animations.filter(animation => !animation.finished)
    for (const animation of this.animations) {
      let { object, property, timingFunction, delay, duration, template, addTime } = animation;

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

  reverse() {
    if (this.reverseTime) {
      this.startTIme = this.reverseTime;
      this.reverseTime = null;
    } else {
      this.reverseTime = Date.now();
    }
  }

  accelerate(num) {
    this.accelerateTimes += num;
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
    this.requestID = null;
    this.state = this.PLAYING;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  // addTime就是不想从零开始的时候使用的
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
