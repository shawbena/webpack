# Tree Shaking

Tree shaking 术语常见用于 JavaScript 环境中来消除无用代码，或更确切地说，动态代码引入。他依赖 ES2015 模块 import/export 用于模块系统的 [static structure](http://exploringjs.com/es6/ch_modules.html#static-module-structure). 其名称与概念在 ES2015 模块 bundler roolup 中已经很流行了。

webpack 2 有内置的 ES2015 模块 (alias _harmony modules_) 支持。及无用模块导出侦测。

这篇指南的剩下部分将分支于 [Getting Started](/guides/getting-started). 如果你没有读完那篇指南，请读下。

## Add a Utility

让我们给项目添加一个新的工具文件， `src/math.js`, 导出两个函数：

__project__

```diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
   |- bundle.js
   |- index.html
|- /src
   |- index.js
   |- math.js
|- /node_modules
```

__src/index.js__

```diff
- import _ from 'lodash';
+ import { cube } from './math.js';

  function component(){
-   var element = document.createElement('div');
+   var element = document.createElement('pre');

-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'Webpack'], ' ');
+   element.innerHTML = [
+     'Hello webpack!',
+     '5 cubed is equal to ' + cube(5)
+   ];

    return element;
  }

  document.body.appendChild(component());
```

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

注意我们没有 `import` `src/math.js` 模块中的 `square` 方法。那个函数就是所谓的 "dead code", 意思是无用的 `export` 应该被丢掉。现在让我们运行 npm 脚本, `npm run build` 并视察输出模块：

__dist/bundle.js (around lines 78 - 92)__

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export square */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
//This function isn't used anywhere
function square(x){
    return x * x;
}

//This function gets included
function cube(x){
    return x * x * x;
}
```

注意上面的 `unused harmony export square` 注释。如果你看下面的代码，你会注意到 `square` 并没有被导出，然而他仍然包括在 bundle 中。接下来我们将解决他。

## Minify the Output

我们通过使用 `import` 和 `export` 语法丢掉了我们的无用代码。但我们仍然要把他从 bundle 中丢掉。要这么做，我们往配置文件添加一个支持移除无用代码的 minifier -- the [UglifyJSPlugin](/plugins/uglifyjs-webpack-plugin)...

先安装他：

```bash
npm i --save-dev uglifyjs-webpack-plugin
```

__webpack.config.js__

```diff
  const path = require('path');
+ const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   }
+   plugins: [
+     new UglifyJSPlugin()
+   ]
  };
```

注意 `--optimize-minimize` 标志也可插入 `UglifyJSPlugin` 中。//没有见有此选项

准备好时，我们再次运行 `npm run build` 看有什么变化。

注意到 `dist/bundle.js` 有什么变化吗？显然现在整个模块被 minified 和 mangled, 但是如果你仔细看下，你不会看到 `square` 函数，但会看到 mangled 版的 `cube` 函数 `function r(e){return e*e*e}n.a=r`. 有了压缩和 tree shaking 我们的 bundle 现在只有几个字节！这个人为的小例子可能起不上什么大的作用，当处理有复杂依赖的大应用时 tree shaking 显著地减少 bundle 的大小。

## Conclusion

所以，我们学到了为了利用 _tree shaking_ 的优势，你必须:

- 使用 ES2015 模块语法 (i.e. `import` 和 `export`)

- 引入支持移除无用代码的 minifier (如 `UglifyJSPlugin`)

你可以将你的应用程序想象为一颗树。你使用的源代码和库代表绿色，活的树叶。无用代码表示棕色，死掉的被秋天消耗掉的树叶。为了摆脱死的树叶，你要摇下树，使他们落下。

如果你对优化输出的其他方式也感兴趣，你跳到 [production](/guides/production) 构建的细节.
## Terminology

`dead code`, 在计算机编程中，dead code 是程序源代码中执行但其结果从不使用的部分。dead code 的执行浪计算时间和内存。