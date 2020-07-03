class Solution {
public:
  bool isMatch(string s, string p) {
    int i = 0, j = 0, star = -1;
    int nexttemp;
    int nextindex;
    vector<int> next(p.length() + 1);
    next[0] = -1;
    if (p.length() > 0 && p[0] == '*') { next[0] = 0; }
    while (i < s.length()) {
      if (j < p.length() && (s[i] == p[j] || p[j] == '?')) {
        nexttemp = next[j];
        while (nexttemp >= 0 && (p[nexttemp] != '*' && p[nexttemp] != '?' && p[nexttemp] != s[i])) {
          nexttemp = next[nexttemp];
        }
        if (star == -1) {next[j + 1] = -1;}
        else {next[j + 1] = nexttemp + 1;}
        i++; j++;
        continue;
      }
      else if (j < p.length() && p[j] == '*') {
        star = j;
        next[j] = j;
        next[j + 1] = j;
        j++;
        continue;
      }
      else {
        j = next[j];
        if (j == -1) { return false; }
        if (p[j] == '*') { i++; j++; }
        continue;
      }
    }
    while (j < p.length() && p[j] == '*') { j++; }
    return j == p.length();
  }
};
