import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation';
import { cubicBezier } from './cubicBezier';
import { enableGesture } from './gesture';

export class ListView {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }
  setAttribute(name, value) {
    this[name] = value;
    if (name === 'enableGesture') {
      enableGesture(this.root);
    }
  }
  getAttribute(name) {
    return this[name];
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }

  render() {
    let data = this.getAttribute('data');
    return <div class="list-view" style="border:solid 1px lightgreen;width:300px">
      {data.map(this.children[0])}
    </div>
  }
}