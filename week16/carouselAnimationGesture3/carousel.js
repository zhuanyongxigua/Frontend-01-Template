import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation';
import { cubicBezier } from './cubicBezier';
import { enableGesture } from './gesture';

export class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  setAttribute(name, value) {
    this[name] = value;
    if (name === 'enableGesture') {
      enableGesture(this.root);
    }
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
  render() {
    // JSX的组件是一等公民，可以随便的赋值给变量，这是非常舒服的地方
    let nextPicStopHandler;
    let position = 0;
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let next = children[nextPosition];

      let currentAnimation = new Animation(
        current.style,
        "transform",
        - 100 * position,
        -100 - 100 * position,
        5000,
        0,
        ease,
        v => {
          return `translateX(${5 * v}px)`
        }
      )
      let nextAnimation = new Animation(
        next.style,
        "transform",
        100 - 100 * nextPosition,
        - 100 * nextPosition,
        5000,
        0,
        ease,
        v => `translateX(${5 * v}px)`
      )
      timeline.add(currentAnimation);
      timeline.add(nextAnimation);
      position = nextPosition;
      nextPicStopHandler = setTimeout(nextPic, 3000);
    }
    let children = this.data.map((url, currentPosition) => {
      let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
      let nextPosition = (currentPosition + 1) % this.data.length;
      let offset = 0;
      let onStart = (event) => {
        console.log('onstart');
        timeline.pause();
        clearTimeout(nextPicStopHandler);
        let currentElement = children[currentPosition];
        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
        offset = currentTransformValue + 500 * currentPosition;
      }

      let onPan = event => {
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let currentTransformValue = - 500 * currentPosition + offset;
        let lastTransformValue = - 500 - 500 * lastPosition + offset;
        let nextTransformValue = 500 - 500 * nextPosition + offset;
        let dx = event.clientX - event.startX;
        lastElement.style.transform = `translateX(${lastTransformValue + dx}px)`;
        currentElement.style.transform = `translateX(${currentTransformValue + dx}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue + dx}px)`;
      }

      let onPanend = event => {
        let direction = 0;
        let dx = event.clientX - event.startX;
        if (dx + offset > 250) {
          direction = 1;
        } else if (dx + offset < -250) {
          direction = -1;
        }
        timeline.reset();
        timeline.start();

        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let lastAnimation = new Animation(lastElement.style, 'transform',
          - 500 - 500 * lastPosition + offset + dx, - 500 - 500 * lastPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)
        let currentAnimation = new Animation(currentElement.style, 'transform',
          - 500 * currentPosition + offset + dx, - 500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)

        let nextAnimation = new Animation(nextElement.style, 'transform',
          500 - 500 * nextPosition + offset + dx, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)

        timeline.add(lastAnimation);
        timeline.add(currentAnimation);
        timeline.add(nextAnimation);

        position = (position - direction + this.data.length) % this.data.length;

        nextPicStopHandler = setTimeout(nextPic, 3000);
      }

      let element = <img
        src={url}
        onStart={onStart}
        onPan={onPan}
        onPanend={onPanend}
        enableGesture={true}
      />;
      element.style.transform = "translateX(0px)";
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    });
    let timer = null;
    let timeline = new Timeline;
    let ease = cubicBezier(0.25, .1, .25 ,1);
    let stopBtn = <button onClick={() => {
      clearTimeout(nextPicStopHandler);
    }}>stop</button>
    let resumeBtn = <button>resume</button>
    let restartBtn = <button onClick={() => {
      timeline.restart();
    }}>restart</button>
    let root = <div class="container">
      <div class="carousel">
        {children}
      </div>
      <div class="btn-container">
        {stopBtn}
        {resumeBtn}
        {restartBtn}
      </div>
    </div>
    timeline.start();
    nextPicStopHandler = setTimeout(nextPic, 3000);
    return root
  }
}