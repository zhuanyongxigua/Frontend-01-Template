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
  </script
  </script> `;
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
