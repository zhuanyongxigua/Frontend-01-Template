const parse = require('@ryanmorr/css-selector-parser')

function matchElement(attrs, element) {
    if ('nodeName' in attrs) {
        if (attrs.nodeName !== element.tagName.toLowerCase()) {
            return false
        }
    }
    if (!attrs.attributes.every(attribute => {
        if (attribute.name !== 'class') {
            if (element[attribute.name] !== attribute.value) {
                return false
            }
            return true
        } else {
            let hasClass = false
            for (key of element.classList) {
                if (key === attribute.value) {
                    hasClass = true
                }
            }
            return hasClass
        }
    })) {
        return false
    }
    return true
}
module.exports = function match(selector, element) {
    let result = parse(selector)[0]
    let cur
    while (result.length) {
        cur = result.pop()
        if (!matchElement(cur, element)) {
            return false
        }
        cur = result.pop()
        if (cur === '>') {
            element = element.parentElement
        } else if (cur === '+') {
            element = element.nextElementSibling
        }
    }
    return true
}
