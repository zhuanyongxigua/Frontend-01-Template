function getStyle(element) {  
  if(!element.style){
      element.style ={}
  }
  for(let prop in element.computeStyle){
      // console.log('-------------prop-----',prop)
      element.style[prop] = element.computeStyle[prop].value;

      if(element.style[prop].toString().match(/px$/)){
          element.style[prop] = parseInt(element.style[prop])
      }
      if(element.style[prop].toString().match(/^[0-9\.]+$/)){
          element.style[prop] = parseInt(element.style[prop])
      }
  }
  // console.log('-----------element style------')
  // console.log(element.style)
  return element.style ;

}

function layout(element){
  if(!element.computeStyle){
      return ;
  }

  var elementStyle = getStyle(element);

  if(elementStyle.display !== 'flex'){
      return ;
  }

  var items = element.children.filter(e => e.type =='element' )
  items.sort(function(a,b){return (a.order || 0) - (b.order || 0)});

  var style = elementStyle;
  
  ['height','width'].forEach((size)=>{
      if(style[size] === 'auto' || style[size] === ''){
          style[size] = null;
      }
  })

  
  if(!style.flexDirection || style.flexDirection === 'auto'){
      style.flexDirection = 'row';
  }
  if(!style.flexWrap || style.flexWrap === 'auto'){
      style.flexWrap = 'nowrap';
  }
  if(!style.justifyContent || style.justifyContent ==='auto'){
      style.justifyContent = 'flex-start';
  }
  if(!style.alignItems || style.alignItems === 'auto'){
      style.alignItems = 'stretch';
  }
  if(!style.alignContent || style.alignContent === 'auto'){
      style.alignContent = 'stretch';
  }

  //10个变量
  var mainSize,mianStart,mainEnd,mainSign,mainBase
  var crossSize,crossStart,crossEnd,crossSign,crossBase
  if(style.flexDirection === 'row'){
      mainSize = 'width';
      mianStart = 'left';
      mainEnd = 'right' ;
      mainSign = +1 ;
      mainBase = 0;

      crossSize = 'height';
      crossStart = 'top';
      crossEnd = 'bottom';
  }
   if(style.flexDirection === 'row-reverse'){
      mainSize = 'width';
      mianStart = 'right';
      mainEnd = 'left' ;
      mainSign = -1 ;
      mainBase = style.width;

      crossSize = 'height';
      crossStart = 'top';
      crossEnd = 'bottom';
  }
  if(style.flexDirection === 'column'){
      mainSize = 'height';
      mianStart = 'top';
      mainEnd = 'bottom' ;
      mainSign = +1 ;
      mainBase = 0;

      crossSize = 'width';
      crossStart = 'left';
      crossEnd = 'right';
  }
  if(style.flexDirection === 'column-reverse'){
      mainSize = 'height';
      mianStart = 'bottom';
      mainEnd = 'top' ;
      mainSign = -1 ;
      mainBase = style.height;

      crossSize = 'width';
      crossStart = 'left';
      crossEnd = 'right';
      
  }
  if(style.flexWrap === 'wrap-reserve'){
      var tmp = crossStart;
      crossStart = crossEnd;
      crossEnd = tmp;
      crossSign = -1;
  }else{
      crossBase = 0;
      crossSign = 1
  }
 
  var isAutoMainSize = false;
  if(!style[mainSize]){
      style[mainSize] = 0;
      for(var i =0; i < items.length;i++){
          let item = items[i];
          var itemStyle = getStyle(item);
          if(itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)){
              style[mainSize] = style[mainSize] + itemStyle[mainSize];
          }

      }
      isAutoMainSize = true;
  }

  var flexLine = []
  var flexLines = [flexLine];

  var mainSpace = style[mainSize];
  var crossSpace = 0;

  for(var i = 0 ; i < items.length;i++){
      var item = items[i];
      var itemStyle = getStyle(item);
      console.log('#########',item)

      if(itemStyle[mainSize] === null){
          itemStyle[mainSize] = 0;
      }

      if(itemStyle.flex){
          flexLine.push(item);
      }else if(style.flexWrap === 'nowrap' && isAutoMainSize){
          mainSpace -= itemStyle[mainSize];
          if(itemStyle[crossSize] !== null || itemStyle[crossSize] !== (void 0)){
              crossSpace = Math.max(crossSpace,itemStyle[crossSize])
          }
          flexLine.push(item);
      }else{
          if(itemStyle[mainSize]>style[mainSize]){
              itemStyle[mainSize] = style[mainSize];
          }
          if(mainSpace < itemStyle[mainSize]){
              flexLine.mainSpace = mainSpace;
              flexLine.crossSpace = crossSpace;

              flexLine = [];
              flexLines.push(flexLine);
              flexLine.push(item);
              mainSpace = style[mainSize];
              crossSpace = 0;
          }else{
              flexLine.push(item);
             
          }
          if(itemStyle[crossSize] !== null || itemStyle[crossSize] !==(void 0)){
              crossSpace = Math.max(crossSpace,itemStyle[crossSize]);
          }
          mainSpace -= itemStyle[mainSize];
      }
  }
  flexLine.mainSpace = mainSpace;

  if(style.flexWrap === 'nowrap' && isAutoMainSize){
      flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize]:crossSpace;
  }else{
      flexLine.crossSpace = crossSpace;
  }
