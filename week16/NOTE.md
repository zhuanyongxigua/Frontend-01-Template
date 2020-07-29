# 重学前端week16第一节组件化｜手势与第二节组件化｜轮播组件的继续改造：生命周期

> 手势操作都有哪些问题？

* 点击跳转：左右滑动轮播图没有跳转，轻点有跳转；如果用仅仅是单纯的mousedown和mouseover的话是无法区分这两个手势的。特别是在移动端。
* 拖动即便没有超过一半，只要速度够快，也是可以触发翻页的效果的。如果不实现用户会很难受。
* 一旦触发了纵向的滚动，再横向拖动就没用了。
* 移动与PC端的兼容问题。

> Touchevent与mouseEvent的区别？为什么？

Touchevent的x/y在changedTouches这个属性里面。原因是移动端是有多指触控。

> 业界对常用的手势有哪些抽象？

轻点是tap；

拖拽是pan，不是drag的原因是pan的意思有一个用摄像机拍摄的时候会移动镜头拍摄，移动摄像机场景变化，这个是pan。在手势上就是一较慢的拖拽；

flick也是拖拽，区别是这个很快，而且要立刻离开屏幕。

press是长期按屏幕。

> 手势操作的生命周期？

start之后很快end就是tap；

超过0.5秒就是press；

![](http://www.zhuanyongxigua.cn/2020-07-24-151901.jpg)

> 陀螺仪相关的api？

https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs