const assert = require('assert')
const find = require('../lib/kmp-wildcards-qm3')

describe('kmp match', function() {
  it('Find function should return true if match success', function() {
    assert.ok(find('xyab', 'ab'));
    assert.ok(!find('xyab', 'ac'));
    assert.ok(find('xyaab', 'ab'));
    assert.ok(!find('xyaaa', 'ab'));
    assert.ok(find('abcabcabe', 'abcabe'));
    assert.ok(!find('abcabcabc', 'abcabe'));
    assert.ok(find('abcabcabcabe', 'abcabe'));
    assert.ok(!find('abcabcabcabc', 'abcabe'));
    assert.ok(find('abcabcabcabe', 'abcabcabe'));
    assert.ok(!find('abcabcabcabc', 'abcabcabe'));
  })
})

describe('kmp match with question mark', function() {
  it('Find function should return true if match success', function() {
    assert.ok(find('a', '?'));
    assert.ok(!find('', '?'));
    assert.ok(find('ab', 'a?'));
    assert.ok(!find('bb', 'a?'));
    assert.ok(find('ab', '?b'));
    assert.ok(!find('aa', '?b'));
    assert.ok(find('xyab', 'a?'));
    assert.ok(!find('xybb', 'a?'));
    assert.ok(find('xyab', '?a'));
    assert.ok(!find('aybb', '?a'));
    assert.ok(find('xyaab', 'a?'));
    assert.ok(find('xyaab', '?b'));
    assert.ok(!find('bxyaaa', '?b'));
    assert.ok(find('abc', '?bc'));
    assert.ok(!find('aac', '?bc'));
    assert.ok(find('abc', 'a?c'));
    assert.ok(!find('bbc', 'a?c'));
    assert.ok(find('abc', 'ab?'));
    assert.ok(!find('bbc', 'ab?'));
  })
})

describe('kmp match repeat string with question mark', function() {
  it('Find function should return true if match success', function() {
    assert.ok(find('abcabcabe', '?bcabe'));
    assert.ok(!find('abcaacabe', '?bcabe'));
    assert.ok(find('abcabcabe', 'a?cabe'));
    assert.ok(!find('abcbbcabe', 'a?cabe'));
    assert.ok(find('abcabcabe', 'ab?abe'));
    assert.ok(!find('abcbbcabe', 'ab?abe'));
    assert.ok(find('abcabcabe', 'abc?be'));
    assert.ok(!find('abcabcaae', 'abc?be'));
    assert.ok(find('abcabcabe', 'abca?e'));
    assert.ok(!find('abcbbcabe', 'abca?e'));
    assert.ok(find('abcabcabe', 'abcab?'));
    assert.ok(!find('abcbbcbbe', 'abcab?'));

    assert.ok(find('abcdabcdabce', '?bcdabce'));
    assert.ok(find('abcdabcdabce', 'a?cdabce'));
    assert.ok(find('abcdabcdabce', 'ab?dabce'));
    assert.ok(find('abcdabcdabce', 'abc?abce'));
    assert.ok(find('abcdabcdabce', 'abcd?bce'));
    assert.ok(find('abcdabcdabce', 'abcda?ce'));
    assert.ok(find('abcdabcdabce', 'abcdab?e'));
    assert.ok(find('abcdabcdabce', 'abcdabc?'));

    assert.ok(find('abcabcabcabe', '?bcabcabe'));
    assert.ok(find('abcabcabcabe', 'a?cabcabe'));
    assert.ok(find('abcabcabcabe', 'ab?abcabe'));
    assert.ok(find('abcabcabcabe', 'abc?bcabe'));
    assert.ok(find('abcabcabcabe', 'abca?cabe'));
    assert.ok(find('abcabcabcabe', 'abcab?abe'));
    assert.ok(find('abcabcabcabe', 'abcabc?be'));
    assert.ok(find('abcabcabcabe', 'abcabca?e'));
    assert.ok(find('abcabcabcabe', 'abcabcab?'));
  })
})

describe('kmp match multiple question mark', function() {
  it('Find function should return true if match success', function() {
    assert.ok(find('abcde', '??cde'));
    assert.ok(!find('abcae', '??cde'));
    assert.ok(find('abcde', 'a??de'));
    assert.ok(!find('bbcde', 'a??de'));
    assert.ok(find('abcde', 'ab??e'));
    assert.ok(find('abcde', 'abc??'));

    assert.ok(find('abcdeabcdeabcda', '??cdeabcda'));
    assert.ok(find('abcdeabcdeabcda', 'a??deabcda'));
    assert.ok(find('abcdeabcdeabcda', 'ab??eabcda'));
    assert.ok(find('abcdeabcdeabcda', 'abc??abcda'));
    assert.ok(find('abcdeabcdeabcda', 'abcd??bcda'));
    assert.ok(find('abcdeabcdeabcda', 'abcde??cda'));
    assert.ok(find('abcdeabcdeabcda', 'abcdea??da'));
    assert.ok(find('abcdeabcdeabcda', 'abcdeab??a'));
    assert.ok(find('abcdeabcdeabcda', 'abcdeabc??'));

    assert.ok(find('abcde', 'a?c?e'));
    assert.ok(!find('bbcde', 'a?c?e'));
    assert.ok(find('abcabcade', 'a?cabca?e'));
    assert.ok(!find('abbabcade', 'a?cabca?e'));
    assert.ok(find('abcde', 'a???e'));
    assert.ok(find('abcabcade', 'a?c???a?e'));
    assert.ok(find('abcabcade', 'a?c?b?a?e'));
    assert.ok(find('abcabcade', 'a???????e'));
    assert.ok(find('abcabcade', 'a?cabca?e'));
    assert.ok(find('abcabcade', '??cabca??'));
  })
})