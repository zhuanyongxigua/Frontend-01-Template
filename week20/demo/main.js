import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation, ColorAnimation } from './animation.js';
import { cubicBezier } from './cubicBezier.js';
import { enableGesture } from './gesture';

class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
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
  render() {
    let children = this.data.map(url => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    });
    let stopBtn = <button>stop</button>
    let resumeBtn = <button>resume</button>
    let restartBtn = <button>restart</button>
    let isStop = false;
    let timer = null;
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
    let position = 0;
    let tl = new Timeline;
    let ease = cubicBezier(0.25, .1, .25 ,1);
    children.forEach((child, index) => {
      tl.add(new Animation(child.style, 'transform', 0, 100, 1000, 0, ease, v => {
        return `translateX(${ - v - 100 * (((index === 0) && (position === this.data.length - 1)) ? -1 : position)}%)`
      }));
    })
    let nextPic = () => {
      tl.start();
      timer = setTimeout(() => {
        position = (position + 1) % this.data.length;
        if (isStop) {
          return;
        }
        nextPic();
      }, 3000);
    }
    stopBtn.addEventListener('click', () => {
      if (tl.state === tl.PLAYING) {
        tl.pause()
      } else {
        isStop = true;
      }
    });
    resumeBtn.addEventListener('click', () => {
      if (isStop) {
        isStop = false;
        setTimeout(nextPic, 16);
      } else {
        tl.resume();
      }
    })
    restartBtn.addEventListener('click', () => {
      isStop = false;
      tl.reset();
      clearTimeout(timer);
      children.forEach(child => {
        child.style.transform = '';
      })
      position = 0;
      setTimeout(nextPic, 3000);
    })
    // setTimeout(nextPic, 3000);
    enableGesture(root.root);
    let lastPosition = null;
    let nextPosition = null;
    let current = null;
    let last = null;
    let next = null;
    let startX = null;
    let startY = null;
    root.root.addEventListener('start', event => {
      startX = event.clientX
      startY = event.clientY;

      lastPosition = (position - 1 + this.data.length) % this.data.length;
      nextPosition = (position + 1) % this.data.length;

      current = children[position];
      last = children[lastPosition];
      next = children[nextPosition];

      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${- 500 * position}px)`;
      last.style.transform = `translateX(${- 500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;
    })
    root.addEventListener('pan', event => {
      current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`;
      last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`;
    });
    root.addEventListener('panend', event => {
      let offset = 0;
      if (event.clientX - startX > 250) {
        offset = 1;
      } else if (event.clientX - startX < -250) {
        offset = -1;
      }
      // 把transition打开
      // 平时用的时候这样写一定要加注释，非常的反直觉
      current.style.transition = '';
      last.style.transition = '';
      next.style.transition = '';

      current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
      last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;

      position = (position - offset + this.data.length) % this.data.length;
    });
    return root
  }
}

let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}/>

component.mountTo(document.body);
