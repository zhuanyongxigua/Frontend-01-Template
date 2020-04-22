### 正则匹配所有Number直接量

```js
let reg = /[\d]{1,16}|(?:[1-9]+\.[\d]+)|(NaN)|0[xX][1-9a-f]+/
```

### encode utf-8 function

```js
function utf8Encode(str) {
  return str.split('')
    .map(item => `\\u${item.charCodeAt().toString(16)}`)
    .join('')
}
```

### 正则匹配字符串直接量，单引号和双引号

```js
let reg = /?:[^"]|\.)*"|'(?:[^']|\.)*|^[\u4E00-\u9FA5A-Za-z0-9]+$/
```