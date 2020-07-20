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
    let isStop = false;
    let root = <div class="carousel">
      {children}
      {stopBtn}
    </div>
    let position = 0;
    let tl = new Timeline;
    let linear = t => t;
    let nextPic = () => {
      // 注意这里不能有任何的DOM操作，因为我们是一个纯粹的视觉展现的东西
      // 如果在这里重新append一下，不但改变了视觉效果，也改变了结构，语义也变了
      // 行为会不可预期，元素之间的顺序变了
      if (isStop) {
        return;
      }
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let next = children[nextPosition];

      // 这里就是把下一个挪到起始位置，再new一个Animation的话没有意义
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      // 这里加setTimeout是因为transition生效是需要间隔的
      setTimeout(function() {
        tl.clear();
        let firstStatus = false;
        let secondStatus = false;
        tl.add(new Animation(current.style, 'transform', 0, 100, 3000, 0, linear, v => {
          if (v === 100) {
            firstStatus = true;
            if (secondStatus) {
              position = nextPosition;
              nextPic();
              // 由于position被改了，所以下面的表达式也要跟着变化一下
              return `translateX(${ - v * position}%)`
            }
          }
          return `translateX(${ - v - 100 * position}%)`
        }));
        tl.add(new Animation(next.style, 'transform', 0, 100, 3000, 0, linear, v => { 
          if (v === 100) {
            secondStatus = true;
            if (firstStatus) {
              position = nextPosition;
              nextPic();
              // 由于position被改了，所以下面的表达式也要跟着变化一下
              return `translateX(${ - v * position}%)`
            }
          }
          return `translateX(${ - v - 100 * (nextPosition - 1)}%)`
        }));
        tl.start();

      }, 16);
    }
    root.addEventListener('mousedown', event => {
      let startX = event.clientX, startY = event.clientY;

      let lastPosition = (position - 1 + this.data.length) % this.data.length;
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let last = children[lastPosition];
      let next = children[nextPosition];

      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${- 500 * position}px)`;
      last.style.transform = `translateX(${- 500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

      let move = event => {
        // current.style.transition = 'ease 0s';
        current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`;
        last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`;
        next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`;
      }
      let up = event => {
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

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }
      // 如果在移动端还有touch事件的问题
      // 还要使用touch事件
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    })
    stopBtn.addEventListener('click', () => {
      isStop = true;
      // tl.pause()
    });
    setTimeout(nextPic, 3000);
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
