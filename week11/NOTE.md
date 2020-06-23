# 重学前端week11第一节编程与算法训练｜异步编程与寻路问题

![](http://www.zhuanyongxigua.cn/2020-06-20-040218.png)

> 如何用一个generator实现一个async？

```js
function sleep(t) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, t);
    })
}

function* go() {
    while(true) {
        green()
        yield sleep(1000)
        yellow()
        yield sleep(200)
        red()
        yield sleep(500)
    }
}

function run(iterator) {
    let { value, done } = iterator.next()
    if(done) {
        return
    }
    if(value instanceof Promise) {
        value.then(() => {
            run(iterator)
        })
    }
}

function co(generator) {
    return function() {
        return run(generator())
    }
}

go = co(go)
go()
```

> 如何实现一个无限的按时报数的程序？

```js
async function g() {
  let i = 0
  while(true) {
    await sleep(1000)
    yield i++
  }
}
for await(let v of g()) {
  console.log(v)
}
```

也可以自己写一个函数里面setTimeout，然后自调用。

![](http://www.zhuanyongxigua.cn/2020-06-19-143208.png)

> 如何快速得到一个填满10000个0的数组？

```js
// 以前的js
var map = new Array(10001).join(0).split('').map(s => Number(s))
// 现在的js
var map = new Array(10000).fill(0)
```

## 参考代码：

```
.cell {
    display:inline-block;
    width:6px;
    height:6px;
    background-color: gray;
    border-bottom:solid 1px white;
    border-right:solid 1px white;
    vertical-align: middle;
}
#container{
    width:701px;
}
```

- 链接：[ https://pan.baidu.com/s/1tHVyJGIPZkqfBLcUgjKRMA](https://pan.baidu.com/s/1tHVyJGIPZkqfBLcUgjKRMA)
  提取码：mqz3

## 课后作业：

完成路径编辑器（下节课使用）


# 重学前端week11第二节编程与算法训练｜寻路问题（搜索），正则表达式

加上`<!DOCTYPE html>`之后布局就不对了，需要加上行高或者用flex布局。

广度和深度优先的区别在于数据结构，上课用的那个东西，深度优先每次弹出来的都是下一级的最后一个，广度优先用shift每次弹出来的都是同一级的，同一级的所有都弹完了才会进行下一级的。

广度优先可以找到最优路径，深度不行。

另外所有用递归写不出来的东西，都可以用深度优先的方式去写，深度优先用的是栈。

启发函数跟启发函数算出来的值必定小于真实的到终点的距离，那么就一定能找到最佳路径。带启发函数的搜索叫A搜索。有一个手写的策略，先找的点和后找的点，A搜索不保证能找到最佳路径，数学家证明如果能找到启发函数永远返回的值是小于最优路径的，那一定能找到最优路径。

> 启发函数是啥？

```js
function distance([x, y]) {
  return (x - end[0]) ** 2 + (y - end[1]) ** 2;
}
let collection = new Sorted([start], (a, b) => distance(a) - distance(b));
```

> 无序数组？

课程里面讲的比较好的应该用二分堆，但是由于有点复杂，用了无序数组。

```js
class Sorted {
    constructor(data, compare) {
        this.data = data;
        this.compare = compare;
    }
    take() {
        if(!this.data.length) {
            return;
        }
        let min = this.data[0];
        let minIndex = 0;
        for (let i = 1; i < this.data.length; i++) {
            if (this.compare(this.data[i], min) < 0) {
                min = this.data[i];
                minIndex = i;
            }
        }
        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop()
        return min;
    }
    insert(v) {
        this.data.push(v)
    }
    get length() {
        return this.data.length
    }
}
```



还提了一个API设计一致性的问题，最好语法类似一致。

> 可视化调试？

还提了可视化的事情，就是有些函数调试困难，用可视化的方式也是可以的，比如这节课里面的例子，找到函数运算的过程，用断点调试的话很困难的，也不直观，所以完成一个，就在html里面把一个格子画上颜色，这样就可以通过观察颜色的变化知道运算的过程了。

> 二分堆？如何实现比较好？用对象可以吗？

二分堆, 一个父节点有两个子节点，父节点比子节点大
如果一个父节点被拿掉了，就形成了一个空洞，那就在这个节点的子节点里面找一个大的，移动过来
由于是移动的，所那个子节点也要用同样的方法从它的子节点中移动数据过来
由于创建过多的对象性能并不好，占内存，所以用一个数组来实现二分堆

```js
class BinaryHeap {
    constructor(data, compare) {
        this.data = data;
        this.compare = compare;
    }
    take() {
        if(!this.data.length) {
            return;
        }
        let min = this.data[0];
        let i = 0;
        // fix heap
        while (i < this.data.length) {
            if(i * 2 + 1 >= this.data.length) {
                break;
            }
            if (i * 2 + 2 >= this.data.length) {
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1
                break;
            }
            if (this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0) {
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1;
            } else {
                this.data[i] = this.data[i * 2 + 2];
                i = i * 2 + 2;
            }
        }
        if (i < this.data.length - 1) {
            this.insertAt(i, this.data.pop());
        } else {
            this.data.pop();
        }
        return min;
    }
    insertAt(i, v) {
        this.data[i] = v;
        while (i > 0 && this.compare(v, this.data[Math.floor((i - 1) / 2)]) < 0) {
            this.data[i] = this.data[Math.floor((i - 1) / 2)];
            this.data[Math.floor((i - 2) / 2)] = v;
            i = Math.floor((i - 1) / 2)
        }
    }
    insert(v) {
        this.insertAt(this.data.length, v)
    }
    get length() {
        return this.data.length
    }
}
```

### 正则

> String.prototype.match?

不推荐使用`/g`，这样就可以拆分里面的东西：

```js 
"abc".match(/a(b)c/) // ["abc", 'b']
"abc".match(/a(b)c/g) // ["abc"]
```

如果是这样的结构`[a=value]`，用match可以很方便的把key和value都match出来。

然后说了一下`?:`的零宽断言。

> String.prototype.replace的技巧？容易出问题的地方？

然后讲了raplace。

```js
"abc".replace(/a(b)c/, function(str, $1) {
  return $1 + $1 // "bb"
})
"abc".replace(/a(b)c/, "$1$1") // "bb"
"abc".replace(/a(b)c/, "$$1$$1") // "$1$1"
```

这是比较容易出错的地方。比如后端在数据里面多加了一个`$`，那在上面代码的时候就很容易出问题了。所以遇到有格式的字符串的时候要非常的注意。

基本上回来括号方括号什么的，再加上`?:`就可以做很多事情了。

> Exec function in JS? 推荐用法？

终点强调了这个方法，很重要。其他的都是方便操作的。exec决定了可以用正则做大段的文本的分析。比如做词法分析，就靠这个。它的主要优点就是可以循环的依次的匹配。

推荐的实践：

```js
let lastIndex = 0;
let token;

do {
  token = inputElement.exec(source);
  console.log(token);
} while (inputElement.lastIndex - lastIndex == token.length)
```

词法分析的例子：

```html
<style>
  .keywords {
    color: blue;
  }
  .punctuator {
    color: blueviolet;
  }
  .identifier {
    color: skyblue;
  }
</style>
<pre id="container"></pre>
<script>
var source = `
  function sleep(t) {
    return new Promise(function(resolve) {
      setTimeout(resolve, t);
    });
  }
`

var regexp = /(function|new|return)|([ \t\n\r]+)|([a-zA-Z][a-zA-Z0-9]*)|([\(\)\{\}\,\;])/g
var dictionary = ["keywords", "whitespace", "indentifier", "punctuator"];
var token = null;
var lastIndex = 0;
var container = document.getElementById('container')
do {
  lastIndex = regexp.lastIndex;
  token = regexp.exec(source);
  if(!token) break;
  let text = document.createElement('span');
  text.textContent = token[0];
  for(var i = 1; i < 5; i++) {
    if(token[i]) {
      text.classList.add(dictionary[i - 1]);
    }
  }
  container.appendChild(text);
} while(token);
</script>
```

> 如何刷leetcode？

打开首页，右边的标签，一段时间内刷一种标签的题。比如二分查找什么的。

>如何参与开源项目？

现在就可以开始去给vue该文档，加test case，或者看看issue，改改bug。