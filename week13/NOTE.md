# 重学前端week13第一节编程与算法训练｜Proxy与双向绑定

> 在实际项目中使用Proxy怎么样？举个例子？

Proxy并不是设计来做业务的，适合做库或者框架。因为过于强大，使用的不好会让代码变得不可控。使用之后可能设置属性和获取原型都会出问题。几乎会改变所有的对象的行为。

比如类似hook的东西：

```js
let object = {
  a: 1,
  b: 2
}
let proxy = new Proxy(object, {
  get(obj, prop) {
    return obj(prop);
  },
  defineProperty() {
    console.log('arguments', arguments);
  }
})
Object.defineProperty(proxy, 'a', {value: 10}) // 这里会打log，就是上面定义的那个，然后因为上面那个defineProperty没有return正确的值，所以会报错
```

> 下面proxy应用有什么问题？

```js
let handlers = [];
let object = {
  a: 1,
  b: 2
}
function reactive(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      console.log(obj, prop);
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      for (const handler of handlers) {
        handler();
      }
      return obj[prop];
    }
  })
}
function effect(handler) {
  handler();
  handlers.push(handler);
}
let dummy;
let proxy = reactive(object);
effect(() => dummy = proxy.a);
console.log(dummy);
proxy.a = 2;
console.log(dummy);
```

这个每次都执行全部的handler。几百个obj和几百个handler，性能就不好了。

改进一波：

```js
let handlers = new Map;
let usedReactivities = [];
let object = {
  a: 1,
  b: 2
}
function reactive(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      console.log(handlers);
      if (handlers.get(obj)) {
        if (handlers.get(obj).get(prop)) {
          for (const handler of handlers.get(obj).get(prop)) {
            handler();
          }
        }
      }
      return obj[prop];
    }
  })
}
function effect(handler) {
  usedReactivities = [];
  handler();
  console.log(usedReactivities);
  for (const usedReactivity of usedReactivities) {
    let [obj, prop] = usedReactivity;
    console.log([obj, prop]);
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map);
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, []);
    }
    handlers.get(obj).get(prop).push(handler);
  }
}
let dummy;
let proxy = reactive(object);
effect(() => dummy = proxy.a);
console.log(dummy);
proxy.a = 2;
console.log(dummy);
```

> 什么是静态依赖收集？如何失效？还如何继续改进？

```js
let handlers = new Map;
let usedReactivities = [];
let object = {
  a: 1,
  b: 2
}

function reactive(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      // console.log(handlers);
      if (handlers.get(obj)) {
        if (handlers.get(obj).get(prop)) {
          for (const handler of handlers.get(obj).get(prop)) {
            handler();
          }
        }
      }
      return obj[prop];
    }
  })
}
function effect(handler) {
  usedReactivities = [];
  handler();
  // console.log(usedReactivities);
  for (const usedReactivity of usedReactivities) {
    let [obj, prop] = usedReactivity;
    // console.log([obj, prop]);
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map);
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, []);
    }
    handlers.get(obj).get(prop).push(handler);
  }
}

let v12, v1, v2;
let p1 = reactive({a: 1});
let p2 = reactive({a: 2});
effect(() => v12 = p1.a + p2.a);
effect(() => v1 = p1.a);
effect(() => v2 = p2.a);
p1.a = 3;
console.log(v12, v1, v2);

// 这样搞可以骗过依赖收集
let v;
let p1 = reactive({a: 1});
let p2 = reactive({a: 2});
let b = false;
effect(() => v = b ? 2 : p1.a);
console.log(v);
b = true;
p1.a = 10;
console.log(v);

// 把上面的object换成这个
let object = {
  a: {x: 3},
  b: 2
}
let v;
let p = reactive({a: 1});
effect(() => v = p.a.x);
console.log(v);
p.a.x = 10;
console.log(v);
```

> 另外obj里面如果嵌套了对象，也不会正常工作。有啥问题？

