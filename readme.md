# Development

这篇指南是在 [Output Management](https://webpack.js.org/guides/output-management) 指南上扩展的。

如果你一直在跟进指南，你应该对 webpack 的基础有牢固的理解。在开始前，让我们研究下设置个开发环境来使我们的工作更加轻松。

本指南中的的工具仅适用于开发，生产中请避免使用！！

## Using source maps

当 webpack bundles 你的源代码时，很难追踪原始位置的错误衙警告。例如，你有把三个源文件 (a.js, b.js 和 c.js) bundle 成一个 bundle (bundle.js)，其中一个源文件包含一个错误，栈追踪仅指向 `bundle.js`。这不怎么有帮助，因为你想确切地知道错误来自哪个源文件。

为了使得追踪错误和警告简单，JavaScript 提供 [source maps](http://blog.teamtreehouse.com/introduction-source-maps), 将编译后的代码映射回源代码。如果错误来源于 b.js, Source Map 将告诉你他在哪。

source maps 有很多[不同的选项](https://webpack.js.org/configuration/devtool), 看下以配置你需要的。

本指南，我们用 `inline-source-map` 选项，这样做解释有好处 (然而不能用于生产)：

现在打开 `index.html` 点击 button 找下控制台上显示错误的地方。错误应该和下面的差不多：

```console
Uncaught ReferenceError: cosnole is not defined
    at HTMLButtonElement.printMe (print.js:2)
```

我们可以看到错误包含指向文件的引用 (print.js) 和错误出现的行号 (2)。这很棒，我们精确地知道去哪里修复问题。

## Choosing a Development Tool

一些编辑器有 `safe write` 功能，可能会于以下的一引起工具交互。读下 [Adjusting Your text Editor](https://webpack.js.org/guides/development/#adjusting-your-text-editor) 寻找此问题的解决方法。

每次你想编译代码时手动运行 `npm run build` 很麻烦。

webpack 提供了一些不同的选项当你的代码变化时来帮助你自动编译代码：

1.webpack 的 Watch Mode

2.webpack-dev-server

3.webpack-dev-middleware

大多情形下，你可能想要使用 `webpack-dev-server`, 但是让我们都探索下。

### Using Watch Mode

你可以指令 webpack 监测你的依赖图表中所有文件的变化。如果其中一个文件更新了，代码将会被重新编译，所以你不必手动运行编译命令。

让我们添加一个 npm 脚本来启动 webpack 的 watch 模式:

现在你可以运行 `npm run watch`，webpack 会编译你的代码，但是不从命令行退出。这是因为脚本仍在监测你的文件。

唯一不好的是你不得不重新刷新页面查看变化。如果这也能自动那多好啊，所以试下 `webpack-dev-server`, 他将做这些工作。

## 使用 webpack-dev-server

webpack-dev-server 提供一个简单的服务器和时时刷新的能力。让我们设置下

```terminal
npm install --save-dev webpack-dev-server
```

更改一下文件告诉 dev server 去哪里查找文件：

```js webpack.config.js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
      entry: {
          app: './src/index.js',
          print: './src/print.js'
      },
      devtool: 'inline-source-map',
      +devServer: {+contentBase: './dist' +
      },
      plugins: [
          new CleanWebpackPlugin(['dist']),
          new HtmlWebpackPlugin({
              title: 'Development'
          })
      ],
      output: {
          filename: '[name].bundle.js',
          path: path.resolve(__dirname, 'dist')
      }
  };
```

这告诉 `webpack-dev-server` 在 `locahost:8080` 服务 `dist` 目录中的文件。

让我也添加一个运行 dev server 的脚本：

```json package.json
{
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "webpack --progress --watch",
        +"start": "webpack-dev-server --open"
        "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "css-loader": "^0.28.4",
        "csv-loader": "^2.1.1",
        "file-loader": "^0.11.2",
        "html-webpack-plugin": "^2.29.0",
        "style-loader": "^0.18.2",
        "webpack": "^3.0.0",
        "xml-loader": "^1.2.1"
    }
}
```

现在运行在命令行运行  `npm start`，你将会看到我们的浏器自动加载页面，如果你改变的源代码并保存他们，web server 将在代码编译后自动重载。试一试！

`webpack-dev-server` 有很多可配置的选项。更多参考下[文档](https://webpack.js.org/configuration/dev-server).

现在你的服务器已经工作了，你可能想试下 [Hot Module Replacement](https://webpack.js.org/guides/hot-module-replacement).

### 使用 webpack-dev-middleware

对 `webpack-dev-middleware`? 我们需要你的帮助！请提交一份 PR 和例子来填补这缺失的说明。请确保简单些，因此这篇指南是为初学者准备的。

## 调整你的编辑器

当自动编译代码时，保存文件时你可能遇到问题。一些编辑器有 "safe write" 模式可能潜在地干扰编译。

要禁用一些常见的编辑器中的这样的特色，见下：

`Sublime Text 3`： 给用户偏好添回 `atomic_save: "false"`
`IntelliJ`: 在偏好中搜索 "safe write" 并禁用他。
`Vim` 往设置添加 `:set backupcopy=yes`。
`WebStorm` 在 `Preferences > Appearence & Behavior > System Settings` 中去掉 `safe write` 选择框的钩子。

## 总结

既然你已学会自动编译代码和运行一个简单的开发服务器，你可以看下一篇指南，我们会讲 [Hot Module Replacement](https://webpack.js.org/guides/hot-module-replacement).