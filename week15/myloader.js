let parser = require('./parser-teacher2');
// let parser = require('./parser');

module.exports = function(source, map) {
  let tree = parser.parseHTML(source);

  let template = null;
  let script = null;
  for(let node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type != 'text')[0];
      // template = node;
    }
    if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }
  let visit = (node) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    for(let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map(node => {
      return visit(node);
    })
    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  }

  let r = `
import {createElement, Text, Wrapper} from "./createElement.js"
export class Carousel {
  setAttribute(name, value) {
    this[name] = value;
  }
  render() {
    return ${visit(template)}
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
`;
  return r;
}