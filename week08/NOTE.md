# 重学前端week08第一节重学CSS｜CSS基本语法，CSS基础机制（二）

## 选择器

### 选择器语法

#### 简单选择器

* *
* div svg|a(namespace tag, a tag in svg namespace)
* .cls
* #id
* [attr=value]
* :hover
* ::before

#### compound selector

* <简单选择器><简单选择器><简单选择器>, 是与的关系。
* *或者div必须写在最前面

#### 复杂选择器

* <复合选择器>\<sp(空格)><复合选择器>，子孙关系
* <复合选择器>">"<复合选择器>
* <复合选择器>"~"<复合选择器>
* <复合选择器>"+"<复合选择器>
* <复合选择器>"||"<复合选择器>，很多浏览器不实现，选中table的一列。

In addition, you also can use comma in CSS selector, it is called selector list.

上面的中间的三个都是可以回溯实现的，在视频的01:09:04。

### 选择器优先级

**简单选择器计数**

![](http://www.zhuanyongxigua.cn/2020-06-01-140624.png)

N是一个足够大的数，不是一个确定的数，足够大就可以了。

> The priority display of `div#a.b .c[id=x]`?

`[0 1 3 1]`。

> The priority display of `#a:not(#b)`?

`[0 2 0 0]`. Pseudo class `not` doesn't has priority value. it is a special pseudo class.

> The priority display of `*.a `?

`[0 0 1 0]`.

> The priority display of `div.a`?

`[0 0 1 1]`

### Pseudo Class

**连接/行为**

The most important pseudo class is link pseudo class:

* `:any-link`, because pseudo class  `link` represent the link that didn't be visited, so there is no a pseudo class that can represent all the link wether it was visited or not. So add this pseudo, it a new pseudo class. The tag "a" that don't have "href" property is not a link. So tag selector a also cannot select all link.
* `:link :visited`
* `:hover`
* `:active`
* `:focus`
* `:target`

**树结构**

* `:empty`
* `:nth-child()`
* `:nth-last-child()`
* `:first-child :last-child :only-child`

在start tag就调用css的话，以上树结构伪类哪些是无法实现的？

答案是`ntl-last-child`, `last-child`和`only-child`。具体在01:06:59。这三个也是需要回溯的。不推荐使用，因为浏览器即便实现了，因为回溯，也会非常的复杂，还会影响重新layout的次数。

**逻辑**

* `:not`
* `:where :has`

以上选择器都掌握了，水平就很不错了。

### Pseudo Element

* `::before`
* `::after`
* `::firstLine`
* `::firstletter`

后两个是本来有东西，然后给他框起来，这样理解的话就跟伪类不一样了。

![](http://www.zhuanyongxigua.cn/2020-06-01-154139.png)

![](http://www.zhuanyongxigua.cn/2020-06-01-154153.png)

first-line跟代码里面的回车没关系，跟用户的屏幕大小有关系，屏幕小，有些东西被挤到第二行去了，那first-line里面的东西就少了。

first-letter和first-line的可用属性：

![](http://www.zhuanyongxigua.cn/2020-06-01-154305.png)

before和after，在写HTML的时候，有些在开头没有语义的东西，就可以用这个。一个是语义一个是表现。

## 预习内容：

- [《CSS 选择器：如何选中 svg 里的 a 元素？》](https://time.geekbang.org/column/article/84365)
- [《CSS 选择器：伪元素是怎么回事儿？》](https://time.geekbang.org/column/article/84633)

## 课件及答疑回放：

- 链接： https://pan.baidu.com/s/1Zk1rzj3rBQF0vBp9jbGFcA
  提取码：r59y

## 随堂练习：

请写出下面选择器的优先级

- div#a.b .c[id=x]
- \#a:not(#b)
- *.a
- div.a

## 思考：

- 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

  因为first-line浮动跑了之后，会产生新的first-line，这样就无限循环了。

- 为什么fisrt-line可以设置字体？

  因为文字是一个一个渲染的。并不是先算好哪些文字在first-line里面，然后再加属性。而是在排版的过程中把first-line相关的属性直接加到文字上面。first-line的可用属性，除了line-height，都是应用到文字上的，没有作用于盒的。是跟排版非常相关的属性。在视频的01:27:00

## 课后作业：

- 编写一个 match 函数，检查第二个参数的元素是否能匹配到selector的所有的东西上。

```
function match(selector, element) {
    return true;
}
 
 
match("div #id.class", document.getElementById("id"));
```

不要用querySelector这种API，去找selector语法解析的包，也可以用正则。重点是写selector的逻辑。

# 重学前端week08第二节排版与排版相关属性，绘制与绘制相关属性

### 盒（Box）

![](http://www.zhuanyongxigua.cn/2020-05-31-041206.png)

![](http://www.zhuanyongxigua.cn/2020-05-31-041218.png)

眼睛能看到的是盒，写在HTML代码里面的那个是标签，元素是在脑子里面的。

“一对起止标签，表示一个元素”， 被表示的是语义，所以是元素。

DOM树场面还有文本节点/注释节点等等。

CSS选择器是在DOM结构里面选择的。

You should study "box" first ,and then to study box model. But the lesson didn't give the concept of box.

> How to write?

### Normal Flow

* From left to right
* 同一行写的文字都是对齐的
* 一行写满了就换行

> Normal flow arrangement?

* 收集盒进行(hang)
* 计算盒在行(hand)中的排布
* 计算行(hang)的排布

![](http://www.zhuanyongxigua.cn/2020-05-31-075333.png)

左边的就是右边的一个line-box。line-box和block-box是从上到下排布的。

左边的是inline formatting context，可以简单的理解成从左到右的就是IFC

右边的是block formatting context，可以简单的理解成从上到下的就是BFC，也是normal flow。

### Normal Flow Line Model

![](http://www.zhuanyongxigua.cn/2020-05-31-075833.png)

中文跟基线没有关系。

```html
<div style="font-size: 50px;line-height: 100px;background-color: pink;">
  Hello
  <div style="line-height: 70px;width: 100px;height: 100px;background-color: aqua;display: inline-block;">world!</div>
</div>
```

The line height is different, but "Hello" and "world" is align.

Add some code can display the baseline:

```html
<div style="font-size: 50px;line-height: 100px;background-color: pink;">
  <div style="vertical-align: baseline;overflow: visible;display: inline-block;width: 1px;height: 1px">
    <div style="width: 1000px;height: 1px;background: red;"></div>
  </div>
  Hello
  <div style="line-height: 70px;width: 100px;height: 100px;background-color: aqua;display: inline-block;">world!</div>
</div>
```

If delete `inline-block` of "world!", the baseline is changed to the bottom of the inline-block. It's not obvious, so you should write a `vertical-align: bottom(top)` when you use inline-block. The top of the line is align to the most top element's top of the line. So as bottom.

inline-block的时候推荐使用vertical-align的top/middle/bottom之一。 如果使用了text-bottom这种，行为就会有点难算。

`Vertical-align: baseline`，是拿自己的 baseline 去对其行的 baseline 

`Vertical-align: top，middle，bottom`，是拿自己的 ”顶部“ “中线” ”底部“ 去对其行的 ”顶部“ “中线” ”底部“ 

`vertical-align: text-top，text-bottom`，是拿自己的 ”顶部“ ”底部“ 去对齐行的 text-top 和 text-bottom 线。

If a inline element is 换行了, you can use `element.getClientRects()` get multiple box's sizes.

```html
<div style="font-size:50px;line-height:100px;background-color:pink;">
    <div style="vertical-align:text-bottom;overflow:visible;display:inline-block;width:1px;height:1px;">
        <div style="width:1000px;;height:1px;background:red;"></div>
    </div>
    <div style="vertical-align:text-top;overflow:visible;display:inline-block;width:1px;height:1px;">
        <div style="width:1000px;;height:1px;background:red;"></div>
    </div>
    <span>Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello </span>
    <div style="vertical-align:text-bottom;line-height:70px;width:100px;height:150px;background-color:aqua;display:inline-block">1</div>
    <div style="vertical-align:top;line-height:70px;width:100px;height:50px;background-color:aqua;display:inline-block">1</div>
    <div style="vertical-align:base-line;line-height:70px;width:100px;height:550px;background-color:plum;display:inline-block">1</div>
</div>
```

### Float and Clear

```html
float: <div style="float:right;width: 100px;height: 100px;background-color:blue;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
float: <div style="float:right;width: 100px;height: 100px;background-color:blue;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
float: <div style="float:right;width: 100px;height: 100px;background-color:blue;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
float: <div style="float:right;width: 100px;height: 100px;background-color:blue;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
```

Float arrangement may cause a step style:

![](http://www.zhuanyongxigua.cn/2020-05-31-084140.jpg)

If you want fix this, you must add `clear: right` in the div.

现在由于有了flex，float还是回归到由来的设计的初衷，就是文字的绕排。

clear的意思就是找一个干净的地方从新开始。

### Margin 折叠

Margin 折叠 only occur in BFC, not in inline elements or float elements. 视频01:38:11讲了W3C的标准BFC的概念。

BFC would effort margin 重叠。

能容纳正常流的块都会产生BFC。也不用刻意的记。特殊情况是正常流的容器又设置了`overflow: visible`，就会出现边距折叠的问题了。以后如果加了新的display，能容纳normal flow，就会产生BFC，不会跟外面合并，因为外面没有正常的流。比如flex布局就不是正常的流，只有正常的流里面放正常的流才有可能发生合并。

所以需要记住的就是overflow: visiable会跟他的父亲合并。

视频里面还解释了标准里面的block container/block box什么的。

https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#normal-flow

block-level 表示可以被放入bfc
block-container 表示可以容纳bfc
block-box = block-level + block-container
block-box 如果 overflow 是 visible， 那么就跟父bfc合并

还有一个BFC与float元素的关系的例子。

```html
<div style="height:500px;background-color: lightgreen;">
  <div style="float: right;width:100px;height:100px;background-color:aqua;margin:20px;"></div>
  <div style="background-color: pink;overflow:hidden;">
    <div style="width:100px;height:100px;background-color: blue;margin:20px"></div>
    文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
  </div>
</div>
```

把`overflow:hidden`去掉，就合并了。

Most display values have a inline version, e.g. flex and inline-flex:

```html
<div style="display: inline-flex;vertical-align: middle;">
  <div style="border: solid 1px blue;width: 100px;height: 100px;background-color: lightgreen"></div>
  <div style="border: solid 1px blue;width: 100px;height: 100px;background-color: lightgreen"></div>
  <div style="border: solid 1px blue;width: 100px;height: 100px;background-color: lightgreen"></div>
</div>
文字 文字
文字 文字
文字 文字
文字 文字
文字 文字
文字 文字
文字 文字
文字 文字
文字 文字
```

对应的：

```
flex inline-flex // flex相关的不是block-container，但是它的子元素无论加什么display，都是一个block-container，也就是flex-item，一定是一个block-container，The exception is the display of flex item is flex, it's not a block-container.

table inline-table

grid inline-grid

block inline-block  // 只有这两个是block-container
// flex/table/grid/block 是block-level的元素，这个回忆上面的那个IFC和BFC的图片

inline

run-in // 加了这个属性的元素会投入到兄弟节点的怀抱里面去。
table-cell // It's a block-conatiner, not block-level.
```

https://www.w3.org/TR/2018/CR-css-flexbox-1-20181119/#flex-items

### overflow: visible and BFC

好像在上面的内容里面讲完了。

### Flex排版

* 收集盒进行(hang)
* 计算盒在主轴方向的排布(hang)
* 计算盒在交叉轴方向的排布(hang)

![](http://www.zhuanyongxigua.cn/2020-05-31-133104.png)

![](http://www.zhuanyongxigua.cn/2020-05-31-133116.png)

![](http://www.zhuanyongxigua.cn/2020-05-31-133128.png)



## 预习内容：

- [CSS 排版：从毕升开始，我们就开始用正常流了](https://time.geekbang.org/column/article/85745)
- [CSS Flex 排版：为什么垂直居中这么难？](https://time.geekbang.org/column/article/90148)
- 课件链接：[ https://pan.baidu.com/s/1pP6znwGPXicnHBMmVdHniQ](https://pan.baidu.com/s/1pP6znwGPXicnHBMmVdHniQ)
  提取码：0f8k

## 参考链接：

- https://www.w3.org/TR/2018/CR-css-flexbox-1-20181119/#flex-items

## 参考代码：

复制代码

```CSS
<div style="font-size:50px;line-height:100px;background-color:pink;">
    <div style="vertical-align:text-bottom;overflow:visible;display:inline-block;width:1px;height:1px;">
        <div style="width:1000px;;height:1px;background:red;"></div>
    </div>
    <div style="vertical-align:text-top;overflow:visible;display:inline-block;width:1px;height:1px;">
        <div style="width:1000px;;height:1px;background:red;"></div>
    </div>
    <span>Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello </span>
    <div style="vertical-align:text-bottom;line-height:70px;width:100px;height:150px;background-color:aqua;display:inline-block">1</div>
    <div style="vertical-align:top;line-height:70px;width:100px;height:50px;background-color:aqua;display:inline-block">1</div>
    <div style="vertical-align:base-line;line-height:70px;width:100px;height:550px;background-color:plum;display:inline-block">1</div>
</div>
```

## 思考题：

- 我们如何写字？
  本周作业：

## 参考名词：

- IFC：inline formatting context
- BFC：block formatting context

## Tips：

- 大家请记住下面这个表现原则：如果一个元素具有 BFC，内部子元素再怎么翻江倒海、翻云覆雨，都不会影响外部的元素。所以，BFC 元素是不可能发生 margin 重叠的，因为 margin 重叠是会影响外部的元素的；BFC 元素也可以用来清除浮动的影响，因为如果不清除，子元素浮动则父元素高度塌陷，必然会影响后面元素布局和定位，这显然有违 BFC 元素的子元素不会影响外部元素的设定。
- block-level 表示可以被放入 bfc
- block-container 表示可以容纳 bfc
- block-box = block-level + block-container
- block-box 如果 overflow 是 visible， 那么就跟父 bfc 合并