# 重学前端week12LL算法构建AST

### 四则运算

* TokenNumber:

  1 2 3 4 5 6 7 8 9 0 的组合

* Operator：+ - * /

* Whitespace: \<sp>

* LineTerminator: \<LF> \<CR>

> 正则如何对无效字符报错？

为什么字典数组里面的可以一一对应？

两个lastIndex也没听懂。怎么slice。

> 乘法表达式有几种开头？

两种，一种是数字，一种是乘法表达式，是根据产生式看出来的。在视频的51分钟。

![](http://www.zhuanyongxigua.cn/2020-07-01-140353.jpg)

老师跟推崇generator和iterator的组合。

> 加法表达式有几种开头？

三种。

![](http://www.zhuanyongxigua.cn/2020-07-01-142924.jpg)

![](http://www.zhuanyongxigua.cn/2020-07-01-142959.jpg)

![](http://www.zhuanyongxigua.cn/2020-07-01-144054.jpg)


# 重学前端week12第二节编程与算法训练｜字符串算法

上来先讲了一个同学的作业，是做产生式匹配的。

### 字符串分析算法

由简单到复杂：

* 字典表

  大量字符串的完整模式匹配，复杂度O(n)。

* KMP

  长字符串中找子串，可以做到O(m + n)，差不多就是字符串过一遍就一定能找出来。

* WildCard通配符算法

  长字符串中找子串升级版，也可以做到O(m + n)。

* 正则

  字符串通用模式匹配

* 状态机

  通用的字符串分析

* LL LR

  字符串多层级结构分析

#### 字典表

是一个多叉树。

![](http://www.zhuanyongxigua.cn/2020-06-27-151117.jpg)

这样存的好处：

* 首先可以比较字符串的顺序（在视频的21:30），最小的就是先找首位最小的，然后在去子分支里面找最小的，这样一路找下去，最大的也是一样。
* 重复的字符串如果很多，这个就很省空间。但是需要补上一个数量的字段；

```js
// 用数组存不方便，因为可能有特殊字符，数组长度不好确定，空间也会比较大
// 比较好的使用map
// 这里用了对象
class Trie {
  constructor() {
    this.root = Object.create(null);
  }
  // 在insert里面处理max什么的虽然看起来方便
  // 但是不好扩展，比如突然需要变了
  // 需要前50个最大的，怎么搞？
  // 耦合了
  insert(word) {
    let node = this.root;
    for(let c of word) {
      if(! node[c]) {
        node[c] = Object.create(null);
      }
      node = node[c];
    }
    if (!('$' in node)) {
      node['$'] = 0;
    }
    node['$']++;
  }
  most() {
    let max = 0;
    let maxWord = null;
    let visit = (node, word) => {
      if (node.$ && node.$ > max) {
        max = node.$;
        maxWord = word;
      }
      for(let p in node) {
        visit(node[p], word + p);
      }
    }
    visit(this.root, '');
    console.log(maxWord)
  }
}

function randomWord(length) {
  var s = "";
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0));
  }
  return s;
}

for (let i = 0; i < 100000; i++) {
  trie.insert(randomWord(4))
}
let trie = new Trie()
```

然后又说了好久的可哈希。不可哈希的是guid。这个东西存字典表里面没有价值。

#### 几个匹配的结构

"x[a(b)c]y"这个就是对的结构，“(a[b)c]”这个结构就是不对的。用栈来做。可以用createAST哪个同学的作业来搞。

```js
function parse(source) {
  let stack = [];
  for(let c of source) {
    if(c === "(" || c === "[" || c === "{") {
      stack.push(c);
    }
    if(c === ")") {
      if(stack[stack.length - 1] === "(") {
        stack.pop()
      } else {
        return false;
      }
    }
    if(c === "]") {
      if(stack[stack.length - 1] === "[") {
        stack.pop();
      } else {
        return false;
      }
    }
    if(c === "}") {
      if(stack[stack.length - 1] === "{") {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  if(stack.length === 0) {
    return true;
  } else {
    return false;
  }
}
```

### KMP

简单，但是复杂度高的方法：

```js
function find(source, pattern) {
  for (let i = 0; i < source.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (source[i + j] !== pattern[j]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      return true;
    }
  }
  return false;
}
```

复杂度低但是不对的方法：

```js
function find(source, pattern) {
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === pattern[j]) {
      j++;
    } else {
      j = 0;
    }
    if (j === pattern.length) {
      return true;
    }
  }
  return false;
}
```

这个不能正确匹配`find('abcxxy', 'xy')`。

改进一下：

```js
function find(source, pattern) {
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === pattern[j]) {
      j++;
    } else {
      j = 0;
      if(source[i] === pattern[j]) {
        j++;
      }
    }
    if (j === pattern.length) {
      return true;
    }
  }
  return false;
}
```

可以正确匹配`find('abcxxy', 'xy')`，这个不能正确匹配`find('abcabcabe', 'abcabe')`。

再改进一下：

```js
function find(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  let k = 0;
  for (let j = 0; j < pattern.length; j++) {
    if (pattern[j] === pattern[k]) {
      k++;
    } else {
      k = 0;
    }
    table[j] = k;
  }
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    console.log(source[i], pattern[j]);
    if (source[i] === pattern[j]) {
      j++;
    } else {
      // 这个while可以先不用管直接j = table[j - 1]
      // 比如find('abcababcabx', 'abcabx') 最后的abx会对应undefined
      // 就是上面console.log的地方
      while (source[i] !== pattern[j] && j > 0) {
        j = table[j - 1];
      }
      if (source[i] === pattern[j]) {
        j++;
      } else {
        j = 0;
      }
    }
    if (j === pattern.length) {
      return true;
    }
  }
  return false;
}
```

### wildcard

```js
// abbbbbbbbb a*b
// abcbxcbbbbbbb a*c*x*
```

最后一个*贪婪？把最后一个扣掉之前，其他的`\*`都是尽量少的匹配。就是其实匹配的是星号后面的东西。

用KMP处理问号很难。

```js
// abca?x 这里问号跟source有关，如果是b就不一样了，不是b，是c或a都不一样

function find(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  let k = 0;
  // 就是要想办法把这里这个东西挪到下面**标记的地方
  // 在这个地方同时考虑如何把j回去
  // 需要一个stack
  for (let j = 0; j < pattern.length; j++) {
    if (pattern[j] === pattern[k]) {
      k++;
    } else {
      k = 0;
    }
    table[j] = k;
  }
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    console.log(source[i], pattern[j]);
    if (source[i] === pattern[j]) {
      j++;
    } else {
      // **
      while (source[i] !== pattern[j] && j > 0) {
        j = table[j - 1];
      }
      if (source[i] === pattern[j]) {
        j++;
      } else {
        j = 0;
      }
    }
    if (j === pattern.length) {
      return true;
    }
  }
  return false;
}
```

看到了02:26:41