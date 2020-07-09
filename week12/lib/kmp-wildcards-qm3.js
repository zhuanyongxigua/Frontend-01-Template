class WildCardMatcher {
  constructor(pattern) {
    this.p = pattern.split('');
    this.end = false;
    this.r = false;
    this.pi = 0;
    this.pj = 0;
    this.i = 0;
    this.kmp = [];
    this.kmpData = [];
    this.init();
    this.r = this.pi >= this.p.length;
  }
  init() {
    this.i = 0;
    let star = false;
    while (this.pj < this.p.length && this.p[this.pj] === '*') {
      star = true;
      ++this.pj;
    }
    this.pi = this.pj;
    while (this.pj < this.p.length && this.p[this.pj] !== '*') {
      ++this.pj;
    }
    this.kmp = null;
    this.kmpData = null;
    if (star) {
      this.kmp = [];
      this.kmpData = [];
    }
  }
  result() {
    return this.r;
  }
  update(s) {
    for (const char of s.split('')) {
      if (this.end) {
        break;
      }
      this.updateChar(char)
    }
  }
  updateChar(c) {
    if (this.end) return;
    if (this.pi + this.i >= this.pj) {
      this.r = this.kmp !== null;
      this.end = true;
      return;
    }
    this.r = false;
    let cc = this.p[this.pi + this.i];
    if (cc === '?' || c === cc) {
      if (this.kmp !== null) {
        this.kmpData[i] = c;
        if (this.i > 0) {
          let back = this.kmp[this.i - 1] + 1;
          let pBack = this.p[this.pi + back];
          if (!(pBack === '?' || pBack === cc || this.kmpData[back] === c)) {
            back = this.kmpData[0] === c ? 0 : -1;
          }
          this.kmp[this.i] = back;
        } else {
          this.kmp[this.i] = -1;
        }
      }
      ++this.i;
      if (this.pi + this.i >= this.pj) {
        if (this.pj >= this.p.length) {
          this.r = true;
          if (null !== this.kmp) {
            this.i = this.i > 1 ? this.kmp[this.kmp.length - 1] + 1 : 0;
            return;
          }
        }
        this.init();
        if (this.pi >= this.p.length) {
          this.r = true;
        }
      }
    } else {
      if (this.kmp !== null) {
        while (this.i > 0) {
          this.i = this.kmp[this.i - 1] + 1;
          cc = this.p[this.pi + this.i];
          if (cc === '?' || cc === c) {
            ++i;
            break;
          }
        }
      } else {
        // this.end = true;
        return;
      }
    }
  }
}

function find(source, pattern) {
  let w = new WildCardMatcher(pattern);
  w.update(source);
  return w.result();
}

console.log(find('xyab', '?a'));

module.exports = find;