let css = require('css');


module.exports = function(source, map) {
  let stylesheet = css.parse(source);
  let name = this.resourcePath.match(/([^/]+).css$/)[1];
  for (const rule of stylesheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selector => {
      return selector.match(new RegExp(`^.${name}`)) ? selector : `.${name} ${selector}`;
    })
  }
  console.log(css.stringify(stylesheet));
  return `
let style=document.createElement('style');

style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))};

document.documentElement.appendChild(style);
  `;
}