```js
let handlers = new Map;
let usedReactivities = [];
let object = {
  a: {x: 3},
  b: 2
}

function reactive(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      // 这里每次都返回了一个新的对象，所以下面也不能收集以来
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      // console.log(handlers);
      if (handlers.get(obj)) {
        if (handlers.get(obj).get(prop)) {
          for (const handler of handlers.get(obj).get(prop)) {
            handler();
          }
        }
      }
      return obj[prop];
    }
  })
}
function effect(handler) {
  usedReactivities = [];
  handler();
  // console.log(usedReactivities);
  for (const usedReactivity of usedReactivities) {
    let [obj, prop] = usedReactivity;
    // console.log([obj, prop]);
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map);
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, []);
    }
    handlers.get(obj).get(prop).push(handler);
  }
}

let v;
let p = reactive({a: 1});
effect(() => v = p.a.x);
console.log(v);
p.a.x = 10;
console.log(v);
```

改进：

```js
let handlers = new Map();
let reactivities = new Map();
let usedReactivities = [];
let object = {
  a: {x: 3},
  b: 2
}

function reactive(obj) {
  if (reactivities.has(obj)) {
    return reactivities.get(obj);
  }
  let proxy = new Proxy(obj, {
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      // console.log(handlers);
      if (handlers.get(obj)) {
        if (handlers.get(obj).get(prop)) {
          for (const handler of handlers.get(obj).get(prop)) {
            handler();
          }
        }
      }
      return obj[prop];
    }
  })
  reactivities.set(obj, proxy);
  return proxy
}
function effect(handler) {
  usedReactivities = [];
  handler();
  // console.log(usedReactivities);
  for (const usedReactivity of usedReactivities) {
    let [obj, prop] = usedReactivity;
    // console.log([obj, prop]);
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map);
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, []);
    }
    handlers.get(obj).get(prop).push(handler);
  }
}

let v;
let p = reactive({a: 1});
effect(() => v = p.a.x);
console.log(v);
p.a.x = 10;
console.log(v);
```


```js
let dragable = document.getElementById('dragable');
dragable.addEventListener('mousedown', function(event) {

})
dragable.addEventListener('mousemove', function(event) {

})
dragable.addEventListener('mouseup', function(event) {

})
```

上面使用有问题，应该把后面两个嵌套在第一个里面。

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
<div id="container">
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
文字 文字 文字 文字 文字 文字 文字 文字 文字
</div>
<div id="dragable" style="width: 100px;height: 100px;background-color: pink;"></div>
<script>
let dragable = document.getElementById('dragable');
let baseX = 0, baseY = 0;
dragable.addEventListener('mousedown', function(event) {
  let startX = event.clientX, startY = event.clientY;
  let move = event => {
    let range = nearest(event.clientX, event.clientY);
    range.insertNode(dragable);
    console.log(range);
    // console.log(baseX, baseY);
    // let x = baseX + event.clientX - startX, y = baseY + event.clientY - startY;
    // dragable.style.transform = `translate(${x}px, ${y}px)`;
  }
  let up = event => {
    baseX = baseX + event.clientX - startX, baseY = baseY + event.clientY - startY;
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  }
  dragable.addEventListener('mousemove', move);
  dragable.addEventListener('mouseup', up);
})
let ranges = [];
let container = document.getElementById('container');
for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
  let range = document.createRange();
  range.setStart(container.childNodes[0], i);
  range.setEnd(container.childNodes[0], i);
  ranges.push(range);
}
function nearest(x0, y0) {
  let nearestRange = null;
  let distance = Infinity;
  for (const range of ranges) {
    let {x, y} = range.getBoundingClientRect();
    let d = (x0 - x) ** 2 + (y0 - y) ** 2;
    if (d < distance) {
      nearestRange = range;
      distance = d;
    }
  }
  return nearestRange;
}
document.addEventListener('selectstart', event => event.preventDefault());
</script>
</body>
</html>
```

# 重学前端week13第三节组件化｜组件的基本知识，轮播组件

前端的架构问题80%是在解决组件化的问题。

> 对象有哪些元素？

* Properties；
* Methods；
* Inherit；

> 组件有哪些元素？

* Properties；
* Methods；
* Inherit；
* Attribute；
* Config & State；
* Event；
* Lifecycle；
* Children；

![](http://www.zhuanyongxigua.cn/2020-07-08-102726.png)

组件的state只受用户输入的影响。

右边四个都是组件的设计者和使用者交互的方式。

> What is the different between "attribute" and "property"?

Attribute强调描述性；Property强调从属关系。

比如，红色的头发，大眼睛，就是attribute。

小明的头发，就是property。

> HTML中如何修改attribute？Property？

在HTML中：

```html
<!-- Attribute -->
<my-component attribute="v"></my-component>
<script>
  myComponent.getAttribute("a");
  myComponent.setAttribute("a", "value");
  // Property
  myComponent.a = "value";
