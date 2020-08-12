import { parseHTML } from '../src/parser';
let assert = require('assert');

it('should add to numbers from an es module', () => {
  let doc = parseHTML("<div></div>");
  let div = doc.children[0];
  assert.equal(div.tagName, "div");
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
});

it('parse a single element with text content', () => {
  let doc = parseHTML("<div>hello</div>");
  let text = doc.children[0].children[0];
  assert.equal(text.content, "hello");
  assert.equal(text.type, 'text');
});

it('tag mismatch', () => {
  try {
    let doc = parseHTML("<div></adiv>");
  } catch(e) {
    assert.equal(e.message, "Tag start end doesn't match!");
  }
});

it('text with <', () => {
  let doc = parseHTML("<div>a < b</div>");
  let text = doc.children[0].children[0];
  assert.equal(text.content, "a < b");
  assert.equal(text.type, "text");
});

it('with property', () => {
  let doc = parseHTML("<div id=a class='cls' data=\"abc\" ></div>");
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }
  assert.ok(count === 3);
})

it('with property 2', () => {
  let doc = parseHTML("<div id=a class='cls' data=\"abc\"></div>");
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }
  assert.ok(count === 3);
})

it('with property 3', () => {
  let doc = parseHTML("<div id=a class='cls' data=\"abc\"/>");
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }
  assert.ok(count === 3);
})

it('with property new line', () => {
  let doc = parseHTML(`<div

id="a"></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})

it('new line value', () => {
  let doc = parseHTML(`<div id=
"a"></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})

it('equal mark is in the new line', () => {
  let doc = parseHTML(`<div id
="a"></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 1);
})

it('EOF after value', () => {
  try {
    let doc = parseHTML(`<div id="a"`);
  } catch (e) {
    assert.equal(e.message, "Unexpected EOF after quote value!");
  }
})

it('EOF after attribute name', () => {
  try {
    let doc = parseHTML(`<div id='a'/`);
  } catch (e) {
    assert.equal(e.message, "Unexpected EOF in self close tag!");
  }
})

it('not finish self close tag', () => {
  try {
    let doc = parseHTML(`<div id=a/`);
  } catch (e) {
    assert.equal(e.message, "Unexpected EOF in self close tag!");
  }
})

it('EOF after equal mark', () => {
  let doc = parseHTML(`<div id=`);
})

it('double quotation in value', () => {
  let doc = parseHTML(`<div id="a"b`);
})

it('self close after value without quote', () => {
  let doc = parseHTML(`<div id=a/>`);
})

it('> after value without quote', () => {
  let doc = parseHTML(`<div id=a></div>`);
})

it('Unexpected EOF in single quote value', () => {
  try {
    let doc = parseHTML(`<div id='a`);
  } catch(e) {
    assert.equal(e.message, "Unexpected EOF in single quote value!");
  }
})

it('wrong eng tag', () => {
  let doc = parseHTML(`<div>sdfsdf</>`);
})

it('EOF after "/"', () => {
  try {
    let doc = parseHTML(`<div>sdfsdf</`);
  } catch (e) {
    assert.equal(e.message , 'Unexpected EOF in end tag!');
  }
})

it('EOF after selfClosingTag "/"', () => {
  try {
    let doc = parseHTML(`<div/`);
  } catch (e) {
    assert.equal(e.message , 'Unexpected EOF in self close tag!');
  }
})

it('Unexpected equals sign before attribute name', () => {
  try {
    let doc = parseHTML(`<div ="a"></div>`);
  } catch(e) {
    assert.equal(e.message, "Unexpected equals sign before attribute name");
  }
})

it('EOF after attribute name', () => {
  try {
    let doc = parseHTML(`<div id`);
  } catch(e) {
    assert.equal(e.message, "Unexpected EOF after tag name!");
  }
})

it('Unexpected NULL character!', () => {
  let doc = parseHTML(`<div \u0000></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === '\u0000') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Double quote attribute name, unexpected NULL value!', () => {
  let doc = parseHTML(`<div id="\u0000"></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Double quote attribute name, unexpected NULL value!2', () => {
  let doc = parseHTML(`<div id="asdf\u0000"></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Double quote attribute name, unexpected NULL value!3', () => {
  let doc = parseHTML(`<div id="\u0000ddddd"></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Single quote attribute name, unexpected NULL value!1', () => {
  let doc = parseHTML(`<div id='\u0000'></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Single quote attribute name, unexpected NULL value!2', () => {
  let doc = parseHTML(`<div id='asdsd\u0000'></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Single quote attribute name, unexpected NULL value!3', () => {
  let doc = parseHTML(`<div id='\u0000sdfsdf'></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Unquote attribute name, unexpected NULL value!1', () => {
  let doc = parseHTML(`<div id=\u0000></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Unquote attribute name, unexpected NULL value!2', () => {
  let doc = parseHTML(`<div id=sdfsdf\u0000></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Unquote attribute name, unexpected NULL value!3', () => {
  let doc = parseHTML(`<div id=\u0000sdfsdf></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Unquote attribute name, unexpected NULL value!4', () => {
  let doc = parseHTML(`<div id=\u0000sdfsdf ></div>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Unquote attribute name, unexpected NULL value!5', () => {
  let doc = parseHTML(`<div id=\u0000sdfsdf/>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, '\uFFFD');
    }
  }
  assert.ok(count === 1);
})

it('Unquote attribute name, unexpected NULL value!6', () => {
  try {
    let doc = parseHTML(`<div id=s`);
  } catch(e) {
    assert.equal(e.message, "Unexpected EOF in unquote attribute value!");
  }
})

it('Unexpected character in unquoted attribute value!', () => {
  let doc = parseHTML(`<div id=s'/>`);
  let div = doc.children[0];
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, "s'");
    }
  }
  assert.ok(count === 1);
})

it('Unexpected character in attribute name!', () => {
  try {
    let doc = parseHTML(`<div "></div>`);
  } catch(e) {
    assert.equal(e.message, "Unexpected character in attribute name!");
  }
})

it('Missing attribute value!', () => {
  try {
    let doc = parseHTML(`<div id=></div>`);
  } catch(e) {
    assert.equal(e.message, "Missing attribute value!");
  }
})

it('script', () => {
  let content = `<script>
  <div>abcd</div>
  <span></span>
  /script>
  <script
  <
  </
  </s
  </sc
  </scr
  </scri
  </scrip
  </script `;
  let doc = parseHTML(`<script>${content}</script>`);
  let text = doc.children[0].children[0];
  assert.equal(text.content, content);
  assert.equal(text.type, 'text');
})

it('script', () => {
  let content = `<`;
  let doc = parseHTML(`<script>${content}</script>`);
  let text = doc.children[0].children[0];
  assert.equal(text.content, content);
  assert.equal(text.type, 'text');
})
it('attribute with no value', () => {
  let doc = parseHTML("<div class />");
})

it('attribute with no value2', () => {
  let doc = parseHTML("<div class id/>");
})

it('attribute with no value2', () => {
  let doc = parseHTML("<div/>");
})

it('uppercase tag name', () => {
  let doc = parseHTML('<DIV/>')
})
