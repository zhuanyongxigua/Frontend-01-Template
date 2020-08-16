import { enableGesture } from './gesture';
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
    this.root.setAttribute(name, value);
    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
      this.addEventListener(eventName, value);
    }
    if (name === 'enableGesture') {
      enableGesture(this.root);
    }
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