// compute the main axis size
  if(mainSpace < 0){
     
      // overflow(happens only if container is single line),scale every item
      var scale = style[mainSize]/(style[mainSize] - mainSpace);
      var currentMain = mainBase;

      for(var i =0;i<items.length;i++){
          var item = items[i];
          var itemStyle = getStyle(item);

          if(itemStyle.flex){
              itemStyle[mainSize]=0;
          }

          itemStyle[mainSize] = style[mainSize]*scale;
          itemStyle[mianStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mianStart] + itemStyle[mainSize]*mainSign;
          currentMain = itemStyle[mainEnd];
      }
  }else{
      
      // process each flex line
      flexLines.forEach(function (items) {
          var mainSpace = items.mainSpace;
          var flexTotal = 0;
          console.log(items.length);
          for(let i =0;i<items.length;i++){
              let item = items[i];
              let itemStyle = getStyle(item);
              if(itemStyle.flex !==null && itemStyle.flex !==(void 0)){
                  flexTotal += itemStyle.flex;
                  continue;
              }
          }

          if(flexTotal>0){
              
              // there is flexible flex items
              var currentMain = mainBase;
              for(var i =0;i<items.length;i++){
                  var item = items[i];
                  var itemStyle = getStyle(item);
      
                  if(itemStyle.flex){
                      itemStyle[mainSize]=mainSpace/flexTotal*itemStyle.flex;
                  }
                  itemStyle[mianStart] = currentMain;
                  itemStyle[mainEnd] = itemStyle[mianStart] + itemStyle[mainSize] *mainSign;
                  currentMain = itemStyle[mainEnd];
              }
          }else{
              // there is *NO* flexible flex items ,which means,justifyContent should work
              // step is items` space
              if(style.justifyContent ==='flex-start'){
                  var currentMain = mainBase;
                  var step = 0;
              }
              if(style.justifyContent ==='flex-end'){
                  var currentMain = mainBase + mainSpace * mainSign;
                  var step = 0;
              }
              if(style.justifyContent ==='center'){
                  var currentMain = mainSpace/2 *mainSign + mainBase;
                  var step = 0;
              }
              if(style.justifyContent ==='space-between'){
                  var currentMain = mainBase;
                  var step = mainSpace/(items.length -1)*mainSign;
              }
              if(style.justifyContent ==='space-around'){
                  var step = mainSpace/items.length *mainSign;
                  var currentMain = step/2;
              }
              for (var i =  0;i<items.length;i++){
                  var item = items[i];
                  var itemStyle = getStyle(item);

                  itemStyle[mianStart] = currentMain;
                  itemStyle[mainEnd] = itemStyle[mianStart] + mainSign*itemStyle[mainSize];
                  currentMain = itemStyle[mainEnd] + step;
              }
          }

        })

  }
// compute the cross axis size
// align-items,align-self
  var crossSpace;//容器交叉轴尺寸
  if(!style[crossSize]){
      crossSpace = 0;
      style[crossSize] = 0;
      for(var i = 0;i < flexLines.length;i++){
          style[crossSize] += flexLines[i].crossSpace;
      }
  }else{
      crossSpace = style[crossSize];
      for(var i = 0;i < flexLines.length;i++){
          crossSpace -= flexLines[i].crossSpace;
      }
  }

  if(style.flexWrap === 'wrap-reverse'){
      crossBase = style[crossSize]
  }else{
      crossBase = 0;
  }

  var lineSize = style[crossSize] / flexLines.length;
  var step;

  if(style.alignContent === 'flex-start'){
      crossBase += 0;
      step = 0;
  }
  if(style.alignContent === 'flex-end'){
      crossBase += crossSpace*crossSign;
      step = 0;
  }
  if(style.alignContent === 'center'){
      crossBase += crossSpace/2*crossSign;
      step = 0;
  }
  if(style.alignContent === 'space-around'){
      step = crossSpace/flexLines.length;
      crossBase += step/2*crossSign;
  }
  if(style.alignContent === 'space-between'){
      crossBase += 0;
      step = crossSpace/(flexLines.length-1);
  }
  if(style.alignContent === 'stretch'){
      crossBase += 0;
      step = 0;
  }
  //确定每个元素在行内的位置
 flexLines.forEach(function (items) { 
     var linCrossSize = style.alignContent === 'stretch' ?
     items.crossSpace + crossSpace/flexLines.length : items.crossSpace;
     for (var i = 0;i < items.length;i++){
         var item = items[i];
         var itemStyle = getStyle(item);

         var align =  itemStyle.alignSelf || style.alignItems;
         if(itemStyle[crossSize] ===null){
             itemStyle[crossSize] = (align === 'stretch') ? linCrossSize : 0;
         }

         if(align === 'flex-start'){
             itemStyle[crossStart] =crossBase ;
             itemStyle[crossEnd] = itemStyle[crossStart] + itemStyle[crossSize] * crossSign;
         }
         if(align === 'flex-end'){
          itemStyle[crossEnd] = crossBase + crossSign * linCrossSize;
          itemStyle[crossStart] = itemStyle[crossEnd] - itemStyle[crossSize]*crossSign;
          }
          if(align === 'center'){
              itemStyle[crossStart] = crossBase + crossSign * (linCrossSize - itemStyle[crossSize])/2;
              itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
          }
          if(align === 'stretch'){
              itemStyle[crossStart] = crossBase;
              itemStyle[crossEnd] = crossBase + crossSign *((itemStyle[crossSize]!==null && itemStyle[crossSize] !==(void 0)) ? itemStyle[crossSize] : linCrossSize);
              itemStyle[crossSize] = crossSign *(itemStyle[crossEnd] - itemStyle[crossStart])
          }
     }
     crossBase += crossSign *  (linCrossSize + step);
  })
  console.log(items);
  
}

module.exports = layout;