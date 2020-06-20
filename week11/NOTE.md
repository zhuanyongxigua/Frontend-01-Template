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