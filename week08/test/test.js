const assert = require('assert')
const match = require('../lib/index')

describe('Match CSS selector, return true', function() {
    before(function() {
        document.body.innerHTML = ''
        const ele = '<div><div id="id" class="class"></div></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return true if match success', function() {
        assert.ok(
            match('div>div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS selector, return false', function() {
    before(function() {
        document.body.innerHTML = ''
        const ele = '<div><a><div id="id" class="class"></div></a></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return false if match success', function() {
        assert.ok(
            !match('div>div#id.class', document.getElementById('id'))
        )
    })
})
