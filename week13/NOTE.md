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
