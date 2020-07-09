# 重学前端week06第一节浏览器工作原理｜有限状态机

> 什么是有限状态机？

重点在“机”，而不在“状态”。我们平时是用变量来表示状态。在状态机里面，是把每一个状态都设计成一个独立的机器。

* 每一个状态都是一个机器

  * 在每一个机器里，我们可以做计算、存储、输出。。。
  * 所有的这些机器接受的输入是一致的，就是输入的参数的类型是一样的，不能这个状态只能接收数字，下一个状态只能接收字符串。

  

  * 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）

* 每一个机器知道下一个状态

  * 每个机器都有确定的下一个状态（Moore）
  * 每个机器根据输入决定下一个状态（Mealy）

> 在一个字符串中找到字符“a”？

```js
function match(string) {
  for (let c of string) {
    if (c === 'a') return true
  }
  return false
}

match("I am groot")
```

> How to get "ab" in a string?

```js
function match(string) {
  let foundA = false
  for (let c of string) {
    if (c === 'a') foundA = true
    else if (foundA && c === 'b') return true
    else foundA = false
  }
  return false
}
console.log(match('I abm groot'))
```

> How to get "abcdef" in a string?

```js
function match(string) {
  let foundA = false
  let foundB = false
  let foundC = false
  let foundD = false
  let foundE = false
  for (let c of string) {
    if (c === 'a') {
      foundA = true
    } else if (foundA && c === 'b') {
      foundB = true
    } else if (foundB && c === 'c') {
      foundC = true
    } else if (foundC && c === 'd') {
      foundD = true
    } else if (foundD && c === 'e') {
      foundE = true
    } else if (foundE && c === 'f') {
      return true
    } else {
      foundA = false
      foundB = false
      foundC = false
      foundD = false
      foundE = false
    }
  }
  return false
}

console.log(match('I abm groot'))
```

这种代码很臃肿，而且如果需要匹配更多的话，是不可扩展的。

> Mealy finite-state machine in JS?

### JS中的有限状态机（Mealy）

```js
// 每个函数是一个状态
function state(input) // 函数参数就是输入
{
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  // 这里的next如果是一个目的的值，那就是一个moore状态机
  // 如果return的跟input有关，我们用ifelse，就是meanly状态机
  return next; // 返回值作为下一个状态
}

// 以下是调用
while(input) {
  // 获取输入
  state = state(input) // 把状态机的返回值作为下一个状态
}
```

> How to get "abcdef" in a string with Meanly finite-state machine?

```js
function match(string) {
  let state = start
  for (let c of string) {
    state = state(c)
  }
  return state === end
}

function start(c) {
  if (c === 'a') return foundA
  else return start
}

function end(c) {
  return end
}

function foundA(c) {
  if (c === 'b') return foundB
  // 据说严格的是不允许这样return start(c)的
  // 是要return start的，在视频的35:28
  else return start(c)
}

function foundB(c) {
  if (c === 'c') return foundC
  else return start(c)
}

function foundC(c) {
  if (c === 'd') return foundD
  else return start(c)
}

function foundD(c) {
  if (c === 'e') return foundE
  else return start(c)
}

function foundE(c) {
  if (c === 'f') end
  else return start(c)
}

console.log(match('I abm groot'))
```

> How to handle string "abcabx" with finite-state machine?

Wrong case：

```js
function match(string) {
  let state = start
  for(let c of string) {
    state = state(c)
  }
  return state === end
}
function start(c) {
  if(c === 'a') return foundA
  else return start
}

// ....

// 由于遇到第二个abc的c的时候发现不是x，状态就被重置了
console.log('abcabcabx')
```

Correct：

```js
function match(string) {
  let state = start
  for (let c of string) {
    state = state(c)
  }
  return state === end
}

function start(c) {
  if (c === 'a') return foundA
  else return start
}

function end(c) {
  return end
}

function foundA(c) {
  if (c === 'b') return foundB
  else return start(c)
}

function foundB(c) {
  if (c === 'c') return foundC
  else return start(c)
}

function foundC(c) {
  if (c === 'a') return foundA2
  else return start(c)
}

function foundA2(c) {
  if (c === 'b') return foundB2
  else return start(c)
}

function foundB2(c) {
  if (c === 'x') end
  else return foundB(c)
}

console.log(match('abcabcabx'))
```



## 课后作业：

* 使用状态机完成"abababx"的处理。

- 挑战题：我们如何用状态机处理完全未知的 pattern（选做）,`match(pattern, string)`例如`match('ababx', 'I am ababx! hhha!')`复杂度必须是O(m + n)，与字符串的长度成正比。也就是说不能用双层的for循环。还有一点需要注意的是，不要用原始的KMP去做，KMP并不是状态机。提示是，状态可能是生成的，想想怎么生成状态，JS里面是有闭包的。

  参考资料：字符串KMP算法

## 参考名词：

