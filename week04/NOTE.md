# 重学前端week04第一节结构化

> What does event loop belong to?

Event loop is the content of browser or nodejs. It is not JavaScript's content.

> The relasionship between micro and macro task?

Micro task is not about sync or async(but promise.then is a async micro task). A Macro task can contain multiple micro tasks. A micro task may contain several statements. Micro task in the standard of JavaScript, but macro task is not. Pure JS engine is sync JS interpreter, a macro task is a JS fragment, macro task queue is in browser or nodejs, a macro is sent a JS fragment to the runtime. Then the runtime run the code fragment with JS engine every once in a while.

```js
new Promise(resolve => resolve()).then(() => console.log("1"))
setTimeout(function() {
  console.log("2")
})
console.log("1")
```

Result:

```js
3
1
undefined // Here is the boundray of macro and micro task
2
```

If the code is like this:

```js
new Promise(resolve => resolve()).then(() => console.log("1"))
setTimeout(function() {
  console.log("2")
})
console.log("1"), function() {return this.a}
```

Result:

```js
3
1
f (){return this.a}
2
```

> A case for sync and async?

```js
new Promise(resolve => {console.log("0"), resolve()}).then(() => console.log("1"))
setTimeout(function() {
  console.log("2")
})
console.log("1\3")
console.log("4")
```

034 is the sync code, 1 is the async code of the first macro task.

Another case:

```js
async function afoo() {
  console.log("-2")
  await new Promise(resolve => resolve())
  console.log("-1")
  await new Promise(resolve => resolve())
  console.log("-0.5")
}
new Promise(resolve => console.log("0"), resolve())
	.then(() => {
  console.log("1")
  new Promise(resolve => resolve())
  	.then(() => console.log("1.5"))
})
setTimeout(function() {
  console.log("2")
  new Promise(resolve => resolve()).then(console.log("3"))
})
console.log("4")
console.log("5")
afoo()
```

The standard of task is at section 8.6 of ECMA-262. You don't need to read all the standard, but some section is necessary.

Another case:

```js
new Promise(res => res())
	.then(
  	() => setTimeout(() => console.log(1), 10000),
  console.log(0)
)
console.log(2)
```

Another case:

```js
async function async1() {
  console.log("async 1 start")
  await async2()
  console.log("async 1 end")
}
async function async2() {
  console.log("async2")
}
async1()
new Promise(function(resolve) {
  console.log("promise1")
  resolve()
}).then(function() {
  console.log("promise2")
})
```

The result of code above is different in chrome and safari. In safari the "async 1 end" is the last.