# webpack-demo2

## creating a bundle

在这个示例中，`index.js` 明确声明 需要`lodash`, 并绑定其 `_`, 没有全局作用哉污染。从一个模块开始的依赖，webpack 可以使用这个信息构建一个依赖图表，然后用这个图表生成优化的 bundle，脚本在 bundle 中按正确的顺序执行。

以 `/src/index.js` 作为 [entry point](https://webpack.js.org/concepts/entry-points)，`bundle.js` 作为 [output](https://webpack.js.org/concepts/output).

```bash
./node_modules/.bin/webpack src/index.js dist/bundle.js
```

在浏览器中打开 `index.html`, 如果一切顺利，你应该看到以下文本： 'Hello webpack'.

## es2015 模块

虽然目前大多浏览器还不支持 `import` 和 `export`, webpack 的确支持。实际上，webpack "traspiles" 代码，所以老的浏览器也可以运行。如果你视察下 `dist/bundle.js`, 可能你会发现 webpack 是怎么做的, 多么神奇啊！

webpack 不会警告除 `import` 和 `export` 的语句。如果你使用其他 [ES2015 特色](http://es6-features.org/), 确保使用如 `Babel` 或 `Bublé` 这样的编译器。见 [Module API](https://webpack.js.org/api/module-methods) 文档关于 webpack 支持的不同的模块的语法。

## 使用配置文件

大多项目支持一个复杂的设置，这是为什么 webpack 支持[配置文件](https://webpack.js.org/concepts/configuration) 这比在终端键入一堆命令有效得多，所以让我们创建一个配置文件来代替前面用过的命令行行选项吧：

`webpack.config.js`

```js
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

现在让我们用我们的配置文件再次构建项目：

```bash
./node_modules/.bin/webpack --config webpack.config.js
```

如果有 `webpack.config.js`, `webpack` 命令将默认挑中他。此处我们使用 `--config` 选项只是展示下你可以传递任意名称的配置文件。对于需要分成多个文件的复杂配置来说是很有用的。

一个配置文件带来的灵活性远比简单的 CLI 用法灵活得多。能过这样的方式我们可以指定 loader 规则，plugins, 解析选项和很多其他的其他的增强功能。见[配置文件](https://webpack.js.org/configuration)以学习更多。

## NPM 脚本

鉴于从 CLI 运行本地复本的 webpack 不是那么有趣，我们可以建立一个小小的快捷方式。让我们往 package.json 中添加一个 [npm script](https://docs.npmjs.com/misc/scripts):

package.json

```json
...
"script": {
  "build": "webpack"
}
...
```

现在可用 `npm run build` 来替代我们之前用的长长的命令行。在 `scripts` 中我们可以通过名称引用本地安装的 npm 包而不用写出完整的路径。这种习俗在大多基于 npm 的项目中是标准的并且允许我们直接调用 `webpack` 而非 `node_modules/webpack/bin/webpack.js`

## Conclusion

现在你已经有一个基本的构建，你该去下个指南 `Asset Management` 学习下怎样用 webpack 管理 assets 如 images 和 fonts. 至此你泊项目结构应该是这样子：

``` structure
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
|- /node_modules
```

如果你想了解更多关于 webpack 的设计，你可以学习下 [basic concepts](https://webpack.js.org/concepts)和 [configuration](https://webpack.js.org/configuration) 页面。更多深入 [AIP](https://webpack.js.org/api) 章节 webpack 提供的各种接口。