</script>
```

property没法在html里面设置和更改。在做标记语言里面能改的一定是attribute。

> Attribute与property是重叠的吗？

有一些特例，attribute和property在html和js中是不重叠的，大部分是重叠的，比如id。

不重叠的，第一种名字不一样，但是是一个东西：

```html
<div class="cls1 cls2"></div>
<script>
  var div = document.getElementByTagName("div");
  div.className // cls1 cls2
</script>
```

此外还有classList。是className的原因是class在js里面是一个关键字（以前是保留字），js以前不允许关键字做属性名。

然后是style，语义上一样，但是调用方式不一样（没明白）：

```html
<div class="cls1 cls2" style="color:blue;"></div>
<script>
  var div = document.getElementByTagName('div');
  div.style // 对象
</script>
```

然后是href：

```html
<a href="//m.taobao.com"></a>
<script>
  var a = document.getElementByTagName("a");
  a.href // "http://m.taobao.com", 这个URL是resolve过的结果
  a.getAttribute("href") // "//m.taobao.com", 跟HTML代码中完全一致
</script>
```

然后是value，乍一看等效，实际上是单向的同步。

```html
<input value="cute"/>
<script>
var input = document.getElementByTagName('input'); // 若property没有设置，则结果是attribute
input.value // cute
input.getAttribute('value'); //cute
input.value = 'hello'; // 若value属性已经设置，则attribute不变，property变化，元素上实际的效果是property优先
input.value // hello
input.getAttribute('value'); //cute
</script>
```

所以在这里attribute就像等于是property的默认值。vue的attribute与property也是分开的，会有坑。react两者是完全等效的。react实际上是不提倡在new的时候用constructor这个method的，constructor里面的那个prop就相当于组件的那个config。

vue的情况比如：

```html
<templat>
  <MyComponent ref="abc" class="2">
    <div></div>
  </MyComponent>
</templat>
<script>
	export default {
    mounted() {
      // 这个跟上面那个class一致吗？
      this.$refs['abc'].class = 1;
    }
  }
</script>
```

> 如何设计组件状态？

![](http://www.zhuanyongxigua.cn/2020-07-08-151200.png)

第一个应该就是标记语言。config是类似于env中的那个config，一般是一个全局的，单次使用的。

具体到代码，类似于：

```js
class MyComponent {
  constructor(config) {
    this.state = {
      i: 1
    }
  }
  get prop1() {
    
  }
  set prop1() {
    
  }
  setAttribute(attr) {
    
  }
  getAttribute(attr, value) {
    
  }
}

<MyComponent attr1="33"/>
// 下面那个class就是config
let myComponent = new MyComponent({class: 3333})
```

设计的时候property和attribute可以一致也可以不一致。设计成分开的就是类似于html了，用setAttribute去改attribute。

### Lifecycle

> 组件大概应该有哪些生命周期？

![](http://www.zhuanyongxigua.cn/2020-07-08-153049.png)

react的class写法的话，constructor就相当于上面的created。

> 组件有哪几种children？

### Children

Content型Children与Template型Children。

```html
<my-botton>
  <img src="{{icon}}" />{{title}}
</my-botton>
<!-- template型children里面会有一个data属性，li就相当于是一个模版，然后就循环了 -->
<my-list data="">
  <li>
    <img src="{{icon}}" />{{title}}
  </li>
</my-list>
```

所以设计children的时候，要注意原始的模版里面的children和真实的展现的children的区别。

> 如何设计一个轮播组件？

Carousel组件：

```js
// state
// activeIndex

// property
// loop time imgList autoplay color forward

// attribute
// startIndex，这个属性一般只用一次，所以不需要设计在property里面
// loop time imgList autoplay color forward


// children
// 如果上面有imgList，这里就不需要children，反之亦然，如果有children，那这个组件的名字应该设计成CarouseView

// event
// change click hover swipe resize dbclick

// method
// next() prev() goto() 
// play() stop() 这两个跟上面那个autoplay也是二选一的，有autoplay就不需要这两个api了。

// config
// useRAF useTime  前者就是使用requestAnimationFrame来跑动画，后者就是用setTimeout
```
