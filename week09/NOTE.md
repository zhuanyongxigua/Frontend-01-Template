# 重学前端week09第一节重学CSS｜CSS动画

### Animation

* @keyframes定义
* animation：使用

```css
@keyframes mykf {
  from { background: red; }
  to { background: yellow; }
}
div {
  animation: mykf 5s infinite;
}
```

#### Properties

* animation-name 时间曲线
* animation-duration 动画的时长
* animation-timing-function 动画的时间曲线
* animation-delay 动画开始前的延迟
* animation-iteration-count 动画的播放次数
* animation-direction 动画的方向

```css
@keyframes mykf {
  0% { top: 0; transition: top ease }
  50% { top: 20px; transition: top ease-in }
  75% { top: 10px; transition: top ease-out }
  100% { top: 0; transition: top linear }
}
```

### Transition

* transition-property 要变换的属性
* transition-duration 变换的时长
* transition-timing-function 时间曲线， https://cubic-bezier.com/#.17,.67,.83,.67,  It is a cubic-bezier. The kind “ease” is 符合人类直觉的，使用最多的，也是推荐的。“ease-in” is use for the animation that get out. "ease-out" is use for the animation that come in. 名字与效果是相反的。
* transition-delay 延迟


一次被塞尔曲线
![](http://www.zhuanyongxigua.cn/2020-06-06-050120.png)
二次被塞尔曲线
![](http://www.zhuanyongxigua.cn/2020-06-06-050143.png)

三次被塞尔曲线

![](http://www.zhuanyongxigua.cn/2020-06-06-074145.png)

```html

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Simulation</title>
  <style>
    .ball {
      width:10px;
      height:10px;
      background-color:black;
      border-radius:5px;
      position:absolute;
      left:0;
      top:0;
      transform:translateY(180px);
    }
  </style>
</head>
<script>

function generateCubicBezier (v, g, t){
    var a = v / g;
    var b = t + v / g;

    return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],
        [(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]];
}

function createBall() {
  var ball = document.createElement("div");
  var t = Number(document.getElementById("t").value);
  var vx = Number(document.getElementById("vx").value);
  var vy = Number(document.getElementById("vy").value);
  var g = Number(document.getElementById("g").value);
  ball.className = "ball";
  document.body.appendChild(ball)
  ball.style.transition = `left linear ${t}s, top cubic-bezier(${generateCubicBezier(vy, g, t)}) ${t}s`;
  setTimeout(function(){ 
    ball.style.left = `${vx * t}px`; 
    ball.style.top = `${vy * t + 0.5 * g * t * t}px`; 
  }, 100);
  setTimeout(function(){ document.body.removeChild(ball); }, t * 1000);
}

</script>
<body>
  <label>运动时间：<input value="3.6" type="number" id="t" />s</label><br/>
  <label>初速度：<input value="-21" type="number" id="vy" /> px/s</label><br/>
  <label>水平速度：<input value="21" type="number" id="vx" /> px/s</label><br/>
  <label>重力：<input value="10" type="number" id="g" /> px/s²</label><br/>
  <button onclick="createBall()">来一个球</button>
</body>
</html>
```

Transform animation is faster than top and left. So transform animation is recommanded. Gif animation is a killer of performance, don't use it.

### 渲染与颜色

![](http://www.zhuanyongxigua.cn/2020-06-06-090330.png)

![](http://www.zhuanyongxigua.cn/2020-06-06-090344.png)

```html
<style>
  .button {
    display: inline-block;
    outline: none;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    font: 14px/100% Arial Helvetica, sans-serif;
    text-shadow: 0 1px 1px rgba(0,0,0,.3);
    border-radius: .5em;
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
    color: white;
    border: solid 1px;
  }
</style>
<div class="button orange">123</div>
<script>
  var btn = document.querySelector(".button");
  var h = 25;
  setInterval(function() {
    h ++;
    h = h % 360
    btn.style.borderColor = `hsl(${h}, 95%, 45%)`
    btn.style.background = `linear-gradient(to bottom, hsl(${h}, 95%, 54.1%), hsl(${h}, 95%, 84.1%))`
  }, 100)
</script>
```

> Which way is the best way to handle vector diagram?

### 形状

* border
* box-shadow
* border-radius

Data url + svg is recommanded. Svg can handle all vector diagram.

![](http://www.zhuanyongxigua.cn/2020-06-06-095702.png)

This method has no extra file. Do not use CSS border to generate triangle or five-pointerd star, even through it can do it. 

### Homework

![](http://www.zhuanyongxigua.cn/2020-06-06-101041.png)
other 是辅助相关的属性。更进一步的就是每一个属性隶属于哪一个标准也标出来。

## 预习内容：

- [CSS 动画与交互：为什么动画要用贝塞尔曲线这么奇怪的东西？](https://time.geekbang.org/column/article/91325)

## 参考链接：

- https://cubic-bezier.com/#.17,.67,.83,.67
- [https://zh.wikipedia.org/wiki/ 貝茲曲線](https://zh.wikipedia.org/wiki/貝茲曲線)

## 课后作业：

- 打开一个空白页面，找到它的 body，把它的 ComputedStyle 取出来，会得到大概 280 个属性。把这些属性进行归类，用脑图的方式写到学习总结里。（作业描述具体参考视频最后的内容）

## 答疑回放：

- 链接：[ https://pan.baidu.com/s/12fo1ph3y6ebv0nA5NxXdsQ](https://pan.baidu.com/s/12fo1ph3y6ebv0nA5NxXdsQ)
  提取码：ryz8

# 重学前端week09第二节重学HTML｜HTML语言与扩展

### DTD与XML namespace

* http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
* http://www.w3.org/1999/xhtml

然后又看了一遍entity，又演示了一下nbsp这个entity是干啥的。

> How to get a "nbsp"?

Print a `\u00A0` in browser console, then you could get a "nbsp". The  browser would not create a new line if it encounter a "nbsp" no matter how big the window is.

> Some entities you must know!!! Why?

```html
<!ENTITY quot "&#34;"> <!-- quotation mark, U+0022 ISOnum --> 
<!ENTITY amp "&#38;#38;"> <!-- ampersand, U+0026 ISOnum --> <!-- It is & -->
<!ENTITY lt "&#38;#60;"> <!-- less than sign, U+003C ISOnum -->
<!ENTITY gt "&#39;"> <!-- greater-than sign, U+003E ISOnum -->
```

The reason is that they can not appear in HTML text, they must be escaped。Especially the amp, you must use `&amp;`  in text. 否则计算机可能会识别错误。If the value of property in HTML has double quote, you must use `&quot;`.

### HTML标签-语义

aside，除了页面文章的主体，其他的东西都是aside，大概包括类似页眉页脚什么的。It is not side bar. It the content that is not important. 

The important part of the article(主体部分) should be wrapped by main tag. The main tag is about SEO, it is important. Any tag could be contained by main tag. If it is a single article, you can use article tag in main.

The title should be wrapped by h1~h6 tag. The important thing is that the h1~h6 tag should be wrapped by `hgroup` tag.

The sematic of hr tag is 故事走向的转变或者话题的转变。所以如果没有这样的语义需求，样式上面的横线应该用CSS去处理，而不是用hr标签。

“补充说明” 没有标签，用div就可以了。

quote标签是你引用别人的。内容里面的“WWW”可以用一个abbr标签括起来，是一个缩写。

文字右上角的那个引用的角标1 可以用sub标签，但是这个语义也不是特别的符合。语义把握不好的就可以用span和div了。

目录部分，可以先套一个div。也可以用nav。因为目录部分是有序的，如果不想要序号，想显示原点，那也不能把ol换成ul，因为语义不对，应该用CSS实现。

**语义是呈现无关**。

section里面可以用h1标签了，不需要从之前用过的h标签类推下来了。就是说前面用过了h1和h2，不影响这里，这里不用搞一个h3。这也是h1～h6不够用的解决方案。

一段HTTP请求头的事例，用了一个pre，由于又是一个事例，外面又套了一层samp标签。如果是代码就不用pre了，用code。

图片下面的解释文字用figure和figcaption。

```html
<figure>
  <img>
  <figcaption></figcaption>
</figure>
```

文章里面又出现了terms这样的单词，是术语的意思，后面表达有定义的地方，用dfn标签，这个标签就是定义的意思。

列表除了ul和ol还有dl，里面dt是definition term，dl是dfn的列表形态。dd是definition description。

时间用time标签。

address标签表示的是文章作者的地址，不能乱用。

HTML语义化就像是词汇量，十分确认恰当的场景的可以用，不用也无所谓。

p标签是著名的可以不闭合的标签

```html
<p>sdfsdfsdf
```

这样用就可以。

#### 合法元素

* Element: \<tagname>...\<tagname>
* Text: text
* Comment: \<!-- comments -->
* DocumentType: \<!Doctype html>
* ProcessingInstruction: \<?a 1?>，基本上没用，差不多相当于是注释，是一种预处理
* CDATA: \<![CDATA[]]>，相当于JS里面的反引号。

#### 字符引用

* `&#161;`
* `&amp;`
* `&lt;`
* `&quot;`

下面那三个非常重要，否则在HTML有些东西是写不出来的，比如带双引号和单引号的属性。比如大于号，大于号跟HTML的标签如意混乱。

### 重学DOM

![](http://www.zhuanyongxigua.cn/2020-06-09-115623.png)

![](http://www.zhuanyongxigua.cn/2020-06-09-115526.png)

tranversal是垃圾API了，完全不用学。

![](http://www.zhuanyongxigua.cn/2020-06-09-003617.png)

没有DocumentFragment这种节点。DocumentType没用，用于致敬。有Element的原因是用不同的namespace。在HTML语言里面namespace是HTML/SVG和MathML。所以才会在有了HTMLElement的时候又在上面加了一层Element。

其中HTMLAnchorElement和SVGAElement虽然都是a标签，但是namespace不一样。

CSS里面是是namesapce配合`|`和@rule选择。虽然可以用父子关系选择到svg namespace下面的a标签，但是语言需要完备，所以CSS也有了namespace的方式。

DOM里面就是通过不同的子类区分namespace了，就是HTMLElement。

> What is HTML namespace? What does it look like?

So what do these namespace declarations look like, and where do they go? Here is a short example.
```html
<svg xmlns="http://www.w3.org/2000/svg">
  <!-- more tags here -->
</svg>
```

So if all the descendants of the root element are also defined to be in the default namespace, how do you mix in content from another namespace? Easy. You just redefine the default namespace. Here's a short example.
```html
<html xmlns="http://www.w3.org/1999/xhtml">
  <body>
    <!-- some XHTML tags here -->
    <svg xmlns="http://www.w3.org/2000/svg" width="300px" height="200px">
      <!-- some SVG tags here -->
    </svg>
    <!-- some XHTML tags here -->
  </body>
</html>
```

Another example:

```html
<html xmlns="http://www.w3.org/1999/xhtml" 
      xmlns:svg="http://www.w3.org/2000/svg">
  <body>
    <h1>SVG embedded inline in XHTML</h1>
    <svg:svg width="300px" height="200px">
      <svg:circle cx="150" cy="100" r="50" fill="#ff0000"/>
    </svg:svg>
  </body>
</html>
```

 #### 导航类操作

* parentNode

* childNodes，这个是一个living collection，**Here is very important**!!!!

  ```js
  // parg is an object reference to a <p> element
  
  // First check that the element has child nodes 
  if (parg.hasChildNodes()) {
    // It is not a JavaScript array
    let children = parg.childNodes;
  
    for (let i = 0; i < children.length; i++) {
      // do something with each child as children[i]
      // NOTE: List is live! Adding or removing children will change the list's `length`
    }
  }
  ```

  反面教材：

  ```html
  <div id="x">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </div>
  <div id="b"></div>
  
  <script>
    var x = document.getElementById("x")
    var b = document.getElementById("b")
    for(var i = 0; i < x.children.length; i++) {
      b.appendChild(x.children[i])
    }
  </script>
  ```

  正确的应该这样写：

  ```html
  <div id="x">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </div>
  <div id="b"></div>
  
  <script>
    var x = document.getElementById("x")
    var b = document.getElementById("b")
    while(x.children.length) {
      b.appendChild(x.children[0])
    }
  </script>
  ```

* firstChild

* lastChild

* nextSibling

* previousSibling

大部分都有对应的Element的版本，但是推荐使用Node的版本，而不是Element。

#### 修改操作

* appendChild，如果不是新create的节点，而是从当前DOM tree里面找到的节点，需要注意，这个操作是挪过去，而不是复制过去！
* insertBefore，允许传两个参数，一个是被插进去的那个，另一个是插进去的位置。这样就插不到最后一个，所以就有了一个appendChild这个API，这两个形成了完备性。也就是说有10个节点，有11个位置可以加入新元素，前10个用insertBefore，最后一个用append。append是一个最小化的实现，刚好够用，所以没有insertAfter这样的API。如果不是新create的节点，而是从当前DOM tree里面找到的节点，需要注意，这个操作是挪过去，而不是复制过去！
* removeChild
* replaceChild

**非常重要的内容**：所有的DOM元素，默认只有一个父元素，不能被两次插入到DOM tree里面。一个元素在A位置，然后你把它又插入到了B位置，那A位置的那个就会被默认的删除了，不需要你再去手动的删除了。

#### 高级操作

* compareDocumentPosition是一个 用于比较两个节点中关系的函数。比较的是先后。
* contains检查一个节点是否包含另一个节点的函数；
* isEqualNode检查两个节点是否完全相同；
* isSameNode检查两个节点是否是同一个节点，实际上在JavaScript中可以用“===”。所以这个API没啥用，其他的几个都是非常有用的API。
* cloneNode复制一个节点，如果传入参数true，则连同子元素做深拷贝。

### Events

addEventalistener可以传入一个对象：

```js
document.body.addEventListener("click", {
  handleEvent: function() {console.log("!!!!")}
})
```

这样搞的好处就是后面那个函数可以复用。

主要讲了一下设计捕获-冒泡模型的原因，因为计算的需要，已经是先计算root元素，看看点击的那个坐标在不在范围内，这个就是捕获。捕获结束了之后，为了保证每个元素都接收到了事件，再从里向外触发一遍。

## 预习内容：

- [HTML 语义：div 和 span 不是够用了吗？](https://time.geekbang.org/column/article/78158)
- [HTML 语义：如何运用语义类标签来呈现 Wiki 网页？](https://time.geekbang.org/column/article/78168)
- [HTML 元信息类标签：你知道 head 里一共能写哪几种标签吗？](https://time.geekbang.org/column/article/82711)
- [HTML 链接：除了 a 标签，还有哪些标签叫链接？](https://time.geekbang.org/column/article/85341)
- [HTML 替换型元素：为什么 link 一个 CSS 要用 href，而引入 js 要用 src 呢？](https://time.geekbang.org/column/article/89491)
- [HTML 小实验：用代码分析 HTML 标准](https://time.geekbang.org/column/article/89832)
- [HTML 语言：DTD 到底是什么？](https://time.geekbang.org/column/article/92227)
- [HTML·ARIA：可访问性是只给盲人用的特性么？](https://time.geekbang.org/column/article/93777)
