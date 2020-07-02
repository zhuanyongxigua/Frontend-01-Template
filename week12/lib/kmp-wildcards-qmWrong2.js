// 直接造一个完美的table是不可能的
// 因为ab??eabcda这样的模式串有不同的table，都是合理的
// 比如000001234
// 比如0001234343
// 比如001201234
// 比如000121234
// 比如000012000 对应abeaeabcda
// 不过应该可以想办法改进，比如第一种table的第一个1是所有的table最靠后的第一个1
// 所以如果用一个table匹配失败了，可以试着把这个table的第一个1向后移动，然后再匹配
function find(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  let k = -1;
  table[0] = -1;
  for (let i = 0; i < pattern.length - 1; i++) {
    if (k === -1 || pattern[k] === pattern[i] || pattern[k] === '?' || pattern[i] === '?') {
      k++;
      table[i + 1] = k;
    } else {
      k = table[k];
      i--;
    }
  }
  let i = 0;
  while (i < source.length) {
    let j = 0;
    while (j < pattern.length) {
      if (source[i] === pattern[j] || pattern[j] === '?') {
        i++;
        j++;
      } else {
        break;
      }
    }
    i -= j;
    if (j === pattern.length) {
      return true;
    }
    let move = j - table[j];
    i += move;
  }
  return false;
}
  
console.log(find('abcdeabcdeabcda', 'ab??eabcda'));
// console.log(find('abcdeabcdeabcda', 'abcd??bcda'));
// console.log(find('abcdeabcdeabcda', 'abcde??cda'));
// console.log(find('xyab', 'ac'));

module.exports = find
