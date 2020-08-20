# 重学前端week19第一节工具链｜目录结构与初始化工具

没什么可记的，主要就是在用yeoman拷贝模版

脚手架里面模版中的那个要安装的东西的版本的管理，要看你要做什么，可以让用户输入版本，如果用户都是使用最新版，那就不写固定版本号。

# 重学前端week19第二节工具链｜发布

有三个东西，一个是线上的server，也就是生产环境的server；一个是发布用的server，作用是把收到的东西更新到线上server对应的位置；还有一个就是发布的工具了，作用是把本地需要发布的东西发送到发布server里面。

本地publish工具：
```js
const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const archiver = require('archiver');

let packname = './package';

// fs.stat(filename, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 3000,
    path: '/wtf?filename=' + 'package.zip',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var archive = archiver('zip', {
    zlib: { level: 9 }
  })
  archive.directory(packname, false);
  archive.finalize();
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  })
  archive.pipe(req);
  archive.on('end', () => {
    req.end();
  })
  // let readStream = fs.createReadStream('./cat.jpg');
  // readStream.pipe(req);
  // readStream.on('end', () => {
  //   req.end();
  // })
// })
```

发布server：
```js
const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');

const server = http.createServer((req, res) => {
  let writeStream = unzip.Extract({path: '../server/public'});
  // req.pipe(writeStream);
  // 如果不用pipe，也可以这样写
  req.on('data', trunk => {
    writeStream.write(trunk);
  });
  req.on('end', trunk => {
    writeStream.end(trunk);
  })
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  })
})

server.listen(3000);
```

这个工具做出来之后是会在package.json中的scripts里面有一个publish的命令的。
