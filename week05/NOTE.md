# 重学前端week05第二节结构化

> JS的执行粒度有哪些？

### JS执行粒度

* JS Context => Realm

* 宏任务
* 微任务（Promise）
* 函数调用（Execution Context）
* 语句/声明
* 表达式
* 直接量/变量/this。。。

第二个/第三个属于结构化。

看到了16:49，JS里面所有的对象。

先做了一个广度优先搜索。32分钟的时候完成了访问所有对象的函数。课上的那个代码需要能写出来，额外还有一个可视化的作业。在54分钟。可视化展示realm与其他的连接的关系。用antv的g6。

> What is the meaning of realm?

王国/位面什么的，在JS里面就是内置对象的总和。

> How to get all JS realm properties?

```js
  var set = new Set()
  var objects = [
    "Array",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect"
  ]
  var queue = []
  for (var p of objects) {
    queue.push({
      path: [p],
      object: this[p]
    })
  }
  let current
  while(queue.length) {
    current = queue.shift()
    console.log(current.path.join('.'));
    if(set.has(current.object)) continue;
    set.add(current.object)
    for (let p of Object.getOwnPropertyNames(current.object)) {
      var property = Object.getOwnPropertyDescriptor(current.object, p)
      if (
        property.hasOwnProperty('value')
        // Only get object value, not has function value
        && ((property.value !== null) && (typeof property.value == 'object') || (typeof property.value == 'object'))
        // And it must be a instance of Object
        && (property.value instanceof Object)
      ) {
        queue.push({
          path: current.path.concat([p]),
          object: property.value
        })
        if (property.value === undefined) {
          console.log(property);
        }
      }
      if (property.hasOwnProperty('get') && (typeof property.get == 'function')) {
        queue.push({
          path: current.path.concat([p]),
          object: property.get
        })
        if (property.get === undefined) {
          console.log(property);
        }
      }
      if (property.hasOwnProperty('set') && (typeof property.set == 'function')) {
        queue.push({
          path: current.path.concat([p]),
          object: property.set
        })
        if (property.set === undefined) {
          console.log(property);
        }
      }
    }
  }
```

> How to get all functions and object of JS?

```js
var set = new Set();
var objects = [
    eval,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    Array,
    Date,
    RegExp,
    Promise,
    Proxy,
    Map,
    WeakMap,
    Set,
    WeakSet,
    Function,
    Boolean,
    String,
    Number,
    Symbol,
    Object,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Atomics,
    JSON,
    Math,
    Reflect];
objects.forEach(o => set.add(o));

for(var i = 0; i < objects.length; i++) {
    var o = objects[i]
    for(var p of Object.getOwnPropertyNames(o)) {
        var d = Object.getOwnPropertyDescriptor(o, p)
        if( (d.value !== null && typeof d.value === "object") || (typeof d.value === "function"))
            if(!set.has(d.value))
                set.add(d.value), objects.push(d.value);
        if( d.get )
            if(!set.has(d.get))
                set.add(d.get), objects.push(d.get);
        if( d.set )
            if(!set.has(d.set))
                set.add(d.set), objects.push(d.set);
    }
}
```

### Execution Context

Then talk about the stack. The concept "running execution context stack" is in the ECMA-262. There is no relationship between scope and stack.

