import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation';
import { cubicBezier } from './cubicBezier';
import { enableGesture } from './gesture';

export class Panel {
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
    return <div class="panel" style="border:solid 1px lightgreen;width:300px">
      <h1 style="background:lightgreen;width:300px;margin:0;"></h1>
      <div style="width:300px;min-height:300px;">
        {this.children}
      </div>
    </div>
  }
}