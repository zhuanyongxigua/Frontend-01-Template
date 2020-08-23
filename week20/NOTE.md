# 重学前端week20第一节发布系统｜lint与PhantomJS

phantomjs：

```js
var page = require('webpage').create();
page.open('http://localhost:8080/', function(status) {
  console.log('Status: ' + status);
  if (status === 'success') {
    var body = page.evaluate(function() {
      var toString = function(pad, element) {
        var children = element.childNodes;
        var childrenString = '';
        // !!!
        for (var i = 0; i < children.length; i++) {
          childrenString += toString("    " + pad, children[i]) + "\n";
        }
        var name;
        if (element.nodeType === Node.TEXT_NODE) {
          name = "#text " + JSON.stringify(element.textContent);
        }
        if (element.nodeType === Node.ELEMENT_NODE) {
          name = element.tagName;
        }
        return pad + name + (childrenString ? "\n" + childrenString : "");
      }
      return toString("", document.body);
    });
    console.log(body);
  }
  phantom.exit();
});
```

这种东西调试真的是难受，上面代码感叹号地方的循环，本来写了一个let，接近小时的时间翻来覆去的尝试，未果。灵机一动，把let改成了var。。。可以了。。。

如果需要对页面里面的图片进行检查，就可以使用phantomjs，它不适合做一些线上的服务，比如服务端渲染用这个，就是找死。另外主要的场景是冒烟测试。一般就是检查字符串是不是想等。

做工程不能局限在分工上面，比如你是前端，做工程化不一定都是前端的工程化，可能场景需要会把设计的活也包含进去，要把屁股坐高。比如阿里的飞冰。

然后就开始将mocha-phantomjs了。不是特别推荐用，但是要知道有这么个东西。课上尝试失败了。可能是跟mocha的版本对不上的问题。

然后开始将eslint：

```yaml
npx eslint --init
# 然后选择第三个，一般都是会强制执行code style的，第三个就是To check syntax, find problems, and enforce code style
npx eslint ./src/main.js
# 你不会用eslint去检查build出来的东西的。
```

如果有人lint检查没有通过，但是是通过改eslint rule的方式通过的，那可以就地打死了。

rule是一个可开发的东西，可以写成函数的。去eslint包里面，也有rule文件夹，里面有原始的规则，一堆一堆的函数。不过基本上没什么人写。社区的规则（比如airbnb的规则）都多。

重点提了一下settings这个东西：

```js
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    "semi": "error",
    "no-unused-vars": "off"
  },
  "settings": {
    "react": {
      "createClass": "createReactClass",
      "pragma": "createElement",
      "version": "detect",
      "flowVersion": "0.53"
    }
  }
};
```

代码里面有`<`这种东西的时候是会调用createElement的，但是eslint和编辑器并不认识这个东西，在编辑器里面引入了createElement，但是不是高亮的，就是不是引用的状态。pragma默认的是React，不改成createElement的话，eslint又回报错，这个东西没有引用。

简历上不写薪资，写技术栈其实也没什么意义。如果面试官不能现场出题考核你，说明他水平不太行。

举例你用技术为业务带来了哪些贡献。有两个重点，你怎么证明技术跟业务的联系，第二个是怎么衡量你业务上的贡献。可以提供一些侧面的证据，比如产品经理的反馈很高，是一个讲故事的能力。不好衡量的话，逻辑关系也是要有的。表示你思考过了。比如你这个设备一台1000w，你卖了100台，这里面可以暗示你做了多少。**一定要对业务熟悉**。比如前端team是我带着一个新人开始干的。有些业务是直接赚钱，有些业务是是看uv，pv。

toB的讲pv/uv就有点神经病了，看你卖了多少lisence。**能从工作中学习这些东西也是一个很重要的素质**。

积累的很多了再去创业，不要感觉升不上去了再去创业。

一些人专门做基建，一些人专门做业务，会造成成长速度不一致。所有人都做一点基建，做一些业务，会造成基建可能会停滞的情况。两种方式都可以，要根据现实情况自圆其说。面试官需要的是你根据实际情况分析，是没有标准答案的。

做页面测试用位置找是不太科学的，因为不同的浏览器位置可能不一样，比较好的是用路径或者id。

简历上写实际情况，不要写太抽象的东西，比如“有管理经验”就不如“带5-10人团队”。

P7会关心团队的成长，p6只是带人保质保量的完成任务。

判断你能不能晋升，看两点，一个是能力够，一个是业绩够。只是有功劳，不行，只是有苦劳也不行。要有本事又有功劳。


# 重学前端week20第二节发布系统｜认证

介绍了github的OAuth。

https://developer.github.com/apps/building-oauth-apps/

重点就是第一条和第三条。

然后具体讲了第三部里面的参数。其中把重定向的那个链接用encodeURIComponent编码了一下。

### 获取code（publish-tool 唤起浏览器）

最后的请求OAuth的链接是：

```yaml
https://github.com/login/oauth/authorize?client_id=Iv1.75519f7644e273e5&redirect_uri=http%3A%2F%2Flocalhost%3A8080&scope=read%3Auser&state=123abc
```

这个链接需要跳转到github让用户去登陆github的，不是自己默默的get请求。登陆完成了之后，用户点击了授权，github就是跳转到你在github里面输入的那个callback_url：

```yaml
localhost:8080/?code=2b....&state=123abc
```

其中那个code就是OAuth的入场券（不是通行证，不是token），是用来换token的，因为token不能直接放在url里面，因为这样非常的危险。state可以防止一些跨站攻击。

### 然后就是换token（publish-server）：

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github

client_secret是要保密的，client_id是可能会被猜出来的。

微信公众号那个OAuth不是一个标准的OAuth，github的是比较标准的。

```js
let code = "2b....";
let state = "123abc";
let client_secret = "....";
let client_id = "...";
let redirect_uri = encodeURIComponent("http://localhost:8080");

let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

let xhr = new XMLHttpRequest;

xhr.open('POST', `https://github.com/login/oauth/access_token?${params}`, true);
xhr.send(null);

xhr.addEventListener("readystatechange", function(event) {
  if(event.readystate === 4) {
    debugger;
    console.log(event.responseText);
  }
});
```

然后就可以拿到access_token了。上面这段代码可以找一个github的页面，打开它的控制台，然后运行，在其他的页面可能会跨域。

data事件得到的一个buffer，可以直接toString得到结果。



由于最后publish-tool需要拿到token，所以它也要有一个server。



一般情况下的callback hell都是假的，只有流式处理的callback才是hell，因为需要对顺序有非常好的了解。