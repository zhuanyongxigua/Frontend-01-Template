// 有EOF的原因是，字符可以是一段一段传过来的
// 编译器不知道当前这一段是不是最后一段，所以可能就会处在一个等待字符补全的状态
// 由于字符会占位，所以不能用string，但是用对象什么的是可以的，这个地方没明白
const EOF = Symbol('EOF') // End of File

let currentToken = null
let currentAttribute = null

let stack = [{ type: 'document', children: []}]

function emit(token) {
    if(token.type !== 'text') {
        console.log(token)
        return
    }
    let top = stack[stack.length - 1]
    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName
        for(let n in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }
        top.children.push(element)
        element.parent = top
        if (!token.isSelfClosing) {
            stack.push(element)
        }
        currentTextNode = null
    } else if (token.type === 'endTag') {
        if(top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!")
        } else {
            stack.pop()
        }
        currentTextNode = null
    } else if (token.type === 'text') {
        if(currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

function data(c) {
    if(c === '<') {
        return tagOpen
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        })
        return
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen(c) {
    if(c === '/') {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        return
    }
}

function endTagOpen(c) {
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>') {

    } else if (c === EOF) {

    } else {

    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if(c === '/') {
        return selfClosingStartTag
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c
        return tagName
    } else if (c === '>') {
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if(c === '=') {
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function selfClosingStartTag(c) {
    if(c === '>') {
        currentToken.isSelfClosing = true
        return data
    } else if(c === 'EOF') {

    } else {

    }
}

function attributeName(c) {
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if(c === '=') {
        return beforeAttributeValue
    } else if (c === '\r0000') {

    } else if (c === '\"' || c === "'" || c === '<') {

    } else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue
    } else if (c === '\"') {
        return doubleQuotedAttributeValue
    } else if (c === '\'') {
        return singleQuoteAttributeValue
    } else if (c === '>') {

    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {

}

function singleQuoteAttributeValue(c) {

}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {

    } else if (c === '\"' || c === "'" || c === '<' || c === '=' || c === "`") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}

module.exports.parseHTML = function parseHTML(html) {
    let state = data
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF)
    return state[0]
}