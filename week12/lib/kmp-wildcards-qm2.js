function find(source, pattern) {
  let table = new Array(source.length).fill(0);
  let k = -1;
  table[0] = -1;
  for (let i = 0; i < source.length - 1; i++) {
    if (k === -1 || source[k] === source[i] || source[k] === '?' || source[i] === '?') {
      k++;
      table[i + 1] = k;
    } else {
      k = table[k];
      i--;
    }
  }
  // let j = 0;
  // while (j < source.length - 1) {
  //   if (k === -1 || source[k] === source[j] || source[k] === '?' || source[j] === '?') {
  //     k++;
  //     j++;
  //     table[j] = k;
  //   } else {
  //     k = table[k];
  //   }
  // }
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
console.log(find('abcdeabcdeabcda', 'abcd??bcda'));
console.log(find('abcdeabcdeabcda', 'abcde??cda'));

module.exports = find
