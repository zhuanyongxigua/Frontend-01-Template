// import { parseHTML } from './parser.js';
const parseHTML = require('./parser.js');
let content = `<div>sdfsdf</>`;
let doc = parseHTML(content);
console.log(doc);