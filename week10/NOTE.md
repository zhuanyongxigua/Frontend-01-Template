# 重学前端week10第一节重学浏览器API｜其他API，总结

> 把一个元素的所有子元素逆序？

```html
<span>1</span>
<span>2</span>
<span>3</span>
<span>4</span>
<span>5</span>

<!-- 改成 -->

<span>5</span>
<span>4</span>
<span>3</span>
<span>2</span>
<span>1</span>
```

中规中矩，但是会被认为不懂DOM的方法：

```js
function reverseChildren(element) {
  let children = Array.prototype.slice.call(element.childNodes)
  for(let child of children) {
    element.removeChild(child)
  }
  children.reverse()
  for(let child of children) {
    element.appendChild(child)
  }
}
```

使用DOM节点操作最好的方法：

```js
function reverseChildren(element) {
  var l = element.childNodes.length;
  while(l-- > 0) {
    element.appendChild(element.childNodes(l))
  }
}
```
此外还有documentFragment的方法，这个方法较好，因为性能好。

满分的版本，原因是这个重排的次数很少，元素多的时候性能很好：

```js
function reverseChildren(element) {
  let range = new Range()
  range.selectNodeContents(element)
  let fragment = range.extractContents()
  var l = fragment.childNodes.length
  while(l-- > 0) {
    fragment.appendChild(fragment.childNodes[l])
  }
  element.appendChild(fragment)
}
```
这个比单独使用fragment的好处在于，想要精确的修改里面的东西的时候，用range可以保证在精确的同时还有较好的性能。 
> 在看一个面试题的时候如何思考？

还是要想想问这个问题的目的是要考什么？

虽然题目给的数量级不大，但是大数量级的情况不能不思考。

次数少，直接append，insert没啥问题，稍微多一点，用innerHTML可以，上万次什么的，就可以考虑用range API了。

> Range API 在脑图中的位置？

### Range API

它也是一个DOM API

```js
var range = new Range()
range.setStart(element, 9) // 保证完备性的API
range.setEnd(element, 4) // 保证完备性的API，可以设置到文本节点的单个文字的位置
var range = document.getSelection().getRangeAt(0)
```

> Range 有哪些API？

这些是除了上面两个必要的API之外，辅助的API，上面两个最重要。

* range.setStartBefore
* range.setEndBefore
* range.setStartAfter
* range.setEndAfter
* range.selectNode
* range.selectNodeContents

fragment只会把自己的子元素塞到DOM树里面去，自己不会被塞进去。DOM树里面是永远不会出现fragment这样的节点的。

range可以生成一个fragment:

```js
// 这两个配合有奇效
var fragment = range.extractContents()
range.insertNode(document.createTextNode("aaaa"))
```

DOM操作的append跟insert只能是在节点之间插入东西，range可以把东西插入到节点的文本里面，比如`<span>sdfsdfsdf</span>`中间的sdfsdsdf就是文本，修改的就是这个部分。

> 如何用range把整个子节点切掉？

```html
<div id="a">123<span style="background-color: pink;">456789</span>0123456789</div>
<script>
  let range = new Range()
  range.setStart(document.getElementById("a").childNodes[0], 3)
  range.setEnd(document.getElementById("a").childNodes[2], 3)
</script>
```

这样就把整个span切掉了。

### CSSOM

CSSOM就是用CSS能做的事情，用JS也可以做，都会有等效的API。

几乎所有的CSSOM API都是从document.styleSheets开始的。

产生styleSheets有两种方式，一个是style标签，另一个是link标签。

其中link标签是要加一个href的，里面是一个url，但是有一个额外的用法，因为有data协议，所以可以这样写：

```html
<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue&7D">
```

data协议是与file协议或http对象的东西，在浏览器的地址栏输入：

```js
data:text/html,<a>x</a>
```

页面里面就会渲染一个x。里面那个`text/html`是Content-Type。

里面的一些符号需要转义。rel属性是一定要加的，否则不会转成css的。

有CSSStyleSheet这个类。它的prototype是StyleSheet。

没有不通过DOM API去创建样式表的能力。或者用HTML语言，或者用DOM API是创建。

document.styleSheets里面最重要的就是CSSRules。

#### Rules

* document.styleSheets[0].cssRules，虽然是数组，但是却不能像正常的数组那样操作。伪元素的样式也可以在这个里面改。
* document.styleSheets[0].insertRule("p { color: pink; }", 0)，而且插入的是文本。也是因为这个原因必须页面上面有style标签才行。这个感觉跟那个range有点像。这种方式，如果想要把cssRules里面的东西取出来再用这个API塞进去是做不到的，需要自己处理成文本才能塞进去。
* document.styleSheets[0].removeRule(0)

#### Rule

* CSSStyleRule
  * selectorText String
  * style K-V结构，这个是可以改的，即时生效。批量的修改可以考虑使用这个，而不是用DOM API。
* CSSCharsetRule
* CSSImportRule
* CSSMediaRule
* CSSFontFaceRule
* CSSPageRule
* CSSNamespaceRule
* CSSKeyframesRule
* CSSKeyframeRule
* CSSSupportsRule
* ...

#### getComputedStyle

* window.getComputedStyle(let, pseudoElt)
  * elt 想要获取的元素
  * pseudoElt可选，伪元素

#### CSSOM视图

```js
let children = window.open("about:blank", "_blank", "width=100, height=100, left=100, top=100")
```

这个代码可以开一个小窗口。然后children里面还有API，比如用moveBy可以挪动这个窗口。

其实当前window也有这些API，但是页面没有权限，即便调用了也没有反应。

window还有滚动的API，这个是有效果的。需要注意的是元素的滚动的API设计的跟window的效果不一样，元素的是scrollBy/scrollTo/scrollTop/scrollLeft。

一个操作的小技巧，在浏览器的开发者工具的Elements里面，点击了一个元素，到console里面可以用`$0`拿到这个元素。

由于一个inline元素在换行的情况下会产生多个盒子，所以用getClientRects获取的时候，会得到一个数组。另外还有一个getBoundingClientRect得到的就不是多个了，是这个inline元素的位置。那些top什么的排版逻辑的API在用来做滚动拖拽什么的都不好用。

还有`window.innerWidth`和`window.innerHeight`，是视口的尺寸，也可以通过`document.documentElement.getBoundingClientRect()`里面的width和height获得。还有outWidth，如果打开了开发者工具，那这个就是包括了开发者工具的浏览器的宽，innerWidth依然是视口的宽。
另外有一个很重要的API，`window.devicePixelRatio`。

移动端用iframe会有很多兼容问题，最好不要用。

### 所有API

whatwg里面有一些标准，其中quirks Mode比较老了，不用管了。

SyncManager不属于任何一个组织，他是wicg，应该算是社区。


预习内容：

- [浏览器 CSSOM：如何获取一个元素的准确位置](https://time.geekbang.org/column/article/86117)

## 参考链接：

- https://spec.whatwg.org/

## 参考代码：

```HTML
<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D">
```

- apis.html：
  链接：[ https://pan.baidu.com/s/1m_-Z_NPjrwpJxzppcRuBEQ ](https://pan.baidu.com/s/1m_-Z_NPjrwpJxzppcRuBEQ)提取码：irgz

## 课后作业：

- 把所有的 API 画进脑图里

## 答疑回放：

- 链接：[ https://pan.baidu.com/s/1ciT-D-v5RAtw6tLDYyjhfQ](https://pan.baidu.com/s/1ciT-D-v5RAtw6tLDYyjhfQ)
  提取码：tsgd
