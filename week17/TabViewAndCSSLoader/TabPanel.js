import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation';
import { cubicBezier } from './cubicBezier';
import { enableGesture } from './gesture';

export class TabPanel {
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
  select(i) {
    for (const view of this.childViews) {
      view.style.display = 'none';
    }
    this.childViews[i].style.display = '';
    for (const view of this.titleViews) {
      view.classList.remove('selected');
    }
    // this.childViews[i].style.display = '';
    // this.titleView.innerText = this.childViews[i].title;
    this.titleViews[i].classList.add('selected');
  }
  render() {
    this.childViews = this.children.map(child => <div style="width:300px;min-height:300px;">{child}</div>);
    this.titleViews = this.children.map((child, i) => (
      <span onClick={() => this.select(i)} style="width:300px;min-height:300px;">{child.getAttribute('title') || ' '}</span>
    ))
    setTimeout(() => this.select(0));

    return <div class="tab-panel" style="border:solid 1px lightgreen;width:300px">
      <h1 style="background:lightgreen;width:300px;margin:0;">{this.titleViews}</h1>
      <div style="width:300px;min-height:300px;">
        {this.childViews}
      </div>
    </div>
  }
}