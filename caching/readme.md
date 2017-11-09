# Caching

这篇文章源自 [getting started](https://webpack.js.org/guides/getting-started), [output management](https://webpack.js.org/guides/output-management) 和 [code splitting](https://webpack.js.org/guides/code-splitting).

我们用 webpack 打包我们待布署到 `/dist` 目录中的模块化的应用程序。一旦 `/dist` 的目录部署到了服务器，客户端 (通常是济览器) 将 hit 服务器，抓取站点和资源。最后一步消耗时间，这也是为什么浏览器使用 [caching](http://searchstorage.techtarget.com/definition/cache) 技术。这使得站点加载更快，减少不必要的网络流量，然而当你要拾取新代码时这又是个头疼的问题。

*本篇指南关注于*确保 webpack 编译生成的文件可以仍然组存直至内容变化的*配置*。

## Output Filenames

确保济览器拾取变化的文件的简单方式是用 `output.filename` 代替。`[hash]` 替换可用于在文件名中包括构建特定的 hash, 然而使用 `[chunkhash]` 替换，在文件名中包含一个 chunk 特写的 hash 更好。

让我们用来自 [getting started](https://webpack.js.org/guides/getting-started) 的例子和来自 [output management](https://webpack.js.org/guides/output-management) 的 `plugins` 来建起我们的项目，因此我们不必手动维护我们的 `index.html` 文件。

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

webpack.config.js

```js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
-           title: 'Output Management',
            title: 'Caching'
        })
    ],
    output: {
-       filename: 'bundle.js'
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
运行构建脚本，`npm run build`, 以此配置应该会生成以下输出:

```
Hash: b724ca80b1526d93f0a4
Version: webpack 3.5.6
Time: 707ms
                               Asset       Size  Chunks                    Chunk Names
./dist/index_ac0f0c1d63b3ffb9d8ed.js     545 kB       0  [emitted]  [big]  index
                         favicon.ico    24.8 kB          [emitted]
                          index.html  250 bytes          [emitted]
   [0] ./src/index.js 309 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
   [4] ./src/print.js 61 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

你可以看到 bundle 的名称现在反映其内容 (via the hash). 如果我们不做改变再次编译，我们期望文件名保持一样。然而如果我们再次运行编译，我们发现不是这回事：

```
Hash: b724ca80b1526d93f0a4
Version: webpack 3.5.6
Time: 670ms
                               Asset       Size  Chunks                    Chunk Names
./dist/index_ac0f0c1d63b3ffb9d8ed.js     545 kB       0  [emitted]  [big]  index
                         favicon.ico    24.8 kB          [emitted]
                          index.html  250 bytes          [emitted]
   [0] ./src/index.js 309 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
   [4] ./src/print.js 61 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

这是因为 webpack 包含了某些样板文件，具体地来说是是 runtime 和 manifest，每个 chunk 都有。

> 根据你当前的 webpack 版本输出可能不同。新版本可能没有老版本同样的 hashing 问题，但我们仍然推存按照后面的步骤以防万一。

## Extracting Boilerplate

我们在 [code splitting](https://webpack.js.org/guides/code-splitting) 中学过，[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin) 可用于将模块分割成单独的 bundles. 鲜为人知的特色是 `CommonsChunkPlugin` 提取 webpack 每次构建都可能变化的 boilerplate 和 manifest 为单独的 bundle:

webpack.config.js

```js
  const path = require('path');
+ const webpack = require('webpack');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Caching'
-     })
+     }),
+     new webpack.optimize.CommonsChunkPlugin({
+       name: 'runtime'
+     })
    ],
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

让我们再次运行 build, 可以看到提取的 `runtime` bundle:

```
Hash: 80552632979856ddab34
Version: webpack 3.3.0
Time: 1512ms
                          Asset       Size  Chunks                    Chunk Names
   main.5ec8e954e32d66dee1aa.js     542 kB       0  [emitted]  [big]  main
runtime.719796322be98041fff2.js    5.82 kB       1  [emitted]         runtime
                     index.html  275 bytes          [emitted]
   [0] ./src/index.js 336 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
```

提取第三方库如，`lodash` 或 `react` 也是很好的实践。分出一个 `vendor` chunk, 因此他们他们比本地源代码少有变化。这个步骤使得客户端保持更新请求的更少。能过结合一个新的 `entry` 点和另一个 `CommonsChunkPlugin` 实例便可做到：

webpack.config.js

```js
 var path = require('path');
  const webpack = require('webpack');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     main: './src/index.js',
+     vendor: [
+       'lodash'
+     ]
+   },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Caching'
      }),
+     new webpack.optimize.CommonsChunkPlugin({
+       name: 'vendor'
+     }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ],
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

> 注意顺序很重要，`CommonsChunPlugin` 的 `vendor` 实例必须先于 `runtime` 实例。

让我们运行我们新的 `vendor` bundle 构建：

```
Hash: e1e0506e406ae61f810e
Version: webpack 3.5.6
Time: 694ms
                                Asset       Size  Chunks                    Chunk Names
./dist/vendor.8196d409d2f988123318.js     541 kB       0  [emitted]  [big]  vendor
 ./dist/index.5a358214977a52075516.js  767 bytes       1  [emitted]         index
