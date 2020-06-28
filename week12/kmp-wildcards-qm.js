function find(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  let k = 0;
  for (let j = 1; j < pattern.length; j++) {
    if (pattern[j] === pattern[k] || pattern[j] === '?' || pattern[k] === '?') {
      k++;
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
// console.log(find('xyab', 'ab'));
// console.log(find('xyab', 'ac'));
// console.log(find('xyaab', 'ab'));
// console.log(find('abcabcabe', 'abcabe'));
// console.log(find('abcabcabc', 'abcabe'));

// Wildcard question mark
// console.log(find('ab', 'a?'));
// console.log(find('xyab', 'a?'));
// console.log(find('xyab', '?a'));
// console.log(find('xyaab', 'a?'));
console.log(find('abcabcabe', 'a?cabe'));
// console.log(find('abcabcabc', 'abcabe'));



// console.log(find('a', '?'));
// console.log(find('abc', 'a?c'));
// console.log(find('abcde', 'a?c?e'));
// console.log(find('abcde', 'a???e'));
// console.log(find('abcde', '?bcde'));
// console.log(find('abcde', 'abcd?'));
// console.log(find('bbcde', 'a?cde'));
// console.log(find('bacde', '?bcde'));
// console.log(find('bbcde', 'abcd?'));


// 还要用上面的例子分别作出一组反例来