# Output Management

目前我们手动地在 `index.html` 上文件中引入我人们的 asserts, 但是是随着我们的应用程序成长且一旦你[在文件名中用哈希](https://webpack.js.org/guides/caching)并且有 [mutiple bundles](https://webpack.js.org/guides/code-splitting) 手动管理 `index.html` 将很困难。不过，你不担心，有几个插件可以使这个过程管理起来更简单。

## 设置 HtmlWebpackPlugin

如果我们改变了入口点名称或添加了一个新的，那会生成新的 bundle, 但我们的 `index.html` 文件中仍引用着老的 bundle. 让我们用 [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin) 来解决这个问题。

在我们 build 之前，你应该知道 `HtmlWebpackPlugin` 默认会生成自己的 `index.html` 文件，即使 `dist/` 目录中已经有一个了。这意味着他将用最新生成的替代我们的 `index.html`。让我们 `npm run build` 看看会发生什么:

如果你在编辑器中打开 `index.html`，你将会看到 `HtmlWebpackPlugin` 已经创建了一个全新的文件并且自动加上了所有的 bundles.

如果你了解 `HtmlWebpackPlugin` 提供的所有特色和选项，那你可以参考下 [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin).

你也可以看下 [html-webpack-templte](https://github.com/jaketrent/html-webpack-template) 看年除了默认的模板外还有什么额外的特色。

## 清理 `/dist` 文件夹

你可能已经注意到了从之前的指南和 代码示例，我们的 `/dist` folder 已经变得乱七八槽了。Webpack 生成文件并将他们放在 `dist` 目录下，但他不追踪哪个文件在我们项目中真的用到。

通常每次 build 都清理下 `/dist` 文件夹是个很好的实践，因此只有用到的文件才会生成。让我们负起责任来。

一个很流行的管理这个的插件是 [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin), 让我们安装并配置他。