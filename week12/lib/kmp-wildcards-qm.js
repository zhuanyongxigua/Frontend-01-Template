function find(source, pattern) {
  let j = 0;
  let queue = [];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === pattern[j] || pattern[j] === '?') {
      j++;
    } else {
      let curIndex = i;
      for (let t = j - 1; t >= 0; t--) {
        if (source[curIndex] === pattern[t] || pattern[t] === '?') {
          queue.push(pattern[t]);
          curIndex--;
        } else {
          if (queue.length !== 0) {
            curIndex = i;
            queue.shift();
            if (!queue.length) {
              t++;
            } else {
              let length = queue.length;
              for (let f = 0; f < length; f++) {
                let temp = queue.shift();
                if (source[curIndex] === temp || temp === '?') {
                  t = t + queue.length + 2;
                  break;
                }
              }
            }
          }
        }
      }
      if (!queue.length) {
        j = 0;
      } else {
        j = queue.length - 1;
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
