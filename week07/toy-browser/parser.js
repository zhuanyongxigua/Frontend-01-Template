const css_parser = require("./css_parser.js");
const layout = require('./layout.js')
//EOF：文件结束标志
const EOF = Symbol('EOF')//end of file
//添加业务逻辑，在标签结束状态提交token
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{type:"document",children:[]}]


function emit(token){
    // if(token.type === 'text'){
    //     return;
    // }
    let top = stack[stack.length-1];

    if(token.type === 'startTag'){
        let element = {
            type:'element',
            children:[],
            attributes:[]
        }
        element.name = token.tagName;
        for(let p in token){
            // console.log(p)
            if(p!='tagName' || p!='type'){
                element.attributes.push({name:p,
                value:token[p]
                })
            }
        };
        // console.log('-----',element.name,element.attributes)
        css_parser.computeCSS(element,stack);        
        top.children.push(element);
        // element.parent =top;

        if(!token.isSelfClosing){
            stack.push(element)
        }
        // console.log(token);
        layout(element);  
        currentTextNode = null;

    }else if(token.type === 'endTag'){
        if(top.name != token.tagName){
            throw new Error("Tag start with end does not match!!!");
        }else{
            //++++++++++++++++++遇到style标签时，执行添加css规则的操作++++//
            if(top.name === 'style'){
                var style_text = top.children[0].content;
                // console.log('----style text-----',style_text);
                css_parser.addCSSRules(style_text);
            }
            stack.pop();
        }
        layout(top)
        currentTextNode = null;
    }else if(token.type === 'text'){
        if(currentTextNode === null){
            currentTextNode = {
                type:'text',
                content:""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function emit2(token){
    if(token.type != 'text'){
        console.log(token)
    }
}
//词法解析，只挑选一部分状态进行解析
function data(c){
    if (c === '<'){
        return tagOpen;
    }else if(c === EOF){
        emit({
            type:'EOF'
        })  
        return data;
    }else{
        emit({
            type:'text',
            content:c
        });
        return data;
    }
}

//主要标签--开始标签，结束标签，自封闭标签
function tagOpen(c){
    if(c === '/'){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:'startTag',
            tagName:""
        }
        return tagName(c);
    }else{
        emit({
            type:'text',
            content:c
        })
        return ;
    }
}

function endTagOpen(c) {
    if(c.match(/^[a-zA-Z ]$/)){
        currentToken = {
            type:'endTag',
            tagName:""
        }
        return tagName(c);
    }else if(c === '>'){

    }else if(c === EOF){

    }else{
        
    }

  }

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName +=c;
        return tagName;
    }else if(c === '>'){
        emit(currentToken);
        return data;
    } else if(c === '/'){
        return selfClosingStartTag;
    }else{
        currentToken.tagName +=c;
        return tagName;
    }        
}
function selfClosingStartTag(c){
    if(c === '>'){
        currentToken.isSelfClosing = true;
        emit(currentToken)
        // currentToken.type = 'selfClosingTag';
        return data;
    }else if(c === "EOF"){

    }else{

    }
}

function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '='){
    
    }else if(c === '>' || c === '/' || c === EOF){
        return afterAttributeName(c);
    }else{
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }

}

function attributeName(c) {
    if(c === '/' || c === '>' || c===EOF || c.match(/^[\t\n\f ]$/)){
        return afterAttributeName(c);
    }else if(c === '='){
        return beforeAttributeValue;
    }else if(c === '\u0000'){

    }else if(c === "\"" || c=== "'" || c ==="<"){

    }else{
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c === '='){
        return beforeAttributeValue;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{
        currentToken[currentAttribute.name]=currentAttribute.value;
        currentAttribute = {
            name:'',
            value:''
        }
        return attributeName(c);
    }
}

function beforeAttributeValue(c) {
    if(c === '/' || c === '>' || c===EOF || c.match(/^[\t\n\f ]$/)){
        return beforeAttributeValue;
    }else if(c === "'"){
        return singleQuoteAttributeValue;
    }else if(c === '"'){
        return doubleQuoteAttributeValue;
    }else{
        return unQuoteAttributeValue(c);
    }
    
}

function doubleQuoteAttributeValue(c){
    if(c === '"'){
        currentToken[currentAttribute.name] = currentAttribute.value;;
        return afterQuoteAttributeValue;
    }else if(c === '\u0000'){

    }else if(c === EOF){

    }else{
        currentAttribute.value+=c;
        return doubleQuoteAttributeValue;
    }

}

function singleQuoteAttributeValue(c){
    if(c === "'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    }else if(c === '\u0000'){

    }else if(c === EOF){

    }else{
        currentAttribute.value+=c;
        return singleQuoteAttributeValue;
    }

}

function unQuoteAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c === '/'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === '\u0000'){

    }else if(c === '"' || c === "'" || c === '=' || c === '>' || c === '`'){

    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return unQuoteAttributeValue;
    }
}

function afterQuoteAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}


function parseHTML(html){
    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
    // console.log(stack[0]);
}

module.exports.parseHTML = parseHTML;
var html = `<html maaa=a >
<head>
    <style>
#container{
    width:500px;
    height:300px;
    display:flex;
    background-color:rgb(255,255,255)
}
#container #myid{
    width:200px;
    height:100px;
    background-color:rgb(255,0,0);
}
#container .c1{
    flex:1;
    background-color:rgb(0,255,0);
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>
`;
// parseHTML(html);

// var dom = parseHTML(html);
// console.log('-------------dom----------')
// console.log(dom)