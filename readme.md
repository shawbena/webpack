# Code Splitting

这篇指南扩展了 [Getting Started](https://webpack.js.org/guides/getting-started) 和 [Managing Built Files](https://webpack.js.org/guides/output-management) 中的例子。请确保你至少熟悉其中的一个例子。

Code spliting 是 webpack 中最引人眼球的特色之一。这个特色使得可以将你的代码分成各种 bundles 稍后按需或并行加载。他可用于获得更小的 bundles 和控制资源加载优化，如果使用得当，可对加载时间产生强大的冲击。

常见的 code splittting 的三种方式：

- Entry Points: 使用 [entry](https://webpack.js.org/configuration/entry-context)配置手动分割代码。

- Prevent Duplication: 使用 [CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin) 删除重复资料并分割 chunks.

- 动态 imports: 通进模块中的内联函数调用分割代码。

## Entry Points

这是目前最容易，也是最直观的分割代码的方式。然而这有点手动并且会遇到一些陷阱。让我们看看怎样从主 bundle 中分割出另一个模块：

正如我们上面提的过的这种方式有陷阱：

- 如果 entry chunks 之间有重复的模块，将都包括在 bundles 中。

- 不灵活，也不能动态分割出核心代码逻辑。

```bash output
Hash: 7f680dab2c0aa67e49dd
Version: webpack 3.2.0
Time: 1178ms
                                       Asset       Size  Chunks                    Chunk Names
./fonts/ed63b8f1167ac0a209f465a5d3f47e33.otf     105 kB          [emitted]         
                        ./dist/app.bundle.js     561 kB       0  [emitted]  [big]  app
                    ./dist/another.bundle.js     544 kB       1  [emitted]  [big]  another
                                  index.html  267 bytes          [emitted]         
   [1] (webpack)/buildin/global.js 509 bytes {0} {1} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} {1} [built]
   [3] ./src/index.js 643 bytes {0} [built]
   [4] ./src/style.scss 1.16 kB {0} [built]
   [5] ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js?{}!./src/style.scss 356 bytes {0} [built]
   [7] ./src/fonts/exo.otf 90 bytes {0} [built]
  [10] ./src/print.js 84 bytes {0} [built]
  [11] ./src/another-module.js 90 bytes {1} [built]
    + 4 hidden modules
Child html-webpack-plugin for "index.html":
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

首先我们例子中的这两个点绝对是一个问题，因为 `./src/index.js` 也引入了 `lodash`, 因此将会在 bundle 中重复。让我们用 `CommonsChunkPlugin` 移除重复。

## Prevent Duplication

[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin) 使得我们把通用的依赖提取成一个 entry chunk 或者一个全新的 chunk. 让我们用这从前一个例子中移除重复的 `lodash` 依赖：

用上了 `CommonsChunkPlugin`, 我们应该看到重复的依赖已经从 `index.bundle.js` 中移除了。插件应该注意到了我们想把 `lodash` 分割成一个独立的 chunk 并将其从我们的主 bundle 中移除。让我们  `npm run build` 看下他是否好用：

```bash output
Hash: 5056cf16b35b36a135ab
Version: webpack 3.2.0
Time: 1003ms
                                       Asset       Size  Chunks                    Chunk Names
./fonts/ed63b8f1167ac0a209f465a5d3f47e33.otf     105 kB          [emitted]
                        ./dist/app.bundle.js      17 kB       0  [emitted]         app
                    ./dist/another.bundle.js  541 bytes       1  [emitted]         another
                     ./dist/common.bundle.js     547 kB       2  [emitted]  [big]  common
                                  index.html  337 bytes          [emitted]
   [1] ./src/index.js 457 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {2} [built]
   [3] (webpack)/buildin/module.js 517 bytes {2} [built]
   [4] ./src/style.scss 1.16 kB {0} [built]
   [5] ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js?{}!./src/style.scss 356 bytes {0} [built]
   [7] ./src/fonts/exo.otf 90 bytes {0} [built]
  [10] ./src/another-module.js 90 bytes {1} [built]
    + 4 hidden modules
Child html-webpack-plugin for "index.html":
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

正面是社区提供的一些用于分割代码的有用的插件和 loader：

- [ExtractTextPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin): 用于从主应用程序中分割 CSS.
- [bundle-loader](https://webpack.js.org/loaders/bundle-loader): 用于分割代码和懒加载结果 bundles.
- [promise-loader](https://github.com/gaearon/promise-loader): 类似 `bundle-loader` 但用 promise.

*`CommonsChunkPlugin`* 也[explicit vendor chunks](https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk) 用于从核心应用代码中分割 vendors 模块。

## Dynamic Imports

当涉及到动态代码分割时 webpack 支持两种相似的技术。第一种也是更好的方式是使用 [import() syntax](https://webpack.js.org/api/module-methods#import-), 这也是遵照 [ECMAScript proposal](https://github.com/tc39/proposal-dynamic-import) 的动态引入。老的，webpack 特写的方式是用 [require.ensure](https://webpack.js.org/api/module-methods#require-ensure)。让我们试着用用两种方式中的第一个...

在开始前，让我们先从配置文件中移除额外的 `entry` 和 `CommonsChunkPlugin`，接下来的演示已经不需要了：

更新我们的项目移除无用的文件：

现在我们将要用动态引入分割一个独立的 chunk，而非静态的引入 `lodash`:

如果你通过像 babel 这样的预处理器启用了 [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), 注意你可以简化代码 因为 `import` 语句中返回 promises:

```js
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then(module => {
-     var element = document.createElement('div');
-
-     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-     return element;
-
-   }).catch(error => 'An error occurred while loading the component');
+   var element = document.createElement('div');
+   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+
+   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+   return element;
  }

  getComponent().then(component => {
    document.body.appendChild(component);
  });
```

## 接下来

看看 [Lazy loading](https://webpack.js.org/guides/lazy-loading) 更具体的 `import()` 可用于真实应用程序的详细例子，和 [Caching](https://webpack.js.org/guides/caching) 学习下怎样更加有效的分割代码。