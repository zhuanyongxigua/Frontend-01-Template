function find(source, pattern) {
  let table = new Array(source.length).fill(0);
  let k = -1;
  table[0] = -1;
  for (let i = 0; i < source.length - 1; i++) {
    if (k === -1 || source[k] === source[i]) {
      k++;
      table[i + 1] = k;
    } else {
      k = table[k];
      i--;
    }
  }
  for (let i = 0; i < source.length; i++) {
    let j = 0;
    for (j; j < pattern.length; j++) {
      if (source[i] === pattern[j] || pattern[j] === '?') {
        i++;
      } else {
        break;
      }
    }
    i -= j;
    if (j === pattern.length) {
      return true;
    }
    let move = j - table[j];
    i += move - 1;
  }
  return false;
}

module.exports = find
