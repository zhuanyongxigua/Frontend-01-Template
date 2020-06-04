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
    let isContinue
    while (result.length) {
        if (!isContinue) {
            cur = result.pop()
        }
        if (isContinue) {
            if (matchElement(result[result.length - 1], element)) {
                cur = result.pop()
                isContinue = false
            }
        } else {
            if (!matchElement(cur, element)) {
                return false
            }
        }
        if (!isContinue) {
            cur = result.pop()
        }
        if (cur === '>') {
            element = element.parentElement
            isContinue = false
        } else if (cur === '+') {
            element = element.previousElementSibling
            isContinue = false
        } else if (cur === ' ') {
            element = element.parentElement
            if (element !== null) {
                isContinue = true
            } else {
                return false
            }
        } else if (cur === '~') {
            element = element.previousElementSibling
            if (element !== null) {
                isContinue = true
            } else {
                return false
            }
        }
    }
    return true
}
