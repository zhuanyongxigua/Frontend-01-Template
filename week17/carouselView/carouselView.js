import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation';
import { cubicBezier } from './cubicBezier';
// import { enableGesture } from './gesture';

export class CarouselView {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.nextPicStopHandler = null;
    this.timeline = null;
    this.root = null;
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
  stop() {
    clearTimeout(this.nextPicStopHandler);
  }
  restart() {
    this.timeline.restart();
  }
  render() {
    let position = 0;
    let nextPic = () => {
      let nextPosition = (position + 1) % this.children.length;

      let current = children[position];
      let next = children[nextPosition];

      let currentAnimation = new Animation(current.style, "transform", - 100 * position,
        -100 - 100 * position, 500, 0, ease, v => `translateX(${v}%)`)
      let nextAnimation = new Animation(next.style, "transform", 100 - 100 * nextPosition,
        - 100 * nextPosition, 500, 0, ease, v => `translateX(${v}%)`)
      this.timeline.add(currentAnimation);
      this.timeline.add(nextAnimation);
      position = nextPosition;
      this.nextPicStopHandler = setTimeout(nextPic, 3000);
    }
    let children = this.children.map((child, currentPosition) => {
      let lastPosition = (currentPosition - 1 + this.children.length) % this.children.length;
      let nextPosition = (currentPosition + 1) % this.children.length;
      let offset = 0;
      let onStart = (event) => {
        console.log('onstart');
        this.timeline.pause();
        clearTimeout(this.nextPicStopHandler);
        let currentElement = children[currentPosition];
        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)%\)/)[1]);
        offset = currentTransformValue + 100 * currentPosition;
      }

      let onPan = event => {
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let currentTransformValue = - 100 * currentPosition + offset;
        let lastTransformValue = - 100 - 100 * lastPosition + offset;
        let nextTransformValue = 100 - 100 * nextPosition + offset;
        let dx = (event.clientX - event.startX) * 100 / event.target.parentElement.getBoundingClientRect().width;
        lastElement.style.transform = `translateX(${lastTransformValue + dx}%)`;
        currentElement.style.transform = `translateX(${currentTransformValue + dx}%)`;
        nextElement.style.transform = `translateX(${nextTransformValue + dx}%)`;
      }

      let onPanend = event => {
        let direction = 0;
        let dx = (event.clientX - event.startX) * 100 / event.target.parentElement.getBoundingClientRect().width;

        console.log('flick', event.isFlick);

        // &&优先级高于||，所以不用加括号
        if (dx + offset > 50 || dx > 0 && event.isFlick) {
          direction = 1;
        } else if (dx + offset < -50 || dx < 0 && event.isFlick) {
          direction = -1;
        }
        this.timeline.reset();
        this.timeline.start();

        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let lastAnimation = new Animation(lastElement.style, 'transform',
          - 100 - 100 * lastPosition + offset + dx, - 100 - 100 * lastPosition + direction * 100, 500, 0, ease, v => `translateX(${v}%)`)
        let currentAnimation = new Animation(currentElement.style, 'transform',
          - 100 * currentPosition + offset + dx, - 100 * currentPosition + direction * 100, 500, 0, ease, v => `translateX(${v}%)`)

        let nextAnimation = new Animation(nextElement.style, 'transform',
          100 - 100 * nextPosition + offset + dx, 100 - 100 * nextPosition + direction * 100, 500, 0, ease, v => `translateX(${v}%)`)

        this.timeline.add(lastAnimation);
        this.timeline.add(currentAnimation);
        this.timeline.add(nextAnimation);

        position = (position - direction + this.children.length) % this.children.length;

        this.nextPicStopHandler = setTimeout(nextPic, 3000);
      }

      let element = <div
        class="carousel-item"
        onStart={onStart}
        onPan={onPan}
        onPanend={onPanend}
        enableGesture={true}
      >{child}</div>;
      element.style.transform = "translateX(0%)";
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    });
    this.timeline = new Timeline;
    let ease = cubicBezier(0.25, .1, .25 ,1);
    this.root = <div class="carousel">
      {children}
    </div>
    this.timeline.start();
    this.nextPicStopHandler = setTimeout(nextPic, 3000);
    return this.root
  }
}