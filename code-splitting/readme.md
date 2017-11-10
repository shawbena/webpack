# Code Splitting

这篇指南扩展了 [Getting Started](https://webpack.js.org/guides/getting-started) 和 [Managing Built Files](https://webpack.js.org/guides/output-management) 中的例子。请确保你至少熟悉其中的一个例子。

Code spliting 是 webpack 中最吸引人 (compelling) 的特色之一。这个特色使得可以将你的代码分成各种 bundles 稍后按需或并行加载。他可用于获得更小的 bundles 和控制资源加载优化，如果使用得当，可对加载时间产生强大的冲击。

常见的 code splittting 的三种方式：

- Entry Points: 使用 [entry](https://webpack.js.org/configuration/entry-context)配置手动分割代码。

- Prevent Duplication: 使用 [CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin) 删除重复资料并分割 chunks.

- 动态 imports: 通进模块中的内联函数调用分割代码。

## Entry Points

这是目前最容易，也是最直观的分割代码的方式。然而这有点手动并且会遇到一些陷阱。让我们看看怎样从主 bundle 中分割出另一个模块：

__project__

```diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
   |- index.js
+  |- anothe-module.js
|- /node_modules
```

__another-modules.js__

```js
import _ from 'loadash';

console.log(
    _.join(['Another', 'module', 'lodash!'], ' ');
);
```

__webpack.config.js__

```js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        another: './src/another-module.js'
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Code Splitting'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
这将生成以下输出：

```bash
Hash: af07450fdca97df4d499
Version: webpack 3.8.1
Time: 776ms
              Asset       Size  Chunks                    Chunk Names
    ./app.bundle.js     544 kB       0  [emitted]  [big]  app
./another.bundle.js     544 kB       1  [emitted]  [big]  another
         index.html  257 bytes          [emitted]
   [1] (webpack)/buildin/global.js 488 bytes {0} {1} [built]
   [2] (webpack)/buildin/module.js 495 bytes {0} {1} [built]
   [3] ./src/index.js 434 bytes {0} [built]
   [4] ./src/another-module.js 90 bytes {1} [built]
```

正如我们上面提的过的这种方式有陷阱：

- 如果 entry chunks 之间有重复的模块，将都包括在 bundles 中。

- 不灵活，也不能动态分也与核心代码逻辑分开。

首先我们例子中的这两个点绝对是问题，因为 `./src/index.js` 也引入了 `lodash`, 因此将会在 bundle 中重复。让我们用 `CommonsChunkPlugin` 移除重复。

## Prevent Duplication

[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin) 使得我们把通用的依赖提取成一个 entry chunk 或者一个全新的 chunk. 让我们用这从前一个例子中移除重复的 `lodash` 依赖：

//也可以将重复的模块提取取到现有入口点 (如 `index` 中), 而非创建新的入口点 `common`

__webpack.config.js__

```diff
  const path = require('path');
+ const webpack = require('webpack');
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      index: './src/index.js',
      another: './src/another-module.js'
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Code Splitting'
-     })
+     }),
+     new webpack.optimize.CommonsChunkPlugin({
+       name: 'common' // Specify the common bundle's name.
+     })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

用上了 `CommonsChunkPlugin`, 我们应该看到重复的依赖已经从 `index.bundle.js` 中移除了。插件应该注意到了我们想把 `lodash` 分割成一个独立的 chunk 并将其从我们的主 bundle 中移除。让我们  `npm run build` 看下他是否好用：

```bash output
Hash: ee98178d32ac060a6e4d
Version: webpack 3.8.1
Time: 735ms
              Asset       Size  Chunks                    Chunk Names
    ./app.bundle.js  889 bytes       0  [emitted]         app
./another.bundle.js  539 bytes       1  [emitted]         another
 ./common.bundle.js     547 kB       2  [emitted]  [big]  common
         index.html  322 bytes          [emitted]
   [1] ./src/index.js 434 bytes {0} [built]
   [2] (webpack)/buildin/global.js 488 bytes {2} [built]
   [3] (webpack)/buildin/module.js 495 bytes {2} [built]
   [4] ./src/another-module.js 90 bytes {1} [built]
```

正面是社区提供的一些用于分割代码的有用的插件和 loader：

