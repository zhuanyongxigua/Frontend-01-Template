# 每周总结可以写在这里

## 重学前端week02第一节编程语言通识与JavaScript语言设计

### 语言按语法分类

* 非形式语言：中文，英文；

* 形式语言（乔姆斯基谱系）：

  * 0型无限制文法；是相对于其他三种来说是无限制，但实际上也是有限制的。
  * 1型上下文相关文法；这种对引擎的实现者来说不友好。
  * 2型上下文无关文法；大部分是这种。JS是大部分上下文无关的。
  * 3型正则文法；简单概括一下就是能用正则表达式解析的文法。会限制表达能力。

  现在主流的语言是分为词法和语法，是一种比较折中的方法。

[巴科斯诺尔范式](https://zh.wikipedia.org/wiki/巴科斯范式)：即巴科斯范式（英语：Backus Normal Form，缩写为 BNF）是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。

### 产生式（BNF）

* 用尖括号括起来的名称来表示语法结构名；
* 语法结构分成基础结构和需要用其他语法结构定义的复合结构；
  * 基础结构称终结符；
  * 复合结构称非终结符；
* 引号和中间的字符表示终结符；
* 可以有括号；
* \* 表示重复多次；
* \| 表示或；
* \+ 表示至少一次；

比如定义一个语言，只能有a和b：

```js
"a"
"b"
<Program>:= "a"+ | "b"+
// 如果只是上面那样的，就不能同时支持a和b
// 所以需要让语言可递归
// 想想递归的思路，仔细看看下面的表达式
<Program>:= <Program> "a"+ | <Program> "b"
// 这个就可以是aaabbb

// 定义一个Number
<Number> = "0" | "1" | "2" | .... | "9"
// 十进制数
<DecimalNumber> = "0" | {{ "1" | "2" | "3" | ... | "9"} <Number>* }
// 括号的表达式
<PrimaryExpression> = <PrimaryExpression> |
  "(" <LogicExpression> ")"
<MultiplicativeExpression> = <DecimalNumber> |
  <MultiplicativeExpression> "*" <PrimaryExpression> |
  <MultiplicativeExpression> "/" <PrimaryExpression>
// 加法和乘法混合的表达式如1 + 2 * 3，左项是1，右项是2 * 3
<AdditiveExpression> = <MultiplicativeExpression> |
  <AdditiveExpression> "+" <MultiplicativeExpression> |
  <AdditiveExpression> "-" <MultiplicativeExpression>

// 逻辑表达式
<LogicExpression> = <AdditiveExpression> |
  <LogicExpression> "||" <AdditiveExpression> |
  <LogicExpression> "&&" <AdditiveExpression>
```

这个就是BNF，是介于计算机和语言学之间的东西。上面这些东西的目的是如何定义语言，至于计算机如何分析上面这些东西，不是现在要关心的。

### 乔姆斯基谱系

下面的`?`是终结符。`::`是定义的意思，就是后面那个东西的定义是什么什么。

* 0型，无限制文法：

  上面的那一堆很规矩，左边只能有一个，而无限制文法，左右都很松。

  ```js
  ?::=?
  // 比如
  <a> <b> ::= "c" <d>
  ```

* 1型，上下文相关型文法：

  ```js
  ?<A>?::=?<B>?
  // 比如，虽然左右也可以有多个，但是中间只有一个是变化的，计算机处理的也是中间的那一部分，那一部分才是代码，计算机就是靠"a"和"c"来找解析的位置
  "a" <b> "c" ::= "a" "x" "b"
  ```

* 2型，上下文无关文法：等号左边只能有一个非终结符

  ```js
  <A>::=?
  // 上面写的那一堆表达式的定义就是上下文无关文法
  ```

* 3型，正则文法，只允许左递归：

  ```js
  // 如果A出现在了左边，右边只能出现在每个或的最开头
  <A>::=<A>?
  <A>::=?<A> // 这种就是不行的
  ```

练习：JS里面的get是哪种文法？

```js
{
  get a { return 1}
  get:1
}
```

是1型的，因为有一个a，这个是一个非终结符。这个也是JS里面为数不多的非2型的文法。JS中大部分都是2型的。

练习：`2 ** 1 ** 2`是几型文法？

是2型的，JS中的表达式都复合3型。

### 其他产生式

有EBNF、ABNF和自定义

JS中的词法定义都是用的`::`，语法定义都是用的`:`。

### 现代语言的特例

* C++中，`*`可能表示乘号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型；由于前面的声明可能出现在非常非常远的前面，所以语法就跟语义相关了，所以是非形式化语言，几型都不是。
* VB中，`<`可能是小于号，也可能是XML直接量的开始，取决于当前位置是否可以接受XML直接量；这个与JSX类似，这个可以认为是1型的文法。
* Python中，行首的tab符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或者dedent；这个老师也不知道。
* JavaScript中，`/`可能是除号，也可能是正则表达式开头，处理方式类似于VB，字符串模版中也需要特殊处理`}`，还有自动插入分号规则；这个与VB那个类似。

用那些形式化的几个类型去套语言的时候，很多时候也是大概的。所以基本上所有语言的产生式都不太符合BNF，都是自己搞了一套。

-[ 图灵机（Turing machine）](https://zh.wikipedia.org/wiki/图灵机)：又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。

[图灵完备性](https://zh.wikipedia.org/wiki/圖靈完備性)：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。

### 图灵完备性

跟图灵机等效的都具有图灵完备性，这是一个比较模糊的概念。图灵机就是凡事可计算的都能计算出来。

但不是世界上的一切东西都是可计算的，图灵停机问题，图灵机一定没有办法算出来另一台图灵机会不会停机。

所有的编程语言都要具有图灵完备性。

* 图灵完备性
  * 命令式：图灵机；
    * goto；这是实现方式
    * if和while，这是另外两种实现的方式。
  * 声明式：lambda
    * 递归

### 动态与静态

* 动态：
  * 在用户的设备/在线服务器上；
  * 产品实际运行时；
  * Runtime；因为是动态的，才会有运行时，因为是在用的时候才处理的。
* 静态：
  * 在程序员的设备上；
  * 产品开发时；
  * Compiletime；

越静态就越适合大规模开发，因为不容易出bug。

### 类型系统

JS没有逆变和协变。

* 动态类型系统与静态类型系统；

* 强类型与弱类型；就是有没有隐式转换；C++也是软类型，跟静态和动态没有关系。

  * String + Number；
  * String == Boolean；

* 复合类型

  * 结构体；

  * 函数签名；

    ```js
    {
      a: T1,
      b: T2
    }
    (T1, T2) => T3
    ```

* 子类型

  * 逆变/协变；凡是能用`Array<Parent>`的地方，都能用`Array<Child>`就是协变，凡是能用`Function<Child>`的地方，都能用`Function<Parent>`就是逆变。C#里面有。

![](http://www.zhuanyongxigua.cn/2020-04-19-094132.jpg)

所以表达式就是标识符和操作符。尽量写纯函数，不要用外面的变量，需要自律。

之前重学前端是用下面的思路讲的：这次的课程用上面的图的思路。

![](http://www.zhuanyongxigua.cn/2020-04-19-094356.jpg)

### 其他参考资料

- 终结符： 最终在代码中出现的字符（[ https://zh.wikipedia.org/wiki/ 終結符與非終結符）](https://zh.wikipedia.org/wiki/終結符與非終結符）)
- 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句
- 静态和动态语言：[ https://www.cnblogs.com/raind/p/8551791.html](https://www.cnblogs.com/raind/p/8551791.html)
- 强类型： 无隐式转换
- 弱类型： 有隐式转换
- 协变与逆变：[ https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html](https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html)
- Yacc 与 Lex 快速入门：[ https://www.ibm.com/developerworks/cn/linux/sdk/lex/index.html](https://www.ibm.com/developerworks/cn/linux/sdk/lex/index.html)
- 关于元编程：[ https://www.zhihu.com/question/23856985](https://www.zhihu.com/question/23856985)
- 编程语言的自举：[ https://www.cnblogs.com/lidyan/p/6727184.html](https://www.cnblogs.com/lidyan/p/6727184.html)
- 推荐阅读：ECMA-262 Grammar Summary 部分



## 重学前端week02第二节词法/类型

ASC是最初的字符，是键盘上面的。Unicode包含了ASC，是现在运用的最广泛的字符集。下面那个fileformat的网站，主要看两个部分，一个是blocks，一个是categories。

```js
// 这个可以打印出所有的可用的字符
for (let i = 0; i < 128; i++) {
  console.log(String.fromCharCode(i))
}
// 打印出来的会有一堆空的东西，这些空的东西在https://www.fileformat.info/info/unicode/block/basic_latin/list.htm，其中0007会有声音
// 需要记住的有LINE FEED(换行U+000A), SPACE(U+0020)
// 汉子的范围也可以在这个东西里面找，是在U+4E00开始的block里面，CJK Unified ideographs，日韩的字符也在这个里面，有两万多个字符，到U+9FFF
// https://www.fileformat.info/info/unicode/block/cjk_unified_ideographs/index.htm
// 但是后面还要很多的CJK的增补的区域
// 此外还有一个BMP(基本字符平面)的概念，就是没有超过四位的范围，四位最多是到U+FFFF，可以使用charCode这个API，后面的就需要使用String.fromCodePoint或者String.codePointAt，超过的以后会用到的可能是emoji
// 在BMP内的字符都可以做变量名，比如中文。
var 厉害 = 1
console.log(厉害)
// 但是不要这样搞，变量名不要超过ASC的范围。如果超过了，就涉及到文件的编码的问题，可能会导致问题。
// 如果一定要使用中文，可以用\u转义
// 得到16进制的数，用"厉害".codePointAt(0).toString(16)这样可以得到“厉”的16进制，然后再把0改成1，就得到了“害”的16进制数
var \u5389\u5bb3 = 1
// 所以，如果一定要用中文做变量的话，可以这样，或者手动处理，或者搞一个自动化脚本，转一下。
```

#### Categories

重点讲了Separator Space，就是各种各样的空格，宽度不一样，可能会占用8位，也可以是1/6的宽度，所有Unicode里面的Space都是JS里面合法的Space。比如零宽空格。

### JavaScript

把Grammar Summary里面的输入的字符简化了：

**InputElementDiv**： 

* WhiteSpace，空格或者Tab符，里面有一个USP就是Unicode里面的那些空白字符。Tab也叫做制表符，也就是`\t`，codePointAt转一下就出`9`，因为做表格的时候方便。

  ```js
  30	50
  1		60
  901	9
  ```

  上面的中间都是tab，901后面是一个tab，第一行中间也是一个tab，排列的很整齐。

  tab的缺点是有size的限制。缩紧的时候一不小心弄了一个空格进去也看不出来。

  VT是纵向制表符。`\v`，转一下是`11`。

  FF是FORM FEED。42分钟。FORM FEED是翻页，最开始的时候是给打印机设计的，就是进一张纸。与LINE FEED对应，LINE的是换行。

  SP，普通空格，32.

  NBSP，就是`&nbsp;`。no break space。就是在屏幕小的时候，不会把单词打断了换行，而是把一个单词整体挪到下一行去。跟CSS里面的有个设置很像。有了`&nbsp;`，连这个空格也不会被打断，空格会随着空格两边的东西一块换行。在视频的47分钟。

  ZWNBSP，zero width no break space。是U+FEFF，FEFF不在Unicode里面，它也叫BOM，bit order mask，是微软当时用来判断文件格式用的东西。淘宝的前端为了防止代码在有些情况下被吞掉一个字符，会在每一行前面加一个空行。

* LineTerminator，换行符。有这几种：

  ![](http://www.zhuanyongxigua.cn/2020-04-21-023810.png)

  CR那个就是回车的由来，是`\r`。正常情况下应该统一使用`\n`，也就是LF。

  JS代码要限制在ASC范围之内，如果超了，也要限制在BMP之内。

* Comment；注释

  这个在写注释的时候写一个转义字符代替星号是不行的，比如`/*\u002a/`就是错误的，一定是`/**/`，且不能嵌套。

* Token，上面三种都是无效的字符，这里的Token就是有效的输入，标识什么的。在安全领域就是令牌的意思。下面是老师简化的分类：前两个是帮助程序形成结构用的，后面两个是自己写的有效信息。这四种构成了代码的主体部分。

  * Punctuator；括号等号什么的。
  * Keywords；let/for/while这种是属于keyword。
  * Identifier；标识符，就是名字。一般是变量名。
  * Literal；字面量。

* Atom

* Expression

## 参考链接：

- 讲师提供：
  - https://home.unicode.org/
  - https://www.fileformat.info/info/unicode/
- 学员提供：
  - 计算浮点数的一个工具：[ https://github.com/camsong/blog/issues/9](https://github.com/camsong/blog/issues/9)
- 有助于你理解的知识：
  - 正则表达式：[ https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
  - 揭秘 0.1 + 0.2 != 0.3 https://www.barretlee.com/blog/2016/09/28/ieee754-operation-in-js/
  - ASCII，Unicode 和 UTF-8 ：[ http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

## 参考名词：

- [字符集](https://zh.wikipedia.org/zh/字符编码)：字符编码（英语：Character encoding）、字集码是把字符集中的字符编码为指定集合中某一对象（例如：比特模式、自然数序列、8 位组或者电脉冲），以便文本在计算机中存储和通过通信网络的传递。常见的例子包括将拉丁字母表编码成摩斯电码和 ASCII。其中，ASCII 将字母、数字和其它符号编号，并用 7 比特的二进制来表示这个整数。通常会额外使用一个扩充的比特，以便于以 1 个字节的方式存储。在计算机技术发展的早期，如 ASCII（1963 年）和 EBCDIC（1964 年）这样的字符集逐渐成为标准。但这些字符集的局限很快就变得明显，于是人们开发了许多方法来扩展它们。对于支持包括东亚 CJK 字符家族在内的写作系统的要求能支持更大量的字符，并且需要一种系统而不是临时的方法实现这些字符的编码。
- [Unicode ](https://zh.wikipedia.org/zh-hans/Unicode)：中文：万国码、国际码、统一码、单一码。是计算机科学领域里的一项业界标准。它对世界上大部分的文字系统进行了整理、编码，使得电脑可以用更为简单的方式来呈现和处理文字。
- [ASCII ](https://zh.wikipedia.org/wiki/ASCII)：（American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统。它主要用于显示现代英语，而其扩展版本延伸美国标准信息交换码则可以部分支持其他西欧语言，并等同于国际标准 ISO/IEC 646。美国信息交换标准代码是这套编码系统的传统命名，互联网号码分配局现在更倾向于使用它的新名字 US-ASCII[2]。美国信息交换标准代码是美国电气和电子工程师协会里程碑之一。
- Token：记号、标记。JS 里有效的输入元素都可以叫 Token。
- [NBSP ](https://zh.wikipedia.org/wiki/不换行空格)：不换行空格（英语：no-break space，NBSP）是空格字符，用途是禁止自动换行。HTML 页面显示时会自动合并多个连续的空白字符（whitespace character），但该字符是禁止合并的，因此该字符也称作“硬空格”（hard space、fixed space）。Unicode 码点为：U+00A0 no-break space。
- [零宽空格](https://zh.wikipedia.org/zh-hans/零宽空格)：（zero-width space, ZWSP）是一种不可打印的 Unicode 字符，用于可能需要换行处。在 HTML 页面中，零宽空格可以替代。但是在一些网页浏览器（例如 Internet Explorer 的版本 6 或以下）不支持零宽空格的功能。