let currentToken = null;
let currentAttribute = null;

let stack;
let currentTextNode = null;

function emit(token){
    let top = stack[stack.length - 1];

    if(token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for(let p in token) {
            if(p != "type" || p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        top.children.push(element);

        if(!token.isSelfClosing)
            stack.push(element);

        currentTextNode = null;
        
    } else if(token.type == "endTag") {
        if(top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    }  else if(token.type == "text") {
        if(currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol("EOF");

function data(c){
    if(c == "<") {
        return tagOpen;
    } else if(c == EOF) {
        emit({
            type:"EOF"
        });
        return;
    } else {
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c == "/") {
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName : ""
        }
        return tagName(c);
    } else {
        emit({
            type: "text",
            content : "<"
        });
        emit({
            type: "text",
            content : c
        });
        return data;
    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c.match(/^[A-Z]$/)) {
        currentToken.tagName += c//.toLowerCase();
        return tagName;
    } else if(c == ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}
function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if(c == "=") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-equals-sign-before-attribute-name
        throw new Error("Unexpected equals sign before attribute name");
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function attributeName(c) {
    if(c.match && c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if(c == "=") {
        return beforeAttributeValue;
    } else if(c == "\u0000") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character
        console.error('Unexpected NULL character!');
        currentAttribute.name = '\u0000';
        currentToken[currentAttribute.name] = '\uFFFD';
        emit(currentToken);
        return attributeName;
    } else if(c == "\"" || c == "'" || c == "<") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-character-in-attribute-name
        throw new Error('Unexpected character in attribute name!');
    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}


function beforeAttributeValue(c) {
    if(c.match && c.match(/^[\t\n\f ]$/) || c == "/" || c == EOF) {
        return beforeAttributeValue;
    } else if(c == "\"") {
        return doubleQuotedAttributeValue;
    } else if(c == "\'") {
        return singleQuotedAttributeValue;
    } else if(c == ">") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-attribute-value
        console.error('Missing attribute value!');
        emit(currentToken);
        return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if(c == "\"") {
        if (currentToken[currentAttribute.name] === '\uFFFD') {
            currentAttribute.value = '\uFFFD';
            return afterQuotedAttributeValue;
        }
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character
        console.error('Unexpected NULL character!');
        currentToken[currentAttribute.name] = '\uFFFD';
        return doubleQuotedAttributeValue;
    } else if(c == EOF) {
        
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}


function singleQuotedAttributeValue(c) {
    if(c == "\'") {
        if (currentToken[currentAttribute.name] === '\uFFFD') {
            currentAttribute.value = '\uFFFD';
            return afterQuotedAttributeValue;
        }
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character
        console.error('Unexpected NULL character!');
        currentToken[currentAttribute.name] = '\uFFFD';
        return singleQuotedAttributeValue;
    } else if(c == EOF) {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag
        throw new Error("Unexpected EOF in single quote value!");
    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue (c){
    if(c.match && c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF) {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag
        throw new Error("Unexpected EOF after quote value!");
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}


function UnquotedAttributeValue(c) {
    if(c.match && c.match(/^[\t\n\f ]$/)) {
        if (currentToken[currentAttribute.name] === '\uFFFD') {
            currentAttribute.value = '\uFFFD';
            return beforeAttributeName;
        }
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if(c == "/") {
        if (currentToken[currentAttribute.name] === '\uFFFD') {
            currentAttribute.value = '\uFFFD';
            return selfClosingStartTag;
        }
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c == ">") {
        if (currentToken[currentAttribute.name] === '\uFFFD') {
            currentAttribute.value = '\uFFFD';
            emit(currentToken);
            return data;
        }
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == "\u0000") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-null-character
        console.error('Unexpected NULL character!');
        currentToken[currentAttribute.name] = '\uFFFD';
        return UnquotedAttributeValue;
    } else if(c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-unexpected-character-in-unquoted-attribute-value
        console.error('Unexpected character in unquoted attribute value!');
        currentAttribute.value += c;
        return UnquotedAttributeValue
    } else if(c == EOF) {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag
        throw new Error("Unexpected EOF in unquote attribute value!");
    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue
    }
}

function selfClosingStartTag(c){
    if( c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if(c == EOF) { // test case "EOF after selfClosingTag '/'"
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-in-tag
        throw new Error("Unexpected EOF in self close tag!");
    } else {
        
    }
}

function endTagOpen(c){
    if(c.match && c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName : ""
        }
        return tagName(c);
    } else if(c == ">") {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-missing-end-tag-name
        console.error('Missing end tag name!');
        return data;
    } else if(c == EOF) { // test case "EOF after '/'"
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-before-tag-name
        throw new Error("Unexpected EOF in end tag!");
    } else {

    }
}

//in script
function scriptData(c){
    if(c == "<") {
        return scriptDataLessThanSign;
    } else {
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}

//in script received <
function scriptDataLessThanSign(c){
    if(c == "/") {
        return scriptDataEndTagOpen;
    } else {
        emit({
            type:"text",
            content:"<"
        });
        return scriptData(c);
    }
}

//in script received </
function scriptDataEndTagOpen(c){
    if(c == "s") {
        return scriptDataEndTagNameS;
    } else {
        emit({
            type:"text",
            content:"<"
        });

        emit({
            type:"text",
            content:"/"
        });

        return scriptData(c);
    }
}

//in script received </s
function scriptDataEndTagNameS(c){
    if(c == "c") {
        return scriptDataEndTagNameC;
    } else {
        emit({
            type:"text",
            content:"</s"
        });
        return scriptData(c);
    }
}

//in script received </sc
function scriptDataEndTagNameC(c){
    if(c == "r") {
        return scriptDataEndTagNameR;
    } else {
        emit({
            type:"text",
            content:"</sc"
        });
        return scriptData(c);
    }
}

//in script received </scr
function scriptDataEndTagNameR(c){
    if(c == "i") {
        return scriptDataEndTagNameI;
    } else {
        emit({
            type:"text",
            content:"</scr"
        });
        return scriptData(c);
    }
}
//in script received </scri
function scriptDataEndTagNameI(c){
    if(c == "p") {
        return scriptDataEndTagNameP;
    } else {
        emit({
            type:"text",
            content:"</scri"
        });
        return scriptData(c);
    }
}
//in script received </scrip
function scriptDataEndTagNameP(c){
    if(c == "t") {
        return scriptDataEndTag;
    } else {
        emit({
            type:"text",
            content:"</scrip"
        });
        return scriptData(c);
    }
}
//in script received </script
let spaces = 0;
function scriptDataEndTag(c){
    if(c == " ") {
        spaces++;
        return scriptDataEndTag;
    } if(c == ">") {
        emit({
            type: "endTag",
            tagName : "script"
        });
        return data;
    } else {
        emit({
            type:"text",
            content:"</script" + new Array(spaces).fill(' ').join('')
        });
        return scriptData(c);
    }
}

function afterAttributeName(c) {
    if(c.match && c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c == "=") {
        return beforeAttributeValue;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF) {
        // https://html.spec.whatwg.org/multipage/parsing.html#parse-error-eof-before-tag-name
        throw new Error("Unexpected EOF after tag name!");
    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name : "",
            value : ""
        };
        return attributeName(c);
    }
}

export function parseHTML(html){
// module.exports = function parseHTML(html){
    let state = data;
    stack = [{type: "document", children:[]}];
    for(let c of html) {
        state = state(c);
        if(stack[stack.length - 1].tagName === "script" && state == data) {
            state = scriptData;
        }
    }
    state = state(EOF);
    return stack[0];
}