# 重学前端week14第一节组件化｜为组件添加JSX语法

用了jsx，而不是react，我webpack配置：

```js
module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: "createElement"
                }
              ]
            ]
          }
        }
      }
    ]
  },
  mode: 'development',
  optimization: {
    minimize: false
  }
}
```

安装的东西：

```js
{
  "name": "week14",
  "version": "1.0.0",
  "main": "main.js",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.10.4",
    "@babel/plugin-transform-react-jsx": "^7.10.4",
    "@babel/preset-env": "^7.10.4",
    "babel-loader": "^8.1.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
  }
}
```

具体代码：

```js
function createElement(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({});
  }
  for (const name in attributes) {
    // 如果不单独写一个setAttribute，用直接复制如o[name] = attributes[name], attribute和property就等效了
    o.setAttribute(name, attributes[name]);
  }
  for (const child of children) {
    if (typeof child === 'string') {
      child = new Text(child);
    }
    o.appendChild(child);
  }
  return o;
}

class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    console.log(name, value);
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
    for (const child of this.children) {
      child.mountTo(this.root);
    }
  }

}

class MyComponent {
  constructor(config) {
    console.log('config', config);
    // 这里如果这样搞的化，下面就不需要appendChild了
    this.children = [];
    this.root = document.createElement('div');
  }
  setAttribute(name, value) {
    console.log(name, value);
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.slot = <div></div>
    for (const child of this.children) {
      this.slot.appendChild(child);
    }
    this.render().mountTo(parent);
  }
  render() {
    return <article>
      <header>I'm a header</header>
      {this.slot}
      <footer>i'm a footer</footer>
    </article>
  }
}

// let component = <div id="a" class="b" style="width: 100px;height: 100px;background-color: lightgreen;">
//   <div></div>
//   <div></div>
//   <div></div> 
//   <div></div>
// </div>
let component = <MyComponent>
  <div>text text text</div>
</MyComponent>

component.mountTo(document.body);

// component.
```

# 重学前端week14第三节轮播图组件

设计组件体系的时候，可以先写一个组件，这个组件是你希望的样子，然后再根据这个组件去完成这个组件体系。

组件化是架构的一部分，就是代码怎么写能把他们结合到一块去。

CSS部分：

```css
.carousel {
  width: 500px;
  height: 300px;
  overflow: hidden;
  /* outline的好处是不会参与任何的layout，也可能是坏处，所以展示的时候可以用这个 */
  /* 对于轮播图来说没有意义，最后是要去掉的 */
  outline: 1px solid blue;
  white-space: nowrap;
  margin: auto;
}
.carousel>img {
  width: 100%;
  height: 100%;
  display: inline-block;
  transition: transform ease 1s;
}
```

js部分：

```js
class Carousel {
  constructor() {
    this.root = null;
    this.data = null;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (const d of this.data) {
      let element = document.createElement('img');
      element.src = d;
      element.addEventListener('dragstart', event => event.preventDefault());
      this.root.appendChild(element);
    }
    let position = 0;
    let nextPic = () => {
      // 注意这里不能有任何的DOM操作，因为我们是一个纯粹的视觉展现的东西
      // 如果在这里重新append一下，不但改变了视觉效果，也改变了结构，语义也变了
      // 行为会不可预期，元素之间的顺序变了
      let nextPosition = (position + 1) % this.data.length;

      let current = this.root.childNodes[position];
      let next = this.root.childNodes[nextPosition];

      current.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      // 终止位置
      current.style.transform = `translateX(${ - 100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      // 这里加setTimeout是因为transition生效是需要间隔的
      setTimeout(function() {
        // 上面把动画添加到了style标签里面，这样可以自如的控制动画的风格
        // 缺点是代码分开了，不太好理解
        current.style.transition = '';
        next.style.transition = '';

        current.style.transform = `translateX(${- 100 - 100 * position}%)`;
        next.style.transform = `translateX(${- 100 * nextPosition}%)`;

        position = nextPosition;
      }, 16);


      // 第一个requestAnimationFrame是上面那一组CSS生效的过程
      // 因为这个API是下一祯开始生效
      // 第二个才是下一个
      // 可以写一个文章，setTimeout16好面跟requestAnimation是不完全等价的
      // 不适合实际这样用，用的话需要写注释提示同事
      // requestAnimationFrame(function() {
      //   requestAnimationFrame(function() {
      //     current.style.transition = 'ease 0.5s';
      //     next.style.transition = 'ease 0.5s';

      //     current.style.transform = `translateX(${- 100 - 100 * position}%)`;
      //     next.style.transform = `translateX(${- 100 * nextPosition}%)`;

      //     position = nextPosition;
      //   })
      // });

      setTimeout(nextPic, 3000);
    }
    this.root.addEventListener('mousedown', event => {
      let startX = event.clientX, startY = event.clientY;

      let lastPosition = (position - 1 + this.data.length) % this.data.length;
      let nextPosition = (position + 1) % this.data.length;

      let current = this.root.childNodes[position];
      let last = this.root.childNodes[lastPosition];
      let next = this.root.childNodes[nextPosition];

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
    // setTimeout(nextPic, 3000);
  }
}
// new的时候尽量不带参数
// create
let carousel = new Carousel();
// update
carousel.data = [
 "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
 "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
 "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]
carousel.render();
// mount
document.getElementById('container').appendChild(carousel.root);
```

修改成JSX：

```js
import { createElement, Text, Wrapper } from './createElement';

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
    let root = <div class="carousel">
      {children}
    </div>
    let position = 0;
    let nextPic = () => {
      // 注意这里不能有任何的DOM操作，因为我们是一个纯粹的视觉展现的东西
      // 如果在这里重新append一下，不但改变了视觉效果，也改变了结构，语义也变了
      // 行为会不可预期，元素之间的顺序变了
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let next = children[nextPosition];

      current.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      // 终止位置
      current.style.transform = `translateX(${ - 100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      // 这里加setTimeout是因为transition生效是需要间隔的
      setTimeout(function() {
        // 上面把动画添加到了style标签里面，这样可以自如的控制动画的风格
        // 缺点是代码分开了，不太好理解
        current.style.transition = '';
        next.style.transition = '';

        current.style.transform = `translateX(${- 100 - 100 * position}%)`;
        next.style.transform = `translateX(${- 100 * nextPosition}%)`;

        position = nextPosition;
      }, 16);

      setTimeout(nextPic, 3000);
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
    // setTimeout(nextPic, 3000);
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
```

修改的createElement：

```js
export function createElement(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({});
  }
  for (const name in attributes) {
    // 如果不单独写一个setAttribute，用直接复制如o[name] = attributes[name], attribute和property就等效了
    o.setAttribute(name, attributes[name]);
  }
  let visit = (children) => {
    for (const child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        visit(child);
        continue;
      }
      if (typeof child === 'string') {
        child = new Text(child);
      }
      o.appendChild(child);
    }
  }
  visit(children);
  return o;
}

export class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  get style() {
    return this.root.style;
  }
  setAttribute(name, value) {
    console.log(name, value);
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.children.push(child);
  }
  addEventListener() {
    this.root.addEventListener(...arguments);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
    for (const child of this.children) {
      child.mountTo(this.root);
    }
  }

}
```
