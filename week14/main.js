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