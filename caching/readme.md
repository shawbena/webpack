# Caching

这篇文章源自 [getting started](https://webpack.js.org/guides/getting-started), [output management](https://webpack.js.org/guides/output-management) 和 [code splitting](https://webpack.js.org/guides/code-splitting).

我们用 webpack 打包我们待布署到 `/dist` 目录中的模块化的应用程序。一旦 `/dist` 的目录部署到了服务器，客户端 (通常是济览器) 将 hit 服务器，抓取站点和资源。最后一步消耗时间，这也是为什么浏览器使用 [caching](http://searchstorage.techtarget.com/definition/cache) 技术。这使得站点加载更快，减少不必要的网络流量，然而当你要拾取新代码时这又是个头疼的问题。

*本篇指南关注于*确保 webpack 编译生成的文件可以仍然组存直至内容变化的*配置*。

## Output Filenames

确保济览器拾取变化的文件的简单方式是用 `output.filename` 代替法。`[hash]` 替换可用于在文件名中包括构建特写的 hash, 然而使用 `[chunkhash]` 替换，在文件名中包含一个 chunk 特写的 hash 更好。

让我们用来自 [getting started](https://webpack.js.org/guides/getting-started) 的例子子和来自 [output management](https://webpack.js.org/guides/output-management) 的 `plugins` 所以我们不必手动维护我们的 `index.html` 文件。

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