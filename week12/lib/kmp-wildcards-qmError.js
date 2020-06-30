// 这个是反面教材的例子, 思路有问题
// 没有做对
function find(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  let k = 0;
  let start = false;
  for (let j = 1; j < pattern.length; j++) {
    if (pattern[j] === pattern[k] && pattern[j] !== '?') { // 后面的不等于为了排除问好与问好比较的情况，下同
      k++;
      start = true;
    } else if (pattern[k] === '?' && pattern[j] !== '?') { // ?在前半部分的情况
      k++;
    } else if (pattern[j] === '?') { // ?在后半部分的情况
      if (pattern[j + 1] === '?' || pattern[j + 1] === pattern[k + 1] || table[j - 1] !== 0) {
        k++;
      }
    } else if (table[j - 1] !== 0 && pattern[table[j - 1] - 1] === '?') {
      // 循环处理连续问好的情况
      if (!start) {
        const temp = table[j - 1];
        for (let i = temp - 1; i >= 0; i--) {
          if (pattern[i] === '?') {
            table[j - 1 - (temp - 1 - i) + 1] = table[j - 1 - (temp - 1 - i)];
            if (k < table[j - 1 - (temp - 1 - i)]) {
              k = table[j - 1 - (temp - 1 - i)]
            }
          }
        }
      }
    } else {
      k = 0;
    }
    table[j] = k;
  }
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    // console.log(source[i], pattern[j]);
    if (source[i] === pattern[j] || pattern[j] === '?') {
      j++;
    } else {
      while (source[i] !== pattern[j] && pattern[j] !== '?' && j > 0) {
        j = table[j - 1];
      }
      if (source[i] === pattern[j] || pattern[j] === '?') {
        j++;
      } else {
        j = 0;
      }
    }
    if (j === pattern.length) {
      return true;
    }
  }
  return false;
}

module.exports = find

console.log(find('abcdeabcdeabcda', 'abcde??cda'));
