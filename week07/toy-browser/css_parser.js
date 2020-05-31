const css = require("css");

//加入一个函数addCSSRules，把css规则暂存到一个数组里。
//只处理script标签
const rules = [];
function addCSSRules(text) {  
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast,null,'    '));
    rules.push(...ast.stylesheet.rules);
    // console.log('------rules----',rules)
}
module.exports.addCSSRules = addCSSRules;

//伪元素，伪类过于复杂不处理，关于继承inherit
function computeCSS(element,stack) { 
    var elements = stack.slice().reverse();
    if(!element.computeStyle){
        element.computeStyle ={}
    }
    for (let rule of rules ){
        var selectorParts = rule.selectors[0].split(' ').reverse();
        if(!match(element,selectorParts[0])){
            continue;
        }
        let matched = false;
        var j = 1;
        for(let i = 0;i<elements.length;i++){
            if(match(elements[i],selectorParts[j])){
                j++;
            }
        }

        if(j>=selectorParts.length){
            matched =true;
        }
        // 若命中同一个元素，后面覆盖前面
        if(matched){
            var sp = specificity(rule.selectors[0]);
            for(let declaration of rule.declarations){
                if(!element.computeStyle[declaration.property])
                    element.computeStyle[declaration.property] = {};
                    
                if(!element.computeStyle[declaration.property].specificity){
                    element.computeStyle[declaration.property].value = declaration.value;
                    element.computeStyle[declaration.property].specificity = sp;
                    console.log(element.computeStyle[declaration.property])
                }else if(compare(element.computeStyle[declaration.property].specificity,sp)<0){
                    // element.computeStyle[declaration.property].value = declaration.value;
                    // element.computeStyle[declaration.property].specificity = sp;
                    for(var k = 0;k<4;k++)
                        element.computeStyle[declaration.property][declaration.value][k] += sp[k];
                }
                // console.log('--------------element computeStyle-------------')
                // console.log(element.computeStyle);
                // console.log('---------------------------------------')
            }
            console.log('--------------element computeStyle-------------')
            console.log(element.computeStyle);
            console.log('---------------------------------------')
            // console.log("Element",element,"matched rule",rule)
        }
        console.log('-----element-----')
        console.log(element)
    }
 }
 module.exports.computeCSS = computeCSS;

//计算选择器与元素匹配关系 
//实现简单选择器三种属性
// -----可选作业：实现复合选择器，实现支持空格的class选择器（<div class='a b'></div>）
function match(element,selector){
    if(!selector || !element.attributes)
        return false;
    if(selector.charAt(0) === '#'){
        
        var attr = element.attributes.filter((attr)=>attr.name === 'id')[0];
        if(attr && attr.value === selector.replace('#','')){
            return true;
        }
    }else if(selector.charAt(0) === '.'){
        var attr = element.attributes.filter((attr)=>attr.name === 'class')[0];
        if(attr && attr.value === selector.replace('.','')){
            return true;
        }
    }else{
        if(element.name === selector) {
            return true;
        }
    }
    // return false;
}
module.exports.match = match;
//生成computed属性,一旦匹配，就形成computeStyle对象（来自css样式）；


// 四元数组表示优先级。0表示优先级最高，左边高右边低
function specificity(selector){
    var p = [0,0,0,0];
    let selectorParts = selector.split(" ");
    for (var part of selectorParts){
        if(part.charAt(0) === '#'){
            p[1] += 1;
        }else if(part.charAt(0) === '.'){
            p[2] += 1;
        }else{
            p[3] += 1;
        }
    }
    return p;
}

module.exports.specificity = specificity;

function compare(sp1,sp2) {
    if(sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if(sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if(sp1[2] - sp2[2])
        return sp1[2] - sp2[2];
    
    return sp1[3] - sp2[3];
}