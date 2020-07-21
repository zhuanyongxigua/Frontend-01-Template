/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./animation.js":
/*!**********************!*\
  !*** ./animation.js ***!
  \**********************/
/*! exports provided: Timeline, Animation, ColorAnimation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Timeline\", function() { return Timeline; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Animation\", function() { return Animation; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ColorAnimation\", function() { return ColorAnimation; });\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// 由于css的动画不可控，比如把\nvar Timeline = /*#__PURE__*/function () {\n  function Timeline() {\n    var _this = this;\n\n    _classCallCheck(this, Timeline);\n\n    this.animations = [];\n    this.requestID = null;\n    this.state = \"inited\"; // 写在这个地方就可以用箭头函数，写在class里面this是不固定的\n\n    this.tick = function () {\n      var t = Date.now() - _this.startTime;\n\n      var animations = _this.animations.filter(function (animation) {\n        return !animation.finished;\n      });\n\n      var _iterator = _createForOfIteratorHelper(_this.animations),\n          _step;\n\n      try {\n        for (_iterator.s(); !(_step = _iterator.n()).done;) {\n          var animation = _step.value;\n          var object = animation.object,\n              property = animation.property,\n              timingFunction = animation.timingFunction,\n              delay = animation.delay,\n              duration = animation.duration,\n              template = animation.template,\n              addTime = animation.addTime;\n          var progression = timingFunction((t - delay - addTime) / duration); // 0-1之前的数\n\n          if (t > duration + delay + addTime) {\n            progression = 1;\n            animation.finished = true;\n          }\n\n          var value = animation.valueFromProgression(progression);\n          object[property] = template(value); // 这种处理不好，不能restart了\n\n          if (progression === 1) {\n            _this.animations = [];\n          }\n        }\n      } catch (err) {\n        _iterator.e(err);\n      } finally {\n        _iterator.f();\n      }\n\n      if (animations.length) {\n        _this.requestID = requestAnimationFrame(_this.tick);\n      }\n    };\n  }\n\n  _createClass(Timeline, [{\n    key: \"pause\",\n    value: function pause() {\n      if (this.state !== 'playing') {\n        return;\n      }\n\n      this.state = 'pause';\n      this.pauseTime = Date.now();\n\n      if (this.requestID !== null) {\n        cancelAnimationFrame(this.requestID);\n      }\n    }\n  }, {\n    key: \"clear\",\n    value: function clear() {\n      this.state = 'inited';\n      this.animations.length = 0;\n    }\n  }, {\n    key: \"resume\",\n    value: function resume() {\n      if (this.state !== 'pause') {\n        return;\n      }\n\n      this.state = 'playing'; // 为啥是这个？\n\n      this.startTime += Date.now() - this.pauseTime;\n      this.tick();\n    }\n  }, {\n    key: \"start\",\n    value: function start() {\n      if (this.state !== 'inited') {\n        return;\n      }\n\n      this.state = 'playing';\n      this.startTime = Date.now();\n      this.tick();\n    }\n  }, {\n    key: \"restart\",\n    value: function restart() {\n      if (this.state === 'playing') {\n        this.pause();\n      }\n\n      this.animations = [];\n      this.requestID = null;\n      this.state = \"playing\";\n      this.startTime = Date.now();\n      this.pauseTime = null;\n      this.tick();\n    }\n  }, {\n    key: \"add\",\n    value: function add(animation, addTime) {\n      this.animations.push(animation);\n      animation.finished = false;\n\n      if (this.state === 'playing') {\n        animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;\n      } else {\n        animation.addTime = addTime !== void 0 ? addTime : 0;\n      }\n    }\n  }]);\n\n  return Timeline;\n}();\nvar Animation = /*#__PURE__*/function () {\n  function Animation(object, property, start, end, duration, delay, timingFunction, template) {\n    _classCallCheck(this, Animation);\n\n    this.object = object;\n    this.template = template;\n    this.property = property;\n    this.start = start;\n    this.end = end;\n    this.duration = duration;\n    this.delay = delay || 0; // 对应ease linear什么的\n\n    this.timingFunction = timingFunction;\n  }\n\n  _createClass(Animation, [{\n    key: \"valueFromProgression\",\n    value: function valueFromProgression(progression) {\n      return this.start + progression * (this.end - this.start);\n    }\n  }]);\n\n  return Animation;\n}();\nvar ColorAnimation = /*#__PURE__*/function () {\n  function ColorAnimation(object, property, start, end, duration, delay, timingFunction, template) {\n    _classCallCheck(this, ColorAnimation);\n\n    this.object = object;\n\n    this.template = template || function (v) {\n      return \"rgba(\".concat(v.r, \", \").concat(v.g, \", \").concat(v.b, \", \").concat(v.a, \")\");\n    };\n\n    this.property = property;\n    this.start = start;\n    this.end = end;\n    this.duration = duration;\n    this.delay = delay || 0; // 对应ease linear什么的\n\n    this.timingFunction = timingFunction;\n  }\n\n  _createClass(ColorAnimation, [{\n    key: \"valueFromProgression\",\n    value: function valueFromProgression(progression) {\n      return {\n        r: this.start.r + progression * (this.end.r - this.start.r),\n        g: this.start.g + progression * (this.end.g - this.start.g),\n        b: this.start.b + progression * (this.end.b - this.start.b),\n        a: this.start.a + progression * (this.end.a - this.start.a)\n      };\n    }\n  }]);\n\n  return ColorAnimation;\n}();\n/*\n\nlet animation = new Animation(object, property, start, end, duration, delay, duration, timingFunction)\n\nanimation.start()\nanimation.stop()\nanimation.pause()\nanimation.resume()\n// 如果有两个动画，怎么stop\n性能的原因，所以才会有时间线\n\nlet timeline = new Timeline;\n\ntimeline.add(animation);\ntimeline.add(animation2);\n\ntimeline.start()\ntimeline.stop()\n\n\n*/\n\n//# sourceURL=webpack:///./animation.js?");

/***/ }),