- [ExtractTextPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin): 用于从主应用程序中分割 CSS.
- [bundle-loader](https://webpack.js.org/loaders/bundle-loader): 用于分割代码和懒加载结果 bundles.
- [promise-loader](https://github.com/gaearon/promise-loader): 类似 `bundle-loader` 但用 promise.

*`CommonsChunkPlugin`* 也[explicit vendor chunks](https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk) 用于从核心应用代码中分割 vendors 模块。

## Dynamic Imports

当涉及到动态代码分割时 webpack 支持两种相似的技术。第一种也是更好的方式是使用 [import() syntax](https://webpack.js.org/api/module-methods#import-), 这也是遵照 [ECMAScript proposal](https://github.com/tc39/proposal-dynamic-import) 的动态引入。老的，webpack 特定的方式是用 [require.ensure](https://webpack.js.org/api/module-methods#require-ensure)。让我们试着用用两种方式中的第一个...

`import()` 调用内部使用 [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). 如果你要在老的浏览器上使用 `import()`, 记得使用诸如 [es6-promise](https://github.com/stefanpenner/es6-promise) 或 [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) 给 `Promise` 打个补丁。

在开始前，让我们先从配置文件中移除额外的 [entry](/concepts/entry-points/) 和 [CommonsChunkPlugin](/plugins/commons-chunk-plugin)，接下来的演示已经不需要了：

更新我们的项目移除无用的文件：

__webpack.config.js__

```diff
 const path = require('path');
- const webpack = require('webpack');
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
+     index: './src/index.js'
-     index: './src/index.js',
-     another: './src/another-module.js'
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Code Splitting'
-     }),
+     })
-     new webpack.optimize.CommonsChunkPlugin({
-       name: 'common' // Specify the common bundle's name.
-     })
    ],
    output: {
      filename: '[name].bundle.js',
+     chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

__project__

```diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
   |- index.js
-  |- another-module.js
|- /node_modules
```

__src/index.js__

```diff
- import _ from 'lodash';
-
- function component() {
+ function getComponent() {
-   var element = document.createElement('div');
-
-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
+     var element = document.createElement('div');
+
+     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+     return element;
+
+   }).catch(error => 'An error occurred while loading the component');
  }

- document.body.appendChild(component());
+ getComponent().then(component => {
+   document.body.appendChild(component);
+ })
```

注意注释中用的 `webpackChunkName`. 这使得我们独立的 bundle 被命名为 `lodash.bundle.js` 而非只是 `[id].bundle.js`.对于 `webpackChunkName` 的信息和其他可用的选项，见 [import() documentation](/api/module-methods#import-). 让我们运行 webpack 看看：

```bash
Hash: 4309d2cf882d8843da4b
Version: webpack 3.8.1
Time: 1157ms
               Asset       Size  Chunks                    Chunk Names
    lodash.bundle.js     541 kB       0  [emitted]  [big]  lodash
     ./app.bundle.js     6.6 kB       1  [emitted]         app
lodash.bundle.js.map     645 kB       0  [emitted]         lodash
 ./app.bundle.js.map     6.8 kB       1  [emitted]         app
          index.html  191 bytes          [emitted]
   [0] ./src/index.js 728 bytes {1} [built]
   [2] (webpack)/buildin/global.js 488 bytes {0} [built]
   [3] (webpack)/buildin/module.js 495 bytes {0} [built]
```

如果你通过类似 babel 这样的预处理器启用了 [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), 佻可以简化代码因为 `import()` 语名只返回 promises.

___src/index.js__

```diff
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
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

## Bundle Analysis

一旦你开始分割你的代码，分析输出检查模块在哪里终止是很有用的。[official analyze tool](https://github.com/webpack/analyse) 是开始的好地方。也有一些社区支持的选择：

- [webpack-chart](https://alexkuz.github.io/webpack-chart/): 用于 webpack 统计 (stats) 的交互饼图。

- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 bunldes 以发现哪个模块占用空间及哪些可能重复。

- [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer): 一个插件和 CLI 工具，将 bundle 内容表示为便利的交互性可缩放的 treemap.

## Next Steps

看看 [Lazy loading](https://webpack.js.org/guides/lazy-loading) 更具体的 `import()` 可用于真实应用程序的详细例子，和 [Caching](https://webpack.js.org/guides/caching) 学习下怎样更加有效的分割代码。