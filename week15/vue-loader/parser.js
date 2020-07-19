// 有EOF的原因是，字符可以是一段一段传过来的
// 编译器不知道当前这一段是不是最后一段，所以可能就会处在一个等待字符补全的状态
// 由于字符会占位，所以不能用string，但是用对象什么的是可以的，这个地方没明白
const EOF = Symbol('EOF'); // End of File

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: 'document', children: []}];

let rules = [];

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  if (selector.charAt(0) === '#') {
    // 这里不知道是不是这样写的
    var attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if(selector.charAt(0) === '.') {
    var attr = element.attributes.filter(attr => attr.name === 'class')[0]
    // 额外的作业，空格分割的class
    if (attr && attr.value === selector.replace('.', '')) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function specificity(selector) {
  // 第一个是高位
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(' ');
  for (const part of selectorParts) {
    // 可以在这里加正则把复合选择器也拆开
    if (part.charAt(0) === '#') {
      p[1] += 1;
    } else if (part.charAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp2[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }
    element.tagName = token.tagName;
    for(let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }
    // 第二步
    // 在创建元素并且把tagName和属性都加好之后
    // 这个位置非常的关键，也是非常难想的地方
    top.children.push(element);
    element.parent = top;
    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if(top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      // 第三节，遇到style标签时，执行添加CSS规则的操作，执行CSS收集
      // 在这里做的原因时是在push的时候style标签的子元素，也就是文本节点
      // 还没有被挂到style标签上，style标签里面子元素会是空的
      stack.pop();
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if(currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if(c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c
    });
    return data;
  }
}

function tagOpen(c) {
  if(c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c);
  } else {
    emit({
      type: 'text',
      content: c
    });
    return;
  }
}

function endTagOpen(c) {
  if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c);
  } else if (c === '>') {

  } else if (c === EOF) {

  } else {

  }
}

// 为了处理script标签内的字符影响解析

function scriptData(c) {
  if (c == '<') {
    return scriptDataLessThanSign;
  } else {
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}

function scriptDataLessThanSign(c) {
  if (c == '/') {
    return scriptDataEndTagOpen;
  } else {
    emit({
      type: 'text',
      content: "<"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}

function scriptDataEndTagOpen(c) {
  if (c == 's') {
    return scriptDataEndTagNameS;
  } else {
    emit({
      type: 'text',
      content: "<"
    });
    emit({
      type: 'text',
      content: "/"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}

function scriptDataEndTagNameS(c) {
  if (c == 'c') {
    return scriptDataEndTagNameC;
  } else {
    emit({
      type: 'text',
      content: "</s"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}

function scriptDataEndTagNameC(c) {
  if (c == 'r') {
    return scriptDataEndTagNameR;
  } else {
    emit({
      type: 'text',
      content: "</sc"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}

function scriptDataEndTagNameR(c) {
  if (c == 'i') {
    return scriptDataEndTagNameI;
  } else {
    emit({
      type: 'text',
      content: "</scr"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }
}

function scriptDataEndTagNameI(c) {
  if (c == 'p') {
    return scriptDataEndTagNameP;
  } else {
    emit({
      type: 'text',
      content: "</scri"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }
}

function scriptDataEndTagNameP(c) {
  if (c == 'p') {
    return scriptDataEndTag;
  } else {
    emit({
      type: 'text',
      content: "</scrip"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}
function scriptDataEndTag(c) {
  if (c == ' ') {
    return scriptDataEndTag;
  } else if (c == '>') {
    emit({
      type: 'endTag',
      tagName: 'script'
    });
    return data;
  } else {
    emit({
      type: 'text',
      content: "</script"
    });
    emit({
      type: 'text',
      content: c
    });
    return scriptData;
  }

}

function tagName(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if(c === '/') {
    return selfClosingStartTag;
  } else if(c.match(/^[A-Z]$/)) {
    currentToken.tagName += c; // toLowerCase()
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

function beforeAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if(c === '=') {
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if(c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function selfClosingStartTag(c) {
  if(c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if(c === 'EOF') {

  } else {

  }
}

function attributeName(c) {
  if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if(c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === "'" || c === '<') {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '\"') {
    return doubleQuotedAttributeValue;
  } else if (c === '\'') {
    return singleQuoteAttributeValue;
  } else if (c === '>') {
    return data;
  } else {
    return UnquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuoteAttributeValue(c) {
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === "'" || c === '<' || c === '=' || c === "`") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
    if (stack[stack.length - 1].tagName === 'script' && state === data) {
      state = scriptData;
    }
  }
  state = state(EOF);
  return stack[0];
}