![](http://www.zhuanyongxigua.cn/2020-05-31-024450.png)

> What are the elements of ECMAScript code execution context?

#### ECMAScript Code Execution Context

* code evaluation state
* Function
* Script or Module
* Realm
* LexicalEnvironment
* VariableEnvironment

> What are the element of generator execution contexts?

#### Generator Execution Contexts

* code evaluation state
* Function
* Script or Module
* Realm
* LexicalEnvironment
* VariableEnvironment
* Generator

> What are the elements of lexical environment?

**LexicalEnvironment**

* this
* new.target
* super
* 变量

In ECMA2019, "this" is in lexical environment, others are not.

> What is the role of variable environment?

**VariableEnvironment**

这个更像是一个历史遗留的包袱，仅仅用于处理var声明。

```js
{// 这里的第一个字符的地方是lexical environment声明的地方，原因是新的版本有了let，有了块级作用域
  let y = 2;
  // 这里声明的时候就需要知道这个x被声明到了哪一层
  eval('var x = 1;');
}

with({a: 1}) {
  // 这里声明到了with外面
  eval('var x;');
}
console.log(x);
```

> What is the structure of variable environment and lexical environment?

![](http://www.zhuanyongxigua.cn/2020-05-31-030525.png)

Every block is a environment record.

> The principle of closure with environment records?

![](http://www.zhuanyongxigua.cn/2020-05-31-031122.png)

![](http://www.zhuanyongxigua.cn/2020-05-31-031350.png)

箭头函数可能是把this加到environment record里面的原因。原来的this是调用的时候决定的，箭头的函数的this是定义的时候决定的，所以需要加到这个里面去。

![](http://www.zhuanyongxigua.cn/2020-05-31-031422.png)

**Realm**

In JS, function expression and object literal will create a object. The implicit conversion(隐式转换) with `.` also would create a object. These objects have prototype, if we don't have realm, we cannot know their prototype.

```js
1 .toString() // Here would implicit conversion
```


# 重学前端week05第二（三）节浏览器工作原理｜HTTP协议+语法与词法分析

![](http://www.zhuanyongxigua.cn/2020-06-04-151102.png)

Bitmap is a image that be show in the browser. Actually we see in the browser are images.

![](http://www.zhuanyongxigua.cn/2020-06-04-151529.png)

没有人真的会设计上三层的分开的协议，一般都是统一的。理论上TLS/SSl层在传输层。

![](http://www.zhuanyongxigua.cn/2020-06-06-041357.png)

tcp是流，ip是包，所以抓包的时候要注意。ip的一般是用后面阿哥libpcap。用 wireshark抓包的时候，会抓到很多不属于自己的包，路由会转发。wireshark比较强大，但是很难用。xcharls好用，但是与属于http层的。 端口是用来分配包的，要不计算机也不知道这个包应该发给谁，所以才会有一个服务一个端口这种事情。

http一定是一问一答，而且是先问后答。HTTP只有两个部分，一个是Request，另一个是Response，所以实现的话也是按照这个思路来。

### 下面是第三节的内容

用了node。先搞一个server。

```js
const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Foo', 'bar')
  res.writeHead(200, { 'Content-Type': 'text/plain'})
  res.end('ok')
})

server.listen(8088)
```

然后用了node的net去做一个http的client：

```js
const net = require('net')

const client = net.createConnection({
  host: "127.0.0.1",
  port: 8088
}, () => {
  console.log('connected to server!')
  client.write(`
POST / HTTP/1.1\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: 11\r
\r
name=winter
`)
})

client.on('data', (data) => {
  console.log(data.toString())
  client.end()
})
client.on('end', () => {
  
})
client.on('error', (err) => {
  
})
```

结论就是HTTP就是一段文本，是一个文本协议，上面这个代码就是仿造发一个HTTP。

Content-Type和Content-Length是必有的。

`application/x-www-form-urlencoded`是默认的表单提交的

`multipart/form-data`是表单里面带文件的。

HTTP是IETF做的标准化。tools.ietf.org/html/rfc2616。

精简版：

![](http://www.zhuanyongxigua.cn/2020-06-11-142933.png)

![](http://www.zhuanyongxigua.cn/2020-06-12-045835.jpg)

因为是流式处理，所以没法用正则。应该用状态机。



## 预习内容：

- [浏览器：一个浏览器是如何工作的？（阶段一）](https://time.geekbang.org/column/article/80240)
- [浏览器：一个浏览器是如何工作的？（阶段二）](https://time.geekbang.org/column/article/80260)

## 本节课你需要修改一下以下代码：

```
this.length *= 16;
this.length += parseInt(char, 16);
```

## 课后作业：

- 观看本节课，根据老师课上讲解，完成课堂上的代码

- 用[ G6 antv ](https://g6.antv.vision/en/)可视化 Realm 中的所有对象（选做）
- 观看“浏览器工作原理 | HTTP 协议 + 语法与词法分析（二）”，根据老师课上讲解，完成课堂上的代码
- 由于浏览器部分内容未讲完，剩下的作业待补充
- 本周学习总结