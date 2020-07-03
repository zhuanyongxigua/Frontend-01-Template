# 重学前端week03第一节表达式/类型转换

First, winter told about the float number that can't resolve last lesson.

> Write a function that can check +0 and -0?

A function that check `+0` or `-0`:

```js
function check(zero) {
  if (1 / zero === Infinity) {
    return 1;
  }
  if (1 / zero === -Infinity) {
    return -1;
  }
}
```

The better of the function above is "sign", sometime we may write this function like this:

```js
function sign(number) {
  return number / Math.abs(number)
}
```

This function is not safe. It can't handle zero and infinity.

You can also use `Uint8Array` and `Float64Array` to get the sign bit number.For binary number one number is a bit.

> How to get binary number of a 32 bit float number? 

![](http://www.zhuanyongxigua.cn/2020-05-01-102033.jpg)

The reason that exponent bits number minus 127 is the encode of exponent bits is partial coding. If the result of exponent bits greater than 127, it is positive, otherwise it is negative.

So the binary number of  0.1 is `0/01111111011/11001100110011001100110011001100110011001100110011010`. It is a infinite number. Now we can see the reason why `0.1 + 0.2 !== 0.3`. When we calculate fraction plus/minus, the precision may be lost.

https://jsfiddle.net/pLh8qeor/19/

> What is byte? What is bit?

A byte has eight bits. Bit is the most small unit in binary number.

> How computer calculate expression?

### Tree vs Priority

![](http://www.zhuanyongxigua.cn/2020-05-01-135141.png)

> Most priority in JavaScript?

They are member and new operator.

This content is at page 201 header 12.3 Left-Hand-Side Expressions.

The expression member, new and call is for the correct priority in `new` situation. They are also called as "left handside" expression. The "left handside" and "right handside" expression is normal knowledge in all computer language.

> What does expression contain in JS?

List as priority descending order:

* Member
* New
* Call
* Update
* Unary
* Exponental
* Multiplicative
* Additive
* Shift
* Relationship
* Equality
* Bitwise
* Logical
* Conditional
* Comma

> What is member expression? What does it contain?

#### Member(成员访问)

* `a.b`; This return a reference type. A reference contains object and key. Just delete and assign(not `Object.assign` method) can write to a reference. `a` must be a object, b must be symbol or string.

* `a[b]`

* ``foo`string` ``, Foo must be a object.

  ```js
  let name = 'winter'
  function foo() {
    console.log(arguments)
  }
  foo`Hello ${name}`
  ```

  This can use to define some custom grammar.

* `super.b`; This can only use in constructor function.

* `super[b]`

* `new.target` This only can use in function.

  ```js
  function foo() {
    console.log(new.target)
  }
  foo() // undefined
  new foo() // f foo() { console.log(new.target) }
  ```

  If your class is code by normal function and there is no `new.target`, you never know if user call this function by new keyword.

* `new Foo()`; The priority of `new Foo()` is higher than `new Foo`. When you use `new new Foo("good")` you can feel it. The argument "good" is transfered to Foo function, not the return value of  `new Foo`.

> What is new expression?

#### New

`new Foo`, for example `new a()()` and `new new a()`.

```js
function cls1() {
  
}
function cls2() {
  return cls1
}
new cls2() // Return value is cls1 function
new (cls2()) // Return value is a object
new new cls2("good") // The argument "good" is transfer to cls2 function
```

> What is call expression?

### Call

* `foo()`

* `super()`

* `foo()['b']`; This is call expression and member expression, the priority is down. It use in situation  `new Foo()['b']` . Now you know the priority is first `new Foo()` and then `(new Foo())['b']`.

* `foo().b`

* ```js
  foo()`abc` // Call foo function return a another function
  ```

> What is update expression?

### Update

Variable a must be a number.

* `a ++`
* `a --`
* `-- a`
* `++ a`

For example, `++ a ++` and `++ (a ++)`, Ther are invalid sytax.

In ECMA-262 page 178 bottom, in the note section there is a "[no LineTerminator here]", this can make a example like this:

```js
var a = 1, b = 1, c = 1;
a
++
b
++
c

a/*
*/++
b/*
*/++
c
```

The update variable is b and c. The comment in JS also like a "LineTerminator".

> What is unary expression?

### Unary(单目运算符)

* `delete a.b`, Variable b must be a reference.
* `void foo()`; Void operator return undefined whatever what it is behind it. So it is better than `undefined`, because `undefined` in JS is a variable, it may be covered by another value.
* `typeof a`
* `+ a` A must be a number.
* `- a`
* `~ a`A must be a integer.
* `! a`
* `await a`A must be a promise.

```js
for (var i = 0; i < 10; i++) {
  var button = document.createElement("button")
  document.body.appendChild(button)
  button.innerHTML = i
  // Now () is most popurlar way to IIFE, but void is better
  (function(i){
    button.onclick = function() {
      console.log(i)
    }
  })(i)
  // No matter what would be return from the function, it will be undefined. And the grammar is correct.
  // If you forget semicolon at last code line, it would be not incorrect. Especially "()".
  // In the situation you use package tool like webpack, "()" style also may cause error.
  void function(i) {
    button.onclick = function() {
      console.log(i)
    }
  }(i)
}
```

> What is exponental expression?

### Exponental

* `**`

This is the only one that right-associative operator. For example:

```js
3 ** 2 ** 3
3 ** (2 ** 3)
```

The results above is same.

> What is multiplicative expression?

### Multiplicative

* `*`
* `/`
* `%`

> What is additive expression?

### Additive

* `+`
* `-`

> What is shift expression?

### Shift

* `<<`
* `>>`
* `>>>`

> What is relationship expression?

### Relationship

* `<`
* `>`
* `<=`
* `>=`
* `instanceof`
* `in` The variable behind in operator must be a object.

> What is equality expression?

### Equality

You can give up the first and second, it is so hard to remember all the rules.

* `==`
* `!=`
* `===`
* `!==`

> What is bitwise expression?

### Bitwise

* `&`
* `^`
* `|`

Variable must be integer.

> What is logical expression?

### Logical

* `&&`
* `||`

In JS logical operator is short circuit logic.

```js
function foo1() {
  console.log(1)
  return false
}
function foo2() {
  console.log(2)
}
foo1() && foo2() // foo2 function would not be called.
```

So the logical operator in JS would return any type, not only boolean.

> What is conditional expression?

### Conditional

* `? :`

This is also a short circuit logic:

```js
function foo1() {
  console.log(1)
  return false
}
function foo2() {
  console.log(2)
}
true ? foo1() : foo2() // foo2 function would not be called.
```

> What is comma expressions? The priority of comma?

### Comma

It is like semicolon, but used in expression.

Comma always return the last of the commas.
```js
var x = (1, 2, 3) // return 3

function a(){}, function b(){} // return function b
```

The priority of comma is the last of all the expressions.

> Type convertin in JS?

![](http://www.zhuanyongxigua.cn/2020-05-02-080641.png)

> How to box in JS?

### Boxing and Unboxing

* ToPremitive
* toString vs valueOf

```js
// Number String Symbol Boolean
var a = new String("hello")
var b = "hello"
var c = String("hello")
typeof b	// string
typeof a // object
typeof c // string
!a // This would transform as object
!b // This would transform as string
```

Number, String and Boolean class also can use to force type conversion.

Another class Object also can use to boxing, the result would be same whatever you use new operator or not.

```js
typeof Object("1") // object, and the prototype is string.
typeof new Object("1") // object, and the prototype is string.
```

Class symbol can not be used with new operator. We can use it with object:

```js
Object(Symbol("1")) // the prototype is symbol
// Class symbol can be used as function
Symbol("1")
Object.getPrototypeOf(Object(Symbol("1"))) === Symbol.prototype // true
```

Another boxing way:

```js
(function() {return this}).apply(Symbol("x"))
```

> How to unbox in JS?

#### Unboxing

```js
1 + {} // "1[object Object]"
1 + {valueOf(){return 2}} // 3
1 + {toString(){return 2}} // 3
1 + {toString(){return "3"}} // "13"
1 + {valueOf(){return 1}, toString(){return "4"}} // 2
"1" + {valueOf(){return 1}, toString(){return "4"}} // "11"
1 + {[Symbol.toPrimitive](){return 6}, valueOf(){return 5}, toString(){return "1"}} // 7
```

`Symbol.toPrimitive` has the most priority, the second is valueOf.

```js
1 + {[Symbol.toPrimitive](){return {}}, valueOf(){return 5}, toString(){return "1"}} // error
1 + {valueOf(){ return {}}, toString(){ return "2"}} // "12"
```

So the priority conclusion above is not exact. If there is `Symbol.toPrimitive`, other method would not be called.If not, it would call valueOf method.

There is a `toJSON` method in Date class.

>  Write two functions that converse number to string and converse string to number.

* `0x1011`
* `0b1011`
* `0o1011`
* `10.3e10`

```js
function convertStringToNumber(string, x) {
  var chars = string.split('')
  var number = 0
  for (var i = 0; i< chars.length; i++) {
    // Here times operator is times the result of last loop
    number = number * x
    // We can't use JS Number method, so we can use codePointAt method to convert a string to number
    number += chars[i].codePointAt(0) - '0'.codePointAt(0)
  }
}
```

Full edition:

```js
function converStringToNumber(string, x) {
  if(arguments.length < 2) x = 10;
  var chars = string.split('')
  var number = 0
  var i = 0
  while(i < chars.length && chars[i] != '.') {
    number = number * x
    number += chars[i].codePointAt(0) - '0'.codePointAt(0)
    i++
  }
  var fraction = 1
  while(i < chars.length) {
    fraction = fraction / x
    number += (chars[i].codePointAt(0) - '0'.codePointAt(0))
    i++
  }
  return number
}

function convertNumberToString(number, x) {
  var integer = Math.floor(number)
  var fraction = number - integer
  var string = ''
  while(integer > 0) {
    string = String(integer % x) + string;
    integer = Math.floor(integer / x)
  }
  return string
}
```

> Js test cases?

Test262 in GitHub.


## 参考链接：

- 讲师提供：
  - https://jsfiddle.net/pLh8qeor/19/
- 学员提供：
  - 运算符优先级：[ https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

## 参考名词：

- LeftHandSideExpression：ECMA-262.pdf 201 页 12.3
- UpdateExpression：ECMA-262.pdf 178 页 11.9.1
- [IIFE ](https://zh.wikipedia.org/wiki/立即调用函数表达式)：Immediately-invoked Function Expressions 立即执行的函数表达式

## 预习课件：

- 链接：链接：[ https://pan.baidu.com/s/1kywQU1yqvdCGRK982zSFrA](https://pan.baidu.com/s/1kywQU1yqvdCGRK982zSFrA)
  提取码：8xfx

## 课后作业：

- 根据课上讲师已写好的部分，补充写完函数 convertStringToNumber
- 以及函数 convertNumberToString

# 重学前端week03第二节语句/对象

> What is the structure of JS statement?

## Statement

* Grammar
  * 简单语句
  * 组合语句
  * 声明
* Runtime
  * Completion Record. It is a kind of type in JS.
  * Lexical Enviorment

> What is completion resord?

### Completion Record

* [[type]]: normal, break, continue, return, or throw
* [[value]]: Types. They are JS data types and empty.
* [[target]]: label.

> What does simple statement contain?

### 简单语句

* ExpressionStatement: `a = 1 + 2;`
* EmptyStatement. It is just a semicolon.
* DebuggerStatement: `debugger;`
* ThrowStatement: `throw a;`
* ContinueStatement: `continue label1;`
* BreakStatement: `break label2;`
* ReturnStatement: `return 1 + 2;`

ExpressionStatement, EmptyStatement and DebuggerStatement are normal statement.

> What is compound statement contain?

### 复合语句

* BlockStatement
* IfStatement
* SwitchStatement
* IterationStatement
* WithStatement
* LabelledStatement
* TryStatement

> What is block statement?

#### BlockStatement

![](http://www.zhuanyongxigua.cn/2020-05-02-132645.png)

If a statement is start with brace, it must be a block, not object.

```js
{
  const a = 1
}
{
  const a = 2
}
```

The code above would not throw error, because the brace would give a block scope. Normallly the block statement's result is normal. If there is a abnormal type, the statement would be break.

```js
{
  const a = 1;
  throw 1; // break
  let b = 2;
  b = foo();
}
```

> What is iteration statement? What does it contain?

### Iteration

* while()
* do while
* for
* for in
* for of
* ~~for await(of)~~

![](http://www.zhuanyongxigua.cn/2020-05-03-032640.png)

The black area is for declare. The gray area is for expression. The white area is for statement.

> What is the behavior of the while loop?

#### while

If there is break or continue in while block, the while loop would **consume** this keyword. Break keyword would break the loop, continue keyword would interrupt current block. If there a label in the block, while loop would consume current situation as current target(label), so the target(label) is used for loop, break and continue. 

> What is the behavior of the for loop?

#### for

```js
for (let i = 0; i < 10; i++) {
  let i = 0;
  console.log(i)
}
```

The for loop would generate two scope, the first one is in the `()`, the second one the in the block scope. In the code above, the `console.log` can not get the i that is in the first scope. It is like this:

```js
{
  let i = 0;
  {
    let i = 1;
    console.log(i)
  }
}
```

If you use var keyword, whatever where the var is, they are same, even this:

```js
function run() {
  for (i = 0; i < 10; i++) {
    console.log(i)
  }
  return;
  var i
}
run()
```

But the var keyword can not out of the function.

> What is the behavior of forin loop?

#### forin

The "in" of forin is conflict with in keyword, so the ECMA-262 is very complex with this.

> What is the behavior of the forof loop?

#### forof

Forof first suit the generator and array. It is about iterator, if you use it for others, that maybe dangrous.

> What is label/loop/break/continue statement?

### 标签、循环、break、continue

* LabelledStatement
* IterationStatement
* ContinueStatement
* BreakStatement
* SwitchStatement

Only loop and switch statement can consume the continue and break that has label. Other statement can have label, but it do nothing.

```js
function Class() {
  public:
  	this.a = 1;
  	this.b = 2;
  private:
  	var x = 3;
  	var y = 4;
}
```

The code above has no error. But it is bad because it could make you conflict. That is a LabelledStatement, the "public" and "private" is the label.

> What is the behavior of try catch statement?

#### trycatch

Throw behavior is the only one that can be out of function.

![](http://www.zhuanyongxigua.cn/2020-05-03-045839.png)

The `()` here is different with for's. There is no scope here.

```js
var e = 3;
try {
  throw 2;
} catch(e) {
  console.log(e)
}
console.log(e)
```

The output is 2 and 3.

> What is the different between scope and context?

Scope is the range of code(block) in the programmer's text. Context is the place that store variables in the user's memory. But in ES3 scope is used for a object of variables, so here is easy to conflict, now the name is changed to lexture environment.

> What does declaration contain?

### 声明

* FunctionDeclaration
* GeneratorDeclaration
* AsyncFunctionDeclaration
* AsyncGeneratorDeclaration
* VariableStatement
* ClassDeclaration
* LexicalDeclaration

> What is the behavior of function declaration in JS?

#### Funcion

Dont't conflict function declaration and function expression:

```js
function foo() {
  
}

var foo = function() {
  
}
```

The first one is function declaration, the second one is function expression.

> What is the behavior of generator declaration?

#### GeneratorDeclaration

Generator is not designed for async, it's for infinite loop or return multiple value of a function.

> What is the behavior of async function declaration?

#### AsyncFunctionDeclaration

```js
function sleep(d) {
  return new Promise(resolve => setTimeout(resolve, d))
}

void async function() {
  var i = 0
  while(true) {
    console.log(i++)
    await sleep(1000)
  }
}
```

> What is the bahavior of async generator declaration?

#### AsyncGeneratorDeclaration

```js
function sleep(d) {
  return new Promise(resolve => setTimeout(resolve, d))
}

async function() {
  var i = 0
  while(true) {
    yield i++
    await sleep(1000)
  }
}
void async function() {
  var g = foo()
  console.log(await g.next())
  console.log(await g.next())
  console.log(await g.next())
  console.log(await g.next())
  console.log(await g.next())
}()

// better way
void async function() {
  var g = foo()
  for await(let e of g) {
    console.log(e)
  }
}()
```

> What is the behavior of variable statement?

#### VariableStatement

```js
var x = 0;
function foo() {
  var o = {x: 1}
  x = 2
  with(o) {
    var x = 3
  }
  console.log('internal', x)
  console.log(o)
}
foo()
console.log('external', x)
```

Result:

```js
"internal"
2
[object Object] {
  x: 3
}
"external"
0
```

If delete the var keyword in with block:

```js
var x = 0;
function foo() {
  var o = {x: 1}
  x = 2
  with(o) {
    x = 3
  }
  console.log('internal', x)
  console.log(o)
}
foo()
console.log('external', x)
```

Result:

```js
"internal"
2
[object Object] {
  x: 3
}
"external"
2
```

So the conclusion is no matter where the var keyword is, the effort is same. The situation that combine var and with is a design mistake of JavaScript.

Another example:

```js
var x = 0
function foo() {
  var o = {x: 1}
  x = 2
  // Even if the code below do nothing, but the var keyword would influence all the function scope.
  if(false) {
    var x = 1
  }
  console.log(x)
  // Here is same
  return
  var x = 3
}
foo()
console.log(x)
```

So:

1. Keyword var should at the top that the relative variable first appear in the function.
2. Do not write var in a block.

Function declaration is better than var at hoisting.

```js
function foo() {
  foo2()
  console.log(i)
  return
  // Var just hoist the variable, not the value
  var i = 1
  // Function hoist all the content of the function
  function foo2() {
    console.log(2)
  }
}
```

> What is the behavior of class declaration?

#### ClassDeclaration

There is no hoisting of class declaration.

```js
var cls1 = 0
function foo() {
  cls1 = 2
  // Throw error
  class cls1 {
    
  }
  // Error, can not have duplicate name
  class cls1 {
    
  }
}
foo()
```

Hoisting is called as boundNames in ECMA-262.

> What is "object" in natural world? What are the elements of 'object'?

### Object

![](http://www.zhuanyongxigua.cn/2020-05-03-085423.png)

![](http://www.zhuanyongxigua.cn/2020-05-03-085506.png)

* uniqueness
* status
* behavior

![](http://www.zhuanyongxigua.cn/2020-05-03-085814.png)

![](http://www.zhuanyongxigua.cn/2020-05-03-090608.png)

![](http://www.zhuanyongxigua.cn/2020-05-03-090859.png)

> 狗咬人，“咬”是人的行为还是狗的行为？So how should we design a object?

什么是行为？状态的改变就是行为，上面的图片里面有。

So in programm laugudge, the bite method is not belong class dog:

```js
class Dog {
  // This design is not good
  bite(human) {
    // ....
  }
}
```

![](http://www.zhuanyongxigua.cn/2020-05-03-091544.png)

所以，面向对象不是用贴近日常生活的方式去写代码，而是对这个事情进行有效的抽象，再运用正确的抽象的语言与描述，比如“狗着急”，这个就出狗的行为，因为狗的状态改变了。**千万不要贴着产品经理的描述去设计代码**。看一个class设计的好不好，去看这个class的每一个方法的命名，基本上心里就清楚了。有没有命名听起来不是改变自己的行为的，或者哪一个方法的代码根本没有改变自身，那就是不好的。

![](http://www.zhuanyongxigua.cn/2020-05-03-091957.png)

![](http://www.zhuanyongxigua.cn/2020-05-03-092046.png)

严格来说JS里面是没有method这个东西，其实都是属性。

![](http://www.zhuanyongxigua.cn/2020-05-03-092126.png)

Accessor尽量不用，基础库可以用。

![](http://www.zhuanyongxigua.cn/2020-05-03-092413.png)

> Some way to program object oriented code in JS?

* `{}/[]/Object.defineProperty`基本的对象能力，不带任何的class-base和prototype-base的特点。
* `Object.create/Object.setPrototypeOf/Object.getPrototypeOf`ES5中的纯prototype方法。加上第一组API就是原汁原味的基于原型的面向对象的系统。适合用原型思想去抽象和定义问题。
* `new/class/extends`基于类的面向对象。
* `new/function/prototype`不知所云的模式，是基于原型，但是语法上像Java，实际上不知道是啥的机制，但是没有第三组API之前又不得不用的模式。现在最好就不要用了。

![](http://www.zhuanyongxigua.cn/2020-05-03-093305.png)

JS的基本类型比如Number和Date，new调用和直接函数调用的结果是不一样的。我们自己写的function在这两方面是一样的。所以我们自己写代码的时候，所有需要new的，都用class去写。

![](http://www.zhuanyongxigua.cn/2020-05-03-093842.png)

这些是我们不能用new function去模拟出来的，比如数组的length属性：

```js
var o = []
o[100] = 1
console.log(o.length) // 101
Object.getOwnPropertyDescriptor(o, "length") // It is a data property, not a accessor property.
```

> What is encapsulation, inherit and polymorphisms? Who invent those?

封装/多态/继承应该是国内不知道是谁编的，也不算错，关键是你能不能说清楚。

封装/复用/解藕/内聚是用来描述架构的。

> What is the role of encapsulation?

封装就是别人不容易看到里面的东西，不容易看到也就不容易修改，也就不容易出错。

> What kind of  'reuse' is good reuse?

复用，就是设计的粒度合适，经常用就是复用好。

> What is decouple?

解藕，不同模块之间的关联性弱。

> What is 内聚？

内聚，与封装类似的东西。

最后在讲UTF-8的作业。



## 课件：

- 链接：[ https://pan.baidu.com/s/1kywQU1yqvdCGRK982zSFrA](https://pan.baidu.com/s/1kywQU1yqvdCGRK982zSFrA)
  提取码：8xfx

## 课后作业：

- 找出 JavaScript 标准里有哪些对象是我们无法实现出来的，都有哪些特性？写一篇文章，放在学习总结里。

## 有助于你理解的知识：

- 按照 ECMAScript 标准，一些特定语句（statement) 必须以分号结尾。分号代表这段语句的终止。但是有时候为了方便，这些分号是有可以省略的。这种情况下解释器会自己判断语句该在哪里终止。这种行为被叫做 “自动插入分号”，简称 ASI (Automatic Semicolon Insertion) 。实际上分号并没有真的被插入，这只是个便于解释的形象说法。
- var 最好写在函数内最前面或变量第一次出现的地方
