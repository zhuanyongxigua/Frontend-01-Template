const assert = require('assert')
const match = require('../lib/index')

describe('Match CSS parent selector, return true', function() {
    before(function() {
        const ele = '<div><div id="id" class="class"></div></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return true if match success', function() {
        assert.ok(
            match('div>div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS parent selector, return false', function() {
    before(function() {
        const ele = '<div><a><div id="id" class="class"></div></a></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return false if match success', function() {
        assert.ok(
            !match('div>div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS parents selector, return true', function() {
    before(function() {
        const ele = '<div><a><div id="id" class="class"></div></a></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return true if match success', function() {
        assert.ok(
            match('div div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS parents selector, return false', function() {
    before(function() {
        const ele = '<span><a><div id="id" class="class"></div></a></span>'
        document.body.innerHTML = ele
    })
    it('Match function should return false if match success', function() {
        assert.ok(
            !match('div div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS sibling selector, return true', function() {
    before(function() {
        const ele = '<div></div><div id="id" class="class"></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return true if match success', function() {
        assert.ok(
            match('div+div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS sibling selector, return false', function() {
    before(function() {
        const ele = '<span></span><div id="id" class="class"></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return false if match success', function() {
        assert.ok(
            !match('div+div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS siblings selector, return true', function() {
    before(function() {
        const ele = '<div></div><span></span><div id="id" class="class"></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return true if match success', function() {
        assert.ok(
            match('div~div#id.class', document.getElementById('id'))
        )
    })
})

describe('Match CSS siblings selector, return false', function() {
    before(function() {
        const ele = '<span></span><div id="id" class="class"></div>'
        document.body.innerHTML = ele
    })
    it('Match function should return false if match success', function() {
        assert.ok(
            !match('div~div#id.class', document.getElementById('id'))
        )
    })
})
