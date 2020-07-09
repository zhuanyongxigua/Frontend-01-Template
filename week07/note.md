# 重学前端week07第一节浏览器工作原理｜CSS计算，排版，渲染，合成（二）

### 第一步

> Flex布局的主轴与交叉轴？

![](http://www.zhuanyongxigua.cn/2020-07-05-082941.png)

用ifelse写，会不优雅，嵌套，重复。标准里面选择用抽象的方式来做。

主轴是元素的排布方向，交叉轴是与主轴垂直的方向。第二个元素如果排布在第一个元素的右边，那主轴就是row。

```js
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (const prop in element.computedStyle) {
    var p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  var elementStyle = getStyle(element);
  if (elementStyle.display !== 'flex') {
    return;
  }
  var items = element.children.filter(e => e.type === 'element');
  items.sort(function(a, b) {
    return (a.order || 0) - (b.order || 0);
  })
  var style = elementStyle;
  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  })
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }
  // 这里很重要，需要记住，理解这里都是抽象的啥
  var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    // 方向，从左往右是正，从右向左是负
    // 多加个正号就是为了明确一点，提醒你
    // 与负一有明显的对应关系
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'wrap-reverse') {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
}

module.exports = layout;
```

### 收集元素进行（hang）

![](http://www.zhuanyongxigua.cn/2020-07-05-144122.png)

先判断第一行有没有满。用mainSize，只跟mainSize有关。这里的行也不是row，这里起了个名字叫flex line。

flex布局父元素没有设置宽度，会自动撑开，也就是说是所有子元素的宽度的和。

```js
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (const prop in element.computedStyle) {
    var p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  var elementStyle = getStyle(element);
  if (elementStyle.display !== 'flex') {
    return;
  }
  var items = element.children.filter(e => e.type === 'element');
  items.sort(function(a, b) {
    return (a.order || 0) - (b.order || 0);
  })
  var style = elementStyle;
  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  })
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }
  // 这里很重要，需要记住，理解这里都是抽象的啥
  var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    // 方向，从左往右是正，从右向左是负
    // 多加个正号就是为了明确一点，提醒你
    // 与负一有明显的对应关系
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'wrap-reverse') {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  var isAutoMainSize = false;
  if (!style[mainSize]) { // auto sizing
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      var item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  var flexLine = [];
  var flexLines = [flexLine];
  // 行的剩余空间
  var mainSpace = elementStyle[mainSize];
  var crossSpace = 0;
  for (let i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSpace) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  if (mainSpace < 0) {
    // overflow (happens only if container is single line), scale every item
    var scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase;
  }
}

module.exports = layout;
```

### 计算主轴

![](http://www.zhuanyongxigua.cn/2020-07-05-150914.png)

把剩下的空间用完，再看看空隙是多少：

![](http://www.zhuanyongxigua.cn/2020-07-05-151008.png)

然后把这个空隙分给问号。

课程里面说的flex元素指的是带flex属性值的元素，不是display:flex 的元素。后者是flex 容器。

### 计算交叉轴

![](http://www.zhuanyongxigua.cn/2020-07-06-140507.png)


## 绘制

### 绘制单个元素

* 绘制需要依赖一个图形环境；
* 我们这里采用了npm包images；
* 绘制在一个viewport上进行；
* 与绘制相关的属性：background-color，border，background-image等；

### 绘制DOM

```js
// client.js
// 正常这里应该做成generator的形式的，但是太麻烦，就简化了
let response = await request.send();
let dom = parser.parseHTML(response.body);
let viewport = images(800, 600);
render(viewport, dom);
viewport.save('viewport.jpg');


// render.js
const images = require('images');

function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height);
    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(0,0,0)";
      color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }
  if (element.children) {
    for (const child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;
```








## 参考链接：

- https://www.runoob.com/w3cnote/flex-grammar.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
- https://www.npmjs.com/package/images

## 代码截图及答疑回放：

- 链接：[ https://pan.baidu.com/s/1Zk1rzj3rBQF0vBp9jbGFcA](https://pan.baidu.com/s/1Zk1rzj3rBQF0vBp9jbGFcA)
  提取码：r59y


# 重学前端week07第二节重学CSS｜CSS基本语法，CSS基础机制（一）

### 语法的研究

简化的CSS标准，2.1的结构还是很清晰的，之后的标准就不行了。里面的Visual formmatting model就出BFC的内容，因为是排版相关的，所以出版界的应该很容易理解。**先从附录里面的grammar开始看**。

http://www.w3.org/TR/CSS21/grammar.html#q25.0

完整的：

https://www.w3.org/TR/css-syntax-3

CSS的产生式：

```js
stylesheet
  : [ CHARSET_SYM STRING ';' ]?
    [S|CDO|CDC]* [ import [ CDO S* | CDC S* ]* ]*
    [ [ ruleset | media | page ] [ CDO S* | CDC S* ]* ]*
  ;
import
  : IMPORT_SYM S*
    [STRING|URI] S* media_list? ';' S*
  ;
media
  : MEDIA_SYM S* media_list '{' S* ruleset* '}' S*
  ;
media_list
  : medium [ COMMA S* medium]*
  ;
medium
  : IDENT S*
  ;
page
  : PAGE_SYM S* pseudo_page?
    '{' S* declaration? [ ';' S* declaration? ]* '}' S*
  ;
pseudo_page
  : ':' IDENT S*
  ;
operator
  : '/' S* | ',' S*
  ;
combinator
  : '+' S*
  | '>' S*
  ;
unary_operator
  : '-' | '+'
  ;
property
  : IDENT S*
  ;
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration? [ ';' S* declaration? ]* '}' S*
  ;
selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+
  ;
class
  : '.' IDENT
  ;
element_name
  : IDENT | '*'
  ;
attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*
    [ IDENT | STRING ] S* ]? ']'
  ;
pseudo
  : ':' [ IDENT | FUNCTION S* [IDENT S*]? ')' ]
  ;
declaration
  : property ':' S* expr prio?
  ;
prio
  : IMPORTANT_SYM S*
  ;
expr
  : term [ operator? term ]*
  ;
term
  : unary_operator?
    [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* |
      TIME S* | FREQ S* ]
  | STRING S* | IDENT S* | URI S* | hexcolor | function
  ;
function
  : FUNCTION S* expr ')' S*
  ;
/*
 * There is a constraint on the color that it must
 * have either 3 or 6 hex-digits (i.e., [0-9a-fA-F])
 * after the "#"; e.g., "#000" is OK, but "#abcd" is not.
 */
hexcolor
  : HASH S*
  ;
```

简化一下：

* @charset;
* @import;
* rules;
  * @media;
  * @page;
  * rule;

前两个的顺序不能变。

上面产生式里面的CDO是`<!--`，CDC是`-->`。是一个很无聊的特性，历史包袱，有些浏览器以前不支持CSS，所以写style标签就容易出事，所以可以用这个东西，这个注释里面的CSS是有效的，不会被认为是注释。所以它的目的就出在不支持CSS的浏览器里面不要把CSS内容显示到页面上，包起来之后对于HTML来说是注释，所以不会显示，但是如果是CSS，会被当作CSS解析的。这个并不是说HTML注释对CSS有效。CSS里面注释只有`/*`和`*/`。

重点要看的部分就是stylesheet和ruleset。

### CSS @规则的研究

https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule

![](http://www.zhuanyongxigua.cn/2020-07-09-034706.png)

其他的有的at-rule实现的不好，兼容性很差，暂时不用管了。support是检查兼容性的，没啥用。css的兼容性，postcss可以解决大部分了。但是还是会有很多稀奇古怪的问题，需要单独处理。所以兼容不是在于掌握多少知识，在于快速的发现和解决。测试最好还是用真机。

一般rem解决兼容性的文章：http://html-js.com/article/2402，rem方案在现在已经不太适用了。现在用的话可以把里面的rem的部分换成vw也是可以的。vw现在的兼容性是很好的。

### CSS规则的结构

* Selector
  * https://www.w3.org/TR/selectors-3/
  * https://www.w3.org/TR/selectors-4/，这个可能要完，很难通过。
* Key
  * Properties;
  * Variables: https://www.w3.org/TR/css-variables/
* Value
  * https://www.w3.org/TR/css-values-4/

上面的还可以分成两个部分，一个是Selector，另一个是declaration，也就出后面两个的key/value对。

先看了selectors-3的grammar：https://www.w3.org/TR/selectors-3/#grammar

```js
selectors_group
  : selector [ COMMA S* selector ]*
  ;

selector
  : simple_selector_sequence [ combinator simple_selector_sequence ]*
  ;

combinator
  /* combinators can be surrounded by whitespace */
  : PLUS S* | GREATER S* | TILDE S* | S+
  ;

simple_selector_sequence
  : [ type_selector | universal ]
    [ HASH | class | attrib | pseudo | negation ]*
  | [ HASH | class | attrib | pseudo | negation ]+
  ;

type_selector
  : [ namespace_prefix ]? element_name
  ;

namespace_prefix
  : [ IDENT | '*' ]? '|'
  ;

element_name
  : IDENT
  ;

universal
  : [ namespace_prefix ]? '*'
  ;

class
  : '.' IDENT
  ;

attrib
  : '[' S* [ namespace_prefix ]? IDENT S*
        [ [ PREFIXMATCH |
            SUFFIXMATCH |
            SUBSTRINGMATCH |
            '=' |
            INCLUDES |
            DASHMATCH ] S* [ IDENT | STRING ] S*
        ]? ']'
  ;

pseudo
  /* '::' starts a pseudo-element, ':' a pseudo-class */
  /* Exceptions: :first-line, :first-letter, :before and :after. */
  /* Note that pseudo-elements are restricted to one per selector and */
  /* occur only in the last simple_selector_sequence. */
  : ':' ':'? [ IDENT | functional_pseudo ]
  ;

functional_pseudo
  : FUNCTION S* expression ')'
  ;

expression
  /* In CSS3, the expressions are identifiers, strings, */
  /* or of the form "an+b" */
  : [ [ PLUS | '-' | DIMENSION | NUMBER | STRING | IDENT ] S* ]+
  ;

negation
  : NOT S* negation_arg S* ')'
  ;

negation_arg
  : type_selector | universal | HASH | class | attrib | pseudo
  ;
```

COMMA是逗号。negation是`not()`伪类。视频里面讲了simple_selector_sequence。如果要在toy-browser里面支持这个，就加到parser文件的match函数里面，对match的第二个参数做分析。

### 初建CSS知识体系

css-variables：

```css
:root {
  --main-color: #06c;
  --accent-color: #006;
  --foo: if(x > 5) this.width = 10;
}
/* The rest of the CSS file */
#foo h1 {
  color: var(--main-color);
}
```

兼容性不好。

然后讲了cssfunction，比如calc这个东西：https://www.w3.org/TR/css-values-4/#functional-notations

w3c的过滤器是用js实现，就出不是在后端过滤的：https://www.w3.org/TR/?tag=css

用children，而不是childNodes，否则会受到文本节点的干扰。

在这个页面的console里面运行下面代码，获得所有标准的快照。

```js
var lis = document.getElementById('container').children;
var result = [];
for(let li of lis) {
  if(li.getAttribute('data-tag').match(/css/)) {
    result.push({
      name: li.children[1].innerText,
      url: li.children[1].children[0].href
    });
  }	
}
console.log(JSON.stringify(result, null, "    "));
```

> W3 CSS标准的几种状态？

Working Draft是草稿，然后会进入Proposed Edited Recommendation，是候选。Proposed Recommendation就出提案了，征集一下大众意见。Recommendation是现行标准。Retired是退休的标准。

Recommendation的其实很少，还都是不太熟悉的。里面的那个media query不是我们认识的那个媒体查询。CR里面熟悉的较多，比较准了。

> data-set作用？

html的data-set是用来标示html背后用的数据。比如html来自是一个请求，返回了一个json，把json里面的东西就可以标到data-set上面。data-set里面的属性不会影响html元素的判定。



用上面爬到的东西搞一下css的properties。

```js
let iframe = document.createElement('iframe');
document.body.innerHTML = '';
document.body.appendChild(iframe);

function happen(element, event) {
  return new Promise(function(resolve) {
    let handler = () => {
      resolve();
      element.removeEventListener(event, handler);
    }
  });
}

void async function() {
  for (const standard of standards) {
    iframe.src = standard.url;
    console.log(standard.name);
    await happen(iframe, 'load');
  }
}();
```



## 课件：

- 链接： https://pan.baidu.com/s/1Zk1rzj3rBQF0vBp9jbGFcA
  提取码：r59y

## 参考链接：

- https://www.w3.org/TR/CSS21/grammar.html#q25.0
- https://www.w3.org/TR/css-syntax-3
- http://www.html-js.com/article/2402
- 小实验收集：[ https://www.w3.org/TR/?tag=css](https://www.w3.org/TR/?tag=css)

## 参考名词：

- [BFC ](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)：块格式化上下文（Block Formatting Context，BFC） 是 Web 页面的可视 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

## 参考代码：

- 收集标准：

```CSS
var lis = document.getElementById("container").children
 
 
var result = [];
 
 
for(let li of lis) {
    if(li.getAttribute('data-tag').match(/css/))
        result.push({
            name:li.children[1].innerText,
            url:li.children[1].children[0].href
        })
}
console.log(result)
```

- 收集 CSS 属性相关标准：

```JavaScript
let iframe = document.createElement("iframe");
document.body.innerHTML = "";
document.body.appendChild(iframe);
 
 
 
 
function happen(element, event){
    return new Promise(function(resolve){
        let handler = () => {
            resolve();
            element.removeEventListener(event, handler);
        }
        element.addEventListener(event, handler);
    })
}
 
 
 
 
void async function(){
    for(let standard of standards) {
        iframe.src = standard.url;
        console.log(standard.name);
        await happen(iframe, "load");
    }
}();
```

## 课后作业：

- 画一个 CSS 的脑图