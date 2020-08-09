// import { parseHTML } from './parser.js';
const parseHTML = require('./parser.js');
let doc = parseHTML("<div id=a class='cls' data=\"abc\"></div>");
let div = doc.children[0];
let count = 0;
for (const attr of div.attributes) {
  if (attr.name === 'id') {
    count++;
  }
  if (attr.name === 'class') {
    count++;
  }
  if (attr.name === 'data') {
    count++;
  }
}