- [Mealy ](https://zh.wikipedia.org/wiki/米利型有限状态机)：在计算理论中，米利型有限状态机（英语：Mealy machine）是基于它的当前状态和输入生成输出的有限状态自动机（更精确的叫有限状态变换器）。这意味着它的状态图将为每个转移边包括输入和输出二者。与输出只依赖于机器当前状态的摩尔有限状态机不同，它的输出与当前状态和输入都有关。但是对于每个 Mealy 机都有一个等价的 Moore 机，该等价的 Moore 机的状态数量上限是所对应 Mealy 机状态数量和输出数量的乘积加 1（|S’|=|S|*|Λ|+1）。

# 重学前端week06第二节浏览器工作原理｜HTTP协议+语法与词法分析（三）

报文是IP层的东西。

### 拆分文件

就是开始解析HTML。

具体写代码的环节：

1. 为了方便文件管理，我们把parser单独拆到文件中；
2. parser接受HTML文本作为参数，返回一颗DOM树；

### 创建状态机

https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state

具体看的是标准的12.2.5

whatwg里面都相当于是伪代码。

具体总结：

1. 使用FSM来实现HTML的分析；
2. 在HTML标准中，已经规定了HTML的状态；
3. Toy-Browser只挑选其中一部分状态，完成一个最简版本；

### 解析标签

总结：

1. 主要的标签有：开始标签，结束标签和自封闭标签；
2. 在这一步我们暂时忽略属性；

### 创建元素

状态机的一个巨大的优势，由于每一个状态都是一个独立的函数，我们可以在这个状态里面写应该做的事情。

总结：

1. 在状态机中，除了状态迁移，我们还会要加入业务逻辑；
2. 我们在标签结束状态提交标签token；

### 处理属性

总结：

1. 属性之分为单引号、双引号、无引号三种写法，因此需要较多状态处理
2. 处理属性的方式跟标签类似；
3. 属性结束时，我们把属性加到标签Token上；

### 构建DOM

1. 从标签构建DOM树的基本技巧时使用栈；
2. 遇到开始标签时创建元素并入栈，遇到结束标签时出栈；
3. 自封闭节点可视为入栈后立刻出栈；
4. 任何元素的福元素是它入栈前的栈顶；

### 组合文本

总结：

1. 文本节点与自封闭标签处理类似
2. 多个文本节点需要合并；

## 预习内容：

- [浏览器：一个浏览器是如何工作的？（阶段一）](https://time.geekbang.org/column/article/80240)
- [浏览器：一个浏览器是如何工作的？（阶段二）](https://time.geekbang.org/column/article/80260)

## 课件及演示 Demo：

- 链接：[ https://pan.baidu.com/s/14OZzG_K5E3ymZHUXZrJS4Q](https://pan.baidu.com/s/14OZzG_K5E3ymZHUXZrJS4Q)
  提取码：xpxy

## 参考链接：

- https://html.spec.whatwg.org/multipage/parsing.html#data-state
- https://html.spec.whatwg.org/multipage/parsing.html#tagopen-state
- https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inselect

## 参考代码：

```HTML,
<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>
```

## 上节课你需要修改的代码：

```
this.length *= 16;
this.length += parseInt(char, 16);
```

## 课后作业：

- 跟上课堂内容，完成 DOM 树构建

# 重学前端week06第三节浏览器工作原理｜CSS计算，排版，渲染，合成（一）

DOM树加上CSS computing就是带computed style的DOM树。

装一个css包。

### 收集CSS规则

* 遇到style标签时，我们把CSS规则保存起来；
* 这里我们调用CSS Parser来分析CSS规则；
* 这里我们必须要仔细研究此库分析CSS规则的格式；

```js
let rules = [];
function addCSSRules(text) {
  var ast = css.parse(text);
  console.log(JSON.stringify(ast, null, "     "));
  rules.push(...ast.stylesheet.rules);
}

// In emit function endTag condition
// 第三节，遇到style标签时，执行添加CSS规则的操作，执行CSS收集
// 在这里做的原因时是在push的时候style标签的子元素，也就是文本节点
// 还没有被挂到style标签上，style标签里面子元素会是空的
if (top.tagName === 'style') {
  addCSSRules(top.children[0].content);
}
```

### 添加调用

* 当我们创建一个元素后，立即计算CSS；
* 理论上，当我们分析一个元素时，所有CSS规则已经收集完毕；
* 在真实浏览器中，可能遇到写在body的style标签，需要重新CSS计算的情况，这里我们忽略；（这也是为啥所有的style标签要尽量的靠前）

**重要的是计算CSS的位置** 这里这个在创建元素并且把tagName和属性都加好之后。如果也在pop的时候（就是跟上面同一个时间）计算，有些结构会有很大的父标签，比如大家都很喜欢弄一个叫main的div标签把所有的东西包起来，这样这个main就会放在所有的代码的最后（为啥是所有代码的最后？），但是CSS有特点，它是依赖于它的父元素，这样所有元素的渲染就会非常的迟。

### 获取父元素序列

* 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配；
* 我们从上一步骤的stack，可以获取本元素所有的父元素；
* 因为我们首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外；

![](http://www.zhuanyongxigua.cn/2020-07-04-084215.png)

第一种取法时在入栈的时候加一个parent属性，这样就可以逐级的找到parent。还有一个偷懒的办法（就是computeCSS直接定义在了parse文件里面，就可以直接使用parse的栈）。

```js
// Third step
function computeCSS(element) {
  var elements = stack.slice().reverse();
}
```

然后重点讲了一下slice方法，就是浅拷贝。reverse也很关键，我们现在计算CSS是当前元素，所以CSS匹配的时候，一定是先找当前元素是否匹配，因为父元素不一定跟哪个元素匹配，最后一个选择器的标志一定是跟当前元素匹配。所以用reverse，从里往外找。如上图，`#myid`一定是匹配当前元素，所以要先算。

### 拆分选择器

* 选择器也要从当前元素向外排列；
* 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列；

这个算法会有点绕。

```js
// Third step
function computeCSS(element) {
  var elements = stack.slice().reverse();
  // Fourth step
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (const rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    var j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      // 如果匹配到，我们要加入
      console.log('Element', element, 'matched rule', rule);
    }
  }
}
```

准确的说，css是没有继承的，inherit是一个特殊的值。

正常的情况下我们没有理由在页面加载好之后去改css rule，要么改style标签，要么改class属性。

每次获取新的规则所有的东西都要重新算一遍。

### 计算选择器与元素匹配

这一步比较难。

* 根据选择器的类型和元素属性，计算是否与当前元素匹配；
* 这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器；

额外的作业，两个，一个是复合选择器(`div.class#id`)，一个是空格的class选择器。

```js
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
```

### 生成computed属性

* 一旦选择匹配，就应用选择器到元素上，形成computedStyle。

```js
// Third step
function computeCSS(element) {
  var elements = stack.slice().reverse();
  // Fourth step
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (const rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    var j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      // 如果匹配到，我们要加入
      // Sixth step
      console.log('Element', element, 'matched rule', rule);
      var computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          // 由于后面还要处理优先级，所以这里放一个对象，然后把declaration的value存到这个对象的属性里面
          computedStyle[declaration.property] = {};
        }
        computedStyle[declaration.property].value = declaration.value;
      }
      console.log(element.computedStyle);
    }
  }
}
```

### 确定规则覆盖关系（优先级）

这一步比较难

> winter如何表示CSS选择器权重？important在哪？IE如何表示权重？

优先级的单词CSS用的是specificity，而不是priority，前者是指定的具体的程度的意思。

https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

然后就开始讲权重的事情了。

可以记一下的是老师记录权重的方式，是用一个四元组：

```html
<style>
  body div a.x#y {
    color: green;
  }
</style>
<body>
  <div>
    <!-- 这个权重就是[3, 1, 1, 0] -->
    <a class="x" id="y" style="color:blue">name</a>
  </div>
</body>
```

第一个3是标签选择器，有三个，所以是3，第二个是class，第三个是id，最后一个0是inline style。

important连标准都没进。实践中不允许使用important，只能用于hot fix，就是线上有问题，实在不知道怎么改了，可以临时加上，实际产品开发的时候不允许使用。重罚。

IE不是用四元组表示权重，使用四个字节，这就存在进位的问题。比如写255个tag，可以顶一个class，这就属于bug。

```js
function specificity(selector) {
  // 第一个是高位
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(' ');
  for (const part of selectorParts) {
    // 可以在这里加正则把复合选择器也拆开
    if (part.charAt(0) === '0') {
      p[1] += 1;
    } else if (part.charAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}
```

> CSS学习level几？

然后提了一下，CSS 的level 4的东西，很多东西应该实现不了，浏览器方面不愿意，性能不好，所以看level 3就可以了。

然后看了一下下面的标准：

https://drafts.csswg.org/selectors-3/#specificity

## 预习内容：

- [浏览器：一个浏览器是如何工作的（阶段三）](https://time.geekbang.org/column/article/80311)
- [浏览器：一个浏览器是如何工作的？（阶段四）](https://time.geekbang.org/column/article/81730)
- [浏览器：一个浏览器是如何工作的？（阶段五）](https://time.geekbang.org/column/article/82397)

## 课件及代码截图：

- 链接： https://pan.baidu.com/s/14OZzG_K5E3ymZHUXZrJS4Q
  提取码：xpxy

## 参考链接：

- https://www.w3.org/TR/CSS2/
- https://github.com/wintercn/JSinJS

## 有助于你理解的知识：

- 如何通过 link 异步加载 css，没有类似 script 的官方 async 属性，但可以参考这篇文章 hack：[ https://juejin.im/post/5d8873526fb9a06b155dfbca](https://juejin.im/post/5d8873526fb9a06b155dfbca)

## 课后作业：

- 实现复合选择器，实现支持空格的 Class 选择器（选做）
