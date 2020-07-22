
# 重学前端week15组件化One more thing：Vue风格的SFC

https://html.spec.whatwg.org/multipage/parsing.html#tokenization

> 如何写一个处理`.vue`文件的loader？

```js
let parser = require('./parser-teacher2');
// let parser = require('./parser');

module.exports = function(source, map) {
  let tree = parser.parseHTML(source);

  let template = null;
  let script = null;
  for(let node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type != 'text')[0];
      // template = node;
    }
    if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }
  let visit = (node) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    for(let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map(node => {
      return visit(node);
    })
    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  }

  let r = `
import {createElement, Text, Wrapper} from "./createElement.js"
export class Carousel {
  setAttribute(name, value) {
    this[name] = value;
  }
  render() {
    return ${visit(template)}
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
`;
  return r;
}
```

自制的`.vue`文件：

```html
<template>
    <div>
        <img />
    </div>
</template><script>
export default {
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // a computed getter
    reversedMessage: function () {
      // `this` points to the vm instance
      let i = 1;
      while(i < 100) {
          i ++;
      }
      return this.message.split('').reverse().join('')
    }
  }
}

</script>
```
# 重学前端week15第二节组件化｜动画

transform肯定不会出发重排。

```js
// 由于css的动画不可控，比如把CSS的transtion的动画如果想要停止的话，就需要清空transtion，设置为none，但是这个操作并不会马上停止，动画还会多持续一小段。
export class Timeline {
  constructor() {
    this.animations = [];
    this.requestID = null;
    this.state = "inited";
    // 写在这个地方就可以用箭头函数，写在class里面this是不固定的
    this.tick = () => {
      let t = Date.now() - this.startTime;
      console.log(t);
      let animations = this.animations.filter(animation => !animation.finished)
      for (const animation of this.animations) {
        // if (t > animation.duration + animation.delay) {
        //   t = animation.duration + animation.delay;
        // }
        let { object, property, start, end, timingFunction, delay, duration, template, addTime } = animation;

        let progression = timingFunction((t - delay - addTime) / duration); // 0-1之前的数
        // if (t > animation.duration + animation.delay) {
        if (t > duration + delay + addTime) {
          progression = 1;
          animation.finished = true;
        }

        let value = animation.valueFromProgression(progression);

        object[property] = template(value);
      }
      if (animations.length) {
        this.requestID = requestAnimationFrame(this.tick);
      }
    }
  }

  pause() {
    if (this.state !== 'playing') {
      return;
    }
    this.state = 'pause';
    this.pauseTime = Date.now();
    if (this.requestID !== null) {
      cancelAnimationFrame(this.requestID);
    }
  }

  resume() {
    if (this.state !== 'pause') {
      return;
    }
    this.state = 'playing';
    // 为啥是这个？
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  start() {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    if (this.state === 'playing') {
      this.pause();
    }
    this.animations = [];

    this.requestID = null;
    this.state = "playing";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    this.animations.push(animation);
    animation.finished = false;
    if (this.state === 'playing') {
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

```

> 如果没有TimeLine类，做动画会麻烦吗？不用的话性能好吗？如果好，为什么？如果不好，为什么？

肯定会麻烦的，要一个一个的去start，stop等等。

在搞动画的时候不可避免的要使用setTimeout/setInterval/requestAnimationFrame三者之一，如果动画比较多的话，很难在一个setTimeout里面开始所有的动画，那就会产生很多的setTimeout，这个性能就不好了。每一个animation都要一个setTimeout，都要一个函数调用。

此外，还可以有多条时间线，比如植物大战僵尸，暂停了游戏，但是那个僵尸还是在摇头晃脑。


> 前端架构指的是什么？服务端呢？

服务端是类似于服务与服务之间的高访问量带来的高并发的复杂性。

客户端是代码之间的复杂性的问题，前端没有并发的复杂性，页面与页面之间天然就是解耦的。前端需要解决的是重复页面这种跨页面的复杂性。就是看怎么抽象通用的页面。抽象不好的就是在堆人。

