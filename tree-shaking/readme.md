# Tree Shaking

Tree shaking 常见用于 JavaScript 环境中来消除无用代码，或更确切地说，动态代码引入。他依赖 ES2015 模块 import/export 用于模块系统的 [static structure](http://exploringjs.com/es6/ch_modules.html#static-module-structure). 其名称与概念在 ES2015 模块 bundler roolup 中已经很流行了。

webpack 2 有内置的 ES2015 模块支持。及无用模块导出侦测。

## Example

考虑 math.js 是一个库，导出两个函数， square 和 cube:

```js
//This function isn't used anywhere
export function square(x){
    return x * x;
}
//This function gets included
export function cube(x){
    return x * x * x;
}
```

在 main.js 中，我们选择性地引入 cube:

```js
import { cube } from 'math.js';
console.log(cube(5)); // 125
```

运行 `node_modules/.bin/webpack main.js dist.js` 并视察 `dist.js` 发现 square.js 并没有输出 (见 "unused harmony export square" 注释):

```js
/* ... webpackBootstrap ... */
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export square */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
// This function isn't used anywhere
function square(x) {
  return x * x;
}

// This function gets included
function cube(x) {
  return x * x * x;
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__maths_js__ = __webpack_require__(0);

console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__maths_js__["a" /* cube */])(5)); // 125

/***/ })
```

当运行生产构建时，`node_modules/.bin/webpack --optimize main.js dist.min.js`, 构建中只有最小化的 cube 而非 square:

```js
/* ... */
function(e,t,n){"use strict";function r(e){return e*e*e}t.a=r}
/* ... */
function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);console.log(n.i(r.a)(5))}
```

## Terminology

`dead code`, 在计算机编程中，dead code 是程序源代码中执行但其结果从不使用的部分。dead code 的执行浪计算时间和内存。