/***/ "./createElement.js":
/*!**************************!*\
  !*** ./createElement.js ***!
  \**************************/
/*! exports provided: createElement, Text, Wrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return createElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Text\", function() { return Text; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Wrapper\", function() { return Wrapper; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction createElement(Cls, attributes) {\n  var o;\n\n  if (typeof Cls === 'string') {\n    o = new Wrapper(Cls);\n  } else {\n    o = new Cls({});\n  }\n\n  for (var name in attributes) {\n    // 如果不单独写一个setAttribute，用直接复制如o[name] = attributes[name], attribute和property就等效了\n    o.setAttribute(name, attributes[name]);\n  }\n\n  var visit = function visit(children) {\n    var _iterator = _createForOfIteratorHelper(children),\n        _step;\n\n    try {\n      for (_iterator.s(); !(_step = _iterator.n()).done;) {\n        var child = _step.value;\n\n        if (_typeof(child) === 'object' && child instanceof Array) {\n          visit(child);\n          continue;\n        }\n\n        if (typeof child === 'string') {\n          child = new Text(child);\n        }\n\n        o.appendChild(child);\n      }\n    } catch (err) {\n      _iterator.e(err);\n    } finally {\n      _iterator.f();\n    }\n  };\n\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n\n  visit(children);\n  return o;\n}\nvar Text = /*#__PURE__*/function () {\n  function Text(text) {\n    _classCallCheck(this, Text);\n\n    this.children = [];\n    this.root = document.createTextNode(text);\n  }\n\n  _createClass(Text, [{\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }]);\n\n  return Text;\n}();\nvar Wrapper = /*#__PURE__*/function () {\n  function Wrapper(type) {\n    _classCallCheck(this, Wrapper);\n\n    this.children = [];\n    this.root = document.createElement(type);\n  }\n\n  _createClass(Wrapper, [{\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      this.children.push(child);\n    }\n  }, {\n    key: \"addEventListener\",\n    value: function addEventListener() {\n      var _this$root;\n\n      (_this$root = this.root).addEventListener.apply(_this$root, arguments);\n    }\n  }, {\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n\n      var _iterator2 = _createForOfIteratorHelper(this.children),\n          _step2;\n\n      try {\n        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {\n          var child = _step2.value;\n          child.mountTo(this.root);\n        }\n      } catch (err) {\n        _iterator2.e(err);\n      } finally {\n        _iterator2.f();\n      }\n    }\n  }, {\n    key: \"style\",\n    get: function get() {\n      return this.root.style;\n    }\n  }]);\n\n  return Wrapper;\n}();\n\n//# sourceURL=webpack:///./createElement.js?");

/***/ }),

/***/ "./cubicBezier.js":
/*!************************!*\
  !*** ./cubicBezier.js ***!
  \************************/
