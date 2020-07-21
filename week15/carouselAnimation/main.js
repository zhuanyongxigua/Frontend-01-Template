import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation, ColorAnimation } from './animation.js';
import { cubicBezier } from './cubicBezier.js';

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
    // JSX的组件是一等公民，可以随便的赋值给变量，这是非常舒服的地方
    let children = this.data.map(url => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    });
    let stopBtn = <button>stop</button>
    let resumeBtn = <button>resume</button>
    let restartBtn = <button>restart</button>
    let isStop = false;
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
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let next = children[nextPosition];

      // 这里就是把下一个挪到起始位置，再new一个Animation的话没有意义
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      // 这里加setTimeout是因为transition生效是需要间隔的
      setTimeout(function() {
        if (isStop) {
          return;
        }
        let firstStatus = false;
        let secondStatus = false;
        tl.add(new Animation(current.style, 'transform', 0, 100, 1000, 0, ease, v => {
          if (v === 100) {
            firstStatus = true;
            if (secondStatus) {
              position = nextPosition;
              nextPic();
              tl.clear();
              // 由于position被改了，所以下面的表达式也要跟着变化一下
              return `translateX(${ - v * position}%)`
            }
          }
          return `translateX(${ - v - 100 * position}%)`
        }));
        tl.add(new Animation(next.style, 'transform', 0, 100, 1000, 0, ease, v => { 
          if (v === 100) {
            secondStatus = true;
            if (firstStatus) {
              position = nextPosition;
              nextPic();
              tl.clear();
              // 由于position被改了，所以下面的表达式也要跟着变化一下
              return `translateX(${ - v * position}%)`
            }
          }
          return `translateX(${ - v - 100 * (nextPosition - 1)}%)`
        }));
        tl.start();

      // }, 16);
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
      tl.clear();
      children.forEach(child => {
        child.style.transform = '';
      })
      position = 0;
      setTimeout(nextPic, 16);
    })
    setTimeout(nextPic, 16);
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
