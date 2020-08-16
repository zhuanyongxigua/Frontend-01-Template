// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
export function enableGesture(element) {
  let contexts = Object.create(null);

  let MOUSE_SYMBOL = Symbol('mouse');

  // 这个判断是在移动端的情况下把鼠标事件关掉
  if (document.ontouchstart !== null) {
    element.addEventListener('mousedown', event => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(event, contexts[MOUSE_SYMBOL]);
      let mousemove = event => {
        move(event, contexts[MOUSE_SYMBOL]);
      }
      let mouseend = event => {
        end(event, contexts[MOUSE_SYMBOL]);
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseend);
      }
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseend);
    })
  }

  // 由于touch事件在哪起始就是在哪触发
  // 有天然的目标锁定的能力
  element.addEventListener('touchstart', event => {
    for (const touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  })

  element.addEventListener('touchmove', event => {
    for (const touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  })

  // 要么触发touchend，要么触发touchcancel，只能是一个
  // 在出现弹窗的时候就是touchcancel
  element.addEventListener('touchend', event => {
    for (const touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  })

  element.addEventListener('touchcancel', event => {
    for (const touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  })

  // 各种手势
  // tap,如果是tap就不可能是pan
  // pan - panstart panmove panend
  // flick
  // press - pressstart pressend

  // 写触屏和PC通用的
  let start = (point, context) => {
    element.dispatchEvent(Object.assign(new CustomEvent('start'), {
      startX: point.clientX,
      startY: point.clientY,
      clientX: point.clientX,
      clientY: point.clientY
    }));
    context.startX = point.clientX, context.startY = point.clientY;
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    // 有可能没有触发就被销毁了
    context.timeoutHandler = setTimeout(() => {
      // pan的优先级比press高
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(Object.assign(new CustomEvent('pressstart'), {}));
    }, 500);
  }

  let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        element.dispatchEvent(Object.assign(new CustomEvent('presscancel'), {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      element.dispatchEvent(Object.assign(new CustomEvent('panstart'), {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }));
    }


    if (context.isPan) {
      context.moves.push({
        dx,
        dy,
        t: Date.now()
      });

      context.moves = context.moves.filter(record => Date.now() - record.t < 300);
      let e = new CustomEvent('pan');
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      })
      element.dispatchEvent(e);
    }
    // console.log('move', dx, dy);
  }

  let end = (point, context)=> {
    if (context.isPan) {
      let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
      let record = context.moves[0];
      let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
      let isFlick = speed > 2.5;
      if (speed > 2.5) {
        element.dispatchEvent(Object.assign(new CustomEvent('flick'), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed: speed
        }));
      }
      element.dispatchEvent(Object.assign(new CustomEvent('panend'), {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed: speed,
        isFlick: isFlick
      }));
    }
    if (context.isTap) {
      element.dispatchEvent(Object.assign(new CustomEvent('tap'), {}));
    }
    if (context.isPress) {
      console.log('pressend');
    }
    clearTimeout(context.timeoutHandler);
  }

  // PC没有
  let cancel = () => {
    console.log('cancel');
    clearTimeout(context.timeoutHandler);
  }
}