/*! exports provided: cubicBezier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cubicBezier\", function() { return cubicBezier; });\nfunction cubicBezier(p1x, p1y, p2x, p2y) {\n  var ZERO_LIMIT = 1e-6; // Calculate the polynomial coefficients,\n  // implicit first and last control points are (0,0) and (1,1).\n\n  var ax = 3 * p1x - 3 * p2x + 1;\n  var bx = 3 * p2x - 6 * p1x;\n  var cx = 3 * p1x;\n  var ay = 3 * p1y - 3 * p2y + 1;\n  var by = 3 * p2y - 6 * p1y;\n  var cy = 3 * p1y;\n\n  function sampleCurveDerivativeX(t) {\n    // `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.\n    return (3 * ax * t + 2 * bx) * t + cx;\n  }\n\n  function sampleCurveX(t) {\n    return ((ax * t + bx) * t + cx) * t;\n  }\n\n  function sampleCurveY(t) {\n    return ((ay * t + by) * t + cy) * t;\n  } // Given an x value, find a parametric value it came from.\n\n\n  function solveCurveX(x) {\n    var t2 = x;\n    var derivative;\n    var x2; // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation\n    // First try a few iterations of Newton's method -- normally very fast.\n    // http://en.wikipedia.org/wiki/Newton's_method\n\n    for (var i = 0; i < 8; i++) {\n      // f(t)-x=0\n      x2 = sampleCurveX(t2) - x;\n\n      if (Math.abs(x2) < ZERO_LIMIT) {\n        return t2;\n      }\n\n      derivative = sampleCurveDerivativeX(t2); // == 0, failure\n\n      /* istanbul ignore if */\n\n      if (Math.abs(derivative) < ZERO_LIMIT) {\n        break;\n      }\n\n      t2 -= x2 / derivative;\n    } // Fall back to the bisection method for reliability.\n    // bisection\n    // http://en.wikipedia.org/wiki/Bisection_method\n\n\n    var t1 = 1;\n    /* istanbul ignore next */\n\n    var t0 = 0;\n    /* istanbul ignore next */\n\n    t2 = x;\n    /* istanbul ignore next */\n\n    while (t1 > t0) {\n      x2 = sampleCurveX(t2) - x;\n\n      if (Math.abs(x2) < ZERO_LIMIT) {\n        return t2;\n      }\n\n      if (x2 > 0) {\n        t1 = t2;\n      } else {\n        t0 = t2;\n      }\n\n      t2 = (t1 + t0) / 2;\n    } // Failure\n\n\n    return t2;\n  }\n\n  function solve(x) {\n    return sampleCurveY(solveCurveX(x));\n  }\n\n  return solve;\n}\n\n//# sourceURL=webpack:///./cubicBezier.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement */ \"./createElement.js\");\n/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animation.js */ \"./animation.js\");\n/* harmony import */ var _cubicBezier_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cubicBezier.js */ \"./cubicBezier.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nvar Carousel = /*#__PURE__*/function () {\n  function Carousel(config) {\n    _classCallCheck(this, Carousel);\n\n    this.children = [];\n    this.attributes = new Map();\n    this.properties = new Map();\n  }\n\n  _createClass(Carousel, [{\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this[name] = value;\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      this.children.push(child);\n    }\n  }, {\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      this.render().mountTo(parent);\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this = this;\n\n      // JSX的组件是一等公民，可以随便的赋值给变量，这是非常舒服的地方\n      var children = this.data.map(function (url) {\n        var element = Object(_createElement__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(\"img\", {\n          src: url\n        });\n        element.addEventListener('dragstart', function (event) {\n          return event.preventDefault();\n        });\n        return element;\n      });\n      var stopBtn = Object(_createElement__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(\"button\", null, \"stop\");\n      var isStop = false;\n      var root = Object(_createElement__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(\"div\", {\n        \"class\": \"carousel\"\n      }, children, stopBtn);\n      var position = 0;\n      var tl = new _animation_js__WEBPACK_IMPORTED_MODULE_1__[\"Timeline\"]();\n      var ease = Object(_cubicBezier_js__WEBPACK_IMPORTED_MODULE_2__[\"cubicBezier\"])(0.25, .1, .25, 1);\n\n      var nextPic = function nextPic() {\n        // 注意这里不能有任何的DOM操作，因为我们是一个纯粹的视觉展现的东西\n        // 如果在这里重新append一下，不但改变了视觉效果，也改变了结构，语义也变了\n        // 行为会不可预期，元素之间的顺序变了\n        if (isStop) {\n          return;\n        }\n\n        var nextPosition = (position + 1) % _this.data.length;\n        var current = children[position];\n        var next = children[nextPosition]; // 这里就是把下一个挪到起始位置，再new一个Animation的话没有意义\n\n        next.style.transform = \"translateX(\".concat(100 - 100 * nextPosition, \"%)\"); // 这里加setTimeout是因为transition生效是需要间隔的\n\n        setTimeout(function () {\n          tl.clear();\n          var firstStatus = false;\n          var secondStatus = false;\n          tl.add(new _animation_js__WEBPACK_IMPORTED_MODULE_1__[\"Animation\"](current.style, 'transform', 0, 100, 1000, 0, ease, function (v) {\n            if (v === 100) {\n              firstStatus = true;\n\n              if (secondStatus) {\n                position = nextPosition;\n                nextPic(); // 由于position被改了，所以下面的表达式也要跟着变化一下\n\n                return \"translateX(\".concat(-v * position, \"%)\");\n              }\n            }\n\n            return \"translateX(\".concat(-v - 100 * position, \"%)\");\n          }));\n          tl.add(new _animation_js__WEBPACK_IMPORTED_MODULE_1__[\"Animation\"](next.style, 'transform', 0, 100, 1000, 0, ease, function (v) {\n            if (v === 100) {\n              secondStatus = true;\n\n              if (firstStatus) {\n                position = nextPosition;\n                nextPic(); // 由于position被改了，所以下面的表达式也要跟着变化一下\n\n                return \"translateX(\".concat(-v * position, \"%)\");\n              }\n            }\n\n            return \"translateX(\".concat(-v - 100 * (nextPosition - 1), \"%)\");\n          }));\n          tl.start(); // }, 16);\n        }, 3000);\n      };\n\n      root.addEventListener('mousedown', function (event) {\n        var startX = event.clientX,\n            startY = event.clientY;\n        var lastPosition = (position - 1 + _this.data.length) % _this.data.length;\n        var nextPosition = (position + 1) % _this.data.length;\n        var current = children[position];\n        var last = children[lastPosition];\n        var next = children[nextPosition];\n        current.style.transition = 'ease 0s';\n        last.style.transition = 'ease 0s';\n        next.style.transition = 'ease 0s';\n        current.style.transform = \"translateX(\".concat(-500 * position, \"px)\");\n        last.style.transform = \"translateX(\".concat(-500 - 500 * lastPosition, \"px)\");\n        next.style.transform = \"translateX(\".concat(500 - 500 * nextPosition, \"px)\");\n\n        var move = function move(event) {\n          // current.style.transition = 'ease 0s';\n          current.style.transform = \"translateX(\".concat(event.clientX - startX - 500 * position, \"px)\");\n          last.style.transform = \"translateX(\".concat(event.clientX - startX - 500 - 500 * lastPosition, \"px)\");\n          next.style.transform = \"translateX(\".concat(event.clientX - startX + 500 - 500 * nextPosition, \"px)\");\n        };\n\n        var up = function up(event) {\n          var offset = 0;\n\n          if (event.clientX - startX > 250) {\n            offset = 1;\n          } else if (event.clientX - startX < -250) {\n            offset = -1;\n          } // 把transition打开\n          // 平时用的时候这样写一定要加注释，非常的反直觉\n\n\n          current.style.transition = '';\n          last.style.transition = '';\n          next.style.transition = '';\n          current.style.transform = \"translateX(\".concat(offset * 500 - 500 * position, \"px)\");\n          last.style.transform = \"translateX(\".concat(offset * 500 - 500 - 500 * lastPosition, \"px)\");\n          next.style.transform = \"translateX(\".concat(offset * 500 + 500 - 500 * nextPosition, \"px)\");\n          position = (position - offset + _this.data.length) % _this.data.length;\n          document.removeEventListener('mousemove', move);\n          document.removeEventListener('mouseup', up);\n        }; // 如果在移动端还有touch事件的问题\n        // 还要使用touch事件\n\n\n        document.addEventListener('mousemove', move);\n        document.addEventListener('mouseup', up);\n      });\n      stopBtn.addEventListener('click', function () {\n        isStop = true; // tl.pause()\n      });\n      setTimeout(nextPic, 16);\n      return root;\n    }\n  }]);\n\n  return Carousel;\n}();\n\nvar component = Object(_createElement__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(Carousel, {\n  data: [\"https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg\", \"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg\", \"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg\", \"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg\"]\n});\ncomponent.mountTo(document.body);\n\n//# sourceURL=webpack:///./main.js?");

/***/ })

/******/ });