./dist/common.eef25d99b660c8259ae8.js    5.86 kB       2  [emitted]         common
                          favicon.ico    24.8 kB          [emitted]
                           index.html  250 bytes          [emitted]
   [1] ./index.js 312 bytes {1} [built]
   [4] multi lodash 28 bytes {0} [built]
    + 3 hidden modules
```

## Module Identifiers

让我们给我们的项目添加另一个模块 `print.js`。

project

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
   |- index.js
+  |- print.js
|- /node_modules
```

print.js

```js
+ export default function print(text){
+   console.log(text);
+ }
```

src/index.js

```js
  import _ from 'lodash';
+ import Print from './print';
  function component(){
    var element = document.createElement('div');

    // Lodash, now impored by the script
+   element.innerHTML = _.join(['Hello', 'webpack']);

    return element;
  }

  document.body.appendChild(component());
```

运行编译，我们只期望我们的 `main` bundle 的 hash 变化，然而三个都变了:

```
Hash: 44f1ef33042d02ff59d8
Version: webpack 3.5.6
Time: 734ms
                                Asset       Size  Chunks                    Chunk Names
./dist/vendor.a7561fb0e9a071baadb9.js     541 kB       0  [emitted]  [big]  vendor
 ./dist/index.5e9dc821c555f1ee0c04.js    1.11 kB       1  [emitted]         index
./dist/common.db72711ac6ded0b24517.js    5.86 kB       2  [emitted]         common
                          favicon.ico    24.8 kB          [emitted]
                           index.html  250 bytes          [emitted]
   [1] ./index.js 309 bytes {1} [built]
   [4] ./print.js 61 bytes {1} [built]
   [5] multi lodash 28 bytes {0} [built]
    + 3 hidden modules
```

这是因此每个 [module.id]() 基于默认的解析顺序都增长了。这意味着当解析顺序变化时，IDs 也会发生变化。让我们简要地说明下：

* `main` bundle 变化是因为新的内容。
* `vendor` bundle 变化是因为 `module.id` 的变化。
* `runtime` bundle 变化是因为他包含至亲的模块的引用。

第一个和最后一个都是在预料之中的，`vendor` 的 hast 是我们想要修复的。幸运的是，有两个插件可以帮我们解决这个问题。第一个是 [NamedModulesPlugin](https://webpack.js.org/plugins/named-modules-plugin), 将会使用模块的路径而非数字标识符。开发时用这个插件可以获得更加可读的输出，不过运行他花费时间有点称。第二是 [HashedModuleIdsPlugin](https://webpack.js.org/plugins/hashed-module-ids-plugin), 推荐生产构建使用。

webpack.config.js

```js
 const path = require('path');
  const webpack = require('webpack');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      main: './src/index.js',
      vendor: [
        'lodash'
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Caching'
      }),
+     new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ],
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

现在，不管是否有新的本地依赖，我们的 `vendor` hash 应该在构建之间保持一致:

```
Hash: ab04b8f1c7c9c5b7347b
Version: webpack 3.5.6
Time: 708ms
                                Asset       Size  Chunks                    Chunk Names
./dist/vendor.dd565abf41f912993d4b.js     541 kB       0  [emitted]  [big]  vendor
 ./dist/index.e98e7f7fa06b830cea30.js    1.11 kB       1  [emitted]         index
./dist/common.49e954a62ded8a0465ea.js    5.86 kB       2  [emitted]         common
                          favicon.ico    24.8 kB          [emitted]
                           index.html  250 bytes          [emitted]
[GHqH] ./print.js 61 bytes {1} [built]
   [0] multi lodash 28 bytes {0} [built]
[JkW7] ./index.js 309 bytes {1} [built]
    + 3 hidden modules
```

修改 `src/index.js` 暂时移除额外的依赖:

src/index.js

```js
  import _ from 'lodash';
- import Print from './print';
+ // import Print from './print';

  function component() {
    var element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-   element.onClick = Print.bind(null, 'Hello webpack!');
+   // element.onClick = Print.bind(null, 'Hello webpack!');

    return element;
  }

  document.body.appendChild(component());
```

再次构建：

```
Hash: 1a719f931240c1bb2149
Version: webpack 3.5.6
Time: 878ms
                                Asset       Size  Chunks                    Chunk Names
./dist/vendor.dd565abf41f912993d4b.js     541 kB       0  [emitted]  [big]  vendor
 ./dist/index.c8d0cea56d7d0b622e2d.js  776 bytes       1  [emitted]         index
./dist/common.6b678ae451379b868a22.js    5.86 kB       2  [emitted]         common
                          favicon.ico    24.8 kB          [emitted]
                           index.html  250 bytes          [emitted]
   [0] multi lodash 28 bytes {0} [built]
[JkW7] ./index.js 312 bytes {1} [built]
    + 3 hidden modules
```

可以发现再次构建 `vendor` bundle 文件名中的 hash 一致。

## Conclusion

Caching 合凌乱变得清晰简单。学完上面的步骤应该给你布置一到可缓存资源的良好开端。

## Further Reading

* [Predictable Long Term Caching](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)
* [Long Term Caching of Static Assets](https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.vtwnssps4)
* [Webpack & Caching](https://gist.github.com/sokra/ff1b0290282bfa2c037bdb6dcca1a7aa)
* [Advance Webpack Presentation](https://presentations.survivejs.com/advanced-webpack/)
* [Issue 1315](https://github.com/webpack/webpack/issues/1315)
* [Issue 652](https://github.com/webpack/webpack.js.org/issues/652)