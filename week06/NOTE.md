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
