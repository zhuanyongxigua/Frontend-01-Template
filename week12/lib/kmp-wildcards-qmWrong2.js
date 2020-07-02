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
  