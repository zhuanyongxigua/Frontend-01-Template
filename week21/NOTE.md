毕业总结不知道写什么，也不想写课程的流水账，每周的NOTE里面都有了，于是这几天就把知识体系认真的整理了一边：
https://github.com/zhuanyongxigua/Frontend-01-Template/blob/master/week21/%E5%89%8D%E7%AB%AF%E4%BC%9A%E4%BB%80%E4%B9%88.xmind

# 重学前端week21｜发布系统｜Git Hook

### git hooks基础知识

在命令行运行命令`open .`就是finder打开当前文件夹，如果有.git文件夹的话，默认是看不到的，用cmd+shift+.就可以看到了。里面有hooks的文件夹，里面有很多的.sample文件，一般我们会用到的就是pre-commit.sample和pre-push.sample。这两个东西是脚本，是shell脚本，它的第一行是`#!/bin/sh`，就是有什么运行这个东西(在linux体系下把一个脚本变成可执行的，就在第一行加上`#!/bin/sh`)，把它改成`#!/usr/bin/env node`就是nodejs脚本。

在`.git`文件夹里面找hooks，创建一个叫pre-commit的文件，这个文件是可以添加到git commit里面的，不过需要权限。

通过`ls -l .git/hooks/pre-commit`可以查看这个文件的权限。

效果是：

```
-rwxr-xr-x  1 yuxin  staff  52 Sep  3 22:45 .git/hooks/pre-commit
```

最后一个`-x`就是other，想要去掉这个权限就是`chmod o-x .git/hooks/pre-commit`。

这个东西可以除了第一个`-`，可以看成是三位为一组的二进制位，由于每一组有三位，三位二进制数最大就是7，所以7就是最大的权限，所以给所有人加上所有权限就是777了。

运行`chmod 777 .git/hooks/pre-commit`之后再运行`ls -l`的效果就是:

```
-rwxrwxrwx .....
```

一般是给744，就是ower是可以读/写/执行的，其他的人只能读。所有人都能写，但是不能执行就是666。

通过`chmod +x .git/hooks/pre-commit`给这个文件添加权限，添加权限还可以用`chmod +777`，但是一般最好不用，这个是所有的权限。`+x`就是可执行权限。这个时候再commit，就可以看见这个文件运行了。

```
#!/usr/bin/env node

console.log("hook is running");
```

chmod命令就是加减号，权限有三种rwx(read/write/excute)，都加就是`chmod +rwx`，都去掉就是`chmod -rwx`。

https://www.howtogeek.com/437958/how-to-use-the-chmod-command-on-linux/

git hooks里面的sample都是用python写的，阻止这个hook的方式是`exit 1`。

在node里面用`process.exit(1)`。

```js
#!/usr/bin/env node

const process = require("process");

console.log("hook is running");

process.exit(1);
```

这个操作的作用就是eslint或者单元测试了，如果lint没有通过那就阻止这次commit。

pre-push也是常用的，比如有些分支是不能提交的，那在local就处理了。

可以在yoeman generator中添加git hooks，然后生成的就可以直接用了。

### 如何在git hooks中执行eslint

这个lint操作是不能自动修复的，因为出了问题无法追责。自动修复是要在主动的调用lint的时候执行的。比如添加分号的事情就很容易出错。所以在git hook里面要做的事情不多。不要作开发者不知道的默默修改的操作。

可以在pre-push的hook里面做柔性检查，就是允许你跳过，谁跳过谁承担责任就可以了。

https://eslint.org/docs/developer-guide/nodejs-api

```js
#!/usr/bin/env node

const process = require("process");
const { ESLint } = require("eslint");

(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["./main.js"]);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log(results);
  for(let result of results) {
    if(result.errorCount > 10) {
      process.exitCode = 1;
    }
  }
  process.exitCode = 1;
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
})

console.log("hook is running");

process.exit(1);
```

一般pre rebase是不会检查的。

然后说了一个git stash，因为做实验，所以需要暂存一下。

由于在实际使用的时候，每次commit的时候可能不想lint，所以在pre-push检查会比较好（但是在这个里面试需要server，比较麻烦，所以课上用pre-commit展示的）。

```js
#!/usr/bin/env node

const process = require("process");
const child_process = require("child_process");
const { ESLint } = require("eslint");

function exec(command) {
  return new Promise(resolve => {
    child_process.exec(command, resolve);
  })
}

(async function main() {
  const eslint = new ESLint();
  await exec("git stash save -q --keep-index);
  const results = await eslint.lintFiles(["./main.js"]);
  await exec("git stash pop");
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log(results);
  for(let result of results) {
    if(result.errorCount > 10) {
      process.exitCode = 1;
    }
  }
  process.exitCode = 1;
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
})

console.log("hook is running");

process.exit(1);
```

### web hook

#### github

在push的时候服务端会有一个pre-receive.sample的动作。但是一般在服务端处理会比较少，所以用web hook。

我们是等待接收github的post请求。一般企业用的都是gitlab。这个比较难做，可能要一两个月。

如果硬要写一个服务端的hook，就是写一个pre-receive的hook。

# 重学前端week21第二节发布系统｜使用无头浏览器与DOM检查

首先大部分时间在装东西，学习了ssh原来是有一个服务的，可能需要启动：

```makefile
sudo apt install openssh-server
sudo service ssh start
sudo service ssh status
```

然后为了防止虚拟机的ssh被防火墙阻断，所以还要设置一下，云端的也有可能，也需要设置防火墙什么的。

virtualBox在setting的network的advance的Port Forwarding加一个规则，Host Post是2222，Guest Post用的22。

在确保ssh是active的状态的情况下，用下面的命令尝试传个东西到linux：

```make
scp -P 2222 ./browser-sync.config.js yu@127.0.0.1:~
```

然后把server传到linux：

```make
scp -P 2222 -r ./server yu@127.0.0.1:~
```

想要在外面访问，还是要配置一个端口转发，同上，把3000转发到3000.

然后可以配置一个域名，方法是修改本地的`/etc/hosts`。

```make
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1 yuxinjs.io
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost

106.186.114.44 www.vpncloud.me #vpncloud_generated
106.186.114.44 vpncloud.me #vpncloud_generated
106.186.30.32 www.ytpub.com #vpncloud_generated
106.186.30.32 ytpub.com #vpncloud_generated
106.186.30.32 www.yuntibit.com #vpncloud_generated
106.186.30.32 yuntibit.com #vpncloud_generated
```

这个是搞着玩的。

> 前端工作必要的流程有哪些？

组件化，工具链，发布是一个前端工作的必要的流程的三个部分（也是三个工程体系，或者说是工程技能）。以后的晋升也是针对这几个方面来做的。

面试就是挑这个人最擅长的东西，问到底，比如他说擅长js，那就按照知识体系问一波。

搞定了一个领域，就是P7，比如持续集成，比如工具链。搞定了一个行业，就是P8。

P6就是要把项目的一切问题解决。喷PM也是解决问题的一个方式。。。但是不推荐。

如果leetcode已经不能满足了，可以去刷poj.org。
