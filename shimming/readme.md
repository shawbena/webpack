# Shimming

`webpack` 编译器可以理解 ES2015 模块，CommonJS 模块或 AMD 模块。

然而一些第三方库可能期望有 global 依赖 (e.g. `$` for `jQuery`). 这些库可以创需要输出的全局变量。这些 "模块破坏者" 正是 shimming 的用武之地。

> *我们不推荐使用全局量!* 整个概念是 webpack 允许更多的模块化的前端开发。这意味着写良好包含的且不依赖隐藏依赖 (如全局变量) 的独立模块。请仅在需要时使用这样的特色。

另一种情形是 shimming 用于 polyfill 流览器功能以支援某些用户。这种情形，你可能只想对需要打补丁的济览器发布这些 polyfills (如按需加载).

下面的文章将带你经历下这些使用情形。

> 为了简单起见，这篇指南分支于 [Getting Started](https://webpack.js.org/guides/getting-started). 请在行动前确保你熟悉这些设置。

## Shimming Globals

让我们开始第一个 shimming global variables 的使用情形。在开始前让我们先看下我们的项目：

project

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
   |- index.js
|- /node_modules
```

记得我们用过的 `lodash` 包吗？为了演示，让我们假设我们想把他提供为贯穿我们应用程序的全局变量。

[ProvidePlugin](https://webpack.js.org/plugins/provide-plugin)使一个包变身为通过 webpack 编译的每个模块可用的变量。如果 webpack 看见用了那个变量，他将会在最终的 bundle 中包括这个给定的包裹。让我们移除 `lodash` 的 `import` 语句而是用插件引用：

src/index.js

```js
- import _ from 'lodash';
-
  function component() {
    var element = document.createElement('div');

-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

webpack.config.js

```js
const path = require('path');
module.exports = {
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   },
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash'
+     })
+   ]
};
```