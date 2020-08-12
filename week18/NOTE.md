# 重学前端week18第一节Dev工具

现实中都是在做选择题，不是重新做一个工具。

### Server

* build：webpack babel vue jsx postcss
* watch：fsevent
* mock：
* http：ws

###  Client

* debugger：vscode devtool
* source map

### webpack

推荐import语法，因为在ECMA-262里面可以看到Scripts and Modules章节中的ModuleItem必须要在最外层有ImportDeclaration的，这样静态分析就很方便，我们不需要完整的解析js，就可以拿到import。就可以用正则这种相对简单的东西去处理import语句。所以import单独成语句的特性会给我们带来很大的便利。用import做webpack的话会比以前的webpack容易得多。

### babel

babel的core里面，如果写plugin会用到。

### vue-compiler

看了vue-next/packages/compiler-sfc。直接npm安装了这个包。不会用的话就可以看这个东西的测试用例，这本身也是一个非常好的实践。

### npm

npm也是一个官方包。`npm install npm`。

npm包没有文档。

这个就体现出yeoman的好处了，yeoman相当于封装了一波npm，yeoman是有文档的。

在js里面正则用的好不好，不是看记得标志多不多，而是看exec用的好不好。可以去leetcode里面wildcards题给ac（通过）了。

工具链里面如果自己做的话最难的也就是文本的处理，而文本的处理学了状态机，学了kmp，四则运算，http的解析，html的解析，wildcards什么的，都搞懂了，也很容易。充其量再学一下现成的工具。

唯一一个做不了的是babel，js的ast搞不了。

### fsevents

不写工具基本上用不到。

```js
const fsevents = require('fsevents');
// 也可以监测到变化就运行webpack
// const { exec } = require('child_process');
// 监听当前的文件夹有无更改，比如添加文件之类的
const stop = fsevents.watch(__dirname, (path, flags, id) => {
  const info = fsevents.getInfo(path, flags, id);
  console.log(info);
  stop();

  // exec('webpack');
});
```

fsevents使用c写的，里面引用了一个c的包，就是node为后缀的那个。

除了fsevents，也可以用require的方式调用webpack，这样结束的时间点也可以知道。用fsevent就是合并多次的任务。

## Mock

mock一般还是跟公司内部的情况绑定的程度很高。

## debugger

前端的调试有inspector和debugger，inspector就是chrome开发者工具里面的那个Elements，debugger就是Sources了。

> 调试时的断点的原理？

![](http://www.zhuanyongxigua.cn/2020-08-06-153329.jpg)

带断点之后，node启动的时候会带一个参数，然后node会开一个websocket，这个给vscode监听。

一次debug里面有两个对象，第一个是node启动的debuger的server，这个server跟v8在同一个进程里面，所以它能控制v8。第二个是vscode作为一个client，他跟node启动的websocket通讯，他们之间传递我们在客户端上打断点，写debugger这些命令。v8执行这些被命令标记的语句的时候，就会在websocket里面发布对应的事件。然后vscode就能把它停掉了。

按照这个思路来，我们有几种server？

electron，node，browser。同时要有同进程或不同进程的debugger的client。debugger是分server和client的。

chrome的devtools是一个标准的client。他也有自己的协议，所以自己写的东西满足了这个协议，也就可以用这个devtools来调试。具体见：https://chromedevtools.github.io/devtools-protocol/

可以看1.3的版本：https://chromedevtools.github.io/devtools-protocol/1-3/Debugger/

sourceMap的文档：https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/preview#



然后说了一下之前写的那个loader的问题，是有第二个参数的，就是sourceMap相关的东西，做loader，也要同时生成一个map，要不没法debug了。

https://webpack.js.org/contribute/writing-a-loader/#simple-usage

实际上是return一个数组，第二个就是loader。

> 线上sourcemap？

有一个很骚的操作，把publish的版本也加上sourcemap，但是只限定公司内网能打开，外网的可以看到这个文件，但是打不开。这样就可以调试线上代码了。

### ws

实际上安装了一个http-server

杭州最好就是字节和阿里。网易相对较差。滴滴也可以。极客时间也可以。深圳只进腾讯吧。阿里可以同时投十多个部门。shopee，厦门的cocos，新加坡的机会也可以考虑。

有些面试官不但关心技术，还关心你这个人怎么样，薪资什么的，对他们有没有兴趣，这种就是manager，是一定要留一个微信的，方便随时问进度。只问技术的就属于交叉面试，不直接负责的。一般要面试官的微信，面试也会给的。

其实跟其他公司的jd是很难完全match的，有核心竞争力的话这里不要，其他地方也会要的。

公司付钱不是为了帮你成长，是用你的时间让公司成长。这点要想清楚。

# 重学前端week18第二节工具链｜设计并实现一个单元测试工具

最重要的nyc这个东西。比mocha重要一万倍。

animation那个课程里面的xanimation也是一个测试。只不过很粗糙。方法简陋，case缺乏管理，测试结果是非自动化产出。所以不是一个工程意义上的单元测试。

工程上的单元测试有两个目标，一个是自动化的结果评判（需要人肉去看的就是非自动化的）。第二个case要有管理，比如那个xanimation是一步一步写出来的，只不过最后把之前的东西都扔了，这个是不对，一步一步的东西是要保留的。

覆盖率80%以下就相当于没有，90%以上就很高了。

在webpack里面使用import的方法，是把nodejs升级成14.7.0的版本，然后在package.json里面加一个`"type": "module"`。需要注意的是，这个改成了module之后就不能用require语法了。

期间遇到了问题，用了上面import的新语法，nyc无法检测，所以还是要用require。而webpack打包出来的东西是无法直接调用的，所以直接用babel转。

最后工具链集成的那个工具都体现在了package.json的scripts里面了。

mocha也有dom相关的api。不过由于dom相关的东西很复杂，所以一般不会放在单元测试里面，所以一般会用headless browser，但是这样再用mocha，是一个很麻烦的事情。

所以目前要做带测试的工具链的话，还是要把精力放在基础库上面。

覆盖率一般用行覆盖率，分支覆盖率函数覆盖率等一般不怎么用。行覆盖率高，说明用例都覆盖到了。

test case 除了需要抛错（验证错误，就是看自己写的库的抛错机制是不是好用的）的情况，都不需要做错误处理，也就是trycatch，因为如果出错了就test fail了。

react的虚拟dom是可以单元测试的，真实的dom很难。mocha其实功能不太强，真正工作量大的比如sprite里面的需要做图片的比对，这个代码量是非常大的。社区的方案，基本上都是有那么一个东西，但是真正用起来，永远都不会那么的舒服。

真正自己做开源的项目的时候把单元测试都加上，把标签也都加上，标签就是下面那些东西：

![](http://www.zhuanyongxigua.cn/2020-08-09-152821.png)

这些标签里面有代码覆盖率的东西。