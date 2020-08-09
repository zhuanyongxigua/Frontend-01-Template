const fsevents = require('fsevents');
// 监听当前的文件夹有无更改，比如添加文件之类的
const stop = fsevents.watch(__dirname, (path, flags, id) => {
  const info = fsevents.getInfo(path, flags, id);
  console.log(info);
  stop();
});